# Design-Backlog — gesammelte Politur für die Design-Phase

> Stand: 2026-07-06 · lebendes Dokument
>
> **Zweck:** Design-Verbesserungen werden hier gesammelt und in einer eigenen
> Design-Phase **gebündelt** angegangen — nicht verstreut zwischendurch. von Stebler Studios
> Prinzip: „Design-Entscheide immer schritt-für-schritt gemeinsam; der Aufbau ist
> mir persönlich wichtig." Also: hier notieren, später zusammen entscheiden.
>
> Verwandt: `UX_PLAYBOOK.md`, `docs/design/design-reality-audit.md`,
> `docs/product/design-language-registry.md`.

---

## A — Typografische Mikro-Politur (CSS, risikoarm)

Kleine, ruhige Feinheiten fürs Schriftbild. Alle degradieren still (alte Browser
ignorieren sie), keine JS-Kosten.

| Kandidat | Was | Status |
|----------|-----|--------|
| `text-wrap` | `balance` für Überschriften (h1–h4), `pretty` für Fliesstext (`p`) — ruhiger Umbruch, keine Waisen-Wörter/Hurenkinder | ✅ **erledigt** (`af041bd`, in `tokens.css`) |
| `text-rendering: optimizeLegibility` + `font-kerning` | Kerning + Standard-Ligaturen app-weit — ruhigeres Schriftbild, null Layout-Risiko | ✅ **erledigt** (#4, in `index.html` body) |
| **geschützte Leerzeichen (CHF-Sweep)** | `CHF 800`, `30 Sek.`, `5 %` sollen nie umbrechen. **Befund #4:** `'CHF ' + …` steht VERSTREUT in Dutzenden Dateien (kein zentraler Formatierer). Sauberer Weg: **einen** geteilten `formatCHF(v)`-Helper (utils) mit ` ` + `tabular-nums`, dann die Call-Sites migrieren — bewusst als EIN gebündelter Durchgang, nicht verstreut | offen — nächster #4-Slice (eigener Durchgang) |
| `font-variant-numeric: tabular-nums` | CHF-Beträge in Listen/Tabellen sauber untereinander ausrichten (Franchise-Tracker, Budget, Spiegelkarten) — am besten zusammen mit dem CHF-Helper oben | offen — Kandidat |
| `hyphens: auto` + `lang` | lange deutsche Komposita (z. B. „Krankenversicherungsprämie") in schmalen Spalten sauber trennen; braucht korrektes `lang`-Attribut je Sprache | offen — prüfen |
| `hanging-punctuation: first` | hängende Anführungszeichen bei Zitaten/Info-Boxen (v. a. Safari) | offen — nice-to-have |
| optische Randausrichtung | Aufzählungs-/Karten-Ränder optisch bündig (Detail) | offen — nice-to-have |

## B — Materialität & Skeuomorphismus-Metaphern

Aus dem Memory-Katalog (Vision, **nicht** vor der Design-Phase bauen). Pro
Lebensbereich die reale Metapher — „Swiss Living Skeuomorphism", 5 Regeln.

- Arztkoffer (Gesundheit), Aktenschrank/Tresor-Ordner (Dokumente), Thermobeleg/
  Kassenbon (Finanz-Quittungen — teils gebaut), Betreibungs-/Verlustschein
  (entgiften statt einschüchtern — offen), Lohnausweis/CV/Kalender-Optik.
- **Lebensbaum-Navigation** (DatenWirken → Baum, der mit Daten wächst; Fortschritt
  ohne Prozentzahl). Berge haben schon ein Easter-Egg-System.
- Quellen als „Schweizer Bibliothek" darstellen.
- Katalog/Karteikartenbox als Metapher fürs Werkzeug-Regal.

## C — Konkrete Optik-Baustellen (aus Feedback/Braindumps)

- **Auflistungs-Optik** gefällt Stebler Studios nicht → Redesign der Listendarstellung
  (Braindump 10). Vor neuen Listen-Features zuerst die Optik klären.
- **Dashboard-Politur** (Redesign „Ort" — 6 Schichten umgesetzt): Baum-Optik ✅ **Baum v2**
  (echter SVG-Baum, Früchte an Ästen, 4 Wuchsstufen — `9d126c4`/`91e7cdf`); Dashboard-Fluss ✅
  **„Was ist jetzt dran?" oben + Baum als Spiegel unten** (`000e731`). Offen: Verbindungs-Viz
  in den Baum integrieren (Stebler Studios: vorerst lassen), Schicht-2-Einzelkarte, Anspruchs-Matrix-Darstellung.
- **Info-Buttons** einheitlich ein-/ausklappbar (click-to-reveal, selektiv — nicht
  überall) als durchgängiges Muster.

## D — Prinzipien (gelten in der Design-Phase)

- Zusammenhänge statt Informationen (UX-Playbook-Kern-These).
- Ruhe/Calm-Tech: nichts blinkt, nichts drängt; Bewegung nur langsam (vgl.
  `mp-breathe`-Ladeanimation).
- Quellen-Link aufs semantische Wort, kein nackter Domain-Lärm.
- Accessibility-Modi (Atkinson-Lesbarkeit, reduced-motion) überall mitdenken.

## E — Brain-Dump 2026-07-13 (neue Instrumente & offene Fragen)

> Roh von Stebler Studios notiert, damit nichts verloren geht. **Nicht gebaut** —
> hier gesammelt, später schritt-für-schritt gemeinsam entscheiden.

**Neue Schnellcheck-Instrumente (wie IPV/Sozialhilfe/EL):**
- **Lohn-Einordnung / Mindestlohn-Checker.** Analog zu den bestehenden Schnellchecks:
  Liege ich unter/über dem (kantonalen) Mindestlohn? Dazu die Einordnung zum
  **Medianlohn** und zum Durchschnittslohn — wenn jemand darüber liegt: *wie viel
  mehr (prozentual)* verdient er als der durchschnittliche/mediane Schweizer, und
  *wie viel in der Summe* über/unter Median- bzw. Durchschnittslohn. Auch **Miet-Themen**
  in diesem Zug mitdenken (Mietzins-Einordnung wie die anderen Checks).
- **Betreibungsverfahren als „harter" Flow.** Bewusst als klarer Ablauf dargestellt
  mit drei Rollen/Köpfen: **Gläubiger betreibt → Schuldner**. Entgiften statt
  einschüchtern (vgl. B: Betreibungs-/Verlustschein). Offene Frage: welche *weiteren*
  Verfahren verdienen so eine erklärte Flow-Darstellung?

**Trust / Sicherheit:**
- **Tresor-Lock (Code oder Face ID / Biometrie), „irgendwann".** Ein echter At-Rest-
  Schutz der lokalen Daten — heute NICHT vorhanden (siehe ⚠️-Befund unten). Verwandt:
  `maloja-trust-layer`.
- ⚠️ **Sicherheits-Befund (2026-07-13):** Der `BetaGate` ist ein *weiches*, client-
  seitiges Zugangs-Gate (SHA-256-Code, per `localStorage.or5_beta_access` umgehbar —
  im Code selbst so dokumentiert, `BetaGate.jsx:10-13`). Die **„Einfache Ansicht"
  ist KEIN Bypass** — nur ein Icon-/Vorlese-Modus, sie schaltet den Gate nicht frei.
  Aber: die eigentlichen Daten (`or5_data`) liegen **unverschlüsselt** im localStorage
  (nur Export/Backup ist verschlüsselt, `backupCrypto.js`). Es gibt heute **kein
  Passwort/Lock auf den Daten selbst**. Für ein „Schloss auf meinen Unterlagen"-Gefühl
  braucht es entweder Client-Verschlüsselung mit Nutzer-Passphrase (At-Rest) oder einen
  Server (echte Zugangskontrolle). Kein Remote-Angriffsvektor (local-first, CSP self-only).
  - ⛔ **Phase-2b-Vorbedingung:** das dormant `secureStore`-Fundament hat 4 bestätigte 🔴
    (Dokumente unverschlüsselt, Klartext-Reste, Crash bei korruptem Record, leeres Backup
    bei aktivem Tresor) + Härtung (PBKDF2 100k→600k, Passphrase-Mindestlänge, Backup-Zwang).
    Alle MÜSSEN vor der UI-Verdrahtung behoben sein — Details in `docs/design/tresor-lock.md`.

**Plattform:**
- **App-Store-/iOS-Anforderungen recherchieren** (PWA vs. native, Store-Guidelines,
  was sonst noch nötig ist), bevor ein Store-Weg eingeschlagen wird.

**Korrektheit (⚠️ Befund, siehe Task):**
- ⚠️ **Sozialhilfe ↔ Krankenkassen-Prämie (2026-07-13).** `calculateSozialhilfe`
  rechnet die **volle** KK-Prämie in den Bedarf (`cantonalData.js:284-286`), ohne IPV
  abzuziehen; der Schnellcheck **summiert** IPV + Sozialhilfe → die gleiche Prämien-
  Entlastung wird **doppelt** gezählt (Summe überzeichnet um ~den IPV-Betrag). Real
  ist Sozialhilfe *subsidiär* — IPV zuerst, Sozialhilfe deckt nur den Rest (Prämie bis
  zur kantonalen Richtprämie). Fix braucht `swiss-precision`/`rechts-`Prüfer + Quelle
  (SKOS C.5 / KVG); Berechnung nur mit Freigabe anfassen (Leitplanke).
