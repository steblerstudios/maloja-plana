// Laufende Abläufe im Kalender (27.10.2026, Entwurf «Zeitleiste»). Gehalten wird: das Band erscheint nur
// für einen begonnenen, nicht fertigen Ablauf; es beginnt heute (kein Anfang wird erfunden) und endet an
// der Frist, die der Ablauf selbst in den Kalender gelegt hat; ohne Frist nur im laufenden Monat. Im
// Beispiel und beim Ausprobieren gibt es kein Band. Der Jahreskreis zeichnet dazu einen Bogen.
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { laufendeAblaeufe, bandImMonat, ABLAEUFE_MIT_STAND, gespeicherterStand } from '../utils/laufendeAblaeufe.js';
import { ablaufStandKey, ablaufStandSichern, ablaufStandLaden } from '../utils/ablaufStand.js';
import { PASS_SCHRITTE, fristDemAblaufZuordnen } from '../AblaufSchale.jsx';
import { Jahreskreis, bandBogen } from '../components/Jahreskreis.jsx';
import { addReminder, loadReminders } from '../utils/reminders.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { inDays } from '../utils/helpers.js';

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

describe('bandImMonat', () => {
  const mitFrist = { frist: '2026-11-10' };
  const ohneFrist = { frist: null };

  it('Monat mit heute: von heute bis Monatsende, läuft weiter', () => {
    expect(bandImMonat(mitFrist, 2026, 9, HEUTE)).toEqual({ vonTag: 27, bisTag: 31, weiterLinks: false, weiterRechts: true });
  });

  it('Monat mit der Frist: vom Monatsanfang (aus dem Vormonat) bis zur Frist, endet dort', () => {
    expect(bandImMonat(mitFrist, 2026, 10, HEUTE)).toEqual({ vonTag: 1, bisTag: 10, weiterLinks: true, weiterRechts: false });
  });

  it('Frist im selben Monat: von heute bis zur Frist', () => {
    expect(bandImMonat({ frist: '2026-10-30' }, 2026, 9, HEUTE)).toEqual({ vonTag: 27, bisTag: 30, weiterLinks: false, weiterRechts: false });
  });

  it('nach der Frist und vor heute: kein Band', () => {
    expect(bandImMonat(mitFrist, 2026, 11, HEUTE)).toBeNull();
    expect(bandImMonat(mitFrist, 2026, 8, HEUTE)).toBeNull();
  });

  it('ohne Frist: nur im laufenden Monat, bis Monatsende auslaufend', () => {
    expect(bandImMonat(ohneFrist, 2026, 9, HEUTE)).toEqual({ vonTag: 27, bisTag: 31, weiterLinks: false, weiterRechts: true });
    expect(bandImMonat(ohneFrist, 2026, 10, HEUTE)).toBeNull();
  });

  it('über den Jahreswechsel', () => {
    expect(bandImMonat({ frist: '2027-01-08' }, 2027, 0, '2026-12-28')).toEqual({ vonTag: 1, bisTag: 8, weiterLinks: true, weiterRechts: false });
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

  it('Liste: «Frist · Fällig in … · aus dem Ablauf Umzug», runder Kreis zum Abhaken', async () => {
    localStorage.setItem('or5_reminders', JSON.stringify([
      { id: 'f', title: 'Bei der neuen Gemeinde anmelden', dueDate: inDays(9), category: 'admin', recurrence: 'once', ablauf: 'umzug', done: false },
    ]));
    const html = await render();
    expect(html).toMatch(/data-zeile="frist"/);
    expect(html).toMatch(/Frist · <span[^>]*>Fällig in 9 Tagen<\/span> · aus dem Ablauf Umzug/);
    expect(html).toContain('aria-label="Als erledigt markieren: Bei der neuen Gemeinde anmelden"');
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
