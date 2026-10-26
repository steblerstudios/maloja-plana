// Notfallpass vorbereiten (23.09.2026, Entscheid Stebler Studios vom 22.09.)
//
// Eine Pflege im Kapitel Notfall, zwei Ausgänge: der vCard-QR fürs Papier (Notfall-Dossier)
// und dieses Blatt für den Bildschirm. Keine App kann den Notfallpass (iPhone) befüllen —
// er wird von Hand eingetragen. Maloja legt die Angaben dafür bereit, Feld für Feld.
//
// 🛑 Eine Quelle: die WERTE kommen aus getNotfallDossierPreview() — derselben Funktion, aus
// der Dossier, QR und Vorlesekarte lesen. Hier steht nur die Zuordnung «Feld im Notfallpass
// ← Feld in Maloja» (`feld`), keine zweite Feldliste mit eigener Formatierung.
//
// Reihenfolge und Feldnamen: belegt an Apples Hilfe (gelesen 23.09.2026):
//   support.apple.com/de-ch/guide/iphone/iph08022b194/ios — «Erstelle einen Notfallpass mit
//   Angaben zu körperlichen Beschwerden, Medikamenten, Allergien, Blutgruppe, Notfallkontakten
//   und anderen Informationen»; Name und Geburtsdatum stehen in den Gesundheitsinfos.
//   support.apple.com/de-ch/guide/iphone/iph08022b192/ios — Notfallkontakt wird unter
//   «Notfallkontakte» hinzugefügt (aus den Kontakten gewählt, mit Beziehung).
// Die genaue Maske auf dem Gerät ist NICHT an einer Apple-Quelle belegt; darum folgt die
// Reihenfolge dem Satz oben, nicht einer Erinnerung an den Bildschirm.
//
// Satz «Notruf … nur in den USA und in Kanada» (i18n `notfallpass.iphoneNotruf`): belegt an
//   support.apple.com/de-ch/guide/iphone/iph08022b192/ios, gelesen 24.09.2026 (Deploy-Gate
//   0.1.40-beta): «Dein iPhone und deine Apple Watch können automatisch deinen Notfallpass
//   während eines Notrufs (nur USA und Kanada) und persönlich mit Ersthelfenden teilen» und
//   «können bei einem Notruf automatisch geteilt (nur USA und Kanada) … werden». Gegenprobe:
//   dieselbe Adresse mit erfundener Kennung (iphzzzz99999) liefert eine Seite OHNE diesen Satz.
//
// Bewusst NICHT abgebildet: Organspende (bei Apple nur die US-Registrierung «Donate Life»),
// Hausarzt, Spital, Krankenkasse, Vorsorge — dafür nennt die Quelle kein Feld.

export const NOTFALLPASS_GRUPPEN = [
  {
    key: 'profil',
    felder: [
      { key: 'name', feld: 'basis.name' },
      { key: 'geburtsdatum', feld: 'basis.dateOfBirth' },
    ],
  },
  {
    key: 'pass',
    felder: [
      { key: 'erkrankungen', feld: 'notfall.chronicDiseases' },
      { key: 'medikamente', feld: 'notfall.medications' },
      { key: 'allergien', feld: 'notfall.allergies' },
      { key: 'blutgruppe', feld: 'notfall.bloodType' },
      { key: 'kontaktName', feld: 'notfall.emergencyContact' },
      { key: 'kontaktTelefon', feld: 'notfall.emergencyPhone' },
    ],
  },
];

// Nimmt die Abschnitte aus getNotfallDossierPreview() und gibt die Gruppen des Blatts zurück,
// je Feld mit `wert` (String) oder `wert: ''`, wenn nichts erfasst ist.
// Ein Platzhalter («Keine Kontaktperson hinterlegt») ist keine Angabe der Person: er erscheint
// nicht als Wert, sonst würde er in den Notfallpass kopiert.
export function notfallpassFelder(abschnitte) {
  const zeilen = new Map();
  for (const a of abschnitte || []) {
    for (const r of a.rows || []) {
      if (r.feld && !r.platzhalter && !zeilen.has(r.feld)) zeilen.set(r.feld, String(r.value ?? '').trim());
    }
  }
  return NOTFALLPASS_GRUPPEN.map(g => ({
    key: g.key,
    felder: g.felder.map(f => ({ ...f, wert: zeilen.get(f.feld) || '' })),
  }));
}

// inZwischenablage lebt seit 26.10.2026 in utils/zwischenablage.js (das Dashboard braucht sie, und Rollup
// zog sonst diese ganze Datei samt Feldlisten ins Startbündel). Hier nur weitergereicht.
export { inZwischenablage } from './zwischenablage.js';
