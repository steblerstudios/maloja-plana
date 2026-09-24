// K119 · Die Fehlermeldung für den Melde-Entwurf, ohne mitzitierte Eingaben.
//
// Browser zitieren in manchen Fehlermeldungen den Wert, an dem sie gescheitert sind — bei
// JSON etwa Chrome `Unexpected token 'a', "abc…" is not valid JSON`, Safari `Unexpected
// identifier "abc"`. Steht dort eine Angabe aus Maloja, wanderte sie in den Mail-Entwurf
// (Vorab-Prüfung 24.09.2026, sicherheits- und rechts-pruefer). Darum:
//   • alles zwischen Anführungszeichen (" ' ` “ ” « » ‹ ›) wird zu …
//   • Ziffernfolgen ab 3 Ziffern, auch mit Punkt/Leerzeichen/Strich dazwischen
//     (AHV-Nummer, Telefon, IBAN-Teile, Beträge) werden zu #
// Die Art des Fehlers bleibt lesbar — ohne sie ist eine Absturz-Meldung kaum nachstellbar.
const ZITAT = /"[^"]*"|'[^']*'|`[^`]*`|“[^”]*”|«[^»]*»|‹[^›]*›/g;
const ZIFFERN = /\d(?:[\d.\s'’-]*\d){2,}/g;

export function meldungOhneEingaben(meldung, max = 200) {
  return String(meldung ?? '')
    .replace(ZITAT, (z) => z[0] + '…' + z[z.length - 1])
    .replace(ZIFFERN, '#')
    .slice(0, max);
}
