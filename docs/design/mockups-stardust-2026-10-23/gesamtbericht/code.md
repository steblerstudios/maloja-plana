# Code-Review Maloja (alle Seiten) — Arbeitsstand

Arbeitsbaum: `_werkbank/gesamtbericht-2026-10` (origin/main aa94f3d6). Read-only, laufend ergänzt.
Legende: 🔴 echter Fehler mit Datenverlust/Absturz/falscher Zahl · ⚠️ Fehler in Randfall · 💡 Hinweis/toter Code.

## Funde

### F1 ⚠️ Absturz beim Start durch ungültiges `expiryDate` (Import/Backup)
- Route: alle (main.jsx-Effekt) · `src/utils/docReminders.js:61-63`, aufgerufen `src/main.jsx:777-779`
- Szenario: Dokument mit `expiryDate: "31.12.2027"` (oder beliebiger Nicht-ISO-String) gelangt via Backup-Restore/ZIP-Import in `or5_docs` → `new Date("31.12.2027")` = Invalid Date → `.toISOString()` wirft `RangeError` im Effekt → App fällt bei jedem Start in den ErrorBoundary.
- Beleg: `validateDocs` (`src/utils/dataValidation.js:67-87`) prüft nur `id`, nicht `expiryDate`; `validateBackupPayload` lässt es durch. Kein try/catch um `syncDocumentReminders`.
- Fix: in `syncDocumentReminders` ungültige Daten überspringen (`isNaN(d)` → continue) und/oder `validateDocs` auf `/^\d{4}-\d{2}-\d{2}$/` prüfen (wie `validateMerkliste`).

### F2 ⚠️ Absturz bei Erinnerung mit nicht-String-`id`
- Route: alle · `src/utils/docReminders.js:43` (`r.id.startsWith`)
- Szenario: Backup mit `reminders: [{ id: 17, … }]` → `validateReminders` akzeptiert (nur truthy) → `17.startsWith` TypeError beim Start.
- Fix: `String(r.id).startsWith(...)` oder Typprüfung in `validateReminders`.

### F3 💡 `validateData` baut `sanitized` und wirft es weg
- `src/utils/dataValidation.js:48-60` — Schleife ist toter Code (beide Zweige identisch), Rückgabe ist `sanitized: data`. Verdeckt, dass keinerlei Sanitizing stattfindet.

### F4 ⚠️ Tresor: abgelaufenes Dokument gilt am Folgetag noch als «0d / bald fällig»
- Route: `#/tresor` · `src/DocumentTresor.jsx:13-18`
- Szenario: `expiryDate = "2026-10-23"`, jetzt 24.10.2026 00:30 CEST → `new Date("2026-10-23")` = 23.10. 02:00 CEST; diff ≈ −22.5 h → `Math.ceil(−0.94)` = 0 → nicht «archiv», Label «0d». Am Ablauftag selbst nach 02:00 ebenfalls `ceil` → 0 (ok), aber Zählung mischt UTC-Mitternacht mit lokaler Uhrzeit.
- Fix: beide Seiten als lokale Kalendertage vergleichen (`leseDatum` + `tageZwischen` aus utils/fristen.js / verzugszins.js).

### F5 💡 Brief-Vorschau-iframe ohne `sandbox`
- Route: `#/briefe` · `src/BriefGenerator.jsx:567-571` (`srcDoc: previewHtml`)
- Stand: alle Interpolationen in `src/briefGenerator.js` laufen über `esc()` (geprüft: sender/recipient/cityDate/positions/reasons); CSP `script-src 'self'` (index.html:6) blockt Inline-Skripte zusätzlich. Kein ausnutzbarer Pfad gefunden.
- Empfehlung: `sandbox: ''` (oder `allow-modals` für Druck) als zweite Linie — das srcdoc-Dokument ist sonst same-origin mit Zugriff auf localStorage.

