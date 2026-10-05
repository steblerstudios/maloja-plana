import { describe, it, expect } from 'vitest';
import { offenePosten, istBelegUebernehmbar, belegAlsForderung, abgleichBelege } from '../utils/offenePosten.js';

// Schulden R2, Task 1 (05.10.2026): offene Arztbelege und Forderungen ohne Doppelzählung.
const HEUTE = '2026-10-05';

const basis = () => ({
  versicherungen: {
    kkBelege: [
      { id: 'b1', datum: '2026-09-20', betrag: 240, frist: '2026-10-20', status: 'offen' },
      { id: 'b2', datum: '2026-09-01', betrag: 400, frist: '2026-10-02', status: 'offen' },
      { id: 'b3', datum: '2026-08-01', betrag: 90, frist: '2026-08-30', status: 'bezahlt' },
    ],
  },
  schulden: [
    { id: 1, creditor: 'Steueramt', amount: 1840, status: 'open', stufe: 'rechnung' },
    { id: 2, creditor: 'Garage', amount: 680, status: 'paid', stufe: 'rechnung' },
  ],
});

describe('offenePosten', () => {
  it('fasst offene Belege und offene Forderungen zusammen', () => {
    const r = offenePosten(basis(), HEUTE);
    expect(r.arzt.length).toBe(2);
    expect(r.summeArzt).toBe(640);
    expect(r.summeForderungen).toBe(1840);
    expect(r.summe).toBe(2480);
    expect(r.naechsteFrist).toBe('2026-10-20');
    expect(r.arzt.find(b => b.id === 'b2').abgelaufen).toBe(true);
    expect(r.arzt.find(b => b.id === 'b1').abgelaufen).toBe(false);
    expect(r.forderungen.map(f => f.id)).toEqual([1]);
  });

  it('Beleg ohne Datum und ohne Frist zählt, nennt aber keine nächste Frist', () => {
    const data = { versicherungen: { kkBelege: [{ id: 'x', betrag: 50, status: 'offen' }] } };
    const r = offenePosten(data, HEUTE);
    expect(r.arzt.length).toBe(1);
    expect(r.arzt[0].abgelaufen).toBe(false);
    expect(r.naechsteFrist).toBe(null);
  });

  it('Frist genau heute ist nicht abgelaufen und zählt als nächste Frist', () => {
    const data = { versicherungen: { kkBelege: [{ id: 'x', betrag: 50, frist: HEUTE, status: 'offen' }] } };
    const r = offenePosten(data, HEUTE);
    expect(r.arzt[0].abgelaufen).toBe(false);
    expect(r.naechsteFrist).toBe(HEUTE);
  });

  it('summiert Rappen genau', () => {
    const data = { versicherungen: { kkBelege: [
      { id: 'a', betrag: 100.05, status: 'offen' },
      { id: 'b', betrag: 200.10, status: 'offen' },
    ] } };
    expect(offenePosten(data, HEUTE).summeArzt).toBe(300.15);
  });

  it('leere oder fehlende Ablagen ergeben alles leer', () => {
    for (const d of [{}, undefined, { versicherungen: {}, schulden: null }]) {
      const r = offenePosten(d, HEUTE);
      expect(r.arzt).toEqual([]);
      expect(r.forderungen).toEqual([]);
      expect(r.summeArzt).toBe(0);
      expect(r.summeForderungen).toBe(0);
      expect(r.summe).toBe(0);
      expect(r.naechsteFrist).toBe(null);
    }
  });

  it('Forderungen tragen belegDatum (aus der Forderung, sonst leer)', () => {
    const data = { schulden: [
      { id: 1, amount: 10, status: 'open', belegDatum: '2026-09-01' },
      { id: 2, amount: 20, status: 'open' },
    ] };
    const r = offenePosten(data, HEUTE);
    expect(r.forderungen[0].belegDatum).toBe('2026-09-01');
    expect(r.forderungen[1].belegDatum).toBe('');
  });
});

describe('istBelegUebernehmbar', () => {
  it('abgelaufene und fristlose offene Belege ja, künftige und übernommene nein', () => {
    expect(istBelegUebernehmbar({ status: 'offen', frist: '2026-10-02' }, HEUTE)).toBe(true);
    expect(istBelegUebernehmbar({ status: 'offen' }, HEUTE)).toBe(true);
    expect(istBelegUebernehmbar({ status: 'offen', frist: '2026-10-20' }, HEUTE)).toBe(false);
    expect(istBelegUebernehmbar({ status: 'offen', frist: HEUTE }, HEUTE)).toBe(false);
    expect(istBelegUebernehmbar({ status: 'offen', forderungId: '5' }, HEUTE)).toBe(false);
    expect(istBelegUebernehmbar({ status: 'bezahlt', frist: '2026-01-01' }, HEUTE)).toBe(false);
  });
});

