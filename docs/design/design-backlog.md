# Design-Backlog — gesammelte Politur für die Design-Phase

> Stand: 2026-07-06 · lebendes Dokument
>
> **Zweck:** Design-Verbesserungen werden hier gesammelt und in einer eigenen
> Design-Phase **gebündelt** angegangen — nicht verstreut zwischendurch. Sophies
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
| `text-wrap` | `balance` für Überschriften (h1–h4), `pretty` für Fliesstext (`p`) — ruhiger Umbruch, keine Waisen-Wörter | ✅ **erledigt** (`af041bd`, in `tokens.css`) |
| `font-variant-numeric: tabular-nums` | CHF-Beträge in Listen/Tabellen sauber untereinander ausrichten (Franchise-Tracker, Budget, Spiegelkarten) | offen — Kandidat |
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

- **Auflistungs-Optik** gefällt Sophie nicht → Redesign der Listendarstellung
  (Braindump 10). Vor neuen Listen-Features zuerst die Optik klären.
- **Dashboard-Politur** (Redesign „Ort" — 6 Schichten umgesetzt, offen nur Politur):
  Baum-Optik verfeinern, Schicht-2-Einzelkarte, Anspruchs-Matrix-Darstellung.
- **Info-Buttons** einheitlich ein-/ausklappbar (click-to-reveal, selektiv — nicht
  überall) als durchgängiges Muster.

## D — Prinzipien (gelten in der Design-Phase)

- Zusammenhänge statt Informationen (UX-Playbook-Kern-These).
- Ruhe/Calm-Tech: nichts blinkt, nichts drängt; Bewegung nur langsam (vgl.
  `mp-breathe`-Ladeanimation).
- Quellen-Link aufs semantische Wort, kein nackter Domain-Lärm.
- Accessibility-Modi (Atkinson-Lesbarkeit, reduced-motion) überall mitdenken.
