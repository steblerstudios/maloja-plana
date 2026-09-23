// Vergleichslogik und Exit-Codes der ESTV-Stichprobe — ohne Netz. Die Schnittstelle wird durch
// eine Attrappe ersetzt, die aus einer synthetischen Messdatei antwortet.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import {
  auftraege, gespeicherteWerte, vergleichePunkt, exitCode, stichprobe, textBericht, kantonsBericht,
  STICHPROBE_BRUTTO, EXIT,
} from '../estv-stichprobe.mjs';
import { ORTE, MESS_PATH, BRUTTO } from '../estv-schnittstelle.mjs';

const SPALTEN = ['kanton', 'zivilstand', 'brutto', 'steuerbarBund', 'bundessteuerEstv', 'kantonssteuer', 'gemeindesteuer', 'personalsteuer', 'kirchensteuer', 'totalSteuer', 'kantonUndGemeinde'];
const REL = { 1: 'ledig', 2: 'verheiratet' };
const KT_NACH_ID = Object.fromEntries(Object.entries(ORTE).map(([kt, o]) => [o.id, kt]));

// Synthetische Messdatei: ein Punkt je Stichproben-Auftrag, Werte aus Kanton/Zivilstand/Lohn abgeleitet.
function synthetischeMessung() {
  const punkte = auftraege().map((a, i) => [a.kt, a.zs, a.brutto, a.brutto - 10000, 0, 0, 0, 0, 0, 0, 1000 + i * 7]);
  return { abgerufen: '2026-09-16T00:00:00Z', spalten: SPALTEN, punkte };
}

// Attrappe der Schnittstelle: antwortet wie die ESTV, aus den Werten einer Messdatei.
function attrappe(mess, { aendern = () => ({}), erfundeneBeantworten = false } = {}) {
  const werte = gespeicherteWerte(mess);
  const aufrufe = [];
  const post = async (op, body) => {
    aufrufe.push(op);
    if (op.startsWith('API_gibtEsNicht_')) {
      if (erfundeneBeantworten) return { irgendwas: true };
      throw new Error(op + ' HTTP 404');
    }
    if (op === 'API_getTaxVersion') return 'api 1.7.2 (22.09.2021)';
    const kt = KT_NACH_ID[body.TaxLocationID];
    const zs = REL[body.Relationship];
    const w = werte.get(kt + '/' + zs + '/' + body.Revenue1);
    const d = aendern(kt, zs, body.Revenue1);
    return {
      Location: { Canton: kt, BfsID: ORTE[kt].bfs },
      TaxableIncomeFed: w.steuerbarBund + (d.bund || 0),
      IncomeTaxCanton: w.kug + (d.kug || 0), IncomeTaxCity: 0, PersonalTax: 0,
    };
  };
  return { post, aufrufe };
}

const schnell = { pauseMs: 0, wartezeiten: [] };

describe('ESTV-Stichprobe — Umfang', () => {
  it('fragt 26 Kantone × 2 Zivilstände × 3 Löhne = 156 Punkte', () => {
    const liste = auftraege();
    expect(liste).toHaveLength(156);
    expect(new Set(liste.map((a) => a.kt)).size).toBe(26);
    expect(new Set(liste.map((a) => a.zs))).toEqual(new Set(['ledig', 'verheiratet']));
  });

  it('die drei Löhne liegen im Messraster (sonst gäbe es keinen gespeicherten Punkt)', () => {
    for (const b of STICHPROBE_BRUTTO) expect(BRUTTO).toContain(b);
  });

  it('die echte Messdatei enthält alle 156 Punkte der Stichprobe', () => {
    const werte = gespeicherteWerte(JSON.parse(readFileSync(MESS_PATH, 'utf-8')));
    const fehlend = auftraege().filter((a) => !werte.has(a.kt + '/' + a.zs + '/' + a.brutto));
    expect(fehlend).toEqual([]);
  });
});

