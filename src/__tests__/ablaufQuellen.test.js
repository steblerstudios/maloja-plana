import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
// NICHT `it` nennen — das überschreibt vitests `it`, und kein Test lädt mehr.
import itLang from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Jeder geführte Ablauf nennt seine Quellen — Befund 24.09.2026: zwei von
// neunzehn taten es. Die Artikel und Adressen stammen aus der Fachprüfung vom
// 24.09.2026 (Fedlex-ELI per SPARQL bestätigt, Anker im Gesetzestext gefunden).
// Dieser Test hält die FORM: vorhanden, verlinkt, Sprachfassung passt. Ob ein
// Artikel inhaltlich trägt, kann kein Test sagen — das bleibt Fachprüfung.
const NS = {
  kkerst: 'kkErst', kvgwechsel: 'kvgWechsel', zusatzwechsel: 'zusatzWechsel', neuerjob: 'neuerJob',
  stelleverloren: 'stelleVerloren', unfallkrankheit: 'unfallKrankheit', umzug: 'umzug',
  pensionierung: 'pensionierung', betreibung: 'betreibung', selbstaendigkeit: 'selbstaendigkeit',
  heirat: 'heirat', kind: 'kind', trennung: 'trennung', bewilligung: 'bewilligung',
  fuehrerausweis: 'fuehrerausweis', asyl: 'asyl', dienst: 'dienst', volljaehrig: 'volljaehrig', lehre: 'lehre', betreibungsauszug: 'betreibungsAuszug', ausweis: 'ausweis', wegzug: 'wegzug', adoption: 'adoption', zusammenziehen: 'zusammenziehen', ergaenzungsleistungen: 'ergaenzungsleistungen', vorsorgeauftrag: 'vorsorgeauftrag', einbuergerung: 'einbuergerung', zuzug: 'zuzug', aussteuerung: 'aussteuerung', quellensteuer: 'quellensteuer', wohnunggekuendigt: 'wohnungGekuendigt', iv: 'iv', pflege: 'pflege', todesfall: 'todesfall',
};
// Der Zusatzversicherungs-Wechsel zitiert seine Quelle schon im Schritt selbst,
// Artikel für Artikel (zusatzWechsel.checkSource) — eine zweite Zeile im Fuss
// wäre dieselbe Angabe zweimal.
const QUELLE_IM_SCHRITT = { zusatzwechsel: 'checkSource' };
const SPRACHEN = [['de', de, 'de'], ['fr', fr, 'fr'], ['it', itLang, 'it'], ['en', en, 'de'], ['rm', rm, 'de']];
const MARKER = /\[\[([^\]|]+)\|(https:\/\/[^\]]+)\]\]/g;

describe('Abläufe — Quellen', () => {
  it('jeder Ablauf im Register ist hier erfasst', () => {
    for (const a of ABLAEUFE) expect(NS[a.view], `kein Namensraum für ${a.view}`).toBeTruthy();
  });

  describe.each(SPRACHEN)('%s', (lang, dict, fedlexSprache) => {
    it.each(Object.entries(NS))('%s nennt mindestens eine verlinkte Quelle', (view, ns) => {
      const text = dict[ns]?.[QUELLE_IM_SCHRITT[view] || 'quelle'];
      expect(typeof text, `${lang}: ${ns}.quelle fehlt`).toBe('string');
      const links = [...text.matchAll(MARKER)];
      expect(links.length, `${lang}: ${ns} ohne [[…|https://…]]`).toBeGreaterThan(0);
      for (const [, , url] of links) {
        const m = url.match(/fedlex\.admin\.ch\/eli\/cc\/[^/]+\/[^/]+\/([a-z]{2})#art_/);
        if (m) expect(m[1], `${lang}: ${ns} verlinkt ${url}`).toBe(fedlexSprache);
      }
    });
  });

  it.each(Object.entries(NS).filter(([v]) => !QUELLE_IM_SCHRITT[v]))('%s zeigt die Zeile auch an', (view, ns) => {
    const datei = {
      kkerst: 'KKErstAnmeldung', kvgwechsel: 'KVGWechsel', neuerjob: 'NeuerJob', stelleverloren: 'StelleVerloren',
      unfallkrankheit: 'UnfallKrankheit', umzug: 'UmzugAblauf', pensionierung: 'Pensionierung',
      betreibung: 'BetreibungErhalten', selbstaendigkeit: 'Selbstaendigkeit', heirat: 'Heirat', kind: 'KindBekommen',
      trennung: 'Trennung', bewilligung: 'BewilligungFristen', fuehrerausweis: 'Fuehrerausweis', asyl: 'AsylView', dienst: 'Dienst', volljaehrig: 'Volljaehrig', lehre: 'Lehre', betreibungsauszug: 'BetreibungsAuszug', ausweis: 'Ausweis', wegzug: 'Wegzug', adoption: 'Adoption', zusammenziehen: 'Zusammenziehen', ergaenzungsleistungen: 'Ergaenzungsleistungen', vorsorgeauftrag: 'Vorsorgeauftrag', einbuergerung: 'Einbuergerung', zuzug: 'ZuzugAusland', aussteuerung: 'Aussteuerung', quellensteuer: 'Quellensteuer', wohnunggekuendigt: 'WohnungGekuendigt',
      iv: 'IvVerfahren', pflege: 'PflegeAblauf', todesfall: 'Todesfall',
    }[view];
    const src = readFileSync(resolve(__dirname, '..', datei + '.jsx'), 'utf8');
    expect(src.includes(`t('${ns}.quelle')`), `${datei}.jsx liest ${ns}.quelle nicht`).toBe(true);
  });
});
