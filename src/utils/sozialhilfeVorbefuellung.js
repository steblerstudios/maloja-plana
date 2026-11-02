// Sozialhilfe-Rechner: was aus dem Profil schon bekannt ist, wird vorbefüllt — nicht zweimal eingeben.
//
// Alles monatlich und netto, wie die Sozialhilfe rechnet. Vorbefüllt heisst: überschreibbar,
// nichts wird zurückgeschrieben.
// - Erwerbseinkommen = Monatslohn + Nebenerwerb, beide nur netto. Der Nebenerwerb ist
//   Erwerbseinkommen und gehört darum hierher, nicht zu «andere Einkünfte» — nur so greift der
//   Einkommensfreibetrag. Ist der Hauptlohn brutto hinterlegt ODER die Art nicht gewählt, bleibt
//   das Feld leer (Hinweis) — nie eine geratene Basis (utils/jahreslohnAusProfil.js, lohnBasis).
//   Ein Nebenerwerb ohne gewählte Art zählt aus demselben Grund nicht mit (eigener Hinweis).
// - Andere Einkünfte = Familienzulagen + Alimente erhalten + Nettolohn Partner/in, Letzteres nur
//   bei Ehe oder eingetragener Partnerschaft (eine Unterstützungseinheit) und nur, wenn das Feld
//   nach utils/partnereinkommen.js zählt. Als «andere Einkünfte» ohne Freibetrag — eine vorsichtige
//   Schätzung. Im Konkubinat zählt nach SKOS nicht der ganze Lohn, sondern ein
//   Konkubinatsbeitrag: dort nichts vorbefüllen, der Rechner zeigt einen Hinweis.
// - Vermögen = Sparkonto + Wertschriften + übriges Vermögen + freie Vorsorge 3b. Die Säule 3a
//   ist gebunden und zählt erst, wenn sie bezogen werden kann: frühestens fünf Jahre vor dem
//   Referenzalter (BVV 3 Art. 3 Abs. 1) — ab dann mit eigenem Hinweis.
// - Haushalt: zur Unterstützungseinheit zählen die antragstellende Person und, bei Ehe oder
//   eingetragener Partnerschaft, die Partnerin/der Partner. Alle übrigen Erwachsenen im Haushalt
//   (Konkubinat, WG, erwachsene Kinder) sind «weitere Personen»; die Wohnform startet dann mit
//   «familienähnlich» — so rechnet die Sozialbehörde in der Regel (SKOS-RL C.3.1/C.3.2).
//   Kinder zählen zur Einheit, solange sie minderjährig sind; ab 18 sind sie «weitere Personen»
//   (das Profil erfasst Kinder bis 25). Ohne Alter gilt ein Kind als minderjährig.
// - Miete = Miete + Nebenkosten (SKOS-RL C.4.1 Abs. 2), bei weiteren Personen der Anteil nach Köpfen
//   (C.4.2 Abs. 2, utils/unterstuetzungseinheit.js). Bis 02.11.2026 blieb das Feld dort leer, und ein
//   leeres Feld zählte als 0: Der Rechner sagte «kein Anspruch», die Seite rechnete die ganze Miete.
// - Erwerbstätig = Anstellungstyp angestellt/selbstständig/freiberuflich, oder ohne Anstellungstyp
//   ein eingetragener Arbeitgeber. «Rentner» geht vor einem liegen gebliebenen Arbeitgeber.

import { partnerEinkommenRoh } from './partnereinkommen.js';
import { alterInMonaten, unterstuetzungseinheit, wohnkostenAnteil } from './unterstuetzungseinheit.js';
import { referenzalterMonate } from '../data/ahvRechner.js';
import { lohnBasis, lohnBasisOffen } from './jahreslohnAusProfil.js';
import { istErwerbstaetig, freibetragGilt } from '../data/sozialhilfeKern.js';

export { kindAlter } from './unterstuetzungseinheit.js';

