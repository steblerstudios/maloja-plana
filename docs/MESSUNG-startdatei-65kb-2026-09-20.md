# Messung: die Startdatei und der 65-KB-Deckel — 20.09.2026

**Auslöser:** Die gemeinsame Fokus-Falle (Bau-Liste O17) riss den Deckel: 65,5 kB gegen
65 kB. Die Frage war nicht «wie sparen wir 496 Byte», sondern **woraus die Startdatei
eigentlich besteht** — vorher hatte das niemand gemessen, nur geschätzt.

**Messweg:** `vite build --sourcemap`, dann die Quellkarte segmentweise ausgewertet und
die erzeugten Bytes den Quelldateien zugerechnet. Das Skript liegt nicht im Repo; es ist
20 Zeilen VLQ-Dekodierung und in einer halben Stunde wieder gebaut, wenn es jemand
erneut braucht.

> 🛑 **Die Tabelle unten ist roh, nicht gzip — und «für die Verhältnisse reicht das»
> stimmte nicht.** Hier stand genau dieser Satz; er ist falsch und bleibt als Beleg
> stehen. Wer nach Rohanteilen plant, überschätzt jeden Gewinn. Gemessen:
>
> | Änderung | roh | gzip | Verhältnis |
> |---|---:|---:|---:|
> | MobileNav nachladen (hier gemessen) | 10,6 KB | 2,88 kB | 3,7 : 1 |
> | 23 Icons entfernt (Sitzung «Dashboard-Audit») | 14,4 KB | 1,42 kB | 10,1 : 1 |
> | Werkzeugwand aus Dashboard (dieselbe Sitzung) | 8,6 KB | 1,22 kB | 7,0 : 1 |
>
> Die beiden unteren Zahlen sind **nicht von mir nachgebaut** — sie stammen aus einem
> eigenen Arbeitsbaum der Sitzung «Maloja Dashboard Audit», gemessen auf derselben
> Basis (64,96 kB). Der Grund für das schlechte Verhältnis bei den Icons ist
> einleuchtend: bei `_finanzen` sind von 11 KB nur ~2 KB echte Pfaddaten, der Rest
> ist 41× dieselbe `createElement`-Hülse — und genau die frisst gzip weg.
> **Rohanteile taugen zum Finden der Kandidaten, nicht zum Planen des Gewinns.**

## Woraus die Startdatei besteht

Stand vor dem Durchgang: 257,4 KB roh · 65,5 kB gzip.

| Quelle | roh | Anteil |
|---|---:|---:|
| `src/IconSystem.jsx` | 55,8 KB | 21,7 % |
| `src/Dashboard.jsx` | 55,3 KB | 21,5 % |
| `src/main.jsx` | 48,5 KB | 18,8 % |
| `src/config/constants.js` | 20,3 KB | 7,9 % |
| `src/config/cantonalData.js` | 14,3 KB | 5,5 % |
| `src/MobileNav.jsx` | 10,6 KB | 4,1 % |
| `src/i18n/index.js` | 7,3 KB | 2,8 % |
| `src/BetaGate.jsx` | 5,3 KB | 2,0 % |
| `src/hooks/useFocusTrap.js` | 1,27 KB | 0,5 % |

**Die Fokus-Falle war nicht die Ursache.** Sie war der Tropfen auf ein Fass, das zu
99,94 % voll war — die Basis davor lag bei 64,96 kB, also 40 Byte unter dem Deckel.

## Was gemacht wurde: die Menü-Schubladen nachladen

`MobileNav.jsx` trägt beide Schubladen (Menü und Einstellungen). Beide sind erst nach
einem Griff zum Menü zu sehen, lagen aber fest in der Startdatei.

- In `main.jsx` auf `React.lazy` umgestellt — das ist dort bereits Hausmuster
  (20+ Komponenten).
- Beide Einhänge-Stellen auf `offen && <Suspense fallback={null}>` gesetzt. Das `&&` ist
  nicht Kosmetik: ohne es lüde das Stück schon beim Start und der Gewinn wäre keiner.
