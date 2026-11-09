// ─── Teilen-Empfang (Web Share Target) ───────────────────────
// Eine Datei, die jemand über «Teilen …» an die installierte App schickt, nimmt der
// Service Worker (public/sw.js) entgegen und legt sie in einen eigenen Cache auf diesem
// Gerät. Hier liest die Dokumentablage sie wieder aus.
//
// Bewusst KEIN automatisches Ablegen: die Datei wartet im Eingang, bis die Person
// Bereich, Art und Ablaufdatum gewählt hat — oder sie verwirft. Nichts geht ins Netz.
//
// Die Namen unten stehen auch in public/sw.js (klassisches Skript, kein Import möglich).
// Wächter: src/__tests__/teilenEmpfang.test.js prüft, dass beide gleich lauten.

export const GETEILT_CACHE = 'maloja-geteilt';
export const GETEILT_ORDNER = 'geteilt/';
export const NAME_KOPF = 'X-Maloja-Dateiname';
// Gleiche Grenze wie beim Hochladen im Kapitel (ChapterView, MAX_DOC_BYTES).
export const MAX_GETEILT_BYTES = 20 * 1024 * 1024;

const cachesDa = () => typeof caches !== 'undefined' && caches && typeof caches.open === 'function';

// Dateiname aus dem Kopf zurückholen; ein kaputter Kopf darf nichts abbrechen.
export const dateinameAusKopf = (wert, ersatz) => {
  if (!wert) return ersatz;
  try {
    return decodeURIComponent(wert) || ersatz;
  } catch (e) {
    return ersatz;
  }
};

export const groesseText = (bytes) => (bytes / 1024).toFixed(1) + ' KB';

// Alle wartenden Dateien, älteste zuerst. Ohne Cache-API (alte Browser, Tests): leer.
export const geteilteDateienLesen = async () => {
  if (!cachesDa()) return [];
  const cache = await caches.open(GETEILT_CACHE);
  const anfragen = await cache.keys();
  const dateien = [];
  for (const anfrage of anfragen) {
    const antwort = await cache.match(anfrage);
    if (!antwort) continue;
    const blob = await antwort.blob();
    dateien.push({
      schluessel: anfrage.url,
      name: dateinameAusKopf(antwort.headers.get(NAME_KOPF), 'Datei'),
      typ: blob.type || antwort.headers.get('Content-Type') || '',
      groesse: blob.size,
      blob,
    });
  }
  return dateien.sort((a, b) => (a.schluessel < b.schluessel ? -1 : a.schluessel > b.schluessel ? 1 : 0));
};

// «Datei hinzufügen» im Eingang (09.11.2026): der Weg für Geräte ohne Teilen-Empfang
// (iPhone/iPad, Desktop-Browser). Gleicher Cache, gleiche Form wie aus dem Service Worker,
// damit eine gewählte Datei auch nach dem Schliessen der App weiter wartet.
// Gibt die Dateien zurück, die NICHT angenommen wurden (leer oder zu gross).
export const dateienInEingang = async (dateien, basis = '/', jetzt = Date.now()) => {
  const passend = [];
  const abgelehnt = [];
  for (const datei of dateien) {
    if (datei && datei.size > 0 && datei.size <= MAX_GETEILT_BYTES) passend.push(datei);
    else if (datei) abgelehnt.push(datei);
  }
  if (!passend.length) return { angenommen: [], abgelehnt };
  if (!cachesDa()) return { angenommen: passend, abgelehnt, ohneCache: true };
  const cache = await caches.open(GETEILT_CACHE);
  const ordner = (basis.endsWith('/') ? basis : basis + '/') + GETEILT_ORDNER;
  await Promise.all(passend.map((datei, i) => cache.put(
    ordner + jetzt + '-h' + String(i).padStart(2, '0'),
    new Response(datei, { headers: {
      'Content-Type': datei.type || 'application/octet-stream',
      [NAME_KOPF]: encodeURIComponent(datei.name || 'Datei'),
    } }),
  )));
  return { angenommen: passend, abgelehnt };
};

export const geteilteDateiEntfernen = async (schluessel) => {
  if (!cachesDa()) return false;
  const cache = await caches.open(GETEILT_CACHE);
  return cache.delete(schluessel);
};

export const blobAlsDataUrl = (blob) =>
  new Promise((ok, fehler) => {
    const leser = new FileReader();
    leser.onerror = () => fehler(leser.error || new Error('FileReader'));
    leser.onload = () => ok(leser.result);
    leser.readAsDataURL(blob);
  });

// Metadaten wie beim Hochladen im Kapitel (ChapterView) — dieselbe Form, damit
// Ablage, Backup und Ablauf-Erinnerung nichts Neues kennen müssen.
export const alsDokument = ({ datei, bereich, art, ablauf, data, heute = new Date() }) => ({
  type: art,
  chapter: bereich,
  fileName: datei.name,
  fileSize: groesseText(datei.groesse),
  uploadDate: heute.toLocaleDateString('de-CH'),
  expiryDate: ablauf,
  status: 'active',
  data,
});
