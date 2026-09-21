// O17 · Die Fokus-Falle modaler Schichten.
//
// Zwei Arten von Beleg, weil eine allein nicht trägt:
//   1. Die reine Entscheidung «wohin springt der Fokus bei Tab?» wird direkt
//      geprüft. Sie ist der Teil, an dem man sich vertut.
//   2. Ein Wächter über den Quelltext hält fest, WELCHE Schichten modal sind
//      und dass jede die gemeinsame Falle benutzt. Ohne ihn baut die nächste
//      Sitzung die vierte handgeschriebene Fassung — genau das war der Zustand,
//      der zu diesem Test geführt hat.
//
// Kein DOM-Test: dieses Projekt fährt vitest ohne jsdom und ohne
// Testing-Library, und das bleibt so (keine Abhängigkeit für einen Test).
// Was hier deshalb NICHT belegt ist: das Zusammenspiel mit der echten Seite.
// Genau dort sass auch der Fehler, den erst der Griff zur Tastatur im Browser
// gezeigt hat (20.09.2026): Escape schloss die Menü-Schublade, aber der Fokus
// kehrte nicht auf den Menü-Knopf zurück, weil das `autoFocus`-Suchfeld ihn
// schon beim Einhängen übernommen hatte. Im Browser nachgemessen sind seither:
// Tour, Menü-Schublade, Einstellungs-Schublade und der Erfassen-Fächer.
// Offen und von Hand zu prüfen: der Lösch-Dialog (im Beispiel ausgeschaltet),
// die Sichtbarkeit der Fokus-Umrandung im Dunkelmodus und VoiceOver.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tabZiel, FOKUSSIERBAR } from '../hooks/useFocusTrap.js';

const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

describe('tabZiel — der Kreis schliesst sich', () => {
  it('Tab auf dem letzten Element springt an den Anfang', () => {
    expect(tabZiel({ anzahl: 4, aktivIndex: 3, shift: false })).toBe(0);
  });

  it('Shift+Tab auf dem ersten Element springt ans Ende', () => {
    expect(tabZiel({ anzahl: 4, aktivIndex: 0, shift: true })).toBe(3);
  });

  it('mittendrin mischt sich die Falle nicht ein', () => {
    expect(tabZiel({ anzahl: 4, aktivIndex: 1, shift: false })).toBeNull();
    expect(tabZiel({ anzahl: 4, aktivIndex: 2, shift: true })).toBeNull();
  });

  // Der Einstiegsfokus sitzt auf der Überschrift (tabIndex -1), die NICHT in der
  // Liste steht. Von dort muss Shift+Tab ans Ende führen — sonst verliesse der
  // erste Rückwärtsschritt den Dialog nach hinten.
  it('Shift+Tab von der Überschrift aus springt ans Ende', () => {
    expect(tabZiel({ anzahl: 3, aktivIndex: -1, shift: true })).toBe(2);
  });

  it('Tab von der Überschrift aus macht der Browser selbst', () => {
    expect(tabZiel({ anzahl: 3, aktivIndex: -1, shift: false })).toBeNull();
  });

  it('ein einziges Element bleibt bei sich — in beide Richtungen', () => {
    expect(tabZiel({ anzahl: 1, aktivIndex: 0, shift: false })).toBe(0);
    expect(tabZiel({ anzahl: 1, aktivIndex: 0, shift: true })).toBe(0);
  });

  it('ohne fokussierbare Elemente wird nichts erzwungen', () => {
    expect(tabZiel({ anzahl: 0, aktivIndex: -1, shift: false })).toBeNull();
    expect(tabZiel({ anzahl: 0, aktivIndex: -1, shift: true })).toBeNull();
  });
});

