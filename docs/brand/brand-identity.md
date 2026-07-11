# Maloja Plana — Brand Identity

**Stand:** Juni 2026 · **Firma:** Stebler Studios (Sophie Stebler, Basel)

Lebendes Dokument. Hier werden alle Marken-**Entscheidungen** (inkl. Herleitung + Verworfenes)
festgehalten. Für die kompakte, gebündelte Anwendungs-Referenz siehe
[`brand-guidelines.md`](brand-guidelines.md) — das eine kanonische Übersichtsdokument.

---

## 1. Farbpalette — «Granit»

Gewählt aus Farbpsychologie + interkultureller Wirkung (kulturell neutral, warm-neutraler
Unterton, beruhigend, zeitlos). Begründung: Zielgruppe = Menschen die in der Schweiz ankommen,
oft gestresst, aus verschiedensten Kulturen. Farbe soll beruhigen + Vertrauen schaffen.

| Rolle | Hex | Einsatz |
|-------|-----|---------|
| Light BG | `#F2F2F0` | Hintergrund hell (warmer Stein, statt früher Cream `#F5F2EE`) |
| Surface | `#FAFAF8` | Cards, erhöhte Flächen |
| Dark | `#24262A` | Hintergrund dunkel (Schiefer, statt früher `#1A1816`) |
| Sage | `#5A7868` | **Primärfarbe** — Buttons, Links, Erfolg, «weiter/sicher» |
| Gold | `#C4A870` | **Akzent** — Wortmarke, Highlights, Premium-Momente |
| Rose | `#B87070` | Warnung, Fehler |
| Sky | `#6E90B0` | Info, sekundäre Links |

**Warum Granit gewann (vs. Cream/Cool White/Sage/Slate/Warm Stone):**
- Kulturell am neutralsten — kein Farbton schliesst eine Kultur aus
- Warmer Unterton verhindert «kalte Behörde» → sagt «willkommen»
- Grün (Sage) ist universell positiv + reduziert Stress; Gold = Wert/Qualität in jeder Kultur
- Zeitlos, nicht trendabhängig; funktioniert in Light + Dark gleich gut

---

## 2. Typografie

**Prinzip:** Drei Schriften, je ein klarer Job. Alle frei lizenziert + lokal als WOFF2 hostbar
(passt zur Privacy-/Local-First-Architektur, keine externen Requests).

| Rolle | Schrift | Begründung |
|-------|---------|-----------|
| **Body, Navigation, Formulare, alles Funktionale** | **Lexend** | Wissenschaftlich auf Leseflüssigkeit getuned, ermüdet am wenigsten beim Durchlesen. Wichtig: viele Nutzer lesen in einer Fremdsprache unter Stress → hohe Leselast für alle. |
| **Accessibility-Toggle** (anklickbar) | **Atkinson Hyperlegible** | Vom Braille Institute, maximale Buchstaben-Eindeutigkeit (b/d/p/q, I/l/1). Für Sehbehinderte + Legastheniker, die es brauchen. |
| **Wortmarke + Logo** | **Hanken Grotesk** (+ Custom-Detail, siehe §3) | Schweizer Grotesk-Tradition (Helvetica ist Schweizer), zeitlos, neutral, klar. |

**Editoriale Headlines in der App: Hanken Grotesk** (festgelegt 2026-06-24). Dieselbe Grotesk
wie die Wortmarke → eine kohärente Marken-Schrift-Welt. Kontrast zum Body kommt aus Rolle +
Gewicht (Hanken 600/700 für Titel, Lexend für Text), nicht aus Serif-vs-Sans. Lora verworfen
(hat nie ganz gepackt; spart eine geladene Schrift).

**Verworfen + warum:**
- *Inter, Plus Jakarta, Instrument Sans* → zu «moderne Software»/Startup
- *Playfair Display* → zu theatralisch, «Magazin-Inszenierung»
- *Cormorant Garamond* → als Lesetext zu dünn/preziös (eure Designphilosophie nennt sie zwar,
  Stebler Studios empfand sie aber als zerbrechlich)
