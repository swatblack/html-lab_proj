
export function createElement(tag, className, innerHTML = '') {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.innerHTML = innerHTML;
  return el;
}