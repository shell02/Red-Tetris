const debug = require('debug');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const Socket = require('./Sockets');

class ServerManager {
  constructor(params) {
    this.host = params.host;
    this.port = params.port;
    this.url = params.url;

    this.logError = debug('tetris:error');
    this.logInfo = debug('tetris:info');

    this.io = null;
    this.sockets = null;
  }

  requestHandler(req, res) {
    const file = req.url === '/bundle.js' ? '../dist/bundle.js' : '../dist/index.html';

    fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) {
        this.logError(err);
        res.writeHead(500);
        return res.end('Error loading the file');
      }
      res.writeHead(200);
      return res.end(data);
    });
  }

  start(app) {
    return new Promise((resolve) => {
      app.on('request', (req, res) => this.requestHandler(req, res));

      app.listen({ host: this.host, port: this.port }, () => {
        this.logInfo(`Tetris server listening on ${this.url}`);
      });

      this.io = new Server(app, { cors: { origin: '*' } });
      this.sockets = new Socket(this.io);
      this.sockets.setLogInfo(this.logInfo);
      this.sockets.setLogError(this.logError);
      this.sockets.listen();

      resolve({
        stop: (cb) => {
          this.io.close();
          app.close(() => {
            app.unref();
            this.logInfo('Engine stopped.');
            cb();
          });
        },
      });
    });
  }
}

module.exports = { ServerManager };
