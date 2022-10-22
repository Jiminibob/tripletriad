export class Player {
  constructor() {
    this._cards = [];
    this._deck = [];
    this.load();
  }

  firstGame() {
    return this._cards.length === 0;
  }

  getCardCount() {
    return this._cards.reduce((i, card) => i + (card.qty || 0), 0);
  }

  getCard(cardid) {
    return this._cards.find(c => c.id === cardid) || false;
  }

  getCards() {
    return this._cards.filter(c => c.qty);
  }

  addCards(cards) {
    cards.forEach(this.addCard.bind(this));
  }

  hasCard(cardid) {
    return this.getCard(cardid)?.qty ? true : false;
  }

  hasOwnedCard(cardid) {
    return this.getCard(cardid) ? true : false;
  }

  setDeck(deck) {
    this._deck = [...deck];
    this.save();
  }

  getDeck() {
    return [...this._deck];
  }

  addCard(cardid) {
    const card = this.getCard(cardid);
    if (!card) this._cards.push({ id: cardid, qty: 1 });
    else card.qty++;
    this.save();
  }

  removeCards(cards) {
    cards.forEach(this.removeCard.bind(this));
  }

  removeCard(cardid) {
    const card = this.getCard(cardid);
    card.qty = Math.max(card.qty - 1, 0);
    if (this._deck.includes(cardid)) {
      let total = card.qty;
      this._deck = this._deck.filter(entry => {
        if (entry === cardid) {
          total--;
          return total > 0;
        } else return true;
      });
    }
    this.save();
  }

  getCardQty(cardid) {
    return this.getCard(cardid)?.qty || 0;
  }

  save() {
    localStorage.setItem("tripletriad", JSON.stringify({ cards: this._cards, deck: this._deck }));
  }

  load() {
    const datastring = localStorage.getItem("tripletriad");
    if (datastring) {
      const data = JSON.parse(datastring);
      this._cards = data.cards || [];
      this._deck = data.deck || [];
    }
  }
}
