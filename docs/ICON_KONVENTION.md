# Icon-Konvention (Maloja Plana)

Bestätigt im Icon-Audit 2026-07-07. Ziel: ruhige, konsistente Icons ohne
„AI-Slop", ohne die skeuomorphen Metaphern zu verwässern.

## Zwei Klassen — die Trennlinie

**1. Funktionale UI-Icons** → **ein Outline-Set.**
- `viewBox="0 0 24 24"`, `fill: none`, `stroke: currentColor` (oder Palette-Farbe).
- Runde Enden/Ecken: `strokeLinecap: round`, `strokeLinejoin: round`.
- **Massstab ist die optische Strichstärke am Renderpunkt, nicht dieselbe Zahl.**
  Ziel ~1,1–1,4 px optisch. Formel: `strokeWidth = zielOptisch × 24 / renderPx`.
  Beispiele: 14 px → ~2,0 · 16 px → ~1,8 · 24 px → ~1,4. Kleine Icons brauchen
  eine höhere `strokeWidth`, damit sie nicht wispy wirken.
- Nie gefüllte Flächen, wo Outline gemeint ist (der Fehler beim alten Zahnrad,
  Raster, Lautsprecher).
- Wiederverwenden statt duplizieren: geteilte Komponenten unter `src/components/`
  (`TrustLockIcon.jsx` = Vertrauens-Schloss, `TwoRingsIcon.jsx` = verheiratet).
- Referenz-Set: die Boden-Nav-Icons in `main.jsx` (`bottomIcon`, stroke 1.6, rund).

**2. Skeuomorphe Metaphern** → **detailliert, NICHT vereinheitlichen.**
- Die 11 Bereichs-Icons in `IconSystem.jsx` (Kompass, Säule, Chalet …),
  die Früchte (`FruchtStufe/Silhouette`), Arztkoffer, Bundesordner/Aktenmappen,
  der sich füllende Ordner (`DocumentTresor` `OrdnerIcon`).
- Dürfen feine Linien, Füllungen, mehrere Strichstärken und viewBox 48 nutzen —
  das ist die „Swiss Living Skeuomorphism"-Sprache, kein Audit-Ziel.

**3. Wortmarke** (Gipfel-M) → kein Icon, unangetastet lassen.

## Illustration / Daten-Viz
Baum, Landschaft, Charts, Loader sind Illustrationen bzw. Daten-Visualisierung,
kein funktionales Icon — eigene Regeln. Für Charts gilt: **Achsen immer
beschriften** (was + Einheit), Ticks zeigen (siehe Vorsorge-Zukunftsgraph).

## Beim Hinzufügen eines neuen Icons
1. Funktional oder Metapher? Im Zweifel funktional → Outline-Regel oben.
2. Gibt es das Icon schon als geteilte Komponente? Dann wiederverwenden.
3. Optische Strichstärke an die Rendergrösse anpassen, runde Enden, `fill: none`.
4. **Jedes neue Icon wiegt in der Startdatei mit** — siehe unten.

## 🛑 Das Register lässt sich nicht teilen (gemessen 20.09.2026)

`_iconFactories` ist ein Objektliteral mit allen 72 Icons, `Icons` wird daraus
abgeleitet. Damit kann kein Bundler eines weglassen: **`IconSystem.jsx` ist mit
55,8 KB roh der grösste einzelne Posten der Startdatei (21,7 %)** — auch wenn der
erste Bildschirm 29 Icons braucht.

Der naheliegende Ausweg — «die im festen Teil ungenutzten auslagern» — wurde geprüft
und **verworfen**: Icon-Namen werden hier überwiegend zur Laufzeit gebildet
(`Icons[ch.key]`, `Icons[item.icon]`), und eine Textsuche übersah dabei `emergency`,
das das Dashboard tatsächlich abfragt. Hergang, Zahlen und der gangbare Weg stehen in
[`MESSUNG-startdatei-65kb-2026-09-20.md`](MESSUNG-startdatei-65kb-2026-09-20.md).

