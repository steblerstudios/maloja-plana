# Maloja Plana — Execution Roadmap

Stand: 2026-06-13
Build: grün (193 KB gzip, 86 Module)
Basis: 7 Kapitel, 17+ Views, i18n (DE/EN/FR/IT), localStorage + IndexedDB

---

## Priorität 1 — Fundament für echte Nutzung

### ~~E-01: Lebenssatz am Ort der Arbeit~~ ✅ BEREITS VORHANDEN
MirrorCards.jsx rendert Lebenssätze für alle 7 Kapitel direkt in der ChapterView.

### ~~E-02: MVO-Einstieg (Minimum Viable Ordnung — 18 Felder)~~ ✅ ERLEDIGT 2026-06-13
18 Felder mit `mvo: true` markiert. Dashboard zeigt "Deine Grundordnung: X/18" mit kontextuellem Text (empty/progress/complete). i18n in DE/EN/FR/IT.

### ~~E-03: Notfall als alternativer Einstieg~~ ✅ ERLEDIGT 2026-06-13
3 Szenarien (Unfall/Spital/Behördengang) mit Feld-Checklisten, Live-Fortschritt, Direkt-Navigation zu fehlenden Kapiteln. Erreichbar via Dashboard "Notfallinformationen prüfen" und `#/notfalleinstieg`.

---

## Priorität 2 — Emotionale Vollständigkeit

### ~~E-04: Ankunftsmomente~~ ✅ ERLEDIGT 2026-06-14
Beim ersten Ausfüllen eines Kapitels erscheint ein ruhiger Satz (z.B. "Dein Zuhause hat jetzt einen Platz."). Erkennung via `filledCount` 0→1 Übergang, localStorage-Persistenz (`or5_ankunft_<key>`), 6s Einblendung mit `fadeIn`. i18n in DE/EN/FR/IT für alle 7 Kapitel.

### E-05: Kapitelabschlüsse
**Was:** Visueller Zustand "abgeschlossen" pro Kapitel. Nicht binär, sondern: leer → begonnen → Grundordnung → vollständig. Sichtbar im Dashboard.
**Wo:** `Dashboard.jsx` (Tier-Berechnung), `constants.js` (Schwellenwerte)
**Aufwand:** Klein (1 Session)

### E-06: Sichtbare Synthesen
**Was:** Dashboard zeigt nicht nur Fortschritt, sondern Zusammenfassung: "Du wohnst in Zürich, versichert bei CSS, Einkommen CHF 5'200." Lebenssatz aus echten Daten.
**Wo:** `Dashboard.jsx` (neuer Synthese-Block), Hilfsfunktion in `utils/helpers.js`
**Aufwand:** Mittel (1-2 Sessions)

---

## Priorität 3 — Visuelle Identität

### E-07: Schweizer Design-Layer (Retro-Mania)
**Was:** Typografie-Lift (12→15px), Materiality (shadows, depth), semantische Farbdramaturgie, emotionale Temperatur für schwere Themen (Sozialhilfe, Schulden → wärmer).
**Wo:** `tokens.css`, `tokens.js`, alle Views (schrittweise)
**Aufwand:** Gross (3-4 Sessions, schrittweise)
**Abhängigkeiten:** Keine. Kann parallel zu allem laufen.

### E-08: Schweizer Ikonographie vervollständigen
**Was:** 17 SVGs existieren in `maloja-icons/`. Integration ins Icon-System (`IconSystem.jsx`), Einsatz im Dashboard als Kapitel-Stationen.
**Wo:** `IconSystem.jsx`, `maloja-icons/` → `public/` oder inline, `Dashboard.jsx`
**Aufwand:** Mittel (1-2 Sessions)
**Abhängigkeit:** E-07 (Design-Layer) bestimmt Grössen und Farben.

---

## Priorität 4 — Validierung

### E-09: Beta mit echten Menschen
**Was:** 3-5 Testpersonen. Onboarding-Flow prüfen. MVO-Pfad testen. Notfall-Einstieg testen. Feedback sammeln.
**Wo:** Kein Code — Prozess. `BetaGate.jsx` existiert bereits.
**Aufwand:** 1-2 Wochen (extern)
**Abhängigkeit:** E-01, E-02, E-03 müssen stehen.

---

## Reihenfolge

```
Woche 1:  E-01 (Lebenssätze)  →  E-02 (MVO-Einstieg)
Woche 2:  E-03 (Notfall-Einstieg)  →  E-04 (Ankunftsmomente)
Woche 3:  E-05 (Kapitelabschlüsse)  →  E-06 (Synthesen)
Woche 4:  E-07 (Design-Layer, Start)  →  E-08 (Ikonographie)
Woche 5+: E-07 (Design-Layer, Abschluss)  →  E-09 (Beta)
```

---

## Regeln

- Jedes Ticket = 1 Session, 1 Commit, Build grün
- Kein neues Review ohne echten Blocker
- Keine neuen Dependencies
- Keine Architektur-Änderungen
- localStorage-Keys und Schemas bleiben unverändert
