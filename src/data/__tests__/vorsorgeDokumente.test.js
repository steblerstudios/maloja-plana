import { describe, it, expect } from 'vitest';
import { FRAGEN_VA, vorlage, vorlageHtml, abweichendeVertretung } from '../vorsorgeauftrag.js';
import { FRAGEN_BW, bestattungDokument, bestattungHtml } from '../bestattung.js';
import { OFFEN } from '../patientenverfuegung.js';

const t = (key, p) => key + (p ? ' ' + JSON.stringify(p) : '');
const daten = { basis: { firstName: 'Alex', lastName: 'Muster', dateOfBirth: '1980-04-02' }, wohnen: { address: 'Weg 1', postalCode: '4000', city: 'Basel' } };
const heuteCH = () => { const d = new Date(); return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear(); };

describe('Vorsorgeauftrag — Vorlage zum Abschreiben', () => {
  it('Entschädigung nach Art. 366: unentgeltlich (nur Spesen) · angemessen · offen', () => {
    expect(FRAGEN_VA.find((f) => f.key === 'entschaedigung').optionen).toEqual(['unentgeltlich', 'angemessen', OFFEN]);
  });

  it('gewählte Bereiche erscheinen als Sätze (Art. 360 Abs. 2)', () => {
    const v = vorlage({ bereiche: ['personensorge', 'rechtsverkehr'] }, daten, t);
    expect(v.saetze).toContain('va.doc.bereich_personensorge');
    expect(v.saetze).toContain('va.doc.bereich_rechtsverkehr');
    expect(v.saetze).not.toContain('va.doc.bereich_vermoegenssorge');
  });
  it('keine Bereiche → Lücke zum Ausfüllen, kein stiller Auftrag ohne Aufgaben', () => {
    const v = vorlage({}, daten, t);
    expect(v.saetze).toContain('va.doc.bereichLuecke');
  });

  it('«Weiss ich noch nicht» bei der Entschädigung → kein Satz', () => {
    const v = vorlage({ entschaedigung: OFFEN }, daten, t);
    expect(v.saetze.join('|')).not.toContain('entschaedigung');
  });
  it('unentgeltlich → Satz mit Spesen', () => {
    expect(vorlage({ entschaedigung: 'unentgeltlich' }, daten, t).saetze).toContain('va.doc.entschaedigung_unentgeltlich');
  });

  it('beauftragte Person ohne Namen → Lücke, nie erfunden', () => {
    const v = vorlage({}, daten, t);
    expect(v.saetze[1]).toBe('va.doc.beauftragt {"name":"__________","zusatz":""}');
  });
  it('beauftragte Person mit Angaben', () => {
    const v = vorlage({ beauftragt: { name: 'Kim Beispiel', beziehung: 'Schwester', geburt: '1978-01-15' } }, daten, t);
    expect(v.saetze[1]).toContain('"name":"Kim Beispiel"');
    expect(v.saetze[1]).toContain('Schwester');
    expect(v.saetze[1]).toContain('15.01.1978');
  });

  it('ersetzt / ergänzt mit Datum (Art. 362 Abs. 3)', () => {
    expect(vorlage({ bestehend: 'ersetzt' }, daten, t).saetze).toContain('va.doc.ersetzt');
    expect(vorlage({ bestehend: 'ergaenzt', bestehendDatum: '2020-02-03' }, daten, t).saetze).toContain('va.doc.ergaenzt {"datum":"03.02.2020"}');
  });

  it('Abgleich mit der Patientenverfügung: nur wenn beide Namen da sind und sich unterscheiden', () => {
    expect(abweichendeVertretung({ beauftragt: { name: 'Kim Beispiel' } }, { vertretung: { name: ' kim beispiel ' } })).toBe(false);
    expect(abweichendeVertretung({ beauftragt: { name: 'Kim Beispiel' } }, { vertretung: { name: 'Sam Test' } })).toBe(true);
    expect(abweichendeVertretung({ beauftragt: { name: 'Kim Beispiel' } }, {})).toBe(false);
    expect(abweichendeVertretung({}, { vertretung: { name: 'Sam Test' } })).toBe(false);
  });

  it('Druck: Warnsatz abgesetzt und als «nicht abschreiben» markiert, vor dem Text', () => {
    const html = vorlageHtml({ bereiche: ['vermoegenssorge'] }, daten, t);
    const warn = html.indexOf('va.vorlage.nichtAbschreiben');
    const text = html.indexOf('va.doc.titel');
    expect(warn).toBeGreaterThan(-1);
    expect(warn).toBeLessThan(html.indexOf('<div class="va-abschreiben">'));
    expect(html.indexOf('va.vorlage.warnung')).toBeLessThan(html.indexOf('<div class="va-abschreiben">'));
    expect(text).toBeGreaterThan(html.indexOf('<div class="va-abschreiben">'));
  });
  it('Druck: kein heutiges Datum, Freitext escaped', () => {
    const html = vorlageHtml({ weisungen: '<b>x</b>' }, daten, t);
    expect(html).not.toContain(heuteCH());
    expect(html).toContain('&lt;b&gt;x');
  });
});

describe('Bestattungswünsche', () => {
  it('«Den Angehörigen überlassen» ist ein Wunsch und steht als Satz im Dokument', () => {
    const d = bestattungDokument({ art: 'angehoerige' }, daten, t);
    expect(d.zeilen).toEqual(['bw.doc.art_angehoerige']);
  });
  it('«Weiss ich noch nicht» und Unbeantwortetes fehlen', () => {
    const d = bestattungDokument({ art: OFFEN, abschied: OFFEN }, daten, t);
    expect(d.zeilen).toEqual([]);
    expect(d.leer).toBe(true);
  });
  it('keine Frage nach der Konfession (DSG Art. 5 lit. c Ziff. 1)', () => {
    const abschied = FRAGEN_BW.find((f) => f.key === 'abschied');
    expect(abschied.zusatz).toBeUndefined();
    expect(JSON.stringify(FRAGEN_BW)).not.toMatch(/konfession/i);
  });
  it('Grabart und Ort sind getrennte Fragen (Rechtsprüfung 27.09.)', () => {
    expect(FRAGEN_BW.map((f) => f.key)).toEqual(expect.arrayContaining(['grabart', 'ort']));
  });
  it('Anderes Grab und Todesanzeige «ja» nehmen den Freitext mit', () => {
    const d = bestattungDokument({ grabart: 'anderes', grabartText: 'Familiengrab', anzeige: 'ja', anzeigeWo: 'Basler Zeitung' }, daten, t);
    expect(d.zeilen).toEqual(['bw.doc.grabart_anderes {"text":"Familiengrab"}', 'bw.doc.anzeige_ja {"wo":"Basler Zeitung"}']);
  });
  it('Druck: Hinweise auf dem Begleitblatt, kein heutiges Datum', () => {
    const html = bestattungHtml({ art: 'kremation' }, daten, t);
    const [dokumentTeil, begleit] = html.split('<div class="pv-blatt pv-begleitblatt">');
    expect(begleit).toContain('bw.begleit.testament');
    expect(dokumentTeil).not.toContain('bw.begleit.');
    expect(html).not.toContain(heuteCH());
  });
});
