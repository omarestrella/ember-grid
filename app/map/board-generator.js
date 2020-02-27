// import GameModel from "../models/model-base";
import Board from "../models/local/board";
import CubeCoord from "../models/local/cube-coord";

const rand = {
  bool: (weight = 0.5) => {
    return Math.random() < weight;
  },
  range: (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

export default {
  generate(width, shape) {
    const board = new Board({
      grid: this.emptyGrid(width)
    });

    if (shape === "square") {
      this.fillSquareBoard(board);
    } else if (shape === "hexagon") {
      this.fillHexBoard(board);
    } else if (shape === "random") {
      this.fillRandomBoard(board);
    }

    return board;
  },

  emptyGrid(width) {
    const type = "empty";
    const grid = [];

    for (let h = 0; h < width; h++) {
      const row = [];

      for (let w = 0; w < width; w++) {
        row.push({ type });
      }

      grid.push(row);
    }

    this.setCubeCoords(grid);
    return grid;
  },

  setCubeCoords(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        grid[row][col].coord = CubeCoord.fromRowCol(row, col);
      }
    }
  },

  fillSquareBoard(board, type = "forest") {
    board.grid.forEach(row =>
      row.forEach(hex => {
        hex.type = type;
      })
    );
  },

  fillHexBoard(board, type = "forest") {
    const grid = board.grid;
    const width = Math.min(grid.length, grid[0].length);
    const size = (width + 1) / 2;
    const midPoint = Math.floor(width / 2);

    const middle = grid[midPoint][midPoint].coord;

    grid.forEach(row =>
      row.forEach(hex => {
        if (middle.distanceFrom(hex.coord) < size) {
          hex.type = type;
        }
      })
    );
  },

  fillRandomBoard(board) {
    this.randomizeHexes(board);
    this.eliminateIsolatedIslands(board);
    this.eliminateIsolatedEmptyZones(board);
    this.randomizeLake(board);
    this.addPrimaryResourceNodes(board);
    this.addSecondaryResourceNodes(board);
  },

  randomizeHexes(board) {
    const grid = board.grid;
    const width = Math.min(grid.length, grid[0].length);
    const midPoint = Math.floor(width / 2);
    const breakOverThreshold = midPoint * 0.5;

    const middle = grid[midPoint][midPoint].coord;
    const max = middle.distanceFrom(grid[0][0].coord);

    grid.forEach(row =>
      row.forEach(hex => {
        hex.type = "forest";

        const distance = middle.distanceFrom(hex.coord);

        if (distance > breakOverThreshold) {
          const breakOverWeight =
            (distance - breakOverThreshold) / (max - breakOverThreshold);

          if (Math.random() < breakOverWeight) {
            hex.type = "empty";
          }
        }
      })
    );
  },

  eliminateIsolatedIslands(board) {
    const grid = board.grid;
    const width = Math.min(grid.length, grid[0].length);
    const midPoint = Math.floor(width / 2);
    const middle = grid[midPoint][midPoint];
    const queue = [middle];
    middle.mainland = true;

    while (queue.length > 0) {
      const hex = queue.shift();

      hex.coord.adjacentCoords().forEach(coord => {
        const neighbor = board.lookupHex(coord);
        if (neighbor && neighbor.type !== "empty" && !neighbor.mainland) {
          neighbor.mainland = true;
          queue.push(neighbor);
        }
      });
    }

    grid.forEach(row =>
      row.forEach(hex => {
        if (!hex.mainland) {
          hex.type = "empty";
        }

        delete hex.mainland;
      })
    );
  },

  eliminateIsolatedEmptyZones(board) {
    const grid = board.grid;
    const queue = [];
    const hexChecker = hex => {
      if (hex && hex.type === "empty" && !hex.mainempty) {
        hex.mainempty = true;
        queue.push(hex);
      }
    };

    grid[0].forEach(hexChecker);
    grid[grid.length - 1].forEach(hexChecker);
    grid.forEach(row => {
      hexChecker(row[0]);
      hexChecker(row[0]);
    });

    while (queue.length > 0) {
      const hex = queue.shift();

      hex.coord.adjacentCoords().forEach(coord => {
        hexChecker(board.lookupHex(coord));
      });
    }

    grid.forEach(row =>
      row.forEach(hex => {
        if (!hex.mainempty && hex.type === "empty") {
          hex.type = "lake";
        }

        delete hex.mainempty;
      })
    );
  },

  randomizeLake(board) {
    const queue = [];
    const grid = board.grid;
    const stepDown = this.probabilityStepDown(grid);
    const lakeSeed = this.getRandomCentralHex(grid);

    lakeSeed.probability = 1;
    queue.push(lakeSeed);

    while (queue.length > 0) {
      const hex = queue.shift();

      if (rand.bool(hex.probability)) {
        hex.type = "lake";
        const propagationProbability = hex.probability - stepDown;

        if (propagationProbability > 0) {
          hex.coord.adjacentCoords().forEach(coord => {
            const adjacentHex = board.lookupHex(coord);

            if (
              adjacentHex &&
              adjacentHex.type !== "empty" &&
              !adjacentHex.probability
            ) {
              adjacentHex.probability = propagationProbability;
              queue.push(adjacentHex);
            }
          });
        }
      }
    }

    board.grid.forEach(row =>
      row.forEach(hex => {
        delete hex.probability;

        const neighbors = this.getNeighbors(hex, board);
        if (
          hex.type === "forest" &&
          this.countNeighbors(neighbors, "lake") === 6
        ) {
          hex.type = "lake";
        }
      })
    );
  },

  getRandomCentralHex(grid) {
    const size = Math.min(grid.length, grid[0].length);

    const midPoint = Math.floor(size / 2);
    const range = Math.floor(size / 6);

    const minRange = midPoint - range;
    const maxRange = midPoint + range;

    const xRand = rand.range(minRange, maxRange);
    const yRand = rand.range(minRange, maxRange);

    return grid[xRand][yRand];
  },

  probabilityStepDown(grid) {
    const size = Math.min(grid.length, grid[0].length);

    return size >= 40 ? 0.05 : size >= 20 ? 0.1 : 0.2;
  },

  addPrimaryResourceNodes(board) {
    board.grid.forEach(row =>
      row.forEach(hex => {
        const neighbors = this.getNeighbors(hex, board);

        if (
          hex.type === "forest" &&
          this.countNeighbors(neighbors, "forest") <= 1 &&
          this.countNeighbors(neighbors, "resource-primary") === 0
        ) {
          hex.type = "resource-primary";
        }
      })
    );
  },

  addSecondaryResourceNodes(board) {
    board.grid.forEach(row =>
      row.forEach(hex => {
        const neighbors = this.getNeighbors(hex, board);
        const forest = this.countNeighbors(neighbors, "forest");
        const primary = this.countNeighbors(neighbors, "resource-primary");
        const secondary = this.countNeighbors(neighbors, "resource-secondary");

        if (
          hex.type === "forest" &&
          primary === 0 &&
          secondary === 0 &&
          forest <= 2
        ) {
          hex.type = "resource-secondary";
        }
      })
    );
  },

  getNeighbors(hex, board) {
    return hex.coord.adjacentCoords().map(coord => board.lookupHex(coord));
  },

  countNeighbors(neighbors, type) {
    let count = 0;
    neighbors.forEach(hex => {
      if (hex && hex.type === type) {
        count++;
      }
    });
    return count;
  }
};
