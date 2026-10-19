import { describe, it, expect, afterEach, vi } from 'vitest';
import { pruefeStundenlohn, pruefeLohn, getMindestlohn, alleMindestlohnKantone } from '../lohnCheck.js';
import { mindestlohnBoden, lohnBandState } from '../lohnEinordnung.js';
import { stundenlohnRechnen } from '../../utils/stundenlohn.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Stundenlohn } from '../../Stundenlohn.jsx';
import { createT } from '../../i18n/index.js';
import de from '../../i18n/de.js';
import fr from '../../i18n/fr.js';
import it_ from '../../i18n/it.js';
import en from '../../i18n/en.js';
import rm from '../../i18n/rm.js';

// Jahres-Riegel (Deploy-Tor 19.10.2026, «sollte, kein Blocker» mit fester Frist):
// Die Mindestlöhne in data/lohnCheck.js sind für 2026 amtlich belegt. Ab dem 01.01.2027
// darf die App nicht still mit diesen Beträgen weiterrechnen — weder «ok» noch «unter dem
// Mindestlohn», weder Betrag noch Marke. Sie sagt stattdessen, dass die Werte für das
// laufende Jahr nicht belegt sind. Vorbild: `jahrVorbei` in config/kantonsModell.js (IPV).
// Keine Beträge für 2027 erfunden: fehlen amtliche Werte, bleibt es beim Hinweis.

const KANTONE = ['GE', 'NE', 'JU', 'BS', 'TI'];
const zeit = (iso) => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date(iso)); };

