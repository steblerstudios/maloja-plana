// Die Behördengänge im Kapitel Behörden — EINE Liste für das Kapitel (components/BehoerdenInstrument.jsx)
// und die Bereichszeile auf dem Dashboard. Seitenrundgang 26.10.2026: das Dashboard zählte die Haken
// selbst und gegen «/6», obwohl es fünf Gänge gibt; ein alter Haken (Patientenverfügung, seit #578 nicht
// mehr hier) zählte mit, der Vorschlag aus «0 offen» nicht. Eigenes Blatt, damit das Dashboard die Liste
// bekommt, ohne das nachgeladene Bauteil ins Startbündel zu ziehen.

export const GAENGE = [
  { id: 'steuererklaerung', key: 'checklist.steuererklaerung', weg: 'tax', wegKey: 'behoerdenInstrument.wegSteuern' },
  { id: 'betreibungsauszug', key: 'checklist.betreibungsauszug', weg: 'betreibungsauszug', wegKey: 'behoerdenInstrument.wegSoGehts' },
  { id: 'ausweisRenewal', key: 'checklist.ausweisRenewal', weg: 'ausweis', wegKey: 'behoerdenInstrument.wegAblauf' },
  { id: 'wohnsitzbestaetigung', key: 'checklist.wohnsitzbestaetigung' },
  { id: 'strafregisterauszug', key: 'checklist.strafregisterauszug' },
];

// «Offene Steuererklärungen» als Zahl — leer, null und Leerzeichen heissen «nicht erfasst» (wie utils/steuerfrist.js).
export const offeneErklaerungen = (behoerden) => {
  const roh = behoerden?.pendingTaxReturns;
  if (roh == null || String(roh).trim() === '') return null;
  const n = Number(String(roh).trim());
  return Number.isFinite(n) ? n : null;
};

// Welches Steuerjahr mit «0 offen» erledigt ist (Fachprüfung 25.10.2026): die erfasste Frist gilt für das Jahr davor;
// liegt sie noch vor uns, ist erst die Erklärung des Jahres davor eingereicht. Ohne Frist kein Jahr, kein Vorschlag.
export const erledigtesSteuerjahr = (behoerden, heute = new Date()) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(behoerden?.taxFilingDeadline || ''));
  if (!m || offeneErklaerungen(behoerden) !== 0) return null;
  const frist = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return frist >= new Date(heute.getFullYear(), heute.getMonth(), heute.getDate()) ? Number(m[1]) - 2 : Number(m[1]) - 1;
};

// Erledigt: eigener Haken; sonst bei «Steuererklärung eingereicht» der Vorschlag aus «0 offen» — mit Steuerjahr.
export const gangErledigt = (id, checked, behoerden, heute) =>
  checked[id] !== undefined ? !!checked[id] : (id === 'steuererklaerung' && erledigtesSteuerjahr(behoerden, heute) != null);
