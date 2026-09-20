import React from 'react';
import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import FruchtMitIcon from './FruchtMitIcon.jsx';
import Icons from './IconSystem.jsx';
import { fruchtKoerper } from './baumFruechte3d.js';

// MESSPROTOTYP — nur im Arbeitsbaum mess/baum-3d, nicht für main gedacht.
// Portiert die Wuchs-Logik der 3D-Vorlage (wachsender-baum-3d.html) auf unsere
// Regeln: kein fremder Server (three liegt als eigene Abhängigkeit bei), kein
// Dauerlauf der Zeichenschleife, Farben aus der Palette, eine Frucht je
// Lebensbereich. Gewachsen wird nach Ausfüllstand, nicht nach der Uhr.
//
// Zweite Runde (20.09.): Stamm läuft oben spitz aus statt stumpf, die Krone ist
// dichter, und die Wuchsphasen sind benannt und deutlich getrennt.

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // 137,5° — Phyllotaxis

// ─── Die Wuchsphasen ────────────────────────────────────────────────────────
// Ein Baum hat sechs erkennbare Zustände. Sie hängen am Ausfüllstand, nicht an
// der Uhr: jeder Ast durchläuft sie mit dem Stand SEINES Lebensbereichs, der
// ganze Baum mit dem Durchschnitt. Deshalb kann ein Ast blühen, während der
// nächste noch kahl ist — wie im echten Garten.
export const PHASEN = [
  { ab: 0, schluessel: 'keimling', name: 'Keimling' },
  { ab: 12, schluessel: 'stamm', name: 'Stamm und Äste' },
  { ab: 32, schluessel: 'knospen', name: 'Knospen' },
  { ab: 46, schluessel: 'blaetter', name: 'Blätter und Blüte' },
  { ab: 66, schluessel: 'fruechte', name: 'Früchte' },
  { ab: 96, schluessel: 'ausgewachsen', name: 'Ausgewachsen' },
];
export function wuchsphase(pct) {
  let treffer = PHASEN[0];
  PHASEN.forEach((p) => { if (pct >= p.ab) treffer = p; });
  return treffer;
}

// Zeitplan je Bauteil, in Prozent des Ausfüllstands. Alles an einer Stelle,
// damit die Phasen oben und das Bild unten nie auseinanderlaufen.
const PLAN = {
  wurzeln: { ab: 0, bis: 10 },
  stamm: { ab: 0, bis: 14 },
  ast: [{ ab: 12, bis: 26 }, { ab: 20, bis: 34 }, { ab: 26, bis: 40 }, { ab: 32, bis: 45 }],
  knospe: { ab: 33, bis: 43, weg: 45 },
  // Blüte VOR dem Laub — wie beim Obstbaum. Vorher lag sie mitten im Grün und
  // war schlicht nicht zu sehen; die Phase «Blüte» gab es dann nur auf dem Papier.
  bluete: { ab: 44, bis: 54, weg: 62 },
  blatt: { ab: 52, bis: 70 },
  frucht: { ab: 66, bis: 92 },
  keimblatt: { ab: 3, bis: 9, weg: 16 },
};

// Fester Zufall je Baum: gleiche Angaben → gleicher Baum, über alle Besuche.
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
const smooth = (t) => t * t * (3 - 2 * t);
const ramp = (v, a, b) => smooth(Math.max(0, Math.min(1, (v - a) / (b - a))));

// Ein Ast: Rohr entlang einer leicht gebogenen Linie, unten dicker als oben.
//
// WICHTIG — der Nullpunkt liegt am ANSATZ, nicht im Ursprung der Szene. Sonst
// schrumpft ein wachsender Ast zur Bildmitte und schwebt unterwegs in der Luft
// (erster Messlauf 20.09., im Bild gesehen). So wächst jeder Ast aus seinem
// Elternast heraus — nichts schwebt, in keiner Wuchsstufe.
function rohrMitVerjuengung(kurve, r0, r1, laengsSegmente, rundSegmente, rindenTiefe = 0) {
  const g = new THREE.TubeGeometry(kurve, laengsSegmente, r0, rundSegmente, false);
  const pos = g.attributes.position;
  const tonwerte = [];
  for (let i = 0; i < pos.count; i++) {
    const ring = Math.floor(i / (rundSegmente + 1));
    const seite = i % (rundSegmente + 1);
    const t = ring / laengsSegmente;
    const p = kurve.getPoint(t);
    let f = THREE.MathUtils.lerp(1, r1 / r0, t);
    // Rindenstruktur: Längsrippen, die sich beim Hochwachsen leicht drehen,
    // plus eine feinere zweite Welle. Ohne das wirkt der Stamm wie ein
    // lackiertes Rohr — mit dem Aufwand von null zusätzlichen Dreiecken.
    if (rindenTiefe > 0) {
      const winkel = (seite / rundSegmente) * Math.PI * 2;
      const rippe = Math.sin(winkel * 5 + t * 5.5) * 0.62
        + Math.sin(winkel * 11 - t * 3.1) * 0.26
        + Math.sin(winkel * 23 + t * 9) * 0.12;
      f *= 1 + rindenTiefe * rippe;
      // Die Rippen allein reichen nicht: gemessen schwankt der Radius um
      // 15–19 %, im Bild sah man trotzdem ein glattes Rohr, weil die weiche
      // Beleuchtung das wegbügelt. Darum wandert die Struktur zusätzlich in
      // die Farbe — Furchen dunkel, Grate hell, wie bei echter Borke.
      const helligkeit = 1 + rippe * 0.34 - 0.1;
      tonwerte.push(helligkeit, helligkeit, helligkeit);
    }
    pos.setXYZ(i, p.x + (pos.getX(i) - p.x) * f, p.y + (pos.getY(i) - p.y) * f, p.z + (pos.getZ(i) - p.z) * f);
  }
  if (rindenTiefe > 0) g.setAttribute('color', new THREE.Float32BufferAttribute(tonwerte, 3));
  g.computeVertexNormals();
  return g;
}

