import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { formatDE } from '../utils/helpers.js';
import { ablaufStandLaden, ablaufStandSichern, ablaufStandKey } from '../utils/ablaufStand.js';
import { UmzugAblauf, ohneNummer, umzugsDatumVorschlag } from '../UmzugAblauf.jsx';
import { plusTage, heuteIso } from '../utils/fristen.js';
import { EreignisFrist } from '../AblaufSchale.jsx';

// Fassung 5 · Ablauf Umzug (Entscheid Stebler Studios 23.10.2026): ein Schritt nach dem anderen auf
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
    // Seit der Ablauf-Schale W (F7-A1, 27.10.2026) stehen alle Schritte im DOM, die übrigen `hidden`
    // (Eingaben bleiben beim Blättern). «Nur dieser Schritt» heisst darum: nur er ist sichtbar.
    expect(html).toContain('data-ablauf-schritt="1"><');
    expect(html).toContain('data-ablauf-schritt="3" hidden=""');
    expect(html).toContain(ohneNummer(de.umzug.step1Title));
    expect(html).not.toContain(de.umzug.step1Title); // Nummer steht schon in «Schritt 1 von 4»
    expect(html).toContain('Erledigt, weiter ›');
    expect(html).not.toContain('Zurück');
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

  it('Frist vorbei: ruhiger Satz in der Karte, kein Kalender-Knopf', () => {
    const html = renderToStaticMarkup(React.createElement(EreignisFrist, {
      palette, t, id: 'x', frist: () => '2020-01-24', wert: '2020-01-10', onWert: () => {},
      labelKey: 'umzug.fristLabel', hinweisKey: 'umzug.fristHinweis', vorbeiKey: 'umzug.fristVorbei',
      buttonKey: 'umzug.step2Button', doneKey: 'umzug.step2Done', calendarKey: 'umzug.step2CalendarLink',
      karte: { titelKey: 'umzug.fristKarteTitel', bisKey: 'umzug.fristKarteBis', knopfKey: 'kvg.addToCalendar' },
      reminderTitle: 'X',
    }));
    expect(html).toContain('data-frist-karte="vorbei"');
    expect(html).toContain('Die 14 Tage waren am ' + formatDE('2020-01-24') + ' vorbei.');
    expect(html).not.toContain('In den Kalender');
  });

  // «Wohnt hier seit» ist meist der letzte Umzug, nicht dieser (Befund 23.10.2026: Maria zeigte
  // «Die 14 Tage waren am 15.08.2021 vorbei»).
  it('Umzugsdatum: altes Einzugsdatum nicht übernehmen, im Beispiel ein Umzug in einer Woche', () => {
    expect(umzugsDatumVorschlag('2099-01-10', 'echt')).toBe('2099-01-10');
    expect(umzugsDatumVorschlag('2021-08-01', 'echt')).toBe('');
    expect(umzugsDatumVorschlag('', 'probe')).toBe('');
    expect(umzugsDatumVorschlag('2021-08-01', 'beispiel')).toBe(plusTage(heuteIso(), 7));
    const html = renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: true },
      React.createElement(UmzugAblauf, { palette, t, data: { wohnen: { moveInDate: '2021-08-01' } }, chapters: [{ key: 'wohnen' }], onNavigate: () => {}, datenModus: 'beispiel' })));
    expect(html).not.toContain('2021');
  });

  it('Kopf wie im Mockup: Landschaftsband, Brotkrume mit Bereich, Stationsnamen auf der Strasse', () => {
    const html = renderToStaticMarkup(React.createElement(UmzugAblauf, { palette, t, data: {}, chapters: [{ key: 'wohnen', title: 'Wohnen & Leben' }], onNavigate: () => {} }));
    expect(html).toContain('data-ablauf-band');
    expect(html).toContain('aria-label="Pfad"');
    expect(html).toContain('Wohnen &amp; Leben');
    expect(html).toContain('aria-current="page"');
    for (const n of ['Adresse', 'Gemeinde', 'Nachführen', 'Kündigen']) expect(html).toContain('>' + n + '</text>');
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

  // Entwurf W (F7-A1): der Abschluss ist für alle Abläufe derselbe — «Alle N Schritte sind erledigt» +
  // «Zur Übersicht» + «Ablauf nochmals ansehen». Der eigene Satz des Umzugs («Der Umzug ist geordnet») entfällt.
  it('abgeschlossen: «Alle 4 Schritte sind erledigt», zur Übersicht, Ablauf wieder ansehbar', () => {
    const html = render({ stand: { schritt: 3, fertig: true } });
    expect(html).toContain('Alle 4 Schritte sind erledigt');
    expect(html).toContain('Zur Übersicht');
    expect(html).toContain('data-ablauf-schritt="fertig"');
    expect(html).toContain('Ablauf nochmals ansehen');
    expect(html).toContain('data-ablauf-pass="fertig"');
  });

  it('im Beispiel beginnt der Ablauf vorne, der echte Stand bleibt unberührt', () => {
    const html = render({ stand: { schritt: 3, fertig: true }, vorlaeufig: true });
    expect(html).toContain('Schritt 1 von 4');
    expect(JSON.parse(store[KEY])).toEqual({ schritt: 3, fertig: true });
  });
});

// Entwurf W (F7-A1): «Frist als Karte in jedem Ablauf». Ohne eigene Karten-Texte trägt die Karte den
// Titel der Erinnerung und «bis Datum»; der Satz mit dem Gesetzesartikel bleibt darüber.
describe('EreignisFrist ohne eigene Karten-Texte (alle anderen Abläufe): Satz + Karte', () => {
  it('Satz mit Datum, Karte «Titel · bis Datum» mit «In den Kalender»', () => {
    const html = renderToStaticMarkup(React.createElement(EreignisFrist, {
      palette, t, id: 'x', frist: () => '2099-01-24', wert: '2099-01-10',
      labelKey: 'umzug.fristLabel', hinweisKey: 'umzug.fristHinweis', vorbeiKey: 'umzug.fristVorbei',
      buttonKey: 'umzug.step2Button', doneKey: 'umzug.step2Done', calendarKey: 'umzug.step2CalendarLink',
      reminderTitle: 'X',
    }));
    expect(html).toContain('Anmelden bis spätestens ' + formatDE('2099-01-24'));
    expect(html).toContain('data-frist-karte="offen"');
    expect(html).toContain('>X<');
    expect(html).toContain('bis ' + formatDE('2099-01-24'));
    expect(html).toContain('In den Kalender');
    expect(html).not.toContain('Frist «Anmeldung Gemeinde» in den Kalender');
  });
});
