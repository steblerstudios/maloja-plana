// Einzige Quelle der Wappen-Form für die Instrumente-Familie: das volle
// Schutzschild (Schutzschild.jsx) und die Mini-Glyphe im Dashboard-Spiegel
// (InstrumentePanel.jsx) leiten ihren SVG-Pfad aus derselben Funktion ab —
// kein zweiter hartcodierter Pfad, der auseinanderdriften kann.
//
// Aus einer Bounding-Box (Mitte cx, Oberkante top, Breite w, Höhe hgt) wächst
// dieselbe Form in jeder Grösse. Die Verhältnisse stammen aus dem ursprünglichen
// vollen Wappen (Schulter 0.162, gerade Flanke 0.485, Kurven-Kontrolle 0.779 der
// Höhe) und ergeben es bis auf < 0.1 px identisch neu.
const round2 = (n) => Math.round(n * 100) / 100;

export function shieldPath(cx, top, w, hgt) {
  const hw = w / 2, bottom = top + hgt;
  const shoulderY = round2(top + 0.1618 * hgt);
  const straightY = round2(top + 0.4853 * hgt);
  const ctrlY = round2(top + 0.7794 * hgt);
  const left = cx - hw, right = cx + hw;
  return 'M' + cx + ' ' + top +
    ' L' + right + ' ' + shoulderY +
    ' L' + right + ' ' + straightY +
    ' Q' + right + ' ' + ctrlY + ' ' + cx + ' ' + bottom +
    ' Q' + left + ' ' + ctrlY + ' ' + left + ' ' + straightY +
    ' L' + left + ' ' + shoulderY + ' Z';
}
