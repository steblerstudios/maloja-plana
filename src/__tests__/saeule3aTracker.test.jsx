import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import React from 'react';
import { zahl } from '../utils/geld.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { Saeule3aTracker } from '../Saeule3aTracker.jsx';
import {
  einzahlungenImJahr, jahreMitEinzahlungen, groessteJahresEinzahlung,
  SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR,
} from '../data/saeule3a.js';

// 🛑 DER FEHLER, DEN DIESE TESTS FESTHALTEN (Befund 23.09.2026).
// Der Höchstabzug der Säule 3a ist ein JAHRESbetrag, das Eingabefeld heisst «3. Säule A
// eingezahlt CHF/Jahr» — der Tracker summierte aber datumsblind über ALLE erfassten Zeilen
// und verglich diese Summe mit dem Jahresmaximum. Wer ihn über mehrere Jahre weiterführte,
// wofür er gebaut ist, sah «Maximum erreicht», ohne es in einem einzigen Jahr ausgeschöpft
// zu haben. Dieselbe Summe ging als `pension3a` in den Steuerrechner, in die
// Budget-Synchronisation (`pension3a / 12`) und in die Prämienverbilligung.
// Drei Zeilen à 7'000 ergaben 21'000.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
// Schlüssel und Werte sichtbar machen, statt übersetzten Text zu prüfen: so bricht der Test
// nicht an einer Formulierung, sondern nur an der Logik.
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length
  ? k + '(' + Object.entries(p).map(([n, v]) => n + '=' + v).join('|') + ')' : k);
// Beträge werden mit derselben Formatierung erwartet wie gerendert, und die HTML-Maskierung
// wird vorher rückgängig gemacht: Das Tausender-Trennzeichen von `de-CH` ist je nach
// ICU-Fassung ein gerades oder ein typografisches Apostroph, und React maskiert das gerade
// zu `&#x27;`. Ein Test, der eines davon fest verdrahtet, bricht beim nächsten Node — ohne
// dass an der App etwas falsch wäre.
// Seit 24.09.2026 kommt die Trennung aus utils/geld.js (fest ’, nicht mehr aus der ICU-Fassung).
const chf = (v) => 'CHF ' + zahl(v);
const render = (props) => renderToStaticMarkup(
  React.createElement(Saeule3aTracker, { palette, t, onChange: () => {}, ...props }))
  .replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

describe('Einzahlungen nach Kalenderjahr (src/data/saeule3a.js)', () => {
  const dreiJahre = [
    { date: '2024-03-01', amount: 7000 },
    { date: '2025-03-01', amount: 7000 },
    { date: '2026-03-01', amount: 7000 },
  ];

  it('zählt nur das gefragte Jahr, nicht die ganze Liste', () => {
    expect(einzahlungenImJahr(dreiJahre, 2026)).toBe(7000);
    expect(einzahlungenImJahr(dreiJahre, 2025)).toBe(7000);
    expect(einzahlungenImJahr(dreiJahre, 2023)).toBe(0);
    // genau das war der Fehler: 3 × 7'000 als «Jahreseinzahlung»
    expect(dreiJahre.reduce((s, d) => s + d.amount, 0)).toBe(21000);
  });

  it('mehrere Zeilen im selben Jahr zählen zusammen', () => {
    const zweiMal = [{ date: '2026-01-15', amount: 3000 }, { date: '2026-07-01', amount: 4258 }];
    expect(einzahlungenImJahr(zweiMal, 2026)).toBe(7258);
  });

  // 🛑 Undatierte Zeilen dürfen NICHT stillschweigend wegfallen. Die Migration in
  // ChapterView.jsx macht aus einem alten Einzelwert genau eine Zeile ohne Datum, und
  // gemeint war das laufende Jahr. Sie zu verwerfen hiesse, bei jeder migrierten Person die
  // Einzahlung auf 0 zu setzen: zu hohe Verbilligung, zu tiefer Steuerabzug.
  it('undatierte Zeilen zählen zum laufenden Jahr', () => {
    const migriert = [{ date: '', amount: 5000 }];
    expect(einzahlungenImJahr(migriert, 2026)).toBe(5000);
    expect(einzahlungenImJahr(migriert, 2025, 2026)).toBe(0);
    expect(jahreMitEinzahlungen(migriert, 2026)).toEqual([2026]);
    // gemischt: die undatierte Zeile landet im laufenden Jahr, die datierte in ihrem eigenen
    expect(einzahlungenImJahr([{ date: '', amount: 1000 }, { date: '2024-05-05', amount: 2000 }], 2026))
      .toBe(1000);
  });

  it('unlesbare Datumsangaben und Beträge kippen nichts um', () => {
    expect(einzahlungenImJahr([{ date: 'morgen', amount: 100 }], 2026)).toBe(100);   // wie undatiert
    expect(einzahlungenImJahr([{ date: '2026-01-01', amount: 'abc' }], 2026)).toBe(0);
    expect(einzahlungenImJahr([{ date: '2026-01-01', amount: -500 }], 2026)).toBe(0);
    expect(einzahlungenImJahr(null, 2026)).toBe(0);
    expect(einzahlungenImJahr(undefined, 2026)).toBe(0);
    expect(jahreMitEinzahlungen(null, 2026)).toEqual([]);
  });

  it('jahreMitEinzahlungen gibt die Jahre aufsteigend', () => {
    expect(jahreMitEinzahlungen(dreiJahre, 2026)).toEqual([2024, 2025, 2026]);
  });

  it('groessteJahresEinzahlung: die grösste Summe EINES Jahres, sonst null', () => {
    expect(groessteJahresEinzahlung(dreiJahre, 2026)).toBe(7000);
    expect(groessteJahresEinzahlung([{ date: '2024-01-01', amount: 3000 },
      { date: '2026-01-01', amount: 7258 }], 2026)).toBe(7258);
    expect(groessteJahresEinzahlung([], 2026)).toBe(null);
    expect(groessteJahresEinzahlung(undefined, 2026)).toBe(null);
  });
});