function astGeometrie(richtung, laenge, r0, r1, biegung, rindenTiefe = 0) {
  const mitte = richtung.clone().multiplyScalar(laenge * 0.5).add(biegung);
  const ende = richtung.clone().multiplyScalar(laenge).add(biegung.clone().multiplyScalar(2));
  const kurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), mitte, ende]);
  // Dicke Äste tragen Struktur, dünne Zweige bleiben glatt — das spart Punkte
  // dort, wo man ohnehin nichts sähe.
  const dick = r0 > 0.05;
  return {
    geometrie: rohrMitVerjuengung(kurve, r0, r1, dick ? 6 : 4, dick ? 10 : 6, rindenTiefe),
    ende,
  };
}

// ─── Die Frucht mit dem ausgestanzten Bereichs-Icon, im Raum ────────────────
//
// Nicht neu erfunden: es ist DIESELBE Zeichnung, die der flache Baum schon
// benutzt (FruchtMitIcon — Fruchtsilhouette in Ast-Farbe, Icon als echtes
// Negativ). Sie wird einmal in ein Bild gerendert und im Raum als Schildchen
// aufgehängt, das sich immer zur Kamera dreht. So bleibt das Icon aus jeder
// Blickrichtung lesbar, und die Bildsprache ist in beiden Bäumen dieselbe.
function fruchtSchildchen(fruit, iconName, farbe, kantePx = 128) {
  const leinwand = document.createElement('canvas');
  leinwand.width = kantePx * 2;
  leinwand.height = kantePx * 2;
  const textur = new THREE.CanvasTexture(leinwand);
  textur.colorSpace = THREE.SRGBColorSpace;

  // 🛑 Nicht sofort zeichnen: diese Funktion läuft aus einem useEffect, also
  // mitten in Reacts eigenem Durchlauf. Dort eine zweite React-Wurzel zu
  // rendern und wieder abzuräumen, gibt genau die zwei Warnungen, die die
  // Konsole gemeldet hat («flushSync … while React was already rendering»,
  // «synchronously unmount a root»). Ein Schritt später ist der Durchlauf
  // vorbei und beides ist sauber.
  setTimeout(() => {
    const behaelter = document.createElement('div');
    const root = createRoot(behaelter);
    flushSync(() => {
      root.render(React.createElement(FruchtMitIcon, { fruit, iconName, color: farbe, size: kantePx }));
    });
    let svg = behaelter.innerHTML;
    root.unmount();
    if (!svg) return;
    // 🛑 Ohne xmlns lädt ein SVG als Datenbild NICHT — gemessen: mit Attribut
    // 64×64 geladen, ohne Attribut Fehler. React schreibt es nicht mit, also
    // ergänzen wir es hier. Ohne diese Zeile blieben alle Schildchen leer.
    if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

    const bild = new Image();
    bild.onload = () => {
      leinwand.getContext('2d').drawImage(bild, 0, 0, leinwand.width, leinwand.height);
      textur.needsUpdate = true;
      if (typeof textur.__fertig === 'function') textur.__fertig();
    };
    // data: ist in unserer CSP für Bilder erlaubt (img-src 'self' data: blob:) —
    // es geht nichts nach aussen, das Bild entsteht hier im Browser.
    bild.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }, 0);

  return textur;
}

// Ankerpunkt je Lebensbereich: der äusserste Fruchtplatz seines Astes. Daran
// hängt später die Beschriftung — sie folgt dem Ast, auch wenn man dreht.
function aeussersterPunkt(punkte) {
  let treffer = punkte[0];
  let weiteste = -Infinity;
  punkte.forEach((p) => {
    const d = Math.hypot(p.position.x, p.position.z) + p.position.y * 0.35;
    if (d > weiteste) { weiteste = d; treffer = p; }
  });
  return treffer ? treffer.position.clone() : new THREE.Vector3();
}

