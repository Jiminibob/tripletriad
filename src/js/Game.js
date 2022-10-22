import { SceneManager } from "./managers/SceneManager";
import { Cards } from "./models/Cards";
import { Player } from "./models/Player";
import CardViewer from "./scenes/CardViewer";
import GamePlay from "./scenes/GamePlay";
import WelcomeScene from "./scenes/WelcomeScene";

export class Game extends Phaser.Game {
  constructor(config) {
    super({ ...config, scene: Boot });
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  handleGameReady() {
    this.SceneManager = new SceneManager(this, { GamePlay: GamePlay, WelcomeScene: WelcomeScene, CardViewer: CardViewer });
    this.player = new Player();
    this.cards = new Cards(this.cache.json.get("cards"));
    this.startWelcome();
  }

  startWelcome() {
    this.SceneManager.switchScene("WelcomeScene");
  }

  startCardGame() {
    // for (let i = 0; i < 20; i++) {
    //   this.player.addCard(this.cards._cards[Math.floor(Math.random() * this.cards._cards.length)].id);
    // }

    this.SceneManager.switchScene("GamePlay");
  }

  startCardViewer() {
    this.SceneManager.switchScene("CardViewer");
  }
}

export default class Boot extends Phaser.Scene {
  preload() {
    this.load.setPath("./assets/");
    this.load.image("cardblue", "cards/card_blue.png");
    this.load.image("cardred", "cards/card_red.png");
    this.load.image("cardgrey", "cards/card_grey.png");
    this.load.json("cards", "data/cards.json");
    this.load.image("background", "background.png");
    this.load.multiatlas("graphics", "graphics.json");
  }

  create() {
    const cards = this.cache.json.get("cards").cards;
    cards.forEach(card => this.load.image(card.id, "cards/" + card.id + ".png"));
    this.load.once("complete", this.game.handleGameReady, this.game);
    this.load.start();
  }
}
