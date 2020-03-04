import GameModel from "./base";

export default class extends GameModel {
  game = null;

  spawned = false;

  constructor(game) {
    super();

    this.game = game;
  }
}
