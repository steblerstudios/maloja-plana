import * as THREE from 'three';

// ─── Die elf Schweizer Früchte als Körper ───────────────────────────────────
//
// Bisher kannte der räumliche Baum nur vier Grobformen — ein Apfel und eine
// Aprikose sahen gleich aus, eine Birne und eine Zwetschge auch. Das nimmt dem
// Baum genau das, was ihn ausmacht: dass jeder Lebensbereich SEINE Frucht trägt
// (Basis = Apfel, Wohnen = Birne, Behörden = Zwetschge …, siehe
// data/lebensbereiche.js — dort steht die eine Wahrheit, hier nur der Körper).
//
// Gebaut als Drehkörper aus einer Silhouette: dieselbe Denkweise wie die flachen
// Silhouetten des Dashboards, nur einmal um die eigene Achse gedreht. Wenige
// Punkte je Frucht, darum billig — und die Form bleibt in Graustufen erkennbar,
// was unser dritter Barrierefreiheits-Kanal ist (Form, nicht nur Farbe).

// ─── Massstab: echte Früchte, lesbar verdichtet ─────────────────────────────
//
// Eine Welteinheit = ein Meter (der Baum ist 4,3 Einheiten hoch, also 4,3 m).
// Nachgemessen am 20.09. war die alte Bestückung schief: der Apfel war 2,9-fach
// zu gross, die Heidelbeere aber 9,5-fach — dadurch sah eine Beere fast aus wie
// ein Apfel, obwohl sie in Wirklichkeit ein Siebtel misst.
//
// Reine Naturtreue hilft nicht: eine 1,2-cm-Heidelbeere wäre an einem 4-m-Baum
// ein unsichtbarer Punkt. Darum die Regel aus dem Spieldesign — **Potenzgesetz
// statt fester Faktor**: angezeigt = k · echt^0.6. Das staucht die Spanne, ohne
// die Reihenfolge anzutasten. Klein bleibt klein, gross bleibt gross, und alles
// bleibt sichtbar. (Dieselbe Familie von Kurven wie Stevens' Potenzgesetz zur
// Grössenwahrnehmung — wir sehen Grössen ohnehin gestaucht, nicht linear.)
export const ECHT_CM = {
  apfel: 8, birne: 8, aprikose: 5, zwetschge: 4, baumnuss: 4,
  kirsche: 2.2, hagebutte: 2, haselnuss: 1.8, traube: 1.6,
  heidelbeere: 1.2, vogelbeere: 0.8,
};
const STAUCHUNG = 0.6;
const MASSSTAB = 3.16; // so gewählt, dass der Apfel bei rund 11 cm landet

// Bei Traube und Vogelbeere hängt nicht die einzelne Beere am Ast, sondern die
// ganze Dolde — sie ist das, was man sieht, und sie ist deutlich grösser.
export const ECHT_CM_DOLDE = { traube: 14, vogelbeere: 8 };

/** Angezeigter Durchmesser in Welteinheiten (= Meter). */
export function fruchtDurchmesser(name) {
  const echt = ECHT_CM_DOLDE[name] || ECHT_CM[name] || 5;
  return (MASSSTAB * Math.pow(echt, STAUCHUNG)) / 100;
}

