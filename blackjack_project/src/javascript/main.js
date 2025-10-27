import GameManager from "./GameManager.js";
import { playClickSound } from "./sounds.js";

const game = new GameManager();

document.getElementById("startBtn").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game").style.display = "block";

  const music = document.getElementById("bg-music");
  music.volume = 0.1;
  music.play();

  game.restart();
};

document.getElementById("hitBtn").onclick = () => game.hit();
document.getElementById("standBtn").onclick = () => game.stand();
document.getElementById("restartBtn").onclick = () => game.restart();

document.getElementById("easyBtn").onclick = () => {
  game.ai.setDifficulty("easy");
  document.getElementById("ai-title").textContent = "AI Player (easy)";
  playClickSound();
  setDifficulty("easy");
};

document.getElementById("mediumBtn").onclick = () => {
  game.ai.setDifficulty("medium");
  document.getElementById("ai-title").textContent = "AI Player (medium)";
  playClickSound();
  setDifficulty("medium");
};

document.getElementById("hardBtn").onclick = () => {
  game.ai.setDifficulty("hard");
  document.getElementById("ai-title").textContent = "AI Player (hard)";
  playClickSound();
  setDifficulty("hard");
};

function setDifficulty(difficulty) {
  document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
  document.getElementById(difficulty + "Btn").classList.add("selected");
}

document.getElementById("easyBtn").classList.add("selected");
