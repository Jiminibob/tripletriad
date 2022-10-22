import { Button } from "../input/Button";
import { ButtonText } from "../input/ButtonText";
import { CardDisplay } from "./CardDisplay";

export class CardStarterPackCreator extends Phaser.GameObjects.Layer {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);
    const label = scene.game.player.firstGame()
      ? "This appears to be your first time playing\n\nA Starterpack has been randomly generated to get you playing."
      : "You currenty do not have enough cards to play. \n The cards below have been added to your collection to keep you going.";
    this.add([
      scene.add.image(0, 0, "background").setOrigin(0),
      scene.add
        .text(scene.game.width * 0.5, 50, label, {
          font: "32px Arial black",
          align: "center",
          color: "#000000",
          wordWrap: { width: scene.game.width * 0.75 }
        })
        .setOrigin(0.5, 0),
      scene.add
        .text(scene.game.width * 0.5, 500, "You can earn more cards for your collection by claiming flipped cards when winning games", {
          font: "32px Arial black",
          align: "center",
          color: "#000000",
          wordWrap: { width: scene.game.width * 0.75 }
        })
        .setOrigin(0.5, 0)
    ]);

    const options = scene.game.cards.getCardsBetweenLevels(1, 3);
    const cardCount = 5 - scene.game.player.getCardCount();
    this.startDeck = [];
    const offset = scene.game.width * 0.5 - cardCount * 180 * 0.5;
    for (let i = 0; i < cardCount; i++) {
      const panel = scene.add.image(offset + 180 * (i % 5) + 90, scene.game.height * 0.59, "graphics", "cardslot").setOrigin(0.5, 1);
      const option = options[Math.floor(Math.random() * options.length)];
      this.startDeck.push(option.id);
      const card = new CardDisplay(scene, offset + 180 * (i % 5) + 90, 1000, option);
      card.setScale(0.8);
      this.add([panel, card]);
      scene.tweens.add({
        targets: card,
        y: scene.game.height * 0.45,
        duration: 150,
        delay: 50 * i
      });
    }

    const btnContinue = new Button(scene, scene.game.width * 0.5, scene.game.height - 75, { sheet: "graphics", costume: "btn_continue" });
    btnContinue.once("pointerdown", this.handleContinue, this);
    this.add(btnContinue);
  }

  handleContinue() {
    this.scene.game.player.addCards(this.startDeck);
    this.emit("complete", [...this.startDeck]);
  }
}
