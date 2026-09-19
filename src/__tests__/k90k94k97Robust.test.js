// K90 · K94 · K97 — kleine Robustheits-Punkte aus dem Deploy-Gate 0.1.35.
//
// K90: Die Karte beim Sprach-Ladefehler ist fest oben mittig positioniert, stand
//      im DOM aber hinter der ganzen App → Tab-Reihenfolge ≠ Sichtposition. Sie
//      steht jetzt vor dem App-Inhalt.
// K94: Speicherzugriffe ohne try/catch (gesperrter Speicher im privaten Fenster,
//      volles Kontingent) dürfen weder einen Effekt noch den Abgleich der
//      Dokument-Erinnerungen abbrechen.
// K97: Die HTML-Escape-Funktion machte aus 0 einen leeren Text (falsy-Prüfung)
//      und liess ' stehen. Eine gemeinsame Funktion für Druck, Dossier und Briefe.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { sprachRahmen } from '../i18n/index.js';
import { escapeHtml } from '../utils/helpers.js';

const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('K90 Sprach-Ladefehler-Karte steht im DOM dort, wo sie sichtbar ist', () => {
  const html = (zustand) => renderToString(sprachRahmen({
    value: {},
    children: React.createElement('div', { id: 'app-inhalt' },
      React.createElement('a', { href: '#mp-main', className: 'mp-skip-link' }, 'Zum Inhalt')),
    zustand,
    onRetry: () => {},
    onClose: () => {},
  }));

  it('Fehlerkarte (mit Knöpfen) vor dem App-Inhalt → erste Tab-Station, wie oben sichtbar', () => {
    const s = html({ laedt: null, hinweis: false, fehler: 'fr' });
    expect(s).toContain('Réessayer');
    expect(s.indexOf('mp-sprachlage')).toBeGreaterThanOrEqual(0);
    expect(s.indexOf('mp-sprachlage')).toBeLessThan(s.indexOf('app-inhalt'));
    expect(s.indexOf('Réessayer')).toBeLessThan(s.indexOf('#mp-main'));
  });

  it('die leere Live-Region steht ebenfalls vorne (bleibt immer im DOM)', () => {
    const s = html(null);
    expect(s.indexOf('aria-live="polite"')).toBeGreaterThanOrEqual(0);
    expect(s.indexOf('aria-live="polite"')).toBeLessThan(s.indexOf('app-inhalt'));
  });

  it('Fokus nach «erneut versuchen»/«schliessen» geht weiter an die Sprachwahl bzw. an main', () => {
    const s = quelle('i18n/index.js');
    expect(s).toMatch(/querySelectorAll\('\[data-sprachwahl\]'\)/);
    expect(s).toMatch(/main\.setAttribute\('tabindex', '-1'\)/);
    expect(s).toMatch(/onClick: \(\) => \{ fokusZurSprachwahl\(\); onRetry\(\); \}/);
    expect(s).toMatch(/onClick: \(\) => \{ fokusZurSprachwahl\(\); onClose\(\); \}/);
  });
});

describe('K94 Speicherzugriffe scheitern leise', () => {
  let original;
  beforeEach(() => { original = globalThis.localStorage; });
  afterEach(() => { globalThis.localStorage = original; });

  const vollerSpeicher = () => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: () => { throw new Error('QuotaExceededError'); },
      removeItem: (k) => { store.delete(k); },
    };
  };
  const gesperrterSpeicher = () => {
    const wirf = () => { throw new Error('SecurityError'); };
    globalThis.localStorage = { getItem: wirf, setItem: wirf, removeItem: wirf };
  };

  it('docReminders: voller Speicher bricht den Abgleich nicht ab und meldet ihn', async () => {
    vollerSpeicher();
    const { syncDocumentReminders } = await import('../utils/docReminders.js');
    let r;
    expect(() => { r = syncDocumentReminders([{ id: 'd1', fileName: 'Pass', expiryDate: '2030-01-31' }]); }).not.toThrow();
    expect(r).toMatchObject({ created: 1, updated: 0, removed: 0, saved: false });
  });

  it('docReminders: gelingt das Speichern, meldet der Abgleich saved: true', async () => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => { store.set(k, String(v)); },
    };
    const { syncDocumentReminders } = await import('../utils/docReminders.js');
    const r = syncDocumentReminders([{ id: 'd1', fileName: 'Pass', expiryDate: '2030-01-31' }]);
    expect(r.saved).toBe(true);
    expect(JSON.parse(store.get('or5_reminders'))).toHaveLength(1);
  });

  it('backupCrypto: gesperrter Speicher → Sicherung ohne Meta-Werte statt Absturz', async () => {
    gesperrterSpeicher();
    const { collectBackupData } = await import('../utils/backupCrypto.js');
    let b;
    expect(() => { b = collectBackupData(); }).not.toThrow();
    expect(b.meta).toEqual({ theme: null, lang: null, onboardingDone: null });
    expect(b.data).toEqual({});
  });

  it('Lebenssituationen: or5_reducemotion wird im try gelesen', () => {
    const s = quelle('Lebenssituationen.jsx');
    expect(s).toMatch(/try \{[^}]*localStorage\.getItem\('or5_reducemotion'\)/);
  });

  it('ZipExport: das Merken der letzten Sicherung hat ein eigenes try (Datei ist schon heruntergeladen)', () => {
    const s = quelle('ZipExport.jsx');
    const treffer = s.match(/try \{ localStorage\.setItem\('or5_lastBackup'/g) || [];
    expect(treffer).toHaveLength(2);
  });
});

describe('K97 gemeinsame HTML-Escape-Funktion', () => {
  it('0 bleibt «0»', () => {
    expect(escapeHtml(0)).toBe('0');
    expect(escapeHtml(0.5)).toBe('0.5');
  });

  it("' wird &#39;, die übrigen Zeichen wie bisher", () => {
    expect(escapeHtml(`<a href="x">Tom's & Co</a>`))
      .toBe('&lt;a href=&quot;x&quot;&gt;Tom&#39;s &amp; Co&lt;/a&gt;');
  });

  it('null, undefined, false und leerer Text bleiben leer', () => {
    for (const v of [null, undefined, false, '']) expect(escapeHtml(v)).toBe('');
  });

  it('Dossier und Briefe nutzen dieselbe Funktion statt einer lokalen Kopie', () => {
    for (const datei of ['dossierGenerator.js', 'briefGenerator.js']) {
      const s = quelle(datei);
      expect(s).not.toMatch(/function esc\(/);
      expect(s).toMatch(/import \{ escapeHtml as esc \} from '\.\/utils\/helpers\.js';/);
    }
  });
});
