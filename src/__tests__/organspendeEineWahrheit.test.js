// Organspende — Fachprüfung 27.09.2026 (swiss-precision-pruefer, Nebenbefunde zur
// Patientenverfügung). Vier Befunde, hier als Regeln festgehalten:
//   1. Ohne gespeicherten Entscheid ist nichts vorausgewählt (früher «Registriert»).
//   2. Die Begriffe folgen der Zustimmungsregelung, die am 27.09.2026 gilt — kein
//      «Registriert», kein «Widersprochen»; der Rechtsstand trägt ein Datum.
//   3. Eine Wahrheit: notfall.organDonor. `organStatus` wird überführt, nicht mehr gelesen.
//   4. Die Seite verspricht nicht «Ihre Daten bleiben auf diesem Gerät».
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ORGAN_ENTSCHEIDE, organEntscheid, organListe } from '../utils/organspende.js';
import { organspendeMigrieren } from '../utils/organspendeMigration.js';
import { migrateData, CURRENT_DATA_VERSION } from '../utils/dataMigration.js';
import { getNotfallDossierPreview } from '../dossierGenerator.js';
import { prepareDownloadFiles } from '../zipExport.js';
import { gegenstandReadiness } from '../data/gepaeck.js';
import { getChapters } from '../config/constants.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..');
const lies = (rel) => readFileSync(join(SRC, rel), 'utf-8');
const SPRACHEN = { de, fr, it: it_, en, rm };
const t = (k, p) => {
  const v = k.split('.').reduce((o, s) => o?.[s], de);
  if (v === undefined) return k;
  const s = typeof v === 'object' && v && v.sie ? v.sie : v;
  return typeof s === 'string' && p ? s.replace(/\{(\w+)\}/g, (_, n) => p[n] ?? '') : s;
};

describe('1 — kein vorausgewählter Entscheid', () => {
  it('ohne Angabe ist der Entscheid leer', () => {
    expect(organEntscheid({})).toBe('');
    expect(organEntscheid(undefined)).toBe('');
    expect(organEntscheid({ notfall: {} })).toBe('');
  });

  it('der alte Standard «registered» wird nicht mehr als Entscheid gelesen', () => {
    expect(organEntscheid({ organStatus: 'registered' })).toBe('');
    expect(organEntscheid({ notfall: { organDonor: 'registered' } })).toBe('');
  });

  it('die Seite setzt keinen Standardwert mehr', () => {
    const quelle = lies('OrganDonation.jsx');
    expect(quelle).not.toMatch(/\|\|\s*'registered'/);
    expect(quelle).toContain('organEntscheid(data)');
  });
});

