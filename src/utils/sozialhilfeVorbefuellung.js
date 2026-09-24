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
// - Vermögen = Sparkonto + Wertschriften + übriges Vermögen. Säule 3a nicht: gebunden.
// - Erwerbstätig = Anstellungstyp angestellt/selbstständig/freiberuflich, oder ohne Anstellungstyp
//   ein eingetragener Arbeitgeber. «Rentner» geht vor einem liegen gebliebenen Arbeitgeber.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';

const ERWERBSTAETIG = ['employed', 'selfEmployed', 'freelance'];

const betrag = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const erfasst = (v) => v != null && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

// Leer bleibt leer: eine Summe von 0 aus lauter leeren Feldern ist kein Eintrag.
const summeAlsFeld = (werte) => (werte.some(erfasst) ? String(Math.round(werte.reduce((s, v) => s + betrag(v), 0))) : '');

export function sozialhilfeVorbefuellung(data) {
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

  const vermoegen = summeAlsFeld([f.savingsAccount, f.securitiesValue, f.otherAssets]);

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
    erwerbstaetig,
    nebenerwerbBrutto,
    partnerKonkubinat: partnerErfasst && !verheiratet,
  };
}
