// Sozialhilfe-Rechner: was aus dem Profil schon bekannt ist, wird vorbefüllt — nicht zweimal eingeben.
//
// Alles monatlich, wie im Kapitel «Finanzen» erfasst. Vorbefüllt heisst: überschreibbar, nichts
// wird zurückgeschrieben.
// - Andere Einkünfte = Familienzulagen + Alimente erhalten + Nebenerwerb (nur netto) + Nettolohn
//   Partner/in (nur wenn das Feld nach utils/partnereinkommen.js zählt). Ein als Brutto hinterlegter
//   Nebenerwerb bleibt draussen — die Sozialhilfe rechnet netto, wie beim Haupteinkommen.
// - Vermögen = Sparkonto + Wertschriften + übriges Vermögen. Säule 3a nicht: gebunden.
// - Erwerbstätig = Anstellungstyp angestellt/selbstständig/freiberuflich, oder ohne Anstellungstyp
//   ein eingetragener Arbeitgeber. «Rentner» geht vor einem liegen gebliebenen Arbeitgeber.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';

const ERWERBSTAETIG = ['employed', 'selfEmployed', 'freelance'];

const betrag = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

// Leer bleibt leer: eine Summe von 0 aus lauter leeren Feldern ist kein Eintrag.
const alsFeld = (summe, irgendwasErfasst) => (irgendwasErfasst ? String(Math.round(summe)) : '');

const erfasst = (v) => v != null && v !== '' && Number.isFinite(Number(v));

export function sozialhilfeVorbefuellung(data) {
  const f = data?.finanzen || {};
  const basis = data?.basis || {};

  const nebenerwerbBrutto = f.sideIncomeType === 'brutto' && betrag(f.sideIncome) > 0;
  const partner = partnerEinkommenRoh(basis);
  const einkuenfte = [f.familienzulagen, f.alimenteReceived, nebenerwerbBrutto ? undefined : f.sideIncome, partner];
  const andereEinkuenfte = alsFeld(einkuenfte.reduce((s, v) => s + betrag(v), 0), einkuenfte.some(erfasst));

  const vermoegenTeile = [f.savingsAccount, f.securitiesValue, f.otherAssets];
  const vermoegen = alsFeld(vermoegenTeile.reduce((s, v) => s + betrag(v), 0), vermoegenTeile.some(erfasst));

  const typ = f.employmentType;
  const erwerbstaetig = typ
    ? ERWERBSTAETIG.includes(typ)
    : typeof f.employer === 'string' && f.employer.trim() !== '';

  return {
    adults: erwachseneImHaushalt(basis.household),
    andereEinkuenfte,
    vermoegen,
    erwerbstaetig,
    nebenerwerbBrutto,
  };
}
