# Changelog

Alle wesentlichen Änderungen an Maloja Plana werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

---

## [Unreleased]

*Hier sammelst du Zeilen während der Arbeit. Beim Release wird aus „Unreleased"
die Versionsnummer + Datum, und `package.json` wird im selben PR angehoben — so
kommt der Changelog immer mit, nie doppelt.*

## [0.1.19-beta] — 2026-07-09

### Geändert
- **Deine Instrumente** — die vier Selbstchecks stehen jetzt im ruhigen 2×2-Raster statt 3+1.
- Einheitliches Anrede-Register in den Instrumenten; „Puffer" heisst durchgehend „Reserve".

### Behoben
- Die Schutzschild-Kachel öffnet nun das Versicherungs-Kapitel statt der Basis.
- Barrierefreiheit: Tacho- und Kompass-Grafik gelten als dekorativ und werden nicht mehr doppelt vorgelesen; sand- und himmelfarbene Schrift ist im Hellmodus WCAG-AA-kontraststark.

## [0.1.18-beta] — 2026-07-09

### Wartung
- `deploy.sh` räumt alte Rollback-Sicherungen automatisch auf (behält nur die neuesten drei).
- Repo aufgeräumt: leere `prompts/`-Stubs und veralteter `BUTTONS_AUDIT` entfernt, `src/data/raw/` (nur lokale Roh-Tabellen) wird ignoriert.

## [0.1.17-beta] — 2026-07-09

### Neu
- **Deine Instrumente** — Dashboard-Spiegel der vier Selbstchecks: Franchise-Tacho (Prämien), Leistungs-Kompass (Schnellcheck), Reserve-Tankanzeige (Finanzen) und Versicherungs-Schutzschild. Jede Kachel führt in den passenden Bereich.
- **Lebens-Obstgarten** — neue, naturgetreue Gartenansicht als eigener Blick auf den Lebensordner.
- **Schnellcheck** — ruhiger Wegweiser zu lageabhängigen Leistungen.
- **Versicherungs-Schutzschild** — zwei Schilde: Pflicht (gesetzlich) und Empfohlen.

### Geändert
- Instrumente-Panel wird auf dem Dashboard lazy geladen — das Haupt-Bundle bleibt unter dem 65-KB-Budget.
- `deploy.sh`: SFTP-Passwort sonderzeichensicher (`--env-password`), und der Backup-Schritt hängt bei Verbindungsproblemen nicht mehr endlos.

## [0.1.16-beta] — 2026-07-08

### Sicherheit
- Backup-Verschlüsselung gehärtet: Version + Algorithmus werden jetzt in den GCM-Auth-Tag gebunden (AAD) und beim Öffnen explizit geprüft — ein manipuliertes oder formatfremdes Backup scheitert klar, statt still etwas Falsches zu tun. Der Schlüssel auf dem Öffnen-Pfad ist nicht mehr extrahierbar (schützt die Zero-Knowledge-Garantie auch bei kompromittiertem Client-Code).

### Behoben
- Barrierefreiheit: Status-Banner (Probier-Modus, Demo, DB-Hinweis, Frühe-Version-Hinweis) umschliessen ihre Buttons nicht mehr in der Vorlese-Region — Screenreader lesen nur noch den Status, nicht die Bedienelemente.

## [0.1.15-beta] — 2026-07-08

### Neu
- **IK-Historie auch im Zukunft-Reiter** des Vorsorge-Rechners: eine ruhige AHV-Grundlage-Karte zeigt die erfasste Beitragshistorie direkt dort, wo die Projektion sie nutzt — mit aufklappbarem Editor (dieselbe Erfassung, keine Doppel-Eingabe) und Sprung in den AHV-Reiter. Prinzip: nie zurück-navigieren müssen.

### Behoben
- **CV-Export gegen XSS abgesichert** (Feld-Inhalte werden beim Export escaped); zusätzlich Referrer-Policy gesetzt.

### Intern
- `BUGS.md` als eine ruhige Bug-Liste eingeführt (Regel: ein Bug ist erst weg, wenn ein Test ihn festhält).
- `scripts/i18n-gap-scan.mjs` misst offene Übersetzungen; `RUMANTSCH_GAP_NOTE.md` auf realen Stand gebracht.
- Verwaiste `legal.resources`-Titelschlüssel entfernt.

