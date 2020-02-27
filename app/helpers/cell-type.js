import { helper } from "@ember/component/helper";
import { CELL_TYPES } from "../map/map";

function cellType([cell]) {
  let height = cell.height;
  if (height < 100) {
    return CELL_TYPES.WATER;
  }
  if (height < 160) {
    return CELL_TYPES.PLAINS;
  }
  if (height < 200) {
    return CELL_TYPES.FOREST;
  }
  return CELL_TYPES.MOUNTAIN;
}

export default helper(cellType);
