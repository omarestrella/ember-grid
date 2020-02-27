export function start() {}

function applyHeightMap(
  grid,
  setDefault = true,
  options = {
    lowLimit: 0,
    highLimit: 255,
    variability: 0.75
  }
) {
  let { lowLimit, highLimit, variability } = options;
  let size = grid.length - 1;
  let baseHeight = Math.floor((lowLimit + highLimit) / 2);
  let left = 0;
  let top = 0;

  // Set default values
  if (setDefault) {
    grid[0][0].height = baseHeight;
    grid[size][0].height = baseHeight;
    grid[0][size].height = baseHeight;
    grid[size][size].height = baseHeight;
  }

  applyHeightMapHelper(grid, left, top, size, size, baseHeight, variability);
}

export const CELL_TYPES = {
  PLAINS: "PLAINS",
  FOREST: "FOREST",
  WATER: "WATER",
  MOUNTAIN: "MOUNTAIN"
};

function randomCellType() {
  let types = Object.keys(CELL_TYPES);
  let rnd = Math.floor(Math.random() * Math.floor(types.length));
  return types[rnd];
}

function applyHeightMapHelper(
  grid,
  left,
  top,
  right,
  bottom,
  baseHeight,
  variability
) {
  let setValue = (x, y, value) => {
    grid[y][x].height === null ? (grid[y][x].height = value) : undefined;
  };

  let getHeight = (x, y) => grid[y][x].height;

  let centerX = Math.floor((left + right) / 2);
  let centerY = Math.floor((top + bottom) / 2);

  let centerPointValue = Math.floor(
    (grid[left][top].height +
      grid[left][top].height +
      grid[left][bottom].height +
      grid[right][bottom].height) /
      4 -
      Math.floor((Math.random() - 0.5) * baseHeight * 2)
  );

  setValue(centerX, centerY, centerPointValue);

  // Set N/S/E/W based on NE/SE/...
  setValue(
    centerX,
    top,
    Math.floor(
      (getHeight(left, top) + getHeight(right, top)) / 2 +
        (Math.random() - 0.5) * baseHeight
    )
  );
  setValue(
    centerX,
    bottom,
    Math.floor(
      (getHeight(left, bottom) + getHeight(right, bottom)) / 2 +
        (Math.random() - 0.5) * baseHeight
    )
  );
  setValue(
    left,
    centerY,
    Math.floor(
      (getHeight(left, top) + getHeight(left, bottom)) / 2 +
        (Math.random() - 0.5) * baseHeight
    )
  );
  setValue(
    right,
    centerY,
    Math.floor(
      (getHeight(right, top) + getHeight(right, bottom)) / 2 +
        (Math.random() - 0.5) * baseHeight
    )
  );

  if (right - left > 2) {
    baseHeight = Math.floor(baseHeight * Math.pow(2.0, -1 * variability));
    applyHeightMapHelper(
      grid,
      left,
      top,
      centerX,
      centerY,
      baseHeight,
      variability
    );
    applyHeightMapHelper(
      grid,
      centerX,
      top,
      right,
      centerY,
      baseHeight,
      variability
    );
    applyHeightMapHelper(
      grid,
      left,
      centerY,
      centerX,
      bottom,
      baseHeight,
      variability
    );
    applyHeightMapHelper(
      grid,
      centerX,
      centerY,
      right,
      bottom,
      baseHeight,
      variability
    );
  }
}

export function generateGrid(size) {
  let grid = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      row.push({
        x: i,
        y: j,
        type: randomCellType(),
        height: null
      });
    }
    grid.push(row);
  }

  applyHeightMap(grid);
  applyHeightMap(grid, false);
  applyHeightMap(grid, false);
  applyHeightMap(grid, false);

  return grid;
}
