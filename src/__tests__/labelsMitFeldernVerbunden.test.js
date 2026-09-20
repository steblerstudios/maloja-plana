// Jedes sichtbare <label> muss mit seinem Feld verbunden sein — entweder weil es
// das Feld UMSCHLIESST (implizite Verbindung) oder über htmlFor/id.
//
// Warum das zählt: ein Label, das nur daneben steht, ist nicht anklickbar (auf
// dem Handy das grössere Ziel als das Feld selbst), und der Name des Feldes kommt
// dann aus einem `aria-label`, das denselben Text ein zweites Mal führt. Driften
// die beiden auseinander, sagt der Screenreader etwas anderes als der Bildschirm
// zeigt. Gefunden wurden am 20.09.2026 ausserdem ZWEI Felder ohne jeden Namen
// (KVGLeistungen) — das ist ein echter WCAG-Verstoss (4.1.2), kein Schönheitsfehler.
//
// Die Ausnahmeliste unten ist Absicht: sie hält fest, was noch offen ist, statt es
// in einer Notiz verschwinden zu lassen. Wer eine Zeile daraus abarbeitet, löscht
// sie hier — wer ein neues unverbundenes Label baut, bricht den Test.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');

// Bekannte, begründete Ausnahmen. Schlüssel: Datei → Grund.
const AUSNAHMEN = {
  // Tabellen-Muster: das Label steht NUR bei idx === 0 als Spaltenüberschrift,
  // die Felder der Zeilen 2..n haben gar kein sichtbares Label und hängen
  // korrekt am aria-label. Ein htmlFor würde nur die erste Zeile verbinden.
  'LanguageManager.jsx': 'Spaltenüberschrift-Muster (Label nur bei idx === 0)',
};

const jsxDateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' ? [] : jsxDateien(p);
  return e.name.endsWith('.jsx') ? [p] : [];
});

// Findet den Argument-Bereich eines createElement-Aufrufs durch Klammer-Zählung.
// Verlässlicher als Einrückung — die lügt, sobald eine Zeile umbricht.
const bereichAb = (src, start) => {
  let tiefe = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '(') tiefe++;
    else if (src[i] === ')') { tiefe--; if (tiefe === 0) return src.slice(start, i + 1); }
  }
  return src.slice(start);
};

