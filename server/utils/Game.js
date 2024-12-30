const Piece = require('./Piece');

const StatusEnum = {
  WAITING: 'waiting',
  STARTED: 'started',
  FINISHED: 'finished',
};

class Game {
  constructor(id, leader) {
    this.id = id;
    this.pieces = [];
    this.status = StatusEnum.WAITING;
    this.players = [];
    this.leader = leader;
  }

  randLeader() {
    if (this.players.length === 0) {
      this.leader = null;
      return;
    }
    const index = Math.floor(Math.random() * this.players.length);
    this.leader = this.players[index];
  }

  addPlayer(player) {
    this.players.push(player);
    player.setGameId(this.id);
  }

  removePlayer(player) {
    this.players = this.players.filter((p) => p.username !== player.username);
    if (this.leader.username === player.username) {
      this.randLeader();
    }
    player.setGameId(null);
  }

  hasPlayer(player) {
    return this.players.includes(player);
  }

  getPlayers() {
    return this.players.map((player) => ({
      username: player.username,
      grid: player.grid,
    }));
  }

  generateNewPiece() {
    const piece = new Piece();
    this.pieces.push(piece);
    return piece;
  }
}

module.exports = Game;
