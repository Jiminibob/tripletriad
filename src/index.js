import * as Phaser from "phaser";
import { Game } from "./js/Game";

const config = {
  name: "app",
  type: Phaser.AUTO,
  width: 1366,
  height: 768,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH
  }
};

window.game = new Game(config);
