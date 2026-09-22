import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  VORGANG_STATUS, ANWENDBARKEIT, UMZUG_TYPEN, VORGANG_TYPEN,
  aufgabenFuer, fristFuer, fortschritt, naechsteAufgabe, vorgangTyp,
} from '../data/vorgaenge.js';
import {
  vorgaengeAus, vorgangMitId, aktiverVorgang, vorgangAnlegen, vorgangAendern,
  aufgabeNotieren, vorgangAbschliessen, vorgangEntfernen,
} from '../utils/vorgaenge.js';
import { migrateData, detectVersion, CURRENT_DATA_VERSION } from '../utils/dataMigration.js';

// Vorgänge 1.0 (O12) — Domäne, Schreibweg und Migration. Alles ohne Oberfläche.
// Die Tests halten fest, was ZUGESAGT ist (Anwendbarkeit, Frist am Stichtag, ehrliche
// Zählung), nicht wie es heute geschrieben steht.

const umzug = (kontext = {}, stichtag = '2026-11-01') => {
  const { vorgang } = vorgangAnlegen({}, { typ: 'umzug', stichtag, kontext });
  return vorgang;
};

describe('Vorgangs-Registry', () => {
  it('Status und Anwendbarkeit bleiben klein und getrennt', () => {
    expect(VORGANG_STATUS).toEqual(['entwurf', 'aktiv', 'abgeschlossen']);
    expect(ANWENDBARKEIT).toEqual(['zutreffend', 'nichtZutreffend', 'unbekannt']);
  });

  it('jede Aufgabe hat einen eindeutigen Schlüssel und einen i18n-Schlüssel', () => {
    for (const typ of Object.values(VORGANG_TYPEN)) {
      const keys = typ.aufgaben.map((a) => a.key);
      expect(new Set(keys).size, `Typ "${typ.key}" hat doppelte Aufgaben-Schlüssel`).toBe(keys.length);
      for (const a of typ.aufgaben) {
        expect(typeof a.i18n === 'string' && a.i18n.length > 0, `Aufgabe "${a.key}" ohne i18n`).toBe(true);
      }
    }
  });

  it('unbekannter Typ liefert nichts — statt etwas zu erfinden', () => {
    expect(vorgangTyp('mondlandung')).toBe(null);
    expect(aufgabenFuer({ typ: 'mondlandung' }, {})).toEqual([]);
  });

  it('die Aufgabenliste ist deterministisch: gleiche Eingabe, gleiche Ausgabe', () => {
    const v = umzug({ umzugType: 'extra' });
    const data = { finanzen: { employer: 'Muster AG' }, wohnen: { rentAmount: '1400' } };
    expect(aufgabenFuer(v, data)).toEqual(aufgabenFuer(v, data));
  });
});

describe('Umzug — Anwendbarkeit folgt dem Typ', () => {
  const finde = (v, key, data = {}) => aufgabenFuer(v, data).find((a) => a.key === key);

  it('alle bekannten Umzugs-Typen sind abgedeckt', () => {
    for (const typ of UMZUG_TYPEN) {
      const v = umzug({ umzugType: typ });
      expect(aufgabenFuer(v, {}).length).toBeGreaterThan(0);
    }
  });

  it('gleiche Gemeinde: keine Prämienregion, kein Mietzins, keine Steuerfolgen', () => {
    const v = umzug({ umzugType: 'gemeinde' });
    expect(finde(v, 'praemienregion').anwendbarkeit).toBe('nichtZutreffend');
    expect(finde(v, 'mietzinsbeitraege').anwendbarkeit).toBe('nichtZutreffend');
    expect(finde(v, 'steuerfolgen').anwendbarkeit).toBe('nichtZutreffend');
  });

  it('anderer Kanton: Steuerfolgen kommen dazu', () => {
    const v = umzug({ umzugType: 'extra' });
    expect(finde(v, 'praemienregion').anwendbarkeit).toBe('zutreffend');
    expect(finde(v, 'steuerfolgen').anwendbarkeit).toBe('zutreffend');
  });

  it('andere Gemeinde im gleichen Kanton: Prämienregion ja, Steuerfolgen nein', () => {
    const v = umzug({ umzugType: 'kanton' });
    expect(finde(v, 'praemienregion').anwendbarkeit).toBe('zutreffend');
    expect(finde(v, 'steuerfolgen').anwendbarkeit).toBe('nichtZutreffend');
  });

  it('ohne gewählten Typ wird nichts behauptet', () => {
    const v = umzug({});
    expect(finde(v, 'steuerfolgen').anwendbarkeit).toBe('nichtZutreffend');
    // Die immer zutreffenden Schritte bleiben zutreffend.
    expect(finde(v, 'einwohnerkontrolle').anwendbarkeit).toBe('zutreffend');
  });
});

