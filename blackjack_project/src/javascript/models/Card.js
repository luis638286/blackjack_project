export default class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getValue() {
    if (this.rank > 10) return 10;       // J, Q, K
    if (this.rank === 1) return 11;      // Ace defaults to 11
    return this.rank;
  }

  getImagePath() {
    let rankName;
    if (this.rank === 1) rankName = "A";
    else if (this.rank === 11) rankName = "J";
    else if (this.rank === 12) rankName = "Q";
    else if (this.rank === 13) rankName = "K";
    else rankName = this.rank;

    return `../../assets/images/deck/${this.suit}_${rankName}.png`;
  }
}


