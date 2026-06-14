# Rätoromanisch (rm) — Lückenanalyse

**Datum:** 2026-06-14  
**Status:** Nicht aktiviert. Nur Dokumentation.

---

## Ist-Zustand

| Element | Status |
|---|---|
| `src/i18n/rm.js` | Existiert, **0 Bytes** (leer) |
| Import in `src/i18n/index.js` | **Nicht vorhanden** |
| `SUPPORTED`-Array | `['en', 'de', 'fr', 'it']` — **kein `'rm'`** |
| Sprachumschalter (Onboarding) | Zeigt nur 4 Sprachen — **kein Rumantsch** |
| Sprachumschalter (Settings) | Zeigt nur 4 Sprachen — **kein Rumantsch** |
| Übersetzungen | **Keine** — 0 von ~180 Schlüsseln vorhanden |

---

## Was fehlt zur Aktivierung

### 1. Übersetzungen schreiben (~180 Schlüssel)

Alle Texte aus `de.js` müssen nach Rumantsch Grischun übersetzt werden:

- UI-Labels (Buttons, Menü, Navigation): ~60 Schlüssel
- Kapitel-Titel und Beschreibungen: ~30 Schlüssel
- Onboarding-Texte: ~15 Schlüssel
- Formular-Labels und Platzhalter: ~40 Schlüssel
- Fehlermeldungen und Statusmeldungen: ~15 Schlüssel
- Impressum und rechtliche Texte: ~10 Schlüssel
- Tooltips und Hilfstexte: ~10 Schlüssel

### 2. `rm.js` befüllen

Gleiche Struktur wie `de.js` / `en.js`:
```javascript
export default {
  common: { ... },
  onboarding: { ... },
  chapters: { ... },
  // ...
};
```

### 3. Import in `index.js` hinzufügen

```javascript
import rm from './rm.js';
```

Und zum Translations-Objekt hinzufügen.

### 4. `SUPPORTED`-Array erweitern

```javascript
const SUPPORTED = ['en', 'de', 'fr', 'it', 'rm'];
```

### 5. Sprachumschalter anpassen

- Onboarding.jsx: Grid von 2×2 auf 2×3 oder 3×2 erweitern
- Settings: Dropdown/Liste um Rumantsch erweitern
- Label definieren: `langLabels.rm = 'Rumantsch'`

### 6. Browser-Erkennung

`navigator.language` gibt für Rumantsch `rm` zurück. Die bestehende Spracherkennungs-Logik in `index.js` sollte `rm` automatisch erkennen, sobald es in `SUPPORTED` steht.

---

## Aufwandsschätzung

| Aufgabe | Geschätzter Aufwand |
|---|---|
| Übersetzungen (mit Muttersprachler-Review) | 8–12 Stunden |
| Technische Integration (Code) | 1–2 Stunden |
| Onboarding-Grid anpassen | 30 Minuten |
| Test aller Ansichten in rm | 2–3 Stunden |
| **Total** | **12–18 Stunden** |

---

## Besondere Herausforderungen

### Welches Rumantsch?

Es gibt 5 regionale Idiome + Rumantsch Grischun (Standardsprache seit 1982):

| Idiom | Region |
|---|---|
| Sursilvan | Vorderrheintal |
| Sutsilvan | Hinterrheintal |
| Surmiran | Albulatal |
| Puter | Oberengadin |
| Vallader | Unterengadin |
| **Rumantsch Grischun** | Standardsprache (Bund, SRG, Schulen) |

**Empfehlung:** Rumantsch Grischun verwenden — offizielle Schriftsprache des Bundes, wird in Schulen gelehrt, von SRF RTR und der Bundesverwaltung verwendet.

### Fachbegriffe

Viele Verwaltungs- und Versicherungsbegriffe (AHV, IV, EL, BVG, Krankenkasse) haben keine etablierten rumantschischen Entsprechungen. Die Bundeskanzlei führt die Terminologie-Datenbank TERMDAT — dort prüfen.

### Kleine Zielgruppe

~60'000 Muttersprachler. Davon nutzen die meisten digitale Dienste auf Deutsch. Symbolische Bedeutung ist grösser als die Nutzungszahlen.

---

## Empfehlung

Rumantsch ist für Maloja Plana **identitätsstiftend**, nicht nutzungsgetrieben. Eine Schweizer Lebensorganisations-App ohne die vierte Landessprache hat eine Lücke.

Priorität: **Mittel** — nach den Kernfunktionen, aber vor der nächsten grossen Feature-Phase.
