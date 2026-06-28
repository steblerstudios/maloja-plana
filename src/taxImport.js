// Steuerdatei-Import — liest die Eckwerte einer Steuererklärung (Export vom
// Steueramt / eTax-Software) und ordnet sie den Maloja-Finanzfeldern zu.
//
// Bewusst zurückhaltend & ehrlich: Wir lesen nur die Felder, die wir sicher
// zuordnen können (Einkommen, Vermögen, Steuerbetrag). Alles bleibt auf dem
// Gerät — die Datei wird nur lokal mit FileReader gelesen, nie hochgeladen.
//
// Unterstützte Formate:
//   • Schlüssel-Wert-Text/CSV  ("Reineinkommen; 60'000")  — der dokumentierte,
//     verlässliche Weg (so kann man Werte aus jeder Steuererklärung übertragen).
//   • XML  (eTax-/eCH-Export)  — wir scannen bekannte Tag-/Attributnamen.

// ── Schweizer Zahlen robust parsen ────────────────────────────────────────
// Beispiele: "60'000.00", "60 000", "1’234,50", "CHF 18'500.-", "-2'400"
export const parseSwissNumber = (raw) => {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;
  // Negativ erkennen: ein Minus/Gedankenstrich direkt vor der ersten Ziffer
  // (auch nach Präfix wie "CHF ") oder Buchhalter-Klammern um die ganze Zahl.
  const negative = /[-–]\s*[\d.,'’ ]*\d/.test(s) || /\(\s*[\d.,'’ ]+\s*\)/.test(s);
  // Erste zusammenhängende Zahl herauslösen, dann auf Ziffern + Dezimal-/
  // Tausendertrenner reduzieren. Verhindert, dass Ziffern aus nachgestelltem
  // Text (z.B. "12'000 (Stand 2024)" -> sonst 120002024) an den Betrag kleben.
  const token = s.match(/\d[\d.,'’\s]*\d|\d/);
  if (!token) return null;
  s = token[0].replace(/[^0-9.,]/g, '');
  if (!s) return null;
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) {
    // Letztes Zeichen ist das Dezimaltrennzeichen, das andere ist Tausender.
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.'); // 1.234,50 -> 1234.50
    } else {
      s = s.replace(/,/g, ''); // 1,234.50 -> 1234.50
    }
  } else if (hasComma) {
    // Komma = Dezimal, wenn 1–2 Nachkommastellen, sonst Tausendertrenner.
    s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '');
  } else if (hasDot) {
    // Punkt = Tausendertrenner, wenn mehrere oder 3er-Gruppe ohne Dezimalrest.
    if ((s.match(/\./g) || []).length > 1 || /\.\d{3}(\.|$)/.test(s)) {
      s = s.replace(/\./g, '');
    }
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -Math.abs(n) : n;
};

// ── Feld-Zuordnung (mehrsprachig, spezifisch vor generisch) ────────────────
// period: 'annual' => Jahreswert -> /12 für monatliche Maloja-Felder.
//         'value'  => Bestandeswert (Vermögen) -> 1:1.
// Reihenfolge zählt: das erste passende Keyword gewinnt.
//
// Bewusst NICHT zugeordnet (sonst falsche Zahlen statt Orientierung):
//   • Gesamtvermögen ('steuerbares Vermögen', 'Reinvermögen', 'Vermögen',
//     'Fortune', 'Patrimonio'): enthält bereits Wertschriften + Sparkonto.
//     Würde es in otherAssets landen, zählte FinanzUebersicht/Sozialhilfe es
//     doppelt. otherAssets fängt nur explizit „übriges/anderes" Vermögen.
//   • Netto-/steuerbares Einkommen ('Reineinkommen', 'steuerbares Einkommen',
//     'Nettoeinkommen'): ist nach Abzügen. monthlyIncome wird in der App als
//     Brutto behandelt (TaxCalculator zieht Abzüge selbst ab) — ein Nettowert
//     hier würde doppelt abgezogen. Darum nur explizite Brutto-Begriffe.
export const FIELD_MAP = [
  { target: 'securitiesValue', labelKey: 'taxImport.field.securities', period: 'value',
    keywords: ['wertschrift', 'wertschriftenverzeichnis', 'securities', 'titres', 'titoli', 'depot', 'portefeuille', 'investiziun'] },
  { target: 'pension3aBalance', labelKey: 'taxImport.field.pension3a', period: 'value',
    keywords: ['säule 3a', 'saule 3a', 'pilier 3a', 'pilastro 3a', 'pitga 3a', '3a guthaben', '3a balance'] },
  { target: 'savingsAccount', labelKey: 'taxImport.field.savings', period: 'value',
    keywords: ['sparkonto', 'ersparnis', 'épargne', 'epargne', 'risparmi', 'savings', 'spargn', 'sparguthaben'] },
  { target: 'monthlyTax', labelKey: 'taxImport.field.tax', period: 'annual',
    keywords: ['steuerbetrag', 'geschuldete steuer', 'total steuer', 'impôt', 'impot', 'imposta', 'tax amount', 'taglia'] },
  { target: 'monthlyIncome', labelKey: 'taxImport.field.income', period: 'annual',
    keywords: ['bruttolohn', 'bruttoeinkommen', 'bruttoeinkünfte', 'bruttoeinkuenfte', 'salaire brut', 'revenu brut', 'salario lordo', 'reddito lordo', 'gross salary', 'gross income', 'salari brut'] },
  { target: 'otherAssets', labelKey: 'taxImport.field.otherAssets', period: 'value',
    keywords: ['übriges vermögen', 'ubriges vermögen', 'übrige vermögenswerte', 'autres actifs', 'autre fortune', 'altri beni', 'autra facultad', 'other assets'] },
];

