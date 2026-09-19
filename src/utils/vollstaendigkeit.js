// ─── E17 · Vollständigkeit mit «trifft nicht zu» ───────────────────────────────
// Ein Feld ist erledigt, wenn es einen Wert hat ODER als «trifft nicht zu»
// markiert ist. Die Markierung liegt je Kapitel als Liste von Feld-Schlüsseln in
// `data[kapitel]._na` — rein additiv: alte Daten ohne das Feld lesen sich wie
// «nichts markiert», und `_`-Schlüssel gelten im Export als Verwaltungsfeld.
// Eine Quelle für Dashboard und Kopfzeile, damit beide gleich zählen.

export const NA_FELD = '_na';

const liste = (d) => (d && Array.isArray(d[NA_FELD]) ? d[NA_FELD] : []);

export const trifftNichtZu = (d, k) => liste(d).includes(k);

// K82 (Entscheid 19.09.): Eine gespeicherte 0 ist eine Antwort («kein Betrag»), kein leeres
// Feld — sie zählt und bleibt als «0» sichtbar. Leer sind nur '', undefined, null (und NaN).
// Nur Anzeige und Zählung; Rechner lesen ihre Werte weiter selbst (Number(x || 0) u. ä.).
export const hatWert = (v) => v === 0 || Boolean(v);

// Mehrfach-Einträge (`itemized`) speichern die Summe im Feld und die Posten in `<k>Items`.
// Ältere Stände schrieben beim Leeren der Liste eine 0 — die zählt nur, wenn ein Posten
// wirklich einen Betrag trägt.
export const feldHatWert = (d, k) => {
  if (!d) return false;
  const v = d[k];
  const posten = d[k + 'Items'];
  if (v === 0 && Array.isArray(posten)) return posten.some((r) => r && hatWert(r.amount));
  return hatWert(v);
};

// Summe der Posten fürs Budget-Feld: leer, solange kein Posten einen Betrag trägt.
export const postenSumme = (list) => {
  const mitBetrag = (list || []).filter((r) => r && hatWert(r.amount));
  return mitBetrag.length ? mitBetrag.reduce((a, r) => a + (Number(r.amount) || 0), 0) : '';
};

// Wert für ein Eingabefeld: 0 bleibt «0», Leeres wird ''.
export const anzeigeWert = (v) => (hatWert(v) ? v : '');

export const feldErledigt = (d, k) => feldHatWert(d, k) || trifftNichtZu(d, k);

// Neue Liste mit umgeschaltetem Schlüssel (setzen ↔ zurücknehmen).
export const naUmschalten = (d, k) => {
  const l = liste(d);
  return l.includes(k) ? l.filter((x) => x !== k) : [...l, k];
};

// K45: Ein eingetragener Wert hebt «trifft nicht zu» auf — für jedes Feld, ruhig und
// ohne Meldung. Gibt dasselbe Objekt zurück, wenn nichts zu bereinigen ist.
export const naBereinigen = (d) => {
  const l = liste(d);
  const rest = l.filter((k) => !feldHatWert(d, k));
  return rest.length === l.length ? d : { ...d, [NA_FELD]: rest };
};

const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

export const kapitelVollstaendigkeit = (chapter, d) => {
  const filled = chapter.fields.filter((f) => feldErledigt(d, f.k)).length;
  const total = chapter.fields.length;
  return { pct: pct(filled, total), filled, total };
};

export const gesamtVollstaendigkeit = (chapters, data) => {
  let filled = 0, total = 0;
  chapters.forEach((ch) => { const r = kapitelVollstaendigkeit(ch, data[ch.key]); filled += r.filled; total += r.total; });
  return pct(filled, total);
};

// Grundordnung: nur die Pflicht-Felder (`mvo`). Empfohlene Felder zählen nicht.
export const grundordnung = (chapters, data) => {
  let filled = 0;
  const fields = [];
  chapters.forEach((ch, chapterIdx) => {
    const d = data[ch.key];
    ch.fields.filter((f) => f.mvo).forEach((f) => {
      const done = feldErledigt(d, f.k);
      if (done) filled++;
      fields.push({ key: f.k, label: f.label, done, na: trifftNichtZu(d, f.k), chapterIdx, chapterTitle: ch.title, chapterIcon: ch.icon });
    });
  });
  return { filled, total: fields.length, pct: pct(filled, fields.length), fields };
};