describe('Umzug — Anwendbarkeit aus der Lebensmappe', () => {
  const finde = (key, data) => aufgabenFuer(umzug({ umzugType: 'kanton' }), data).find((a) => a.key === key);

  it('Arbeitgeber: leere Mappe heisst „unbekannt", nicht „trifft nicht zu"', () => {
    expect(finde('arbeitgeber', {}).anwendbarkeit).toBe('unbekannt');
  });

  it('Arbeitgeber: erfasste Stelle heisst zutreffend', () => {
    expect(finde('arbeitgeber', { finanzen: { employer: 'Muster AG' } }).anwendbarkeit).toBe('zutreffend');
  });

  it('Arbeitgeber: pensioniert heisst nicht zutreffend', () => {
    expect(finde('arbeitgeber', { finanzen: { employmentType: 'retired' } }).anwendbarkeit).toBe('nichtZutreffend');
  });

  it('Kündigung: ohne erfasste Miete wird kein Mietverhältnis behauptet', () => {
    expect(finde('wohnungKuendigen', {}).anwendbarkeit).toBe('unbekannt');
    expect(finde('wohnungKuendigen', { wohnen: { rentAmount: '1400' } }).anwendbarkeit).toBe('zutreffend');
  });

  it('„trifft mich nicht zu" der Person schlägt die Regel — aber nur in diese Richtung', () => {
    const v = umzug({ umzugType: 'extra' });
    const data = { finanzen: { employer: 'Muster AG' } };
    const mitNotiz = aufgabeNotieren({ vorgaenge: [v] }, v.id, 'arbeitgeber', { nichtZutreffend: true });
    const nachher = vorgangMitId(mitNotiz, v.id);
    expect(aufgabenFuer(nachher, data).find((a) => a.key === 'arbeitgeber').anwendbarkeit).toBe('nichtZutreffend');

    // Zurückgenommen wird wieder die Regel gefragt, nicht „zutreffend" eingefroren.
    const zurueck = aufgabeNotieren(mitNotiz, v.id, 'arbeitgeber', { nichtZutreffend: false });
    expect(aufgabenFuer(vorgangMitId(zurueck, v.id), {}).find((a) => a.key === 'arbeitgeber').anwendbarkeit)
      .toBe('unbekannt');
  });
});

