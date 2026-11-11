// Mietzinsbeiträge als Szene (Stebler Studios 11.11.2026: «Ja, so bauen»): im Drittel-Haus der mögliche Beitrag
// gestrichelt in der Behörden-Farbe (bis zu), daneben das Glas (Pegel, Lesart IPV: Einkommen gegen Grenze), ein
// Schild «möglich», darunter die Kachelkarte der 26 Kantone. Eine Rechnung: mietzinsEinschaetzung (Werkzeug und Kapitel).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mietzinsEinschaetzung, beitragHoechstMonat, KACHELKARTE_LAGE } from '../data/mietzinsbeitraege.js';
import { mietzinsPegelState, PEGEL_SCALE } from '../data/pegel.js';
import { MietzinsSzene, DrittelHaus } from '../components/WohnkostenInstrument.jsx';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';

const t = createT({ de }, 'de', 'sie');
const profil = (canton, lohn = 3000, wohnen = {}) => ({
  basis: { canton, maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: String(lohn), incomeType: 'netto' },
  wohnen: { rentAmount: '1500', utilities: '200', rooms: '3', ...wohnen },
});
const szene = (d, p = {}) => renderToStaticMarkup(React.createElement(MietzinsSzene, { palette: LIGHT_PALETTE, t, data: d, isDarkMode: false, ...p }));
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('eine Rechnung', () => {
  it('Kapitel und Werkzeug rufen mietzinsEinschaetzung', () => {
    expect(quelle('../MietzinsOrientierung.jsx')).toMatch(/= mietzinsEinschaetzung\(data, canton\);/);
    expect(quelle('../components/WohnkostenInstrument.jsx')).toMatch(/mietzinsEinschaetzung\(data, /);
  });
  it('die Szene steht im Kapitel Wohnen (Beitrag im grossen Haus) und im Werkzeug «Mietzins» (mittel, mit Haus)', () => {
    const w = quelle('../components/WohnkostenInstrument.jsx');
    expect(w).toMatch(/beitrag: imHaus, fuell \}/);
    expect(w).toMatch(/React\.createElement\(MietzinsSzene, \{ palette, t, data: allData, isDarkMode \}\)/);
    expect(quelle('../MietzinsOrientierung.jsx')).toMatch(/React\.createElement\(MietzinsSzene, \{ palette, t, data, isDarkMode, kanton: canton, groesse: 'mittel', mitHaus: true, ohneSatz: true \}\)/);
  });
  it('die Einschätzung: unter der Grenze «likely», darüber «incomeHigh», ohne Programm keine', () => {
    expect(mietzinsEinschaetzung(profil('ZG', 3000, { wfgWohnung: 'ja' }), 'ZG').assessment.key).toBe('likely');
    expect(mietzinsEinschaetzung(profil('ZG', 9000, { wfgWohnung: 'ja' }), 'ZG').assessment.key).toBe('incomeHigh');
    expect(mietzinsEinschaetzung(profil('ZH'), 'ZH').assessment).toBeNull();
  });
});

describe('Glas: dieselbe Form wie die IPV (Pegel, Lesart «Luft»)', () => {
  it('Wasser = Einkommen, Linie = Grenze; vier Zustände', () => {
    expect(mietzinsPegelState({ annualIncome: 30000, incomeLimit: 60000 })).toMatchObject({ show: true, variant: 'luft', mode: 'clear', fraction: 0.5 });
    expect(mietzinsPegelState({ annualIncome: 55000, incomeLimit: 60000 }).mode).toBe('edge');
    expect(mietzinsPegelState({ annualIncome: 90000, incomeLimit: 60000 })).toMatchObject({ mode: 'over', fraction: PEGEL_SCALE });
    expect(mietzinsPegelState({ annualIncome: 0, incomeLimit: 60000 }).mode).toBe('empty');
    expect(mietzinsPegelState({ annualIncome: 30000, incomeLimit: null })).toBeNull();
  });
});

describe('Szene je Zustand', () => {
  it('Programm, unter der Grenze (ZG): Glas und Schild', () => {
    const h = szene(profil('ZG', 3000, { wfgWohnung: 'ja' }));
    expect(h).toContain('data-teil="mietzins-glas"');
    expect(h).toContain('data-teil="mietzins-schild"');
    expect(h).toContain('data-teil="kachelkarte"');
  });
  it('Programm, über der Grenze: Glas ohne Schild', () => {
    const h = szene(profil('ZG', 9000, { wfgWohnung: 'ja' }));
    expect(h).toContain('data-teil="mietzins-glas"');
    expect(h).not.toContain('data-teil="mietzins-schild"');
  });
  it('Kanton unklar: kein Glas, kein Schild, der Satz «bitte prüfen», die Karte bleibt', () => {
    const h = szene(profil('ZH'));
    expect(h).not.toContain('data-teil="mietzins-glas"');
    expect(h).not.toContain('data-teil="mietzins-schild"');
    expect(h).toContain(t('mietzins.check').slice(0, 30));
    expect(h).toContain('data-teil="kachelkarte"');
  });
  it('ohne Kanton: nichts', () => {
    expect(szene(profil(''))).toBe('');
  });
});