### F6 🔴 Zwei verschiedene «Es bleiben»-Rechnungen: Nebenerwerb/Partner fehlen in Kapitel, Spiegel und Charts
- Routen: `#/chapter/…` (Finanzen: Spiegel-Satz + «Jeden Monat bleiben»), `#/charts`, Wohnen-Kapitel (Wohnkostenanteil) vs. `#/budget`, `#/finanzuebersicht`
- Dateien: `src/utils/monatsrechnung.js:33-36` (`sumTotalIncome` = Lohn + Familienzulagen + Alimente), genutzt in `src/MirrorCards.jsx:187-197`, `src/ChapterView.jsx:97-104`, `src/ChartsAdvanced.jsx:83-85`; eigene Variante `src/ChapterView.jsx:2164`. Budget/Finanzübersicht rechnen mit `src/data/haushaltsEinnahmen.js:18-32` (+ `sideIncome` + Partner, sperrt bei «brutto»).
- Szenario: monthlyIncome 3000 (netto), sideIncome 1500, Partner netto 0, Ausgaben 3600 → Finanzübersicht «+900», Kapitel-Spiegel `mirror.finanzen.remainsNegative` «Es fehlen CHF 600», `monatsUebersicht` → null (Karte verschwindet), Charts `remaining = max(0, −600) = 0`. Umgekehrt: Lohn als `incomeType: 'brutto'` erfasst → Kapitel/Charts melden «bleiben» auf Bruttobasis, obwohl haushaltsEinnahmen genau das sperrt.
- Beleg: Kommentar haushaltsEinnahmen.js:3-6 nennt den Nebenerwerb ausdrücklich als Fehler, der behoben wurde — aber nur für Budget/Finanzübersicht.
- Fix: `sumTotalIncome` durch `haushaltsEinnahmen(data).total` ersetzen (inkl. `bruttoDabei`-Sperre) oder bewusst «nur eigener Lohn» beschriften.

### F7 ⚠️ IndexedDB-Altmigration löscht alte DB, bevor die Kopie bestätigt ist
- Route: `#/tresor` (erste Dokument-Operation) · `src/utils/storage.js:80-88`
- Szenario: Alt-DB `ordnung-ruhe-documents` mit grossen Scans; `store2.put` läuft in `tx2`, ohne auf `tx2.oncomplete` zu warten → `indexedDB.deleteDatabase(OLD_DB_NAME)` wird sofort aufgerufen. Bricht `tx2` ab (QuotaExceeded beim Schreiben grosser Blobs), sind die Scans in beiden DBs weg.
- Ebenso `idb.save` (`:131-135`) meldet Erfolg auf `req.onsuccess`, nicht auf `tx.oncomplete` — ein späterer Abbruch der Transaktion bleibt unbemerkt.
- Fix: `await new Promise((res, rej) => { tx2.oncomplete = res; tx2.onabort = tx2.onerror = () => rej(tx2.error); })` vor `deleteDatabase`; save auf `oncomplete` auflösen.

### F8 ⚠️ Kalender: Wiederholungen driften (30-/365-Tage-Raster) und weichen vom .ics-Export ab
- Route: `#/calendar` · `src/CalendarReminders.jsx:29-37, 126-143`; Export `src/utils/icsExport.js:11, 41`
- Szenario a) «monatlich» am 31.01.2027 erledigt → nächste Fälligkeit 02.03.2027 (+30 Tage), danach 01.04. usw.; im .ics steht `FREQ=MONTHLY` (31. jedes Monats) → App und Kalender-App zeigen verschiedene Tage. b) «jährlich» 01.03.2027 → +365 = 29.02.2028. c) «täglich», «vierteljährlich», «halbjährlich» haben kein RRULE → im .ics nur ein Einzeltermin, die Wiederholung geht still verloren.
- d) Rollover nur ein Schritt: ein jährlicher Termin, seit zwei Jahren erledigt und nicht geöffnet, springt auf ein Datum, das immer noch in der Vergangenheit liegt.
- Fix: `plusMonate` aus utils/fristen.js für monthly/quarterly/halfYearly/yearly; RRULE ergänzen (`FREQ=DAILY`, `FREQ=MONTHLY;INTERVAL=3`, `INTERVAL=6`); Rollover in Schleife bis ≥ heute.

