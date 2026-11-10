// Bugsuche 09.11.2026, Fund 2 · Listen, die ganz geschrieben werden (Merkliste, Kalender),
// übernehmen Änderungen aus einem ANDEREN Maloja-Tab. Sonst hielt ein Tab die Liste vom
// Öffnen fest, und die nächste Änderung dort überschrieb, was der andere Tab dazugelegt
// hatte. K116 (fremdeAenderung.js) schützt nur Angaben und Dokumente; dies ergänzt es für
// die zwei Listen.
//
// Das `storage`-Ereignis kommt nur in den übrigen Tabs an, nie im schreibenden selbst.
// `key === null` heisst `localStorage.clear()`. Schreibt dieser Tab danach dieselbe Liste
// zurück, ändert sich der Wert nicht und es entsteht kein Ping-Pong.
import { useEffect, useRef } from 'react';

export const fremdeListeHandler = (key, laden, setzen) => (e) => {
  if (!e || (e.key !== key && e.key !== null)) return;
  setzen(laden());
};

// aktiv=false (Beispiel, Ausprobieren, von aussen gereichte Liste): nichts übernehmen.
export const useFremdeListe = (key, laden, setzen, aktiv = true) => {
  const ref = useRef({ laden, setzen });
  ref.current = { laden, setzen };
  useEffect(() => {
    if (!aktiv || typeof window === 'undefined') return undefined;
    const handler = fremdeListeHandler(key, () => ref.current.laden(), (v) => ref.current.setzen(v));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, aktiv]);
};
