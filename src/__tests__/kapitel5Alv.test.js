import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bestimmeAnspruchstage, berechneTaggeld } from '../data/alvRechner.js';
import { ergebnis, ergebnisSatz, ERGEBNIS_ART } from '../data/ergebnisArt.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Kapitel 5 «Ausbildung & Arbeit», 10.11.2026 (Entscheid Stebler Studios «Ja, alles»).
const quelle = readFileSync(fileURLToPath(new URL('../AlvRechner.jsx', import.meta.url)), 'utf8');

describe('L1 · Anspruchsdauer ohne Alter (AVIG Art. 27 Abs. 5bis)', () => {
  it('ohne Alter keine feste Zahl — vorher 400, unter 25 ohne Kinder wären es 200', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 24, alter: null, hatKinder: false })).toBeNull();
    expect(berechneTaggeld({ versicherterVerdienst: 6000, beitragsmonate: 24, alter: null }).anspruchstageOffen).toBe(true);
  });
  it('mit Alter wie im Gesetz: 24 Jahre ohne Kinder 200, 30 Jahre 400, 56 Jahre mit 22 Monaten 520', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 24, alter: 24, hatKinder: false })).toBe(200);
    expect(bestimmeAnspruchstage({ beitragsmonate: 24, alter: 30, hatKinder: false })).toBe(400);
    expect(bestimmeAnspruchstage({ beitragsmonate: 22, alter: 56, hatKinder: false })).toBe(520);
  });
  it('IV-Rente ab 40 % und 22 Monate: 520 auch ohne Alter', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 22, alter: null, ivGrad40: true })).toBe(520);
  });
  it('der Rechner hat ein Feld «Alter», vorbefüllt aus dem Profil', () => {
    expect(quelle).toMatch(/zahlFeld\('alv-alter', t\('alv\.alter'\)/);
  });
});

describe('L2/L4/A · Rechner-Anzeige', () => {
  it('unter 12 eingetragenen Beitragsmonaten kein Betrag', () => {
    expect(quelle).toMatch(/const unter12 = beitragsmonate !== '' && parsedMonate < 12/);
  });
  it('Kinder werden nur unter 18 vorbefüllt (ab 18 nur in Ausbildung, ZGB Art. 277)', () => {
    expect(quelle).toMatch(/return a == null \|\| a < 18;/);
  });
  it('keine Zahlen als Platzhalter', () => {
    expect(quelle).not.toMatch(/placeholder: '6000'/);
    expect(quelle).not.toMatch(/placeholder: '12'/);
  });
});

describe('C · «Noch nötig» nennt die Angabe', () => {
  const sprachen = { de, fr, it: it_, en, rm };
  it('ALV: «Noch nötig: Beitragsmonate» statt «Noch eine Angabe nötig»', () => {
    const t = createT({ de }, 'de', 'sie');
    const s = ergebnisSatz(ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: ['beitragsmonate'] }), t);
    expect(s).toMatch(/Noch nötig: Beitragsmonate\.$/);
  });
  it('mehrere Angaben werden aufgezählt', () => {
    const t = createT({ de }, 'de', 'sie');
    const s = ergebnisSatz(ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: ['beitragsmonate', 'geburtsdatum'] }), t);
    expect(s).toMatch(/Noch nötig: Beitragsmonate, Alter\.$/);
  });
  it('jeder Name, den ein Rechner meldet, hat in allen Sprachen eine Bezeichnung', () => {
    const namen = ['bruttolohn', 'beitragsmonate', 'geburtsdatum', 'einkommen', 'einkommensart', 'wochenstunden',
      'miete', 'kvgPraemie', 'erwerbseinkommen', 'vermoegen', 'kanton', 'stundenlohn', 'ferienform'];
    for (const [l, d] of Object.entries(sprachen)) {
      for (const n of namen) expect(typeof d.ergebnisArt?.angabe?.[n], l + ' ' + n).toBe('string');
    }
  });
});