describe('Kachelkarte', () => {
  it('26 Kantone, je einmal', () => {
    const k = Object.keys(KACHELKARTE_LAGE);
    expect(k).toHaveLength(26);
    expect(new Set(Object.values(KACHELKARTE_LAGE).map(([r, c]) => r + ':' + c)).size).toBe(26);
  });
  it('gefüllt = Programm bekannt (4), Ihr Kanton mit dickem Rand, Vorlesetext nennt beides', () => {
    const h = szene(profil('ZH'));
    expect((h.match(/data-kanton="[A-Z]{2}" data-programm="ja"/g) || []).length).toBe(4);
    expect(h).toMatch(/data-kanton="ZH" data-programm="nein" data-ihr="ja"/);
    expect(h).toMatch(/aria-label="[^"]*BS[^"]*ZH/);
  });
});

describe('Haus: der Beitrag gestrichelt in der Behörden-Farbe, als «bis zu»', () => {
  const zwetschge = bereichFillColor('behoerden', false);
  it('Höchstbetrag je Monat: BS nach Merkblatt Ziff. 7/11/13 als Obergrenze, sonst keiner', () => {
    const bs = (zimmer) => beitragHoechstMonat(mietzinsEinschaetzung(profil('BS', 3000, { rooms: zimmer }), 'BS'), zimmer);
    expect(bs('3')).toBe(1060);       // 0.85 · (1660 − 600) · 51'750/36'000 = 1295 → Deckel 1'060
    expect(bs('2')).toBe(929);        // 0.85 · (1260 − 500) · 1.4375 — Einzelperson erreicht 1'060 nie
    expect(bs('1')).toBe(684);
    expect(bs('')).toBeNull();        // ohne Zimmerzahl keine Zahl
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('BS', 9000), 'BS'), '3')).toBeNull(); // über der Grenze
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('ZG', 3000, { wfgWohnung: 'ja' }), 'ZG'), '3')).toBeNull();
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('GE'), 'GE'), '3')).toBeNull(); // Jahreswert, keine Grenze
    expect(beitragHoechstMonat(mietzinsEinschaetzung(profil('ZH'), 'ZH'), '3')).toBeNull();
  });
  it('oben in der Füllung, Höhe = min(Beitrag, Wohnkosten) ÷ Einkommen', () => {
    const h = renderToStaticMarkup(React.createElement(DrittelHaus, { palette: LIGHT_PALETTE, anteil: 40, ueberDrittel: true, fuell: '#7a5', groesse: 'gross', beitrag: { anteil: 20, farbe: zwetschge } }));
    const b = h.match(/<rect[^>]*data-teil="drittel-haus-beitrag"[^>]*>/)[0];
    expect(b).toContain('stroke="' + zwetschge + '"');
    expect(b).toMatch(/stroke-dasharray="4 3"/);
    expect(b).toMatch(/y="([\d.]+)"/);
    expect(Number(b.match(/ y="([\d.]+)"/)[1])).toBeCloseTo(44 + 72 * 0.6, 6);   // Oberkante der Füllung (40 %)
    expect(Number(b.match(/height="([\d.]+)"/)[1])).toBeCloseTo(72 * 0.2, 6);     // 20 % des Einkommens
  });
  it('klein ohne Beitrag', () => {
    const h = renderToStaticMarkup(React.createElement(DrittelHaus, { palette: LIGHT_PALETTE, anteil: 40, ueberDrittel: true, fuell: '#7a5', groesse: 'klein', beitrag: { anteil: 20, farbe: zwetschge } }));
    expect(h).not.toContain('drittel-haus-beitrag');
  });
  it('Kapitel BS, unter der Grenze: das Haus zeigt den Beitrag, die Legende sagt «bis zu»', () => {
    const d = profil('BS');
    const h = szene(d, { mitHaus: true, groesse: 'mittel' });
    expect(h).toContain('data-teil="drittel-haus-beitrag"');
    expect(h).toContain(t('mietzinsSzene.beitragLegende', { betrag: '1’060' }).slice(0, 20));
  });
});
