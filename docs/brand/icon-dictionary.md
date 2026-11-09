# Maloja Plana — Icon-Wörterbuch

**Stand:** Juni 2026 · Arbeitsdokument (wird gemeinsam fertig definiert)

**Prinzip:** Jedes Icon ist eine bewusste **Schweizer Metapher** für *eine* Funktion.
Einmal sauber definiert → überall konsistent verwendet. Eine Funktion = ein Icon
(keine Doppelungen). Stil: bestehende detaillierte Piktogramme, Farben an **Granit**-Palette.

**Status-Legende:** ✓ stimmt · 🔄 neu zuordnen · ➕ neu zeichnen · ⚠️ Redundanz/klären

---

## A — Lebensbereiche (Kapitel-Icons)

| Funktion | Schweizer Metapher | Code | Status |
|----------|-------------------|------|--------|
| Basis / Profil | Identitätskarte (Ausweis) | `_basis` | ✓ |
| Wohnen | Chalet mit Balkon | `_wohnen` | ✓ |
| Finanzen | Fünfliber (5-Fr-Münze) | `_finanzen` | ✓ |
| Versicherungen | Schild mit Edelweiss | `_versicherungen` | ✓ |
| Ausbildung | Maturahut / Diplom | `_ausbildung` | ✓ |
| Behörden / Staat | Bundeshaus (Helvetia als Alternative) | `_behoerden` | 🔄 Bundeshaus |
| Steuern | Steuererklärung mit % | `_steuern` | ✓ |
| Schulden / Betreibung | Rechnung mit Minus | `_schulden` | ✓ |
| Dokumente / Tresor | Safe mit Zahlenschloss | `_dokumentTresor` | ✓ |
| Notfall | Rettungskreuz (generisch, NICHT Rega-Logo) | `_notfall` | 🔄 |
| Vorsorge | _(prüfen)_ | `_vorsorge` | ⚠️ Metapher klären |
| Lebenslauf | CV-Blatt | `_lebenslauf` | ✓ |
| Prämienverbilligung | Schild + Pfeil runter | `_praemienverbilligung` | ✓ |
| Mietzinsverbilligung | Chalet + Pfeil runter | `_mietzinsverbilligung` | ✓ |
| Sozialhilfe | Hände + Person | `_sozialhilfe` | ✓ |
| Organspende | Herz mit Kreuz | `_organspende` | ⚠️ fast gleich wie Notfall |

---

## B — App-Funktionen & Werkzeuge

| Funktion | Schweizer Metapher | Code | Status |
|----------|-------------------|------|--------|
| **Übersicht / Dashboard** | **Schweizer Sackmesser** | (war `_exportTool`) | 🔄 Sackmesser hierher |
| **Benachrichtigungen / Erinnerungen** | **Kuhglocke** | `_cowbell` | 🔄 hier einsetzen |
| **Frist / Termin / Zeit** | **Mondaine-Bahnhofsuhr** | (war `_kalenderUhr`) | 🔄 Uhr = Zeit, nicht Kalender |
| **Kalender** | Wandkalender (Datumsblock) | `_calendar` | 🔄 statt Uhr |
| Import | Brief / Couvert (generisch, NICHT Post-Logo) | — | ➕ |
| Export / Teilen | _(noch offen)_ | — | ⚠️ offen |
| Suche | Lupe | `_search` | ✓ |
| Filter | Trichter | `_filter` | ✓ |
| Einstellungen | Zahnrad | `_settings` | ✓ |
| Sichern / Privat | Schloss | `_lock` | ✓ |
| Wiederkehrend | Kreis-Pfeile | `_recurring` | ✓ |
| Info | «i» | `_info` | ✓ |
| Externer Link | Pfeil aus Rahmen | `_external` | ✓ |
| Diagramme / Statistik | Schoggi-Tafel als Balken | `_chartsSchoko` | ✓ (clever) |
| Budget | Portemonnaie | `_budgetWallet` | ⚠️ vs money/budget |

