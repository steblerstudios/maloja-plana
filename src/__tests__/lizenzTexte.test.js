// Lizenz-Wächter — jedes fremde Paket, das ins Bundle kommt, liefert seinen Lizenztext mit.
//
// Warum es ihn gibt: Am 23.09.2026 fehlten sechs MIT-Texte in der Auslieferung (react,
// react-dom, scheduler, js-tokens, loose-envify, three). MIT verlangt, dass der Text
// «shall be included in all copies or substantial portions of the Software» — nicht nur,
// dass die Lizenz genannt wird. Die Lücke wurde von Hand geschlossen; nichts hätte sie beim
// nächsten `npm install <paket>` verhindert. Schutz-Durchgang 28.09.2026, § 4.10.
//
// Was er prüft (alles aus dem Repo, nichts aus dem Netz):
//   A  Laufzeit-Abschluss: `dependencies` aus package.json samt transitiver Laufzeit-
//      Abhängigkeiten (über node_modules/<paket>/package.json). Für jedes Paket muss
//      public/licenses/<name>-LICENSE.txt liegen, einen echten Lizenztext enthalten und in
//      docs/legal/third-party-licenses.md genannt sein.
//   B  Vendorierte Dateien in public/vendor/ und src/vendor/ — jede braucht einen Eintrag
//      in VENDOR und damit einen Lizenztext. Eine neue Datei ohne Eintrag macht den Test rot.
//   C  Keine verwaisten Texte: jede Datei in public/licenses/ ist in der Tabelle erklärt.
//   D  Gegenprobe: ein erfundenes Paket wird als fehlend gemeldet — der Wächter beisst.
//
// Was er NICHT prüft: ob ein Paket zur Laufzeit wirklich im Bundle landet (Tree-Shaking).
// Das ist absichtlich streng: lieber ein Text zu viel als einer zu wenig.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = process.cwd();
const lies = (datei) => readFileSync(join(ROOT, datei), 'utf8');

// Vendorierte Dateien (Ordner/Datei) → Name des Lizenztexts (public/licenses/<name>-LICENSE.txt).
// Zwei Orte: public/vendor/ (wird roh ausgeliefert) und src/vendor/ (wird ins Bundle kompiliert).
const VENDOR_ORDNER = ['public/vendor', 'src/vendor'];
const VENDOR = {
  'public/vendor/jsQR.js': 'jsQR',
  'src/vendor/qrcodejs.js': 'QRCode.js',
};

const LIZENZ_MUSTER = /Permission is hereby granted|Apache License|Copyright \(c\)|Copyright ©|Lizenzhinweis/;

/** Laufzeit-Abschluss: dependencies + deren dependencies, rekursiv, aus node_modules. */
export function laufzeitPakete(startPakete, leseManifest) {
  const gesehen = new Set();
  const nichtInstalliert = [];
  const gehe = (name) => {
    if (gesehen.has(name)) return;
    gesehen.add(name);
    const manifest = leseManifest(name);
    if (!manifest) { nichtInstalliert.push(name); return; }
    for (const d of Object.keys(manifest.dependencies || {})) gehe(d);
  };
  for (const p of startPakete) gehe(p);
  return { pakete: [...gesehen].sort(), nichtInstalliert };
}

/** Reine Prüf-Funktion, damit die Gegenprobe (D) ohne Dateisystem-Tricks auskommt. */
export function pruefeLizenzen({ pakete, vendorDateien, lizenzDateien, tabelle }) {
  const fehlend = [];
  const leer = [];
  const nichtInTabelle = [];
  const verwaist = [];

  const erwartet = new Set();
  for (const p of pakete) erwartet.add(p);
  for (const datei of vendorDateien) {
    const name = VENDOR[datei];
    if (!name) fehlend.push(`${datei} hat keinen Eintrag in VENDOR`);
    else erwartet.add(name);
  }

  for (const name of erwartet) {
    const datei = `${name}-LICENSE.txt`;
    const inhalt = lizenzDateien.get(datei);
    if (inhalt === undefined) { fehlend.push(`public/licenses/${datei}`); continue; }
    if (inhalt.length < 200 || !LIZENZ_MUSTER.test(inhalt)) leer.push(datei);
    if (!tabelle.includes(name)) nichtInTabelle.push(name);
  }

  const erklaert = new Set([...erwartet].map((n) => `${n}-LICENSE.txt`));
  for (const datei of lizenzDateien.keys()) {
    if (!erklaert.has(datei)) verwaist.push(datei);
    else if (!tabelle.includes(datei.replace(/-LICENSE\.txt$/, ''))) nichtInTabelle.push(datei);
  }

  return { fehlend, leer, nichtInTabelle: [...new Set(nichtInTabelle)], verwaist };
}

