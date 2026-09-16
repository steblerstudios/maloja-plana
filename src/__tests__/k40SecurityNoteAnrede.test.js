import { describe, it, expect } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// K40 (Bau-Liste §10) — export.securityNote (zipExport.securityNote) stand in
// de.js als reiner String in Du-Form («Bewahre sie sicher auf.») und erschien
// dadurch unverändert auch in der Sie-Ansicht. Die App trennt Sie/Du über ein
// { sie, du }-Objekt (src/i18n/index.js: createT, Standard „sie"). it.js und
// rm.js hatten dieselbe Lücke (Conservalo / Conservescha sind je die informelle
// Form). fr.js nutzt für diese Zeile bereits durchgehend die Vous-Form (auch in
// den Nachbarzeilen introDatei/verschluesselt kein { sie, du }-Paar) — kein
// Du-Leck, also unverändert gelassen. en kennt keine Anrede-Unterscheidung.
// ─────────────────────────────────────────────────────────────

const all = { de, en, fr, it: itTranslations, rm };

describe('K40 · zipExport.securityNote respektiert die Anrede', () => {
  it('de: Sie-Ansicht (Standard) zeigt die Sie-Form, keine Du-Anrede', () => {
    const sie = createT(all, 'de', 'sie')('zipExport.securityNote');
    expect(sie).toBe('Die exportierte Datei enthält persönliche Daten. Bewahren Sie sie sicher auf.');
    expect(sie).not.toMatch(/\bBewahre\b/); // Du-Imperativ darf in der Sie-Form nicht auftauchen
  });

  it('de: Du-Ansicht bleibt wie zuvor', () => {
    const du = createT(all, 'de', 'du')('zipExport.securityNote');
    expect(du).toBe('Die exportierte Datei enthält persönliche Daten. Bewahre sie sicher auf.');
  });

  it('de: ohne gesetzte Anrede gilt der Standard Sie (kein Du sichtbar)', () => {
    const standard = createT(all, 'de', undefined)('zipExport.securityNote');
    expect(standard).not.toMatch(/\bBewahre\b/);
  });

  it('it: Lei-Ansicht zeigt die Lei-Form, keine tu-Anrede', () => {
    const lei = createT(all, 'it', 'sie')('zipExport.securityNote');
    expect(lei).toBe('Il file esportato contiene dati personali. Lo conservi in modo sicuro.');
    expect(lei).not.toMatch(/Conservalo/);
  });

  it('it: tu-Ansicht bleibt wie zuvor', () => {
    const tu = createT(all, 'it', 'du')('zipExport.securityNote');
    expect(tu).toBe('Il file esportato contiene dati personali. Conservalo in modo sicuro.');
  });

  it('rm: Vus-Ansicht zeigt die Vus-Form, keine ti-Anrede', () => {
    const vus = createT(all, 'rm', 'sie')('zipExport.securityNote');
    expect(vus).toBe('La datoteca exportada cuntegna datas persunalas. Conservai ella en segirezza.');
    expect(vus).not.toMatch(/Conservescha/);
  });

  it('rm: ti-Ansicht bleibt wie zuvor', () => {
    const ti = createT(all, 'rm', 'du')('zipExport.securityNote');
    expect(ti).toBe('La datoteca exportada cuntegna datas persunalas. Conservescha ella en segirezza.');
  });

  it('en/fr: unverändert, keine {sie,du}-Aufspaltung nötig bzw. schon Vous-Form', () => {
    expect(typeof en.zipExport.securityNote).toBe('string');
    expect(en.zipExport.securityNote).toBe('The exported file contains personal data. Store it safely.');
    expect(typeof fr.zipExport.securityNote).toBe('string');
    expect(fr.zipExport.securityNote).toBe('Le fichier exporté contient des données personnelles. Conservez-le en lieu sûr.');
  });
});
