// K119 · Die Fehlermeldung für den Melde-Entwurf, ohne mitzitierte Eingaben.
//
// Browser zitieren in manchen Fehlermeldungen den Wert, an dem sie gescheitert sind — bei
// JSON etwa Chrome `Unexpected token 'a', "abc…" is not valid JSON`, Safari `Unexpected
// identifier "abc"`. Steht dort eine Angabe aus Maloja, wanderte sie in den Mail-Entwurf
// (Vorab-Prüfung 24.09.2026, sicherheits- und rechts-pruefer). Darum:
//   • alles zwischen Anführungszeichen (" ' ` “ ” „ « » ‹ ›) wird zu …
//   • ein Zitat, das nicht schliesst (die Meldung ist abgeschnitten), fällt bis zum
//     Zeilenende weg — aber nur, wenn das Zeichen ein Zitat ÖFFNET (am Zeilenanfang oder
//     nach Leerzeichen, Klammer, Doppelpunkt, Gleich, Komma), damit «doesn't» stehen bleibt
//   • Ziffernfolgen ab 3 Ziffern, auch mit Punkt/Leerzeichen/Strich dazwischen
//     (AHV-Nummer, Telefon, IBAN-Teile, Beträge) werden zu #
// Die Art des Fehlers bleibt lesbar — ohne sie ist eine Absturz-Meldung kaum nachstellbar.
// Gate 24.09.2026 (0.1.40-beta): „…“ und offene Zitate ergänzt.
const ZITAT = /"[^"]*"|'[^']*'|`[^`]*`|“[^”]*”|„[^“”]*[“”]|«[^»]*»|‹[^›]*›|(?:^|(?<=[\s([:=,]))["'`“„«‹][^\n]*/gm;
const SCHLUSS = { '"': ['"'], "'": ["'"], '`': ['`'], '“': ['”'], '„': ['“', '”'], '«': ['»'], '‹': ['›'] };
const ZIFFERN = /\d(?:[\d.\s'’-]*\d){2,}/g;

const kuerzen = (z) => {
  const letztes = z[z.length - 1];
  const geschlossen = z.length > 1 && SCHLUSS[z[0]].includes(letztes);
  return z[0] + '…' + (geschlossen ? letztes : '');
};

export function meldungOhneEingaben(meldung, max = 200) {
  return String(meldung ?? '')
    .replace(ZITAT, kuerzen)
    .replace(ZIFFERN, '#')
    .slice(0, max);
}
