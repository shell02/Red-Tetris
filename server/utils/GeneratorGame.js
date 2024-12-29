const BaseGame = require('./BaseGame');
const Piece = require('./Piece');

class GeneratorGame extends BaseGame {
  constructor(id) {
    super(id);
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  hasPlayer(player) {
    return this.players.includes(player);
  }

  generateNewPiece() {
    const piece = new Piece();
    this.pieces.push(piece);
    return piece;
  }
}

module.exports = GeneratorGame;
