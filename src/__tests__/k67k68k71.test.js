import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { rueckfallT } from '../i18n/index.js';
import * as i18n from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// K68 · Anrede-Reste: vier Texte, die der Paritätstest nicht erfasst (de hat
// dort nur eine Form), sind jetzt in allen Sprachen anredefrei formuliert.
// K71 · Rückfall ohne t und Kontext: Text aus der geladenen Sprache statt leer;
// createTranslator (ungenutzt, immer Sie) ist entfernt.
// ─────────────────────────────────────────────────────────────

const pfad = (obj, p) => p.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
const SCHLUESSEL = ['legal.privacy.sensitive1', 'legal.resources.localGovDesc', 'kvg.mammoGeoYourCantonNo'];
// Anredewörter je Sprache; Grenzen über \p{L}, weil JS-\b bei Akzenten versagt.
const ANREDE = {
  de: /(?<!\p{L})(du|dein\p{L}*|dich|dir|Ihr\p{L}*|Ihnen)(?!\p{L})/u,
  fr: /(?<!\p{L})(vous|votre|vos|tu|ton|ta|tes|toi)(?!\p{L})/iu,
  it: /(?<!\p{L})(Lei|Suo|Sua|Suoi|Sue|tu|tuo|tua|tuoi|tue)(?!\p{L})/u,
  rm: /(?<!\p{L})(Vus|voss|vossa|vossas|vus|tes|tia|ti)(?!\p{L})/u,
};
const SPRACHEN = { de, fr, it: it_, rm };

describe('K68 · anredefreie Texte', () => {
  for (const [lang, dict] of Object.entries(SPRACHEN)) {
    for (const key of SCHLUESSEL) {
      it(`${lang}: ${key}`, () => {
        const val = pfad(dict, key);
        if (val && typeof val === 'object') {
          // it führt sensitive1 schon als { sie, du } — das ist ebenfalls korrekt.
          expect(typeof val.sie).toBe('string');
          expect(typeof val.du).toBe('string');
          return;
        }
        expect(typeof val).toBe('string');
        expect(val).not.toMatch(ANREDE[lang]);
      });
    }
  }

  it('Gegenprobe: das Muster erkennt die alte Du-Form', () => {
    expect('In deinem Kanton ({canton}) gibt es').toMatch(ANREDE.de);
    expect('pour les démarches locales — votre commune').toMatch(ANREDE.fr);
    expect('il Suo comune e cantone').toMatch(ANREDE.it);
  });

  it('der Platzhalter {canton} bleibt in allen Sprachen erhalten', () => {
    for (const dict of Object.values(SPRACHEN)) {
      expect(pfad(dict, 'kvg.mammoGeoYourCantonNo')).toContain('{canton}');
    }
  });
});

describe('K71 · Rückfall aus der geladenen Sprache', () => {
  const FIX = {
    de: { chapter: { save: 'Speichern' }, gruss: { sie: 'Guten Tag, Sie', du: 'Hallo, du' }, n: 'in {n} Tagen' },
    en: { chapter: { save: 'Save' } },
  };
  beforeEach(() => {
    const daten = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (k) => (daten.has(k) ? daten.get(k) : null),
      setItem: (k, v) => { daten.set(k, String(v)); },
      removeItem: (k) => { daten.delete(k); },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('Speicher gesperrt: trotzdem ein Übersetzer', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('gesperrt'); } });
    expect(rueckfallT(FIX)('chapter.save')).toBe('Speichern');
  });

  it('nichts geladen: leerer Text, nie ein Schlüssel', () => {
    expect(rueckfallT({})('chapter.save')).toBe('');
  });

  it('gespeicherte Sprache geladen: deren Text, mit Platzhaltern', () => {
    localStorage.setItem('or5_lang', 'de');
    const t = rueckfallT(FIX);
    expect(t('chapter.save')).toBe('Speichern');
    expect(t('n', { n: 3 })).toBe('in 3 Tagen');
  });

  it('gespeicherte Sprache nicht geladen: Rückfall-Sprache (K58: de)', () => {
    localStorage.setItem('or5_lang', 'fr');
    expect(rueckfallT(FIX)('chapter.save')).toBe('Speichern');
  });

  it('Anrede wie gespeichert, Standard Sie', () => {
    localStorage.setItem('or5_lang', 'de');
    expect(rueckfallT(FIX)('gruss')).toBe('Guten Tag, Sie');
    localStorage.setItem('or5_anrede', 'du');
    expect(rueckfallT(FIX)('gruss')).toBe('Hallo, du');
  });

  it('unbekannter Schlüssel oder Objekt: leerer Text', () => {
    localStorage.setItem('or5_lang', 'de');
    const t = rueckfallT(FIX);
    expect(t('gibt.es.nicht')).toBe('');
    expect(t('chapter')).toBe('');
  });

  it('createTranslator ist entfernt', () => {
    expect(i18n.createTranslator).toBeUndefined();
  });
});

describe('K67 · Vermögensfreibetrag ohne Sozialhilfe-Rechner im Hauptbundle', () => {
  const lies = (p) => readFileSync(join(process.cwd(), 'src', p), 'utf8');

  it('cantonalData.js (Hauptbundle) importiert den Freibetrag aus der eigenen Datei', () => {
    const src = lies('config/cantonalData.js');
    expect(src).toContain("from '../data/vermoegensfreibetragKanton.js'");
    expect(src).not.toMatch(/from ['"]\.\.\/data\/sozialhilfeRechner/);
  });

  it('sozialhilfeRechner.js reicht dieselbe Funktion weiter', async () => {
    const a = await import('../data/sozialhilfeRechner.js');
    const b = await import('../data/vermoegensfreibetragKanton.js');
    expect(a.vermoegensfreibetragKanton).toBe(b.vermoegensfreibetragKanton);
    expect(b.vermoegensfreibetragKanton('ZH', 2, 3)).toBe(15000);
    expect(b.vermoegensfreibetragKanton('BS', 1, 0)).toBe(8000);
  });
});