describe('ESTV-Stichprobe — Vergleich je Punkt', () => {
  const alt = { steuerbarBund: 40000, kug: 3000 };
  it('gleich und Rundung (CHF 1) gelten nicht als Abweichung', () => {
    expect(vergleichePunkt(alt, { steuerbarBund: 40000, kug: 3000 }).abweichend).toBe(false);
    expect(vergleichePunkt(alt, { steuerbarBund: 40001, kug: 2999 }).abweichend).toBe(false);
  });
  it('K+G über der Schwelle ist abweichend, mit Betrag und Prozent', () => {
    const v = vergleichePunkt(alt, { steuerbarBund: 40000, kug: 2750 });
    expect(v.abweichend).toBe(true);
    expect(v.dKug).toBe(-250);
    expect(v.pctKug).toBeCloseTo(-0.0833, 3);
  });
  it('steuerbares Einkommen Bund über der Schwelle ist abweichend, auch wenn K+G gleich bleibt', () => {
    expect(vergleichePunkt(alt, { steuerbarBund: 39500, kug: 3000 }).abweichend).toBe(true);
  });
  it('alt 0 → kein Prozentwert, aber Abweichung', () => {
    const v = vergleichePunkt({ steuerbarBund: 0, kug: 0 }, { steuerbarBund: 0, kug: 24 });
    expect(v.abweichend).toBe(true);
    expect(v.pctKug).toBeNull();
  });
  it('die Schwelle ist einstellbar', () => {
    expect(vergleichePunkt(alt, { steuerbarBund: 40000, kug: 3040 }, 50).abweichend).toBe(false);
    expect(vergleichePunkt(alt, { steuerbarBund: 40000, kug: 3051 }, 50).abweichend).toBe(true);
  });
});

describe('ESTV-Stichprobe — Exit-Code', () => {
  it('0 nur bei allen Abrufen ohne Abweichung', () => {
    expect(exitCode({ erwartet: 156, erfolgreich: 156, fehler: [], abweichungen: 0 })).toBe(EXIT.GLEICH);
  });
  it('1 bei Abweichung', () => {
    expect(exitCode({ erwartet: 156, erfolgreich: 156, fehler: [], abweichungen: 3 })).toBe(EXIT.ABWEICHUNG);
  });
  it('2 bei «0 Abweichungen aus 0 Abrufen» — nie 0', () => {
    expect(exitCode({ erwartet: 156, erfolgreich: 0, fehler: [], abweichungen: 0 })).toBe(EXIT.GESCHEITERT);
    expect(exitCode({ erwartet: 0, erfolgreich: 0, fehler: [], abweichungen: 0 })).toBe(EXIT.GESCHEITERT);
  });
  it('2 bei unvollständiger Messung, auch wenn Abweichungen gefunden wurden', () => {
    expect(exitCode({ erwartet: 156, erfolgreich: 155, fehler: ['x'], abweichungen: 0 })).toBe(EXIT.GESCHEITERT);
    expect(exitCode({ erwartet: 156, erfolgreich: 120, fehler: ['x'], abweichungen: 4 })).toBe(EXIT.GESCHEITERT);
  });
});