describe('Frist hängt am Stichtag, nicht an heute', () => {
  it('Anmeldung: Stichtag + 14 Tage', () => {
    const v = umzug({ umzugType: 'extra' }, '2026-11-01');
    const a = aufgabenFuer(v, {}).find((x) => x.key === 'einwohnerkontrolle');
    expect(a.frist).toBe('2026-11-15');
  });

  it('über einen Monatswechsel hinweg korrekt', () => {
    const v = umzug({}, '2026-12-25');
    expect(aufgabenFuer(v, {}).find((x) => x.key === 'einwohnerkontrolle').frist).toBe('2027-01-08');
  });

  it('ohne Stichtag gibt es keine Frist — und keinen Ersatz aus „heute"', () => {
    const v = umzug({}, null);
    const a = aufgabenFuer(v, {}).find((x) => x.key === 'einwohnerkontrolle');
    expect(a.frist).toBe(null);
  });

  it('ein Stichtag in der Vergangenheit ergibt eine Frist in der Vergangenheit', () => {
    // Der Regressionstest zum Fehler in UmzugAblauf.jsx:25 (inDays(14) ab heute):
    // eine Frist, die immer 14 Tage in der Zukunft liegt, wäre hier grün — diese nicht.
    const v = umzug({}, '2020-03-01');
    const a = aufgabenFuer(v, {}).find((x) => x.key === 'einwohnerkontrolle');
    expect(a.frist).toBe('2020-03-15');
    expect(a.frist < new Date().toISOString().slice(0, 10)).toBe(true);
  });

  it('nur die belegte Frist existiert — keine erfundene Abmeldefrist', () => {
    const mitFrist = aufgabenFuer(umzug({ umzugType: 'extra' }), {}).filter((a) => a.frist);
    expect(mitFrist.map((a) => a.key)).toEqual(['einwohnerkontrolle']);
  });

  it('unlesbarer Stichtag ergibt keine Frist', () => {
    expect(fristFuer({ stichtag: 'morgen' }, { fristTage: 14 })).toBe(null);
    expect(fristFuer({ stichtag: '2026-13-45' }, { fristTage: 14 })).not.toBe('2026-13-59');
  });
});

describe('Fortschritt wird gezählt, nicht geschätzt', () => {
  it('nicht zutreffende Aufgaben zählen weder als offen noch als erledigt', () => {
    const alle = fortschritt(umzug({ umzugType: 'extra' }), {}, []);
    const wenige = fortschritt(umzug({ umzugType: 'gemeinde' }), {}, []);
    expect(wenige.gesamt).toBeLessThan(alle.gesamt);
    expect(wenige.erledigt).toBe(0);
    expect(wenige.offen).toBe(wenige.gesamt);
  });

  it('erledigt wird aus der Merkliste abgeleitet — es gibt keinen zweiten Zustand', () => {
    const v = umzug({ umzugType: 'extra' });
    const mit = aufgabeNotieren({ vorgaenge: [v] }, v.id, 'post', { todoId: 'm1' });
    const vorgang = vorgangMitId(mit, v.id);

    expect(fortschritt(vorgang, {}, [{ id: 'm1', done: false }]).erledigt).toBe(0);
    expect(fortschritt(vorgang, {}, [{ id: 'm1', done: true }]).erledigt).toBe(1);
  });

  it('offen + erledigt ergibt immer die Gesamtzahl', () => {
    const v = umzug({ umzugType: 'kanton' });
    const f = fortschritt(v, { finanzen: { employer: 'X' } }, [{ id: 'm1', done: true }]);
    expect(f.offen + f.erledigt).toBe(f.gesamt);
  });

  it('nächste Aufgabe: die mit Frist zuerst, sonst der Reihe nach', () => {
    const v = umzug({ umzugType: 'extra' });
    expect(naechsteAufgabe(v, {}, []).key).toBe('einwohnerkontrolle');
  });

  it('ist alles Zutreffende erledigt, gibt es keine nächste Aufgabe', () => {
    const v = umzug({ umzugType: 'gemeinde' });
    let data = { vorgaenge: [v] };
    const todos = [];
    for (const a of aufgabenFuer(v, {}).filter((x) => x.anwendbarkeit !== 'nichtZutreffend')) {
      const id = 'm_' + a.key;
      data = aufgabeNotieren(data, v.id, a.key, { todoId: id });
      todos.push({ id, done: true });
    }
    const fertig = vorgangMitId(data, v.id);
    expect(naechsteAufgabe(fertig, {}, todos)).toBe(null);
    expect(fortschritt(fertig, {}, todos).offen).toBe(0);
  });
});

