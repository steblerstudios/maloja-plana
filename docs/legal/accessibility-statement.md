# Barrierefreiheitserklärung — Maloja Plana

**Gemäss WCAG 2.1 / eCH-0059 (Schweizer Accessibility-Standard)**

---

## Selbsteinschätzung

Maloja Plana strebt Konformität mit **WCAG 2.1 Level AA** an. Die Anwendung befindet sich in aktiver Entwicklung — die Barrierefreiheit wird laufend verbessert.

---

## Umgesetzte Massnahmen

| Bereich | Massnahme | Status |
|---|---|---|
| **Tastaturnavigation** | Alle interaktiven Elemente per Tab erreichbar | Umgesetzt |
| **Skip-Link** | „Zum Inhalt springen" am Seitenanfang | Umgesetzt |
| **Focus-Visible** | Sichtbarer Fokusring bei Tastaturnavigation | Umgesetzt |
| **ARIA-Labels** | Semantische Rollen für Screenreader | Teilweise |
| **Reduced Motion** | `prefers-reduced-motion` respektiert | Umgesetzt |
| **Farbkontrast** | Mindestens 4.5:1 für Text (WCAG AA) | Umgesetzt |
| **Responsive** | Nutzbar ab 375px Breite | Umgesetzt |
| **Sprachattribut** | `lang`-Attribut dynamisch gesetzt | Umgesetzt |
| **Fehlerbehandlung** | ErrorBoundary mit verständlicher Fehlermeldung | Umgesetzt |

---

## Bekannte Einschränkungen

| Bereich | Einschränkung |
|---|---|
| Screenreader-Optimierung | Noch nicht vollständig mit VoiceOver/NVDA getestet |
| Formulare | Nicht alle Felder haben explizite `aria-describedby` |
| Diagramme/Synthesen | Noch keine Textalternative für visuelle Auswertungen |
| PDF-Export | Generierte PDFs sind nicht barrierefrei |

---

## Feedback

Probleme mit der Barrierefreiheit können gemeldet werden an:
sophie.stebler@gmail.com

Wir bemühen uns, gemeldete Barrieren zeitnah zu beheben.
