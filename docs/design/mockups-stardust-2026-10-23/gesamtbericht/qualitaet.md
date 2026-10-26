# Qualität – Gesamtbericht (Teilergebnisse)

## Tests (vitest, ganze Suite)
- 363 Dateien, 6555 Tests: 362 Dateien / 6553 Tests grün, 2 rot (Zeitlimit 5 s).
- Rot: src/__tests__/geldEineQuelle.test.js (Zeilen 60, 71), Dauer 6.5 s / 6.1 s unter Last.
- Einzeln wiederholt: 9/9 grün (8.4 s) -> WACKELIG, kein Fehler (Test scannt den ganzen Quellbaum).

## Dependencies
- package.json: Runtime-Deps react, react-dom UND three (^0.186.0) -> Abweichung vom Ziel "nur React". Prüfen, ob freigegeben.

## ESLint
- `eslint src`: exit 0, 0 Fehler, 0 Warnungen.

## Build
- `npm run build`: exit 0, 3m07s. Einzige Warnung: Chunks >500 kB (de/en/fr/it/rm je 546-793 kB, Baum3D 568 kB).

## Size
- index-*.js gzip: 64.89 kB von 65 kB (Reserve 0.11 kB) -> praktisch am Deckel.

## i18n
- vitest src/i18n: 5 Dateien, 93 Tests gruen (Paritaet de/en/fr/it/rm).

## PII-Scan
- NICHT gelaufen: .pii-deny.txt fehlt im Arbeitsbaum (Skript bricht bewusst ab). Verlinken nicht erlaubt (nur qualitaet.md schreibbar).

## Seiten ohne Test (VALID_VIEWS: 86 Strings, src/utils/hashRouter.js:20; Heuristik: Test importiert die Komponentendatei)
- Ohne jeden Bezug: lebensmappe, unfallkrankheit, kkerst, betreibungsauszug, bestattung, wohnunggekuendigt, installApp.
- Nur Routing-/Register-/Quellen-Tests (View-String, Komponente nie importiert): dashboard, chapter, budget, kreditkarte, cv, unterlagen, notifications, notfalleinstieg, notfallkarte, gesundheit, situationen, asyl, pensionierung, selbstaendigkeit, heirat, kind, trennung, bewilligung, todesfall, iv, flyer, obstgarten, fuehrerausweis, dienst, volljaehrig, ausweis, wegzug, adoption, zusammenziehen, ergaenzungsleistungen, vorsorgeauftrag, patientenverfuegung, einbuergerung, zuzug, aussteuerung, quellensteuer, taxImport.
- Rest: Komponentendatei von >=1 Test importiert.

## CSP
- index.html:6: default-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none' -> self-only.
- fetch/XMLHttpRequest/WebSocket/EventSource/sendBeacon in src (ohne Tests): 0 Treffer.
- Externe URLs in src: nur Link-Ziele/Datenfelder (href/url), nichts wird geladen. cvGenerator.js:206 "$schema" ist reiner Export-String.

## Speicher
- localStorage-Zugriffe 134; 20 ohne try/catch im 6-Zeilen-Fenster (crude Heuristik): utils/autoBackup.js:155,257,329,389,390; utils/backupCrypto.js:242-259; utils/prerestore.js:16; utils/secureStore.js:142,161,183-186,263,271,272. Aeusserer try moeglich -> von Hand pruefen.
- Literal-Keys ohne or5_-Prefix: 0.
