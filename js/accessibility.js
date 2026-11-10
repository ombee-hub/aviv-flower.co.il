/* ============================================================
   Aviv Flower — Accessibility widget
   Layout follows the OMBee widget: round floating button with an
   active-settings count, a side panel that slides in from the left
   over a dimmed page, white feature cards in two columns, a reset
   button and statement / privacy links at the bottom.
   Self-contained: injects its own styles, saves choices to
   localStorage, labels follow the page language (en / zh).
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'aviv-a11y';

  /* ---------- localisation ---------- */
  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var T = IS_ZH ? {
    title: '辅助功能', open: '打开辅助功能菜单', active: '项设置已启用', close: '关闭辅助功能菜单', dialog: '辅助功能设置',
    reset: '重置所有设置', note: '无障碍声明', privacy: '隐私政策',
    labels: {
      contrast: '对比度 +', links: '突出链接', bigtext: '放大文字', spacing: '文字间距',
      noanim: '暂停动画', noimg: '隐藏图片', dyslexia: '易读字体', cursor: '大光标',
      lineh: '行高', align: '文字对齐', gray: '灰度模式', guide: '阅读参考线'
    }
  } : {
    title: 'Accessibility', open: 'Open accessibility menu', active: 'settings on', close: 'Close accessibility menu', dialog: 'Accessibility settings',
    reset: 'Reset all accessibility settings', note: 'Accessibility statement', privacy: 'Privacy policy',
    labels: {}
  };

  /* ---------- feature definitions (cycle = number of states incl. off) ---------- */
  var FEATURES = [
    { id: 'contrast',  label: 'Contrast +',       cycle: 3, icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>' },
    { id: 'links',     label: 'Highlight Links',  cycle: 2, icon: '<path d="M9 8H7a4 4 0 0 0 0 8h2"/><path d="M15 8h2a4 4 0 0 1 0 8h-2"/><path d="M8 12h8"/>' },
    { id: 'bigtext',   label: 'Bigger Text',      cycle: 4, icon: '<path d="M3 8V6h9v2"/><path d="M7.5 6v12"/><path d="M6 18h3"/><path d="M13 12v-1.5h8V12"/><path d="M17 10.5V18"/><path d="M15.8 18h2.4"/>' },
    { id: 'spacing',   label: 'Text Spacing',     cycle: 2, icon: '<path d="M6 9l-3 3 3 3"/><path d="M18 9l3 3-3 3"/><path d="M3 12h2M8 12h2M14 12h2M19 12h2"/>' },
    { id: 'noanim',    label: 'Pause Animations', cycle: 2, icon: '<circle cx="12" cy="12" r="9" stroke-dasharray="2.4 2.4"/><path d="M10 9v6M14 9v6"/>' },
    { id: 'noimg',     label: 'Hide Images',      cycle: 2, icon: '<path d="M14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/><path d="M17 3l4 4M21 3l-4 4"/>' },
    { id: 'dyslexia',  label: 'Readable Font',    cycle: 2, icon: '<path d="M3 5h3.5a7 7 0 0 1 0 14H3z"/><path d="M17 19V9.5A3.5 3.5 0 0 1 20.5 6"/><path d="M14.5 11.5h6"/>' },
    { id: 'cursor',    label: 'Big Cursor',       cycle: 2, icon: '<path d="M5 3l6.5 17 2.4-7.1L21 10.5z"/>' },
    { id: 'lineh',     label: 'Line Height',      cycle: 3, icon: '<path d="M10 6h11M10 10h11M10 14h11M10 18h11"/><path d="M5 4v16"/><path d="M3 6l2-2 2 2"/><path d="M3 18l2 2 2-2"/>' },
    { id: 'align',     label: 'Align Text',       cycle: 2, icon: '<path d="M3 6h18M3 10h12M3 14h18M3 18h12"/>' },
    { id: 'gray',      label: 'Saturation',       cycle: 2, icon: '<path d="M12 2.5s-6.5 7-6.5 12a6.5 6.5 0 0 0 13 0c0-5-6.5-12-6.5-12z" fill="currentColor" stroke="none"/>' },
    { id: 'guide',     label: 'Reading Guide',    cycle: 2, icon: '<path d="M3 12h18"/><path d="M7 7h10M7 17h10" opacity=".5"/>' }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { state = {}; }

  /* ---------- injected styles ---------- */
  var GREEN = '#4f7a19', GREEN_DARK = '#3d5f13', INK = '#26330f', TINT = '#eef3e2';
  var css = [
    /* floating button */
    '#a11y-btn{position:fixed;bottom:22px;left:22px;z-index:99998;width:50px;height:50px;border-radius:50%;border:none;padding:0;',
    'background:' + GREEN + ';color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(79,122,25,.45);',
    'display:flex;align-items:center;justify-content:center;transition:transform .3s ease,box-shadow .3s ease}',
    '#a11y-btn::before{content:"";position:absolute;inset:5px;border:2px solid #fff;border-radius:50%;pointer-events:none}',
    '#a11y-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(79,122,25,.55)}',
    '#a11y-btn:focus-visible{outline:3px solid ' + INK + ';outline-offset:3px}',
    '#a11y-btn svg{width:26px;height:26px}',
    '#a11y-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;',
    'background:' + INK + ';color:#fff;font:800 11px/20px "Assistant","Segoe UI",Arial,sans-serif;text-align:center;display:none;box-shadow:0 0 0 2px #fff}',
    '#a11y-btn.active #a11y-count{display:block}',

    /* overlay + panel */
    '#a11y-overlay{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.3);opacity:0;pointer-events:none;transition:opacity .3s ease}',
    '#a11y-overlay.open{opacity:1;pointer-events:auto}',
    '#a11y-panel{position:fixed;top:0;bottom:0;left:0;z-index:99999;width:min(320px,88vw);overflow-y:auto;overscroll-behavior:contain;padding-bottom:env(safe-area-inset-bottom);',
    'background:' + TINT + ';border-radius:0 18px 18px 0;box-shadow:8px 0 40px rgba(0,0,0,.18);',
    'transform:translateX(-105%);visibility:hidden;transition:transform .35s cubic-bezier(.4,0,.2,1),visibility 0s linear .35s;',
    'font-family:"Assistant","Segoe UI",Arial,sans-serif;color:' + INK + '}',
    '#a11y-panel.open{transform:none;visibility:visible;transition:transform .35s cubic-bezier(.4,0,.2,1)}',
    '#a11y-panel::-webkit-scrollbar{width:5px}',
    '#a11y-panel::-webkit-scrollbar-thumb{background:rgba(79,122,25,.35);border-radius:5px}',

    /* header */
    '#a11y-head{position:sticky;top:0;z-index:2;background:rgba(255,255,255,.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'border-bottom:1px solid rgba(79,122,25,.15);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 8px}',
    '#a11y-title{font-size:17px;font-weight:800;color:' + INK + ';margin:0;display:flex;align-items:center;gap:8px}',
    '#a11y-title span{color:' + GREEN + ';display:flex}',
    '#a11y-title svg{width:24px;height:24px}',
    '#a11y-close{width:28px;height:28px;border-radius:50%;border:none;background:rgba(79,122,25,.12);color:' + INK + ';cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0}',
    '#a11y-close:hover{background:' + GREEN + ';color:#fff}',
    '#a11y-close:focus-visible{outline:3px solid ' + GREEN + ';outline-offset:2px}',
    '#a11y-close svg{width:14px;height:14px}',

    /* feature cards */
    '#a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:4px 12px 12px}',
    '.a11y-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:104px;padding:14px 6px;position:relative;',
    'border:2px solid #dfe5cc;border-radius:12px;background:#fff;color:' + INK + ';font-family:inherit;cursor:pointer;text-align:center;',
    'box-shadow:0 2px 10px rgba(38,51,15,.10);transition:border-color .2s,box-shadow .2s,background .2s}',
    '.a11y-tile:hover{border-color:' + GREEN + ';box-shadow:0 6px 16px rgba(38,51,15,.16)}',
    '.a11y-tile:focus-visible{outline:3px solid ' + INK + ';outline-offset:2px}',
    '.a11y-tile[aria-pressed="true"]{background:' + GREEN + ';border-color:' + GREEN + ';color:#fff}',
    '.a11y-ico{display:flex;width:28px;height:28px}',
    '.a11y-ico svg{width:100%;height:100%}',
    '.a11y-label{font-size:13.5px;font-weight:800;line-height:1.25}',
    '.a11y-check{position:absolute;top:7px;right:7px;width:18px;height:18px;border-radius:50%;background:#fff;color:' + GREEN + ';display:none;align-items:center;justify-content:center}',
    '.a11y-check svg{width:11px;height:11px}',
    '.a11y-tile[aria-pressed="true"] .a11y-check{display:flex}',
    '.a11y-step{position:absolute;top:7px;left:8px;font-size:11px;font-weight:800;line-height:18px}',

    /* reset + bottom links */
    '#a11y-reset{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 24px);margin:6px 12px 14px;padding:13px 14px;',
    'border:none;border-radius:10px;background:' + GREEN + ';color:#fff;box-shadow:0 6px 18px rgba(79,122,25,.3);',
    'font:800 14px "Assistant","Segoe UI",Arial,sans-serif;cursor:pointer;transition:background .2s}',
    '#a11y-reset:hover{background:' + GREEN_DARK + '}',
    '#a11y-reset:focus-visible{outline:3px solid ' + INK + ';outline-offset:2px}',
    '#a11y-reset svg{width:20px;height:20px;flex-shrink:0}',
    '#a11y-bottom{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 16px}',
    '#a11y-bottom a{display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 6px;border-radius:10px;background:#fff;',
    'border:1.5px solid ' + GREEN + ';font:800 12.5px "Assistant","Segoe UI",Arial,sans-serif;color:' + GREEN + ';text-decoration:none;',
    'box-shadow:0 4px 12px rgba(79,122,25,.15);transition:background .2s,color .2s;text-align:center}',
    '#a11y-bottom a:hover{background:' + GREEN + ';color:#fff}',
    '#a11y-bottom a:focus-visible{outline:3px solid ' + INK + ';outline-offset:2px}',
    '#a11y-bottom svg{width:15px;height:15px;flex-shrink:0}',
    '#a11y-guide-bar{position:fixed;left:0;right:0;height:10px;background:#a31a22;opacity:.85;z-index:99997;pointer-events:none;display:none}',

    /* feature effects */
    'html.a11y-contrast-1{filter:contrast(1.3)}',
    'html.a11y-contrast-2{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-contrast-2 img,html.a11y-contrast-2 video,html.a11y-contrast-2 figure.photo,html.a11y-contrast-2 .plate{filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-links-1 a:not(#a11y-panel a){text-decoration:underline!important;background:#fff34d!important;color:#0b2e8a!important}',
    'html.a11y-bigtext-1 body{font-size:19px!important}',
    'html.a11y-bigtext-2 body{font-size:21px!important}',
    'html.a11y-bigtext-3 body{font-size:24px!important}',
    'html.a11y-spacing-1 body{letter-spacing:.12em!important;word-spacing:.2em!important}',
    'html.a11y-spacing-1 #a11y-panel{letter-spacing:normal!important;word-spacing:normal!important}',
    'html.a11y-noanim-1 *,html.a11y-noanim-1 *::before,html.a11y-noanim-1 *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    'html.a11y-noimg-1 img{visibility:hidden!important}',
    'html.a11y-dyslexia-1 body,html.a11y-dyslexia-1 h1,html.a11y-dyslexia-1 h2,html.a11y-dyslexia-1 h3,html.a11y-dyslexia-1 h4,html.a11y-dyslexia-1 p,html.a11y-dyslexia-1 a:not(#a11y-panel a),html.a11y-dyslexia-1 span:not(#a11y-panel span),html.a11y-dyslexia-1 li{font-family:Verdana,Arial,sans-serif!important;letter-spacing:.04em}',
    'html.a11y-cursor-1,html.a11y-cursor-1 *{cursor:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\' viewBox=\'0 0 24 24\'><path d=\'M5 2l14 10-7 1 4 8-4 2-4-8-3 5Z\' fill=\'black\' stroke=\'white\' stroke-width=\'1.4\'/></svg>") 4 2,auto!important}',
    'html.a11y-lineh-1 body,html.a11y-lineh-1 p,html.a11y-lineh-1 li{line-height:2!important}',
    'html.a11y-lineh-2 body,html.a11y-lineh-2 p,html.a11y-lineh-2 li{line-height:2.6!important}',
    'html.a11y-align-1 body *:not(#a11y-panel *){text-align:left!important}',
    'html.a11y-gray-1{filter:grayscale(1)}',
    'html.a11y-contrast-1.a11y-gray-1{filter:contrast(1.3) grayscale(1)}',
    '#a11y-btn,.a11y-tile,#a11y-reset,#a11y-bottom a,#a11y-close{-webkit-tap-highlight-color:transparent}',
    'html.a11y-open,html.a11y-open body{overflow:hidden}',
    'html.drawer-open #a11y-btn{display:none}',
    '#a11y-btn{transition:transform .3s ease,box-shadow .3s ease,bottom .3s ease}',
    '@media(max-width:480px){',
    '  #a11y-btn{bottom:16px;left:16px}',
    '  #a11y-head{padding:max(12px,env(safe-area-inset-top)) 12px 8px}',
    '  #a11y-grid{gap:8px;padding:4px 10px 10px}',
    '  .a11y-tile{min-height:92px;gap:9px;padding:12px 4px}',
    '  .a11y-label{font-size:13px}',
    '  #a11y-reset{width:calc(100% - 20px);margin:4px 10px 12px}',
    '  #a11y-bottom{padding:0 10px 16px}',
    '}',
    '@media(prefers-reduced-motion:reduce){#a11y-panel,#a11y-overlay,#a11y-btn{transition:none}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'a11y-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- DOM ---------- */
  var SV = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var A11Y_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="3.8" r="2.2"/><path d="M20.5 8.7c-2.6.7-5.5 1.1-8.5 1.1s-5.9-.4-8.5-1.1c-.5-.1-1 .2-1.1.7-.1.5.2 1 .7 1.1 2.3.6 4.7 1 7.2 1.1v3.6L7.5 21c-.2.5 0 1.1.5 1.3.5.2 1.1 0 1.3-.5L11.7 16h.6l2.4 5.8c.2.5.8.7 1.3.5.5-.2.7-.8.5-1.3L13.7 15v-3.5c2.5-.1 4.9-.5 7.2-1.1.5-.1.8-.6.7-1.1-.1-.5-.6-.8-1.1-.7z"/></svg>';

  var btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', T.open);
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.innerHTML = A11Y_ICON + '<span id="a11y-count" aria-hidden="true"></span>';

  var overlay = document.createElement('div');
  overlay.id = 'a11y-overlay';

  var panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', T.dialog);

  var html = '<div id="a11y-head"><h2 id="a11y-title"><span>' + A11Y_ICON + '</span>' + T.title + '</h2>' +
    '<button id="a11y-close" type="button" aria-label="' + T.close + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button></div><div id="a11y-grid">';
  FEATURES.forEach(function (f) {
    html += '<button class="a11y-tile" type="button" data-id="' + f.id + '" data-cycle="' + f.cycle + '" aria-pressed="false">' +
      '<span class="a11y-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>' +
      '<span class="a11y-step" aria-hidden="true"></span>' +
      '<span class="a11y-ico"><svg ' + SV + '>' + f.icon + '</svg></span>' +
      '<span class="a11y-label">' + (T.labels[f.id] || f.label) + '</span></button>';
  });
  html += '</div>' +
    '<button id="a11y-reset" type="button"><svg ' + SV + ' stroke-width="2.2"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>' + T.reset + '</button>' +
    '<div id="a11y-bottom">' +
      '<a href="accessibility-statement.html"><svg ' + SV + ' stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>' + T.note + '</a>' +
      '<a href="privacy.html"><svg ' + SV + ' stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' + T.privacy + '</a>' +
    '</div>';
  panel.innerHTML = html;

  var guideBar = document.createElement('div');
  guideBar.id = 'a11y-guide-bar';
  guideBar.setAttribute('aria-hidden', 'true');

  document.body.appendChild(guideBar);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  var count = btn.querySelector('#a11y-count');
  var closeBtn = panel.querySelector('#a11y-close');

  /* ---------- behaviour ---------- */
  function apply(id, level) {
    var root = document.documentElement;
    var f = FEATURES.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    for (var i = 1; i < f.cycle; i++) root.classList.remove('a11y-' + id + '-' + i);
    if (level > 0) root.classList.add('a11y-' + id + '-' + level);

    var tile = panel.querySelector('[data-id="' + id + '"]');
    if (tile) {
      tile.setAttribute('aria-pressed', level > 0 ? 'true' : 'false');
      tile.querySelector('.a11y-step').textContent = (f.cycle > 2 && level > 0) ? level + '/' + (f.cycle - 1) : '';
    }
    if (id === 'guide') guideBar.style.display = level > 0 ? 'block' : 'none';
  }

  function updateCount() {
    var n = FEATURES.filter(function (f) { return state[f.id] > 0; }).length;
    btn.classList.toggle('active', n > 0);
    count.textContent = n || '';
    btn.setAttribute('aria-label', n ? T.open + ' (' + n + ' ' + T.active + ')' : T.open);
  }

  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.documentElement.classList.add('a11y-open');
    btn.style.visibility = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function closePanel() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.documentElement.classList.remove('a11y-open');
    btn.style.visibility = '';
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  panel.addEventListener('click', function (e) {
    var tile = e.target.closest('.a11y-tile');
    if (tile) {
      var id = tile.getAttribute('data-id');
      var cycle = parseInt(tile.getAttribute('data-cycle'), 10);
      state[id] = ((state[id] || 0) + 1) % cycle;
      apply(id, state[id]);
      updateCount();
      save();
      return;
    }
    if (e.target.closest('#a11y-reset')) {
      Object.keys(state).forEach(function (id) { apply(id, 0); });
      state = {};
      updateCount();
      save();
      return;
    }
    if (e.target.closest('#a11y-close')) closePanel();
  });

  btn.addEventListener('click', openPanel);
  overlay.addEventListener('click', closePanel);

  /* Escape closes; Tab stays inside the panel while it is open */
  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(panel.querySelectorAll('button,a[href]'), function (el) { return el.offsetParent !== null; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('mousemove', function (e) {
    if (guideBar.style.display === 'block') guideBar.style.top = (e.clientY + 14) + 'px';
  });

  /* keep the floating button above the cookie banner while it is showing */
  function liftAboveBanner() {
    var banner = document.getElementById('privacy-banner');
    btn.style.bottom = banner ? (banner.offsetHeight + 12) + 'px' : '';
  }
  new MutationObserver(liftAboveBanner).observe(document.body, { childList: true });
  window.addEventListener('resize', liftAboveBanner);

  /* restore saved settings */
  Object.keys(state).forEach(function (id) {
    if (state[id] > 0) apply(id, state[id]);
  });
  updateCount();
})();
