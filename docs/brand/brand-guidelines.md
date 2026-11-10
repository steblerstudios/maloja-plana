# Maloja Plana — Brand Guidelines

**Stand:** Juni 2026, **Logo und Farben nachgeführt 24.09.2026** (Markenpaket 1.0) · **Firma:** Stebler Studios (Basel)

Das **eine** kanonische Marken-Referenz-Dokument. Es bündelt Farbe, Typografie, Logo,
Bildsprache, Stimme und Design-Tokens an einem Ort. Die Detail-Dokumente bleiben als
Tiefen-Quellen bestehen — diese Seite ist der Einstieg und zeigt auf sie.

| Bereich | Tiefen-Quelle |
|---------|---------------|
| Markenentscheidungen (Herleitung, Verworfenes) | [`brand-identity.md`](brand-identity.md) |
| Vollständige Icon-Liste + Status | [`icon-dictionary.md`](icon-dictionary.md) |
| **Logo seit 24.09.2026** (Bildmarke, Varianten, Herkunft) | [`markenpaket-2026-09/`](markenpaket-2026-09/README.md) · Code: [`MarkenLogo.jsx`](../../src/components/MarkenLogo.jsx) |
| *Abgelöst:* Signet-Konzept, Gipfel-«M» | [`logo-brief.md`](logo-brief.md) · [`wordmark.svg`](wordmark.svg) · [`app-icon.svg`](app-icon.svg) |
| Implementierte Tokens (Code) | [`../../src/config/tokens.js`](../../src/config/tokens.js) · [`tokens.css`](../../src/tokens.css) |
| Stimme / Schreib-Philosophie | `maloja-writing-language` (Sprach-Doku) |

---

## 1. Markenkern

Maloja Plana ist ein **ruhiger Ort** für Menschen, die in der Schweiz ankommen oder leben —
oft gestresst, aus verschiedensten Kulturen. Die Marke **beruhigt, orientiert und übersetzt
würdevoll**. Sie verkauft nicht, motiviert nicht, gamifiziert nicht. Jede gestalterische
Entscheidung wird an einer Frage gemessen:

> **«Erzeugt das Ruhe und Orientierung — oder Aktivierung und Druck?»**

---

## 2. Farbe — Palette «Granit»

Kulturell neutral, warm-neutraler Unterton, beruhigend, zeitlos. Funktioniert in Light + Dark
gleich gut.

*Abgeglichen am 24.09.2026 mit dem Code (`DARK_PALETTE` / `LIGHT_PALETTE` in
[`constants.js`](../../src/config/constants.js)). Bis dahin stand hier «Dark `#24262A`» und nur
ein Sage-Wert — das war der **Text** im Hellmodus bzw. nur der Hellmodus.*

| Rolle | Hell | Dunkel | Einsatz |
|-------|------|--------|---------|
| Hintergrund | `#F2F2F0` | `#22211F` | Seite (warmer Stein / Anthrazit) |
| Surface | `#FAFAF8` | `#2B2A26` | Cards, erhöhte Flächen |
| Text | `#24262A` | `#E6E3DC` | Fliesstext (dunkel: Warmweiss) |
| **Gold / Sand** | `#C4A06A` | `#C4A06A` | **Handeln** — Hauptknopf (gefüllt, Schrift `onSand`), Nebenknopf und Links (Rand/Schrift `sandDeep`), gewählte Option, Fokusring; Berg in der Bildmarke |
| **Sage** | `#5A7868` | `#7E9F8C` | **Gut, erledigt** — gespeichert, im Rahmen, Anspruch möglich, «sicher» |
| Salbei der Marke | — | `#8FB0A0` | Bildmarke (Weg/Haus), im Code `sageDeep` |
| Sky | `#6E90B0` | `#6E90B0` | **Informieren** — Hinweise und Fristen (Text: `skyDeep`) |
| Rose | `#B87070` | `#B87070` | **Warnen** — überfällig, Fehler, Gefahr-Knopf mit rotem Rand (Text: `roseDeep`) |

> **Farbrollen seit Fassung 9** (Stebler Studios, 05.11.2026, Variante B «Ja, so», nach
> Vergleich in Hell und Dunkel). Bis dahin stand hier Sage als Farbe für Buttons und Links,
> Gold als Akzent; der Code folgte dem nie ganz (`PrimaryButton` war seit 07.07. Sand).
> Gemessen: Sand hebt sich im Dunkeln stark ab (5.9:1 zur Fläche), im Hellen schwach
> (2.2:1), die Schrift darauf trägt 6.15:1. Knopfarten: Hauptknopf gefüllt (einer je Seite),
> Nebenknopf leer mit Rand, Gefahr mit rotem Rand, Link unterstrichen.
> In Diagrammen bleibt Gold «die finanziell engere Seite» (`farb-und-daten-system.md`).

Die Lese-Varianten für Text (`…Deep`) und die Farbenblind-Palette stehen mit Kontrastwerten
in `constants.js` — dort ist die Quelle, hier nur die Übersicht.

**Prinzip:** Grün (Sage) ist universell positiv + reduziert Stress; Gold = Wert/Qualität in
jeder Kultur; der warme Unterton verhindert «kalte Behörde». Kein Farbton schliesst eine Kultur
aus. Kontrast-Paare müssen WCAG AA erfüllen (Light **und** Dark). Herleitung + verworfene
Paletten: [`brand-identity.md` §1](brand-identity.md).

**Links im Text sind unterstrichen, nie nur farbig** (WCAG 1.4.1, 05.11.2026). Eine Linkfarbe
bräuchte 3:1 gegen den umgebenden Text; `skyDeep` hat gegen Fliesstext nur 2.68:1 (hell) und
1.94:1 (dunkel). Darum: dünne Unterstreichung (1px, Abstand 2px) im Ruhezustand, beim Überfahren
2px, die Farbe wechselt nicht. Ohne Unterstreichung nur, wo die Form den Link trägt: Knopf,
Wortmarke, Listen und Inhaltsverzeichnisse, in denen jeder Eintrag ein Link ist. Wächter:
`src/__tests__/seitenStilA11y.test.js` (Erlaubnisliste).

---

## 3. Typografie

Drei Schriften, je ein klarer Job. Alle frei lizenziert + lokal als WOFF2 gehostet (keine
externen Requests → passt zur Privacy-/Local-First-Architektur).

