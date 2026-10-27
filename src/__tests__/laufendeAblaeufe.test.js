// Laufende Abläufe im Kalender (27.10.2026, Entwurf «Zeitleiste»). Gehalten wird: das Band erscheint nur
// für einen begonnenen, nicht fertigen Ablauf; es beginnt heute (kein Anfang wird erfunden) und endet an
// der Frist, die der Ablauf selbst in den Kalender gelegt hat; ohne Frist nur im laufenden Monat. Im
// Beispiel und beim Ausprobieren gibt es kein Band. Der Jahreskreis zeichnet dazu einen Bogen.
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { laufendeAblaeufe, bandFarbe, bandImFenster, fensterStart, fensterTage, FENSTER_TAGE, ABLAEUFE_MIT_STAND, gespeicherterStand } from '../utils/laufendeAblaeufe.js';
import { ablaufStandKey, ablaufStandSichern, ablaufStandLaden } from '../utils/ablaufStand.js';
import { PASS_SCHRITTE, fristDemAblaufZuordnen } from '../AblaufSchale.jsx';
import { Jahreskreis, bandBogen } from '../components/Jahreskreis.jsx';
import { addReminder, loadReminders } from '../utils/reminders.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { inDays } from '../utils/helpers.js';
import { kontrast } from '../utils/lebensbereichFruechte.js';
import * as K from '../config/constants.js';

beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
  };
});

const HEUTE = '2026-10-27';
const frist = (dueDate, extra = {}) => ({ id: 'f', title: 'Bei der neuen Gemeinde anmelden', dueDate, ablauf: 'umzug', done: false, ...extra });

describe('laufendeAblaeufe', () => {
  it('Umzug hat so viele Schritte wie die Passstrasse', () => {
    expect(ABLAEUFE_MIT_STAND.find((a) => a.name === 'umzug').total).toBe(PASS_SCHRITTE);
  });

  it('liest den Stand wie ablaufStandLaden (gleicher Schlüssel, gleiche Regeln)', () => {
    for (const roh of [{ schritt: 2, fertig: false }, { schritt: 9, fertig: true }, { schritt: -1 }, { schritt: 'x', fertig: 'ja' }]) {
      localStorage.setItem(ablaufStandKey('umzug'), JSON.stringify(roh));
      expect(gespeicherterStand('umzug', 4)).toEqual(ablaufStandLaden('umzug', 4, false));
    }
    localStorage.setItem(ablaufStandKey('umzug'), 'kaputt');
    expect(gespeicherterStand('umzug', 4)).toBeNull();
  });

  it('nicht begonnen (kein gespeicherter Stand): kein Band', () => {
    expect(laufendeAblaeufe([], false, HEUTE)).toEqual([]);
  });

  it('begonnen: Schritt ab 1 gezählt, Frist aus der eigenen Erinnerung', () => {
    ablaufStandSichern('umzug', { schritt: 1, fertig: false }, false);
    const [a] = laufendeAblaeufe([frist('2026-11-10')], false, HEUTE);
    expect(a).toMatchObject({ name: 'umzug', schritt: 2, total: 4, frist: '2026-11-10' });
  });

  it('fertig: kein Band', () => {
    ablaufStandSichern('umzug', { schritt: 3, fertig: true }, false);
    expect(laufendeAblaeufe([frist('2026-11-10')], false, HEUTE)).toEqual([]);
  });

  it('im Beispiel und beim Ausprobieren: kein Band, auch wenn ein echter Stand liegt', () => {
    ablaufStandSichern('umzug', { schritt: 1, fertig: false }, false);
    expect(laufendeAblaeufe([frist('2026-11-10')], true, HEUTE)).toEqual([]);
  });

  it('Frist nur aus offenen, künftigen Erinnerungen dieses Ablaufs; die früheste zählt', () => {
    ablaufStandSichern('umzug', { schritt: 0, fertig: false }, false);
    const [a] = laufendeAblaeufe([
      frist('2026-11-20'),
      frist('2026-11-05', { done: true }),
      frist('2026-10-01'),
      { id: 'x', title: 'Fremd', dueDate: '2026-10-30' },
      frist('2026-11-12'),
    ], false, HEUTE);
    expect(a.frist).toBe('2026-11-12');
  });

  it('ohne Frist: frist ist null', () => {
    ablaufStandSichern('umzug', { schritt: 0, fertig: false }, false);
    expect(laufendeAblaeufe([], false, HEUTE)[0].frist).toBeNull();
  });

  it('gesperrter Speicher: kein Band, kein Fehler', () => {
    globalThis.localStorage = { getItem: () => { throw new Error('gesperrt'); } };
    expect(laufendeAblaeufe([], false, HEUTE)).toEqual([]);
  });
});

