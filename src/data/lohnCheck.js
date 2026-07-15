// Kantonale Mindestlöhne (CHF/Stunde, brutto), Stand per 1.1.2026 — offiziell verifiziert:
//   GE 24.59 (ge.ch, jährlich CPI-indexiert)      · NE 21.35 (ne.ch, jährlich indexiert)
//   BS 22.20 (bs.ch, jährlich indexiert)
//   JU 21.40 — Ordonnance RSJU 822.411 Art. 5, in Kraft seit 1.7.2024 → 2026 unverändert.
//     `indexiert: false` belegt: Art. 5 al. 2 des Gesetzes sagt „Le Gouvernement PEUT
//     adapter" — Ermessen, kein Automatismus. (Volksinitiative auf 23 Fr. hängig, nicht
//     in Kraft → nicht einbauen.)
//   TI 20.00 — sektoral 20.00–20.50, konservativer unterer Wert. Decreto esecutivo vom
//     11.12.2025 (RL 843.620), in Kraft 1.1.2026.
// Verifiziert 2026-07-15 an den Volltexten der Kantonsquellen (nicht an Suchtreffern —
// Wahrheits-Disziplin: exakte Beträge).

const MINDESTLOHN = {
  GE: { chfStunde: 24.59, jahr: 2026, indexiert: true },
  NE: { chfStunde: 21.35, jahr: 2026, indexiert: true },
  JU: { chfStunde: 21.40, jahr: 2026, indexiert: false },
  BS: { chfStunde: 22.20, jahr: 2026, indexiert: true },
  // TI ist nach Branche differenziert (CHF 20.00–20.50); konservativer unterer Wert.
  // ⚠️ `indexiert: true` seit Predeploy-Runde 8 — vorher stand hier `false` mit der
  // Begründung „kein Auto-Index". Das ist sachlich falsch: LSM Art. 4 cpv. 1 ordnet die
  // jährliche LIK-Anpassung ausdrücklich an („Il salario minimo viene aggiornato
  // annualmente secondo l'indice nazionale dei prezzi al consumo"). Dass der Wert 2026
  // unverändert blieb, liegt nur daran, dass die LIK-Veränderung Nov.2025/Nov.2024
  // 0.0 % betrug — richtiges Ergebnis, falsche Begründung. Also: jährlich prüfen.
  TI: { chfStunde: 20.00, jahr: 2026, indexiert: true },
};

// 42 Std./Woche × 52 / 12 ≈ 182. Referenz für „Vollzeit" in der MINDESTLOHN-Welt:
// die kantonalen Mindestlöhne sind Stundenlöhne, der Monatsboden ist Stundenlohn × 182.
//
// ⚠️ NICHT als Nenner für den BFS-Median verwenden — das ist ein anderes Bezugssystem.
// Dafür gibt es `LSE_VOLLZEIT_STUNDEN_WOCHE` in `branchenLohn.js` (40). Bis Runde 8
// teilten sich beide Welten diese eine Konstante („eine Wahrheit, kein zweiter
// Umrechnungsweg") — gut gemeint, aber es sind zwei Normen: 6788 × 42/40 = 7127, also
// las ein 40-Std.-Vollzeitler mit exakt dem Median „über dem Median". Systematisch +5%.
export const STUNDEN_PRO_MONAT = 182;
export const VOLLZEIT_STUNDEN_WOCHE = 42;

export const LOHNCHECK_DATA_VERSION = '2026';

