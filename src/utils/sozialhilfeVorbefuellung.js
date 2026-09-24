// Sozialhilfe-Rechner: was aus dem Profil schon bekannt ist, wird vorbefüllt — nicht zweimal eingeben.
//
// Alles monatlich und netto, wie die Sozialhilfe rechnet. Vorbefüllt heisst: überschreibbar,
// nichts wird zurückgeschrieben.
// - Erwerbseinkommen = Monatslohn + Nebenerwerb, beide nur netto. Der Nebenerwerb ist
//   Erwerbseinkommen und gehört darum hierher, nicht zu «andere Einkünfte» — nur so greift der
//   Einkommensfreibetrag. Ist der Hauptlohn brutto hinterlegt, bleibt das Feld leer (Hinweis).
// - Andere Einkünfte = Familienzulagen + Alimente erhalten + Nettolohn Partner/in, Letzteres nur
//   bei Ehe oder eingetragener Partnerschaft (eine Unterstützungseinheit) und nur, wenn das Feld
//   nach utils/partnereinkommen.js zählt. Als «andere Einkünfte» ohne Freibetrag — eine vorsichtige
//   Schätzung. Im Konkubinat zählt nach SKOS nicht der ganze Lohn, sondern ein
//   Konkubinatsbeitrag: dort nichts vorbefüllen, der Rechner zeigt einen Hinweis.
// - Vermögen = Sparkonto + Wertschriften + übriges Vermögen + freie Vorsorge 3b. Die Säule 3a
//   ist gebunden und zählt erst, wenn sie bezogen werden kann: frühestens fünf Jahre vor dem
//   Referenzalter (BVV 3 Art. 3 Abs. 1) — ab dann mit eigenem Hinweis.
// - Erwerbstätig = Anstellungstyp angestellt/selbstständig/freiberuflich, oder ohne Anstellungstyp
//   ein eingetragener Arbeitgeber. «Rentner» geht vor einem liegen gebliebenen Arbeitgeber.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';
import { referenzalterMonate } from '../data/ahvRechner.js';

// Alter in ganzen Monaten am Stichtag; null ohne gültiges Geburtsdatum.
function alterInMonaten(geburtsdatum, heute) {
  const g = new Date(geburtsdatum);
  if (!geburtsdatum || Number.isNaN(g.getTime())) return null;
  let m = (heute.getFullYear() - g.getFullYear()) * 12 + (heute.getMonth() - g.getMonth());
  if (heute.getDate() < g.getDate()) m -= 1;
  return m;
}

export function saeule3aBeziehbar(basis, heute = new Date()) {
  const alter = alterInMonaten(basis?.dateOfBirth, heute);
  if (alter == null) return false;
  const jahrgang = new Date(basis.dateOfBirth).getFullYear();
  return alter >= referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: jahrgang }) - 60;
}

const ERWERBSTAETIG = ['employed', 'selfEmployed', 'freelance'];

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

  const hauptBrutto = f.incomeType === 'brutto';
  const nebenerwerbBrutto = f.sideIncomeType === 'brutto' && betrag(f.sideIncome) > 0;
  const nebenZaehlt = !nebenerwerbBrutto && betrag(f.sideIncome) > 0;
  const einkommen = hauptBrutto ? '' : summeAlsFeld([f.monthlyIncome, nebenZaehlt ? f.sideIncome : undefined]);

  const partner = partnerEinkommenRoh(basis);
  const partnerErfasst = betrag(partner) > 0;
  const verheiratet = giltAlsVerheiratet(basis.maritalStatus);
  const andereEinkuenfte = summeAlsFeld([f.familienzulagen, f.alimenteReceived, verheiratet ? partner : undefined]);

  const mit3a = saeule3aBeziehbar(basis, heute) && betrag(f.pension3aBalance) > 0;
  const vermoegen = summeAlsFeld([f.savingsAccount, f.securitiesValue, f.otherAssets, f.pension3bBalance, mit3a ? f.pension3aBalance : undefined]);

  const typ = f.employmentType;
  const erwerbstaetig = typ
    ? ERWERBSTAETIG.includes(typ)
    : typeof f.employer === 'string' && f.employer.trim() !== '';

  return {
    adults: erwachseneImHaushalt(basis.household),
    einkommen,
    einkommenMitNebenerwerb: !hauptBrutto && nebenZaehlt,
    hauptBrutto,
    andereEinkuenfte,
    vermoegen,
    vermoegenMit3a: mit3a,
    erwerbstaetig,
    nebenerwerbBrutto,
    partnerKonkubinat: partnerErfasst && !verheiratet,
  };
}