describe('FOKUSSIERBAR — was in den Kreis gehört', () => {
  // Die alte Fassung im Lösch-Dialog kannte nur `button` und `input`. Ein Link
  // oder ein Auswahlfeld im Dialog wäre aus dem Kreis gefallen: Tab hätte ihn
  // angesprungen, die Falle ihn beim Umlauf übergangen.
  it.each(['a[href]', 'button', 'input', 'select', 'textarea', '[tabindex]'])(
    'deckt %s ab',
    (teil) => { expect(FOKUSSIERBAR).toContain(teil); },
  );
});

// ─── Wächter ────────────────────────────────────────────────────────────────

// Die modalen Schichten. Wer eine neue baut, trägt sie hier ein — und merkt
// dabei, dass sie eine Falle braucht.
const MODAL = [
  'Tour.jsx',
  'MobileNav.jsx',
  'components/DatenLoeschen.jsx',
];

// Schichten, die fest liegen (`position: 'fixed'`), aber KEINE Dialoge sind.
// Eine Fokus-Falle wäre hier nicht bloss überflüssig, sondern falsch: sie
// bände den Fokus an etwas, das der Mensch gar nicht betreten hat.
const KEIN_DIALOG = {
  'GlossarBegriff.jsx': 'Sprechblase (role="tooltip"), nicht modal — die Seite dahinter bleibt bedienbar',
  'AutoSaveStatus.jsx': 'aria-live-Meldung, nimmt nie Fokus',
  'main.jsx': 'Erfassen-Fächer: Auswahl am Knopf, der geöffnet bleibt — Escape schliesst ihn, gefangen wird nichts',
};

describe('Wächter · jede modale Schicht nutzt die gemeinsame Falle', () => {
  // Auf den AUFRUF prüfen, nicht auf das Wort. Die erste Fassung dieses Tests
  // suchte `useFocusTrap` irgendwo in der Datei — die Import-Zeile allein hat
  // ihn grün gehalten, auch nachdem der Aufruf herausgenommen war (Gegenprobe
  // am 20.09.2026). Eine Prüfung, die für «gebaut» und «kaputt» dasselbe sagt,
  // ist keine Prüfung.
  it.each(MODAL)('%s ruft useFocusTrap auf', (datei) => {
    const src = lies(datei);
    expect(src).toMatch(/useFocusTrap\(/);
  });

  it.each(MODAL)('%s trägt role="dialog" und aria-modal', (datei) => {
    const src = lies(datei);
    expect(src).toMatch(/role: 'dialog'/);
    expect(src).toMatch(/'aria-modal': 'true'/);
  });

  // Der eigentliche Zweck: keine vierte handgeschriebene Fassung. Wer in einer
  // modalen Schicht wieder selbst nach `Escape` horcht oder von Hand auf das
  // erste/letzte Element springt, hat die Falle umgangen.
  it.each(MODAL)('%s schreibt die Tastenlogik nicht noch einmal selbst', (datei) => {
    const src = lies(datei);
    expect(src).not.toMatch(/e\.key === 'Escape'/);
    expect(src).not.toMatch(/querySelectorAll\(\s*['"`][^'"`]*button/);
  });
});

describe('Wächter · fest liegende Schichten sind vollständig eingeordnet', () => {
  // Findet neue `position: 'fixed'`-Schichten. Jede muss entweder als modal
  // gelten (und eine Falle haben) oder mit Grund als Nicht-Dialog stehen.
  const jsxDateien = (dir, praefix = '') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return ['__tests__', 'hooks', 'i18n', 'data', 'demo'].includes(e.name) ? [] : jsxDateien(p, praefix + e.name + '/');
    return e.name.endsWith('.jsx') ? [praefix + e.name] : [];
  });

  it('keine unbedachte Schicht', () => {
    const fest = jsxDateien(SRC).filter((d) => /position: *'fixed'/.test(lies(d)));
    const unbedacht = fest.filter((d) => !MODAL.includes(d) && !KEIN_DIALOG[d]);
    expect(unbedacht).toEqual([]);
  });

  it.each(Object.keys(KEIN_DIALOG))('%s bleibt bewusst ohne Falle', (datei) => {
    expect(lies(datei)).not.toContain('useFocusTrap');
  });
});