| Rolle | Schrift | Warum |
|-------|---------|-------|
| **Body, Navigation, Formulare, alles Funktionale** | **Lexend** | Auf Leseflüssigkeit getuned; ermüdet am wenigsten — wichtig, weil viele in einer Fremdsprache unter Stress lesen. |
| **Editoriale Headlines** | **Hanken Grotesk** | Schweizer Grotesk-Tradition, zeitlos, neutral. Headline-Kontrast kommt aus Rolle + Gewicht (Hanken 600/700), nicht aus Serif-vs-Sans. |
| **Accessibility-Toggle** (anklickbar) | **Atkinson Hyperlegible** | Braille Institute; maximale Buchstaben-Eindeutigkeit (b/d/p/q, I/l/1) für Sehbehinderte + Legastheniker. |

**Logo-Schrift:** Der Schriftzug im Logo ist **Ubuntu (laut Markenbuch Regular/Medium), in Pfade umgewandelt** —
ein Bild, keine Web-Schrift. Die App lädt Ubuntu nicht (Entscheid 24.09.2026: Lexend bleibt
die Leseschrift, das Logo kommt fertig aus dem Markenpaket).

**Type-Scale** (`tokens.js`, px): `xs 13 · sm 15 · body 16 · lg 19 · xl 23 · 2xl 28 · 3xl 36`.
**Gewichte:** `normal 400 · medium 500 · semi 600 · bold 700`.
**Zeilenhöhen:** `tight 1.2 · normal 1.5 · relaxed 1.7`.

> Verworfen: Inter/Jakarta/Instrument (zu «Startup») · Playfair (zu theatralisch) · Lora
> (packte nie ganz) · OpenDyslexic (kaum belegte Wirkung, zerstört die ruhige Ästhetik —
> echte Hebel sind Sans-serif, mehr Abstand, Off-White-BG, Grössen-Toggle).

---

## 4. Logo

**Seit 24.09.2026: Markenpaket 1.0 — «Ein Weg durch die Berge».** Bildmarke aus Haus/M
(Salbei), Berg (Sand) und dem Weg dazwischen, darunter das P; dazu der Schriftzug «Maloja
Plana». Vektor-Adaption des bestätigten Konzepts V3, keine pixelgenaue Nachzeichnung.
Herkunft, Dateien und Prüfung: [`markenpaket-2026-09/README.md`](markenpaket-2026-09/README.md).

| Fassung | Einsatz | Wo |
|---|---|---|
| **Horizontal** (Standard) | Kopfzeile, Sperrbildschirm, Beta-Tor, Onboarding | `MarkenLogo.jsx` — **die eine Quelle in der App** |
| Zentriert | Titel, Deckblätter | Paket `logo/logo-zentriert-*` |
| Bildmarke allein | App-Icon, Profilbild | `public/app-icon.svg`, `icon-*.png` |
| Favicon (vereinfacht) | Browser-Tab 16/32 px | `public/favicon.svg` |

**Farbe nach Fläche:** auf **dunkler** Fläche Salbei `#8FB0A0` + Sand `#C4A870`, Schrift
Warmweiss `#E6E3DC`; auf **heller** Fläche **einfarbig Anthrazit** `#22211F` (Salbei hätte auf
`#F2F2F0` nur rund 2:1). Entscheidend ist die Fläche, nicht der eingestellte Modus — das
Beta-Tor ist immer hell.

**Regeln (Markenbuch):** Schutzraum = ¼ der sichtbaren Symbolhöhe · horizontales Logo nicht
unter **180 px** (Druck 40 mm), Symbol nicht unter 32 px (9 mm) · keine Verzerrung, keine
Effekte, keine Umfärbung ausserhalb der Varianten · Bildmarke und Schriftzug **nicht neu
anordnen**, nur die gelieferten Fassungen · Titelcase «Maloja Plana», nie Versalien, nie kursiv.

> **Abgelöst am 24.09.2026, als Beleg stehengelassen:** Wortmarke in Hanken Grotesk mit einem
> gezeichneten Gipfel-«M» (Polyline, Goldpunkt am rechten Gipfel), «Plana» in Gold; App-Icon
> und Favicon = das Gipfel-«M» allein. Auch das Signet-Konzept «Ordner + Berg + Pass» aus
> [`logo-brief.md`](logo-brief.md) ist damit abgelöst. Dateien: [`wordmark.svg`](wordmark.svg), [`app-icon.svg`](app-icon.svg).

**Claim:** «Ihr Leben. Ihre Übersicht.» (Du-Fassung: «Dein Leben. Deine Übersicht.») ·
optional «by Stebler Studios». Funktionale Unterzeile (Marketing): «Verstehen, was zusteht.
Ordnen, was ansteht.»

> **Offen (24.09.2026):** Das Markenpaket führt «Verstehen, was zusteht. Ordnen, was ansteht.»
> als *den* Claim (Link-Vorschau, Social-Vorlagen) und schlägt «Ein Schritt. Mehr Überblick.»
> als Leitidee vor. Welcher Satz der Claim ist, ist noch nicht entschieden.

---

## 5. Bildsprache / Icons

**Prinzip:** Jedes Icon ist eine bewusste **Schweizer Metapher** für *eine* Funktion. Eine
Funktion = ein Icon (keine Doppelungen), Stil = detaillierte Piktogramme, Farben aus Granit.

Beispiele (Stand 08.11.2026, Bauplan B1–B5c): Übersicht = **Feldstecher** · Menü = **Sackmesser** ·
«Was steht mir zu?» = **Wegweiser** · Erinnerungen = **Kuhglocke** · Frist = **Kalender mit Sanduhr** ·
Finanzen = **Fünfliber** · Versicherungen = **Schild mit Edelweiss-Stern** · Behörden = **Helvetia** ·
Gesundheit = **Arztkoffer**, Notfall = **Herz mit Puls** (kein Kreuz, nie Rega-Logo).
⟨bis 06./07.11.2026: Übersicht = Sackmesser, Frist = Mondaine-Bahnhofsuhr, Behörden = Bundeshaus,
Notfall = Rettungskreuz⟩

