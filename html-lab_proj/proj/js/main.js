import { GamePage } from './pages/GamePage.js';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  const page = new GamePage(appContainer);
  page.render();
});