---

## C — Aktionen & Status

| Funktion | Metapher | Code | Status |
|----------|----------|------|--------|
| Bearbeiten | Stift | `_edit` | ✓ |
| Löschen | _(prüfen — sanft!)_ | `_delete` | ✓ |
| Hochladen | Pfeil hoch | `_upload` | ✓ |
| Herunterladen | Pfeil runter | `_download` | ✓ |
| Sicherung / Speichern | Doppel-Dokument mit Pfeil hinein | `_sicherung` | ✓ (25.09.2026) |
| Scannen | QR / Barcode | `_qr`, `_barcode` | ✓ |
| Erledigt / Erfolg | Häkchen | `_check`, `_success` | ⚠️ zwei fast gleich |
| Hinweis | _(sanft, nie alarmierend — siehe Voice)_ | `_warning` | ⚠️ Ton prüfen |
| Fehler | _(sanft)_ | `_error` | ⚠️ Ton prüfen |

---

## D — Redundanzen zu bereinigen (eine Funktion = ein Icon)

- **Geld:** `_money` · `_budget` · `_budgetWallet` · `_finanzen` (Fünfliber) → klären, wer was ist
- **Haus:** `_wohnen` (Chalet) · `_home` (Linien-Haus) · `_mietzinsverbilligung` → Chalet als Leitform
- **Gesundheit:** `_notfall` · `_emergency` · `_doctor` · `_dentist` · `_health` · `_organspende` → entwirren
- **Dokumente:** `_document` · `_documents` · `_dokumentTresor` → Rollen trennen
- **Zeit:** `_calendar` · `_kalenderUhr` · `_timeline` · `_recurring` → Kalender vs Frist vs Verlauf vs wiederkehrend
- **Versicherung:** `_versicherungen` (Schild+Edelweiss) · `_insurance` → eine Leitform
- **Check:** `_check` · `_success` → einen behalten

---

## E — Neue Elemente

- **Gipfel-Motiv** (aus der Wortmarke): für das «Maloja»-/Übersichts-Gefühl, Empty States,
  Fortschritt. Kommt als *ein* neues, ruhiges Element dazu.

---

## F — Schutzrechte / Was wir zeichnen dürfen

**Grundregel:** Ein *generisches Kulturobjekt* nachzeichnen ist erlaubt. Ein fremdes *Logo,
eine Marke oder ein geschütztes Design* nicht. Im Zweifel generisch halten. (Kein Rechtsrat —
nur ein Hinweis; vor kommerziellem Einsatz im Zweifel kurz prüfen lassen.)

| Metapher | Erlaubt (generisch) | Heikel — vermeiden |
|----------|--------------------|---------------------|
| Uhr | eigene/generische Uhr | **SBB-Bahnhofsuhr-Signatur** (roter «Lollipop»-Sekundenzeiger, exakte Proportionen) — Design von SBB, lizenziert an Mondaine → **prüfen** |
| Post / Brief | schlichtes Couvert | Post-Logo, Posthorn, «Postgelb» als Markenfarbe |
| Rettung | rotes Kreuz / generischer Heli | **Rega**-Name/-Logo/-Schriftzug |
| Taschenmesser | generisches Sackmesser | **Victorinox**-Kreuz-Emblem auf dem Griff |
| Schokolade | rechteckige Tafel | **Toblerone**-Dreieck + Matterhorn (Markenform) |
| Schweizerkreuz | weisses Kreuz auf Rot (Flagge), für Waren/Dienste ok | **Eidg. Wappen** (Kreuz im Schild) — nur dem Bund vorbehalten |
| Münze | stilisierter Fünfliber | scan-genaue 1:1-Reproduktion von Geld |
| Käse · Edelweiss · Chalet · Kuhglocke · Bundeshaus | alles ok (generische Objekte / öffentl. Gebäude) | — |

