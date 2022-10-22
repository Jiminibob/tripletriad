import { GameAi } from "../game/GameAi";
import { GameCard } from "../game/GameCard";
import { GameDeckBuilder } from "../game/GameDeckBuilder";
import { GameGrid } from "../game/GameGrid";
import { GameResults } from "../game/GameResults";
import { Button } from "../input/Button";

const BOARD_SETTINGS = {
  rows: 3,
  columns: 3,
  cellWidth: 158,
  cellHeight: 202
};

export default class GamePlay extends Phaser.Scene {
  constructor() {
    super({ key: "GamePlay" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    // create board
    this.add.image(this.game.width * 0.5, this.game.height * 0.5, "background");
    this.boardDisplay = this.add.image(this.game.width * 0.5, this.game.height * 0.5, "graphics", "board");
    this.title = this.add.image(this.game.width * 0.5, this.game.height * 0.5, "graphics", "title");
    for (let i = 0; i < 5; i++) {
      this.add.image(this.game.width * 0.5 - 380, this.game.height - 80 - 105 * i, "graphics", "cardslot").setOrigin(0.5, 1);
      this.add.image(this.game.width * 0.5 + 380, this.game.height - 80 - 105 * i, "graphics", "cardslot").setOrigin(0.5, 1);
    }
    this.turnIndicatorOne = this.add.image(this.game.width * 0.5 - 260, this.game.height * 0.5, "graphics", "board_turn");
    this.turnIndicatorTwo = this.add.image(this.game.width * 0.5 + 260, this.game.height * 0.5, "graphics", "board_turn");
    this.turnIndicatorTwo.scaleX = -1;

    this.gameGrid = new GameGrid(this, BOARD_SETTINGS);
    this.gameGrid.x = this.game.width * 0.5 - this.gameGrid.width * 0.5;
    this.gameGrid.y = this.game.height * 0.5 - this.gameGrid.height * 0.5;

    this.debug = this.add.graphics();

    // flag player turn and start intro sequence
    this.playerTurn = 1;
    this.playerOneScore = 0;
    this.playerTwoScore = 0;

    this.deckBuilder = new GameDeckBuilder(this);
    this.deckBuilder.once("cards_selected", this.handlePlayerDeckSelected, this);

    this.cameras.main.fadeIn(1000, 0, 0, 0, 0);

    const btnBack = new Button(this, 150, 50, { costume: "btn_close", sheet: "graphics" });
    btnBack.depth = 2;
    btnBack.x = btnBack.width * 0.5 + 20;
    btnBack.y = btnBack.height * 0.5 + 20;
    btnBack.once("pointerdown", this.game.startWelcome, this.game);
  }
  // =============================================================================================
  // PLAYER INPUT
  // =============================================================================================

  enableInput(value) {
    if (value && !this._inputEnabed) {
      this._inputEnabed = true;
      this.input.on("dragstart", this.handleDragCardStart, this);
      this.input.on("drag", this.handleDragCard, this);
      this.input.on("dragend", this.handleDragCardEnd, this);
      this.input.on("drop", this.handleDropCard, this);
    } else if (!value && this._inputEnabed) {
      this._inputEnabed = false;
      this.input.off("dragstart", this.handleDragCardStart, this);
      this.input.off("drag", this.handleDragCard, this);
      this.input.off("dragend", this.handleDragCardEnd, this);
      this.input.off("drop", this.handleDropCard, this);
    }
  }

  handleDragCardStart(pointer, card) {
    this.cardLayer.bringToTop(card);
    card.resetPos = { x: card.x, y: card.y };
  }

  handleDragCard(pointer, card, dragX, dragY) {
    card.x = dragX;
    card.y = dragY;
  }

  handleDragCardEnd(pointer, card, dropped) {
    if (!dropped) {
      card.x = card.resetPos.x;
      card.y = card.resetPos.y;
      this.cardLayer.sort("y");
    }
  }

  handleDropCard(pointer, card, dropzone) {
    if (this.gameGrid.addCardToGrid(card)) {
      this.enableInput(false);
      this.placeCard(card);
    } else this.handleDragCardEnd(pointer, card);
  }

  handlePlayerDeckSelected(playercards) {
    this.cameras.main.flash(1000, 0, 0, 0, 0);
    this.buildDecks(playercards);
  }

  // =============================================================================================
  // BUILD PLAYER DECKS
  // =============================================================================================

  buildDecks(playercards) {
    this.game.player.setDeck(playercards);
    this.deckBuilder.destroy();
    this.deckBuilder = null;
    // create cards
    this.cardLayer = this.add.container();
    this.cardsPlayerOne = this._createPlayerCards(
      1,
      playercards.map(card => this.game.cards.getCard(card)),
      this.game.canvas.width * 0.5 - 380,
      1200
    );

    const averagePlayerCard = Math.floor(playercards.reduce((i, cardid) => i + this.game.cards.getCardLevel(cardid), 0) / playercards.length);
    const aiDeck = GameAi.chooseCards(this.game.cards, averagePlayerCard, 5);
    this.cardsPlayerTwo = this._createPlayerCards(2, aiDeck, this.game.canvas.width * 0.5 + 380, 1200);
    this.cards = [...this.cardsPlayerOne, ...this.cardsPlayerTwo];
    const scoreStyle = { font: "70px Arial Black", color: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 8 };
    this.textScorePlayerOne = this.add.text(this.game.canvas.width * 0.5 - 380, 735, "0", scoreStyle).setOrigin(0.5, 1);
    this.textScorePlayerTwo = this.add.text(this.game.canvas.width * 0.5 + 380, 735, "0", scoreStyle).setOrigin(0.5, 1);

    this.updatePlayerScores();
    this.playIntro();
  }

  _createPlayerCards(player, deck, x, y) {
    return deck.map(card => {
      const gameCard = new GameCard(this, x, y, card);
      gameCard.setPlayer(player);
      gameCard.scale = 0.77;
      this.cardLayer.add([gameCard]);
      return gameCard;
    });
  }

  // =============================================================================================
  // GAME INTRO
  // =============================================================================================

  playIntro() {
    const playercards = this.cards.filter(c => c.player === 1);
    const aicards = this.cards.filter(c => c.player === 2);
    playercards.forEach((card, i) => {
      this.tweens.add({
        targets: [card, aicards[i]],
        y: 160 + 105 * i,
        duration: 250,
        delay: 150 * i
      });
    });

    const timer = this.time.addEvent({
      delay: 250,
      repeat: 10 + Math.ceil(Math.random() * 2),
      callback: (a, b, x) => {
        this.turnIndicatorOne.visible = timer.repeatCount % 2 == 0;
        this.turnIndicatorTwo.visible = timer.repeatCount % 2 == 1;
        if (timer.repeatCount === 0) {
          this.setPlayerTurn(this.turnIndicatorOne.visible ? 1 : 2);
        }
      }
    });
  }

  // =============================================================================================
  // PLAYER TURN MANAGEMENT
  // =============================================================================================

  togglePlayerTurn() {
    this.setPlayerTurn(this.playerTurn === 1 ? 2 : 1);
  }

  setPlayerTurn(player) {
    this.playerTurn = player;
    this.cards.forEach((card, i) => {
      if (card.player === player) {
        if (!card.placed) {
          card.bounce();
          if (player === 1) card.enable();
        }
      } else card.disable();
    });

    this.turnIndicatorOne.visible = player === 1;
    this.turnIndicatorTwo.visible = player === 2;
    this.enableInput(player === 1);
    if (player === 2) this.time.delayedCall(1000, () => this.playAiTurn(player), null, this);
  }

  playAiTurn(playerid) {
    const move = GameAi.chooseNextMove(
      this.cards.filter(c => c.player === playerid && !c.placed),
      this.gameGrid
    );
    if (move) {
      const { x, y } = this.gameGrid.gridToWorld(move.pos.x, move.pos.y, true);
      this.tweens.add({
        targets: move.card,
        x,
        y,
        duration: Phaser.Math.Distance.Between(move.card.x, move.card.y, x, y),
        delay: 500,
        onStart: () => this.cardLayer.bringToTop(move.card),
        onStartScope: this,
        onComplete: () => this.handleDropCard(null, move.card),
        onCompleteScope: this
      });
    }
  }

  placeCard(card) {
    card.placed = true;
    card.disable();
    card.bounce();
    this.updatePlayerScores();
    if (this.gameGrid.hasSpace()) this.time.delayedCall(1000, this.togglePlayerTurn, null, this);
    else this.time.delayedCall(1000, this.handleGameEnd, null, this);
  }

  // =============================================================================================
  // SCORE MANAGEMENT
  // =============================================================================================

  updatePlayerScores() {
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
    this.cards.forEach(card => {
      if (card.player === 1) this.playerOneScore++;
      else this.playerTwoScore++;
    });
    this.textScorePlayerOne.text = this.playerOneScore;
    this.textScorePlayerTwo.text = this.playerTwoScore;
  }

  // =============================================================================================
  // GAME END MANAGEMENT
  // =============================================================================================

  handleGameEnd() {
    this.cameras.main.flash(1000, 255, 255, 255, true);
    this.time.delayedCall(2500, this.displayResults, null, this);
  }

  displayResults() {
    // figure out who the winner is
    const winner = this.playerOneScore === this.playerTwoScore ? 0 : this.playerOneScore > this.playerTwoScore ? 1 : 2;
    // grab the loser cards, they're about to get upset
    const loserCards = winner ? (winner === 1 ? this.cardsPlayerTwo : this.cardsPlayerOne) : false;
    const flipCards = loserCards ? loserCards.filter(c => c.player === winner).map(c => c.id) : false;
    // add or lose cardsadd or remove cards from the player based on results
    if (winner && winner === 1) this.game.player.addCards(flipCards);
    else if (winner) this.game.player.removeCards(flipCards);

    // show game results
    new GameResults(this, {
      winner,
      playerOneDeck: this.cardsPlayerOne.map(c => c.id),
      playerTwoDeck: this.cardsPlayerTwo.map(c => c.id),
      loserCards: loserCards ? loserCards.map(c => c.id) : false,
      flippedCards: flipCards
    }).once("complete", this.closeGame, this);

    this.cameras.main.flash(1000, 0, 0, 0, true);
  }

  closeGame() {
    // fade out camera and return to welcome screen
    this.cameras.main.fadeOut(
      1000,
      0,
      0,
      0,
      (cam, progress) => {
        if (progress === 1) this.game.startWelcome();
      },
      this
    );
  }
}
