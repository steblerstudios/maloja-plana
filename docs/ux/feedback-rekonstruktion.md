# Feedback-Rekonstruktion — Mutter + Greg

> Stand: 2026-06-21
> Rekonstruiert von Sophie aus Erinnerung und Notizen.
> Zweck: Alle bisher gesammelten Nutzerfeedbacks an einem Ort, mit Bewertung.

---

## Mutter-Feedback

### Bereits umgesetzt

| Feedback | Zitat / Kontext | Status |
|----------|-----------------|--------|
| Prämienverbilligung-Link | "Eine Link zu der Prämienverbilligungsseite wäre gut" | Done — IPV-Rechner + Querlink Versicherungen → IPV |
| Budget hochladen | "Ich kann ein Budget hochladen" | Done — Budget-Import vorhanden |
| SKOS / Sozialhilfe | "SKOS Tabelle sollte angepasst werden" | Done — Sozialhilfe-Rechner, SKOS-Hinweise, Mietbeiträge Basel |

### Teilweise vorbereitet

| Feedback | Zitat / Kontext | Status |
|----------|-----------------|--------|
| Patientenverfügung / Vorsorgeauftrag / Bestattung | "Frage noch ob Patientenverfügung erstellt..." | Generatoren/Planung vorgesehen, nicht vollständig umgesetzt |

### Noch interessant (nach Beta)

| Feedback | Zitat / Kontext | Bewertung | Priorität |
|----------|-----------------|-----------|-----------|
| BVG / Freizügigkeitsguthaben suchen | "Das Zusammentragen und Verwalten der BVG obliegt dem Arbeitnehmer selber" | Echtes Schweizer Problem. Pensionskassen-Check, alte Freizügigkeitskonten, Links zur Suche. Passt sehr gut zu Maloja. | B |
| UVG / KTG Übersicht | "Wo sind die Angestellten wirklich versichert?" | Arbeitgeber, UVG, KTG, BVG, KK — alles an einem Ort dokumentieren. Passt extrem gut zur Philosophie. | B |
| EL für Rentner | "Wenn Rentner - EL beantragen" | Fachlich sinnvoll. Braucht aber echte Rentner-Tester zuerst. | B |
| Rentenalter / Rentenjahr | — | Sinnvoll, eher Nice-to-have. | C |

---

## Greg-Feedback

| Feedback | Bewertung | Aktion |
|----------|-----------|--------|
| "Dunkel ist zu dunkel" | Wenn 3/5 Tester: Thema. Wenn nur Greg: Geschmack. | Beobachten |
| "Beige gefällt nicht" | Gleiches Prinzip. | Beobachten |
| "Auswahl-Menü komisch" | Ernst nehmen wenn mehrere Leute Mühe mit Dropdowns haben. | Beobachten — UX-Thema |
| Kreisicon statt Info-Icon — "könnte zu einem i werden" | Klassischer UX-Punkt. Wenn mehrere denken der Kreis sei klickbar: guter kleiner Fix. | Kandidat nach Feedbackrunde |
| Wissensbank / Sandbox — "Etwas berechnen ohne eigenen Stand zu verändern" | Interessant (persönlicher Modus vs. Beispielmodus), aber echtes neues Feature. | Nicht jetzt |

---

## Sophie-Beobachtungen

| Feedback | Bewertung | Priorität |
|----------|-----------|-----------|
| 3a-Rechner startet bei 0 — viele haben bereits Guthaben | Fachlich sinnvoll, kein Bug. Feld "Aktuelles 3a-Guthaben" ergänzen. | B |
| Mindestlohn-Check existiert nur als Hintergrund-Warnung, kein sichtbares Werkzeug | Beobachten ob Nutzer danach suchen. Auffindbarkeits-Frage, nicht Feature-Frage. | Beobachten |

## Annora-Feedback

| Feedback | Bewertung | Aktion |
|----------|-----------|--------|
| Fragte aktiv nach Rätoromanisch | 1 Signal. RM hat ~60k Sprecher, alle bilingual. Noch kein Muster. | Beobachten — dokumentiert, nicht bauen |

---

## Sophie-Screenshot: "Deine Grundordnung 4/18"

> Fortschrittskarte zeigt 4/18 erledigt — könnte auch zeigen welche 14 fehlen und direkt dorthin navigieren.