const normalize = (s) => String(s || '').toLowerCase().normalize('NFC').replace(/\s+/g, ' ').trim();

const matchField = (rawKey) => {
  const key = normalize(rawKey);
  for (const def of FIELD_MAP) {
    if (def.keywords.some(k => key.includes(k))) return def;
  }
  return null;
};

// ── Roh-Einträge aus Schlüssel-Wert-Text / CSV ────────────────────────────
// Trennt an Tab, Semikolon, Doppelpunkt oder (wenn nur 2 Spalten) Komma.
export const parseKeyValue = (text) => {
  const out = [];
  const lines = String(text || '').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    let parts;
    if (trimmed.includes('\t')) parts = trimmed.split('\t');
    else if (trimmed.includes(';')) parts = trimmed.split(';');
    else if (trimmed.includes(':')) parts = trimmed.split(':');
    else parts = trimmed.split(',');
    if (parts.length < 2) continue;
    const rawKey = parts[0].trim();
    const rawValue = parts.slice(1).join(' ').trim();
    if (!rawKey || !rawValue) continue;
    out.push({ rawKey, rawValue });
  }
  return out;
};

// ── Roh-Einträge aus XML (eTax / eCH) ─────────────────────────────────────
// Wir kennen die proprietären Schemata nicht im Detail; darum scannen wir
// generisch: jedes Element mit Textinhalt liefert Tagname -> Wert, plus
// numerische Attribute. Die Feld-Zuordnung filtert danach das Relevante.
// Mehrere Knoten desselben Postens (z.B. Steuer für Bund/Kanton/Gemeinde)
// sind erwünscht — mapTaxFields wählt daraus den Gesamtwert (siehe pickTotal).
export const parseTaxXML = (text) => {
  const out = [];
  const src = String(text || '');
  // <Tag ...>Wert</Tag>  (Wert ohne weitere Tags)
  const elementRe = /<([A-Za-z_][\w.\-:]*)\b[^>]*>([^<]+)<\/\1>/g;
  let m;
  while ((m = elementRe.exec(src)) !== null) {
    const rawKey = m[1].replace(/.*:/, ''); // Namespace-Präfix weg
    const rawValue = m[2].trim();
    if (rawValue) out.push({ rawKey, rawValue });
  }
  // Attribute, deren Name nach einem bekannten Feld klingt: name="..." value="123"
  const attrRe = /(\w+)\s*=\s*"([^"]*)"/g;
  while ((m = attrRe.exec(src)) !== null) {
    out.push({ rawKey: m[1], rawValue: m[2].trim() });
  }
  return out;
};