describe('Fenster der Tagesleiste und Lage des Bands (Entwurf G)', () => {
  it('Fenster: im laufenden Monat drei Tage vor heute, sonst drei Tage vor dem Ersten; 42 Tage', () => {
    expect(fensterStart(2026, 9, HEUTE)).toBe('2026-10-24');
    expect(fensterStart(2026, 10, HEUTE)).toBe('2026-10-29');
    expect(fensterStart(2027, 0, HEUTE)).toBe('2026-12-29');
    const tage = fensterTage('2026-10-24');
    expect(tage).toHaveLength(FENSTER_TAGE);
    expect(tage[8]).toBe('2026-11-01');
  });

  it('von heute bis zur Frist, über den Monatswechsel, rund an beiden Enden', () => {
    expect(bandImFenster({ frist: '2026-11-05' }, '2026-10-24', HEUTE)).toEqual({ von: 3, bis: 12, weiterLinks: false, weiterRechts: false });
  });

  it('Fenster beginnt nach heute: Band kommt von links herein', () => {
    expect(bandImFenster({ frist: '2026-11-05' }, '2026-10-29', HEUTE)).toEqual({ von: 0, bis: 7, weiterLinks: true, weiterRechts: false });
  });

  it('Frist hinter dem Fenster: läuft rechts hinaus', () => {
    expect(bandImFenster({ frist: '2027-02-01' }, '2026-10-24', HEUTE)).toMatchObject({ von: 3, bis: FENSTER_TAGE - 1, weiterRechts: true });
  });

  it('ohne Frist: bis Ende des laufenden Monats, nicht weiter', () => {
    expect(bandImFenster({ frist: null }, '2026-10-24', HEUTE)).toEqual({ von: 3, bis: 7, weiterLinks: false, weiterRechts: false });
    expect(bandImFenster({ frist: null }, '2026-11-29', HEUTE)).toBeNull();
  });

  it('Fenster ganz vor heute oder nach der Frist: kein Band', () => {
    expect(bandImFenster({ frist: '2026-11-05' }, '2026-08-29', HEUTE)).toBeNull();
    expect(bandImFenster({ frist: '2026-11-05' }, '2026-11-28', HEUTE)).toBeNull();
  });
});

describe('Frist trägt den Ablauf', () => {
  const frage = { title: 'Bei der neuen Gemeinde anmelden', dueDate: '2026-11-10', category: 'admin', ablauf: 'umzug' };

  it('nach dem Speichern über die Frist-Karte trägt die Erinnerung `ablauf`', async () => {
    const { fristSichern } = await import('../AblaufSchale.jsx');
    expect(fristSichern(frage, { vorlaeufig: false })).toBe('gespeichert');
    expect(loadReminders()).toEqual([expect.objectContaining({ title: frage.title, ablauf: 'umzug' })]);
  });

  it('eine schon vorhandene gleiche Erinnerung wird zugeordnet, nicht verdoppelt', () => {
    addReminder({ title: frage.title, dueDate: frage.dueDate });
    fristDemAblaufZuordnen(frage);
    expect(loadReminders()).toHaveLength(1);
    expect(loadReminders()[0].ablauf).toBe('umzug');
  });

  it('ohne Ablauf und im Beispiel: nichts geändert', async () => {
    addReminder({ title: 'Andere', dueDate: '2026-11-10' });
    fristDemAblaufZuordnen({ title: 'Andere', dueDate: '2026-11-10' });
    expect('ablauf' in loadReminders()[0]).toBe(false);
    const { fristSichern } = await import('../AblaufSchale.jsx');
    expect(fristSichern(frage, { vorlaeufig: true })).toBe('vorlaeufig');
    expect(loadReminders().some((r) => r.ablauf)).toBe(false);
  });

  it('der Umzug legt seine Frist mit ablauf «umzug» an', async () => {
    const fs = await import('node:fs');
    const quelle = fs.readFileSync(new URL('../UmzugAblauf.jsx', import.meta.url), 'utf8');
    expect(quelle).toMatch(/EreignisFrist[\s\S]*?ablauf: 'umzug'/);
  });
});

