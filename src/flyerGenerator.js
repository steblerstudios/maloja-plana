// Druckbarer Verteil-Flyer A5, zwei Seiten, mit QR-Code zu malojaplana.ch.
// Reines HTML für openPrintWindow → Nutzer:in druckt oder speichert als PDF.
// Kein onload-Druckaufruf im HTML: das Fenster erbt die CSP der App (script-src
// 'self'), ein Inline-Handler wird dort blockiert — gemessen 25.09.2026. Den Druck
// löst FlyerView aus dem App-Fenster aus.
// Keine neue Dependency: QR kommt als data-URL aus dem vorhandenen QRCode-Vendor.
//
// Aufbau nach dem Druckerei-Flyer vom 21.09.2026 (Vorderseite: Claim, Rückseite:
// drei Schritte) — aber für den Heimdrucker: beide Seiten auf Papierweiss statt
// dunkler Vollfläche (ein Browser druckt nicht randlos, die Fläche bekäme weisse
// Ränder und kostet viel Tinte). Das Logo darum in der hellen Fassung des
// Markenbuchs: einfarbig Anthrazit (siehe MarkenLogo.jsx, «Farbe nach der Fläche»).

// K97-Nachtrag: dieselbe Escape-Funktion wie Dossier/Brief (maskiert auch ').
import { escapeHtml as esc } from './utils/helpers.js';
import { LOGO_PFADE, LOGO_FARBEN } from './components/MarkenLogo.jsx';

const FARBE = {
  text: '#22211F',
  mid: '#55524C',
  // sageDeep der hellen Palette: 6,3:1 auf Weiss — Salbei #8FB0A0 hätte nur rund 2:1.
  salbei: '#4A6657',
  linie: '#7E9F8C',
  sand: '#C4A870',
};

// Der Claim besteht aus zwei Sätzen; der zweite steht in Salbei. Lässt er sich in
// einer Sprache nicht teilen, steht er ganz in Anthrazit — kein Satz geht verloren.
function claimTeilen(claim) {
  const m = claim.match(/^(.+?[.!?])\s+(.+)$/);
  return m ? [m[1], m[2]] : [claim, ''];
}

// Lexend wie in der App (tokens.css). Das Druckfenster erbt die Schriften der App
// nicht — ohne eigene @font-face stand der Flyer in der Systemschrift. Absolute
// Adresse, weil das Fenster about:blank ist; aus einer gespeicherten HTML-Datei
// greift die Adresse nicht, dann bleibt der Rückfall auf die Systemschrift.
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT = 'U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
function schriften(ursprung) {
  return [400, 600, 700].map((w) => [['latin', LATIN], ['latin-ext', LATIN_EXT]].map(([teil, bereich]) =>
    '@font-face { font-family: "Lexend"; font-style: normal; font-weight: ' + w + '; src: url("'
    + ursprung + '/fonts/lexend-' + teil + '-' + w + '-normal.woff2") format("woff2"); unicode-range: ' + bereich + '; }'
  ).join('')).join('');
}

function bildmarke(hoeheMm) {
  const f = LOGO_FARBEN.hell;
  return '<svg class="marke" viewBox="0 0 500 540" style="height:' + hoeheMm + 'mm" aria-hidden="true">'
    + '<path d="' + LOGO_PFADE.weg1 + '" fill="' + f.weg + '"/>'
    + '<path d="' + LOGO_PFADE.berg + '" fill="' + f.berg + '"/>'
    + '<path d="' + LOGO_PFADE.weg2 + '" fill="' + f.weg + '"/>'
    + '</svg>';
}

