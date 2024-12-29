const BaseGame = require('./BaseGame');

class PlayerGame extends BaseGame {
  constructor(id) {
    super(id);
    this.spectra = [];
    this.currentPieceNumber = 0;
  }
}

module.exports = PlayerGame;
