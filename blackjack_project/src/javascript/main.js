import GameManager from "./GameManager.js";
import {
  playClickSound,
  setSfxEnabled,
  isSfxEnabled,
  setMusicVolume,
  getMusicVolume
} from "./sounds.js";
import { hideResultOverlay } from "./ui.js";

const game = new GameManager();
const startOverlay = document.getElementById("start-overlay");
const gameContainer = document.getElementById("game");
const music = document.getElementById("bg-music");

const defaultMusicVolume = 0.2;
setMusicVolume(defaultMusicVolume);

function startGame() {
  if (startOverlay) startOverlay.classList.remove("visible");
  if (gameContainer) gameContainer.classList.remove("hidden");

  if (music) {
    music.currentTime = 0;
    music.volume = getMusicVolume();
    music.play();
  }

  playClickSound();
  game.restart();
}

document.getElementById("startBtn")?.addEventListener("click", startGame);

document.getElementById("hitBtn")?.addEventListener("click", () => {
  playClickSound();
  game.hit();
});

document.getElementById("standBtn")?.addEventListener("click", () => {
  playClickSound();
  game.stand();
});

document.getElementById("restartBtn")?.addEventListener("click", () => {
  playClickSound();
  hideResultOverlay();
  game.restart();
});

const resultClose = document.getElementById("result-close");
if (resultClose) {
  resultClose.addEventListener("click", () => {
    playClickSound();
    hideResultOverlay();
    game.restart();
  });
}

const settingsModal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById("settingsBtn");
const cancelSettings = document.getElementById("cancelSettings");
const settingsForm = document.getElementById("settingsForm");

function toggleSettings(show) {
  if (!settingsModal) return;
  if (show) {
    settingsModal.classList.add("visible");
    const [ai1, ai2] = game.getAIDifficulties();
    const ai1Select = document.getElementById("ai1Difficulty");
    const ai2Select = document.getElementById("ai2Difficulty");
    const musicSlider = document.getElementById("musicVolume");
    const sfxToggle = document.getElementById("sfxToggle");

    if (ai1Select) ai1Select.value = ai1;
    if (ai2Select) ai2Select.value = ai2;
    if (musicSlider) musicSlider.value = String(getMusicVolume());
    if (sfxToggle) sfxToggle.checked = isSfxEnabled();
  } else {
    settingsModal.classList.remove("visible");
  }
}

settingsBtn?.addEventListener("click", () => {
  playClickSound();
  toggleSettings(true);
});

cancelSettings?.addEventListener("click", () => {
  playClickSound();
  toggleSettings(false);
});

settingsModal?.addEventListener("click", event => {
  if (event.target === settingsModal) {
    toggleSettings(false);
  }
});

settingsForm?.addEventListener("submit", event => {
  event.preventDefault();
  const ai1Select = document.getElementById("ai1Difficulty");
  const ai2Select = document.getElementById("ai2Difficulty");
  const musicSlider = document.getElementById("musicVolume");
  const sfxToggle = document.getElementById("sfxToggle");

  if (ai1Select) game.setAIDifficulty(0, ai1Select.value);
  if (ai2Select) game.setAIDifficulty(1, ai2Select.value);
  if (musicSlider) setMusicVolume(Number(musicSlider.value));
  if (music) music.volume = getMusicVolume();
  if (sfxToggle) setSfxEnabled(sfxToggle.checked);

  playClickSound();
  toggleSettings(false);
});

// Allow pressing escape to close modals
window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (settingsModal?.classList.contains("visible")) {
      toggleSettings(false);
    }
  }
});
