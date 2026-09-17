// K43 — Beim ersten Wechsel auf eine noch nicht geladene Sprache dürfen nie rohe
// Übersetzungs-Schlüssel erscheinen. Die bisherige Sprache bleibt sichtbar, bis
// die neue geladen ist; erst dann wird umgeschaltet. Ladefehler → bisherige
// Sprache bleibt.
//
// Kein DOM im Testlauf: geprüft wird die Übergangslogik, die der I18nProvider
// verwendet (createLanguageSwitch), zusammen mit createT — so wie der Provider
// daraus seinen Übersetzer baut.
import { describe, it, expect } from 'vitest';
import { createLanguageSwitch, createT } from '../index.js';

const TEXTE = {
  en: { nav: { home: 'Home' } },
  de: { nav: { home: 'Übersicht' } },
  fr: { nav: { home: 'Aperçu' } },
  it: { nav: { home: 'Panoramica' } },
};

function aufgeschoben() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

// Nachbau des Provider-Zustands: ein Cache, eine angezeigte Sprache, ein Übersetzer.
function aufbau({ geladen = ['en', 'de'], angezeigt = 'de' } = {}) {
  const cache = {};
  for (const l of geladen) cache[l] = TEXTE[l];
  const offen = {};
  const zustand = { lang: angezeigt, fehler: [] };
  const load = (l) => {
    if (cache[l]) return Promise.resolve(cache[l]);
    if (!offen[l]) {
      offen[l] = aufgeschoben();
      offen[l].promise.then((v) => { cache[l] = v; }, () => {});
    }
    return offen[l].promise;
  };
  const request = createLanguageSwitch({
    load,
    onReady: (l) => { zustand.lang = l; },
    onError: (l, err) => { zustand.fehler.push([l, err]); },
  });
  const t = (key) => createT(cache, zustand.lang, 'sie')(key);
  return { cache, offen, zustand, request, t };
}

describe('K43 Sprachwechsel ohne Blitzen', () => {
  it('zeigt während des Ladens die bisherige Sprache, nie den rohen Schlüssel', async () => {
    const s = aufbau();
    const laeuft = s.request('fr');
    // Ladevorgang offen: noch Deutsch, kein Schlüssel.
    expect(s.zustand.lang).toBe('de');
    expect(s.t('nav.home')).toBe('Übersicht');
    expect(s.t('nav.home')).not.toBe('nav.home');

    s.offen.fr.resolve(TEXTE.fr);
    await laeuft;
    expect(s.zustand.lang).toBe('fr');
    expect(s.t('nav.home')).toBe('Aperçu');
  });

  it('schaltet erst um, wenn auch die Rückfall-Sprache geladen ist', async () => {
    // Rückfall-Sprache ist seit K58 Deutsch.
    const s = aufbau({ geladen: ['en'], angezeigt: 'en' });
    const laeuft = s.request('fr');
    s.offen.fr.resolve(TEXTE.fr);
    await Promise.resolve();
    expect(s.zustand.lang).toBe('en');
    s.offen.de.resolve(TEXTE.de);
    await laeuft;
    expect(s.zustand.lang).toBe('fr');
  });

  it('behält bei Ladefehler die bisherige Sprache und meldet den Fehler', async () => {
    const s = aufbau();
    const laeuft = s.request('fr');
    const fehler = new Error('Netz weg');
    s.offen.fr.reject(fehler);
    await laeuft;
    expect(s.zustand.lang).toBe('de');
    expect(s.t('nav.home')).toBe('Übersicht');
    expect(s.zustand.fehler).toEqual([['fr', fehler]]);
  });

  it('bei schnellem Doppelwechsel gewinnt die letzte Wahl, auch wenn die erste später fertig wird', async () => {
    const s = aufbau();
    const erste = s.request('fr');
    const zweite = s.request('it');
    s.offen.it.resolve(TEXTE.it);
    await zweite;
    expect(s.zustand.lang).toBe('it');
    s.offen.fr.resolve(TEXTE.fr);
    await erste;
    expect(s.zustand.lang).toBe('it');
    expect(s.t('nav.home')).toBe('Panoramica');
  });

  it('Zurück auf die angezeigte Sprache verwirft einen noch offenen Wechsel', async () => {
    const s = aufbau();
    const fr = s.request('fr');
    await s.request('de');
    expect(s.zustand.lang).toBe('de');
    s.offen.fr.resolve(TEXTE.fr);
    await fr;
    expect(s.zustand.lang).toBe('de');
  });

  it('ein veralteter Ladefehler meldet nichts', async () => {
    const s = aufbau();
    const fr = s.request('fr');
    await s.request('de');
    s.offen.fr.reject(new Error('zu spät'));
    await fr;
    expect(s.zustand.fehler).toEqual([]);
    expect(s.zustand.lang).toBe('de');
  });

  it('reicht Optionen an onReady weiter (z. B. ob die Wahl gespeichert wird)', async () => {
    const gesehen = [];
    const request = createLanguageSwitch({
      load: () => Promise.resolve({}),
      onReady: (l, opts) => gesehen.push([l, opts]),
    });
    await request('fr', { persist: true });
    expect(gesehen).toEqual([['fr', { persist: true }]]);
  });

  it('stop() verhindert Zustandsänderungen nach dem Aushängen', async () => {
    const s = aufbau();
    const fr = s.request('fr');
    s.request.stop();
    s.offen.fr.resolve(TEXTE.fr);
    await fr;
    expect(s.zustand.lang).toBe('de');
  });
});
