# Maloja Plana — Form Experience Review

**Datum:** 2026-06-08
**Frage:** Warum endet die Maloja-Identität aktuell am Kapitelheader?
**Methode:** Quellcode-Analyse + Live-Rendering aller 7 Kapitel, Desktop + Mobile

---

## A. Wo die Identität abbricht

Die Maloja-Identität hat drei Schichten:

| Schicht | Wo sie lebt | Wie stark |
|---------|-------------|-----------|
| **Ikonographie** | Icons, Bergsilhouette, Tier-Labels | ★★★★★ — einzigartig, schweizerisch, unverwechselbar |
| **Stimme** | Orientierungstexte, Empty States, Intro-Sätze | ★★★★☆ — warm, menschlich, druckfrei |
| **Raum** | Formularkörper, Felder, Abschnitte, Übergänge | ★★☆☆☆ — funktional korrekt, aber identitätslos |

**Der Bruch passiert exakt an einer Linie:** unterhalb der Tabs ("Angaben / Dokumente").

Oberhalb dieser Linie: Icon (48px, sandfarbener Hintergrund), Titel (28px, semi-bold), Beschreibung, kursiver Intro-Text. Das ist Maloja — ein Ort mit Charakter.

Unterhalb dieser Linie: `<label>` (13px, grau), `<input>` (cremefarbener Hintergrund, 1px Border), `<label>`, `<input>`. Das ist jede Formular-App der Welt.

### Der technische Grund

In `ChapterView.jsx` gibt es zwei visuelle Welten:

**Welt 1 — der Header** (Zeilen 464–473):
- Zentriertes Layout
- Icon mit Grössenangabe (48px)
- Hierarchische Typografie (28px → 15px → 13px italic)
- Farbdramaturgie (text → mid → sage)
- maxWidth-Constraint für Lesbarkeit

**Welt 2 — der Formularkörper** (Zeilen 549–584):
- CSS Grid mit `auto-fit, minmax(320px, 1fr)`
- Sektionen als `borderTop: 1px` + Label (13px, 500 weight, `palette.mid`)
- Jedes Feld: `marginBottom: 24px`, Label oben, Input darunter
- Orientation-Hints: `fontSize: 13px, color: palette.sage`

Das Grid und die Feldwiedergabe sind technisch sauber. Aber sie haben **keine eigene visuelle Identität** — sie könnten in jeder React-App stehen.

### Was zwischen den Welten fehlt

Es gibt kein Übergangselement. Der Header endet, die Tabs kommen, und dann beginnt sofort die Feldliste. Es fehlt:
- Kein visueller Übergang vom "Ankommen" zum "Arbeiten"
- Keine Materiality-Differenzierung zwischen Sektionen
- Kein Gefühl, dass man einen Raum betritt, wenn man zu einer neuen Sektion scrollt

---

## B. Kälteste Stellen

### 1. Behörden — "Recht"-Sektion

**Felder:** Betreibungsamt, Betreibungsregister, Laufende Gerichtsverfahren

**Warum es kalt ist:** Dies sind die emotional schwersten Felder der gesamten App. "Betreibungsregister" und "Gerichtsverfahren" können für Betroffene mit Scham, Angst und existenzieller Unsicherheit verbunden sein. Visuell sind sie identisch behandelt wie "Vorname" oder "PLZ" — gleicher Input, gleicher Abstand, gleiche Grösse.

**Was bereits da ist:** Die Orientierungstexte sind tatsächlich hervorragend ("Der Sozialdienst deiner Gemeinde ist die erste Anlaufstelle für Unterstützung. Ein Gespräch ist unverbindlich und vertraulich." / "Das Betreibungsregister ist in der Schweiz eine Art finanzielle Visitenkarte."). Die Stimme ist warm. Aber der Raum ist kalt.

### 2. Versicherungen — Endloser Scroll ohne Atempause

**Felder:** Grundversicherung (5 Felder) → Berufliche Vorsorge (2 Felder) → Weitere Versicherungen (2 Felder) → Sozialversicherung (1 Feld)

