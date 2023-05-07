const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const initiativeInput = document.getElementById('initiative');
const playerListDiv = document.getElementById('player-list');
const nextTurnButton = document.getElementById('next-turn');
const resetButton = document.getElementById('reset');

let players = [];
let currentPlayerIndex = 0;

// Laden der gespeicherten Spielerdaten, wenn das Popup geöffnet wird
loadPlayers();

playerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  players.push({
    name: playerNameInput.value,
    initiative: parseInt(initiativeInput.value, 10)
  });

  playerNameInput.value = '';
  initiativeInput.value = '';

  updatePlayerList();
  savePlayers();
});

nextTurnButton.addEventListener('click', () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updatePlayerList();
  savePlayers();
});

resetButton.addEventListener('click', () => {
  players = [];
  currentPlayerIndex = 0;
  updatePlayerList();
  savePlayers();
});

function updatePlayerList() {
  players.sort((a, b) => b.initiative - a.initiative);

  playerListDiv.innerHTML = '';
  players.forEach((player, index) => {
    const playerElement = document.createElement('div');
    playerElement.textContent = `${player.name} (${player.initiative})`;

    if (index === currentPlayerIndex) {
      playerElement.classList.add('highlight');
      nextTurnButton.disabled = false;
    }

    playerListDiv.appendChild(playerElement);
  });
}

function savePlayers() {
  const data = {
    players,
    currentPlayerIndex
  };
  getStorageApi().set({ data });
}

function loadPlayers() {
  getStorageApi().get('data', (result) => {
    if (result.data) {
      players = result.data.players;
      currentPlayerIndex = result.data.currentPlayerIndex;
      updatePlayerList();
    }
  });
}

function getStorageApi() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage.local;
  } else if (typeof browser !== 'undefined' && browser.storage) {
    return browser.storage.local;
  } else {
    throw new Error('Storage API not supported in this browser.');
  }
}
