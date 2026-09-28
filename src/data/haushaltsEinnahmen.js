// Monatliche Einnahmen des Haushalts — EINE Summe für Budget-Seite und Finanzübersicht.
//
// Die Ausgaben im Budget gelten für den ganzen Haushalt (volle Miete, Lebensmittel …). Bis
// 28.09.2026 standen ihnen nur der eigene Lohn + Familienzulagen + Alimente gegenüber: ein Paar
// erschien knapp oder im Minus, ein Nebenerwerb fehlte ganz (Entscheid Stebler Studios, Variante A).
//
// Partner/in: nur über `partnerEinkommenRoh` — das Feld zählt nur, wenn es nach derselben Regel
// sichtbar wäre (utils/partnereinkommen.js). Es ist als NETTO erfasst («Nettolohn Partner/in»).
//
// `bruttoDabei`: ist ein Lohn ausdrücklich als brutto erfasst, sind AHV, ALV und Pensionskasse
// darin noch nicht abgezogen — die Summe ist dann KEIN Geld auf dem Konto. Die Anzeigen rechnen
// daraus kein «frei verfügbar», sondern fragen nach dem Netto (Variante a). Ohne Angabe der Art
// zählt der Lohn wie bisher (der Feld-Hinweis rät zu netto); nur ein ausdrückliches «brutto» sperrt.
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';

const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };

export function haushaltsEinnahmen(data = {}) {
  const f = data?.finanzen || {};
  const lohn = n(f.monthlyIncome);
  const neben = n(f.sideIncome);
  const partner = n(partnerEinkommenRoh(data?.basis));
  const familienzulagen = n(f.familienzulagen);
  const alimente = n(f.alimenteReceived);
  const lohnArt = f.incomeType || null;
  const nebenArt = f.sideIncomeType || null;
  return {
    lohn, lohnArt, neben, nebenArt, partner, familienzulagen, alimente,
    total: lohn + neben + partner + familienzulagen + alimente,
    bruttoDabei: (lohn > 0 && lohnArt === 'brutto') || (neben > 0 && nebenArt === 'brutto'),
  };
}

// Die Zeilen der Aufschlüsselung (i18n-Schlüssel + Betrag), nur die mit Betrag — eine Liste für
// Budget-Seite, Finanzübersicht und Ausdruck. Der Lohn trägt seine erfasste Art im Namen:
// «Nettoeinkommen» stand bis 28.09.2026 auch über einem Bruttolohn.
export function einnahmenZeilen(e) {
  if (!e) return [];
  const lohnKey = e.lohnArt === 'netto' ? 'budgetSync.incomeNet'
    : e.lohnArt === 'brutto' ? 'budgetSync.incomeGross' : 'budgetSync.incomeSalary';
  return [
    { key: lohnKey, betrag: e.lohn },
    { key: e.nebenArt === 'brutto' ? 'budgetSync.incomeSideGross' : 'budgetSync.incomeSide', betrag: e.neben },
    { key: 'budgetSync.incomePartner', betrag: e.partner },
    { key: 'budgetSync.incomeFamilienzulagen', betrag: e.familienzulagen },
    { key: 'budgetSync.incomeAlimente', betrag: e.alimente },
  ].filter(z => z.betrag > 0);
}
