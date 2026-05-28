import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';

export class BasePage {
    constructor() {
        this.header = new Header();
        this.footer = new Footer();
    }

    async render() {
        this.header.render();
        this.footer.render();
    }

    attachEvents() {
        this.header.attachEvents();
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        if (path.includes('lab1-main.html')) return 'Главная';
        if (path.includes('lab1-interests.html')) return 'Мои интересы';
        if (path.includes('lab1-portfolio.html')) return 'Портфолио';
        if (path.includes('lab1-contacts.html')) return 'Контакты';
        return 'Главная';
    }
}