# Closed Beta Preparation — Maloja Plana

> Stand: 2026-06-07
> Status: VORBEREITUNG — NICHT GESTARTET
> Zweck: Alles, was bereit sein muss, bevor echte Menschen die App nutzen

---

## A. Impressum-Check

### Was bereits existiert

- LegalView mit Tabs: Datenschutz / Nutzung / Impressum
- Datenschutz und Nutzungsbedingungen sind vollständig formuliert
- Impressum hat **Platzhalter** für Name, Adresse, E-Mail

### Was fehlt

| Feld | Status | Nötig für Beta? |
|------|--------|-----------------|
| Betreiber/in (Name oder Organisation) | Platzhalter | **Ja** — rechtlich erforderlich in CH |
| Adresse (physisch oder Postfach) | Platzhalter | **Ja** — Pflicht laut Schweizer Recht |
| E-Mail-Adresse | Platzhalter | **Ja** — Kontaktmöglichkeit |
| Rechtsform | Fehlt | Empfohlen (Einzelperson / Verein / GmbH) |
| Haftungshinweis | Vorhanden (in "Nutzung") | ✓ abgedeckt |
| Datenschutz-Erklärung | Vorhanden | ✓ abgedeckt |
| Hinweis "Beta / keine Rechtsberatung" | Vorhanden (in "Nutzung") | ✓ abgedeckt |

### Entscheidung nötig

Sophie muss klären:

1. **Wer ist die Betreiberin?** Optionen:
   - Privatperson (Sophie Stebler, Adresse)
   - Verein (z.B. "Verein Maloja Plana")
   - "Projekt von [Name]" — informell, aber für Closed Beta vertretbar

2. **Welche Kontaktadresse?** Optionen:
   - Persönliche E-Mail
   - Projekt-E-Mail (z.B. maloja@proton.me oder ähnlich)
   - Postfach für physische Adresse (optional bei Closed Beta)

3. **Open Source Hinweis** — aktuell steht "Quellcode öffentlich einsehbar". Stimmt das? Gibt es ein öffentliches Repo?

### Minimale Empfehlung für Closed Beta

Für 3–5 Testpersonen genügt:
- Name der verantwortlichen Person
- Projekt-E-Mail
- Hinweis "Geschlossene Testphase — nicht öffentlich"
- Kein Handelsregistereintrag nötig

---

## B. Feedback-Setup

### Was bereits existiert

- `beta.feedbackMail` — "Feedback per E-Mail" (i18n-Key vorhanden)
- `beta.feedbackForm` — "Feedback-Formular" (i18n-Key vorhanden, aber kein Formular implementiert)
- Footer mit Beta-Hinweis

### Empfehlung für 3–5 Testpersonen

| Kanal | Wann | Warum |
|-------|------|-------|
| **Projekt-E-Mail** | Immer sichtbar in App | Niedrige Schwelle, vertraut, kein Tool nötig |
| **Kurzer Fragebogen** (nach Test-Session) | Nach jeder Testaufgabe oder am Ende | Strukturierte Antworten, vergleichbar |
| **Sprachnachricht** (Signal/WhatsApp) | Optional | Manche erzählen lieber als schreiben |

### Was NICHT nötig ist

- Kein Typeform, kein Google Forms, kein Notion
- Kein Feedback-Widget in der App
- Kein Issue-Tracker für Testpersonen

### Warum E-Mail + Fragebogen reicht

Bei 3–5 Personen, die Sophie persönlich kennt, genügt:
1. Link zur App + Zugangscode per Nachricht
2. Testaufgaben als PDF oder Nachricht
3. Fragebogen am Ende (siehe Abschnitt C)
4. Offener Kanal für spontanes Feedback (E-Mail oder Signal)

---

## C. Testaufgaben

### Philosophie

Nicht testen: "Funktioniert der Button?"

Sondern testen: "Entsteht ein Ort?"

Die Produktannahme lautet:
> "Spiegelungen verwandeln Daten über dich in ein Bild von dir."

