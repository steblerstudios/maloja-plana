// ─── K7 · Speicher-Schirm für die Demo am Einstieg ────────────────────────────
// Wer auf der Code-Wand «Ohne Code ausprobieren» wählt, sieht die echte App mit
// dem Beispiel-Datensatz. Die App schreibt aber ganz normal in den Browser-Speicher
// (Thema, Erinnerungen, Auto-Save, Backups …). Damit davon NICHTS im echten Speicher
// landet, legt dieser Schirm für die Dauer der Demo eine Überlagerung darüber:
//
//   • localStorage/sessionStorage: setItem/removeItem/clear schreiben nur in eine
//     Map im Arbeitsspeicher. getItem liest zuerst die Überlagerung, dann den echten
//     Stand (so bleiben Sprache und «Einfache Ansicht» der Code-Wand erhalten).
//   • IndexedDB: open/deleteDatabase werfen — Dokumente, Backups und Migrationen
//     laufen in ihre vorhandenen Fehler-Pfade, statt etwas anzulegen oder zu löschen.
//
// Die App beendet die Demo mit einem Neuladen der Seite — dann verfällt der Schirm
// samt Überlagerung mit dem Arbeitsspeicher. Die zurückgegebene Funktion hebt ihn
// auch ohne Neuladen auf (Tests). So oder so ist der echte Speicher danach Byte für
// Byte wie vorher (belegt in src/__tests__/demoSpeicher.test.js).
//
// Ehrliche Grenze: `length` und `key(i)` zählen weiter den echten Bestand (nur die
// Speicher-Anzeige nutzt sie, lesend). or5_beta_access wird hier nie gesetzt — die
// Demo hebt das Gate nicht auf.

// Der Beispiel-Datensatz reist mit, damit die Code-Wand nur EINEN Lazy-Import braucht
// (jeder zusätzliche import() kostet Bytes im Hauptbundle).
export { DEMO_DATA } from '../config/demoData.js';

const DEMO_FEHLER = 'Demo: es wird nichts gespeichert';

// K25 · Verlassen: die Adresse zuerst auf den Einstieg zurücksetzen (ohne die zuletzt
// gesehene Ansicht, z. B. #/export; die Sprache in ?lang= bleibt), dann neu laden.
// Sonst landet, wer danach den Code eingibt, in der letzten Demo-Ansicht.
// Fix 17.09.2026: Als Klick-Handler bekam die Funktion das Klick-Ereignis als `loc`
// → Adresse «/NaN» und «reload is not a function»; die Demo liess sich über den
// Banner-Knopf nicht verlassen. Darum nur echte Orts-/Verlaufs-Objekte annehmen.
export function demoVerlassen(ort, verlauf) {
  const loc = ort && typeof ort.reload === 'function' ? ort : location;
  const hist = verlauf && typeof verlauf.replaceState === 'function' ? verlauf : history;
  hist.replaceState(null, '', loc.pathname + loc.search);
  loc.reload();
}

export function speicherAbschirmen(
  storageProto = typeof Storage !== 'undefined' ? Storage.prototype : null,
  idbProto = typeof IDBFactory !== 'undefined' ? IDBFactory.prototype : null,
) {
  const rueckbau = [];
  const ersetze = (proto, name, bauen) => {
    const original = proto[name];
    proto[name] = bauen(original);
    rueckbau.push(() => { proto[name] = original; });
  };

  if (storageProto) {
    // Je Speicher (local/session) eine eigene Überlagerung; null = «entfernt».
    const lagen = new WeakMap();
    const lage = (s) => { if (!lagen.has(s)) lagen.set(s, new Map()); return lagen.get(s); };
    ersetze(storageProto, 'getItem', (original) => function (k) {
      const m = lage(this); k = String(k);
      return m.has(k) ? m.get(k) : original.call(this, k);
    });
    ersetze(storageProto, 'setItem', () => function (k, v) { lage(this).set(String(k), String(v)); });
    ersetze(storageProto, 'removeItem', () => function (k) { lage(this).set(String(k), null); });
    ersetze(storageProto, 'clear', () => function () {
      const m = lage(this);
      for (const k of m.keys()) m.set(k, null);
      for (let i = 0; i < this.length; i++) m.set(this.key(i), null);
    });
  }

  if (idbProto) {
    const sperre = () => function () { throw new Error(DEMO_FEHLER); };
    ersetze(idbProto, 'open', sperre);
    ersetze(idbProto, 'deleteDatabase', sperre);
  }

  // Rückbau in umgekehrter Reihenfolge; ein zweiter Aufruf ist wirkungslos.
  return () => { while (rueckbau.length) rueckbau.pop()(); };
}