describe('Schreibweg — rein, ohne Speicher', () => {
  it('anlegen gibt einen Vorgang mit stabiler ID und leeren Notizen', () => {
    const { data, vorgang } = vorgangAnlegen({ basis: { firstName: 'A' } }, {
      typ: 'umzug', stichtag: '2026-11-01', kontext: { umzugType: 'extra' },
    });
    expect(vorgang.id).toBeTruthy();
    expect(vorgang.status).toBe('aktiv');
    expect(vorgang.aufgaben).toEqual({});
    expect(data.basis.firstName).toBe('A');
    expect(vorgaengeAus(data)).toHaveLength(1);
  });

  it('zwei Vorgänge bekommen verschiedene IDs', () => {
    const a = vorgangAnlegen({}, { typ: 'umzug' }).vorgang;
    const b = vorgangAnlegen({}, { typ: 'umzug' }).vorgang;
    expect(a.id).not.toBe(b.id);
  });

  it('die übergebenen Daten werden nicht verändert', () => {
    const vorher = { basis: { firstName: 'A' } };
    const abdruck = JSON.stringify(vorher);
    const { data } = vorgangAnlegen(vorher, { typ: 'umzug' });
    expect(JSON.stringify(vorher)).toBe(abdruck);
    expect(data).not.toBe(vorher);
  });

  it('unbekannter Typ legt nichts an und lässt die Daten in Ruhe', () => {
    const vorher = { basis: {} };
    const { data, vorgang } = vorgangAnlegen(vorher, { typ: 'mondlandung' });
    expect(vorgang).toBe(null);
    expect(vorgaengeAus(data)).toHaveLength(0);
  });

  it('ungültiger Stichtag wird null — nie „heute"', () => {
    const { vorgang } = vorgangAnlegen({}, { typ: 'umzug', stichtag: 'bald' });
    expect(vorgang.stichtag).toBe(null);
  });

  it('ändern führt den Kontext zusammen und lässt ID, Typ und Start unberührt', () => {
    const { data, vorgang } = vorgangAnlegen({}, { typ: 'umzug', kontext: { umzugType: 'kanton' } });
    const nachher = vorgangAendern(data, vorgang.id, {
      stichtag: '2026-12-01', kontext: { notiz: 'x' },
      id: 'gekapert', typ: 'todesfall', gestartetAm: '1999-01-01',
    });
    const v = vorgangMitId(nachher, vorgang.id);
    expect(v.kontext).toEqual({ umzugType: 'kanton', notiz: 'x' });
    expect(v.stichtag).toBe('2026-12-01');
    expect(v.typ).toBe('umzug');
    expect(v.gestartetAm).toBe(vorgang.gestartetAm);
  });

  it('ein unbekannter Status wird nicht übernommen', () => {
    const { data, vorgang } = vorgangAnlegen({}, { typ: 'umzug' });
    const nachher = vorgangAendern(data, vorgang.id, { status: 'schwebend' });
    expect(vorgangMitId(nachher, vorgang.id).status).toBe('aktiv');
  });

  it('ändern an einer unbekannten ID lässt alles, wie es war', () => {
    const { data } = vorgangAnlegen({}, { typ: 'umzug' });
    expect(vorgangAendern(data, 'gibtsnicht', { stichtag: '2026-01-01' })).toEqual(data);
  });

  it('abschliessen behält alles und hält den Zeitpunkt fest', () => {
    const { data, vorgang } = vorgangAnlegen({}, { typ: 'umzug', kontext: { umzugType: 'extra' } });
    const mitNotiz = aufgabeNotieren(data, vorgang.id, 'post', { todoId: 'm1' });
    const zu = vorgangMitId(vorgangAbschliessen(mitNotiz, vorgang.id), vorgang.id);
    expect(zu.status).toBe('abgeschlossen');
    expect(zu.abgeschlossenAm).toBeTruthy();
    expect(zu.kontext.umzugType).toBe('extra');
    expect(zu.aufgaben.post.todoId).toBe('m1');
  });

  it('aktiverVorgang findet nur laufende des richtigen Typs', () => {
    const { data, vorgang } = vorgangAnlegen({}, { typ: 'umzug' });
    expect(aktiverVorgang(data, 'umzug').id).toBe(vorgang.id);
    expect(aktiverVorgang(vorgangAbschliessen(data, vorgang.id), 'umzug')).toBe(null);
  });

  it('entfernen nimmt nur den Vorgang — die Merkpunkte gehören der Person', () => {
    const { data, vorgang } = vorgangAnlegen({ basis: { firstName: 'A' } }, { typ: 'umzug' });
    const nachher = vorgangEntfernen(data, vorgang.id);
    expect(vorgaengeAus(nachher)).toHaveLength(0);
    expect(nachher.basis.firstName).toBe('A');
  });

  it('beschädigte Daten blockieren nichts', () => {
    expect(vorgaengeAus(null)).toEqual([]);
    expect(vorgaengeAus({ vorgaenge: 'kaputt' })).toEqual([]);
    expect(vorgangMitId(undefined, 'x')).toBe(null);
    expect(aktiverVorgang({ vorgaenge: [null, undefined] }, 'umzug')).toBe(null);
  });
});

