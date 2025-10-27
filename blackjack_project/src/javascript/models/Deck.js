import Card from "./Card.js";

export default class Deck {
  constructor() {
    this.suits = ["clubs", "diamonds", "hearts", "spades"];
  }

  drawCard() {
    const rank = Math.floor(Math.random() * 13) + 1;
    const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
    return new Card(rank, suit);
  }
}
