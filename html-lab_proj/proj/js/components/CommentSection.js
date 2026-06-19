import { API_URL } from '../data/constants.js';
import { localComments } from '../data/localComments.js';
import { escapeHtml } from '../utils/helpers.js';

export class CommentSection {
  constructor(container, getHighScoreFn) {
    this.container = container;
    this.getHighScore = getHighScoreFn;
    this.comments = [];
    this.loading = true;
    this.filteredComments = [];
    this.elements = {};
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="card-title">Комментарии <span class="badge" id="commentCount">0</span></div>
      <div class="filter-bar">
        <input type="text" id="searchInput" placeholder="Поиск по нику или тексту" style="flex:2;">
        <select id="sortSelect">
          <option value="score_desc">По рекорду ↓</option>
          <option value="score_asc">По рекорду ↑</option>
          <option value="nick_asc">По нику А–Я</option>
          <option value="nick_desc">По нику Я–А</option>
        </select>
      </div>
      <div id="commentListContainer" class="comment-list">
        <div class="spinner"></div>
      </div>
      <form id="commentForm" class="comment-form">
        <div class="form-row">
          <div class="form-group">
            <label>Ник (обяз.)</label>
            <input type="text" class="form-control" id="nickInput" placeholder="Ваш ник" required minlength="2" maxlength="20">
            <div class="error-text" id="nickError"></div>
          </div>
          <div class="form-group">
            <label>Рекорд</label>
            <input type="number" class="form-control" id="scoreInput" placeholder="0" readonly disabled>
            <div class="error-text" id="scoreError"></div>
          </div>
        </div>
        <div class="form-group">
          <label>Комментарий (обяз.)</label>
          <input type="text" class="form-control" id="commentTextInput" placeholder="Ваш комментарий" required minlength="3" maxlength="120">
          <div class="error-text" id="commentError"></div>
        </div>
        <button type="submit" class="btn btn-primary" id="submitCommentBtn" style="align-self: flex-start;" disabled>Отправить</button>
        <div id="formStatus" style="font-size:0.85rem; min-height:22px;"></div>
      </form>
    `;

    this.elements = {
      searchInput: this.container.querySelector('#searchInput'),
      sortSelect: this.container.querySelector('#sortSelect'),
      commentList: this.container.querySelector('#commentListContainer'),
      commentCount: this.container.querySelector('#commentCount'),
      form: this.container.querySelector('#commentForm'),
      nickInput: this.container.querySelector('#nickInput'),
      scoreInput: this.container.querySelector('#scoreInput'),
      commentTextInput: this.container.querySelector('#commentTextInput'),
      nickError: this.container.querySelector('#nickError'),
      scoreError: this.container.querySelector('#scoreError'),
      commentError: this.container.querySelector('#commentError'),
      submitBtn: this.container.querySelector('#submitCommentBtn'),
      formStatus: this.container.querySelector('#formStatus'),
    };

    this.updateScoreField();

    this.elements.searchInput.addEventListener('input', () => this.applyFiltersAndSort());
    this.elements.sortSelect.addEventListener('change', () => this.applyFiltersAndSort());

    this.setupValidation();

    this.fetchComments();
  }

  updateScoreField() {
    const currentHighScore = this.getHighScore();
    this.elements.scoreInput.value = currentHighScore;
    if (currentHighScore === 0) {
      this.elements.submitBtn.disabled = true;
      this.elements.formStatus.textContent = 'Чтобы оставить комментарий, необходимо набрать хотя бы 1 очко.';
    } else {
      this.elements.submitBtn.disabled = false;
      this.elements.formStatus.textContent = '';
    }
  }

  setupValidation() {
    const validateField = (field) => {
      let valid = true;
      if (field === 'nick' || field === 'all') {
        const val = this.elements.nickInput.value.trim();
        if (val.length < 2 || val.length > 20) {
          this.elements.nickError.textContent = 'Ник от 2 до 20 символов';
          this.elements.nickInput.classList.add('error');
          valid = false;
        } else {
          this.elements.nickError.textContent = '';
          this.elements.nickInput.classList.remove('error');
        }
      }
      if (field === 'comment' || field === 'all') {
        const val = this.elements.commentTextInput.value.trim();
        if (val.length < 3 || val.length > 120) {
          this.elements.commentError.textContent = 'Комментарий от 3 до 120 символов';
          this.elements.commentTextInput.classList.add('error');
          valid = false;
        } else {
          this.elements.commentError.textContent = '';
          this.elements.commentTextInput.classList.remove('error');
        }
      }
      return valid;
    };

    const validateAll = () => {
      const nickOk = validateField('nick');
      const commentOk = validateField('comment');
      const highScore = this.getHighScore();
      const ok = nickOk && commentOk && highScore > 0;
      this.elements.submitBtn.disabled = !ok;
      return ok;
    };

    this.elements.nickInput.addEventListener('blur', () => { validateField('nick'); validateAll(); });
    this.elements.commentTextInput.addEventListener('blur', () => { validateField('comment'); validateAll(); });
    this.elements.nickInput.addEventListener('input', validateAll);
    this.elements.commentTextInput.addEventListener('input', validateAll);

    this.validateAll = validateAll;
    this.validateField = validateField;

    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateAll()) {
        this.elements.formStatus.textContent = 'Исправьте ошибки в форме';
        return;
      }
      const newComment = {
        id: 'local_' + Date.now(),
        nick: this.elements.nickInput.value.trim(),
        score: parseInt(this.elements.scoreInput.value) || 0,
        text: this.elements.commentTextInput.value.trim(),
      };
      this.comments.push(newComment);
      this.applyFiltersAndSort();
      this.elements.form.reset();
      this.elements.submitBtn.disabled = true;
      this.elements.formStatus.textContent = 'Комментарий добавлен!';
      setTimeout(() => this.elements.formStatus.textContent = '', 2500);
      this.updateScoreField();
    });
  }

  fetchComments() {
    this.loading = true;
    this.renderCommentList();

    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API недоступен');
        return res.json();
      })
      .then(data => {
        const apiComments = data.slice(0, 4).map((item, idx) => ({
          id: 'api_' + item.id,
          nick: 'User' + (idx + 1),
          score: Math.floor(Math.random() * 80) + 5,
          text: item.title.slice(0, 60),
        }));
        this.comments = [...apiComments, ...localComments];
        this.loading = false;
        this.applyFiltersAndSort();
      })
      .catch(err => {
        console.warn('API ошибка, загружаем локальные данные', err);
        this.comments = [...localComments];
        this.loading = false;
        this.applyFiltersAndSort();
        this.elements.formStatus.textContent = 'API недоступен, загружены локальные данные';
      });
  }

  getFilteredAndSorted() {
    const search = this.elements.searchInput.value.trim().toLowerCase();
    const sortVal = this.elements.sortSelect.value;
    let list = this.comments.filter(c => {
      if (!search) return true;
      return c.nick.toLowerCase().includes(search) || c.text.toLowerCase().includes(search);
    });
    if (sortVal === 'score_desc') list.sort((a,b) => b.score - a.score);
    else if (sortVal === 'score_asc') list.sort((a,b) => a.score - b.score);
    else if (sortVal === 'nick_asc') list.sort((a,b) => a.nick.localeCompare(b.nick));
    else if (sortVal === 'nick_desc') list.sort((a,b) => b.nick.localeCompare(a.nick));
    return list;
  }

  applyFiltersAndSort() {
    this.updateScoreField();
    this.renderCommentList();
  }

  renderCommentList() {
    const container = this.elements.commentList;
    if (this.loading) {
      container.innerHTML = '<div class="spinner"></div>';
      return;
    }
    const filtered = this.getFilteredAndSorted();
    this.elements.commentCount.textContent = filtered.length;
    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-message">Нет комментариев</div>';
      return;
    }
    container.innerHTML = filtered.map(c => `
      <div class="comment-item" data-id="${c.id}">
        <div class="comment-meta">
          <span class="comment-nick">${escapeHtml(c.nick)}</span>
          <span class="comment-score">Рекорд:${c.score}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
      </div>
    `).join('');
  }
}