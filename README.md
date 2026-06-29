FEATHER LABS INTERACTIVE — MULTILINGUAL LEGAL PAGES

FILES :
- index.html
- privacy.html
- terms.html
- i18n.js
- translations-base.js
- translations-legal-fr-es.js
- translations-legal-it-de.js
- translations-legal-cjk.js

WHAT CHANGED
- A language selector is present on every page.
- Supported languages: Français, English, Español, Italiano, Deutsch, 简体中文, 日本語, 한국어.
- The selection is saved only in the visitor's browser localStorage. It does not create a cookie and is not sent to Feather Labs.
- Internal links keep the chosen language through the ?lang= parameter.
- Legal page translations are bundled locally: no external translation service is contacted.

PUBLIC URLS
- https://featherlabs2026.github.io/
- https://featherlabs2026.github.io/privacy.html
- https://featherlabs2026.github.io/terms.html

GOOGLE PLAY
Use the privacy page URL above in the Google Play privacy-policy field.

IMPLEMENTATION CHECK BEFORE RELEASE
The policy describes AdMob / Google Mobile Ads SDK processing. Before the app goes live in the EEA, UK, or Switzerland, implement and test Google User Messaging Platform (UMP) consent and its privacy-options entry point when Google requires it for your configuration. Complete Google Play's Data safety form from the SDKs and features actually included in the release build.

LEGAL NOTE
The translations are operational website translations of the supplied English legal drafts. Before a broad commercial release, have the final policy and terms reviewed for the actual SDK configuration, age rating, in-app purchases, and the countries targeted by the release.
