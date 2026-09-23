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

// Kopiert Text in die Zwischenablage. Erst navigator.clipboard (braucht einen sicheren
// Kontext), sonst der alte Weg über ein unsichtbares Textfeld. Gibt true/false zurück und
// wirft nie — die Oberfläche sagt dann ruhig, dass von Hand abgeschrieben werden kann.
export async function inZwischenablage(text, umgebung = globalThis) {
  const wert = String(text ?? '');
  if (!wert) return false;
  try {
    const cb = umgebung?.navigator?.clipboard;
    if (cb && typeof cb.writeText === 'function') {
      await cb.writeText(wert);
      return true;
    }
  } catch {
    // weiter zum Rückfall
  }
  try {
    const doc = umgebung?.document;
    if (!doc || typeof doc.execCommand !== 'function') return false;
    const feld = doc.createElement('textarea');
    feld.value = wert;
    feld.setAttribute('readonly', '');
    feld.style.position = 'fixed';
    feld.style.opacity = '0';
    doc.body.appendChild(feld);
    feld.select();
    const ok = doc.execCommand('copy');
    doc.body.removeChild(feld);
    return !!ok;
  } catch {
    return false;
  }
}
