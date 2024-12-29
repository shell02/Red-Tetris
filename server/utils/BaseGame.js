// const Piece = require('./Piece');
// const Player = require('./Player');

const StatusEnum = {
  WAITING: 'waiting',
  STARTED: 'started',
  FINISHED: 'finished',
};

class BaseGame {
  constructor(id) {
    this.pieces = [];
    this.id = id;
    this.status = StatusEnum.WAITING;
  }
}

module.exports = BaseGame;
