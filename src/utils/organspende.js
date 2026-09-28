// Organspende — eine Wahrheit: `notfall.organDonor`.
//
// Bis 27.09.2026 gab es zwei Felder für dieselbe Sache: `notfall.organDonor` im Kapitel
// Notfall (Dossier, Export und Wanderrucksack lesen es) und `organStatus` auf der Seite
// Organspende. Die Seite zeigte ohne gespeicherte Wahl «Registriert» als vorausgewählt —
// eine Aussage über die Person, die sie nie gemacht hat. Ab jetzt lesen und schreiben beide
// Orte `notfall.organDonor`; die Organ-Auswahl bleibt in `organDonation`.
//
// Die Werte folgen den Möglichkeiten, die das BAG heute nennt (erweiterte Zustimmungs-
// regelung; gelesen 27.09.2026 auf bag.admin.ch, «Organspende nach dem Tod: Halten Sie
// Ihren Entscheid schriftlich fest»): alle Organe und Gewebe, nur bestimmte, keine Spende,
// Entscheid einer Vertrauensperson übertragen. Dazu «noch nicht entschieden».
// Leer heisst: noch nicht festgehalten — kein Wert wird vorausgewählt.
export const ORGAN_ENTSCHEIDE = ['yes', 'partial', 'declined', 'delegated', 'undecided'];

export function organEntscheid(data) {
  const wert = data?.notfall?.organDonor;
  return ORGAN_ENTSCHEIDE.includes(wert) ? wert : '';
}

export const organOptionen = (t) => [
  { key: 'heart', label: t('organ.heart') },
  { key: 'lungs', label: t('organ.lungs') },
  { key: 'liver', label: t('organ.liver') },
  { key: 'kidneys', label: t('organ.kidneys') },
  { key: 'corneas', label: t('organ.cornea') },
  { key: 'bone', label: t('organ.boneMarrow') },
];

// Die gewählten Organe in Wörtern — für Seite, QR, Dossier und Export aus einer Hand.
// Schlüssel ohne Etikett (aus älteren Daten) bleiben stehen: eine Angabe für den Notfall wird
// nicht stillschweigend weggelassen, nur weil ihr Wort fehlt. Der Freitext kommt mit Inhalt.
export function organListe(t, organs = {}) {
  const etikett = Object.fromEntries(organOptionen(t).map(o => [o.key, o.label]));
  const liste = Object.keys(organs || {})
    .filter(k => k !== 'other' && organs[k])
    .map(k => etikett[k] || k);
  const freitext = String(organs?.other ?? '').trim();
  if (freitext) liste.push(freitext);
  return liste;
}

// Die Migration v4 → v5 steht in utils/organspendeMigration.js — eigenes Modul, weil sie beim
// Start läuft und das Startbündel keine Luft hat (27.09.2026: 64,99/65 kB).
