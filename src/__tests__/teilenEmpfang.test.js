import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { getChapters } from '../config/constants.js';
import { DocumentTresor } from '../DocumentTresor.jsx';
import { GeteiltEingang } from '../components/GeteiltEingang.jsx';
import {
  GETEILT_CACHE, GETEILT_ORDNER, NAME_KOPF, MAX_GETEILT_BYTES,
  geteilteDateienLesen, geteilteDateiEntfernen, dateienInEingang, dateinameAusKopf, alsDokument,
} from '../utils/teilenEmpfang.js';

// Teilen-Empfang (09.11.2026): eine Datei über «Teilen …» an die installierte App kommt als
// POST beim Service Worker an, wartet in einem Cache auf diesem Gerät und wird erst in der
// Ablage von der Person eingeordnet. Nie automatisch abgelegt, nie ins Netz.

const SW = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const MANIFEST = JSON.parse(readFileSync(new URL('../../public/manifest.json', import.meta.url), 'utf8'));
const ORIGIN = 'https://malojaplana.ch';
const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

const swWert = (name) => SW.match(new RegExp(`const ${name} = ([^;]+);`))?.[1];

function swLaden({ scope } = {}) {
  const caches = new Map();
  const offen = (name) => { if (!caches.has(name)) caches.set(name, new Map()); return caches.get(name); };
  const hoerer = {};
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (typ, fn) => { hoerer[typ] = fn; },
    skipWaiting: () => {}, clients: { claim: () => {} },
    registration: scope ? { scope } : {},
  };
  const kontext = {
    self, URL, Set, Promise, Array, String, Response, console, encodeURIComponent,
    caches: {
      open: async (name) => {
        const c = offen(name);
        return { put: async (k, v) => { c.set(typeof k === 'string' ? k : k.url, v); }, add: async () => {}, match: async () => undefined };
      },
      keys: async () => [...caches.keys()],
      delete: async (name) => caches.delete(name),
    },
    fetch: async () => { throw new Error('kein Netz im Test'); },
  };
  vm.runInNewContext(SW, kontext);
  return { hoerer, caches, offen };
}

const teilen = (sw, { dateien = [], url = ORIGIN + '/teilen-empfang', method = 'POST' } = {}) => {
  const formular = new FormData();
  dateien.forEach((d) => formular.append('datei', d));
  let antwort;
  const request = { method, url, formData: async () => formular, mode: 'navigate' };
  sw.hoerer.fetch({ request, respondWith: (p) => { antwort = p; } });
  return antwort;
};

describe('Teilen-Empfang · Manifest und Service Worker sprechen dieselbe Sprache', () => {
  it('Cache-Name, Ordner, Kopf und Grenze stehen in sw.js gleich wie im Modul', () => {
    expect(swWert('GETEILT_CACHE')).toBe(`'${GETEILT_CACHE}'`);
    expect(swWert('GETEILT_ORDNER')).toBe(`'${GETEILT_ORDNER}'`);
    expect(swWert('NAME_KOPF')).toBe(`'${NAME_KOPF}'`);
    expect(swWert('MAX_GETEILT_BYTES')).toBe('20 * 1024 * 1024');
    expect(MAX_GETEILT_BYTES).toBe(20 * 1024 * 1024);
  });

  it('share_target zeigt auf den Pfad, den der Service Worker annimmt, mit dem Feld «datei»', () => {
    const st = MANIFEST.share_target;
    expect(st).toMatchObject({ action: './teilen-empfang', method: 'POST', enctype: 'multipart/form-data' });
    expect(st.params.files.map((f) => f.name)).toEqual(['datei']);
    expect(SW).toContain("const TEILEN_PFAD = BASIS + 'teilen-empfang';");
    expect(SW).toContain(".getAll('datei')");
  });

  it('ohne aktiven Service Worker nimmt der Server die Datei nicht an, sondern schickt zur App (.htaccess-Abschrift)', () => {
    // Server-Regel von Hand gesetzt 10.11.2026, per curl belegt (POST → 303 /). Die Abschrift
    // muss sie tragen, sonst ginge sie beim nächsten Abgleich verloren. Seit dem Umzug der App
    // nach /app/ (#776) heisst das Teilen-Ziel /app/teilen-empfang: beide Pfade → /app/.
    const ht = readFileSync(new URL('../../public/.htaccess', import.meta.url), 'utf8');
    const zeilen = ht.split('\n').filter((z) => !z.trim().startsWith('#'));
    const i = zeilen.findIndex((z) => z.trim() === 'RewriteRule ^(app/)?teilen-empfang/?$ /app/ [R=303,L]');
    expect(i).toBeGreaterThan(0);
    expect(zeilen[i - 1].trim()).toBe('RewriteCond %{REQUEST_METHOD} =POST');
    // Der Pfad der Regel ist derselbe, den Manifest und Service Worker benutzen.
    expect(MANIFEST.share_target.action).toBe('./teilen-empfang');
  });

  it('die Kürzel im Manifest bleiben (Steuern, IPV, Notfall, Ablage)', () => {
    expect(MANIFEST.shortcuts.map((s) => s.url)).toEqual(['./#/tax', './#/premium', './#/notfalleinstieg', './#/tresor']);
  });
});

