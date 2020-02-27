import Component from "@glimmer/component";

export default class extends Component {
  game = null;

  init() {
    super.init(...arguments);
  }

  get grid() {
    return this.args.game.board.grid;
  }
}