export function saeule3aBeziehbar(basis, heute = new Date()) {
  const alter = alterInMonaten(basis?.dateOfBirth, heute);
  if (alter == null) return false;
  const jahrgang = new Date(basis.dateOfBirth).getFullYear();
  return alter >= referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: jahrgang }) - 60;
}

const betrag = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const erfasst = (v) => v != null && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

// Leer bleibt leer: eine Summe von 0 aus lauter leeren Feldern ist kein Eintrag.
const summeAlsFeld = (werte) => (werte.some(erfasst) ? String(Math.round(werte.reduce((s, v) => s + betrag(v), 0))) : '');

export function sozialhilfeVorbefuellung(data, heute = new Date()) {
  const f = data?.finanzen || {};
  const basis = data?.basis || {};

  const hauptBrutto = lohnBasis(f) === 'brutto';
  const hauptBasisOffen = lohnBasisOffen(f);
  const nebenerwerbBrutto = f.sideIncomeType === 'brutto' && betrag(f.sideIncome) > 0;
  const nebenerwerbBasisOffen = f.sideIncomeType !== 'brutto' && f.sideIncomeType !== 'netto' && betrag(f.sideIncome) > 0;
  const nebenZaehlt = f.sideIncomeType === 'netto' && betrag(f.sideIncome) > 0;
  const einkommen = hauptBrutto || hauptBasisOffen ? '' : summeAlsFeld([f.monthlyIncome, nebenZaehlt ? f.sideIncome : undefined]);

  const partner = partnerEinkommenRoh(basis);
  const haushalt = unterstuetzungseinheit(basis, heute);
  const { verheiratet, adults, kinder, weiterePersonen, konkubinatOffen } = haushalt;
  const andereEinkuenfte = summeAlsFeld([f.familienzulagen, f.alimenteReceived, verheiratet ? partner : undefined]);

  const mit3a = saeule3aBeziehbar(basis, heute) && betrag(f.pension3aBalance) > 0;
  const vermoegen = summeAlsFeld([f.savingsAccount, f.securitiesValue, f.otherAssets, f.pension3bBalance, mit3a ? f.pension3aBalance : undefined]);

  const erwerbstaetig = istErwerbstaetig(f);
  // Lernende: erwerbstätig, aber ohne Freibetrag, gleiche Regel wie calculateSozialhilfe.
  const ohneFreibetrag = erwerbstaetig && !freibetragGilt(f);

  const wohnkosten = summeAlsFeld([data?.wohnen?.rentAmount, data?.wohnen?.utilities]);
  const mieteAnteil = weiterePersonen > 0 && Number(wohnkosten) > 0;

  return {
    ohneFreibetrag,
    adults,
    kinder,
    weiterePersonen,
    miete: mieteAnteil ? String(wohnkostenAnteil(Number(wohnkosten), haushalt)) : wohnkosten,
    mieteAnteil,
    wohnform: weiterePersonen > 0 ? 'familienaehnlich' : 'allein',
    einkommen,
    einkommenMitNebenerwerb: !hauptBrutto && !hauptBasisOffen && nebenZaehlt,
    hauptBrutto,
    hauptBasisOffen,
    // Lohn im Profil, aber das Feld bleibt leer: Dann gibt es keinen Betrag, leer hiesse Einkommen 0.
    lohnNichtUebernommen: hauptBasisOffen || (hauptBrutto && betrag(f.monthlyIncome) > 0),
    andereEinkuenfte,
    vermoegen,
    vermoegenMit3a: mit3a,
    // Unter 25 kann der Grundbedarf kantonal tiefer sein (SKOS C.3.3) — nur Hinweis, keine Rechnung.
    jungErwachsen: (() => { const m = alterInMonaten(basis.dateOfBirth, heute); return m != null && m < 25 * 12; })(),
    erwerbstaetig,
    nebenerwerbBrutto,
    nebenerwerbBasisOffen,
    partnerKonkubinat: konkubinatOffen,
  };
}
