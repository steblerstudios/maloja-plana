// Lightweight i18n system for Maloja Plana
// Zero dependencies — uses React Context + simple key lookup
// Lazy-loads only the active language to reduce initial bundle size

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

const STORAGE_KEY = 'or5_lang';
const SUPPORTED = ['en', 'de', 'fr', 'it', 'rm'];
const DEFAULT_LANG = 'en';

// Sprachen mit Rechts-nach-links-Schrift. Vorbereitet für den Asyl-Sprachausbau
// (z.B. Arabisch). Setzt <html dir="rtl"> für korrektes Layout.
const RTL_LANGUAGES = ['ar', 'fa', 'ur', 'he'];
export function isRTL(lang) { return RTL_LANGUAGES.includes(lang); }
function applyHtmlLang(lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
}

const loaders = {
  en: () => import('./en.js'),
  de: () => import('./de.js'),
  fr: () => import('./fr.js'),
  it: () => import('./it.js'),
  rm: () => import('./rm.js'),
};

const cache = {};

async function loadTranslation(lang) {
  if (cache[lang]) return cache[lang];
  const mod = await loaders[lang]();
  cache[lang] = mod.default;
  return cache[lang];
}

// Reine, testbare Sprachauswahl: Vorrang URL → gespeichert → Browser → Default.
// Nimmt nur Rohwerte entgegen, kein window/localStorage-Zugriff (deterministisch).
export function resolveInitialLang({ urlLang, stored, navLang } = {}) {
  const url = (urlLang || '').toLowerCase();
  if (SUPPORTED.includes(url)) return url;                 // 1) geteilter Link ?lang=
  if (stored && SUPPORTED.includes(stored)) return stored; // 2) frühere Wahl
  const prefix = (navLang || '').toLowerCase().split('-')[0];
  if (SUPPORTED.includes(prefix)) return prefix;           // 3) Browsersprache
  return DEFAULT_LANG;                                      // 4) Fallback
}

function detectLanguage() {
  let urlLang = '', stored = '', navLang = '';
  try { urlLang = new URLSearchParams(window.location.search).get('lang') || ''; } catch (e) { /* kein window/URL */ }
  try { stored = localStorage.getItem(STORAGE_KEY) || ''; } catch (e) { /* localStorage unavailable */ }
  try { navLang = navigator.language || ''; } catch (e) { /* kein navigator */ }
  return resolveInitialLang({ urlLang, stored, navLang });
}

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

// Exportiert für Unit-Tests (reine Funktion: Translations-Objekt rein, t() raus).
export function createT(translations, lang, anrede) {
  return function t(key, params) {
    let val = resolve(translations[lang], key);
    if (val === undefined && lang !== DEFAULT_LANG) val = resolve(translations[DEFAULT_LANG], key);
    if (val === undefined) return key;

    // Anrede-Varianten: { sie: '…', du: '…' } → passende Form wählen (Standard: Sie)
    if (val && typeof val === 'object' && typeof val.sie === 'string' && typeof val.du === 'string') {
      val = anrede === 'du' ? val.du : val.sie;
    }

    if (params && typeof val === 'string') {
      return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : '{' + k + '}'));
    }
    return val;
  };
}

// Sprachwechsel ohne Blitzen (K43): Die angezeigte Sprache wechselt erst, wenn
// die neue Sprache UND die Rückfall-Sprache geladen sind. Bis dahin bleibt die
// bisherige sichtbar — rohe Schlüssel erscheinen nie. Nur die zuletzt gewählte
// Sprache zählt (schneller Doppelwechsel); ältere Ergebnisse und Fehler werden
// verworfen. Ladefehler → onError, die angezeigte Sprache bleibt.
// Exportiert für Unit-Tests (kein DOM nötig).
export function createLanguageSwitch({ load, onReady, onError }) {
  let latest = 0;
  let stopped = false;
  const request = (lang, opts) => {
    const id = ++latest;
    const needed = lang === DEFAULT_LANG ? [lang] : [lang, DEFAULT_LANG];
    const current = () => !stopped && id === latest;
    return Promise.all(needed.map((l) => load(l))).then(
      () => { if (current()) onReady(lang, opts); },
      (err) => { if (current() && onError) onError(lang, err, opts); },
    );
  };
  request.stop = () => { stopped = true; };
  return request;
}

function persistLanguage(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* */ }
  // URL ohne Reload aktualisieren, damit Link/SEO der aktiven Sprache entspricht
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  } catch (e) { /* History API nicht verfügbar */ }
}

// ─── K60: Startfehler statt weisser Seite ─────────────────────
// Scheitern beim ersten Start gewählte UND Rückfall-Sprache (Chunk-404 nach
// einem Deploy mit alter index.html, offline), wird einmal pro Sitzung neu
// geladen; danach erscheint ein ruhiger Fehlerzustand. Die Sprachdateien sind
// dann nicht verfügbar — deshalb stehen die Texte hier fest.
const RELOAD_MARK = 'or5_i18n_reload';

function sessionStore() {
  try { return window.sessionStorage; } catch (e) { return undefined; }
}

// Gibt true zurück, wenn neu geladen wird. Ohne nutzbaren Sitzungsspeicher
// kein Neuladen — eine Endlosschleife liesse sich sonst nicht ausschliessen.
export function neuLadenEinmal({ storage, reload }) {
  try {
    if (!storage || storage.getItem(RELOAD_MARK)) return false;
    storage.setItem(RELOAD_MARK, '1');
  } catch (e) { return false; }
  reload();
  return true;
}

