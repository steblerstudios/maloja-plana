> Kopie ins Repo am 20.11.2026 (Stebler Studios: «festhalten»). Arbeitsblatt: `_werkbank/FINANZEN-BAUPLAN-2026-11-20.md`. Skizzen daneben.

# Finanzen nach Bauplan · wie Wohnen · Vorschlag zum Besprechen · 20.11.2026

*Anlass Stebler Studios 20.11.: «zuerst überlegen, welches Design, weil wir eigentlich den 5 [= Fünfliber, so verstanden]
lieber haben und gleich wie Wohnen an das Ganze gehen wollten … dann schauen, was am Schluss mehr Sinn macht».
Grundlage: Wohnen-Bauplan (`stebler-studios/analysen/2026-11-18-wohnen-logik-bauplan.md`, PR #895), Matrix
(`2026-11-10-instrumente-matrix-konzept.md`), Register (`docs/brand/instrumente-register.json`), Icon-Besprechung 06.11.
Der laufende Entwurf `feat/finanzen-folgt-ruhig` ist ein **Zwischenstand**, kein Endbild. Nichts entschieden.*

## Was der Wohnen-Bauplan festlegt (gilt für alle Bereiche)

1. **Höchstens vier Fragen** je Bereich. Je Frage: eine Rechnung, **ein Bild**, eine Hauptzahl, Orte 64 / 128 / 256.
2. **Kapitelseite fester Aufbau:** je Frage «Bild gross → Zahl → Satz → Weg». **Jedes Bild einmal je Seite.** Extras unter «Mehr dazu».
3. **Bild aus dem Bereich** (Wohnen: Häuser, eine Strasse, Tür = Fass). Gemeinsame Marken (Strich, Punkt, Fahne) bleiben gleich.
4. **Code je Bereich:** `src/bereiche/finanzen/` mit `rechnung.js` · `bilder.jsx` · `zuhause.jsx` · Eingang `finanzen.js`.
5. **Basis:** gestapelt auf `integration/instrumente-auf-main` (alle 22 Instrumente-PRs + main), nicht auf `main`.

## Finanzen: die Fragen

| | Frage | Rechnung (gibt es) | Bild heute | Bild offen / Vorschlag | Zuhause |
|---|---|---|---|---|---|
| **A** | Was bleibt jeden Monat? | `ringDaten` / `monatsAusgaben` | Monatsring | bleibt (Diagramm, ist schon das Herz) | Finanzen |
| **B** | Wo steht mein Lohn? | `lohnBandState` | Lohn-Barometer | bleibt; **Zuhause offen** (s. u.) | Finanzen *oder* Arbeit |
| **C** | Wie viel Steuer? | `steuernFuerProfil` | Säule (trägt 2 Bedeutungen, B-F4) | **Fünfliber-Bild**: Skizze A «Steuerfranken» (Empfehlung seit 11.11., wartet auf Wahl) — der Franken geteilt Bund · Kanton+Gemeinde | Finanzen |
| **D** | Wie lange reicht der Notgroschen? | `reserveTankState` | Tank (#827, entschieden) | bleibt | Finanzen |

Daneben **Sozialhilfe** (seit 06.11. Kapitel Finanzen, Glas/Pegel) — wäre eine fünfte Frage. Vorschlag: unter «Mehr dazu»
bzw. «Weitere Ansprüche», wie heute, damit es bei vier bleibt.

**Spiegel** (Zuhause anderswo, im Kapitel nur als Weg): Prämienverbilligung, Krankenkasse/KK-Last (Bild offen: «zehn Fünfliber»,
Versicherungen), Steuerfrist (Kalenderblatt, Behörden), Gesundheitskosten (Gesundheit).

## Die Szene (wie die Strasse bei Wohnen) — zum Besprechen

Wohnen hat eine Strasse, in der jedes Bild einmal steht. Für Finanzen drei Wege:

- **S1 · Fläche aus Kacheln** (heutiger Entwurf): Lohn breit oben, Steuer + Tank daneben, Spiegel darunter. Funktioniert, ist aber
  noch keine «Szene» und die Bilder kommen aus verschiedenen Familien (Säule, Tachometer, Barometer).
- **S2 · Der Monatsring als Szene:** Der Ring ist das Einkommen; Lohn, Steuer und Notgroschen hängen sichtbar an ihm
  (Lohn = was hineinkommt, Steuer = ein Stück davon, Notgroschen = was sich ansammelt). Ein Bild, aus dem alles folgt.
- **S3 · Fünfliber als Sprache von Finanzen:** alle Finanzen-Bilder aus Münzen — Steuerfranken (C), «zehn Fünfliber» für die
  KK-Last (Spiegel), Notgroschen als Münzstapel/Tank. Am nächsten an «den 5 lieber haben», aber: der Tank ist entschieden
  (#827), ein Münzstapel würde ihn ersetzen.

## Lohn: wo zu Hause?

Hängt an der Szene. Bei S2 gehört der Lohn zwingend nach Finanzen (er ist der Anfang des Rings). Bei S1/S3 sind beide möglich;
Empfehlung weiter Finanzen (dort wird er eingetragen, Mindestlohn-Check bleibt auch dort), Arbeit zeigt eine Spiegel-Kachel.

## Reihenfolge-Vorschlag

1. Szene wählen (S1 · S2 · S3) — mit Skizzen, bevor Code entsteht.
2. Steuer-Bild wählen (A Steuerfranken · B zwei Häuser · C zwölf Lohntüten).
3. Lohn-Zuhause festhalten (folgt meist aus 1).
4. Bauen auf `integration/instrumente-auf-main`, Ordner `src/bereiche/finanzen/`, Wächter `bauplanFinanzen.test.js`.
   Den Entwurf `feat/finanzen-folgt-ruhig` dafür neu aufsetzen (Teile übernehmen: Spiegel-Kacheln, «Mehr dazu», Notgroschen 1×).

⟨20.11.2026: **Skizzen S1–S3** auf Zuruf («Ja, Skizzen zeigen») — `_werkbank/entwuerfe/finanzen-szenen.html` (Zahlen Maria,
hell/dunkel). Hinweis zur Skizze S2: das goldene Ring-Stück ist heute «Steuern & Vorsorge» (871 aus dem Budget), die
Beschriftung «≈ 703/Mt.» ist die Steuer-Schätzung — beim Bauen müsste der Ring die Steuer als eigenes Stück führen.
Wartet auf die Wahl.⟩

⟨20.11.2026: **Mischung S2 + S3** auf Zuruf («omg wie cool … Mischung aus S2 und S3, Fieberthermometer eingebaut, also die
Instrumente der anderen Orte … Lohn-Barometer im Münzstil?» · nachgereicht «die Miete soll das Mini-Haus haben»):
`_werkbank/entwuerfe/finanzen-mischung.html`. Szene: Lohn als **Münzleiste** (vier Zonen à vier Fünfliber, gefüllt bis zum Lohn,
Median dazwischen) → fliesst in den **Monatsring**; am grünen Stück das **Mini-Drittel-Haus** (Miete 1'830, 30 %, Weg Wohnen),
am goldenen Stück der **Steuerfranken** (grau = Bund); «bleiben 2'235» → **Notgroschen als Münzstapel** (je Stapel ein Monat,
Strich bei 3). «Spielt mit» je in eigenem Bild: Kalenderblatt (Behörden), Glas (IPV), zehn Fünfliber (KK), Fieberthermometer
(Franchise). Offen: Münzstapel ersetzt den Tank (#827) oder Tank bleibt · Glas oder Beleg für IPV · «zehn Fünfliber» wählen ·
Ring braucht die Steuer als eigenes Stück · Versicherungs-Stück im Ring könnte ebenso sein Bild tragen (Netz-Schild).⟩

⟨20.11.2026, Stebler Studios: «der Tank gefällt mir grundsätzlich richtig, aber vielleicht in ein **Sparschwein** umwandeln und
den **Tacho dann woanders** verwenden … die aktuelle **Münz-Situation** im Kopf behalten … wir sind auf jeden Fall auf dem
richtigen Weg». → Skizze nachgeführt: Notgroschen = **Sparschwein** (Tank-Gedanke bleibt: Gefäss füllt sich, Marke «empfohlen 3»,
voll bei 6 Monaten; gefüllt mit Fünflibern, Schlitz oben, eine Münze fällt aus «bleiben» hinein).
**Stand der Richtung:** Ring als Szene · Münzsprache für Finanzen · Instrumente der anderen Orte am Rand · Miete mit Mini-Haus ·
Steuerfranken · Sparschwein. **Im Kopf behalten:** Münzstapel (je Stapel ein Monat). **Offen:** wo der Tacho neu hinkommt
(gesucht: eine Frage «Stand zwischen aufbauen und tragfähig, mit Empfehlungsmarke»), IPV Glas/Beleg, zehn Fünfliber KK,
Lohn-Zuhause (bei der Ring-Szene: Finanzen), Steuer als eigenes Ring-Stück, Versicherungs-Stück mit Netz-Schild?
Noch nichts davon gebaut; der App-Entwurf `feat/finanzen-folgt-ruhig` bleibt Zwischenstand.⟩

⟨20.11.2026, Bildfragen (Auswahl-Dialog): **Tacho** «noch offen lassen» · **IPV** «nein, der IPV soll bei der Krankenkasse in die
Logik» → steht in der Skizze beim Versicherungs-Stück, nicht mehr am Rand · **Mietzinsverbilligung** «als Tür … und Pfeil unter
oder über Grenze» → Tür = Fass am Mini-Haus mit Pfeil (Maria/ZH: in der App schlichte Tür, kein Programm mit Zahl) ·
**KK-Last** Rückfrage «was haben wir uns in Gesundheit/Versicherung überlegt?» → Befund: Thermometer nur Franchise (11.11., ein
Bild eine Bedeutung); KK-Last: Barometer 10-%-Marke empfohlen, «zehn Fünfliber» skizziert, **nichts gewählt**; Versicherungen hat
noch keinen Bauplan · **Ring-Stücke** «Ja, jedes Stück» → Versicherungen trägt das Netz-Schild klein (Zahl der Teile weggelassen,
nicht an Maria geprüft). Rand nur noch Kalenderblatt (Steuerfrist) und Fieberthermometer (Franchise).⟩

⟨20.11.2026 17:04, Stebler Studios: «Gesundheit soll zuerst fertig, … wir wollen ja nicht Instrumente, die gleich sind, aber
Unterschiedliches heissen … gerne aber mal einbauen». → **KK-Last-Bild wartet auf Gesundheit.** Szene **in der App gebaut** auf
Zweig `feat/finanzen-bauplan` (Worktree `_werkbank/finanzen-bauplan`), gestapelt auf **#898** (Notfall & Gesundheit nach Bauplan,
der auf #895 Wohnen steht), Commit `f282d974`, **nur lokal**. Ordner `src/bereiche/finanzen/` (rechnung · bilder · zuhause ·
finanzen.js). Im Browser mit Maria geprüft: Münz-Lohn 6'200 / ≈ 6'796 brutto · Ring mit Drittel-Haus (Wohnen), Steuerfranken
+ «≈ 8'431» (Steuern & Vorsorge), Netz-Schild (Versicherungen) · Sparschwein 4.7 Monate · Rand Kalenderblatt 31.03.2027 und
Thermometer 420 von 1'500. Volltest 10'395 grün, Lint 0 Fehler, 64.9 / 65 kB (knapp!).
Befund aus #898: «Gesundheitskosten gehören zu Finanzen», Thermometer ist dort stehend und orange.
Noch offen: Wächter `bauplanFinanzen.test.js` · Steuer als eigenes Ring-Stück (heute «Steuern & Vorsorge», grau) · Tür am
Mini-Haus · IPV in der KK-Logik · Lohn-Zuhause · Tacho · alter App-Entwurf `feat/finanzen-folgt-ruhig` aufräumen.⟩

⟨20.11.2026 17:12, «Finanzen feinschleifen»: Commit `915413c7` (lokal). Nichts mehr doppelt unter der Szene (Lohn-Kasten nur
Armutsgrenzen-Befund, Steuer-Karte nur ohne Steuerfranken, KK-Satz «540.30 von 609 …» als Zeile am Versicherungs-Stück),
Münzleiste gross, Rand nebeneinander, Ring-Zeilen gleich eingerückt. Wächter `bauplanFinanzen.test.js` (11 Tests, Gegenprobe
zweites Sparschwein → rot). Alte Tests (`finanzenImKapitel`, `geldfluss`) auf die Szene nachgeführt; F7-K4-1 gilt weiter.
Geprüft im Browser: Handy 375 px ohne Querscrollen, hell + dunkel. Volltest 10'406 grün, Lint 0 Fehler, 64.9 / 65 kB.
**Für Stebler Studios offen:** Steuer als eigenes Ring-Stück (heute grau «Steuern & Vorsorge»; Gruppe stammt aus dem
Monatsbudget F8-F1) · KK-Last-Bild (nach Gesundheit) · IPV in der KK-Logik · Tür am Mini-Haus · Lohn-Zuhause · Tacho ·
alter Entwurf `feat/finanzen-folgt-ruhig` (kann weg, sobald dieser steht) · Push/Entwurfs-PR auf Zuruf.⟩

⟨20.11.2026 17:20, Stebler Studios: «Steuer ein Balken so wie er ist, aber aus Münzen, der Teil davon grau, und in Relation zu
etwas» · «das Schwein ist hässlich, bitte besser zeichnen» · «was sich daraus ergibt darf auch noch einfliessen». Commit `968625ee`:
**Steuer = Münzbalken**, eine Münze = 1 % vom erfassten Einkommen im Jahr (Regel wie «zehn Fünfliber»), Bund grau zuerst
(Maria: 11 Münzen, 1 grau), Zeile «≈ CHF 8'431 im Jahr · ≈ 11 % vom Einkommen», Legende «Eine Münze = 1 % · grau: Bund».
Steuerfranken aus der Szene genommen (Bauteil bleibt). **Sparschwein neu gezeichnet.** «Was sich daraus ergibt» fliesst ein:
IPV am Versicherungs-Stück, Vermögen am Sparschwein, bezahlte Gesundheitskosten am Thermometer; der Teil steht nur noch als
Rückfall ohne Kantonszahl. Neue Texte `instrumente.steuerMuenzZeile/-Legende` (fr/it/en/rm von Claude, Gegenlese). Volltest
10'408 grün, 64.86 / 65 kB. **Merke:** «1 Münze = 1 %» ist jetzt eine Regel in Finanzen; die KK-Last (nach Gesundheit) kann sie
übernehmen.⟩

⟨20.11.2026 abends, Stebler Studios: «das Schwein ist immer noch hässlich … hochweg nicht horizontal bei den Steuern eher so wie
ein Stack und dann quasi beim Vermögen mehrere Stacks … was fehlt uns noch». → Skizze `_werkbank/entwuerfe/finanzen-schwein-stapel.html`
(Maria, hell/dunkel): **Sparschwein** P1 rund von der Seite · P2 von vorne (Empfehlung) · P3 Glyphe mit Skala 0·3·6. **Steuer
als Stapel** S-a leere Münzen bis 20 (Empfehlung) · S-b Massstab 10/20 %. **Vermögen als Stapel** V1 je Art (Konto · Wertschriften ·
übriges, Münze = 1'000; Konto-Stapel doppelt das Schwein) · V2 je 10'000 ein Stapel · V3 Münze = 1 % vom Jahreseinkommen wie die
Steuer, je zehn ein Stapel (Empfehlung; Maria 25 Münzen neben 11 Steuer-Münzen). Abgelehnt: Stapel je Monat Ausgaben (sagt dasselbe
wie das Schwein). Offen dazu: zählt 3a/3b-Guthaben (`pension3aBalance`/`pension3bBalance`) mit? Heute rechnet «Vermögen» nur
Konto + `securitiesValue` + `otherAssets`.

**Bestandsliste «was fehlt»** (gegen Bauplan A–D, Register, dieses Blatt; Stebler Studios entscheidet die Reihenfolge):
1. **Register + Sperrklinke nachführen** — `instrumente-register.json` sagt noch Steuer = `saeule` ohne Zuhause, Notgroschen = `tank`,
   Lohn zu Hause in `ausbildung`; `_offen.formAbweichung.steuer` steht noch. Die Szene (Münz-Lohn, Steuer-Münzen, Sparschwein) ist
   dort nicht eingetragen.
2. **Steuer als eigenes Ring-Stück** — Ring zeigt «Steuern & Vorsorge» (Budget, 871) neben der Schätzung (≈ 703/Mt.).
3. **Lohn-Zuhause** (Finanzen oder Arbeit, F7-K4-1) — Register und Szene widersprechen sich.
4. **Tür = Fass am Mini-Haus** mit Pfeil über/unter Grenze (Mietzinsverbilligung) — nicht gebaut.
5. **IPV** — nur Textzeile am Versicherungs-Stück, kein Bild; KK-Last-Bild wartet auf Gesundheit (#898).
6. **Sozialhilfe / «Weitere Ansprüche»** — nicht in der Szene, Ort unter «Mehr dazu» nicht festgehalten.
7. **Tacho-Ort** — offen (B-F5 im Register).
8. **Kreditkarte PR #909** steht auf `main`, nicht auf diesem Stapel — vor dem Mergen neu aufsetzen oder Reihenfolge festlegen.
9. **Alter Entwurf `feat/finanzen-folgt-ruhig`** (lokaler Zweig mit Worktree) — aufräumen, sobald dieser Zweig steht.
10. **rm-Gegenlese** der neuen Texte (`instrumente.steuerMuenzZeile/-Legende` und was jetzt dazukommt).
11. **Push / Entwurfs-PR** — nur auf Zuruf.⟩

⟨20.11.2026 abends, Wahl Stebler Studios (Auswahl-Dialog): Schwein **P2 von vorne** · Steuer **S-a** (Stapel, leere Münzen bis zur
nächsten Zehnerstelle) · Vermögen **V3** (Münze = 1 % vom Jahreseinkommen, je zehn ein Stapel) · mitnehmen: «Register nachführen»,
«Steuer eigenes Ring-Stück», «Tür am Mini-Haus», «Nur die drei Bilder» und als eigene Eingabe «was wir sonnst noch haben»
(so verstanden: die drei Bilder zuerst, dann die drei Punkte, dann was ohne neuen Entscheid geht).⟩

⟨20.11.2026 17:45, gebaut — Commit `21a93119` (lokal, Zweig `feat/finanzen-bauplan`): **Sparschwein von vorne** (P2) ·
**Steuer als senkrechter Münzstapel** (S-a; Maria 1 grau + 10 gold + 9 leer bis 20) · **Vermögen als Stapel** (V3; Maria 25 Münzen
= 3 Stapel, «≈ 25 % vom Einkommen im Jahr», höchstens 10 Stapel) · **Steuer eigenes Ring-Stück** (Gruppe nur `tax`; Vorsorge
`pension3a`/`ahvSelbst`/`bvgSelbst` als eigenes Stück «Vorsorge» in der Vorsorge-Farbe, weiter nicht im Übrigen; Monatsbudget
ausserhalb der Szene unverändert) · **Tür am Mini-Haus** (Drittel-Haus im Ring, Prop `tuer`, Fass + Grenze + Pfeil unter/über;
Maria/ZH: schlichte Tür; bei «möglich» steht der Wegweiser unter der Wohnen-Zeile). Wächter `bauplanFinanzen.test.js` 18 Tests
(Gegenprobe: Stapel waagrecht, Ring ohne `steuerEigen`, Haus ohne Tür → je rot). Volltest 10'413 grün, Lint 0 Fehler, Build ok,
64.84 / 65 kB. Browser Maria: dunkel Desktop, hell + Handy 375 ohne Querscrollen.
**Register** nur teilweise: Bereichsbilder `sparschwein` (vorrat), `muenzstapel` (zusammensetzung), `muenzleiste` (lage) und Hinweis
`_finanzenSzene`. **Nicht** als Zuhause eingetragen, weil die Kacheln der Kapitelzeile weiter Säule/Tank/Barometer zeigen — sonst
wären Steuer und Tank «zuhauseAnderesBild», und die Sperrklinke lässt das nicht zu. **Entscheid nötig:** Kacheln auf Stapel/Schwein
umstellen (Hauptbündel, 64.84 / 65 kB knapp) oder Sperrklinke bewusst öffnen.
**Neu aufgefallen:** Ring-Stück «Steuern» zeigt die erfasste Steuer (Maria 850/Mt.), der Stapel die Schätzung (8'431/Jahr ≈ 703/Mt.)
— zwei Zahlen nebeneinander, die nicht gleich sind. Texte `vermoegenMuenzZeile`, `muenzRegel`, `teil.vorsorge` neu (rm: Gegenlese).
Weiter offen aus der Liste: Lohn-Zuhause · IPV-Bild · KK-Last (nach Gesundheit) · Sozialhilfe-Ort · Tacho · PR #909 auf main ·
`feat/finanzen-folgt-ruhig` aufräumen · rm-Gegenlese · Push/PR nur auf Zuruf. 3a/3b-Guthaben zählen im Vermögen weiter nicht mit.⟩

⟨20.11.2026 17:55, Stebler Studios: «Yes, switch tiles» → Commit `bad6075c` (lokal). Kacheln der Kapitelzeile (Übersicht) zeigen
jetzt dieselben Bilder wie das Kapitel: **Steuer = Münzstapel** (statt Säule), **Notgroschen = Sparschwein klein** (statt Tank).
Beide liegen im nachgeladenen `InstrumentePanel`, die Startdatei bleibt bei 64.88 / 65 kB. **Register** jetzt vollständig: `steuer`
Form `muenzstapel`, Zuhause `finanzen`; `tank` Form `sparschwein`; B-F4 (Säule) und «Steuer ohne Zuhause» gestrichen, **Sperrklinke
gesenkt** (formAbweichung 2 → 1, ohneZuhause 5 → 4). Der Satz «≈ 8'431 im Jahr» stand bisher nur im Hover-Titel der Säule; die Zahl
steht als grosse Zahl der Kachel, «davon Bund» im Text. Wächter +2 Tests (Gegenprobe rot), drei alte Tests auf den Entscheid
nachgeführt. Volltest 10'415 grün, Lint 0 Fehler, Build ok. Browser Maria: Übersicht hell und dunkel (Stapel 24 × 77, Schwein 64 px).
Die Lohn-Kachel (Ausbildung & Arbeit) bleibt Barometer, solange das Lohn-Zuhause offen ist.⟩