- **Vorladen im Leerlauf** nach dem ersten Bild (`requestIdleCallback`, Rückfall
  `setTimeout`). Damit ist das Stück da, bevor jemand tippt — die Ersparnis bleibt, das
  Stocken kommt gar nicht erst.

| | gzip |
|---|---:|
| vor der Fokus-Falle | 64,96 kB |
| mit Fokus-Falle | 65,50 kB ⛔ |
| **mit nachgeladener MobileNav** | **62,68 kB ✅** |

Luft unter dem Deckel: **2,3 kB** statt 40 Byte.

## 🛑 Was NICHT gemacht wurde: das Icon-Register aufteilen

`IconSystem.jsx` ist der grösste Posten. Der Grund ist strukturell: `_iconFactories` ist
**ein Objektliteral mit allen 72 Icons**, `Icons` wird per `Object.fromEntries` daraus
abgeleitet. Ein Bundler kann daraus nichts weglassen — jedes Icon reist mit, auch wenn
der erste Bildschirm 29 braucht.

Der naheliegende Schluss wäre: die Icons, die im fest geladenen Teil nicht vorkommen,
auslagern. **Zwei Messungen sagen, dass das so nicht geht.**

**Erstes Messgerät — Textsuche** über die 44 Dateien, die laut Quellkarte fest in der
Startdatei liegen: 39 Icons belegt, 33 Kandidaten zum Auslagern.

**Zweites Messgerät — Laufzeit.** Ein `Proxy` um das Register zeichnete auf, welche
Icons tatsächlich abgefragt werden. Nach Beta-Wand und Dashboard: 29 Stück.

Der Vergleich ist der ganze Befund:

> **`emergency` wird zur Laufzeit gebraucht — die Textsuche hatte es als
> Auslagerungs-Kandidaten geführt.**

Also hätte eine Aufteilung auf dieser Grundlage auf dem ersten Bildschirm ein
Piktogramm fehlen lassen. Die Ursache steht in `src/Baum3D.jsx:13`:

```js
ipv: 'praemienverbilligung', sozial: 'sozialhilfe', notfall: 'emergency',
```

Der 3D-Lebensbaum bildet Bereichs-Schlüssel auf Icon-Namen ab. Er liegt in einem
nachgeladenen Stück — **wird aber sofort mit dem Dashboard geladen**, weil räumlich seit
#246 der Standard ist.

### Die zwei Lehren, die über die Icons hinausgehen

1. **«Liegt in einem nachgeladenen Stück» heisst nicht «wird später gebraucht».**
   Ein Stück kann nachgeladen sein und trotzdem zur ersten Sekunde gehören.
2. **Icon-Namen sind hier überwiegend dynamisch** — `Icons[ch.key]`, `Icons[item.icon]`,
   `Icons[tool.icon]`, `Icons[b.iconName]`. Eine Textsuche nach Namen kann belegen, was
   gebraucht *wird*, aber nie, was *nicht* gebraucht wird.

### 🛑 Und der Gewinn wäre klein — 1,42 kB, nicht «40 % von 55,8 KB»

Das war die zweite Korrektur an diesem Blatt. Nach Rohanteilen sah das Icon-Register
nach dem grossen Fang aus. Gemessen sind es **1,42 kB gzip** für 23 entfernte Icons
(Zahl aus der Sitzung «Dashboard-Audit», siehe Kasten oben). Das ist **weniger als die
Hälfte dessen, was das blosse Nachladen der Menü-Schubladen gebracht hat** — bei
ungleich höherem Risiko. Damit ist der Icon-Umbau nicht nur vertagt, sondern
**nachrangig**: er steht in der Liste unten zu Recht zuunterst.

### 🔗 Die Glyphen-Schicht zieht in die Gegenrichtung

Unterhalb der Icons liegt eine Schicht, die die `ICON_KONVENTION` bisher nicht
kennt: **rohe Unicode-Zeichen direkt im Text.** Eigene Zählung über `src/**/*.jsx`
(ohne Tests), eingeteilt danach, ob das Zeichen per `+` an den Text geklebt ist:

| | Anzahl |
|---|---:|
| **an Text geklebt** (nicht abschirmbar) | **289** |
| davon `ⓘ` | 114 |
| davon `→` · `·` · `✓` | 60 · 41 · 33 |
| eigenes Kind (per `aria-hidden` abschirmbar) | 158 |
| **gesamt** | **447** |