export function baumAufbauen(bereiche, farben, seed = 7412) {
  const zufall = rng(seed);
  const wurzel = new THREE.Group();
  const teile = [];      // einzelne Formen: { mesh, ab, bis, weg?, bereich? }
  const streu = [];      // Blätter/Knospen/Blüten/Früchte als Sammelformen
  const rinde = new THREE.MeshStandardMaterial({ color: farben.rinde, roughness: 0.95 });
  // Eigenes Material für alles mit Borke — nur hier wird die eingebackene
  // Hell-Dunkel-Zeichnung ausgewertet.
  const borke = new THREE.MeshStandardMaterial({ color: farben.rinde, roughness: 0.97, vertexColors: true });

  // ─── Stamm ────────────────────────────────────────────────────────────────
  // Er läuft oben SPITZ aus und geht in einen Gipfeltrieb über. Vorher endete
  // er stumpf wie ein abgesägter Pfahl — der erste Messlauf zeigte es deutlich.
  const stammPunkte = [];
  const hoehe = 4.3;
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    stammPunkte.push(new THREE.Vector3(
      Math.sin(t * 2.1) * 0.12 + t * 0.05,
      t * hoehe,
      Math.cos(t * 1.7) * 0.09 - 0.09
    ));
  }
  const stammKurve = new THREE.CatmullRomCurve3(stammPunkte);
  // Mehr Umfangspunkte und spürbare Rindentiefe — der Stamm ist das Stück,
  // das man am längsten ansieht.
  const stamm = new THREE.Mesh(rohrMitVerjuengung(stammKurve, 0.3, 0.035, 34, 26, 0.085), borke);
  stamm.castShadow = true;
  stamm.receiveShadow = true;
  wurzel.add(stamm);
  teile.push({ mesh: stamm, ...PLAN.stamm, achse: 'y' });

  // ─── Wurzelwerk ──────────────────────────────────────────────────────────
  // Ein Baum steht nicht im Boden, er greift hinein. Vorher waren es neun
  // kurze Stummel; jetzt kräftige Hauptwurzeln, die sich verzweigen und flach
  // über den Boden laufen, bevor sie eintauchen — dazu ein Wurzelanlauf, der
  // den Stamm unten verbreitert.
  const wurzelZahl = 12;
  for (let i = 0; i < wurzelZahl; i++) {
    const w = (i / wurzelZahl) * Math.PI * 2 + (zufall() - 0.5) * 0.35;
    const kraeftig = i % 3 === 0;
    const laenge = (kraeftig ? 1.35 : 0.9) + zufall() * 0.5;
    const dicke = kraeftig ? 0.13 : 0.075;
    const dir = new THREE.Vector3(Math.cos(w), -0.16 - zufall() * 0.12, Math.sin(w)).normalize();
    const start = new THREE.Vector3(Math.cos(w) * 0.09, 0.19, Math.sin(w) * 0.09);
    const { geometrie, ende } = astGeometrie(dir, laenge, dicke, 0.012, new THREE.Vector3(0, -0.12, 0), 0.07);
    const mesh = new THREE.Mesh(geometrie, borke);
    mesh.position.copy(start);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wurzel.add(mesh);
    teile.push({ mesh, ...PLAN.wurzeln });

    // Nebenwurzel: jede kräftige Wurzel teilt sich einmal.
    if (kraeftig) {
      const w2 = w + (zufall() - 0.5) * 1.1;
      const dir2 = new THREE.Vector3(Math.cos(w2), -0.3, Math.sin(w2)).normalize();
      const { geometrie: g2 } = astGeometrie(dir2, laenge * 0.55, dicke * 0.45, 0.01, new THREE.Vector3(0, -0.06, 0));
      const m2 = new THREE.Mesh(g2, rinde);
      m2.position.copy(start).add(ende.clone().multiplyScalar(0.55));
      m2.receiveShadow = true;
      wurzel.add(m2);
      teile.push({ mesh: m2, ab: 2, bis: 13 });
    }
  }

  // Wurzelanlauf: der Fuss verbreitert sich kegelig zum Boden.
  const anlauf = new THREE.Mesh(
    rohrMitVerjuengung(
      new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(0, 0.75, 0)]),
      0.46, 0.3, 10, 26, 0.1
    ),
    borke
  );
  anlauf.castShadow = true;
  anlauf.receiveShadow = true;
  wurzel.add(anlauf);
  teile.push({ mesh: anlauf, ...PLAN.stamm, achse: 'y' });

  // ─── Äste: einer je Lebensbereich, jeder mit seinem eigenen Stand ─────────
  const blattPlaetze = [];
  const knospenPlaetze = [];
  const bluetenPlaetze = [];
  const fruchtPlaetze = {}; // je Bereich, damit die Farbe stimmt

  bereiche.forEach((b, i) => {
    fruchtPlaetze[b.key] = [];
    const anteil = i / bereiche.length;
    const ansatzT = 0.3 + anteil * 0.52;
    const ansatz = stammKurve.getPoint(ansatzT);
    const azimut = i * GOLDEN;
    const startRichtung = new THREE.Vector3(Math.cos(azimut), 0.95 - ansatzT * 0.5, Math.sin(azimut)).normalize();

    const zweigen = (start, dir, laenge, radius, tiefe) => {
      const plan = PLAN.ast[Math.min(PLAN.ast.length - 1, 3 - tiefe)];
      const biegung = new THREE.Vector3((zufall() - 0.5) * 0.12, 0.07, (zufall() - 0.5) * 0.12);
      const { geometrie, ende } = astGeometrie(dir, laenge, radius, radius * 0.55, biegung);
      const mesh = new THREE.Mesh(geometrie, rinde);
      mesh.position.copy(start); // Ansatz = Nullpunkt: wächst aus dem Elternast.
      mesh.castShadow = true;
      wurzel.add(mesh);
      teile.push({ mesh, ...plan, bereich: b.key });

      const weltEnde = start.clone().add(ende);
      if (tiefe === 0) {
        spitzeBestuecken(weltEnde, dir, b);
        return;
      }
      // Drei Kinder auf den oberen Ebenen → dichtere Krone.
      const kinder = tiefe >= 2 ? 3 : 2;
      for (let k = 0; k < kinder; k++) {
        const a = azimut + (k / kinder) * Math.PI * 2 + (zufall() - 0.5) * 0.8;
        const neu = new THREE.Vector3(Math.cos(a) * 0.6, 0.78, Math.sin(a) * 0.6)
          .normalize().lerp(dir, 0.42).normalize();
        zweigen(weltEnde, neu, laenge * 0.66, radius * 0.58, tiefe - 1);
      }
    };

    // Alles, was an einer Astspitze hängt — nie frei schwebend, und immer erst,
    // wenn der Ast, an dem es hängt, fertig gewachsen ist.
    const spitzeBestuecken = (punkt, dir, bereich) => {
      for (let l = 0; l < 14; l++) {
        const winkel = l * GOLDEN;
        const r = 0.16 + (l % 5) * 0.075;
        blattPlaetze.push({
          position: punkt.clone().add(new THREE.Vector3(Math.cos(winkel) * r, (zufall() - 0.35) * 0.4, Math.sin(winkel) * r)),
          drehung: new THREE.Euler(zufall() * 3, zufall() * 3, zufall() * 3),
          groesse: 0.8 + zufall() * 0.55,
          bereich: bereich.key,
        });
      }
      knospenPlaetze.push({ position: punkt.clone().addScaledVector(dir, 0.09), groesse: 1, bereich: bereich.key });
      // Drei Blüten je Spitze, leicht nach aussen gesetzt — sonst sitzen sie
      // später im Laub und die Blütephase bleibt unsichtbar.
      for (let t = 0; t < 3; t++) {
        const w = t * GOLDEN;
        bluetenPlaetze.push({
          position: punkt.clone().addScaledVector(dir, 0.12).add(new THREE.Vector3(Math.cos(w) * 0.13, 0.04, Math.sin(w) * 0.13)),
          groesse: 1 + zufall() * 0.35,
          bereich: bereich.key,
        });
      }
      // Deutlich unter dem Blattschopf: die Frucht trägt die Bedeutung
      // (ein Lebensbereich), sie darf nicht im Grün verschwinden. Sie hängt
      // trotzdem an der Spitze — sie schwebt nicht.
      // Jede Frucht reift für sich: eigener Startpunkt, eigene Dauer. Bei 70 %
      // hängen deshalb ein paar reife neben halbreifen und ein paar grünen —
      // wie an einem echten Baum, und ehrlicher als «alles gleich weit».
      const versatz = zufall();
      const reifeStart = 58 + versatz * 26;
      fruchtPlaetze[bereich.key].push({
        position: punkt.clone().add(new THREE.Vector3((zufall() - 0.5) * 0.16, -0.32, (zufall() - 0.5) * 0.16)),
        groesse: 0.9 + zufall() * 0.35,
        ab: reifeStart,
        bis: Math.min(98, reifeStart + 16),
      });
    };

    zweigen(ansatz, startRichtung, 0.95, 0.08, 3);
  });

  // Gipfeltrieb: der Stamm endet nicht, er geht in einen letzten Zweig über.
  const gipfel = stammKurve.getPoint(1);
  const { geometrie: gipfelGeo, ende: gipfelEnde } = astGeometrie(
    new THREE.Vector3(0.12, 1, 0.06).normalize(), 0.75, 0.035, 0.01, new THREE.Vector3(0.03, 0, 0.02)
  );
  const gipfelAst = new THREE.Mesh(gipfelGeo, rinde);
  gipfelAst.position.copy(gipfel);
  gipfelAst.castShadow = true;
  wurzel.add(gipfelAst);
  teile.push({ mesh: gipfelAst, ab: 26, bis: 40 });
  for (let l = 0; l < 10; l++) {
    const winkel = l * GOLDEN;
    blattPlaetze.push({
      position: gipfel.clone().add(gipfelEnde).add(new THREE.Vector3(Math.cos(winkel) * 0.18, (zufall() - 0.4) * 0.3, Math.sin(winkel) * 0.18)),
      drehung: new THREE.Euler(zufall() * 3, zufall() * 3, zufall() * 3),
      groesse: 0.7 + zufall() * 0.4,
    });
  }

  // ─── Sammelformen: Blätter, Knospen, Blüten, Früchte ─────────────────────
  // Hunderte Blätter als EINE Form. Das macht die Krone dicht und kostet trotzdem
  // nur einen Zeichenaufruf statt hunderte — sonst wäre «dichter» teuer erkauft.
  const blattGeo = new THREE.SphereGeometry(0.115, 6, 4);
  blattGeo.scale(1, 0.3, 0.62);
  const knospeGeo = new THREE.SphereGeometry(0.05, 6, 4);
  // Zurück auf ruhiges Mass: die Blüten waren nie zu klein, sie wurden
  // weggeschnitten (siehe frustumCulled unten). Erst der Fehler, dann das Mass.
  const blueteGeo = new THREE.SphereGeometry(0.07, 7, 5);
  blueteGeo.scale(1, 0.5, 1);

  const sammelForm = (geo, material, plaetze, plan) => {
    if (plaetze.length === 0) return;
    const mesh = new THREE.InstancedMesh(geo, material, plaetze.length);
    mesh.castShadow = true;
    // Ohne das verschwindet die ganze Sammelform, sobald der Nullpunkt der
    // Szene aus dem Bild fällt: die Sichtbarkeitsprüfung rechnet mit der
    // Hüllkugel der EINEN Form, nicht mit den hunderten Plätzen darin.
    // Genau das passierte beim Heranzoomen — Blüten und Blätter waren weg,
    // obwohl die Zahlen «sichtbar» meldeten.
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    wurzel.add(mesh);
    streu.push({ mesh, plaetze, ...plan });
  };

  const blattMaterial = new THREE.MeshStandardMaterial({ color: farben.blatt, roughness: 0.82, side: THREE.DoubleSide });
  sammelForm(blattGeo, blattMaterial, blattPlaetze, PLAN.blatt);

  // Keimblätter: die allerersten zwei Blättchen am jungen Trieb. Ohne sie ist
  // der Keimling nur ein Stift im Boden. `amStamm` heisst: sie sitzen an der
  // Spitze des WACHSENDEN Stamms und steigen mit ihm — sonst hängen sie im
  // ersten Moment über dem Trieb in der Luft (im Bild gesehen, 20.09.).
  // Gekippt und deutlich grösser als ein Kronenblatt: ein flaches Blatt, das
  // hochkant zur Kamera steht, ist praktisch unsichtbar (nachgemessen, nicht
  // geschätzt — die Blätter lagen richtig, man sah sie bloss nicht).
  sammelForm(blattGeo, blattMaterial, [-1, 1].map((s) => ({
    position: new THREE.Vector3(s * 0.46, 3.85, 0),
    drehung: new THREE.Euler(1.0, 0, s * 0.6),
    groesse: 1.6,
    amStamm: true,
  })), PLAN.keimblatt);
  sammelForm(knospeGeo, new THREE.MeshStandardMaterial({ color: farben.knospe, roughness: 0.7 }), knospenPlaetze, PLAN.knospe);
  sammelForm(blueteGeo, new THREE.MeshStandardMaterial({ color: farben.bluete, roughness: 0.7, side: THREE.DoubleSide }), bluetenPlaetze, PLAN.bluete);
  bereiche.forEach((b) => {
    // Reif = die Bereichsfarbe (dieselbe wie am flachen Baum). Unreif = dieselbe
    // Farbe, weit ins Blattgrün gezogen. Dazwischen wandert jede Frucht einzeln.
    const reif = new THREE.Color(b.farbe);
    const unreif = reif.clone().lerp(new THREE.Color(0x7d8f5f), 0.72);
    sammelForm(
      // Die echte Sorte, nicht bloss eine Grobform: Basis trägt Äpfel,
      // Behörden Zwetschgen, Wohnen Birnen — wie am flachen Baum.
      fruchtKoerper(b.fruit),
      // Weiss, weil die Farbe je Frucht einzeln obendrauf kommt.
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.46 }),
      fruchtPlaetze[b.key].map((p) => ({ ...p, bereich: b.key })),
      { ...PLAN.frucht, reifung: { reif, unreif } }
    );
  });

  // Nach aussen versetzt: die Marke soll neben der Krone stehen, nicht mitten
  // im Laub. Sie zeigt weiterhin genau auf ihren Ast.
  const anker = bereiche.map((b) => {
    const p = aeussersterPunkt(fruchtPlaetze[b.key]);
    return {
      key: b.key,
      punkt: new THREE.Vector3(p.x * 1.42, p.y + 0.35, p.z * 1.42),
    };
  });

  return { wurzel, teile, streu, anker, fruchtPlaetze };
}

