import { BasePage } from './BasePage.js';
import { CONTACT_INFO } from '../data/constants.js';
import { CommentSystem } from '../components/CommentSystem.js';

export class ContactsPage extends BasePage {
    constructor() {
        super();
        this.commentSystem = new CommentSystem();
    }

    async render() {
        await super.render();
        
        const contactsContent = document.getElementById('contacts-content');
        if (contactsContent) {
            contactsContent.innerHTML = `
                <p>Почта: ${CONTACT_INFO.email}</p>
                <p>Телефон: ${CONTACT_INFO.phone}</p>
            `;
        }
        
        this.commentSystem.render();
        this.commentSystem.loadComments();
    }

    attachEvents() {
        super.attachEvents();
        this.commentSystem.attachEvents();
    }
}