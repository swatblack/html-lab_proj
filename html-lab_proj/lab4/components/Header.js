import { NAV_ITEMS, SITE_AUTHOR, COPYRIGHT_YEAR } from '../data/constants.js';

export class Header {
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
        const headerElement = document.getElementById('header-placeholder');
        if (!headerElement) return;

        const navLinksDesktop = NAV_ITEMS.map(item => {
            const isCurrent = item.name === this.currentPage;
            return `<a href="${item.link}" ${isCurrent ? 'class="currentpage"' : ''}>${item.name}</a>`;
        }).join('');

        const navLinksMobile = NAV_ITEMS.map(item => {
            const isCurrent = item.name === this.currentPage;
            return `<a href="${item.link}" ${isCurrent ? 'class="currentpage"' : ''}>${item.name}</a><br>`;
        }).join('');

        headerElement.innerHTML = `
            <div class="desktop">
                <nav>${navLinksDesktop}</nav>
            </div>
            <div class="mobile">
                <label>
                    <input type="checkbox" id="bmenutog">
                    ☰
                    <nav id="bmenu">
                        ${navLinksMobile}
                        <b>${SITE_AUTHOR} © ${COPYRIGHT_YEAR}</b>
                    </nav>
                </label>
            </div>
        `;
    }

    attachEvents() {
    }
}