- *OpenDyslexic / «Dyslexie-Fonts»* → Studien zeigen kaum Wirkung, zerstören die ruhige Ästhetik.
  Echte Hebel stattdessen: Sans-serif fürs Lesen, mehr Buchstaben-/Zeilenabstand, Off-White BG
  (haben wir), unterscheidbare Buchstaben, + Nutzer-Toggle für Grösse/Abstand.

---

## 3. Die Wortmarke

**Maloja Plana** in **Hanken Grotesk**, mit *einem* eigenen Detail:

> **Das «M» ist nicht der Schrift-Buchstabe, sondern zwei gezeichnete Berggipfel**
> (der Maloja-Pass) — exakt dieselbe Silhouette wie im Signet.

### Finale Spezifikation (festgelegt)
- **Gipfel-Charakter:** «Ausgewogen» — zwei Peaks, der rechte (zweite) etwas höher,
  moderate Tal-Tiefe. Nicht zu sanft, nicht zu alpin-spitz.
- **Gold-Detail:** Goldpunkt (`#C4A870`) am höheren (rechten) Gipfel — wie eine Sonne /
  Markierung über dem Pass.
- **Strichstärke:** des Gipfel-«M» = passend zu Hanken Grotesk 700 (optisch wie ein echter
  Buchstabe, nicht dünner).
- **«aloja»:** Hanken Grotesk 700, Farbe Dark `#24262A` (hell) bzw. `#EDE8E0` (dunkel).
- **«Plana»:** Hanken Grotesk 600, Farbe Gold `#C4A870`.
- **Schreibweise:** Titelcase (Maloja Plana), **nicht** Versalien, **nicht** kursiv.

### Konstruktion des Gipfel-«M» (als SVG-Polyline)
Fünf Punkte, `stroke-linejoin/​linecap: round`, kein Fill:
`bottom-left → peak1 → valley → peak2(höher) → bottom-right`, Goldpunkt als `<circle>` auf peak2.
Beispiel-Geometrie bei Schrifthöhe 74px: Stroke ≈ 13px, Goldpunkt r ≈ 6.5px.

### Warum das funktioniert
- **Wortmarke ↔ Signet** erzählen dieselbe Geschichte (Berge = M).
- **Das «M» allein wird zum App-Icon / Favicon** — funktioniert auch winzig.
- Unverwechselbar, aber **nie verspielt** — Architektur, kein Cartoon (→ wertig statt niedlich).
- Lebt als Vektor → kostet **0** im App-Bundle (Schrift muss nicht geladen werden).

### Assets
- `docs/brand/wordmark.svg` — volles Lockup
- `docs/brand/app-icon.svg` — nur das Gipfel-«M» als Icon
- (Produktion: Text vor Auslieferung in Pfade outlinen, damit kein Font nötig ist.)

### Claim
«Dein Leben. Deine Übersicht.» · optional «by Stebler Studios»

---

## 4. Signet (illustratives Logo)

Konzept unverändert (siehe `docs/brand/logo-brief.md`): Ordner (hinten) + Bergsilhouette (vorne,
bildet M) + kleiner Schweizer Pass im Eck (bildet P) + goldener Weg. Drei Leseebenen.
**Farben** an Granit-Palette anpassen (Berge dunkel/sage, Akzente gold).

---

## 5. Voice & Tonalität

**Haltung (aus eurer Sprach-Philosophie, `maloja-writing-language`):** Maloja spricht wie ein
**ruhiger Ort** — beruhigen, orientieren, würdevoll erklären, menschlich übersetzen. NICHT:
verkaufen, motivieren, gamifizieren, optimieren, dramatisieren. Kein Startup-/SaaS-/Behördenton.

**Anrede: selbst wählbar, Standard «Sie»** (festgelegt). Die Nutzer:in entscheidet selbst,
ob sie geduzt oder gesiezt wird — Würde/Nähe sind persönlich + kulturell, also bestimmt sie
jede:r selbst (= euer «der Mensch hat die Kontrolle»-Prinzip, wie beim Lesbarkeits-Toggle).