Praktisch heisst das: **ein neues Icon reist in die ganze App mit, nicht nur auf die
Seite, die es zeigt.** Im Zweifel ein bestehendes wiederverwenden.

> 🛑 **Das ist eine Aussage über Reichweite, nicht über Grösse — hier stand sie
> zuerst missverständlich.** Gemessen am 20.09.2026: ein neues Pfeil-Icon kostete
> **50 Byte gzip** (62,80 → 62,85 kB). 23 entfernte Icons bringen **1,42 kB**, also
> rund 60 B je Stück. Die 55,8 KB sind Rohtext; 41× dieselbe `createElement`-Hülse
> frisst gzip weg.
>
> Der Satz «ein neues Icon kostet die ganze App» hat darum fast dazu geführt, einen
> nötigen Pfeil nicht zu bauen. Richtig ist: **ein Icon kostet ~60 Byte und erreicht
> jede Seite.** Wenn das zu teuer ist, ist nicht das Icon das Problem, sondern wie
> wenig Luft unter dem Deckel steht. Der Icon-Abbau bleibt trotzdem der *letzte*
> Kandidat — 1,42 kB für den grössten Umbau ist ein schlechtes Verhältnis.

## Die Regel für Pfeile und Ziel-Zeichen (20.09.2026)

Die Regel stand vorher ungeschrieben in `AnspruchLandkarte.jsx`: `isExternal ? ' ↗' : ' →'`
— **`→` bleibt in Maloja, `↗` verlässt Maloja.** Nur hielt der Zeichensatz sie nicht
durch: Herunterladen hatte zwei Zeichen (`↙` *und* `↧`), `↗` hatte zwei Bedeutungen
(hinaus *und* hochladen), und für vier Bedeutungen lag längst ein Piktogramm bereit,
das niemand benutzte.

**Ein Zeichen nur dort, wo etwas den Ort verlässt oder auf dem Gerät landet.**

| | Zeichen | wo es herkommt |
|---|---|---|
| hinaus, neuer Tab | `external` | **`ZielHinweis` / `ExternerLink`** — nie von Hand |
| herunterladen | `download` | **`ZielHinweis art="download"`** |
| hochladen | `upload` | **`ZielHinweis art="upload"`** |
| zurück | `pfeil`, gespiegelt | `zurueckZeichen()` |
| wiederkehrend | `recurring` | `hinweisZeichen('recurring')` |
| **weiter, bleibt hier** | **keines** | die Zeile ist schon ein Knopf |

Das Letzte ist der eigentliche Entscheid: **59 innere Pfeile im Code und 180 in den
Sprachdateien sind ersatzlos entfallen.** Ein Pfeil an jedem anklickbaren Verweis
beantwortet die einzige Frage nicht, die eine Zeile schuldet — «geht das jetzt
woandershin?» — und visuelle Gleichverteilung steht in `maloja-gestalt` auf der
SaaS-Liste. Seither heisst ein Zeichen wieder etwas.

🛑 **Das Zeichen gehört der Komponente, nicht der Aufrufstelle.** `ExternerLink`
kündigte den Tab-Wechsel für Screenreader längst selbst an (WCAG 3.2.5 / G201) —
trotzdem klebten sechs Aufrufstellen zusätzlich ein rohes `↗` daneben, und
`PremiumSubsidy` baute Zeichen und Ansage ein zweites Mal von Hand nach. Ein
Versprechen, das an sechs Stellen wiederholt wird, wird an der siebten vergessen.
Seit 20.09. setzen `ExternerLink` und `ZielHinweis` beides selbst, in allen fünf
Sprachen, auch für Herunterladen und Hochladen (`a11y.dateiGespeichert`,
`a11y.dateiGewaehlt`).

### 🛑 Was dabei ans Licht kam: die Glyphen stecken auch in den Sprachdateien

Alle Zählungen davor durchsuchten nur `src/**/*.jsx`. Eine Messung über
`src/i18n/*.js` fand **592 weitere Piktogramm-Zeichen** — rund 100 Pfeile **je
Sprache**, dazu `☐` und `⌂`. Davon sind 180 entfallen (Zeichenketten, die auf ` →`
endeten = Querverweis-Etiketten).

