import { describe, it, expect } from 'vitest';
import { LOHN_REFERENZ, mindestlohnBoden, lohnBandState, SCALE_MIN, SCALE_MAX } from '../lohnEinordnung.js';
import { LSE_VOLLZEIT_STUNDEN_WOCHE } from '../branchenLohn.js';

describe('lohnEinordnung', () => {
  // Alle drei Werte stehen wörtlich in der BFS-Medienmitteilung vom 25.11.2025
  // („2024 lag der Medianlohn bei 7024 Franken brutto", LSE 2024: Erste Ergebnisse).
  // ⚠️ Dieser Test hiess bis Predeploy-Runde 8 „Median 6788 (BFS LSE 2022, amtlich belegt)"
  // und prüfte in derselben Assertion `durchschnitt: 7996` mit — eine Zahl, die NICHT
  // belegt war (BFS publiziert den Mittelwert nur in STAT-TAB). Der Test lieh der
  // ungeprüften Zahl die Autorität der geprüften. Der Durchschnitt ist jetzt ersatzlos raus.
  it('LOHN_REFERENZ: LSE 2024, jeder Wert amtlich belegt', () => {
    expect(LOHN_REFERENZ.median).toBe(7024);
    expect(LOHN_REFERENZ.p10).toBe(4635);
    expect(LOHN_REFERENZ.p90).toBe(12526);
    expect(LOHN_REFERENZ.jahr).toBe(2024);
  });

  it('kein `durchschnitt` mehr — er war nie belegt', () => {
    expect(LOHN_REFERENZ.durchschnitt).toBeUndefined();
  });

  // BFS, „Definition : Lohn": „Umrechnung auf ein Vollzeitäquivalent von 4 1/3 Wochen zu
  // 40 Arbeitsstunden". NICHT die 42 aus lohnCheck.js — das ist die Mindestlohn-Welt.
  it('LSE-Nenner ist 40 (BFS-Norm), nicht 42 (Mindestlohn-Welt)', () => {
    expect(LSE_VOLLZEIT_STUNDEN_WOCHE).toBe(40);
  });

  describe('mindestlohnBoden', () => {
    it('GE: 24.59 × 182 = 4475/Monat', () => {
      const b = mindestlohnBoden('GE');
      expect(b.chfStunde).toBe(24.59);
      expect(b.monat).toBe(4475);
      expect(b.jahr).toBe(2026);
    });
    it('Kanton ohne Mindestlohn: null (kein erfundener Boden)', () => {
      expect(mindestlohnBoden('ZH')).toBeNull();
      expect(mindestlohnBoden('')).toBeNull();
    });
  });

  describe('lohnBandState', () => {
    const brutto = { incomeType: 'brutto' };

    it('ohne Lohn: show:false', () => {
      expect(lohnBandState({ income: 0, canton: 'GE' }).show).toBe(false);
      expect(lohnBandState({}).show).toBe(false);
    });

    // 40 Std. IST Schweizer Vollzeit und exakt die LSE-Norm. Bis Runde 8 rechnete der
    // Nenner 42: 7024 × 42/40 = 7375 → „über dem Median", obwohl es exakt der Median ist.
    it('40 Std. mit exakt dem Median → near, keine Hochrechnung, nicht „Teilzeit“', () => {
      const s = lohnBandState({ income: 7024, canton: 'ZH', hoursPerWeek: 40, ...brutto });
      expect(s.incomeFTE).toBe(7024);
      expect(s.rel).toBe('near');
      expect(s.partTime).toBe(false);
      expect(s.overFullTime).toBe(false);
    });

    it('nahe am Median (±5%) → near', () => {
      expect(lohnBandState({ income: 7024, canton: 'ZH', hoursPerWeek: 40, ...brutto }).rel).toBe('near');
      expect(lohnBandState({ income: 7300, canton: 'ZH', hoursPerWeek: 40, ...brutto }).rel).toBe('near');
    });
    it('deutlich darüber → above', () => {
      const s = lohnBandState({ income: 9400, canton: 'ZH', hoursPerWeek: 40, ...brutto });
      expect(s.rel).toBe('above');
      expect(s.pct).toBe(34);
    });
    it('deutlich darunter → below', () => {
      expect(lohnBandState({ income: 4500, canton: 'ZH', hoursPerWeek: 40, ...brutto }).rel).toBe('below');
    });

    it('Teilzeit 3400 bei 21 Std./Woche → auf 40 Std. hochgerechnet', () => {
      const s = lohnBandState({ income: 3400, canton: 'GE', hoursPerWeek: 21, ...brutto });
      expect(s.partTime).toBe(true);
      expect(s.hoursKnown).toBe(true);
      expect(s.incomeFTE).toBe(6476); // 3400 / (21/40)
    });

    // 🔴 Predeploy-Runde 8: hochgerechnet wurde NUR nach unten (`stunden < 42`). Wer mehr
    // arbeitete, behielt den Rohlohn — das Barometer sprach eine echte Unterschreitung frei,
    // während das Kapitel sie meldete. Beide Screens, dieselben Daten, gegenteilige Aussage.
    it('über Vollzeit (45 Std.) wird NACH UNTEN normalisiert', () => {
      const s = lohnBandState({ income: 4100, canton: 'BS', hoursPerWeek: 45, ...brutto });
      expect(s.overFullTime).toBe(true);
      expect(s.partTime).toBe(false);
      expect(s.incomeFTE).toBe(3644); // 4100 / (45/40) — NICHT 4100
      expect(s.rel).toBe('below');
    });

    // Der Kern der Wahrheits-Disziplin: ohne Stunden ist die Hochrechnung unmöglich.
    it('ohne Wochenstunden: kein Urteil (rel:null), keine Hochrechnung', () => {
      const s = lohnBandState({ income: 3000, canton: 'GE', ...brutto });
      expect(s.hoursKnown).toBe(false);
      expect(s.partTime).toBe(false);
      expect(s.incomeFTE).toBe(3000);
      expect(s.rel).toBeNull();   // vorher: 'below' → „Ihr Lohn liegt unter dem Median“
      expect(s.pct).toBeNull();
      expect(s.mlBreached).toBe(false);
    });

    it('Skala ist fest (springt nicht mit den Daten)', () => {
      expect(SCALE_MIN).toBe(3000);
      expect(SCALE_MAX).toBe(13000);
      const s = lohnBandState({ income: 20000, canton: 'GE', hoursPerWeek: 40, ...brutto });
      expect(s.scaleMax).toBe(13000);
      expect(s.incomeFTE).toBe(20000); // Clamping macht die Anzeige, nicht die Logik
    });

    it('reicht den Mindestlohn-Boden des Kantons durch', () => {
      expect(lohnBandState({ income: 5000, canton: 'GE', hoursPerWeek: 40, ...brutto }).mindestlohn.monat).toBe(4475);
      expect(lohnBandState({ income: 5000, canton: 'ZH', hoursPerWeek: 40, ...brutto }).mindestlohn).toBeNull();
    });
  });

  // 🔴 Predeploy-Runde 8: Der Mindestlohn-Befund wurde im Barometer ein ZWEITES Mal
  // gerechnet (`incomeFTE < mindestlohn.monat`) und wich vom Kapitel ab. Er kommt jetzt
  // aus `pruefeStundenlohn` — dieselbe Funktion, die Kapitel und Brief benutzen.
  // Diese Wächter halten fest, dass es EINE Wahrheit bleibt.
  describe('Mindestlohn-Befund kommt aus pruefeStundenlohn (eine Wahrheit)', () => {
    it('unterschritten: Barometer meldet es (GE, 4400 auf 42 Std.)', () => {
      const s = lohnBandState({ income: 4400, canton: 'GE', hoursPerWeek: 42, incomeType: 'brutto' });
      expect(s.befundStatus).toBe('unterMindestlohn');
      expect(s.mlBreached).toBe(true);
    });

    it('45 Std. unter Mindestlohn: kein Freispruch mehr (BS, 4100)', () => {
      const s = lohnBandState({ income: 4100, canton: 'BS', hoursPerWeek: 45, incomeType: 'brutto' });
      expect(s.mlBreached).toBe(true); // vorher: false → Barometer sprach frei
    });

    it('korrekt bezahlte Teilzeit: kein Fehlalarm (GE, 3000 auf 21 Std. = 32.97/Std.)', () => {
      const s = lohnBandState({ income: 3000, canton: 'GE', hoursPerWeek: 21, incomeType: 'brutto' });
      expect(s.befundStatus).toBe('ok');
      expect(s.mlBreached).toBe(false);
    });

    // 🔴 Netto gegen einen Brutto-Boden erklärt korrekt Bezahlte für unterbezahlt.
    it('netto: kein Befund (Mindestlohn ist brutto)', () => {
      const s = lohnBandState({ income: 4000, canton: 'GE', hoursPerWeek: 42, incomeType: 'netto' });
      expect(s.befundStatus).toBe('basisUnklar');
      expect(s.mlBreached).toBe(false);
    });

    it('Einkommensart nicht gesetzt: kein Befund (Basis unbekannt)', () => {
      const s = lohnBandState({ income: 4000, canton: 'GE', hoursPerWeek: 42 });
      expect(s.befundStatus).toBe('basisUnklar');
      expect(s.mlBreached).toBe(false);
    });
  });
});
