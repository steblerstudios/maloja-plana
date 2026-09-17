// K58 Teil 2 — Beim Sprachwechsel ein leiser Ladehinweis (erst nach 300 ms,
// damit er bei schnellem Laden nicht aufblitzt) und bei einem Ladefehler eine
// ruhige Meldung: Rückfall auf Deutsch, erneuter Versuch möglich. Die Texte der
// Meldung stehen fest im Hauptbundle — die Zielsprache ist ja nicht geladen.
//
// Kein DOM im Testlauf: geprüft werden die Bausteine des I18nProvider
// (createLanguageSwitch + createLadeAnzeige, verdrahtet wie dort) und das
// Markup des Hinweises (renderToString).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createLanguageSwitch, createLadeAnzeige, sprachLadenText, SprachLadeHinweis } from '../index.js';

function aufgeschoben() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// Nachbau des Provider-Ablaufs (setLanguage → start; onReady → fertig;
// onError → Rückfall de + fehler; erneut → setLanguage(fehler)).
function aufbau({ geladen = ['en', 'de'], angezeigt = 'en' } = {}) {
  const cache = Object.fromEntries(geladen.map((l) => [l, { l }]));
  const offen = {};
  const z = { lang: angezeigt, gespeichert: [], anzeige: null };
  const load = (l) => {
    if (cache[l]) return Promise.resolve(cache[l]);
    offen[l] = aufgeschoben();
    offen[l].promise.then((v) => { cache[l] = v; }, () => {});
    return offen[l].promise;
  };
  const anzeige = createLadeAnzeige({ onChange: (s) => { z.anzeige = s; } });
  const request = createLanguageSwitch({
    load,
    onReady: (l, opts) => { z.lang = l; if (opts && opts.persist) z.gespeichert.push(l); anzeige.fertig(l); },
    onError: (l) => { if (cache.de) z.lang = 'de'; anzeige.fehler(l); },
  });
  const setLanguage = (l) => { anzeige.start(l); return request(l, { persist: true }); };
  const erneut = () => setLanguage(anzeige.zustand.fehler);
  return { z, offen, anzeige, setLanguage, erneut };
}

const warte = () => new Promise((r) => { r(); }).then(() => {});

describe('K58 Ladehinweis beim Sprachwechsel', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('schnelles Laden: kein Hinweis, auch nicht nach der Verzögerung', async () => {
    const a = aufbau();
    await a.setLanguage('de'); // bereits geladen → sofort fertig
    expect(a.z.lang).toBe('de');
    expect(a.anzeige.zustand).toEqual({ laedt: null, hinweis: false, fehler: null });
    vi.advanceTimersByTime(1000);
    expect(a.anzeige.zustand.hinweis).toBe(false);
  });

  it('langsames Laden: Hinweis erst nach 300 ms, verschwindet nach dem Laden', async () => {
    const a = aufbau();
    const fertig = a.setLanguage('fr');
    vi.advanceTimersByTime(299);
    expect(a.anzeige.zustand.hinweis).toBe(false);
    vi.advanceTimersByTime(1);
    expect(a.anzeige.zustand).toMatchObject({ laedt: 'fr', hinweis: true, fehler: null });
    expect(a.z.lang).toBe('en'); // bisherige Sprache bleibt stehen (K43)
    a.offen.fr.resolve({ l: 'fr' });
    await fertig;
    expect(a.z.lang).toBe('fr');
    expect(a.anzeige.zustand).toEqual({ laedt: null, hinweis: false, fehler: null });
  });

  it('Doppelwechsel: nur die zuletzt gewählte Sprache steuert den Hinweis', async () => {
    const a = aufbau();
    const erst = a.setLanguage('fr');
    const dann = a.setLanguage('de');
    await dann;
    a.offen.fr.reject(new Error('404'));
    await erst;
    vi.advanceTimersByTime(1000);
    expect(a.z.lang).toBe('de');
    expect(a.anzeige.zustand).toEqual({ laedt: null, hinweis: false, fehler: null });
  });
});

