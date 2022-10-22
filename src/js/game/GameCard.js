import { CardDisplay } from "./CardDisplay";

export class GameCard extends CardDisplay {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this._highlight = scene.add.rectangle(0, 0, 206, 256, 0xf9eda3).setVisible(false);
    this.addAt(this._highlight, 0);
    this.player = 1;
    this._ranks = config.ranks;
  }

  get ranks() {
    return [...this._ranks];
  }

  get rankTop() {
    return this._ranks[0];
  }
  get rankLeft() {
    return this._ranks[1];
  }
  get rankRight() {
    return this._ranks[2];
  }
  get rankBottom() {
    return this._ranks[3];
  }
  set highlight(value) {
    this._highlight.visible = value;
  }

  enable() {
    super.setInteractive(
      {
        useHandCursor: true,
        hitArea: new Phaser.Geom.Rectangle(0, 0, this.panel.displayWidth, this.panel.displayHeight),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        draggable: true
      },
      true
    );
  }

  disable() {
    this.removeInteractive();
  }

  flipCard(horizontal) {
    const player = this.player === 1 ? 2 : 1;
    this.player = player;
    const tween = this.scene.tweens.add({
      targets: this,
      scaleX: horizontal ? 0 : 1,
      scaleY: horizontal ? 1 : 0,
      duration: 100,
      yoyo: true
    });
    tween.once("yoyo", () => this.setPlayer(player), this);
  }

  bounce() {
    this.scene.tweens.add({
      targets: this,
      scale: "+=0.1",
      duration: 100,
      yoyo: true
    });
  }

  setPlayer(value) {
    this.player = value;
    this.setPanelColour(this.player === 1 ? "blue" : "red");
  }
}
