// IK-Auszug bis zum Referenzalter hochrechnen (Bugsuche B-17, Entscheid Stebler Studios 10.11.2026:
// «Ja, hochrechnen»).
//
// Der IK-Auszug kennt nur die Jahre bis heute. Vorher ging er so in die Rente ein: eine
// 40-jährige Person mit 20 IK-Jahren bekam eine Rente auf 20/44, «fehlend 24» — obwohl der
// Rechner ohne IK die Jahre bis zum Bezug annimmt (Audit B9) und beim Vorbezug ohnehin Jahre
// dazuschlug. Jetzt: die künftigen Jahre bis zum Referenzalter wie ohne IK (lückenlos), zu den
// Beitragsjahren aus dem IK dazu, höchstens volle Beitragsdauer. Lücken der Vergangenheit bleiben
// Lücken — gefüllt wird nur die Zukunft.
//
// Durchschnittseinkommen nach demselben Grundsatz wie berechneIKAuszug (Summe der Einkommen /
// Beitragsjahre): IK-Summe plus das heutige Einkommen für jedes künftige Jahr. Ohne heutiges
// Einkommen bleibt der IK-Durchschnitt.
export const ikHochrechnen = ({ ik, zukunftsJahre, einkommenHeute, volleDauer }) => {
  if (!ik) return null;
  const zukunft = Math.max(0, Math.floor(Number(zukunftsJahre) || 0));
  const bisher = Math.max(0, Number(ik.beitragsjahre) || 0);
  const beitragsjahreReferenzalter = Math.min(volleDauer, bisher + zukunft);
  const dazu = beitragsjahreReferenzalter - bisher; // nach der Deckelung wirklich angerechnet
  const eink = Number(einkommenHeute) || 0;
  const summe = (Number(ik.durchschnittlichesJahreseinkommen) || 0) * bisher + (eink > 0 ? eink * dazu : 0);
  const jahre = bisher + (eink > 0 ? dazu : 0);
  const durchschnitt = jahre > 0 ? Math.round(summe / jahre) : 0;
  return { beitragsjahreReferenzalter, zukunftsJahre: dazu, durchschnittlichesJahreseinkommen: durchschnitt };
};
