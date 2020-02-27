import Component from "@glimmer/component";
import Game from "../../models/local/game";

export default class extends Component {
  game = null;

  constructor() {
    super(...arguments);

    this.game = new Game();
  }
}
