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

---

# Dritte Runde, 20.09. — im echten Maloja

Auftrag: «den Baum mal in Maloja sehen». Eingebaut im Dashboard unter **«Was aus Ihren
Angaben wächst»** (`DatenWirken`), als **Umschalter** neben dem heutigen Baum:

- Standard bleibt **flach**. Der heutige Baum wird nicht still ersetzt, und wer nicht
  umschaltet, lädt three.js gar nicht erst herunter (`React.lazy` + `Suspense`).
- Der Baum bekommt die **sieben Kapitel** als Äste (nicht elf Bereiche) — dieselbe Quelle,
  aus der auch der flache Baum seine Früchte zieht, inklusive Farbe und Ausfüllstand.
- Wuchsform je Frucht neu in `src/data/baumFormen.js` — eine kleine Datei **ohne** three.js,
  damit Dashboard und nachgeladener Baum dieselbe Wahrheit lesen, ohne dass three.js in die
  Hauptdatei rutscht.
- Farben aus der **Palette** statt aus erfundenen Wiesen- und Himmelfarben.

## Gemessen in der laufenden App (Beispiel-Modus, 63 % ausgefüllt)

| | Wert |
|---|---|
| Hauptdatei mit Umschalter | **63,57 KB gzip**, `size-limit` grün (Grenze 65) |
| Baum-Stück, nur beim Umschalten geladen | 139,7 KB gzip |
| Zeichendauer im Dashboard (Telefonbreite 375 px) | **0,92 ms** je Bild, schlechtestes 3,1 |
| Dreiecke / Zeichenaufrufe dort | 236 456 / 464 |
| Tests | **2327 grün** (129 Dateien) |
| Hell- und Dunkelmodus | beide geprüft, Farben aus der Palette |

⚠️ 375 px breit ist eine **Telefon-Breite auf einem Mac**, kein Telefon. Die Aussage über
echte Telefone steht weiterhin aus.

## Zwei Funde in dieser Runde

1. **`PCFSoftShadowMap` gibt es in three 0.186 nicht mehr.** Die Konsole meldete einen
   stillen Rückfall auf `PCFShadowMap`. Jetzt steht im Code, was tatsächlich gilt.
2. 🛑 **Ein zweiter Eingang im Build benennt den ersten um.** Mit `input: { main: … }` hiess
   die Hauptdatei `main-*.js`; `size-limit` sucht aber `dist/assets/index-*.js`, fand nichts
   und meldete daraufhin **einen Fehler über sich selbst statt über die Grösse** — das Gate
   hätte ab da nichts mehr gemessen. Schlüssel heisst jetzt `index`. Derselbe Stolperstein
   trifft den Service-Worker-Hash, der sich am Eingangs-Bundle orientiert.

---

# Vierte Runde, 20.09. — die Kombination beider Bäume

Auftrag: «kriegen wir die ideale Kombination der beiden Bäume hin?» Der flache Baum kann
etwas, das der räumliche nicht hatte: **Namen, Prozente, Klick ins Kapitel**. Genau das ist
jetzt beides zusammen.

**Wie:** Jeder Ast hat einen Ankerpunkt im Raum. Nach jedem Zeichnen wird er auf die Fläche
gerechnet; darüber liegen **echte Knöpfe** — keine ins Bild gemalte Schrift. Das heisst:

- **Name + Prozent an jedem Ast**, so wie am flachen Baum.
- **Klick führt ins Kapitel** — geprüft: Klick auf «Wohnen 75 %» öffnet `#/chapter/1`.
- Die Marken **folgen beim Drehen** ihrem Ast.
- Äste auf der **Rückseite treten zurück** (blasser, nicht anklickbar) — sonst drängeln
  sich Vorder- und Rückseite übereinander.
- Marken, die sich überlagern würden, **schieben sich sanft auseinander**.
- Weil es Knöpfe sind und keine Pixel, funktionieren **Tastatur und Screenreader** —
  in einer reinen Leinwand wäre beides verloren.

