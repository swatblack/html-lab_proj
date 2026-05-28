import { BasePage } from './BasePage.js';
import { INTERESTS } from '../data/constants.js';

export class InterestsPage extends BasePage {
    constructor() {
        super();
    }

    async render() {
        await super.render();
        
        const interestsList = document.getElementById('interests-list');
        const interestsDetails = document.getElementById('interests-details');
        
        if (interestsList) {
            const listItems = INTERESTS.map(interest => 
                `<li><a href="#${interest.id}">${interest.name} ${interest.icon}</a></li>`
            ).join('');
            
            interestsList.innerHTML = listItems;
        }
        
        if (interestsDetails) {
            let detailsHtml = '';
            INTERESTS.forEach(interest => {
                detailsHtml += `
                    <div>
                        <h2><a name="${interest.id}">${interest.name} ${interest.icon}</a></h2>
                        <a href="#top">Обратно наверх</a>
                        <p>${interest.description}</p>
                    </div>
                `;
            });
            interestsDetails.innerHTML = detailsHtml;
        }
        
        const mainDiv = document.getElementById('interests-content');
        if (mainDiv) {
            mainDiv.innerHTML = `
                <p>Все люди уникальны и увлекаются своими вещами, и я не исключение. Меня в основном увлекают видеоигры, писательство и кодирование. На этой странице я детально описываю каждый из них.</p>
            `;
        }
    }

    attachEvents() {
        super.attachEvents();
    }
}