Die Beta muss prüfen, ob das stimmt.

### Aufgabe 1: Ankommen (5 Min.)

**Ziel:** Entsteht Orientierung ohne Erklärung?

```
Öffne die App.
Schau Dich um.
Sag mir nach einer Minute:
- Wo bin ich?
- Was ist das hier?
- Was kann ich hier tun?
```

**Beobachten:** Sagt die Person "Tool", "App", "Ordner" — oder etwas anderes?
Versteht sie den Malojapass als Metapher oder verwirrt er?

---

### Aufgabe 2: Sich selbst sehen (10 Min.)

**Ziel:** Entsteht das Bild von mir?

```
Gehe zu "Persönliche Basis".
Gib ein paar Informationen über Dich ein.
(Was Dir einfällt — es muss nicht alles sein.)

Wenn Du etwas eingegeben hast:
- Schau Dir die Karte an, die erscheint.
- Was siehst Du?
- Ist das Du?
```

**Beobachten:** Reagiert die Person auf die Spiegelung?
Fühlt sie sich erkannt — oder beobachtet?

---

### Aufgabe 3: Einen Lebensraum betreten (10 Min.)

**Ziel:** Fühlt sich ein Kapitel wie ein Raum an — oder wie ein Formular?

```
Wähle ein Kapitel, das Dich interessiert.
Öffne es.

- Wie fühlt sich der Anfang an?
- Was lädt Dich ein, etwas zu tun?
- Was hält Dich zurück?
```

**Beobachten:** Welches Kapitel wählen sie? Warum?
Wie reagieren sie auf den Empty State / Lebenssatz?

---

### Aufgabe 4: Schweizer Begriffe (5 Min.)

**Ziel:** Versteht die Zielgruppe die Sprache?

```
Schau Dir die Begriffe an, die Du siehst.
Welche verstehst Du sofort?
Welche sind Dir fremd?
Was hättest Du anders erwartet?
```

**Beobachten:** AHV, BVG, Franchise, IPV, Kanton — was ist klar, was nicht?
Hilft die Orientierungsschicht oder fehlt sie?

---

### Aufgabe 5: Vertrauen (3 Min.)

**Ziel:** Würde die Person echte Daten eingeben?

```
Stell Dir vor, Du würdest hier Deine echten Daten eingeben.
- Würdest Du das tun?
- Was müsstest Du wissen, damit Du Dich sicher fühlst?
- Hast Du das Gefühl, dass jemand mitliest?
```

**Beobachten:** Finden sie die Datenschutz-Seite? Lesen sie sie?
Reicht "lokal im Browser" als Erklärung?

---

### Aufgabe 6: Gesamteindruck (5 Min.)

**Ziel:** Was für ein Ort ist das?

```
Wenn Du diese App einem Freund beschreiben müsstest:
- Was ist es?
- Für wen ist es?
- Wie fühlt es sich an?
- Was fehlt Dir?
```

**Beobachten:** Stimmt die Beschreibung mit der Produktidentität überein?
Sagen sie "Lebensordner" — oder "App" / "Tool" / "Formular"?

---

## D. Beta-Fragen

### Fragen, die die Beta beantworten muss

| # | Frage | Gemessen durch |
|---|-------|---------------|
| 1 | Entsteht Orientierung ohne Anleitung? | Aufgabe 1 |
| 2 | Fühlen sich Spiegelungen wie ein Bild — oder wie Überwachung? | Aufgabe 2 |
| 3 | Ist "Lebensraum" spürbar — oder nur ein Wort? | Aufgabe 3 |
| 4 | Verstehen Immigrant:innen die Schweizer Begriffe? | Aufgabe 4 |
| 5 | Reicht "lokal = sicher" als Vertrauensanker? | Aufgabe 5 |
| 6 | Entspricht der Gesamteindruck der Produktidentität? | Aufgabe 6 |
| 7 | Welche Lebensräume werden zuerst betreten? | Beobachtung |
| 8 | Wo bricht jemand ab — und warum? | Beobachtung |

