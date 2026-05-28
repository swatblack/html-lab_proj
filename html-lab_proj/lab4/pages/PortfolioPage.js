import { BasePage } from './BasePage.js';
import { PROJECTS } from '../data/projects.js';
import { Calculator } from '../components/Calculator.js';

export class PortfolioPage extends BasePage {
    constructor() {
        super();
        this.calculator = new Calculator();
        this.filteredProjects = [...PROJECTS];
        this.techOptions = [];
        this.initTechOptions();
    }

    initTechOptions() {
        const techSet = new Set();
        PROJECTS.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        this.techOptions = Array.from(techSet);
    }

    renderProjects() {
        const container = document.getElementById('cardcontainer');
        if (!container) return;
        const projectsHtml = this.filteredProjects.map(project => `
            <figure>
                <figcaption>${project.title}</figcaption>
                <img src="static/${project.image}" class="modimg" alt="${project.title}">
                <p class="cardtext">${project.description}</p>
                <p><strong>Технологии:</strong> ${project.technologies.join(', ')}</p>
                <a target="_blank" href="${project.link}">Страница мода</a>
            </figure>
        `).join('');

        container.innerHTML = projectsHtml;
    }

    renderFilters() {
        const techFilter = document.getElementById('tech-filter');
        if (!techFilter) return;
        const optionsHtml = this.techOptions.map(tech => 
            `<option value="${tech}">${tech}</option>`
        ).join('');
        
        techFilter.innerHTML = '<option value="">Все технологии</option>' + optionsHtml;
    }

    applyFilters() {
        const searchTerm = document.getElementById('search-filter')?.value.toLowerCase() || '';
        const techTerm = document.getElementById('tech-filter')?.value;

        this.filteredProjects = PROJECTS.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm);
            const matchesTech = !techTerm || project.technologies.includes(techTerm);
            return matchesSearch && matchesTech;
        });

        this.renderProjects();
    }

    async render() {
        await super.render();
        this.renderFilters();
        this.renderProjects();
        this.calculator.render();
    }

    attachEvents() {
        super.attachEvents();
        
        const searchInput = document.getElementById('search-filter');
        const techSelect = document.getElementById('tech-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }
        
        if (techSelect) {
            techSelect.addEventListener('change', () => this.applyFilters());
        }
    }
}