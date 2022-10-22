export class CardDisplay extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config, opts = {}) {
    super(scene, x, y);
    scene.add.existing(this);

    this._id = config.id;
    this.player = 1;
    this._ranks = config.ranks;

    this.image = scene.add.image(0, 0, config.id);

    if (opts.locked) {
      this.image.setTintFill(0x000000);
      this.image.alpha = 0.15;
      this.panel = scene.add.image(0, 0, "cardgrey");
      this.add([this.panel, this.image]);
    } else {
      this.panel = scene.add.image(0, 0, "cardblue");
      this.panel.on("pointerdown", () => this.emit("pointerdown", this), this);
      const style = { font: "32px Arial Black", color: "#FFFFFF", align: "center", stroke: "#000000", strokeThickness: 5 };
      const topscore = scene.add.text(-60, -95, config.ranks[0] === 10 ? "A" : config.ranks[0], style).setOrigin(0.5);
      const bottomscore = scene.add.text(-60, -40, config.ranks[3] === 10 ? "A" : config.ranks[3], style).setOrigin(0.5);
      const leftScore = scene.add.text(-75, -67, config.ranks[1] === 10 ? "A" : config.ranks[1], style).setOrigin(0.5);
      const rightScore = scene.add.text(-45, -67, config.ranks[2] === 10 ? "A" : config.ranks[2], style).setOrigin(0.5);
      this.add([this.panel, this.image, topscore, bottomscore, leftScore, rightScore]);
    }
  }

  get id() {
    return this._id;
  }

  get width() {
    return this.panel.width;
  }
  get height() {
    return this.panel.height;
  }

  set ghost(value) {
    this.list.forEach(child => {
      if (child != this.panel) child.alpha = value ? 0.35 : 1;
    });
    if (value) this.panel.setTexture("cardgrey");
  }

  setInteractive(opts, override) {
    if (override) super.setInteractive(opts);
    else this.panel.setInteractive({ useHandCursor: true });
    // super.setInteractive({
    //   useHandCursor: true,
    //   hitArea: new Phaser.Geom.Rectangle(
    //     -this.panel.displayWidth * this.scale * 0.5,
    //     -this.panel.displayHeight * this.scale * 0.5,
    //     this.panel.displayWidth * this.scale,
    //     this.panel.displayHeight * this.scale
    //   ),
    //   hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    //   ...opts
    // });
  }

  disable() {
    this.panel.removeInteractive();
  }

  setPanelColour(color) {
    this.panel.setTexture("card" + color);
  }

  showQuantity(qty) {
    if (!this.textQty) {
      this.textQty = this.scene.add
        .text(this.panel.displayWidth * 0.5 - 10, this.panel.displayHeight * 0.5 - 10, qty, {
          font: "38px Arial Black",
          color: "#DDDDFF",
          align: "right",
          stroke: "#000000",
          strokeThickness: 5
        })
        .setOrigin(1);
      this.add(this.textQty);
    }
    this.textQty.text = qty;
  }
}
