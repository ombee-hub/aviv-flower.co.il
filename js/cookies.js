/* ============================================================
   Aviv Flower — cookie notice banner
   Fixed bar at the bottom of the home page, shown until the
   visitor accepts or declines. Self-contained: injects its own
   styles, remembers the choice in localStorage, shows English or
   Chinese by page language.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'aviv-cookie-notice';

  /* already answered? */
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (saved) return;

  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var T = IS_ZH ? {
    before: '本网站使用 Cookie 以改善您的浏览体验。详情请参阅我们的',
    policy: '隐私政策',
    after: '。',
    accept: '接受',
    decline: '拒绝',
    label: 'Cookie 通知'
  } : {
    before: 'This website uses cookies to improve your browsing experience. For more details, please see our ',
    policy: 'Privacy Policy',
    after: '.',
    accept: 'Accept',
    decline: 'Decline',
    label: 'Cookie notice'
  };

  /* ---------- cookie icon ---------- */
  var ICON =
    '<svg class="pv-icon" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false">' +
      '<path d="M24 4a20 20 0 1 0 20 20 7 7 0 0 1-8-7 7 7 0 0 1-7-8 5 5 0 0 1-5-5z" fill="#d9a35b" stroke="#8a5a23" stroke-width="2" stroke-linejoin="round"/>' +
      '<circle cx="15" cy="20" r="3" fill="#5a3714"/>' +
      '<circle cx="24" cy="31" r="3.2" fill="#5a3714"/>' +
      '<circle cx="14" cy="32" r="2.2" fill="#5a3714"/>' +
      '<circle cx="33" cy="33" r="2.4" fill="#5a3714"/>' +
      '<circle cx="22" cy="13" r="2" fill="#5a3714"/>' +
      '<circle cx="29" cy="22" r="1.6" fill="#5a3714"/>' +
    '</svg>';

  /* ---------- styles ---------- */
  var css = [
    '#privacy-banner{position:fixed;bottom:0;left:0;right:0;z-index:99990;',
    'background:#26330f;color:#fbfcf4;border-top:3px solid #86b23e;',
    'font-family:"Assistant","Segoe UI",Arial,sans-serif;',
    'padding:16px 22px;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap;',
    'box-shadow:0 -12px 40px rgba(0,0,0,.25)}',
    '#privacy-banner .pv-msg{display:flex;align-items:center;gap:14px;max-width:70ch}',
    '#privacy-banner .pv-icon{flex:none}',
    '#privacy-banner .pv-text{font-size:14.5px;line-height:1.5}',
    '#privacy-banner .pv-text a{color:#86b23e;font-weight:600;text-decoration:underline}',
    '#privacy-banner .pv-text a:hover{color:#fff}',
    '#privacy-banner .pv-btns{display:flex;gap:10px}',
    '#privacy-banner .pv-btns button{font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;',
    'padding:10px 26px;border-radius:10px;transition:background .2s,border-color .2s,color .2s}',
    '#pv-accept{background:#4f7a19;border:1.5px solid #4f7a19;color:#fff}',
    '#pv-decline{background:#a31a22;border:1.5px solid #a31a22;color:#fff}',
    '#pv-accept:hover,#pv-accept:focus-visible{background:#3d5f13;border-color:#3d5f13}',
    '#pv-decline:hover,#pv-decline:focus-visible{background:#7a1219;border-color:#7a1219}',
    '#privacy-banner .pv-btns button:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '@media(max-width:640px){#privacy-banner{padding:14px 16px;gap:12px}#privacy-banner .pv-btns{width:100%}#privacy-banner .pv-btns button{flex:1}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'privacy-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- banner ---------- */
  var banner = document.createElement('div');
  banner.id = 'privacy-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', T.label);
  banner.innerHTML =
    '<div class="pv-msg">' + ICON +
    '<div class="pv-text">' + T.before + '<a href="privacy.html">' + T.policy + '</a>' + T.after + '</div></div>' +
    '<div class="pv-btns">' +
      '<button id="pv-accept" type="button">' + T.accept + '</button>' +
      '<button id="pv-decline" type="button">' + T.decline + '</button>' +
    '</div>';
  document.body.appendChild(banner);

  function answer(choice) {
    try { localStorage.setItem(STORE_KEY, choice); } catch (e) {}
    banner.remove();
    styleEl.remove();
  }
  document.getElementById('pv-accept').addEventListener('click', function () { answer('accepted'); });
  document.getElementById('pv-decline').addEventListener('click', function () { answer('declined'); });
})();
