// Hausbegriffe (Fassung 9, F9-B2 bis B11, Stebler Studios 06.11.2026: «Ja, so»): ein Wort je Sache
// im sichtbaren deutschen Text. Geprüft werden alle Texte in i18n/de.js (Sie- und Du-Fassung,
// auch einfache Strings) — nicht Schlüssel, nicht Kommentare. Suchwörter (aliases) in
// ansichtenRegister.js / werkzeugRegister.js bleiben bewusst unberührt: wer «KK» sucht, findet weiter.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const DE = fs.readFileSync(path.resolve(__dirname, '../i18n/de.js'), 'utf8');

// Jede String-Konstante mit dem Schlüssel, der am Anfang ihrer Zeile steht.
// Ein String direkt vor «:» ist selbst ein Schlüssel und zählt nicht als Text.
const sichtbareTexte = (src) => {
  const out = [];
  for (const zeile of src.split('\n')) {
    const z = zeile.trim();
    if (z.startsWith('//')) continue;
    const schluessel = (z.match(/^['"]?([\w-]+)['"]?\s*:/) || [])[1] || '';
    for (const m of z.matchAll(/'((?:[^'\\]|\\.)*)'(?!\s*:)|"((?:[^"\\]|\\.)*)"(?!\s*:)/g)) {
      out.push({ schluessel, text: m[1] ?? m[2] });
    }
  }
  return out;
};

// Verworfene Formen — dürfen in keinem sichtbaren Text mehr stehen.
const VERWORFEN = [
  ['Dokumenten-Tresor', /Dokumenten-Tresor/],
  // Ablage heisst «Dokumentenablage» (LANGUAGE_SYSTEM_NOTE: «Tresor» klingt nach Bank/Hochsicherheit);
  // «Tresor» nur für das verschlüsselte Schloss («Ihr Tresor ist gesperrt»).
  ['Dokumententresor', /Dokumententresor/],
  ['im Tresor ablegen', /\b(im|in den|in deinen|in ihren) Tresor\b/i],
  ['Mietzinsbeitrag/-beiträge', /Mietzinsbeitr/],
  ['Mietzins-Beiträge', /Mietzins-Beitr/],
  ['Deadline', /Deadline/i],
  ['IPV-Rechner', /IPV-Rechner/],
  ['IPV-Prüfung', /IPV-Prüfung/],
  ['IPV-Anspruch prüfen', /IPV-Anspruch prüfen/],
  ['Prämienverbilligung schätzen', /Prämienverbilligung schätzen/],
  ['Sozialhilfe-Orientierung', /Sozialhilfe-Orientierung/],
  ['Mindestlohn-Check', /Mindestlohn-Check/],
  ['KK als Wort oder Wortanfang', /(?<![\wÄÖÜäöü])KK(?![A-Za-zÄÖÜäöü])/],
];

// Verworfene Form, die an einer Stelle bewusst bleibt (Schlüssel und Grund).
const VERWORFEN_AUSNAHMEN = {
};

// Bewusst stehen gelassen — Schlüssel, Wort, Grund.
const ERLAUBT = {
  Sozialamt: [
    { schluessel: 'noteApplySocialOffice', grund: 'keinem Kanton zugeordnet, gemeinte Stelle nicht belegt' },
  ],
  Eigenanteil: [
    { schluessel: 'eigenanteil', grund: 'KVG-Leistungen: Franchise plus Selbstbehalt, nicht der Selbstbehalt allein' },
    { schluessel: 'soKeinAnspruch', grund: 'IPV Solothurn: Eigenanteil an der Prämie (Fachbegriff)' },
    { schluessel: 'soSkalaUnklar', grund: 'IPV Solothurn: Eigenanteil an der Prämie (Fachbegriff)' },
    { schluessel: 'soSkalaUnklarFristVorbei', grund: 'IPV Solothurn: Eigenanteil an der Prämie (Fachbegriff)' },
  ],
};

const texte = sichtbareTexte(DE);

describe('Hausbegriffe im deutschen Text', () => {
  it('findet die Texte (Sie, Du und einfache Strings)', () => {
    expect(texte.length).toBeGreaterThan(5000);
  });

  for (const [name, re] of VERWORFEN) {
    it(`keine verworfene Form: «${name}»`, () => {
      const ausnahmen = new Set((VERWORFEN_AUSNAHMEN[name] || []).map((e) => e.schluessel));
      const treffer = texte.filter((t) => re.test(t.text) && !ausnahmen.has(t.schluessel)).map((t) => `${t.schluessel}: ${t.text.slice(0, 80)}`);
      expect(treffer).toEqual([]);
    });
  }

  for (const [wort, liste] of Object.entries(ERLAUBT)) {
    it(`«${wort}» nur auf der Erlaubnisliste`, () => {
      const erlaubt = new Set(liste.map((e) => e.schluessel));
      const treffer = texte
        .filter((t) => t.text.includes(wort) && !erlaubt.has(t.schluessel))
        .map((t) => `${t.schluessel}: ${t.text.slice(0, 80)}`);
      expect(treffer).toEqual([]);
    });
  }

  it('die Prüfung erkennt die verworfenen Formen und lässt Schlüssel in Ruhe', () => {
    const probe = sichtbareTexte([
      "    taxDeadline: 'Frist {date}',",
      "    a: { sie: 'Ihre KK-Prämie', du: 'Deine Krankenkassenprämie' },",
      "    // Kommentar mit Mietzinsbeiträge",
      "    b: 'KKG Art. 16 und KVG',",
    ].join('\n'));
    expect(probe.map((t) => t.text)).toEqual(['Frist {date}', 'Ihre KK-Prämie', 'Deine Krankenkassenprämie', 'KKG Art. 16 und KVG']);
    const kk = VERWORFEN.find(([n]) => n.startsWith('KK'))[1];
    expect(probe.filter((t) => kk.test(t.text)).map((t) => t.text)).toEqual(['Ihre KK-Prämie']);
    expect(probe.some((t) => /Deadline/i.test(t.text))).toBe(false);
  });
});
