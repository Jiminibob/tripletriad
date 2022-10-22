export class Pagination extends Phaser.GameObjects.Container {
  constructor(scene, count) {
    super(scene);
    scene.add.existing(this);
    this._tabs = [];
    while (this._tabs.length < count) {
      const icon = scene.add.image(this._tabs.length * 15, 0, "graphics", "pagination_off").setOrigin(0, 0.5);
      this.add(icon);
      this._tabs.push(icon);
    }
  }

  setIndex(index) {
    this._tabs.forEach((p, i) => p.setFrame(i === index ? "pagination_on" : "pagination_off"));
  }

  get width() {
    return this._tabs[this._tabs.length - 1].x + 15;
  }
}
