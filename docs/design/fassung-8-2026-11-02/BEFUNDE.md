# Fassung 8 · Rundgang und gesammelte Punkte · Befunde

Angefangen 02.11.2026 auf Entscheid von Stebler Studios («Ja, wie empfohlen»).

**Umfang:** Rundgang durch alle Seiten mit den sechs Fragen aus Fassung 7, Sozialhilfe und Dossier-PDF zuerst. Dazu die gesammelten offenen Punkte aus Fassung 7, auch #655 und #652 mit ihren Bedingungen. Vergleichsseite mit Ja/Nein/Besprechen. Gebaut wird erst nach den Entscheiden.

**Grundlage:** `0f3c72f4` (0.1.48-beta, live = main). Hinter der Code-Wand lokal aus diesem Commit im eigenen Arbeitsbaum, weil der Beta-Code nicht von Claude eingegeben wird. Öffentliche Seiten live geprüft.

Nichts davon ist gebaut. Jeder Punkt wartet auf den Entscheid von Stebler Studios.

## Entscheide

**Runde 1 (Stebler Studios, 02.11.2026, Knopf «Entscheide kopieren», Bereich Sozialhilfe):**
Ja: F8-S1, S3, S4, S5, S6, S7, G1, G3. Besprechen: F8-S2, G2. Noch nicht gebaut.

<!-- PUNKTE -->
## Sozialhilfe

Zuerst durchgegangen, weil heute dort am meisten geändert wurde. Im Browser auf Produktion, fünf Eingaben von Hand.

- **F8-S1** (fehler, Empfehlung Ja): Zwei Ergebnisse auf einer Seite. Der Rechner oben folgt den Eingaben, der Block darunter bleibt beim Profil. Mit Lohn 800 steht oben CHF 2’898, unten «Abzug: Einkommen − CHF 6’200», «CHF 0/Mt.» und «Kein Anspruch». *Vorschlag:* Der Block unten folgt dem Rechner.
- **F8-S2** (fusion, Empfehlung Besprechen): Die Bedarfsrechnung steht zweimal: als Tabelle im Rechner und als «SKOS-Bedarfsrechnung» darunter, mit denselben vier Zeilen. *Vorschlag:* Eine Rechnung. Die Erklärung zur Mietzins-Limite wandert zur Zeile Wohnkosten.
- **F8-S3** (fehler, Empfehlung Ja): «Noch eine Angabe nötig» neben «4 von 4». Gemeint sind die Mehrkosten für die Arbeit (sozialhilfeRechner.js:246), der Zähler kennt nur vier Felder (SozialhilfeRechner.jsx, angabenWerte). Die Seite sagt nicht, welche Angabe fehlt. *Vorschlag:* Der Satz nennt die Angabe, und das Feld zählt mit.
- **F8-S4** (fehler, Empfehlung Ja): Leeres Lohnfeld ergibt den vollen Bedarf als Betrag. Lohn gelöscht: «CHF 3’431 / Monat», daneben «Noch 2 Angaben nötig». Das Feld wird wie 0 gerechnet. *Vorschlag:* Solange das Einkommen leer ist, kein Betrag. Vor dem Bau durch den Fachprüfer.
- **F8-S5** (fehler, Empfehlung Ja): «Im Rechner unten lassen sie sich eintragen» (de.js:3192), der Rechner steht aber oben. *Vorschlag:* «Im Rechner oben».
- **F8-S6** (flow, Empfehlung Ja): «Nächste Schritte: Sozialdienst kontaktieren, Einkommensnachweise mitbringen» steht auch bei «Kein Anspruch». *Vorschlag:* Nur zeigen, wenn ein Betrag oder «Anspruch möglich» steht.
- **F8-S7** (sprache, Empfehlung Ja): «Haushalt: 1 Erwachsene» und «1 Person(en)» (de.js:1703, 3143, 6541). *Vorschlag:* Einzahl und Mehrzahl sauber trennen.
- **F8-G1** (offen, Empfehlung Ja): Konkubinat plus Bankguthaben: «Anspruch möglich», darunter «Kein Betrag». Aus der Einstiegsdatei, hier nicht nachgestellt. *Vorschlag:* Fachprüfer, dann ein Satz.
- **F8-G2** (offen, Empfehlung Besprechen): otherAssets mischt Bargeld, Krypto und Fahrzeug, der Kommentar nennt es Wertgegenstände. Für die SKOS zählen sie verschieden. Aus der Einstiegsdatei. *Vorschlag:* Feld trennen oder Hinweis, was gemeint ist.
- **F8-G3** (offen, Empfehlung Ja): Vermögenssatz dreimal auf der Seite, bis zehn Vorbehalte als ein Absatz (SozialhilfeRechner.jsx:213). Aus der Einstiegsdatei. *Vorschlag:* Vorbehalte als Liste, Vermögenssatz einmal.

