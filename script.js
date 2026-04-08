const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startGameBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const timerDisplay = document.getElementById('timer');
const gameOverText = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const hsStatus = document.getElementById('hs-status');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const progressFill = document.getElementById('progress-fill');
const statusText = document.getElementById('status-text');
const statusScore = document.getElementById('status-score');

let lastHole;
let timeUp = false;
let score = 0;
let gameTimer;
let countdown;
let highScore = parseInt(localStorage.getItem('smashEmHighScore') || '0', 10);
const GAME_DURATION = 15;

highScoreDisplay.textContent = highScore;
if (hsStatus) hsStatus.textContent = highScore;

// ---- Taskbar clock ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const clock = document.getElementById('taskbar-clock');
  if (clock) clock.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// ---- Game Logic ----
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
  const time = randomTime(800, 1800);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) showMole();
  }, time);
}

function startGame() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  score = 0;
  scoreBoard.textContent = 0;
  statusScore.textContent = 0;
  timerDisplay.textContent = GAME_DURATION;
  timeUp = false;
  gameOverText.style.display = 'none';
  restartBtn.style.display = 'none';
  if (statusText) statusText.textContent = 'Game running...';

  // Progress bar
  progressFill.style.transition = 'none';
  progressFill.style.width = '100%';
  // Force reflow then animate
  progressFill.getBoundingClientRect();
  progressFill.style.transition = `width ${GAME_DURATION}s linear`;
  progressFill.style.width = '0%';

  showMole();

  let timeLeft = GAME_DURATION;
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
  }, GAME_DURATION * 1000);
}

function endGame() {
  clearInterval(countdown);
  clearTimeout(gameTimer);
  timeUp = true;
  timerDisplay.textContent = 0;
  progressFill.style.width = '0%';
  gameOverText.style.display = 'block';
  finalScoreDisplay.textContent = score;
  restartBtn.style.display = 'inline-flex';
  if (statusText) statusText.textContent = 'Game Over!';

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('smashEmHighScore', highScore);
    highScoreDisplay.textContent = highScore;
    if (hsStatus) hsStatus.textContent = highScore;
  }
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
  statusScore.textContent = score;
}

function showStartScreen() {
  startScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  clearInterval(countdown);
  clearTimeout(gameTimer);
  timeUp = true;
  highScoreDisplay.textContent = highScore;
  if (hsStatus) hsStatus.textContent = highScore;
}

document.querySelectorAll('.mole').forEach(mole => {
  mole.addEventListener('click', bonk);
});

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', showStartScreen);
