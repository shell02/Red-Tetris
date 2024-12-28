import Player from './Player';

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
          const updatedPlayer = this.players.find((player) => player.username === payload.username);
          if (updatedPlayer) {
            updatedPlayer.socketId = socket.id;
          } else {
            socket.emit('error', { message: 'Player not found' });
          }
        }
        this.loginfo(`Socket join: ${payload}`);
        socket.join(payload);
      });

      // useless, put it in createNewPlayer
      socket.on('checkUsername', (payload) => {
        const player = this.players.find((p) => p.username === payload.username);
        if (player) {
          socket.emit('usernameChecked', false);
        } else {
          socket.emit('usernameChecked', true);
        }
      });

      socket.on('createNewPlayer', (payload) => {
        const player = this.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.username = payload.username;
        } else {
          const newPlayer = new Player(payload.username, socket.id);
          this.players.push(newPlayer);
        }
        socket.emit('playerCreated', player);
      });

      socket.on('disconnect', () => {
        this.loginfo(`Socket disconnected: ${socket.id}`);
      });
    });
  }
}

export default Socket;
