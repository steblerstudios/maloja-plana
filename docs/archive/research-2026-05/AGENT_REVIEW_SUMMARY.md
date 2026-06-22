# AGENT REVIEW SUMMARY — Maloja Plana

> Erstellt: 2026-06-08
> Sechs gedankliche Agenten beurteilen den Zustand des Projekts.
> Keine Implementierung. Nur Perspektiven.

---

## 1. REPOSITORY CURATOR

**Aufgabe:** Ordnung, Hygiene, Struktur des Repositories beurteilen.

### Was stimmt?
- Git-History ist sauber — kleine, isolierte Commits
- Archiv-Struktur existiert (`docs/archive/`)
- Vier zentrale Registries vorhanden und gepflegt
- Keine externe Abhängigkeiten ausser Vite + React
- Build funktioniert, Bundle-Grösse unter Kontrolle (188 KB gzip)

### Was fehlt?
- **~160 Dokumente** verteilt über Wurzel und `docs/` — zu viele, zu unübersichtlich
- **31 .md-Dateien im Wurzelverzeichnis** — das ist kein Root, das ist ein Archiv
- Viele Dokumente sind überholt aber nicht archiviert (MASTER_CONTEXT_V1, alte Roadmaps)
- Doppelte Formate: `backlog-registry.json` + `backlog-registry.yaml`
- `ordnung-ruhe/` und `ordnung-ruhe-neu/` im Root — unklar, was das ist
- `Backups/` im Root — gehört nicht ins Repo
- `prompts/` — Zweck unklar
- Leere Datei `Inhalt` existiert

### Was darf nicht verloren gehen?
- Die vier Registries (`design-language-registry.md`, `product-memory-registry.md`, `swiss-knowledge-registry.md`, `system-architecture-registry.json`)
- ADRs (Architekturentscheidungen)
- Rechtliche Dokumente
- `DESIGN_VISION_GAP.md` — analytisch wertvoll, auch als Archiv-Referenz

### Nächster bester Schritt
Wurzelverzeichnis auf 10-12 Dateien reduzieren. Erledigte Dokumente in `docs/archive/` verschieben. Doppelte zusammenführen.

---

## 2. DESIGN HISTORIAN

**Aufgabe:** Die Designgeschichte verstehen — was war geplant, was wurde umgesetzt, was ging verloren.

### Was stimmt?
- Die ursprüngliche Vision ist aussergewöhnlich klar dokumentiert
- Die Design Language Registry ist eines der besten Designdokumente, die ich je gesehen habe
- Der Malojapass-SVG auf dem Dashboard ist ein Meisterstück — emotional, interaktiv, schweizerisch
- Die Icon-Arbeit ist handwerklich hochwertig (40 SVG-Pictogramme)
- Die Farbpalette ist durchdacht — Creme/Salbei/Gold/Sand/Rose/Sky/Anthrazit

### Was fehlt?
- **Die Geschichte bricht nach dem Dashboard ab.** Die Vision beschreibt eine durchgehende Erfahrung — ein Ort, ein Weg, Materialität. In der Realität existiert das nur auf einem Screen.
- **Die Designsprache wurde nie in Code übersetzt.** Tokens existieren, werden aber kaum genutzt. 12px statt 15px. Keine Schatten. Keine Transparenzen.
- **Drei wichtige Design-Audits wurden geschrieben und nicht umgesetzt:**
  - A-030 Design Reality Audit (Mai 26)
  - Emotional Temperature Map (Mai 26)
  - Design Vision Gap (Jun 07)
- Jeder Audit stellte dieselben Probleme fest. Keiner führte zu Änderungen.

### Was darf nicht verloren gehen?
- Die Malojapass-Metapher und ihre SVG-Implementierung
- Die Easter Eggs (Kuh, Matterhorn, Edelweiss, Gipfelkreuz, Uhr, Schokolade, Sonne, Fahne)
- Das Maturity-System der Kapitel-Icons
- Die Tier-Struktur (Core/Supporting/Protective)
- Die Design Language Registry als Nordstern

### Nächster bester Schritt
Die drei Audits nicht nochmal schreiben — endlich umsetzen. Typografie als ersten Hebel anpacken.

---

## 3. VISUAL DESIGNER

**Aufgabe:** Das visuelle Erscheinungsbild beurteilen — wie sieht die App aus, wie fühlt sie sich an.

### Was stimmt?
- Die Farbpalette ist warm und schweizerisch — das Fundament ist richtig
- DM Sans ist eine gute Schriftwahl — geometrisch aber warm
- Die Berge sind wunderschön — sie geben der App Identität
- Der Dark Mode ist gut durchdacht (Stein-Metapher)
- Die Akzentfarben sind poetisch gewählt (Sage=Natur, Gold=Wert, Sand=Erde, Rose=Wärme, Sky=Himmel)

