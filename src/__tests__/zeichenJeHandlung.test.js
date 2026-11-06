import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { ansichtIkon } from '../config/ansichtenRegister.js';

// Icon-Plan November 2026, Schritt 2 (docs/ICON-PLAN-2026-11.md): gleiche Handlung, gleiches Zeichen.
// Vorher: Drucken 1× Drucker, 3× Blatt, 6× nichts · Speichern mit leerem Kästchen («noch nicht
// erledigt») · Export-Knöpfe mit Kästchen und einem Blatt namens «rechner» · Notfall als Kreuz
// und als Glocke · Organspende mit dem Gesundheits-Kreuz, obwohl ihr Herz gezeichnet ist.
//
// Gesucht wird das Zeichen im Knopf, der den Text trägt: vom letzten `createElement(…button…`
// vor `t('schlüssel')` bis zum Schlüssel.

const SRC = resolve(__dirname, '..');
const lesen = (datei) => readFileSync(resolve(SRC, datei), 'utf8');

const knopfVor = (txt, schluessel) => {
  const i = txt.indexOf(`t('${schluessel}')`);
  if (i < 0) return null;
  const vorher = txt.slice(0, i);
  const start = Math.max(vorher.lastIndexOf("createElement(PrimaryButton"), vorher.lastIndexOf("createElement('button'"));
  return start < 0 ? null : vorher.slice(start);
};
const zeigt = (knopf, name) => knopf.includes(`name: '${name}'`) || knopf.includes(`hinweisZeichen('${name}'`);
const zeichenIn = (knopf) => [...knopf.matchAll(/(?:name: |hinweisZeichen\()'([a-zA-Z]+)'/g)].map((m) => m[1]);

const DRUCKEN = [
  ['Bestattung.jsx', 'bw.ui.drucken'],
  ['Patientenverfuegung.jsx', 'pv.ui.drucken'],
  ['Vorsorgeauftrag.jsx', 'va.ui.drucken'],
  ['BehoerdenDossier.jsx', 'behoerdenDossier.printAction'],
  ['NotfallDossier.jsx', 'notfallDossier.printAction'],
  ['Lebensmappe.jsx', 'lebensmappe.printAction'],
  ['CVGenerator.jsx', 'cv.pdfDrucken'],
  ['BriefGenerator.jsx', 'briefe.printLetter'],
  ['FlyerView.jsx', 'flyer.print'],
  ['components/FinanzAuswertung.jsx', 'finanzUebersicht.printAction'],
];

// Hauptknöpfe «Speichern». Ruhige Nebenknöpfe (Prämienverbilligung, Notfall im Kapitel) tragen
// bewusst keines — ein Zeichen an jedem Knopf ist Gleichverteilung (ICON_KONVENTION.md).
const SPEICHERN = [
  ['BudgetImport.jsx', 'common.save'],
  ['TaxImport.jsx', 'common.save'],
  ['KKScanner.jsx', 'common.save'],
  ['TaxCalculator.jsx', 'tax.saveData'],
  ['OrganDonation.jsx', 'organ.save'],
];

describe('Drucken zeigt überall den Drucker', () => {
  it.each(DRUCKEN)('%s · %s', (datei, schluessel) => {
    const knopf = knopfVor(lesen(datei), schluessel);
    expect(knopf, 'Knopf nicht gefunden').not.toBeNull();
    expect(zeichenIn(knopf)).toEqual(['drucker']);
  });
});

describe('Speichern zeigt den Haken, nie das leere Kästchen', () => {
  it.each(SPEICHERN)('%s · %s', (datei, schluessel) => {
    const knopf = knopfVor(lesen(datei), schluessel);
    expect(knopf, 'Knopf nicht gefunden').not.toBeNull();
    expect(zeichenIn(knopf)).toEqual(['check']);
  });
});

describe('Export-Knöpfe: Zeichen nach Inhalt', () => {
  const zip = lesen('ZipExport.jsx');
  const zeichenVorEtikett = (etikett) => {
    const i = zip.indexOf(`: '${etikett}')`);
    const start = zip.lastIndexOf("createElement('button'", i);
    return zeichenIn(zip.slice(start, i)).filter((n) => n !== 'info');
  };
  it('JSON ist die Sicherung', () => expect(zeichenVorEtikett('JSON')).toEqual(['sicherung']));
  it('CSV ist eine Tabelle', () => expect(zeichenVorEtikett('CSV')).toEqual(['csv']));
  it('Manifest ist ein Blatt', () => expect(zeichenVorEtikett('Manifest')).toEqual(['document']));
});

describe('Ein Thema, ein Zeichen', () => {
  it('Notfall ist nie die Glocke', () => {
    for (const datei of ['NotfallDossier.jsx', 'UnterlagenDrucken.jsx', 'Baum3D.jsx']) {
      expect(lesen(datei), datei).not.toMatch(/'emergency'/);
    }
  });
  it('Notfallpass steht bei seinen Geschwistern', () => {
    expect(ansichtIkon('notfallpass')).toBe('notfall');
    expect(ansichtIkon('notfallkarte')).toBe('notfall');
  });
  it('Organspende zeigt ihr eigenes Herz', () => {
    expect(ansichtIkon('organ')).toBe('organspende');
    expect(zeigt(lesen('OrganDonation.jsx'), 'organspende')).toBe(true);
  });
  it('die Sicherung trägt das Sicherungs-Zeichen, nicht «herunterladen»', () => {
    expect(WERKZEUGE.find((w) => w.view === 'export').icon).toBe('sicherung');
    const knopf = lesen('SettingsView.jsx').match(/nav\.export[\s\S]{0,40}|[\s\S]{0,400}nav\.export/)[0];
    expect(knopf).not.toMatch(/name: 'download'/);
  });
  it('Budget-Übersicht ist das Portemonnaie, nicht das Blatt «rechner»', () => {
    const knopf = knopfVor(lesen('FinanzUebersicht.jsx'), 'finanzUebersicht.toBudget');
    expect(zeichenIn(knopf)).toEqual(['budgetWallet']);
  });
});
