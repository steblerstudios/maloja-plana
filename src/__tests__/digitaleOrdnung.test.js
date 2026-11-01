import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { HEARTFELT } from '../data/direktLinks.js';
import { DigitaleOrdnung } from '../DigitaleOrdnung.jsx';

// Digitale Ordnung (Stebler Studios 01.11.2026): acht Schritte, alles ausserhalb der App. Gehalten wird die
// Grenze aus dem Konzept: kein Eingabefeld, kein Netz, keine Punkte oder Serie.

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const html = () => renderToStaticMarkup(React.createElement(DigitaleOrdnung, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
const quelle = readFileSync(resolve(__dirname, '..', 'DigitaleOrdnung.jsx'), 'utf8');

describe('Digitale Ordnung', () => {
  it('geht in acht Schritten, jeder lässt sich als erledigt abhaken', () => {
    expect(html()).toContain('Schritt 1 von 8');
    expect(html()).toContain('data-ablauf-weiter="erledigt"');
  });
  it('fragt nichts ab und holt nichts aus dem Netz', () => {
    expect(html()).not.toMatch(/<(input|textarea|select)\b/);
    expect(quelle).not.toMatch(/fetch\(|XMLHttpRequest|localStorage/);
  });
  it('keine Serie, keine Punkte, kein Vergleich', () => {
    const texte = JSON.stringify(de.digitaleOrdnung);
    expect(texte).not.toMatch(/Punkte|Serie|Streak|Rangliste|Risiko-Wert/i);
  });
  it('die Löschung bleibt ohne Versprechen', () => {
    expect(JSON.stringify(de.digitaleOrdnung.step5Text2)).toContain('kann ablehnen');
    expect(JSON.stringify(de.digitaleOrdnung)).not.toMatch(/Recht auf Löschung/);
  });
  it('der Weg ins Bücherregal führt zur Ansicht des Regals', () => {
    expect(quelle).toContain("onNavigate('direktlinks')");
  });
  it('Reclaim City und Proton Mail stehen im Bücherregal, ohne Affiliate', () => {
    for (const n of ['Reclaim City', 'Proton Mail']) {
      const e = HEARTFELT.find((x) => x.name === n);
      expect(e.group).toBe('digital');
      expect(e.affiliate).toBeFalsy();
    }
  });
});
