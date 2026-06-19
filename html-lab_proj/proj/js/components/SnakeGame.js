import { GRID_SIZE, CELL_SIZE, CANVAS_SIZE } from '../data/constants.js';
import { randomInt } from '../utils/helpers.js';

export class SnakeGame {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.snake = [{x: 10, y: 10}];
    this.food = {x: 15, y: 10};
    this.direction = {dx: 1, dy: 0};
    this.nextDirection = {dx: 1, dy: 0};
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    this.gameOver = false;
    this.win = false;
    this.paused = false;
    this.gameInterval = null;
    this.scoreSpan = null;
    this.highScoreSpan = null;
  }

  render() {
    this.container.innerHTML = `
      <div class="card-title">Змейка</div>
      <canvas id="snakeCanvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
      <div class="score-panel">
        <span>Очки: <span id="scoreDisplay">0</span></span>
        <span>Рекорд: <span id="highScoreDisplay">${this.highScore}</span></span>
      </div>
      <div class="controls">
        <button class="btn btn-primary" id="restartBtn">Новая</button>
        <button class="btn" id="pauseToggleBtn">⏸</button>
      </div>
      <div style="margin-top: 6px; font-size:0.8rem; opacity:0.5;">← ↑ → ↓ / свайп</div>
    `;

    this.canvas = this.container.querySelector('#snakeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = this.container.querySelector('#scoreDisplay');
    this.highScoreSpan = this.container.querySelector('#highScoreDisplay');

    this.setupControls();
    this.resetGame();
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'ArrowUp') { e.preventDefault(); this.changeDirection(0, -1); }
      else if (key === 'ArrowDown') { e.preventDefault(); this.changeDirection(0, 1); }
      else if (key === 'ArrowLeft') { e.preventDefault(); this.changeDirection(-1, 0); }
      else if (key === 'ArrowRight') { e.preventDefault(); this.changeDirection(1, 0); }
    });

    let touchStartX = 0, touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      e.preventDefault();
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!touchStartX) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.changeDirection(dx > 0 ? 1 : -1, 0);
        } else {
          this.changeDirection(0, dy > 0 ? 1 : -1);
        }
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      }
    });

    this.container.querySelector('#restartBtn').addEventListener('click', () => {
      clearInterval(this.gameInterval);
      this.resetGame();
    });
    this.container.querySelector('#pauseToggleBtn').addEventListener('click', (e) => {
      if (this.gameOver) return;
      this.paused = !this.paused;
      e.target.textContent = this.paused ? '▶' : '⏸';
    });
  }

  changeDirection(dx, dy) {
    if (this.gameOver || this.paused) return;
    if ((this.direction.dx === -dx && this.direction.dy === -dy) ||
        (this.direction.dx === dx && this.direction.dy === dy)) return;
    this.nextDirection = {dx, dy};
  }

  resetGame() {
    this.snake = [{x: 10, y: 10}];
    this.direction = {dx: 1, dy: 0};
    this.nextDirection = {dx: 1, dy: 0};
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.paused = false;
    this.container.querySelector('#pauseToggleBtn').textContent = '⏸';
    this.scoreSpan.textContent = this.score;
    this.generateFood();
    this.draw();
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.gameTick(), 140);
  }

  generateFood() {
    const total = GRID_SIZE * GRID_SIZE;
    if (this.snake.length >= total) { this.win = true; this.gameOver = true; return false; }
    const free = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!this.snake.some(s => s.x === i && s.y === j)) free.push({x: i, y: j});
      }
    }
    if (free.length === 0) { this.win = true; this.gameOver = true; return false; }
    this.food = free[randomInt(0, free.length - 1)];
    return true;
  }

  gameTick() {
    if (this.paused || this.gameOver) return;
    this.direction = {...this.nextDirection};
    const head = {x: this.snake[0].x + this.direction.dx, y: this.snake[0].y + this.direction.dy};

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      this.gameOver = true; clearInterval(this.gameInterval); this.draw(); return;
    }
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.gameOver = true; clearInterval(this.gameInterval); this.draw(); return;
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.scoreSpan.textContent = this.score;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', this.highScore);
        this.highScoreSpan.textContent = this.highScore;
      }
      if (!this.generateFood()) { this.gameOver = true; clearInterval(this.gameInterval); this.draw(); return; }
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.6;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, this.canvas.height);
      ctx.stroke();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(this.canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }
    this.snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#6bb86b' : '#3f8a3f';
      ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
    ctx.fillStyle = '#e05959';
    ctx.beginPath();
    ctx.arc(this.food.x * CELL_SIZE + CELL_SIZE/2, this.food.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    if (this.gameOver) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 28px system-ui';
      ctx.textAlign = 'center';
	  ctx.backgroundColor = 'white';
      ctx.fillText(this.win ? 'ПОБЕДА!' : 'Игра окончена', this.canvas.width/2, this.canvas.height/2 - 10);
    }
  }

  getHighScore() {
    return this.highScore;
  }
}