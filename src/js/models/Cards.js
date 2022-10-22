export class Cards {
  constructor(data) {
    this._cards = [...data.cards];
  }

  getCards() {
    return [...this._cards];
  }

  getCard(cardid) {
    return this._cards.find(c => c.id === cardid);
  }

  getCardLevel(cardid) {
    return this.getCard(cardid)?.level || false;
  }

  getCardsAtLevel(level) {
    return this._cards.filter(c => c.level === level);
  }

  getCardsBetweenLevels(start, end) {
    return this._cards.filter(c => c.level >= start && c.level <= end);
  }

  getCardsBelowLevel(level) {
    return this._cards.filter(c => c.level < level);
  }

  getCardsAboveLevel(level) {
    return this._cards.filter(c => c.level > level);
  }

  getRandomCardAtLevel(level) {
    const options = this.getCardsAtLevel(level);
    return options[Math.floor(Math.random() * options.length)];
  }
}
