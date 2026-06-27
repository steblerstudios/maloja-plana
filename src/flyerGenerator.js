// Druckbarer Verteil-Flyer (A6-artig) mit QR-Code zu malojaplana.ch.
// Reines HTML für openPrintWindow → Nutzer:in druckt oder speichert als PDF.
// Keine neue Dependency: QR kommt als data-URL aus dem vorhandenen QRCode-Vendor.

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
));

export function buildFlyerHtml({ t, qrDataUrl }) {
  const claim = esc(t('flyer.claim'));
  const lead = esc(t('flyer.lead'));
  const points = [t('flyer.point1'), t('flyer.point2'), t('flyer.point3')]
    .map((p) => '<li>' + esc(p) + '</li>').join('');
  const scan = esc(t('flyer.scan'));
  const foot = esc(t('flyer.foot'));
  const img = qrDataUrl ? '<img src="' + qrDataUrl + '" alt="QR malojaplana.ch">' : '';

  return '<!DOCTYPE html><html><head><meta charset="utf-8">'
    + '<title>Maloja Plana — Flyer</title><style>'
    + '@page { size: A4; margin: 18mm; }'
    + '* { box-sizing: border-box; }'
    + 'body { font-family: "Lexend", -apple-system, system-ui, Segoe UI, Roboto, sans-serif; color: #1F2421; margin: 0; display: flex; justify-content: center; align-items: flex-start; }'
    + '.flyer { width: 105mm; padding: 14mm 12mm; text-align: center; border: 1px solid #D8D8D2; border-radius: 6mm; }'
    + '.brand { font-size: 26pt; font-weight: 700; letter-spacing: -0.5px; }'
    + '.claim { font-size: 11.5pt; color: #5B6B61; margin-top: 3mm; line-height: 1.4; }'
    + '.lead { font-size: 10.5pt; color: #3A403B; margin-top: 6mm; line-height: 1.5; }'
    + 'ul { list-style: none; padding: 0; margin: 6mm 0; text-align: left; display: inline-block; }'
    + 'li { font-size: 10pt; margin: 2.2mm 0; padding-left: 6mm; position: relative; line-height: 1.4; }'
    + 'li::before { content: "✓"; position: absolute; left: 0; color: #7E9F8C; font-weight: 700; }'
    + '.qr { margin-top: 4mm; }'
    + '.qr img { width: 42mm; height: 42mm; image-rendering: pixelated; }'
    + '.scan { font-size: 9.5pt; color: #5B6B61; margin-top: 2mm; }'
    + '.url { font-size: 13pt; font-weight: 700; margin-top: 1mm; letter-spacing: 0.3px; }'
    + '.foot { font-size: 8pt; color: #8A8F89; margin-top: 6mm; }'
    + '@media print { .flyer { border: none; } }'
    + '</style></head><body onload="window.focus();window.print();">'
    + '<div class="flyer">'
    + '<div class="brand">Maloja Plana</div>'
    + '<div class="claim">' + claim + '</div>'
    + '<div class="lead">' + lead + '</div>'
    + '<ul>' + points + '</ul>'
    + '<div class="qr">' + img + '</div>'
    + '<div class="scan">' + scan + '</div>'
    + '<div class="url">malojaplana.ch</div>'
    + '<div class="foot">' + foot + '</div>'
    + '</div></body></html>';
}