## Dossier und Druck

Vorschau von Lebensmappe, Behörden-Dossier und Notfall-Dossier im Browser gelesen. Das PDF selbst ist nicht erzeugt: Den Druckdialog kann ich hier nicht bedienen.

- **F8-P1** (fehler, Empfehlung Ja): App-Anleitung auf dem Blatt fürs Amt. «Angeben lässt sich das im Kapitel Finanzen & Geld» steht unter «Annahmen». Das Amt kann damit nichts anfangen. *Vorschlag:* Auf dem Blatt nur «Ohne 13. Monatslohn gerechnet».
- **F8-P2** (fehler, Empfehlung Ja): Das Notfall-Dossier druckt «Patientenverfügung vorhanden? Noch nicht», im Kapitel steht dasselbe Feld auf «nicht erfasst». Niemand hat das angegeben. *Vorschlag:* Unbeantwortete Felder gar nicht drucken.
- **F8-P3** (aufbau, Empfehlung Besprechen): Die Lebensmappe verspricht «alle wichtigen Angaben», zeigt bei Notfall aber weder Blutgruppe noch Allergien noch Medikamente. Der Arbeitgeber steht dafür zweimal. *Vorschlag:* Arbeitgeber einmal. Ob Gesundheitsdaten in die Mappe gehören, ist Ihr Entscheid.
- **F8-P4** (offen, Empfehlung Ja): Das PDF und die Druckansicht sind nie geprüft worden, auch heute nicht. *Vorschlag:* Sie drucken alle drei mit Maria als PDF, ich prüfe die Dateien.
- **F8-G4** (offen, Empfehlung Ja): Summe bei Rappen 1 Franken neben gerundeten Zeilen (dossierGenerator.js:853). Aus der Einstiegsdatei. *Vorschlag:* Summe aus den gerundeten Zeilen oder Rappen überall.
- **F8-G5** (offen, Empfehlung Ja): JSON vermoegensfreibetragUnbestaetigt ohne Grund (:1093), Zeile Freibetrag ohne Basis und Stand-Jahr, fehlendes Geburtsdatum lässt 3a still weg, negatives Sparkonto neben der Summe, Feld ohne min. Aus der Einstiegsdatei. *Vorschlag:* Als ein Paket bauen.
- **F8-G6** (offen, Empfehlung Ja): saeule3aZaehlt prüft nur das Alter. SKOS D.3.3 Abs. 3 nennt auch die ganze IV-Rente, finanzen.ivRente trennt nicht ganz und Teilrente. Das Vermögen wird dann zu tief gerechnet. Aus der Einstiegsdatei. *Vorschlag:* Feld trennen, vor dem Bau Fachprüfer.

## Dashboard und Was ansteht

Der Wegweiser «Was ist jetzt dran?» und die Fristen sind der grösste inhaltliche Fund des Rundgangs: Die App kennt das Dringende und sagt es nicht.