// Silhouette = Punkte [radius, höhe] von unten nach oben. Radius 0 heisst Spitze.
const PROFILE = {
  // Apfel: unten und oben eingedellt, breiteste Stelle knapp unter der Mitte.
  apfel: [[0, -0.115], [0.055, -0.112], [0.098, -0.075], [0.115, -0.015], [0.108, 0.045], [0.075, 0.085], [0.032, 0.093], [0.018, 0.078]],
  // Birne: schmaler Hals, schwerer Bauch unten.
  birne: [[0, -0.150], [0.052, -0.146], [0.094, -0.110], [0.108, -0.050], [0.088, 0.020], [0.055, 0.080], [0.034, 0.130], [0.024, 0.165]],
  // Zwetschge: länglich, oben und unten gerundet, deutlich schlanker als der Apfel.
  zwetschge: [[0, -0.155], [0.040, -0.148], [0.070, -0.100], [0.080, -0.020], [0.074, 0.060], [0.050, 0.120], [0.022, 0.150], [0, 0.158]],
  // Aprikose: rund, leicht abgeflacht, mit angedeuteter Naht (Delle oben).
  aprikose: [[0, -0.100], [0.050, -0.096], [0.088, -0.060], [0.098, 0], [0.086, 0.055], [0.052, 0.088], [0.020, 0.096], [0.010, 0.088]],
  // Baumnuss: fast kugelig, oben leicht zugespitzt.
  baumnuss: [[0, -0.095], [0.048, -0.090], [0.082, -0.050], [0.090, 0], [0.080, 0.050], [0.050, 0.085], [0.020, 0.098], [0, 0.104]],
  // Haselnuss: rundlich mit deutlicher Kappe (der Fruchtbecher) obendrauf.
  haselnuss: [[0, -0.080], [0.042, -0.075], [0.068, -0.040], [0.074, 0.005], [0.066, 0.045], [0.052, 0.062], [0.050, 0.075], [0.030, 0.090], [0, 0.095]],
  // Hagebutte: eiförmig, oben mit dem typischen kleinen Kelchzipfel.
  hagebutte: [[0, -0.105], [0.038, -0.098], [0.062, -0.060], [0.068, 0], [0.060, 0.055], [0.038, 0.090], [0.026, 0.105], [0.030, 0.120], [0, 0.126]],
  // Heidelbeere: kleine Kugel mit flachem Krönchen.
  heidelbeere: [[0, -0.058], [0.030, -0.054], [0.052, -0.030], [0.057, 0.005], [0.048, 0.036], [0.030, 0.050], [0.026, 0.058], [0, 0.058]],
  // Kirsche: kleine, fast runde Kugel (der lange Stiel kommt separat dazu).
  kirsche: [[0, -0.062], [0.032, -0.058], [0.055, -0.030], [0.060, 0.005], [0.050, 0.040], [0.028, 0.058], [0.012, 0.056], [0, 0.050]],
};

// Diese beiden hängen in Büscheln — sie entstehen aus vielen kleinen Kugeln.
const BUESCHEL = {
  traube: { radius: 0.046, punkte: [[0, 0.10], [-0.055, 0.045], [0.055, 0.045], [0, -0.01], [-0.045, -0.065], [0.045, -0.065], [0, -0.125]] },
  vogelbeere: { radius: 0.034, punkte: [[0, 0.055], [-0.055, 0.030], [0.055, 0.030], [-0.030, -0.020], [0.030, -0.020], [0, -0.062], [-0.062, -0.030]] },
};

// Langer Stiel: Kirsche und Vogelbeere hängen daran, das ist ihr Erkennungszeichen.
const LANGER_STIEL = new Set(['kirsche', 'vogelbeere', 'traube']);

// Bauchnaht — die Furche, an der man Zwetschge und Aprikose sofort erkennt.
const NAHT = { zwetschge: 0.16, aprikose: 0.12, kirsche: 0.08 };

// Blütenrest unten (Apfel, Birne, Hagebutte tragen ihn sichtbar).
const KELCH = { apfel: 0.030, birne: 0.026, hagebutte: 0.034 };

// Zieht eine senkrechte Furche in einen Drehkörper. LatheGeometry kann das
// nicht selbst — die Punkte werden nachträglich zur Achse hin gezogen, am
// stärksten auf einer Meridian-Linie.
function nahtZiehen(geometrie, tiefe) {
  const pos = geometrie.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const winkel = Math.atan2(z, x);
    // Zwei Furchen gegenüber (vorne und hinten) — wie bei der echten Frucht.
    const naehe = Math.abs(Math.cos(winkel));
    const faktor = 1 - tiefe * Math.pow(naehe, 8);
    pos.setX(i, x * faktor);
    pos.setZ(i, z * faktor);
  }
  geometrie.computeVertexNormals();
  return geometrie;
}

