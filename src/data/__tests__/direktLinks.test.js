import { describe, it, expect } from 'vitest';
import {
  DIREKTLINKS,
  KATEGORIEN,
  DIREKTLINKS_VERSION,
  getLinksByKategorie,
  getLinkById,
  getAllKategorien,
} from '../direktLinks.js';

describe('DIREKTLINKS', () => {
  it('exports version', () => {
    expect(DIREKTLINKS_VERSION).toBe('2025-06');
  });

  it('has at least 10 links', () => {
    expect(DIREKTLINKS.length).toBeGreaterThanOrEqual(10);
  });

  it('every link has required fields', () => {
    for (const link of DIREKTLINKS) {
      expect(link.id).toBeTruthy();
      expect(link.kategorie).toBeTruthy();
      expect(link.name.de).toBeTruthy();
      expect(link.name.en).toBeTruthy();
      expect(link.name.fr).toBeTruthy();
      expect(link.url).toMatch(/^https:\/\//);
      expect(link.antragsstelle.de).toBeTruthy();
    }
  });

  it('all kategorie values exist in KATEGORIEN', () => {
    for (const link of DIREKTLINKS) {
      expect(KATEGORIEN[link.kategorie]).toBeDefined();
    }
  });

  it('IDs are unique', () => {
    const ids = DIREKTLINKS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getLinksByKategorie', () => {
  it('returns links for gesundheit', () => {
    const links = getLinksByKategorie('gesundheit');
    expect(links.length).toBeGreaterThan(0);
    expect(links.every(l => l.kategorie === 'gesundheit')).toBe(true);
  });

  it('returns empty for unknown category', () => {
    expect(getLinksByKategorie('xyz')).toEqual([]);
  });
});

describe('getLinkById', () => {
  it('finds praemienverbilligung', () => {
    const link = getLinkById('praemienverbilligung');
    expect(link).toBeDefined();
    expect(link.name.de).toBe('Prämienverbilligung');
  });

  it('returns undefined for unknown id', () => {
    expect(getLinkById('nonexistent')).toBeUndefined();
  });
});

describe('getAllKategorien', () => {
  it('returns only used categories', () => {
    const kats = getAllKategorien();
    expect(kats.length).toBeGreaterThan(0);
    for (const kat of kats) {
      expect(getLinksByKategorie(kat.id).length).toBeGreaterThan(0);
    }
  });
});