const FELD = /createElement\('(input|select|textarea)'/;

// Das Props-Objekt ist das zweite Argument. Per Klammer-Zählung holen, NICHT per
// indexOf('}') — sonst endet die Suche am geschachtelten style-Objekt und ein
// danach notiertes htmlFor wird übersehen (dieser Fehler hat den Test hier
// zuerst selbst falsch anschlagen lassen).
const propsVon = (block) => {
  const start = block.indexOf('{');
  if (start < 0) return '';
  let tiefe = 0;
  for (let i = start; i < block.length; i++) {
    if (block[i] === '{') tiefe++;
    else if (block[i] === '}') { tiefe--; if (tiefe === 0) return block.slice(start, i + 1); }
  }
  return block.slice(start);
};

const labelBefunde = (datei) => {
  const src = fs.readFileSync(datei, 'utf8');
  const befunde = [];
  const re = /React\.createElement\('label'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const zeile = src.slice(0, m.index).split('\n').length;
    const block = bereichAb(src, m.index + 'React.'.length);
    const umschliesst = FELD.test(block);
    const hatHtmlFor = /htmlFor:/.test(propsVon(block));
    if (!umschliesst && !hatHtmlFor) befunde.push({ zeile, datei: path.basename(datei) });
  }
  return befunde;
};

describe('Labels sind mit ihren Feldern verbunden', () => {
  const alle = jsxDateien(SRC).flatMap(labelBefunde);

  it('kein unverbundenes <label> ausserhalb der begründeten Ausnahmen', () => {
    const offen = alle.filter((b) => !AUSNAHMEN[b.datei]);
    expect(offen.map((b) => `${b.datei}:${b.zeile}`)).toEqual([]);
  });

  it('die Ausnahmeliste führt keine Datei, die längst sauber ist', () => {
    // Verhindert, dass die Liste zur Legende wird: wer aufräumt, muss hier löschen.
    const nochNoetig = Object.keys(AUSNAHMEN).filter((d) => alle.some((b) => b.datei === d));
    expect(nochNoetig.sort()).toEqual(Object.keys(AUSNAHMEN).sort());
  });

  it('Listen-Zeilen tragen ihre id je Zeile, nicht fest', () => {
    // Eine feste id in einer .map() landet mehrfach im Dokument; htmlFor trifft
    // dann immer die erste Zeile. Deshalb hängt jede id am Zeilen-Index.
    const paare = [
      ['DoctorManager.jsx', ['arzt-fach-', 'arzt-name-', 'arzt-tel-', 'arzt-notiz-']],
      ['JobManager.jsx', ['stelle-firma-', 'stelle-titel-', 'stelle-pensum-', 'stelle-zeitraum-']],
      ['MedicationManager.jsx', ['medi-name-', 'medi-wirkstoff-', 'medi-dosis-', 'medi-einheit-', 'medi-notiz-']],
      ['DiseaseManager.jsx', ['diagnose-name-', 'diagnose-icd-', 'diagnose-notiz-']],
    ];
    for (const [datei, basen] of paare) {
      const src = fs.readFileSync(path.join(SRC, datei), 'utf8');
      for (const b of basen) {
        expect(src, `${datei} · ${b}`).toContain(`htmlFor: '${b}' + idx`);
        expect(src, `${datei} · ${b}`).toContain(`id: '${b}' + idx`);
      }
    }
  });

  it('ChapterView: Felder ohne eigenes Control bekommen einen Gruppentitel, kein totes htmlFor', () => {
    // Diese Zweige rendern KEIN <control id={fieldId}>, sondern eine Gruppe
    // (Options-Pillen, Listen-Manager, Betrags-Posten, 3a-Tracker). Vorher trug
    // das Label trotzdem ein htmlFor auf eine id, die niemand hält: der Klick
    // aufs Label tat nichts, und das Dokument enthielt einen Verweis ins Leere.
    // Gemessen im DOM über alle sieben Kapitel: 18 solche Labels, jetzt 0.
    const src = fs.readFileSync(path.join(SRC, 'ChapterView.jsx'), 'utf8');

    // renderLabel kann den Gruppen-Fall überhaupt (Signatur + <div> statt <label>)
    expect(src).toMatch(/renderLabel = \(fieldId, labelText, hint, alsGruppenTitel\)/);
    expect(src).toContain("alsGruppenTitel ? 'div' : 'label'");
    // die -label-id bleibt in BEIDEN Fällen — aria-labelledby hängt daran
    expect(src).toContain("id: fieldId + '-label'");

    // Sechs Zweige sind IMMER eine Gruppe: 3 Listen-Manager · Betrags-Posten ·
    // 3a-Tracker · Sprachen. Sie reichen die Kennzeichnung fest durch …
    const mitFlagge = src.match(/renderLabel\([^)]*, true\)/g) || [];
    expect(mitFlagge.length).toBe(6);
    // Nur die Gruppen zählen, die auf einen FELD-Titel zeigen. ChapterView hat
    // ausserdem zwei ältere Gruppen für die Haushalts-Abschnitte
    // (hh-adults-heading / hh-children-heading) — die gehören nicht hierher.
    const gruppen = src.match(/role: 'group', 'aria-labelledby': [^,]*'-label'/g) || [];
    expect(gruppen.length).toBe(6);

    // … der siebte hängt davon ab, OB Pillen gerendert werden: bei ≤6 Optionen
    // gibt es kein <select id={fieldId}>, darüber schon. Deshalb `usePills`
    // durchreichen und nicht `true` — sonst verlöre die Select-Variante ihr Label.
    expect(src).toContain('renderLabel(fieldId, field.label, field.hint, usePills)');
    expect(src).toContain("role: 'radiogroup'");
  });

  it('die beiden früher unbenannten KVG-Felder sind verbunden', () => {
    const src = fs.readFileSync(path.join(SRC, 'KVGLeistungen.jsx'), 'utf8');
    // je Leistung eine eigene id — eine feste id wäre mehrfach im Dokument
    expect(src).toContain("htmlFor: 'kvg-lastvisit-' + item.key");
    expect(src).toContain("id: 'kvg-lastvisit-' + item.key");
    expect(src).toContain("htmlFor: 'kvg-taxpunkte'");
    expect(src).toContain("id: 'kvg-taxpunkte'");
  });

  it('verbundene Felder führen ihren Namen nicht doppelt als aria-label', () => {
    // Onboarding: htmlFor gesetzt → das aria-label mit demselben i18n-Schlüssel
    // ist weg, damit der sichtbare Text die einzige Quelle des Namens ist.
    const src = fs.readFileSync(path.join(SRC, 'Onboarding.jsx'), 'utf8');
    expect(src).not.toContain("'aria-label': t('onboarding.firstName')");
    expect(src).not.toContain("'aria-label': t('onboarding.lastName')");
    expect(src).not.toContain("'aria-label': t('onboarding.yourCanton')");
  });
});
