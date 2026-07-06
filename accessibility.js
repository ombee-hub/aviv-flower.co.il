/* ============================================================
   Aviv Flower — Accessibility widget (English)
   Self-contained: injects its own styles, saves choices to
   localStorage, no external dependencies.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'aviv-a11y';

  /* ---------- localisation (label language follows the page language) ---------- */
  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var T = IS_ZH ? {
    title: '辅助功能', open: '打开辅助功能菜单', close: '关闭辅助功能菜单',
    reset: '重置所有设置', note: '无障碍与隐私声明',
    labels: {
      contrast: '对比度 +', links: '突出链接', bigtext: '放大文字', spacing: '文字间距',
      noanim: '暂停动画', noimg: '隐藏图片', dyslexia: '易读字体', cursor: '大光标',
      lineh: '行高', align: '文字对齐', gray: '灰度模式', guide: '阅读参考线'
    }
  } : {
    title: 'Accessibility', open: 'Open accessibility menu', close: 'Close accessibility menu',
    reset: 'Reset All Settings', note: 'Accessibility & privacy statement',
    labels: {}
  };

  /* ---------- feature definitions ---------- */
  var FEATURES = [
    { id: 'contrast',  label: 'Contrast +',       cycle: 3, icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>' },
    { id: 'links',     label: 'Highlight Links',  cycle: 2, icon: '<path d="M9 15l6-6"/><path d="M11 6l1.5-1.5a4 4 0 0 1 5.7 5.7L16.5 12"/><path d="M13 18l-1.5 1.5a4 4 0 0 1-5.7-5.7L7.5 12"/>' },
    { id: 'bigtext',   label: 'Bigger Text',      cycle: 4, icon: '<path d="M4 18V8m0 0h5m-5 0v5m8 5V6m0 0h8m-4 0v12" stroke-linecap="round"/>' },
    { id: 'spacing',   label: 'Text Spacing',     cycle: 2, icon: '<path d="M7 5h10M7 12h10M7 19h10M3 5v14M21 5v14"/>' },
    { id: 'noanim',    label: 'Pause Animations', cycle: 2, icon: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6m4-6v6"/>' },
    { id: 'noimg',     label: 'Hide Images',      cycle: 2, icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6M4 4l16 16"/>' },
    { id: 'dyslexia',  label: 'Readable Font',    cycle: 2, icon: '<path d="M6 18V6h6a4 4 0 0 1 0 8H6" stroke-linecap="round"/>' },
    { id: 'cursor',    label: 'Big Cursor',       cycle: 2, icon: '<path d="M6 4l12 8-6 1 3 6-3 1.5-3-6L6 18Z"/>' },
    { id: 'lineh',     label: 'Line Height',      cycle: 3, icon: '<path d="M10 6h11M10 12h11M10 18h11M5 4v16m0-16L3 6m2-2 2 2M5 20l-2-2m2 2 2-2"/>' },
    { id: 'align',     label: 'Align Text',       cycle: 2, icon: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>' },
    { id: 'gray',      label: 'Saturation',       cycle: 2, icon: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/>' },
    { id: 'guide',     label: 'Reading Guide',    cycle: 2, icon: '<path d="M3 12h18M7 8h10M7 16h10"/>' }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { state = {}; }

  /* ---------- injected styles ---------- */
  var css = [
    /* widget button + panel */
    '#a11y-btn{position:fixed;bottom:22px;left:22px;z-index:99998;width:52px;height:52px;border-radius:50%;',
    'background:#5f8a1e;color:#fff;border:2px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;padding:0}',
    '#a11y-btn:hover,#a11y-btn:focus-visible{background:#ec2028}',
    '#a11y-btn:focus-visible{outline:3px solid #26330f;outline-offset:2px}',
    '#a11y-btn svg{width:30px;height:30px}',
    '#a11y-panel{position:fixed;bottom:86px;left:22px;z-index:99999;width:300px;max-height:min(72vh,640px);overflow-y:auto;',
    'background:#fbfcf4;border:1px solid #dfe5cc;box-shadow:0 24px 60px -20px rgba(38,51,15,.5);border-radius:8px;',
    'font-family:"Assistant","Segoe UI",Arial,sans-serif;color:#26330f;display:none;padding:16px}',
    '#a11y-panel.open{display:block}',
    '#a11y-panel h2{font-size:17px;font-weight:700;margin:0 0 14px;display:flex;justify-content:space-between;align-items:center}',
    '#a11y-close{background:none;border:none;font-size:20px;cursor:pointer;color:#26330f;padding:2px 8px;border-radius:4px}',
    '#a11y-close:hover,#a11y-close:focus-visible{background:#ec2028;color:#fff}',
    '#a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.a11y-tile{background:#fff;border:1px solid #dfe5cc;border-radius:8px;padding:14px 8px 12px;cursor:pointer;',
    'display:flex;flex-direction:column;align-items:center;gap:8px;font-family:inherit;font-size:12.5px;font-weight:600;color:#26330f;position:relative}',
    '.a11y-tile:hover{border-color:#5f8a1e}',
    '.a11y-tile:focus-visible{outline:2px solid #ec2028;outline-offset:2px}',
    '.a11y-tile svg{width:26px;height:26px;stroke:#26330f;fill:none;stroke-width:1.7}',
    '.a11y-tile[aria-pressed="true"]{background:#5f8a1e;border-color:#5f8a1e;color:#fff}',
    '.a11y-tile[aria-pressed="true"] svg{stroke:#fff}',
    '.a11y-step{position:absolute;top:6px;right:8px;font-size:10.5px;font-weight:700}',
    '#a11y-reset{grid-column:1/-1;background:#1faa4b;color:#fff;border:none;border-radius:24px;padding:12px;margin-top:6px;',
    'font-family:inherit;font-size:14px;font-weight:700;cursor:pointer}',
    '#a11y-reset:hover,#a11y-reset:focus-visible{background:#ec2028}',
    '#a11y-note{font-size:11px;color:#6a7748;text-align:center;margin-top:10px}',
    '#a11y-note a{color:#5f8a1e;font-weight:600;text-decoration:underline}',
    '#a11y-guide-bar{position:fixed;left:0;right:0;height:10px;background:#ec2028;opacity:.85;z-index:99997;pointer-events:none;display:none}',

    /* feature effects */
    'html.a11y-contrast-1{filter:contrast(1.3)}',
    'html.a11y-contrast-2{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-contrast-2 img,html.a11y-contrast-2 video,html.a11y-contrast-2 figure.photo,html.a11y-contrast-2 .plate{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-links-1 a{text-decoration:underline!important;background:#fff34d!important;color:#0b2e8a!important}',
    'html.a11y-bigtext-1 body{font-size:19px!important}',
    'html.a11y-bigtext-2 body{font-size:21px!important}',
    'html.a11y-bigtext-3 body{font-size:24px!important}',
    'html.a11y-spacing-1 body{letter-spacing:.12em!important;word-spacing:.2em!important}',
    'html.a11y-noanim-1 *,html.a11y-noanim-1 *::before,html.a11y-noanim-1 *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    'html.a11y-noimg-1 img{visibility:hidden!important}',
    'html.a11y-dyslexia-1 body,html.a11y-dyslexia-1 h1,html.a11y-dyslexia-1 h2,html.a11y-dyslexia-1 h3,html.a11y-dyslexia-1 h4,html.a11y-dyslexia-1 p,html.a11y-dyslexia-1 a,html.a11y-dyslexia-1 span,html.a11y-dyslexia-1 li{font-family:Verdana,Arial,sans-serif!important;letter-spacing:.04em}',
    'html.a11y-cursor-1,html.a11y-cursor-1 *{cursor:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\' viewBox=\'0 0 24 24\'><path d=\'M5 2l14 10-7 1 4 8-4 2-4-8-3 5Z\' fill=\'black\' stroke=\'white\' stroke-width=\'1.4\'/></svg>") 4 2,auto!important}',
    'html.a11y-lineh-1 body,html.a11y-lineh-1 p,html.a11y-lineh-1 li{line-height:2!important}',
    'html.a11y-lineh-2 body,html.a11y-lineh-2 p,html.a11y-lineh-2 li{line-height:2.6!important}',
    'html.a11y-align-1 body *{text-align:left!important}',
    'html.a11y-gray-1{filter:grayscale(1)}',
    'html.a11y-contrast-1.a11y-gray-1{filter:contrast(1.3) grayscale(1)}',
    '@media(max-width:400px){#a11y-panel{width:calc(100vw - 32px)}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'a11y-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- DOM ---------- */
  var btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', T.open);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M12 8c-3 0-5.6-.6-5.6-.6a.9.9 0 1 0-.4 1.7s2.5.6 4.5.7c0 .8-.1 2.3-.4 3.4-.3 1.2-1.8 4.7-1.8 4.7a.95.95 0 0 0 1.7.8s1.4-3.2 2-4.6c.6 1.4 2 4.6 2 4.6a.95.95 0 0 0 1.7-.8s-1.5-3.5-1.8-4.7c-.3-1.1-.4-2.6-.4-3.4 2-.1 4.5-.7 4.5-.7a.9.9 0 1 0-.4-1.7S15 8 12 8Z"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Accessibility settings');

  var grid = '<h2>' + T.title + ' <button id="a11y-close" type="button" aria-label="' + T.close + '">&#10005;</button></h2><div id="a11y-grid">';
  FEATURES.forEach(function (f) {
    grid += '<button class="a11y-tile" type="button" data-id="' + f.id + '" data-cycle="' + f.cycle + '" aria-pressed="false">' +
      '<span class="a11y-step" aria-hidden="true"></span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + f.icon + '</svg>' +
      '<span>' + (T.labels[f.id] || f.label) + '</span></button>';
  });
  grid += '<button id="a11y-reset" type="button">&#8635; ' + T.reset + '</button></div>' +
    '<p id="a11y-note"><a href="privacy.html">' + T.note + '</a></p>';
  panel.innerHTML = grid;

  var guideBar = document.createElement('div');
  guideBar.id = 'a11y-guide-bar';
  guideBar.setAttribute('aria-hidden', 'true');

  document.body.appendChild(guideBar);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  /* ---------- behaviour ---------- */
  function apply(id, level) {
    var root = document.documentElement;
    var f = FEATURES.filter(function (x) { return x.id === id; })[0];
    for (var i = 1; i < f.cycle; i++) root.classList.remove('a11y-' + id + '-' + i);
    if (level > 0) root.classList.add('a11y-' + id + '-' + level);

    var tile = panel.querySelector('[data-id="' + id + '"]');
    if (tile) {
      tile.setAttribute('aria-pressed', level > 0 ? 'true' : 'false');
      tile.querySelector('.a11y-step').textContent = (f.cycle > 2 && level > 0) ? level + '/' + (f.cycle - 1) : '';
    }
    if (id === 'guide') guideBar.style.display = level > 0 ? 'block' : 'none';
  }

  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  panel.addEventListener('click', function (e) {
    var tile = e.target.closest('.a11y-tile');
    if (tile) {
      var id = tile.getAttribute('data-id');
      var cycle = parseInt(tile.getAttribute('data-cycle'), 10);
      state[id] = ((state[id] || 0) + 1) % cycle;
      apply(id, state[id]);
      save();
      return;
    }
    if (e.target.closest('#a11y-reset')) {
      Object.keys(state).forEach(function (id) { state[id] = 0; apply(id, 0); });
      state = {};
      save();
      return;
    }
    if (e.target.closest('#a11y-close')) togglePanel(false);
  });

  function togglePanel(open) {
    panel.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('.a11y-tile').focus();
    else btn.focus();
  }

  btn.addEventListener('click', function () { togglePanel(!panel.classList.contains('open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) togglePanel(false);
  });

  document.addEventListener('mousemove', function (e) {
    if (guideBar.style.display === 'block') guideBar.style.top = (e.clientY + 14) + 'px';
  });

  /* restore saved settings */
  Object.keys(state).forEach(function (id) {
    if (state[id] > 0 && FEATURES.some(function (f) { return f.id === id; })) apply(id, state[id]);
  });
})();
