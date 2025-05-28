// Scorekeeper variables
let scores = Array(8)
  .fill()
  .map(() => Array(6).fill(0));
let playerNames = [
  "Player 1",
  "Player 2",
  "Player 3",
  "Player 4",
  "Player 5",
  "Player 6",
];

// Sound variables
let sounds = {};

// Load sounds
function loadSound(soundNumber, filePath) {
  sounds[soundNumber] = new Audio(filePath);
}

// Initialize sound 1
loadSound(1, "Sounds/may-i-sound-1.mp3");

function playSound(soundNumber) {
  if (sounds[soundNumber]) {
    // Reset to beginning and play
    sounds[soundNumber].currentTime = 0;
    sounds[soundNumber].play().catch((error) => {
      console.error(`Error playing sound ${soundNumber}:`, error);
    });
  } else {
    console.log(`Sound ${soundNumber} not loaded yet`);
  }
}

function updatePlayerName(playerIndex, name) {
  playerNames[playerIndex] = name;
}

function updateScore(round, player, value) {
  scores[round][player] = parseInt(value) || 0;
  calculateTotal(player);
}

function calculateTotal(player) {
  let total = 0;
  for (let round = 0; round < 8; round++) {
    total += scores[round][player];
  }
  document.getElementById(`total-${player}`).textContent = total;
}
