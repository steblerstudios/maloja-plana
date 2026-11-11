// Wechselfrist der Krankenkasse als Kalenderblatt (Stebler Studios 11.11.2026: «wechsel frist super», Matrix §9,
// Landkarte Versicherungen). Gemeinsame Form «Termin», nur in der Wechselzeit: ab der BAG-Publikation der neuen Prämien
// bis zur Frist (KVG Art. 7 Abs. 2: Eingang bis 30. November, am Wochenende der Werktag davor).
// Eine Rechnung: kvgWechselfrist — Kachel, Kapitel und Werkzeug zeigen dasselbe Datum.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { kvgWechselfrist, PRAEMIEN_VEROEFFENTLICHT } from '../data/franchiseTacho.js';
import { DETAIL_VEROEFFENTLICHT, istWechselzeit } from '../data/praemienDetail.js';
import { nextNov30 } from '../KVGWechsel.jsx';
import { InstrumentePanel } from '../components/InstrumentePanel.jsx';
import { VersicherungenInstrument } from '../components/VersicherungenInstrument.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const t = createT({ de }, 'de', 'sie');
const tag = (y, m, d) => new Date(y, m - 1, d, 10);

describe('kvgWechselfrist — eine Rechnung für die Wechselfrist', () => {
  it('das Datum ist dasselbe wie im Werkzeug KVG-Wechsel (30.11., Werktag davor)', () => {
    expect(kvgWechselfrist(tag(2026, 10, 15)).iso).toBe('2026-11-30');
    expect(kvgWechselfrist(tag(2026, 10, 15)).iso).toBe(nextNov30(tag(2026, 10, 15)));
    // 30.11.2025 ist ein Sonntag → Freitag 28.11.
    expect(kvgWechselfrist(tag(2025, 10, 1)).iso).toBe('2025-11-28');
  });

  it('nur in der Wechselzeit: ab Publikation der neuen Prämien bis und mit Frist', () => {
    expect(kvgWechselfrist(tag(2026, 9, 28)).zeigen).toBe(false); // vor der BAG-Publikation 29.09.2026
    expect(kvgWechselfrist(tag(2026, 9, 29)).zeigen).toBe(true);
    expect(kvgWechselfrist(tag(2026, 11, 30)).zeigen).toBe(true);
    expect(kvgWechselfrist(tag(2026, 12, 1)).zeigen).toBe(false); // danach nichts mehr zu tun
    expect(kvgWechselfrist(tag(2027, 10, 15)).zeigen).toBe(false); // Prämien 2028 noch nicht belegt → keine Behauptung
  });

  it('eine Quelle für das Publikationsdatum', () => {
    expect(DETAIL_VEROEFFENTLICHT).toBe(PRAEMIEN_VEROEFFENTLICHT);
    expect(istWechselzeit(tag(2026, 10, 15))).toBe(true);
  });
});

describe('Kalenderblatt an Kachel und Kapitel', () => {
  const daten = { versicherungen: { kkInsurer: 'CSS', kkPremium: '450' }, finanzen: { monthlyIncome: '6000' } };

  it('Kachel nur in der Wechselzeit, mit Blatt und Tagen bis zur Frist', () => {
    const panel = (heute) => renderToStaticMarkup(React.createElement(InstrumentePanel, { palette: LIGHT_PALETTE, t, data: daten, onNavigate: () => {}, nur: ['wechselfrist'], jetzt: heute }));
    const html = panel(tag(2026, 11, 10));
    expect(html).toContain(t('instrumente.wechselfrist'));
    expect(html).toContain('data-instrument-zahl="wechselfrist"');
    expect(html).toMatch(/data-instrument-zahl="wechselfrist"[\s\S]*?>20</);
    expect(html).toContain('data-teil="kalenderblatt"');
    expect(panel(tag(2026, 12, 5))).not.toContain(t('instrumente.wechselfrist'));
    expect(panel(tag(2026, 6, 5))).not.toContain(t('instrumente.wechselfrist'));
  });

  it('Kapitel Versicherungen: Blatt mit dem Datum aus derselben Rechnung, nur in der Wechselzeit', () => {
    const kapitel = (heute) => renderToStaticMarkup(React.createElement(VersicherungenInstrument, { palette: LIGHT_PALETTE, t, versicherungen: daten.versicherungen, allData: daten, onNavigate: () => {}, jetzt: heute }));
    const html = kapitel(tag(2026, 11, 10));
    expect(html).toContain('data-teil="kvg-wechselfrist"');
    expect(html).toContain('30.11.2026');
    expect(kapitel(tag(2026, 12, 5))).not.toContain('data-teil="kvg-wechselfrist"');
  });

  it('Texte in allen fünf Sprachen', () => {
    for (const [lang, dict] of [['de', de], ['fr', fr], ['it', it_], ['en', en], ['rm', rm]]) {
      for (const k of ['wechselfrist', 'wechselfristSatz', 'wechselfristKapitel']) {
        expect(dict.instrumente?.[k], lang + ' ' + k).toBeTruthy();
      }
    }
  });
});

describe('Werkzeug KVG-Wechsel', () => {
  it('Schritt 4 zeigt die Frist als Kalenderblatt (Wächter im Code)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const code = fs.readFileSync(path.join(__dirname, '..', 'KVGWechsel.jsx'), 'utf8');
    expect(code).toMatch(/Kalenderblatt, \{ iso: deadline/);
  });
});