export function neuLadenMarkeLoeschen(storage) {
  try { if (storage) storage.removeItem(RELOAD_MARK); } catch (e) { /* */ }
}

// Ablauf bei einem Ladefehler vor der ersten angezeigten Sprache.
export function startLadefehler({ lang, defaultLang, request, reloadOnce, fail }) {
  if (lang !== defaultLang) request(defaultLang);
  else if (!reloadOnce()) fail();
}

const START_FEHLER = {
  de: ['Maloja konnte nicht vollständig geladen werden. Bitte laden Sie die Seite neu.', 'Neu laden'],
  fr: ['Maloja n’a pas pu être chargé entièrement. Veuillez recharger la page.', 'Recharger'],
  it: ['Maloja non è stato caricato completamente. Ricarichi la pagina.', 'Ricarica'],
  en: ['Maloja could not be loaded completely. Please reload the page.', 'Reload'],
};

export function startFehlerText(navLang) {
  const p = String(navLang || '').toLowerCase().split('-')[0];
  const lang = START_FEHLER[p] ? p : 'de';
  return { lang, text: START_FEHLER[lang][0], knopf: START_FEHLER[lang][1] };
}

const START_FEHLER_CSS = '.or5-sf{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:24px;box-sizing:border-box;background:#f7f5f0;color:#2b2a27;font:17px/1.5 system-ui,sans-serif;text-align:center}'
  + '.or5-sf p{margin:0;max-width:32em}'
  + '.or5-sf button{min-height:44px;min-width:44px;padding:10px 20px;border:1px solid #2b2a27;border-radius:8px;background:#2b2a27;color:#f7f5f0;font:inherit;cursor:pointer}'
  + '@media (prefers-color-scheme: dark){.or5-sf{background:#1c1b19;color:#ecebe6}.or5-sf button{background:#ecebe6;color:#1c1b19;border-color:#ecebe6}}';

export function StartFehler({ navLang }) {
  const { lang, text, knopf } = startFehlerText(navLang);
  const h = React.createElement;
  return h('div', { className: 'or5-sf', role: 'alert', lang },
    h('style', null, START_FEHLER_CSS),
    h('p', null, text),
    h('button', { type: 'button', onClick: () => window.location.reload() }, knopf));
}

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  // lang = die ANGEZEIGTE Sprache; null, solange noch keine geladen ist.
  const [lang, setLangState] = useState(null);
  const [anrede, setAnredeState] = useState(() => { try { return localStorage.getItem('or5_anrede') || 'sie'; } catch (e) { return 'sie'; } });
  const [translations, setTranslations] = useState({});
  const [startFehler, setStartFehler] = useState(false);
  const langRef = useRef(null);
  const switchRef = useRef(null);

  // Je Mount ein eigener Umschalter (StrictMode mountet doppelt: der erste wird
  // beim Aushängen gestoppt, der zweite übernimmt).
  useEffect(() => {
    const request = createLanguageSwitch({
      load: loadTranslation,
      onReady: (l, opts) => {
        if (langRef.current === null) neuLadenMarkeLoeschen(sessionStore());
        langRef.current = l;
        setTranslations({ ...cache });
        setLangState(l);
        if (opts && opts.persist) persistLanguage(l);
      },
      onError: (l) => {
        // Erststart: gewählte Sprache nicht ladbar → Rückfall-Sprache → einmal
        // neu laden → Fehlerzustand (K60). Später: bisherige Sprache bleibt stehen.
        if (langRef.current !== null) return;
        startLadefehler({
          lang: l,
          defaultLang: DEFAULT_LANG,
          request,
          reloadOnce: () => neuLadenEinmal({ storage: sessionStore(), reload: () => window.location.reload() }),
          fail: () => setStartFehler(true),
        });
      },
    });
    switchRef.current = request;
    request(langRef.current || detectLanguage());
    return () => request.stop();
  }, []);

  const setLanguage = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang) && switchRef.current) switchRef.current(newLang, { persist: true });
  }, []);

  const setAnrede = useCallback((a) => {
    const v = a === 'du' ? 'du' : 'sie';
    setAnredeState(v);
    try { localStorage.setItem('or5_anrede', v); } catch (e) { /* */ }
  }, []);

  // <html lang> folgt der angezeigten Sprache, nicht der gerade ladenden.
  useEffect(() => {
    if (lang) applyHtmlLang(lang);
  }, [lang]);

  // lang ist hier immer geladen (onReady setzt beides zusammen).
  const t = useMemo(() => createT(translations, lang, anrede), [lang, translations, anrede]);

  const value = { t, lang, setLanguage, anrede, setAnrede, supportedLanguages: SUPPORTED };

  if (!lang) {
    if (!startFehler) return null;
    // Die gewählte Sprache (?lang=, gespeichert, Browser) — nicht nur der Browser.
    return React.createElement(StartFehler, { navLang: detectLanguage() });
  }

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside I18nProvider');
  return ctx;
}

export function createTranslator(lang) {
  const safeLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
  if (!cache[safeLang]) return (key) => key;
  return createT(cache, safeLang);
}

export { SUPPORTED as SUPPORTED_LANGUAGES };
