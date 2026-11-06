// Zitierregel, Stufe 1 (Fassung 9, Stebler Studios 05.11.2026, Skizze C + D, «Ja, Stufe 1»).
// Geprüft wird die FORM jeder deutschen Quellenzeile (Schlüssel auf «quelle»/«source»), nicht ob
// ein Artikel inhaltlich trägt — das bleibt Sache der Fachprüfung (swiss-precision-/rechts-pruefer).
//
// Regel (docs/design/fassung-9-2026-11-05/BESTANDSAUFNAHME.md, F9-C):
//   1. «Quelle(n): [[…|https://…]], [[…|https://…]] (geprüft im <Monat> <JJJJ>).»
//   2. jeder Beleg ist ein Link mit voller Adresse zum Dokument, nie eine nackte Domain
//   3. ein Gesetzeslink mit «Art.» springt zum Artikel (#art_)
// Zeilen, die das heute nicht erfüllen, stehen in zitierform-altbestand.json. Die Liste darf
// nur schrumpfen: wer eine Zeile repariert, nimmt sie dort heraus (der Test verlangt es).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import { zerlegeBelege } from '../components/Belege.jsx';

const ALTBESTAND = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'zitierform-altbestand.json'), 'utf8'));

const quellenZeilen = () => {
  const out = [];
  const lauf = (o, pfad) => {
    for (const [k, v] of Object.entries(o)) {
      const p = pfad ? pfad + '.' + k : k;
      if (typeof v === 'string') { if (/(quelle|source)$/i.test(k)) out.push([p, v]); }
      else if (v && typeof v === 'object') {
        if (typeof v.sie === 'string' && /(quelle|source)$/i.test(k)) out.push([p, v.sie]);
        else lauf(v, p);
      }
    }
  };
  lauf(de, '');
  return out;
};

// Gibt die verletzten Regeln einer Zeile zurück (leer = in Ordnung).
export const verstoesse = (zeile) => {
  const b = zerlegeBelege(zeile.replace(/\{[a-zA-Z]+\}/g, '2026'));
  if (!b) return ['form'];
  const v = [];
  if (!/^geprüft im [A-ZÄÖÜ][a-zäöü]+ \d{4}$/.test(b.datum)) v.push('datum');
  for (const l of b.links) {
    const nachDomain = l.href.replace(/^https?:\/\/[^/]+/, '');
    if (nachDomain === '' || nachDomain === '/') v.push('domain');
    if (/fedlex\.admin\.ch/.test(l.href) && /\bArt\./.test(l.label) && !/#art_/.test(l.href)) v.push('artikel');
  }
  return [...new Set(v)];
};

describe('Zitierform', () => {
  const zeilen = quellenZeilen();

  it('findet die Quellenzeilen', () => {
    expect(zeilen.length).toBeGreaterThan(40);
  });

  it('jede Zeile hält die Regel — oder steht im Altbestand', () => {
    const neu = zeilen.filter(([k, v]) => verstoesse(v).length && !ALTBESTAND[k]).map(([k, v]) => k + ' ' + verstoesse(v).join('+'));
    expect(neu).toEqual([]);
  });

  it('der Altbestand schrumpft nur (reparierte Zeilen dort herausnehmen)', () => {
    const map = Object.fromEntries(zeilen);
    const repariert = Object.keys(ALTBESTAND).filter((k) => map[k] !== undefined && verstoesse(map[k]).length === 0);
    const verschwunden = Object.keys(ALTBESTAND).filter((k) => map[k] === undefined);
    expect(repariert).toEqual([]);
    expect(verschwunden).toEqual([]);
  });

  it('Musterzeile der Regel wird erkannt', () => {
    expect(verstoesse('Quellen: [[ZGB Art. 97|https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_97]], [[DBG Art. 9|https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/de#art_9]] (geprüft im September 2026).')).toEqual([]);
    expect(verstoesse('Quelle: [[BAG|priminfo.admin.ch]] (geprüft im September 2026).')).toEqual(['domain']);
    expect(verstoesse('Quelle: [[KVG Art. 65|https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de]] (geprüft im Mai 2026).')).toEqual(['artikel']);
    expect(verstoesse('Quelle: [[KVG Art. 65|https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de#art_65]] (Stand 2026).')).toEqual(['datum']);
  });
});