## Preis, gemessen

| | Wert |
|---|---|
| Zeichendauer ruhend | 0,92 ms je Bild |
| Zeichendauer **beim Drehen mit Marken** | **2,03 ms** im Mittel, 12,5 ms schlechtestes |
| Hauptdatei | **63,61 KB gzip**, `size-limit` grün |
| Baum-Stück | 140,5 KB gzip |
| Tests | 2327 grün |

Die Marken kosten rund **1 ms je Bild**, weil bei jeder Drehung sieben Knöpfe neu gesetzt
werden. Das ist tragbar; falls es je knapp wird, liessen sie sich direkt verschieben,
statt sie neu zu zeichnen.

---

# Fünfte Runde, 20.09. — Werkzeug-Früchte und das Icon in der Frucht

Auftrag: Werkzeug-Früchte dazu, und das Bereichs-Icon in die Frucht eingebaut — «sweet spot
für beides».

**Nicht neu erfunden:** Die Frucht mit ausgestanztem Icon ist **dieselbe Zeichnung, die der
flache Baum schon benutzt** (`FruchtMitIcon`). Sie wird einmal in ein Bild gerendert und im
Raum als Schildchen aufgehängt, das sich immer zur Kamera dreht. Damit ist die Bildsprache in
beiden Bäumen buchstäblich dieselbe, nicht bloss ähnlich.

- **Je Ast eine Leitfrucht** in Ast-Farbe mit dem Bereichs-Icon als Negativ (0,55 Einheiten
  bei rund 5 Einheiten Baumhöhe).
- **Werkzeug-Früchte** am selben Ast, kleiner (0,33) und später reifend — Zuordnung wie am
  flachen Baum: Steuer und Budget an Finanzen, IPV an Versicherungen, Sozialhilfe an
  Behörden, Lohn an Ausbildung, Notfall an Notfall.
- **Die Marke am Ast trägt dasselbe Icon**, dort scharf gezeichnet statt als Bild, und
  darunter die **Werkzeug-Pillen** — anklickbar, jede führt in ihr Werkzeug.

## Zahlen

| | Wert |
|---|---|
| Start-Download (Hauptdatei + geteilter Frucht-Chunk) | **63,42 KB gzip**, Grenze 65 |
| Baum-Stück | 143 KB gzip |
| Zeichendauer | **1,27 ms** je Bild, schlechtestes 8,9 |
| Schildchen mit Bild | **13 von 13** (nachgezählt, nicht geschaut) |
| Tests | 2327 grün |

## Drei Funde in dieser Runde

1. 🛑 **Ein SVG ohne `xmlns` lädt als Datenbild überhaupt nicht.** Alle 13 Schildchen blieben
   leer. Im Bild war das kaum zu sehen (die Früchte aus Geometrie hängen ja trotzdem am Baum) —
   **erst das Nachzählen** «wie viele Texturen haben Bildinhalt?» brachte die 0 zutage.
   Gegenprobe im Browser: mit Attribut lädt das Bild (64×64), ohne Attribut Fehler. React
   schreibt das Attribut nicht mit, jetzt wird es ergänzt.
2. 🛑 **Eine zweite React-Wurzel darf nicht im Lauf der ersten entstehen.** Das Rendern der
   Frucht lief aus einem `useEffect` heraus, also mitten in Reacts Durchlauf: zwei Warnungen
   im Dauerlauf («flushSync … while React was already rendering», «synchronously unmount a
   root»). Ein Schritt später (`setTimeout 0`) ist alles sauber. Gegenprobe: Szene zweimal neu
   ausgelöst, Fehlerzahl blieb bei 33 — die 33 stammen aus der Fassung davor.
