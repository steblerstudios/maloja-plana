// Laufende Abläufe im Kalender (Entwurf «Zeitleiste», Abschnitt G, Mockups 23.10.2026; gebaut auf
// Zuruf von Stebler Studios 27.10.2026): ein begonnener, nicht fertiger Ablauf liegt als grünes
// Band über der Tagesleiste und, wenn er eine Frist im Kalender hat, als grüner Bogen im Jahreskreis.
//
// Was der Kalender weiss, und nicht mehr: der Stand speichert nur «Schritt n» und «fertig»
// (utils/ablaufStand.js), kein Anfangsdatum. Das Band beginnt darum heute — ein früherer Anfang
// wäre erfunden. Es endet an der Frist, die der Ablauf selbst in den Kalender gelegt hat
// (Erinnerung mit `ablauf: name`, seit 27.10.2026). Ohne Frist läuft es nur im laufenden Monat
// bis zum Monatsende aus; in späteren Monaten steht es nicht, weil niemand weiss, wie lange.
//
// «Begonnen» heisst: es gibt einen gespeicherten Stand. Er entsteht erst, wenn man im Ablauf
// weiterblättert (UmzugAblauf: setStand). Nur ansehen legt nichts an.
// Im Beispiel und beim Ausprobieren (`vorlaeufig`) gibt es keinen gespeicherten Stand — kein Band.

// Schrittzahl als Zahl statt Import aus AblaufSchale.jsx, damit der Kalender die Ablauf-Schale
// nicht mitlädt. Ein Test hält sie gleich mit PASS_SCHRITTE.
export const ABLAEUFE_MIT_STAND = [
  { name: 'umzug', total: 4, titelKey: 'umzug.title' },
];

// Liest den Stand wie ablaufStandLaden (utils/ablaufStand.js), aber ohne Import: sonst würde
// ablaufStand.js zu einer eigenen geteilten Datei, deren Name im Startbündel steht (+0.01 kB).
// Ein Test hält Schlüssel und Regeln gleich. null = kein gespeicherter Stand (nicht begonnen).
export const gespeicherterStand = (name, total) => {
  try {
    const roh = JSON.parse(localStorage.getItem('or5_ablauf_' + name) || 'null');
    if (!roh || typeof roh !== 'object') return null;
    const n = Number(roh.schritt);
    return { schritt: Number.isInteger(n) && n >= 0 && n < total ? n : 0, fertig: roh.fertig === true };
  } catch {
    return null;
  }
};

// [{ name, total, titelKey, schritt (ab 1), frist: ISO | null }]
export const laufendeAblaeufe = (reminders, vorlaeufig, heute) => {
  if (vorlaeufig) return [];
  const liste = Array.isArray(reminders) ? reminders : [];
  return ABLAEUFE_MIT_STAND.flatMap((a) => {
    const stand = gespeicherterStand(a.name, a.total);
    if (!stand || stand.fertig) return [];
    const frist = liste
      .filter((r) => r && r.ablauf === a.name && !r.done && typeof r.dueDate === 'string' && r.dueDate >= heute)
      .map((r) => r.dueDate)
      .sort()[0] || null;
    return [{ ...a, schritt: stand.schritt + 1, frist }];
  });
};

const iso = (jahr, monat, tag) => jahr + '-' + String(monat + 1).padStart(2, '0') + '-' + String(tag).padStart(2, '0');

// Lage des Bands im Monat (monat 0–11) als Tage: { vonTag, bisTag, weiterLinks, weiterRechts }.
// weiterLinks: kommt aus dem Vormonat; weiterRechts: läuft über den Monat hinaus oder ohne Frist aus.
// null: in diesem Monat kein Band.
export const bandImMonat = (ablauf, jahr, monat, heute) => {
  const erster = iso(jahr, monat, 1);
  const letzter = iso(jahr, monat, new Date(jahr, monat + 1, 0).getDate());
  if (!ablauf.frist && heute.slice(0, 7) !== erster.slice(0, 7)) return null;
  const von = heute > erster ? heute : erster;
  const bis = ablauf.frist && ablauf.frist < letzter ? ablauf.frist : letzter;
  if (von > letzter || bis < von) return null;
  return {
    vonTag: Number(von.slice(8)),
    bisTag: Number(bis.slice(8)),
    weiterLinks: von === erster && heute < erster,
    weiterRechts: !ablauf.frist || ablauf.frist > letzter,
  };
};
