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
// - Miete: bei weiteren Personen NICHT vorbefüllen — im Profil steht die ganze Miete, gezählt wird
//   nur der eigene Anteil (SKOS C.4). Leer mit Hinweis statt eine Pro-Kopf-Annahme.
// - Erwerbstätig = Anstellungstyp angestellt/selbstständig/freiberuflich, oder ohne Anstellungstyp
//   ein eingetragener Arbeitgeber. «Rentner» geht vor einem liegen gebliebenen Arbeitgeber.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';
import { referenzalterMonate } from '../data/ahvRechner.js';
import { lohnBasis, lohnBasisOffen } from './jahreslohnAusProfil.js';
import { istErwerbstaetig } from '../data/sozialhilfeKern.js';

// Alter in ganzen Monaten am Stichtag; null ohne gültiges Geburtsdatum.
function alterInMonaten(geburtsdatum, heute) {
  const g = new Date(geburtsdatum);
  if (!geburtsdatum || Number.isNaN(g.getTime())) return null;
  let m = (heute.getFullYear() - g.getFullYear()) * 12 + (heute.getMonth() - g.getMonth());
  if (heute.getDate() < g.getDate()) m -= 1;
  return m;
}

function kindAlter(kind, heute) {
  if (kind?.birthDate) {
    const m = alterInMonaten(kind.birthDate, heute);
    if (m != null) return Math.floor(m / 12);
  }
  const a = Number(kind?.age);
  return Number.isFinite(a) && kind?.age !== '' && kind?.age != null ? a : null;
}

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
  const partnerErfasst = betrag(partner) > 0;
  const verheiratet = giltAlsVerheiratet(basis.maritalStatus);
  const andereEinkuenfte = summeAlsFeld([f.familienzulagen, f.alimenteReceived, verheiratet ? partner : undefined]);

  const mit3a = saeule3aBeziehbar(basis, heute) && betrag(f.pension3aBalance) > 0;
  const vermoegen = summeAlsFeld([f.savingsAccount, f.securitiesValue, f.otherAssets, f.pension3bBalance, mit3a ? f.pension3aBalance : undefined]);

  const erwerbstaetig = istErwerbstaetig(f);

  const erwachsene = erwachseneImHaushalt(basis.household);
  const einheitErwachsene = verheiratet && erwachsene >= 2 ? 2 : 1;
  const kinderListe = Array.isArray(basis.household?.children) ? basis.household.children : [];
  const erwachseneKinder = kinderListe.filter(k => { const a = kindAlter(k, heute); return a != null && a >= 18; }).length;
  const weiterePersonen = Math.max(0, erwachsene - einheitErwachsene) + erwachseneKinder;
  const konkubinat = basis.maritalStatus === 'cohabiting';

  return {
    adults: einheitErwachsene,
    kinder: kinderListe.length - erwachseneKinder,
    weiterePersonen,
    miete: weiterePersonen > 0 ? '' : summeAlsFeld([data?.wohnen?.rentAmount]),
    wohnform: weiterePersonen > 0 ? 'familienaehnlich' : 'allein',
    einkommen,
    einkommenMitNebenerwerb: !hauptBrutto && !hauptBasisOffen && nebenZaehlt,
    hauptBrutto,
    hauptBasisOffen,
    andereEinkuenfte,
    vermoegen,
    vermoegenMit3a: mit3a,
    // Unter 25 kann der Grundbedarf kantonal tiefer sein (SKOS C.3.3) — nur Hinweis, keine Rechnung.
    jungErwachsen: (() => { const m = alterInMonaten(basis.dateOfBirth, heute); return m != null && m < 25 * 12; })(),
    erwerbstaetig,
    nebenerwerbBrutto,
    nebenerwerbBasisOffen,
    // Konkubinatsbeitrag-Hinweis: bei erfasstem Partnerlohn — oder im Konkubinat mit Mitbewohnenden.
    partnerKonkubinat: !verheiratet && (partnerErfasst || (konkubinat && weiterePersonen > 0)),
  };
}