// ── Total-Erkennung bei Mehrfach-Treffern ─────────────────────────────────
// Eine echte eTax-/eCH-0196-XML listet denselben Posten oft mehrfach auf
// (z.B. <Steuerbetrag> für Bund, Kanton und Gemeinde) plus deren Gesamtsumme.
// Würde der erste Treffer gewinnen, übernähmen wir nur eine Teilsumme (z.B.
// die Bundessteuer) statt des Totals. Darum wählen wir bei mehreren Treffern
// fürs gleiche Feld einen explizit als Total markierten Knoten; gibt es keinen,
// den grössten Betrag (das Total ist nie kleiner als eine seiner Komponenten).
// Deterministisch und unabhängig von der Reihenfolge im Dokument.
// Nur eindeutige Total-Begriffe (DE/FR/IT/EN). Bewusst NICHT 'general'/'général':
// die kämen nur in "total général" vor, wo 'total' ohnehin matcht — als lose
// Substrings würden sie sonst einen kleineren, fälschlich-markierten Knoten ein
// grösseres echtes Total schlagen lassen.
const TOTAL_MARKERS = ['total', 'gesamt', 'summe', 'totale'];

const isTotalMarked = (rawKey) => {
  const key = normalize(rawKey);
  return TOTAL_MARKERS.some(k => key.includes(k));
};

// Wählt aus mehreren Kandidaten fürs gleiche Zielfeld den Gesamtwert aus:
// als Total markierte zuerst, darunter (oder sonst) der grösste Betrag.
const pickTotal = (cands) => {
  const totals = cands.filter(c => isTotalMarked(c.entry.rawKey));
  const pool = totals.length ? totals : cands;
  return pool.reduce((best, c) => (c.num > best.num ? c : best));
};

// ── Roh-Einträge -> zugeordnete Felder ────────────────────────────────────
// Pro Zielfeld einen Treffer (Wert > 0) übernehmen. Bei mehreren Treffern
// fürs gleiche Feld gewinnt der Gesamtwert (siehe pickTotal), nicht der erste.
export const mapTaxFields = (rawEntries) => {
  const candidates = new Map(); // target -> [{ def, num, entry }]
  const order = [];             // erst-gesehene Reihenfolge der Zielfelder
  const unmatched = [];
  for (const entry of rawEntries || []) {
    const def = matchField(entry.rawKey);
    if (!def) { unmatched.push(entry); continue; }
    const num = parseSwissNumber(entry.rawValue);
    if (num === null || num <= 0) continue;
    if (!candidates.has(def.target)) { candidates.set(def.target, []); order.push(def.target); }
    candidates.get(def.target).push({ def, num, entry });
  }
  const matched = order.map((target) => {
    const cands = candidates.get(target);
    const { def, num, entry } = cands.length > 1 ? pickTotal(cands) : cands[0];
    const value = def.period === 'annual' ? Math.round(num / 12) : Math.round(num);
    return {
      target: def.target,
      labelKey: def.labelKey,
      period: def.period,
      rawKey: entry.rawKey,
      rawValue: entry.rawValue,
      annualValue: def.period === 'annual' ? Math.round(num) : null,
      value,
    };
  });
  return { matched, unmatched };
};

// ── Datei einlesen (lokal) -> zugeordnete Felder ──────────────────────────
export const importTaxFromFile = async (file) => {
  const text = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
  const name = (file?.name || '').toLowerCase();
  const looksXml = name.endsWith('.xml') || name.endsWith('.tax') || /^\s*<\?xml|^\s*</.test(text);
  const rawEntries = looksXml ? parseTaxXML(text) : parseKeyValue(text);
  return mapTaxFields(rawEntries);
};

// ── Anwenden: fill-if-empty (bestehende Werte werden NIE überschrieben) ────
// Liefert die zusammengeführten finanzen + welche Felder gefüllt bzw. behalten
// wurden, damit die Vorschau ehrlich zeigen kann, was sich ändert.
export const applyTaxToFinanzen = (matched, currentFinanzen = {}) => {
  const merged = { ...currentFinanzen };
  const applied = [];
  const kept = [];
  for (const f of matched || []) {
    const existing = currentFinanzen[f.target];
    const hasExisting = existing !== undefined && existing !== null && String(existing).trim() !== '' && Number(existing) !== 0;
    if (hasExisting) {
      kept.push({ ...f, existing });
    } else {
      merged[f.target] = String(f.value);
      applied.push(f);
    }
  }
  return { merged, applied, kept };
};
