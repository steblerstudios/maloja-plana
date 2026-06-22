# DESIGN RECOVERY MASTERPLAN — Maloja Plana

> Erstellt: 2026-06-08
> Basiert auf: DESIGN_SELF_REFLECTION, DOCUMENTATION_CLEANUP_PLAN, AGENT_REVIEW_SUMMARY, GREEN_BEIGE_DESIGN_DIRECTION
> Keine Implementierung in diesem Dokument. Nur Richtung und Reihenfolge.

---

## 1. Was bleibt unbedingt?

### Unantastbar

| Element | Warum |
|---------|-------|
| **Malojapass-SVG** (Dashboard) | Das emotional stärkste Element. Identitätsstiftend. Einzigartig. |
| **Easter Eggs** (Kuh, Matterhorn, Edelweiss, Gipfelkreuz, Uhr, Schokolade, Sonne, Fahne) | Die Seele der App. Belohnung ohne Gamification. |
| **Maturity-System** der Kapitel-Icons | Organisches Wachstum statt binärem Status. |
| **Tier-System** (Core/Supporting/Protective) | Emotionale Architektur der Kapitel. |
| **DM Sans** | Richtige Schrift. Richtige Wärme. |
| **Palette-Grundstruktur** (Creme/Sage/Gold/Sand/Rose/Sky) | Das Farbfundament ist richtig — es wird nur zu wenig genutzt. |
| **Zero-Dependency-Architektur** | React 18 + Vite 4. Keine externen Bibliotheken. |
| **Palette-Prop-System** | Jede Komponente empfängt `palette` als Prop. Der Hebel für alle visuellen Änderungen. |
| **Inline-Style-System** | Kein CSS-Framework. Volle Kontrolle. |
| **localStorage/IndexedDB Schemas** | `or5_data`, `or5_docs`, `or5_reminders`. Nicht ändern. |
| **Icon-Handwerk** | 40 SVG-Pictogramme, handgezeichnet. Qualität bewahren. |
| **Auto-Save + Progressive Disclosure** | UX-Grundlagen, die funktionieren. |
| **Anti-Gamification** | Keine Punkte, keine Streaks. Micro-Delight ja, Druck nein. |

---

## 2. Was muss grüner werden?

### Sage-Familie einführen

Heute: ein Sage-Ton (`#7B9E8C`), nur als Punkt-Akzent.
Morgen: eine Sage-Familie für atmosphärische Flächen.

| Token | Hex | Rolle |
|-------|-----|-------|
| `sage-mist` | `#E8F0EC` | Grosse Flächen — Kapitelheader, Sektionshintergründe |
| `sage-dew` | `#D4E5DB` | Mittlere Flächen — MirrorCards, Empty States |
| `sage` | `#7B9E8C` | Akzente — Icons, Linien, Erfolg (bleibt) |
| `sage-deep` | `#5C7D6C` | Text auf Sage-Flächen |
| `sage-dark` | `#3D5C4C` | Dark Mode Varianten |

### Wo Sage einziehen soll

| Bereich | Heute | Morgen |
|---------|-------|--------|
| Kapitelheader | `palette.up` (beige) | `sage-mist` Hintergrund |
| MirrorCards | `palette.up` Hintergrund | Subtiler `sage-dew` Tint oder Border |
| Sektions-Trennungen | `palette.border` Linie | `sage-mist` Farbband |
| Orientierungssätze | 11px, sage Text, ○ Unicode | 13px, sage Text auf `sage-mist` Background |
| Empty States | Grauer Text auf beigem Grund | Sage-mist Hintergrund, einladend |
| Navigation (aktiv) | Gold/Sand Akzent | Sage-mist Unterlegung |
| Fortschrittsbalken > 75% | Sand | Sage |

---

## 3. Was muss weniger beige werden?

### Das `palette.up`-Problem

83× als Background. Der Hauptgrund für "alles ist beige." 

**Strategie:** Nicht `palette.up` abschaffen — sondern Alternativen einsetzen.

| Heute (`palette.up` überall) | Morgen (differenziert) |
|------------------------------|----------------------|
| Kapitelheader: `up` | `sage-mist` |
| MirrorCards: `up` | `sage-dew` Tint |
| Sektions-Bg: `up` | `surface` (weiss) oder `sage-mist` |
| Input-Fields: `up` | `surface` (weiss) — klarer Kontrast |
| Hover-States: `up` | Spezifisch pro Kontext |

**Ziel:** `palette.up` von 83 auf ~30 Vorkommen reduzieren. Der Rest wird differenziert.

### Das `palette.mid`-Problem

156× als Textfarbe. Alles ist gleich grau.

**Strategie:** Semantische Textfarben einführen.

| Heute | Morgen |
|-------|--------|
| Label: `mid` | `palette.text` (dunkler, lesbarer) |
| Hint: `mid` | `palette.soft` (deutlich heller = klar sekundär) |
| Timestamp: `mid` | `palette.soft` |
| Button-Text: `mid` | `palette.text` oder spezifisch |
| Section-Title: `mid` | `palette.text` mit `weight.semi` |

