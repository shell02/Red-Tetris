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
            socket.emit('playerCreation', { available: false });
          }
        } else {
          const player = this.getOnePlayerById(socket.id);
          if (player) {
            this.removePlayerByUsername(player.username);
          }
          this.createNewPlayer(payload.username, socket.id);
          socket.emit('playerCreation', { available: true });
        }
      });

      socket.on('newGame', () => {
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const existingGame = this.gameManager.getGameByPlayer(player);
          if (existingGame) {
            const hasPlayersLeft = this.gameManager.removePlayerFromGame(existingGame.id, player);
            if (!hasPlayersLeft) {
              socket.broadcast.emit('openGames', { openGames: this.gameManager.getOpenGames() });
            }
            socket.to(existingGame.id).emit('gamePlayers', { players: existingGame.getPlayers() });
            socket.leave(existingGame.id);
          }
          const game = this.gameManager.createGame(player);
          if (game) {
            socket.emit('gameCreated', { gameId: game.id });
            socket.join(game.id);
          }
          socket.broadcast.emit('openGames', { openGames: this.gameManager.getOpenGames() });
        } else {
          socket.emit('backHome');
        }
      });

      socket.on('getOpenGames', () => {
        const openGames = this.gameManager.getOpenGames();
        socket.emit('openGames', { openGames });
      });

      socket.on('joinGame', (payload) => {
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const game = this.gameManager.addPlayerToGame(payload.selectedGameId, player);
          if (game) {
            socket.emit('gameJoined', { gameId: game.id });
            socket.join(game.id);
            socket.to(game.id).emit('gamePlayers', { players: game.getPlayers() });
          }
        } else {
          socket.emit('backHome');
        }
      });

      socket.on('getGamePlayers', (payload) => {
        const game = this.gameManager.getGameById(payload.gameId);
        if (game) {
          socket.emit('gamePlayers', { players: game.getPlayers() });
        }
      });

      socket.on('leaveGame', (payload) => {
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          const game = this.gameManager.removePlayerFromGame(payload.gameId, player);
          if (game) {
            socket.to(game.id).emit('gamePlayers', { players: game.getPlayers() });
          } else {
            socket.broadcast.emit('openGames', { openGames: this.gameManager.getOpenGames() });
          }
          socket.leave(player.gameId);
        } else {
          socket.emit('backHome');
        }
      });

      socket.on('disconnect', () => {
        this.logInfo(`Socket disconnected: ${socket.id}`);
        const player = this.getOnePlayerById(socket.id);
        if (player) {
          if (player.gameId) {
            const game = this.gameManager.removePlayerFromGame(player.gameId, player);
            if (game) {
              socket.to(game.id).emit('gamePlayers', { players: game.getPlayers() });
            } else {
              socket.broadcast.emit('openGames', { openGames: this.gameManager.getOpenGames() });
            }
            socket.leave(player.gameId);
          }
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