- **F8-D1** (flow, Empfehlung Ja): Die nächste Frist fehlt im Wegweiser. Heute steht «Nächste Frist Steuerfrist · 31. März». Die Kündigung der Krankenkasse läuft am 30.11. ab, in 28 Tagen, und das Franchise-Kreuz rät Maria zu 2’500. *Vorschlag:* Im Herbst zeigt der Wegweiser die Kassenfrist, wenn die Empfehlung von der eigenen Franchise abweicht.
- **F8-D2** (flow, Empfehlung Ja): Die Arztrechnung über CHF 180 ist seit dem 30.06.2026 überfällig. Das steht nur auf «Schulden & Rechnungen» und im Tracker, nicht auf dem Dashboard. *Vorschlag:* Überfälliges zeigt der Wegweiser zuerst, ruhig formuliert.
- **F8-D3** (flow, Empfehlung Ja): «Was ansteht» führt in der Liste nur vier Erinnerungen. Steuerfrist und Kassenfrist fehlen dort, die Steuerfrist steht laut Code nur im Jahreskreis (CalendarReminders.jsx:611). *Vorschlag:* Feste Fristen in dieselbe Liste.
- **F8-D4** (aufbau, Empfehlung Besprechen): Fortschritt in fünf Massen: 7/7 begonnen, 65 % ausgefüllt, 72 %, 15/15 und die Kapitelprozente, dazu die Stufen im Obstgarten. Dort heisst «voll gereift» auch 71 %, vier Bäumchen stehen auf «kommt später». Offen seit F7-L4, S5, K2-1. *Vorschlag:* Eine Zahl für alles. Das ist der letzte offene Dashboard-Entscheid.
- **F8-D5** (sprache, Empfehlung Ja): «WERKZEUGE & FEATURES» als Titel. Sonst spricht die App nirgends von Features. *Vorschlag:* «Werkzeuge».

## Finanzen, IPV, Wohnen

Die Summen stimmen. Die Bezeichnungen laufen auseinander.

- **F8-F1** (fehler, Empfehlung Ja): Das Kapitel zeigt nicht, woraus «Übriges» besteht. CHF 676 enthalten CHF 21 Säule 3a, die in den sichtbaren Angaben fehlen. Das Budget gruppiert dieselben Ausgaben anders: Leben 535, Mobilität 120, Steuern & Vorsorge 871. *Vorschlag:* Dieselben Gruppen in Kapitel und Budget.
- **F8-F2** (fehler, Empfehlung Ja): Die Grenze steht ohne Einheit. «Einkommen über Grenze (CHF 61’090)» neben «CHF 6’200 /Mt.». Wer das liest, vergleicht Monat mit Jahr. *Vorschlag:* «CHF 61’090 pro Jahr». Vor dem Bau prüfen, auf welches Einkommen sich die Grenze bezieht.
- **F8-F3** (sprache, Empfehlung Ja): Ein Ergebnis, fünf Wörter: «Nicht berechtigt» (Rechner, Dossier), «Kein Anspruch» (Finanzen), «Voraussichtlich kein Anspruch» (Übersicht), «ergibt sich keine» (Kapitel), «Über der Grenze» (Was steht mir zu). Am 01.11. war entschieden: grobe Rechnung, kein Entscheid. *Vorschlag:* Überall «Voraussichtlich kein Anspruch». Rechtsprüfer vor dem Bau.
- **F8-F4** (sprache, Empfehlung Ja): «Miete» heisst zweierlei: CHF 1’650 auf «Was steht mir zu?», CHF 1’830 bei Mietzinsbeiträgen und im Sozialhilfe-Feld. Dort sind die Nebenkosten drin. Nicht geprüft, womit «Was steht mir zu?» rechnet. *Vorschlag:* «Wohnkosten», wo Nebenkosten drin sind.
- **F8-F5** (sprache, Empfehlung Ja): «Gesundheitskosten (KVG)» zeigt in Finanzen CHF 240, in der Versicherungs-Übersicht CHF 420. Der Untertitel erklärt es, der Titel nicht. *Vorschlag:* Finanzen: «Bezahlte Gesundheitskosten».
- **F8-V1** (flow, Empfehlung Besprechen): Der Vorsorge-Rechner bleibt für Maria leer («1 von 5»), obwohl die App ≈ CHF 6’796 brutto kennt. *Vorschlag:* Geschätztes Brutto als Vorschlag zum Übernehmen, klar als Schätzung bezeichnet.

## Arbeit, Notfall, Rahmen

Kleinere Punkte aus den übrigen Seiten.

