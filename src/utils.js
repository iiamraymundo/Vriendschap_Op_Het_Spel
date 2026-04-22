// Kleine hulpfuncties voor DOM / events / rand.

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'html') node.innerHTML = value;
    else if (key in node && typeof node[key] !== 'object') node[key] = value;
    else node.setAttribute(key, value);
  }

  const kids = Array.isArray(children) ? children : [children];
  for (const kid of kids) {
    if (kid == null || kid === false) continue;
    if (typeof kid === 'string' || typeof kid === 'number') {
      node.appendChild(document.createTextNode(String(kid)));
    } else {
      node.appendChild(kid);
    }
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function randomInt(minInclusive, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** Back-pijl SVG. */
export function backIcon() {
  const span = document.createElement('span');
  span.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  return span.firstChild;
}

/** Hamburger icon. */
export function menuIcon() {
  const span = document.createElement('span');
  span.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  return span.firstChild;
}
