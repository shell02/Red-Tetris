const Player = require('./Player');

class Socket {
  constructor(io) {
    this.io = io;
    this.players = [];
  }

  setLoginfo(loginfo) {
    this.loginfo = loginfo;
  }

  setLogerror(logerror) {
    this.logerror = logerror;
  }

  listen() {
    this.io.on('connection', (socket) => {
      this.loginfo(`Socket connected: ${socket.id}`);
      socket.on('action', (action) => {
        if (action.type === 'server/ping') {
          socket.emit('action', { type: 'pong' });
        }
      });

      socket.on('join', (payload) => {
        if (payload.username) {
          this.loginfo(`Socket join: ${payload.username}`);
          const updatedPlayer = this.players.find((player) => player.username === payload.username);
          if (updatedPlayer) {
            updatedPlayer.socketId = socket.id;
          }
        }
        this.loginfo(`Socket join: ${payload.username}`);
      });

      socket.on('createNewPlayer', (payload) => {
        this.loginfo(`Socket createNewPlayer: ${payload.username}`);
        const usernameExists = this.players.find((p) => p.username === payload.username);
        if (usernameExists && usernameExists.socketId === socket.id) {
          socket.emit('playerCreation', { available: true });
          return;
        }
        if (usernameExists) {
          this.logerror(`Username ${payload.username} already exists`);
          socket.emit('playerCreation', { available: false });
          return;
        }
        const player = this.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.username = payload.username;
        } else {
          const newPlayer = new Player(payload.username, socket.id);
          this.players.push(newPlayer);
        }
        socket.emit('playerCreation', { available: true });
      });

      socket.on('disconnect', () => {
        this.loginfo(`Socket disconnected: ${socket.id}`);
      });
    });
  }
}

module.exports = Socket;