**Nicht entfallen und bewusst so:** Pfeile *mitten* im Satz bedeuten «ergibt» oder
«dann» — `Nebenkosten: CHF 250/Mt. → ca. CHF 3'000/Jahr`, `Einkommen eingetragen →
prüfen Sie Ihren IPV-Anspruch`. Das ist Typografie, kein Wegweiser.

**Stand 21.09.2026: 592 → 269.** Weitere 65 sind seither gefallen:

- die **«Was wir nicht tun»-Liste** — drei Absätze mit `→` davor wurden eine echte
  `<ul>`, wie zuvor schon Lizenz und Haltung
- `mirror.notfall.statusYes/No/Declined` trugen `✓ `/`○ ` im Text; die Zeichen
  kommen jetzt aus `vorsorgeStatus` als Piktogramm, weil `MirrorRow` den Wert als
  Kind rendert
- `legal.resources.cantonPortal` endete auf ` ↗` **innerhalb** eines `ExternerLink`
  — doppelt, seit die Komponente das Zeichen selbst setzt

🛑 **Beim Zählen aufgefallen — toter Übersetzungs-Bestand:**
`premiumCalc.check1..6` (6 Schlüssel × 5 Sprachen) wird **nirgends im Code
benutzt**, mit zwei Messgeräten geprüft. Ebenso `firstChapterDone` und
`firstFieldDone`, die es **nur auf Rätoromanisch** gibt. Ich habe nur die Glyphen
entfernt und den Inhalt stehen gelassen — ob Übersetzungen weg dürfen, ist ein
Inhaltsentscheid, keine Aufräumarbeit.

**Was bleibt (269):** 252× der Pfeil mitten im Satz, dazu `©`, `≥` (Typografie)
und `←` in «mit ←/→ ziehen» — das benennt die Taste und gehört als Wort dorthin.

## 📏 Stand der Zeichenschicht (21.09.2026)

**1'079 → 173.** Code geklebt 289 → 2 · Code allein stehend 97 → 4 ·
Sprachdateien 592 → 167. Hergang, Sortierung und die offenen Entscheide:
[`MESSUNG-zeichenschicht-2026-09-21.md`](MESSUNG-zeichenschicht-2026-09-21.md).

Gewacht wird über `src/__tests__/glyphenImText.test.js` — **nach Unicode-Kategorie,
nicht nach einer Zeichenliste.** Eine Liste findet nur, woran ihr Verfasser gedacht
hat; die erste Fassung übersah 21 Zeichen (`☎ ◉ ✦ ▶ △ ↗ ← ↻ ◇ ◎ ◰ …`).

## Die Schicht darunter: rohe Glyphen im Text

Diese Konvention regelt SVG-Icons. Darunter liegen **447 rohe Unicode-Zeichen** in
`src/**/*.jsx` — `ⓘ ✓ → ⚠ · – — ▾ ✕ ○ × ▸ □ ● … •`. **289 davon waren per `+` an den
Text geklebt** und lassen sich deshalb **nicht per `aria-hidden` abschirmen, nur
ersetzen**: ein Screenreader liest bei jedem Hinweis den Zeichennamen mit, und `ⓘ`
rendert auf jedem System anders.

**Regel für neue Arbeit: keine rohen Glyphen im Text.** Entweder ein `<Icon>` (setzt
`aria-hidden` selbst) oder `hinweisZeichen()` aus `IconSystem.jsx` — als **eigenes
Kind**, nie in den Text konkateniert:

```js
React.createElement('p', { … }, hinweisZeichen(), t('trust.localOnly'))
```

`src/__tests__/glyphenImText.test.js` wacht darüber.

### Stand: `ⓘ` ist abgearbeitet (20.09.2026)

**122 Fundstellen → 4.** 107 Stellen maschinell umgestellt (nur dort, wo das Literal
nachweislich ein Argument war), 8 von Hand, davon 5 mit einer Bedeutungs-Entscheidung:

