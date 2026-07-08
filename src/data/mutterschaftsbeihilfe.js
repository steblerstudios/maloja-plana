// Bedarfsabhängige kantonale Mutterschaftsbeihilfe — eine Bedarfsleistung, die es einem
// Elternteil ermöglicht, das Kleinkind nach der Geburt selbst zu betreuen, wenn das
// Einkommen den Lebensbedarf nicht deckt ("wirtschaftlich bescheidene Verhältnisse").
// Läuft über mehrere Monate nach der Geburt (je Kanton ~10–24 Monate). ACHTUNG: NICHT
// zu verwechseln mit der Erwerbsersatz-Ergänzung (z.B. VD/FR: Aufstockung der Bundes-EO
// von 80% Lohn) — das ist eine Versicherung, keine versteckte Bedarfsleistung.
//
// Wie familienEL.js / mietzinsbeitraege.js kanton-bewusst: nur Kantone mit
// web-verifizierter offizieller Seite zu einer BEDARFSABHÄNGIGEN Leistung sind gelistet
// ('has'); alle anderen zeigen den Eintrag GAR NICHT (kein falsches Versprechen). Kein
// Rechner — Einkommensgrenzen/Bezugsdauer variieren je Kanton.
//
// Alle URLs 2026-07 einzeln web-verifiziert (offizielle Kantonsportale). Die BFS-Liste
// von 2006 nannte 10 Kantone, doch mehrere haben ihre Leistung seither abgeschafft
// (z.B. ZH: Kleinkinderbetreuungsbeiträge per 2016 aufgehoben) oder führen nur eine
// Erwerbsersatz-Ergänzung (Typ B) — daher nur die vier aktuell verifizierten Typ-A-Kantone:
//   GR — gr.ch (Mutterschaftsbeiträge, i.d.R. 10 Monate nach Geburt)
//   SG — sg.ch (Elternschaftsbeiträge, wenn Lebensbedarf nicht gedeckt)
//   ZG — zg.ch (Mutterschaftsbeiträge, bis zu einem Jahr nach Geburt)
//   FR — fr.ch (allocation de maternité en cas de besoin)

const MUTTERSCHAFTSBEIHILFE = {
  GR: 'https://www.gr.ch/DE/institutionen/verwaltung/dvs/soa/beratung/finanzielle-unterstuetzung/mutterschaftsbeitraege/Seiten/default.aspx',
  SG: 'https://www.sg.ch/gesundheit-soziales/soziales/familie/elternschaftsbeitraege.html',
  ZG: 'https://zg.ch/de/familie-gesellschaft/lebensereignisse/mutterschaft',
  FR: 'https://www.fr.ch/travail-et-entreprises/employes/lallocation-en-cas-de-besoin',
};

// Liefert { has, url } für einen Kanton. Kanton ohne bedarfsabhängige Mutterschaftsbeihilfe
// → has:false (Eintrag wird in Lebenssituationen.jsx gar nicht gerendert).
export function getMutterschaftsbeihilfe(canton) {
  const url = MUTTERSCHAFTSBEIHILFE[(canton || '').trim()];
  return url ? { has: true, url } : { has: false, url: null };
}
