/* Feather Labs Interactive — static multilingual layer; no external translation service. */
(() => {
  'use strict';

  const STORAGE_KEY = 'featherlabs-language';
  const LANGS = {
    fr:'Français', en:'English', es:'Español', it:'Italiano',
    de:'Deutsch', zh:'简体中文', ja:'日本語', ko:'한국어'
  };

  const DATA = () => window.FEATHER_TRANSLATIONS || {};
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value, root=document) => {
    const node = $(selector, root);
    if (node && typeof value === 'string') node.textContent = value;
  };
  const setHtml = (selector, value, root=document) => {
    const node = $(selector, root);
    if (node && typeof value === 'string') node.innerHTML = value;
  };

  /*
   * Legal-document translations use t.privacy and t.terms as objects
   * ({ sections: [...] }), while the landing page needs label strings.
   * This resolver prevents those objects from ever being written as
   * "[object Object]" in a footer or navigation link.
   */
  function pageLabel(t, page) {
    const value = t?.[page];
    if (typeof value === 'string') return value;
    if (page === 'privacy') return t?.legal?.privacyTitle || 'Privacy Policy';
    if (page === 'terms') return t?.legal?.termsTitle || 'Terms of Use';
    return '';
  }

  function languageFromUrl() {
    const lang = new URLSearchParams(location.search).get('lang');
    return LANGS[lang] ? lang : null;
  }

  function currentLanguage() {
    return languageFromUrl() || localStorage.getItem(STORAGE_KEY) || 'fr';
  }

  function makePicker(lang, label) {
    $('#site-language')?.closest('.language-picker-wrap')?.remove();

    const wrap = document.createElement('div');
    wrap.className = 'language-picker-wrap';
    wrap.innerHTML =
      `<label class="language-picker-label" for="site-language">${label}</label>` +
      `<select id="site-language" class="language-picker" aria-label="${label}">` +
      Object.entries(LANGS)
        .map(([key, name]) => `<option value="${key}"${key === lang ? ' selected' : ''}>${name}</option>`)
        .join('') +
      `</select>`;

    $('.header-inner')?.append(wrap);

    $('#site-language')?.addEventListener('change', event => {
      const next = event.target.value;
      localStorage.setItem(STORAGE_KEY, next);
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      location.href = url.toString();
    });
  }

  function addCss() {
    if ($('#feather-i18n-style')) return;

    const style = document.createElement('style');
    style.id = 'feather-i18n-style';
    style.textContent = `
      .language-picker-wrap { display:inline-flex; align-items:center; margin-left:auto; }
      .language-picker-label { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
      .language-picker { min-height:34px; padding:6px 30px 6px 10px; border:1px solid rgba(255,255,255,.30); border-radius:8px; color:#fff; background:rgba(255,255,255,.08); font:700 .82rem/1 Inter,ui-sans-serif,system-ui,sans-serif; cursor:pointer; }
      .language-picker:focus-visible { outline:3px solid var(--yellow-light,#ffe36e); outline-offset:3px; }
      .language-picker option { color:#101725; background:#fff; }
      .header-inner { flex-wrap:wrap; }
      @media(max-width:560px) {
        .header-inner { gap:10px; min-height:72px; }
        .language-picker-wrap { margin-left:0; }
        .language-picker { min-height:32px; font-size:.76rem; }
      }
    `;
    document.head.append(style);
  }

  function cacheLegalEnglish(page) {
    window.__featherLegalEnglish ||= {};
    if (!window.__featherLegalEnglish[page]) {
      window.__featherLegalEnglish[page] = {
        document: $('.document')?.innerHTML || '',
        toc: $('.toc')?.innerHTML || ''
      };
    }
    return window.__featherLegalEnglish[page];
  }

  function renderSections(sections) {
    return sections
      .map(section => `<section id="${section.id}"><h2>${section.title}</h2>${section.html}</section>`)
      .join('');
  }

  function localizeIndex(t) {
    document.title = t.title;
    $('meta[name="description"]')?.setAttribute('content', t.description);

    setText('.nav a[href="#pipi-panic"]', t.navGame);
    setText('.nav a[href="#auteurs"]', t.navAuthors);
    setText('.nav a[href="#reseaux"]', t.navSocial);

    setText('.hero h1', t.heroTitle);
    setText('.hero-copy', t.heroCopy);
    setText('.button-primary', t.discover);
    setText('.button-secondary', t.authors);

    setText('.tech-card > p', t.technologies);
    setHtml('.tech-card > strong', t.techStack);
    $('.tech-card')?.setAttribute('aria-label', t.techAria || t.technologies);

    setText('#pipi-panic .section-kicker', t.gameKicker);
    setText('#pipi-panic .section-title', t.gameTitle);
    setText('#pipi-panic > .container > .section-text', t.gameIntro);

    const details = $('#pipi-panic .project-details');
    if (details) {
      setText('h3', t.gameHeading, details);
      const description = $('p', details);
      if (description) description.textContent = t.gameText;

      $$('.fact', details).forEach((fact, index) => {
        const label = $('span', fact);
        if (label) label.textContent = [t.platform, t.engine, t.studio, t.status][index] || label.textContent;

        const value = $('strong', fact);
        const translations = [t.platformValue, t.engineValue, t.studioValue, t.statusValue];
        if (value && typeof translations[index] === 'string') value.textContent = translations[index];
      });
    }

    setText('#auteurs .section-kicker', t.authorsKicker);
    setText('#auteurs .section-title', t.authorsTitle);
    setText('#auteurs > .container > .section-text', t.authorsText);

    $$('#auteurs .author-card').forEach((card, index) => {
      setText('.author-role', t.coauthor, card);
      const paragraphs = $$('p', card);
      if (paragraphs[1]) paragraphs[1].textContent = index === 0 ? t.ikarugaText : t.condorText;
    });

    setText('.site-legal-links a[href="privacy.html"]', pageLabel(t, 'privacy'));
    setText('.site-legal-links a[href="terms.html"]', pageLabel(t, 'terms'));
    $('.brand')?.setAttribute('aria-label', t.homeAria);
    $('.site-legal-links')?.setAttribute('aria-label', t.legalAria);
  }

  function localizeLegal(lang, t) {
    const page = document.body.dataset.page;
    const legal = t.legal || {};

    document.title = page === 'privacy'
      ? `${legal.privacyTitle} — Pipi Panic | Feather Labs Interactive`
      : `${legal.termsTitle} — Pipi Panic | Feather Labs Interactive`;

    $('meta[name="description"]')?.setAttribute(
      'content',
      page === 'privacy' ? legal.privacyLead : legal.termsLead
    );

    setText('.header-links a[href="index.html"]', legal.home);
    setText('.header-links a[href="privacy.html"]', legal.privacy);
    setText('.header-links a[href="terms.html"]', legal.terms);
    setText('.eyebrow', legal.kicker);
    setText('h1', page === 'privacy' ? legal.privacyTitle : legal.termsTitle);
    setText('.lead', page === 'privacy' ? legal.privacyLead : legal.termsLead);
    setText('.effective', legal.effective);

    const notice = $('.notice');
    if (notice) notice.innerHTML = `<strong>${legal.scopeLabel}</strong> ${legal.scopeText}`;

    const original = cacheLegalEnglish(page);
    const translated = t[page];

    if (lang === 'en' || !translated?.sections) {
      $('.document').innerHTML = original.document;
      $('.toc').innerHTML = original.toc;
    } else {
      $('.document').innerHTML = renderSections(translated.sections);
      $('.toc').innerHTML =
        `<p>${legal.onThisPage}</p>` +
        translated.sections
          .map(section => `<a href="#${section.id}">${section.toc || section.title.replace(/^\d+\.\s*/, '')}</a>`)
          .join('');
    }

    setText('.footer-links a[href="index.html"]', legal.home);
    setText('.footer-links a[href="privacy.html"]', pageLabel(t, 'privacy'));
    setText('.footer-links a[href="terms.html"]', pageLabel(t, 'terms'));
    setText('.footer-links a[href^="mailto:"]', legal.contact);
    $('.footer-links')?.setAttribute('aria-label', legal.footerAria);
  }

  function rewriteInternalLinks(lang) {
    $$('a[href="index.html"], a[href="privacy.html"], a[href="terms.html"]').forEach(link => {
      const file = link.getAttribute('href');
      link.setAttribute('href', `${file}?lang=${encodeURIComponent(lang)}`);
    });
  }

  function init() {
    const lang = currentLanguage();
    const t = DATA()[lang] || DATA().en || DATA().fr;
    if (!t) return;

    document.documentElement.lang = lang;
    addCss();
    makePicker(lang, t.languageLabel || 'Language');

    if (document.body.dataset.page) localizeLegal(lang, t);
    else localizeIndex(t);

    rewriteInternalLinks(lang);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
