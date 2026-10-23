import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { formatDE } from '../utils/helpers.js';
import { ablaufStandLaden, ablaufStandSichern, ablaufStandKey } from '../utils/ablaufStand.js';
import { UmzugAblauf, ohneNummer } from '../UmzugAblauf.jsx';
import { EreignisFrist } from '../AblaufSchale.jsx';

// Fassung 5 · Ablauf Umzug (Entscheid Sophie 23.10.2026): ein Schritt nach dem anderen auf
// der Passstrasse, Frist als Karte mit Datum, der Stand bleibt gespeichert. Alle vier Schritte
// und ihr ganzer Inhalt bleiben erreichbar.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const t = createT({ de }, 'de', 'sie');
const palette = new Proxy({}, { get: () => '#888888' });
const KEY = ablaufStandKey('umzug');

const render = ({ stand, data = {}, vorlaeufig = false } = {}) => {
  if (stand) store[KEY] = JSON.stringify(stand);
  return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
    React.createElement(UmzugAblauf, { palette, t, data, chapters: [{ key: 'wohnen' }], onNavigate: () => {} })));
};

describe('ablaufStand', () => {
  it('ohne Eintrag: Schritt 1, nicht fertig', () => {
    expect(ablaufStandLaden('umzug', 4, false)).toEqual({ schritt: 0, fertig: false });
  });
  it('speichert und liest zurück', () => {
    expect(ablaufStandSichern('umzug', { schritt: 2, fertig: false }, false)).toBe(true);
    expect(JSON.parse(store[KEY])).toEqual({ schritt: 2, fertig: false });
    expect(ablaufStandLaden('umzug', 4, false)).toEqual({ schritt: 2, fertig: false });
  });
  it('kaputter oder fremder Wert gilt als «noch nicht begonnen»', () => {
    store[KEY] = '{kaputt';
    expect(ablaufStandLaden('umzug', 4, false)).toEqual({ schritt: 0, fertig: false });
    store[KEY] = JSON.stringify({ schritt: 9, fertig: 'ja' });
    expect(ablaufStandLaden('umzug', 4, false)).toEqual({ schritt: 0, fertig: false });
  });
  it('im Beispiel: weder lesen noch schreiben', () => {
    store[KEY] = JSON.stringify({ schritt: 3, fertig: true });
    expect(ablaufStandLaden('umzug', 4, true)).toEqual({ schritt: 0, fertig: false });
    expect(ablaufStandSichern('umzug', { schritt: 1, fertig: false }, true)).toBe(false);
    expect(JSON.parse(store[KEY])).toEqual({ schritt: 3, fertig: true });
  });
  it('der Schlüssel beginnt mit or5_ (fällt unter «Alle Daten löschen»)', () => {
    expect(KEY.startsWith('or5_')).toBe(true);
  });
});

