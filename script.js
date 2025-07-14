const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startGameBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const timerDisplay = document.getElementById('timer');
const gameOverText = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');

let lastHole;
let timeUp = false;
let score = 0;
let gameTimer;
let countdown;
let highScore = localStorage.getItem('smashEmHighScore') || 0;

highScoreDisplay.textContent = highScore;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

function showMole() {
  const time = randomTime(1000, 2000);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) showMole();
  }, time);
}

function startGame() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  score = 0;
  scoreBoard.textContent = 0;
  timerDisplay.textContent = 15;
  timeUp = false;
  gameOverText.style.display = 'none';
  restartBtn.style.display = 'none';
  showMole();
  let timeLeft = 15;
  clearInterval(countdown);
  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  clearTimeout(gameTimer);
  gameTimer = setTimeout(() => {
    endGame();
  }, 15000);
}

function endGame() {
  clearInterval(countdown);
  clearTimeout(gameTimer);
  timeUp = true;
  gameOverText.style.display = 'block';
  finalScoreDisplay.textContent = score;
  restartBtn.style.display = 'inline-block';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('smashEmHighScore', highScore);
    highScoreDisplay.textContent = highScore;
  }
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

function showStartScreen() {
  startScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
}

document.querySelectorAll('.mole').forEach(mole => {
  mole.addEventListener('click', bonk);
});

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', showStartScreen);