---

## 4. Welche alten Designwerte holen wir zurück?

### Aus der Design Language Registry (definiert, nie umgesetzt)

| Wert | Was die Registry sagt | Was fehlt |
|------|----------------------|-----------|
| **15px Body** | `--mp-text-body: 15px` | Überall 12px im Code |
| **Schatten** | 4 Stufen definiert (sm/md/lg/xl) | Fast nie verwendet |
| **Materialität** | "Papier, Stein, Holz, Nebel" | Null spürbar |
| **Transparenzen** | "Nebel — weiche Übergänge" | Null implementiert |
| **Typografische Hierarchie** | 7-stufige Skala (11-36px) | 2-3 Grössen tatsächlich genutzt |
| **Emotionale Differenzierung** | "Schwere Themen brauchen Wärme" | Alle Kapitel identisch |
| **Micro-Feedback** | `mp-stamp`, `mp-check-pop`, `mp-lock-close` | 2× verwendet |
| **`palette.top`** | `#EAE5DD` — "höchste visuelle Ebene" | 0× verwendet |

### Aus der Vision (beschrieben, nie gebaut)

| Wert | Was geplant war | Was fehlt |
|------|-----------------|-----------|
| **Wegweiser in Kapiteln** | "Du bist hier" — Orientierung im Lebensweg | Kein Bezug zum Pass in Kapiteln |
| **Kuhglocke-Feedback** | Zufriedenheit, Alp-Ruhe | Kein auditives/haptisches Feedback |
| **Schweizer-Post-Zuverlässigkeit** | "Der Brief kommt an" | Keine Metapher im Export/Dossier-Bereich |
| **Fünfliber-Materialität** | Gewicht, Wert in der Hand | Icon bei 14px unsichtbar |

---

## 5. Welche Dokumente werden archiviert?

Aus dem DOCUMENTATION_CLEANUP_PLAN — die wichtigsten Archivierungen:

### Sofort archivieren (in `docs/archive/reviews/`)

| Datei | Grund |
|-------|-------|
| `MASTER_CONTEXT_V1.md` | Überholt durch aktuelle Reviews |
| `HUMAN_FEEDBACK_RECOVERY.md` | Feedback eingearbeitet |
| `BETA_REALITY_CHECK.md` | Überholt durch V2 |
| `PRE_FLIGHT_CHECK.md` | Überholt durch V2 |
| `LIFE_SPACE_COMPLETION.md` | Abgeschlossen, Retrospektive existiert |
| `LIFE_SPACE_CLOSURE_PLAN.md` | Abgeschlossen |
| `LIFE_MAP_COMPLETENESS_REVIEW.md` | Abgeschlossen |
| `NEXT_CLAUDE_HANDOFF.md` | Veraltet |
| `PROJECT_STATUS.md` | Veraltet |

### Sofort archivieren (in `docs/archive/roadmap/`)

| Datei | Grund |
|-------|-------|
| `docs/roadmap/PHASE_1_*` (6 Dateien) | Phase 1 erledigt |
| `docs/roadmap/SPRINT_PLAN.md` | Veraltet |
| `docs/roadmap/CHAT_BACKLOG_CONSOLIDATED.md` | Erledigt |

### Löschen (nach Bestätigung)

| Datei | Grund |
|-------|-------|
| `Inhalt` | Leere Datei |
| `ARCHITECTURE_NOTES.md` | Platzhalter |

---

## 6. Die 5 Änderungen mit dem grössten visuellen Effekt

### 1. TYPOGRAFIE-LIFT — "Von flüstern zu sprechen"

**Was:** Alle hardcodierten 12px, 10px, 14px durch Token-Referenzen ersetzen. Body auf 15px. Labels auf 13px. Überschriften auf 18-22px.

**Effekt:** Sofort überall sichtbar. Die App wirkt ruhiger, lesbarer, erwachsener. Die gesamte Dichte reduziert sich automatisch. Editorial statt Admin.

**Risiko:** Niedrig. Nur Inline-Style-Werte. Kein Feature-Impact.

**Umfang:** ~200 Stellen in ~30 Dateien.

---

### 2. SAGE-FLÄCHEN — "Das Grün ziehen lassen"

**Was:** Sage-Familie definieren (mist, dew, deep, dark). Kapitelheader, MirrorCards, Orientierungssätze und Empty States mit Sage-mist/dew unterlegen.

**Effekt:** Die App wird sofort grüner, ohne laut zu werden. Das Malojapass-Grün strahlt in die Kapitel aus. Der "alles ist beige"-Eindruck bricht auf.

**Risiko:** Niedrig. Neue Farbwerte in Palette, dann Inline-Style-Änderungen.

**Umfang:** ~5 neue Tokens + ~40 Style-Änderungen.

