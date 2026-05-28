import { BasePage } from './BasePage.js';
import { SITE_AUTHOR } from '../data/constants.js';

export class MainPage extends BasePage {
    constructor() {
        super();
        this.visitCount = 0;
        this.stayTimes = [];
        this.currentStartTime = Date.now();
        this.initVisitTracking();
    }

    initVisitTracking() {
        if (localStorage.getItem('visitcount')) {
            this.visitCount = parseInt(localStorage.getItem('visitcount'));
        }
        this.visitCount++;
        localStorage.setItem('visitcount', this.visitCount);

        if (localStorage.getItem('staytimes')) {
            this.stayTimes = JSON.parse(localStorage.getItem('staytimes'));
        }
    }

    calculateAverageTime() {
        if (this.stayTimes.length === 0) return '0 секунд';
        
        const sum = this.stayTimes.reduce((acc, time) => acc + time, 0);
        const avg = sum / this.stayTimes.length;
        
        if (avg > 60) {
            return `${Math.floor(avg / 60)} минут ${Math.floor(avg % 60)} секунд`;
        }
        return `${Math.floor(avg)} секунд`;
    }

    async render() {
        await super.render();
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div>Я - Аксёнов Сергей Евгеньевич, студент бакалавр ТюмГУ, учусь в ШКН на направление Информационные Системы и Технологии. Этот сайт создан для изучения HTML.</div>
            `;
        }

        const countSpan = document.getElementById('count');
        const avgSpan = document.getElementById('avg');
        
        if (countSpan) countSpan.innerHTML = this.visitCount;
        if (avgSpan) avgSpan.innerHTML = this.calculateAverageTime();
    }

    attachEvents() {
        super.attachEvents();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.floor((Date.now() - this.currentStartTime) / 1000);
            this.stayTimes.push(timeSpent);
            
            if (this.stayTimes.length > 15) {
                this.stayTimes = this.stayTimes.slice(6, 16);
            }
            localStorage.setItem('staytimes', JSON.stringify(this.stayTimes));
        });
    }
}