describe('Jahreskreis: Bogen des laufenden Ablaufs', () => {
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const t = (k) => k;
  const zeichne = (baender) => renderToStaticMarkup(React.createElement(Jahreskreis, {
    jahr: 2026, heuteIso: HEUTE, eintraege: [], gewaehlterMonat: 9, onMonat: () => {}, locale: 'de-CH', palette, t, baender,
  }));

  it('auf das Jahr beschnitten, null ausserhalb', () => {
    expect(bandBogen('2026-10-27', '2026-11-10', 2026).bis).toBeGreaterThan(bandBogen('2026-10-27', '2026-11-10', 2026).von);
    expect(bandBogen('2026-12-20', '2027-01-08', 2027).von).toBe(0);
    expect(bandBogen('2026-12-20', '2027-01-08', 2026).bis).toBeLessThan(360);
    expect(bandBogen('2026-10-27', '2026-11-10', 2027)).toBeNull();
    expect(bandBogen('2026-11-10', '2026-10-27', 2026)).toBeNull();
  });

  it('zeichnet einen Bogen mit runden Enden, ohne Band keinen', () => {
    expect(zeichne([{ key: 'umzug', von: HEUTE, bis: '2026-11-10', farbe: '#7E9F8C' }])).toMatch(/stroke="#7E9F8C"[^>]*stroke-linecap="round"/);
    expect(zeichne([{ key: 'umzug', von: HEUTE, bis: '2026-11-10', farbe: '#7E9F8C' }])).toContain('data-ablauf-bogen="umzug"');
    expect(zeichne([])).not.toContain('data-ablauf-bogen');
  });
});

