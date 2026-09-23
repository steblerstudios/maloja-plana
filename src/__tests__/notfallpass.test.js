import { describe, it, expect, vi } from 'vitest';
import { getChapters } from '../config/constants.js';
import { getNotfallDossierPreview } from '../dossierGenerator.js';
import { notfallpassFelder, inZwischenablage } from '../utils/notfallpass.js';
import { NA_FELD } from '../utils/vollstaendigkeit.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { NotfallpassBlatt } from '../NotfallpassBlatt.jsx';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

// Notfallpass vorbereiten (23.09.2026): die Werte kommen aus derselben Quelle wie
// Dossier und QR — getNotfallDossierPreview(). Hier wird geprüft, dass die Zuordnung
// stimmt, dass die Listen-Felder des Kapitels ankommen und dass nichts erfunden wird.

const t = (k) => k;
const chapters = getChapters(t);
const wertVon = (gruppen, key) => gruppen.flatMap(g => g.felder).find(f => f.key === key).wert;
const felderAus = (data) => notfallpassFelder(getNotfallDossierPreview(data, chapters, t).sections);

const voll = {
  basis: { firstName: 'Anna', lastName: 'Muster', dateOfBirth: '1980-04-02' },
  notfall: {
    emergencyContact: 'Beat Muster', emergencyPhone: '079 000 00 00',
    bloodType: 'aPos', allergies: 'Penicillin',
    medicationsList: [{ name: 'Levothyroxin', dose: '50', unit: 'µg' }, { name: '', dose: '1' }],
    chronicDiseasesList: [{ name: 'Hypothyreose', code: 'E03.9' }],
  },
};

describe('Notfallpass: Felder aus dem Profil', () => {
  it('bildet jedes vorhandene Feld in der Reihenfolge der Apple-Hilfe ab', () => {
    const g = felderAus(voll);
    expect(g.map(x => x.key)).toEqual(['profil', 'pass']);
    expect(g[1].felder.map(f => f.key)).toEqual(['erkrankungen', 'medikamente', 'allergien', 'blutgruppe', 'kontaktName', 'kontaktTelefon']);
    expect(wertVon(g, 'name')).toBe('Anna Muster');
    expect(wertVon(g, 'geburtsdatum')).toBe('02.04.1980');
    expect(wertVon(g, 'allergien')).toBe('Penicillin');
    expect(wertVon(g, 'kontaktName')).toBe('Beat Muster');
    expect(wertVon(g, 'kontaktTelefon')).toBe('079 000 00 00');
  });

  it('Blutgruppe als Beschriftung der Auswahl, nicht als interner Wert', () => {
    const tDe = createT({ de }, 'de', 'sie');
    const g = notfallpassFelder(getNotfallDossierPreview(voll, getChapters(tDe), tDe).sections);
    expect(wertVon(g, 'blutgruppe')).toBe('A+');
  });

  it('Medikamente und Erkrankungen aus den Listen des Kapitels (nicht nur aus dem alten Textfeld)', () => {
    const g = felderAus(voll);
    expect(wertVon(g, 'medikamente')).toBe('Levothyroxin 50 µg');
    expect(wertVon(g, 'erkrankungen')).toBe('Hypothyreose (E03.9)');
  });

  it('dieselben Listen-Werte stehen auch im Dossier (eine Quelle für QR und Blatt)', () => {
    const med = getNotfallDossierPreview(voll, chapters, t).sections.find(s => s.key === 'medical');
    expect(med.rows.find(r => r.feld === 'notfall.medications').value).toBe('Levothyroxin 50 µg');
  });

  it('altes Textfeld bleibt Rückfall, wenn keine Liste da ist', () => {
    const g = felderAus({ basis: {}, notfall: { medications: 'Aspirin', chronicDiseases: 'Asthma' } });
    expect(wertVon(g, 'medikamente')).toBe('Aspirin');
    expect(wertVon(g, 'erkrankungen')).toBe('Asthma');
  });

  it('leeres Profil: jedes Feld leer, nichts erfunden, nichts wirft', () => {
    const g = felderAus({ basis: {}, notfall: {} });
    for (const f of g.flatMap(x => x.felder)) expect(f.wert).toBe('');
    expect(notfallpassFelder(undefined).flatMap(x => x.felder).every(f => f.wert === '')).toBe(true);
  });

  it('«Keine Kontaktperson» ist ein Platzhalter und wird nicht zum Wert', () => {
    const g = felderAus({ basis: {}, notfall: { [NA_FELD]: ['emergencyContact'], allergies: 'x' } });
    expect(wertVon(g, 'kontaktName')).toBe('');
  });
});

