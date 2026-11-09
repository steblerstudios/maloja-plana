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
