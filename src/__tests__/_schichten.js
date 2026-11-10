// Hilfe für die Wächter der drei Schichten (kein Test, wird nur importiert).
// Ids im zugeklappten Teil «Ausführlich lesen» einer Seite.
export function zugeklappteIds(html) {
  const ids = new Set();
  for (const d of html.matchAll(/<details class="schicht-mehr">([\s\S]*?)<\/details>/g))
    for (const m of d[1].matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
  return ids;
}
