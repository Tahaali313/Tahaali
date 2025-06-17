const board = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const levelText = document.getElementById('level');
const modeSelector = document.getElementById('mode');

let cells = [];
let currentPlayer = 'X';
let gameActive = false;
let scores = { X: 0, O: 0 };
let currentMode = 'twoPlayer';
let moveCount = 0;
let currentLevel = 1;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function createBoard() {
  cells = [];
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
    cells.push('');
  }
  currentPlayer = 'X';
  gameActive = true;
  moveCount = 0;
  statusText.textContent = `Level ${currentLevel} — Player ${currentPlayer}'s turn`;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  moveCount++;

  if (checkWin()) {
    gameActive = false;
    highlightWinner();
    scores[currentPlayer]++;
    updateScore();

    if (currentMode === 'mission') {
      if (moveCount > 5 && currentPlayer === 'X') {
        statusText.textContent = "❌ Mission failed! Restarting...";
        return setTimeout(restartGame, 2000);
      }
    }

    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    if (currentPlayer === 'X') {
      currentLevel++;
      updateLevel();
      setTimeout(() => {
        statusText.textContent = `🎯 Level ${currentLevel} — Good luck!`;
        restartGame();
      }, 2000);
    } else {
      setTimeout(restartGame, 2000);
    }
    return;
  } else if (cells.every(cell => cell)) {
    gameActive = false;
    statusText.textContent = "🤝 It's a draw! Restarting...";
    return setTimeout(restartGame, 2000);
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (currentMode === 'vsComputer' && currentPlayer === 'O') {
    setTimeout(computerMove, 700);
  }
}

function computerMove() {
  let emptyIndexes = cells.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
  if (emptyIndexes.length === 0) return;

  let move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  cells[move] = 'O';
  let cellElement = document.querySelector(`[data-index="${move}"]`);
  cellElement.textContent = 'O';
  moveCount++;

  if (checkWin()) {
    gameActive = false;
    highlightWinner();
    scores['O']++;
    updateScore();
    statusText.textContent = `🤖 Computer wins! Restarting...`;
    return setTimeout(restartGame, 2000);
  } else if (cells.every(cell => cell)) {
    gameActive = false;
    statusText.textContent = "🤝 It's a draw! Restarting...";
    return setTimeout(restartGame, 2000);
  }

  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
}

function checkWin() {
  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function highlightWinner() {
  winningCombos.forEach(combo => {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      document.querySelector(`[data-index="${a}"]`).classList.add('winner');
      document.querySelector(`[data-index="${b}"]`).classList.add('winner');
      document.querySelector(`[data-index="${c}"]`).classList.add('winner');
    }
  });
}

function updateScore() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function updateLevel() {
  levelText.textContent = currentLevel;
}

function restartGame() {
  createBoard();
  if (currentMode === 'vsComputer' && currentPlayer === 'O') {
    computerMove();
  }
}

function resetAll() {
  scores = { X: 0, O: 0 };
  currentLevel = 1;
  updateScore();
  updateLevel();
  restartGame();
}

function changeMode() {
  currentMode = modeSelector.value;
  resetAll();
}

// Initial setup
changeMode();
