const PlayerStatus = {
  SPECTATING: 'spectating',
  PLAYING: 'playing',
};

class Player {
  constructor(username, socketId) {
    this.username = username;
    this.socketId = socketId;
    this.grid = [];
    this.status = PlayerStatus.SPECTATING;
    this.gameId = null;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }
}

module.exports = Player;