describe('K58 Meldung beim Ladefehler', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('Fehler: Meldung, Rückfall auf Deutsch, nicht gespeichert', async () => {
    const a = aufbau();
    const p = a.setLanguage('it');
    vi.advanceTimersByTime(400);
    a.offen.it.reject(new Error('offline'));
    await p;
    expect(a.z.lang).toBe('de');
    expect(a.z.gespeichert).toEqual([]);
    expect(a.anzeige.zustand).toEqual({ laedt: null, hinweis: false, fehler: 'it' });
  });

  it('erneuter Versuch: Meldung weg, bei Erfolg die gewählte Sprache', async () => {
    const a = aufbau();
    const p = a.setLanguage('fr');
    a.offen.fr.reject(new Error('offline'));
    await p;
    const q = a.erneut();
    expect(a.anzeige.zustand).toMatchObject({ laedt: 'fr', fehler: null });
    a.offen.fr.resolve({ l: 'fr' });
    await q;
    expect(a.z.lang).toBe('fr');
    expect(a.z.gespeichert).toEqual(['fr']);
    expect(a.anzeige.zustand.fehler).toBe(null);
  });

  it('erneuter Versuch scheitert wieder: Meldung bleibt, weiter Deutsch', async () => {
    const a = aufbau();
    const p = a.setLanguage('fr');
    a.offen.fr.reject(new Error('offline'));
    await p;
    const q = a.erneut();
    a.offen.fr.reject(new Error('offline'));
    await q;
    await warte();
    expect(a.z.lang).toBe('de');
    expect(a.anzeige.zustand.fehler).toBe('fr');
  });

  it('schliessen entfernt die Meldung und hält keinen Zeitgeber offen', () => {
    const a = aufbau();
    a.anzeige.start('fr');
    a.anzeige.fehler('fr');
    a.anzeige.schliessen();
    expect(a.anzeige.zustand).toEqual({ laedt: null, hinweis: false, fehler: null });
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('K58 Texte ohne geladene Zielsprache', () => {
  it('fr/it/en in der eigenen Sprache, rm und Unbekanntes auf Deutsch', () => {
    expect(sprachLadenText('fr').lang).toBe('fr');
    expect(sprachLadenText('it').lang).toBe('it');
    expect(sprachLadenText('en').lang).toBe('en');
    expect(sprachLadenText('rm').lang).toBe('de');
    expect(sprachLadenText(null).lang).toBe('de');
    expect(sprachLadenText('de').fehler).toBe('Diese Sprache konnte nicht geladen werden. Wir zeigen die Inhalte auf Deutsch.');
  });

  it('jede Fassung ist vollständig (vier nichtleere Texte)', () => {
    for (const l of ['de', 'fr', 'it', 'en']) {
      const tx = sprachLadenText(l);
      for (const k of ['laedt', 'fehler', 'erneut', 'schliessen']) expect(tx[k]).toMatch(/\S/);
    }
  });
});

describe('K58 Markup des Hinweises', () => {
  const html = (zustand) => renderToString(React.createElement(SprachLadeHinweis, { zustand, onRetry: () => {}, onClose: () => {} }));

  it('Live-Region steht immer da, leer solange nichts zu sagen ist', () => {
    for (const z of [null, { laedt: 'fr', hinweis: false, fehler: null }]) {
      const s = html(z);
      expect(s).toContain('aria-live="polite"');
      expect(s).not.toContain('<p>');
    }
  });

  it('Ladehinweis in der Zielsprache, ohne Knöpfe', () => {
    const s = html({ laedt: 'fr', hinweis: true, fehler: null });
    expect(s).toContain('lang="fr"');
    expect(s).toContain('Chargement de la langue');
    expect(s).not.toContain('<button');
  });

  it('Fehlermeldung mit «erneut versuchen» und benanntem Schliessen-Knopf', () => {
    const s = html({ laedt: null, hinweis: false, fehler: 'it' });
    expect(s).toContain('lang="it"');
    expect(s).toContain('in tedesco');
    expect(s).toContain('>Riprova</button>');
    expect(s).toContain('aria-label="Chiudi"');
    expect(s).toContain('type="button"');
  });
});
