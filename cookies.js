/* ============================================================
   Aviv Flower — privacy-policy consent banner
   Fixed bar at the bottom, shown on the first visit until the
   visitor approves the privacy policy. Self-contained: injects
   its own styles, remembers approval in localStorage, shows
   English or Chinese by page language.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'aviv-privacy';

  /* already approved? */
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  if (saved === 'accepted') return;

  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var T = IS_ZH ? {
    title: '隐私政策',
    text: '继续使用本网站前，请阅读并同意我们的隐私政策，其中包括 Cookie 的使用（用于登录、导航与偏好设置）。',
    policy: '阅读隐私政策',
    accept: '我已阅读并同意',
    label: '隐私政策同意横幅'
  } : {
    title: 'Your privacy',
    text: 'Before using this website, please review and accept our privacy policy, including our use of cookies for authentication, navigation and your preferences.',
    policy: 'Read the privacy policy',
    accept: 'I agree',
    label: 'Privacy policy consent banner'
  };

  /* ---------- styles ---------- */
  var css = [
    '#privacy-banner{position:fixed;bottom:0;left:0;right:0;z-index:99990;',
    'background:#26330f;color:#fbfcf4;border-top:3px solid #98c93f;',
    'font-family:"Assistant","Segoe UI",Arial,sans-serif;',
    'padding:18px 22px;display:flex;align-items:center;justify-content:center;gap:26px;flex-wrap:wrap;',
    'box-shadow:0 -12px 40px rgba(0,0,0,.25)}',
    '#privacy-banner .pv-text{max-width:62ch;font-size:14.5px;line-height:1.5}',
    '#privacy-banner .pv-text b{display:block;font-size:16px;margin-bottom:3px;color:#fff}',
    '#privacy-banner .pv-text a{color:#98c93f;font-weight:600;text-decoration:underline}',
    '#privacy-banner .pv-text a:hover{color:#fff}',
    '#pv-accept{font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;',
    'padding:11px 26px;border-radius:10px;transition:background .2s,border-color .2s;',
    'background:#98c93f;border:1.5px solid #98c93f;color:#26330f}',
    '#pv-accept:hover,#pv-accept:focus-visible{background:#fff;border-color:#fff}',
    '#pv-accept:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '@media(max-width:640px){#privacy-banner{padding:16px;gap:14px}#pv-accept{width:100%}}'
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
    '<div class="pv-text"><b>' + T.title + '</b>' + T.text +
    ' <a href="privacy.html">' + T.policy + '</a></div>' +
    '<button id="pv-accept" type="button">' + T.accept + '</button>';
  document.body.appendChild(banner);

  document.getElementById('pv-accept').addEventListener('click', function () {
    try { localStorage.setItem(STORE_KEY, 'accepted'); } catch (e) {}
    banner.remove();
    styleEl.remove();
  });
})();
