import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BehoerdenDossier } from '../BehoerdenDossier.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// Behörden-Dossier · die Statuszeile gehört dem Bildschirm, nicht dem Drucker.
//
// `dossierGenerator.js` baut die Abschnitte für BEIDE Medien und hängt an jeden
// eine `statusColor` aus der DRUCK-Tafel — Farben fürs weisse Blatt, die vom
// hellen oder dunklen Thema nichts wissen. Die Bildschirm-Vorschau hat genau
// diese Farbe übernommen.
//
// Im Browser gemessen (Demo-Profil, 390×844):
//   Hellmodus  #6B6560 auf #FAFAF8 → 4.86:1  (knapp bestanden — deshalb fiel es nie auf)
//   Dunkelmodus #6B6560 auf #343330 → 2.20:1 (weit unter AA)
//
// Der Abschnitt trägt jetzt `statusOk` als BEDEUTUNG; die Farbe wählt jedes
// Medium selbst. Nachgemessen: dunkel 4.81:1, hell 5.25:1.
//
// Dieser Test hält die Trennung, nicht die heutigen Zahlen: keine Druckfarbe im
// Bildschirm-Markup, und der Ja-Fall bleibt vom Nein-Fall unterscheidbar.
// ─────────────────────────────────────────────────────────────

// Die Farben aus der DRUCK-Tafel, die auf dem Bildschirm nichts zu suchen haben.
const DRUCK_GRAU = '#6B6560';
const DRUCK_GRUEN = '#5C7150';

const t = (k) => k;

// Ein Profil, das alle drei Statusabschnitte (Sozialhilfe, IPV, EL) auslöst.
const profil = {
  basis: {
    firstName: 'Alex', lastName: 'Muster', canton: 'ZH', dateOfBirth: '1980-05-01',
    maritalStatus: 'single', household: { adults: 1, children: [] },
  },
  wohnen: { postalCode: '8000', city: 'Zürich', rentAmount: 1650 },
  finanzen: { monthlyIncome: 6200 },
  versicherungen: { kkPremium: 385 },
};

const zeichne = (palette) =>
  renderToStaticMarkup(
    React.createElement(BehoerdenDossier, {
      palette, t, data: profil, chapters: [], onNavigate: () => {},
    })
  );

describe('Behörden-Dossier — die Statusfarbe kommt vom Bildschirm, nicht vom Drucker', () => {
  for (const [name, palette] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`benutzt im ${name}en Thema keine Druckfarbe`, () => {
      const html = zeichne(palette).toLowerCase();
      expect(html).not.toContain(DRUCK_GRAU.toLowerCase());
      expect(html).not.toContain(DRUCK_GRUEN.toLowerCase());
    });

    it(`zeigt im ${name}en Thema überhaupt eine Statuszeile`, () => {
      // Ohne diesen Test liesse sich der obige durch "gar nichts rendern" erfüllen.
      expect(zeichne(palette)).toContain('behoerdenDossier.section');
    });
  }

  it('unterscheidet Ja und Nein weiterhin — nur eben in Bildschirmfarben', () => {
    const hell = zeichne(LIGHT_PALETTE).toLowerCase();
    // sageDeep trägt das Ja, mid das Nein. Beide sind dokumentierte Vordergrundfarben.
    const jaFarbe = LIGHT_PALETTE.sageDeep.toLowerCase();
    const neinFarbe = LIGHT_PALETTE.mid.toLowerCase();
    expect(hell.includes(jaFarbe) || hell.includes(neinFarbe)).toBe(true);
  });
});