export function buildFlyerHtml({ t, qrDataUrl, ursprung = (typeof location !== 'undefined' ? location.origin : '') }) {
  const [claimA, claimB] = claimTeilen(t('flyer.claim')).map(esc);
  const lead = esc(t('flyer.lead'));
  const points = [t('flyer.point1'), t('flyer.point2'), t('flyer.point3')]
    .map((p) => '<li>' + esc(p) + '</li>').join('');
  const scan = esc(t('flyer.scan'));
  const foot = esc(t('flyer.foot'));
  const img = qrDataUrl ? '<img src="' + qrDataUrl + '" alt="QR malojaplana.ch">' : '';

  const schritte = [1, 2, 3].map((n) =>
    '<div class="schritt"><div class="nr">0' + n + '</div><div>'
    + '<div class="s-titel">' + esc(t('flyer.step' + n + 'Title')) + '</div>'
    + '<div class="s-text">' + esc(t('flyer.step' + n + 'Text')) + '</div>'
    + '</div></div>').join('');

  return '<!DOCTYPE html><html><head><meta charset="utf-8">'
    + '<title>Maloja Plana — Flyer</title><style>'
    + schriften(ursprung)
    + '@page { size: A5; margin: 0; }'
    + '* { box-sizing: border-box; }'
    + 'body { font-family: "Lexend", -apple-system, system-ui, Segoe UI, Roboto, sans-serif; color: ' + FARBE.text + '; margin: 0; background: #EDEBE6; }'
    + '.seite { width: 148mm; height: 210mm; margin: 8mm auto; padding: 15mm 15mm 13mm; background: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 4px rgba(0,0,0,.12); }'
    + '.kopf { display: flex; align-items: center; gap: 3mm; }'
    + '.marke { display: block; width: auto; }'
    + '.name { font-size: 13pt; font-weight: 600; letter-spacing: -0.2px; }'
    + '.claim { font-size: 27pt; font-weight: 600; line-height: 1.12; letter-spacing: -0.5px; margin-top: 22mm; }'
    + '.claim .b { color: ' + FARBE.salbei + '; display: block; margin-top: 2mm; }'
    + '.strich { width: 13mm; height: 0.8mm; background: ' + FARBE.sand + '; margin: 9mm 0 7mm; }'
    + '.lead { font-size: 14pt; font-weight: 600; line-height: 1.3; max-width: 100mm; }'
    + 'ul { list-style: none; padding: 0; margin: 6mm 0 0; }'
    + 'li { font-size: 10.5pt; color: ' + FARBE.mid + '; margin: 2mm 0; padding-left: 5mm; position: relative; line-height: 1.4; }'
    + 'li::before { content: ""; position: absolute; left: 0; top: 0.62em; width: 2.5mm; height: 0.4mm; background: ' + FARBE.linie + '; }'
    + '.fuss { margin-top: auto; display: flex; align-items: center; gap: 7mm; border-top: 0.3mm solid ' + FARBE.linie + '; padding-top: 7mm; }'
    + '.qr img { display: block; width: 30mm; height: 30mm; image-rendering: pixelated; }'
    + '.scan { font-size: 10pt; color: ' + FARBE.mid + '; }'
    + '.url { font-size: 15pt; font-weight: 700; margin-top: 1.5mm; letter-spacing: 0.2px; }'
    + '.titel { font-size: 19pt; font-weight: 600; line-height: 1.2; letter-spacing: -0.3px; margin-top: 14mm; max-width: 105mm; }'
    + '.schritte { margin-top: 12mm; }'
    + '.schritt { display: flex; gap: 8mm; margin-bottom: 9mm; }'
    + '.nr { font-size: 11pt; font-weight: 600; color: ' + FARBE.salbei + '; width: 7mm; flex-shrink: 0; padding-top: 0.6mm; }'
    + '.s-titel { font-size: 13pt; font-weight: 600; }'
    + '.s-text { font-size: 10.5pt; color: ' + FARBE.mid + '; line-height: 1.45; margin-top: 1.5mm; max-width: 92mm; }'
    + '.start { border-top: 0.3mm solid ' + FARBE.linie + '; padding-top: 7mm; margin-top: auto; }'
    + '.start-titel { font-size: 12.5pt; font-weight: 600; }'
    + '.start-text { font-size: 10.5pt; color: ' + FARBE.mid + '; line-height: 1.45; margin-top: 1.5mm; max-width: 105mm; }'
    + '.start .url { margin-top: 5mm; }'
    + '.hinweis { font-size: 7.5pt; color: ' + FARBE.mid + '; line-height: 1.45; margin-top: 6mm; }'
    + '@media print { body { background: none; } .seite { margin: 0; box-shadow: none; break-after: page; page-break-after: always; } .seite:last-child { break-after: auto; page-break-after: auto; } }'
    + '</style></head><body>'

    // Vorderseite
    + '<section class="seite">'
    + '<div class="kopf">' + bildmarke(11) + '<div class="name">Maloja Plana</div></div>'
    + '<div class="claim"><span class="a">' + claimA + '</span>'
    + (claimB ? '<span class="b">' + claimB + '</span>' : '') + '</div>'
    + '<div class="strich"></div>'
    + '<div class="lead">' + lead + '</div>'
    + '<ul>' + points + '</ul>'
    + '<div class="fuss"><div class="qr">' + img + '</div>'
    + '<div><div class="scan">' + scan + '</div><div class="url">malojaplana.ch</div></div></div>'
    + '</section>'

    // Rückseite
    + '<section class="seite">'
    + '<div class="kopf"><div class="name">Maloja Plana</div></div>'
    + '<div class="titel">' + esc(t('flyer.backTitle')) + '</div>'
    + '<div class="schritte">' + schritte + '</div>'
    + '<div class="start">'
    + '<div class="start-titel">' + esc(t('flyer.startTitle')) + '</div>'
    + '<div class="start-text">' + esc(t('flyer.startText')) + '</div>'
    + '<div class="url">malojaplana.ch</div>'
    + '<div class="hinweis">' + esc(t('flyer.disclaimer')) + '<br>' + foot + '</div>'
    + '</div>'
    + '</section>'
    + '</body></html>';
}
