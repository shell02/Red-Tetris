const fs = require('fs');
const http = require('http');
const path = require('path');
const { Server: SocketIO } = require('socket.io');
const debug = require('debug');
const Socket = require('./utils/Sockets');

// Debugging setup
const logerror = debug('tetris:error');
const loginfo = debug('tetris:info');

// Function to initialize the HTTP server
const initApp = (app, params, cb) => {
  const { host, port } = params;

  // Function to handle HTTP requests
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '../dist/bundle.js' : '../dist/index.html';

    fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) {
        logerror(err);
        res.writeHead(500);
        return res.end('Error loading the file');
      }
      res.writeHead(200);
      return res.end(data);
    });
  };

  // Handle HTTP requests with our handler function
  app.on('request', handler);

  // Start listening on the specified port and host
  app.listen({ host, port }, () => {
    loginfo(`Tetris server listening on ${params.url}`);
    cb();
  });
};

// Function to create the server (returns a Promise)
function create(params) {
  return new Promise((resolve) => {
    const app = http.createServer(); // HTTP server creation
    initApp(app, params, () => {
      const io = new SocketIO(app); // Attach Socket.IO to the server

      // Stop function to close server and sockets
      const stop = (cb) => {
        io.close();
        app.close(() => {
          app.unref();
          loginfo('Engine stopped.');
          cb();
        });
      };

      const socket = new Socket(io);
      socket.setLoginfo(loginfo);
      socket.setLogerror(logerror);
      socket.listen();

      resolve({ stop });
    });
  });
}

module.exports = { create };
