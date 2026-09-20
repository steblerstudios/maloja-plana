# Messung: 3D-Lebensbaum mit three.js — 20.09.2026

**Auftrag:** Vor dem Entscheid «bauen wir den Baum räumlich?» echte Zahlen statt Schätzung.
Arbeitsbaum `_werkbank/baum3d`, Zweig `mess/baum-3d`, Basis `origin/main` (`c423ed8`).
Nichts davon gehört nach `main` — es ist ein Prototyp zum Anschauen und Messen.

## Was gebaut wurde

`src/Baum3D.jsx` — ein Lebensbaum in three.js, nach unseren Regeln statt nach denen der
Vorlage (`maloja plana/wachsender-baum-3d.html`):

- three.js liegt als **eigene Abhängigkeit** bei, wird von unserem Server geliefert.
  Kein `esm.sh`, kein `unpkg`. Die Messseite trägt dieselbe strenge Regel wie die App
  (`script-src 'self'`) und läuft damit.
- **Elf Hauptäste, einer je Lebensbereich**, verteilt nach dem Goldenen Winkel (137,5°).
  Jeder Ast trägt die Frucht seines Bereichs in dessen Farbe, hell und dunkel getrennt.
- **Gewachsen wird nach Ausfüllstand, nicht nach der Uhr.** Jeder Ast folgt dem Stand
  *seines* Bereichs; beim Öffnen wächst der Baum einmal ruhig ein (1,6 s), bei
  «weniger Bewegung» steht er sofort.
- **Keine Dauerschleife.** Gezeichnet wird nur, wenn sich etwas ändert.
- Drehen mit Maus/Finger **und Pfeiltasten**; ohne 3D-Fähigkeit liefert die Komponente
  `null`, der Aufrufer zeigt dann den flachen Baum.

## Die Zahlen

Gemessen auf diesem Mac, Build vom 20.09., `vite build`:

| | Wert |
|---|---|
| Hauptdatei vorher | 63,1 KB gzip |
| Hauptdatei nachher | 63,6 KB gzip — **die Grenze von 65 KB hält** |
| Baum-Stück (three.js + Komponente), nachgeladen | **542 KB roh · 137 KB gzip** |
| Liefert der Server komprimiert? | **ja**, live gemessen: `content-encoding: gzip` |
| Ein Baum: Zeichendauer | **1,95 ms** im Mittel, 7,8 ms schlechtestes Bild → 60 Hz locker |
| Ein Baum: Dreiecke / Zeichenaufrufe | 19 600 / 390 |
| **Elf Bäume** in einer Fläche: Zeichendauer | **13,66 ms** im Mittel, 20,8 ms schlechtestes → **reicht nicht für 60 Hz** |
| Elf Bäume: Dreiecke / Zeichenaufrufe | 202 460 / 4 038 |

⚠️ **Grenze der Messung:** Das ist ein Mac, kein altes Telefon. Die Zahl für einen Baum hat
Luft, die für elf Bäume hat keine. Auf einem Telefon fällt beides tiefer aus — ungemessen.

## Zwei Funde, die ohne Bauen nicht sichtbar gewesen wären

1. **Schwebende Teile beim Wachsen.** Erster Lauf: bei niedrigem Stand hingen Aststücke in
   der Luft. Grund: die Äste schrumpften zum Nullpunkt der Szene statt zu ihrem eigenen
   Ansatz. Behoben — jeder Ast wächst jetzt aus seinem Elternast heraus, und was an einer
   Spitze hängt, erscheint erst, wenn der Ast steht. Genau die Regel aus der Baum-Notiz vom
   07.07.: **nichts schwebt.**
2. **Eine Kennzahl, die nichts unterschied.** Die erste Leistungsmessung zählte Bilder pro
   Sekunde und gab 0 — weil der Browser einen Tab im Hintergrund ausbremst. Sie mass den
   Tab, nicht den Baum. Ersetzt durch die **Zeichendauer je Bild**, die direkt gemessen wird.

## Was daraus folgt

- **Ein Baum im Dashboard: technisch tragbar.** Preis ist ein einmaliger Nachlade-Vorgang von
  137 KB und die dritte Abhängigkeit überhaupt (bisher nur React und React-DOM).
- **Elf Bäume räumlich: heute nicht.** 4 038 Zeichenaufrufe sind zu viel. Machbar wäre es nur,
  wenn man alle Äste zu wenigen Formen zusammenfasst — eigenes Vorhaben, nicht nebenbei.
  Der Obstgarten bleibt vorerst flach; er ist die Übersicht, nicht die Nahaufnahme.
- Offen, falls es weitergeht: Stamm oben sauber auslaufen lassen (endet heute stumpf),
  Krone dichter, Früchte etwas früher reif, und ein Blick auf ein echtes Telefon.
