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
- **Baum** bei Backup UND Vorsorge → Baum = Vorsorge; **Backup = eigenes Bild (offen)**
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
| Backup | Doppel-Dokument | **keine Wolke** (local-first) |
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
