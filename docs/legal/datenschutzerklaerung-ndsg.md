# Datenschutzerklärung — Maloja Plana

**Gemäss neuem Datenschutzgesetz (nDSG), in Kraft seit 1. September 2023**
**Stand: 24.09.2026** (erstellt Juni 2026; die Nachführungen stehen am Ende)

---

## 1. Verantwortliche Person (Art. 19 Abs. 2 lit. a nDSG)

Sophie Stebler
Basel, Schweiz
E-Mail: info@malojaplana.ch
Web: https://malojaplana.ch

Maloja Plana ist ein Open-Source-Projekt. Die Nutzung der App ist kostenlos; für White-Label und andere kommerzielle Nutzung gibt es auf Anfrage eine separate Lizenz (Dual Licensing, siehe `docs/legal/nutzungsbedingungen.md`). Es gibt keinen Datenschutzberater im Sinne von Art. 10 nDSG: Nach Art. 10 Abs. 1 DSG *können* private Verantwortliche einen ernennen, die Benennung ist freiwillig. *(Bis 24.09.2026 stand hier als Begründung «da die Datenbearbeitung ausschliesslich lokal … stattfindet». Das stimmt für die Angaben in der App, aber nicht mehr als Ganzes: die Rechtstexte der App nennen seit #277 auch Hoster-Protokolle und E-Mails. Das Ergebnis bleibt, die Begründung war zu eng.)*

> Bis zum 23.09.2026 stand hier «ein nicht-kommerzielles Open-Source-Projekt». Das ging
> mit Dual Licensing und dem Beitrags-Aufruf in der App nicht auf: kostenlos nutzbar ist
> nicht dasselbe wie nicht-kommerziell. Aufgeschlagen bei einer Durchsicht von aussen.

---

## 2. Grundsatz: Lokale Datenverarbeitung

Maloja Plana ist eine **Local-First-Webanwendung**. Das bedeutet:

- Alle persönlichen Daten werden **ausschliesslich auf Deinem Gerät** gespeichert (im Browser-localStorage und in der IndexedDB).
- Es gibt **keinen Server, kein Backend und keine Cloud**, die Deine Daten empfängt oder verarbeitet.
- Es gibt **kein Benutzerkonto** und keine Registrierung.
- Nach dem ersten Laden funktioniert die Anwendung **auch offline** — in der Regel in den Bereichen, die schon einmal geöffnet wurden.

**Es findet keine systematische Übermittlung von Personendaten an die Betreiberin oder an Dritte statt.**

---

## 3. Welche Daten werden lokal gespeichert?

Die folgenden Daten werden ausschliesslich in Deinem Browser gespeichert:

| Datenkategorie | Speicherort | Zweck |
|---|---|---|
| Persönliche Angaben (Name, Geburtsdatum, Adresse, Kontaktdaten) | localStorage (`or5_data`) | Selbstorganisation, Kapitelübersichten |
| Haushaltsdaten (Wohnsituation, Miete, Einkommen) | localStorage (`or5_data`) | Budget- und Sozialhilfe-Orientierung |
| Versicherungsdaten (KVG-Prämien, Policen) | localStorage (`or5_data`) | Versicherungsübersicht |
| Dokumente — Metadaten (Titel, Kategorie, Datum) | localStorage (`or5_docs`) | Dokumentenablage |
| Dokumente — Dateiinhalte (PDF, Bilder) | IndexedDB (`maloja-plana-documents`) | Dokumentenablage |
| Kontakte (Notfallkontakte, Ansprechpersonen) | localStorage (`or5_contacts`) | Notfall- und Kontaktübersicht |
| Merkliste | localStorage (`or5_merkliste`) | Gemerkte Inhalte |
| Erinnerungen und Fristen | localStorage (`or5_reminders`) | Fristenverwaltung |
| Automatische Backups (Schnappschüsse der Angaben, Dokumente samt Dateien, Erinnerungen, Kontakte und Merkliste) | IndexedDB (`maloja-plana-backups`) | Datensicherung; entstehen beim Start der App, höchstens einer je 12 Stunden, die letzten 5 bleiben (`src/utils/autoBackup.js` Z. 14–15 und 114–166, `src/main.jsx` Z. 586–592); **nicht verschlüsselt** (Bau-Liste K34) |
| Sicherheitskopien vor einer Wiederherstellung | localStorage (`or5_data_prerestore`, `or5_docs_prerestore`, `or5_reminders_prerestore`, `or5_contacts_prerestore`, `or5_merkliste_prerestore`, `or5_prerestore_date`) | Rückgängig-Möglichkeit nach einem Backup-Import; werden nicht automatisch gelöscht, wohl aber mit «Alle Daten auf diesem Gerät löschen» (7.2) |
| Beta-Zugang | localStorage (`or5_beta_access`) | Zugangsschranke während der Beta (nur UI-Hürde, keine Verschlüsselung) |
| Einstellungen (Sprache, Theme, Onboarding) | localStorage (`or5_lang`, `or5_theme`, `or5_onboarding_done`) | App-Konfiguration |

Markiert jemand ein Feld als «trifft nicht zu», steht in `or5_data` je Kapitel eine Liste der betroffenen Feldnamen (`_na`, `src/utils/vollstaendigkeit.js` Z. 4–8). Sie enthält keine weiteren Angaben, wird mitgesichert und mitgelöscht.

Daneben legt die App weitere Schlüssel mit dem Präfix `or5_` an (Barrierefreiheits-Einstellungen, Zeitstempel des letzten Backups, Migrations-Schnappschuss `or5_data_premigration`); sie enthalten Einstellungen oder Kopien der oben genannten Daten. Die Speichernamen sind im Quellcode belegt (`src/utils/storage.js` Z. 51, `src/utils/autoBackup.js` Z. 11, `src/utils/backupCrypto.js` Z. 216–227, `src/utils/docBlobs.js` Z. 4–6, `src/BetaGate.jsx` Z. 15, `src/MerklisteView.jsx` Z. 10). Ältere Installationen wurden von `ordnung-ruhe-documents` / `ordnung-ruhe-backups` auf die neuen Namen migriert; die alten Datenbanken werden dabei gelöscht (`storage.js` Z. 88, `autoBackup.js` Z. 52).

**Diese Daten verlassen Dein Gerät nicht**, ausser Du exportierst sie aktiv als Datei unter Werkzeuge → Export (siehe 7.3): als Sicherung, in der Voreinstellung verschlüsselt, ohne Verschlüsselung wählbar, oder unverschlüsselt als JSON oder CSV. Einzelne Ansichten bieten zusätzlich eigene Dateien an, ebenfalls nur auf Deinen Klick: Behörden-Dossier, Budget-Bericht und Unterlagen zur Prämienverbilligung als JSON, Lebenslauf als HTML oder JSON, Termine als Kalenderdatei (`.ics`), Dossiers, Briefe und weitere Druckansichten zum Drucken oder Speichern als PDF (blockiert der Browser das neue Fenster, wird die Ansicht als `.html`-Datei heruntergeladen, `src/utils/helpers.js` Z. 58–72). Vor jeder solchen Datei zeigt die App, was darin steht und ob sie verschlüsselt ist (`src/components/ExportVorschau.jsx`). Bis zum 16.09.2026 stand hier «(Backup-Export, JSON oder verschlüsselt)»; CSV, `MANIFEST.txt` und die Dateien aus den übrigen Ansichten fehlten. Danach, bis zur Bau-Liste K39 am selben Tag, stand hier «(JSON oder CSV, auf Wunsch verschlüsselt)»; seit E10 ist die verschlüsselte Sicherung die Voreinstellung.

---

## 4. Besonders schützenswerte Personendaten (Art. 5 lit. c nDSG)

Maloja Plana kann je nach Eingabe folgende besonders schützenswerte Daten enthalten:

- **Gesundheitsdaten**: Medikamentenlisten, Organspende-Wunsch, Patientenverfügung
- **Daten zu Sozialhilfemassnahmen**: Sozialhilfe-Berechnungen, Prämienverbilligung
- **Religiöse/weltanschauliche Überzeugungen**: nur wenn freiwillig eingegeben

Da diese Daten **ausschliesslich lokal** gespeichert werden und **nie an einen Server übertragen** werden, ist das Risiko für die Persönlichkeitsrechte gering. Die technische Schutzmassnahme besteht in der vollständigen Vermeidung von Datenübertragungen.

---

## 5. Datenbearbeitung durch Dritte

### 5.1 Hosting

Die statische Webanwendung (HTML, CSS, JavaScript — ohne Nutzerdaten) wird bei **Infomaniak Network SA, Genf, Schweiz** gehostet (Rechenzentren in der Schweiz). Beim Abruf der Webseite werden standardmässig folgende technische Daten durch den Hosting-Provider verarbeitet:

- IP-Adresse (in Server-Logs)
- Browsertyp, Betriebssystem
- Zeitpunkt des Zugriffs

Diese Verarbeitung ist technisch notwendig für die Auslieferung der Webseite.

- **Aufbewahrungsdauer der Server-Logs:** nach Angabe des Anbieters mindestens 7 Tage (Infomaniak Support-FAQ 1926, abgerufen am 23.09.2026; so auch die App, `legal.privacy.hosting1`/`hostingSource`). *(Bis 24.09.2026 stand hier «nicht belegt».)*
- **Auftragsbearbeitung (Art. 9 DSG):** Infomaniak bearbeitet die Protokolldaten als Auftragsbearbeiterin — so benennt es auch die App (`legal.privacy.hosting1`). Vertraglich gelten die Standard-Vertragsbedingungen von Infomaniak; ob sie die Anforderungen von Art. 9 DSG im Einzelnen abdecken, ist **nicht geprüft**. Ein eigener Auftragsbearbeitungsvertrag ist nicht abgeschlossen.

Belege für den Hoster: `deploy.sh` Z. 2 (SFTP-Deploy zu Infomaniak), `src/i18n/de.js` `privacy.hosting1`, `docs/legal/third-party-licenses.md` («Vercel — nicht mehr verwendet»). Bis zum 15.09.2026 nannte diese Erklärung noch Vercel Inc. (USA); das war seit dem Hosting-Wechsel nicht mehr zutreffend.

### 5.2 E-Mail-Korrespondenz

Wer an info@malojaplana.ch schreibt, gibt der Betreiberin E-Mail-Adresse, Inhalt der Nachricht und allfällige Anhänge. Bearbeitet werden sie, um zu antworten. Das Postfach liegt bei Infomaniak in der Schweiz. Die Korrespondenz wird so lange behalten, wie die Anfrage und übliche Nachfragen es brauchen, danach gelöscht; eine Weitergabe an Dritte findet nicht statt, ausser sie ist gesetzlich geschuldet. So steht es in der App (`legal.privacy.contact1`, seit #277). Eine feste Frist in Tagen ist nicht festgelegt.

### 5.3 Keine weiteren Dritten

Es gibt **keine** weiteren Datenempfänger:
- Keine Werbung, kein Tracking, keine Analyse-Cookies
- Keine Social-Media-Plugins
- Keine Datenverkäufe oder -weitergaben
- Keine Cloud-Dienste für Nutzerdaten
- Keine externen APIs, die Nutzerdaten erhalten

---

## 6. Datentransfer ins Ausland (Art. 16–18 nDSG)

Personendaten werden **nicht ins Ausland übertragen**, da sie Dein Gerät nicht verlassen.

Auch die in Abschnitt 5 genannten technischen Daten (Server-Logs) verbleiben in der Schweiz: der Hoster Infomaniak Network SA betreibt seine Rechenzentren in der Schweiz. Ein Auslandtransfer findet nach heutigem Stand nicht statt. (Bis zum 15.09.2026 stand hier ein Transfer an Vercel Inc., USA, unter dem Swiss-U.S. Data Privacy Framework; dieser Transfer findet seit dem Hosting-Wechsel nicht mehr statt.)

---

## 7. Deine Rechte (Art. 25–29 nDSG)

### 7.1 Auskunftsrecht (Art. 25 nDSG)
Da alle Daten lokal auf Deinem Gerät gespeichert sind, hast Du jederzeit **direkten Zugang** zu allen Deinen Daten. Du brauchst kein Auskunftsgesuch — Du kannst Deine Daten direkt in der App einsehen und als Datei exportieren (siehe 7.3). Bis zur Bau-Liste K39 (16.09.2026) stand hier «JSON oder CSV, auf Wunsch verschlüsselt».

### 7.2 Recht auf Löschung
Du kannst Deine Daten jederzeit löschen:
- **In der App, einzeln**: Einzelne Einträge (Felder, Dokumente, Erinnerungen, Kontakte) löschen
- **In der App, alles auf einmal**: Einstellungen → «Daten auf diesem Gerät» → «Alle Daten auf diesem Gerät löschen»
- **Im Browser**: Browserdaten (localStorage und IndexedDB) für malojaplana.ch löschen
- Es gibt **keine serverseitigen Kopien**, die gelöscht werden müssten

**Was «Alle Daten auf diesem Gerät löschen» entfernt** (`src/utils/datenLoeschen.js`, aufgerufen aus `src/components/DatenLoeschen.jsx`, eingebunden in `src/SettingsView.jsx` Z. 72):
- alle localStorage- und sessionStorage-Schlüssel mit dem Präfix `or5_` (Abschnitt 3), ausser `or5_beta_access` (`datenLoeschen.js` Z. 22, 29–37) — damit auch die Sicherheitskopien `or5_*_prerestore`, den Migrations-Schnappschuss und einen eingerichteten Tresor;
- die IndexedDB-Datenbanken `maloja-plana-documents` und `maloja-plana-backups` samt den Altnamen `ordnung-ruhe-documents` / `ordnung-ruhe-backups` (`datenLoeschen.js` Z. 24), also die Dateiinhalte der Dokumente und die automatischen Backups.

Nicht entfernt werden: der Beta-Zugang `or5_beta_access` (kein persönlicher Inhalt; ohne ihn stünde die Zugangsschranke nach dem Neustart wieder da), der Cache des Service Workers (enthält nur die App-Dateien, keine Angaben) sowie heruntergeladene Export- und Backup-Dateien, die ausserhalb des Browsers liegen. Vor dem Löschen zeigt die App, was gelöscht wird, und bietet den Weg zur bestehenden Sicherung an; gelöscht wird erst nach einer zweiten, ausdrücklichen Bestätigung. Danach startet die App neu, wie beim ersten Aufruf. Im Beispiel-Modus ist der Knopf ausgeschaltet, die eigenen Daten bleiben dort unberührt (`datenLoeschen.js` Z. 57). Die Löschung wirkt nur in dem Browser und auf dem Gerät, auf dem sie ausgelöst wird.

Bis zum 16.09.2026 stand hier, eine Funktion «alle Daten zurücksetzen» sei geplant, aber nicht gebaut, und der Weg über die Browser-Einstellungen sei der einzige, um alle Daten auf einmal zu entfernen. `storage.clear()` in `src/utils/storage.js` Z. 37–45 hat weiterhin keinen Aufrufer; der neue Löschweg nutzt ihn bewusst nicht, weil er nur localStorage leert und die Dokumente in IndexedDB liegen liesse.

### 7.3 Recht auf Datenherausgabe (Art. 28 nDSG)
Du kannst Deine Daten jederzeit exportieren: als maschinenlesbare JSON-Datei (Klartext), als CSV oder als verschlüsselte `.maloja`-Datei; dazu gibt es eine Übersicht als `MANIFEST.txt`. Jede davon wird als eigene Datei heruntergeladen, ein ZIP-Archiv entsteht nicht (`src/ZipExport.jsx` Z. 32–57 und 59–108; `src/zipExport.js` Z. 146–161). Bis zum 15.09.2026 stand hier «ZIP-Datei». Die App-Texte `legal.privacy.backup1` und `rights3` sagen seit PR #134 dasselbe.

**Verschlüsselung (Bau-Liste E10):** Unter «Sicherung» steht der verschlüsselte Weg zuerst und ist als Voreinstellung benannt (`src/ZipExport.jsx` Z. 339–358); neue verschlüsselte Sicherungen verlangen ein Passwort von mindestens 12 Zeichen (`src/utils/backupCrypto.js` Z. 107 und 316–320). Die Klartext-Sicherung bleibt wählbar, steht darunter und trägt einen Hinweis (`ZipExport.jsx` Z. 360–367). JSON, CSV und `MANIFEST.txt` sind immer unverschlüsselt. Ältere Sicherungen mit kürzerem Passwort lassen sich weiter öffnen. Die App-Texte `legal.privacy.backup1` und `legal.faq.a5`/`a7` sagen seit der Bau-Liste K39 dasselbe; bis dahin stand dort «auf Wunsch verschlüsselt».

### 7.4 Weitere Rechte
Die Angaben in der App bearbeitet die Betreiberin nicht — sie liegen nur auf Deinem Gerät; dafür gibt es gegenüber der Betreiberin nichts herauszugeben oder zu löschen. **Anders bei E-Mails** (Abschnitt 5.2): für Deine Korrespondenz mit uns gelten Auskunft, Berichtigung und Löschung (Art. 25 ff. nDSG) gegenüber der Betreiberin; Anfragen an info@malojaplana.ch. Für Fragen zum Hosting ebenso. *(Bis 24.09.2026 stand hier, die Betroffenenrechte entfielen, weil keine Personendaten auf eigenen Servern lägen — für E-Mails traf das nicht zu.)*

---

## 8. Datensicherheit (Art. 8 nDSG / Art. 1–3 DSV)

### Technische Massnahmen
- **Keine Datenübertragung**: Nutzerdaten verlassen das Gerät nicht
- **HTTPS/TLS**: Alle Verbindungen zur Webseite sind verschlüsselt
- **Verschlüsselte Sicherung als Voreinstellung**: Der verschlüsselte Weg für die Sicherungsdatei steht zuerst und ist als Voreinstellung benannt (AES-256-GCM, Passwort mind. 12 Zeichen, siehe 7.3); eine unverschlüsselte Sicherung ist ein eigener, bewusst zu wählender Knopf darunter. Vorausgewählt wird nichts — jede Sicherung beginnt mit einem Klick auf einen der beiden Wege. *(Präzisiert 16.09.2026 abends nach der Rechts-Prüfung vor dem Deploy; vorher stand hier «ohne andere Wahl verschlüsselt».)* Die automatischen Schnappschüsse im Browser sind nicht verschlüsselt, ebenso die übrigen Angaben im Browser-Speicher (Abschnitt 3). Bis zum 16.09.2026 stand hier: «Lokale Backup-Dateien können verschlüsselt exportiert werden».
- **Kein serverseitiger Datenzugriff**: Weder die Betreiberin noch Dritte können auf Deine Daten zugreifen
- **Open Source**: Der Quellcode ist öffentlich einsehbar und überprüfbar

### Deine Verantwortung
Da alle Daten lokal gespeichert werden, liegt die Sicherheit Deiner Daten in Deiner eigenen Verantwortung:
- Sichere Dein Gerät mit einem Passwort/PIN
- Erstelle regelmässig Backups (die App erinnert Dich daran)
- Lösche Deine Daten, wenn Du ein geteiltes Gerät verwendest (in der App über «Alle Daten auf diesem Gerät löschen», siehe 7.2, oder über die Browserdaten)

---

## 9. Automatisierte Einzelentscheidungen (Art. 21 nDSG)

Maloja Plana trifft **keine automatisierten Einzelentscheidungen** im Sinne des nDSG. Alle Berechnungen (Steuerrechner, Sozialhilfe, Prämien) dienen ausschliesslich der Orientierung und haben keine rechtliche Wirkung.

---

## 10. Datenschutz-Folgenabschätzung (Art. 22 nDSG)

Eine Kurzfassung einer Datenschutz-Folgenabschätzung liegt als Entwurf vor (`docs/legal/dsfa-kurzfassung.md`, auf `main` seit PR #132, Merge `15bb60a`), juristisch nicht geprüft. Ob eine DSFA nach Art. 22 DSG formell erforderlich ist, hängt davon ab, ob die Betreiberin für rein gerätelokale Daten überhaupt «Verantwortliche» ist — diese Frage ist im Entwurf (Abschnitt 7) offen gehalten und einer Fachperson vorzulegen.

Gründe, die im Entwurf für ein geringes Risiko sprechen:
- Keine Übermittlung von Nutzerdaten an die Betreiberin oder Dritte
- Keine Profiling-Aktivitäten
- Rein lokale Speicherung auf dem Gerät der nutzenden Person

Bis zum 15.09.2026 stand hier «Eine formelle DSFA ist nicht erforderlich». Diese Aussage ist zurückgenommen, bis die juristische Prüfung vorliegt.

---

## 11. Cookies

Maloja Plana verwendet **keine Cookies**. Weder eigene noch Drittanbieter-Cookies. Die lokale Datenspeicherung erfolgt über die Web Storage API (localStorage) und IndexedDB, nicht über Cookies.

---

## 12. Browser-Benachrichtigungen

Maloja Plana kann Browser-Benachrichtigungen für Fristen-Erinnerungen verwenden. Diese Funktion:
- Erfordert Deine **ausdrückliche Zustimmung** (Browser-Berechtigungsdialog)
- Wird vollständig lokal verarbeitet (kein Push-Server)
- Kann jederzeit in den Browser-Einstellungen widerrufen werden

---

## 13. Minderjährige

Maloja Plana richtet sich nicht an Minderjährige und erhebt wissentlich keine Daten von Personen unter 16 Jahren.

---

## 14. Änderungen

Diese Datenschutzerklärung kann bei wesentlichen Änderungen aktualisiert werden. Das Datum der letzten Änderung ist oben angegeben.

---

## 15. Kontakt und Aufsichtsbehörde

**Fragen zum Datenschutz:**
info@malojaplana.ch

**Zuständige Aufsichtsbehörde:**
Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)
Feldeggweg 1, CH-3003 Bern
https://www.edoeb.admin.ch

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
Abschnitt 7.1 und 7.3 (Benennung des Exports): auf Code-Stand `main` 0274ce9 gebracht, nicht juristisch geprüft.
Abschnitt 3 (Export-Satz und Speichernamen-Beleg): auf Code-Stand `main` 8399deb gebracht (Bau-Liste K28), nicht juristisch geprüft.
Abschnitt 7.2 und 8 (Löschweg «Alle Daten auf diesem Gerät löschen», Bau-Liste E18): auf den Stand des Zweigs `feat/e17-e18-trifft-nicht-zu-loeschweg` gebracht (seit PR #174 auf `main`), nicht juristisch geprüft.
Kopf-Datum, Abschnitte 3, 7.1, 7.3 und 8 (Verschlüsselung als Voreinstellung E10, Schnappschüsse K34, «trifft nicht zu» E17): auf Code-Stand `main` 3500330 gebracht (Bau-Liste K39), nicht juristisch geprüft.
Abschnitte 5.1 (Log-Frist, Auftragsbearbeitung), 5.2 neu (E-Mail-Korrespondenz) und 7.4 (Rechte bei E-Mails): an die App-Texte `legal.privacy.hosting1`/`contact1` angeglichen, 24.09.2026 (Deploy-Gate 0.1.40-beta), nicht juristisch geprüft.