describe('Teilen-Empfang · Service Worker', () => {
  it('legt eine geteilte Datei mit Namen in den Eingang und öffnet die Ablage (303)', async () => {
    const sw = swLaden();
    const antwort = await teilen(sw, { dateien: [new File(['%PDF-1'], 'Police KK 2027.pdf', { type: 'application/pdf' })] });
    expect(antwort.status).toBe(303);
    expect(antwort.headers.get('Location')).toBe(ORIGIN + '/#/tresor');
    const eingang = [...sw.offen(GETEILT_CACHE).entries()];
    expect(eingang).toHaveLength(1);
    const [schluessel, gespeichert] = eingang[0];
    expect(schluessel).toMatch(/^\/geteilt\/\d+-00$/);
    expect(decodeURIComponent(gespeichert.headers.get(NAME_KOPF))).toBe('Police KK 2027.pdf');
    expect(gespeichert.headers.get('Content-Type')).toBe('application/pdf');
    expect(await gespeichert.text()).toBe('%PDF-1');
  });

  it('nimmt leere und zu grosse Dateien nicht an — die Ablage öffnet trotzdem', async () => {
    const sw = swLaden();
    const gross = new File([new Uint8Array(MAX_GETEILT_BYTES + 1)], 'riesig.pdf', { type: 'application/pdf' });
    const antwort = await teilen(sw, { dateien: [gross, new File([], 'leer.pdf')] });
    expect(antwort.status).toBe(303);
    expect(sw.offen(GETEILT_CACHE).size).toBe(0);
  });

  it('läuft unter /app/ mit (pfadneutral): Pfad und Weiterleitung hängen am Scope', async () => {
    const sw = swLaden({ scope: ORIGIN + '/app/' });
    expect(await teilen(sw, { dateien: [new File(['x'], 'a.png', { type: 'image/png' })] })).toBeUndefined();
    const antwort = await teilen(sw, { url: ORIGIN + '/app/teilen-empfang', dateien: [new File(['x'], 'a.png', { type: 'image/png' })] });
    expect(antwort.headers.get('Location')).toBe(ORIGIN + '/app/#/tresor');
    expect([...sw.offen(GETEILT_CACHE).keys()][0]).toMatch(/^\/app\/geteilt\//);
  });

  it('fasst fremde Adressen und andere Anfragen nicht an', () => {
    const sw = swLaden();
    expect(teilen(sw, { url: 'https://fremd.example/teilen-empfang' })).toBeUndefined();
    expect(teilen(sw, { url: ORIGIN + '/anderes' })).toBeUndefined();
  });

  it('ein Update räumt alte Caches, aber nie den Eingang', async () => {
    const sw = swLaden();
    sw.offen('maloja-plana-alt');
    sw.offen(GETEILT_CACHE);
    let warten;
    sw.hoerer.activate({ waitUntil: (p) => { warten = p; } });
    await warten;
    expect([...sw.caches.keys()]).toEqual([GETEILT_CACHE]);
  });
});

describe('Teilen-Empfang · Lesen und Einordnen', () => {
  afterEach(() => { delete globalThis.caches; });

  const fakeCaches = (eintraege) => {
    const c = new Map(eintraege);
    globalThis.caches = { open: async () => ({
      keys: async () => [...c.keys()].map((url) => ({ url })),
      match: async (r) => c.get(r.url),
      delete: async (k) => c.delete(k),
    }) };
    return c;
  };

  it('liest wartende Dateien mit Namen, älteste zuerst; Entfernen nimmt sie heraus', async () => {
    const c = fakeCaches([
      ['/geteilt/2-00', new Response('bb', { headers: { 'Content-Type': 'image/png', [NAME_KOPF]: encodeURIComponent('Foto Brief.png') } })],
      ['/geteilt/1-00', new Response('a', { headers: { 'Content-Type': 'application/pdf', [NAME_KOPF]: encodeURIComponent('Lohnausweis.pdf') } })],
    ]);
    const liste = await geteilteDateienLesen();
    expect(liste.map((d) => [d.name, d.groesse])).toEqual([['Lohnausweis.pdf', 1], ['Foto Brief.png', 2]]);
    await geteilteDateiEntfernen('/geteilt/1-00');
    expect([...c.keys()]).toEqual(['/geteilt/2-00']);
  });

  it('«Datei hinzufügen» legt in denselben Eingang wie der Service Worker, unter dem Scope', async () => {
    const c = fakeCaches([]);
    globalThis.caches = { open: async () => ({
      put: async (k, v) => { c.set(k, v); },
      keys: async () => [...c.keys()].map((url) => ({ url })),
      match: async (r) => c.get(r.url),
    }) };
    const gross = new File([new Uint8Array(MAX_GETEILT_BYTES + 1)], 'riesig.pdf', { type: 'application/pdf' });
    const { angenommen, abgelehnt } = await dateienInEingang(
      [new File(['%PDF'], 'Mietvertrag.pdf', { type: 'application/pdf' }), new File([], 'leer.jpg'), gross], '/app/', 1234);
    expect(angenommen.map((d) => d.name)).toEqual(['Mietvertrag.pdf']);
    expect(abgelehnt.map((d) => d.name)).toEqual(['leer.jpg', 'riesig.pdf']);
    expect([...c.keys()]).toEqual(['/app/geteilt/1234-h00']);
    const [eins] = await geteilteDateienLesen();
    expect([eins.name, eins.typ, eins.groesse]).toEqual(['Mietvertrag.pdf', 'application/pdf', 4]);
  });

  it('«Datei hinzufügen» ohne Cache-API: angenommen, aber nur für diese Sitzung', async () => {
    const r = await dateienInEingang([new File(['x'], 'a.png', { type: 'image/png' })]);
    expect(r).toMatchObject({ ohneCache: true, abgelehnt: [] });
    expect(r.angenommen).toHaveLength(1);
  });

  it('ohne Cache-API: leerer Eingang statt Fehler', async () => {
    expect(await geteilteDateienLesen()).toEqual([]);
    expect(await geteilteDateiEntfernen('/geteilt/x')).toBe(false);
  });

  it('kaputter Namenskopf fällt auf den Ersatz zurück', () => {
    expect(dateinameAusKopf('%E0%A4%A', 'Datei')).toBe('Datei');
    expect(dateinameAusKopf(null, 'Datei')).toBe('Datei');
  });

  it('eingeordnete Datei hat dieselbe Form wie ein Upload im Kapitel, mit gewähltem Bereich', () => {
    const doc = alsDokument({
      datei: { name: 'Police.pdf', groesse: 2048 }, bereich: 'versicherungen', art: 'kk',
      ablauf: '2027-12-31', data: 'data:application/pdf;base64,AA==', heute: new Date('2026-11-09T10:00:00'),
    });
    expect(doc).toEqual({
      type: 'kk', chapter: 'versicherungen', fileName: 'Police.pdf', fileSize: '2.0 KB',
      uploadDate: '9.11.2026', expiryDate: '2027-12-31', status: 'active', data: 'data:application/pdf;base64,AA==',
    });
  });
});

describe('Teilen-Empfang · Eingang in der Ablage', () => {
  const datei = { schluessel: ORIGIN + '/geteilt/1-00', name: 'Police KK.pdf', typ: 'application/pdf', groesse: 2048, blob: null };

  it('ohne Datei: leere Status-Region und «Datei hinzufügen» (PDF und Bilder, mehrere)', () => {
    const html = renderToStaticMarkup(React.createElement(GeteiltEingang, { palette, t, chapters, onAblegen: async () => {}, laden: async () => [] }));
    expect(html).toContain('<div role="status" style="color:#777777;font-size:15px"></div>');
    expect(html).not.toContain('data-geteilt-eingang="offen"');
    expect(html).toMatch(/<label data-weg="datei-hinzufuegen"[^>]*>.*Datei hinzufügen<input type="file" multiple="" accept="application\/pdf,\.pdf,image\/\*"/);
  });

  it('mit Datei: Name, drei beschriftete Felder, Ablegen gesperrt bis alles gewählt ist, Verwerfen frei', () => {
    const html = renderToStaticMarkup(React.createElement(GeteiltEingang, { palette, t, chapters, onAblegen: async () => {}, laden: async () => [datei], start: [datei] }));
    expect(html).toContain('Noch nicht eingeordnet (1)');
    // «Datei hinzufügen» steht dann einmal, im Eingang unter der Liste.
    expect(html.match(/data-weg="datei-hinzufuegen"/g)).toHaveLength(1);
    expect(html).toContain('Police KK.pdf');
    for (const feld of ['bereich', 'art', 'ablauf']) expect(html).toMatch(new RegExp(`for="geteilt-${feld}-[a-z0-9]+"`, 'i'));
    expect(html).toMatch(/<button type="button" disabled=""[^>]*>Ablegen<\/button>/);
    expect(html).toMatch(/<button type="button"(?! disabled)[^>]*>Verwerfen<\/button>/);
    // Art ist erst wählbar, wenn ein Bereich gewählt ist.
    expect(html).toMatch(/<select id="geteilt-art-[a-z0-9]+" disabled=""/i);
  });

  it('die Ablage zeigt den Eingang nur, wenn main.jsx den Ablege-Weg mitgibt', () => {
    const basis = { palette, t, documents: [], chapters, onDownload: () => {}, onDelete: () => {}, onUpdateExpiry: () => {} };
    expect(renderToStaticMarkup(React.createElement(DocumentTresor, basis))).not.toContain('role="status" style="color:#777777;font-size:15px"></div>');
    expect(renderToStaticMarkup(React.createElement(DocumentTresor, { ...basis, onAddShared: async () => {} }))).toContain('<div role="status" style="color:#777777;font-size:15px"></div>');
    expect(readFileSync(new URL('../main.jsx', import.meta.url), 'utf8')).toContain('onAddShared: handleAddSharedDocument');
  });
});
