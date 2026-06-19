import { BasePage } from './BasePage.js';
import { PROJECTS } from '../data/projects.js';
import { Calculator } from '../components/Calculator.js';
import { fetchCharacters, filterCharacters } from '../utils/api.js';

export class PortfolioPage extends BasePage {
    constructor() {
        super();
        this.calculator = new Calculator();
        this.filteredProjects = [...PROJECTS];
        this.techOptions = [];
        this.characters = [];
        this.filteredCharacters = [];
        this.isLoading = false;
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

    renderTable(data) {
        const container = document.getElementById('table-container');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p style="padding: 20px;">Нет данных для отображения</p>';
            return;
        }

        const rowsHtml = data.map(character => `
            <tr>
                <td><img src="${character.image}" alt="${character.name}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
                <td><strong>${character.name}</strong></td>
                <td>${character.status}</td>
                <td>${character.species}</td>
                <td>${character.gender}</td>
                <td>${character.origin?.name || 'Неизвестно'}</td>
                <td>${character.location?.name || 'Неизвестно'}</td>
            </tr>
        `).join('');

        container.innerHTML = `
			<p style="margin-top: 10px; text-align: center;">Всего персонажей: ${data.length}</p>
            <div style="overflow-x: auto; margin: 20px 0; max-height: 800px; overflow-y:auto;">
                <table style="width: 100%; border-collapse: collapse; background: white;">
                    <thead>
                        <tr style="background: #333; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Аватар</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Имя</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Статус</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Вид</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Пол</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Происхождение</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Локация</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    }

    applyTableFilters() {
        const searchTerm = document.getElementById('table-search')?.value.toLowerCase() || '';
        const status = document.getElementById('status-filter')?.value || '';
        const gender = document.getElementById('gender-filter')?.value || '';

        this.filteredCharacters = filterCharacters(this.characters, searchTerm, status, gender);
        this.renderTable(this.filteredCharacters);
    }

    async loadTableData() {
        if (this.isLoading) return;
        
        const container = document.getElementById('table-container');
        if (!container) return;

        this.isLoading = true;
        container.innerHTML = '<p style="padding: 20px;">Загрузка данных...</p>';

        try {
            this.characters = await fetchCharacters();
            this.filteredCharacters = [...this.characters];
            this.renderTable(this.filteredCharacters);
        } catch (error) {
            container.innerHTML = `<p style="padding: 20px; color: red;">Ошибка загрузки данных: ${error.message}</p>`;
        } finally {
            this.isLoading = false;
        }
    }

    async render() {
        await super.render();
        this.renderFilters();
        this.renderProjects();
        this.calculator.render();
        
        const container = document.getElementById('table-container');
        if (container && this.characters.length === 0) {
            container.innerHTML = '<p style="padding: 20px;">Нажмите "Загрузить данные", чтобы получить информацию о персонажах</p>';
        }
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

        const tableSearch = document.getElementById('table-search');
        const statusFilter = document.getElementById('status-filter');
        const genderFilter = document.getElementById('gender-filter');
        const loadButton = document.getElementById('load-table-data');

        if (tableSearch) {
            tableSearch.addEventListener('input', () => this.applyTableFilters());
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyTableFilters());
        }

        if (genderFilter) {
            genderFilter.addEventListener('change', () => this.applyTableFilters());
        }

        if (loadButton) {
            loadButton.addEventListener('click', () => this.loadTableData());
        }
    }
}