---

### 3. SCHATTEN + TIEFE — "Den Raum öffnen"

**Was:** `shadow.sm` und `shadow.md` systematisch auf Karten, MirrorCards, Kapitelheader anwenden. `palette.top` endlich nutzen.

**Effekt:** Sofortige Tiefenwirkung. Die App hat "Boden" und "Wände". Karten schweben leicht über dem Hintergrund. Materialität entsteht.

**Risiko:** Niedrig. Nur `boxShadow`-Werte hinzufügen.

**Umfang:** ~20-30 Stellen.

---

### 4. KAPITELHEADER MIT IDENTITÄT — "Die Stationen sichtbar machen"

**Was:** Jeder Kapitelheader bekommt: grösseres Icon (32-48px statt 14-18px), Sage-mist Hintergrund, mehr Atemraum, den Kapitel-Lebenssatz prominent.

**Effekt:** Jedes Kapitel hat sofort eine eigene Anmutung. Die Schweizer Symbolik (Helvetia, Fünfliber etc.) wird endlich sichtbar. Man betritt einen "Raum", nicht ein Formular.

**Risiko:** Mittel. Layout-Änderung im ChapterView. Muss auf Mobile getestet werden.

**Umfang:** ~1 Komponente (ChapterView.jsx), ~50-80 Zeilen.

---

### 5. EMOTIONALE DIFFERENZIERUNG — "Schwere Themen wärmer"

**Was:** Kapitel mit emotionalem Gewicht (Schulden, Sozialhilfe, Behörden) bekommen eine wärmere Farbbehandlung: mehr Rose/Gold-Töne, grösserer Text, weichere Formulierungen, mehr Atemraum.

**Effekt:** Die verletzlichsten Nutzer werden am meisten umsorgt. Die App zeigt: "Hier ist es anders, hier passen wir besonders auf."

**Risiko:** Mittel. Erfordert kapitel-spezifische Palette-Variationen.

**Umfang:** ~3 Dateien (SchuldenManager, SozialhilfeView, Behörden-Bereich in ChapterView).

---

## 7. Reihenfolge für Umsetzung

### Phase D-1: Typografie-Lift
**Ziel:** 12px → definierte Skala
**Dauer:** 1 Session
**Dateien:** ~30
**Test:** Build + visuelle Prüfung aller Views

### Phase D-2: Sage-Familie + Kapitelheader
**Ziel:** Grün einführen, Kapitelheader transformieren
**Dauer:** 1-2 Sessions
**Dateien:** constants.js + ChapterView.jsx + Dashboard.jsx
**Test:** Build + visuelle Prüfung Dashboard + alle 7 Kapitel

### Phase D-3: Schatten + Materialität
**Ziel:** Tiefe geben
**Dauer:** 1 Session
**Dateien:** ~10-15 Komponenten
**Test:** Build + Light/Dark Mode Prüfung

### Phase D-4: Emotionale Differenzierung
**Ziel:** Schwere Kapitel wärmer
**Dauer:** 1 Session
**Dateien:** SchuldenManager, SozialhilfeView, ChapterView
**Test:** Build + gezielte Prüfung der betroffenen Views

### Phase D-5: Micro-Feedback + Details
**Ziel:** Animationen aktivieren, Orientierungssätze aufwerten, Mini-Pass-Referenz in Kapiteln
**Dauer:** 1 Session
**Dateien:** tokens.css + diverse Komponenten
**Test:** Build + Interaktions-Prüfung

### Phase D-6: Dokumenten-Cleanup
**Ziel:** Repository aufräumen
**Dauer:** 1 Session
**Dateien:** Nur Verschiebungen, keine Code-Änderungen
**Test:** Keine — nur Ordnung

---

## Zusammenfassung

Die App funktioniert. Die Vision existiert. Die Lücke dazwischen hat einen Namen: **Die Vision wurde dokumentiert, aber nicht implementiert.**

Drei Design-Audits haben dasselbe festgestellt. Keiner führte zu Änderungen, weil immer die nächste Funktion Priorität hatte.

Jetzt ist die Funktion fertig. Jetzt kommt das Gefühl.

**Die fünf Hebel, in dieser Reihenfolge:**
1. Typografie — die App spricht endlich in normaler Lautstärke
2. Sage-Flächen — das Grün zieht ein
3. Schatten — der Raum hat Tiefe
4. Kapitelheader — die Stationen haben Identität
5. Emotionale Wärme — schwere Themen werden aufgefangen

**Was sich nicht ändern darf:**
- Die Berge
- Die Ruhe
- Die Schweizer Identität
- Die Zero-Dependencies
- Die Daten

**Was sich ändern muss:**
- Die Farbe
- Die Grösse
- Die Tiefe
- Die Differenzierung
- Die Atmosphäre

Maloja soll nicht nur funktionieren.
Maloja soll endlich so aussehen, wie wir es besprochen haben.
