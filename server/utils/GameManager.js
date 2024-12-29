// eslint-disable-next-line import/no-extraneous-dependencies
const uuid = require('uuid');
const GeneratorGame = require('./GeneratorGame');

class GameManager {
  constructor() {
    this.genGames = [];
  }

  createGame(player) {
    const gameId = uuid.v4();

    const genGame = new GeneratorGame(gameId);
    genGame.addPlayer(player);
    this.genGames.push(genGame);

    return genGame;
  }

  addPlayerToGame(gameId, player) {
    const genGame = this.getGenGameById(gameId);
    if (genGame) {
      genGame.addPlayer(player);
      return genGame;
    }
    return null;
  }

  removePlayerFromGame(gameId, player) {
    const genGame = this.getGenGameById(gameId);
    if (genGame) {
      genGame.removePlayer(player);
      if (genGame.players.length === 0) {
        this.genGames = this.genGames.filter((game) => game.id !== genGame.id);
        return null;
      }
      return genGame;
    }
    return null;
  }

  removePlayer(player) {
    this.genGames.forEach((game) => {
      if (game.hasPlayer(player)) {
        game.removePlayer(player);
      }
    });
    this.genGames = this.genGames.filter((game) => game.players.length > 0);
  }

  getOpenGames() {
    return this.genGames;
  }

  getGenGameById(gameId) {
    return this.genGames.find((game) => game.id === gameId);
  }

  getGenGameByPlayer(player) {
    return this.genGames.find((game) => game.hasPlayer(player));
  }
}

module.exports = GameManager;
