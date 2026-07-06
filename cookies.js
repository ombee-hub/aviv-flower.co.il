/* ============================================================
   Aviv Flower — cookie consent banner
   Self-contained: injects its own styles, remembers the choice
   in localStorage, shows English or Chinese by page language.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'aviv-cookies';

  /* already answered? */
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (saved === 'accepted' || saved === 'declined') return;

  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var T = IS_ZH ? {
    title: '本网站使用 Cookie',
    text: '我们使用 Cookie 管理登录、导航与偏好设置。继续浏览即表示您同意我们的隐私政策。',
    policy: '查看隐私政策',
    accept: '同意',
    decline: '拒绝',
    label: 'Cookie 同意横幅'
  } : {
    title: 'This website uses cookies',
    text: 'We use cookies to manage authentication, navigation and your preferences. By using our website you agree to our privacy policy.',
    policy: 'View privacy policy',
    accept: 'I agree',
    decline: 'I decline',
    label: 'Cookie consent banner'
  };

  /* ---------- styles ---------- */
  var css = [
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:99990;',
    'background:#26330f;color:#fbfcf4;border-top:3px solid #98c93f;',
    'font-family:"Assistant","Segoe UI",Arial,sans-serif;',
    'padding:18px 22px;display:flex;align-items:center;justify-content:center;gap:26px;flex-wrap:wrap;',
    'box-shadow:0 -12px 40px rgba(0,0,0,.25)}',
    '#cookie-banner .ck-text{max-width:62ch;font-size:14.5px;line-height:1.5}',
    '#cookie-banner .ck-text b{display:block;font-size:16px;margin-bottom:3px;color:#fff}',
    '#cookie-banner .ck-text a{color:#98c93f;font-weight:600;text-decoration:underline}',
    '#cookie-banner .ck-text a:hover{color:#fff}',
    '#cookie-banner .ck-actions{display:flex;gap:10px;flex-wrap:wrap}',
    '#cookie-banner button{font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;',
    'padding:11px 26px;border-radius:10px;transition:background .2s,color .2s,border-color .2s}',
    '#ck-accept{background:#98c93f;border:1.5px solid #98c93f;color:#26330f}',
    '#ck-accept:hover,#ck-accept:focus-visible{background:#fff;border-color:#fff}',
    '#ck-decline{background:transparent;border:1.5px solid #b7c88c;color:#fbfcf4}',
    '#ck-decline:hover,#ck-decline:focus-visible{background:#ec2028;border-color:#ec2028;color:#fff}',
    '#cookie-banner button:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '@media(max-width:640px){#cookie-banner{padding:16px;gap:14px}#cookie-banner .ck-actions{width:100%;justify-content:center}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'cookie-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- banner ---------- */
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', T.label);
  banner.innerHTML =
    '<div class="ck-text"><b>' + T.title + '</b>' + T.text +
    ' <a href="privacy.html">' + T.policy + '</a></div>' +
    '<div class="ck-actions">' +
    '<button id="ck-accept" type="button">' + T.accept + '</button>' +
    '<button id="ck-decline" type="button">' + T.decline + '</button>' +
    '</div>';
  document.body.appendChild(banner);

  function choose(value) {
    try { localStorage.setItem(STORE_KEY, value); } catch (e) {}
    banner.remove();
  }

  document.getElementById('ck-accept').addEventListener('click', function () { choose('accepted'); });
  document.getElementById('ck-decline').addEventListener('click', function () { choose('declined'); });
})();
