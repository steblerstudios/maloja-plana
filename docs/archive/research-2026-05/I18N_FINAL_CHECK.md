# Maloja Plana — I18N Final Check

**Datum:** 2026-06-08
**Geprüft:** Alle .jsx-Komponenten auf hardcodierte Strings

---

## Behobene Probleme

| # | Datei | Problem | Fix |
|---|-------|---------|-----|
| 1 | `MobileNav.jsx:185` | "100% local. No data leaves your device." hardcoded in English | Ersetzt durch `t('nav.privacyNote')`, Key in DE/EN/FR/IT hinzugefügt |
| 2 | `ChapterView.jsx:40` | "Dokument hinzugefügt" hardcoded in German | Ersetzt durch `tr('chapterView.uploadSuccess')`, Key in DE/EN/FR/IT hinzugefügt |

---

## Neue i18n Keys

### `nav.privacyNote`

| Sprache | Text |
|---------|------|
| DE | 100% lokal. Keine Daten verlassen Dein Gerät. |
| EN | 100% local. No data leaves your device. |
| FR | 100% local. Aucune donnée ne quitte ton appareil. |
| IT | 100% locale. Nessun dato lascia il tuo dispositivo. |

### `chapterView.uploadSuccess`

| Sprache | Text |
|---------|------|
| DE | Dokument hinzugefügt |
| EN | Document added |
| FR | Document ajouté |
| IT | Documento aggiunto |

---

## Akzeptierte Ausnahmen

| Datei | String | Grund |
|-------|--------|-------|
| `ErrorBoundary.jsx:59-85` | Englische Fallback-Texte ("Something went wrong", "Try again") | Intentionale Fallbacks für den Fall, dass das i18n-System selbst fehlschlägt. Werden nur im Fehlerfall angezeigt, wenn `t()` nicht verfügbar ist. |
| `ChapterView.jsx:306` | `placeholder: 'name@example.com'` | E-Mail-Format-Beispiel, sprachneutral. |

---

## Verbleibende Platzhalter (nicht i18n, sondern Inhalt)

| Datei | Key | Inhalt |
|-------|-----|--------|
| `de.js:516-519` | `legal.imprint.operator1/2, contact1` | [Platzhalter] — benötigt echte Angaben |
| `en.js:517-520` | `legal.imprint.operator1/2, contact1` | [Placeholder] — benötigt echte Angaben |
| `fr.js:516-519` | `legal.imprint.operator1/2, contact1` | [À compléter] — benötigt echte Angaben |
| `it.js:517-520` | `legal.imprint.operator1/2, contact1` | [Segnaposto] — benötigt echte Angaben |
| `main.jsx:416` | mailto href | `feedback@example.com` — benötigt echte E-Mail |

Diese können erst nach Eingabe der echten Daten durch die Projektverantwortliche behoben werden.

---

*Geprüft am 2026-06-08.*
