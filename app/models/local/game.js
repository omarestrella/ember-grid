import GameModel from "./base";
import BoardGenerator from "../../map/board-generator";

const sizes = {
  square: {
    small: 10,
    medium: 20,
    large: 40
  },
  hexagon: {
    small: 11,
    medium: 23,
    large: 47
  },
  random: {
    small: 11,
    medium: 22,
    large: 44
  }
};

export default class extends GameModel {
  /* Public Properties API */
  id = null;
  board = null;
  players = null;
  activeHex = null;

  drawDeck = null;

  constructor(boardShape = "square", boardSize = "small") {
    super();

    this.id = "1";

    const width = sizes[boardShape][boardSize] || 10;

    this.players = [];
    this.drawDeck = [];
    this.board = BoardGenerator.generate(width, boardShape);
  }

  get phase() {
    return {
      gamePhase: "gameStart",
      activePlayer: null,
      activePlayerIndex: null,
      turn: 0
    };
  }

  cardMarketCards = [];

  /* Public Function API */
  clickHex(hex) {
    const active = this.get("activeHex");
    if (active !== hex) {
      this.deactivateHex(active);
      this.activateHex(hex);
      this.activeHex = hex;
    } else {
      this.deactivateHex(hex);
      this.activeHex = null;
    }
  }

  activateHex(hex) {
    if (hex) {
      hex.state = "active";
      hex.coord.adjacentCoords().forEach(coord => {
        const adjacentHex = this.board.lookupHex(coord);
        if (adjacentHex) {
          adjacentHex.state = "secondary";
        }
      });
    }
  }

  deactivateHex(hex) {
    if (hex) {
      hex.state = null;
      hex.coord.adjacentCoords().forEach(coord => {
        const adjacentHex = this.board.lookupHex(coord);
        if (adjacentHex) {
          adjacentHex.state = "null";
        }
      });
    }
  }

  lookupHex(coord) {
    return this.board.lookupHex(coord);
  }
}