describe('Migration v4 → v5', () => {
  let original;
  beforeEach(() => {
    original = globalThis.localStorage;
    const ablage = new Map();
    globalThis.localStorage = {
      getItem: (k) => (ablage.has(k) ? ablage.get(k) : null),
      setItem: (k, v) => ablage.set(k, String(v)),
      removeItem: (k) => ablage.delete(k),
    };
  });
  afterEach(() => { globalThis.localStorage = original; });

  it('die aktuelle Fassung ist 5', () => {
    expect(CURRENT_DATA_VERSION).toBe(5);
  });

  it('v4 bekommt ein leeres Vorgangs-Feld, sonst nichts', () => {
    const vorher = { _version: 4, basis: { firstName: 'A' }, wohnen: { city: 'Basel' } };
    const { data, migrated, error } = migrateData(vorher);
    expect(error).toBe(null);
    expect(migrated).toBe(true);
    expect(data.vorgaenge).toEqual([]);
    expect(data.basis).toEqual({ firstName: 'A' });
    expect(data.wohnen).toEqual({ city: 'Basel' });
    expect(detectVersion(data)).toBe(5);
  });

  it('nichts wird aus Altdaten gedeutet — eine Merkliste macht keinen Vorgang', () => {
    const { data } = migrateData({ _version: 4, wohnen: { city: 'Basel', address: 'Musterweg 1' } });
    expect(data.vorgaenge).toEqual([]);
  });

  it('vorhandene Vorgänge aus einer neueren Sicherung bleiben unberührt', () => {
    const v = vorgangAnlegen({}, { typ: 'umzug' }).vorgang;
    const { data } = migrateData({ _version: 4, vorgaenge: [v] });
    expect(data.vorgaenge).toHaveLength(1);
    expect(data.vorgaenge[0].id).toBe(v.id);
  });

  it('Altdaten ohne Fassung laufen bis 5 durch', () => {
    const { data, error } = migrateData({ basis: { fullName: 'Anna Muster' } });
    expect(error).toBe(null);
    expect(detectVersion(data)).toBe(5);
    expect(data.vorgaenge).toEqual([]);
    expect(data.basis.firstName).toBe('Anna');   // v1→v2 lief weiterhin
  });

  it('eine leere Installation landet ebenfalls auf 5', () => {
    const { data } = migrateData({});
    expect(detectVersion(data)).toBe(5);
    expect(data.vorgaenge).toEqual([]);
  });

  it('bereits aktuelle Daten werden nicht angefasst', () => {
    const vorher = { _version: 5, vorgaenge: [], basis: {} };
    const { migrated } = migrateData(vorher);
    expect(migrated).toBe(false);
  });
});
