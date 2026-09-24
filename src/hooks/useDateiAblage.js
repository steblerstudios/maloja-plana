import { useState, useRef } from 'react';

// Eine Fläche, auf die man eine Datei ziehen kann — damit «oder hier hinziehen» stimmt.
//
// Bis 24.09.2026 versprachen die KK-Karte («Bild auswählen oder hier reinziehen») und
// der Budget-Import («oder hier hinziehen») das Hineinziehen, aber keine Fläche hatte
// einen Drop-Handler: der Browser öffnete die Datei stattdessen in einem neuen Tab.
//
// `onDatei` bekommt dasselbe Ereignis-Format wie ein `<input type=file>`-onChange
// (`{ target: { files } }`), damit die vorhandenen Handler unverändert bleiben.
// `aktiv` ist wahr, solange etwas über der Fläche schwebt — für einen ruhigen Hinweis.
// Der Zähler fängt dragenter/dragleave der Kind-Elemente ab, sonst flackert `aktiv`.
export const ablageEreignis = (dataTransfer) => ({ target: { files: dataTransfer?.files || [] } });

export function useDateiAblage(onDatei) {
  const [aktiv, setAktiv] = useState(false);
  const tiefe = useRef(0);
  const props = {
    onDragEnter: (e) => { e.preventDefault(); tiefe.current += 1; setAktiv(true); },
    onDragOver: (e) => { e.preventDefault(); },
    onDragLeave: () => { tiefe.current = Math.max(0, tiefe.current - 1); if (tiefe.current === 0) setAktiv(false); },
    onDrop: (e) => {
      e.preventDefault();
      tiefe.current = 0;
      setAktiv(false);
      if (e.dataTransfer?.files?.length) onDatei(ablageEreignis(e.dataTransfer));
    },
  };
  return [props, aktiv];
}
