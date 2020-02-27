import GameModel from "./base";

export default class extends GameModel {
  grid = null;

  constructor({ grid }) {
    super();

    this.grid = grid;
  }

  lookupHex({ x, y, z }) {
    const col = x + (z + (z & 1)) / 2;
    const row = z;
    const grid = this.grid;

    if (grid && grid.hasOwnProperty(row)) {
      return grid[row][col];
    }

    return null;
  }
}
