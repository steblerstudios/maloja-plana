import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ZipExport } from '../ZipExport.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// E10 (Bau-Liste 16.09.2026): verschlüsselt ist die Voreinstellung der Sicherung
// (DSG Art. 7 Abs. 3, Datenschutz durch Voreinstellung). Unverschlüsselt bleibt
// wählbar, steht aber danach und trägt einen ruhigen Hinweis.

const t = createT({ de }, 'de', 'sie');
const palette = new Proxy({}, { get: () => '#888888' });

function render() {
  return renderToStaticMarkup(React.createElement(ZipExport, {
    palette, t, data: { basis: {} }, documents: [], demoMode: false,
  }));
}

describe('ZipExport — Sicherung verschlüsselt als Voreinstellung', () => {
  beforeEach(() => {
    const map = new Map();
    globalThis.localStorage = {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => { map.set(k, String(v)); },
      removeItem: (k) => { map.delete(k); },
    };
  });

  it('der verschlüsselte Weg steht vor dem unverschlüsselten', () => {
    const html = render();
    const verschluesselt = html.indexOf(t('backup.exportEncrypted'));
    const klartext = html.indexOf(t('backup.exportPlain'));
    expect(verschluesselt).toBeGreaterThan(-1);
    expect(klartext).toBeGreaterThan(-1);
    expect(verschluesselt).toBeLessThan(klartext);
  });

  it('der verschlüsselte Weg ist als Voreinstellung gekennzeichnet', () => {
    const html = render();
    const titel = t('backupVoreinstellung.titelVerschluesselt');
    expect(titel).not.toBe('backupVoreinstellung.titelVerschluesselt');
    expect(html).toContain(titel);
    expect(html.indexOf(titel)).toBeLessThan(html.indexOf(t('backup.exportPlain')));
  });

  it('der unverschlüsselte Weg trägt einen Hinweis', () => {
    const html = render();
    const hinweis = t('backupVoreinstellung.hinweisUnverschluesselt');
    expect(hinweis).not.toBe('backupVoreinstellung.hinweisUnverschluesselt');
    expect(html).toContain(hinweis);
  });

  it('der Passphrase-Hinweis nennt 12 Zeichen, nicht 4', () => {
    const html = render();
    expect(html).toContain('12 Zeichen');
    expect(html).not.toContain('4 Zeichen');
  });

  it('beim Wiederherstellen wird gesagt, dass ältere Sicherungen lesbar bleiben', () => {
    const html = render();
    expect(html).toContain(t('backupVoreinstellung.altePasswoerter'));
    expect(t('backupVoreinstellung.altePasswoerter')).not.toBe('backupVoreinstellung.altePasswoerter');
  });
});