describe('2 — Begriffe der Zustimmungsregelung, in allen fünf Sprachen', () => {
  for (const [lang, texte] of Object.entries(SPRACHEN)) {
    it(`${lang}: die Wahl im Kapitel Notfall hat genau die fünf Entscheide`, () => {
      const feld = texte.chapters.notfall.fields.organDonor;
      expect(Object.keys(feld.options)).toEqual(ORGAN_ENTSCHEIDE);
    });

    it(`${lang}: die alten Register-/Widerspruchs-Wörter der Seite sind weg`, () => {
      expect(texte.organ.registered).toBeUndefined();
      expect(texte.organ.notRegistered).toBeUndefined();
      expect(texte.organ.declined).toBeUndefined();
    });

    it(`${lang}: der Rechtsstand trägt ein Datum und einen Leerzustand`, () => {
      expect(texte.organ.rechtsstand).toContain('27.09.2026');
      expect(String(texte.organ.nichtFestgehalten || '')).not.toBe('');
      expect(texte.organ.speicherort).toBeTruthy();
      expect(texte.organ.bitteBestaetigen).toBeTruthy();
    });

    it(`${lang}: der BAG-Link führt auf bag.admin.ch`, () => {
      expect(texte.organ.bagUrl).toMatch(/^https:\/\/www\.bag\.admin\.ch\//);
    });
  }

  it('de: keine Wörter, die ein Register oder die Widerspruchsregelung als geltend voraussetzen', () => {
    const feld = de.chapters.notfall.fields.organDonor;
    const woerter = [feld.label, ...Object.values(feld.options)].join(' ');
    expect(woerter).not.toMatch(/registriert|widersproch/i);
  });
});

describe('3 — eine Wahrheit: notfall.organDonor', () => {
  it('überführt nur, was eine Aussage der Person trägt — und nur so weit, wie sie sie gemacht hat', () => {
    const faelle = [
      // [Eingabe, erwarteter Entscheid, Bitte um Bestätigung]
      // «registriert: Ja» sagt nicht, welche Organe — nie «Zustimmung — alle» daraus machen
      [{ notfall: { organDonor: 'yes' } }, undefined, true],
      [{ notfall: { organDonor: 'yes' }, organDonation: { kidneys: true } }, undefined, true],
      [{ notfall: { organDonor: 'declined' } }, 'declined', false],
      // «Nein» hiess «nicht registriert», nicht «ich lehne ab»
      [{ notfall: { organDonor: 'no' } }, undefined, false],
      [{ organStatus: 'declined' }, 'declined', false],
      // Der alte Standard ohne Wahl ist von einer Wahl nicht zu unterscheiden
      [{ organStatus: 'registered' }, undefined, false],
      [{ organStatus: 'not_registered' }, undefined, false],
      [{ notfall: { organDonor: 'declined' }, organStatus: 'registered' }, 'declined', false],
      // Zwei ausdrückliche, gegensätzliche Aussagen werden nicht still zu einer
      [{ notfall: { organDonor: 'yes' }, organStatus: 'declined' }, undefined, true],
      // «Betg decidì» (nur rm) war eine ausdrückliche Wahl
      [{ notfall: { organDonor: 'undecided' } }, 'undecided', false],
    ];
    for (const [ein, erwartet, bitte] of faelle) {
      const aus = organspendeMigrieren(ein);
      expect(aus.notfall?.organDonor, JSON.stringify(ein)).toBe(erwartet);
      expect(aus.notfall?.organDonor).not.toBe('yes');
      expect(aus.organStatus).toBeUndefined();
      expect(aus._organspendeVorV5.bitteBestaetigen, JSON.stringify(ein)).toBe(bitte);
    }
  });

  it('verliert nichts: die alten Werte bleiben in _organspendeVorV5', () => {
    const aus = organspendeMigrieren({ notfall: { organDonor: 'no', bloodType: 'aPos' }, organStatus: 'registered' });
    expect(aus._organspendeVorV5).toEqual({ organDonor: 'no', organStatus: 'registered', bitteBestaetigen: false, grund: null });
    expect(aus.notfall.bloodType).toBe('aPos');
  });

  it('nennt den Grund der Bitte — ein Widerspruch wird als Widerspruch gezeigt', () => {
    expect(organspendeMigrieren({ notfall: { organDonor: 'yes' } })._organspendeVorV5.grund).toBe('umfang');
    expect(organspendeMigrieren({ notfall: { organDonor: 'yes' }, organStatus: 'declined' })._organspendeVorV5.grund).toBe('widerspruch');
    for (const texte of Object.values(SPRACHEN)) expect(texte.organ.bitteBestaetigenWiderspruch).toBeTruthy();
    expect(lies('OrganDonation.jsx')).toContain("'organ.bitteBestaetigenWiderspruch'");
  });

  it('lässt Daten ohne Organspende-Angabe unberührt', () => {
    const aus = organspendeMigrieren({ basis: { firstName: 'Zoë' } });
    expect(aus).toEqual({ basis: { firstName: 'Zoë' } });
  });

  describe('läuft in migrateData als Schritt v4 → v5', () => {
    let gesetzt = false;
    beforeAll(() => {
      if (!('localStorage' in globalThis)) {
        const ablage = new Map();
        globalThis.localStorage = { getItem: k => ablage.get(k) ?? null, setItem: (k, v) => ablage.set(k, String(v)) };
        gesetzt = true;
      }
    });
    afterAll(() => { if (gesetzt) delete globalThis.localStorage; });

    it('hebt auf die aktuelle Version und überführt organStatus', () => {
      expect(CURRENT_DATA_VERSION).toBe(5);
      const r = migrateData({ _version: 4, organStatus: 'declined', organDonation: { heart: true } });
      expect(r.error).toBeNull();
      expect(r.data._version).toBe(5);
      expect(r.data.notfall.organDonor).toBe('declined');
      expect(r.data.organStatus).toBeUndefined();
      expect(r.data.organDonation).toEqual({ heart: true });
    });
  });

  it('ausserhalb der Migration liest niemand mehr organStatus', () => {
    const erlaubt = new Set(['utils/organspendeMigration.js', 'utils/dataMigration.js', 'utils/dataValidation.js']);
    const treffer = [];
    const gehe = (dir) => {
      for (const name of readdirSync(dir)) {
        const pfad = join(dir, name);
        if (statSync(pfad).isDirectory()) { if (name !== '__tests__' && name !== 'i18n') gehe(pfad); continue; }
        if (!/\.(js|jsx|ts)$/.test(name)) continue;
        const rel = pfad.slice(SRC.length + 1);
        // Kommentarzeilen zählen nicht — dort darf die Geschichte stehen, gelesen wird im Code.
        const code = readFileSync(pfad, 'utf-8').split('\n').filter(z => !/^\s*(\/\/|\*|\/\*)/.test(z)).join('\n');
        if (!erlaubt.has(rel) && code.includes('organStatus')) treffer.push(rel);
      }
    };
    gehe(SRC);
    expect(treffer).toEqual([]);
  });

  it('die Seite schreibt den Entscheid ins Kapitel Notfall und löscht die Bitte um Bestätigung', () => {
    const quelle = lies('OrganDonation.jsx');
    expect(quelle).toContain('notfall.organDonor = status');
    expect(quelle).toContain('onSave({ notfall, organDonation: organs');
    expect(quelle).toContain('bitteBestaetigen: false');
    // …aber nur, wenn wirklich ein Entscheid gewählt ist
    expect(quelle).toContain('vorV5?.bitteBestaetigen && status ?');
  });

  describe('«nur bestimmte» nennt die Organe — auf der Seite, im Dossier und im Export', () => {
    const daten = { notfall: { organDonor: 'partial' }, organDonation: { heart: true, kidneys: true, other: 'Haut' } };

    it('organListe gibt Wörter, Freitext mit Inhalt', () => {
      expect(organListe(t, daten.organDonation)).toEqual(['Herz', 'Nieren', 'Haut']);
    });

    it('Notfall-Dossier', () => {
      const vorschau = getNotfallDossierPreview(daten, getChapters(t), t);
      const zeile = vorschau.sections.flatMap(s => s.rows).find(r => r.feld === 'notfall.organDonor');
      expect(zeile.value).toContain('nur bestimmte');
      expect(zeile.value).toContain('Herz');
      expect(zeile.value).toContain('Haut');
    });

    it('Text-Export', () => {
      const text = prepareDownloadFiles(daten, [], t).manifest.content;
      const zeile = text.split('\n').find(z => z.includes('nur bestimmte'));
      expect(zeile).toContain('Nieren');
    });

    it('bei «alle» oder «Ablehnung» steht keine Liste dabei', () => {
      for (const organDonor of ['yes', 'declined']) {
        const vorschau = getNotfallDossierPreview({ ...daten, notfall: { organDonor } }, getChapters(t), t);
        const zeile = vorschau.sections.flatMap(s => s.rows).find(r => r.feld === 'notfall.organDonor');
        expect(zeile.value).not.toContain('Herz');
      }
    });
  });

  it('«Noch nicht entschieden» zählt im Wanderrucksack nicht als gepackt', () => {
    const offen = gegenstandReadiness('abschied', { notfall: { organDonor: 'undecided' } });
    const entschieden = gegenstandReadiness('abschied', { notfall: { organDonor: 'declined' } });
    expect(offen.done).toBe(0);
    expect(entschieden.done).toBe(1);
  });
});

describe('4 — kein «ohne Konto»-Versprechen auf der Seite', () => {
  it('OrganDonation zeigt trust.localOnly nicht mehr', () => {
    expect(lies('OrganDonation.jsx')).not.toContain('trust.localOnly');
  });
});

// Der Rechtsstand steht mit Datum im Text und veraltet still, sobald das Register läuft
// (BAG: voraussichtlich 2. Halbjahr 2027). Dieser Wecker wird ab 1.7.2027 rot und verlangt
// eine Nachprüfung an der Quelle (bag.admin.ch) — danach Datum im Text und hier nachziehen.
describe('Wecker: Rechtsstand Organspende nachprüfen', () => {
  it('der Stand vom 27.09.2026 ist jünger als der 1.7.2027', () => {
    expect(new Date() < new Date('2027-07-01T00:00:00+02:00')).toBe(true);
  });
});
