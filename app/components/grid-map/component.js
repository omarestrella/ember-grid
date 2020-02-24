import Component from "@glimmer/component";

import { generateGrid } from "../../map/map";

export default class GridMap extends Component {
  grid = generateGrid(15);

  constructor() {
    super(...arguments);

    console.log("Grid", this.grid);
  }
}