// ─── Der Mindestlohn-Befund kennt die Ausnahmen NICHT ────────────────────────
// Predeploy-Runde 8, zweite Batterie (swiss-precision, an den Volltexten belegt).
// Stebler-Studios-Entscheid 2026-07-15: Befund bleibt (er ordnet ein), BRIEF wird
// zurückgehalten (er beschuldigt) — bis die Ausnahmen erfasst sind.
//
// Was die App nicht weiss, und wen es trifft:
//  · **Lehre / Praktikum / unter 18** — in ALLEN drei Kantonen ausgenommen:
//    GE LIRT Art. 39J · TI LSM Art. 3 · JU RSJU 822.41 Art. 3 al. 2 („ne s'applique pas
//    … aux personnes en formation (apprentis, stagiaires)").
//    Eine Lernende in GE mit CHF 800/Monat ergibt 4.62/Std. → „unter Mindestlohn".
//  · **GAV mit beziffertem Mindestlohn** — in TI (Art. 3 cpv. 1 lit. i) und JU (Art. 3
//    al. 3) ist das Gesetz dann GAR NICHT anwendbar. Das trifft genau Gastro, Reinigung,
//    Bau — die Tieflohn-Branchen, für die das Feature gebaut wurde.
//    (GE ist anders: Art. 39L lässt den kantonalen Boden über den GAV siegen — dort ok.)
//  · **GE hat DREI Sätze, nicht einen:** 24.59 allgemein · **18.07** Landwirtschaft/
//    Floriculture (Art. 39K al. 2) · **18.44** Ferienjobs Studierender (Art. 39K al. 3,
//    NEU in Kraft 08.04.2026 nach der Volksabstimmung vom 08.03.2026, = 75 %, max. 60
//    Tage/Jahr). Der Code kennt nur den höchsten. Bei TI wurde bewusst der UNTERE Wert
//    genommen (20.00) — bei GE steht der obere.
//  · **Ferien-/Feiertagszuschläge:** alle drei definieren den Boden OHNE sie (GE Art. 39K
//    al. 5 · TI Decreto 11.12.2025 · JU). Bei Stundenlohn enthält das Monatseinkommen
//    diese ~14 % → der abgeleitete Stundenlohn ist zu hoch → verpasste Unterschreitungen.
//    Sichere Richtung (kein Fehlalarm), darum kein Blocker.
//
// Solange das gilt, darf aus dem Befund KEIN Brief an einen Arbeitgeber entstehen:
// er würde Leute beschuldigen, die korrekt zahlen. Der Befund selbst formuliert darum
// vorsichtig und nennt die Ausnahmen (`lohnCheck.ausnahmen`).
//
// Zum Wieder-Einschalten nötig: Sektor + Status erfassen (Lehre/Praktikum/unter 18/GAV/
// Landwirtschaft/Ferienjob), GE-Sätze differenzieren, je Satz ein amtlicher Beleg.
// Dann hier auf `true` — der Brief-Code selbst ist gebaut, geprüft und getestet.
export const WAGECLAIM_BEREIT = false;

export function kantonHatMindestlohn(kanton) {
  return kanton in MINDESTLOHN;
}

export function getMindestlohn(kanton) {
  return MINDESTLOHN[kanton] || null;
}

// ⚠️ NICHT für den Mindestlohn-Befund verwenden — nimmt blind eine Vollzeit-Anstellung an
// (182 Std./Monat). Bei Teilzeit ergibt das einen Fehlalarm: CHF 3000 bei 50% sind in
// Wirklichkeit CHF 32.97/Std., nicht CHF 16.48/Std. Für alles, was Nutzerinnen gezeigt oder
// in einen Brief geschrieben wird, gilt `pruefeStundenlohn(lohn, wochenstunden, kanton)` —
// sie meldet fehlende Stunden ehrlich als 'unvollstaendig', statt zu raten.
// Bleibt nur als reine Referenz-Rechnung (Vollzeit-Monatslohn vs. Vollzeit-Mindestlohn).
export function pruefeLohn(monatslohnChf, kanton) {
  const ml = MINDESTLOHN[kanton];
  if (!ml) return { status: 'keinGesetz', kanton };

  const stundenChf = monatslohnChf / STUNDEN_PRO_MONAT;
  const mindestMonat = ml.chfStunde * STUNDEN_PRO_MONAT;

  if (monatslohnChf < mindestMonat) {
    return {
      status: 'unterMindestlohn',
      kanton,
      lohnStunde: Math.round(stundenChf * 100) / 100,
      mindestStunde: ml.chfStunde,
      mindestMonat: Math.round(mindestMonat),
      differenzMonat: Math.round(mindestMonat - monatslohnChf),
      jahr: ml.jahr,
    };
  }

  return {
    status: 'ok',
    kanton,
    lohnStunde: Math.round(stundenChf * 100) / 100,
    mindestStunde: ml.chfStunde,
    jahr: ml.jahr,
  };
}

export function alleMindestlohnKantone() {
  return Object.entries(MINDESTLOHN).map(([k, v]) => ({
    kanton: k,
    ...v,
    monatBrutto: Math.round(v.chfStunde * STUNDEN_PRO_MONAT),
  }));
}

