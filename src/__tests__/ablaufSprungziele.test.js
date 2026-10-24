import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { UMLEITUNGEN } from '../utils/hashRouter.js';
import { MENUE_WERKZEUGE } from '../data/werkzeugRegister.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itLang from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Rundgang 24.10.2026 (Links und Abläufe vor dem Deploy 29.10.): Seit dem Bündeln führen
// `unterlagen` und `finanzuebersicht` per Umleitung zu einer Sprungmarke UNTEN auf der Sammelseite
// («Meine Unterlagen» in der Ablage, die Auswertung im Kapitel Finanzen). Ein Knopf, der zum
// Ablegen oder Erfassen auffordert, landete damit unterhalb dessen, was die Person tun will.
// Die Router-Tests prüfen nur, DASS ein Ziel existiert — dieser Wächter prüft, WOHIN der Knopf fällt.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

// Zeile mit dem Knopf (über seinen Text-Schlüssel gefunden) → das Ziel von onNavigate darin.
const zielVon = (datei, textSchluessel) => {
  const zeile = quelle(datei).split('\n').find((z) => z.includes(textSchluessel) && z.includes('onNavigate('));
  if (!zeile) return null;
  // bis zur Klammer vor dem schliessenden `}` des Props-Objekts — das Ziel darf selbst Klammern tragen
  return zeile.match(/onNavigate\((.*?)\) \}/)[1];
};

describe('«Police ablegen» führt zum Ablegen, nicht zu «Meine Unterlagen» unten', () => {
  it('die Umleitung `unterlagen` springt wirklich nach unten — sonst wäre der Wächter gegenstandslos', () => {
    expect(UMLEITUNGEN.unterlagen.anker).toBeTruthy();
  });

  for (const [datei, schluessel] of [['KVGWechsel.jsx', 'kvgWechsel.policeLink'], ['ZusatzWechsel.jsx', 'zusatzWechsel.policeLink']]) {
    it(datei, () => {
      expect(zielVon(datei, schluessel)).toBe("'tresor'");
    });
  }
});

describe('Mietzins «Einkommen erfassen» führt zum Formular im Kapitel Finanzen', () => {
  it('die Umleitung `finanzuebersicht` springt zur Auswertung unter dem Formular', () => {
    expect(UMLEITUNGEN.finanzuebersicht.anker).toBe('mp-finanz-auswertung');
  });

  it('der Knopf öffnet das Kapitel ohne Sprungmarke', () => {
    expect(zielVon('MietzinsOrientierung.jsx', 'mietzinsView.enterIncomeLink')).toBe("'chapter', CHAPTER_KEYS.indexOf('finanzen')");
  });
});

// Entscheid Stebler Studios 24.10.2026: Knöpfe nach `finanzuebersicht` heissen wie die Seite, auf der
// man landet — das Kapitel Finanzen. Der Werkzeug-Eintrag steht nicht mehr im Menü (dort steht das
// Kapitel schon); Suche, Portemonnaie und alte Links führen weiter über die Umleitung.
describe('«Finanz-Übersicht» heisst wie ihre Zielseite', () => {
  for (const [lang, dict] of Object.entries({ de, en, fr, it: itLang, rm })) {
    it(`${lang}: Knopf und Dashboard-Karte tragen den Kapiteltitel`, () => {
      expect(dict.nav.finanzUebersicht).toBe(dict.chapters.finanzen.title);
      expect(dict.dashboard.highlightFinanz).toBe(dict.chapters.finanzen.title);
    });
  }

  it('kein zweiter Menüeintrag neben dem Kapitel Finanzen', () => {
    expect(MENUE_WERKZEUGE.map((w) => w.view)).not.toContain('finanzuebersicht');
  });
});
