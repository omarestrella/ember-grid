import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, set } from "@ember/object";

import { generateGrid } from "../../map/map";

export default class GridMap extends Component {
  @tracked
  size = 15;

  constructor() {
    super(...arguments);

    console.log("Grid", this.grid);
  }

  @action
  setSize(event) {
    let size = parseInt(event.target.value, 10);
    set(this, "size", size);
  }

  get grid() {
    return generateGrid(this.size);
  }
}
