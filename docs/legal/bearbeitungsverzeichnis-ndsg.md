# Verzeichnis der Bearbeitungstätigkeiten — Maloja Plana

**Gemäss Art. 12 nDSG / Art. 24 DSV**
**Stand: Juni 2026**

---

## Verantwortliche Person

| Feld | Angabe |
|---|---|
| **Name** | Sophie Stebler |
| **Adresse** | Basel, Schweiz |
| **Kontakt** | info@malojaplana.ch |
| **Datenschutzberater** | Keiner bestellt (keine gesetzliche Pflicht für Einzelpersonen/nicht-kommerzielle Projekte) |

---

## Vorbemerkung

Maloja Plana ist eine **Local-First-Webanwendung**. Die Besonderheit dieses Verzeichnisses: Die meisten Bearbeitungstätigkeiten finden **ausschliesslich auf dem Endgerät der nutzenden Person** statt. Die Betreiberin hat keinen Zugriff auf Nutzerdaten und verarbeitet diese nicht.

Dieses Verzeichnis dokumentiert dennoch alle Datenflüsse vollständig, einschliesslich der rein lokalen Bearbeitungen, um Transparenz zu gewährleisten.

---

## Bearbeitungstätigkeit 1: Lokale Nutzerdatenspeicherung

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Speicherung persönlicher Daten im Browser |
| **Zweck** | Selbstorganisation: Verwaltung persönlicher Informationen zu Leben, Wohnen, Finanzen, Versicherungen, Behördengängen und Notfallplanung in der Schweiz |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung (Immigrant:innen, Geflüchtete, Expats in der Schweiz) |
| **Kategorien von Personendaten** | Name, Geburtsdatum, Adresse, Telefon, E-Mail, Zivilstand, Wohnsituation, Mietkosten, Einkommen, Versicherungsdaten, Haushaltszusammensetzung |
| **Besonders schützenswerte Daten** | Möglich: Gesundheitsdaten (Medikamente, Organspende), Daten zu Sozialhilfemassnahmen, religiöse Überzeugungen (nur wenn freiwillig eingegeben) |
| **Speicherort** | Browser-localStorage (`or5_data`) auf dem Endgerät |
| **Empfänger** | Keine — Daten verlassen das Gerät nicht |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht (Browserdaten löschen oder App-Reset) |
| **Technische Massnahmen** | Keine Datenübertragung, lokal verschlüsselbar, Open-Source-Code |
| **Organisatorische Massnahmen** | Hinweis auf Eigenverantwortung bei geteilten Geräten |
| **Rechtsgrundlage** | Einwilligung durch aktive Dateneingabe (Art. 6 Abs. 6 nDSG) |

---

## Bearbeitungstätigkeit 2: Lokale Dokumentenspeicherung

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Speicherung von Dokumenten und Dateien im Browser |
| **Zweck** | Persönliche Dokumentenablage (Versicherungspolicen, Behördenkorrespondenz, Verträge) |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung |
| **Kategorien von Personendaten** | Hochgeladene Dokumente (PDF, Bilder) mit potenziell beliebigen personenbezogenen Inhalten |
| **Besonders schützenswerte Daten** | Möglich: abhängig von den hochgeladenen Dokumenten (z.B. Arztberichte, Behördenentscheide) |
| **Speicherort** | Browser-IndexedDB (`ordnung-ruhe-documents`) auf dem Endgerät |
| **Empfänger** | Keine |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht |
| **Technische Massnahmen** | Keine Datenübertragung, Speicherlimit-Warnung bei >4 MB |
| **Rechtsgrundlage** | Einwilligung durch aktives Hochladen |

---

## Bearbeitungstätigkeit 3: Lokale Backup-Erstellung

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Erstellung und Speicherung von Datensicherungen |
| **Zweck** | Schutz vor Datenverlust durch lokale Backups und Export-Möglichkeit |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung |
| **Kategorien von Personendaten** | Alle in Tätigkeiten 1–2 genannten Datenkategorien |
| **Speicherort** | Browser-IndexedDB (`ordnung-ruhe-backups`) und optionaler Datei-Download (ZIP) |
| **Empfänger** | Keine — Export-Datei bleibt auf dem Gerät, es sei denn, die nutzende Person gibt sie aktiv weiter |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Automatische Backups: letzte Versionen lokal. Export-Dateien: unter Kontrolle der nutzenden Person |
| **Technische Massnahmen** | Verschlüsselte Backup-Dateien möglich, Backup-Erinnerungen |
| **Rechtsgrundlage** | Einwilligung / berechtigtes Interesse am Schutz vor Datenverlust |