**Seit November 2026 mit System:** jede Seite trägt **Leitform + Abzeichen** — Leitform = das Kapitel,
Zeichen im Abzeichen = was passiert, Farbe = wer mitspielt (anderer Lebensbereich, Geld = Gold, sonst
leer). Unter 20 px das einfache Zeichen. Helle Details sind ausgestanzt, nie weiss gemalt. Das kleine
Kalender-Zeichen (Sanduhr blau, ! rot) und das grosse **Kalenderblatt** unten in §7 sprechen dieselbe
Farbsprache: Sky = Frist, Rose = vorbei/überfällig. **Auf getönten Kacheln** steht das Zeichen im selben
Farbton, nur so viel tiefer, dass es gegen die Kachel 3:1 erreicht (09.11.2026); die Kachel selbst bleibt.
Regeln und Quellen: [`ICON_KONVENTION.md`](../ICON_KONVENTION.md).

Vollständige Tabelle inkl. Status (✓/🔄/➕/⚠️) und Code-Keys:
[`icon-dictionary.md`](icon-dictionary.md). Offen u.a.: Export-Metapher, Vorsorge-Metapher,
Organspende-vs-Notfall-Abgrenzung. *(08.11.2026: Export, Vorsorge und Organspende sind entschieden — siehe Wörterbuch, Nachtrag 08.11.)*

---

## 6. Stimme & Tonalität

**Haltung:** Maloja spricht wie ein ruhiger Ort — **beruhigen, orientieren, würdevoll erklären,
menschlich übersetzen.** NICHT verkaufen, motivieren, gamifizieren, optimieren, dramatisieren.
Kein Startup-/SaaS-/Behördenton.

### Anrede — selbst wählbar, Standard «Sie» · **umgesetzt**

Die Nutzer:in entscheidet selbst, ob sie geduzt oder gesiezt wird (= «der Mensch hat die
Kontrolle», wie beim Lesbarkeits-Toggle). Texte werden grundsätzlich in der formellen Form
geschrieben; die informelle ist die **gespiegelte** Fassung. Nur Strings mit *direkter Anrede*
brauchen zwei Varianten (`{ sie, du }`) — Labels/Substantive/Buttons bleiben gleich. Technik:
`createT(translations, lang, anrede)`, Setting `or5_anrede: 'sie' | 'du'` (Default `'sie'`).

| Sprache | Formell (Default) | Informell | Toggle aktiv |
|---------|-------------------|-----------|:---:|
| **DE** | Sie | du (klein, seit Fassung 9) | ✅ |
| **IT** | Lei | tu | ✅ |
| **RM** | Vus | ti | ✅ ⚠️ |
| **FR** | vous | — | nur vous |
| **EN** | you | — (keine T-V-Distinktion) | — |

> ⚠️ **RM** ist inhaltlich vollständig auf `{ sie: Vus, du: ti }` (inkl. Klitiken At/Ta/T' →
> As), braucht aber **muttersprachliche Review vor Deploy** (2.-Pers.-Plural-Verbformen).
> **FR** ist konsistent vous (Mix-Bug behoben); ein voller tu-Toggle ist bewusst offen, weil
> der Marken-Default ohnehin formell ist. Details: Memory `anrede-feature`.

**Standard «Sie», weil:** (1) **Würde** — die Zielgruppe wird im Behördenalltag oft
bevormundend geduzt; «Sie» behandelt sie als kompetente Erwachsene. (2) **Interkulturell
sicher** — Formalität = Respekt in vielen Kulturen. (3) passt zur bestehenden Stimme.
«Sie» ist nicht kalt — Wärme kommt aus den Wörtern, nicht aus dem Duzen.

### Statt … lieber … (laut → ruhig)

| Situation | Statt | Lieber |
|-----------|-------|--------|
| Fehler | «Ungültig! Pflichtfeld fehlt» | «kann später ergänzt werden» |
| Fortschritt | «Erst 40% — weiter so!» | «nimmt langsam Form an» |
| Budget | «Zu hohe Ausgaben!» | «ein möglicher Richtwert» |
| Vorsorge | «Jetzt dringend absichern!» | «ruhig für später hinterlegt» |
| Amtsdeutsch | «gemäss Art. 3 KVG…» | «Was das für Sie heisst:» |

### Begriffe

**Immer Schweizer Begriffe:** AHV · BVG · Krankenkasse · Franchise · Prämienverbilligung ·
Aufenthaltsbewilligung · Betreibungsregisterauszug · Ergänzungsleistungen (EL). Nie deutsche/
US-Begriffe oder falsche Amtsübersetzungen.

**Sprachreihenfolge:** DE (Leitsprache, definiert den Ton) → EN (grösste Reichweite) → FR → IT
→ RM. Strategisch geplant für den Asyl-Fokus: Tigrinya, Albanisch, Arabisch (RTL) — native
Namen bereits in `main.jsx` erfasst, Aktivierung erst mit verifizierter Übersetzung.

---

## 7. Design-Tokens (Referenz)

Quelle der Wahrheit: [`src/config/tokens.js`](../../src/config/tokens.js) (JS-Spiegel von
`tokens.css`). React nutzt Inline-Styles, daher importieren Komponenten diese Konstanten.

- **Spacing** (4px-Grid): `2xs 2 · xs 4 · sm 8 · ms 12 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`
  *(`ms 12` seit 06.11.2026 — war der häufigste Festwert und fehlte in der Skala.)*
- **Radius:** `hair 2 · xs 4 · sm 6 · md 10 · lg 16 · xl 24 · full 9999`, **nach Rolle** (Regel C
  unten): `hair` feine Balken · `xs` Knöpfe in dichten Tabellen · `sm` kleine Elemente ohne
  Bedienhöhe · `md` Felder, Knöpfe (`KNOPF_RADIUS`), Symbolkacheln · `lg` Karten · `xl` Blätter · `full` Marken,
  Pillen, Kreise. *(Bis 06.11.2026 war `sm` der Normalfall für alles — überholt.)*
- **Shadow** (subtil): `sm` bis `xl` mit `rgba(0,0,0,0.06…0.12)`
- **Motion:** Easing `cubic-bezier(0.4,0,0.2,1)` · Dauer `fast 150 · normal 250 · slow 400 ·
  cinematic 600` (ms)
- **Font-Stack:** Body `'Lexend', sans-serif` · Display `'Hanken Grotesk', sans-serif`

