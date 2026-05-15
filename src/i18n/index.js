// Lightweight i18n system for Ordnung & Ruhe
// Zero dependencies — uses React Context + simple key lookup

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import en from './en.js';
import de from './de.js';
import fr from './fr.js';
import it from './it.js';

const STORAGE_KEY = 'or5_lang';
const SUPPORTED = ['en', 'de', 'fr', 'it'];
const DEFAULT_LANG = 'en';

const translations = { en, de, fr, it };

// Detect best language from browser
function detectLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (e) { /* localStorage unavailable */ }

  const nav = (navigator.language || '').toLowerCase();
  // Swiss locale codes: de-CH, fr-CH, it-CH
  const prefix = nav.split('-')[0];
  if (SUPPORTED.includes(prefix)) return prefix;

  return DEFAULT_LANG;
}

// Resolve nested key like "dashboard.welcome.title"
function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

// Create translation function
function createT(lang) {
  return function t(key, params) {
    // Try current language, then English fallback, then return key
    let val = resolve(translations[lang], key);
    if (val === undefined) val = resolve(translations[DEFAULT_LANG], key);
    if (val === undefined) return key;

    // Interpolate {placeholders}
    if (params && typeof val === 'string') {
      return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : '{' + k + '}'));
    }
    return val;
  };
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage);

  const setLanguage = useCallback((newLang) => {
    if (SUPPORTED.includes(newLang)) {
      setLangState(newLang);
      try { localStorage.setItem(STORAGE_KEY, newLang); } catch (e) { /* */ }
      document.documentElement.lang = newLang;
    }
  }, []);

  // Set initial lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const t = useMemo(() => createT(lang), [lang]);

  const value = { t, lang, setLanguage, supportedLanguages: SUPPORTED };

  return React.createElement(I18nContext.Provider, { value }, children);
}

// Hook for components
export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside I18nProvider');
  return ctx;
}

// For utility functions that need t() without hooks
export function createTranslator(lang) {
  const safeLang = SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
  return createT(safeLang);
}

export { SUPPORTED as SUPPORTED_LANGUAGES };
