// Feldname ohne das, was der Wert schon sagt («CHF», «CHF/Monat»), und ohne Eingabe-Beispiel
// («Anzahl Zimmer (z. B. 3.5)» → «Anzahl Zimmer»). Seit 27.10.2026 hier (vorher nur in ChapterView
// `listenName`), damit Kapitel und Dossiers dieselben Namen zeigen — im Behörden-Dossier stand
// «Monatliches Einkommen CHF · CHF 6’200» (F7-S6).
export function feldNameOhneEinheit(label, type) {
  const roh = String(label || '');
  const ohneChf = type === 'currency'
    ? roh.replace(/CHF(\s*\/\s*[^\s(),]+)?,?\s*/g, '').replace(/\(\s*\)/g, '').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    : roh.replace(/\s*(CHF(\s*\/\s*\S+)?|\(CHF\))\s*$/, '');
  return ohneChf.replace(/\s*\((z\. ?B\.|p\. ?ex\.|p\. ?es\.|e\.g\.)[^)]*\)/i, '').replace(/\s{2,}/g, ' ').trim();
}