3. 🛑 **Die Grössen-Grenze mass plötzlich zu wenig.** Weil beide Bäume dieselbe Frucht
   benutzen, hat der Build sie in einen **eigenen, geteilten Chunk** ausgelagert
   (`FruchtMitIcon-*.js`, 10,3 KB). Die Hauptdatei sank dadurch scheinbar von 64 auf 53 KB —
   **heruntergeladen wird beim Start aber beides**. `size-limit` prüft jetzt beide Dateien
   zusammen. Derselbe Fehlertyp wie die umbenannte Hauptdatei eine Runde zuvor: **das
   Messgerät zeigte eine Verbesserung, die keine war.**

---

# Sechste Runde, 20.09. — jede Sorte ihre eigene Frucht

Auftrag: «die Basis-Früchte sollen alle Äpfel sein, die Behörden-Früchte Pflaumen usw.»

**Das war ein echter Mangel, kein Geschmacksthema.** Der räumliche Baum kannte nur vier
Grobformen (rundlich · länglich · Beere · Büschel). Damit sahen Apfel und Aprikose gleich aus,
Birne und Zwetschge auch — und dem Baum fehlte genau das, was ihn trägt: dass jeder
Lebensbereich SEINE Schweizer Frucht hat.

**Neu `src/baumFruechte3d.js`:** elf Früchte als Drehkörper aus je einer Silhouette —
dieselbe Denkweise wie die flachen Silhouetten des Dashboards, nur um die eigene Achse
gedreht. Apfel mit Delle oben und unten · Birne mit schmalem Hals · Zwetschge länglich ·
Aprikose rund mit Naht · Baumnuss fast kugelig · Haselnuss mit Fruchtbecher · Hagebutte mit
Kelchzipfel · Heidelbeere mit Krönchen · Kirsche am langen Stiel · Traube und Vogelbeere als
Büschel aus vielen kleinen Kugeln. Die **Zuordnung Frucht → Bereich bleibt, wo sie hingehört**:
in `data/lebensbereiche.js`. Diese Datei kennt nur Körper.

Jede Frucht ist **ein** Zeichenaufruf (Fruchtfleisch und Stiel in einer Form), und die Form
bleibt in Graustufen erkennbar — das ist unser dritter Barrierefreiheits-Kanal neben Farbe
und Wort.

| | vorher | nachher |
|---|---|---|
| Fruchtformen | 4 Grobformen | **11 echte Sorten** |
| Dreiecke | 236 472 | 248 316 |
| Zeichendauer | 1,27 ms | **1,22 ms** je Bild |
| Start-Download | 63,42 KB | **63,41 KB** gzip |
| Baum-Stück | 143,0 KB | 144,2 KB gzip |
| Tests | grün | **2327 grün** |

---

# Siebte Runde, 20.09. — Reife je Frucht, Farbprüfung, Wurzeln, Borke

## 1. Jede Frucht reift einzeln

Vorher reiften alle Früchte eines Astes gleichzeitig und gleich weit. Jetzt hat **jede Frucht
ihren eigenen Reifepunkt**, gestreut über den Ausfüllstand ihres Bereichs (gemessen:
Reifebeginn zwischen **58 % und 84 %**). Und sie **wechselt dabei die Farbe**: von einem
grünen Unreif-Ton in die Bereichsfarbe.

Bei 70 % hängen also reife neben halbreifen und grünen Früchten am selben Ast — was ehrlicher
ist als «alles gleich weit» und nebenbei zeigt, dass da noch etwas kommt.
Technisch je Frucht eine eigene Farbe (`instanceColor`), ohne einen einzigen zusätzlichen
Zeichenaufruf.

## 2. Stimmen die Farben überein? — Ja, nachgesehen

`chapterAccentColor` im Dashboard ist `isDarkMode ? b.dark : b.light` aus
`data/lebensbereiche.js` — **dieselbe Quelle**, aus der auch die flachen Früchte ihre Farbe
nehmen. Der räumliche Baum bekommt genau diesen Wert durchgereicht. Hell und Dunkel getrennt.

