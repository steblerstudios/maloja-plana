# A-033 — Export Product Concept: Dossiers statt Tools

> Export ist kein Sackmesser. Export ist ein ruhiger Lebensbereich.
> Nicht implementieren — Konzept-Definition für WP-4 / A-035.
>
> Stand: 2026-05-27

---

## 1. Grundsatz

### Aktuell: Export = verstreute Buttons
```
ZIP-Export        → ZipExport.jsx (eigene View)
PDF               → Browser Print (kein eigener Flow)
CV-Generator      → CVGenerator.jsx (eigene View)
Budget-Report     → BudgetSync.jsx (JSON-Download-Button)
KK-Scanner QR     → KKScanner.jsx (QR innerhalb Scanner)
```

Kein einheitliches Konzept. Kein Ort. Kein Produktflow.

### Ziel: Export = "Meine Unterlagen"

Ein ruhiger Bereich, in dem Nutzer ihre Daten als sinnvolle Dossiers zusammenstellen — nicht als Format-Auswahl, sondern als Lebensbereich-Auswahl.

**Metapher:** Wie eine Schublade im Büromöbel. Man greift hinein und nimmt die Mappe, die man gerade braucht. Nicht ein Werkzeugkasten mit 12 Schraubenschlüsseln.

---

## 2. Dossier-Typen

### 2.1 Meine Lebensmappe
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Persönliche Gesamtübersicht — für mich selbst |
| **Enthält** | Alle Kapitel-Zusammenfassungen, Kontaktdaten, Budget-Übersicht, Dokumenten-Liste, Versicherungs-Übersicht, Fristen |
| **Format** | PDF (druckbar, offline-lesbar) |
| **Zielperson** | Ich selbst |
| **Datenschutzrisiko** | Niedrig (bleibt lokal) |
| **Beta-relevant** | **Ja** — Kernproduktversprechen |
| **UX-Gefühl** | „Alles auf einen Blick. Mein Leben, strukturiert." |

### 2.2 Behörden-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Vorbereitung für Amt / Gemeinde / Kanton |
| **Enthält** | Personalien, Aufenthaltsstatus, AHV-Nummer, Wohnadresse, Familienstand, relevante Dokumente (gefiltert), Checkliste „Was mitbringen" |
| **Format** | PDF |
| **Zielperson** | Einwohneramt, Migrationsamt, Sozialamt, Steuerverwaltung |
| **Datenschutzrisiko** | Mittel — enthält PII, wird aber vom Nutzer bewusst erstellt |
| **Beta-relevant** | **Ja** — häufiger Bedarf für Zielgruppe |
| **UX-Gefühl** | „Ich bin vorbereitet. Ich weiss, was ich brauche." |

### 2.3 Versicherungs-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Übersicht aller Versicherungen für Beratung oder Vergleich |
| **Enthält** | KK-Daten (Versicherer, Modell, Prämie, Franchise), Haftpflicht, Hausrat, Reise, Auto, BVG, UVG/KTG |
| **Format** | PDF |
| **Zielperson** | Versicherungsberater, Vergleichsportal, eigene Übersicht |
| **Datenschutzrisiko** | Mittel |
| **Beta-relevant** | Nein (post-beta) |
| **UX-Gefühl** | „Ich kenne meine Versicherungen. Nichts ist vergessen." |

### 2.4 Krankenkassen-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | KK-Wechsel, IPV-Antrag, Franchise-Entscheidung |
| **Enthält** | KK-Versicherer, Modell, Prämie, Franchise, IPV-Berechtigung (wenn berechnet), Kartennummer, AHV-Nummer |
| **Format** | PDF |
| **Zielperson** | Neue Krankenkasse, kantonale IPV-Stelle |
| **Datenschutzrisiko** | Mittel-Hoch (AHV-Nummer) |
| **Beta-relevant** | Nein (post-beta, braucht AHV-Masking) |
| **UX-Gefühl** | „KK-Wechsel ist vorbereitet. Ich muss nichts suchen." |

### 2.5 Notfall-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Für Familie / Angehörige im Notfall |
| **Enthält** | Notfallkontakte, Blutgruppe, Allergien, Medikamente, Arzt/Spital, Patientenverfügung (ja/nein + Aufbewahrungsort), Vorsorgeauftrag (ja/nein + Gemeinde), Bestattungswünsche, Organspende-Status |
| **Format** | PDF (verschlüsselt optional) |
| **Zielperson** | Ehepartner, Kinder, Eltern, Vertrauensperson |
| **Datenschutzrisiko** | Hoch — sensible medizinische und persönliche Daten |
| **Beta-relevant** | **Ja** — hoher emotionaler und praktischer Wert |
| **UX-Gefühl** | „Meine Familie weiss, was zu tun ist. Alles ist an einem Ort." |

### 2.6 Familien-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Familienübersicht für gemeinsame Planung |
| **Enthält** | Haushaltsmitglieder, Versicherungen pro Person, Budget, Kinderzulagen, Alimente, Schulen, Kinderbetreuung |
| **Format** | PDF |
| **Zielperson** | Partner, Eltern, Familienberatung |
| **Datenschutzrisiko** | Hoch (mehrere Personen) |
| **Beta-relevant** | Nein (braucht Household Model) |
| **UX-Gefühl** | „Unsere Familie hat Ordnung." |

