import { BasePage } from './BasePage.js';
import { SnakeGame } from '../components/SnakeGame.js';
import { CommentSection } from '../components/CommentSection.js';

export class GamePage extends BasePage {
  constructor(container) {
    super(container);
    this.snakeGame = null;
    this.commentSection = null;
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="card game-area" id="gameArea"></div>
        <div class="card comment-section" id="commentArea"></div>
      </div>
    `;

    const gameContainer = this.container.querySelector('#gameArea');
    const commentContainer = this.container.querySelector('#commentArea');

    this.snakeGame = new SnakeGame(gameContainer);
    this.snakeGame.render();

    this.commentSection = new CommentSection(
      commentContainer,
      () => this.snakeGame.getHighScore()
    );
    this.commentSection.render();
  }
}