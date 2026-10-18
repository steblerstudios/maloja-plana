// ─── Nach einem Deploy: fehlendes Programmteil → einmal neu laden ────────────
// Der Produktions-Deploy räumt alte Dateien in assets/ weg (deploy.sh, «Verwaiste
// Build-Dateien»). Ein Tab, der über einen Deploy hinweg offen blieb, kennt noch die
// alten Namen: öffnet die Person danach eine Ansicht, die nachgeladen wird, kommt
// 404 (Befund 18.10.2026, Infomaniak-Statistik: `index-c41fa79f.js` u. a.). Bisher
// stand dann der Fehlerschirm da, und man musste selbst «Neu laden» drücken.
//
// Vite meldet das als `vite:preloadError`. Wir laden darauf genau einmal neu — dann
// kommt die neue index.html mit den neuen Namen. Die Daten liegen lokal und sind
// davon nicht berührt. Sperre: wer innert einer Minute erneut scheitert (z. B.
// offline), bekommt den Fehlerschirm wie bisher, nie eine Neu-Lade-Schleife.
// Lässt sich die Sperre nicht merken (Speicher gesperrt), wird nicht neu geladen.

const SCHLUESSEL = 'maloja:neuGeladenNachDeploy';
export const SPERRE_MS = 60_000;

export function sollNeuLaden(jetzt, letzter) {
  return !(Number.isFinite(letzter) && letzter > 0 && jetzt - letzter < SPERRE_MS);
}

export function installiereNeuLadenNachDeploy(fenster = window) {
  fenster.addEventListener('vite:preloadError', () => {
    let letzter = NaN;
    try {
      letzter = Number(fenster.sessionStorage.getItem(SCHLUESSEL));
    } catch (e) {
      return;
    }
    const jetzt = Date.now();
    if (!sollNeuLaden(jetzt, letzter)) return;
    try {
      fenster.sessionStorage.setItem(SCHLUESSEL, String(jetzt));
    } catch (e) {
      return;
    }
    fenster.location.reload();
  });
}
