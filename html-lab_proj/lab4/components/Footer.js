import { NAV_ITEMS, SITE_AUTHOR, COPYRIGHT_YEAR } from '../data/constants.js';

export class Footer {
    constructor() {
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('lab1-main.html')) return 'Главная';
        if (path.includes('lab1-interests.html')) return 'Мои интересы';
        if (path.includes('lab1-portfolio.html')) return 'Портфолио';
        if (path.includes('lab1-contacts.html')) return 'Контакты';
        return 'Главная';
    }

    render() {
        const footerElement = document.getElementById('footer-placeholder');
        if (!footerElement) return;

        const navLinks = NAV_ITEMS.map(item => {
            const isCurrent = item.name === this.currentPage;
            return `<a href="${item.link}" ${isCurrent ? 'class="currentpage"' : ''}>${item.name}</a>`;
        }).join('');

        footerElement.innerHTML = `
            <div class="desktop">
                <nav>${navLinks}</nav>
                <b>${SITE_AUTHOR} © ${COPYRIGHT_YEAR}</b>
            </div>
        `;
    }
}