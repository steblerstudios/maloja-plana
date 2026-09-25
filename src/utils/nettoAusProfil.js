import { bruttoZuNettoRichtwert, referenzalterMonate } from '../data/lohnAbzuege.js';

// Netto-Monatslohn aus dem Profil — EINE Regel für die Dashboard-Liste (EinkommenFeld) und die
// Sozialhilfe-Schnellrechnung (calculateSozialhilfe), damit sie auf derselben Profilgrundlage nie
// verschieden rechnen (Predeploy-Prüfung 25.09.2026: bei «brutto» im Profil sagte das Dashboard
// «Anspruch möglich», die Sozialhilfe-Seite «Einkommen reicht aus»).
//
//   art 'netto'  → der Betrag, wie er ist
//   art 'brutto' → Netto-RICHTWERT (bruttoZuNettoRichtwert: AHV/ALV + PK nach Alter, im Rentenalter
//                  nur AHV über dem Freibetrag), als geschätzt markiert
//   art offen    → der Betrag wie bisher (galt schon immer als netto); `offen` sagt es der Anzeige

// Alter in ganzen Jahren und ob das Referenzalter erreicht ist (AHV 21: Frauen JG 1961–63 früher).
export function alterUndRentenalter(basis, heute = new Date()) {
  const g = basis?.dateOfBirth ? new Date(basis.dateOfBirth) : null;
  if (!g || isNaN(g.getTime())) return { alter: undefined, rentenalter: false };
  const alter = heute.getFullYear() - g.getFullYear() - (heute < new Date(heute.getFullYear(), g.getMonth(), g.getDate()) ? 1 : 0);
  const rentenalter = alter * 12 >= referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: g.getFullYear() });
  return { alter, rentenalter };
}

export function nettoMonatAusProfil(betrag, art, basis, heute = new Date()) {
  const wert = Math.max(0, Number(betrag) || 0);
  if (art !== 'brutto' || wert <= 0) return { netto: wert, geschaetzt: false, offen: art !== 'netto' && art !== 'brutto' && wert > 0 };
  const { alter, rentenalter } = alterUndRentenalter(basis, heute);
  return { netto: bruttoZuNettoRichtwert(wert, alter, rentenalter), geschaetzt: true, offen: false };
}