// Ausfüllstand → Sichtbarkeit. Jeder Ast folgt seinem eigenen Lebensbereich.
const hilfsObjekt = new THREE.Object3D();
const reifeFarbe = new THREE.Color();
export function wachstumAnwenden(teile, streu, gesamtPct, proBereich) {
  const stand = (schluessel) => (schluessel != null && proBereich[schluessel] != null ? proBereich[schluessel] : gesamtPct);
  const wuchs = (pct, tl) => {
    let g = ramp(pct, tl.ab, tl.bis);
    if (tl.weg != null) g *= 1 - ramp(pct, tl.weg, tl.weg + 10);
    return g;
  };

  teile.forEach((tl) => {
    const g = wuchs(stand(tl.bereich), tl);
    tl.mesh.visible = g > 0.004;
    // Der Stamm wächst nach oben, nicht aus dem Nichts in die Breite.
    if (tl.achse === 'y') tl.mesh.scale.set(0.5 + 0.5 * g, Math.max(0.001, g), 0.5 + 0.5 * g);
    // `basis` ist die Endgrösse eines Schildchens — ohne sie schrumpfte jede
    // Frucht-mit-Icon auf eine Welteinheit zusammen.
    else tl.mesh.scale.setScalar(Math.max(0.001, g) * (tl.basis || 1));
  });

  // Wie weit ist der Stamm? Nur dafür da, dass die Keimblätter mit ihm steigen.
  const stammG = ramp(gesamtPct, 0, 14);

  streu.forEach((s) => {
    let sichtbar = false;
    s.plaetze.forEach((p, i) => {
      // Trägt der Platz einen eigenen Zeitplan (Früchte), gilt seiner.
      const reifeGrad = wuchs(stand(p.bereich), p.ab != null ? p : s);
      const g = reifeGrad * (p.groesse || 1);
      if (g > 0.004) sichtbar = true;
      if (s.reifung) {
        reifeFarbe.copy(s.reifung.unreif).lerp(s.reifung.reif, reifeGrad);
        s.mesh.setColorAt(i, reifeFarbe);
      }
      if (p.amStamm) {
        hilfsObjekt.position.set(p.position.x * (0.5 + 0.5 * stammG), p.position.y * stammG, p.position.z);
      } else {
        hilfsObjekt.position.copy(p.position);
      }
      if (p.drehung) hilfsObjekt.rotation.copy(p.drehung);
      else hilfsObjekt.rotation.set(0, 0, 0);
      hilfsObjekt.scale.setScalar(Math.max(0.0001, g));
      hilfsObjekt.updateMatrix();
      s.mesh.setMatrixAt(i, hilfsObjekt.matrix);
    });
    s.mesh.instanceMatrix.needsUpdate = true;
    if (s.reifung && s.mesh.instanceColor) s.mesh.instanceColor.needsUpdate = true;
    s.mesh.visible = sichtbar;
  });
}

