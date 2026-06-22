# DESIGN SELF-REFLECTION — Maloja Plana

> Erstellt: 2026-06-08
> Ehrliche Reflexion der bisherigen Arbeit.
> Keine Implementierung. Keine Entschuldigung. Nur Klarheit.

---

## 1. Wo haben wir zu stark Funktionen gebaut und zu wenig Designgefühl?

### Überall.

Die letzten Monate waren ein Funktionsmarathon:
- 7/7 Spiegelungen gebaut
- Lebensräume für alle Kapitel
- Section Voice Layer
- Kapitelheader
- MirrorCards
- Budget-Sync
- CV-Generator
- Schulden-Manager
- Sozialhilfe-View
- Prämienverbilligung
- KK-Scanner
- Zip-Export
- Organ-Donation
- Notfall-Dossier
- Kalender-Erinnerungen

Jede einzelne dieser Funktionen wurde technisch sauber implementiert. Keine hat das **Designgefühl** verändert. Wir haben Räume eingerichtet, aber nie die Wände gestrichen.

**Konkretes Beispiel:** Die MirrorCards sind eine gute Idee — "Spiegelungen verwandeln Daten über dich in ein Bild von dir." Aber sie sehen aus wie jede andere Karte: `palette.up` Hintergrund, `palette.border` Rand, `12px` Text. Die Spiegelung hat keine visuelle Eigensprache bekommen.

### Was passiert ist:

Jede Session hatte ein Ziel: "Baue Feature X." Kein Ziel war je: "Mach, dass es sich anders anfühlt." Design wurde als erledigt betrachtet, weil die Palette existiert und die Tokens definiert sind. Aber **definiert ≠ spürbar**.

---

## 2. Wo wurde die ursprüngliche Designvision verwässert?

### An drei Stellen:

**a) Die Palette wurde zur Monokultur**

Die Vision beschreibt: Creme/Salbei/Anthrazit/Sand — vier verschiedene Welten. Die Realität: `palette.up` (83× als Background) und `palette.mid` (156× als Textfarbe) dominieren alles. Die App ist de facto zweifarbig: beiges Beige und graues Grau.

Sage (#7B9E8C) — das Grün, die Natur, die Beruhigung — taucht 23× als Textfarbe auf und 9× als Background. In einer App mit Hunderten von Elementen. Das Grün ist ein Gast in seiner eigenen App.

**b) Die Typografie blieb bei 12px hängen**

Die Design Language Registry sagt: 15px Body. Die App zeigt: 12px überall. Das wurde im A-030 Audit festgestellt, aber nie korrigiert. 12px erzwingt Dichte, Dichte erzwingt Kälte, Kälte erzwingt "Verwaltung". Die gesamte Atmosphäre hängt an dieser einen Zahl.

**c) Die Materialität wurde nie implementiert**

Vier Schatten-Stufen definiert. Zwei davon verwendet. Transparenzen beschrieben als "Nebel — weiche Übergänge." Null implementiert. Texturen erwähnt als "Papier, Stein, Holz." Null spürbar. Die App ist so flach wie ein Screenshot.

---

## 3. Wo wurde "Maloja" technisch umgesetzt, aber visuell nicht spürbar?

| Element | Technisch da | Visuell spürbar |
|---------|-------------|----------------|
| Malojapass-SVG | Ja, 3 Schichten, Trail, 7 Stationen | **Ja — einziges starkes Element** |
| Easter Eggs (Kuh, Matterhorn, Uhr etc.) | Ja, erscheinen mit Fortschritt | Subtil, aber charmant |
| Kapitel-Icons auf Passweg | Ja, Maturity-System | Zu klein (26-34px), Details unsichtbar |
| Helvetia-Icon | Ja, 48×48 SVG | Gerendert bei 14-18px — ein grauer Fleck |
| Fünfliber-Icon | Ja, mit Lorbeerkranz | Gerendert bei 14-18px — ein grauer Kreis |
| Orientierungssätze | Ja, 19 Sätze | 11px, Sage, mit ○ — wirken wie Systemhinweise |
| Tier-System | Ja, Core/Supporting/Protective | Labels vorhanden, aber keine visuelle Differenzierung |
| Micro-Feedback-Animationen | Ja, 3 Keyframes definiert | 2× verwendet in gesamter App |
| Schatten-System | Ja, 4 Stufen | Fast nie eingesetzt |
| Akzentfarben | Ja, 5 definiert | Sage: 32×, Sky: 7×, Gold: 22× — zu selten, ohne System |

**Der Malojapass auf dem Dashboard beweist: Die Vision funktioniert.**
Alles andere beweist: Die Vision wurde nicht weitergetragen.

---

## 4. Warum ist noch zu viel beige?

### Drei Gründe:

**1. `palette.up` ist der Default-Reflex**

