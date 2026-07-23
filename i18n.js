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
      .social-twitch:hover{color:#bf94ff}
      .social-tipeee:hover{color:var(--yellow-light,#ffe36e)}
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

  function ensureNinjaCondorLinks() {
    const ninjaCard = $$('#auteurs .author-card')[1];
    const links = ninjaCard && $('.social-links', ninjaCard);
    if (!links) return;

    const createLink = (url, className, label, tooltip, svg) => {
      if ($(`[data-ninjacondor-link="${className}"]`, links)) return;

      const link = document.createElement('a');
      link.className = `social-button ${className}`;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${label} — Ninja Condor`);
      link.setAttribute('data-tooltip', tooltip);
      link.setAttribute('data-ninjacondor-link', className);
      link.innerHTML = `<span class="social-icon">${svg}</span><span class="sr-only">${label} — Ninja Condor</span>`;
      links.append(link);
    };

    createLink(
      'https://www.twitch.tv/ninjacondor',
      'social-twitch',
      'Twitch',
      'Twitch',
      '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M4 2h17v12l-4 4h-4l-3 3H7v-3H4V2Zm2 2v12h3v2l2-2h5l3-3V4H6Zm5 3h2v5h-2V7Zm4 0h2v5h-2V7Z"/></svg>'
    );

    createLink(
      'https://fr.tipeee.com/ninjacondor/',
      'social-tipeee',
      'Tipeee',
      'Tipeee',
      '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" d="M4 3h16v4h-6v14h-4V7H4V3Z"/></svg>'
    );
  }

  function localizeMainNav(t) {
    setText('.nav a[href="#pipi-panic"], .nav a[href^="index.html#pipi-panic"], .nav a[href^="pipi-panic.html"]', t.navGame);
    setText('[data-nav-roadmap]', textValue(t.navRoadmap, 'Roadmap'));
    setText('[data-nav-team]', textValue(t.navTeam, t.navAuthors, 'About us'));
    setText('[data-nav-project]', textValue(t.navProject, 'Next Project'));
    setText('[data-nav-genable]', textValue(t.navGenable, 'Genable AI (WIP)'));
  }

  function localizeDataPage(pageKey, t) {
    const page = t && typeof t[pageKey] === 'object' && t[pageKey] ? t[pageKey] : {};

    document.title = textValue(page.title, document.title);
    const description = $('meta[name="description"]');
    if (description && typeof page.description === 'string') {
      description.setAttribute('content', page.description);
    }

    $$('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      const value = page[key];
      if (typeof value === 'string') node.textContent = value;
    });

    localizeMainNav(t);
    $('.brand')?.setAttribute('aria-label', textValue(t.homeAria, 'Feather Labs Interactive — home'));
  }

  function localizeRoadmap(lang, t) {
    localizeDataPage('roadmap', t);
  }

  function localizeAbout(lang, t) {
    localizeDataPage('about', t);
  }

  function localizeGenable(lang, t) {
    localizeDataPage('genable', t);
  }

  function localizeIndex(lang, t) {
    const legal = legalStrings(t);

    document.title = textValue(t.title, document.title);
    const description = $('meta[name="description"]');
    if (description && typeof t.description === 'string') {
      description.setAttribute('content', t.description);
    }

    localizeMainNav(t);
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
      const factLabels = [t.platform, t.engine, t.studio, t.status];
      const factValues = [t.platformValue, t.engineValue, t.studioValue, t.statusValue];

      $$('.fact', details).forEach((fact, index) => {
        const label = $('span', fact);
        const value = $('strong', fact);

        if (label && typeof factLabels[index] === 'string') {
          label.textContent = factLabels[index];
        }
        if (value && typeof factValues[index] === 'string' && factValues[index].trim()) {
          value.textContent = factValues[index];
        }
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
    ensureNinjaCondorLinks();

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

  function localizeNextProject(lang, t) {
    const project = t && typeof t.nextProject === 'object' && t.nextProject ? t.nextProject : {};

    document.title = textValue(
      project.title,
      'Next Project — Coming soon | Feather Labs Interactive'
    );

    const description = $('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        textValue(project.description, 'Next Project — coming soon.')
      );
    }

    localizeMainNav(t);
    setText('[data-project-coming-soon]', project.comingSoon);
    setText('[data-project-back]', project.back);

    $('.brand')?.setAttribute(
      'aria-label',
      textValue(t.homeAria, 'Feather Labs Interactive — home')
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

    setText('.header-links a[href="index.html"], .header-links a[href="pipi-panic.html"]', legal.home);
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
    $$('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !/^(?:index|pipi-panic|privacy|terms|next-project|about|genable-ai)\.html(?:[?#]|$)/.test(href)) return;

      const base = location.href.startsWith('about:') ? 'https://featherlabs.local/' : location.href;
      const url = new URL(href, base);
      url.searchParams.set('lang', lang);
      const file = url.pathname.split('/').pop();
      link.setAttribute('href', `${file}${url.search}${url.hash}`);
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

    const page = document.body.dataset.page;
    if (page === 'privacy' || page === 'terms') {
      localizeLegal(lang, t);
    } else if (page === 'next-project') {
      localizeNextProject(lang, t);
    } else if (page === 'roadmap') {
      localizeRoadmap(lang, t);
    } else if (page === 'about') {
      localizeAbout(lang, t);
    } else if (page === 'genable') {
      localizeGenable(lang, t);
    } else if (page === 'home') {
      localizeDataPage('home', t);
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