Am stärksten betroffen: `ChapterView.jsx` (39), `PremiumSubsidy.jsx` (21),
`VorsorgeRechner.jsx` (18), `SozialhilfeView.jsx` (16), `TaxCalculator.jsx` (16).

Geklebte Zeichen lassen sich **nicht verstecken, nur ersetzen** — ein Screenreader
liest bei jedem Hinweis den Zeichennamen mit, und `ⓘ` rendert je nach System anders.
Der Weg dorthin ist im Haus schon gegangen: `SozialhilfeView.jsx:33`

```js
const praefix = (name, size) => React.createElement(Icon, { name, size, style: {…} });
```

`Icon` setzt `aria-hidden` selbst — ein Ersatz löst beide Probleme auf einmal.

**Erledigt am selben Abend: `ⓘ` ist abgearbeitet, 122 Fundstellen → 4.** Baustein
`hinweisZeichen()` in `IconSystem.jsx`, Wächter in
`src/__tests__/glyphenImText.test.js`, Hergang und die vier begründeten Reste in
[`ICON_KONVENTION.md`](ICON_KONVENTION.md). **Kosten am Bündel: 0,08 kB** — das
Piktogramm lag ohnehin drin. Übrig: 175 geklebte Zeichen (`→` 60, `·` 41, `✓` 32 …),
für die der Wächter einen nur sinkenden Höchststand hält.

**Und genau darum darf der Icon-Abbau nicht zuerst kommen.** `praefix` ruft im selben
Bild `'rechner'` und `'kaestchen'` auf — **beide stehen auf der 23er-Abbau-Liste.**
Wer erst 23 Icons entfernt und danach 289 Glyphen durch Icons ersetzt, holt einen Teil
davon sofort zurück, und `info` (für die 114 `ⓘ`) wandert dabei von «nachgeladen» nach
«fest». **Reihenfolge: erst die Glyphen ersetzen, dann neu messen, was übrig ist.**

### Was eine echte Lösung bräuchte

Solange Icons über einen zur Laufzeit gebildeten Schlüssel geholt werden, braucht die
App das ganze Register. Ein Ausweg wäre ein Icon je Datei plus ein Lade-Register
(`import('./icons/' + name + '.js')`) — das macht jeden Icon-Abruf asynchron und bringt
Nachzieh-Effekte ins Bild. **Das ist ein eigener Durchgang, kein Nebenher.**
Vertagt auf Oktober; die Zahlen dafür stehen oben.

## Was daraus für den Deckel folgt

Der Deckel ist keine willkürliche Zahl mehr, sondern hat eine Landkarte. Die nächsten
Kandidaten, falls es wieder eng wird — in dieser Reihenfolge, weil das Verhältnis aus
Gewinn und Risiko so am besten steht:

1. `Dashboard.jsx` (55,3 KB roh) — der zweitgrösste Posten und noch nie durchgesehen.
   Ein Teilstück ist schon vermessen: die Werkzeugwand herauszulösen bringt **1,22 kB**.
2. `main.jsx` (48,5 KB roh) — trägt Router, Zustand und Boden-Navigation in einer Datei.
3. `constants.js` (20,3 KB roh) — Paletten und Kapitel; Teile davon dürften nur tief in
   der App gebraucht werden, mit demselben Beweis-Problem wie bei den Icons.
4. Das Icon-Register **zuletzt** — 1,42 kB für den grössten Umbau und das grösste
   Risiko, und erst sinnvoll, wenn die Glyphen-Schicht ersetzt ist (siehe oben).

**Vor jedem dieser Schritte gilt: den Gewinn messen, nicht aus dem Rohanteil ableiten.**
Das Verhältnis schwankt zwischen 3,7 : 1 und 10,1 : 1 — raten heisst hier, sich um das
Dreifache zu irren.

**Den Deckel anzuheben war bewusst nicht der erste Griff.** Er ist ein Gate; wer ihn
hebt, statt zu messen, hebt ihn beim nächsten Mal wieder.
