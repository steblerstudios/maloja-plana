# TASK — Befund→Brief (Lohn): verloren, dann wieder aufgebaut · Spec + Historie

> **Status: ✅ WIEDER AUFGEBAUT und in `main` (Stand 2026-07-15).** Der Wiederaufbau ist über
> PR #93 (`c7e90cf`·`0d4486d`·`c56272f`·`1bca5a8`·`d5a2898`) gemergt. **Noch nicht live** —
> Predeploy-Runde 8 hält den Deploy zurück (offene 🔴, siehe `SESSION_START.md` Punkt 0).
>
> ⚠️ **Diese Datei wurde im selben Diff angelegt, der das Feature baute, und trug bis
> 2026-07-15 „Status: VERLOREN" samt der Anweisung „vor einem Neuaufbau auf einem anderen
> Rechner schauen".** Sie war beim Anlegen schon falsch — vom Ordnungshüter in Runde 8
> gefunden. Die Wiederaufbau-Spec unten bleibt als **Referenz** stehen (sie beschreibt, was
> gebaut werden sollte, und ist gegen den Code abgehakt); die Verlust-Historie steht hier
> nur noch als Lehrstück.
>
> **Historie (2026-07-14):** Das Feature wurde gebaut, lokal als Commit `e4b2238` auf
> `feat/lohn-mietzins-einordnung` committet, rebased und predeploy-geprüft — aber **nie
> gepusht**, und dann unauffindbar. Erschöpfende Suche (alle Arbeitsbäume, alle Refs aller
> Repos, Bare-Mirror, Stash, Reflog, `git fsck`) fand nichts. **Lehre:** zügig pushen; was
> nicht auf `origin` liegt, existiert nicht.

Dieses Dokument ist die vollständige Bau- und Fix-Spezifikation, damit ein Neuaufbau nicht bei
null beginnt.

---

## Was das Feature war

Zwei Vorlagen in `src/briefGenerator.js`:

- **`wageClaim`** — Lohn unter dem kant. Mindestlohn. Frist 30 Tage, OR 322. Rechnet den Befund
  autark via `pruefeStundenlohn`/`pruefeLohn`.
- **`unpaidWage`** — Lohn nicht bezahlt. Frist 10 Tage, OR 323 + Hinweis OR 82.

- `getFristInfo()` / `FRIST_TAGE` = **eine** Quelle für Brief-Datum UND Kalender (bestehendes
  `addReminder` wiederverwenden — nicht neu bauen).
- „→ nächster Schritt"-Button am roten Befund in `ChapterView.jsx`, gegated via
  `kantonHatMindestlohn`, öffnet `briefe` mit `initialTemplate`-Vorauswahl (`main.jsx`).
- Rechts-Tabelle `src/data/lohnRechtsstellen.js`: nur BS belegt, GE/NE/JU/TI `null` + Fallback.
- i18n ×5 (de/en/fr/it/rm) + 2 Testdateien.

## Stand 15.09.2026 — `wageClaim` bewusst geparkt (Zettel, kein Vergessen)

> **Was gilt:** Der Code für `wageClaim` und `unpaidWage` ist gebaut, getestet und seit 18.07. im
> Live-Bundle. Der Schalter `WAGECLAIM_BEREIT` steht auf `false`: die Vorlage wird **nicht
> angeboten**. Das bleibt so, bis die vier 🔴 aus Predeploy-Runde 8 und die zwei Datenfragen
> geklärt sind — nicht, weil es vergessen wäre, sondern weil ein halb richtiger Lohnbrief an einen
> Arbeitgeber genau die Art Fehler ist, die Haftung auslöst («Orientierung, keine verbindliche
> Berechnung»).
>
> **Die vier 🔴 (Runde 8, `FEATURES.md`):** Netto/Brutto im Brief ungeprüft · Brief auch bei
> Befund `ok` · `unpaidWage` behauptet einen Monatslohn für unbekannten Zeitraum · GE/TI/JU tragen
> `verify:false`, ohne je amtlich gegengeprüft worden zu sein.
> **Die zwei Datenfragen** (Gedächtnis `project-maloja-wageclaim-predeploy-reentry`): der LSE-Median
> enthält den 13. Monatslohn anteilig (rund 8 % Aufschlag), und die GE-Ausnahmen (Lehre, Praktikum,
> unter 18, GAV, Landwirtschaft, Ferienjob) haben eigene Sätze.
>
> **Weg zurück, wenn es soweit ist:** Ausnahmen erfassen → GE-Sätze differenzieren → die vier 🔴
> fixen (je ein roter Test) → `swiss-precision-` und `rechts-pruefer` über den Brief → Schalter auf
> `true` → eigener PR. Grösse: mehrere Tage, nicht ein Nachmittag.
>
> *Empfehlung von Claude Code in der Bau-Liste bis 30.09. (Entscheid E1): parken. Stebler Studios
> hat den Entscheid noch nicht ausgesprochen; dieser Zettel gilt bis dahin als Vorschlag, nicht
> als Beschluss.*

## Stand 26.09.2026 — Beschluss E1: bis Winter geparkt

