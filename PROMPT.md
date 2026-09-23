# Maloja Plana · «Ordnung & Ruhe» — Orientierung für Entwickler

**Stand: 23.09.2026. Alles hier ist am Bestand gemessen, nicht aus Erinnerung geschrieben.**
Jede Zahl trägt den Befehl, mit dem sie nachzumessen ist.

> **Dieses Dokument beschreibt, es schreibt nicht vor.** Bei jedem Widerspruch zwischen dieser
> Datei und dem Code **gilt der Code** — dann ist diese Datei veraltet und gehört korrigiert.
> Es gibt hier ausdrücklich **keine** «source of truth»-Regel: ein Dokument, das Vorrang vor
> dem Bestand beansprucht, richtet mehr Schaden an als eines, das fehlt.

---

## Was die App ist

Ein digitaler Lebensordner für Privatpersonen in der Schweiz: Dokumente, Budget,
Versicherungen, Vorsorge, Behördenwege, Notfallplan. **Local-first** — die Daten liegen im
Browser der Nutzerin, nicht auf einem Server.

---

## Stack, gemessen

| | |
|---|---|
| Framework | React + Vite |
| Laufzeit-Abhängigkeiten | **drei**: `react`, `react-dom`, `three` (3D-Baum) |
| Entwicklungs-Abhängigkeiten | 12, darunter `vitest`, `eslint`, `size-limit`, **Capacitor** (iOS-Hülle) |
| Sprachen | **fünf**: de · en · fr · it · rm (`src/i18n/`) |
| Tests | **134 Testdateien** (`npm test`, vitest) |

```bash
npm run dev      # Vite-Entwicklungsserver
npm run build    # Produktionsbau
npm run seiten   # statische Erklärseiten (scripts/build-seiten.mjs)
npm test         # vitest
npm run lint     # eslint src
npm run size     # size-limit — das Bundle hat eine Obergrenze
```

## 🛑 Die harte Grenze: Content-Security-Policy

`index.html` setzt **`script-src 'self'`**. Gemessen: **0 CDN-Skripte** im Dokument.

**Folge:** Eine Bibliothek per `<script src="https://cdn…">` einzubinden **funktioniert nicht** —
der Browser lädt sie nicht, ohne dass der Code einen Fehler wirft, den man leicht findet.
Deshalb liegt `qrcodejs.js` als Datei unter `src/vendor/`. Wer eine Fremdbibliothek braucht:
**lokal ablegen oder als Abhängigkeit installieren**, nie über ein CDN.

```bash
grep -c "cdn\|unpkg\|jsdelivr" index.html     # muss 0 bleiben
grep -o 'Content-Security-Policy[^>]*' index.html
```

---

## Struktur — `src/` hat 375 `.jsx`/`.js`-Dateien

**Es ist keine Einzeldatei-App.** Wer eine solche beschreibt, beschreibt den Vorgänger
(siehe unten).

| Ordner | Dateien | Was darin liegt |
|---|---|---|
| `__tests__/` | 84 | Tests neben den Modulen, dazu 50 weitere verteilt |
| `data/` | 69 | Fachdaten, Kapitelinhalte |
| `utils/` | 39 | Werkzeuge, u. a. `idbUtils.js`, `autoBackup.js`, `datenLoeschen.js` |
| `components/` | 32 | wiederverwendete Bausteine |
| `runtime/` | 23 | Laufzeit |
| `assets/` | 22 | Bilder und **SVG-Symbole** (`icons-full/`) |
| `config/` | 22 | Konstanten, Schalter |
| `i18n/` | 11 | `de.js` · `en.js` · `fr.js` · `it.js` · `rm.js` · `index.js` |
| `hooks/` | 4 | React-Hooks |
| `crypto/` | 3 | `vault.js` — der Dokumenten-Tresor |
| `vendor/` | 1 | `qrcodejs.js`, lokal wegen der CSP |
| Wurzel von `src/` | 114 | Seiten und Kapitel |

```bash
find src -maxdepth 1 -type d        # Struktur
find src -name "*.jsx" -o -name "*.js" | wc -l
```

**Stile:** zwei CSS-Dateien — `src/tokens.css` (Design-Token) und `src/print.css` (Druck).
**Symbole:** 22 SVG-Dateien (17 in `src/assets/icons-full/`, 3 in `src/assets/`, 2 in `public/`).

---

## Daten

### localStorage — rund 40 Schlüssel, alle mit Präfix `or5_`

Nicht vier. Gemessen am 23.09.2026:

```
or5_ankunft_ · or5_anrede · or5_baumAnsicht · or5_behoerden_checklist · or5_beta_access
or5_beta_feedback · or5_colorblind · or5_contacts · or5_contacts_prerestore · or5_data
or5_data_premigration · or5_data_prerestore · or5_disclosure_ · or5_docs · or5_docs_prerestore
or5_grayscale · or5_i18n_reload · or5_lang · or5_lastBackup · or5_last_backup
or5_lebenszustaende · or5_lefthand · or5_locked · or5_loeschsignal · or5_merkliste
or5_notification_prefs · or5_onboarding_done · or5_prerestore_date · or5_readable
or5_reducemotion · or5_reminders · or5_reminders_prerestore · or5_simpleView · or5_temp
or5_theme · or5_tour_done · or5_tresor · or5_vorlesen · or5_vorsorge_lastvisit
```

