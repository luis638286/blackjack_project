import Player from "./Player.js";

export default class AIPlayer extends Player {
  constructor(name, difficulty = "easy") {
    super(name);
    this.difficulty = difficulty;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  makeDecision(dealerCardValue, drawFn) {
    let total = this.getHandValue();
    let decision = "stand";

    if (this.difficulty === "easy") {
      if (total >= 17) {
        decision = Math.random() < 0.8 ? "hit" : "stand";
      } else if (total <= 11) {
        decision = "hit";
      } else if (total === 12 || total === 13) {
        decision = Math.random() < 0.8 ? "stand" : "hit";
      } else if (total >= 12 && total <= 16 && dealerCardValue >= 2 && dealerCardValue <= 6) {
        decision = Math.random() < 0.8 ? "hit" : "stand";
      } else {
        decision = total <= 15 ? "hit" : "stand";
      }
    }

    if (this.difficulty === "medium") {
      if (dealerCardValue >= 7 || dealerCardValue === 11) {
        decision = total <= 16 ? "hit" : "stand";
      } else {
        decision = total >= 12 ? "stand" : "hit";
      }
      if (Math.random() < 0.15) {
        decision = decision === "hit" ? "stand" : "hit"; // mistakes
      }
    }

    if (this.difficulty === "hard") {
      let soft = this.hand.some(c => c.rank === 1 && total <= 21);
      if (!soft) {
        if (total <= 11) decision = "hit";
        else if (total >= 17) decision = "stand";
        else decision = (dealerCardValue >= 2 && dealerCardValue <= 6) ? "stand" : "hit";
      } else {
        if (total >= 19) decision = "stand";
        else decision = (dealerCardValue >= 7) ? "hit" : "stand";
      }
    }

    if (decision === "hit") {
      this.addCard(drawFn());
      console.log(`${this.name} chose HIT (${this.difficulty})`);
    } else {
      console.log(`${this.name} chose STAND (${this.difficulty})`);
    }
  }
}


