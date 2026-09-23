import { describe, it, expect } from 'vitest';
import { erkenneGeraet, laeuftAlsApp, GERAETE } from '../utils/geraetErkennung.js';

// Echte User-Agent-Zeichenketten, nicht gekürzte Attrappen: die Erkennung hängt
// genau an den Teilen, die eine Attrappe weglassen würde (Chrome und Edge tragen
// beide «Safari» im String, iPadOS trägt «Macintosh»).
const UA = {
  iphoneSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  iphoneChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1',
  // iPadOS ab 13 meldet exakt denselben String wie ein Mac. Der EINZIGE
  // Unterschied sind die Berührpunkte — siehe den Fall weiter unten.
  ipadOS: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  macSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  macChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  winEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  androidFirefox: 'Mozilla/5.0 (Android 14; Mobile; rv:126.0) Gecko/126.0 Firefox/126.0',
  macFirefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
};

describe('erkenneGeraet', () => {
  it('iPhone bekommt den Teilen-Weg — egal welcher Browser', () => {
    // Auf iOS ist jeder Browser WebKit; der Weg über «Teilen» ist derselbe.
    expect(erkenneGeraet({ ua: UA.iphoneSafari })).toBe('ios');
    expect(erkenneGeraet({ ua: UA.iphoneChrome })).toBe('ios');
  });

  it('iPad und Mac trennt NUR die Zahl der Berührpunkte', () => {
    // Der Kern dieser Datei. Beide Zeilen tragen denselben User-Agent; fiele die
    // Berührpunkt-Prüfung weg, bekäme jedes iPad die Mac-Anleitung und damit ein
    // Menü («Ablage → Zum Dock hinzufügen»), das es auf dem iPad nicht gibt.
    const gleicherUA = UA.ipadOS;
    expect(gleicherUA).toBe(UA.macSafari);

    expect(erkenneGeraet({ ua: gleicherUA, plattform: 'MacIntel', beruehrpunkte: 5 })).toBe('ios');
    expect(erkenneGeraet({ ua: gleicherUA, plattform: 'MacIntel', beruehrpunkte: 0 })).toBe('macSafari');
  });

  it('ein widersprechender User-Agent schlägt navigator.platform', () => {
    // Im Browser gemessen, 23.09.2026: Android-User-Agent, dazu
    // platform «MacIntel» und fünf Berührpunkte. Die erste Fassung prüfte nur
    // Plattform und Berührpunkte und zeigte dem Gerät die iPhone-Anleitung.
    // `platform` ist veraltet und wird mitgeschleppt; der User-Agent ist
    // genauer und muss zustimmen.
    expect(erkenneGeraet({
      ua: UA.androidChrome, plattform: 'MacIntel', beruehrpunkte: 5,
    })).toBe('android');

    // Gegenprobe, damit der Fix nicht die echte iPad-Erkennung mitnimmt:
    // derselbe Plattform-Wert, dieselben Berührpunkte — nur der User-Agent
    // sagt «Macintosh» statt Android.
    expect(erkenneGeraet({
      ua: UA.ipadOS, plattform: 'MacIntel', beruehrpunkte: 5,
    })).toBe('ios');
  });

  it('Chrome und Edge gelten als Chromium, obwohl «Safari» im String steht', () => {
    expect(UA.macChrome).toContain('Safari');
    expect(UA.winEdge).toContain('Safari');
    expect(erkenneGeraet({ ua: UA.macChrome })).toBe('chromium');
    expect(erkenneGeraet({ ua: UA.winEdge })).toBe('chromium');
  });

  it('Android-Chrome und Android-Firefox gehen verschiedene Wege', () => {
    expect(erkenneGeraet({ ua: UA.androidChrome })).toBe('android');
    expect(erkenneGeraet({ ua: UA.androidFirefox })).toBe('firefox');
  });

  it('Firefox am Computer', () => {
    expect(erkenneGeraet({ ua: UA.macFirefox })).toBe('firefox');
  });

  it('Unbekanntes fällt nicht auf ein Gerät zurück, sondern sagt «unbekannt»', () => {
    // Lieber «unbekannt» (= alle Wege zeigen) als eine zufällig falsche Anleitung.
    expect(erkenneGeraet({ ua: 'curl/8.4.0' })).toBe('unbekannt');
    expect(erkenneGeraet({})).toBe('unbekannt');
    expect(erkenneGeraet()).toBe('unbekannt');
  });

  it('jede Kennung hat einen Abschnitt in der Anleitung', () => {
    // Gegenprobe zur Liste: was die Erkennung liefern kann, muss die Seite auch
    // zeigen können. Sonst landet ein Gerät auf einer leeren Anleitung.
    const alleKennungen = [
      erkenneGeraet({ ua: UA.iphoneSafari }),
      erkenneGeraet({ ua: UA.androidChrome }),
      erkenneGeraet({ ua: UA.macSafari, plattform: 'MacIntel', beruehrpunkte: 0 }),
      erkenneGeraet({ ua: UA.macChrome }),
      erkenneGeraet({ ua: UA.macFirefox }),
    ];
    expect([...new Set(alleKennungen)].sort()).toEqual([...GERAETE].sort());
  });
});

describe('laeuftAlsApp', () => {
  const fensterMit = (treffer, standalone) => ({
    navigator: standalone === undefined ? {} : { standalone },
    matchMedia: (anfrage) => ({ matches: treffer.some((m) => anfrage.includes(m)) }),
  });

  it('erkennt den Chromium-Fenstermodus', () => {
    expect(laeuftAlsApp(fensterMit(['standalone']))).toBe(true);
  });

  it('erkennt die alte iOS-Angabe navigator.standalone', () => {
    expect(laeuftAlsApp(fensterMit([], true))).toBe(true);
  });

  it('im normalen Browser-Tab: false', () => {
    expect(laeuftAlsApp(fensterMit([], false))).toBe(false);
  });

  it('fällt bei fehlendem oder kaputtem Fenster auf «nicht installiert»', () => {
    // Im Zweifel die Anleitung zeigen. Eine überflüssige Anleitung ist harmlos,
    // ein verschwiegener Weg nicht.
    expect(laeuftAlsApp(null)).toBe(false);
    expect(laeuftAlsApp({})).toBe(false);
    expect(laeuftAlsApp({ matchMedia: () => { throw new Error('blockiert'); } })).toBe(false);
  });
});