> **Entschieden** (Stebler Studios, Auswahl-Dialog 26.09.2026): `wageClaim` bleibt aus, bis Winter.
> Damit ist der Zettel oben kein Vorschlag mehr, sondern Beschluss.
>
> **Korrektur zum Stand 15.09.:** Die vier 🔴 aus Runde 8 sind im Code **behoben** (geprüft 26.09.
> gegen `main`): nur «brutto» trägt einen Befund unter dem Mindestlohn (`lohnCheck.js:140-156`) ·
> kein Brief bei `ok` (`briefGenerator.js:234`) · Betrag und Zeitraum «bitte ergänzen»
> (`briefGenerator.js:578-595`) · GE/TI/JU am 15.07. amtlich geprüft (`lohnRechtsstellen.js`).
> Die Datenfrage «13. Monat im LSE-Median» ist für den Lohnvergleich gelöst (×13/12,
> `lohnEinordnung.js:140-144`).
>
> **Der Sperrgrund heute** ist allein der zweite Teil: der Befund kennt die **Ausnahmen** nicht
> (Lehre, Praktikum, unter 18, GAV in TI/JU), und **GE hat drei Sätze**, der Code kennt den höchsten.
> Die GE-Ferienjob-Regel ist rechtlich ungeklärt (`lohnCheck.js:55-61`). Weg zurück: Ausnahmen
> erfragen → GE-Sätze unterscheiden → Prüfer → Schalter. Grösse **L**.

## Fix-Register (aus dem Predeploy-Review 2026-07-14 — beim Neuaufbau direkt einbauen)

**🔴 BLOCKER (swiss-precision) — einziges echtes Haftungsrisiko in einem versendbaren Brief:**
`generateWageClaim` behauptete einen kant. Mindestlohn auch für Kantone OHNE Gesetz (~21/26,
z.B. ZH/BE/VD). Der ChapterView-Pfad war via `kantonHatMindestlohn` gegated, aber die
**Vorlagen-Liste in `BriefGenerator.jsx` war ungefiltert** (`getLetterTemplates()` gab
`wageClaim` unbedingt zurück). → **Fix:** Vorlage nur bei `kantonHatMindestlohn` anbieten
(bzw. `status==='keinGesetz'` → ehrlicher Alt-Text).

**⚠️ SOLLTE:**
- **(A, rechts)** `wageReminder.notes` für beide Briefe geteilt; bei `unpaidWage` falsche Stelle
  (verweist auf „kant. Kontrollstelle" statt Schlichtungsbehörde/Arbeitsgericht/Betreibung).
  → 2 getrennte Keys.
- **(B, rechts+copy)** OR-82-Hinweis in `unpaidWage.legalNote` grenzt an Handlungsempfehlung.
  → Zusatz „nur nach Rücksprache mit Fachstelle, sonst fristlose Kündigung möglich".
- **(C, swiss)** TI-Jahr: `lohnCheck.js` TI `jahr: 2024` → Brief zeigt „(2024)", obwohl per
  Decreto 1.1.2026 aktuell. → `2026` (Betrag CHF 20.00 bleibt). *(Prüfen, ob im aktuellen `main`
  schon 2026 — das Barometer wurde separat gemergt.)*
- **(D, swiss)** Jahr-Inkonsistenz: Brief nutzt `befund.jahr` (pro Kanton), `ChapterView.jsx`
  das globale `LOHNCHECK_DATA_VERSION` → TI-Nutzer sieht Kapitel „(2026)"/Brief „(2024)".
  → ChapterView auf `check.jahr`/`result.jahr`.
- **(E, swiss)** `JU: indexiert: true` war FALSCH (JU indexiert nicht automatisch) + Header-Kommentar.
  → `false`. *(Im aktuellen `main` bereits `false`.)*
- **(F, copy)** `wageClaim.body1` + `body2request` zu verschachtelt für wenig-Deutsch. Copy hatte
  konkrete Umformulierungen (i18n ×5). Wording A/B/F mit Stebler Studios gegenlesen.

**💡 KANN (geparkt):** doppeltes Leerzeichen bei `figuresMindest` ohne Jahr (trim) · Rundungs-Kante
`pruefeLohn` (unrundet) vs `pruefeStundenlohn` (rundet Rappen) · `formatAmount('')` bei Differenz=0
→ leere „CHF " · unbelegter „~7 Tage"-Kommentar · vierte lokale Crosslink-Variante zu 1 Baustein
· `unpaidWage`-Titel „Mahnung" weicher · `formatAmount` `Number()` → `num()`.

## GE/NE/JU/TI-Rechtsstellen (amtlich recherchiert — für `lohnRechtsstellen.js`)

- **GE** = Art. 39K LIRT, Kontrollstelle **OCIRT**.
- **TI** = **Legge sul salario minimo (LSM)** 11.12.2019, Art. 4; Kontrolle **Ufficio
  dell'ispettorato del lavoro** (der TI-GAV-Verdacht ist widerlegt — echte gesetzl. Grundlage).
- **NE** = kant. Gesetz 17.9.2015 (Titel gegenprüfen), **ORCT** + tripartite Kommission.
- **JU** = „Loi sur le salaire minimum cantonal" seit 1.2.2018, **KEINE Kontrollstelle** →
  Conseil de prud'hommes (Arbeitsgericht Porrentruy). Dort das Wort „Kontrollstelle" MEIDEN.

## Bestätigt sauber (war im Review ok)

BS amtlich korrekt · OR 322/323/82 richtig zitiert · keine suggerierte Gesetzesfrist · Disclaimer
konsistent (wortgleich `kkReklamation`) · `getFristInfo` einzige Quelle · CHF-Beträge GE 24.59 /
NE 21.35 / JU 21.40 / BS 22.20 (2026) verifiziert · RM echtes Rumantsch Grischun · Sie/Du-Architektur
korrekt (Briefe Sie-neutral, nur `wageReminder.text` Split) · i18n-Ton-Parität en/fr/it.

## Beim Neuaufbau beachten (Arbeitsweise)

NICHT „einfach nochmal bauen und dann prüfen" — die Fix-Register-Punkte gleich beim Bau einbauen,
danach Tests + kurzer Re-Check, dann Feature-Branch → PR → `main` → Predeploy-Gate. Nichts direkt
auf `main`. Bau-Freigabe lag ursprünglich vor. Bestehendes wiederverwenden (`addReminder`).