### 7a. Verhältnisse — woher die Werte kommen

Die Werte oben sind nicht Geschmack und nicht von anderen Produkten abgeschaut, sondern folgen
sechs Regeln. Ein neuer Wert, der keiner Regel folgt, kommt nicht in den Code. *(06.11.2026)*

| | Regel | Für Maloja heisst das |
|---|---|---|
| **A** | **Nähe** — was zusammengehört, steht enger; innen immer weniger Luft als aussen | Beschriftung → Feld `sm 8` · Zeile → Zeile `ms 12` · Baustein → Baustein `md 16` · Karte → Karte `md 16` · Abschnitt → Abschnitt `2xl 48` |
| **B** | **Skala mit festem Verhältnis** (~1.5) — nur so unterscheidet das Auge die Stufen | `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. 10, 14, 20 liegen zu nah an einer Nachbarstufe und fallen weg |
| **C** | **Ecke wächst mit der Grösse** — bei Bedienelementen etwa ¼ der Höhe | Marke rund · Knopf/Feld (44 hoch) `md 10` (= `KNOPF_RADIUS`) · Symbolkachel (36) `md 10` · Karte `lg 16` · Blatt `xl 24` |
| **D** | **Verschachtelte Ecken** — liegt etwas eng in einer Fläche: aussen = innen + Abstand | Bild mit 8 Rand in einer Karte: Karte 16, Bild 8. Nie gleiche Ecke innen und aussen bei engem Rand |
| **E** | **Bewegung nach Weg** — kurzer Weg, kurze Zeit; Erscheinen bremst ab, Verschwinden geht schneller (~⅔) | Druck/Haken `fast 150` · Aufklappen `normal 250` · Erscheinen `slow 400` · nur Berglandschaft `cinematic 600` |
| **F** | **Takt aus der Schrift** — Grundschrift × Zeilenhöhe ergibt den Grundtakt | 16 × 1.5 = **24** = `lg`. Fliesstext höchstens etwa 65 Zeichen breit |

Dazu unverändert: Tippflächen mindestens 44 × 44 px (WCAG 2.5.5).

### 7b. Instrumente — ein Zuhause, feste Spiegel *(09.11.2026)*

Instrumente sind Bilder, die einen Stand zeigen: Netz-Schild, Reserve-Tank, Steuer-Säule, Franchise-Kreuz.
Befund vor der Regel (Landkarte 09.11.): Jedes stand dort, wo es gebaut wurde, in Grössen von 36 bis 480 px, und
das Schild fehlte im eigenen Kapitel. Quelle der Grössen: `INSTRUMENT_GROESSE` in `src/config/tokens.js`.

| Auftritt | Grösse | Was dazugehört |
|---|---|---|
| **Zuhause** — das eigene Kapitel | **gross 256 px**, oben, ohne Aufklappen | Satz, Liste, Hinweise |
| **Spiegel Werkzeug** — Seiten, deren Daten es füllen | **mittel 128 px** | Satz + Weg ins Kapitel |
| **Spiegel Startseite** — Kapitel-Zeile | **klein 64 px**, alle gleich breit | nur das Bild, **keine Wörter darin**, Zahl daneben |

- Verhältnis **1 : 2 : 4** (Regel B): drei Stufen, die das Auge unterscheidet.
- **Ein Bild, eine Bedeutung.** Das **Netz-Schild** ist *das* Schild (F7-K3-6). Das alte Schild «Pflicht /
  Empfohlen» ist seit 09.11. von Startseite und Prämien-Übersicht entfernt.
- Spiegel rechnen **dieselbe Zahl** wie das Zuhause (Startseite: «5/5 eingetragen» aus `netzSchildTeile`).
- Wächter: `src/__tests__/instrumenteZuhauseSpiegel.test.js`.
- **Reserve-Tank seit 10.11.2026 wie das Schild:** ein Bauteil mit `groesse` (`klein` 64 ohne Wörter,
  `gross` 256 mit Ablesesatz); die eigene Kleinzeichnung `miniGauge` ist aufgelöst.
- Noch nicht nachgezogen: Steuer-Säule im Kapitel Finanzen (fehlt), Netz-Schild auf
  KVG/Unfall/IV (mittel); Franchise-Kreuz ist ein Diagramm, keine Bildgrösse — eigener Entscheid.

**Drei weitere Regeln, seit 09.11.2026** (Querschnitt 1, Gesamtbefund; Stebler Studios: «c finde ich gut»,
«Ja, A und B»). Wächter: `src/__tests__/querschnittGestaltung.test.js`.

| | Regel | Für Maloja heisst das |
|---|---|---|
| **G** | **Material statt Effekt** — eine Fläche ist Papier (deckend) oder Granit (Grund); getrennt wird mit einer Haarlinie | Kopfzeile, Leiste unten und Pfad-Pille: `surface` mit `border`, **kein Milchglas** (`backdropFilter`), kein Schatten. Das Landschaftsband ist ein Bauteil: `components/Landschaftsband.jsx` |
| **H** | **Nichts kleiner als die Skala** — der kleinste Schritt ist `text.xs` = 13 px | Keine Rohschrift unter 13 px, kein `text.xs - 1`. Ausnahmen nur Deko-Zeichen (Aufklapp-Pfeil) und Grafik-Beschriftungen; diese stehen als Bestand mit Sperrklinke und werden einzeln bei 375 px gemessen |
| **I** | **Was man bedient, sieht man** — Rand eines Bedienelements mindestens 3:1 (WCAG 1.4.11) | Eingabefelder, Auswahlfelder, Textfelder: Rand `palette.feldrand` (hell `#808286` 3,25:1, dunkel `#80838A` 3,33:1). `border` bleibt Schmuck-Haarlinie zwischen Karten und Zeilen |

### 7c. Kantonskarten — eine Frucht, vier Stufen *(09.11.2026)*