### 2.7 Steuer-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Vorbereitung Steuererklärung |
| **Enthält** | Einkommen, Abzüge (KK-Prämie, 3a, Berufsauslagen, Schuldzinsen), Vermögen, Steuerkanton, Steuerfrist |
| **Format** | PDF |
| **Zielperson** | Steuerverwaltung, Treuhänder |
| **Datenschutzrisiko** | Mittel |
| **Beta-relevant** | Nein (post-beta, TaxCalculator zu rudimentär) |
| **UX-Gefühl** | „Steuererklärung ist vorbereitet. Weniger Stress." |

### 2.8 Wohnungs-Dossier
| Feld | Beschreibung |
|------|-------------|
| **Zweck** | Wohnungsbewerbung, Umzug |
| **Enthält** | Personalien, Arbeitgeber, Einkommen, Betreibungsauszug-Status, aktuelle Wohnung, Referenzen |
| **Format** | PDF |
| **Zielperson** | Vermieter, Liegenschaftsverwaltung |
| **Datenschutzrisiko** | Mittel |
| **Beta-relevant** | Nein (post-beta) |
| **UX-Gefühl** | „Meine Bewerbungsmappe ist komplett." |

---

## 3. Produktflow

### Aktuelle Situation (verstreut)
```
Dashboard → Kapitel → ... → irgendwo ein Export-Button
Dashboard → ZIP-Export (eigene View)
Dashboard → CV-Generator (eigene View)
```

### Ziel-Flow: "Meine Unterlagen"

```
Dashboard
└── Meine Unterlagen (eigener Bereich / Route #/unterlagen)
    │
    ├── Dossier erstellen
    │   ├── Schritt 1: Was brauche ich?
    │   │   ├── Lebensmappe (alles)
    │   │   ├── Für Behörde
    │   │   ├── Für Notfall / Familie
    │   │   ├── ... (weitere Dossier-Typen)
    │   │   └── Benutzerdefiniert (Kapitel-Auswahl)
    │   │
    │   ├── Schritt 2: Vorschau
    │   │   └── Was ist enthalten? Was fehlt noch?
    │   │
    │   └── Schritt 3: Exportieren
    │       ├── Als PDF herunterladen
    │       └── (Zukunft: verschlüsselt, per E-Mail, drucken)
    │
    ├── Vorbereitete Dossiers (Vorlagen)
    │   ├── Behördendossier (vorbefüllt für gewählten Kanton)
    │   ├── Notfalldossier
    │   └── (post-beta: weitere)
    │
    └── Letzte Exporte (optional, History)
```

### UX-Prinzipien für Export

1. **Ruhig, nicht technisch** — keine Formatliste (JSON, YAML, CSV), keine „Export-Optionen"
2. **Zweckgebunden** — „Für wen ist das?" statt „Welches Format?"
3. **Checklisten-orientiert** — zeigt was enthalten ist UND was fehlt (sanft, nicht drängend)
4. **Kein Massenexport** — ein Dossier nach dem anderen, bewusst erstellt
5. **PDF als Standard** — weitere Formate nur wenn wirklich nötig
6. **Keine automatische Übermittlung** — Export = Download, Nutzer entscheidet selbst
7. **Datenschutz sichtbar** — bei sensiblen Dossiers: Hinweis „Enthält AHV-Nummer / medizinische Daten"

---

## 4. Beta-Scope (Minimum)

### Beta: 2 Dossier-Typen + Bereich

1. **"Meine Unterlagen"** als eigener Bereich (Route `#/unterlagen`)
2. **Lebensmappe** — Gesamtübersicht als PDF
3. **Notfalldossier** — Notfall-relevante Daten als PDF

### Post-Beta
4. Behörden-Dossier
5. Wohnungs-Dossier
6. Steuer-Dossier
7. Versicherungs-Dossier

### Nicht in Scope
- Verschlüsselte Exports
- E-Mail-Versand
- DOCX/LaTeX
- Automatische Behördenformulare

---

## 5. Was mit bestehendem Export passiert

| Bestehendes Feature | Verbleib |
|---------------------|----------|
| ZipExport.jsx | Bleibt als „Technischer Export" (für Backup/Migration), aber nicht prominent |
| CVGenerator.jsx | Bleibt als eigene View — ist kein Dossier, sondern ein Generator |
| Budget JSON Download | Wird Teil der Lebensmappe oder entfällt |
| Browser Print | Wird durch PDF-Dossier-Export ersetzt |

---

## 6. Abgrenzung: Export vs. Generatoren

| | Export / Dossier | Generator |
|---|---|---|
| **Zweck** | Bestehende Daten zusammenstellen | Neues Dokument aus Daten erzeugen |
| **Beispiel** | Notfalldossier (sammelt vorhandene Felder) | Kündigungsschreiben (erzeugt Brief) |
| **UX-Ort** | "Meine Unterlagen" | Innerhalb des relevanten Kapitels |
| **Daten-Richtung** | App → PDF (Zusammenfassung) | App → Dokument (Erzeugung) |

Generatoren gehören NICHT in "Meine Unterlagen". Sie bleiben in ihren Kapiteln (z.B. Kündigungsschreiben in Wohnen, Briefgenerator in Behörden).

---

*Dokument: export-dossier-concept.md v1.0.0*
*Erstellt: 2026-05-27 (A-033)*
*Nicht implementieren — Konzept-Definition für WP-4 / A-035.*
