// Pfade der Brotkrume — nur Daten, damit main.jsx sie lesen kann, ohne die Darstellung
// ins Hauptbündel zu ziehen (die Brotkrume selbst liegt in den nachgeladenen Ansichten;
// im Hauptbündel kostete sie 0,57 kB, gemessen 25.09.2026 bei 3,86 kB Luft).
//
// EINE Quelle für die Pfade: welche Ansicht unter welcher hängt, und wie jede heisst.
// Alle Beschriftungen gibt es schon in fünf Sprachen; neu ist nur der Name der
// Navigation für Screenreader (`nav.pfad`).
export const PFADE = Object.freeze({
  // F7-S2 (27.10.2026): Lebensmappe, Behörden- und Notfall-Dossier sind eine Seite «Unterlagen drucken» mit drei
  // Auswahlen. Bis dahin standen hier drei Pfade; das Notfall-Dossier hing unter Notfall (Runde 5, «ein Ort»).
  drucken:          { eltern: 'tresor',         titel: 'unterlagen.drucken.title' },
  briefe:           { eltern: 'tresor',         titel: 'briefe.title' },
  notfallpass:      { eltern: 'notfalleinstieg', titel: 'notfallpass.title' },
  notfallkarte:     { eltern: 'notfalleinstieg', titel: 'notfallkarte.title' },
  // F7-S10 (27.10.2026): die drei Vorsorge-Formulare unter Notfall — die Stufe führt zum Block «Vorsorge».
  patientenverfuegung: { eltern: 'notfallvorsorge', titel: 'pv.ui.title' },
  bestattung:       { eltern: 'notfallvorsorge', titel: 'bw.ui.title' },
  organ:            { eltern: 'notfallvorsorge', titel: 'organ.title' },
  // Runde 9 AB (25.10.2026): Versicherungs-Übersicht unter dem Kapitel Versicherungen.
  praemien:         { eltern: 'versicherungskapitel', titel: 'po.title' },
});

// Kurze Namen der Eltern-Ansichten. «Notfall» statt des Einstiegs-Titels, der eine Frage ist
// («Was brauchen Sie im Notfall?») und als Stufe zu lang wäre.
// F7-S4 (Sophie 27.10.2026): Die Dossiers und Briefe hängen unter der «Dokumentenablage» — vorher eine Stufe
// «Meine Unterlagen», die es als eigenen Ort nicht gibt (nur eine Umleitung auf die Ablage).
export const ELTERN_TITEL = Object.freeze({
  tresor: 'nav.tresor',
  notfalleinstieg: 'chapters.notfall.title',
  versicherungskapitel: 'chapters.versicherungen.title',
  notfallvorsorge: 'chapters.notfall.title',
});

// Rechner in der Form X (F7-A2, Entscheid 24.10./27.10.2026): Ansicht → Kapitel (CHAPTER_KEYS), unter dem
// sie in der Brotkrume steht. Die Hülle components/RechnerForm.jsx zeichnet «Übersicht › Kapitel › Rechner»
// selbst; main.jsx lässt darum «← Übersicht» weg. Ein Eintrag hier = der Rechner ist umgestellt.
export const RECHNER_KAPITEL = Object.freeze({
  alv: 'finanzen',
  eo: 'finanzen',
  stundenlohn: 'finanzen',
  kreditkarte: 'finanzen',
  mietzins: 'wohnen',
  stipendien: 'ausbildung',
  vorsorge: 'versicherungen',
  schulden: 'finanzen',
  sozialhilfe: 'finanzen',
  kvg: 'versicherungen',
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