### Fragen, die die Beta NICHT beantworten muss

- Ist die Berechnung korrekt? (kein Rechner aktiv)
- Sind alle Felder vollständig? (Beta prüft Gefühl, nicht Funktion)
- Ist die App technisch stabil? (Build ist grün, das reicht)
- Würden Leute dafür bezahlen? (zu früh)

---

## E. Empfohlene Testpersonen

### Idealprofil

| # | Profil | Sprache | Prüft |
|---|--------|---------|-------|
| T1 | Immigrant:in, 1–3 Jahre in CH, wenig Deutsch | EN oder FR | Verständlichkeit, Orientierung, Vertrauen |
| T2 | Expat, berufstätig, kennt CH-System etwas | DE oder EN | Genauigkeit, Schweizer Identität, "Stimmt das?" |
| T3 | Sozialarbeiter:in oder Beratungsperson | DE | Fachliche Korrektheit, Sprache, Zielgruppen-Fit |
| T4 | Person mit wenig Tech-Erfahrung (45+) | DE | Orientierung, Barrierefreiheit, Verständlichkeit |
| T5 | Sophie selbst (Eigenbenutzung) | DE | Baseline, Vergleichswert |

### Minimale Beta-Grösse

- **3 Personen** reichen für qualitative Erkenntnisse
- Davon mindestens 1 Person aus der Kernzielgruppe (T1)
- Davon mindestens 1 Person, die NICHT technikaffin ist (T4)

### Wie finden?

- Beratungsstellen (Caritas, HEKS, SAH, Kirchgemeinden)
- Sprachschulen (Deutsch für Migrant:innen)
- Persönliches Netzwerk
- Keine öffentliche Ausschreibung nötig bei 3–5 Personen

### Was Testpersonen brauchen

1. Zugangscode (`maloja2026` — oder neuen Code pro Person)
2. Link zur App (Vercel-URL)
3. Testaufgaben (ausgedruckt oder als Nachricht)
4. Klare Zusage: "Deine Daten bleiben auf Deinem Gerät"
5. Optional: kleines Dankeschön (Kaffee, Gutschein)

---

## F. Offene Entscheidungen vor Start

| # | Entscheidung | Wer | Dringlichkeit |
|---|-------------|-----|---------------|
| 1 | Impressum: Name + Adresse + Mail festlegen | Sophie | Hoch |
| 2 | Vercel-Deploy: Domain / URL bestimmen | Sophie | Hoch |
| 3 | Eigener Code pro Testperson oder gleicher Code? | Sophie | Mittel |
| 4 | Testformat: vor Ort / remote / asynchron? | Sophie | Mittel |
| 5 | Sprache der Testaufgaben: nur DE oder auch EN/FR? | Sophie | Mittel |
| 6 | Feedback-Fragebogen: E-Mail-Vorlage erstellen? | Sophie | Niedrig |

---

## Was bereits steht

- [x] BetaGate mit Zugangscode
- [x] Datenschutz vollständig formuliert
- [x] Nutzungsbedingungen mit Haftungsausschluss
- [x] Beta-Banner und Feedback-Mail-Link (i18n)
- [x] 7 Lebensräume mit Spiegelungen und Empty States
- [x] Build grün
- [ ] Impressum (Platzhalter ausfüllen)
- [ ] Vercel-Deploy
- [ ] Testaufgaben finalisieren
- [ ] Testpersonen kontaktieren

---

## Zusammenfassung

Die App ist technisch bereit.

Was fehlt, ist menschlich:
- Wer steht dahinter? (Impressum)
- Wo erreicht man sie? (URL)
- Wer probiert es aus? (Testpersonen)
- Was wollen wir wissen? (dieses Dokument)

Die nächste Handlung ist nicht technisch.
Sie ist: Sophie entscheidet, wer sie ist (im Impressum), und wer die ersten Menschen sind.
