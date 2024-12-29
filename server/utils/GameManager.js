const Game = require('./Game');

class GameManager {
  constructor() {
    this.gameIds = 0;
    this.games = [];
  }

  createGame(player) {
    this.gameIds += 1;
    const game = new Game(this.gameIds);
    game.addPlayer(player);
    this.games.push(game);
    return game;
  }

  addPlayerToGame(gameId, player) {
    const game = this.getGameById(gameId);
    if (game) {
      game.addPlayer(player);
      return game;
    }
    return null;
  }

  removePlayerFromGame(gameId, player) {
    const game = this.getGameById(gameId);
    if (game) {
      game.removePlayer(player);
      return game;
    }
    return null;
  }

  removePlayer(player) {
    this.games.forEach((game) => {
      if (game.hasPlayer(player)) {
        game.removePlayer(player);
      }
    });
  }

  getOpenGames() {
    return this.games;
  }

  getGameById(gameId) {
    return this.games.find((game) => game.id === gameId);
  }
}

module.exports = GameManager;
