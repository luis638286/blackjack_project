const CARD_BACK = "../../assets/images/deck/card-back.svg";
const PARTICIPANT_STATES = [
  "participant--win",
  "participant--lose",
  "participant--push",
  "participant--bust"
];
const RESULT_STATES = ["result--win", "result--lose", "result--push", "result--neutral"];

function getParticipantElement(id) {
  return document.querySelector(`[data-participant="${id}"]`);
}

function formatDifficulty(value) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function renderTable({ player, aiPlayers, dealer, dealerRevealed }) {
  renderParticipant("player", player, {
    tagline: "Human contender",
    concealTotal: false,
    hideFirstCard: false
  });

  aiPlayers.forEach((ai, index) => {
    renderParticipant(`ai-${index + 1}`, ai, {
      tagline: `Difficulty: ${formatDifficulty(ai.difficulty)}`,
      concealTotal: false,
      hideFirstCard: false
    });
  });

  renderParticipant("dealer", dealer, {
    tagline: "House stands on 17",
    concealTotal: !dealerRevealed,
    hideFirstCard: !dealerRevealed
  });
}

function renderParticipant(id, participant, options = {}) {
  const container = getParticipantElement(id);
  if (!container) return;

  const avatarEl = container.querySelector(".avatar");
  if (avatarEl && participant.avatar) {
    avatarEl.src = participant.avatar;
    avatarEl.alt = `${participant.name} avatar`;
  }

  const nameEl = container.querySelector(".name");
  if (nameEl) {
    nameEl.textContent = participant.name;
  }

  const taglineEl = container.querySelector(".tagline");
  if (taglineEl && typeof options.tagline === "string") {
    taglineEl.textContent = options.tagline;
  }

  const totalEl = container.querySelector(".total");
  if (totalEl) {
    if (options.concealTotal) {
      totalEl.textContent = "Total: ??";
    } else {
      totalEl.textContent = `Total: ${participant.getHandValue()}`;
    }
  }

  const handEl = container.querySelector(".hand");
  if (handEl) {
    handEl.innerHTML = "";
    participant.hand.forEach((card, index) => {
      const img = document.createElement("img");
      img.classList.add("card");
      if (options.hideFirstCard && index === 0) {
        img.src = CARD_BACK;
        img.alt = "Hidden card";
        img.classList.add("card--hidden");
      } else {
        img.src = card.getImagePath();
        img.alt = `${card.rank} of ${card.suit}`;
      }
      handEl.appendChild(img);
    });
  }
}

export function updateResult(text, status = "neutral") {
  const resultEl = document.getElementById("result");
  if (!resultEl) return;
  resultEl.textContent = text;
  resultEl.classList.remove(...RESULT_STATES);
  resultEl.classList.add(`result--${status}`);
}

export function setButtonsDisabled(disabled) {
  const hitBtn = document.getElementById("hitBtn");
  const standBtn = document.getElementById("standBtn");
  if (hitBtn) hitBtn.disabled = disabled;
  if (standBtn) standBtn.disabled = disabled;
}

export function clearParticipantStates() {
  document.querySelectorAll("[data-participant]").forEach(el => {
    el.classList.remove(...PARTICIPANT_STATES);
  });
}

export function setParticipantState(id, state) {
  const element = getParticipantElement(id);
  if (!element) return;
  element.classList.remove(...PARTICIPANT_STATES);
  const className = state && PARTICIPANT_STATES.find(cls => cls.endsWith(state));
  if (className) {
    element.classList.add(className);
  }
}

export function showResultOverlay({ heading, detail, status }) {
  const overlay = document.getElementById("result-overlay");
  if (!overlay) return;
  const modal = overlay.querySelector(".result-modal");
  const headingEl = overlay.querySelector("#result-heading");
  const detailEl = overlay.querySelector("#result-detail");

  overlay.classList.add("visible");
  if (modal) {
    modal.classList.remove("win", "lose", "push");
    modal.classList.add(status ?? "lose");
  }
  if (headingEl && heading) headingEl.textContent = heading;
  if (detailEl && detail) detailEl.textContent = detail;
}

export function hideResultOverlay() {
  const overlay = document.getElementById("result-overlay");
  if (!overlay) return;
  overlay.classList.remove("visible");
  const modal = overlay.querySelector(".result-modal");
  if (modal) {
    modal.classList.remove("win", "lose", "push");
  }
}

export function updateRoundStats(stats) {
  const roundEl = document.getElementById("round-number");
  const winsEl = document.getElementById("wins-count");
  const lossesEl = document.getElementById("losses-count");
  const pushesEl = document.getElementById("pushes-count");

  if (roundEl) roundEl.textContent = stats.round;
  if (winsEl) winsEl.textContent = stats.wins;
  if (lossesEl) lossesEl.textContent = stats.losses;
  if (pushesEl) pushesEl.textContent = stats.pushes;
}
