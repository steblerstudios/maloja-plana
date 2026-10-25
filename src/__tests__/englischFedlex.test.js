// Englische Fachbegriffe wie die Bundesübersetzung des ZGB (fedlex, nichtamtlich; Sophie 25.10.2026):
// Patientenverfügung = «patient decree» (Art. 370), Vorsorgeauftrag = «advance care directive» (Art. 360).
// Vorher «advance directive» für die Patientenverfügung — zum Verwechseln nah am amtlichen Begriff für den
// Vorsorgeauftrag — und für diesen abwechselnd «advance care mandate» und «lasting power of attorney».
import { describe, it, expect } from 'vitest';
import en from '../i18n/en.js';
import { SEARCH_VIEWS } from '../config/ansichtenRegister.js';

const roh = JSON.stringify(en);

describe('Englisch nach fedlex', () => {
  it('keine alten Begriffe mehr — ausser dem Titel der SAMS-Richtlinie «Advance directives»', () => {
    // der einzige Treffer ist der Anfang von «Advance directives» im SAMS-Titel
    expect(roh.match(/advance directive/gi)).toEqual(['Advance directive']);
    expect(roh).toContain('SAMS guidelines «Advance directives»');
    expect(roh).not.toMatch(/advance care mandate|lasting power of attorney|living will/i);
  });
  it('die Felder und Titel heissen wie im ZGB', () => {
    expect(roh).toContain('"patientenverfuegung":"Patient decree"');
    expect(roh).toContain('"vorsorgeauftrag":"Advance care directive"');
  });
  it('die Suche findet mit den neuen und den gebräuchlichen Wörtern', () => {
    const va = SEARCH_VIEWS.find((v) => v.view === 'vorsorgeauftrag');
    for (const w of ['patient decree', 'advance care directive', 'advance directive', 'living will', 'lasting power of attorney']) expect(va.aliases).toContain(w);
  });
});
