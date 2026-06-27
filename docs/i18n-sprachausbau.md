# i18n-Sprachausbau — Asyl-Sprachen

> Stand: Juni 2026 · Status: **Gerüst gebaut, Übersetzungen ausstehend**

Ziel: Maloja Plana für Asylsuchende in deren Erstsprache zugänglich machen.
Die App ist bereits auf viele Sprachen vorbereitet (Sprach-Combobox statt fixer
Buttons, lazy-geladene Sprachdateien, `?lang=`-URLs, hreflang, RTL-Support).
Dieser Plan beschreibt, **wie** eine neue Sprache aktiviert wird und **welche
Inhalte zuerst** übersetzt werden.

## Grundsatz: keine Maschinenübersetzung für sensible Inhalte

Asyl-, Rechts- und Behördeninhalte richten sich an Menschen in verletzlichen
Situationen. Eine fehlerhafte Übersetzung kann schaden. Darum:

- **Keine automatische/KI-Übersetzung** der App-Inhalte.
- Übersetzungen durch **Menschen mit Fachbezug** (idealerweise mit Asyl-/
  Migrationskontext), Review durch eine zweite Person.
- Bis eine Sprache verifiziert ist, wird sie **nicht** in `SUPPORTED`
  aufgenommen (sonst zeigt die Combobox eine Sprache mit überwiegend
  englischem Fallback — schlechter als kein Angebot).

## Zielsprachen (Priorität nach Verbreitung bei Asylsuchenden in CH)

| Code | Sprache | Schrift | Richtung | Hinweis |
|------|---------|---------|----------|---------|
| `ti` | Tigrinya | Ge'ez | LTR | Eritrea/Äthiopien — grosse Gruppe |
| `ar` | Arabisch | Arabisch | **RTL** | Layout-Spiegelung nötig (vorhanden) |
| `sq` | Albanisch | Latein | LTR | Westbalkan |

Native Namen sind in `main.jsx` (`LANGUAGE_NATIVE_NAMES`) bereits hinterlegt.

## Priorisierte Übersetzungs-Teilmenge (Reihenfolge)

Nicht alle ~82 Namespaces auf einmal. Zuerst das, was Orientierung in einer
Notlage gibt:

1. **Sprachwahl & Navigation** — `common.*`, `nav.*` (App bedienbar machen)
2. **Asyl** — `asyl.*` (Kern: Status, Verfahren, Rechte, Fristen, Beratung)
3. **Notfall** — `notfall.*`, Notfallkarte (Sicherheit)
4. **Onboarding & Trust** — `onboarding.*`, Datenschutz-Kernsätze
5. **Gesundheit/Versicherung Grundlagen** — `versicherungen.*` Einstieg
6. Rest schrittweise.

Der i18n-Resolver fällt für noch nicht übersetzte Keys automatisch auf Englisch
zurück (`createT` in `i18n/index.js`), eine Teilübersetzung bricht die App also
nicht — sie wird nur erst aktiviert, wenn die Stufen 1–4 verifiziert sind.

## Technische Aktivierung einer Sprache (Checkliste)

Wenn eine verifizierte Sprachdatei `src/i18n/<code>.js` vorliegt:

1. `src/i18n/index.js`:
   - Code zu `SUPPORTED` hinzufügen.
   - Loader ergänzen: `<code>: () => import('./<code>.js'),`
   - Bei RTL-Sprache: Code zu `RTL_LANGUAGES` hinzufügen (Arabisch ist `ar`).
2. `main.jsx`: nativer Name ist in `LANGUAGE_NATIVE_NAMES` meist schon vorhanden.
3. `index.html`: `hreflang`-Link für die neue Sprache ergänzen.
4. Test `src/i18n/__tests__/i18n.test.js` deckt RTL/LTR ab; ggf. einen
   Vollständigkeits-Test für die Pflicht-Namespaces (Stufe 1–4) ergänzen.
5. `npm test -- --run` und `npm run build` grün.

## RTL (Arabisch)

- `i18n/index.js` setzt `<html dir="rtl">` automatisch für RTL-Sprachen
  (`isRTL()` / `applyHtmlLang()`).
- Vor Aktivierung von `ar`: Layout im Preview prüfen — die Inline-Styles nutzen
  teils feste `left/right`-Werte (z.B. Sprach-Combobox, Icons). Diese auf
  logische Eigenschaften (`inset-inline-start/-end`) bzw. `dir`-bewusste Werte
  umstellen, wo die Spiegelung sonst falsch sitzt.

## Offen / nächster Schritt

- Übersetzer:innen / Partnerorganisation für `ti`, `ar`, `sq` finden
  (z.B. über die im Asyl-Modul verlinkten Stellen: SFH, Caritas, HEKS).
- Mit Stufe 1–2 (Navigation + Asyl) je Sprache starten, dann aktivieren.
