/* ============================================================
   Aviv Flower — HARMONIE brand word coloring
   Wraps every visible occurrence of the word HARMONIE in a
   span painted with the brand's colorful piano-key palette.
   Runs on static text after the page loads; skips scripts,
   styles and form fields.
   ============================================================ */
(function () {
  'use strict';

  var RE = /\b(HARMONIE|Harmonie)\b/g;
  var SKIP = { SCRIPT: 1, STYLE: 1, TITLE: 1, TEXTAREA: 1, OPTION: 1, NOSCRIPT: 1 };

  function walk(node) {
    if (node.nodeType === 1) { /* element */
      if (SKIP[node.tagName]) return;
      if (node.classList && node.classList.contains('harmonie')) return;
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(walk);
    } else if (node.nodeType === 3 && RE.test(node.nodeValue)) { /* text */
      RE.lastIndex = 0;
      var txt = node.nodeValue;
      var frag = document.createDocumentFragment();
      var last = 0;
      var m;
      while ((m = RE.exec(txt))) {
        if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        var s = document.createElement('span');
        s.className = 'harmonie';
        s.textContent = m[0];
        frag.appendChild(s);
        last = m.index + m[0].length;
      }
      if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  walk(document.body);
})();
