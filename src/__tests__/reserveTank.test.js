import { describe, it, expect } from 'vitest';
import { reserveTankState } from '../data/reserveTank.js';

describe('reserveTankState: Notgroschen-Tankanzeige', () => {
  it('ohne Ausgaben → nicht berechenbar (Orientierung), kein Zeiger', () => {
    const st = reserveTankState({ savings: 5000, monthlyExpenses: 0 });
    expect(st.mode).toBe('noexpenses');
    expect(st.needle).toBe(null);
  });

  it('kein Notgroschen, aber Ausgaben → 0 Monate, level empty', () => {
    const st = reserveTankState({ savings: 0, monthlyExpenses: 3000 });
    expect(st.mode).toBe('months');
    expect(st.months).toBe(0);
    expect(st.level).toBe('empty');
    expect(st.needle).toBe(0);
  });

  it('1 Monat Puffer → level low (unter Empfehlung 3)', () => {
    const st = reserveTankState({ savings: 3000, monthlyExpenses: 3000 });
    expect(st.months).toBe(1);
    expect(st.level).toBe('low');
  });

  it('genau 3 Monate → level ok (Empfehlung erreicht)', () => {
    expect(reserveTankState({ savings: 9000, monthlyExpenses: 3000 }).level).toBe('ok');
  });

  it('6 Monate (doppelte Empfehlung) → level strong', () => {
    const st = reserveTankState({ savings: 18000, monthlyExpenses: 3000 });
    expect(st.level).toBe('strong');
    expect(st.needle).toBe(6);
  });

  it('Überfüllung: 10 Monate → Zeiger auf voll (fullMonths) begrenzt, Text bleibt ehrlich', () => {
    const st = reserveTankState({ savings: 30000, monthlyExpenses: 3000 });
    expect(st.months).toBe(10);
    expect(st.needle).toBe(6);
  });

  it('rundet Monate auf 1 Nachkommastelle', () => {
    const st = reserveTankState({ savings: 2500, monthlyExpenses: 3000 });
    expect(st.months).toBe(0.8);
    expect(st.level).toBe('low');
  });

  it('negative/ungültige Werte werden als 0 behandelt', () => {
    expect(reserveTankState({ savings: -100, monthlyExpenses: 3000 }).months).toBe(0);
    expect(reserveTankState({ savings: 'x', monthlyExpenses: 3000 }).level).toBe('empty');
  });
});
