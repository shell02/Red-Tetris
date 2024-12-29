const Player = require('./Player');
const GameManager = require('./GameManager');

class Socket {
  constructor(io) {
    this.io = io;
    this.players = [];
    this.gameManager = new GameManager();
  }

  setLogInfo(logInfo) {
    this.logInfo = logInfo;
  }

  setLogError(logError) {
    this.logError = logError;
  }

  listen() {
    this.io.on('connection', (socket) => {
      this.logInfo(`Socket connected: ${socket.id}`);
      socket.on('action', (action) => {
        if (action.type === 'server/ping') {
          socket.emit('action', { type: 'pong' });
        }
      });

      socket.on('join', (payload) => {
        if (payload.username) {
          if (this.checkUsername(payload.username)) {
            socket.emit('backHome');
          } else {
            this.createNewPlayer(payload.username, socket.id);
          }
        }
      });

      socket.on('createNewPlayer', (payload) => {
        if (this.checkUsername(payload.username)) {
          const existingPlayer = this.getOnePlayerByUsername(payload.username);
          if (existingPlayer.socketId === socket.id) {
            socket.emit('playerCreation', { available: true });
          } else {
            this.logError(`Username ${payload.username} already exists`);
            socket.emit('playerCreation', { available: false });
          }
        } else {
          this.createNewPlayer(payload.username, socket.id);
          socket.emit('playerCreation', { available: true });
        }
      });

      socket.on('newGame', () => {
        this.logInfo('New game');
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const game = this.gameManager.createGame(player);
          if (game) {
            this.logInfo(`Game created: ${game.id}`);
            socket.join(game.id);
            socket.emit('gameCreated', { gameId: game.id });
          }
        }
      });

      socket.on('getOpenGames', () => {
        const openGames = this.gameManager.getOpenGames();
        socket.emit('openGames', { openGames });
      });

      socket.on('joinGame', (payload) => {
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const game = this.gameManager.addPlayerToGame(payload.gameId, player);
          if (game) {
            socket.join(game.id);
            socket.to(game.id).emit('newPlayer', { playerUsername: player.username });
          }
        }
      });

      socket.on('leaveGame', (payload) => {
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const game = this.gameManager.removePlayerFromGame(payload.gameId, player);
          if (game) {
            socket.leave(game.id);
            socket.to(game.id).emit('playerLeft', { playerUsername: player.username });
          }
        }
      });

      socket.on('disconnect', () => {
        this.logInfo(`Socket disconnected: ${socket.id}`);
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          this.gameManager.removePlayer(player);
          this.removePlayerById(socket.id);
        }
      });
    });
  }

  checkUsername(username) {
    return this.players.find((player) => player.username === username);
  }

  createNewPlayer(username, socketId) {
    const player = new Player(username, socketId);
    this.players.push(player);
  }

  getOnePlayerById(socketId) {
    return this.players.find((player) => player.socketId === socketId);
  }

  getOnePlayerByUsername(username) {
    return this.players.find((player) => player.username === username);
  }

  removePlayerById(socketId) {
    this.players = this.players.filter((player) => player.socketId !== socketId);
  }

  removePlayerByUsername(username) {
    this.players = this.players.filter((player) => player.username !== username);
  }
}

module.exports = Socket;
