// Hausarzt aus dem Kapitel Notfall — EINE Lesestelle für alle Ausgänge.
//
// Das Kapitel erfasst Ärztinnen und Ärzte als LISTE (`doctorsList`, DoctorManager: Name, Fachrichtung, Telefon);
// die alten Textfelder `doctor` / `doctorPhone` bleiben nur als Rückfall für frühere Einträge.
// Seitenrundgang 26.10.2026 (D14): Dossier, Notfall-QR, Rucksack und der Kapitel-Satz lasen nur `doctor`.
// Wer den Hausarzt über die Liste erfasst hatte — der einzige Weg, den das Kapitel anbietet —, fehlte dort.
// Dasselbe Muster wie bei den Medikamenten (dossierGenerator.js, medikamenteText, 23.09.2026).
//
// Die Ausgänge beschriften die Zeile mit «Hausarzt». Darum zählen nur Einträge mit Fachrichtung Hausarzt
// (fehlende Fachrichtung = Hausarzt, wie im DoctorManager); eine Zahnärztin erscheint dort nicht als Hausarzt.

const istHausarzt = (x) => x && typeof x.name === 'string' && x.name.trim() !== '' && (x.specialty || 'hausarzt') === 'hausarzt';

export const hausaerzteAusListe = (notfall) =>
  (Array.isArray(notfall?.doctorsList) ? notfall.doctorsList : []).filter(istHausarzt);

const text = (v) => (typeof v === 'string' ? v.trim() : '');

// Name(n) des Hausarztes: aus der Liste, sonst das alte Feld. Leer → ''.
export const hausarztName = (notfall) => {
  const liste = hausaerzteAusListe(notfall);
  if (liste.length) return liste.map((x) => x.name.trim()).join(', ');
  return text(notfall?.doctor);
};

// Telefon(e) dazu: aus denselben Listeneinträgen, sonst das alte Feld. Leer → ''.
export const hausarztTelefon = (notfall) => {
  const liste = hausaerzteAusListe(notfall);
  if (liste.length) return liste.map((x) => text(x.phone)).filter(Boolean).join(', ');
  return text(notfall?.doctorPhone);
};
