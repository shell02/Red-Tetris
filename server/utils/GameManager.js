// eslint-disable-next-line import/no-extraneous-dependencies
const uuid = require('uuid');
const Game = require('./Game');

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame(player) {
    const gameId = uuid.v4();

    const game = new Game(gameId, player);
    game.addPlayer(player);
    this.games.push(game);

    return game;
  }

  addPlayerToGame(gameId, player) {
    const game = this.games.find((g) => g.id === gameId);
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
      if (game.players.length === 0) {
        this.games = this.games.filter((g) => g.id !== game.id);
        return null;
      }
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
    this.games = this.games.filter((game) => game.players.length > 0);
  }

  getOpenGames() {
    return this.games.map((game) => ({
      gameId: game.id,
      leader: game.leader.username,
    }));
  }

  getGameById(gameId) {
    return this.games.find((g) => g.id === gameId);
  }

  getGameByPlayer(player) {
    return this.games.find((game) => game.hasPlayer(player));
  }
}

module.exports = GameManager;