describe('Mindestlohn-Jahres-Riegel', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('31.12.2026 23:59: die Werte 2026 gelten noch — GE brutto unter dem Boden wird benannt', () => {
    zeit('2026-12-31T23:59:00');
    const r = pruefeStundenlohn(3000, 42, 'GE', 'brutto', 'no');
    expect(r.status).toBe('unterMindestlohn');
    expect(r.mindestStunde).toBe(24.59);
    expect(r.jahr).toBe(2026);
  });

  it('01.01.2027 00:00:01: kein Urteil mit Werten 2026, sondern «nicht belegt»', () => {
    zeit('2027-01-01T00:00:01');
    const r = pruefeStundenlohn(3000, 42, 'GE', 'brutto', 'no');
    expect(r.status).toBe('jahrNichtBelegt');
    expect(r.jahr).toBe(2026);
    expect(r.laufendesJahr).toBe(2027);
    expect(r.kanton).toBe('GE');
    // Kein Betrag aus 2026 darf mitlaufen — sonst zeigt ihn irgendeine Ansicht doch an.
    expect(r).not.toHaveProperty('mindestStunde');
    expect(r).not.toHaveProperty('mindestMonat');
    expect(r).not.toHaveProperty('differenzMonat');
    expect(r).not.toHaveProperty('reduzierterBoden');
  });

  it.each(KANTONE)('%s: 2027 auch über dem Boden kein «ok» aus Werten 2026', (k) => {
    zeit('2027-03-15T12:00:00');
    expect(pruefeStundenlohn(9000, 42, k, 'brutto', 'yes').status).toBe('jahrNichtBelegt');
    expect(pruefeStundenlohn(2000, 42, k, 'brutto', 'no').status).toBe('jahrNichtBelegt');
    expect(pruefeStundenlohn(2000, 42, k, 'netto').status).toBe('jahrNichtBelegt');
  });

  it('Kanton ohne Mindestlohn bleibt 2027 «keinGesetz» — der Riegel betrifft nur belegte Kantone', () => {
    zeit('2027-03-15T12:00:00');
    expect(pruefeStundenlohn(3000, 42, 'ZH', 'brutto').status).toBe('keinGesetz');
  });

  it('fehlende oder unplausible Stunden fragen weiterhin zuerst nach', () => {
    zeit('2027-03-15T12:00:00');
    expect(pruefeStundenlohn(3000, 0, 'GE', 'brutto').status).toBe('unvollstaendig');
    expect(pruefeStundenlohn(3000, 80, 'GE', 'brutto').status).toBe('stundenUnplausibel');
  });

  it('pruefeLohn (Referenz-Rechnung) ist ebenfalls verriegelt', () => {
    zeit('2027-01-01T00:00:01');
    const r = pruefeLohn(3000, 'GE');
    expect(r.status).toBe('jahrNichtBelegt');
    expect(r).not.toHaveProperty('mindestStunde');
    expect(pruefeLohn(3000, 'ZH').status).toBe('keinGesetz');
  });

  it('die Rohdaten selbst bleiben unverändert und tragen ihr Jahr (2026)', () => {
    zeit('2027-01-01T00:00:01');
    expect(getMindestlohn('GE')).toMatchObject({ chfStunde: 24.59, jahr: 2026 });
    expect(alleMindestlohnKantone().every((k) => k.jahr === 2026)).toBe(true);
  });

  describe('Lohn-Barometer', () => {
    it('2026: Mindestlohn-Marke und Betrag wie bisher', () => {
      zeit('2026-06-01T12:00:00');
      expect(mindestlohnBoden('GE')).toMatchObject({ chfStunde: 24.59, jahr: 2026 });
      const s = lohnBandState({ income: 3000, canton: 'GE', hoursPerWeek: 42, incomeType: 'brutto', dreizehnter: 'no' });
      expect(s.mlBreached).toBe(true);
      expect(s.mindestlohnNichtBelegt).toBeNull();
    });

    it('2027: keine Marke, kein Betrag, kein Alarm — dafür der Hinweis mit Datenjahr', () => {
      zeit('2027-01-01T00:00:01');
      expect(mindestlohnBoden('GE')).toBeNull();
      const s = lohnBandState({ income: 3000, canton: 'GE', hoursPerWeek: 42, incomeType: 'brutto', dreizehnter: 'no' });
      expect(s.mindestlohn).toBeNull();
      expect(s.mlBreached).toBe(false);
      expect(s.konformMit13).toBe(false);
      expect(s.dreizehnterUnklar).toBe(false);
      expect(s.mindestlohnNichtBelegt).toEqual({ jahr: 2026, laufendesJahr: 2027 });
    });

    it('2027 in einem Kanton ohne Mindestlohn: kein Hinweis (es gibt nichts zu belegen)', () => {
      zeit('2027-01-01T00:00:01');
      const s = lohnBandState({ income: 3000, canton: 'ZH', hoursPerWeek: 42, incomeType: 'brutto' });
      expect(s.mindestlohnNichtBelegt).toBeNull();
    });
  });

  it('Stundenlohn-Rechner: 2027 je Lesart «nicht belegt» statt Befund', () => {
    zeit('2027-01-01T00:00:01');
    const r = stundenlohnRechnen({ betrag: '20', wochenstunden: '42', kanton: 'GE', ferienForm: 'unklar', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.status).toBe('gerechnet');
    const stati = Object.values(r.befunde).map((b) => b.status);
    expect(stati.length).toBeGreaterThan(0);
    expect(stati.every((s) => s === 'jahrNichtBelegt')).toBe(true);
  });

  describe('gerenderter Text im Stundenlohn-Rechner (de)', () => {
    const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
    const t = createT({ de }, 'de', 'sie');
    const seite = () => renderToStaticMarkup(React.createElement(Stundenlohn, {
      palette, t, onUpdateData: () => {},
      data: { finanzen: { stundenlohnRechner: { betrag: '20', wochenstunden: '42', kanton: 'GE', ferienForm: 'dazu', dreizehnter: 'nein', feiertag: 'nein' } } },
    })).replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

    it('2026: Befund mit Betrag 24.59 wie bisher', () => {
      zeit('2026-06-01T12:00:00');
      const s = seite();
      expect(s).toContain('24.59');
      expect(s).not.toContain('amtlich belegt');
    });

    it('2027: Hinweis mit beiden Jahren, kein Betrag 24.59, kein «scheint unter»', () => {
      zeit('2027-01-01T00:00:01');
      const s = seite();
      expect(s).toContain('Die Mindestlöhne in dieser App sind für 2026 amtlich belegt. Für 2027 sind noch keine geprüften Werte erfasst');
      expect(s).not.toContain('24.59');
      expect(s).not.toContain('scheint unter');
    });
  });

  describe('Hinweistext in allen fünf Sprachen', () => {
    const sprachen = { de, fr, it: it_, en, rm };
    it.each(Object.keys(sprachen))('%s: Kapitel- und Barometer-Satz vorhanden, mit Datenjahr und laufendem Jahr', (lang) => {
      const s = sprachen[lang];
      const kapitel = s.lohnCheck.jahrNichtBelegt;
      const barometer = s.lohnEinordnung.mindestlohnJahrNichtBelegt;
      for (const text of [kapitel, barometer]) {
        expect(typeof text).toBe('string');
        expect(text).toContain('{jahr}');
        expect(text).toContain('{laufend}');
        // Kein Betrag im Text — der Hinweis darf keine Zahl behaupten.
        expect(text).not.toMatch(/\d/);
      }
      expect(kapitel).toContain('{kanton}');
      expect(kapitel).toContain('{stelle}');
    });
  });
});