⚠️ **Eine Abweichung, die schon vorher bestand und nicht von dieser Arbeit kommt:** Der flache
Dashboard-Baum zeichnet Stamm und Äste in `palette.sage` (grün), der Obstgarten und jetzt auch
der räumliche Baum in einem Braunton. Zwei Bildsprachen fürs Holz — das ist ein offener
Entscheid, kein Fehler.

## 3. Wurzelwerk

Von 9 kurzen Stummeln auf **12 Wurzeln**, davon jede dritte kräftig und einmal verzweigt,
dazu ein kegeliger **Wurzelanlauf**, der den Stamm unten verbreitert. Der Baum steht jetzt im
Boden, statt hineingesteckt zu sein.

## 4. Borke

Längsrippen mit zwei Oberwellen, die sich beim Hochwachsen drehen. **Gemessen: 15–19 %
Radiusschwankung** — und trotzdem sah man im Bild ein glattes Rohr, weil die weiche
Beleuchtung so etwas wegbügelt. Erst als die Struktur **zusätzlich in die Farbe** wanderte
(Furchen dunkel, Grate hell, direkt in die Geometrie gebacken), wurde sie sichtbar.

🛑 **Messfehler dabei, der Erwähnung verdient:** Mein erster Messwert sagte «64 % Schwankung»
— ich hatte den Radius **zum Weltnullpunkt** gemessen statt zur Stammachse und damit die
Neigung des Stamms mitgemessen, nicht die Rinde. Die Zahl war dreimal zu gross und hätte
die Arbeit an der Borke beendet, bevor sie anfing.

## 5. Früchte feiner

Aus 8 Stützpunkten wird über eine Spline-Kurve eine weiche Silhouette (22 Punkte, 18 Seiten),
dazu **Bauchnaht** bei Zwetschge, Aprikose und Kirsche und ein **Blütenrest** unten bei Apfel,
Birne und Hagebutte.

| | vorher | nachher |
|---|---|---|
| Dreiecke | 248 316 | **365 178** |
| Zeichendauer | 1,22 ms | **1,23 ms** je Bild |
| Start-Download | 63,41 KB | **63,41 KB** gzip |
| Tests | 2327 grün | **2327 grün** |

---

# Achte Runde, 20.09. — Proportionen nach Naturgesetz

Frage von Stebler Studios: «Stehen alle Grössen in Relation zueinander und machen Sinn —
z. B. die Äpfel gegen die Pflaumen?»

## Die Antwort war Nein, und zwar nachgerechnet

Eine Welteinheit = ein Meter (Baum 4,3 m). Gemessen gegen echte Masse:

| Frucht | angezeigt (Ø) | echt (Ø) | Faktor |
|---|---|---|---|
| Apfel | 23,0 cm | 8 cm | 2,9× |
| Zwetschge | 16,0 cm | 4 cm | 4,0× |
| Kirsche | 12,0 cm | 2,2 cm | 5,5× |
| Hagebutte | 13,6 cm | 2 cm | 6,8× |
| Haselnuss | 14,8 cm | 1,8 cm | 8,2× |
| Heidelbeere | 11,4 cm | 1,2 cm | **9,5×** |

**Der Fehler war nicht die Übertreibung, sondern ihre Ungleichheit.** Eine Heidelbeere war
fast so gross wie ein Apfel, obwohl sie in Wirklichkeit ein Siebtel misst. Dazu: Stamm
60 cm Durchmesser (echt 20–35 cm bei dieser Höhe), Blätter 23 cm (echtes Apfelblatt 7–10 cm).

## Die Regeln, nach denen es jetzt gebaut ist

1. **Potenzgesetz statt fester Faktor** (aus dem Spieldesign): angezeigt = 3,16 · echt^0,6.
   Eine 1,2-cm-Heidelbeere wäre naturgetreu ein unsichtbarer Punkt; das Potenzgesetz staucht
   die Spanne, **ohne die Reihenfolge anzutasten**. Verwandt mit Stevens' Potenzgesetz — wir
   nehmen Grössen ohnehin gestaucht wahr, nicht linear.
