# Verzeichnis der Bearbeitungstätigkeiten — Maloja Plana

**Gemäss Art. 12 nDSG / Art. 24 DSV**
**Stand: 24.09.2026** (erstellt Juni 2026; die Nachführungen stehen am Ende)

---

## Verantwortliche Person

| Feld | Angabe |
|---|---|
| **Name** | Sophie Stebler |
| **Adresse** | Basel, Schweiz |
| **Kontakt** | info@malojaplana.ch |
| **Datenschutzberater** | Keiner bestellt. **Art. 10 Abs. 1 DSG** (SR 235.1): «Private Verantwortliche *können* eine Datenschutzberaterin oder einen Datenschutzberater ernennen» — die Benennung ist fakultativ; das allein trägt. *(Bis 24.09.2026 stand hier zusätzlich «Die Bearbeitung findet zudem ausschliesslich lokal … statt» — seit #277 nennen die Rechtstexte der App auch Hoster-Protokolle und E-Mails, der Satz gilt nur noch für die Angaben in der App.)* Bis zum 23.09.2026 stand hier als Begründung «keine gesetzliche Pflicht für Einzelpersonen/nicht-kommerzielle Projekte»: das Ergebnis stimmte, die Begründung nicht — das Gesetz stellt nicht auf Kommerzialität ab, und nicht-kommerziell trifft wegen Dual Licensing ohnehin nicht zu |

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
| **Speicherort** | Browser-localStorage auf dem Endgerät: `or5_data` (Stammdaten), `or5_contacts` (Kontakte), `or5_merkliste` (Merkliste), `or5_beta_access` (Beta-Zugang, nur UI-Hürde), `or5_lang` / `or5_theme` / `or5_onboarding_done` (Einstellungen). Belege: `src/main.jsx` Z. 416, `src/utils/backupCrypto.js` Z. 57–67, `src/MerklisteView.jsx` Z. 10, `src/BetaGate.jsx` Z. 15, `src/Onboarding.jsx` Z. 17. In `or5_data` steht je Kapitel optional die Liste `_na` der als «trifft nicht zu» markierten Feldnamen (`src/utils/vollstaendigkeit.js` Z. 4–8), ohne weitere Angaben |
| **Empfänger** | Keine — Daten verlassen das Gerät nicht |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht: einzeln in der App, alles auf einmal unter Einstellungen → «Daten auf diesem Gerät» (`src/utils/datenLoeschen.js`, `src/components/DatenLoeschen.jsx`, `src/SettingsView.jsx` Z. 72) oder über die Browserdaten; siehe Datenschutzerklärung §7.2. Der Löschweg entfernt alle `or5_`-Schlüssel ausser `or5_beta_access` (`datenLoeschen.js` Z. 22, 29–37). Bis zum 16.09.2026 stand hier «ein App-Reset ist nicht gebaut» |
| **Technische Massnahmen** | Keine Datenübertragung, Open-Source-Code. Die Daten liegen unverschlüsselt im localStorage; eine Verschlüsselung at rest (Tresor) ist geplant und bewusst vertagt (`docs/design/tresor-lock.md`) |
| **Organisatorische Massnahmen** | Hinweis auf Eigenverantwortung bei geteilten Geräten; für geteilte Geräte zusätzlich der Löschweg «Alle Daten auf diesem Gerät löschen» mit zweiter Bestätigung und Angebot, vorher zu sichern (Datenschutzerklärung §7.2, §8) |
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
| **Aufbewahrungsfrist** | Unbegrenzt, bis die nutzende Person die Daten löscht (einzeln oder mit «Alle Daten auf diesem Gerät löschen», das die Datenbank `maloja-plana-documents` entfernt, `datenLoeschen.js` Z. 24) |
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
| **Speicherort** | Automatische Schnappschüsse in der Browser-IndexedDB `maloja-plana-backups` (`src/utils/autoBackup.js` Z. 11; früherer Name `ordnung-ruhe-backups` wird migriert und gelöscht, Z. 12, 52). Manueller Export unter Werkzeuge → Export als Einzeldateien: Sicherung als `.json` (Klartext) oder `.maloja` (verschlüsselt), dazu JSON- und CSV-Export der Kapitel-Angaben und eine Übersicht `MANIFEST.txt`; ein ZIP entsteht nicht (`src/ZipExport.jsx` Z. 32–57 und 59–108, `src/zipExport.js` Z. 146–161). Bis zum 16.09.2026 fehlten hier CSV und `MANIFEST.txt`. Vor jedem Backup-Import legt die App Sicherheitskopien im localStorage an: `or5_data_prerestore`, `or5_docs_prerestore`, `or5_reminders_prerestore`, `or5_contacts_prerestore`, `or5_merkliste_prerestore`, `or5_prerestore_date` (`src/utils/backupCrypto.js` Z. 216–227) |
| **Empfänger** | Keine — Export-Datei bleibt auf dem Gerät, es sei denn, die nutzende Person gibt sie aktiv weiter |
| **Übermittlung ins Ausland** | Keine |
| **Aufbewahrungsfrist** | Automatische Schnappschüsse: rollierend, max. 5, höchstens einer je 12 Stunden, beim Start der App (`autoBackup.js` Z. 14–15; `src/main.jsx` Z. 586–592). Export-Dateien: unter Kontrolle der nutzenden Person. `_prerestore`-Kopien: werden von der App nicht automatisch gelöscht (offen, DSFA-Entwurf Abschnitt 7 Punkt 10). Schnappschüsse und `_prerestore`-Kopien entfernt der Löschweg «Alle Daten auf diesem Gerät löschen» (`datenLoeschen.js` Z. 24 und 29–37); heruntergeladene Dateien nicht |
| **Technische Massnahmen** | Verschlüsselte Sicherung ist die Voreinstellung (AES-256-GCM, PBKDF2, Passphrase mind. 12 Zeichen für neue Sicherungen — `backupCrypto.js` Z. 107 und 316–320; `ZipExport.jsx` Z. 339–358); die Klartext-Sicherung bleibt wählbar, steht darunter mit Hinweis und braucht keine Eingabe (`ZipExport.jsx` Z. 360–367). Ältere Sicherungen mit kürzerer Passphrase bleiben lesbar. Bis zum 16.09.2026 war die Verschlüsselung optional, der Klartext-Export der erste Weg und das Passphrase-Minimum 4 Zeichen (Bau-Liste E10). JSON-/CSV-Export und `MANIFEST.txt` sind immer unverschlüsselt, ebenso die automatischen Schnappschüsse. Vor jeder Datei zeigt eine Vorschau, was darin steht und ob sie verschlüsselt ist (`src/components/ExportVorschau.jsx` Z. 66–68). Erinnerung, wenn die letzte Sicherung fehlt oder älter als 7 Tage ist (`src/Dashboard.jsx` Z. 1680–1712) |
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
| **Aufbewahrungsfrist** | Server-Logs: nach Angabe des Anbieters mindestens 7 Tage (Infomaniak Support-FAQ 1926, abgerufen 23.09.2026; so auch `legal.privacy.hosting1`/`hostingSource`). Bis 24.09.2026 stand hier «nicht belegt» |
| **Auftragsbearbeitung (Art. 9 DSG)** | Rolle: Infomaniak ist Auftragsbearbeiterin (so auch die App, `legal.privacy.hosting1`). Vertrag: Infomaniak-Standardbedingungen, **nicht im Einzelnen geprüft**; kein eigener Auftragsbearbeitungsvertrag |
| **Technische Massnahmen** | HTTPS/TLS, HSTS, keine Nutzerdaten in Server-Logs (die App sendet keine) |
| **Rechtsgrundlage** | Berechtigtes Interesse / technische Notwendigkeit |

---

## Bearbeitungstätigkeit 7: E-Mail-Korrespondenz

| Feld | Beschreibung |
|---|---|
| **Bezeichnung** | Beantworten von Nachrichten an info@malojaplana.ch |
| **Zweck** | Antwort auf Anfragen, Fehlermeldungen und Rückmeldungen (auch über den Melde-Weg der App, der nur einen Mail-Entwurf öffnet) |
| **Kategorien betroffener Personen** | Personen, die schreiben |
| **Kategorien von Personendaten** | E-Mail-Adresse, Inhalt der Nachricht, allfällige Anhänge — was die Person selbst mitschickt |
| **Speicherort** | Postfach bei Infomaniak, Schweiz |
| **Empfänger** | Keine Weitergabe an Dritte, ausser gesetzlich geschuldet. Das Postfach betreibt Infomaniak; die Rolle beim Postfach ist nicht eigens geprüft |
| **Übermittlung ins Ausland** | Keine (Postfach in der Schweiz) |
| **Aufbewahrungsfrist** | So lange, wie die Anfrage und übliche Nachfragen es brauchen, danach gelöscht — keine feste Frist in Tagen |
| **Rechtsgrundlage** | Die Nachricht der Person selbst (Anfrage) |
| **Beleg** | App-Text `legal.privacy.contactTitle`/`contact1` (seit #277) |

Nachgetragen 24.09.2026 (Deploy-Gate 0.1.40-beta): die Tätigkeit stand in der App seit #277, aber nicht in diesem Verzeichnis.

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
    ├── [EXTERN] Seitenabruf (HTTPS)
    │       └── Infomaniak Hosting (Schweiz): IP-Adresse in Server-Logs
    │           (nach Angabe des Anbieters mindestens 7 Tage)
    │
    └── [EXTERN, nur wenn die Person schreibt] E-Mail an info@malojaplana.ch
            └── Postfach bei Infomaniak (Schweiz)
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
Tätigkeiten 1 und 3 (Export-Formate, Zeilenbelege): auf Code-Stand `main` 8399deb gebracht (Bau-Liste K28), nicht juristisch geprüft.
Kopf-Datum, Tätigkeiten 1–3 (Löschweg E18, «trifft nicht zu» E17, Schnappschuss-Takt): auf Code-Stand `main` 3500330 gebracht (Bau-Liste K39), nicht juristisch geprüft.
Tätigkeit 6 (Log-Frist, Auftragsbearbeitung) und neue Tätigkeit 7 (E-Mail-Korrespondenz): an die App-Texte `legal.privacy.hosting1`/`contact1` angeglichen, 24.09.2026 (Deploy-Gate 0.1.40-beta), nicht juristisch geprüft.