**Heikelste Stelle jetzt:** die bestehende **Mondaine-Uhr** — sehr nah am geschützten SBB-Design.
Entweder bewusst generisch abwandeln (anderer Sekundenzeiger) oder vor kommerziellem Einsatz
rechtlich kurz prüfen. Beim Sackmesser (neu = Übersicht): das Kreuz-Emblem generisch halten,
nicht das Victorinox-Logo.

---

## Von Stebler Studios bestätigt (2026-06-23)

- ✓ **Sackmesser → Übersicht**, **Uhr → Frist/Zeit**, **Kuhglocke → Benachrichtigungen**
- ✓ **Haus & Wohnen = Chalet** (Leitform überall)
- ✓ **Finanzen / Geld = Fünfliber**
- ✓ **Versicherungen = Edelweiss(-Schild)**
- ✓ **Charts / Statistik = Schweizer Schokolade** (rechteckige Tafel)
- ✓ **Behörden / Staat = Bundeshaus**
- ✓ **Notfall = Rettungskreuz** (generisch)
- ✓ **Import = Brief / Couvert** (generisch, kein Post-Logo)
- 🟡 **Käse (Emmentaler)** = schöne Metapher, Funktion noch offen (Budget? Sparen?)

## G — Geld-Cluster aufgelöst (verschiedene Objekte)

- Finanzen = Fünfliber · Sparen = **Sparschwein** · Budget = Portemonnaie/Haushaltsbuch ·
  Ausgaben = Kassenbon/Quittung · Bankverbindung = **SNB-Gebäude**

## H — Weitere Metaphern (aus von Stebler Studios Board + Vorschlägen)

- Dokumente/Ablage = **Bundesordner** (Ringordner) · Vorsorge = **Setzling/Baum** ·
  Bürgerrecht/Einbürgerung = **Wilhelm Tell** (generisch, kein Armbrust-Label) ·
  Import/Export = **Couvert mit Pfeil ←/→** (Export braucht eigenes Icon, NICHT Sackmesser) ·
  Nachrichten = Sprechblase · Erinnerungen = Kuhglocke (verschieden!) · Kanton = neutrales
  Schild + Name (NIE echtes Wappen)

## I — Emotional- / Kultur-Schicht (Easter Eggs, eigene Ebene — nie funktional)

Murmeli · Fondue (Familie/Teilen) · Raclette · Rösti · **Käse (Heimat/Genuss)** · Fasnacht/Räppli ·
Alphorn (Kultur) · Rütli (Gründung/Werte) · Feuerschale (Gemeinschaft) · Edelweiss-Wiese.

