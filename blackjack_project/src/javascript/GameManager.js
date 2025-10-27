import Deck from "./models/Deck.js";
import Player from "./models/Player.js";
import AIPlayer from "./models/AIPlayer.js";
import {
  renderTable,
  updateResult,
  setButtonsDisabled,
  clearParticipantStates,
  setParticipantState,
  showResultOverlay,
  hideResultOverlay,
  updateRoundStats
} from "./ui.js";
import { playCardSound } from "./sounds.js";

const PLAYER_ID = "player";
const DEALER_ID = "dealer";

export default class GameManager {
  constructor() {
    this.deck = new Deck();
    this.player = new Player("You", "../../assets/images/avatar_player.svg");
    this.aiPlayers = [
      new AIPlayer("Aurora", "easy", "../../assets/images/avatar_ai1.svg"),
      new AIPlayer("Orion", "medium", "../../assets/images/avatar_ai2.svg")
    ];
    this.dealer = new Player("Dealer", "../../assets/images/avatar_dealer.svg");

    this.stats = {
      round: 0,
      wins: 0,
      losses: 0,
      pushes: 0
    };

    this.dealerRevealed = false;
    this.roundActive = false;
  }

  restart() {
    this.deck.reset();
    this.roundActive = true;
    this.dealerRevealed = false;

    [this.player, ...this.aiPlayers, this.dealer].forEach(p => p.resetHand());

    // initial deal - standard two cards each, dealer keeps first card hidden in UI
    for (let i = 0; i < 2; i++) {
      this.player.addCard(this.deck.drawCard());
      this.aiPlayers.forEach(ai => ai.addCard(this.deck.drawCard()));
      this.dealer.addCard(this.deck.drawCard());
    }

    this.stats.round += 1;

    updateResult("", "neutral");
    hideResultOverlay();
    clearParticipantStates();
    setButtonsDisabled(false);
    updateRoundStats(this.stats);
    this.updateDisplay();
    playCardSound();
  }

  hit() {
    if (!this.roundActive) return;

    this.player.addCard(this.deck.drawCard());
    playCardSound();
    this.updateDisplay();

    if (this.player.getHandValue() > 21) {
      this.roundActive = false;
      this.completeNonPlayerTurns();
      this.dealerRevealed = true;
      this.updateDisplay();
      this.endRound("You busted! Dealer wins.");
    }
  }

  stand() {
    if (!this.roundActive) return;
    this.roundActive = false;

    this.completeNonPlayerTurns();
    this.dealerRevealed = true;
    this.updateDisplay();
    this.endRound();
  }

  completeNonPlayerTurns() {
    const dealerUpCardValue = this.dealer.hand[0]?.getValue() ?? 0;
    this.aiPlayers.forEach(ai =>
      ai.playTurn(dealerUpCardValue, () => this.deck.drawCard(), () => playCardSound())
    );

    while (this.dealer.getHandValue() < 17) {
      this.dealer.addCard(this.deck.drawCard());
      playCardSound();
    }
  }

  endRound(messageOverride) {
    this.roundActive = false;
    this.dealerRevealed = true;
    setButtonsDisabled(true);

    const outcomes = this.evaluateHands();
    const summary = messageOverride ?? this.buildSummary(outcomes);
    const playerOutcome = outcomes.find(o => o.id === PLAYER_ID);
    const status = this.mapStatus(playerOutcome?.outcome);

    updateResult(summary, status);
    outcomes.forEach(o => setParticipantState(o.id, o.outcome));

    if (playerOutcome) {
      if (playerOutcome.outcome === "win") this.stats.wins += 1;
      else if (playerOutcome.outcome === "push") this.stats.pushes += 1;
      else this.stats.losses += 1;
    }
    updateRoundStats(this.stats);

    const heading = this.buildHeading(playerOutcome?.outcome);
    showResultOverlay({
      heading,
      detail: summary,
      status
    });

    this.updateDisplay();
  }

  evaluateHands() {
    const participants = [
      { id: PLAYER_ID, participant: this.player },
      ...this.aiPlayers.map((ai, index) => ({ id: `ai-${index + 1}`, participant: ai })),
      { id: DEALER_ID, participant: this.dealer }
    ];

    const snapshots = participants.map(entry => {
      const total = entry.participant.getHandValue();
      return {
        id: entry.id,
        name: entry.participant.name,
        total,
        bust: total > 21
      };
    });

    const eligible = snapshots.filter(s => !s.bust);
    const bestValue = eligible.length ? Math.max(...eligible.map(s => s.total)) : null;
    const winners = bestValue !== null ? eligible.filter(s => s.total === bestValue) : [];

    return snapshots.map(s => {
      if (s.bust) {
        return { ...s, outcome: "bust" };
      }
      if (!winners.length) {
        return { ...s, outcome: "push" };
      }
      if (winners.length === 1 && winners[0].id === s.id) {
        return { ...s, outcome: "win" };
      }
      if (winners.some(w => w.id === s.id)) {
        return { ...s, outcome: "push" };
      }
      return { ...s, outcome: "lose" };
    });
  }

  buildSummary(outcomes) {
    const winners = outcomes.filter(o => o.outcome === "win" || o.outcome === "push");
    if (!winners.length) {
      return "Everybody busted! No winners this round.";
    }

    const topScore = Math.max(...winners.map(w => w.total));
    const topWinners = winners.filter(w => w.total === topScore);

    if (topWinners.length === 1) {
      return `${topWinners[0].name} wins with ${topScore}.`;
    }

    const names = topWinners.map(w => w.name).join(", ");
    return `It's a push at ${topScore} between ${names}.`;
  }

  mapStatus(outcome) {
    switch (outcome) {
      case "win":
        return "win";
      case "push":
        return "push";
      default:
        return "lose";
    }
  }

  buildHeading(outcome) {
    switch (outcome) {
      case "win":
        return "You win!";
      case "push":
        return "Push";
      default:
        return "You lose";
    }
  }

  updateDisplay() {
    renderTable({
      player: this.player,
      aiPlayers: this.aiPlayers,
      dealer: this.dealer,
      dealerRevealed: this.dealerRevealed
    });
  }

  setAIDifficulty(index, difficulty) {
    const ai = this.aiPlayers[index];
    if (!ai) return;
    ai.setDifficulty(difficulty);
    this.updateDisplay();
  }

  getAIDifficulties() {
    return this.aiPlayers.map(ai => ai.difficulty);
  }
}