### F9 💡 Migration v1→v2 mutiert das Eingabeobjekt
- `src/utils/dataMigration.js:33-40` — `const basis = data.basis || {}` und dann `basis.firstName = …` schreibt ins Original. Bei Fehler in einer späteren Stufe liefert der Fallback (`:146`) ein bereits verändertes `input`. Folgen gering (Snapshot existiert), aber «Failures leave original data intact» (Kopfkommentar) stimmt so nicht.
- v2→v3 legt für jedes `dependents` ein Kind mit `age: 0` an (`:51-54`) — wo das Alter rechnet (Kinderzulagen, Prämien Kind/junge Erwachsene), gilt ein unbekanntes Alter als Säugling. (unbestätigt, welche Rechner `household.children[].age` lesen)

### F10 🔴 Kinderalter: Anzeige aus Geburtsdatum, Rechner lesen das gespeicherte `age` (Default 0, altert nie)
- Routen: `#/chapter/0` (Basis → Haushalt) erfasst; falsch gerechnet in `#/sozialhilfe` (Rückerstattung), `#/finanzuebersicht`, `#/mietzins`, `#/premium` (IPV junge Erwachsene, `src/config/cantonalData.js:418-421`), `#/alv` (F19)
- Dateien: Erfassung `src/ChapterView.jsx:421-441` (Feld «Alter» zeigt bei gesetztem `birthDate` ein errechnetes Alter, ist `readOnly`, schreibt aber nichts); neues Kind `:456` mit `age: 0`. `getHouseholdInfo` (`src/config/cantonalData.js:78-94`) gibt `children` roh zurück, ohne Alter aus `birthDate`. Leser: `src/SozialhilfeView.jsx:27, 214`, `src/FinanzUebersicht.jsx:346`, `src/data/mietzinsbeitraege.js:109, 142-144`. Gegenbeispiel, das es richtig macht: `src/utils/sozialhilfeVorbefuellung.js:44-51` (`kindAlter` rechnet aus `birthDate`) — d. h. auf `#/sozialhilfe` rechnet der SKOS-Rechner mit 18 Jahren, der Rückerstattungs-Block derselben Seite (`SozialhilfeView.jsx:27`) mit 0.
- Szenario: Kind hinzufügen, Geburtsdatum 01.05.2008 eintragen → Feld zeigt «18», gespeichert bleibt `age: 0` → Sozialhilfe zählt es als minderjährig (`< 18`), Finanzübersicht nicht als Person ab 16, Mietzinsbeitrag zählt 0 Volljährige / keine «jung erwachsen»-Frage. Ohne Geburtsdatum: Alter 12 im Jahr 2026 eingetragen bleibt 2027, 2028 … 12.
- Fix: in `getHouseholdInfo` (einzige Quelle) `age` aus `birthDate` ableiten, wenn gültig; Feld-Default `age: ''` statt `0`, damit «unbekannt» nicht als Säugling zählt.

### F11 ⚠️ KVG-Kündigungstermin: am Wochenende vor dem 30.11. wird eine schon verstrichene Frist angezeigt
- Route: `#/kvgwechsel` · `src/KVGWechsel.jsx:15-23`
- Szenario: 30.11. fällt auf einen Sonntag (2025, 2031) oder Samstag (2030). Am Samstag 29.11.2025: `now <= nov30` → Jahr 2025 → `werktagAmOderDavor('2025-11-30')` = **28.11.2025** (gestern). Text und «Frist sichern» nennen eine abgelaufene Frist statt 30.11.2026.
- Ursache: Vergleich gegen den Rohtermin, Verschiebung erst danach.
- Fix: erst `werktagAmOderDavor(year-11-30)` bilden, dann mit `heuteIso()` vergleichen; liegt er vor heute, das Folgejahr nehmen. (2026: 30.11. = Montag, 2027 = Dienstag → aktuell nicht betroffen.)
- Nebenbefund 💡: `src/ZusatzWechsel.jsx:13-20` (`nextSep30`) verschiebt Wochenenden gar nicht (30.09.2028 = Samstag) — uneinheitlich zur KVG-Regel «nie später als das Gesetz».

