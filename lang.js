/* ============================================================
   Aviv Flower — language switcher behaviour
   Click-to-open dropdown. The button label reflects the page's
   own language; menu items with a real href navigate to the
   other language's version, items with href="#" are the current
   language and stay put. The choice is remembered.
   ============================================================ */
(function () {
  'use strict';

  var lang = document.querySelector('.lang');
  if (!lang) return;

  var btn = lang.querySelector('.lang-btn');
  var menu = lang.querySelector('.lang-menu');
  var items = menu.querySelectorAll('a');
  var STORE_KEY = 'aviv-lang';

  var pageLang = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  var LABELS = { en: 'EN', zh: '中文' };

  /* tag items by language: an item with lang="zh-CN" is Chinese, otherwise English */
  items.forEach(function (a) {
    var code = (a.getAttribute('lang') || 'en').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
    a.setAttribute('data-lang', code);
    if (code === pageLang) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });

  /* button label = the language of the page being read */
  for (var i = 0; i < btn.childNodes.length; i++) {
    var n = btn.childNodes[i];
    if (n.nodeType === 3 && n.nodeValue.trim()) {
      n.nodeValue = ' ' + LABELS[pageLang] + ' ';
      break;
    }
  }

  function toggle(open) {
    lang.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) items[0].focus();
  }

  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function () {
    toggle(!lang.classList.contains('open'));
  });

  items.forEach(function (a) {
    a.addEventListener('click', function (e) {
      try { localStorage.setItem(STORE_KEY, a.getAttribute('data-lang')); } catch (err) {}
      if (a.getAttribute('href') === '#') { /* already on this language */
        e.preventDefault();
        toggle(false);
      }
      /* real hrefs navigate to the other language's page */
    });
  });

  document.addEventListener('click', function (e) {
    if (!lang.contains(e.target)) toggle(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lang.classList.contains('open')) {
      toggle(false);
      btn.focus();
    }
  });
})();
