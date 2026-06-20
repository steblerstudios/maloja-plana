// Kantonale Mindestlöhne (CHF/Stunde, brutto)
// Quellen: Kantonale Gesetze, ch.ch, wageindicator.org
// Stand: 2025

const MINDESTLOHN = {
  GE: { chfStunde: 24.32, jahr: 2025, indexiert: true },
  NE: { chfStunde: 21.09, jahr: 2024, indexiert: true },
  JU: { chfStunde: 21.40, jahr: 2025, indexiert: false },
  BS: { chfStunde: 21.00, jahr: 2025, indexiert: false },
  TI: { chfStunde: 19.75, jahr: 2025, indexiert: false },
};

const STUNDEN_PRO_MONAT = 182;

export const LOHNCHECK_DATA_VERSION = '2025';

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
