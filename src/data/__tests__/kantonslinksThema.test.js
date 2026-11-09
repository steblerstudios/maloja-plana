// Wächter: Der kantonale Link «Sozialdienst» führt zur Sozialhilfe, nicht zur
// Prämienverbilligung. Anlass 09.11.2026: Bei BE, GE, VD und ZG zeigte
// `sozialdienst` auf eine IPV-Seite, bei BE und ZG sogar auf dieselbe Adresse
// wie `ipv`. Wer in der App «Sozialdienst» antippte, landete bei der IPV.
//
// Dazu: Jeder `ipv`- und `sozialdienst`-Link trägt ein Prüfdatum
// (CANTONAL_LINKS_GEPRUEFT), damit sichtbar bleibt, wie alt die Prüfung ist.
import { describe, it, expect } from 'vitest';
import { CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT } from '../direktLinks.js';

const KANTONE = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL',
  'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];

// Wörter, die eine Adresse als IPV-Seite ausweisen, in den vier Amtssprachen.
const IPV_MERKMAL = /praemienverbilligung|prämienverbilligung|pr%c3%a4mienverbilligung|subside|reduction-des-primes|riduzione|ripam|\/pv\.html|-ipv|\/ipv/i;

describe('Kantonale Links: Sozialdienst ist Sozialhilfe, nicht IPV', () => {
  it('alle 26 Kantone sind erfasst', () => {
    expect(Object.keys(CANTONAL_LINKS).sort()).toEqual([...KANTONE].sort());
  });

  for (const k of KANTONE) {
    it(`${k}: sozialdienst ist nicht dieselbe Adresse wie ipv`, () => {
      expect(CANTONAL_LINKS[k].sozialdienst).not.toBe(CANTONAL_LINKS[k].ipv);
    });

    it(`${k}: sozialdienst trägt kein IPV-Merkmal in der Adresse`, () => {
      expect(CANTONAL_LINKS[k].sozialdienst).not.toMatch(IPV_MERKMAL);
    });
  }
});

// Benannte Ausnahme, keine weichere Regel: Diese Kantone sind mit curl nicht messbar
// (VS: jeder Pfad 404, auch die Startseite · BL: Cloudflare-Schranke). Ihr Prüfdatum ist
// `null`, bis jemand sie im Browser geprüft hat. Die Liste darf nur schrumpfen.
const NICHT_GEPRUEFT = ['BL', 'VS'];

describe('Kantonale Links: Prüfdatum je Link', () => {
  for (const k of KANTONE) {
    it(`${k}: ipv und sozialdienst haben ein Prüfdatum`, () => {
      const g = CANTONAL_LINKS_GEPRUEFT[k];
      expect(g, `${k} fehlt in CANTONAL_LINKS_GEPRUEFT`).toBeDefined();
      for (const feld of ['ipv', 'sozialdienst']) {
        if (NICHT_GEPRUEFT.includes(k)) expect(g[feld], `${k}.${feld}`).toBeNull();
        else expect(g[feld], `${k}.${feld}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  }

  it('genau die benannten Ausnahmen sind ohne Prüfdatum', () => {
    const ohne = KANTONE.filter((k) => Object.values(CANTONAL_LINKS_GEPRUEFT[k] || {}).some((v) => v === null));
    expect(ohne.sort()).toEqual([...NICHT_GEPRUEFT].sort());
  });

  it('das Prüfdatum liegt nicht in CANTONAL_LINKS selbst (die App zeigt jedes Feld dort als Link an)', () => {
    for (const k of KANTONE) {
      for (const v of Object.values(CANTONAL_LINKS[k])) expect(v).toMatch(/^https:\/\//);
    }
  });
});
