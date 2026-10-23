// «Jährlich erinnern» auf der Seite Prämienverbilligung (Fassung 5, Entscheid Stebler Studios 23.10.2026):
// in JEDEM Schritt des IPV-Wegs, nicht erst nach der Verfügung. Legt «Prämienverbilligung fürs
// nächste Jahr prüfen» als jährliche Aufgabe auf die Merkliste. Reine Logik, kein React.

import { loadTodos, einJahrSpaeter } from '../utils/merkliste.js';

export const IPV_ERINNERUNG_LINK = 'premium';

// Ein Tag ein Jahr nach dem Ausgangsdatum (Verfügungs-Datum, sonst heute als lokaler Tag).
// Dieselbe Regel wie beim Abhaken einer jährlichen Aufgabe: aus dem 29. Februar wird der 28.
export const tagInEinemJahr = (iso, heute = new Date()) => {
  const m = typeof iso === 'string' && /^(\d{4}-\d{2}-\d{2})/.exec(iso);
  const p = (n) => String(n).padStart(2, '0');
  return einJahrSpaeter(m ? m[1] : heute.getFullYear() + '-' + p(heute.getMonth() + 1) + '-' + p(heute.getDate()));
};

// Der Merkpunkt, mit `tag` und `wiederholung` aus dem Merkpunkt-Modell (utils/merkliste.js):
// er steht in der Merkliste und an seinem Tag in «Was ansteht»; beim Abhaken entsteht er ein
// Jahr später neu. Doppelt wird nichts: addTodo erkennt einen offenen Punkt mit gleichem Text und Link.
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
  // Auch eine offene jährliche Aufgabe in einer anderen Sprache zählt (sonst nach Sprachwechsel doppelt).
  return loadTodos().some((i) => i && !i.done && (i.link || null) === IPV_ERINNERUNG_LINK
    && (i.text === titel || i.wiederholung === 'jaehrlich'));
};
