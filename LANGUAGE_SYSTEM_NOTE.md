# Maloja Plana — Sprachsystem

**Datum:** 2026-06-14  
**Status:** Erste Bereinigung. Lebende Referenz.

---

## 3-Ebenen-Modell

### Markenebene (darf poetisch sein)

Wird verwendet in: Tagline, Landing Page, Über-Seite, PR.

Beispiele:
- "Ein stiller Ort, an dem du sehen kannst, wie dein Leben aussieht."
- "Dein persönlicher Schweizer Lebensordner."

### Produktebene (muss konkret sein)

Wird verwendet in: Dashboard-Titel, Onboarding, Willkommensnachrichten.

Beispiele:
- "Lebensordner" (DE)
- "Life organizer" (EN)
- "Dossier de vie" (FR)
- "Fascicolo di vita" (IT)

### UI-Ebene (muss sachlich und konsistent sein)

Wird verwendet in: Navigation, Buttons, Labels, Statusmeldungen.

Erlaubte Begriffe:
- **Kapitel** — für die 7 Lebensbereiche
- **Dokumente / Dokumentenablage** — für hochgeladene Dateien
- **Grundordnung** — für den Status "Kernfelder ausgefüllt"
- **Übersicht** — für Zusammenfassungsansichten
- **Erinnerung** — für Kalender/Fristen
- **Angaben** — für Formularfelder
- **Unterlagen** — für physische Dokumente

---

## Zu vermeidende Begriffe (UI-Ebene)

| Begriff | Problem | Ersetzt durch |
|---|---|---|
| Dokument-Tresor | Bank-Metapher, suggeriert Hochsicherheit | Dokumentenablage |
| Coffre-fort | Gleiche Bank-Metapher auf FR | Classeur documents |
| Document vault | Bank-Metapher auf EN | Documents |
| vollständig / complete / complet / completo | Bewertung — Maloja bewertet nicht | "steht" / "in place" / "en place" / "al suo posto" |

---

## Bewusst beibehalten

| Begriff | Ebene | Begründung |
|---|---|---|
| Lebensordner | Produkt | Kern-Identität, durchgängig verwendet |
| Life folder | Produkt (EN) | Interne Bezeichnung für Export/Dossier |
| Kapitel | UI | Konsistent in allen Ansichten |
| Grundordnung | UI | Definierter Status-Begriff, nicht verhandelbar |
| mirror (Code) | Intern | Daten-Key für MirrorCards, nicht in UI sichtbar |
| Spiegel (Konzept) | Intern | MirrorCards zeigen Daten zurück — intern stimmig |
| Übersicht | UI | Sachlich, keine Metapher |

---

## MirrorCards — Sonderfall

`MirrorCards.jsx` und der i18n-Schlüssel `mirror.*` verwenden "Spiegel" als internes Konzept. Die Idee: Daten werden dem Nutzer "zurückgespiegelt" — keine Bewertung, nur Darstellung.

In der UI erscheint das Wort "Spiegel" **nicht**. Die Karten zeigen Zusammenfassungen ohne Label. Das Konzept ist intern konsistent und braucht keine Umbenennung.

---

## Offene Begriffsfragen

| Begriff | Fundort | Frage |
|---|---|---|
| Lebens-Kapitel | `yourChapters` (DE) | Braucht es "Lebens-"? Oder reicht "Deine 7 Kapitel"? |
| Life chapters | `yourChapters` (EN) | Gleiche Frage |
| Dossier de vie | FR progressMid | Konsistent, aber prüfen ob "dossier" in FR-Schweiz zu formell klingt |
| Fascicolo di vita | IT | In IT-Schweiz gängig? Oder besser "raccoglitore"? |

Diese Fragen erfordern Muttersprachler-Feedback und werden hier nur dokumentiert.

---

## Regeln

1. **Maloja bewertet nicht.** Keine "vollständig", "100%", "perfekt", "gut gemacht".
2. **UI-Texte sind sachlich.** Keine Metaphern in Buttons und Labels.
3. **Produkttexte dürfen warm sein.** "Dein Lebensordner nimmt Form an" ist erlaubt.
4. **Markentexte dürfen poetisch sein.** Aber sparsam einsetzen.
5. **Code-interne Begriffe** (mirror, tresor als Key) bleiben stabil — nur die sichtbaren Labels ändern sich.
