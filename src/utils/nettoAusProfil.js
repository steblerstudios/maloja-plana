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

// Alter in ganzen Jahren und ob die Lohnabzüge schon nach Rentenalter laufen (AHV 21: Frauen JG 1961–63 früher).
// `rentenalter` gilt ab dem MONAT NACH dem Erreichen (seit 25.10.2026, fedlex gelesen):
//   AHVV Art. 6quater Abs. 1 — Freibetrag «ab dem Monat, nachdem die Arbeitnehmer das Referenzalter … erreicht haben»;
//   AVIG Art. 2 Abs. 2 lit. c — keine ALV «ab Ende des Monats, in dem sie das Referenzalter … erreichen».
// Der Schutzschild nimmt dagegen den Tag des Erreichens (BVG Art. 10 Abs. 2 lit. a, referenzalterErreicht). Im Monat
// des Erreichens zieht der Richtwert so noch PK ab, obwohl der Schild keine Pflicht mehr zeigt — vertretbar: die Kassen
// führen den Abzug in diesem Monat nach Reglement oft noch (Fachprüfung 25.10.2026).
// Offen, nicht belegt: ob bei Geburt am 1. eines Monats das Alter schon am Vortag gilt (dann ein Monat früher).
export function alterUndRentenalter(basis, heute = new Date()) {
  // Datum aus dem Text, lokal gebaut: `new Date('1962-04-01')` ist UTC und läge westlich davon im Vormonat.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(basis?.dateOfBirth || ''));
  const g = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  if (!g || isNaN(g.getTime())) return { alter: undefined, rentenalter: false, beitragsfrei: false };
  const alter = heute.getFullYear() - g.getFullYear() - (heute < new Date(heute.getFullYear(), g.getMonth(), g.getDate()) ? 1 : 0);
  const monatErreicht = g.getFullYear() * 12 + g.getMonth() + referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: g.getFullYear() });
  // Vor der Beitragspflicht (AHVG Art. 3 Abs. 2 lit. a): bis 31.12. des Jahres, in dem 17 vollendet — nach Jahrgang.
  // Offen, nicht belegt (Fachprüfung 26.10.2026): Geburt am 1.1. — gilt das Altersjahr schon am Vortag als vollendet,
  // begänne die Pflicht ein Jahr früher. Wie beim Rentenalter oben bei der Ausgleichskasse / BSV-Wegleitung (WBB) zu klären.
  const beitragsfrei = heute.getFullYear() - g.getFullYear() <= 17;
  return { alter, rentenalter: heute.getFullYear() * 12 + heute.getMonth() > monatErreicht, beitragsfrei };
}

// Referenzalter erreicht — monatsgenau, weil AHV 21 in 3-Monats-Schritten läuft (Frauen JG 1961–63).
// null ohne gültiges Geburtsdatum: dann ist es offen, nicht «nein».
export function referenzalterErreicht(basis, heute = new Date()) {
  const g = basis?.dateOfBirth ? new Date(basis.dateOfBirth) : null;
  if (!g || isNaN(g.getTime())) return null;
  let monate = (heute.getFullYear() - g.getFullYear()) * 12 + (heute.getMonth() - g.getMonth());
  if (heute.getDate() < g.getDate()) monate -= 1;
  return monate >= referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: g.getFullYear() });
}

export function nettoMonatAusProfil(betrag, art, basis, heute = new Date()) {
  const wert = Math.max(0, Number(betrag) || 0);
  if (art !== 'brutto' || wert <= 0) return { netto: wert, geschaetzt: false, offen: art !== 'netto' && art !== 'brutto' && wert > 0 };
  const { alter, rentenalter, beitragsfrei } = alterUndRentenalter(basis, heute);
  return { netto: bruttoZuNettoRichtwert(wert, alter, rentenalter, undefined, beitragsfrei), geschaetzt: true, offen: false };
}
