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

---

# Zweite Runde, 20.09. — Stamm, Krone, Wuchsphasen

Auftrag von Stebler Studios nach der ersten Runde: **Stamm fertig machen, Krone dichter,
die Wuchsphasen sichtbar.**

## Was sich geändert hat

- **Stamm.** Läuft jetzt über seine ganze Länge verjüngt aus (0,30 → 0,035) und geht oben in
  einen **Gipfeltrieb** über, statt stumpf abgeschnitten zu enden. Unten ein **Wurzelanlauf**
  aus neun Strängen, damit er nicht wie ein eingesteckter Stab wirkt.
- **Krone dichter — und zugleich billiger.** Drei Kindäste auf den oberen Ebenen, vier
  Verzweigungs-Ebenen, 14 Blätter je Astspitze: **2782 Blätter** statt vorher rund 600.
  Sie werden als **eine Sammelform** gezeichnet (`InstancedMesh`), ebenso Knospen, Blüten und
  die Früchte je Lebensbereich.
- **Sechs benannte Wuchsphasen**, alle an einer Stelle im Code (`PLAN`), damit Name und Bild
  nie auseinanderlaufen: Keimling (mit zwei Keimblättern) · Stamm und Äste · Knospen ·
  **Blüte vor dem Laub**, wie beim Obstbaum · Früchte · Ausgewachsen. Jeder Ast durchläuft
  sie mit dem Stand **seines** Lebensbereichs.
- Früchte hängen tiefer als der Blattschopf — sie tragen die Bedeutung und dürfen nicht
  im Grün verschwinden. Sie hängen trotzdem an der Spitze, nichts schwebt.

## Zahlen nach dem Umbau

| | vorher | nachher |
|---|---|---|
| Baum-Stück, nachgeladen | 137,2 KB gzip | **139,7 KB gzip** |
| Hauptdatei | 63,6 KB gzip | **63,6 KB gzip** (unverändert, Grenze 65 hält) |
| Dreiecke | 19 600 | **299 144** |
| Zeichenaufrufe | 390 | **720** |
| Zeichendauer je Bild | 1,95 ms | **1,29 ms** (schlechtestes 2,8 ms) |

Die Krone hat **15-mal mehr Dreiecke** und zeichnet trotzdem **schneller** — weil hunderte
Einzelformen zu wenigen Sammelformen geworden sind. Nicht die Menge kostet, die Zahl der
Aufrufe kostet.

## Dritter Fund: «sichtbar» im Datensatz, unsichtbar im Bild

Beim Heranzoomen verschwanden Blüten und Blätter vollständig — während die Zahlen sauber
`sichtbar: true` und eine gültige Grösse meldeten. Ursache: eine Sammelform wird für die
Sichtbarkeitsprüfung wie **ein** Objekt am Szenen-Nullpunkt behandelt. Fällt der Nullpunkt
aus dem Bild, fällt die ganze Form weg — mit allen hunderten Plätzen darin.

🛑 **Die Lehre ist teurer als der Fehler:** Ich hatte die Blüten zwischendurch **vergrössert**,
weil ich sie für zu klein hielt — sie waren nie zu klein, sie wurden weggeschnitten. Erst der
Blick auf die echten Zahlen (Position, Grösse, Sichtbarkeit je Platz) hat den Widerspruch
zwischen Datensatz und Bild gezeigt. **Weder das Bild allein noch die Zahl allein reichte;
gefunden hat es erst der Widerspruch zwischen beiden.**

## Weiterhin offen

- Messung auf einem **echten Telefon** — bis dahin gilt keine Aussage über Telefone.
- 720 Zeichenaufrufe kommen fast nur von den Ästen; die liessen sich je Lebensbereich zu
  einer Form zusammenfassen, wenn es nötig wird.
- Der Entscheid selbst: räumlicher Dashboard-Baum ja oder nein.
