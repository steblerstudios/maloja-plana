import { describe, it, expect } from 'vitest';
import { FRAGEN, OFFEN, dokument, dokumentHtml, beantwortet } from '../patientenverfuegung.js';

// Übersetzer-Attrappe: gibt den Schlüssel zurück, Platzhalter sichtbar eingesetzt.
const t = (key, p) => key + (p ? ' ' + JSON.stringify(p) : '');
const person = { basis: { firstName: 'Alex', lastName: 'Muster', dateOfBirth: '1980-04-02' }, wohnen: { address: 'Weg 1', postalCode: '4000', city: 'Basel' } };
const alleZeilen = (d) => d.abschnitte.flatMap((a) => a.zeilen);

describe('Patientenverfügung — Fragen', () => {
  it('13 Fragen, eine pro Seite, jede Auswahlfrage hat «Weiss ich noch nicht»', () => {
    expect(FRAGEN).toHaveLength(13);
    for (const f of FRAGEN) {
      if (f.art === 'eine' && f.key !== 'bestehend') expect(f.optionen).toContain(OFFEN);
      if (f.art === 'gruppe') for (const teil of f.teile) expect(teil.optionen).toContain(OFFEN);
    }
  });
  it('Wiederbelebung ohne «nur bei guter Aussicht» (Rechtsprüfung 27.09.: zu unbestimmt)', () => {
    expect(FRAGEN.find((f) => f.key === 'reanimation').optionen).toEqual(['ja', 'nein', OFFEN]);
  });
  it('Linderung ohne «Nein» und ohne «auch wenn es das Leben verkürzt» (SAMW 6.1.2)', () => {
    expect(FRAGEN.find((f) => f.key === 'linderung').optionen).toEqual(['ja', OFFEN]);
  });
});

describe('Patientenverfügung — Dokument', () => {
  it('nichts beantwortet → leer, aber Urteilsfähigkeit und Geltung stehen trotzdem nicht als Entscheide da', () => {
    const d = dokument({}, person, t);
    expect(d.leer).toBe(true);
    expect(alleZeilen(d)).toEqual([]);
  });

  it('«Weiss ich noch nicht» erscheint nie im Dokument', () => {
    const a = { reanimation: OFFEN, lebensverlaengernd: OFFEN, ernaehrung: OFFEN, linderung: OFFEN, sedierung: OFFEN, therapieziel: OFFEN, organe: { organspende: OFFEN, obduktion: OFFEN, forschung: OFFEN } };
    const d = dokument(a, person, t);
    expect(d.leer).toBe(true);
    expect(JSON.stringify(d)).not.toContain(OFFEN);
  });

  it('beantwortete Entscheide stehen als eigene Sätze da', () => {
    const d = dokument({ reanimation: 'nein', ernaehrung: 'begrenzt', linderung: 'ja' }, person, t);
    expect(alleZeilen(d)).toEqual(['pv.doc.reanimation_nein', 'pv.doc.ernaehrung_begrenzt', 'pv.doc.linderung_ja']);
    expect(d.leer).toBe(false);
  });

  it('kein Standardwert: Organspende nur, wenn beantwortet (Fachprüfung 27.09.)', () => {
    const d = dokument({ reanimation: 'ja' }, person, t);
    expect(JSON.stringify(d)).not.toContain('organspende');
  });

  it('«Nur bestimmte Organe» nennt die Organe', () => {
    const d = dokument({ organe: { organspende: 'bestimmte', organeListe: 'Nieren, Hornhaut' } }, person, t);
    expect(alleZeilen(d)).toContain('pv.doc.organspende_bestimmte {"liste":"Nieren, Hornhaut"}');
  });

  it('ersetzt → Satz «ersetzt alle früheren»; ergänzt → mit Datum der früheren (ZGB 362 Abs. 3)', () => {
    expect(dokument({ bestehend: 'ersetzt', reanimation: 'ja' }, person, t).bestehendSatz).toBe('pv.doc.ersetzt');
    expect(dokument({ bestehend: 'ergaenzt', bestehendDatum: '2024-03-01', reanimation: 'ja' }, person, t).bestehendSatz)
      .toBe('pv.doc.ergaenzt {"datum":"01.03.2024"}');
  });
  it('ergänzt ohne Datum → Lücke zum Ausfüllen, kein erfundenes Datum', () => {
    expect(dokument({ bestehend: 'ergaenzt', reanimation: 'ja' }, person, t).bestehendSatz).toBe('pv.doc.ergaenzt {"datum":"__________"}');
  });

  it('Situationen: Geltung immer, gewählte Situationen als Liste', () => {
    const d = dokument({ situationen: ['demenz', 'endphase'], reanimation: 'ja' }, person, t);
    expect(d.situationen).toEqual(['pv.doc.sit_demenz', 'pv.doc.sit_endphase']);
  });

  it('Vertretung und Ersatz: nur mit Namen; Ersatz im Wortlaut von Art. 370 Abs. 3', () => {
    const d = dokument({ vertretung: { name: 'Kim Beispiel', beziehung: 'Schwester', telefon: '061 000 00 00' }, ersatz: { name: '' } }, person, t);
    const v = d.abschnitte.find((a) => a.key === 'vertretung');
    expect(v.personen).toEqual([{ rolle: 'vertretung', name: 'Kim Beispiel', beziehung: 'Schwester', telefon: '061 000 00 00' }]);
    expect(d.leer).toBe(false);
  });

  it('Person aus dem Profil', () => {
    const d = dokument({ reanimation: 'ja' }, person, t);
    expect(d.person).toEqual({ name: 'Alex Muster', geburt: '02.04.1980', adresse: 'Weg 1, 4000 Basel' });
  });
});

describe('Patientenverfügung — Druck', () => {
  it('Datum und Unterschrift nie vorbelegt: kein heutiges Datum im Dokument', () => {
    const html = dokumentHtml({ reanimation: 'ja' }, person, t);
    const heute = new Date();
    const tt = String(heute.getDate()).padStart(2, '0') + '.' + String(heute.getMonth() + 1).padStart(2, '0') + '.' + heute.getFullYear();
    expect(html).not.toContain(tt);
    expect(html).toContain('pv.doc.unterschrift');
  });
  it('Freitext wird escaped', () => {
    const html = dokumentHtml({ werte: '<script>x</script>' }, person, t);
    expect(html).not.toContain('<script>x');
    expect(html).toContain('&lt;script&gt;');
  });
  it('Begleitblatt getrennt, Hinweise nicht in der Erklärung', () => {
    const html = dokumentHtml({ reanimation: 'ja' }, person, t);
    const [erklaerung, begleit] = html.split('<div class="pv-blatt pv-begleitblatt">');
    expect(begleit).toBeDefined();
    expect(begleit).toContain('pv.begleit.ungueltig');
    expect(erklaerung).not.toContain('pv.begleit.');
    expect(erklaerung).not.toContain('pv.ui.hinweis');
  });
});

describe('beantwortet', () => {
  it('zählt Antworten, «Weiss ich noch nicht» zählt als beantwortet (bewusst offen gelassen)', () => {
    expect(beantwortet({}, 'reanimation')).toBe(false);
    expect(beantwortet({ reanimation: OFFEN }, 'reanimation')).toBe(true);
    expect(beantwortet({ werte: '  ' }, 'werte')).toBe(false);
  });
});
