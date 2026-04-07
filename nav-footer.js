/* ============================================================
   MarketBoomer — Shared Nav + Footer Widget
   Single source of truth for header and footer across all pages.
   Include in every page via:
     <script src="/MarketBoomer/nav-footer.js" defer></script>
   Pages must have:
     <div id="site-nav"></div>   at the top of <body>
     <div id="site-footer"></div> before </body>
   ============================================================ */
(function () {

  /* ── CSS ── */
  var css = `
    :root {
      --navy: #0f2542;
      --teal: #2faee3;
      --teal-light: #5cc8f0;
      --teal-deep: #0096b7;
      --white: #ffffff;
    }
    /* ── NAV ── */
    .hero-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 60px;
      z-index: 1000;
      background: #ffffff;
      box-shadow: 0 1px 0 rgba(15,37,66,0.08), 0 4px 16px rgba(15,37,66,0.04);
    }
    .hero-logo { display: flex; align-items: center; flex-shrink: 0; }
    .hero-logo img { height: 32px; width: auto; display: block; }
    .hero-nav-links {
      display: flex;
      gap: 4px;
      list-style: none;
      align-items: center;
      margin-left: auto;
      margin-right: 8px;
    }
    .hero-nav-links > li { position: relative; }
    .hero-nav-links > li > a {
      display: flex;
      align-items: center;
      gap: 4px;
      color: rgba(15,37,66,0.7);
      text-decoration: none;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 8px 11px;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
      white-space: nowrap;
    }
    .hero-nav-links > li > a:hover,
    .hero-nav-links > li.nav-open > a { color: var(--navy); background: rgba(15,37,66,0.04); }
    .nav-chevron { width: 12px; height: 12px; transition: transform 0.2s; flex-shrink: 0; }
    .hero-nav-links > li.nav-open .nav-chevron { transform: rotate(180deg); }
    .nav-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      min-width: 200px;
      background: #ffffff;
      border: 1px solid rgba(15,37,66,0.08);
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(15,37,66,0.12);
      list-style: none;
      padding: 6px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
      z-index: 100;
    }
    .hero-nav-links > li.has-dropdown:hover .nav-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
    .hero-nav-links > li.has-dropdown:hover > a { color: var(--navy); background: rgba(15,37,66,0.04); }
    .hero-nav-links > li.has-dropdown:hover .nav-chevron { transform: rotate(180deg); }
    .nav-dropdown a {
      display: block;
      padding: 9px 14px;
      color: rgba(15,37,66,0.7);
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 400;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    .nav-dropdown a:hover { background: rgba(36,150,208,0.06); color: var(--teal); }
    .hero-nav-cta {
      background: var(--teal);
      box-shadow: 0 0 28px rgba(47,174,227,0.55), 0 4px 20px rgba(47,174,227,0.3);
      color: var(--white);
      border: none;
      border-radius: 8px;
      padding: 9px 20px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.04em;
      transition: box-shadow 0.2s, transform 0.2s;
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
      font-family: 'Inter', sans-serif;
    }
    .hero-nav-cta:hover { box-shadow: 0 0 40px rgba(47,174,227,0.7), 0 8px 32px rgba(47,174,227,0.45); transform: translateY(-1px); }
    .hamburger-btn {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px; height: 40px;
      background: none;
      border: 1px solid rgba(15,37,66,0.15);
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
    }
    .hamburger-btn span { display: block; width: 18px; height: 1.5px; background: var(--navy); border-radius: 2px; transition: all 0.25s; }
    .hamburger-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .hamburger-btn.open span:nth-child(2) { opacity: 0; }
    .hamburger-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
    .mobile-nav-overlay {
      position: fixed !important; inset: 0;
      background: rgba(9,26,48,0.45);
      z-index: 1999;
      transition: opacity 0.3s;
    }
    .mobile-nav {
      display: none !important;
      position: fixed !important;
      top: 0 !important; right: 0 !important;
      width: 300px; max-width: 90vw; height: 100vh !important;
      background: #ffffff;
      z-index: 2000;
      overflow-y: auto;
      padding: 0 0 40px;
      flex-direction: column;
      box-shadow: -8px 0 40px rgba(9,26,48,0.12);
      font-family: 'Inter', sans-serif;
    }
    .mobile-nav.open { display: flex !important; }
    .mobile-nav-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid rgba(15,37,66,0.08);
    }
    .mobile-nav-close {
      background: none; border: none; cursor: pointer;
      padding: 6px; color: rgba(15,37,66,0.5); font-size: 1.1rem; line-height: 1;
      border-radius: 6px; transition: background 0.15s, color 0.15s; font-family: 'Inter', sans-serif;
    }
    .mobile-nav-close:hover { background: rgba(15,37,66,0.06); color: var(--navy); }
    .mobile-nav-links { list-style: none; flex: 1; padding: 8px 12px; }
    .mobile-nav-links > li { border-bottom: 1px solid rgba(15,37,66,0.05); }
    .mobile-nav-links > li > a,
    .mobile-nav-toggle {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 8px;
      color: var(--navy); text-decoration: none;
      font-size: 0.85rem; font-weight: 500;
      letter-spacing: 0.03em; text-transform: uppercase;
      background: none; border: none; cursor: pointer; width: 100%; text-align: left;
      transition: color 0.15s; font-family: 'Inter', sans-serif;
    }
    .mobile-nav-links > li > a:hover, .mobile-nav-toggle:hover { color: var(--teal); }
    .mobile-nav-chevron { width: 14px; height: 14px; transition: transform 0.2s; color: rgba(15,37,66,0.4); flex-shrink: 0; }
    .mobile-nav-links > li.mob-open .mobile-nav-chevron { transform: rotate(180deg); }
    .mobile-sub { list-style: none; padding: 0 0 8px 12px; display: none; }
    .mobile-nav-links > li.mob-open .mobile-sub { display: block; }
    .mobile-sub a {
      display: block; padding: 9px 8px;
      color: rgba(15,37,66,0.65); text-decoration: none; font-size: 0.82rem; font-weight: 400;
      transition: color 0.15s;
    }
    .mobile-sub a:hover { color: var(--teal); }
    .mobile-nav-footer { padding: 20px; }
    .mobile-nav-footer .hero-nav-cta { display: block; text-align: center; padding: 13px 20px; font-size: 0.85rem; }
    @media (max-width: 1200px) {
      .hero-nav { padding: 13px 40px; }
      .hero-logo img { height: 28px; }
      .hero-nav-links > li > a { font-size: 0.63rem; padding: 7px 8px; }
    }
    @media (max-width: 980px) {
      .hero-nav { padding: 12px 28px; }
      .hero-logo img { height: 26px; }
      .hero-nav-links > li > a { font-size: 0.58rem; padding: 6px 6px; letter-spacing: 0.02em; }
      .hero-nav-cta { padding: 8px 14px; font-size: 0.72rem; }
    }
    @media (max-width: 820px) {
      .hero-nav { padding: 11px 24px; }
      .hero-logo img { height: 22px; }
      .hero-nav-links { gap: 0; margin-right: 4px; }
      .hero-nav-links > li > a { font-size: 0.44rem; padding: 5px 4px; letter-spacing: 0; }
      .hero-nav-cta { padding: 7px 11px; font-size: 0.68rem; }
    }
    @media (max-width: 700px) {
      .hero-nav-links { display: none; }
      .hero-nav-cta { display: none; }
      .hamburger-btn { display: flex; }
    }

    /* ── FOOTER ── */
    .site-footer {
      background: var(--navy);
      padding: 64px 60px 0;
      font-family: 'Inter', sans-serif;
    }
    .site-footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.6fr 2fr 1.2fr 1fr;
      gap: 48px;
      padding-bottom: 56px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-brand-logo { height: 30px; width: auto; margin-bottom: 24px; filter: brightness(0) invert(1); opacity: 0.9; }
    @media (max-width: 720px) { .footer-brand-logo { height: 90px; } }
    .footer-contact-list p { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; }
    .footer-contact-list a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.15s; }
    .footer-contact-list a:hover { color: var(--teal-light); }
    .footer-address { margin-top: 12px !important; }
    .footer-col-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 18px; }
    .footer-col-text { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.75; margin-bottom: 12px; }
    .footer-nav-list { list-style: none; }
    .footer-nav-list li { margin-bottom: 10px; }
    .footer-nav-list a { font-size: 13.5px; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.15s; }
    .footer-nav-list a:hover { color: var(--teal-light); }
    .footer-col-cta { display: flex; flex-direction: column; gap: 12px; }
    .footer-login-btn {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 14px 18px;
      color: rgba(255,255,255,0.85); text-decoration: none; font-size: 13.5px; font-weight: 500;
      transition: background 0.2s, border-color 0.2s;
    }
    .footer-login-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
    .footer-login-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .footer-bottom {
      max-width: 1280px; margin: 0 auto;
      padding: 20px 0 28px;
    }
    .footer-bottom-inner { display: flex; align-items: center; justify-content: space-between; }
    .footer-copyright { font-size: 12px; color: rgba(255,255,255,0.3); }
    .footer-bottom-links { display: flex; align-items: center; gap: 8px; }
    .footer-bottom-links a { font-size: 12px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.15s; }
    .footer-bottom-links a:hover { color: rgba(255,255,255,0.65); }
    .footer-sep { color: rgba(255,255,255,0.2); font-size: 12px; }
    @media (max-width: 1100px) { .site-footer-inner { grid-template-columns: 1fr 1.4fr 1fr; } .footer-col-cta { display: none; } }
    @media (max-width: 720px) { .site-footer-inner { grid-template-columns: 1fr; gap: 32px; } .site-footer { padding: 48px 28px 0; } }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── NAV HTML ── */
  var NAV_HTML = `
  <nav class="hero-nav">
    <div class="hero-logo">
      <a href="/MarketBoomer/"><img src="https://marketboomer.com/wp-content/uploads/2022/02/marketboomer_logo-2.png" alt="Marketboomer PurchasePlus" /></a>
    </div>
    <ul class="hero-nav-links">
      <li><a href="/MarketBoomer/">Home</a></li>
      <li><a href="/MarketBoomer/about/">About us</a></li>
      <li class="has-dropdown">
        <a href="/MarketBoomer/features/">Features <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
        <ul class="nav-dropdown">
          <li><a href="/MarketBoomer/features/real-time-marketplace/">Real Time Marketplace</a></li>
          <li><a href="/MarketBoomer/features/robotic-automation/">Robotic Automation</a></li>
          <li><a href="/MarketBoomer/features/centralised-data/">Centralised Data</a></li>
        </ul>
      </li>
      <li class="has-dropdown">
        <a href="/MarketBoomer/our-solutions/">Our Solutions <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
        <ul class="nav-dropdown">
          <li><a href="/MarketBoomer/our-solutions/purchaseplus/">PurchasePlus</a></li>
          <li><a href="/MarketBoomer/our-solutions/paperless-invoicing/">Paperless Invoicing</a></li>
          <li><a href="/MarketBoomer/api/">API Documentation</a></li>
        </ul>
      </li>
      <li class="has-dropdown">
        <a href="/MarketBoomer/our-customers/">Our Customers <svg class="nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></a>
        <ul class="nav-dropdown">
          <li><a href="/MarketBoomer/our-customers/buyers/">Buyers</a></li>
          <li><a href="/MarketBoomer/our-customers/suppliers/">Suppliers</a></li>
          <li><a href="#">Channel Partners</a></li>
        </ul>
      </li>
      <li><a href="/MarketBoomer/contact/">Contact</a></li>
      <li><a href="/MarketBoomer/health-check/">Help</a></li>
    </ul>
    <a href="/MarketBoomer/contact/" class="hero-nav-cta">Get started</a>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open navigation menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-nav-overlay" id="mobileNavOverlay" style="display:none;opacity:0;"></div>
  <div class="mobile-nav" id="mobileNav">
    <div class="mobile-nav-header">
      <span style="font-size:0.8rem;font-weight:600;color:rgba(15,37,66,0.5);letter-spacing:0.06em;text-transform:uppercase;">Menu</span>
      <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">&#x2715;</button>
    </div>
    <ul class="mobile-nav-links">
      <li><a href="/MarketBoomer/">Home</a></li>
      <li><a href="/MarketBoomer/about/">About us</a></li>
      <li>
        <button class="mobile-nav-toggle">Features <svg class="mobile-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        <ul class="mobile-sub">
          <li><a href="/MarketBoomer/features/real-time-marketplace/">Real Time Marketplace</a></li>
          <li><a href="/MarketBoomer/features/robotic-automation/">Robotic Automation</a></li>
          <li><a href="/MarketBoomer/features/centralised-data/">Centralised Data</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile-nav-toggle">Our Solutions <svg class="mobile-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        <ul class="mobile-sub">
          <li><a href="/MarketBoomer/our-solutions/purchaseplus/">PurchasePlus</a></li>
          <li><a href="/MarketBoomer/our-solutions/paperless-invoicing/">Paperless Invoicing</a></li>
        </ul>
      </li>
      <li>
        <button class="mobile-nav-toggle">Our Customers <svg class="mobile-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        <ul class="mobile-sub">
          <li><a href="/MarketBoomer/our-customers/buyers/">Buyers</a></li>
          <li><a href="/MarketBoomer/our-customers/suppliers/">Suppliers</a></li>
          <li><a href="#">Channel Partners</a></li>
        </ul>
      </li>
      <li><a href="/MarketBoomer/contact/">Contact</a></li>
      <li><a href="/MarketBoomer/health-check/">Help</a></li>
    </ul>
    <div class="mobile-nav-footer">
      <a href="/MarketBoomer/contact/" class="hero-nav-cta">Get started</a>
    </div>
  </div>`;

  /* ── FOOTER HTML ── */
  var FOOTER_HTML = `
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="footer-col footer-col-brand">
        <img class="footer-brand-logo" src="https://marketboomer.com/wp-content/uploads/2022/02/marketboomer_logo-2.png" alt="Marketboomer PurchasePlus" />
        <div class="footer-contact-list">
          <p><strong>AU</strong> <a href="tel:+61258496957">+61 2 5849 6957</a></p>
          <p><strong>SG</strong> <a href="tel:+6531388600">+65 3138 8600</a></p>
          <p><strong>US</strong> <a href="tel:+16802255236">+1 680 225 5236</a></p>
          <p><strong>TH</strong> <a href="tel:+6624609340">+66 2 460 9340</a></p>
          <p><strong>GB</strong> <a href="tel:+442045387068">+44 20 4538 7068</a></p>
          <p><a href="mailto:help@marketboomer.com">help@marketboomer.com</a></p>
          <p class="footer-address">477 Pitt Street<br/>Haymarket NSW 2000<br/>Australia</p>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">About</h4>
        <p class="footer-col-text">Created by hospitality, for hospitality, our cloud-based digital procurement solutions and expertise, help businesses grow by streamlining and optimising buyer-seller interactions.</p>
        <p class="footer-col-text">Established in 1995, from our Headquarters in Sydney, Australia, with offices across Asia, Marketboomer proudly operates across 25 countries with a global community of over 5,000 hospitality buyers and suppliers.</p>
      </div>
      <div class="footer-col">
        <h4 class="footer-col-title">Our Tools</h4>
        <ul class="footer-nav-list">
          <li><a href="/MarketBoomer/our-solutions/purchaseplus/">PurchasePlus</a></li>
          <li><a href="/MarketBoomer/our-solutions/paperless-invoicing/">Paperless Invoicing</a></li>
          <li><a href="#">Connectivity and Data Translation</a></li>
          <li><a href="#">Business Intelligence</a></li>
          <li><a href="#">Document Storage</a></li>
        </ul>
      </div>
      <div class="footer-col footer-col-cta">
        <a href="https://purchaseplus.com" class="footer-login-btn" target="_blank" rel="noopener">
          <svg class="footer-login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Log in PurchasePlus
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <span class="footer-copyright">&#169; Marketboomer 2026</span>
        <div class="footer-bottom-links">
          <a href="#">Terms &amp; Conditions</a>
          <span class="footer-sep">/</span>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>`;

  /* ── Inject ── */
  var navRoot = document.getElementById('site-nav');
  if (navRoot) navRoot.outerHTML = NAV_HTML;

  var footerRoot = document.getElementById('site-footer');
  if (footerRoot) footerRoot.outerHTML = FOOTER_HTML;

  /* ── Nav JS ── */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileNav    = document.getElementById('mobileNav');
  var overlay      = document.getElementById('mobileNavOverlay');
  var closeBtn     = document.getElementById('mobileNavClose');

  function openMobileNav() {
    hamburgerBtn.classList.add('open');
    mobileNav.classList.add('open');
    overlay.style.display = 'block';
    requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    hamburgerBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.style.display = 'none'; }, 150);
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', function () {
    mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  closeBtn.addEventListener('click', closeMobileNav);
  overlay.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.closest('li');
      var isOpen = li.classList.contains('mob-open');
      document.querySelectorAll('.mobile-nav-links > li').forEach(function (el) { el.classList.remove('mob-open'); });
      if (!isOpen) li.classList.add('mob-open');
    });
  });

  // Close mobile nav when any link inside it is tapped
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { closeMobileNav(); });
  });

  window.addEventListener('scroll', function () {
    document.querySelectorAll('.hero-nav-links > li.has-dropdown').forEach(function (el) { el.classList.remove('nav-open'); });
  }, { passive: true });

})();
