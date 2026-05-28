
import { MainPage } from '../pages/MainPage.js';
import { InterestsPage } from '../pages/InterestsPage.js';
import { PortfolioPage } from '../pages/PortfolioPage.js';
import { ContactsPage } from '../pages/ContactsPage.js';

const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path.includes('lab1-main.html')) return 'main';
    if (path.includes('lab1-interests.html')) return 'interests';
    if (path.includes('lab1-portfolio.html')) return 'portfolio';
    if (path.includes('lab1-contacts.html')) return 'contacts';
    return 'main';
};


const initPage = async () => {
    const pageName = getCurrentPage();
    let page;

    switch (pageName) {
        case 'main':
            page = new MainPage();
            break;
        case 'interests':
            page = new InterestsPage();
            break;
        case 'portfolio':
            page = new PortfolioPage();
            break;
        case 'contacts':
            page = new ContactsPage();
            break;
        default:
            page = new MainPage();
    }

    await page.render();
    page.attachEvents();
};

document.addEventListener('DOMContentLoaded', initPage);