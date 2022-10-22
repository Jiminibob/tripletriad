import { CardStarterPackCreator } from "../game/CardStarterPack";
import { Button } from "../input/Button";
import { ButtonText } from "../input/ButtonText";

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: "WelcomeScene" });
  }

  create() {
    this.add.image(this.game.width * 0.5, this.game.height * 0.5, "background");
    this.add.image(this.game.width * 0.5, this.game.height * 0.5, "graphics", "title");

    const btnPlayGame = new Button(this, this.game.width * 0.5, this.game.height * 0.65, { sheet: "graphics", costume: "btn_play" });
    btnPlayGame.once("pointerdown", this.playGame, this);
    const btnViewCards = new Button(this, this.game.width * 0.5, this.game.height * 0.75, { sheet: "graphics", costume: "btn_cards" });
    btnViewCards.once("pointerdown", this.game.startCardViewer, this.game);
  }

  playGame() {
    if (this.game.player.firstGame() || this.game.player.getCardCount() < 5) {
      const starterPack = new CardStarterPackCreator(this);
      starterPack.once("complete", this.game.startCardGame, this.game);
    } else {
      this.game.startCardGame();
    }
  }
}