Die Sektionstrennungen bestehen aus einer 1px-Linie und einem 13px-Label. Bei 10+ Feldern untereinander entsteht ein Scrolltunnel — man verliert das Gefühl, wo man ist. Der Empty-State-Hinweis ("Beginne mit deiner Krankenkasse") ist nur sichtbar, wenn null Felder gefüllt sind — danach verschwindet die einzige Orientierung im Körper.

### 3. Finanzen — Grösster Identitäts-Kontrast

**Icon:** Fünfliber — das beste SVG der App (Lorbeerkranz, "5 FR.", Schweizer Wappen).
**Formularkörper:** "Monatliches Nettoeinkommen CHF [0.00]", "Arbeitgeber [____]".

Der Kontrast ist so gross, dass er fast enttäuschend wirkt. Man tritt ein und denkt: "Oh, das wird besonders." Dann sieht man ein Standard-Währungsfeld. Der Fünfliber verspricht Schweizer Finanzkultur. Der Formularkörper liefert ein Buchhaltungsformular.

### 4. Ausbildung — Am wenigsten "Lebensraum"

**Felder:** Schule/Universität, Höchster Abschluss, EFZ/EBA-Nummer, Weitere Zertifikate, Arbeitgeber, Beruf, Arbeitsbewilligung, Sprachen.

Wenige Sektionen, wenige Orientierungstexte, keine Spiegelung ausser Basistext. Der Doktorhut ist generisch. Der Inhalt ist dünn. Es fühlt sich an wie ein CV-Formularfeld-Set, nicht wie ein Raum, der "Deine berufliche Geschichte" erzählt.

### 5. Basis — "Person"-Sektion

**Felder:** Vorname, Nachname, Geburtsdatum, Geschlecht, Nationalität, E-Mail, AHV-Nummer.

Die ersten 5 Felder haben keine Orientierung, keinen Hinweis, keinen Kontext. Sie sind pure Verwaltungsfelder. Erst bei AHV-Nummer erscheint ein Orientation-Hint. Für eine App, die Identität und Zugehörigkeit vermitteln will, ist die erste Begegnung mit dem Formular die nüchternste.

---

## C. Wärmste Stellen

### 1. Notfall — Empty State + Orientierung

"Für den Fall der Fälle — wer soll informiert werden und was ist wichtig?"
"Ein Notfallkontakt mit Telefonnummer ist ein guter erster Schritt."

Das ist ein Muster, das funktioniert: Eine menschliche Frage, gefolgt von einem konkreten, kleinen ersten Schritt. Das Notfall-Kapitel hat die wenigsten Felder, aber die höchste emotionale Dichte pro Feld.

### 2. Behörden — Orientation-Layer bei Betreibung

"Das Betreibungsregister ist in der Schweiz eine Art finanzielle Visitenkarte. Vermieter, Arbeitgeber und Banken fragen häufig danach."

Das normalisiert ein stigmatisiertes Thema. Es sagt: "Das ist normal, das hat jeder." Die Stimme ist warm, auch wenn der Raum es (noch) nicht ist.

### 3. Versicherungen — KVG-Orientierung

"In der Schweiz ist eine Grundversicherung bei einer Krankenkasse Pflicht. Du wählst Deine Krankenkasse und Dein Modell selbst."

Erklärt das System, ohne zu belehren. Wichtig für Neuzuzüger.

### 4. Finanzen — Kontextuelle IPV-Karte

Die salbeigrüne Karte, die erscheint, wenn Einkommen + Kanton vorhanden sind ("Du könntest Anspruch auf Prämienverbilligung haben") — das ist das Versprechen von Maloja: Die App erkennt Deine Situation und zeigt Dir, was Dir zusteht.

### 5. Wohnen — Empty State

"Dein Zuhause — wie du wohnst, verändert sich mit der Zeit. Trage deine Adresse oder Miete ein, wenn du sie kennst."

"Wenn du sie kennst" — das ist kein Formular. Das ist Verständnis.

---

## D. Die 10 grössten Hebel