describe('ESTV-Stichprobe — ganzer Lauf mit Attrappe', () => {
  it('unveränderte Schnittstelle → 156 erfolgreich, Exit 0, alle Kantone «gleich»', async () => {
    const mess = synthetischeMessung();
    const { post, aufrufe } = attrappe(mess);
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r).toMatchObject({ erwartet: 156, erfolgreich: 156, abweichungen: 0, exit: EXIT.GLEICH });
    expect(aufrufe.filter((op) => op === 'API_calculateDetailedTaxes')).toHaveLength(156);
    expect(kantonsBericht(r.ergebnisse, 6).every((k) => k.status === 'gleich')).toBe(true);
    expect(textBericht(r)).toMatch(/Abrufe erfolgreich: 156 von 156 · Abweichungen: 0 Punkte in 0 Kantonen/);
  });

  it('TI rechnet anders (wie am 23.09.) → Exit 1, nur TI abweichend, mit Empfehlung', async () => {
    const mess = synthetischeMessung();
    const { post } = attrappe(mess, { aendern: (kt) => (kt === 'TI' ? { kug: -250 } : {}) });
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r).toMatchObject({ erfolgreich: 156, abweichungen: 6, exit: EXIT.ABWEICHUNG });
    const kantone = kantonsBericht(r.ergebnisse, 6);
    expect(kantone.filter((k) => k.status === 'abweichend').map((k) => k.kt)).toEqual(['TI']);
    const text = textBericht(r);
    expect(text).toMatch(/TI Bellinzona\s+abweichend/);
    expect(text).toMatch(/−250 CHF/);
    expect(text).toMatch(/node scripts\/steuerband-messen\.mjs --messen --kanton TI/);
    expect(text).toMatch(/Exit 1/);
  });

  it('Netz weg → 0 erfolgreiche Abrufe, Exit 2 (nicht «alles gleich»)', async () => {
    const mess = synthetischeMessung();
    const post = async () => { throw new TypeError('fetch failed'); };
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r).toMatchObject({ erfolgreich: 0, abweichungen: 0, exit: EXIT.GESCHEITERT });
    expect(r.fehler.join(' ')).toMatch(/nicht erreichbar/);
    expect(textBericht(r)).toMatch(/Abrufe erfolgreich: 0 von 156[\s\S]*MESSUNG GESCHEITERT/);
  });

  it('Abbruch mitten im Lauf → Exit 2 nach drei Fehlern in Folge, Zahl der Abrufe stimmt', async () => {
    const mess = synthetischeMessung();
    const echt = attrappe(mess).post;
    let n = 0;
    const post = async (op, body) => {
      if (op === 'API_calculateDetailedTaxes' && ++n > 40) throw new Error('HTTP 503');
      return echt(op, body);
    };
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r.erfolgreich).toBe(40);
    expect(r.exit).toBe(EXIT.GESCHEITERT);
    expect(r.fehler.at(-1)).toMatch(/Abbruch nach 3/);
  });

  it('Schnittstelle geändert (Antwort ohne Zahlen) → Exit 2', async () => {
    const mess = synthetischeMessung();
    const post = async (op) => {
      if (op.startsWith('API_gibtEsNicht_')) throw new Error('404');
      if (op === 'API_getTaxVersion') return 'api 2.0';
      return { Location: null, Irgendwas: 1 };
    };
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r).toMatchObject({ erfolgreich: 0, exit: EXIT.GESCHEITERT });
  });

  it('Gegenprobe beantwortet (Fehlerseite sieht aus wie Antwort) → Exit 2, kein Abruf', async () => {
    const mess = synthetischeMessung();
    const { post, aufrufe } = attrappe(mess, { erfundeneBeantworten: true });
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r.exit).toBe(EXIT.GESCHEITERT);
    expect(aufrufe).not.toContain('API_calculateDetailedTaxes');
  });

  it('Messdatei fehlt oder ohne Punkt der Stichprobe → Exit 2', async () => {
    const { post } = attrappe(synthetischeMessung());
    expect((await stichprobe({ mess: null, post, ...schnell })).exit).toBe(EXIT.GESCHEITERT);
    const luecke = synthetischeMessung();
    luecke.punkte = luecke.punkte.filter((p) => !(p[0] === 'ZG' && p[2] === 80000));
    const r = await stichprobe({ mess: luecke, post, ...schnell });
    expect(r.exit).toBe(EXIT.GESCHEITERT);
    expect(r.fehler[0]).toMatch(/2 Punkte der Stichprobe fehlen/);
  });

  it('falscher Ort in der Antwort → Punkt gilt als gescheitert, nicht als gleich', async () => {
    const mess = synthetischeMessung();
    const echt = attrappe(mess).post;
    const post = async (op, body) => {
      const r = await echt(op, body);
      if (op === 'API_calculateDetailedTaxes' && r.Location.Canton === 'BS') r.Location = { Canton: 'BL', BfsID: 2829 };
      return r;
    };
    const r = await stichprobe({ mess, post, ...schnell });
    expect(r.erfolgreich).toBeLessThan(156);
    expect(r.exit).toBe(EXIT.GESCHEITERT);
    expect(r.fehler.join(' ')).toMatch(/Ort passt nicht: BS/);
  });
});