### F12 🔴 Budget-Import: Miete/Nebenkosten/KK landen in Feldern, die niemand liest; Einkommen wird über alle Zeilen summiert
- Route: `#/budget` (BudgetImport) · `src/csvImport.js:125-164`, verdrahtet `src/main.jsx:1615-1619` (`finanzen: { ...prev.finanzen, ...updated }`)
- Szenario a) CSV mit `01.10.2026,Miete,1850,Miete,expense` → `finanzen.rentAmount = 1850`. Gerechnet wird aber mit `wohnen.rentAmount` (`src/utils/monatsrechnung.js:20`) und `versicherungen.kkPremium` (`:22`); `finanzen.healthPremium` liest keine Datei ausser csvImport.js. Die Vorschau zeigt Einträge, nach «Übernehmen» ändert sich keine Zahl.
- b) Bank-/Jahres-CSV mit 12 Lohnzeilen à 5200 (`…,income`) → `monthlyIncome = 62 400` (Summe statt Monatswert) überschreibt den Profillohn; alle Rechner (Steuer, IPV, Sozialhilfe, Budget) laufen danach mit dem Zwölffachen.
- c) Schweizer Zahlformat: `…,Miete,1'850.00,…` → `parseFloat("1'850.00")` = **1**; `1850,50` zerfällt am Komma in zwei Spalten. Mit a) harmlos, mit Einkommen (`5'200`) → `monthlyIncome = 5`.
- d) `.xlsx/.xls` (`:22-50`) wird mit `readAsText` gelesen — das ist ein ZIP/Binärformat, es entstehen Müllzeilen oder nichts. Toter Pfad, der funktioniert vorgibt (`accept` in `src/BudgetImport.jsx:68`).
- e) eBill (`:52-97`): Ergebnis-Kategorie «Zahlungen» → `expenses.other`, das nie geschrieben wird → ganzer Zweig wirkungslos; zudem `"CHF 85.50".replace('.', '')` = 8550.
- Fix (F12): Ziel-Kapitel korrekt (`wohnen.rentAmount`, `wohnen.utilities`, `versicherungen.kkPremium`); Einkommen nur aus genau einer Monatszeile oder Durchschnitt je Monat mit Rückfrage; Zahl über `lies()` (utils/stundenlohn.js:66) parsen, `;` als Trenner erkennen; xlsx aus `accept` entfernen.

### F13 🔴 Beispiel-/Probe-Werte gelangen nach «Beispiel verlassen» bzw. «Verwerfen» in den echten Stand (Steuer, Vorsorge)
- Routen: `#/tax`, `#/vorsorge` (beide in `SANDBOX_VIEWS`, `src/main.jsx:665`)
- Dateien: `src/main.jsx:1633-1638` (TaxCalculator **ohne** `key: datenModus`, anders als Schulden/Prämien/Kalender `:1627, 1647, 1732`); Ausstieg ohne Ansichtswechsel `src/main.jsx:635, 1399` (Banner «Beispiel verlassen») und `:642, 1456` (Probe verwerfen). TaxCalculator kopiert in State: `src/TaxCalculator.jsx:92-94` (`taxData`, `canton`, `verheiratet`, `kinder`), speichert `:154-158` mit `steuerkantonSpeichern(data, canton)`. VorsorgeRechner: `src/VorsorgeRechner.jsx:86-102` (IK-Auszug im State, schreibt per Effekt bei jeder Änderung).
- Szenario Steuer: Beispiel betreten → `#/tax` öffnen (State = Beispiel-Kanton/-Abzüge) → Banner «Beispiel verlassen» (Ansicht bleibt, Komponente bleibt eingehängt) → «Speichern» → `writeData = setData` schreibt Beispiel-`taxData` und Beispiel-Steuerkanton in das echte Profil.
- Szenario Vorsorge: im Probier-Modus IK-Zeilen erfassen → «Verwerfen» → nächste IK-Änderung im echten Modus schreibt die ganze Probe-Liste (`ikEntries`) in `vorsorge.ikAuszug`.
- Beleg: Der Kommentar `src/main.jsx:626-629` beschreibt genau diesen Fehler für den Schuldenmanager und behebt ihn dort per `key`.
- Fix: `key: datenModus` an TaxCalculator, VorsorgeRechner und alle Ansichten, die `data` in `useState` kopieren und zurückschreiben (Kandidaten, nicht einzeln geprüft: `OrganDonation` `:1639` — hat `vorlaeufig`, aber keinen key; `Patientenverfuegung`/`Vorsorgeauftrag`/`Bestattung` `:1678-1680` kopieren `antworten` und schreiben bei jeder Antwort das ganze Objekt; `Stundenlohn`, `Kreditkarte`, `MietzinsOrientierung`). Generischer: `key: view + datenModus` am `ViewErrorBoundary` (`:1582`).