---

## Bearbeitungstätigkeit 4: Lokale Erinnerungen und Fristen

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Verwaltung von Fristen und Erinnerungen |
| **Zweck** | Erinnerung an Dokumentenablauf, Behördenfristen, Versicherungstermine |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung |
| **Kategorien von Personendaten** | Fristendaten, Termindaten, Dokumentennamen |
| **Speicherort** | Browser-localStorage (`or5_reminders`) |
| **Empfänger** | Keine |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Bis zur Löschung durch die nutzende Person |
| **Technische Massnahmen** | Browser-Benachrichtigungen nur mit expliziter Zustimmung, kein externer Push-Server |
| **Rechtsgrundlage** | Einwilligung durch aktive Fristenerstellung |

---

## Bearbeitungstätigkeit 5: Lokale Berechnungen

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Durchführung von Orientierungsberechnungen |
| **Zweck** | Steuerberechnung, Sozialhilfe-Orientierung, Prämienvergleich, Vorsorge-Schätzung, EO-Berechnung, Lohn-Check |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung |
| **Kategorien von Personendaten** | Einkommen, Familiensituation, Wohnkosten, Kanton — nur zur Berechnung, nicht separat gespeichert |
| **Besonders schützenswerte Daten** | Indirekt: Einkommensdaten können auf Sozialhilfebezug hindeuten |
| **Speicherort** | Nur im Arbeitsspeicher während der Berechnung; Eingabedaten aus `or5_data` |
| **Empfänger** | Keine |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Berechnungsergebnisse werden nicht separat gespeichert |
| **Technische Massnahmen** | Deterministische, nachvollziehbare Berechnungslogik, keine KI/ML, Quellenangabe bei allen Regeln |
| **Rechtsgrundlage** | Einwilligung durch aktive Nutzung der Rechner |

---

## Bearbeitungstätigkeit 6: Webseiten-Hosting

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Auslieferung der statischen Webanwendung |
| **Zweck** | Bereitstellung der Anwendung über das Internet |
| **Kategorien betroffener Personen** | Alle Besucher:innen der Webseite |
| **Kategorien von Personendaten** | IP-Adresse, Browsertyp, Betriebssystem, Zugriffszeitpunkt (Server-Logs) |
| **Speicherort** | Vercel-Infrastruktur |
| **Empfänger** | Vercel Inc. als Hosting-Provider |
| **Übermittlung ins Ausland** | USA — unter Swiss-U.S. Data Privacy Framework |
| **Aufbewahrungsfrist** | Server-Logs: gemäss Vercel-Richtlinien (automatische Löschung) |
| **Technische Massnahmen** | HTTPS/TLS, keine Nutzerdaten in Server-Logs |
| **Rechtsgrundlage** | Berechtigtes Interesse / technische Notwendigkeit |

---

## Zusammenfassung der Datenflüsse

```
Nutzende Person
    │
    ├── [LOKAL] Eingabe persönlicher Daten
    │       └── localStorage (or5_data, or5_reminders, or5_lang, or5_theme)
    │       └── IndexedDB (ordnung-ruhe-documents, ordnung-ruhe-backups)
    │       └── ❌ KEINE Übertragung an Server
    │
    ├── [LOKAL] Berechnungen (Steuer, Sozialhilfe, Prämien, Vorsorge)
    │       └── Nur im Arbeitsspeicher, keine separate Speicherung
    │       └── ❌ KEINE Übertragung an Server
    │
    ├── [LOKAL] Backup-Export (ZIP-Datei)
    │       └── Datei auf dem Gerät der nutzenden Person
    │       └── ❌ KEINE automatische Übertragung
    │
    └── [EXTERN] Seitenabruf (HTTPS)
            └── Vercel Hosting: IP-Adresse in Server-Logs (automatisch gelöscht)
```

---

## Nächste Überprüfung

Dieses Verzeichnis wird bei wesentlichen Änderungen aktualisiert, insbesondere bei:
- Einführung neuer Datenquellen (geplant: BAG-Prämien, Swissmedic-Arzneimittel)
- Änderung des Hosting-Providers
- Einführung neuer externer Dienste
- Änderungen an den Speicherstrukturen

---

*Erstellt: Juni 2026*
*Nächste Überprüfung: Bei wesentlicher Änderung oder spätestens Dezember 2026*