describe('Umzug — ein Schritt nach dem anderen', () => {
  it('Start: Schritt 1 von 4, nur dieser Schritt, «Erledigt, weiter ›»', () => {
    const html = render();
    expect(html).toContain('Schritt 1 von 4');
    expect(html).toContain('data-umzug-schritt="1"');
    expect(html).toContain(ohneNummer(de.umzug.step1Title));
    expect(html).not.toContain(de.umzug.step1Title); // Nummer steht schon in «Schritt 1 von 4»
    expect(html).toContain('Erledigt, weiter ›');
    expect(html).not.toContain('Zurück');
    expect(html).not.toContain(de.umzug.step3Post);
    expect(html).toContain('data-ablauf-pass="0"');
  });

  it('Einleitung und Quellen bleiben auf jeder Stufe', () => {
    for (const stand of [undefined, { schritt: 2, fertig: false }, { schritt: 3, fertig: true }]) {
      store = {};
      const html = render({ stand });
      expect(html).toContain('Ein Umzug zieht viele kleine Schritte nach sich.');
      expect(html).toContain('RHG Art. 11');
      expect(html).toContain('OR Art. 266c');
    }
  });

  it('Schritt 2: Art des Umzugs, 14-Tage-Satz, Frist-Karte mit Datum, Krankenkassen-Verweis', () => {
    const html = render({ stand: { schritt: 1, fertig: false }, data: { wohnen: { moveInDate: '2099-01-10' } } });
    expect(html).toContain('Schritt 2 von 4');
    expect(html).toContain(de.umzug.typeLabel);
    expect(html).toContain(de.umzug.step2Text.sie);
    expect(html).toContain('data-frist-karte="offen"');
    expect(html).toContain('Anmeldung Gemeinde');
    expect(html).toContain('bis ' + formatDE('2099-01-24'));
    expect(html).toContain('In den Kalender');
    expect(html).toContain('Krankenkassen-Prämie prüfen');
    expect(html).toContain(de.umzug.linkMietzins);
    expect(html).toContain('Zurück');
  });

  it('Schritt 2 ohne Datum: kein Termin, keine Karte', () => {
    const html = render({ stand: { schritt: 1, fertig: false } });
    expect(html).toContain('Umzugsdatum');
    expect(html).not.toContain('data-frist-karte');
  });

  it('Schritt 2, Frist vorbei: ruhiger Satz in der Karte, kein Kalender-Knopf', () => {
    const html = render({ stand: { schritt: 1, fertig: false }, data: { wohnen: { moveInDate: '2020-01-10' } } });
    expect(html).toContain('data-frist-karte="vorbei"');
    expect(html).toContain('Die 14 Tage waren am ' + formatDE('2020-01-24') + ' vorbei.');
    expect(html).not.toContain('In den Kalender');
  });

  it('Schritt 3: alle acht Stellen, merken, «Alle in die Merkliste», Adressänderungs-Brief', () => {
    const html = render({ stand: { schritt: 2, fertig: false } });
    for (const k of ['Post', 'Kk', 'Employer', 'Ahv', 'Tax', 'Insurance', 'Bank', 'Subs']) {
      expect(html).toContain(de.umzug['step3' + k].replace('&', '&amp;'));
    }
    expect(html).toContain('merken');
    expect(html).toContain(de.umzug.step3AddAll);
    expect(html).toContain(de.umzug.linkAddressChange);
  });

  it('Schritt 4: Kündigung, Hauptknopf «Ablauf abschliessen»', () => {
    const html = render({ stand: { schritt: 3, fertig: false } });
    expect(html).toContain('Schritt 4 von 4');
    expect(html).toContain(de.umzug.step4Text.sie);
    expect(html).toContain(de.umzug.step4Link);
    expect(html).toContain('Ablauf abschliessen');
    expect(html).not.toContain('Erledigt, weiter ›');
  });

  it('abgeschlossen: «Der Umzug ist geordnet» mit Satz, Ablauf wieder ansehbar', () => {
    const html = render({ stand: { schritt: 3, fertig: true } });
    expect(html).toContain('Der Umzug ist geordnet');
    expect(html).toContain(de.umzug.fertigText);
    expect(html).toContain('Ablauf nochmals ansehen');
    expect(html).toContain('data-ablauf-pass="fertig"');
  });

  it('im Beispiel beginnt der Ablauf vorne, der echte Stand bleibt unberührt', () => {
    const html = render({ stand: { schritt: 3, fertig: true }, vorlaeufig: true });
    expect(html).toContain('Schritt 1 von 4');
    expect(JSON.parse(store[KEY])).toEqual({ schritt: 3, fertig: true });
  });
});

describe('EreignisFrist ohne Karte (alle anderen Abläufe) bleibt wie bisher', () => {
  it('Satz + Hauptknopf mit Datum', () => {
    const html = renderToStaticMarkup(React.createElement(EreignisFrist, {
      palette, t, id: 'x', frist: () => '2099-01-24', wert: '2099-01-10',
      labelKey: 'umzug.fristLabel', hinweisKey: 'umzug.fristHinweis', vorbeiKey: 'umzug.fristVorbei',
      buttonKey: 'umzug.step2Button', doneKey: 'umzug.step2Done', calendarKey: 'umzug.step2CalendarLink',
      reminderTitle: 'X',
    }));
    expect(html).toContain('Anmelden bis spätestens ' + formatDE('2099-01-24'));
    expect(html).toContain('Frist «Anmeldung Gemeinde» in den Kalender (' + formatDE('2099-01-24') + ')');
    expect(html).not.toContain('data-frist-karte');
  });
});
