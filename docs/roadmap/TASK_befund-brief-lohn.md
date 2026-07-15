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
