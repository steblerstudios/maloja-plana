// «Jährlich erinnern» auf der Seite Prämienverbilligung (Fassung 5, Entscheid Sophie 23.10.2026):
// in JEDEM Schritt des IPV-Wegs, nicht erst nach der Verfügung. Legt «Prämienverbilligung fürs
// nächste Jahr prüfen» als jährliche Aufgabe auf die Merkliste. Reine Logik, kein React.

import { loadTodos } from '../utils/merkliste.js';

export const IPV_ERINNERUNG_LINK = 'premium';

// Ein Tag ein Jahr nach dem Ausgangsdatum — dieselbe Rechnung wie vorher fürs Kalender-Angebot
// (Verfügungs-Datum + 1 Jahr, ohne Verfügung heute + 1 Jahr). In UTC gerechnet, damit kein
// Zeitzonen-Sprung den Tag verschiebt; ein 29. Februar wird im Folgejahr zum 1. März (wie
// Date.setFullYear vorher).
export const tagInEinemJahr = (iso, heute = new Date()) => {
  const m = typeof iso === 'string' && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const [j, mo, d] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [heute.getFullYear(), heute.getMonth() + 1, heute.getDate()];
  return new Date(Date.UTC(j + 1, mo - 1, d)).toISOString().slice(0, 10);
};

// Der Merkpunkt. `tag` und `wiederholung` sind zusätzliche Felder für die Verknüpfung
// Merkliste ↔ Kalender (Zweig feat/f5-merkliste-kalender). Die heutige addTodo-Funktion legt
// nur {text, link} ab und lässt sie fallen — kein Fehler, kein Bruch alter Einträge.
// Doppelt wird nichts: addTodo erkennt einen offenen Punkt mit gleichem Text und Link.
export const ipvErinnerung = (t, datum, heute) => ({
  text: t('ipvStatus.reminderTitle'),
  link: IPV_ERINNERUNG_LINK,
  tag: tagInEinemJahr(datum, heute),
  wiederholung: 'jaehrlich',
});

// Liegt die Erinnerung schon offen auf der echten Merkliste? Dann zeigt der Knopf gleich
// «Erinnerung gesetzt», auch nach dem Verlassen der Seite. Im Beispiel nie (die echte Liste
// bleibt dort unsichtbar).
export const erinnerungLiegtSchon = (titel, vorlaeufig) => {
  if (vorlaeufig) return false;
  return loadTodos().some((i) => i && !i.done && i.text === titel && (i.link || null) === IPV_ERINNERUNG_LINK);
};
