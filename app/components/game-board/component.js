import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, set } from "@ember/object";

import Game from "../../models/local/game";

export default class extends Component {
  boardShape = "random";
  boardSize = "small";

  @tracked
  _game = null;

  constructor() {
    super(...arguments);
  }

  get game() {
    if (!this._game) {
      return new Game(this.boardShape, this.boardSize);
    }
    return this._game;
  }

  set game(value) {
    this._game = value;
    return this._game;
  }

  @action
  changeSize(event) {
    set(this, "boardSize", event.target.value);
    this.newGame();
  }

  @action
  changeShape(event) {
    set(this, "boardShape", event.target.value);
    this.newGame();
  }

  @action
  newGame() {
    this.game = new Game(this.boardShape, this.boardSize);
  }
}