| Stelle | Entscheidung |
|---|---|
| KVG-Standortsatz, Mietzins, Sozialhilfe | `✓`/`ⓘ` → Piktogramme `check`/`info` |
| BudgetSync | beide Zweige trugen dieselbe Glyphe → einmal davorgezogen |
| ZipExport, 3 Knöpfe | Piktogramm dorthin, wo im Knopf schon eines sitzt |

Die vier Reste, jeder mit Grund — sie stehen auch im Wächter:

- `FinanzUebersicht.jsx:139` — HTML-Zeichenkette für den Export, kein React-Knoten
- `StipendienView.jsx:16` — Marker-Satz `✓`/`○`/`ⓘ`; für `○` gäbe es kein Piktogramm
  ohne Bedeutungswechsel (`✕` liest sich härter als `○`) — **Entscheid liegt bei
  Stebler Studios**
- `GlossarBegriff.jsx:52` — macht es bereits richtig: eigener `<sup>` mit
  `aria-hidden`, skaliert über `0.7em` mit dem Text mit
- `ChapterView.jsx:444` — Kommentar

**Kosten: 0,08 kB gzip.** Das Piktogramm lag ohnehin im Bündel, und `hinweisZeichen()`
ist kürzer als `'ⓘ ' + `.

### Die Erklärung hängt jetzt am Wort (20.09.2026)

Das `ⓘ` hatte zwei Bedeutungen getragen: den **Glossar-Marker** (`IPVⓘ` — hochgestellt
am Wort, antippbar, öffnet die Erklärung) und ein **Präfix vor Hinweissätzen**, das
nichts versprach und nichts hielt. Die Sortierung der 113 Stellen zeigte, wie weit das
auseinanderlag — nur 24 waren überhaupt Erklärungen, 29 standen vor Etiketten wie
„Telefon" oder „Laden…".

Gemessen wurde ausserdem: **0 von 113** Hinweistexten liefen durch `GlossarText`.
Glossar und Hinweise waren sich nie begegnet.

Seither laufen die **40 Hinweis-Sätze** (keine Etiketten — ein Glossar-Begriff ist
selbst ein `<button>` und darf nicht in einem Knopf landen) durch `GlossarText`, und
das Glossar wuchs von 12 auf **16 Begriffe**: `Nettolohn` · `Taxpunktwert` ·
`Bundessteuer` · `Veranlagung`. Das sind die vier, die in diesen Sätzen am häufigsten
vorkamen und nirgends erklärt waren.

Ergebnis auf der Steuerseite: **1 → 8 Markierungen.** Gegengeprüft: 0 verschachtelte
Knöpfe.

> 🛑 **Dabei aufgedeckt:** `GlossarText` nahm `t` als Eigenschaft entgegen, verlangte
> aber trotzdem den Sprach-Kontext und warf ohne ihn. Solange die Komponente an sechs
> Stellen hing, fiel das nie auf — beim Anschluss riss es 41 Tests auf einmal. Behoben:
> Kontext direkt lesen, ohne Übersetzer den Text unmarkiert durchreichen.

> 🛑 **Das Glossar ist faktisch deutschsprachig.** `GLOSSAR` führt deutsche
> Wortformen als Schlüssel, `GlossarText` sucht sie im **übersetzten** Text. Gemessen
> über dieselben 40 Sätze: **de 19 · en 6 · rm 2 · fr 0 · it 0** Markierungen. Auf
> Französisch steht „salaire net", nicht „Nettolohn" — also greift nichts. Das ist
> älter als dieser Durchgang, fällt jetzt aber auf, weil der Mechanismus an 40 statt
> an 6 Stellen hängt. Eine Lösung bräuchte Wortformen **je Sprache** im Glossar.

### Die zweite Kategorie: allein stehende Zeichen (21.09.2026)

Alle Zahlen davor betrafen **geklebte** Zeichen. Daneben stehen welche allein in
einem Element (`}, '✕')`). Die sind zwar per `aria-hidden` abschirmbar — aber sie
rendern trotzdem auf jedem System anders, und der ursprüngliche Einwand galt dem
**Aussehen**, nicht nur dem Vorlesen. Gemessen: **97 → 43.**

