import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Tilesheet } from "tilesheets";

export default class extends Component {
  @tracked
  sheet = null;

  constructor() {
    super(...arguments);

    let sheet = new Tilesheet("tilesheet.png");
    sheet.setTileSize(16).setMargin(1);
    sheet.waitForLoading().then(() => (this.sheet = sheet));
  }

  get grid() {
    return this.args.game.board.grid;
  }
}
