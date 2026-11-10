// Kapitel 2 · Wohnen (Durchgang 09.11.2026; Stebler Studios: «Ja, alles»).
//  W2 · Mietbeiträge: unter einem «lohnt sich»-Ergebnis stehen die weiteren Voraussetzungen des Kantons
//       (Wohnsitz, Vermögen, BS Mindestmiete, ZG Zimmer — mit Prüfung, wenn die Zimmer erfasst sind).
//  W6/W7 · Hinweis im Umzug: sagt, für welche gespeicherte Adresse er gilt, und nennt die Einschränkung.
//  W1 · Genf: «pro Zimmer und Jahr».
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { MietzinsHinweis } from '../components/MietzinsHinweis.jsx';

const t = (k, p) => (p && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const rechner = (canton, wohnen = {}, monthlyIncome = 2500) => renderToStaticMarkup(React.createElement(MietzinsOrientierung, {
  palette, t,
  data: { basis: { canton, maritalStatus: 'single', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome, dreizehnter: 'no' }, wohnen: { rentAmount: 1200, ...wohnen } },
}));

describe('W2 · weitere Voraussetzungen beim Mietbeiträge-Ergebnis', () => {
  it('Zug: Titel, Wohnsitz 3 Jahre, Vermögen 144 000, Zimmerregel', () => {
    const html = rechner('ZG', { wfgWohnung: 'ja' });
    expect(html).toContain('mietzinsView.result_likely');
    expect(html).toContain('mietzinsView.vorausTitel');
    expect(html).toContain('mietzinsView.vorausWohnsitz(3)');
    expect(html).toMatch(/mietzinsView\.vorausVermoegen\(144.000\)/);
    expect(html).toContain('mietzinsView.vorausZimmerZG');
    expect(html).not.toContain('vorausZimmerZGZuViel');
  });

  it('Zug: erfasste Zimmer über Personen + 2 werden als Hinweis genannt', () => {
    const html = rechner('ZG', { wfgWohnung: 'ja', rooms: '4' });
    expect(html).toContain('mietzinsView.vorausZimmerZGZuViel(4|1)');
  });

  it('Basel-Stadt: Wohnsitz 2 Jahre und Mindestmiete', () => {
    const html = rechner('BS');
    expect(html).toContain('mietzinsView.vorausWohnsitz(2)');
    expect(html).toContain('mietzinsView.vorausMindestmieteBS');
  });

  it('Genf: eigener Wohnsitzsatz (2 von 5 Jahren)', () => {
    expect(rechner('GE')).toContain('mietzinsView.vorausWohnsitzGE(2)');
  });

  it('über der Einkommensgrenze: keine Liste (kein «lohnt sich»)', () => {
    expect(rechner('ZG', { wfgWohnung: 'ja' }, 9000)).not.toContain('mietzinsView.vorausTitel');
  });

  it('jeder neue Schlüssel hat einen deutschen Text', () => {
    for (const k of ['vorausTitel', 'vorausWohnsitz', 'vorausWohnsitzGE', 'vorausVermoegen', 'vorausMindestmieteBS', 'vorausZimmerZG', 'vorausZimmerZGZuViel']) {
      expect(de.mietzinsView[k], k).toBeTruthy();
    }
  });
});

describe('W6/W7 · Hinweis im Umzug', () => {
  const hinweis = (canton, gespeicherteAdresse) => renderToStaticMarkup(React.createElement(MietzinsHinweis, { palette, t, canton, ohneTitel: true, gespeicherteAdresse }));
  it('nennt die gespeicherte Adresse, wenn verlangt', () => {
    expect(hinweis('BS', true)).toContain('mietzins.gespeicherteAdresse(cantons.BS)');
    expect(hinweis('BS', false)).not.toContain('gespeicherteAdresse');
  });
  it('BL, ZG, GE mit Einschränkung; BS ohne', () => {
    for (const k of ['BL', 'ZG', 'GE']) expect(hinweis(k, true)).toContain('mietzins.einschraenkung_' + k);
    expect(hinweis('BS', true)).not.toContain('einschraenkung');
  });
});

describe('W1 · Genf pro Zimmer und Jahr', () => {
  it('der Text nennt das Jahr', () => {
    expect(de.mietzinsView.cantonNote_GE).toContain('pro Zimmer und Jahr');
  });
});
