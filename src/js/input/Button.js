export class Button extends Phaser.GameObjects.Image {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.sheet, config.costume);
    scene.add.existing(this);
    this._costume = config.costume;
    this._id = config.id;
    this._enabled = false;
    this.on("pointerover", this.handlePointerOver, this);
    this.on("pointerout", this.handlePointerOut, this);
    this.enable();
  }

  get id() {
    return this._id;
  }

  handlePointerOver() {
    this.setFrame(this._costume + "_over");
  }

  handlePointerOut() {
    this.setFrame(this._costume);
  }

  enable() {
    if (this._enabled) return;
    this._enabled = true;
    this.setInteractive({ useHandCursor: true, pixelPerfect: true });
  }

  disable() {
    this._enabled = false;
    this.removeInteractive();
  }
}
