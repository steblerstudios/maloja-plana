// Lightweight i18n system for Maloja Plana
// Zero dependencies — uses React Context + simple key lookup
// Lazy-loads only the active language to reduce initial bundle size

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

const STORAGE_KEY = 'or5_lang';
const SUPPORTED = ['en', 'de', 'fr', 'it', 'rm'];
const DEFAULT_LANG = 'en';

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

function detectLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (e) { /* localStorage unavailable */ }

  const nav = (navigator.language || '').toLowerCase();
  const prefix = nav.split('-')[0];
  if (SUPPORTED.includes(prefix)) return prefix;

  return DEFAULT_LANG;
}

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function createT(translations, lang) {
  return function t(key, params) {
    let val = resolve(translations[lang], key);
    if (val === undefined && lang !== DEFAULT_LANG) val = resolve(translations[DEFAULT_LANG], key);
    if (val === undefined) return key;

    if (params && typeof val === 'string') {
      return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : '{' + k + '}'));
    }
    return val;
  };
}

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);
  const [translations, setTranslations] = useState({});
  const [ready, setReady] = useState(false);
  const loadingRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const promises = [loadTranslation(lang)];
      if (lang !== DEFAULT_LANG) promises.push(loadTranslation(DEFAULT_LANG));
      await Promise.all(promises);
      if (!cancelled) {
        setTranslations({ ...cache });
        setReady(true);
      }
    };
    loadingRef.current = lang;
    load();
    return () => { cancelled = true; };
  }, [lang]);

  const setLanguage = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang)) {
      setLangState(newLang);
      try { localStorage.setItem(STORAGE_KEY, newLang); } catch (e) { /* */ }
      document.documentElement.lang = newLang;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    if (!translations[lang]) return (key) => key;
    return createT(translations, lang);
  }, [lang, translations]);

  const value = { t, lang, setLanguage, supportedLanguages: SUPPORTED };

  if (!ready) return null;

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
