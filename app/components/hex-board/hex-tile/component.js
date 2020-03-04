import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { htmlSafe } from "@ember/template";

const TILE_POSITION = {
  forest: 33,
  "resource-primary": 69,
  "resource-secondary": 3
};

export default class extends Component {
  @tracked
  _style = "";

  get style() {
    let sheet = this.args.sheet;
    let type = this.args.hex.type;

    if (!sheet) {
      return "";
    }

    if (type === "empty" || type === "lake") {
      return "";
    }

    this._style = htmlSafe(
      sheet.getTileDomElement(TILE_POSITION[type]).getAttribute("style")
    );
    return this._style;
  }
}
