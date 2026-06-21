# Dashboard-Flow Analyse — Maloja Plana

> Stand: 2026-06-21
> Zweck: Aktuellen First-Visit-Flow gegen die drei bestätigten Feedback-Muster halten.
> Grundlage: Master Feedback Sammlung (docs/ux/feedback-rekonstruktion.md)
> Methode: Code-Analyse (Dashboard.jsx) + Live-Simulation auf 375px Mobile

---

## Aktueller First-Visit-Flow

### Schritte bis zum Dashboard

| Schritt | Was passiert | Sekunden |
|---------|-------------|----------|
| 1 | BetaGate — Zugangscode eingeben | 0–5 |
| 2 | Sprachwahl (EN/DE/FR/IT) | 5–10 |
| 3 | Onboarding — Vorname, Nachname, Kanton (überspringbar) | 10–20 |
| 4 | "Alles ist bereit!" — Bestätigung | 20–25 |
| 5 | Dashboard lädt | 25–30 |

### Dashboard-Sektionen (Reihenfolge im Code)

| # | Sektion | Position (ca.) | Sichtbar ohne Scrollen? |
|---|---------|---------------|------------------------|
| 1 | Alpha-Banner (Warnung, dismissible) | 0px | Ja |
| 2 | Welcome: Titel, Tagline, Benefit, Disclaimer | 100px | Ja |
| 3 | Berglandschaft-SVG (leer bei First Visit) | 400px | Ja |
| 4 | "Ein ruhiger Anfang" — Guided Start | 600px | Teilweise |
| 5 | Notfallkarte-Button | 900px | Nein |
| 6 | MVO "Deine Grundordnung" (nur mit Daten) | 1000px | Nein |
| 7 | Overview-Text (Fortschritt) | 1100px | Nein |
| 8 | Export-Reminder (nur mit Daten) | 1200px | Nein |
| 9 | 7 Lebenskapitel in 3 Tiers | 1300px | Nein |
| 10 | Tipps | 2200px | Nein |
| 11 | **12 Werkzeuge** (Steuerrechner, IPV, Sozialhilfe...) | **2400px** | **Nein** |
| 12 | Footer | 2900px | Nein |

Gesamthöhe: **3029px**. Viewport: **812px**. Nutzer muss **3× scrollen** um die Werkzeuge zu erreichen.

---

## Was sieht ein neuer Nutzer in 30 Sekunden?

### Sichtbar (above the fold)

1. Alpha-Banner: "Frühe Version · Maloja Plana befindet sich in Entwicklung..."
2. "Willkommen bei Maloja Plana"
3. "Dein persönlicher Schweizer Lebensordner — 100% privat, offline, kostenlos."
4. "Prüfe Deine Ansprüche. Ordne Deine Unterlagen. Behalte Fristen im Blick."
5. Disclaimer
6. Leere Berglandschaft
7. Anfang von "Ein ruhiger Anfang"

### Nicht sichtbar (below the fold)

- Notfallkarte
- Alle 7 Kapitel
- Tipps
- **Alle 12 Werkzeuge** (Steuerrechner, IPV, Sozialhilfe, Vorsorge, EO, Budget...)

### Erster Eindruck des Nutzers

```
"Oh, ein Lebensordner."
"Oh, eine Warnung."
"Oh, ich soll Basisinformationen ergänzen."
```

Nicht:

```
"Ah, ich kann meine Steuer berechnen."
"Ah, ich kann prüfen ob ich Anspruch auf IPV habe."
"Ah, ich kann eine Notfallkarte vorbereiten."
```

---

## Bewertung gegen die drei Muster

### Muster 1: Nutzen kommt zu spät (5 Quellen)

**Bestätigt.** Die Werkzeuge mit sofortigem Nutzen sind am absoluten Ende der Seite — Position ~2400px von 3029px. Ein Erstnutzer muss dreimal den gesamten Bildschirm durchscrollen bevor er einen einzigen Rechner sieht.

Der "Ein ruhiger Anfang"-Block zeigt drei Aktionen:
- → Basisinformationen ergänzen (= Formular)
- → Wichtige Dokumente hinzufügen (= Formular)
- → Notfallinformationen prüfen (= Formular)

Alle drei führen zu Dateneingabe, nicht zu Nutzen.

### Muster 2: Vertrauen & Datenhoheit (4 Quellen)

**Teilweise adressiert.** "Deine Angaben bleiben auf diesem Gerät. Kein Konto. Keine Cloud." steht im Onboarding — gut. Aber nach dem Onboarding verschwindet diese Botschaft. Der Alpha-Banner dominiert den ersten Eindruck mit einer Warnung statt mit Vertrauen.

### Muster 3: Verbindungen statt Formulare (4 Quellen)

**Nicht adressiert im First-Visit.** Die Kapitel stehen isoliert nebeneinander. Querverbindungen (KK→IPV, Einkommen→Steuer) existieren innerhalb der Kapitel, sind aber auf dem Dashboard nicht sichtbar.