Wenn ein neues Element einen Hintergrund braucht, greifen wir zu `palette.up` (#F0EDE8). Das ist der sicherste Ton — warm, neutral, passt immer. Aber 83× "passt immer" ergibt "alles ist gleich."

**2. `palette.bg` und `palette.up` sind zu ähnlich**

`bg` (#F5F2EE) und `up` (#F0EDE8) sind visuell fast identisch. Der Helligkeitsunterschied beträgt ~2%. Das bedeutet: Hintergrund und "erhöhte Fläche" verschmelzen. Es gibt keine sichtbare Raumtiefe.

**3. Es fehlt ein Gegengewicht**

Beige ist die Basis — das ist richtig. Aber eine Basis braucht Kontrast. In der Vision ist Salbei-Grün dieses Gegengewicht. In der Realität ist Sage ein Akzent-Token für Erfolgsfarbe (✓-Zeichen, Save-Buttons), nicht eine flächige Gegenfarbe. Beige hat keinen Gegenspieler.

---

## 5. Wo fehlt das Grün?

### Fast überall.

**Wo Grün vorkommt (32 Stellen):**
- ✓-Zeichen bei Erfolg (AutoSave, Upload, Scan)
- Save-Buttons (SchuldenManager, ZipExport, CVGenerator)
- Berechtigungsstatus (PremiumSubsidy, Sozialhilfe)
- Orientierungssätze (ChapterView — 11px, kaum sichtbar)
- Malojapass-Berge (3 Schichten, subtil)
- Toggle-States (Notifications)

**Wo Grün fehlt:**
- Kapitelheader — kein Grün
- Navigation — kein Grün
- Sektions-Hintergründe — kein Grün
- Formular-Bereiche — kein Grün
- Footer — kein Grün
- Onboarding — nur 1× im Gradient
- Dashboard-Text — kein Grün
- MirrorCards — kein Grün
- Lebensraum-Indikatoren — kein Grün
- Kapitel-Tier-Differenzierung — kein Grün

**Das Muster:** Sage ist eine funktionale Signalfarbe (Erfolg/Bestätigung), keine atmosphärische Farbe. Sie "markiert" — sie "bewohnt" nicht.

---

## 6. Wo fehlt Natur / Tiefe / Landschaft?

### In jedem Raum ausser dem Dashboard.

**Der Bruch:** Das Dashboard hat Berge, einen Trail, Easter Eggs, Tiefe, Poesie. Sobald man ein Kapitel betritt, ist man in einer anderen App. Keine Landschaftselemente, keine Naturfarben als Flächen, keine Tiefe durch Schatten, keine Transparenz als "Nebel."

**Was fehlt:**
- **In Kapiteln:** Kein Bezug zum Pass, keine Orientierung "Wo bin ich auf dem Weg?", keine Kapitel-spezifische Stimmung
- **In Formularen:** Reine Input-Listen, keine Raumwirkung, kein Atemraum
- **In schweren Themen:** Schulden, Sozialhilfe, Behörden — die emotionalsten Bereiche sind die visuell kältesten
- **In der Navigation:** Keine Wegweiser-Metapher, kein "Du bist hier"
- **In Übergängen:** Kein Nebel, keine weichen Grenzen — alles ist hart und solid

---

## 7. Wo wirken Kapitel immer noch wie Verwaltungsflächen?

### In allen sieben.

**Das Problem in einem Satz:** Jedes Kapitel sieht identisch aus — gleicher Hintergrund, gleiche Textgrösse, gleiche Feldanordnung, gleiche Farbe. "Persönliche Basis" = "Schulden-Manager" = "Notfall."

**Konkrete Verwaltungssymptome:**
- Labels bei 12px, fontWeight 600 — wirken wie Formularfelder einer Behörde
- Inputs mit `palette.up` Background, `palette.border` Rand — technisch korrekt, emotional null
- Keine Sektions-Trennung mit Atmosphäre — alles ist eine durchlaufende Liste
- Buttons am Formularende: `palette.gold` oder `palette.sage` auf weissem Grund — wirken wie Absende-Knöpfe
- Kein Kapitel hat eine eigene "Farbe" oder "Stimmung"
- MirrorCards sind Datenkarten, keine Spiegelungen — sie zeigen Fakten, nicht Gefühle

**Was ein Kapitel stattdessen sein sollte:**
Ein Raum. Mit einer eigenen Atmosphäre. Wohnen fühlt sich anders an als Notfall. Finanzen haben eine andere Schwere als Ausbildung. Behörden brauchen mehr Wärme als Basis. Das Kapitel soll sagen: "Du bist jetzt hier, und hier kümmern wir uns um dieses Thema."

---

## Zusammenfassung

Die ehrliche Bilanz:

| Dimension | Zustand |
|-----------|---------|
| Funktionalität | Stark — alles gebaut, alles funktioniert |
| Architektur | Solide — keine Abhängigkeiten, lokal, sauber |
| Datenmodell | Vollständig — 7 Kapitel, Felder, Validierung |
| Schweizer Wissen | Vorhanden — Kantone, Versicherungen, Recht |
| **Visuelles Gefühl** | **Schwach — beige, flach, uniform, kalt** |
| **Designvision** | **Nicht umgesetzt — lebt nur in Dokumenten** |
| **Maloja-Identität** | **Nur im Dashboard — verschwindet danach** |
| **Emotionale Qualität** | **Fehlend — alle Räume gleich behandelt** |

**Die App funktioniert.**
**Die App fühlt sich nicht an wie Maloja.**
**Das ist das Problem, das wir jetzt lösen.**
