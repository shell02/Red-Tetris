const http = require('http');
const { ServerManager } = require('./utils/ServerManager');

const params = {
  host: 'localhost',
  port: 3031,
  url: 'http://localhost:3031',
};

const app = http.createServer();

new ServerManager(params).start(app);