## [0.1.13-beta] — 2026-07-06

### Neu
- **Lebensbaum trägt Früchte**: pro Lebensbereich eine Schweizer-Frucht-Silhouette am passenden Ast, mit eigener Ast-Farbe — barrierefrei über Silhouette, Helligkeit und Wort unterscheidbar (nicht nur Farbe)
- **Bereichs-Früchte mit echtem Icon-Negativ**: das Bereichs-Symbol steht als ausgespartes Negativ auf einer soliden Frucht-Scheibe (SVG-Maske statt aufgesetztem Icon); Cluster-Früchte bündeln mehrere Bereiche
- **Arztkoffer** — ein ruhiges Zuhause für alles Gesundheitliche (Pilot-Metapher, 7 Fächer)
- **Bundesordner-Register** im Dokument-Tresor: Reiter je Bereich mit Ast-Frucht und Ast-Farbe
- **Glossar-Tooltip für Abkürzungen** (Jana-Verständlichkeit): Fachbegriffe/Abkürzungen mit Aufklapp-Pfeil erklärt, ohne den Lesefluss zu brechen

### Geändert
- **Boden-Anker fix am unteren Rand** mit Safe-Area-Berücksichtigung (iPhone-Notch/Home-Indikator); Früchte erscheinen nur noch im Baum, nicht im Anker
- **Mobile-Kopf aufgeräumt**: Einstellungen/Konto oben rechts, Footer wird zur mitscrollenden Inhalts-Fusszeile
- **Echtes Zahnrad-Symbol** für Einstellungen; „Rundgang"-Eintrag entdoppelt

### Behoben
- Boden-Anker-Labels in EN/FR/IT/RM ergänzt (waren nur auf Deutsch)

### Quellen
- Fortführung Design-Schritte 2 (Navigations-Rückgrat) und 3 (Pilot-Metapher Dokumente)

---

## [0.1.12-beta] — 2026-07-06

