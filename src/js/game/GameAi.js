export const GameAi = {
  chooseCards(cards, level, count) {
    const options = cards.getCardsBetweenLevels(level - 1, level + 1);
    while (options.length > count) {
      options.splice(Math.floor(Math.random() * options.length), 1);
    }

    return options;
  },

  chooseNextMove(cards, gameGrid) {
    const board = gameGrid.getGrid();
    const result = { score: -1 };
    for (let c = 0; c < cards.length; c++) {
      let cardscore = -1;
      let boardpos = false;
      const card = cards[c];
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          const score = getMoveScore(card, x, y, board);
          if (score > cardscore) {
            cardscore = score;
            boardpos = { x, y };
          }
        }
      }

      if (cardscore > result.score) {
        result.score = cardscore;
        result.card = card;
        result.pos = boardpos;
      }
    }

    return result.card ? { ...result } : false;
  }
};

const getMoveScore = (card, x, y, board) => {
  if (board[y][x]) return 0;
  let score = 0;
  // check top
  if (y === 0) score += 10 - card.rankTop;
  else score += getNeighbourScore(card, board[y - 1][x], "top");

  // check bottom
  if (y === board.length - 1) score += 10 - card.rankBottom;
  else score += getNeighbourScore(card, board[y + 1][x], "bottom");

  // check left
  if (x === 0) score += 10 - card.rankLeft;
  else score += getNeighbourScore(card, board[y][x - 1], "left");

  // check right
  if (x === board[y][x].length) score += 10 - card.rankRight;
  else score += getNeighbourScore(card, board[y][x + 1], "right");

  return score;
};

const getNeighbourScore = (card, neighbour, side) => {
  let score = 0;
  let rankCard, rankNeighbour;
  switch (side) {
    case "top":
      rankCard = "rankTop";
      rankNeighbour = "rankBottom";
      break;
    case "left":
      rankCard = "rankLeft";
      rankNeighbour = "rankRight";
      break;
    case "right":
      rankCard = "rankLeft";
      rankNeighbour = "rankRight";
      break;
    case "bottom":
      rankCard = "rankBottom";
      rankNeighbour = "rankTop";
      break;
  }
  if (neighbour) {
    if (neighbour[rankNeighbour] < card[rankCard]) score += 20;
    else score += 10 - card[rankCard];
  } else score += card[rankCard];
  return score;
};
