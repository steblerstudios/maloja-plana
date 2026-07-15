// Kantonale Mindestlöhne (CHF/Stunde, brutto), Stand per 1.1.2026 — offiziell verifiziert:
//   GE 24.59 (ge.ch, jährlich CPI-indexiert)      · NE 21.35 (ne.ch, jährlich indexiert)
//   BS 22.20 (bs.ch, jährlich indexiert)          · JU 21.40 (jura.ch, kein Auto-Index,
//     letzte Erhöhung 1.7.2024, per Regierungsentscheid → 2026 unverändert gültig)
//   TI 20.00 (ti.ch, sektoral 20.00–20.50; konservativer unterer Wert, kein Auto-Index)
// Verifiziert 2026-07 an den offiziellen Kantonsquellen (Wahrheits-Disziplin: exakte Beträge).

const MINDESTLOHN = {
  GE: { chfStunde: 24.59, jahr: 2026, indexiert: true },
  NE: { chfStunde: 21.35, jahr: 2026, indexiert: true },
  JU: { chfStunde: 21.40, jahr: 2026, indexiert: false },
  BS: { chfStunde: 22.20, jahr: 2026, indexiert: true },
  // TI ist nach Branche differenziert (CHF 20.00–20.50); konservativer unterer Wert
  TI: { chfStunde: 20.00, jahr: 2026, indexiert: false },
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
// WAHRHEITS-DISZIPLIN — `einkommensart` ist Pflicht für jeden Befund:
// Die Mindestlöhne oben sind BRUTTO-Stundenlöhne. Ein Netto-Einkommen ist damit nicht
// vergleichbar — und der Feld-Hinweis zu `monthlyIncome` rät ausdrücklich zu Netto
// („Netto ist was auf Ihrem Konto ankommt"). Ein Netto-Lohn gegen den Brutto-Boden
// gerechnet erklärt korrekt bezahlte Leute für unterbezahlt: GE, CHF 4'000 netto auf
// 42 Std. → 21.98/Std. < 24.59 → Warnung + Brief; brutto wären das ~4'550 = 25.00/Std.,
// also legal. Dieser Befund geht per Einschreiben an einen Arbeitgeber.
// Ist die Art NICHT gesetzt, ist die Basis unbekannt — sie als brutto zu lesen hiesse,
// das Gegenteil dessen anzunehmen, wozu die App geraten hat. Beides ⇒ 'basisUnklar'.
// Nur ein ausdrückliches 'brutto' berechtigt zu einem Befund.
//
// Das ist auch die richtige Fehlerrichtung: wer den Parameter vergisst, bekommt
// Schweigen statt einer Falschanschuldigung.
// Vorbild im Haus: `AlvRechner` (braucht brutto), `SozialhilfeRechner` (braucht netto) —
// beide prüfen `finanzen.incomeType` und befüllen bei falscher Basis nicht vor.
export function pruefeStundenlohn(monatslohnChf, stundenProWoche, kanton, einkommensart) {
  const lohn = Number(monatslohnChf) || 0;
  const stundenMonat = stundenAufMonat(stundenProWoche);
  if (lohn <= 0 || stundenMonat <= 0) return { status: 'unvollstaendig' };
  if (einkommensart !== 'brutto') {
    return { status: 'basisUnklar', kanton, einkommensart: einkommensart || null };
  }

  const lohnStunde = Math.round((lohn / stundenMonat) * 100) / 100;
  const ml = MINDESTLOHN[kanton];
  const base = { lohnStunde, stundenMonat, kanton };
  if (!ml) return { ...base, status: 'keinGesetz' };

  if (lohnStunde < ml.chfStunde) {
    return {
      ...base,
      status: 'unterMindestlohn',
      mindestStunde: ml.chfStunde,
      mindestMonat: Math.round(ml.chfStunde * stundenMonat),
      differenzMonat: Math.round(ml.chfStunde * stundenMonat - lohn),
      jahr: ml.jahr,
    };
  }
  return { ...base, status: 'ok', mindestStunde: ml.chfStunde, jahr: ml.jahr };
}