### Neu
- **Lebenszustände-Ebene vollständig (alle 11 Zustände live)**: neu „Pensioniert / im AHV-Alter", „Ohne Arbeit / zwischen Stellen", „Verschuldet oder in Betreibung", „(Halb-)Waise" — proaktive Situationen, die versteckte Berechtigungen aufdecken (`#/situationen`)
- **Ablauf-Anreicherung mit Nordstern-Brücken**: alle 8 dünnen Abläufe (Trennung, Kind, Todesfall, Heirat, Betreibung, Pensionierung, Selbständigkeit, Bewilligung) binden jetzt an einen Lebenszustand an — Ereignis ↔ Zustand durchgängig vernetzt
- **Ereignis→Zustand-Rückwege**: „Ohne Arbeit" → RAV-Anmeldefrist, „Pensioniert" → Pensionierungs-Ablauf
- **Regionale Vergünstigungen bei tiefem Einkommen** (Braindump #26): KulturLegi (Caritas) für **alle Kantone** web-verifiziert (deutschsprachig `kulturlegi.ch/<region>`, französischsprachig CarteCulture) + kuratierte Zusatz-Angebote für Basel (Familienpass, Volkszahnklinik, Volkshochschule); Block auf 8 einkommens-nahen Lebenszuständen, kanton-bewusst (has/none/check)
- **IPV**: Orientierung „Anspruch & Aufenthaltsbewilligung" (auch Ausweis L kann berechtigen), Brücke aus dem Bewilligungs-Ablauf zur IPV-Box, „Unterlagen für den Antrag merken" (Merkliste)
- **Anspruchs-Matrix** im Dashboard: leiser positiver Hinweis „Anspruch möglich" (Sozialhilfe/IPV), streng gegated, nur positiv
- **Notruf-Vorlesekarte** mit opt-in Standort (Geolocation nur on demand, nie gespeichert)
- **Mehrfach-Einträge** für Budget-Posten (z. B. Internet & Telefon einzeln auflisten)
- **Kalender-Vorlage** „Medikamente nachbestellen / Rezept erneuern"
- **Ruhige Berg-Ladeanimation** (CalmLoader) als sanft atmende Granit-Silhouette beim Nachladen

### Geändert
- **Kohärenz-Audit abgeschlossen**: Steuernummer, Krankentaggeld und Einkommensart werden jetzt in den Spiegelkarten angezeigt; Einkommensart (netto/brutto) steuert die Prefills von ALV (brutto) und Sozialhilfe (netto) korrekt
- **Bundle deutlich schlanker**: Kern-/Sekundär-Views ausgelagert → Haupt-Chunk −32 % (73,9 → 50,0 kB gzip); Navigation zu nachgeladenen Views robust (startTransition)
- **App-Version** wird jetzt aus einer einzigen Quelle (`package.json`) gelesen — kein Drift mehr zwischen Footer und Paket
- Auto-Backup sichert jetzt auch Merkliste und Notfall-Kontakte

### Behoben
- IPV-Schnellcheck-Hinweis wurde ohne gesetzten Kanton doppelt angezeigt
- FR/IT-Formulierungen bei Todesfall/Hilflosenentschädigung natürlicher

### Quellen
- KulturLegi/CarteCulture (Caritas) — regionale Verzeichnisse je Kanton (2026 web-verifiziert) · SVA Zürich / Kanton Basel-Stadt (IPV-Anspruch) · SKOS (Existenzminimum)

---

## [0.1.11-beta] — 2026-06-30

### Neu
- **Franchise mit/ohne Unfall einzeln wählbar**: in der Referenzprämien-Tabelle wählt ein Klick auf den Mit- oder Ohne-Preis die Franchise und die Unfall-Variante zusammen
- **Franchise-Wechsel: wie oft?**: der Franchise-Optimierer zeigt jetzt, dass die Franchise einmal pro Jahr änderbar ist — wirksam auf den 1. Januar, Anmeldung bis Ende November (Kassenwechsel: 30. November), belegt mit KVG Art. 7 und KVV Art. 94

### Quellen
- KVG Art. 7 (Versichererwechsel) · KVV Art. 94 (Wahlfranchisen) — fedlex

---

## [0.1.10-beta] — 2026-06-30

Krankenkasse: Unfalldeckung mit/ohne transparent, Wunschkasse genauer wählbar
und eine belegte Antwort auf „lohnt sich eine höhere Franchise?". Plus app-weit
präzisere Quellen-Links.

### Neu
- **UVG mit/ohne Unfall**: als Angestellte:r bist du über den Arbeitgeber unfallversichert — ein ruhiger Hinweis zeigt, dass du die Unfalldeckung bei der Kasse abwählen kannst, und ein Umschalter zeigt die konkrete Prämien-Differenz
- **Zwei Referenzspalten (mit/ohne Unfall)** in Franchise-Tabelle und Kassenvergleich
- **Wunschkasse mit/ohne**: im Kassenvergleich die gewünschte Variante per Klick auf den Preis wählen
- **Franchise umwählbar**: Franchise direkt anklicken oder im Kassenvergleich auswählen — Tabelle und Vergleich rechnen darauf
- **Franchise-Optimierer**: Prämien-Ersparnis pro Jahr, die Reserve, die man tragen können sollte (Franchise + max. Selbstbehalt), und bis zu welchen Gesundheitskosten sich die höhere Franchise lohnt (KVG Art. 64)
- **Aufklappbare Kassen-Detailansicht** als richtige Tabelle (Franchise / Mit / Ohne)

### Verbessert
- **Quellen-Links aufs Wort**: Quellen verlinken jetzt das Wort selbst (BAG, WHO, SKOS …) statt einer zweiten, lärmenden Domain — und Gesetzesartikel führen auf die amtliche Fassung (fedlex, sprachrichtig)

### Quellen
- BAG priminfo.admin.ch (Prämien je Tarif/Franchise) · KVG Art. 64 / KLV (Selbstbehalt) · WHO/UNO SDG 3.8.2 · SKOS · fedlex (Gesetzesartikel)

---

## [0.1.9-beta] — 2026-06-30

Sichtbare Fairness: die Krankenkassen-Prämie und die Miete der eigenen Region
gegen den Schweizer Schnitt — und was die Prämienverbilligung wirklich ausmacht.

### Neu
- **Regional-Barometer Krankenkasse**: zeigt ruhig, wie die Durchschnittsprämie deiner Region zum Schweizer Schnitt steht (BAG 2026) — mit deiner eigenen Prämie als Punkt „wo wir sind". In Prämien-Orientierung und Monatsbudget
- **Regional-Barometer Miete**: deine Region gegen den Schweizer Schnitt, abgestimmt auf die Wohnungsgrösse (BFS) — mit deiner Miete als Punkt, im Budget
- **Prämienverbilligung sichtbar**: die KK-Last-Karte zeigt, was die IPV abnimmt und wie viel bis zum 10%-Richtwert noch fehlt
- **Mietzinsbeiträge-Hinweis**: ob es in deinem Kanton Mietzinsbeiträge gibt — würdevoll, ohne falsche Zusage (BWO)
- **Herzensempfehlungen**: Winterhilfe Schweiz und Stiftung Rheinleben (neue Gruppe „Soziale Unterstützung")

### Verbessert
- **PLZ nur einmal eingeben**: eine in der Prämien-Orientierung eingegebene PLZ fliesst ins Wohnen-Kapitel zurück und leitet Kanton, IPV und Miet-Vergleich ab

### Quellen
- BAG mittlere Prämie 2026 · BFS Mietpreise nach Kanton/Zimmerzahl · BWO Kantonale Hilfen

---

## [0.1.8-beta] — 2026-06-30

Belegbare Haushalts-Budget-Richtwerte (BFS) mit Teuerungs-Gap, abgestimmt auf
die Haushaltsgrösse — ruhig einklappbar. Und der Lebensbaum wird anklickbar.

### Neu
- **Budget-Richtwerte pro Kategorie (BFS)**: Zu Wohnen, Mobilität, Lebensmitteln, Kommunikation, Steuern und Krankenkasse zeigt das Monatsbudget ruhig, was ein vergleichbarer Haushalt im Schnitt ausgibt — als Orientierung, nie als Wertung
- **Nach Haushaltsgrösse abgestimmt**: die Richtwerte passen sich an (Einzelperson, Paar, Familie …) — die Spanne ist gross (z. B. Lebensmittel von ~390 bis ~970)
- **Teuerung pro Kategorie**: wie stark die Preise seit 2020 gestiegen sind, im Vergleich zur allgemeinen Teuerung — sichtbar wird, dass Wohnen & Energie am stärksten steigt
- **Alles ruhig einklappbar**: Richtwerte, Teuerung und der SKOS-Block sind standardmässig eingeklappt — ein Schalter blendet alles ein, oder pro Kategorie einzeln
- **Sozialhilfe-Anspruch im Blick**: liegt das Einkommen über dem, was die Sozialhilfe decken würde, erscheint das ruhig ausgegraut — Orientierung, keine Bewertung
- **Lebensbaum anklickbar**: die Blätter im Dashboard-Baum führen jetzt direkt zur passenden Ansicht (Budget, Steuern, IPV, Sozialhilfe, Notfall …)

### Quellen
- BFS Haushaltsbudgeterhebung (HABE) 2023 / nach Haushaltstyp 2020–2021
- BFS Landesindex der Konsumentenpreise (LIK)

---

## [0.1.7-beta] — 2026-06-29

Briefe nach Schweizer Norm mit Auto-Feldern, ein mitdenkender Gesundheits-Kalender
und die KK-Last im Verhältnis zum Einkommen (WHO-Richtwert).

### Neu
- **Schweizer Geschäftsbrief-Norm** in allen Brief-Vorlagen: Empfängeradresse rechts (fürs Sichtfenster), Absender als Briefkopf, Betreff fett
- **Policennummer-Feld** bei den Versicherungen — fliesst automatisch in den KK-Kündigungsbrief
- **KK-Reklamationsbrief mit Beleg-Auswahl**: strittige Belege ankreuzen, Datum + Betrag werden automatisch in den Brief übernommen (Differenz bleibt Selbst-Eintrag)
- **Gesundheits-Kalender mit Deckungs-Orientierung**: die Vorlagen (Arzt, Zahnarzt, Gynäkologie, Impfungen) zeigen ruhig und sachlich, was die Grundversicherung übernimmt — ohne medizinische Empfehlungen
- **„Letzter Besuch" → nächster Termin**: beim Gesundheits-Termin den letzten Besuch eintragen, der nächste wird berechnet (egal wann im Jahr man startet)
- Optionaler **„dieses Jahr gedeckt?"-Marker** pro Gesundheits-Termin
- **KK-Last-Orientierung**: die Grundversicherungs-Prämie als Anteil des Einkommens, gegen den WHO-Richtwert von 10% (in Prämien-Orientierung und Finanz-Übersicht)

---

## [0.1.6-beta] — 2026-06-29

KK-Kosten-Tracker (Belege, Franchise/Selbstbehalt), durchgängige Crosslinks
(„nie zweimal eingeben") und ein Kohärenz-Audit der erfassten Angaben.

### Neu
- **KK-Verbrauchs-Tracker / Beleg-Liste**: Arztrechnungen einzeln erfassen (Datum, Betrag, optional aus Taxpunkten berechnet), **Jahres-Auflistung mit Jahr-Umschalter** (auch frühere Jahre), Franchise-/Selbstbehalt-Standort in Klartext (drei Zonen)
- **Beleg-Status**: bezahlt/offen mit **Zahlungsfrist** + Ein-Klick „im Kalender erinnern"; **„bei KK eingereicht"-Marker**; **gedeckt/nicht-gedeckt-Anteil** getrennt (nur der gedeckte Teil zählt auf die Franchise)
- **Gesundheitskosten in der Finanz-Übersicht**: bezahlte Belege fliessen als Crosslink in die Finanzen (mit „noch offen"-Hinweis), auch in der Druck-/PDF-Übersicht
- **KK-Reklamationsbrief** als neue Brief-Vorlage (falls die Kasse eine Leistung nicht oder falsch angerechnet hat)
- **Pronomen + weitere bisher ungenutzte Angaben** in den Spiegelkarten sichtbar; **Gender → Pronomen-Vorschlag** (überschreibbar, politisch neutral)
- Hinweis: Belege bis zu **5 Jahre rückwirkend** bei der KK einreichbar

### Verbessert
- **„Nie zweimal eingeben"**: ALV- und Sozialhilfe-Rechner befüllen Lohn/Miete/KK-Prämie/Einkommen aus den bereits erfassten Angaben vor
- Brief-Vorlagen: Empfänger ist direkt die hinterlegte Krankenkasse; Signatur unten nur noch der Name (Adresse nicht mehr doppelt)

### Behoben
- Spiegelkarten zeigten bei reinen Text-/Währungsfeldern rohe i18n-Keys statt der Beschriftung (neuer `fieldLabel`-Helfer)

---

## [0.1.5-beta] — 2026-06-29

Geführte Lebensereignis-Abläufe und das UX-Playbook. Schwerpunkt: zusammenhängende
Wege statt isolierter Werkzeuge (Maloja verwaltet Zusammenhänge, nicht nur Informationen).

### Neu
- **Wiederverwendbare Ablauf-Schale** und sechs geführte Abläufe: Krankenkasse wechseln, Zusatzversicherung kündigen, **Umzug**, **Unfall oder Krankheit — was tun?**, **Neuer Job**, **Stelle verloren / RAV** — ruhige Orientierung mit Crosslinks, Fristen in den Kalender und Verkettung untereinander
- **Notrufnummern** (144/1414/145/112) als anrufbare `tel:`-Links im Unfall-/Krankheit-Ablauf
- **Loop-Closure Brief → Scan → Ablage**: nach dem Brief-Erstellen ruhiger Weg in den Dokumenten-Tresor (vorgefiltert aufs passende Kapitel)
- **UX-Playbook** (`docs/UX_PLAYBOOK.md`) als „Grundgesetz" + App-Teardowns (Budgetberatung, BlueBudget, Coople)
- **Persona-Walkthrough** (qualitativer Journey-Test der 8 Personas)

### Behoben
- BriefGenerator nutzte undefiniertes `palette.accent` → Druck-Button im Hellmodus unsichtbar; auf Palette-Konventionen umgestellt (Theme-sicher)
- KVG-Kündigungsbrief: Kassenname füllt korrekt (kkInsurer); Frist-Tag zählt; Speicher-Bestätigung nur bei Erfolg
- KTG-Hinweis konkretisiert (steht meist auf dem Lohnausweis)

---

## [0.1.4-beta] — 2026-06-28

Sammelrelease der Korrekturen aus dem 6-Domänen-Audit (Architektur, Schweizer Berechnungen, Design, Barrierefreiheit, Mehrsprachigkeit, Governance).

### Behoben
- **13. AHV-Rente**: Jahresrente rechnet ab 2026 mit ×13 statt ×12
- **SKOS-Vermögensfreibetrag** vereinheitlicht und auf Stand 2026 (6'000 Alleinstehende / 12'000 Paare / +3'000 pro Kind) — zuvor zwei widersprüchliche Werte
- **Prämienverbilligung im Dashboard-Schnellcheck** nutzt jetzt den kantonalen Rechner — keine abweichende Pauschalzahl mehr
- **Datenverlust-Schutz**: Autosave fängt vollen Speicher ab, Datei-Uploads sind grössenbegrenzt
- **Vertiefte Links** zu Einstellungen, Steuer-Import und Rechtlichem überstehen Neuladen und Teilen
- Korrekte Domain `malojaplana.ch` in Finanz-Ausdruck und PDF-Fuss
- Zwei fehlende Übersetzungstexte ergänzt (Generika-Hinweis, AHV-Feld im Kassen-Scanner)

### Geändert
- **Schulden-Abbau-Plan** ruhiger und barrierearm: klare Überschriften, Tab-Rollen, beschriftete Felder, wertungsfreier Status
- **Vorlesen** jetzt auch auf Schulden, Sozialhilfe, Asyl, Finanz-Übersicht, Stipendien, Prämienverbilligung und Flyer; Vorlese-Beschriftung in allen Sprachen
- Überfällig-Hinweis und Armuts-Einordnung optisch beruhigt
- Junge Erwachsene (19–25) bei der Prämienverbilligung als eigene Kategorie ausgewiesen

### Technisch
- `@capacitor/cli` in die Entwicklungs-Abhängigkeiten verschoben (Laufzeit bleibt abhängigkeitsfrei)
- Radius-Token zwischen JS und CSS synchronisiert
- Ereignis-Bus mit Ringpuffer und Fehler-Isolation gehärtet

---

## [0.1.3-beta] — 2026-06-28

### Hinzugefügt
- **Schulden-Abbau-Plan**: Konsequenz-Priorität nach Schweizer Beratungs-Praxis (existenzsichernd → amtlich → übrige nach Lawine/Schneeball) + wertungsfreie Beratungs-Box (0800 708 708)
- **Einfache Ansicht** ausgebaut: Kapitel-Karten icon-forward (nur Symbol + Titel) und grössere, kontrastreiche Formularfelder; Vorlesen pro Feld
- **Lebenslauf**: alle Anstellungen (Mehrfach-Jobs) erscheinen in Vorschau, HTML und JSON/ATS
- **Pilot-Einladung / One-Pager** (docs/proof-of-concept.md)

### Behoben
- Lebenslauf zeigte bisher nur den aktuellen Job, nicht die weiteren Anstellungen

---

## [0.1.2-beta] — 2026-06-28

### Hinzugefügt
- **Einstellungen-Bereich**: zentrale Seite, bündelt Anzeige/Sprache/Anrede u.a. — „jederzeit änderbar", mit Schnellzugriff Daten bearbeiten/sichern
- **Erwachsene im Haushalt**: einzeln hinzufügen wie Kinder (Vorname + Beziehung)
- **Schwarzweiss-/Ruhe-Modus**: entsättigte, reizarme Ansicht (dumbphone-nah)
- **Maschinenlesbarer Lebenslauf**: JSON-Resume-Export (ATS) im CV-Generator
- **Einfache Ansicht (Inkrement 1)**: Icon-Dashboard + automatisches Vorlesen; Umschalter in Menü, BetaGate und Onboarding
- **Sonne/Mond-Icons** am Hell/Dunkel-Schalter
- **Foodshiner** als Herzensempfehlung

### Geändert
- **Sprachauswahl**: eingeklappt kompaktes Kürzel (DE/EN/FR/IT/RM), aufgeklappt volle native Namen

### Behoben
- **Kanton-Crosslink** im Steuer-Brief: las `wohnen.canton` statt `basis.canton` → der Brief erhält jetzt den tatsächlich gesetzten Kanton

---

## [0.1.1-beta] — 2026-06-28

### Hinzugefügt
- **In-App-Suche**: Tools und Kapitel direkt finden
- **Merkliste**: persönliche To-Do-Liste mit Deeplinks zu Rechnern/Kapiteln (im verschlüsselten Backup enthalten)
- **Probier-Modus (Sandbox)**: Szenarien neben dem eigenen Stand durchrechnen, „leer starten", prominenter Einstieg auf Rechner-Seiten
- **PLZ-Vorschlags-Dropdown**: lokale, barrierearme PLZ→Ort/Kanton-Autofüllung im Wohnen-Feld
- **Vermögen & Wertschriften**: neue Sektion im Finanzen-Kapitel, gespiegelt in Finanz-Übersicht und Behörden-Dossier (Preview/Druck/JSON)
- **Steuerdatei-Import**: Eckwerte aus der Steuererklärung übernehmen
- **Sozialhilfe: Vermögensfreibetrag-Orientierung** (SKOS C.7)
- **Green-Hosting-Hinweis** im Footer (verifiziert via Green Web Foundation)

### Geändert
- **Finanz-Daten auf Stand 1.1.2026 (quellenverifiziert)**: AHV-/BVG-Werte (Min-/Max-Rente, Ehepaar-Plafond, Koordinationsabzug, Eintrittsschwelle, Grenzbeträge), Säule-3a-Höchstabzüge und SKOS-Grundbedarf aktualisiert. Direkte Bundessteuer auf den amtlichen ESTV-Tarif 2026 umgestellt (Stufen + Abzüge) — die Berechnung deckt sich nun aufs Rappen mit der ESTV-Tariftabelle. Quellen: BSV, ESTV/EFD (kalte Progression), SKOS.
- **Mehrsprachigkeit**: DE/FR/IT/RM auf volle EN-Parität (asyl, flyer, Suche, Merkliste, Vorsorge-international u. a.)
- **Akzentfarbe** als CSS-Token `--mp-accent`

### Behoben
- **PLZ-Kanton-Autofüllung** nur noch aus präziser Datenbank — der Range-Fallback lieferte bei ~18 % der Grenz-PLZ falsche, „klebende" Kantone
- **SKOS-Doppelquelle**: `cantonalData.js` und `sozialhilfeRechner.js` zeigten widersprüchliche Grundbedarfs-Werte (1'031 vs. 1'061) im selben View; vereinheitlicht + Konsistenz-Test
- **PLZ-Performance/Robustheit**: 165 kB eager im Initial-Bundle → dynamisch; verlorene Validierung; Blur-Timer-Leak
- Diverse i18n-Lücken, die auf EN zurückfielen

### Tests & Infrastruktur
- **Test-Guards** gegen Drift: i18n-Key-/Platzhalter-/Anrede-Parität, `createT`-Kern, Finanz-/Sozialhilfe-/IPV-/EL-Logik (~186 → 314+ Tests)
- **Schriftlizenzen**: SIL OFL 1.1 Texte zu den WOFF2 gelegt
- **Deploy**: lokales SFTP-Script zu Infomaniak; CI-Auto-Deploy pausiert (Infomaniak blockt CI-Runner-IPs)

---

## [0.1.0-beta] — 2026-06-23

### Hinzugefügt
- **Wartungs-Infrastruktur**: Automatische Quartals-Erinnerungen via GitHub Actions, Wartungskalender, Claude-Wartungs-Prompts
- **Ticketing**: GitHub Issue Templates (Bug, Feature, Wartung)
- **Changelog**: Dieses Dokument

### Geändert
- Version von `0.1.0-alpha` auf `0.1.0-beta` aktualisiert

---

## [0.1.0-alpha.8] — 2026-06-23

### Hinzugefügt
- **Print-Stylesheet**: Sauberes A4-Layout, Footer/Header ausgeblendet
- **Unicode-Fix**: `font-variant-emoji: text` verhindert Emoji-Rendering auf Android
- **CTA-Bereinigung**: Doppelter Demo-Button auf Dashboard entfernt

### Geändert
- `known-issues-beta.md` komplett überarbeitet (28 erledigte Verbesserungen dokumentiert)

---

## [0.1.0-alpha.7] — 2026-06-23

### Hinzugefügt
- **Bundle-Splitting**: PLZ- und Prämien-Daten als separate Chunks (247KB → 124KB)
- **Error Boundaries**: Per-View Fehlerbehandlung (App crasht nicht komplett)
- **A11y**: Skip-Link, focus-visible, ARIA-Labels, Logo als Keyboard-Link
- **Rätoromanisch 100%**: 2000+ Keys, volle DE-Parität

### Geändert
- PraemienOrientierung-Chunk von 247KB auf 124KB reduziert

---

## [0.1.0-alpha.6] — 2026-06-22

### Hinzugefügt
- **Trust-Panel**: Aufklappbare Datenschutz-Erklärung im Footer (5 Sprachen)
- **PWA**: manifest.id für stabiles Install-Tracking
- **SEO**: canonical, Schema.org, OG/Twitter Cards, SafeSearch-Rating
- **Ressourcen**: Threema, SecureSafe, IncaMail, Beratungsstellen, Petitionen
- **KVG-Leistungen**: Franchise-Tracker und Rechnungserklärung
- **Feature-Walkthrough**: Alle 15 Views systematisch verifiziert

---

## [0.1.0-alpha.5] — 2026-06-21

### Hinzugefügt
- **Finanz-Übersicht**: Kompaktansicht aller Rechner-Ergebnisse + BFS-Branchenvergleich
- **Cross-Links**: Steuer-, IPV-, Sozialhilfe-, Vorsorge-Rechner verlinken zueinander
- **Dashboard-Snippets**: Versicherungen, Behörden, Notfall, Finanzen
- **Behörden-Checkliste**: Interaktive Checkliste (localStorage-persistent, 5 Sprachen)
- **Demo-Einstieg**: Prominente Demo-Card für Erstnutzer
- **Dropdown-UX**: Custom Chevron + appearance:none für alle Selects

---

## [0.1.0-alpha.4] — 2026-06-20

### Hinzugefügt
- **Fortschrittskarte**: Status-Label über Berglandschaft + Kapitel-Labels
- **Rätoromanisch**: 5. Sprache (Grundausstattung)
- **3a-Guthaben-Feld**: Eigenes Eingabefeld für Säule-3a-Stand
- **Sozialhilfe**: Rückzahlungs-Info + Disclaimer visuell hervorgehoben

---

## [0.1.0-alpha.3] — 2026-06-19

### Hinzugefügt
- **Kantonale Links**: Direkt-Links zu allen 26 Kantonen
- **Behörden-Dossier**: JSON-Export für Sozialamt-Termine
- **Backup-Versionierung**: Automatische Versionierung bei Export

---

## [0.1.0-alpha.2] — 2026-06-18

### Hinzugefügt
- **Design-Asymmetrie**: Layout-Verfeinerungen (A-030 Audit)
- **17 kaputte Links gefixt**: Kantonal + federal
- **SW-Cache v7**: Service Worker Cache-Invalidierung

---

## [0.1.0-alpha.1] — 2026-06

### Hinzugefügt
- **Phase 5 komplett**: Encrypted Backup (AES-256-GCM), Data Validation, Print CSS
- **Phase 4 komplett**: Alle 7 Kapitel, Rechner (Steuer, IPV, Sozialhilfe, Vorsorge, EO, Budget)
- **Phase 3 komplett**: i18n (DE/EN/FR/IT), Datenimport, Migration
- **Phase 2 komplett**: Dashboard, Navigation, Theme Toggle
- **Phase 1 komplett**: Grundstruktur, BetaGate, localStorage
