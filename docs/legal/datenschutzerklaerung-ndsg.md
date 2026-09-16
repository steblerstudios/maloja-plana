# Datenschutzerklärung — Maloja Plana

**Gemäss neuem Datenschutzgesetz (nDSG), in Kraft seit 1. September 2023**
**Stand: Juni 2026**

---

## 1. Verantwortliche Person (Art. 19 Abs. 2 lit. a nDSG)

Sophie Stebler
Basel, Schweiz
E-Mail: info@malojaplana.ch
Web: https://malojaplana.ch

Maloja Plana ist ein nicht-kommerzielles Open-Source-Projekt. Es gibt keinen Datenschutzberater im Sinne von Art. 10 nDSG, da die Datenbearbeitung ausschliesslich lokal auf dem Gerät der nutzenden Person stattfindet.

---

## 2. Grundsatz: Lokale Datenverarbeitung

Maloja Plana ist eine **Local-First-Webanwendung**. Das bedeutet:

- Alle persönlichen Daten werden **ausschliesslich auf Deinem Gerät** gespeichert (im Browser-localStorage und in der IndexedDB).
- Es gibt **keinen Server, kein Backend und keine Cloud**, die Deine Daten empfängt oder verarbeitet.
- Es gibt **kein Benutzerkonto** und keine Registrierung.
- Die Anwendung funktioniert **vollständig offline**.

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
| Automatische Backups (Schnappschüsse) | IndexedDB (`maloja-plana-backups`) | Datensicherung |
| Sicherheitskopien vor einer Wiederherstellung | localStorage (`or5_data_prerestore`, `or5_docs_prerestore`, `or5_reminders_prerestore`, `or5_contacts_prerestore`, `or5_merkliste_prerestore`, `or5_prerestore_date`) | Rückgängig-Möglichkeit nach einem Backup-Import; werden nicht automatisch gelöscht |
| Beta-Zugang | localStorage (`or5_beta_access`) | Zugangsschranke während der Beta (nur UI-Hürde, keine Verschlüsselung) |
| Einstellungen (Sprache, Theme, Onboarding) | localStorage (`or5_lang`, `or5_theme`, `or5_onboarding_done`) | App-Konfiguration |

Daneben legt die App weitere Schlüssel mit dem Präfix `or5_` an (Barrierefreiheits-Einstellungen, Zeitstempel des letzten Backups, Migrations-Schnappschuss `or5_data_premigration`); sie enthalten Einstellungen oder Kopien der oben genannten Daten. Die Speichernamen sind im Quellcode belegt (`src/utils/storage.js` Z. 51, `src/utils/autoBackup.js` Z. 11, `src/utils/backupCrypto.js` Z. 216–227, `src/utils/docBlobs.js` Z. 4–6, `src/BetaGate.jsx` Z. 15, `src/MerklisteView.jsx` Z. 10). Ältere Installationen wurden von `ordnung-ruhe-documents` / `ordnung-ruhe-backups` auf die neuen Namen migriert; die alten Datenbanken werden dabei gelöscht (`storage.js` Z. 88, `autoBackup.js` Z. 52).

**Diese Daten verlassen Dein Gerät nicht**, ausser Du exportierst sie aktiv als Datei (JSON oder CSV, auf Wunsch verschlüsselt; unter Werkzeuge → Export, siehe 7.3). Einzelne Ansichten bieten zusätzlich eigene Dateien an, ebenfalls nur auf Deinen Klick: Behörden-Dossier, Budget-Bericht und Unterlagen zur Prämienverbilligung als JSON, Lebenslauf als HTML oder JSON, Termine als Kalenderdatei (`.ics`), Dossiers, Briefe und weitere Druckansichten zum Drucken oder Speichern als PDF (blockiert der Browser das neue Fenster, wird die Ansicht als `.html`-Datei heruntergeladen, `src/utils/helpers.js` Z. 58–72). Vor jeder solchen Datei zeigt die App, was darin steht und ob sie verschlüsselt ist (`src/components/ExportVorschau.jsx`). Bis zum 16.09.2026 stand hier «(Backup-Export, JSON oder verschlüsselt)»; CSV, `MANIFEST.txt` und die Dateien aus den übrigen Ansichten fehlten.

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