Bewertung: **Stärkster UX-Gewinn bei kleinem Aufwand.** Verbesserung eines bestehenden Features, kein neues Feature. Fast jeder Nutzer versteht das sofort.

---

## Nächste Tester — Erwartete Perspektiven

| Person | Erwartete Stärke | Worauf achten |
|--------|-----------------|---------------|
| Jana | Verständlichkeit, Navigation, Vertrauen, visuelle Wirkung | Fühlt sich die App vertrauenswürdig an? Ist die Navigation klar? |
| Annora | Erstnutzer-Perspektive | "Wo klicke ich?", "Was soll ich hier machen?" |
| Silvan | Logik, technische Konsistenz, unnötige Komplexität, fehlende Verknüpfungen | Sind die Rechner plausibel? Fehlen Verbindungen? |
| Greg | UX, Design, Navigation | Visuelles Urteil, Interaktionsprobleme |

---

## Signal-Kriterien

### Starkes Signal (→ bauen)

Mindestens 2 Personen sagen **unabhängig** dasselbe:

- "Ich sehe 4/18, aber ich weiss nicht, was die 14 fehlenden Punkte sind."
- "Wie komme ich direkt dahin?"
- Verwirrung, Sackgassen, unnötige Klicks, fehlende Orientierung

→ Dann wird aus einer Idee ein **echtes Muster** und der nächste Produkt-Commit.

### Kein starkes Signal (→ dokumentieren, beobachten)

Eine einzelne Person sagt:

- "Mach alles blau statt beige"
- "Dark Mode ist zu dunkel"
- "Ich hätte gerne Rätoromanisch"
- "Mach eine App für Familien"

Das sind **Präferenzen**, keine Muster. Dokumentieren, nicht bauen.

### Was wirklich zählt

Die wertvollen Signale sind nicht Feature-Wünsche, sondern:

- **Verwirrung** — "Was bedeutet das?"
- **Sackgassen** — "Und jetzt?"
- **Unnötige Klicks** — "Warum muss ich dreimal klicken?"
- **Fehlende Orientierung** — "Wo bin ich? Was fehlt noch?"

### Erkenntnis aus Mutters Feedback

Lynettes Feedback war überraschend hochwertig — nicht wegen einzelner Features, sondern weil sie mehrfach auf dieselbe Grundidee hinwies:

> "Zeig mir, was fehlt. Zeig mir, worauf ich achten muss. Hilf mir beim Ordnen."

Das passt extrem gut zur Vision von Maloja Plana als *Lebensordner*.

---

## Priorisierte Kandidatenliste

### A — Erster Beta-Nachbesserung

1. **Fortschrittskarte → zu fehlenden Feldern springen**
2. Info-Icons verständlicher machen (falls mehrfach genannt)
3. Dropdown-Auswahl prüfen (falls mehrfach genannt)

### B — Nach Beta

4. Bestehendes 3a-Guthaben im Vorsorge-Rechner (aktuell rechnet ab 0, viele haben bereits 5k–80k)
5. BVG/Freizügigkeits-Übersicht
6. UVG/KTG-Dokumentation
7. EL/Rentenpfad

### C — Später

7. Wissensbank/Sandbox-Modus
8. BFS Branchenvergleich
9. PWA

### Beobachten

- Mindestlohn besser sichtbar? (Hintergrund-Check existiert, aber Nutzer erwarten evtl. sichtbares Werkzeug)
- Rätoromanisch-Nachfrage? (Annora fragte aktiv danach — 1 Signal, noch kein Muster)
- Design-Farben? (Greg: "zu dunkel", "Beige" — erst ab 3/5 Testern ein Thema)

### Noch nicht

- RM komplett übersetzen (1 Signal, beobachten)
- BFS Branchenvergleich
- PWA
- Mehrpersonen-Haushalte
- Komplette Design-Neugestaltung

---

## Feedback-Quellen

| Person | Perspektive | Stärke |
|--------|-------------|--------|
| Lynette (Mutter) | Ordnung, Sozialleistungen, BVG, Renten, Praxis | Reale Lebenssituation, nicht technikgetrieben |
| Greg | UX, Design, Navigation | Visuelles Urteil, Interaktionsprobleme |
| Annora | Sprache, Erstnutzer-Perspektive, RM-Frage | Sprachliche Sensibilität, Zugänglichkeit |
| Sophie | Tägliche Nutzung, Fachlogik | Tiefes Produktwissen, erkennt Lücken im Alltag |
