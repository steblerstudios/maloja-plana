import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import {
  DocumentTresor, imFach, ablageZaehler, offeneVorschlaege, ablaufAnzeige, FAST_LEER,
} from '../DocumentTresor.jsx';

// Fassung 5 der Dokumentenablage (Entscheid 23.10.2026, VERGLEICH.md «Dokumentenablage ·
// entschieden»). Die Rechnung bleibt die von heute: Archiv = abgelaufen, «Bald fällig» = aktiv
// und weniger als 90 Tage bis zum Ablauf.

const t = createT({ de }, 'de', 'sie');
const tDu = createT({ de }, 'de', 'du');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const chapters = getChapters(t);

// Fester Tag, damit «in 30 Tagen» nicht vom Testdatum abhängt.
beforeAll(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-23T10:00:00')); });
afterAll(() => { vi.useRealTimers(); });

const dok = (id, expiryDate, extra = {}) => ({
  id, type: 'id', fileName: id + '.pdf', fileSize: '12.0 KB', uploadDate: '01.10.2026',
  expiryDate, chapter: 'basis', ...extra,
});
const GUELTIG = dok('pass', '2031-09-30');
const BALD = dok('ik', '2026-11-22');            // gut 30 Tage (Rechnung wie heute: aufgerundet)
const ABGELAUFEN = dok('alt', '2026-08-14');

const render = (documents, extra = {}) => renderToStaticMarkup(React.createElement(DocumentTresor, {
  palette, t, documents, chapters, onDownload: () => {}, onDelete: () => {}, onUpdateExpiry: () => {}, ...extra,
}));

describe('Ablage · Fächer wie heute gerechnet', () => {
  it('Archiv = abgelaufen, Bald fällig = aktiv und < 90 Tage, Aktiv = nicht abgelaufen', () => {
    expect([GUELTIG, BALD, ABGELAUFEN].map(d => imFach(d, 'aktiv'))).toEqual([true, true, false]);
    expect([GUELTIG, BALD, ABGELAUFEN].map(d => imFach(d, 'bald'))).toEqual([false, true, false]);
    expect([GUELTIG, BALD, ABGELAUFEN].map(d => imFach(d, 'archiv'))).toEqual([false, false, true]);
    expect(ablageZaehler([GUELTIG, BALD, ABGELAUFEN])).toEqual({ active: 2, expiring: 1, archived: 1 });
  });

  it('Ablaufdatum TT.MM.JJJJ, anderes bleibt wie gespeichert', () => {
    expect(ablaufAnzeige('2026-12-15')).toBe('15.12.2026');
    expect(ablaufAnzeige('15.12.2026')).toBe('15.12.2026');
    expect(ablaufAnzeige(undefined)).toBe('');
  });
});

describe('Ablage · leer', () => {
  const html = render([]);

  it('ruhiges Bild mit Titel und Satz der App, ohne Zähler, Suche und Sortierung', () => {
    expect(html).toContain('Ihr Ordner ist bereit');
    expect(html).toContain('Sobald Sie ein Dokument in einem Kapitel hochladen');
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('type="search"');
    expect(html).not.toContain(t('tresor.sortBy'));
    expect(html).not.toContain('Dokumente</span>');
  });

  it('«Was oft zuerst hineingehört» mit drei Vorschlägen und ihrem Kapitel', () => {
    expect(html).toContain('Was oft zuerst hineingehört');
    for (const s of ['Ausweis oder Pass', 'Mietvertrag', 'Police der Krankenkasse']) expect(html).toContain(s);
    expect(html).toContain('Kapitel Persönliche Basis');
    expect(html).toContain('Kapitel Wohnen &amp; Leben');
  });

  it('Vorschläge sind Knöpfe nur, wenn ein Kapitel geöffnet werden kann', () => {
    expect(html).not.toContain('data-vorschlag');
    const mitWeg = render([], { onOpenChapter: () => {} });
    expect(mitWeg.match(/data-vorschlag="/g)).toHaveLength(3);
  });

  it('Du-Form', () => {
    const du = renderToStaticMarkup(React.createElement(DocumentTresor, {
      palette, t: tDu, documents: [], chapters, onDownload() {}, onDelete() {}, onUpdateExpiry() {},
    }));
    expect(du).toContain('Dein Ordner ist bereit');
  });
});

describe('Ablage · mit Inhalt', () => {
  const html = render([GUELTIG, BALD, ABGELAUFEN]);

  it('Übersichtszeile «{n} Dokumente» und drei Zähler', () => {
    expect(html).toContain('3 Dokumente');
    expect(html).toContain('2 Aktiv');
    expect(html).toContain('1 Bald fällig');
    expect(html).toContain('1 Archiv');
  });

  it('Suche und Sortierung erscheinen', () => {
    expect(html).toContain('type="search"');
    expect(html).toContain('Sortieren nach');
    expect(html).toContain('Nach Ablauf');
  });

  it('Zeile mit App-Texten: Typ, Dateiname, Hochgeladen · Grösse, Status · Ablauf', () => {
    expect(html).toContain('Ausweis/Pass');                       // Typ als Beschriftung, nicht «id»
    expect(html).toContain('pass.pdf');
    expect(html).toContain('Hochgeladen: 01.10.2026 · 12.0 KB');
    expect(html).toContain('gültig · Ablauf: 30.09.2031');
    expect(html).toContain('31d · Ablauf: 22.11.2026');
    expect(html).not.toContain('alt.pdf');                        // abgelaufen liegt im Archiv
  });

  it('Herunterladen, Bearbeiten und Entfernen pro Zeile', () => {
    expect(html.match(/aria-label="Herunterladen"/g)).toHaveLength(2);
    expect(html.match(/aria-label="Bearbeiten"/g)).toHaveLength(2);
    expect(html.match(/aria-label="Entfernen"/g)).toHaveLength(2);
  });

  it('Vorschläge, die schon abgelegt sind, fallen weg', () => {
    expect(html).toContain('Was oft zuerst hineingehört');
    expect(html).not.toContain('Ausweis oder Pass');             // ein Ausweis liegt schon da
    expect(html).toContain('Mietvertrag');
  });

  it('nur archivierte Dokumente: Aktiv zeigt einen Satz statt einer leeren Fläche', () => {
    expect(render([ABGELAUFEN])).toContain('Alle Dokumente sind abgelaufen und liegen im Archiv.');
  });
});

describe('Ablage · Vorschläge nur leer oder fast leer', () => {
  it('ab fünf Dokumenten keine Vorschläge mehr', () => {
    const viele = Array.from({ length: FAST_LEER }, (_, i) => dok('d' + i, '2031-01-01', { type: 'ahv_card' }));
    expect(offeneVorschlaege(viele)).toEqual([]);
    expect(render(viele)).not.toContain('Was oft zuerst hineingehört');
  });

  it('alle drei abgelegt: Block verschwindet', () => {
    const drei = [
      dok('a', '2031-01-01'),
      dok('b', '2031-01-01', { type: 'lease', chapter: 'wohnen' }),
      dok('c', '2031-01-01', { type: 'kkcard', chapter: 'versicherungen' }),
    ];
    expect(offeneVorschlaege(drei)).toEqual([]);
  });
});

describe('Ablage · Verdrahtung', () => {
  it('main.jsx gibt der Ablage den Weg ins Kapitel', async () => {
    const fs = await import('node:fs');
    const src = fs.readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
    expect(src).toMatch(/onOpenChapter: \(key\) => \{ const i = chapters\.findIndex/);
  });
});
