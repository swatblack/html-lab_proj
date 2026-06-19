export class Header {
  render(container) {
    const header = document.createElement('header');
    header.style.cssText = 'padding: 16px 0; text-align: center; font-size: 1.5rem; color: #b6cdff;';
    header.textContent = 'Змейка';
    container.prepend(header);
  }
}