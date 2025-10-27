export function renderHand(hand, containerId, totalId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  hand.forEach(card => {
    let img = document.createElement("img");
    img.src = card.getImagePath();
    container.appendChild(img);
  });
  document.getElementById(totalId).innerText = "Total: " + handValue(hand);
}

export function updateResult(text) {
  document.getElementById("result").innerText = text;
}

export function disableButtons() {
  document.getElementById("hitBtn").disabled = true;
  document.getElementById("standBtn").disabled = true;
}

export function resetButtons() {
  document.getElementById("hitBtn").disabled = false;
  document.getElementById("standBtn").disabled = false;
}

// helper since card values moved into Player
function handValue(hand) {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    value += card.getValue();
    if (card.rank === 1) aces++;
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}