// 🛑 DIE STELLE, AN DER DER WERT ENTSTEHT — und die einzige, die keine Rechenfunktion ist.
// `ChapterView.handleDeposits` schreibt aus den Zeilen das Feld `pension3a`, und DIESER Wert
// geht in den Steuerrechner, in `budgetSync.js` (`pension3a / 12`) und in die Berner
// Prämienverbilligung. Genau hier stand die datumsblinde Summe.
//
// ⚠️ Was dieser Test kann und was nicht, damit ihn niemand für mehr hält:
// Er liest den Quelltext, er führt ihn nicht aus. Das ist hier die verhältnismässige Wahl —
// ein echter Interaktionstest bräuchte jsdom und eine Testing-Library, also neue
// Abhängigkeiten, und die schliesst CLAUDE.md aus («Avoid: dependency bloat»). Der Bestand
// kennt Quelltext-Prüfungen als Muster (glyphenImText, hauptbundleLazy, regulierungsgrenzen).
// Er beweist nicht, dass die Oberfläche richtig rechnet — er beweist, dass sie die geprüfte
// Funktion benutzt statt einer eigenen Summe. Die Rechnung selbst prüfen die Tests oben.
// Ohne ihn überlebte genau diese Mutation die ganze Batterie (gemessen 23.09.2026).
describe('ChapterView schreibt einen JAHRESbetrag in pension3a', () => {
  const quelle = readFileSync(new URL('../ChapterView.jsx', import.meta.url), 'utf8');
  const handler = quelle.slice(quelle.indexOf('const handleDeposits'),
    quelle.indexOf('onUpdate(\'pension3a\''));

  it('der Handler existiert und ist auffindbar', () => {
    // Bricht, sobald jemand den Handler umbenennt — dann ist auch dieser Test nachzuziehen,
    // statt still ins Leere zu prüfen.
    expect(quelle).toContain('const handleDeposits');
    expect(handler.length).toBeGreaterThan(20);
    expect(handler.length).toBeLessThan(400);
  });

  it('summiert über die geprüfte Jahresfunktion, nicht über alle Zeilen', () => {
    expect(handler).toContain('einzahlungenImJahr(deposits');
    // Die alte Zeile, wörtlich: `deposits.reduce((s, d) => s + (Number(d.amount) || 0), 0)`.
    expect(handler).not.toMatch(/deposits\s*\.\s*reduce/);
  });

  it('und bezieht das Jahr, statt es zu raten', () => {
    expect(quelle).toContain('const jahrJetzt = new Date().getFullYear()');
    // Das Jahr geht auch an die Anzeige — sonst zählte das Formular ein anderes Jahr als der
    // Balken daneben, und beide sähen richtig aus.
    expect(quelle).toMatch(/deposits: rawDeposits, jahr: jahrJetzt/);
  });
});

