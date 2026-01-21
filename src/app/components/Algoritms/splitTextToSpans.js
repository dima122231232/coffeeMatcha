export function splitTextToSpans(selector, { className = "word" } = {}) {
  const roots =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : selector instanceof NodeList
      ? selector
      : [selector];

  roots.forEach(root => {
    if (!root || root.dataset.splitted) return;
    root.dataset.splitted = "1";

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];

    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeValue && n.nodeValue.match(/\S/)) nodes.push(n);
    }

    nodes.forEach(node => {
      const text = node.nodeValue; // не trim()
      const frag = document.createDocumentFragment();

      // Токены: пробелы отдельно, всё остальное (слово или символы) — отдельно
      const parts = text.match(/\s+|[^\s]+/gu) || [text];

      for (const part of parts) {
        if (/^\s+$/u.test(part)) {
          frag.appendChild(document.createTextNode(part)); // сохраняем пробелы как есть
        } else {
          const span = document.createElement("span");
          if (className) span.className = className;
          span.textContent = part; // тут может быть "hello" или "#$%<>?"
          frag.appendChild(span);
        }
      }

      node.parentNode.replaceChild(frag, node);
    });
  });
}
