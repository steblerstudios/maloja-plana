import { describe, it, expect } from 'vitest';
import { readIpvStatus, nextIpvStatus, isIpvConfirmed, IPV_STATUS } from '../ipvStatus.js';

describe('readIpvStatus — Default & Robustheit', () => {
  it('fehlendes Feld ⇒ geschaetzt (Phase-1-Verhalten, keine Migration)', () => {
    expect(readIpvStatus(undefined)).toEqual({ status: 'geschaetzt', betrag: 0, datum: null });
    expect(readIpvStatus({})).toEqual({ status: 'geschaetzt', betrag: 0, datum: null });
    expect(readIpvStatus({ anspruch: {} })).toEqual({ status: 'geschaetzt', betrag: 0, datum: null });
  });

  it('unbekannter Status fällt auf geschaetzt zurück', () => {
    expect(readIpvStatus({ anspruch: { ipv: { status: 'quatsch' } } }).status).toBe('geschaetzt');
  });

  it('Betrag/Datum gelten nur bei bestaetigt — nie an einem unbestätigten Zustand', () => {
    const applied = readIpvStatus({ anspruch: { ipv: { status: 'beantragt', betrag: 200, datum: '2026-01-01' } } });
    expect(applied).toEqual({ status: 'beantragt', betrag: 0, datum: null });
  });

  it('bestaetigt trägt Betrag + Datum, Betrag nie negativ', () => {
    const c = readIpvStatus({ anspruch: { ipv: { status: 'bestaetigt', betrag: -50, datum: '2026-07-01' } } });
    expect(c).toEqual({ status: 'bestaetigt', betrag: 0, datum: '2026-07-01' });
  });
});

describe('nextIpvStatus — Übergänge', () => {
  it('nach geschaetzt/beantragt wird kein Betrag/Datum geschrieben (kein Stempel-Rest)', () => {
    expect(nextIpvStatus(IPV_STATUS.GESCHAETZT, { betrag: 999 })).toEqual({ status: 'geschaetzt' });
    expect(nextIpvStatus(IPV_STATUS.BEANTRAGT, { betrag: 999 })).toEqual({ status: 'beantragt' });
  });

  it('bestaetigt setzt Betrag; Datum default = heute (ISO)', () => {
    const r = nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: 228 });
    expect(r.status).toBe('bestaetigt');
    expect(r.betrag).toBe(228);
    expect(r.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('bestaetigt akzeptiert explizites Datum und deckelt Betrag bei 0', () => {
    expect(nextIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: -1, datum: '2026-07-13' }))
      .toEqual({ status: 'bestaetigt', betrag: 0, datum: '2026-07-13' });
  });

  it('unbekannter Zielstatus ⇒ geschaetzt', () => {
    expect(nextIpvStatus('bogus')).toEqual({ status: 'geschaetzt' });
  });
});

describe('isIpvConfirmed', () => {
  it('nur bei bestaetigt true', () => {
    expect(isIpvConfirmed({ anspruch: { ipv: { status: 'bestaetigt', betrag: 100, datum: '2026-07-13' } } })).toBe(true);
    expect(isIpvConfirmed({ anspruch: { ipv: { status: 'beantragt' } } })).toBe(false);
    expect(isIpvConfirmed({})).toBe(false);
  });
});