---

## Drei alternative Dashboard-Konzepte

### Konzept A: Werkzeuge zuerst

```
1. Welcome (kurz, 2 Zeilen)
2. "Was kannst du hier sofort tun?" — 4 Highlight-Tools:
   → Steuerrechner: "Berechne deine Bundessteuer"
   → IPV: "Prüfe deinen Anspruch"
   → Sozialhilfe: "Orientiere dich"
   → Notfallkarte: "Bereite deine Karte vor"
3. Berglandschaft + Kapitel
4. Guided Start
5. Alle Werkzeuge
6. Footer
```

| Aspekt | Bewertung |
|--------|-----------|
| Vorteile | Sofort sichtbarer Nutzen. Kein neues Feature nötig — nur Reihenfolge. Rechner funktionieren ohne Dateneingabe. |
| Nachteile | Verändert den ruhigen Ersteindruck. Werkzeuge könnten "App-haft" wirken. |
| Aufwand | **Klein** — Sektionen umordnen, 4 Highlight-Buttons ergänzen. Keine neue Logik. |
| Muster 1 | ⭐⭐⭐⭐⭐ Direkt gelöst |
| Muster 2 | ⭐⭐ Neutral |
| Muster 3 | ⭐⭐⭐ Werkzeuge zeigen Verbindungen (KK→IPV) |

### Konzept B: Notfallkarte zuerst

```
1. Welcome (kurz)
2. Notfallkarte als Hero-Element:
   "Deine Notfallkarte — in 2 Minuten bereit"
   → Notfallkontakt + Blutgruppe + Allergien
   → Sofort als Karte druckbar
3. "Was Maloja Plana noch kann" — 3 Werkzeuge
4. Berglandschaft + Kapitel
5. Guided Start
6. Footer
```

| Aspekt | Bewertung |
|--------|-----------|
| Vorteile | Emotional, greifbar, sofort verständlich. Ergebnis in 2 Minuten. Wenig Daten nötig. |
| Nachteile | Nicht jeder braucht eine Notfallkarte. Kann medizinisch/ernst wirken. Zeigt nur einen Aspekt. |
| Aufwand | **Klein** — Notfallkarte nach oben, Hero-Styling. |
| Muster 1 | ⭐⭐⭐⭐ Nutzen sichtbar, aber nur ein Thema |
| Muster 2 | ⭐⭐⭐ "Bleibt auf deinem Gerät" passt zur Notfallkarte |
| Muster 3 | ⭐⭐ Wenig Verbindungseffekt |

### Konzept C: Beispiel-Modus zuerst

```
1. Welcome (kurz)
2. "Schau dir zuerst ein Beispiel an"
   → Demo-Person mit ausgefüllten Kapiteln
   → Sichtbare Rechner-Ergebnisse
   → Notfallkarte, Budget, Fortschritt
3. "Jetzt dein eigenes starten"
4. Berglandschaft + Kapitel
5. Werkzeuge
6. Footer
```

| Aspekt | Bewertung |
|--------|-----------|
| Vorteile | Zeigt den vollen Nutzen. "So sieht es aus wenn ich fertig bin." |
| Nachteile | Aufwendig. Demo-Daten pflegen. Verwechslungsgefahr ("Sind das meine Daten?"). |
| Aufwand | **Gross** — Demo-Datensatz, Demo-Flag in allen Komponenten, Abgrenzung. |
| Muster 1 | ⭐⭐⭐⭐⭐ Voller Nutzen sichtbar |
| Muster 2 | ⭐⭐⭐ Demo zeigt dass Daten lokal bleiben |
| Muster 3 | ⭐⭐⭐⭐ Demo zeigt Verbindungen zwischen Kapiteln |

---

## Empfehlung

**Konzept A (Werkzeuge zuerst)** als nächste Beta-Nachbesserung.

### Begründung

1. Stärkstes Signal direkt adressiert — 5 Quellen bestätigen "Nutzen kommt zu spät"
2. Kleiner Aufwand — keine neue Logik, nur Reihenfolge + 4 Highlight-Buttons
3. Kein Pflegeaufwand — anders als Demo-Modus
4. Sofort messbar — bei nächsten Tests beobachten ob Nutzer schneller verstehen
5. Werkzeuge existieren bereits und funktionieren ohne Dateneingabe

### Mögliche Kombination

Konzept B (Notfallkarte) ergänzend — die Notfallkarte ist bereits im Dashboard, nur zu weit unten.

### Zweite Iteration

Konzept C (Beispiel-Modus) langfristig die stärkste Idee, aber höherer Aufwand und Pflegebedarf.

---

## Kernfrage

```
Aktuelle Logik:   Kapitel → Daten erfassen → Nutzen
Gewünschte Logik: Nutzen sehen → Vertrauen gewinnen → Daten erfassen
```

Die Werkzeuge existieren. Die Nutzer sehen sie nur nicht schnell genug.
