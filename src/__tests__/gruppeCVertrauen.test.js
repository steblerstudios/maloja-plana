import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { BENACHRICHTIGUNG_ARTEN } from '../NotificationSettings.jsx';
import { checkOverdueReminders } from '../utils/notifications.js';
import { ZipExport } from '../ZipExport.jsx';
import { alsSchalter, zeilenLabelKey } from '../settingsGroups.js';
import { ANDERE_SCHLUESSEL } from '../utils/datenLoeschen.js';

// Gruppe C «Einstellungen & Vertrauen» (Befund 11.11.2026, docs/design/gruppe-c-vertrauen.html).
const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lesen = (d) => readFileSync(resolve(SRC, d), 'utf8');
const SPRACHEN = { de, fr, it: it_, en, rm };

function speicher() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
  };
}

describe('L1 · jeder Benachrichtigungs-Schalter hat einen Leser', () => {
  it('nur die gebaute Art steht in den Einstellungen', () => {
    expect(BENACHRICHTIGUNG_ARTEN).toEqual(['overdueReminders']);
    const quelle = lesen('utils/notifications.js');
    for (const art of BENACHRICHTIGUNG_ARTEN) expect(quelle).toContain('.' + art);
  });

  it('die nicht gebauten Versprechen sind aus allen Sprachen verschwunden', () => {
    for (const [l, s] of Object.entries(SPRACHEN)) {
      for (const k of ['documentExpiry', 'documentExpiryDesc', 'healthReminders', 'adminDeadlines']) {
        expect(s.notifications[k], l + ': notifications.' + k).toBeUndefined();
      }
      expect(s.notifications.nurBeimOeffnen, l).toBeTruthy();
    }
  });

  it('ausgeschaltet → keine Meldung, eingeschaltet → Meldung', () => {
    const gezeigt = vi.fn();
    const ohneFenster = typeof window === 'undefined';
    if (ohneFenster) globalThis.window = globalThis;
    const N = function (title) { gezeigt(title); };
    N.permission = 'granted';
    window.Notification = N;
    globalThis.Notification = N;
    globalThis.localStorage = speicher();
    localStorage.setItem('or5_reminders', JSON.stringify([{ done: false, dueDate: '2000-01-01' }]));
    localStorage.setItem('or5_notification_prefs', JSON.stringify({ overdueReminders: false }));
    checkOverdueReminders();
    expect(gezeigt).not.toHaveBeenCalled();
    localStorage.setItem('or5_notification_prefs', JSON.stringify({ overdueReminders: true }));
    checkOverdueReminders();
    expect(gezeigt).toHaveBeenCalledTimes(1);
    delete window.Notification;
    delete globalThis.Notification;
    if (ohneFenster) delete globalThis.window;
  });
});

describe('L2 + Gestaltung C · Sicherungsseite', () => {
  beforeEach(() => { globalThis.localStorage = speicher(); });
  const t = createT({ de }, 'de', 'sie');
  const html = () => renderToStaticMarkup(React.createElement(ZipExport, {
    palette: LIGHT_PALETTE, t, data: { basis: {} }, documents: [], demoMode: false,
  }));

  it('die Sicherung mit Passwort steht vor den Formaten für andere Programme', () => {
    const h = html();
    expect(h.indexOf(t('backup.exportEncrypted'))).toBeGreaterThan(-1);
    expect(h.indexOf(t('backup.exportEncrypted'))).toBeLessThan(h.indexOf('>JSON<'));
  });

  it('JSON, CSV und Manifest liegen zugeklappt unter einem Hinweis, dass sie keine Sicherung sind', () => {
    const h = html();
    const details = h.slice(h.indexOf('<details'), h.indexOf('</details>'));
    for (const f of ['>JSON<', '>CSV<', '>Manifest<']) expect(details).toContain(f);
    expect(details).toContain(t('zipExport.exportFormats'));
    expect(t('zipExport.andereHinweis')).toMatch(/keine Dateien/);
  });

  it('die Passwortfelder haben sichtbare Beschriftungen', () => {
    const h = html();
    expect(h).toContain('for="sicherung-passwort"');
    expect(h).toContain('for="sicherung-passwort-2"');
    expect(h).toContain('autoComplete="new-password"');
  });

  it('der Hinweis ohne Verschlüsselung sagt, was drin ist', () => {
    expect(t('backupVoreinstellung.hinweisUnverschluesselt')).toMatch(/Gesundheitsdaten/);
  });
});