2. **Da-Vinci-Regel** (Leonardo, heute «pipe model»): die Querschnittsflächen der Kinderäste
   summieren sich zur Fläche des Elternastes → r_Kind = r_Eltern / √Anzahl. Vorher stand für
   zwei **und** drei Kinder derselbe Faktor 0,58; bei zweifacher Teilung verlor der Baum
   dadurch unterwegs Substanz. Jetzt 0,577 bzw. 0,707.
3. **Goldener Schnitt** für die Längen: jeder Kindast misst 1/φ = 0,618 des Elternastes.
4. **Elastische Ähnlichkeit** (McMahon 1973): Durchmesser ∝ Höhe^1,5, sonst knickt ein Baum
   unter dem eigenen Gewicht. Für 4,3 m ergibt das rund 28 cm Stammdurchmesser.
5. **Phyllotaxis 137,5°** jetzt auch zwischen Geschwisterästen (vorher sternförmig verteilt).
6. **Fibonacci** für die Anzahlen: 3 Kinderäste, dann 2; **34 Blätter** je Zweigspitze.

## Nachgemessen am fertigen Baum

| | Ziel | gemessen |
|---|---|---|
| Stamm am Fuss | ~28 cm | **28,9 cm** |
| Wurzelanlauf | breiter als Stamm | **53,9 cm** |
| Apfel / Birne | – | 10,8 cm |
| Aprikose | – | 7,3 cm |
| Baumnuss | – | 7,1 cm |
| Zwetschge | – | 6,1 cm |
| Heidelbeere | – | 3,5 cm |
| Verhältnis Apfel : Heidelbeere | echt 6,7 : 1 | **3,1 : 1** (bewusst gestaucht, Reihenfolge stimmt) |

## Wurzeln und Borke — der berechtigte Einwand

«Die Wurzeln und die Rinde sehen nicht gross anders aus» stimmte. Nachgebessert: Wurzeln
**1,9 m statt 1,35 m**, flacher auslaufend statt steil abtauchend (dadurch über dem Boden
sichtbar), und der Hell-Dunkel-Kontrast der Borke von 0,34 auf **0,52** erhöht. Am schlanken
Stamm ist beides jetzt deutlich zu sehen — vorher verschwand es an einem 60 cm dicken Rohr.

| | vorher | nachher |
|---|---|---|
| Dreiecke | 365 178 | 413 980 |
| Zeichendauer | 1,23 ms | **0,64 ms** je Bild (schlechtestes 0,8) |
| Start-Download | 63,41 KB | **63,41 KB** gzip |
| Tests | 2327 grün | **2327 grün** |

Schneller trotz mehr Dreiecken: die Blätter brauchen bei 11 cm Grösse keine 6×4-Kugel, 5×3
reicht — das spart rund 40 % der Kronen-Dreiecke, ohne dass man es sieht.

## Weiterhin offen

- Messung auf einem **echten Telefon** — bis dahin gilt keine Aussage über Telefone.
- Die **Anspruchs-Ringe** um eine Frucht (wenn ein Anspruch gedeckt ist) fehlen im räumlichen
  Baum noch.
- Bei voller Krone drängeln sich die Marken oben links; eine ruhigere Verteilung wäre möglich.
- Die vier Bereiche **ohne** eigenes Kapitel (Gesundheit, Arbeit, Familie, Vorsorge) hängen
  noch nicht am Dashboard-Baum — dort gibt es sieben Äste, nicht elf. Ihre Früchte
  (Hagebutte, Haselnuss, Kirsche, Traube) sind aber schon gebaut.
- **Holzfarbe:** grün (flacher Dashboard-Baum) gegen braun (Obstgarten und räumlicher Baum) —
  Entscheid steht aus.
- 720 Zeichenaufrufe kommen fast nur von den Ästen; die liessen sich je Lebensbereich zu
  einer Form zusammenfassen, wenn es nötig wird.
- Der Entscheid selbst: räumlicher Dashboard-Baum ja oder nein.
