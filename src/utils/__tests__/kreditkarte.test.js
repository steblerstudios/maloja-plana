import { describe, it, expect } from 'vitest';
import { karteRechnen, VORTEILE, VERSICHERUNGEN } from '../kreditkarte.js';

// «Lohnt sich meine Karte?» — reine Rechnung aus den eigenen Angaben, keine Fachdaten.
// Beispiel der Skizze vom 27.09.2026: 900 im Monat, 15 % Fremdwährung à 1,75 %, 1 % Cashback,
// Jahresgebühr 100, Reiseversicherung schon anderswo → kostet etwa 20 im Jahr.
const skizze = {
  jahresgebuehr: '100', ausgabenMonat: '900', fremdAnteil: '15', fremdGebuehr: '1,75', cashback: '1',
  vorteile: { reiseversicherung: { an: true, status: 'anderswo', wert: '80' } },
};

describe('Kreditkarte — lohnt es sich?', () => {
  it('Skizze: Cashback 108, Gebühr 100, Fremdwährung 28.35 → kostet etwa 20', () => {
    const r = karteRechnen(skizze);
    expect(r.jahresAusgaben).toBe(10800);
    expect(r.cashback).toBe(108);
    expect(r.fremdKosten).toBe(28.35);
    expect(r.vorteile).toBe(0);
    expect(r.netto).toBe(-20.35);
    expect(r.ergebnis).toBe('kostet');
  });

  it('Versicherung zählt nur, wenn man sie sonst selbst kaufen würde', () => {
    const braucheIch = karteRechnen({ ...skizze, vorteile: { reiseversicherung: { an: true, status: 'braucheIch', wert: '80' } } });
    expect(braucheIch.vorteile).toBe(80);
    expect(braucheIch.ergebnis).toBe('bringt');
    const unnoetig = karteRechnen({ ...skizze, vorteile: { reiseversicherung: { an: true, status: 'unnoetig', wert: '80' } } });
    expect(unnoetig.vorteile).toBe(0);
    expect(unnoetig.nichtGezaehlt).toEqual([{ key: 'reiseversicherung', status: 'unnoetig' }]);
  });

  it('Vorteil ohne Häkchen zählt nicht, auch wenn ein Wert daneben steht', () => {
    expect(karteRechnen({ ...skizze, vorteile: { punkte: { an: false, wert: '500' } } }).vorteile).toBe(0);
  });

  it('Geld-Vorteile (Punkte, Rabatte, Lounge) zählen mit ihrem Wert', () => {
    const r = karteRechnen({ ...skizze, vorteile: { punkte: { an: true, wert: '30' }, rabatte: { an: true, wert: '15.50' }, lounge: { an: true, wert: '0' } } });
    expect(r.vorteile).toBe(45.5);
  });

  it('Zinsen auf offenem Saldo zählen als Kosten', () => {
    const r = karteRechnen({ ...skizze, zinsenJahr: '120' });
    expect(r.kosten).toBe(248.35);
    expect(r.netto).toBe(-140.35);
  });

  it('knapp um null → «geht etwa auf» (± 10 Franken)', () => {
    expect(karteRechnen({ ausgabenMonat: '100', jahresgebuehr: '9' }).ergebnis).toBe('ausgeglichen');
    expect(karteRechnen({ ausgabenMonat: '100', jahresgebuehr: '10' }).ergebnis).toBe('ausgeglichen');
    expect(karteRechnen({ ausgabenMonat: '100', jahresgebuehr: '10.01' }).ergebnis).toBe('kostet');
  });

  it('ohne Ausgaben keine Aussage — lieber nichts als eine falsche Zahl', () => {
    expect(karteRechnen({ jahresgebuehr: '100' }).ergebnis).toBe('brauchtAusgaben');
    expect(karteRechnen({}).ergebnis).toBe('brauchtAusgaben');
    expect(karteRechnen(null).ergebnis).toBe('brauchtAusgaben');
  });

  it('Gratiskarte ohne Vorteile und ohne Auslandeinsatz geht auf', () => {
    expect(karteRechnen({ ausgabenMonat: '500' }).ergebnis).toBe('ausgeglichen');
  });

  it('Unsinn wird nicht mitgerechnet: negativ, Text, über 100 %', () => {
    const r = karteRechnen({ ausgabenMonat: '1000', jahresgebuehr: '-50', fremdAnteil: '250', fremdGebuehr: '2', cashback: 'abc' });
    expect(r.gebuehr).toBe(0);
    expect(r.cashback).toBe(0);
    expect(r.fremdKosten).toBe(240); // Anteil auf 100 % begrenzt
  });

  it('Apostroph und Komma in Beträgen werden gelesen', () => {
    expect(karteRechnen({ ausgabenMonat: "1'200", cashback: '0,5' }).cashback).toBe(72);
  });

  it('jede Vorteils-Art ist entweder Geld oder Versicherung, nie beides', () => {
    for (const v of VORTEILE) expect(typeof v.versicherung).toBe('boolean');
    expect(VERSICHERUNGEN).toEqual(VORTEILE.filter((v) => v.versicherung).map((v) => v.key));
    expect(VERSICHERUNGEN).toEqual(['reiseversicherung', 'annullierung', 'kaufschutz', 'mietwagen']);
  });
});