// ─── Echte Eingaben aus dem Repo ────────────────────────────────────────────

const paket = JSON.parse(lies('package.json'));
const leseManifest = (name) => {
  const pfad = join(ROOT, 'node_modules', name, 'package.json');
  return existsSync(pfad) ? JSON.parse(readFileSync(pfad, 'utf8')) : null;
};
const abschluss = laufzeitPakete(Object.keys(paket.dependencies || {}), leseManifest);

const vendorDateien = VENDOR_ORDNER.flatMap((ordner) =>
  existsSync(join(ROOT, ordner))
    ? readdirSync(join(ROOT, ordner)).filter((f) => !f.startsWith('.')).map((f) => `${ordner}/${f}`)
    : [],
);

const lizenzDateien = new Map(
  readdirSync(join(ROOT, 'public/licenses'))
    .filter((f) => f.endsWith('-LICENSE.txt'))
    .map((f) => [f, lies(`public/licenses/${f}`)]),
);

const tabelle = lies('docs/legal/third-party-licenses.md');

const befund = pruefeLizenzen({ pakete: abschluss.pakete, vendorDateien, lizenzDateien, tabelle });

describe('Lizenz-Wächter — fremde Lizenztexte werden mitgeliefert', () => {
  it('kennt den Laufzeit-Abschluss (alle dependencies sind installiert)', () => {
    expect(abschluss.pakete.length).toBeGreaterThanOrEqual(Object.keys(paket.dependencies).length);
    expect(abschluss.nichtInstalliert, 'npm ci zuerst — sonst misst der Wächter nichts').toEqual([]);
  });

  it('A · jedes Laufzeit-Paket hat seinen Text unter public/licenses/', () => {
    expect(befund.fehlend).toEqual([]);
  });

  it('A · kein Text ist leer oder ein Platzhalter', () => {
    expect(befund.leer).toEqual([]);
  });

  it('A/C · jedes Paket und jeder Text steht in docs/legal/third-party-licenses.md', () => {
    expect(befund.nichtInTabelle).toEqual([]);
  });

  it('B · jede vendorierte Datei ist in VENDOR eingetragen (public/vendor + src/vendor)', () => {
    expect(vendorDateien.length).toBeGreaterThan(0);
    for (const datei of vendorDateien) expect(VENDOR, datei).toHaveProperty(datei);
  });

  it('C · kein Lizenztext liegt unerklärt herum', () => {
    expect(befund.verwaist).toEqual([]);
  });

  it('bleibt bei den heute bekannten Paketen (Änderung = bewusst nachziehen)', () => {
    // Pinnt die Sache, nicht die Schreibweise: die Menge der Laufzeit-Pakete.
    expect(abschluss.pakete).toEqual(['js-tokens', 'loose-envify', 'react', 'react-dom', 'scheduler', 'three']);
  });

  describe('D · Gegenprobe — der Wächter beisst', () => {
    it('meldet ein erfundenes Paket als fehlend', () => {
      const b = pruefeLizenzen({
        pakete: [...abschluss.pakete, 'erfundenes-paket-xyz'],
        vendorDateien, lizenzDateien, tabelle,
      });
      expect(b.fehlend).toEqual(['public/licenses/erfundenes-paket-xyz-LICENSE.txt']);
    });

    it('meldet eine neue Vendor-Datei ohne Eintrag', () => {
      const b = pruefeLizenzen({
        pakete: abschluss.pakete,
        vendorDateien: [...vendorDateien, 'src/vendor/neue-bibliothek.min.js'],
        lizenzDateien, tabelle,
      });
      expect(b.fehlend).toEqual(['src/vendor/neue-bibliothek.min.js hat keinen Eintrag in VENDOR']);
    });

    it('meldet einen Text, den die Tabelle nicht erklärt', () => {
      const mitFremdem = new Map(lizenzDateien);
      mitFremdem.set('fremd-LICENSE.txt', 'Permission is hereby granted '.repeat(10));
      const b = pruefeLizenzen({ pakete: abschluss.pakete, vendorDateien, lizenzDateien: mitFremdem, tabelle });
      expect(b.verwaist).toEqual(['fremd-LICENSE.txt']);
    });

    it('meldet einen Platzhalter statt Lizenztext', () => {
      const kurz = new Map(lizenzDateien);
      kurz.set('react-LICENSE.txt', 'TODO');
      const b = pruefeLizenzen({ pakete: abschluss.pakete, vendorDateien, lizenzDateien: kurz, tabelle });
      expect(b.leer).toEqual(['react-LICENSE.txt']);
    });
  });
});
