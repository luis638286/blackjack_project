export default class Player {
  constructor(name, avatar) {
    this.name = name;
    this.avatar = avatar;
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  resetHand() {
    this.hand = [];
  }

  getHandValue() {
    let value = 0;
    let aces = 0;

    for (let card of this.hand) {
      value += card.getValue();
      if (card.rank === 1) aces++;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }
}
