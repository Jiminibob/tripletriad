export class ButtonText extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label) {
    super(scene, x, y);
    scene.add.existing(this);
    const text = scene.add
      .text(0, -2, label, {
        font: "32px Arial Black",
        color: "#FFFFFF",
        align: "center"
      })
      .setOrigin(0.5);
    const panel = scene.add.rectangle(0, 0, text.width + 40, text.height + 15, 0x000000, 0.85);
    this.add([panel, text]);
    this.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-150, -50, 300, 100),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains
    });
  }
}