- **F8-A1** (fusion, Empfehlung Ja): Arbeitgeber und Stellenbeginn werden in Finanzen und in Ausbildung & Arbeit getrennt erfasst. Der Punkt K-G8 ist seit Oktober offen. *Vorschlag:* Zuhause in Ausbildung & Arbeit, in Finanzen nur ein Spiegel.
- **F8-A2** (fehler, Empfehlung Ja): Der Branchenvergleich zeigt «Gesundheit ’22» neben dem Median 2024. *Vorschlag:* Prüfen, ob das BFS 2024 je Branche liefert, sonst den Jahresunterschied in Worten nennen.
- **F8-N1** (aufbau, Empfehlung Besprechen): Die Patientenverfügung steht mitten im Kapitel Notfall als eigener Block, die übrigen Vorsorge-Fragen in den Angaben, die Vorsorge-Karte zählt beide. *Vorschlag:* Ein Ort, die Vorsorge-Karte.
- **F8-R1** (sprache, Empfehlung Ja): Fachwörter ohne Erklärung: «Break-even», «KVG-Tracker», «Referenz». *Vorschlag:* Ersetzen, etwa «ab rund CHF 2’050 Kosten im Jahr lohnt sich …».
- **F8-R2** (sprache, Empfehlung Ja): Das CSV-Beispiel im Budget ist englisch und von 2024: «Rent», «Salary». *Vorschlag:* Deutsch, in der App-Sprache.
- **F8-R3** (aufbau, Empfehlung Ja): Dokumentenablage: «Ihr Ordner ist bereit.» steht zweimal hintereinander. *Vorschlag:* Einmal.
- **F8-Q1** (flow, Empfehlung Ja): Gemessen auf 375 px: Reiter «Angaben / Dokumente» 33 px hoch auf allen 7 Kapiteln, 21-mal Knöpfe 79 × 31, Begriff-Knöpfe wie IPV 29 px hoch. *Vorschlag:* Auf 44 px. Inline-Quellen im Fliesstext bleiben.

## Gesammelte Punkte

Aus der Einstiegsdatei, nicht neu erhoben.

- **F8-O1** (offen, Empfehlung Ja): #655 Sprache in Kern und Rest teilen: rund 215 auf 19 KB vor dem ersten Bild. Offen: iPhone, langsames Netz, leere Texte bei import() ohne lazyMitTexten. *Vorschlag:* Fertig prüfen, dann Merge durch Sie.
- **F8-O2** (offen, Empfehlung Ja): #652 Wiederkehr auf dem Gerät zählen. Wartet auf Juristin, Rumantsch, iPhone. *Vorschlag:* Draussen lassen, bis die drei erfüllt sind.
- **F8-O3** (offen, Empfehlung Besprechen): Rumantsch: 1’339 Stellen TODO(rm) in rm.js, gemessen heute. *Vorschlag:* Fachperson für die Gegenlese suchen.
- **F8-O4** (offen, Empfehlung Ja): a11y: VorlesenButton 1,9:1, aktive Schalter (main.jsx:252, :1122, :1148), Obstgarten 4-6 px, PraemienOrientierung.jsx:470, BottomAnchor, PrimaryButton 38 px, Fokus nach Schrittwechsel (AblaufSchale.jsx:191). *Vorschlag:* Als ein Paket, mit F8-Q1.
- **F8-O5** (offen, Empfehlung Besprechen): Stempel «September 2026» (seiten-inhalt.mjs:49), alle Abläufe sagen «geprüft im September 2026». Ändern nur nach echter Gegenlese. *Vorschlag:* Gegenlese planen, sonst stehen lassen.
- **F8-O6** (offen, Empfehlung Ja): Version weiter 0.1.48-beta, Sprung und CHANGELOG offen. *Vorschlag:* Sprung mit dem nächsten Deploy.
- **F8-O7** (offen, Empfehlung Ja): /simplify und Screenreader sind nicht gelaufen. Ob Stage und /code-review ultra liefen, ist nicht belegt. *Vorschlag:* Vor dem Deploy von Fassung 8 nachholen.
- **F8-O8** (offen, Empfehlung Ja): FEATURES.md steht auf deployed. Heute wurden 80 Seiten auf Produktion über «Ohne Code ausprobieren» geöffnet, der Weg mit Beta-Code aber nicht. *Vorschlag:* Sie öffnen die App einmal mit Code, dann verified-live.

## Gut so

- 80 Seiten auf Produktion geöffnet: keine Konsolenfehler, kein rohes undefined oder NaN im Text.
- Auf 375 px läuft keine Seite seitlich über.
- Nachgerechnet und stimmig: Versicherungen 609, Ausgaben 3’965, frei 2’235, Steuer 8’431 und netto 65’969, Reserve 4.7 Monate, Wohndauer, Anstellungsdauer.
- Die Fehler aus Fassung 7 zu Mietbarometer, Zimmerzahl, Nettoeinkommen, Dossier-Beschriftung und HF/Bachelor sind live behoben.
