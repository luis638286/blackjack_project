import Card from "./Card.js";

export default class Deck {
  constructor(numDecks = 1) {
    this.numDecks = Math.max(1, numDecks);
    this.suits = ["clubs", "diamonds", "hearts", "spades"];
    this.reset();
  }

  reset() {
    this.cards = [];
    for (let d = 0; d < this.numDecks; d++) {
      for (let suit of this.suits) {
        for (let rank = 1; rank <= 13; rank++) {
          this.cards.push(new Card(rank, suit));
        }
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.cards.length === 0) {
      this.reset();
    }
    return this.cards.pop();
  }
}
