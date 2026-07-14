// ─── Kantonale Anlaufstellen bei Lohn-Streit ──────────────────────────────
// Belegte Stellen für den Befund→Brief (Lohn). WAHRHEITS-DISZIPLIN (Maloja ist
// Rechts-/Finanzhilfe → falsche Stelle/Frist = Haftung): nur amtlich Belegtes.
// Wo KEINE kantonale Kontrollstelle existiert, ehrlich auf Schlichtungsbehörde /
// Arbeitsgericht verweisen statt eine erfinden. Unsicheres ist als `verify: true`
// markiert und darf NICHT ungeprüft in einen versendbaren Brief.
//
// Zwei verschiedene Wege — NICHT verwechseln:
//   • Mindestlohn-Unterschreitung (wageClaim) → kantonale Kontrollstelle
//     (nur wo es ein Mindestlohngesetz gibt: GE/NE/JU/TI/BS + einzelne Gemeinden).
//   • Lohn nicht bezahlt (unpaidWage) → Schlichtungsbehörde in Arbeitsrechtssachen /
//     Arbeitsgericht am Arbeitsort (in JEDEM Kanton), notfalls Betreibung.
//     → Deshalb greift für unpaidWage NICHT die Mindestlohn-Kontrollstelle (Fix A).

// Kontrollstellen für die MINDESTLOHN-Unterschreitung (wageClaim).
// Deckungsgleich mit den Kantonen in lohnCheck.js MINDESTLOHN.
export const LOHN_KONTROLLSTELLEN = {
  GE: {
    gesetz: 'Genf — Art. 39K LIRT',
    stelle: 'OCIRT — Office cantonal de l’inspection et des relations du travail',
    verify: false,
  },
  TI: {
    gesetz: 'Tessin — Legge sul salario minimo (LSM) vom 11.12.2019, Art. 4',
    stelle: 'Ufficio dell’ispettorato del lavoro',
    verify: false,
  },
  JU: {
    gesetz: 'Jura — Loi sur le salaire minimum cantonal (seit 01.02.2018)',
    // Jura hat KEINE eigene Mindestlohn-Kontrollstelle → Arbeitsgericht.
    stelle: null,
    fallback: 'Conseil de prud’hommes (Arbeitsgericht), Porrentruy',
    hinweis: 'Das Wort „Kontrollstelle“ hier vermeiden — der Weg führt über das Arbeitsgericht.',
    verify: false,
  },
  NE: {
    gesetz: 'Neuenburg — kantonales Mindestlohngesetz (17.09.2015)',
    stelle: 'ORCT — Office des relations et des conditions de travail (mit tripartiter Kommission)',
    verify: true, // Gesetzestitel vor Versand amtlich gegenprüfen
  },
  BS: {
    gesetz: 'Basel-Stadt — kantonales Mindestlohngesetz',
    stelle: null,
    hinweis: 'BS war im ursprünglichen Stand belegt; exakter Amtstext liegt hier nicht vor.',
    verify: true, // zuständige BS-Stelle vor Versand amtlich verifizieren
  },
};

// Allgemeiner Weg bei NICHT bezahltem Lohn — gilt in jedem Kanton (Fix A).
export const UNBEZAHLTER_LOHN_WEG =
  'Schlichtungsbehörde in Arbeitsrechtssachen bzw. Arbeitsgericht am Arbeitsort; ' +
  'bei anhaltendem Zahlungsverzug allenfalls Betreibung.';

export function getLohnKontrollstelle(kanton) {
  return LOHN_KONTROLLSTELLEN[kanton] || null;
}