describe('Notfallpass: Kopieren', () => {
  it('ruft navigator.clipboard.writeText mit dem Wert', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const ok = await inZwischenablage('Penicillin', { navigator: { clipboard: { writeText } } });
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Penicillin');
  });

  it('fällt auf execCommand zurück, wenn clipboard fehlt oder ablehnt', async () => {
    const feld = { value: '', style: {}, setAttribute: vi.fn(), select: vi.fn() };
    const doc = {
      createElement: vi.fn(() => feld), execCommand: vi.fn(() => true),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
    };
    const writeText = vi.fn().mockRejectedValue(new Error('nicht erlaubt'));
    const ok = await inZwischenablage('A+', { navigator: { clipboard: { writeText } }, document: doc });
    expect(ok).toBe(true);
    expect(doc.execCommand).toHaveBeenCalledWith('copy');
    expect(feld.value).toBe('A+');
    expect(doc.body.removeChild).toHaveBeenCalledWith(feld);
  });

  it('meldet false statt zu werfen, wenn nichts geht — und kopiert nie einen leeren Wert', async () => {
    expect(await inZwischenablage('x', {})).toBe(false);
    const writeText = vi.fn();
    expect(await inZwischenablage('', { navigator: { clipboard: { writeText } } })).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });
});

// ── Das Blatt selbst ─────────────────────────────────────────────────────────────
// Ohne jsdom (Projektentscheid): gerendert wird als statisches Markup. Der Klick selbst ist
// oben an inZwischenablage() belegt; hier wird geprüft, dass das Blatt die Knöpfe trägt.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const blatt = (data, sprache = 'de', anrede = 'sie') => {
  const tx = createT({ de, en, fr, it: itSprache, rm }, sprache, anrede);
  return renderToStaticMarkup(React.createElement(NotfallpassBlatt, { palette, t: tx, data, chapters: getChapters(tx), onNavigate: () => {} }));
};

describe('Notfallpass-Blatt: Darstellung', () => {
  it('volles Profil: Werte stehen da, je Feld ein Kopier-Knopf mit eigenem Namen', () => {
    const html = blatt(voll);
    expect(html).toContain('Levothyroxin 50 µg');
    expect(html).toContain('A+');
    expect(html).toContain('aria-label="Allergien kopieren"');
    expect(html).toContain('aria-label="Blutgruppe kopieren"');
    expect((html.match(/>Kopieren</g) || []).length).toBe(8);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it('leeres Profil rendert ruhig: «noch nicht erfasst», kein Knopf, keine Mahnung', () => {
    const html = blatt({ basis: {}, notfall: {} });
    expect((html.match(/noch nicht erfasst/g) || []).length).toBe(8);
    expect(html).not.toContain('>Kopieren<');
    expect(html).toContain('Im Kapitel Notfall ist noch nichts erfasst');
    expect(html).not.toMatch(/dringend|sofort|unbedingt|Achtung|Warnung|!/);
  });

  it('Apple- und Android-Hilfe als externe Links mit Ankündigung, kein anderer Netzweg', () => {
    const html = blatt(voll);
    expect(html).toContain('href="https://support.apple.com/de-ch/guide/iphone/iph08022b192/ios"');
    expect(html).toContain('href="https://support.google.com/android/answer/9319337?hl=de"');
    expect((html.match(/target="_blank" rel="noopener noreferrer"/g) || []).length).toBe(2);
    expect(html).not.toMatch(/<img|<iframe|<script/);
  });

  it('Datenschutz-Satz: ohne Entsperren lesbar, gewollt, Nutzer:in entscheidet', () => {
    const html = blatt(voll);
    expect(html).toContain('ohne Code');
    expect(html).toContain('Das ist gewollt');
    expect(html).toContain('Sie entscheiden, was Sie eintragen');
    expect(blatt(voll, 'de', 'du')).toContain('Du entscheidest, was du einträgst');
  });
});

describe('Notfallpass-Blatt: fünf Sprachen', () => {
  const sprachen = { de, en, fr, it: itSprache, rm };
  const schluessel = Object.keys(de.notfallpass);

  for (const [name, dict] of Object.entries(sprachen)) {
    it(`${name}: jeder Schlüssel da, nichts bleibt als Rohschlüssel stehen`, () => {
      expect(Object.keys(dict.notfallpass).sort()).toEqual([...schluessel].sort());
      for (const anrede of ['sie', 'du']) {
        const html = blatt(voll, name, anrede);
        expect(html, `${name}/${anrede}`).not.toMatch(/notfallpass\.[a-zA-Z_]+/);
      }
    });
  }

  it('Hilfe-Links zeigen auf die Sprache der Seite (rm: deutsche Fassung, es gibt keine rätoromanische)', () => {
    expect(de.notfallpass.iphoneUrl).toContain('/de-ch/');
    expect(fr.notfallpass.iphoneUrl).toContain('/fr-ch/');
    expect(itSprache.notfallpass.iphoneUrl).toContain('/it-ch/');
    expect(en.notfallpass.iphoneUrl).toContain('/en-us/');
    expect(rm.notfallpass.iphoneUrl).toContain('/de-ch/');
    expect(fr.notfallpass.androidUrl).toMatch(/hl=fr$/);
    expect(itSprache.notfallpass.androidUrl).toMatch(/hl=it$/);
  });
});
