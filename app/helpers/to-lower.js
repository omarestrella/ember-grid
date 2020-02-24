import { helper } from "@ember/component/helper";

function toLower([string]) {
  return (string || "").toLowerCase();
}

export default helper(toLower);