| # | Hebel | Aufwand | Wirkung | Beschreibung |
|---|-------|---------|---------|-------------|
| **1** | **Sektionen als Räume** | Mittel | Sehr hoch | Sektionslabels ("Person", "Familie", "Grundversicherung") von einer 1px-Linie + 13px-Label zu einem visuell erkennbaren Abschnitt machen. Nicht als Karten (zu viel Box), sondern als benannte Bereiche mit mehr Luft oben, etwas grösserem Label, und eventuell einem subtilen Hintergrundwechsel (palette.up vs palette.surface alternierend). |
| **2** | **Orientierung für die Kältesten** | Klein | Sehr hoch | Die 5 kältesten Felder (Betreibungsregister, Gerichtsverfahren, Offene Steuererklärungen, Schuldenzahlungen, Betreibungsamt) haben teilweise schon gute Orientation-Hints. Aber "Vorname", "Nachname", "Geburtsdatum" in Basis haben null Kontext — ein einziger warmer Satz am Beginn der Person-Sektion ("Dein Name und Geburtsdatum — wie Du offiziell heisst") würde den Einstieg wärmer machen. |
| **3** | **Filled-Field-Bestätigung** | Klein | Hoch | Wenn ein Feld ausgefüllt wird: ein subtiler visueller Zustandswechsel. Nicht Animation, nicht Gamification — aber der Border oder die Hintergrundfarbe des Inputs könnte sich sanft von `palette.up` zu `palette.up + leicht wärmer` ändern, oder ein feines ○ → ● am Label erscheinen. "Ich habe etwas getan, und die App hat es bemerkt." |
| **4** | **Kapitel-interner Fortschritt** | Klein | Hoch | Ein sanfter Indikator pro Sektion: "Person ○○●" oder einfach eine Textzeile "3 von 7 Angaben" irgendwo am Sektionskopf. Kein Progressbar, kein Prozent — nur ein ruhiges Signal, dass Arbeit sichtbar wird. |
| **5** | **Emotional warme Sektions-Einleitungen** | Klein | Hoch | Jede Sektion (nicht jedes Feld) könnte einen kurzen Einleitungssatz haben — wie die Empty-State-Karten, aber dauerhaft. Beispiel: Sektion "Recht" in Behörden → "Diese Angaben helfen Dir, den Überblick zu behalten — nicht mehr, nicht weniger." Das wäre die Stimme von Maloja, die in den Formularkörper hineinreicht. |
| **6** | **Empty-State-Karten persistent machen** | Klein | Mittel-Hoch | Aktuell verschwinden die Empty-State-Karten, sobald ein einziges Feld gefüllt ist (`filledCount === 0`). Sie könnten stattdessen als reduzierte Kopfzeile bestehen bleiben — nicht mehr als Karte, aber als Satz am Anfang des Formularkörpers. So bleibt die Orientierung erhalten, auch wenn man schon begonnen hat. |
| **7** | **Versicherungen aufteilen** | Mittel | Mittel-Hoch | Die Sektion "Grundversicherung" (5 Felder) könnte visuell stärker als eigenständiger Block wirken — etwas Hintergrund, etwas Rand, etwas mehr Luft nach unten. Das bricht den Scroll-Tunnel und schafft Zwischenstopps. |
| **8** | **Materialität in Sektionswechsel** | Klein-Mittel | Mittel | Die `shadow.md` und `border + borderRadius` des Kapitel-Containers könnten auf Sektionsebene dezent wiederholt werden — nicht als volle Karten, aber als leichte Anhebung bei Sektionswechseln. Ein `boxShadow: shadow.sm` bei jeder zweiten Sektion würde Tiefe erzeugen, ohne Karten-Grid zu werden. |
| **9** | **Spiegelung näher an die Felder** | Mittel | Mittel | Die Mirror-Cards erscheinen aktuell als Block oberhalb der Tabs. Wenn Teile der Spiegelung ("Sophie, geboren 1990, wohnhaft im Kanton Zürich") als Live-Zusammenfassung am Kopf der jeweiligen Sektion erscheinen würden, wäre die Verbindung zwischen Eingabe und Bedeutung direkter sichtbar. |
| **10** | **Responsive Grid-Anpassung auf Mobile** | Klein | Mittel | Auf 375px werden Felder in einer Spalte dargestellt (Grid auto-fit arbeitet korrekt). Aber die Sektionstrennungen (borderTop) wirken auf Mobile schwächer als auf Desktop. Mehr vertikaler Abstand zwischen Sektionen auf Mobile würde die Raumstruktur stärken. |