### Was fehlt?
- **Grün als Flächenfarbe.** Sage ist ein Punkt-Akzent (✓-Zeichen), nicht eine Fläche. Die App braucht grüne Bereiche — nicht als Buttons, sondern als Atmosphäre. Subtile Sage-Hintergründe, grünliche Sektions-Trennungen, Moos-Töne in Kapitelheadern.
- **Typografische Hierarchie.** Alles ist 12px/600. Das erzeugt visuelle Monotonie. Die definierte 7-stufige Skala (11-36px) wird nicht genutzt.
- **Tiefe und Materialität.** Die App ist komplett flach. Keine Schatten, keine Überlagerungen, keine Transparenzen. Alles auf einer Ebene.
- **Emotionale Farbdifferenzierung.** Alle Kapitel sehen gleich aus. Basis (leicht) sollte anders aussehen als Schulden (schwer).
- **Weissraum.** Die Informationsdichte ist zu hoch. Formularzeilen sind zu eng.
- **Übergänge.** Harte Schnitte zwischen Bereichen statt weicher Nebel-Übergänge.

### Was darf nicht verloren gehen?
- Die warme Grundstimmung — kein kaltes Weiss, kein reines Schwarz
- Die Berge als zentrales visuelles Element
- Die handwerkliche Qualität der Icons
- Die Zurückhaltung — kein Neon, kein Startup-Look

### Nächster bester Schritt
Einen einzigen Screen (z.B. Kapitel "Wohnen") als Prototyp nehmen und dort die vollständige Vision umsetzen: richtiger Body-Text (15px), Sage-Flächen, Schatten, Atemraum, Kapitelheader mit grossem Icon. Dann entscheiden ob die Richtung stimmt.

---

## 4. BRAND GUARDIAN

**Aufgabe:** Die Markenidentität "Maloja Plana" schützen — was darf nicht verwässert werden.

### Was stimmt?
- Der Name "Maloja Plana" ist stark — er hat Bedeutung, Klang, Schweizer Verankerung
- Die Malojapass-Metapher ist einzigartig — keine andere App hat das
- Die Anti-Gamification-Haltung ist konsistent durchgehalten
- "Ein Ort, kein Dashboard" ist ein kraftvoller Leitsatz
- Die Mehrsprachigkeit (DE/EN/FR/IT) ist schweizerisch korrekt
- Datenschutz + lokal-first ist identitätsstiftend

### Was fehlt?
- **Die Marke ist nicht sichtbar.** Wer die App benutzt, sieht Formulare. Die Berge auf dem Dashboard sind das einzige Markenelement. Sobald man tiefer geht, könnte es jede beliebige Verwaltungs-App sein.
- **"Schweizer" ist nicht spürbar.** Die App könnte in jedem Land gebaut worden sein. Es fehlt: die Farbe des Engadins, die Ruhe der Berge, die Präzision der Schweizer Post, die Wärme einer Berghütte.
- **Die Symbolik schläft.** Helvetia, Fünfliber, Kuhglocke — alles entworfen, nichts sichtbar.

### Was darf nicht verloren gehen?
- **Malojapass-Berge** — das stärkste Markenelement
- **Easter Eggs** — sie sind die Seele der App
- **Ruhige Tonalität** — nie alarmierend, nie drängend
- **Lokal-first Prinzip** — keine Cloud, keine Accounts
- **Anti-Gamification** — keine Punkte, keine Streaks (aber Micro-Delight erlaubt)

### Nächster bester Schritt
Die Malojapass-Metapher aus dem Dashboard in die Kapitel tragen. Nicht überall Berge, aber: ein subtiler Bezug zum "Ort", eine Erinnerung dass man sich auf einem Weg befindet. Ein Mini-Passweg oben in jedem Kapitel, der zeigt: "Du bist bei Station 3 von 7."

---

## 5. UX REVIEWER

**Aufgabe:** Die Nutzererfahrung beurteilen — Flows, Verständlichkeit, emotionale Wirkung.

### Was stimmt?
- Progressive Disclosure funktioniert — Sekundärfelder werden erst bei Bedarf gezeigt
- Validierung ist inline und nicht blockierend
- Auto-Save gibt Sicherheit
- Onboarding existiert und ist warm
- Die Guided Start Actions (Basisinfo, Dokumente, Notfall) sind ein guter Einstieg
- Mobile-Responsive ab 375px