// Wochenstunden → Monats-/Jahresstunden (52 Wochen / 12 Monate)
export function stundenAufMonat(stundenProWoche) {
  const w = Number(stundenProWoche) || 0;
  return Math.round((w * 52 / 12) * 10) / 10;
}

export function stundenAufJahr(stundenProWoche) {
  const w = Number(stundenProWoche) || 0;
  return Math.round(w * 52);
}

// Stundenlohn aus Monatslohn + tatsächlichen Wochenstunden (genauer als die 182h-Annahme).
// Prüft gegen den kantonalen Mindestlohn, falls vorhanden.
//
// WAHRHEITS-DISZIPLIN — die Einkommensart entscheidet, WAS behauptet werden darf:
// Die Mindestlöhne oben sind BRUTTO-Stundenlöhne. Der Feld-Hinweis zu `monthlyIncome` rät
// ausdrücklich zu Netto („Netto ist was auf Ihrem Konto ankommt"). Ein Netto-Lohn gegen den
// Brutto-Boden gerechnet erklärt korrekt bezahlte Leute für unterbezahlt: GE, CHF 4'000
// netto auf 42 Std. → 21.98/Std. < 24.59 → Warnung + Brief; brutto wären das ~4'550 =
// 25.00/Std., also legal. Dieser Befund geht per Einschreiben an einen Arbeitgeber.
//
// ABER: Die Basis ist nur für EINE Richtung nötig. Brutto ist IMMER ≥ netto (netto =
// brutto − Abzüge). Also gilt für jede Basis: der echte Bruttolohn ist ≥ dem erfassten Wert.
//   · Erfasster Stundenlohn ≥ Boden  → 'ok' ist BEWEISBAR, egal welche Basis.
//     Wer netto schon darüber liegt, liegt brutto erst recht darüber.
//   · Erfasster Stundenlohn < Boden  → nur mit ausdrücklichem 'brutto' belegt.
//     Bei netto/unbekannt kann der echte Bruttolohn darüber liegen → 'basisUnklar'.
//
// ⚠️ Predeploy-Runde 8, ZWEITE Batterie (Rechts-Prüfer, gegen den Fix selbst): Der erste
// Fix prüfte die Basis VOR der Rechnung und gab bei netto immer 'basisUnklar' zurück.
// Damit war GE/CHF 8'000 netto (= 43.96/Std., klar über dem Boden) „unklar" und der
// Verdachts-Brief wurde angeboten — derselbe Fehler wie vorher bei 'ok', nur umgezogen.
// Ein halber Fix ist ein Fehler.
//
// Richtige Fehlerrichtung bleibt: wer den Parameter vergisst, bekommt im Zweifelsfall
// Schweigen statt einer Falschanschuldigung.
// Vorbild im Haus: `AlvRechner` (braucht brutto), `SozialhilfeRechner` (braucht netto) —
// beide prüfen `finanzen.incomeType` und befüllen bei falscher Basis nicht vor.
export function pruefeStundenlohn(monatslohnChf, stundenProWoche, kanton, einkommensart) {
  const lohn = Number(monatslohnChf) || 0;
  const stundenMonat = stundenAufMonat(stundenProWoche);
  if (lohn <= 0 || stundenMonat <= 0) return { status: 'unvollstaendig' };

  const lohnStunde = Math.round((lohn / stundenMonat) * 100) / 100;
  const ml = MINDESTLOHN[kanton];
  const base = { lohnStunde, stundenMonat, kanton };
  if (!ml) return { ...base, status: 'keinGesetz' };

  // Über dem Boden ist die Unterschreitung arithmetisch ausgeschlossen — ohne Basis-Frage.
  if (lohnStunde >= ml.chfStunde) {
    return { ...base, status: 'ok', mindestStunde: ml.chfStunde, jahr: ml.jahr };
  }

  // Darunter: nur ein ausdrückliches 'brutto' belegt die Unterschreitung.
  if (einkommensart !== 'brutto') {
    return { ...base, status: 'basisUnklar', einkommensart: einkommensart || null };
  }

  return {
    ...base,
    status: 'unterMindestlohn',
    mindestStunde: ml.chfStunde,
    mindestMonat: Math.round(ml.chfStunde * stundenMonat),
    differenzMonat: Math.round(ml.chfStunde * stundenMonat - lohn),
    jahr: ml.jahr,
  };
}
