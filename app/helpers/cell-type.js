import { helper } from "@ember/component/helper";
import { CELL_TYPES } from "../map/map";

function cellType([cell]) {
  let height = cell.height;
  if (height < 120) {
    return CELL_TYPES.WATER;
  }
  return CELL_TYPES.PLAINS;
}

export default helper(cellType);