```bash
grep -rho "or5_[a-zA-Z0-9_]*" src | sort -u
```

Auffällig und wichtig: die `_prerestore`- und `_premigration`-Schlüssel sind **Rückfallstände**
vor Wiederherstellung und Datenumzug. Nicht als Altlast entfernen — sie sind der Rückweg.

### IndexedDB

In **9 Dateien** in Gebrauch, die Abstraktion liegt in `src/utils/idbUtils.js`.
Weitere Berührungspunkte: `main.jsx`, `utils/datenLoeschen.js`, `utils/autoBackup.js`.

### Die sieben Kapitel

`basis` · `wohnen` · `finanzen` · `versicherungen` · `ausbildung` · `behoerden` · `notfall`

---

## Was aus der v5-Fassung gilt — und was nicht

Ein älteres Dokument («Master Prompt v5») beschreibt eine **Einzeldatei-App**: alles in einer
`.jsx`, Inline-Stile, keine SVGs, vier `or5_`-Schlüssel, Bibliotheken über CDN, nur Deutsch.
**Das war der Vorgänger** — er liegt unter
`maloja plana/_maloja-archiv/vorgaenger-ordnung-ruhe/`. Für das heutige Produkt gilt davon
**nichts von der Architektur**, und die CDN-Empfehlung würde an der CSP scheitern.

Was aus jenem Dokument weiterhin trägt, steht hier:

### Schweizer Begriffe — nicht verhandelbar

| Gemeint ist | ❌ nicht | ✅ sondern |
|---|---|---|
| Krankenkasse | Health Insurance, «Versicherung» | **Krankenkasse**, KK |
| Franchise | Deductible, Selbstbehalt | **Franchise** (CHF 300 … 2500) |
| Pensionskasse | Pension Fund, 401k | **Pensionskasse**, BVG |
| Invalidenversicherung | Disability | **IV** |
| Unfallversicherung | Workers Comp | **UVG** |
| Dritte Säule | Third Pillar | **3. Säule** (a: gebunden · b: frei) |
| Aufenthaltsbewilligung | Residence Permit | **Aufenthaltsbewilligung** (B, C, L, G …) |
| Berufsabschluss | Vocational Degree | **EFZ** |
| AHV | State Pension, «Rentenversicherung» | **AHV** |
| Gemeinde | Municipality | **Gemeinde** und **Kanton** |

> Verbindlich für Zahlen ist das Faktenregister, nicht dieses Dokument: jeder Betrag, jede
> Frist und jede Altersgrenze gehört mit Quelle und Erhebungsjahr belegt.

### Fallen, die weiterhin zuschlagen

| Falle | Warum sie greift |
|---|---|
| `sum + x.amount` ohne `Number(x.amount \|\| 0)` | Eingaben sind Strings, `undefined` oder leer |
| `createObjectURL` ohne `revokeObjectURL` | jeder Aufruf belegt Speicher bis zum Reload |
| IndexedDB ohne `try/catch` | scheitert bei vollem Speicher, im privaten Fenster, bei gesperrten Daten |
| Komponente **innerhalb** einer Render-Funktion definiert | React baut sie bei jedem Durchlauf neu, Zustand und Fokus gehen verloren |
| Klartext-Passwort in `localStorage` | nur den Hash ablegen, das Passwort bleibt im Arbeitsspeicher |
| Fremdbibliothek per CDN | **scheitert an der CSP** — lokal ablegen |
| Englische Fehlermeldung | die Oberfläche spricht Deutsch, und in vier weiteren Sprachen |

### Vor dem Deploy

- [ ] `npm test` grün (134 Testdateien)
- [ ] `npm run lint` ohne Befund
- [ ] `npm run size` innerhalb der Grenze
- [ ] **i18n-Parität**: neue Texte in allen fünf Sprachen, nicht nur in `de.js`
- [ ] Tastaturbedienung: Tab-Reihenfolge, Escape schliesst, Enter sendet
- [ ] Keine Fehler in der Browser-Konsole
- [ ] CSP unverändert: `grep -c "cdn" index.html` → 0
- [ ] Neue `or5_`-Schlüssel dokumentiert — sonst findet sie beim nächsten Umzug niemand
- [ ] **Gemergt ist nicht live.** Der Live-Stand wird am ausgelieferten Bundle geprüft, nicht am Branch.

---

## Wie sich dieses Dokument zu den anderen verhält

| Wo | Für wen | Verhältnis |
|---|---|---|
| **`PROMPT.md`** (hier) | Menschen, die das Repo öffnen | beschreibt den Bestand vom 23.09.2026 |
| `ARCHITECTURE_NOTES.md` | schneller Blick | 9 Zeilen; ergänzt diese Datei, ersetzt sie nicht |
| `CLAUDE.md` | Claude in diesem Repo | Arbeitsregeln, nicht Architektur |
| Skill `ordnung-ruhe` | Claude-Sitzungen ausserhalb des Repos | deckt dasselbe Feld ab |

**Bei Widerspruch gilt der Code.** Wenn diese Datei und der Skill auseinanderlaufen, ist das ein
Zeichen, dass einer von beiden nachgemessen werden muss — nicht, dass einer gewinnt.

---

*Geschrieben am 23.09.2026 aus Claude Code, gegen den Bestand gemessen. Wer diese Datei
ändert: die Zahlen neu erheben, nicht fortschreiben — die Befehle stehen jeweils daneben.*
