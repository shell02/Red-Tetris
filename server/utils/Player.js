const PlayerGame = require('./PlayerGame');

class Player {
  constructor(username, socketId) {
    this.username = username;
    this.socketId = socketId;
    this.game = null;
  }

  startGame() {
    this.game = new PlayerGame();
  }

  addPiece(piece) {
    this.game.addPiece(piece);
  }
}

module.exports = Player;
