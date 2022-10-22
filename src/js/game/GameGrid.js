export class GameGrid extends Phaser.GameObjects.Zone {
  constructor(scene, settings) {
    super(scene, 0, 0, settings.columns * settings.cellWidth, settings.rows * settings.cellHeight);
    scene.add.existing(this);
    this.setOrigin(0);
    this.cellWidth = settings.cellWidth;
    this.cellHeight = settings.cellHeight;
    this.grid = [new Array(3).fill(false), new Array(3).fill(false), new Array(3).fill(false)];
    this.setInteractive({ dropZone: true });
    // scene.input.enableDebug(this);
  }

  hasSpace() {
    return this.grid.find(r => r.includes(false));
  }

  getGrid() {
    return this.grid;
  }

  addCardToGrid(card) {
    const { x, y } = this.worldToGrid(card.x, card.y);

    card.x = this.x + x * this.cellWidth + this.cellWidth * 0.5;
    card.y = this.y + y * this.cellHeight + this.cellHeight * 0.5;

    // place card
    if (this.grid[y][x]) return false;

    this.grid[y][x] = card;

    // grab neighbours and check if we can flip them
    this.checkForCardFlips(card, this.getNeighbourCards(x, y));

    // succefully adddd to grid
    return true;
  }

  checkForCardFlips(card, neighbours) {
    neighbours.forEach((neighbour, i) => {
      if (neighbour && neighbour.player !== card.player) {
        switch (i) {
          case 0: //top
            if (neighbour.rankBottom < card.rankTop) neighbour.flipCard(false);
            break;
          case 1: //left
            if (neighbour.rankRight < card.rankLeft) neighbour.flipCard(true);
            break;
          case 2: //right
            if (neighbour.rankLeft < card.rankRight) neighbour.flipCard(true);
            break;
          case 3: //bottom
            if (neighbour.rankTop < card.rankBottom) neighbour.flipCard(false);
            break;
        }
      }
    });
  }

  getNeighbourCards(x, y) {
    return [
      this.grid[y - 1] ? this.grid[y - 1][x] : false,
      this.grid[y][x - 1] || false,
      this.grid[y][x + 1] || false,
      this.grid[y + 1] ? this.grid[y + 1][x] : false
    ];
  }

  worldToGrid(x, y) {
    return {
      x: Math.floor((x - this.x) / this.cellWidth),
      y: Math.floor((y - this.y) / this.cellHeight)
    };
  }

  gridToWorld(x, y, centered) {
    return {
      x: this.x + x * this.cellWidth + (centered ? this.cellWidth * 0.5 : 0),
      y: this.y + y * this.cellHeight + (centered ? this.cellHeight * 0.5 : 0)
    };
  }
}
