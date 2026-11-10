// Wohnkosten-Anteil und «Drittel» — EINE Rechnung für alle Orte (Stebler Studios 11.11.2026,
// «am liebsten alle drei vereint»): Kapitel Wohnen (WohnkostenInstrument), Mietzins-Werkzeug
// (MietVergleich) und Budget (BudgetSync). Wächter: src/__tests__/wohnkostenEineRechnung.test.js.
//
// Bis 11.11.2026 rechneten die drei Orte verschieden: das Kapitel alle Wohnkosten ÷ alle eigenen
// Einnahmen, das Mietzins-Werkzeug Miete + Nebenkosten ÷ nur den Lohn, das Budget die Grenze als
// Haushaltseinkommen (mit Partner/in) ÷ 3. Dieselbe Person sah «30 %» im Kapitel und «!» im Werkzeug.
//
// Es gilt die Regel des Kapitels (Fachprüfung 24.10.2026):
//   • Wohnkosten = Nettomiete + Nebenkosten + Hypothek + Gebäudeversicherung ÷ 12.
//   • Einkommen = die eigenen Einnahmen aus der einen Monatsrechnung (Lohn, Nebenverdienst,
//     Familienzulagen, Alimente) — utils/monatsrechnung.js.
//   • Partner/in im Haushalt: die Wohnkosten gelten für den Haushalt, das Einkommen ist das eigene.
//     Dann kein Urteil «mehr als ein Drittel» und keine «!»-Grenze.
//   • Das Drittel ist eine Faustregel, keine Vorschrift.
import { eigeneEinnahmen, sumAllExpenses } from '../utils/monatsrechnung.js';
import { haushaltsEinnahmen } from './haushaltsEinnahmen.js';
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';

const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };

// Reine Rechnung, damit sie ohne DOM geprüft werden kann. `wohnen` ist der (gerade bearbeitete)
// Stand des Kapitels, `allData` das ganze Profil, `miete` eine ausprobierte Nettomiete (optional).
export function wohnkostenRechnung(wohnen, allData, miete) {
  const heute = n(wohnen?.rentAmount);
  const nk = n(wohnen?.utilities);
  const netto = miete == null ? heute : n(miete);
  // Eigentum: wie die Monatsrechnung — «Hypothek vorhanden? Nein» zählt nicht.
  const hypothek = wohnen?.mortgageStatus === 'no' ? 0 : n(wohnen?.mortgagePayment);
  const eigentum = hypothek > 0;
  const kosten = netto + nk + hypothek + n(wohnen?.buildingsInsurance) / 12;
  const { total: einkommen, brutto } = eigeneEinnahmen(allData?.finanzen);
  const e = haushaltsEinnahmen({ finanzen: allData?.finanzen || {} });
  const ganzBrutto = brutto && e.lohnArt === 'brutto' && e.lohn > 0 && (e.neben === 0 || e.nebenArt === 'brutto') && e.familienzulagen + e.alimente === 0;
  const mitPartner = n(partnerEinkommenRoh(allData?.basis)) > 0;
  const anteil = einkommen > 0 ? (kosten / einkommen) * 100 : null;
  const profil = { ...(allData || {}), wohnen: { ...(wohnen || {}), rentAmount: netto } };
  const frei = einkommen > 0 && !brutto ? einkommen - sumAllExpenses(allData?.finanzen, profil) : null;
  return { heute, nk, netto, kosten, eigentum, einkommen, brutto, ganzBrutto, mitPartner, anteil, ueberDrittel: anteil != null && anteil > 100 / 3, frei };
}

// Die «!»-Marke auf dem Miet-Balken (RegionalBarometer zeigt die NETTOMIETE): die Nettomiete, ab der
// die Wohnkosten mehr als einen Drittel des Einkommens ausmachen. Miete > Grenze ⇔ `ueberDrittel`.
// 0 heisst «keine Marke»: ohne Einkommen (nie geraten) und mit Partner/in (kein Urteil, siehe oben).
export function drittelGrenzeMiete(r) {
  if (!r || r.mitPartner || !(r.einkommen > 0)) return 0;
  return Math.max(0, r.einkommen / 3 - (r.kosten - r.netto));
}