export default function Baum3D({ bereiche, palette, isDarkMode, gesamtPct, hoehe = 420, ariaLabel, onBereichWaehlen, werkzeuge, onWerkzeugWaehlen }) {
  const halter = React.useRef(null);
  const [keinWebGL, setKeinWebGL] = React.useState(false);
  // Wo hängt welcher Ast gerade auf dem Bildschirm? Daran kleben die
  // Beschriftungen — echte Knöpfe über der Leinwand, nicht ins Bild gemalt.
  // So bleiben Name, Prozent und der Weg ins Kapitel erhalten, die der flache
  // Baum kann und der räumliche bisher nicht hatte.
  const [marken, setMarken] = React.useState([]);

  React.useEffect(() => {
    const el = halter.current;
    if (!el) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      setKeinWebGL(true);
      return undefined;
    }
    const wenigerBewegung = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    // PCFSoftShadowMap gibt es in three 0.186 nicht mehr — die Konsole meldete
    // still einen Rückfall auf PCF. Dann schreiben wir gleich hin, was gilt.
    renderer.shadowMap.type = THREE.PCFShadowMap;
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'none' });

    const szene = new THREE.Scene();
    const kamera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    szene.add(new THREE.HemisphereLight(0xdfeeff, 0x54603f, 2.1));
    const sonne = new THREE.DirectionalLight(0xfff2d6, 3.0);
    sonne.position.set(-5, 10, 6);
    sonne.castShadow = true;
    sonne.shadow.mapSize.set(1024, 1024);
    sonne.shadow.camera.left = -7; sonne.shadow.camera.right = 7;
    sonne.shadow.camera.top = 10; sonne.shadow.camera.bottom = -2;
    szene.add(sonne);

    // Boden aus UNSERER Palette statt aus einer erfundenen Wiesenfarbe — sonst
    // sitzt ein fremdes Grün mitten im Maloja-Panel.
    const wiese = new THREE.Color(palette && palette.sage ? palette.sage : '#7d9a62')
      .multiplyScalar(isDarkMode ? 0.42 : 0.92);
    const boden = new THREE.Mesh(
      new THREE.CircleGeometry(14, 60),
      new THREE.MeshStandardMaterial({ color: wiese, roughness: 1 })
    );
    boden.rotation.x = -Math.PI / 2;
    boden.receiveShadow = true;
    szene.add(boden);

    const farben = {
      rinde: isDarkMode ? 0x6b563c : 0x7a5f42,
      blatt: isDarkMode ? 0x5e7a54 : 0x6e8b5a,
      knospe: isDarkMode ? 0x8c7a52 : 0xa89055,
      bluete: isDarkMode ? 0xc9a8b0 : 0xe6cbd3,
    };
    const { wurzel, teile, streu, anker, fruchtPlaetze } = baumAufbauen(bereiche, farben);
    szene.add(wurzel);

    // ─── Leitfrucht + Werkzeug-Früchte ───────────────────────────────────────
    // Je Ast eine grosse Frucht mit dem Bereichs-Icon als Negativ, und daran die
    // kleineren Werkzeug-Früchte — dieselbe Zuordnung wie am flachen Baum
    // (Steuer und Budget an Finanzen, IPV an Versicherungen, und so fort).
    const schildchen = [];
    // Die Bilder laden asynchron — wenn eines fertig ist, einmal neu zeichnen.
    const textureFertig = () => anfordern();
    bereiche.forEach((b) => {
      const plaetze = fruchtPlaetze[b.key] || [];
      if (plaetze.length === 0) return;

      const leit = anker.find((a) => a.key === b.key);
      const leitTextur = b.fruit ? fruchtSchildchen(b.fruit, b.iconName || b.key, b.farbe, 128) : null;
      if (leitTextur && leit) {
        leitTextur.__fertig = textureFertig;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: leitTextur, transparent: true, depthWrite: false }));
        sprite.position.copy(leit.punkt).add(new THREE.Vector3(0, -0.5, 0));
        wurzel.add(sprite);
        // 0,55 Welteinheiten bei rund 5 Einheiten Baumhöhe: gut erkennbar, ohne
        // dass die Frucht den Baum erschlägt (0,95 tat genau das — im Bild gesehen).
        teile.push({ mesh: sprite, ...PLAN.frucht, basis: 0.55, bereich: b.key });
        schildchen.push(leitTextur);
      }

      // Werkzeuge an denselben Ast, etwas tiefer und deutlich kleiner — sie sind
      // Beiwerk, nicht der Bereich selbst.
      const werkzeugeHier = (werkzeuge || []).filter((w) => w.area === b.key);
      werkzeugeHier.forEach((w, i) => {
        const platz = plaetze[Math.min(plaetze.length - 1, 4 + i * 5)];
        if (!platz) return;
        const textur = b.fruit ? fruchtSchildchen(b.fruit, w.iconName || b.iconName || b.key, b.farbe, 96) : null;
        if (!textur) return;
        textur.__fertig = textureFertig;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textur, transparent: true, depthWrite: false, opacity: 0.92 }));
        sprite.position.copy(platz.position).add(new THREE.Vector3(0, -0.24, 0));
        wurzel.add(sprite);
        teile.push({ mesh: sprite, ab: 70, bis: 94, basis: 0.33, bereich: b.key });
        schildchen.push(textur);
      });
    });

    const proBereich = {};
    bereiche.forEach((b) => { proBereich[b.key] = b.pct; });

    let gier = 0.4, neigung = 0.14, abstand = 12;
    const ziel = new THREE.Vector3(0, 2.7, 0);
    let angefordert = false;
    const zeichnen = () => {
      angefordert = false;
      kamera.position.set(
        ziel.x + Math.sin(gier) * Math.cos(neigung) * abstand,
        ziel.y + Math.sin(neigung) * abstand,
        ziel.z + Math.cos(gier) * Math.cos(neigung) * abstand
      );
      kamera.lookAt(ziel);
      renderer.render(szene, kamera);
      markenNachfuehren();
    };

    // Die Ankerpunkte vom Raum auf die Fläche rechnen. Ein Ast auf der
    // Rückseite bekommt eine blassere Marke, damit vorne und hinten
    // unterscheidbar bleiben — statt dass sich alles überlagert.
    const hilfsVektor = new THREE.Vector3();
    let letzte = '';
    const markenNachfuehren = () => {
      const neu = anker.map((a) => {
        hilfsVektor.copy(a.punkt).project(kamera);
        const blickrichtung = kamera.position.clone().sub(ziel).normalize();
        const nachAussen = a.punkt.clone().setY(0).normalize();
        const vorne = nachAussen.dot(blickrichtung) > -0.15;
        return {
          key: a.key,
          x: (hilfsVektor.x * 0.5 + 0.5) * 100,
          y: (-hilfsVektor.y * 0.5 + 0.5) * 100,
          vorne,
          sichtbar: hilfsVektor.z < 1,
        };
      });
      // Entzerren: zwei Marken, die sich überlagern, schieben sich sanft
      // auseinander. Sonst liest man zwei Namen übereinander und keinen davon.
      const vorneListe = neu.filter((m) => m.vorne).sort((a, c) => a.y - c.y);
      for (let i = 1; i < vorneListe.length; i++) {
        const oben = vorneListe[i - 1];
        const unten = vorneListe[i];
        if (Math.abs(unten.x - oben.x) < 26 && unten.y - oben.y < 8) {
          unten.y = oben.y + 8;
        }
      }

      const abdruck = neu.map((m) => m.key + Math.round(m.x) + ',' + Math.round(m.y) + (m.vorne ? 'v' : 'h')).join('|');
      if (abdruck !== letzte) { letzte = abdruck; setMarken(neu); }
    };

    // Nur zeichnen, wenn sich etwas ändert — keine Dauerschleife, kein Akkufresser.
    const anfordern = () => { if (!angefordert) { angefordert = true; requestAnimationFrame(zeichnen); } };

    const groesse = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      kamera.aspect = w / h;
      kamera.updateProjectionMatrix();
      anfordern();
    };
    const beobachter = new ResizeObserver(groesse);
    beobachter.observe(el);
    groesse();

    // Einmaliges, ruhiges Einwachsen auf den echten Stand — nicht im Kreis.
    let stop = false;
    if (wenigerBewegung) {
      wachstumAnwenden(teile, streu, gesamtPct, proBereich);
      anfordern();
    } else {
      const start = performance.now();
      const dauer = 1800;
      const schritt = (jetzt) => {
        if (stop) return;
        const t = Math.min(1, (jetzt - start) / dauer);
        const eased = 1 - Math.pow(1 - t, 3);
        const proT = {};
        Object.keys(proBereich).forEach((k) => { proT[k] = proBereich[k] * eased; });
        wachstumAnwenden(teile, streu, gesamtPct * eased, proT);
        zeichnen();
        if (t < 1) requestAnimationFrame(schritt);
      };
      requestAnimationFrame(schritt);
    }

    // ─── Nur Messung (Arbeitsbaum) ───────────────────────────────────────────
    // Direkt gezeichnet statt über die Bildschleife: im Hintergrund-Tab bremst
    // der Browser requestAnimationFrame aus — die Bildrate misst dann den Tab,
    // nicht den Baum. Die Zeichendauer je Bild misst wirklich die Last.
    window.__baum3dMessung = (n = 40) => {
      zeichnen();
      const zeiten = [];
      for (let i = 0; i < n; i++) {
        gier += 0.01;
        const t0 = performance.now();
        kamera.position.set(
          ziel.x + Math.sin(gier) * Math.cos(neigung) * abstand,
          ziel.y + Math.sin(neigung) * abstand,
          ziel.z + Math.cos(gier) * Math.cos(neigung) * abstand
        );
        kamera.lookAt(ziel);
        renderer.render(szene, kamera);
        zeiten.push(performance.now() - t0);
      }
      zeiten.sort((a, b) => a - b);
      return {
        msJeBildMittel: +(zeiten.reduce((s, v) => s + v, 0) / n).toFixed(2),
        msJeBildSchlechtestes: +zeiten[n - 1].toFixed(2),
        reichtFuer60Hz: zeiten[Math.floor(n * 0.95)] < 16.7,
        dreiecke: renderer.info.render.triangles,
        zeichenaufrufe: renderer.info.render.calls,
        geometrien: renderer.info.memory.geometries,
      };
    };
    window.__baum3dGarten = (n = 11) => {
      for (let i = 1; i < n; i++) {
        const kopie = wurzel.clone();
        kopie.position.set((i % 4) * 4 - 6, 0, Math.floor(i / 4) * 4 - 4);
        kopie.scale.setScalar(0.7);
        szene.add(kopie);
      }
      abstand = 26;
      return window.__baum3dMessung(40);
    };
    window.__baum3dSzene = { szene, teile, streu, wurzel };
    window.__baum3dNah = (neuerAbstand = 5, zielHoehe = 1.6) => {
      abstand = neuerAbstand;
      ziel.y = zielHoehe;
      zeichnen();
      return { abstand, zielHoehe };
    };
    window.__baum3dStand = (pct) => {
      const proT = {};
      Object.keys(proBereich).forEach((k) => { proT[k] = pct; });
      wachstumAnwenden(teile, streu, pct, proT);
      zeichnen();
      return wuchsphase(pct).name;
    };

    let zieht = false, lx = 0, ly = 0;
    const runter = (e) => { zieht = true; lx = e.clientX; ly = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); };
    const bewegen = (e) => {
      if (!zieht) return;
      gier -= (e.clientX - lx) * 0.007;
      neigung = Math.max(-0.1, Math.min(0.6, neigung + (e.clientY - ly) * 0.005));
      lx = e.clientX; ly = e.clientY;
      anfordern();
    };
    const hoch = () => { zieht = false; };
    const taste = (e) => {
      const s = { ArrowLeft: -0.18, ArrowRight: 0.18 }[e.key];
      if (s == null) return;
      e.preventDefault();
      gier += s;
      anfordern();
    };
    renderer.domElement.addEventListener('pointerdown', runter);
    renderer.domElement.addEventListener('pointermove', bewegen);
    renderer.domElement.addEventListener('pointerup', hoch);
    el.addEventListener('keydown', taste);

    return () => {
      stop = true;
      beobachter.disconnect();
      el.removeEventListener('keydown', taste);
      szene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [bereiche, isDarkMode, gesamtPct, werkzeuge, palette]);

  if (keinWebGL) return null; // Aufrufer zeigt dann den flachen Baum.

  const nachSchluessel = {};
  (bereiche || []).forEach((b) => { nachSchluessel[b.key] = b; });

  return React.createElement('div', { style: { position: 'relative', width: '100%' } },
    React.createElement('div', {
      ref: halter,
      tabIndex: 0,
      role: 'img',
      'aria-label': ariaLabel,
      style: {
        width: '100%', height: hoehe + 'px', borderRadius: '12px', overflow: 'hidden',
        // Himmel aus der Palette, nicht aus einem Fantasie-Blau: der Kasten soll
        // wie ein Teil der Seite wirken, nicht wie ein eingeklebtes Fenster.
        background: palette
          ? 'linear-gradient(' + palette.up + ', ' + palette.sage + '1f)'
          : (isDarkMode ? 'linear-gradient(#2a3338,#37423a)' : 'linear-gradient(#dfeaf0,#eef3e8)'),
      },
    }),
    ...marken.filter((m) => m.sichtbar).map((m) => {
      const b = nachSchluessel[m.key];
      if (!b) return null;
      const anklickbar = typeof onBereichWaehlen === 'function';
      const IconFn = Icons[b.iconName] || Icons[m.key];
      const meineWerkzeuge = (werkzeuge || []).filter((w) => w.area === m.key);
      return React.createElement('div', {
        key: m.key,
        style: {
          position: 'absolute', left: m.x + '%', top: m.y + '%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
          // Hinten liegende Äste treten zurück, statt vorne mitzudrängeln.
          opacity: m.vorne ? 1 : 0.34,
          pointerEvents: m.vorne ? 'auto' : 'none',
        },
      },
        React.createElement('button', {
          type: 'button',
          onClick: anklickbar ? () => onBereichWaehlen(b) : undefined,
          'aria-label': (b.name || m.key) + ' — ' + b.pct + ' Prozent',
          style: {
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '2px 8px 2px 4px', borderRadius: '999px',
            fontFamily: 'inherit', fontSize: '11px', lineHeight: 1.3, whiteSpace: 'nowrap',
            color: palette ? palette.text : '#222',
            background: (palette ? palette.surface : '#fff') + 'e6',
            border: '1px solid ' + b.farbe + '55',
            cursor: anklickbar ? 'pointer' : 'default',
          },
        },
          // Dasselbe Bereichs-Icon wie an der Frucht — nur hier scharf gezeichnet
          // statt als Bild, damit es auch klein lesbar bleibt.
          React.createElement('span', {
            style: { width: '13px', height: '13px', color: b.farbe, flex: '0 0 auto', display: 'inline-flex' },
            'aria-hidden': 'true',
          }, IconFn ? IconFn() : null),
          React.createElement('span', null, b.name || m.key),
          React.createElement('span', {
            style: { opacity: 0.6, fontVariantNumeric: 'tabular-nums' },
          }, b.pct + '%')
        ),
        // Werkzeug-Früchte: am Baum hängen sie als kleine Früchte, hier stehen
        // sie als anklickbare Pillen darunter — wie am flachen Baum.
        meineWerkzeuge.length ? React.createElement('div', {
          style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' },
        }, ...meineWerkzeuge.map((w) => React.createElement('button', {
          key: w.key,
          type: 'button',
          onClick: onWerkzeugWaehlen ? () => onWerkzeugWaehlen(w) : undefined,
          'aria-label': w.label || w.short,
          style: {
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '1px 7px 1px 3px', borderRadius: '999px',
            fontFamily: 'inherit', fontSize: '10px', lineHeight: 1.25, whiteSpace: 'nowrap',
            color: palette ? palette.mid : '#555',
            background: b.farbe + '14',
            border: '1px solid ' + b.farbe + '33',
            cursor: onWerkzeugWaehlen ? 'pointer' : 'default',
          },
        },
          React.createElement('span', {
            style: { width: '7px', height: '7px', borderRadius: '50%', background: b.farbe, opacity: 0.85, flex: '0 0 auto' },
          }),
          w.short || w.label
        ))) : null
      );
    })
  );
}
