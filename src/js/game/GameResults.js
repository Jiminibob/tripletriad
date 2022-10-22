import { GameCard } from "./GameCard";

export class GameResults extends Phaser.GameObjects.Layer {
  constructor(scene, { winner, playerOneDeck, playerTwoDeck, flippedCards }) {
    super(scene);

    scene.add.existing(this);
    const bg = scene.add.image(0, 0, "background").setOrigin(0);
    this.add(bg);

    const messaging = winner ? (winner === 1 ? "YOU WIN!" : "YOU LOSE!") : "DRAW";
    const title = scene.add.text(scene.game.width * 0.5, scene.game.height * 0.5, messaging, {
      font: "72px Arial Black",
      color: "#000000",
      align: "center"
    });
    title.setOrigin(0.5);
    this.add(title);

    this.cards = [];
    const contentOffset = scene.game.width * 0.5 - 400;
    for (let i = 0; i < 5; i++) {
      let panel = scene.add.image(contentOffset + 160 * i + 80, 656, "graphics", "cardslot");
      panel.setOrigin(0.5, 1);
      panel.setScale(150 / panel.width);

      let card = new GameCard(this.scene, panel.x, panel.y - 100, this.scene.game.cards.getCard(playerOneDeck[i]));
      card.setPlayer(1);
      card.setScale(140 / card.width);
      this.add([panel, card]);
      this.cards.push(card);

      panel = scene.add.image(contentOffset + 160 * i + 80, 306, "graphics", "cardslot");
      panel.setOrigin(0.5, 1);
      panel.setScale(150 / panel.width);
      card = new GameCard(this.scene, panel.x, panel.y - 100, this.scene.game.cards.getCard(playerTwoDeck[i]));
      card.setPlayer(2);
      card.setScale(140 / card.width);
      this.add([panel, card]);
      this.cards.push(card);
    }

    if (winner) {
      scene.time.delayedCall(
        2500,
        () => {
          this.flipCards(
            this.cards.filter(c => c.player != winner),
            [...flippedCards]
          );
        },
        null,
        this
      );
    } else this.scene.time.delayedCall(4000, this.endResults, null, this);
  }

  flipCards(deck, flipped) {
    deck.forEach((card, i) => {
      if (flipped.includes(card.id)) {
        flipped.splice(flipped.indexOf(card.id), 1);
        this._flipAndRemoveCard(card, 500 + 200 * i);
      }
    });
    this.scene.time.delayedCall(4000, this.endResults, null, this);
  }

  _flipAndRemoveCard(card, delay) {
    card.flipCard();
    this.bringToTop(card);
    const timeline = this.scene.tweens.createTimeline();
    timeline.add({
      targets: card,
      scale: "+=0.2",
      duration: 150,
      delay: delay
    });
    timeline.add({
      targets: card,
      y: card.player === 1 ? 1000 : -300,
      duration: 500
    });
    timeline.play();
  }

  endResults() {
    this.emit("complete");
  }
}
