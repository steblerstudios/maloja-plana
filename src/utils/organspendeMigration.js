// Organspende — Migration v4 → v5 (eine Wahrheit: notfall.organDonor, siehe utils/organspende.js).
// Eigenes Modul: läuft beim Start, darum ohne Etiketten und Helfer — das Startbündel hat keine Luft.

// Migration v4 → v5. Überführt nur, was eine Aussage der Person trägt — und nur so weit,
// wie sie sie gemacht hat (Fachprüfung 27.09.2026):
//   - 'declined' (Kapitel «Widersprochen» oder Seite) → Ablehnung; sie hat keinen Umfang.
//   - Kapitel 'yes' («Organspender registriert? Ja») sagt nicht, welche Organe → leer,
//     mit Bitte um Bestätigung. «Zustimmung — alle» wäre eine neue Aussage.
//   - Kapitel 'no' («nicht registriert») heisst nicht «ich lehne ab» → leer.
//   - Seite 'registered' war der Standard ohne Wahl, 'not_registered' ist kein Entscheid → leer.
//   - Kapitel 'yes' gegen Seite 'declined': zwei ausdrückliche, gegensätzliche Aussagen
//     werden nicht still zu einer → leer, mit Bitte um Bestätigung.
// Nichts geht verloren: die alten Werte stehen unverändert in `_organspendeVorV5`.
export function organspendeMigrieren(data) {
  const alt = data.notfall?.organDonor;
  const altStatus = data.organStatus;
  if (alt === undefined && altStatus === undefined) return data;

  const ablehnung = alt === 'declined' || altStatus === 'declined';
  const widerspruch = alt === 'yes' && altStatus === 'declined';
  // 'undecided' gab es nur in rm («Betg decidì») — eine ausdrückliche Wahl, sie bleibt.
  const neu = alt === 'undecided' ? 'undecided' : ablehnung && !widerspruch ? 'declined' : '';

  const notfall = { ...(data.notfall || {}) };
  if (neu) notfall.organDonor = neu;
  else delete notfall.organDonor;

  const aus = { ...data, notfall };
  delete aus.organStatus;
  aus._organspendeVorV5 = {
    organDonor: alt ?? null,
    organStatus: altStatus ?? null,
    bitteBestaetigen: alt === 'yes',
    // Warum: «umfang» = altes Ja ohne Organe · «widerspruch» = Ja im Kapitel, Ablehnung auf der Seite
    grund: widerspruch ? 'widerspruch' : alt === 'yes' ? 'umfang' : null,
  };
  return aus;
}
