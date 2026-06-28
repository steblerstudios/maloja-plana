import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'or5_vorlesen';

const LANG_MAP = {
  de: 'de-CH',
  en: 'en-US',
  fr: 'fr-CH',
  it: 'it-CH',
  rm: 'de-CH',
};

export function useVorlesen(lang) {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });
  const utteranceRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0'); } catch {}
  }, [enabled]);

  const stop = useCallback(() => {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text) => {
    if (!text || typeof speechSynthesis === 'undefined') return;
    stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_MAP[lang] || 'de-CH';
    u.rate = 0.9;
    u.pitch = 1;
    utteranceRef.current = u;
    speechSynthesis.speak(u);
  }, [lang, stop]);

  const toggle = useCallback(() => setEnabled(prev => !prev), []);
  const enable = useCallback(() => setEnabled(true), []);

  useEffect(() => stop, [stop]);

  return { enabled, toggle, enable, speak, stop };
}