describe('L3 · Installieren führt zur App, nicht zur Website', () => {
  it('jeder «öffnen»-Schritt nennt malojaplana.ch/app', () => {
    for (const [l, s] of Object.entries(SPRACHEN)) {
      for (const geraet of ['ios', 'android', 'macSafari', 'chromium']) {
        const erster = s.install.schritte[geraet][0];
        expect(erster, l + ' ' + geraet).toContain('malojaplana.ch/app');
      }
    }
  });
});

describe('L4–L8 und Kleines · Sätze, die stimmen', () => {
  const alle = (k) => Object.entries(SPRACHEN).map(([l, s]) => [l, k.split('.').reduce((a, p) => a?.[p], s)]);
  const text = (v) => (typeof v === 'string' ? v : JSON.stringify(v));

  it('L6 · kein Weg «Werkzeuge → Export» mehr', () => {
    for (const [l, v] of alle('legal.privacy.backup1')) expect(text(v), l).not.toMatch(/(Werkzeuge|Outils|Strumenti|Tools) →/);
  });
  it('L4 · die Cloud-Kopie des Download-Ordners ist genannt (de, fr, it, en)', () => {
    for (const [l, v] of alle('legal.privacy.backup1').filter(([l]) => l !== 'rm')) expect(text(v), l).toMatch(/iCloud/);
  });
  it('L7 · Speicher knapp: Sicherung, nicht «Export schafft Platz»', () => {
    expect(text(de.storage.warningMessage)).toMatch(/Sicherung/);
    expect(text(de.storage.warningMessage)).not.toMatch(/Exportieren/);
  });
  it('L8 · die Ablage verspricht kein «sicher»', () => {
    for (const [l, v] of alle('tresor.noDocumentsHint').filter(([l]) => l !== 'rm')) {
      expect(text(v), l).not.toMatch(/sicher und|en sécurité|al sicuro|safe and/);
    }
  });
  it('K · kein Tresor im Löschen-Dialog, solange es keinen gibt', () => {
    for (const [l, v] of alle('datenLoeschen.wasEinstellungen')) expect(text(v), l).not.toMatch(/Tresor|coffre|cassaforte|vault|tresor/);
  });
  it('K · der eigene Export ist kein «Art. 28»', () => {
    for (const [l, v] of alle('legal.privacy.rights3')) expect(text(v), l).not.toMatch(/28/);
  });
  it('K · Löschen nimmt den Suchbegriff mit', () => {
    expect(ANDERE_SCHLUESSEL).toContain('mp_suche');
    expect(lesen('SearchView.jsx')).toContain("'mp_suche'");
  });
});

describe('Gestaltung A · An/Aus als Schalter mit Zustandswort', () => {
  it('Knöpfe mit aria-pressed, Vorlesen und Erscheinungsbild werden Schalter', () => {
    const knopf = React.createElement('button', { key: 'grayscale', 'aria-pressed': true, onClick: () => {} });
    expect(alsSchalter(knopf)).toMatchObject({ an: true });
    const vorlesen = React.createElement('span', { key: 'voice', vorlesen: { enabled: false, toggle: () => {} } });
    expect(alsSchalter(vorlesen)).toMatchObject({ an: false });
    const thema = React.createElement('span', { key: 'theme', isDarkMode: true, onToggle: () => {} });
    expect(alsSchalter(thema)).toMatchObject({ an: true });
    expect(zeilenLabelKey(thema, true)).toBe('common.settingsDunkel');
  });
  it('Anrede und Sprache bleiben, wie sie sind', () => {
    const anrede = React.createElement('button', { key: 'anrede', onClick: () => {} }, 'Sie');
    expect(alsSchalter(anrede)).toBeNull();
  });
  it('der Schalter trägt role="switch" und ein Zustandswort', () => {
    const quelle = lesen('components/Schalter.jsx');
    expect(quelle).toContain("role: 'switch'");
    expect(quelle).toContain("'aria-checked'");
    for (const s of Object.values(SPRACHEN)) {
      expect(s.common.schalterAn).toBeTruthy();
      expect(s.common.schalterAus).toBeTruthy();
    }
  });
  it('der Schalter liegt nicht im Startbündel (nur nachgeladene Dateien importieren ihn)', () => {
    expect(lesen('main.jsx')).not.toMatch(/Schalter\.jsx/);
  });
});