- **Onboarding:** einmal ruhig + neutral gefragt («Wie möchten Sie angesprochen werden?»),
  beide Optionen in ihrer eigenen Form gezeigt («Ihre Übersicht.» / «Deine Übersicht.»).
- **Einstellungen:** jederzeit umschaltbar (Segmented Control Sie/Du), neben dem
  Lesbarkeits-Toggle.
- **Standard «Sie»** falls nicht gewählt — die würdevolle, sichere Variante. Begründung:
  (1) Würde — die Zielgruppe wird im Behördenalltag oft bevormundend geduzt; «Sie» behandelt
  sie als kompetente Erwachsene. (2) Interkulturell sicher — Formalität = Respekt in vielen
  Kulturen. (3) Passt zur bestehenden Stimme («Ihre Angaben»).

**Umsetzung — erledigt (Juni 2026):** Toggle live für DE (Sie/Du), IT (Lei/tu), RM (Vus/ti,
braucht muttersprachliche Review); FR konsistent vous; EN ohne T-V-Distinktion. Status-Tabelle
in [`brand-guidelines.md` §6](brand-guidelines.md). Prinzip unten weiterhin gültig:

**Umsetzung (Prinzip):** Texte grundsätzlich in «Sie» schreiben, «Du» ist die gespiegelte
Fassung. Nur Strings mit *direkter Anrede* (du/Sie, dein/Ihr, dich/Sie) brauchen zwei Varianten
— Labels/Substantive/Buttons bleiben gleich. Englisch nicht betroffen («you»), FR/IT spiegeln
tu/vous bzw. tu/Lei mit demselben Schalter. Technisch: Setting `or5_anrede: 'sie'|'du'`, das
`t()` die Variante wählen lässt. Kann schrittweise wachsen (Standard «Sie» ab Tag 1).

**«Sie» heisst nicht kalt** — Wärme kommt aus den Wörtern, nicht aus dem Duzen:
- «Willkommen. Schön, dass Sie da sind.»
- «Ihre Angaben bleiben bei Ihnen — nur auf diesem Gerät.»
- «Das hat noch Zeit. Sie können es später ergänzen.»

**Claim** entsprechend: **«Ihr Leben. Ihre Übersicht.»**

**Statt … lieber …** (laut → ruhig):
| Situation | Statt | Lieber |
|-----------|-------|--------|
| Fehler | «Ungültig! Pflichtfeld fehlt» | «kann später ergänzt werden» |
| Fortschritt | «Erst 40% — weiter so!» | «nimmt langsam Form an» |
| Budget | «Zu hohe Ausgaben!» | «ein möglicher Richtwert» |
| Vorsorge | «Jetzt dringend absichern!» | «ruhig für später hinterlegt» |
| Amtsdeutsch | «gemäss Art. 3 KVG…» | «Was das für Sie heisst:» |

**Immer Schweizer Begriffe:** AHV · BVG · Krankenkasse · Franchise · Prämienverbilligung ·
Aufenthaltsbewilligung · Betreibungsregisterauszug · Ergänzungsleistungen (EL).
Nie deutsche/US-Begriffe oder falsche Amtsübersetzungen.

**Sprachen:** DE (Leitsprache, Ton wird hier definiert) → EN (grösste Reichweite, kein Du/Sie)
→ FR → IT → RM. «Sie» wird zu vous / Lei gespiegelt.

**Prüffrage für jeden Text:** «Erzeugt diese Sprache Ruhe und Orientierung — oder Aktivierung
und Druck?»

---

## 6. Offene Brand-Themen (nächste Schritte)

- [ ] Editoriale Headline-Schrift final entscheiden (Lora vs. Hanken Bold)
- [ ] Bildsprache (Icons, Illustrationen)
- [ ] Signet-Farben an Granit angleichen
- [x] Brand Guidelines zusammenführen → [`brand-guidelines.md`](brand-guidelines.md)
- [ ] Umsetzung im Code (`constants.js`, `tokens.css`) — erst NACH vollständiger Definition
