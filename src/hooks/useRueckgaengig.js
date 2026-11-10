import { useState, useEffect, useRef } from 'react';

// «Entfernt · Rückgängig» — aus der Merkliste herausgelöst (Entscheid C, §15), damit jede Liste,
// die auf einen Tipp löscht, denselben Weg zurück hat. Gefragt wird nie: kein «Wirklich
// löschen?», keine Browser-Dialoge (keineBrowserDialoge.test.js). Der Eintrag ist sofort weg,
// die Meldung bleibt rund fünf Sekunden stehen, ein Tipp holt ihn an dieselbe Stelle zurück.
//
// Der Hook merkt sich nur { item, index, text }. Zurückgelegt wird beim Tipp über die Liste,
// die der Aufrufer DANN hat — nicht über eine beim Löschen eingefangene: wer in den fünf
// Sekunden noch etwas anderes ändert, verliert es sonst beim Rückgängig.
export const RUECKGAENGIG_MS = 5000;

export const useRueckgaengig = (ms = RUECKGAENGIG_MS) => {
  const [entfernt, setEntfernt] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const merke = (eintrag) => {
    clearTimeout(timer.current);
    setEntfernt(eintrag);
    timer.current = setTimeout(() => setEntfernt(null), ms);
  };
  // `zuruecklegen` bekommt { item, index } und schreibt die Liste selbst.
  const rueckgaengig = (zuruecklegen) => {
    if (!entfernt) return;
    clearTimeout(timer.current);
    zuruecklegen(entfernt);
    setEntfernt(null);
  };
  return { entfernt, merke, rueckgaengig };
};

// Setzt `item` an seine alte Stelle, höchstens ans Ende, wenn die Liste inzwischen kürzer ist.
// Steht es noch drin (das Löschen wurde nicht übernommen), bleibt die Liste, wie sie ist —
// sonst stünde der Eintrag danach doppelt da.
export const wiederEinsetzen = (liste, item, index) => {
  const neu = Array.isArray(liste) ? [...liste] : [];
  if (neu.includes(item)) return neu;
  neu.splice(Math.max(0, Math.min(index, neu.length)), 0, item);
  return neu;
};

// Die Meldung nur, solange der Eintrag wirklich fehlt. Nicht jedes Löschen kommt an: im Beispiel
// verwirft main.jsx jede Änderung (`updateData` → `if (demoMode) return`). Ohne diese Prüfung
// stünde dort «Entfernt», während der Eintrag sichtbar stehen bleibt. Verglichen wird das Objekt
// selbst — gelöscht wird überall mit `filter`, das die übrigen Einträge unverändert lässt.
export const nochEntfernt = (entfernt, liste) =>
  (entfernt && !(Array.isArray(liste) && liste.includes(entfernt.item)) ? entfernt : null);
