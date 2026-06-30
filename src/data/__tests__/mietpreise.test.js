import { describe, it, expect } from 'vitest';
import {
  RENT_NATIONAL, RENT_BY_CANTON, MIETPREIS_DATA_YEAR,
  roomKeyFromRooms, roomKeyFromHousehold, getRentComparison,
} from '../mietpreise.js';

describe('mietpreise', () => {
  it('covers all 26 cantons with a Total value', () => {
    expect(Object.keys(RENT_BY_CANTON)).toHaveLength(26);
    for (const c of Object.values(RENT_BY_CANTON)) {
      expect(c.total).toBeGreaterThan(0);
    }
    expect(RENT_NATIONAL.total).toBe(1373);
  });

  describe('roomKeyFromRooms', () => {
    it('maps explicit room counts to columns', () => {
      expect(roomKeyFromRooms(1)).toBe('r1');
      expect(roomKeyFromRooms(3)).toBe('r3');
      expect(roomKeyFromRooms(4)).toBe('r4');
      expect(roomKeyFromRooms(7)).toBe('r6'); // capped
      expect(roomKeyFromRooms(0)).toBeNull();
      expect(roomKeyFromRooms(undefined)).toBeNull();
    });
  });

  describe('roomKeyFromHousehold', () => {
    it('derives a typical room column from household size', () => {
      expect(roomKeyFromHousehold(1)).toBe('r3');
      expect(roomKeyFromHousehold(2)).toBe('r4');
      expect(roomKeyFromHousehold(5)).toBe('r6');
      expect(roomKeyFromHousehold(0)).toBe('total');
    });
  });

  describe('getRentComparison', () => {
    it('size-matched: Basel is above the Swiss average for a 4-room flat', () => {
      // household 4 → r5; but use explicit rooms for a stable assertion
      const c = getRentComparison('BS', { rooms: 4 });
      expect(c).not.toBeNull();
      expect(c.roomKey).toBe('r4');
      expect(c.regional).toBe(1717);
      expect(c.national).toBe(1578);
      expect(c.diffPct).toBeGreaterThan(0); // honest: size-matched BS is dearer
      expect(c.year).toBe(MIETPREIS_DATA_YEAR);
    });

    it('explicit rooms wins over household size', () => {
      const c = getRentComparison('ZH', { rooms: 2, householdSize: 5 });
      expect(c.roomKey).toBe('r2');
      expect(c.regional).toBe(RENT_BY_CANTON.ZH.r2);
    });

    it('falls back to household-size heuristic when rooms missing', () => {
      const c = getRentComparison('ZH', { householdSize: 1 }); // → r3
      expect(c.roomKey).toBe('r3');
    });

    it('falls back to Total when the room column is not published (AI 1-room)', () => {
      const c = getRentComparison('AI', { rooms: 1 });
      expect(c.roomKey).toBe('total');
      expect(c.regional).toBe(RENT_BY_CANTON.AI.total);
    });

    it('returns null for an unknown canton', () => {
      expect(getRentComparison('XX', { rooms: 3 })).toBeNull();
    });
  });
});
