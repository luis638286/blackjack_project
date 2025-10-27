export function playCardSound() {
  const original = document.getElementById("card-sound");
  const clone = original.cloneNode(true);
  clone.volume = 1;
  clone.play();
}

export function playClickSound() {
  const original = document.getElementById("mouse-click");
  const clone = original.cloneNode(true);
  clone.volume = 0.25;
  clone.play();
}