describe('Saeule3aTracker: der Balken misst EIN Jahr', () => {
  const dreiJahre = [
    { date: '2024-03-01', amount: 7000 },
    { date: '2025-03-01', amount: 7000 },
    { date: '2026-03-01', amount: 7000 },
  ];

  // 🛑 DER RÜCKFALL-WÄCHTER. Fällt der Tracker je auf die Summe über alle Zeilen zurück,
  // steht hier CHF 21'000 statt 7'000 — und «Maximum erreicht» statt «noch 258 offen».
  it('zeigt nur das laufende Jahr, nicht die Summe aller Jahre', () => {
    const html = render({ deposits: dreiJahre, jahr: 2026 });
    expect(html).toContain(chf(7000));
    expect(html).not.toContain(chf(21000));
    // 7'258 − 7'000 = 258 offen, also NICHT «Maximum erreicht»
    expect(html).toContain('saeule3a.remaining');
    expect(html).not.toContain('saeule3a.maxReached');
  });

  it('nennt das Jahr am Betrag — ohne es läse sich die Zahl wie «alles bisher»', () => {
    expect(render({ deposits: dreiJahre, jahr: 2026 })).toContain('saeule3a.ofMax(max=' + chf(7258) + '|jahr=2026)');
    expect(render({ deposits: dreiJahre, jahr: 2025 })).toContain('jahr=2025');
  });

  it('frühere Jahre werden benannt, statt still zu fehlen', () => {
    // 2024 und 2025 sind je 7'000 ⇒ 14'000 liegen ausserhalb des laufenden Jahres
    expect(render({ deposits: dreiJahre, jahr: 2026 }))
      .toContain('saeule3a.earlierYears(amount=' + chf(14000) + '|jahr=2026)');
  });

  it('ohne frühere Jahre bleibt der Satz weg — kein Lärm im ersten Jahr', () => {
    expect(render({ deposits: [{ date: '2026-03-01', amount: 3000 }], jahr: 2026 }))
      .not.toContain('saeule3a.earlierYears');
    expect(render({ deposits: [], jahr: 2026 })).not.toContain('saeule3a.earlierYears');
  });

  it('die Zeilen aller Jahre bleiben sicht- und änderbar', () => {
    // Nichts wird ausgeblendet: sonst liesse sich ein falsch gesetztes Datum nicht korrigieren.
    const html = render({ deposits: dreiJahre, jahr: 2026 });
    for (const d of dreiJahre) expect(html).toContain('value="' + d.date + '"');
  });

  it('Maximum erreicht heisst: in DIESEM Jahr erreicht', () => {
    const html = render({ deposits: [{ date: '2026-01-01', amount: 7258 }], jahr: 2026 });
    expect(html).toContain('saeule3a.maxReached');
    expect(html).not.toContain('saeule3a.remaining');
  });

  // 🛑 Der Deckel kommt aus der Jahrestabelle. Sonst zeigte die App im Januar 2027 weiter
  // das Maximum von 2026 — eine falsche Zahl in einer Steuerangabe, genau dann, wenn
  // niemand mehr hinsieht.
  it('unbelegtes Jahr: kein geratenes Maximum, sondern der Hinweis, dass es fehlt', () => {
    expect(SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[2031]).toBeUndefined();
    const html = render({ deposits: [{ date: '2031-01-01', amount: 5000 }], jahr: 2031 });
    expect(html).toContain('saeule3a.maxUnknown(jahr=2031)');
    expect(html).toContain('saeule3a.forYear(jahr=2031)');
    // 🛑 Für 2031 wird GAR KEIN Maximum behauptet — weder das von 2026 noch ein gerundetes.
    // Geprüft wird das am Schlüssel, nicht am Betrag: die Fussnote darf 7'258 sehr wohl
    // nennen, sie schreibt ihr Jahr ja dazu (siehe der Test darunter). Verboten ist allein,
    // eine fremde Zahl als das Maximum DIESES Jahres auszugeben.
    expect(html).not.toContain('saeule3a.ofMax');
    expect(html).not.toContain('saeule3a.remaining');
    expect(html).not.toContain('saeule3a.maxReached');
    expect(html).toContain(chf(5000));               // gezählt wird trotzdem richtig
  });

  // Die Fussnote trug Jahr und beide Beträge in allen FÜNF Sprachdateien ausgeschrieben —
  // dieselbe Zahl an fünf weiteren Stellen von Hand. Jetzt kommt sie aus der Jahrestabelle.
  it('die Fussnote nennt die Beträge des angezeigten Jahres, nicht fest verdrahtete', () => {
    expect(render({ deposits: [], jahr: 2026 }))
      .toContain('saeule3a.selfEmployedNote(jahr=2026|mit=' + chf(7258) + '|ohne=' + chf(36288) + '|satz=20)');
    expect(render({ deposits: [], jahr: 2024 }))
      .toContain('saeule3a.selfEmployedNote(jahr=2024|mit=' + chf(7056) + '|ohne=' + chf(35280) + '|satz=20)');
    // Unbelegtes Jahr: lieber ein sichtbar älteres Jahr als stillschweigend falsche Zahlen.
    expect(render({ deposits: [], jahr: 2031 })).toContain('saeule3a.selfEmployedNote(jahr=2026');
  });
});
