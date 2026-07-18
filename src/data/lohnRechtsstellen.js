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
//
// ⚠️ BELEG-BILANZ dieses Files (Predeploy-Runde 8): Von den beiden Einträgen, die je
// tatsächlich gegengeprüft wurden, war EINER frei erfunden — für NE stand ein
// „kantonales Mindestlohngesetz (17.09.2015)", das es nicht gibt (der Mindestlohn steht
// in der LEmpl vom 25.05.2004, Art. 32a ff.). Nur `verify: true` hielt ihn aus dem Brief.
// Trefferquote der Prüfung: 1 von 2 falsch. Das ist der Massstab für alles Ungeprüfte hier.
export const LOHN_KONTROLLSTELLEN = {
  // ✅ GE/TI/JU amtlich gegengeprüft 2026-07-15 (Predeploy-Runde 8). Sie trugen `verify:false`,
  // ohne dass je ein Commit eine Prüfung behauptet hätte — vorsorglich auf `true` gesetzt und
  // dann an den Volltexten geprüft. Alle drei halten stand; die Zitierstrings sind um Erlass-
  // datum + Nummer ergänzt, denn `briefGenerator.js` druckt `gesetz` bei `verify:false`
  // WÖRTLICH in den Brief — ein Inkraftdatum als Erlassdatum zu zitieren ist angreifbar.
  //
  // ⚠️ Methoden-Merker: Eine Websuche behauptete, in JU sei „le service en charge de
  // l'économie" zuständig und könne bis CHF 30'000 büssen. Das steht NIRGENDS im JU-Recht —
  // es ist aus dem Genfer LIRT-Sanktionsartikel herübergemischt. Nur der Volltext hat das
  // aufgedeckt. Für dieses File gilt: **Suchtreffer sind Fundhinweis, nie Beleg.**
  GE: {
    // LIRT Art. 39K „Montant du salaire minimum" — Volltext geprüft (silgeneve.ch).
    gesetz: 'Genf — Loi sur l’inspection et les relations du travail (LIRT) vom 12.03.2004, Art. 39K (RS-GE J 1 05)',
    // RIRT Art. 1 (RS-GE J 1 05.01) benennt das Amt. 💡 LIRT Art. 39M nennt ZWEI zuständige
    // Stellen: „L'office et l'inspection paritaire des entreprises" — das OCIRT ist
    // zuständig, aber nicht allein.
    stelle: 'OCIRT — Office cantonal de l’inspection et des relations du travail',
    verify: false, // geprüft 2026-07-15: LIRT RS-GE J 1 05 · RIRT J 1 05.01 · Art. 39M
  },
  TI: {
    // LSM Art. 4 „Fissazione del salario minimo differenziato" — Volltext-PDF geprüft.
    gesetz: 'Tessin — Legge sul salario minimo (LSM) vom 11.12.2019, Art. 4 (RL 843.600)',
    // ⚠️ Die Stelle steht NICHT in der LSM: Art. 6 cpv. 1 delegiert nur („Il Consiglio di
    // Stato designa l'organo di controllo competente"). Benannt wird sie erst im RLSM
    // vom 18.11.2020 (RL 843.610) Art. 6.
    stelle: 'Ufficio dell’ispettorato del lavoro',
    // ⚠️ MERKER 01.01.2027: Das RLSM wird auf diesen Termin AUFGEHOBEN (RL-Eintrag
    // „843.610 ABROGAZIONE (BU 2026, 241), 01.01.2027") — damit fällt die Rechtsgrundlage
    // weg, die das UIL benennt; ein Nachfolger ist im RL nicht ausgewiesen. Vor jedem
    // Deploy nach 2026 neu prüfen. Nebenbei: die kantonale Mindestlohn-Webpräsenz und die
    // Online-Meldung von „abusi salariali" laufen über das USML — ein ANDERES Amt als das
    // rechtlich bezeichnete UIL.
    verify: false, // geprüft 2026-07-15: LSM RL 843.600 Art. 4 · RLSM RL 843.610 Art. 6
  },
  JU: {
    // Volltext geprüft (RSJU 822.41, 8 Artikel): „Loi sur le salaire minimum cantonal du
    // 22 novembre 2017"; Fussnote 2 nennt den 01.02.2018 als INKRAFTTRETEN — das stand
    // bisher als Erlassdatum im Zitat.
    gesetz: 'Jura — Loi sur le salaire minimum cantonal vom 22.11.2017 (RSJU 822.41)',
    // ✅ `stelle: null` ist POSITIV belegt, nicht bloss angenommen: Gesetz (8 Artikel) und
    // Ordonnance d'exécution vom 10.05.2022 (RSJU 822.411, 6 Artikel) enthalten weder einen
    // Kontroll- noch einen Sanktionsartikel und benennen keine Behörde.
    stelle: null,
    // ✅ „Porrentruy" ist wörtlich belegt und generisch richtig — die frühere Sorge
    // („zuständig sei das Gericht am Arbeitsort, Delémont/Franches-Montagnes fehlen") ist
    // WIDERLEGT: Jura hat einen EINZIGEN Tribunal de première instance, und der Kanton
    // selbst nennt Porrentruy für alle Arbeitsorte (jura.ch/DES/SEE):
    // „…peut saisir le Conseil de prud'hommes (Tribunal de première instance), à Porrentruy."
    fallback: 'Conseil de prud’hommes (Arbeitsgericht), Porrentruy',
    hinweis: 'Das Wort „Kontrollstelle“ hier vermeiden — der Weg führt über das Arbeitsgericht.',
    verify: false, // geprüft 2026-07-15: RSJU 822.41 + 822.411 Volltext · jura.ch/DES/SEE
  },
  NE: {
    // Gegengeprüft 2026-07-15 an rsn.ne.ch + ne.ch: Neuenburg hat KEIN eigenes
    // Mindestlohngesetz (der frühere Eintrag „Mindestlohngesetz (17.09.2015)“ war falsch).
    // Der Mindestlohn steht in der LEmpl von 2004, Art. 32a ff.; Grundlage ist Art. 34a Cst. NE
    // („lutter contre la pauvreté“). Das Gesetz benennt keine Kontrollstelle — der Kanton
    // nennt dafür auf ne.ch den Secteur contrôle des ORCT.
    gesetz: 'Neuenburg — Loi sur l’emploi et l’assurance-chômage (LEmpl) vom 25.05.2004, Art. 32a ff. (RSN 813.10)',
    stelle: 'ORCT — Office des relations et des conditions de travail, Secteur contrôle',
    verify: false,
  },
  BS: {
    // Gegengeprüft 2026-07-15 an gesetzessammlung.bs.ch + bs.ch/wsu/awa: Gesetz über den
    // kantonalen Mindestlohn (MiLoG) vom 13.01.2021, SG 812.200, in Kraft seit 01.07.2022,
    // jährlich indexiert. Zuständig ist das AWA, Team Arbeitsmarktaufsicht (ami.awa@bs.ch).
    gesetz: 'Basel-Stadt — Gesetz über den kantonalen Mindestlohn (MiLoG) vom 13.01.2021 (SG 812.200)',
    stelle: 'Amt für Wirtschaft und Arbeit (AWA), Team Arbeitsmarktaufsicht',
    verify: false,
  },
};

// Allgemeiner Weg bei NICHT bezahltem Lohn — gilt in jedem Kanton (Fix A).
export const UNBEZAHLTER_LOHN_WEG =
  'Schlichtungsbehörde in Arbeitsrechtssachen bzw. Arbeitsgericht am Arbeitsort; ' +
  'bei anhaltendem Zahlungsverzug allenfalls Betreibung.';

export function getLohnKontrollstelle(kanton) {
  return LOHN_KONTROLLSTELLEN[kanton] || null;
}
