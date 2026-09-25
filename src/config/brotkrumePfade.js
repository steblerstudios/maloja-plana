// Pfade der Brotkrume — nur Daten, damit main.jsx sie lesen kann, ohne die Darstellung
// ins Hauptbündel zu ziehen (die Brotkrume selbst liegt in den nachgeladenen Ansichten;
// im Hauptbündel kostete sie 0,57 kB, gemessen 25.09.2026 bei 3,86 kB Luft).
//
// EINE Quelle für die Pfade: welche Ansicht unter welcher hängt, und wie jede heisst.
// Alle Beschriftungen gibt es schon in fünf Sprachen; neu ist nur der Name der
// Navigation für Screenreader (`nav.pfad`).
export const PFADE = Object.freeze({
  lebensmappe:      { eltern: 'unterlagen',      titel: 'lebensmappe.title' },
  behoerdendossier: { eltern: 'unterlagen',      titel: 'behoerdenDossier.title' },
  notfalldossier:   { eltern: 'unterlagen',      titel: 'notfallDossier.title' },
  briefe:           { eltern: 'unterlagen',      titel: 'briefe.title' },
  notfallpass:      { eltern: 'notfalleinstieg', titel: 'notfallpass.title' },
});

// Kurze Namen der Eltern-Ansichten. «Notfall» statt des Einstiegs-Titels, der eine Frage ist
// («Was brauchen Sie im Notfall?») und als Stufe zu lang wäre.
export const ELTERN_TITEL = Object.freeze({
  unterlagen: 'nav.unterlagen',
  notfalleinstieg: 'chapters.notfall.title',
});

// Die Stufen als Daten — prüfbar ohne DOM.
export const stufen = (view) => {
  const pfad = PFADE[view];
  if (!pfad) return null;
  return [
    { ziel: 'dashboard', titel: 'nav.backToDashboard' },
    { ziel: pfad.eltern, titel: ELTERN_TITEL[pfad.eltern] },
    { ziel: null, titel: pfad.titel },
  ];
};
