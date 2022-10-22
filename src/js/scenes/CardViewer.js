import { CardDisplay } from "../game/CardDisplay";
import { Pagination } from "../game/Pagination";
import { Button } from "../input/Button";
import { ButtonText } from "../input/ButtonText";

export default class CardViewer extends Phaser.Scene {
  constructor() {
    super({ key: "CardViewer" });
  }

  create() {
    this.add.image(this.game.width * 0.5, this.game.height * 0.5, "background");

    // grab and sort cards
    this._cards = this.game.cards.getCards().sort((a, b) => a.level - b.level);

    // manage pages
    this.pageContainer = this.add.container();
    this.pageCardLimit = 15;
    this.pageTotal = Math.ceil(this._cards.length / this.pageCardLimit);
    this.pageCurrent = 0;

    const btnBack = new Button(this, 150, 50, { costume: "btn_close", sheet: "graphics" });
    btnBack.depth = 2;
    btnBack.x = btnBack.width * 0.5 + 20;
    btnBack.y = btnBack.height * 0.5 + 20;
    btnBack.once("pointerdown", this.game.startWelcome, this.game);

    if (this.pageTotal > 1) {
      const btnNext = new Button(this, this.game.width * 0.5 + 250, 685, { costume: "btn_next", sheet: "graphics" });
      btnNext.on("pointerdown", this.showNextPage, this);
      const btnPrev = new Button(this, this.game.width * 0.5 - 250, 685, { costume: "btn_prev", sheet: "graphics" });
      btnPrev.on("pointerdown", this.showPrevPage, this);

      this.pagination = new Pagination(this, this.pageTotal);
      this.pagination.y = btnNext.y;
      this.pagination.x = this.game.width * 0.5 - this.pagination.width * 0.5;
    }

    this.renderPage(0);
  }

  showPrevPage() {
    this.renderPage(this.pageCurrent === 0 ? this.pageTotal - 1 : this.pageCurrent - 1);
  }

  showNextPage() {
    this.renderPage(this.pageCurrent + 1);
  }

  renderPage(page) {
    this.pageCurrent = page % this.pageTotal;

    this.pageContainer.removeAll(true);
    const startindex = this.pageCurrent * this.pageCardLimit;
    const ceillWidth = 150;
    const cellHeight = 190;
    const rowCount = 5;
    this.pageContainer.x = this.game.width * 0.5 - ceillWidth * rowCount * 0.5;
    this.pageContainer.y = 50;
    for (let i = 0; i < this.pageCardLimit; i++) {
      const x = (i % rowCount) * ceillWidth + ceillWidth * 0.5;
      const y = Math.floor(i / rowCount) * cellHeight + cellHeight * 0.5;
      const card = this._cards[startindex + i];
      if (!card) break;
      const haveCard = this.game.player.hasCard(card.id);
      const hasOwnedCard = haveCard || this.game.player.hasOwnedCard(card.id);
      const cardDisplay = new CardDisplay(this, x, y, card, { locked: !haveCard && !hasOwnedCard });
      cardDisplay.setScale(135 / cardDisplay.width);
      if (haveCard || hasOwnedCard) cardDisplay.showQuantity(this.game.player.getCardQty(card.id));
      if (!haveCard && hasOwnedCard) cardDisplay.ghost = true;
      this.pageContainer.add(cardDisplay);
    }

    if (this.pagination) this.pagination.setIndex(this.pageCurrent);
  }
}