**Kalibrierung (damit's Maloja bleibt):**
- **Murmeli sparsam** — ruhiger Begleiter (Begrüssung, Empty State, 1× saisonal), NICHT als
  Reaktions-Maskottchen bei jeder Aktion (= Gamification, meiden).
- **Keine «Datenlücken/fehlt/% voll»-Mechanik** — ruhig zeigen was DA ist («nimmt Form an»),
  nicht was fehlt (siehe Voice).
- Schicht ist **abschaltbar**, ruhig, nie laut.

## J — Schutzrecht: Kantonswappen (Antwort auf von Stebler Studios Frage)

Vereinfachen hilft NICHT — geschützt ist auch, was mit dem Wappen *verwechselbar* ist.
Faustregel: «Lese ich ‹Kanton X› heraus → nicht erlaubt.» Nur **völlig abstrahiert / neutrales
Schild + Name** ist sicher. (Kein Rechtsrat.)

---

## Kollisionen noch aufzulösen

- **Uhr 3×** (Frist · Kalender · Zeit&Absenzen) → Uhr = nur «Frist/Zeit», Kalender = Datumsblatt
- **Sackmesser** = Dashboard → Export = eigenes Icon (Couvert+Pfeil)
- **Baum** bei Backup UND Vorsorge → Baum = Vorsorge; **Backup = eigenes Bild** → gezeichnet 25.09.2026 als `_sicherung` (IconKern)
- **Post/Bahnhofsuhr** generisch (kein «DIE POST»-Logo, kein SBB-Lollipop-Zeiger)
- Gesundheit-/Dokumente-Cluster final entwirren

## Mapping-Hinweis

von Stebler Studios Board (von ChatGPT) nutzt alte Palette, «Söhne»-Schrift, «Du». Wir übernehmen die
**Metaphern**, aber in **Granit**-Palette, **Hanken/Lora/Lexend** und **«Sie»**.

## Letzte Entscheide (2026-06-23)

- **Backup = Doppel-Dokument / Sicherungskopie** (zwei Blätter). Bewusst **KEINE Wolke** —
  Maloja ist local-first/offline; ein Cloud-Icon würde dem Kernversprechen widersprechen.
- **Murmeli = selten & ruhig** bestätigt (Kultur-Schicht, kein Reaktions-Maskottchen).

---

# ★ FINALE ZUORDNUNG (kanonisch)

Schicht A = Lebensbereiche (reiche Piktogramme) · B = Funktionen/Werkzeuge (ruhig, klar) ·
C = Emotional/Kultur (Easter Eggs, abschaltbar). Alle in **Granit**-Palette.

## Schicht A — Lebensbereiche

| Funktion | Metapher | Hinweis |
|----------|----------|---------|
| Basis / Profil | Identitätskarte | ✓ vorhanden |
| Wohnen | Chalet | Leitform «Haus» |
| Finanzen | Fünfliber | |
| Versicherungen | Edelweiss-Schild | |
| Vorsorge | Setzling / junger Baum | neu, ≠ Notfall |
| Behörden / Staat | Bundeshaus | war Helvetia |
| Kanton | neutrales Schild + Name | **kein echtes Wappen** |
| Bürgerrecht / Einbürgerung | Wilhelm Tell (Apfel/Armbrust) | generisch, **kein Armbrust-Label** |
| Steuern | Steuererklärung mit % | |
| Schulden / Betreibung | Rechnung + Minus | |
| Notfall | Rettungskreuz / Notfallpass | generisch, **kein Rega-Logo** |
| Organspende | Herz mit Kreuz | klar von Notfall trennen |
| Sozialhilfe | Hände + Person | |
| Prämienverbilligung | Schild + Pfeil | |
| Mietzinsverbilligung | Chalet + Pfeil ↓ | |
| Ausbildung | Zirkel / Maturahut | |
| Arbeit / Beruf | Werkzeugkasten | |
| Lebenslauf | CV-Blatt | |

## Schicht B — Funktionen & Werkzeuge

| Funktion | Metapher | Hinweis |
|----------|----------|---------|
| Übersicht / Dashboard | Schweizer Sackmesser | **kein Victorinox-Kreuz** |
| Frist / Termin / Zeit | Uhr | generisch, **kein SBB-Lollipop-Zeiger** |
| Kalender | Datumsblatt | war Uhr |
| Nachrichten | Sprechblase | |
| Erinnerungen | Kuhglocke | |
| Dokumente / Ablage | Bundesordner (Ringordner) | |
| Sichere Dokumente | Safe / Tresor | |
| Bankverbindung | SNB-Gebäude | |
| Zahlungsmittel | Karte | |
| Budget | Portemonnaie / Haushaltsbuch | |
| Sparen | Sparschwein | |
| Ausgaben | Kassenbon / Quittung | |
| Charts / Analysen | Schoggi-Tafel | rechteckig, **kein Toblerone** |
| Import | Couvert + Pfeil rein | generisch, **kein Post-Logo** |
| Export / Teilen | Couvert + Pfeil raus | generisch |
| Backup | Doppel-Dokument (`_sicherung`) | **keine Wolke** (local-first) |
| Einstellungen | Zahnrad | |
| Hilfe / Support | Rettungsring | |
| Suche · Filter | Lupe · Trichter | |
| Sichern / privat | Schloss | |
| Scannen | QR / Barcode | |
| Bearbeiten · Löschen | Stift · (sanft) | |
| Hoch-/Herunterladen | Pfeil hoch/runter | |
| Wiederkehrend · Info · Externer Link | Kreis-Pfeile · «i» · Pfeil aus Rahmen | |

## Schicht C — Emotional / Kultur (Easter Eggs, ruhig, abschaltbar)

Murmeli (seltener Begleiter) · Fondue (Teilen) · Raclette · Rösti · Käse (Heimat/Genuss) ·
Fasnacht / Räppli · Alphorn (Kultur) · Rütli (Werte) · Feuerschale (Gemeinschaft) ·
Edelweiss-Wiese · **Gipfel-Motiv** (Maloja — Empty States, ruhiger Fortschritt).

→ Nächster Schritt: bestehende Icons auf diese Tabelle ausrichten + Granit-Farben, dann
überall konsistent einsetzen.

---

## ⟨Nachtrag 06.11.2026⟩ Stand nach dem Icon-Plan November 2026

Die «Finale Zuordnung» oben wird jetzt umgesetzt (Plan `docs/ICON-PLAN-2026-11.md`, Schritte als
Entwurfs-PRs). Was sich an den Status dieser Liste ändert:

- **Schicht B ist Strich** (E1): Info, Hinweis, Fehler, Erfolg, Löschen, Filter, Telefon, Scannen
  (QR/Barcode), CSV, Verlauf, Dokument neu als Linie — sanft, ohne weisse Innenzeichen.
  «Hinweis/Fehler: Ton prüfen» → **sanft, als Strich** ✓
- **Notfall** = Rettungskreuz überall; die Glocke (`emergency`) steht nicht mehr für Notfall ✓
- **Organspende** trägt ihr eigenes Herz, nicht mehr das Gesundheits-Kreuz ✓ (Kollision mit Notfall
  bleibt beim Zeichnen zu klären)
- **Dokumente/Ablage = Ordner**; `mappe` aufgelöst (E2) ✓ · **Plus** im Register (E3) ✓
- **Übersicht = Sackmesser**, **Rucksack**, **Geschenk** («Was steht mir zu?») stehen jetzt im
  Register statt von Hand in Leiste und Menü ✓
- Noch offen aus dieser Liste: Uhr = Frist, Couvert = Import/Export, Setzling = Vorsorge,
  Sparschwein, Quittung als Ausgaben-Bild, Gesundheit-/Dokumente-Cluster, `check` vs `success`.

### ⟨Nachtrag 06.11.2026, Schritt 7⟩ Behörden = Helvetia · Gruppe E

- **Behörden / Staat = Helvetia.** So ist es gezeichnet (Münze mit Krone, Speer, Schild,
  `src/IconMuenzen.jsx`) und so gilt es (Stebler Studios, 06.11.2026: «sind Behörden nicht
  Helvetia»). Die Zeilen oben mit «Bundeshaus, war Helvetia» sind damit überholt — stehen
  gelassen als Verlauf.
- **Lebensereignisse haben je ein eigenes Zeichen** (Gruppe E, 39 Stück, aus dem Rucksack) —
  überall dasselbe. Die Liste aller Icons mit Gruppe und Bedeutung: `src/config/iconInventar.js`.
- **Wilhelm Tell:** erarbeitet (Braindump 29: Persönliche Basis/Apfel, geparkt; IDEEN.md:
  Auszeichnungen, geparkt; hier: Bürgerrecht), nie gezeichnet. Entscheid beim Zeichnen.

### ⟨Nachtrag 08.11.2026, Bauplan B1–B5c⟩ Was jetzt gilt

Entschieden in der Icon-Besprechung November 2026 (`docs/design/icon-besprechung-2026-11.md`), gebaut in
den Entwurfs-PRs #751–#760. Die Zeilen oben bleiben als Verlauf stehen; **wo sie abweichen, gilt das hier.**

**Das System:** jede Seite trägt **Leitform + Abzeichen**. Leitform = das Kapitel (bzw. der Ast), Zeichen
im Abzeichen = was passiert, Farbe des Abzeichens = wer mitspielt (ein anderer Ast, Geld = gold, sonst
leer). Eine Quelle: [`src/config/seitenZeichen.js`](../../src/config/seitenZeichen.js), gezeichnet von
`src/IconAbzeichen.jsx` (nachgeladen). Unter 20 px steht das einfache Zeichen ohne Abzeichen.

| Was | gilt jetzt | vorher hier | Entscheid |
|---|---|---|---|
| **Frist** | Kalender mit Tagesdatum + Abzeichen: **Sanduhr blau** (Frist läuft), **! rot** (überfällig), **+ leer** (eintragen). Mit Abzeichen steht das Datum links und kleiner | Mondaine-Bahnhofsuhr | Punkt 8 «C», 07.11.; Datum «B», 08.11. |
| **Uhr** | nur «pro Stunde» (Stundenlohn-Abzeichen): generische Bahnhofsuhr, vier Striche, 10:10, **kein roter Sekundenzeiger** | Uhr = Frist/Zeit | Punkt 8, 07.11. |
| **Export / Herunterladen** | Pfeil nach unten (`download`); **Sicherung** = Doppelblatt mit Pfeil (`sicherung`), zwei Zeichen | Couvert mit Pfeil | Punkt 4; Export/Sicherung «A», vorläufig, 08.11. |
| **Einbürgerung** | Helvetia mit Abzeichen **Karte mit Plus**, Farbe Ast Person | Wilhelm Tell | Gesamtmatrix 07.11. |
| **Menü** | **Sackmesser** (generisch, ohne Kreuz-Emblem); offen, solange das Menü offen ist, geschlossen eine Klinge halb draussen | Sackmesser = Übersicht | Punkt 11 «B», 07.11.; halb aufgeklappt 09.11. |
| **Übersicht** | **Feldstecher** | Sackmesser | Punkt 13 «G», 07.11. |
| **«Was steht mir zu?»** | **Wegweiser** — das Geschenk fällt weg (ein Recht, kein Entgegenkommen) | Geschenk | Punkt 13 «G», 07.11. |
| **Drucken** | Drucker (`drucker`), auch in Knöpfen | — | Punkt 4, 06.11. |
| **Behörden** | **Helvetia** (wie schon am 06.11. nachgetragen). ⏸️ Kreuz im Schild: wartet auf das IGE (B7) | Bundeshaus | 06.11. |
| Erinnerungen | Kuhglocke als Strich — **nur** Erinnerung, nie «überfällig» | Kuhglocke | Punkt 1 «A», 07.11. |
| Merkliste | Lesezeichen | — | Punkt 3 «E», 06.11. |
| Erledigt | ein Haken (`check`); der zweite Haken (success) ist weg | zwei Haken | Punkt 3 «C», 06.11. |
| Offizielle Links · Flyer | Kette · Blatt mit Pfeil (`teilen`); das Tresor-Zeichen ist weg | Tresor | Punkt 4, 06.11. |
| Telefon | Hörer = anrufen · Handy = das Gerät («Auf den Startbildschirm» ohne Abzeichen) | — | Punkt 9, 07.11. |
| Schulden-Reiter «Übersicht» | Balken | Sackmesser | Punkt 11, 07.11. |

**Aufgelöst, nicht mehr im Register:** `success`, `dokumentTresor`, `exportTool`, `kalenderUhr`, `qr` (B5a).
**Nicht mehr nötig** (Bild «Fehlendes», 07.11.): Couvert, Setzling, Sparschwein; Tell nur noch, falls
«Leitformen reicher» gewünscht wird.
