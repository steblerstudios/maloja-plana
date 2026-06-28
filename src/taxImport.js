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
  const negative = /^-|^\(.*\)$/.test(s);
  // Nur Ziffern, Trenner und Vorzeichen behalten (CHF, Leerschläge, .- weg).
  s = s.replace(/[^0-9.,]/g, '');
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
    keywords: ['reineinkommen', 'steuerbares einkommen', 'nettoeinkommen', 'einkommen', 'revenu', 'reddito', 'income', 'entrada'] },
  { target: 'otherAssets', labelKey: 'taxImport.field.otherAssets', period: 'value',
    keywords: ['übriges vermögen', 'ubriges vermögen', 'steuerbares vermögen', 'reinvermögen', 'vermögen', 'vermoegen', 'fortune', 'patrimonio', 'facultad', 'assets', 'wealth'] },
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

// ── Roh-Einträge -> zugeordnete Felder ────────────────────────────────────
// Pro Zielfeld nur den ersten plausiblen Treffer (Wert > 0) übernehmen.
export const mapTaxFields = (rawEntries) => {
  const matched = [];
  const seen = new Set();
  const unmatched = [];
  for (const entry of rawEntries || []) {
    const def = matchField(entry.rawKey);
    if (!def) { unmatched.push(entry); continue; }
    if (seen.has(def.target)) continue;
    const num = parseSwissNumber(entry.rawValue);
    if (num === null || num <= 0) continue;
    const value = def.period === 'annual' ? Math.round(num / 12) : Math.round(num);
    seen.add(def.target);
    matched.push({
      target: def.target,
      labelKey: def.labelKey,
      period: def.period,
      rawKey: entry.rawKey,
      rawValue: entry.rawValue,
      annualValue: def.period === 'annual' ? Math.round(num) : null,
      value,
    });
  }
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
