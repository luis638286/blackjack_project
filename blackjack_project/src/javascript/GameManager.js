import Deck from "./models/Deck.js";
import Player from "./models/Player.js";
import AIPlayer from "./models/AIPlayer.js";
import { renderHand, updateResult, disableButtons, resetButtons } from "./ui.js";
import { playCardSound } from "./sounds.js";

export default class GameManager {
  constructor() {
    this.deck = new Deck();
    this.player = new Player("Player");
    this.dealer = new Player("Dealer");
    this.ai = new AIPlayer("AI", "easy");
  }

  restart() {
    console.log("Game started!");
    playCardSound();
    this.player.resetHand();
    this.dealer.resetHand();
    this.ai.resetHand();

    this.ai.addCard(this.deck.drawCard());
    this.ai.addCard(this.deck.drawCard());
    this.player.addCard(this.deck.drawCard());
    this.player.addCard(this.deck.drawCard());
    this.dealer.addCard(this.deck.drawCard());

    updateResult("");
    resetButtons();
    this.updateDisplay();
  }


  hit() {
    this.player.addCard(this.deck.drawCard());
    playCardSound();
    this.updateDisplay();
    if (this.player.getHandValue() > 21) {
      updateResult("Player busts! Dealer wins.");
      disableButtons();
    }
  }

  stand() {
    while (this.dealer.getHandValue() < 17) {
      this.dealer.addCard(this.deck.drawCard());
    }

    this.ai.makeDecision(this.dealer.hand[0].getValue(), () => this.deck.drawCard());
     playCardSound();

    this.updateDisplay();

    let winner = this.checkWinner();
    updateResult(winner);
    disableButtons();
  }

  checkWinner() {
    const scores = [
      { name: "Player", value: this.player.getHandValue() },
      { name: "Dealer", value: this.dealer.getHandValue() },
      { name: "AI", value: this.ai.getHandValue() }
    ];

    let best = null;
    for (let s of scores) {
      if (s.value > 21) continue;
      if (!best || s.value > best.value) {
        best = { names: [s.name], value: s.value };
      } else if (s.value === best.value) {
        best.names.push(s.name);
      }
    }

    if (!best) return "Nobody wins (all busted)";
    if (best.names.length > 1) return `It's a tie between ${best.names.join(" and ")} with ${best.value}`;
    return `${best.names[0]} wins with ${best.value}`;
  }

  updateDisplay() {
    renderHand(this.player.hand, "player-cards", "player-total");
    renderHand(this.ai.hand, "ai-player-cards", "ai-player-total");
    renderHand(this.dealer.hand, "dealer-cards", "dealer-total");
  }
}
