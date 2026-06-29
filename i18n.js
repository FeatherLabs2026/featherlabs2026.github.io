/* Feather Labs Interactive — static multilingual layer; no external translation service. */
(() => {
  'use strict';

  const STORAGE_KEY = 'featherlabs-language';
  const LANGS = {
    fr: 'Français', en: 'English', es: 'Español', it: 'Italiano',
    de: 'Deutsch', zh: '简体中文', ja: '日本語', ko: '한국어'
  };

  const DATA = () => window.FEATHER_TRANSLATIONS || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function textValue(...values) {
    return values.find((value) => typeof value === 'string' && value.trim()) || '';
  }

  function setText(selector, value, root = document) {
    const node = $(selector, root);
    if (node && typeof value === 'string') node.textContent = value;
  }

  function setFirstText(selectors, value, root = document) {
    if (typeof value !== 'string') return;
    for (const selector of selectors) {
      const node = $(selector, root);
      if (node) {
        node.textContent = value;
        return;
      }
    }
  }

  function languageFromUrl() {
    const lang = new URLSearchParams(location.search).get('lang');
    return LANGS[lang] ? lang : null;
  }

  function currentLanguage() {
    try {
      return languageFromUrl() || localStorage.getItem(STORAGE_KEY) || 'fr';
    } catch (_) {
      return languageFromUrl() || 'fr';
    }
  }

  function makePicker(lang, label) {
    $('#site-language')?.closest('.language-picker-wrap')?.remove();

    const header = $('.header-inner');
    if (!header) return;

    const wrap = document.createElement('div');
    wrap.className = 'language-picker-wrap';
    wrap.innerHTML = `
      <label class="language-picker-label" for="site-language">${label}</label>
      <select id="site-language" class="language-picker" aria-label="${label}">
        ${Object.entries(LANGS).map(([key, name]) =>
          `<option value="${key}"${key === lang ? ' selected' : ''}>${name}</option>`
        ).join('')}
      </select>
    `;

    header.append(wrap);
    $('#site-language')?.addEventListener('change', (event) => {
      const next = event.target.value;
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      location.assign(url.toString());
    });
  }

  function addCss() {
    if ($('#feather-i18n-style')) return;

    const style = document.createElement('style');
    style.id = 'feather-i18n-style';
    style.textContent = `
      .language-picker-wrap{display:inline-flex;align-items:center;margin-left:auto}
      .language-picker-label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      .language-picker{min-height:34px;padding:6px 30px 6px 10px;border:1px solid rgba(255,255,255,.30);border-radius:8px;color:#fff;background:rgba(255,255,255,.08);font:700 .82rem/1 Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
      .language-picker:focus-visible{outline:3px solid var(--yellow-light,#ffe36e);outline-offset:3px}
      .language-picker option{color:#101725;background:#fff}
      .header-inner{flex-wrap:wrap}
      @media(max-width:560px){.header-inner{gap:10px;min-height:72px}.language-picker-wrap{margin-left:0}.language-picker{min-height:32px;font-size:.76rem}}
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
    return sections.map((section) =>
      `<section id="${section.id}"><h2>${section.title}</h2>${section.html}</section>`
    ).join('');
  }

  function legalStrings(t) {
    const legal = t && typeof t.legal === 'object' && t.legal ? t.legal : {};
    return {
      object: legal,
      privacyFooter: textValue(
        legal.privacyTitle,
        legal.privacy,
        typeof t?.privacy === 'string' ? t.privacy : '',
        'Privacy Policy'
      ),
      termsFooter: textValue(
        legal.termsTitle,
        legal.terms,
        typeof t?.terms === 'string' ? t.terms : '',
        'Terms of Use'
      )
    };
  }

  function localizeIndex(lang, t) {
    const legal = legalStrings(t);

    document.title = textValue(t.title, document.title);
    const description = $('meta[name="description"]');
    if (description && typeof t.description === 'string') {
      description.setAttribute('content', t.description);
    }

    setText('.nav a[href="#pipi-panic"]', t.navGame);
    setText('.nav a[href="#auteurs"]', t.navAuthors);
    setText('.nav a[href="#reseaux"]', t.navSocial);
    setText('.hero h1', t.heroTitle);
    setText('.button-primary', t.discover);
    setText('.button-secondary', t.authors);

    // Stable IDs are used first; class selectors keep the script compatible with older markup.
    setFirstText(['#hero-copy', '.hero .hero-copy'], t.heroCopy);
    setFirstText(['#hero-tech-label', '.hero .tech-card > p'], t.technologies);
    setFirstText(['#hero-tech-title', '.hero .tech-card > strong'], t.techCardTitle);

    const techCard = $('#hero-tech-card') || $('.hero .tech-card');
    if (techCard) {
      techCard.setAttribute('aria-label', textValue(t.techCardAria, t.technologies, 'Technologies'));
    }

    setText('#pipi-panic .section-kicker', t.gameKicker);
    setText('#pipi-panic .section-title', t.gameTitle);
    setText('#pipi-panic > .container > .section-text', t.gameIntro);

    const details = $('#pipi-panic .project-details');
    if (details) {
      setText('h3', t.gameHeading, details);
      const paragraphs = $$('p', details);
      if (paragraphs[0] && typeof t.gameText === 'string') paragraphs[0].textContent = t.gameText;
      $$('.fact', details).forEach((fact, index) => {
        const label = $('span', fact);
        const labels = [t.platform, t.engine, t.studio, t.status];
        if (label && typeof labels[index] === 'string') label.textContent = labels[index];
      });
    }

    const gallery = $('#galerie');
    if (gallery) {
      setText('.section-kicker', t.galleryKicker, gallery);
      setText('.section-title', t.galleryTitle, gallery);
      setText('.section-text', t.galleryText, gallery);
      $('.gallery-controls', gallery)?.setAttribute(
        'aria-label', textValue(t.galleryControlsAria, 'Gallery navigation')
      );
      $('[data-gallery-scroll="previous"]', gallery)?.setAttribute(
        'aria-label', textValue(t.galleryPrevious, 'Previous image')
      );
      $('[data-gallery-scroll="next"]', gallery)?.setAttribute(
        'aria-label', textValue(t.galleryNext, 'Next image')
      );
      $('.gallery-track', gallery)?.setAttribute(
        'aria-label', textValue(t.galleryAria, 'Pipi Panic screenshots')
      );
      $$('[data-gallery-image]', gallery).forEach((image, index) => {
        image.alt = `${textValue(t.galleryImageAlt, 'Pipi Panic screenshot')} ${index + 1}`;
      });
    }

    setText('#auteurs .section-kicker', t.authorsKicker);
    setText('#auteurs .section-title', t.authorsTitle);
    setText('#auteurs > .container > .section-text', t.authorsText);

    $$('#auteurs .author-card').forEach((card, index) => {
      setText('.author-role', t.coauthor, card);
      const paragraphs = $$('p', card);
      const biography = index === 0 ? t.ikarugaText : t.condorText;
      if (paragraphs[1] && typeof biography === 'string') paragraphs[1].textContent = biography;
    });

    setText('[data-social-label="tippee"]', textValue(t.tippeeSupport, 'Tipeee — Support Ikaruga'));

    // Never write an object to the footer. IDs prevent language query strings from breaking a selector.
    setFirstText(
      ['#footer-privacy-link', '.site-legal-links a[href="privacy.html"]'],
      legal.privacyFooter
    );
    setFirstText(
      ['#footer-terms-link', '.site-legal-links a[href="terms.html"]'],
      legal.termsFooter
    );

    $('.brand')?.setAttribute('aria-label', textValue(t.homeAria, 'Feather Labs Interactive — home'));
    $('.site-legal-links')?.setAttribute(
      'aria-label', textValue(t.legalAria, legal.object.footerAria, 'Legal information')
    );
  }

  function localizeLegal(lang, t) {
    const page = document.body.dataset.page;
    const legal = t && typeof t.legal === 'object' && t.legal ? t.legal : {};
    const privacyTitle = textValue(legal.privacyTitle, 'Privacy Policy');
    const termsTitle = textValue(legal.termsTitle, 'Terms of Use');

    document.title = page === 'privacy'
      ? `${privacyTitle} — Pipi Panic | Feather Labs Interactive`
      : `${termsTitle} — Pipi Panic | Feather Labs Interactive`;

    const description = $('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        page === 'privacy'
          ? textValue(legal.privacyLead, privacyTitle)
          : textValue(legal.termsLead, termsTitle)
      );
    }

    setText('.header-links a[href="index.html"]', legal.home);
    setText('.header-links a[href="privacy.html"]', legal.privacy);
    setText('.header-links a[href="terms.html"]', legal.terms);
    setText('.eyebrow', legal.kicker);
    setText('h1', page === 'privacy' ? privacyTitle : termsTitle);
    setText('.lead', page === 'privacy' ? legal.privacyLead : legal.termsLead);
    setText('.effective', legal.effective);

    const notice = $('.notice');
    if (notice) {
      notice.innerHTML = `<strong>${textValue(legal.scopeLabel, 'Scope.')}</strong> ${textValue(legal.scopeText)}`;
    }

    const base = cacheLegalEnglish(page);
    const translated = t[page];

    if (lang === 'en' || !translated || !Array.isArray(translated.sections)) {
      $('.document').innerHTML = base.document;
      $('.toc').innerHTML = base.toc;
    } else {
      $('.document').innerHTML = renderSections(translated.sections);
      $('.toc').innerHTML = `<p>${textValue(legal.onThisPage, 'On this page')}</p>${
        translated.sections.map((section) =>
          `<a href="#${section.id}">${section.toc || section.title.replace(/^\d+\.\s*/, '')}</a>`
        ).join('')
      }`;
    }

    setText('.footer-links a[href="index.html"]', legal.home);
    setText('.footer-links a[href="privacy.html"]', privacyTitle);
    setText('.footer-links a[href="terms.html"]', termsTitle);
    setText('.footer-links a[href^="mailto:"]', legal.contact);
    $('.footer-links')?.setAttribute('aria-label', textValue(legal.footerAria, 'Footer navigation'));
  }

  function rewriteInternalLinks(lang) {
    $$('a[href="index.html"], a[href="privacy.html"], a[href="terms.html"]').forEach((link) => {
      const file = link.getAttribute('href');
      if (!file) return;
      link.setAttribute('href', `${file}?lang=${encodeURIComponent(lang)}`);
    });
  }

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    const lang = currentLanguage();
    const translations = DATA();
    const t = translations[lang] || translations.en || translations.fr;
    if (!t || typeof t !== 'object') return;

    document.documentElement.lang = lang;
    addCss();
    makePicker(lang, textValue(t.languageLabel, 'Language'));

    if (document.body.dataset.page) {
      localizeLegal(lang, t);
    } else {
      localizeIndex(lang, t);
    }

    rewriteInternalLinks(lang);
  }

  function refreshIndexAfterLoad() {
    if (document.body.dataset.page) return;

    const lang = currentLanguage();
    const translations = DATA();
    const t = translations[lang] || translations.en || translations.fr;
    if (!t || typeof t !== 'object') return;

    // A final pass protects the visible hero/footer if another local script updated the DOM later.
    localizeIndex(lang, t);
    rewriteInternalLinks(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.addEventListener('load', refreshIndexAfterLoad, { once: true });
})();