### F14 ⚠️ Wiederherstellen aus Datei: Auto-Save kann das Zurückgespielte vor dem Neuladen wieder überschreiben
- Route: `#/export` · `src/ZipExport.jsx:195-221` → `src/utils/backupCrypto.js:229-259` schreibt `or5_data`/`or5_docs`/…; Neuladen erst nach `setTimeout(…, 1500)`.
- Szenario: Feld geändert (noch nicht gespeichert, Ruhe-Takt 5 s läuft) → Sicherung einspielen → in den 1,5 s feuert der Intervall-Tick, spätestens aber `pagehide` beim `location.reload()` (`src/utils/autoSave.js:42-46`, `src/main.jsx:880`) → `speichereFallsOffen` schreibt den alten In-Memory-Stand über die eben wiederhergestellten Daten. `fremdGeaendert` greift nicht, das `storage`-Ereignis kommt nur in anderen Tabs an.
- Beleg: Der Löschweg sperrt `setItem` genau aus diesem Grund (`src/utils/datenLoeschen.js:15-17, 73-82`); der Wiederherstellungsweg nicht.
- Fix: vor dem Schreiben dieselbe Sperre wie beim Löschen setzen (oder ein Flag, das `speichereFallsOffen` als `fremdGeaendert` behandelt) und sofort neu laden.

### F15 ⚠️ Kapitel- und Dashboard-Ansicht liegen ausserhalb der Ansichts-Fehlergrenze
- Routen: `#/chapter/n`, `#/dashboard` · `src/main.jsx:1533, 1565-1581` (vor `ViewErrorBoundary` `:1582`)
- Szenario: jeder Render-Fehler in ChapterView (grösste Datei, viele Rechnungen pro Feld) oder Dashboard reisst die ganze App in die Wurzel-`ErrorBoundary` (`:1759`) statt nur die Ansicht; Kopf/Navigation sind weg. Zusätzlich `activeData[chapters[activeChapter].key]` (`:1569`) wirft, falls `chapters[activeChapter]` fehlt (unbestätigt, ob `getChapters` je < 7 Einträge liefert; `parseHash` erlaubt Index bis 20, `:569` kappt auf 6).
- Fix: beide Zweige in `ViewErrorBoundary` aufnehmen.

### F16 💡 Auto-Backup wird geschrieben, aber nirgends zurückgespielt
- `src/utils/autoBackup.js:348` (`restoreBackup(backupId)`) — einziger Importeur von `autoBackup.js` ist `src/main.jsx:769`, und der nutzt nur `createBackup`. Die 12-h-Schnappschüsse belegen IndexedDB-Platz, sind für Nutzende aber nicht erreichbar (keine UI, kein Listen-/Wiederherstellen-Weg gefunden). Entweder anbinden (z. B. Einstellungen → «Automatische Sicherungen») oder entfernen.

### F17 💡 Steuerdatei-Import: Bindestrich irgendwo im Wert macht den Betrag negativ
- Route: `#/taxImport` · `src/taxImport.js:21`
- Szenario: `Bruttolohn; 84'000 (2024-2025)` → Regex `/[-–]\s*[\d.,'’ ]*\d/` trifft «-2025» → `negative = true` → −84 000 → `num <= 0` → Zeile still verworfen (`:192`). Gleiches bei «Steuerbetrag; CHF 3'210 (Ref. 12-345)».
- Fix: Minus nur direkt vor dem herausgelösten `token` akzeptieren (`s.slice(0, token.index)` endet auf `-`/`–`).