Gilt für `/kantonsatlas/` und die Karten im App-Teil («Ihr Kanton auf der Karte»). Herleitung und
Werte: [`farb-und-daten-system.md` § Karten](../design/farb-und-daten-system.md#karten--kantonsatlas).
Stebler Studios, 09.11.2026: «Ja, so bauen». Bis dahin trugen alle Karten Heidelbeere.

- **Farbe = Thema, nie Wertung.** Jede Karte trägt die Frucht ihres Lebensbereichs (Regel 3 im
  Daten-System). Dunkler (im dunklen Modus heller) heisst «höhere Zahl», nicht besser oder schlechter.
- **Gold und Rosé bleiben frei.** Aprikose (≈ Gold, «finanziell enger») und Kirsche (≈ Rosé, harte
  Schwelle) sind keine Kartenfarben. Steuern und Familie nehmen darum Zwetschge (Behörden): Regel 1 vor Regel 3.
- **Vier Stufen, gleichmässig** (Regel B): je Nachbarpaar etwa 1,7:1 hell, 2,2:1 dunkel, nie unter 1,6:1.
  3:1 je Paar ist mit vier Stufen nicht erreichbar (27:1 > 21:1); die Werte stehen in Titel, Legende und Tabelle.
- **Viertel statt fester Skala.** Die Stufen teilen die 26 Kantone je Karte in Viertel. Das widerspricht «Skala
  fest» nicht: Sie springen nicht zwischen Sitzungen, nur einmal im Jahr mit neuen Daten.
- Quelle: `KARTEN_FRUCHT` und `FRUCHT_STUFEN` in `scripts/seiten/kantonsatlas.mjs`. Wächter:
  `src/__tests__/atlasStufenAbstand.test.js`.

**Der Atlas als Brückenstück** *(09.11.2026, Stebler Studios «Ja, A bis C bauen»)*: Website → Atlas → App, und
aus der App zurück zur Karte. Drei Regeln:

- **Brillen sind Filter, ohne Skript.** Person · Firma · Kanton oder Gemeinde · Stiftung oder Verein, dazu «Alle
  Karten» als Start. Jede Brille hat eine Adresse (`/kantonsatlas/#fuer-firma`), man kann sie verlinken. Nicht
  passende Karten klappen auf eine Zeile mit «Karte zeigen» zu, **keine verschwindet**. Gewählt heisst Fläche
  Heidelbeere + fett + «(gewählt)» für Screenreader. Kann ein Browser nicht filtern (`:has()`), gibt es keine
  Knöpfe — kein Knopf, der nichts tut.
- **Jede Karte mit Werkzeug führt in die App**: «Mit Ihren Angaben rechnen: ‹Werkzeug›», Ziel `/?beispiel#/…`
  (ohne Code das Beispiel, mit Code die eigene App). Das Werkzeug wird beim Namen genannt; «Ihre eigene Lage»
  verspricht zu viel, wo die Karte eine Quote zeigt. Karten ohne Werkzeug versprechen nichts.
- **Die Website zeigt den Atlas als eigenen Abschnitt** mit den vier Brillen als Wege hinein. In der App bleibt
  es beim Entscheid 24.10.2026: keine Atlas-Seite, die Karte steht im Werkzeug.
- **Auf der Website eine Karte als eigenes Bild** *(10.11.2026, Stebler Studios, Skizze A–C → «C: als eigenes
  Bild»)*: die Prämienkarte als Datei `/kantonsatlas/karte-praemie.svg` (gepackt etwa 13 kB, die Seite selbst
  etwa 11,5 kB), mit `loading="lazy"`, Breite und Höhe am Bild. Tippen führt zur Karte im Atlas. Ein Bild erbt
  kein CSS, darum stehen Frucht, Rand und dunkler Modus fest in der Datei, erzeugt aus derselben Quelle
  (`karteBild` in `scripts/seiten/kantonsatlas.mjs`). Nicht in die Seite einbetten. Wächter:
  `src/__tests__/vorstellungAtlas.test.js`.
- Wächter: `src/__tests__/atlasBruecke.test.js`. Adressen in die App: eine Quelle, `scripts/seiten-ziele.mjs`.


### Knöpfe (seit Fassung 9, 05.11.2026)

Eine Quelle: [`src/components/PrimaryButton.jsx`](../../src/components/PrimaryButton.jsx)
(`knopfStil`, `linkStil`, `auswahlStil`, `PrimaryButton`, `SecondaryButton`, `DangerButton`).
Wächter: `src/__tests__/knopfarten.test.js`.

| Art | Aussehen | Wann |
|---|---|---|
| **Hauptknopf** | gefüllt Sand, Schrift `onSand` | der eine nächste Schritt — **einer je Seite oder Dialog** |
| **Nebenknopf** | leer, Rand + Schrift `sandDeep` | zurück, abbrechen, später, zweite Wahl |
| **Gefahr** | leer, Rand + Schrift `roseDeep`; gefüllt nur im letzten Bestätigungsschritt | nur wenn etwas verloren geht |
| **Leise** | goldener Text ohne Rand | Aufklapper («Mehr zeigen ›», «ändern ›») |
| **Link** | goldener Text, immer unterstrichen | führt woanders hin, löst nichts aus |
| **Auswahl** | gewählt Sand gefüllt, sonst Rand `border` | Reiter, Segmente, Chips, Schalter |

- **Rundung:** alle Knöpfe und Auswahlen **10 px** (`KNOPF_RADIUS` = `radius.md`, Regel C in §7a; überholt 6 px am 06.11.2026). Kreise nur für
  reine Symbolknöpfe ohne Text (Plus in der Leiste, runde Icon-Knöpfe). Keine Pillen an Textknöpfen.
- **Mindesthöhe** 44 px.
- **Ausnahme:** der rot gefüllte Ernstfall-Knopf im Kapitel Notfall (Notruf).
- Karten und Listenzeilen, die woanders hinführen, bleiben Karten (kein Gold als Fläche).
- **Gold erst beim Festhalten** (E2, Stebler Studios 06.11.2026, «Ja, so übernehmen»): Ein Knopf,
  der nur ein Formular oder einen Bereich öffnet («+ Erinnerung hinzufügen»), ist **Nebenknopf**.
  Hauptknopf ist erst der Schritt, der wirklich speichert oder sendet. Knöpfe, die nur in einer
  Ansicht springen («Heute» im Kalender), sind **Auswahl**. Wächter: `knopfarten.test.js`
  («Öffner sind nie Hauptknopf»). Herleitung: `docs/design/gesamtbild-2026-11/GESAMTBILD.md` §3b.
- Kleine × zum Löschen in Listen bleiben graue Symbole mit Ansage (`aria-label`).
  Ihre Tippfläche ist trotzdem 44 × 44 (Polster um das Zeichen, nicht ein grösseres Zeichen).
- **Löschen fragt nie, es lässt sich zurücknehmen** (10.11.2026): Der Eintrag ist sofort weg,
  darunter steht rund fünf Sekunden «Entfernt · ‹Name›» mit dem Nebenknopf «Rückgängig», der ihn an
  dieselbe Stelle zurücklegt. Kein «Wirklich löschen?», keine Browser-Dialoge. Leere Eingabezeilen
  gehen ohne Meldung. Baustein: `hooks/useRueckgaengig.js` + `components/RueckgaengigMeldung.jsx`;
  Wächter: `rueckgaengig.test.js` (Liste aller Lösch-Listen — eine neue gehört dort hinein).
  Ausgenommen sind ganze Bestände (Daten löschen, Sicherung zurückspielen): die haben ihren eigenen,
  ausdrücklichen Weg.

Entschieden von Stebler Studios am 05.11.2026 (Knopf-Inventur, 20 Entscheide, «setze alle
Empfehlungen um und beachte die Rundungen der Knöpfe»).

### Kalenderblatt: das Zeichen für Fristen (seit Fassung 9, 06.11.2026)

Eine Quelle: [`src/components/Kalenderblatt.jsx`](../../src/components/Kalenderblatt.jsx).
Wächter: `src/__tests__/kalenderblatt.test.js`, `src/__tests__/fristenBlau.test.js`.

- **Nur für Fristen mit Handlung.** Kapitel Behörden (Steuerfrist), Frist-Karte in den Abläufen
  (`art: 'frist'`), Kalender-Liste (Fristen, nicht Termine). Kein Blatt für Geburtsdatum,
  «Stand vom …», Export- oder Importdatum und Erinnerungen.
- **Gestalt (Variante E):** Monat · Tag · Jahr. Band mit dem Monat in Sky mit etwa einem Drittel
  Deckkraft (Schrift `text`, im Browser gemessen 6.9:1 dunkel, 10:1 hell), oben eine volle Kante
  von 3 px, Rahmen in Sky. **Vorbei:** dasselbe in Rose. In Listen klein und ohne Jahr.
- **Die Farbe trägt das Blatt.** Die Frist-Karte drumherum hat einen neutralen Rand.
- **Das Blatt nie in der Farbe des Lebensbereichs:** Finanzen ist Gold (= handeln), Familie und
  Notfall liegen nahe an Rose (= vorbei), Versicherungen ist Sky.
- **Das Thema zeigt der Frucht-Stempel** unten rechts auf der Ecke des Blatts: die Frucht des
  Lebensbereichs in seiner Farbe, das Symbol als Aussparung (`FruchtMitIcon`, Obstgarten-Motiv),
  **ohne runde Unterlage**. In den Abläufen (Bereich und Symbol aus dem Register) und im Kapitel
  Behörden. In der Kalender-Liste nicht: Dort zeigt schon die Themen-Kachel daneben das Thema.
  (Stebler Studios 06.11.2026, «ja super», nach Skizzen F–J und Probe in der App.)
- **Fürs Vorlesen stumm** (`aria-hidden`): Das Datum steht immer im Satz daneben.

Entschieden von Stebler Studios am 06.11.2026 («Ja, E so», nach Skizzen A–E).

---

### 7e. Die Reise auf der Startseite — Kehren, Wanderstock, Stocknägel *(Entwurf 10.11.2026, näher an Fuji: A–E, dann A–F)*

Der Abschnitt «Ein Weg, Kehre für Kehre» auf malojaplana.ch/ (`scripts/seiten/vorstellung.mjs`, `website/reise.js`).
Richtung «Stationen sammeln» (Vorbild «Collecting Stamps on Mt. Fuji»): nur Prinzipien, keine fremden Bilder oder Code.

| Regel | Wie |
|---|---|
| **Anfang = Hero (A/B)** | Kopfzeile und Hero liegen auf dem Passbild, und dieses Bild ist zugleich Bild 0 der Reise-Bühne: dunkle Schrift auf heller Schicht, darunter folgen ohne Umweg die sieben Kehren. Am Handy liegt der Text ebenso auf dem Bild. Der Übergang heisst «Sieben Kapitel, Kehre für Kehre» (Nebenknopf). Die Situationen kommen nach der Reise. *(Bis 10.11. mittags: eigener Nacht-Bildschirm mit Ring «Losgehen» — abgelöst.)* |
| **Geräte (C)** | im Hero ein Laptop mit der App am Computer und davor rechts ein Telefon mit der Bildfolge; beide «im Beispiel mit erfundenen Daten» |
| **Bühne** | je Kehre ein eigenes gemaltes Bild, vom Talboden im Bergell über die Serpentinen bis zum Silsersee oben am Pass; randlos, klebt beim Scrollen. Zurzeit KI-gemalt (lockerer Aquarell-Gouache-Stil, Figma «Maloja Reise · Bilder») und so beschriftet; später echte Malerei. Das Passbild lädt sofort, die Kehren-Bilder erst kurz vor ihrer Kehre |
| **Bildwechsel (E)** | das neue Bild kommt als **Pinselstrich**, der von links nach rechts quer übers Bild wischt (Maske mit ausgefranster Kante, eigene Form, 1,1 s, Kurve `cubic-bezier(.4,0,.2,1)`); darüber ziehen leise Wolken. Kein Wachsen aus der Mitte (wirkte wie Zoomen) |
| **Kehre = Kapitel** | sieben Kehren in der Reihenfolge der App (`CHAPTER_KEYS`), Kapitelfarben aus `lebensbereiche.js`; an jeder Kehre das **Kapitel-Zeichen der App** (Leitform aus `seitenZeichen.js`, erzeugt aus `IconAbzeichen.jsx` nach `scripts/seiten/kapitel-zeichen.mjs`, nie nachgezeichnet) |
| **Sammelobjekt (B/D)** | Wanderstock in der Mitte, mit Licht- und Schattenkante; je erreichter Kehre ein **Aufkleber**, wie man sie an einen Wanderstock klebt: Formen wechseln (Schild, Rechteck mit runden Ecken, Kreis, Oval), je leicht schräg (bis ±8°), weisser Grund mit Rand in der Kapitelfarbe, darunter ein Schatten, darüber eine Wölbung (das Holz ist rund); darauf das **Kapitel-Zeichen der App**. Die Aufkleber sitzen **rundum** (je 1/7 Drehung) |
| **Text (C)** | weiss **direkt auf dem Bild**, rechts neben dem Stock; darunter eine dunkle Schicht, die unter dem Text mindestens 62 % deckt (Text und Kehren-Zeile reines Weiss #FBFBFA). Am Handy eigene dunkle Fläche 78 % **ohne Milchglas**. Zwei Nebenknöpfe auf **Papier** (deckend `#FBFBFA`, Schrift und Rand sandDeep, **10 px**, keine Pillen): «… im Beispiel ansehen» und «Weiter» (zur nächsten Kehre, zuletzt «Weiter: App holen») |
| **Grosses Zeichen (D)** | statt einer grossen Zahl steht gross das **Kapitel-Zeichen** über dem Text: helle Plakette, Ecke 16 px, Zeichen in der Kapitelfarbe, `aria-hidden`; die Information steht als Text «Kehre n von 7». *(Bis 10.11. mittags: grosse Zahl 01–07 — doppelte sich mit «Kehre n von 7».)* **Keine Höhenangaben ohne Quelle** |
| **Weglinie (D)** | links im Bild, gepunktet, der gegangene Teil durchgezogen; an jedem Halt das **Kapitel-Zeichen** auf heller Scheibe mit Rand in der Kapitelfarbe, die aktuelle Kehre mit Ring in Sand und dem Kapitelnamen. Sie ist während der Reise die einzige Ortsangabe (keine Leiste oben) |
| **Bewegung** | Pinselstrich, Nagel «schlägt an» (0,6 s) und Wolken nur ohne «weniger Bewegung». **Die Kamera kreist um den Stock** (wie bei Fuji die Perspektive, nicht der Stock allein): zwischen zwei Aufklebern wandert das Bild seitlich mit (bis 6 %) und das Licht gleitet übers Holz; steht ein Aufkleber vorn, ruht beides. Mit «weniger Bewegung» wechseln Bild, Aufkleber und Ort genauso, ohne Kamerafahrt. Ohne Skript: helle Hero-Fläche, alle Aufkleber vorn, Passbild bleibt stehen. Keine Vergrösserung über §8 hinaus |
| **Seite sonst (F)** | genau **ein Hauptknopf** (im Hero), alle übrigen Nebenknöpfe; Auswahl-Chips gewählt Sand gefüllt, 10 px; Links Gold (sandDeep) unterstrichen, auch im Fuss; Bildmarke in der Kopfzeile einfarbig Anthrazit (§4) |
| **Kopf (A)** | liegt auf dem Passbild und scrollt mit weg. Am Handy wird die Navigation zur **wischbaren Zeile** (Knöpfe 44 px, 10 px, leiser Verlauf am rechten Rand), sie verschwindet nie. Erster Link: «Zum Inhalt springen». Browserleiste je Farbschema (`#F2F2F0` / `#22211F`) |
| **Leiste (C)** | erscheint erst **nach der Reise**: Papier `#FBFBFA` mit Haarlinie, 56 px, **kein Milchglas**, Seiten-Links mit dem aktuellen Abschnitt (unterstrichen, am Handy Sand gefüllt). Erscheinen 250 ms, Verschwinden 150 ms (§7a E); ohne Skript gibt es sie nicht. *(Bis 10.11. nachmittags auch während der Reise mit «Kehre n von 7» und Punkten — abgelöst, die Weglinie zeigt den Ort.)* |
| **Fuss (D/E)** | heller Grund mit Haarlinie (kein dunkles Band), drei Spalten: **Marke** (Bildmarke Anthrazit, führt nach oben, ein Satz, Mail) · **Entdecken** (Beispiel, Kapitel, App holen, Erklärseiten) · **Rechtliches** (Impressum/Datenschutz/Haftung, AGPL, Quellcode, Problem melden). Darunter die Vertrauenszeile «Ohne Konto · Ohne Werbung · Ihre Angaben bleiben auf dem Gerät», die Sprachen der App und der Vorbehalt. Vorbild: Fuss von Healing & Balance und der Erklärseiten. *(Die Erklärseiten haben noch ihren eigenen Fuss aus `build-seiten.mjs`; eine gemeinsame Quelle ist ein späterer Schritt.)* |
| **Ausklang und Abstände** | nach der letzten Kehre verläuft das Bild auf 45 % der Bildhöhe ins Papier der Seite (kein harter Schnitt). Abschnitte der Startseite 96 px (= 64 × 1.5, Kapitelstufe nach §7a B), am Handy 64; Spalten 64 |
| **Schrift (Startseite)** | wie §3: **Titel in Hanken Grotesk** (h2/h3 700/600), alles andere Lexend; Grössen nur aus der Skala 13 · 15 · 16 · 19 · 23 · 28 · 36, einzige Ausnahme der h1 im Hero (48, Tablet 38, Handy 32). Keine Versalien-Etiketten (wirken wie SaaS-«Eyebrows»), Etiketten 15 px normal. Kleintext mindestens 15, Fliesstext 16; Zweitfarbe hell `#575B61`. KI-Bilder am Bild nur «KI-gemalt», der ganze Satz im Fuss. Wächter `vorstellungSeite.test.js` («Schrift») |
| **Kein Zwang** | Nägel sind Zeichen, keine Punkte; nichts wird gespeichert |

Entschieden von Stebler Studios am 10.11.2026 («näher an Fuji», alle fünf Punkte A–E nach Skizze; danach «Ja, alles so» zu A–F: Hero und Reise vereint, Laptop + Telefon, Drehen statt Zoom, Pinselstrich quer, Brand Book auf der ganzen Seite; dann «Alle, A bis E» zu Kopf, Leiste und Fuss nach der Durchsicht der eigenen Projekte, `stebler-studios/analysen/maloja-startseite-abschauen-2026-11-10.md`).

## 8. Calm-UX-Prinzipien

- **Entschlacken via Disclosure/Dropdown — nie löschen.** Die Bergketten-Landkarte ist Identität;
  Inhalte werden eingeklappt, nicht entfernt.
- **Ruhige Listen statt KPI-Kacheln** (Muster: ChapterView-Versicherungsübersicht).
- **Zurückhaltende Bewegung:** Vergrösserung max. ~1.04 — beim Darüberfahren **und** in
  Rückmelde-Animationen (Haken, Stempel, Aufspringen); kein `1.12`. Zeiten und Kurve nur aus
  `duration`/`ease`, keine festen `ms`/`s` (hartcodierte px/Farben ebenso vermeiden). Einzige
  bewusste Ausnahme: das Atmen des Ladezeichens (`mp-breathe`, 2.6 s Schleife).
- **Weniger Bewegung gilt für beide Schalter:** die Systemeinstellung *und* den App-Schalter
  (`data-reduce-motion`). Animationen aus JavaScript (`el.animate`) erreicht die CSS-Regel nicht —
  sie prüfen beides selbst. *(Nachgeführt 06.11.2026.)*
- **Bedingte Sektionen** statt leerer Zahlen-Rechner (z.B. Alimente klappt ohne Kinder ein,
  bleibt aber erkundbar) — ehrliche Orientierung vor Schein-Präzision.
- **Wert vor der Hürde zeigen:** Trust/Nutzen vor dem Gate (BetaGate-Intro, Demo-Modus).
- **Eine Kernzahl zuoberst: der Reserve-Tank mit den Monaten** *(10.11.2026, Idee aus dem Abgleich
  mit Nessie; Stebler Studios: «gleiches System wie das Netz-Schild, die grosse Zahl mit in die Logik
  einbauen»)*. Über «Was ist jetzt dran?» steht **kein neues Zeichen, sondern der Tank** als Spiegel
  (§7b): klein (64 px), daneben gross die Monate, die der liquide Notgroschen die Ausgaben deckt. Es
  ist derselbe kleine Tank wie in der Kapitelzeile Finanzen (`ReserveTank groesse: 'klein'`), mit
  derselben Rechnung (`data/reserveTank.js`). Eine Karte, keine Kachelreihe (siehe «Ruhige Listen
  statt KPI-Kacheln»). Keine Ampelfarbe. Ohne erfasste Ausgaben erscheint sie nicht, und bei leerem
  Notgroschen steht keine grosse «0», sondern der leise Satz der Tankanzeige. Quelle:
  `src/components/NotgroschenZahl.jsx` (nachgeladen). Wächter: `src/components/__tests__/notgroschenZahl.test.js`.

### Drei Schichten: erst sehen, dann lesen (seit 09.11.2026)

Maloja erklärt zuerst mit Bild, Zahl und Weg, erst danach mit Text. Jeder Abschnitt einer
erklärenden Seite hat diese Reihenfolge:

| | Schicht | Regel |
|---|---|---|
| **A** | **Bild zuerst** | Abbildung, Balken, Kernzahl oder Zeitleiste. Wer nur das sieht, hat das Wichtigste. Jede Zahl darin trägt ihren Beleg |
| **B** | **Ein Satz** | Höchstens zwei Sätze (auf den Erklärseiten ein kurzer Absatz, der nach vorne wandert), **aus dem geprüften Text** übernommen — keine neue Fachaussage. Fällt die Einschränkung aus dem Zusammenhang weg, kommt sie mit in den Satz |
| **C** | **Ausführlich lesen, mit Ausnahmen und Quellen** | Der ganze Text bleibt, aufklappbar (`<details>`). Nichts wird gestrichen (siehe «Entschlacken … nie löschen» oben) |
| **D** | **Wege** | Weg-Knöpfe zu verwandten Fragen auf der Seite und zu anderen Seiten statt Verweisen im Fliesstext. Rand, Fläche, Pfeil, 44 hoch, Ecke 10 (Regel C) |

Gebaut: `/krankenkasse/`, `/politsystem/`, `/kantone-im-vergleich/` (Schalter `schichten`,
Felder `bild`/`kurz`/`wege` in `scripts/seiten/*.mjs`; Zahlen als Punktstreifen) und
`/praemienverbilligung/` (Feld `kurzAbsatz` in `scripts/seiten-inhalt.mjs`).
**A entfällt nie stillschweigend, aber auch nie als Schmuck:** Zeigt kein Bild etwas, beginnt der
Abschnitt mit B. **Mehrsprachige Seiten zuerst nur auf Deutsch;** die Übersetzungen folgen erst nach
ihrer menschlichen Lektüre, damit keine ungeprüften Sätze dazukommen. Vor dem Merge laufen rechts- und swiss-precision-pruefer über A und B:
ein wörtlich übernommener Satz kann allein zu absolut werden. *(Stebler Studios 09.11.2026,
«Ja, Probe bauen» und «Gut, weiter so».)*

---

## 9. Offene Brand-Themen

- [x] Export-Icon — Pfeil nach unten, Sicherung eigenes Zeichen (vorläufig, 08.11.2026; Tester-Feedback kann es ändern)
- [x] ~~Signet-Farben an Granit angleichen~~ — gegenstandslos, Signet durch Markenpaket 1.0 abgelöst (24.09.2026)
- [x] `og-image` mit der neuen Bildmarke (24.09.2026, Paket `social-preview-1200x630`)
- [ ] Claim-Entscheid: «Ihr Leben. Ihre Übersicht.» oder «Verstehen, was zusteht. Ordnen, was ansteht.» (siehe §4)
- [x] Vorsorge-/Organspende-Icon-Metaphern — Vorsorge = Ast im Edelweiss-Schild (Traube-Farbe), Organspende = Herz im Arztkoffer, Ast Notfall (08.11.2026)
- [ ] OFL-Lizenztexte zu den WOFF2 legen *(Logo-Schriftzug ist seit 24.09. als Pfade geliefert — Outlinen erledigt)*
- [ ] FR: Entscheid voller tu-Toggle vs. vous-only
- [ ] RM: muttersprachliche Review vor Deploy

*Erledigt:* Granit-Palette · Wortmarke (Gipfel-M, **abgelöst 24.09.2026**) · **Markenpaket 1.0 in App, Icons und Link-Vorschau** · Typo-Entscheid (Lexend/Hanken/Atkinson) ·
Voice-Entscheid + **Anrede-Toggle DE/IT/RM umgesetzt** · Kapitel-Icons · Bergketten-Karte ·
**Brand Guidelines gebündelt (dieses Dokument)**.