describe('belegAlsForderung', () => {
  it('legt eine Forderung an, markiert den Beleg, keine Doppelzählung', () => {
    const data = basis();
    const vorher = offenePosten(data, HEUTE);
    const r = belegAlsForderung(data, 'b2', HEUTE, 7);
    const neu = r.schulden.find(s => s.id === 7);
    expect(neu).toEqual({
      id: 7, creditor: '', amount: 400, dueDate: '2026-10-02', interestRate: 0,
      category: 'gesundheit', status: 'open', stufe: 'rechnung',
      ausBeleg: 'b2', belegDatum: '2026-09-01', createdAt: HEUTE,
    });
    expect(r.versicherungen.kkBelege.find(b => b.id === 'b2').forderungId).toBe('7');
    const nachher = offenePosten({ ...data, ...r }, HEUTE);
    expect(nachher.arzt.length).toBe(1);
    expect(nachher.summe).toBe(vorher.summe);
    expect(nachher.forderungen.find(f => f.id === 7).ausBeleg).toBe('b2');
    expect(nachher.forderungen.find(f => f.id === 7).belegDatum).toBe('2026-09-01');
  });

  it('Beleg ohne Frist und ohne Datum ist übernehmbar, Felder leer', () => {
    const data = { versicherungen: { kkBelege: [{ id: 'x', betrag: 55, status: 'offen' }] }, schulden: [] };
    const r = belegAlsForderung(data, 'x', HEUTE, 3);
    expect(r.schulden[0].dueDate).toBe('');
    expect(r.schulden[0].belegDatum).toBe('');
  });

  it('zweiter Aufruf legt keine zweite Forderung an', () => {
    const data = basis();
    const r1 = belegAlsForderung(data, 'b2', HEUTE, 7);
    const data2 = { ...data, ...r1 };
    const r2 = belegAlsForderung(data2, 'b2', HEUTE, 8);
    expect(r2.schulden.length).toBe(r1.schulden.length);
    expect(r2.schulden).toBe(data2.schulden);
    expect(r2.versicherungen).toBe(data2.versicherungen);
  });

  it('Beleg mit Frist in der Zukunft bleibt unverändert', () => {
    const data = basis();
    const r = belegAlsForderung(data, 'b1', HEUTE, 9);
    expect(r.schulden).toBe(data.schulden);
    expect(r.versicherungen).toBe(data.versicherungen);
  });

  it('unbekannte Beleg-ID bleibt unverändert', () => {
    const data = basis();
    const r = belegAlsForderung(data, 'nope', HEUTE, 9);
    expect(r.schulden).toBe(data.schulden);
    expect(r.versicherungen).toBe(data.versicherungen);
  });
});

describe('abgleichBelege', () => {
  const mitVerweis = (forderungen) => ({
    versicherungen: { kkBelege: [
      { id: 'b2', betrag: 400, frist: '2026-10-02', status: 'offen', forderungId: '7' },
    ] },
    schulden: forderungen,
  });

  it('Forderung bezahlt: Beleg wird bezahlt', () => {
    const d = mitVerweis([{ id: 7, amount: 400, status: 'paid' }]);
    const r = abgleichBelege(d);
    expect(r.versicherungen.kkBelege[0].status).toBe('bezahlt');
    expect(r.versicherungen.kkBelege[0].forderungId).toBe('7');
  });

  it('Forderung gelöscht: forderungId weg, Beleg offen und zählt wieder', () => {
    const d = mitVerweis([]);
    const r = abgleichBelege(d);
    expect('forderungId' in r.versicherungen.kkBelege[0]).toBe(false);
    expect(r.versicherungen.kkBelege[0].status).toBe('offen');
    expect(offenePosten(r, HEUTE).arzt.length).toBe(1);
  });

  it('nichts zu tun: dasselbe Objekt', () => {
    const d = mitVerweis([{ id: 7, amount: 400, status: 'open' }]);
    expect(abgleichBelege(d)).toBe(d);
    const d2 = basis();
    expect(abgleichBelege(d2)).toBe(d2);
    const d3 = {};
    expect(abgleichBelege(d3)).toBe(d3);
  });
});
