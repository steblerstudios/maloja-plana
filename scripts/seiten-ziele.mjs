// Wohin ein Weg von einer öffentlichen Seite in die App führt: eine Quelle für alle Seiten.
// Benutzt von scripts/build-seiten.mjs («Beispiel ansehen») und scripts/seiten/kantonsatlas.mjs
// (der Weg unter jeder Karte, Brückenstück 09.11.2026). Ändert sich die Adresse der App, hier ändern.
// Das Beta-Tor lässt die Adresse durch — nach «Ohne Code ausprobieren» steht man dort, mit Code ebenso.
export const appAnsicht = (view) => `/app/#/${view}`;
// Dieselbe Ansicht, aber ohne Zugangscode direkt im Beispiel (src/BetaGate.jsx, beispielAusAdresse: der Zusatz
// fällt sofort weg, der Anker bleibt). Wer Zugang hat, bekommt die eigene App. Seit «App nach /app/» (#776/#779)
// zeigen beide direkt auf /app/; alte Links auf / leitet /weiterleitung.js weiter.
export const appBeispiel = (view) => `/app/?beispiel#/${view}`;
