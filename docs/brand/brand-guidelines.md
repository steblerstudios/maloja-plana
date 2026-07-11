# Maloja Plana — Brand Guidelines

**Stand:** Juni 2026 · **Firma:** Stebler Studios (Basel)

Das **eine** kanonische Marken-Referenz-Dokument. Es bündelt Farbe, Typografie, Logo,
Bildsprache, Stimme und Design-Tokens an einem Ort. Die Detail-Dokumente bleiben als
Tiefen-Quellen bestehen — diese Seite ist der Einstieg und zeigt auf sie.

| Bereich | Tiefen-Quelle |
|---------|---------------|
| Markenentscheidungen (Herleitung, Verworfenes) | [`brand-identity.md`](brand-identity.md) |
| Vollständige Icon-Liste + Status | [`icon-dictionary.md`](icon-dictionary.md) |
| Signet-Konzept (Ordner + Berg + Pass) | [`logo-brief.md`](logo-brief.md) |
| Wortmarke / App-Icon als Vektor | [`wordmark.svg`](wordmark.svg) · [`app-icon.svg`](app-icon.svg) |
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

| Rolle | Hex | Einsatz |
|-------|-----|---------|
| Light BG | `#F2F2F0` | Hintergrund hell (warmer Stein) |
| Surface | `#FAFAF8` | Cards, erhöhte Flächen |
| Dark | `#24262A` | Hintergrund dunkel (Schiefer) |
| **Sage** | `#5A7868` | **Primärfarbe** — Buttons, Links, Erfolg, «weiter/sicher» |
| **Gold** | `#C4A870` | **Akzent** — Wortmarke, Highlights, Premium-Momente |
| Rose | `#B87070` | Warnung, Fehler |
| Sky | `#6E90B0` | Info, sekundäre Links |

**Prinzip:** Grün (Sage) ist universell positiv + reduziert Stress; Gold = Wert/Qualität in
jeder Kultur; der warme Unterton verhindert «kalte Behörde». Kein Farbton schliesst eine Kultur
aus. Kontrast-Paare müssen WCAG AA erfüllen (Light **und** Dark). Herleitung + verworfene
Paletten: [`brand-identity.md` §1](brand-identity.md).

---

## 3. Typografie

Drei Schriften, je ein klarer Job. Alle frei lizenziert + lokal als WOFF2 gehostet (keine
externen Requests → passt zur Privacy-/Local-First-Architektur).

| Rolle | Schrift | Warum |
|-------|---------|-------|
| **Body, Navigation, Formulare, alles Funktionale** | **Lexend** | Auf Leseflüssigkeit getuned; ermüdet am wenigsten — wichtig, weil viele in einer Fremdsprache unter Stress lesen. |
| **Editoriale Headlines + Wortmarke/Logo** | **Hanken Grotesk** | Schweizer Grotesk-Tradition, zeitlos, neutral. Headline-Kontrast kommt aus Rolle + Gewicht (Hanken 600/700), nicht aus Serif-vs-Sans. |
| **Accessibility-Toggle** (anklickbar) | **Atkinson Hyperlegible** | Braille Institute; maximale Buchstaben-Eindeutigkeit (b/d/p/q, I/l/1) für Sehbehinderte + Legastheniker. |

**Type-Scale** (`tokens.js`, px): `xs 13 · sm 15 · body 16 · lg 19 · xl 23 · 2xl 28 · 3xl 36`.
**Gewichte:** `normal 400 · medium 500 · semi 600 · bold 700`.
**Zeilenhöhen:** `tight 1.2 · normal 1.5 · relaxed 1.7`.

> Verworfen: Inter/Jakarta/Instrument (zu «Startup») · Playfair (zu theatralisch) · Lora
> (packte nie ganz) · OpenDyslexic (kaum belegte Wirkung, zerstört die ruhige Ästhetik —
> echte Hebel sind Sans-serif, mehr Abstand, Off-White-BG, Grössen-Toggle).

---

## 4. Logo & Wortmarke

**Wortmarke:** «Maloja Plana» in **Hanken Grotesk**, mit *einem* eigenen Detail —

> **Das «M» ist kein Schrift-Buchstabe, sondern zwei gezeichnete Berggipfel** (der Maloja-Pass)
> — dieselbe Silhouette wie im Signet.

- **Gipfel-«M»:** zwei Peaks, der rechte etwas höher, moderate Tal-Tiefe; Strichstärke wie
  Hanken 700 (wirkt wie ein echter Buchstabe). Konstruktion als SVG-Polyline mit fünf Punkten,
  `round` joins/caps, kein Fill.
- **Gold-Detail:** ein Goldpunkt (`#C4A870`) am höheren (rechten) Gipfel — Sonne/Markierung
  über dem Pass.
