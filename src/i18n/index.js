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

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  // lang = die ANGEZEIGTE Sprache; null, solange noch keine geladen ist.
  const [lang, setLangState] = useState(null);
  const [anrede, setAnredeState] = useState(() => { try { return localStorage.getItem('or5_anrede') || 'sie'; } catch (e) { return 'sie'; } });
  const [translations, setTranslations] = useState({});
  const langRef = useRef(null);
  const switchRef = useRef(null);

  // Je Mount ein eigener Umschalter (StrictMode mountet doppelt: der erste wird
  // beim Aushängen gestoppt, der zweite übernimmt).
  useEffect(() => {
    const request = createLanguageSwitch({
      load: loadTranslation,
      onReady: (l, opts) => {
        langRef.current = l;
        setTranslations({ ...cache });
        setLangState(l);
        if (opts && opts.persist) persistLanguage(l);
      },
      onError: (l) => {
        // Erststart: gewählte Sprache nicht ladbar → Rückfall-Sprache.
        // Später: bisherige Sprache bleibt einfach stehen.
        if (langRef.current === null && l !== DEFAULT_LANG) request(DEFAULT_LANG);
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

  if (!lang) return null;

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
