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

const STUNDEN_PRO_MONAT = 182;

export const LOHNCHECK_DATA_VERSION = '2026';

export function kantonHatMindestlohn(kanton) {
  return kanton in MINDESTLOHN;
}

export function getMindestlohn(kanton) {
  return MINDESTLOHN[kanton] || null;
}

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
export function pruefeStundenlohn(monatslohnChf, stundenProWoche, kanton) {
  const lohn = Number(monatslohnChf) || 0;
  const stundenMonat = stundenAufMonat(stundenProWoche);
  if (lohn <= 0 || stundenMonat <= 0) return { status: 'unvollstaendig' };

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