### F18 ⚠️ Stilles Neuladen nach Deploy mitten in der Eingabe
- Routen: alle mit Eingaben, die erst per Knopf gespeichert werden (`#/tax`, `#/briefe`, `#/stundenlohn`, `#/organ`, Formulare in `#/calendar`)
- Dateien: `src/utils/notifications.js:40-58` (`controllerchange` → `location.reload()`; `registration.update()` bei jedem `visibilitychange → visible`), `public/sw.js:78, 108` (`skipWaiting` + `clients.claim`).
- Szenario: Steuerrechner halb ausgefüllt, kurz in eine andere App gewechselt → zurück → `update()` findet den neuen SW → übernimmt sofort → Seite lädt neu → nicht gespeicherte Komponenten-Eingaben weg (der Profil-Stand selbst wird per `pagehide` gesichert, F14-Mechanik).
- Fix: neuen SW warten lassen und ruhig «Neue Version — neu laden» anbieten, oder Reload nur beim nächsten Ansichtswechsel/Start.

### F19 ⚠️ ALV-Rechner: «Unterhaltspflicht für Kinder» aus jedem Haushaltskind vorbelegt, auch über 25
- Route: `#/alv` · `src/AlvRechner.jsx:22, 30` (`hatKinder = children.length > 0`) → `src/data/alvRechner.js:48-53, 58-66, 71-78`
- Szenario: Haushalt mit einem 27-jährigen Kind, versicherter Verdienst 6 000 → vorbelegt «Kinder: ja» → Satz 80 % statt 70 % (Taggeld ≈ 221.20 statt 193.55), Wartetage 5 statt 10, Anspruchsdauer ohne die 200er-Kappung für unter 25-Jährige ohne Kinder. Der Kommentar `alvRechner.js:46` nennt selbst «Kinder <25».
- Fix: nur Kinder < 25 zählen (Alter aus `birthDate`, siehe F10); der Schalter bleibt überschreibbar.

### F20 💡 Zahlenfelder ohne Tausendertrenner-Toleranz
- Beispiele: `src/AlvRechner.jsx:34` (`Number("6'500".replace(',', '.'))` → NaN → 0 → kein Ergebnis, kein Hinweis), `src/SozialhilfeRechner.jsx:41-54` (`Number(miete) || 0`), `src/TaxCalculator.jsx:148` (`Number(value) || 0`).
- Szenario: Eingabe «6'500» oder «6 500» (Schweizer Schreibweise) → Feld gilt als leer, Rechner zeigt nichts bzw. rechnet mit 0. Die App hat dafür schon `lies()` (`src/utils/stundenlohn.js:66-70`) und `parseSwissNumber` (`src/taxImport.js:15`) — uneinheitlich genutzt. (unbestätigt, welche dieser Felder `type="number"` sind; dort lässt der Browser «'» gar nicht zu.)

### F21 ⚠️ Pensionierung: AHV-Anmelde-Erinnerung ohne erfasstes Geschlecht für Frauen JG 1961–63 zu spät
- Route: `#/pensionierung` · `src/Pensionierung.jsx:18-26` → `src/data/lohnAbzuege.js` `referenzalterMonate` (ohne `geschlecht === 'female'` immer 65 J.)
- Szenario: Geburtsdatum 1962-03-10, Geschlecht leer → Referenzalter 65 → Erinnerung «6 Monate vorher» = 10.03.2027 − 180 Tage = 11.09.2026 — einen Tag **nach** dem tatsächlichen Referenzalter (64 J. 6 M. = 10.09.2026). Der Kommentar `:20-21` nennt dieses Risiko («bis zu 9 Monate zu spät»), schliesst es aber nur bei gesetztem Geschlecht aus.
- Zusätzlich: `r.setMonth(r.getMonth() + refMonate)` (`:23`) läuft bei Geburtstag am 29.–31. in den Folgemonat über (z. B. 31.08. + 774 Monate → 03.03. statt 28./29.02.).
- Fix: ohne Geschlecht für JG 1961–63 das früheste Referenzalter (64 J.) annehmen oder nachfragen; Monatsrechnung über `plusMonate` (utils/fristen.js).

### F22 💡 Tresor (secureStore) noch unverdrahtet — Auto-Save würde Klartext zurückschreiben
- `src/utils/secureStore.js:212-235` entfernt nach dem Verschlüsseln alle Klartext-Stores; `speichereFallsOffen` (`src/utils/autoSave.js:27-28`) schreibt aber bei jeder Änderung `or5_data`/`or5_docs` im Klartext. Heute nur DEV-Vorschau (`src/main.jsx:92, 1653-1655`), also kein Live-Fehler — beim Verdrahten muss das Auto-Save auf `persistTresor` umgestellt werden, sonst ist die Verschlüsselung nach dem ersten Tastendruck wirkungslos.

