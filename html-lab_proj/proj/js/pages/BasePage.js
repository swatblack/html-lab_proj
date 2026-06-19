export class BasePage {
  constructor(container) {
    if (!container) throw new Error('Container element is required');
    this.container = container;
  }

  render() {
    this.container.innerHTML = '';
  }

  createElement(tag, className, innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.innerHTML = innerHTML;
    return el;
  }
}