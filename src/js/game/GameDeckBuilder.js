import { Button } from "../input/Button";
import { ButtonText } from "../input/ButtonText";
import { CardDisplay } from "./CardDisplay";
import { Pagination } from "./Pagination";

export class GameDeckBuilder extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    const bg = scene.add.image(0, 0, "background").setOrigin(0);
    this.add(bg);
    const title = scene.add
      .text(scene.game.width * 0.5, 20, "SELECT CARDS", {
        font: "48px Arial Black",
        color: "#000000",
        align: "center"
      })
      .setOrigin(0.5, 0);
    this.add(title);

    this.playerCards = scene.game.player
      .getCards()
      .map(card => scene.game.cards.getCard(card.id))
      .sort((a, b) => a.level - b.level);
    this.playerCardContainer = scene.add.container();

    this.contentOffset = scene.game.width * 0.5 - 400;
    this.pageTotal = Math.ceil(this.playerCards.length / 10);
    this.pageCurrent = 0;

    this.cardSlots = [];
    for (let i = 0; i < 5; i++) {
      const panel = scene.add.image(this.contentOffset + 160 * i + 80, 687, "graphics", "cardslot");
      panel.setOrigin(0.5, 1);
      panel.setScale(150 / panel.width);
      this.add(panel);
      const icon = scene.add.image(panel.x + panel.width * 0.39, panel.y - 180, "graphics", "btn_delete").setOrigin(1, 0);
      icon.depth = 2;
      icon.visible = false;
      this.add(icon);
      this.cardSlots.push({ panel, card: false, icon });
    }
    this.btnPlay = new Button(scene, scene.game.width * 0.5, 730, { costume: "btn_play", sheet: "graphics" });
    this.btnPlay.on("pointerdown", this.selectDeck, this);
    this.add([this.playerCardContainer, this.btnPlay]);
    if (this.pageTotal > 1) {
      const btnNext = new Button(scene, scene.game.width * 0.5 + 250, 455, { costume: "btn_next", sheet: "graphics" });
      btnNext.on("pointerdown", this.showNextPage, this);
      const btnPrev = new Button(scene, scene.game.width * 0.5 - 250, 455, { costume: "btn_prev", sheet: "graphics" });
      btnPrev.on("pointerdown", this.showPrevPage, this);

      this.pagination = new Pagination(scene, this.pageTotal);
      this.pagination.y = btnNext.y;
      this.pagination.x = scene.game.width * 0.5 - this.pagination.width * 0.5;
      this.add(this.pagination);

      this.add([btnPrev, btnNext]);
    }

    const playerDeck = scene.game.player.getDeck();
    playerDeck.forEach(card => {
      this.addCardToDeck({ id: card });
    });

    this.checkDeckStatus();
    this.renderPage(0);
  }

  showPrevPage() {
    this.renderPage(this.pageCurrent === 0 ? this.pageTotal - 1 : this.pageCurrent - 1);
  }

  showNextPage() {
    this.renderPage(this.pageCurrent + 1);
  }

  renderPage(page) {
    this.playerCardContainer.removeAll(true);
    this.pageCurrent = page % this.pageTotal;
    const startIndex = this.pageCurrent * 10;
    for (let i = 0; i < 10; i++) {
      if (!this.playerCards[startIndex + i]) break;
      const config = this.playerCards[startIndex + i];
      const x = 330 + (i % 5) * 140 + 70;
      const y = 70 + 160 * Math.floor(i / 5) + 100;
      const card = new CardDisplay(this.scene, x, y, config);
      card.setScale(0.6);
      card.on("pointerdown", () => this.addCardToDeck(card), this);
      this.playerCardContainer.add(card);
      this.updateCardQuantity(config.id);
    }

    if (this.pagination) this.pagination.setIndex(this.pageCurrent);
  }

  addCardToDeck(card) {
    const slot = this.cardSlots.find(s => !s.card);
    const config = this.scene.game.cards.getCard(card.id);
    if (slot) {
      slot.card = new CardDisplay(this.scene, slot.panel.x, slot.panel.y - 100, config);
      slot.card.setInteractive({ useHandCursor: true });
      slot.card.setScale(140 / slot.card.width);
      slot.card.on("pointerdown", () => this.removeCardFromDeck(slot), this);
      slot.icon.visible = true;
      this.add(slot.card);
      this.bringToTop(slot.icon);

      this.scene.tweens.add({
        targets: card,
        scale: { from: 0.6, to: 0.5 },
        yoyo: true,
        duration: 150
      });
      this.scene.tweens.add({
        targets: slot.card,
        scale: "+=0.1",
        yoyo: true,
        duration: 150
      });
      this.updateCardQuantity(card.id);
      this.checkDeckStatus();
    }
  }

  removeCardFromDeck(slot) {
    if (slot.card) {
      const slotcard = slot.card;
      slot.card = null;
      this.scene.tweens.add({
        targets: slotcard,
        scale: "-=0.1",
        duration: 150,
        onComplete: () => slotcard.destroy()
      });
      const card = this.playerCardContainer.getFirst("id", slotcard.id);
      this.scene.tweens.add({
        targets: card,
        scale: { from: 0.6, to: 0.5 },
        yoyo: true,
        duration: 150
      });
      slot.icon.visible = false;
      this.checkDeckStatus();
      this.updateCardQuantity(slotcard.id);
    }
  }

  updateCardQuantity(cardid) {
    const card = this.playerCardContainer.getFirst("id", cardid);
    if (!card) return;
    const playerCount = this.scene.game.player.getCardQty(cardid);
    const selectedCount = this.cardSlots.filter(s => s.card?.id === cardid).length;
    const count = playerCount - selectedCount;
    card.showQuantity(count);
    if (count === 0) {
      card.alpha = 0.5;
      card.disable();
    } else if (!card.input) {
      card.alpha = 1;
      card.setInteractive({ useHandCursor: true });
    }
  }

  checkDeckStatus() {
    this.btnPlay.visible = this.cardSlots.find(s => !s.card) ? false : true;
  }

  selectDeck() {
    this.emit(
      "cards_selected",
      this.cardSlots.map(s => s.card.id)
    );
  }
}