---

## E. Der kleinste Eingriff mit grösster Wirkung

### Sektions-Einleitungssätze

**Was:** Jede Sektion bekommt einen optionalen einzeiligen Satz — direkt unter dem Sektionslabel, in `palette.sage`, `fontSize: text.sm`, `fontStyle: italic`. Identisches Pattern wie die Kapitel-Intro-Sätze, nur eine Ebene tiefer.

**Warum es der grösste Hebel ist:**

1. **Null Layout-Änderung** — nur ein zusätzliches `<div>` nach dem Sektionslabel
2. **Nutzt ein bestehendes Pattern** — die kursiven Intro-Sätze existieren bereits im Header
3. **Skaliert über alle Kapitel** — ein `sectionIntro`-Key pro Sektion in den i18n-Dateien
4. **Verwandelt jede Sektion in einen Mini-Ort** — statt "Person [Vorname] [Nachname]" wird es "Person — *Dein Name und Geburtsdatum, wie sie offiziell eingetragen sind.* [Vorname] [Nachname]"
5. **Die Stimme von Maloja reicht in den Formularkörper** — das ist exakt der Punkt, an dem die Identität heute abbricht

**Beispiele:**

| Kapitel | Sektion | Sektions-Einleitung |
|---------|---------|---------------------|
| Basis | Person | *Dein Name, wie er offiziell eingetragen ist.* |
| Basis | Kontakt | *Wie man Dich erreichen kann.* |
| Basis | Familie | *Dein Haushalt — wer gehört dazu?* |
| Wohnen | Adresse | *Wo Du gerade lebst.* |
| Wohnen | Kosten | *Was Dein Zuhause monatlich kostet.* |
| Finanzen | Einkommen | *Was jeden Monat auf Deinem Konto ankommt.* |
| Finanzen | Verpflichtungen | *Ausgaben, die regelmässig anfallen.* |
| Versicherungen | Grundversicherung | *In der Schweiz hat jede Person eine Krankenkasse.* |
| Versicherungen | Berufliche Vorsorge | *Deine Pensionskasse — Dein Arbeitgeber zahlt mit.* |
| Behörden | Steuern | *Die Steuererklärung gehört zum Schweizer Alltag.* |
| Behörden | Recht | *Diese Angaben helfen Dir, den Überblick zu behalten.* |
| Behörden | Vertretung | *Falls jemand Dich in rechtlichen Fragen unterstützt.* |
| Notfall | Kontakt | *Wer soll zuerst angerufen werden?* |
| Notfall | Medizinisches | *Was Ärzte im Notfall wissen sollten.* |

**Technische Umsetzung:** Kleiner als ein Sprint — ein neues `sectionIntro`-Feld pro Sektion im Chapter-Config, ein `<div>` in der Sektionsrender-Logik (Zeile 561–579 in ChapterView.jsx), i18n-Keys in 4 Sprachen.

---

## Schlussgedanke

Die Frage war: *Wie wird aus einem guten Formular ein echter Lebensraum?*

Die Antwort: **Nicht durch Dekoration — durch Stimme.**

Maloja hat eine Stimme. Sie spricht im Header. Sie spricht in den Empty States. Sie spricht in den Orientierungstexten unter den Feldern. Aber sie schweigt in den Sektionsübergängen — genau dort, wo der Nutzer von einem Lebensthema zum nächsten wechselt.

Der Formularkörper ist nicht schlecht. Er ist funktional, validiert, responsiv, zugänglich. Was ihm fehlt, ist nicht Technik — es ist Begleitung. Jede Sektion beginnt stumm. Das ist der Moment, in dem der Ort zum Formular wird.

Ein einziger kursiver Satz pro Sektion — in der gleichen Stimme, die schon im Header spricht — würde die Maloja-Identität um eine Schicht tiefer tragen. Nicht bis zum einzelnen Feld (das wäre überladen), aber bis zum Lebensthema.

**Die Identität bricht nicht ab, weil etwas falsch ist.
Sie bricht ab, weil sie auf halbem Weg leiser wird.**

---

*Keine Implementierung. Keine Commits. Nur Analyse.*
*Bereit für Sprint-Planung, wenn gewünscht.*