function zusammenfuegen(teile) {
  const g = new THREE.BufferGeometry();
  const felder = ['position', 'normal', 'uv'];
  const laengen = {};
  felder.forEach((f) => { laengen[f] = teile.reduce((s, t) => s + (t.getAttribute(f) ? t.getAttribute(f).array.length : 0), 0); });
  felder.forEach((f) => {
    if (!teile[0].getAttribute(f)) return;
    const ziel = new Float32Array(laengen[f]);
    let versatz = 0;
    teile.forEach((t) => {
      const a = t.getAttribute(f);
      if (!a) return;
      ziel.set(a.array, versatz);
      versatz += a.array.length;
    });
    g.setAttribute(f, new THREE.BufferAttribute(ziel, teile[0].getAttribute(f).itemSize));
  });
  const index = [];
  let punktVersatz = 0;
  teile.forEach((t) => {
    const i = t.getIndex();
    if (i) for (let k = 0; k < i.count; k++) index.push(i.getX(k) + punktVersatz);
    punktVersatz += t.getAttribute('position').count;
  });
  g.setIndex(index);
  return g;
}

/**
 * Körper der Frucht `name`. Enthält Fruchtfleisch und Stiel in EINER Form,
 * damit jede Frucht ein einziger Zeichenaufruf bleibt.
 * Unbekannte Namen geben eine ruhige Kugel — nie nichts.
 */
export function fruchtKoerper(name) {
  const teile = [];
  // Jede Silhouette ist in sich gezeichnet; hier bekommt sie ihr echtes Mass.
  const zielBreite = fruchtDurchmesser(name);

  if (BUESCHEL[name]) {
    const { radius, punkte } = BUESCHEL[name];
    punkte.forEach(([x, y]) => {
      const k = new THREE.SphereGeometry(radius, 7, 5);
      k.translate(x, y, (Math.abs(x) > 0.03 ? 0.02 : -0.02));
      teile.push(k);
    });
  } else {
    const profil = PROFILE[name] || PROFILE.apfel;
    // Zwischenpunkte: aus 8 Stützpunkten wird eine weiche Kurve statt eines
    // Kantenzugs — die Frucht wirkt gewachsen, nicht gefaltet.
    const kurve = new THREE.SplineCurve(profil.map(([r, h]) => new THREE.Vector2(Math.max(r, 0.0015), h)));
    const punkte = kurve.getPoints(22).map((p) => new THREE.Vector2(Math.max(p.x, 0.0015), p.y));
    const koerper = new THREE.LatheGeometry(punkte, 18);
    teile.push(NAHT[name] ? nahtZiehen(koerper, NAHT[name]) : koerper);

    // Blütenrest am unteren Ende — kleines Detail, das man erst nah sieht,
    // das aber den Unterschied zwischen «Kugel» und «Apfel» ausmacht.
    if (KELCH[name]) {
      const unten = profil[0][1];
      const kelch = new THREE.ConeGeometry(KELCH[name], KELCH[name] * 1.6, 6);
      kelch.rotateX(Math.PI);
      kelch.translate(0, unten + KELCH[name] * 0.5, 0);
      teile.push(kelch);
    }
  }

  const oben = BUESCHEL[name] ? 0.11 : (PROFILE[name] || PROFILE.apfel).slice(-1)[0][1];
  const stielLaenge = LANGER_STIEL.has(name) ? 0.17 : 0.07;
  const stiel = new THREE.CylinderGeometry(0.008, 0.011, stielLaenge, 5);
  stiel.translate(0, oben + stielLaenge * 0.45, 0);
  teile.push(stiel);

  const g = zusammenfuegen(teile);

  // Auf das gemessene Zielmass bringen: die Silhouetten sind frei gezeichnet,
  // erst hier bekommen sie ihre Grösse — so steht die Regel an einer Stelle
  // und nicht in elf Zahlenreihen verstreut.
  g.computeBoundingBox();
  const breite = Math.max(
    g.boundingBox.max.x - g.boundingBox.min.x,
    g.boundingBox.max.z - g.boundingBox.min.z
  );
  if (breite > 0) g.scale(zielBreite / breite, zielBreite / breite, zielBreite / breite);

  g.computeVertexNormals();
  return g;
}

/** Gibt es für diese Frucht einen eigenen Körper? (sonst Kugel-Rückfall) */
export function istBekannteFrucht(name) {
  return Boolean(PROFILE[name] || BUESCHEL[name]);
}
