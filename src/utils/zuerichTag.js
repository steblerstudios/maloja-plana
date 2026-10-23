// ─── Der heutige Tag, wie er in Zürich gilt ────────────────────────────────
// Fassung 5 (23.10.2026): Das Zeichen für «Was ansteht» ist ein Kalenderblatt mit der
// Zahl des heutigen Tages. Die Zahl gilt für die Schweiz, nicht für die Uhr des Geräts:
// Wer im Ausland mit verstellter Zeitzone die App öffnet, sähe sonst um Mitternacht
// Schweizer Zeit noch den gestrigen Tag (oder schon den morgigen).
//
// Ohne Netz: `Intl` und die Zeitzonen-Daten liefert der Browser selbst mit, es wird
// nichts geladen. Fehlt die Zeitzone (sehr alte Umgebung), fällt die Zahl auf die
// Geräte-Uhr zurück — ein Kalenderblatt ohne Zahl wäre schlechter als eines, das im
// Ausnahmefall um einen Tag danebenliegt.
//
// Bewusst winzig und ohne Abhängigkeit: das Zeichen steht im fest geladenen Teil.

let format = null;

export const tagInZuerich = (jetzt = new Date()) => {
  try {
    if (!format) format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zurich', day: 'numeric' });
    const tag = parseInt(format.format(jetzt), 10);
    if (tag >= 1 && tag <= 31) return tag;
  } catch { /* Rückfall unten */ }
  return jetzt.getDate();
};
