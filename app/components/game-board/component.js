import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, set } from "@ember/object";

import Game from "../../models/local/game";

export default class extends Component {
  @tracked
  boardShape = "random";

  @tracked
  boardSize = "small";

  constructor() {
    super(...arguments);
  }

  get game() {
    return new Game(this.boardShape, this.boardSize);
  }

  @action
  changeSize(event) {
    set(this, "boardSize", event.target.value);
  }

  @action
  changeShape(event) {
    set(this, "boardShape", event.target.value);
  }
}