- **«aloja»:** Hanken 700, Dark `#24262A` (hell) / `#EDE8E0` (dunkel). **«Plana»:** Hanken 600,
  Gold `#C4A870`.
- **Schreibweise:** Titelcase «Maloja Plana» — **nie** Versalien, **nie** kursiv.

**App-Icon / Favicon = das Gipfel-«M» allein** ([`app-icon.svg`](app-icon.svg)) — funktioniert
winzig. Lebt als Vektor → **0** Byte im App-Bundle. Für Produktion: Text vor Auslieferung in
Pfade outlinen (kein Font nötig).

**Signet** (illustrativ, drei Leseebenen): Ordner + Bergsilhouette (bildet M) + Schweizer Pass
im Eck (bildet P) + goldener Weg → Konzept in [`logo-brief.md`](logo-brief.md). Signet-Farben
sind noch an Granit anzugleichen (siehe §8).

**Claim:** «Ihr Leben. Ihre Übersicht.» (Du-Fassung: «Dein Leben. Deine Übersicht.») ·
optional «by Stebler Studios». Funktionale Unterzeile (Marketing): «Verstehen, was zusteht.
Ordnen, was ansteht.»

---

## 5. Bildsprache / Icons

**Prinzip:** Jedes Icon ist eine bewusste **Schweizer Metapher** für *eine* Funktion. Eine
Funktion = ein Icon (keine Doppelungen), Stil = detaillierte Piktogramme, Farben aus Granit.

Beispiele: Übersicht = **Sackmesser** · Erinnerungen = **Kuhglocke** · Frist/Zeit =
**Mondaine-Bahnhofsuhr** · Finanzen = **Fünfliber** · Versicherungen = **Schild mit Edelweiss**
· Behörden = **Bundeshaus** · Notfall = **generisches Rettungskreuz** (NICHT Rega-Logo).

Vollständige Tabelle inkl. Status (✓/🔄/➕/⚠️) und Code-Keys:
[`icon-dictionary.md`](icon-dictionary.md). Offen u.a.: Export-Metapher, Vorsorge-Metapher,
Organspende-vs-Notfall-Abgrenzung.

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
| **DE** | Sie | Du | ✅ |
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

- **Spacing** (4px-Grid): `2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`
- **Radius:** `sm 6 · md 10 · lg 16 · xl 24 · full 9999`
- **Shadow** (subtil): `sm` bis `xl` mit `rgba(0,0,0,0.06…0.12)`
- **Motion:** Easing `cubic-bezier(0.4,0,0.2,1)` · Dauer `fast 150 · normal 250 · slow 400 ·
  cinematic 600` (ms)
- **Font-Stack:** Body `'Lexend', sans-serif` · Display `'Hanken Grotesk', sans-serif`

---

## 8. Calm-UX-Prinzipien

- **Entschlacken via Disclosure/Dropdown — nie löschen.** Die Bergketten-Landkarte ist Identität;
  Inhalte werden eingeklappt, nicht entfernt.
- **Ruhige Listen statt KPI-Kacheln** (Muster: ChapterView-Versicherungsübersicht).
- **Zurückhaltende Bewegung:** Hover-Scale max. ~1.04 (kein `1.12`); keine Token-Ausreisser
  (hartcodierte px/Farben vermeiden).
- **Bedingte Sektionen** statt leerer Zahlen-Rechner (z.B. Alimente klappt ohne Kinder ein,
  bleibt aber erkundbar) — ehrliche Orientierung vor Schein-Präzision.
- **Wert vor der Hürde zeigen:** Trust/Nutzen vor dem Gate (BetaGate-Intro, Demo-Modus).

---

## 9. Offene Brand-Themen

- [ ] Export-Icon — neue Metapher (auf Tester-Feedback)
- [ ] Signet-Farben an Granit angleichen
- [ ] `og-image.svg` aufs Gipfel-M + Granit; Signet (Ordner+Berg+Pass) angleichen
- [ ] Vorsorge-/Organspende-Icon-Metaphern klären
- [ ] OFL-Lizenztexte zu den WOFF2 legen; Wortmarke für Produktion outlinen
- [ ] FR: Entscheid voller tu-Toggle vs. vous-only
- [ ] RM: muttersprachliche Review vor Deploy

*Erledigt:* Granit-Palette · Wortmarke (Gipfel-M) · Typo-Entscheid (Lexend/Hanken/Atkinson) ·
Voice-Entscheid + **Anrede-Toggle DE/IT/RM umgesetzt** · Kapitel-Icons · Bergketten-Karte ·
**Brand Guidelines gebündelt (dieses Dokument)**.