### F23 ⚠️ EL-Hinweis «möglich» auf unbelegter Faustregel
- Route: `#/sozialhilfe` (Block Ergänzungsleistungen) · `src/config/cantonalData.js:472-493`, Anzeige `src/SozialhilfeView.jsx:196-201`
- Szenario: AHV-Rente 2 400, Miete 1 500, KK 450 → `2400 < 1950 + 2000` → «EL möglich». Die Schwelle «+ 2000» hat keine Quelle; Vermögen, Lebensbedarf nach ELG Art. 10 und Kanton fehlen ganz; Lohn wird netto/brutto gemischt addiert. Umgekehrt: Rente 4 000, Miete 2 200, KK 600 → `4000 < 4800` → «möglich», obwohl Vermögen 300 000 erfasst sein kann.
- Das widerspricht der Wahrheits-Disziplin aus `CLAUDE.md` (Zahl ohne Quelle). Fachlich durch `swiss-precision-pruefer` prüfen lassen; bis dahin nur «prüfenswert, wenn AHV/IV-Rente» ohne Rechenvergleich.

## Zusammenfassung

| Schwere | Funde |
|---|---|
| 🔴 | F6 (zwei «Es bleiben»-Rechnungen), F10 (Kinderalter), F12 (Budget-Import), F13 (Beispiel/Probe → echter Stand) |
| ⚠️ | F1, F2 (Startabsturz durch importierte Daten), F4, F7, F8, F11, F14, F15, F18, F19, F21, F23 |
| 💡 | F3, F5, F9, F16, F17, F20, F22 |

Geprüft und **ohne** Befund: Escaping im Brief-HTML (`src/briefGenerator.js`, alle `${…}`-Stellen), `escapeHtml`/Druckfenster (`src/utils/helpers.js`), Fristen-Grundrechnung (`src/utils/fristen.js`: Monatsende, ungültige Daten, Lokalzeit), Verzugszins (`src/utils/verzugszins.js`), Bundessteuer-Tarif 2026 inkl. Übergang zur Flat-Rate und 5-Rp.-Rundung (`src/data/steuerRechner.js`), Jahreswechsel-Logik bei 3a/ALV (`saeule3a.js`, `alvRechner.js` mit `werteFuerStichtag`), Schuldenplan (`src/schuldenCalc.js`), Stundenlohn-Rechnung (`src/utils/stundenlohn.js`), IPV ohne Kanton (`cantonalData.js:410`, K118), Auto-Save-Kern (`src/utils/autoSave.js`) für sich.

## Was gut gemacht ist
- Datumsrechnung ist bewusst lokal und mit Ungültig-Prüfung (`leseDatum` fängt `2026-02-31` ab, `plusMonate` klemmt aufs Monatsende); Kommentare belegen frühere UTC-Fehler und deren Behebung.
- Auto-Save mit drei Auslösern plus Fremd-Tab-Sperre (K116) ist sauber getrennt und testbar (`speichereFallsOffen` als reine Funktion).
- Escaping wird an der Interpolationsstelle gemacht, mit Begründung (K97) — und CSP `script-src 'self'` als zweite Linie.
- Fachliche Konstanten tragen Quelle, Abrufdatum und Jahr; fehlende Jahre fallen nicht still auf Vorjahreswerte zurück.

## Verifikation
- Tests: nicht ausgeführt (read-only-Auftrag); Funde am Code nachvollzogen, Rechenbeispiele von Hand.
- Build: nicht ausgeführt.
- Sicherheit: XSS-Flächen (`dangerouslySetInnerHTML` — keine Treffer; `srcDoc` Brief-Vorschau; `document.write` Druckfenster; `innerHTML` nur lesend/leerend) geprüft, kein ausnutzbarer Pfad gefunden.
- Nicht abgedeckt (Zeit): ChapterView.jsx im Detail, VorsorgeRechner/AHV-Rechnung (634 Z.), Kantonssteuer-Tabellen, IPV-Kantonsmodule, kvgLeistungen, dossierGenerator, i18n-Parität.
