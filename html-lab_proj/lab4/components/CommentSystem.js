import { DEFAULT_AVATAR, MAX_AVATAR_SIZE_KB } from '../data/constants.js';

export class CommentSystem {
    constructor() {
        this.comments = [];
        this.loadComments();
    }

    loadComments() {
        const saved = localStorage.getItem('comments');
        if (saved) {
            this.comments = JSON.parse(saved);
        } else {
            this.comments = [{
                id: Date.now(),
                firstName: 'Ваня',
                lastName: 'Печкин',
                patronymic: 'Тараканович',
                message: 'твой сайт - гавно!',
                avatar: DEFAULT_AVATAR,
                timestamp: Date.now()
            }];
            this.saveComments();
        }
        this.renderComments();
    }

    saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    }

    renderComments() {
        const container = document.getElementById('comments-list');
        if (!container) return;

        const commentsHtml = [...this.comments]
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(comment => `
                <div class="comment">
                    <img class="commenticon" src="${comment.avatar}" width="100" height="100">
                    <p class="namefield">
                        Имя:${comment.firstName}<br/>
                        Фамилия:${comment.lastName}<br/>
                        Отчество:${comment.patronymic}
                    </p>
                    <p class="commentcontent">${comment.message.replace(/\n/g, '<br>')}</p>
                </div>
            `).join('');

        container.innerHTML = commentsHtml;
    }

    validateFIO(fio) {
        const parts = fio.trim().split(' ');
        if (parts.length !== 3) {
            alert('ФИО должно состоять из трёх слов!');
            return null;
        }
        return {
            lastName: parts[0],
            firstName: parts[1],
            patronymic: parts[2]
        };
    }

    validateMessage(message) {
        if (!message || !message.trim()) {
            alert('Не оставляйте пустых комментариев, напишите хоть что-то!');
            return false;
        }
        return true;
    }

    async validateAvatar(file) {
        if (!file) return DEFAULT_AVATAR;
        
        const sizeKB = Math.round(file.size / 1024);
        if (sizeKB > MAX_AVATAR_SIZE_KB) {
            const useDefault = confirm('Размер картинки превышает 5МБ!\nИспользовать аватарку по умолчанию?');
            return useDefault ? DEFAULT_AVATAR : null;
        }
		
		if (!['png', 'jpeg', 'jpg', 'bmp', 'gif'].includes(file.name.split('.').pop())){//если расширение файла не является одним из перечисленных
			const useDefault = confirm('Файл не подходящего формата!\nИспользовать аватарку по умолчанию?');
            return useDefault ? DEFAULT_AVATAR : null;
		}
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    async submitComment(event) {
        if (event) event.preventDefault();
        
        const fioInput = document.getElementById('fio');
        const messageInput = document.getElementById('message');
        const messageMobile = document.getElementById('messagemobile');
        const avatarInput = document.getElementById('uploadav');
        
        const fio = fioInput?.value || '';
        const message = messageInput?.value || messageMobile?.value || '';
        const avatar = avatarInput?.files[0];
        
        const nameParts = this.validateFIO(fio);
        if (!nameParts) return;
        
        if (!this.validateMessage(message)) return;
        
        const avatarUrl = await this.validateAvatar(avatar);
        if (avatarUrl === null) return;
        
        const newComment = {
            id: Date.now(),
            ...nameParts,
            message: message,
            avatar: avatarUrl,
            timestamp: Date.now()
        };
        
        this.comments.push(newComment);
        this.saveComments();
        this.renderComments();
        
        if (fioInput) fioInput.value = '';
        if (messageInput) messageInput.value = '';
        if (messageMobile) messageMobile.value = '';
        if (avatarInput) avatarInput.value = '';
    }

    render() {
        const container = document.getElementById('comment-form-placeholder');
        if (!container) return;
        
        container.innerHTML = `
            <form id="commenting">
                <label for="fio">ФИО:</label>
                <input type="text" id="fio" name="fio"><br>
                <label for="uploadav" id="ihatemobileusers">Аватарка (при желании):</label>
                <input type="file" id="uploadav" name="uploadav" accept="image/*"><br>
                <label for="message">Комментарий</label><br>
                <textarea id="message" name="message" rows="4" cols="50"></textarea><br>
                <textarea id="messagemobile" name="messagemobile" rows="4" cols="20"></textarea><br>
                <button type="submit">Отправить</button>
            </form>
        `;
        
        this.attachEvents();
    }

    attachEvents() {
        const form = document.getElementById('commenting');
        if (form) {
            form.onsubmit = (e) => this.submitComment(e);
        }
        
        const fioInput = document.getElementById('fio');
        if (fioInput) {
            fioInput.onkeydown = (e) => {
                const key = e.key;
                if (/[^А-я ]/.test(key) && key !== 'Backspace') {
                    e.preventDefault();
                }
            };
        }
    }
}