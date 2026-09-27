// Abschnitte eines Kapitels: ein neuer Abschnitt beginnt bei jedem Feld mit `section`
// (das erste Feld eröffnet immer einen). Schlüssel = erstes Feld, `sek` = «mehr Felder».
// Jeder Abschnitt trägt ALLE seine Felder — auch ein «mehr Felder»-Feld ohne eigene
// Überschrift mitten in einem Hauptabschnitt (Finanzen: steuerbares Einkommen). Eine
// Quelle für die Liste und für «welche Abschnitte starten offen» (ChapterView).
export const abschnittGruppen = (fields, titel) => {
  const gruppen = [];
  (fields || []).forEach((f) => {
    if (f.section || gruppen.length === 0) {
      gruppen.push({ key: f.k, titel: f.section || titel, intro: f.sectionIntro, sek: !!f.secondary, felder: [] });
    }
    gruppen[gruppen.length - 1].felder.push(f);
  });
  return gruppen;
};
