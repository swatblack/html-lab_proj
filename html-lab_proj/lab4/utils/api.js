const API_BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/character?page=${page}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.info.next) {
            const nextPage = await fetchCharacters(page + 1);
            return [...data.results, ...nextPage];
        }
        
        return data.results;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
};

export const filterCharacters = (characters, searchTerm = '', status = '', gender = '') => {
    return characters.filter(character => {
        const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !status || character.status === status;
        
        const matchesGender = !gender || character.gender === gender;
        
        return matchesSearch && matchesStatus && matchesGender;
    });
};

export const fetchCharacterById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/character/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching character:', error);
        throw error;
    }
};

export const fetchCharactersByIds = async (ids) => {
    try {
        const response = await fetch(`${API_BASE_URL}/character/${ids.join(',')}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
};