# Onboarding-Forschung — Wissenschaftliche Grundlage

> Stand: 2026-06-21
> Zweck: Forschungsgrundlage für die Dashboard-Optimierung und das Beta-Testformular.
> Quellen: mobilbranche.de, janniknoe.de, retentionforge.io, usertourkit.com, ec.europa.eu, rjpn.org, devtodev.com u.a.

---

## Die 10/30-Regel

| Zeitfenster | Entscheidung |
|-------------|-------------|
| 10 Sekunden | Für/gegen Download (erster Eindruck) |
| 30 Sekunden | Ob App behalten wird (erster Einsatz) |
| 90 Sekunden | Teuerste Sekunden im gesamten Lebenszyklus |

Wenn der Nutzen nicht innerhalb von 30-90 Sekunden sichtbar ist, landet die App im "App-Store-Friedhof".

---

## Time to Value (TTV)

| TTV | Erste-Jahr-Retention |
|-----|---------------------|
| unter 30 Tage | 96% |
| 30-60 Tage | 88% |
| 60-90 Tage | 79% |
| ueber 90 Tage | 65% |

31 Prozentpunkte Unterschied durch eine einzige Metrik.

Consumer-Apps: Ziel TTFV unter 90 Sekunden. Bei >15 Minuten TTV verlierst du 75% der Nutzer.

---

## Drop-off-Raten

| Metrik | Wert |
|--------|------|
| Oeffnen App nur 1x | 25% |
| Durchschnittliche Aktivierungsrate SaaS | 35% |
| Absprung vor Tag 4 | 70-77% |
| Day 1 Retention | <30% |
| Day 7 Retention | <10% |

Ein ueberfluessiger Schritt kann ein Drittel der Nutzer kosten.
Drei richtige Worte koennen die Activation-Rate um 40% heben.

---

## Onboarding-Patterns

| Pattern | Wirksamkeit |
|---------|-------------|
| Welcome Tour (Bubble-Tour) | Scheitert in der Praxis |
| Progressive Onboarding (Just-in-Time) | Goldstandard fuer komplexe Produkte |
| Empty States als Onboarding | Bestes Onboarding — setzt an Punkt wo Nutzer handeln will |
| Personalisierung-Flows | Nuetzlich, aber jede Frage erhoeht Drop-off |

Faustregel: Personalisierung am Anfang + Just-in-Time-Hilfe danach.

---

## Formular-Design

Zwei wesentliche Gruende warum Nutzer Formulare NICHT ausfuellen:
1. Erster Eindruck stimmt nicht (unuebersichtlich, wenig Vertrauen)
2. Formular ist unverstaendlich (Labels unklar, keine Orientierung)

Hauptursache fuer Abbruch: Kognitive Ueberlastung, nicht fehlende Daten.

### Nielsen Norman Group — 4 Prinzipien
1. **Structure** — Gruppen related fields, klare visuelle Hierarchie
2. **Transparency** — Erwartungen upfront mit Progress Indicators
3. **Clarity** — Plain Language, Beispiele geben
4. **Support** — Helpful Constraints, timely Error Messages

---

## Microcopy

Drei Worte am richtigen Platz koennen wichtiger sein als drei Designer-Tage.

- Aktiv statt passiv: "Lege jetzt dein erstes Projekt an" vs. "Projekte koennen hier angelegt werden"
- Konkret statt generisch: "Verbinde dein Google-Konto in 10 Sekunden" vs. "Account verknuepfen"
- Empathisch statt formal: "Kein Stress — du kannst das spaeter aendern" vs. "Diese Einstellung ist optional"
- Wertbezogen statt funktional: "Spar dir das taegliche Tippen" vs. "Vorlagen aktivieren"

Praxis-Beispiel: Text von "Sie haben noch keine Daten erfasst" zu "Lass uns deine erste Aufgabe anlegen — dauert keine 30 Sekunden" steigerte Klickrate um 41%.

---

## Vertrauen & Datenhoheit

- Mangelnde Transparenz ueber Datenverarbeitung = wichtigstes Datenschutzrisiko
- Data Ownership foerdert Vertrauen
- App mit lokalen Daten + Data Ownership hatte hoeheres Vertrauen
- Privacy Paradox: Nutzer mit hoeherem Vertrauen sind eher hesitant, priorisieren langfristige Privacy

---

## Web vs. App Onboarding

| Kontext | Prinzip |
|---------|---------|
| Web | Sofort Wert zeigen, idealerweise vor Login |
| App | Permissions erst im Kontext fragen |

Web-Onboarding: Account-Pflicht hinterfragen, lange Setups vermeiden.
App-Onboarding: Skip-Option immer sichtbar, was versprochen wurde muss innerhalb 60 Sekunden erlebbar sein.

---

## Anwendung auf Maloja Plana

### Was wir bereits umgesetzt haben (2026-06-21)

| Prinzip | Umsetzung | Status |
|---------|-----------|--------|
| Wert vor Setup | Highlight-Werkzeuge auf Dashboard | Done |
| Data Ownership sichtbar | "100% auf Deinem Geraet" Hinweis | Done |
| Kein Account noetig | BetaGate ist Code, kein Account | Done |
| Skip-Option | Onboarding ueberspringbar | Done |
| Mindestlohn auffindbar | Tools-Grid Eintrag | Done |

### Was noch offen ist

| Prinzip | Potenzial |
|---------|-----------|
| Empty States als Onboarding | Kapitel-Leerzustaende nutzen um Nutzen zu zeigen |
| Microcopy verbessern | Guided Start: wertbezogen statt funktional formulieren |
| Progressive Onboarding | Just-in-Time-Hilfe statt alles auf einmal |
| TTFV messen | Beta-Testformular mit Frage 4 ("Nutzen in 1 Minute verstanden?") |

### 3 Pflicht-Metriken

| Metrik | Definition | Maloja-Ziel |
|--------|-----------|-------------|
| TTFV | Login bis erster Aha-Moment | <90 Sekunden |
| Activation Rate | % die eine sinnvolle Aktion ausfuehren | Messen im Beta-Test |
| Drop-off pro Schritt | Wo verlierst du Nutzer? | Beobachten bei Testpersonen |

---

## 7 wichtigste Takeaways

1. Aha-Moment kennen — ohne klar definierten Aha-Moment ist Onboarding Stochern im Nebel
2. Wert vor Setup — erst Mehrwert zeigen, dann Daten erfragen
3. 30-Sekunden-Regel — Entscheidung ob App behalten wird
4. TTV unter 90 Sekunden — Ziel fuer Consumer-Apps
5. Empty States + Just-in-Time — schlagen klassische Bubble-Touren
6. Microcopy ist kein Detail — 3 Worte koennen 40% Activation-Rate heben
7. Data Ownership sichtbar machen — foerdert Vertrauen
