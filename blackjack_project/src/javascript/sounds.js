let sfxEnabled = true;
let sfxVolume = 0.35;
let musicVolume = 0.2;

function cloneAudio(id) {
  const original = document.getElementById(id);
  if (!original) return null;
  const clone = original.cloneNode(true);
  clone.currentTime = 0;
  clone.addEventListener("ended", () => clone.remove());
  return clone;
}

function clampVolume(value) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function playCardSound() {
  if (!sfxEnabled) return;
  const clone = cloneAudio("card-sound");
  if (!clone) return;
  clone.volume = sfxVolume;
  clone.play();
}

export function playClickSound() {
  if (!sfxEnabled) return;
  const clone = cloneAudio("mouse-click");
  if (!clone) return;
  clone.volume = Math.min(0.4, sfxVolume + 0.05);
  clone.play();
}

export function setSfxEnabled(enabled) {
  sfxEnabled = !!enabled;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

export function setSfxVolume(volume) {
  sfxVolume = clampVolume(volume);
}

export function getSfxVolume() {
  return sfxVolume;
}

export function setMusicVolume(volume) {
  musicVolume = clampVolume(volume);
  const music = document.getElementById("bg-music");
  if (music) {
    music.volume = musicVolume;
  }
}

export function getMusicVolume() {
  return musicVolume;
}
