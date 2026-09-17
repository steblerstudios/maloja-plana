// K60 — Scheitert beim ersten Start das Laden der gewählten Sprache UND der
// Rückfall-Sprache (Chunk-404 nach einem Deploy, offline), gab der Provider
// dauerhaft `null` zurück → weisse Seite. Jetzt: einmal pro Sitzung neu laden,
// danach ein ruhiger Fehlerzustand mit Knopf «Neu laden».
//
// Kein DOM im Testlauf: geprüft werden die reinen Bausteine, die der
// I18nProvider verwendet, und das Markup des Fehlerzustands (renderToString).
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as i18n from '../index.js';

function speicher({ kaputt = false } = {}) {
  const map = new Map();
  return {
    map,
    getItem: (k) => { if (kaputt) throw new Error('gesperrt'); return map.has(k) ? map.get(k) : null; },
    setItem: (k, v) => { if (kaputt) throw new Error('gesperrt'); map.set(k, String(v)); },
    removeItem: (k) => { if (kaputt) throw new Error('gesperrt'); map.delete(k); },
  };
}

describe('K60 einmal neu laden (Schutz vor Endlosschleife)', () => {
  it('lädt beim ersten Fehler neu und setzt die Sitzungs-Marke', () => {
    const storage = speicher();
    const reload = vi.fn();
    expect(i18n.neuLadenEinmal({ storage, reload })).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(storage.map.size).toBe(1);
  });

  it('lädt beim zweiten Fehler in derselben Sitzung NICHT erneut', () => {
    const storage = speicher();
    const reload = vi.fn();
    i18n.neuLadenEinmal({ storage, reload });
    expect(i18n.neuLadenEinmal({ storage, reload })).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('ohne nutzbaren Sitzungsspeicher kein Neuladen (Schleife nicht auszuschliessen)', () => {
    const reload = vi.fn();
    expect(i18n.neuLadenEinmal({ storage: speicher({ kaputt: true }), reload })).toBe(false);
    expect(i18n.neuLadenEinmal({ storage: undefined, reload })).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('nach erfolgreichem Laden wird die Marke entfernt (auch bei gesperrtem Speicher kein Wurf)', () => {
    const storage = speicher();
    i18n.neuLadenEinmal({ storage, reload: () => {} });
    i18n.neuLadenMarkeLoeschen(storage);
    expect(storage.map.size).toBe(0);
    expect(() => i18n.neuLadenMarkeLoeschen(speicher({ kaputt: true }))).not.toThrow();
  });
});

describe('K60 Ablauf beim Start: Rückfall → Neuladen → Fehlerzustand', () => {
  const ablauf = (lang, reloadErgebnis) => {
    const request = vi.fn();
    const fail = vi.fn();
    const reloadOnce = vi.fn(() => reloadErgebnis);
    i18n.startLadefehler({ lang, defaultLang: 'en', request, reloadOnce, fail });
    return { request, fail, reloadOnce };
  };

  it('gewählte Sprache scheitert → zuerst die Rückfall-Sprache', () => {
    const s = ablauf('de', true);
    expect(s.request).toHaveBeenCalledWith('en');
    expect(s.reloadOnce).not.toHaveBeenCalled();
    expect(s.fail).not.toHaveBeenCalled();
  });

  it('auch die Rückfall-Sprache scheitert → einmal neu laden, kein Fehlerzustand', () => {
    const s = ablauf('en', true);
    expect(s.reloadOnce).toHaveBeenCalledTimes(1);
    expect(s.fail).not.toHaveBeenCalled();
  });

  it('scheitert es nach dem Neuladen immer noch → Fehlerzustand statt weisser Seite', () => {
    const s = ablauf('en', false);
    expect(s.request).not.toHaveBeenCalled();
    expect(s.fail).toHaveBeenCalledTimes(1);
  });
});

describe('K60 Fehlerzustand', () => {
  it('Text in der Browsersprache (de/fr/it/en), sonst Deutsch; rm → Deutsch', () => {
    expect(i18n.startFehlerText('de-CH').lang).toBe('de');
    expect(i18n.startFehlerText('fr-CH').lang).toBe('fr');
    expect(i18n.startFehlerText('it').lang).toBe('it');
    expect(i18n.startFehlerText('en-GB').lang).toBe('en');
    expect(i18n.startFehlerText('rm').lang).toBe('de');
    expect(i18n.startFehlerText('es').lang).toBe('de');
    expect(i18n.startFehlerText(undefined).lang).toBe('de');
    expect(i18n.startFehlerText('de').text).toBe('Maloja konnte nicht vollständig geladen werden. Bitte laden Sie die Seite neu.');
    expect(i18n.startFehlerText('de').knopf).toBe('Neu laden');
    for (const l of ['de', 'fr', 'it', 'en']) {
      const t = i18n.startFehlerText(l);
      expect(t.text.length).toBeGreaterThan(10);
      expect(t.knopf.length).toBeGreaterThan(2);
    }
  });

  it('rendert role="alert", echten <button>, Sprache und Farben für hell und dunkel', () => {
    const html = renderToString(React.createElement(i18n.StartFehler, { navLang: 'fr-CH' }));
    expect(html).toMatch(/role="alert"/);
    expect(html).toMatch(/lang="fr"/);
    expect(html).toMatch(/<button[^>]*type="button"/);
    expect(html).toContain(i18n.startFehlerText('fr').knopf);
    expect(html).toMatch(/prefers-color-scheme:\s*dark/);
    expect(html).toMatch(/min-height:\s*44px/);
  });
});
