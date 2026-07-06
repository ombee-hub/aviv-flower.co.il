/* ============================================================
   Aviv Flower — mobile hamburger + side drawer
   Desktop keeps the regular horizontal menu; below 900px a
   hamburger button opens a side drawer with the same links.
   Everything is built from the existing header, so the drawer
   always matches the real menu.
   ============================================================ */
(function () {
  'use strict';

  var navwrap = document.querySelector('header.site .nav');
  if (!navwrap) return;
  var links = navwrap.querySelector('.nav-links');
  if (!links || links.children.length < 2) return;

  /* ---------- dropdown sub-menus (chevron opens/closes) ---------- */
  var IS_ZH = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0;
  var SUBMENUS = IS_ZH ? [
    { href: 'flowers.html', items: [['flowers.html', '鲜花目录'], ['flowers-selection.html', '品种一览']] },
    { href: 'produce.html', items: [['produce.html', '全部农产品'], ['herbs.html', '新鲜香草'], ['edible-flowers.html', '食用花卉'], ['exotic-fruits.html', '稀有水果'], ['vegetables.html', '特色蔬菜']] },
    { href: 'about.html', items: [['about.html', '关于我们'], ['growers.html', '精英种植户'], ['operations.html', '运营流程'], ['vision.html', '愿景与目标'], ['germany.html', 'Aviv 德国公司']] },
    { href: 'news.html', items: [['news.html', '全部新闻'], ['news-events.html', '展会活动'], ['news-press.html', '媒体报道'], ['news-newsletters.html', '订阅通讯'], ['news-vase.html', '花瓶之外']] },
    { href: 'contact.html', items: [['contact.html#flowers-desk', '鲜花团队'], ['contact.html#produce-desk', '农产品团队']] }
  ] : [
    { href: 'flowers.html', items: [['flowers.html', 'Flower catalogue'], ['flowers-selection.html', 'Flower selection']] },
    { href: 'produce.html', items: [['produce.html', 'All fresh produce'], ['herbs.html', 'Herbs'], ['edible-flowers.html', 'Edible flowers'], ['exotic-fruits.html', 'Exotic fruits'], ['vegetables.html', 'Vegetables']] },
    { href: 'about.html', items: [['about.html', 'About us'], ['growers.html', 'Our growers'], ['operations.html', 'Our operations'], ['vision.html', 'Vision & goals'], ['germany.html', 'Aviv Germany']] },
    { href: 'news.html', items: [['news.html', 'All news'], ['news-events.html', 'Events'], ['news-press.html', 'From the press'], ['news-newsletters.html', 'Newsletters'], ['news-vase.html', 'Out of the Vase']] },
    { href: 'contact.html', items: [['contact.html#flowers-desk', 'Flowers desk'], ['contact.html#produce-desk', 'Produce desk']] }
  ];

  function closeAllSubs() {
    Array.prototype.forEach.call(links.querySelectorAll('.nav-item.open'), function (i) {
      i.classList.remove('open');
      i.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false');
    });
  }

  SUBMENUS.forEach(function (cfg) {
    var a = links.querySelector('a[href="' + cfg.href + '"]');
    if (!a) return;

    var item = document.createElement('div');
    item.className = 'nav-item';
    a.parentNode.insertBefore(item, a);
    item.appendChild(a);

    var t = document.createElement('button');
    t.className = 'sub-toggle';
    t.type = 'button';
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', IS_ZH ? '展开子菜单' : 'Toggle submenu');
    t.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    item.appendChild(t);

    var m = document.createElement('div');
    m.className = 'sub-menu';
    cfg.items.forEach(function (it) {
      var s = document.createElement('a');
      s.href = it[0];
      s.textContent = it[1];
      m.appendChild(s);
    });
    item.appendChild(m);

    var closeTimer;
    function open(o) {
      if (o) closeAllSubs();
      item.classList.toggle('open', o);
      t.setAttribute('aria-expanded', String(o));
    }
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      open(!item.classList.contains('open'));
    });
    item.addEventListener('mouseenter', function () { clearTimeout(closeTimer); open(true); });
    item.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { open(false); }, 220); });
  });

  document.addEventListener('click', function (e) {
    if (!links.contains(e.target)) closeAllSubs();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllSubs();
  });

  /* ---------- hamburger button ---------- */
  var mbtn = document.createElement('button');
  mbtn.className = 'menu-btn';
  mbtn.type = 'button';
  mbtn.setAttribute('aria-label', 'Open menu');
  mbtn.setAttribute('aria-expanded', 'false');
  mbtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  navwrap.appendChild(mbtn);

  /* ---------- overlay + drawer ---------- */
  var overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';

  var drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Menu');

  var head = document.createElement('div');
  head.className = 'drawer-head';
  var headerLogo = navwrap.querySelector('.logo img');
  head.innerHTML =
    '<img src="' + (headerLogo ? headerLogo.getAttribute('src') : 'images/aviv-logo.png') + '" alt="Aviv — Harmonie flowers">' +
    '<button class="drawer-close" type="button" aria-label="Close menu">&#10005;</button>';
  drawer.appendChild(head);

  var nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Mobile');
  nav.innerHTML = links.innerHTML;
  drawer.appendChild(nav);

  /* language choice, same options as the header globe */
  var headerLang = navwrap.querySelector('.lang-menu');
  if (headerLang) {
    var langWrap = document.createElement('div');
    langWrap.className = 'drawer-lang';
    langWrap.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2c3 3.4 3 16.6 0 20-3-3.4-3-16.6 0-20Z"/></svg>';
    var pageLang = (document.documentElement.lang || 'en').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
    Array.prototype.forEach.call(headerLang.querySelectorAll('a'), function (src) {
      var a = src.cloneNode(true);
      var code = (a.getAttribute('lang') || 'en').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
      if (code === pageLang) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
      a.addEventListener('click', function (e) {
        try { localStorage.setItem('aviv-lang', code); } catch (err) {}
        if (a.getAttribute('href') === '#') e.preventDefault(); /* current language stays */
      });
      langWrap.appendChild(a);
    });
    drawer.appendChild(langWrap);
  }

  /* WebShop button, same as in the header */
  var shop = navwrap.querySelector('.webshop-btn');
  if (shop) {
    var shopWrap = document.createElement('div');
    shopWrap.className = 'drawer-shop';
    shopWrap.appendChild(shop.cloneNode(true));
    drawer.appendChild(shopWrap);
  }

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  /* ---------- behaviour ---------- */
  function setOpen(open) {
    document.documentElement.classList.toggle('drawer-open', open);
    mbtn.setAttribute('aria-expanded', String(open));
    if (open) drawer.querySelector('.drawer-close').focus();
    else mbtn.focus();
  }

  mbtn.addEventListener('click', function () {
    setOpen(!document.documentElement.classList.contains('drawer-open'));
  });
  overlay.addEventListener('click', function () { setOpen(false); });
  drawer.querySelector('.drawer-close').addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.documentElement.classList.contains('drawer-open')) setOpen(false);
  });

  /* close when a link inside is clicked (same-page anchors etc.) */
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) document.documentElement.classList.remove('drawer-open');
  });

  /* close automatically when the viewport grows into desktop layout */
  var desktop = window.matchMedia('(min-width: 901px)');
  function onDesktop(e) {
    if (e.matches && document.documentElement.classList.contains('drawer-open')) {
      document.documentElement.classList.remove('drawer-open');
      mbtn.setAttribute('aria-expanded', 'false');
    }
  }
  if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
  else if (desktop.addListener) desktop.addListener(onDesktop); /* older browsers */
})();
