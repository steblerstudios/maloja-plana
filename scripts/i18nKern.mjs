// Teilt eine Sprachdatei beim Build in Kern und Rest (Performance-Bilanz 02.11.2026: die
// Sprache wog fast doppelt so viel wie die App, und nichts wurde gezeigt, bevor sie da war).
// Kern = alle Schlüssel, die im Quelltext des Startbündels stehen. Die Liste wird bei jedem
// Build neu erhoben, also gibt es keine Handliste, die veralten kann. Zero-deps.
import fs from 'node:fs';
import path from 'node:path';

const STATISCHER_IMPORT = /^\s*(?:import|export)\s+(?:[^'"();]*?\sfrom\s+)?['"](\.{1,2}\/[^'"]+)['"]/gm;
const ENDUNGEN = /\.(jsx?|mjs)$/;

// Alle Module, die main.jsx ohne dynamisches import() erreicht: das Startbündel.
export function startModule(eintrag) {
  const gesehen = new Set();
  const offen = [eintrag];
  while (offen.length) {
    const datei = offen.pop();
    if (gesehen.has(datei)) continue;
    gesehen.add(datei);
    const text = fs.readFileSync(datei, 'utf8');
    for (const treffer of text.matchAll(STATISCHER_IMPORT)) {
      const ziel = path.resolve(path.dirname(datei), treffer[1]);
      if (ENDUNGEN.test(ziel) && fs.existsSync(ziel)) offen.push(ziel);
    }
  }
  return [...gesehen];
}

// Was ein erstes Bild zeigen kann: das Startbündel und die Code-Wand der Beta.
export function ersteBilder(src) {
  return [...new Set([...startModule(path.join(src, 'main.jsx')), ...startModule(path.join(src, 'BetaGate.jsx'))])];
}

function allePfade(baum, vorne = '', ziel = new Set()) {
  for (const [name, wert] of Object.entries(baum)) {
    const pfad = vorne ? `${vorne}.${name}` : name;
    ziel.add(pfad);
    if (istObjekt(wert)) allePfade(wert, pfad, ziel);
  }
  return ziel;
}

function istObjekt(wert) {
  return wert !== null && typeof wert === 'object' && !Array.isArray(wert);
}

// Wörtliche Schlüssel und zusammengesetzte Präfixe (`nav.${id}`, 'nav.' + id) aus dem Quelltext.
export function kernPfade(dateien, baum) {
  const bekannt = allePfade(baum);
  const kern = new Set();
  for (const datei of dateien) {
    const text = fs.readFileSync(datei, 'utf8');
    for (const [wort] of text.matchAll(/[A-Za-z]\w*(?:\.\w+)+/g)) {
      if (bekannt.has(wort)) kern.add(wort);
    }
    for (const treffer of text.matchAll(/[`'"]([A-Za-z][\w.]*)\.(?:\$\{|['"]\s*\+)/g)) {
      if (bekannt.has(treffer[1])) kern.add(treffer[1]);
    }
  }
  return [...kern];
}

function lesen(baum, teile) {
  return teile.reduce((knoten, teil) => (knoten === undefined ? undefined : knoten[teil]), baum);
}

export function teilen(baum, pfade) {
  const kern = {};
  const rest = structuredClone(baum);
  for (const pfad of pfade) {
    const teile = pfad.split('.');
    const wert = lesen(baum, teile);
    if (wert === undefined) continue;   // Sprache hat den Schlüssel nicht: Rückfall wie bisher
    let knoten = kern;
    for (const teil of teile.slice(0, -1)) knoten = knoten[teil] ??= {};
    knoten[teile.at(-1)] = wert;
    entfernen(rest, teile);
  }
  return { kern, rest };
}

function entfernen(knoten, teile) {
  const [kopf, ...schwanz] = teile;
  if (!istObjekt(knoten) || !(kopf in knoten)) return;
  if (schwanz.length === 0) delete knoten[kopf];
  else {
    entfernen(knoten[kopf], schwanz);
    if (istObjekt(knoten[kopf]) && Object.keys(knoten[kopf]).length === 0) delete knoten[kopf];
  }
}
