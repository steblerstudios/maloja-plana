# IPV-Lebenslinie — Design-Spec (Phase 2)

> Der IPV-Prämien-Beleg wird **statefull**: nicht nur eine Schätzung, sondern das
> *Gesicht seines Ablaufs* (A2 in `docs/ABLAEUFE.md`). Deckt sich mit dem Nordstern
> „alles ist Lebensereignis-Ablauf". Gemeinsam entschieden mit Stebler Studios,
> 2026-07-13. Rückgrat bestätigt: **ehrliche Verzweigung**.

Stand: Design festgeklopft, Bau folgt (kleines additives `or5_`-Feld freigegeben).
Phase 1 (nur „geschätzt") ist live: `src/components/PraemienBeleg.jsx` +
`src/data/praemienBeleg.js`.

---

## 1. Warum statefull

Phase 1 zeigt IPV als einmalige Schätzung. Aber IPV ist ein *Ablauf*: man schätzt,
der Kanton entscheidet, es kommt eine Verfügung, und es gilt **pro Jahr**. Der Beleg
soll diesen Weg abbilden — der Stempel als Feedback/Verifikation ist ausdrücklich
erlaubt (Registry §1.3 „Satisfying State Changes: sanftes Füllen, Stempel-Effekt";
Anti-Gamification bleibt gewahrt: kein XP, keine Streaks).

## 2. Die Zustandslinie

| # | Zustand | Was der Beleg zeigt | Stempel |
|---|---------|---------------------|---------|
| 1 | `geschaetzt` | Unsere Schätzung aus den Angaben (= Phase 1, unverändert). „Kein Versprechen." | nein |
| 2 | *Verzweigung je Kanton* | **Ehrlicher Kern.** Zwei Wege neutral: **automatisch** (Kanton rechnet aus den Steuerdaten → „nichts tun, auf die Verfügung achten") **oder** **Antrag** (Link zur kantonalen Stelle, `src/data/direktLinks.js`). | nein |
| 3 | `bestaetigt` | Betrag aus **der Verfügung** — nicht mehr unsere Schätzung. | **ja** |
| 4 | *erneuern* | IPV gilt pro Jahr. Ruhige Erinnerung via `addReminder({recurrence:'yearly'})`. Kein Zustand für sich, sondern ein Angebot ab `bestaetigt`. | — |

Der `beantragt`-Zwischenzustand existiert **nur im Antrags-Weg** (Automatik-Kantone
überspringen ihn — dort gibt es keinen Antrag).

## 3. Wahrheits-Leitplanken (nicht verhandelbar)

- **Stempel nie auf einer Schätzung.** Er landet ausschliesslich auf `bestaetigt`.
- **„Automatisch vs. Antrag" pro Kanton ist eine Rechts-/Faktenaussage** → wird
  **nicht geraten** (CLAUDE.md-Wahrheitsdisziplin). Bis der `swiss-precision`/
  `rechts-`Prüfer die Kantons-Mechanik belegt hat, zeigt Zustand 2 **beide Wege
  neutral** statt einer falschen Einbahn. Diese neutrale Fassung ist bereits ehrlich
  und darf gebaut werden; die kantons-spezifische Verschärfung ist eine spätere
  Verfeinerung (Schritt 3).
- **Ab `bestaetigt` zeigt der Beleg den Verfügungs-Betrag**, und benennt, dass die
  frühere Zahl eine Schätzung war (Schätzung ≠ Entscheid).
- IPV oft kantonal automatisch — die Sprache darf niemanden zu einem unnötigen Antrag
  drängen.

## 4. Material & Stil (unverändert zu Phase 1)

- Papier-Material bleibt (warme Fläche, Perforation, Sand-Kante, Mono-Zahlen) — steht
  bewusst neben dem Sozialhilfe-**Pegel** (Glas), damit die beiden nebeneinander
  unterscheidbar sind (von-Restorff, siehe Metapher-Matrix / Memory
  `project_metaphor_matrix`).
- Flat + leichter Skeuo. Kein Rot bei „über der Grenze".
- Der Stempel: `transform: rotate(-8deg)`, gestempelte Mono-Optik, ruhige Farbe
  (kein Alarm) — respektiert `prefers-reduced-motion`.

## 5. Was persistiert (additiv, keine Migration)

Ein winziges Feld in `or5_data`:

```
data.anspruch = {
  ipv: {
    status: 'geschaetzt' | 'beantragt' | 'bestaetigt',   // fehlt ⇒ 'geschaetzt'
    betrag?: number,        // nur bei 'bestaetigt': Betrag aus der Verfügung
    datum?: string          // ISO, wann bestätigt
  }
}
```

- Fehlt das Feld ganz → Verhalten exakt wie Phase 1 (`geschaetzt`). Keine Migration.
- Wird über den bestehenden Backup-Pfad mitgesichert (`or5_data` ist in
  `src/utils/backupCrypto.js` enthalten).
- Geschrieben über den bestehenden `onUpdateData`-Weg, nicht über einen neuen Store.

## 6. Abgrenzung / offen

- **Schritt 3 (nach dem Bau):** `swiss-precision`/`rechts-`Prüfer klärt je Kanton
  „automatisch vs. Antrag" → macht aus „beide Wege neutral" ein kantons-korrektes
  „dein Kanton macht's automatisch / per Antrag". Ehrlich halten: viele Kantone
  koppeln IPV an die Steuerveranlagung.
- Der Schnellcheck rechnet auf einem `probe` (Live-Felder über `or5_data`); der
  Status ist profil-/`or5_data`-gebunden, nicht an die frei angepassten Probe-Zahlen.
- `calculateIPV` in `src/config/cantonalData.js` bleibt **unberührt** (Leitplanke).
