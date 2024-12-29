const StatusEnum = {
  WAITING: 'waiting',
  STARTED: 'started',
  FINISHED: 'finished',
};

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.status = StatusEnum.WAITING;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p !== player);
  }

  hasPlayer(player) {
    return this.players.includes(player);
  }
}

module.exports = Game;
