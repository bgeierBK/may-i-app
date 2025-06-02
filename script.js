// Scorekeeper variables
let currentPlayerCount = 4;
const maxPlayers = 7;
const minPlayers = 4;
let scores = Array(8)
  .fill()
  .map(() => Array(maxPlayers).fill(0));
let playerNames = [
  "Player 1",
  "Player 2",
  "Player 3",
  "Player 4",
  "Player 5",
  "Player 6",
  "Player 7",
];

// Game settings
let firstHandSetting = "two-books-two-aces";
let numberOfHandsSetting = 4;

// May I hands progression
const mayIHands = [
  "Two Books, Two Aces",
  "Three Books",
  "Two Books and a Run",
  "Two Runs and a Book",
  "Three Runs",
  "Run of Five, Run of Six",
  "Run of Six, Run of Seven",
  "Run of Five, Run of Six, and a Book",
];

// Sound variables
let sounds = {};

// Load sounds
function loadSound(soundNumber, filePath) {
  sounds[soundNumber] = new Audio(filePath);
}

// Initialize sounds
loadSound(1, "Sounds/may-i-sound-1.mp3");
loadSound(2, "Sounds/may-i-sound-2.mp3");
loadSound(3, "Sounds/may-i-sound-3.mp3");

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
  const totalElement = document.getElementById(`total-${player}`);
  if (totalElement) {
    totalElement.textContent = total;
  }
}

function getStartingHandIndex(firstHand) {
  switch (firstHand) {
    case "two-books-two-aces":
      return 0; // Starts with "Two Books, Two Aces"
    case "three-books":
      return 1; // Starts with "Three Books"
    case "two-books-and-run":
      return 2; // Starts with "Two Books and a Run"
    default:
      return 0;
  }
}

function updateFirstHand(value) {
  firstHandSetting = value;
  updateNumberOfHandsOptions();
  updateHandLabels();
}

function updateNumberOfHands(value) {
  numberOfHandsSetting = parseInt(value);
  updateHandLabels();
}

function updateNumberOfHandsOptions() {
  const numberOfHandsSelect = document.getElementById("number-of-hands");
  const currentValue = numberOfHandsSelect.value;

  // Clear existing options
  numberOfHandsSelect.innerHTML = "";

  // Add appropriate options based on first hand selection
  let minHands, maxHands;

  if (firstHandSetting === "two-books-two-aces") {
    minHands = 4;
    maxHands = 8;
  } else if (firstHandSetting === "three-books") {
    minHands = 6;
    maxHands = 7;
  } else if (firstHandSetting === "two-books-and-run") {
    minHands = 6;
    maxHands = 6;
  }

  for (let i = minHands; i <= maxHands; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    numberOfHandsSelect.appendChild(option);
  }

  // Set the value to the current one if still valid, otherwise use the minimum
  if (currentValue >= minHands && currentValue <= maxHands) {
    numberOfHandsSelect.value = currentValue;
    numberOfHandsSetting = parseInt(currentValue);
  } else {
    numberOfHandsSelect.value = minHands;
    numberOfHandsSetting = minHands;
  }
}

function updateHandLabels() {
  const startingIndex = getStartingHandIndex(firstHandSetting);

  // Get all round label elements
  const roundLabels = document.querySelectorAll(".round-label");

  roundLabels.forEach((label, index) => {
    // Skip the TOTAL row (it's the last one)
    if (label.textContent === "TOTAL") return;

    if (index < numberOfHandsSetting) {
      // Show appropriate hand name
      const handIndex = startingIndex + index;
      if (handIndex < mayIHands.length) {
        label.textContent = mayIHands[handIndex];
      }
    } else {
      // Hide unused rounds
      label.textContent = "";
      const row = label.parentElement;
      row.style.display = "none";
    }
  });

  // Show only the rows that should be visible
  const allRows = document.querySelectorAll("#score-body tr");
  allRows.forEach((row, index) => {
    if (index < numberOfHandsSetting || row.classList.contains("total-row")) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function addPlayer() {
  if (currentPlayerCount < maxPlayers) {
    currentPlayerCount++;
    updatePlayerControls();
    rebuildTable();
  }
}

function removePlayer() {
  if (currentPlayerCount > minPlayers) {
    currentPlayerCount--;
    updatePlayerControls();
    rebuildTable();
  }
}

function updatePlayerControls() {
  document.getElementById(
    "player-count"
  ).textContent = `Players: ${currentPlayerCount}`;
  document.getElementById("add-player-btn").disabled =
    currentPlayerCount >= maxPlayers;
  document.getElementById("remove-player-btn").disabled =
    currentPlayerCount <= minPlayers;
}

function rebuildTable() {
  const headerRow = document.getElementById("header-row");
  const scoreBody = document.getElementById("score-body");

  // Clear existing content except the "Round" header
  headerRow.innerHTML = "<th>Round</th>";
  scoreBody.innerHTML = "";

  // Add player headers
  for (let i = 0; i < currentPlayerCount; i++) {
    const th = document.createElement("th");
    th.innerHTML = `<input type="text" class="player-name" value="${playerNames[i]}" onchange="updatePlayerName(${i}, this.value)">`;
    headerRow.appendChild(th);
  }

  // Add score rows for each round
  for (let round = 0; round < 8; round++) {
    const row = document.createElement("tr");

    // Round label
    const roundCell = document.createElement("td");
    roundCell.className = "round-label";
    roundCell.textContent = `Round ${round + 1}`;
    row.appendChild(roundCell);

    // Score inputs for each player
    for (let player = 0; player < currentPlayerCount; player++) {
      const cell = document.createElement("td");
      cell.innerHTML = `<input type="number" class="score-input" onchange="updateScore(${round}, ${player}, this.value)" value="${
        scores[round][player] || ""
      }">`;
      row.appendChild(cell);
    }

    scoreBody.appendChild(row);
  }

  // Add total row
  const totalRow = document.createElement("tr");
  totalRow.className = "total-row";

  const totalLabel = document.createElement("td");
  totalLabel.className = "round-label";
  totalLabel.textContent = "TOTAL";
  totalRow.appendChild(totalLabel);

  for (let player = 0; player < currentPlayerCount; player++) {
    const totalCell = document.createElement("td");
    totalCell.className = "total-score";
    totalCell.id = `total-${player}`;
    totalCell.textContent = "0";
    totalRow.appendChild(totalCell);

    // Recalculate totals
    calculateTotal(player);
  }

  scoreBody.appendChild(totalRow);

  // Update hand labels after rebuilding the table
  updateHandLabels();
}

// Initialize the dropdowns and table when page loads
document.addEventListener("DOMContentLoaded", function () {
  updatePlayerControls();
  rebuildTable();
  updateNumberOfHandsOptions(); // Set up the number of hands dropdown
  updateHandLabels(); // Set initial hand labels
});