| Gruppe | Anzahl | Entscheidung |
|---|---:|---|
| `→` Chevron am rechten Rand | 14 | **weg** — samt `<span>`, die Zeile ist schon ein Knopf |
| `✕` Schliessen/Entfernen | 11 | → `kreuz`, ohne Aussenabstand (alle 11 tragen bereits ein `aria-label`) |
| `▾` / `▸` Aufklappen | 29 | → `aufklappZeichen(offen)` — **ein** Chevron, gedreht |

🛑 **Ein Aufklapp-Zeichen ist ein Chevron, kein gedrehter Pfeil.** Der erste
Versuch drehte den vorhandenen `pfeil` um 90° — im Browser stand dann neben der
Sprachwahl «DE↓», was sich als *herunterladen* liest. Ein Pfeil hat einen Schaft
und meint Bewegung; ein Chevron ist nur die Spitze und meint Richtung. Das neue
`chevron`-Icon kostete 40 Byte.

Danach die Zustandszeichen, jedes mit Blick auf seinen Verbraucher — **97 → 6**:

- `value: '✓'` in `MirrorCards` (12×) durfte ein Element werden, weil `MirrorRow`
  den Wert als Kind rendert und die Zeilen **nur auf den Bildschirm** gehen.
- `label: '✓'` im Tresor durfte es **nicht**: der Wert wird per `+` in eine
  Zeichenkette gehängt. Er ist jetzt ein Wort (`tresor.gueltig`) — wie seine
  beiden Geschwister «Abgelaufen» und «30d», die nie ein Zeichen trugen.
- Im Tresor sagten zwei Knöpfe etwas anderes, als sie taten: `↙` für Herunterladen
  (jetzt `download`) und **`○` für Bearbeiten** (jetzt `edit`).

🛑 **Die Kapitel-«Icons» waren Glyphen in den Sprachdateien** — `◎ ⌂ ◇ ◰ ✦ ◉ ⚠`,
7 Stück × 5 Sprachen, und in Rätoromanisch sogar **andere** (`◆ ⚖`). Ein
Gestaltungselement, das je Sprache anders aussieht, ist keine Übersetzung.
Schlimmer: `SearchView` reichte diese Glyphe als **Icon-Namen** an `Icon` weiter —
`Icons['◎']` ist `undefined`, also fehlten dort die Kapitel-Icons vollständig.
Beide Stellen nehmen jetzt den Kapitel-Schlüssel aus dem echten Register; die 35
i18n-Einträge sind weg.

**Was bleibt (6):** zwei im HTML-Export (kein React-Knoten), das Glossar-`ⓘ` (macht
es richtig) und `stipResultMarker` mit `✓ / ○ / ⓘ` — für `○` («kein Anspruch»)
gibt es kein Piktogramm ohne Bedeutungswechsel, `✕` liest sich härter. **Dieser
Entscheid liegt bei Stebler Studios.**

### Noch offen: 289 − 114 = 175 geklebte Zeichen

`→` (60) · `·` (41) · `✓` (32) · `—` (18) · `□` (8) · `⚠`/`–`/`✕` (je 4) · `•` (1).
Der Wächter hält dafür einen **Höchststand fest, der nur sinken darf** — so wächst die
Schuld nicht still weiter, während daran gearbeitet wird.

Das ältere Muster `praefix` in `SozialhilfeView.jsx:33` tut dasselbe und bleibt gültig;
neue Stellen nehmen `hinweisZeichen()`.

🔗 **Reihenfolge beachten:** Glyphen ersetzen macht Icons *mehr* gebraucht, nicht
weniger (`praefix` ruft `rechner` und `kaestchen` auf — beide stehen auf der
Abbau-Liste). Erst die Glyphen, dann neu messen. Zahlen und Hergang:
[`MESSUNG-startdatei-65kb-2026-09-20.md`](MESSUNG-startdatei-65kb-2026-09-20.md).