- **Aufbewahrungsdauer der Server-Logs:** nicht belegt (Infomaniak-Standard; bei Bedarf beim Hoster erfragen).
- **Auftragsbearbeitungsvertrag (Art. 9 DSG):** offen — ob die Standard-Vertragsbedingungen von Infomaniak diese Anforderung abdecken, ist nicht geprüft.

Belege für den Hoster: `deploy.sh` Z. 2 (SFTP-Deploy zu Infomaniak), `src/i18n/de.js` `privacy.hosting1`, `docs/legal/third-party-licenses.md` («Vercel — nicht mehr verwendet»). Bis zum 15.09.2026 nannte diese Erklärung noch Vercel Inc. (USA); das war seit dem Hosting-Wechsel nicht mehr zutreffend.

### 5.2 Keine weiteren Dritten

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
Da alle Daten lokal auf Deinem Gerät gespeichert sind, hast Du jederzeit **direkten Zugang** zu allen Deinen Daten. Du brauchst kein Auskunftsgesuch — Du kannst Deine Daten direkt in der App einsehen und als Datei exportieren (JSON oder CSV, auf Wunsch verschlüsselt; siehe 7.3).

### 7.2 Recht auf Löschung
Du kannst Deine Daten jederzeit löschen:
- **In der App**: Einzelne Einträge (Felder, Dokumente, Erinnerungen, Kontakte) löschen
- **Im Browser**: Browserdaten (localStorage und IndexedDB) für malojaplana.ch löschen — das ist heute der Weg, um **alle** Daten auf einmal zu entfernen
- Es gibt **keine serverseitigen Kopien**, die gelöscht werden müssten

Eine Funktion «alle Daten zurücksetzen» in der App ist geplant, aber nicht gebaut (Stand 15.09.2026): `storage.clear()` in `src/utils/storage.js` Z. 37–45 ist definiert, hat aber keinen Aufrufer; `src/SettingsView.jsx` enthält keinen Reset. Bis dahin gilt der Weg über die Browser-Einstellungen. Hinweis: Die Sicherheitskopien `or5_*_prerestore` (Abschnitt 3) bleiben nach einem Backup-Import bestehen und werden nur mit den Browserdaten entfernt.

### 7.3 Recht auf Datenherausgabe (Art. 28 nDSG)
Du kannst Deine Daten jederzeit exportieren: als maschinenlesbare JSON-Datei (Klartext), als CSV oder als verschlüsselte `.maloja`-Datei; dazu gibt es eine Übersicht als `MANIFEST.txt`. Jede davon wird als eigene Datei heruntergeladen, ein ZIP-Archiv entsteht nicht (`src/ZipExport.jsx` Z. 32–57 und 59–108; `src/zipExport.js` Z. 146–161). Bis zum 15.09.2026 stand hier «ZIP-Datei». Die App-Texte `legal.privacy.backup1` und `rights3` sagen seit PR #134 dasselbe.

### 7.4 Weitere Rechte
Da die Betreiberin **keine personenbezogenen Daten** auf eigenen Servern speichert, entfallen die typischen Betroffenenrechte gegenüber der Betreiberin. Für Fragen zum Hosting und zu Performance-Metriken wende Dich an info@malojaplana.ch.

---

## 8. Datensicherheit (Art. 8 nDSG / Art. 1–3 DSV)

### Technische Massnahmen
- **Keine Datenübertragung**: Nutzerdaten verlassen das Gerät nicht
- **HTTPS/TLS**: Alle Verbindungen zur Webseite sind verschlüsselt
- **Verschlüsselte Backups**: Lokale Backup-Dateien können verschlüsselt exportiert werden
- **Kein serverseitiger Datenzugriff**: Weder die Betreiberin noch Dritte können auf Deine Daten zugreifen
- **Open Source**: Der Quellcode ist öffentlich einsehbar und überprüfbar

### Deine Verantwortung
Da alle Daten lokal gespeichert werden, liegt die Sicherheit Deiner Daten in Deiner eigenen Verantwortung:
- Sichere Dein Gerät mit einem Passwort/PIN
- Erstelle regelmässig Backups (die App erinnert Dich daran)
- Lösche Deine Browserdaten, wenn Du ein geteiltes Gerät verwendest

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