### Was fehlt?
- **Emotionale Sicherheit bei schweren Themen.** Sozialhilfe, Schulden, Behörden — die emotionalsten Views sind die kältesten. Nutzer in verletzlichen Situationen sehen technische Formulare. Kein empathischer Rahmen, keine andere visuelle Behandlung.
- **Orientierung innerhalb der Kapitel.** Kein "Wo bin ich?", kein "Was kommt als nächstes?", kein Bezug zum Gesamtweg. Man füllt Felder aus, ohne zu wissen warum.
- **Lesbarkeit.** 12px-Schrift für Inhalte, die Menschen in Stresssituationen lesen müssen (Schulden, Sozialhilfe, Behörden). Das ist nicht nur ein Designproblem — es ist ein Accessibility-Problem.
- **Atemraum.** Formularzeilen sind zu dicht. Kein visueller "Moment der Ruhe" zwischen Sektionen.
- **Micro-Feedback.** Definiert aber kaum eingesetzt. Wenn jemand ein schwieriges Feld ausfüllt (Schulden-Betrag, Betreibungsstatus), verdient das eine andere Reaktion als ein stiller Feldwechsel.

### Was darf nicht verloren gehen?
- Auto-Save mit sichtbarem Status
- Progressive Disclosure
- Nicht-blockierende Validierung
- Die MirrorCards-Idee (Spiegelung vor Formular)
- Guided Start auf dem Dashboard

### Nächster bester Schritt
Sozialhilfe-View und Schulden-Manager als "emotional warmest redesign" priorisieren. Diese Views brauchen am dringendsten eine andere Behandlung — grösserer Text, wärmere Farben, empathische Rahmung, Atemraum.

---

## 6. IMPLEMENTATION ARCHITECT

**Aufgabe:** Die technische Umsetzbarkeit beurteilen — was ist realistisch, was ist gefährlich.

### Was stimmt?
- Architektur ist sauber: React 18, Vite 4, keine externen Abhängigkeiten
- Inline-Styles + Palette-Props = jede Farbänderung ist eine Zeile Code
- Token-System (CSS + JS) existiert und ist synchron
- Bundle unter 190 KB gzip — viel Spielraum
- Alle Farbwerte in `LIGHT_PALETTE` und `DARK_PALETTE` in einer Datei (`constants.js`)
- Keine CSS-Klassen, keine Preprocessors — alles direkt steuerbar

### Was fehlt?
- **Kapitel-spezifische Palette-Variationen fehlen.** Jedes Kapitel bekommt die gleiche `palette`. Es gibt keinen Mechanismus für "Wohnen ist wärmer" oder "Schulden ist ernster."
- **Schatten-Tokens vorhanden, nicht verdrahtet.** `shadow.sm/md/lg/xl` existieren in tokens.js, werden in ~5 von ~50 Komponenten verwendet.
- **Typografie-Tokens vorhanden, nicht verdrahtet.** `text.body = 15` ist definiert, aber die meisten Komponenten hardcoden `12` oder `'12px'`.

### Was darf nicht verloren gehen?
- Die Zero-Dependency-Architektur
- `or5_data`/`or5_docs`/`or5_reminders` Schemas
- Das Palette-Prop-System — es ist der Hebel für alle visuellen Änderungen
- Die Icon-Qualität
- Bundle-Budget < 200 KB gzip

### Nächster bester Schritt
**Typografie-Lift zuerst.** Das ist der grösste Hebel mit dem geringsten Risiko:
1. `grep -rn "12px\|fontSize: 12\|fontSize: '12" src/` → alle Stellen finden
2. Systematisch ersetzen durch `text.sm` (13), `text.body` (15), `text.lg` (18)
3. Kein Feature-Risiko, keine Datenänderung, kein Schema-Break
4. Visueller Effekt sofort und überall sichtbar

Danach: Sage als Flächen-Akzent einführen (Kapitelheader-Hintergründe, Sektions-Trennungen). Ebenfalls risikoarm — nur Inline-Style-Änderungen.

---

## KONSENS DER SECHS AGENTEN

### Was alle sehen:
1. Die Funktionalität ist stark — das Fundament steht
2. Das Design lebt nur in Dokumenten und auf dem Dashboard
3. Grün fehlt als atmosphärische Farbe
4. Typografie ist der grösste einzelne Hebel
5. Schwere Themen brauchen wärmere Behandlung
6. Die Malojapass-Metapher muss aus dem Dashboard herauswachsen

### Was alle schützen wollen:
1. Die Berge
2. Die Easter Eggs
3. Die Ruhe
4. Die Zero-Dependencies
5. Die Schweizer Identität
6. Die Palette als Fundament

### Was alle als nächstes empfehlen:
1. **Typografie-Lift** (12px → definierte Skala) — sofort, überall
2. **Sage als Fläche** — nicht nur als Akzent
3. **Schatten aktivieren** — Tiefe geben
4. **Kapitelheader mit Identität** — grössere Icons, Atmosphäre
5. **Emotionale Differenzierung** — schwere Kapitel wärmer behandeln