describe('Lesbarkeit (a11y-Prüfung 27.10.2026)', () => {
  // Alle Paletten der App: hell, dunkel, Kontrast.
  const paletten = Object.entries(K).filter(([, v]) => v && typeof v === 'object' && v.bg && v.text && v.sage && v.mid);
  const BEREICHE = ['wohnen', 'finanzen', 'versicherungen', 'basis', 'behoerden', 'ausbildung', 'notfall'];

  it('findet die Paletten', () => {
    expect(paletten.length).toBeGreaterThanOrEqual(2);
  });

  it('Bandschrift (Grundfarbe) hält 4.5:1 auf der Bandfarbe jedes Bereichs', () => {
    const zuWenig = paletten.flatMap(([name, p]) => BEREICHE.map((b) => [name, b, kontrast(bandFarbe(b, p), p.bg)]))
      .filter(([, , k]) => k < 4.5).map(([n, b, k]) => n + '/' + b + ' ' + k.toFixed(2));
    expect(zuWenig).toEqual([]);
  });

  it('überfällig (sandDeep) als Text 4.5:1, leerer Abhak-Kreis (mid) 3:1', () => {
    for (const [, p] of paletten) {
      expect(kontrast(p.sandDeep || p.sand, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(p.mid, p.bg)).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('Kalender: Band über der Tagesleiste', () => {
  const tKal = createT({ de }, 'de', 'sie');
  const pal = new Proxy({}, { get: () => '#888888' });
  const render = async (vorlaeufig = false) => {
    const { CalendarReminders } = await import('../CalendarReminders.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
      React.createElement(CalendarReminders, { palette: pal, t: tKal, data: {}, onNavigate: () => {} })));
  };

  it('laufender Umzug: Band mit «Umzug · Schritt 2 von 4» unter den Tagen (Entwurf G)', async () => {
    localStorage.setItem(ablaufStandKey('umzug'), JSON.stringify({ schritt: 1, fertig: false }));
    const html = await render();
    expect(html).toContain('data-ablauf-band="umzug"');
    expect(html).toContain('Umzug · Schritt 2 von 4');
    expect(html.indexOf('data-ablauf-band')).toBeGreaterThan(html.indexOf('data-heute="true"'));
    expect(html.indexOf('data-ablauf-band')).toBeLessThan(html.indexOf('data-legende'));
  });

  it('Fassung G: Kopf, Monatsknöpfe, Legende, «Ganzer Monat» und «Ganzes Jahr» mit dem Jahreskreis', async () => {
    const html = await render();
    expect(html).toContain('Übersicht');
    expect(html).toContain('in der Reihenfolge der Zeit');
    expect((html.match(/data-monatsknoepfe[\s\S]*?<\/div>/)[0].match(/<button/g) || []).length).toBe(12);
    expect(html).toContain('data-legende');
    const monat = html.indexOf('Ganzer Monat');
    const jahr = html.indexOf('Ganzes Jahr');
    expect(monat).toBeGreaterThan(html.indexOf('data-legende'));
    expect(jahr).toBeGreaterThan(monat);
    // Der Jahreskreis liegt im aufklappbaren «Ganzes Jahr», nicht mehr offen über der Tagesleiste.
    const ganzesJahr = html.slice(html.indexOf('data-ganzes-jahr'));
    expect(ganzesJahr).toMatch(/<svg[^>]*viewBox="0 0 240 240"/);
    expect(html.slice(0, html.indexOf('data-ganzes-jahr'))).not.toMatch(/viewBox="0 0 240 240"/);
  });

  it('«Als Nächstes»: der früheste offene Eintrag mit Herkunft; ohne Einträge kein Block', async () => {
    expect(await render()).not.toContain('data-als-naechstes');
    localStorage.setItem('or5_reminders', JSON.stringify([
      { id: 'a', title: 'Später', dueDate: inDays(20), category: 'personal', recurrence: 'once', done: false },
      { id: 'f', title: 'Bei der neuen Gemeinde anmelden', dueDate: inDays(9), category: 'admin', recurrence: 'once', ablauf: 'umzug', done: false },
    ]));
    const html = await render();
    const block = html.slice(html.indexOf('data-als-naechstes'), html.indexOf('data-als-naechstes') + 600);
    expect(block).toContain('in 9 Tagen');
    expect(block).toContain('Bei der neuen Gemeinde anmelden · aus dem Ablauf Umzug');
  });

  it('«Als Nächstes» verpasst: ruhig «verpasst» und «Was jetzt?», keine Tageszahl, nie rot (Entwurf G)', async () => {
    localStorage.setItem('or5_reminders', JSON.stringify([
      { id: 'v', title: 'Bei der neuen Gemeinde anmelden', dueDate: inDays(-2), category: 'admin', recurrence: 'once', ablauf: 'umzug', done: false },
      { id: 's', title: 'Später', dueDate: inDays(9), category: 'personal', recurrence: 'once', done: false },
    ]));
    const html = await render();
    const i = html.indexOf('data-als-naechstes="verpasst"');
    expect(i).toBeGreaterThan(-1);
    const block = html.slice(i, html.indexOf('</button>', i) + 9);
    expect(block).toContain('>verpasst<');
    expect(block).toContain('Bei der neuen Gemeinde anmelden · aus dem Ablauf Umzug');
    expect(block).toContain('Was jetzt? ›');
    expect(block).not.toMatch(/überfällig|roseDeep/);
  });

  it('«Als Nächstes» künftig: kein «Was jetzt?»', async () => {
    localStorage.setItem('or5_reminders', JSON.stringify([
      { id: 's', title: 'Später', dueDate: inDays(9), category: 'personal', recurrence: 'once', done: false },
    ]));
    const html = await render();
    expect(html).toContain('data-als-naechstes="true"');
    expect(html).not.toContain('Was jetzt?');
  });

  it('Liste: «Frist · Fällig in … · aus dem Ablauf Umzug», runder Kreis zum Abhaken', async () => {
    localStorage.setItem('or5_reminders', JSON.stringify([
      { id: 'f', title: 'Bei der neuen Gemeinde anmelden', dueDate: inDays(9), category: 'admin', recurrence: 'once', ablauf: 'umzug', done: false },
    ]));
    const html = await render();
    expect(html).toMatch(/data-zeile="frist"/);
    expect(html).toMatch(/>Frist<\/span> · <span[^>]*>Fällig in 9 Tagen<\/span> · aus dem Ablauf Umzug/);
    // Mit Datum im Namen, weil die Datumsspalte aria-hidden ist (a11y-Prüfung 27.10.2026).
    expect(html).toMatch(/aria-label="Als erledigt markieren: Bei der neuen Gemeinde anmelden, \d+\. \S+"/);
  });

  it('mit Frist im Kalender: zusätzlich der Bogen im Jahreskreis', async () => {
    localStorage.setItem(ablaufStandKey('umzug'), JSON.stringify({ schritt: 1, fertig: false }));
    localStorage.setItem('or5_reminders', JSON.stringify([{ id: 'f', title: 'Bei der neuen Gemeinde anmelden', dueDate: inDays(10), category: 'admin', recurrence: 'once', ablauf: 'umzug', done: false }]));
    expect(await render()).toContain('data-ablauf-bogen');
  });

  it('kein laufender Ablauf, oder im Beispiel: kein Band', async () => {
    expect(await render()).not.toContain('data-ablauf-band');
    localStorage.setItem(ablaufStandKey('umzug'), JSON.stringify({ schritt: 1, fertig: false }));
    expect(await render(true)).not.toContain('data-ablauf-band');
  });
});
