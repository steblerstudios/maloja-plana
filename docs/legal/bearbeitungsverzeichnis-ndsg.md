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
| **Speicherort** | Browser-localStorage auf dem Endgerät: `or5_data` (Stammdaten), `or5_contacts` (Kontakte), `or5_merkliste` (Merkliste), `or5_beta_access` (Beta-Zugang, nur UI-Hürde), `or5_lang` / `or5_theme` / `or5_onboarding_done` (Einstellungen). Belege: `src/main.jsx` Z. 415, `src/utils/backupCrypto.js` Z. 60–66, `src/MerklisteView.jsx` Z. 10, `src/BetaGate.jsx` Z. 15, `src/Onboarding.jsx` Z. 17 |
| **Empfänger** | Keine — Daten verlassen das Gerät nicht |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht (Browserdaten löschen; ein App-Reset ist nicht gebaut, Stand 15.09.2026 — siehe Datenschutzerklärung §7.2) |
| **Technische Massnahmen** | Keine Datenübertragung, Open-Source-Code. Die Daten liegen unverschlüsselt im localStorage; eine Verschlüsselung at rest (Tresor) ist geplant und bewusst vertagt (`docs/design/tresor-lock.md`) |
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
| **Speicherort** | Dateiinhalte in der Browser-IndexedDB `maloja-plana-documents` (`src/utils/storage.js` Z. 51); Metadaten (ohne Dateiinhalt) im localStorage `or5_docs` (`src/utils/docBlobs.js` Z. 4–6). Der frühere Name `ordnung-ruhe-documents` wird beim Start migriert und gelöscht (`storage.js` Z. 52, 88) |
| **Empfänger** | Keine |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht |
| **Technische Massnahmen** | Keine Datenübertragung, Grössenlimit je Dokument beim Upload (`MAX_DOC_BYTES`, siehe `src/utils/backupCrypto.js` Kommentar Z. 17–21) |
| **Rechtsgrundlage** | Einwilligung durch aktives Hochladen |

---

## Bearbeitungstätigkeit 3: Lokale Backup-Erstellung

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Erstellung und Speicherung von Datensicherungen |
| **Zweck** | Schutz vor Datenverlust durch lokale Backups und Export-Möglichkeit |
| **Kategorien betroffener Personen** | Nutzende der Webanwendung |
| **Kategorien von Personendaten** | Alle in Tätigkeiten 1–2 genannten Datenkategorien |
| **Speicherort** | Automatische Schnappschüsse in der Browser-IndexedDB `maloja-plana-backups` (`src/utils/autoBackup.js` Z. 11; früherer Name `ordnung-ruhe-backups` wird migriert und gelöscht, Z. 12, 52). Manueller Export als Datei-Download (`.json` Klartext oder `.maloja` verschlüsselt, `src/ZipExport.jsx` Z. 51–93). Vor jedem Backup-Import legt die App Sicherheitskopien im localStorage an: `or5_data_prerestore`, `or5_docs_prerestore`, `or5_reminders_prerestore`, `or5_contacts_prerestore`, `or5_merkliste_prerestore`, `or5_prerestore_date` (`src/utils/backupCrypto.js` Z. 216–227) |
| **Empfänger** | Keine — Export-Datei bleibt auf dem Gerät, es sei denn, die nutzende Person gibt sie aktiv weiter |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Automatische Schnappschüsse: rollierend, max. 5 (`autoBackup.js` Z. 14). Export-Dateien: unter Kontrolle der nutzenden Person. `_prerestore`-Kopien: werden von der App nicht automatisch gelöscht (offen, DSFA-Entwurf Abschnitt 7 Punkt 10) |
| **Technische Massnahmen** | Verschlüsselter Export ist optional (AES-256-GCM, PBKDF2, Passphrase mind. 4 Zeichen — `backupCrypto.js` Z. 107); der Klartext-Export ist gleichberechtigt verfügbar. Backup-Erinnerungen |
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
| **Speicherort** | Infomaniak-Infrastruktur, Rechenzentren in der Schweiz |
| **Empfänger** | Infomaniak Network SA, Genf, als Hosting-Provider (Belege: `deploy.sh` Z. 2, `src/i18n/de.js` `privacy.hosting1`, `docs/legal/third-party-licenses.md` — Vercel nicht mehr verwendet) |
| **Übermittlung ins Ausland** | Keine (Stand 15.09.2026). Bis zu diesem Datum stand hier Vercel Inc., USA — seit dem Hosting-Wechsel nicht mehr zutreffend |
| **Aufbewahrungsfrist** | Server-Logs: nicht belegt (Infomaniak-Standard; bei Bedarf beim Hoster erfragen) |
| **Auftragsbearbeitungsvertrag (Art. 9 DSG)** | Offen — nicht geprüft, ob die Infomaniak-Vertragsbedingungen die Anforderung abdecken |
| **Technische Massnahmen** | HTTPS/TLS, HSTS, keine Nutzerdaten in Server-Logs (die App sendet keine) |
| **Rechtsgrundlage** | Berechtigtes Interesse / technische Notwendigkeit |

---

## Zusammenfassung der Datenflüsse

```
Nutzende Person
    │
    ├── [LOKAL] Eingabe persönlicher Daten
    │       └── localStorage (or5_data, or5_docs [Metadaten], or5_contacts, or5_merkliste,
    │       │                 or5_reminders, or5_beta_access, or5_lang, or5_theme,
    │       │                 or5_onboarding_done, or5_*_prerestore [Kopien vor Import])
    │       └── IndexedDB (maloja-plana-documents, maloja-plana-backups)
    │       └── ❌ KEINE Übertragung an Server
    │
    ├── [LOKAL] Berechnungen (Steuer, Sozialhilfe, Prämien, Vorsorge)
    │       └── Nur im Arbeitsspeicher, keine separate Speicherung
    │       └── ❌ KEINE Übertragung an Server
    │
    ├── [LOKAL] Export als Einzeldateien (JSON, CSV, MANIFEST.txt; Sicherung
    │           als .json oder verschlüsselt .maloja; kein ZIP)
    │       └── Datei auf dem Gerät der nutzenden Person
    │       └── ❌ KEINE automatische Übertragung
    │
    └── [EXTERN] Seitenabruf (HTTPS)
            └── Infomaniak Hosting (Schweiz): IP-Adresse in Server-Logs
                (Aufbewahrungsdauer nicht belegt)
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

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
