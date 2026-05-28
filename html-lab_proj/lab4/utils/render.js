
export const renderList = (containerId, items, renderItemFn) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const html = items.map(renderItemFn).join('');
    container.innerHTML = html;
};

export const renderComponent = (containerId, component) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = component.render();
    if (component.attachEvents) {
        component.attachEvents();
    }
};

export const toggleVisibility = (elementId, show) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
};