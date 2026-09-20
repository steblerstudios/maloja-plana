import React from 'react';
import * as THREE from 'three';

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

// Vier Grundformen decken unsere elf Früchte ab (wie FRUIT_FORM, nur räumlich).
function fruchtGeometrie(form) {
  if (form === 'laenglich') {
    const punkte = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      punkte.push(new THREE.Vector2(Math.sin(t * Math.PI) * (0.055 + t * 0.075) + 0.004, t * 0.34 - 0.17));
    }
    return new THREE.LatheGeometry(punkte, 9);
  }
  if (form === 'beere') return new THREE.SphereGeometry(0.075, 8, 6);
  if (form === 'buschel') {
    // Traube: ein kleines Büschel aus einer Form, damit es ein Zeichenaufruf bleibt.
    const teile = [];
    [[0, 0, 0], [-0.06, -0.07, 0.02], [0.06, -0.07, -0.02], [0, -0.14, 0.03], [0.02, -0.2, -0.01]].forEach((p) => {
      const k = new THREE.SphereGeometry(0.05, 7, 5);
      k.translate(p[0], p[1], p[2]);
      teile.push(k);
    });
    return teile.reduce((a, b) => mergeGeometrien(a, b));
  }
  const g = new THREE.SphereGeometry(0.11, 10, 8);
  g.scale(1, 0.92, 1);
  return g;
}

// Kleiner eigener Zusammenführer statt BufferGeometryUtils — spart Gewicht und
// reicht für unsere Fälle (gleiche Attribute, keine Gruppen).
function mergeGeometrien(a, b) {
  const g = new THREE.BufferGeometry();
  ['position', 'normal', 'uv'].forEach((name) => {
    const aa = a.getAttribute(name);
    const bb = b.getAttribute(name);
    if (!aa || !bb) return;
    const zusammen = new Float32Array(aa.array.length + bb.array.length);
    zusammen.set(aa.array, 0);
    zusammen.set(bb.array, aa.array.length);
    g.setAttribute(name, new THREE.BufferAttribute(zusammen, aa.itemSize));
  });
  const ai = a.getIndex();
  const bi = b.getIndex();
  if (ai && bi) {
    const versatz = a.getAttribute('position').count;
    const idx = [];
    for (let i = 0; i < ai.count; i++) idx.push(ai.getX(i));
    for (let i = 0; i < bi.count; i++) idx.push(bi.getX(i) + versatz);
    g.setIndex(idx);
  }
  return g;
}

// Ein Ast: Rohr entlang einer leicht gebogenen Linie, unten dicker als oben.
//
// WICHTIG — der Nullpunkt liegt am ANSATZ, nicht im Ursprung der Szene. Sonst
// schrumpft ein wachsender Ast zur Bildmitte und schwebt unterwegs in der Luft
// (erster Messlauf 20.09., im Bild gesehen). So wächst jeder Ast aus seinem
// Elternast heraus — nichts schwebt, in keiner Wuchsstufe.
function rohrMitVerjuengung(kurve, r0, r1, laengsSegmente, rundSegmente) {
  const g = new THREE.TubeGeometry(kurve, laengsSegmente, r0, rundSegmente, false);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = Math.floor(i / (rundSegmente + 1)) / laengsSegmente;
    const p = kurve.getPoint(t);
    const f = THREE.MathUtils.lerp(1, r1 / r0, t);
    pos.setXYZ(i, p.x + (pos.getX(i) - p.x) * f, p.y + (pos.getY(i) - p.y) * f, p.z + (pos.getZ(i) - p.z) * f);
  }
  g.computeVertexNormals();
  return g;
}

function astGeometrie(richtung, laenge, r0, r1, biegung) {
  const mitte = richtung.clone().multiplyScalar(laenge * 0.5).add(biegung);
  const ende = richtung.clone().multiplyScalar(laenge).add(biegung.clone().multiplyScalar(2));
  const kurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), mitte, ende]);
  return { geometrie: rohrMitVerjuengung(kurve, r0, r1, 5, 6), ende };
}

export function baumAufbauen(bereiche, farben, seed = 7412) {
  const zufall = rng(seed);
  const wurzel = new THREE.Group();
  const teile = [];      // einzelne Formen: { mesh, ab, bis, weg?, bereich? }
  const streu = [];      // Blätter/Knospen/Blüten/Früchte als Sammelformen
  const rinde = new THREE.MeshStandardMaterial({ color: farben.rinde, roughness: 0.95 });

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
  const stamm = new THREE.Mesh(rohrMitVerjuengung(stammKurve, 0.3, 0.035, 26, 10), rinde);
  stamm.castShadow = true;
  stamm.receiveShadow = true;
  wurzel.add(stamm);
  teile.push({ mesh: stamm, ...PLAN.stamm, achse: 'y' });

  // Wurzelanlauf: der Fuss verbreitert sich zum Boden, sonst steht der Stamm
  // wie ein eingesteckter Stab.
  for (let i = 0; i < 9; i++) {
    const w = (i / 9) * Math.PI * 2 + zufall() * 0.3;
    const dir = new THREE.Vector3(Math.cos(w), -0.3, Math.sin(w)).normalize();
    const { geometrie } = astGeometrie(dir, 0.7 + zufall() * 0.45, 0.085, 0.014, new THREE.Vector3(0, -0.06, 0));
    const mesh = new THREE.Mesh(geometrie, rinde);
    mesh.position.set(Math.cos(w) * 0.07, 0.16, Math.sin(w) * 0.07);
    mesh.receiveShadow = true;
    wurzel.add(mesh);
    teile.push({ mesh, ...PLAN.wurzeln });
  }

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
      fruchtPlaetze[bereich.key].push({
        position: punkt.clone().add(new THREE.Vector3((zufall() - 0.5) * 0.16, -0.32, (zufall() - 0.5) * 0.16)),
        groesse: 1 + zufall() * 0.25,
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
    sammelForm(
      fruchtGeometrie(b.form),
      new THREE.MeshStandardMaterial({ color: b.farbe, roughness: 0.5 }),
      fruchtPlaetze[b.key].map((p) => ({ ...p, bereich: b.key })),
      PLAN.frucht
    );
  });

  return { wurzel, teile, streu };
}

// Ausfüllstand → Sichtbarkeit. Jeder Ast folgt seinem eigenen Lebensbereich.
const hilfsObjekt = new THREE.Object3D();
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
    else tl.mesh.scale.setScalar(Math.max(0.001, g));
  });

  // Wie weit ist der Stamm? Nur dafür da, dass die Keimblätter mit ihm steigen.
  const stammG = ramp(gesamtPct, 0, 14);

  streu.forEach((s) => {
    let sichtbar = false;
    s.plaetze.forEach((p, i) => {
      const g = wuchs(stand(p.bereich), s) * (p.groesse || 1);
      if (g > 0.004) sichtbar = true;
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
    s.mesh.visible = sichtbar;
  });
}

export default function Baum3D({ bereiche, palette, isDarkMode, gesamtPct, hoehe = 420, ariaLabel }) {
  const halter = React.useRef(null);
  const [keinWebGL, setKeinWebGL] = React.useState(false);

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    const boden = new THREE.Mesh(
      new THREE.CircleGeometry(14, 60),
      new THREE.MeshStandardMaterial({ color: isDarkMode ? 0x3c4a35 : 0x7d9a62, roughness: 1 })
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
    const { wurzel, teile, streu } = baumAufbauen(bereiche, farben);
    szene.add(wurzel);

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
  }, [bereiche, isDarkMode, gesamtPct]);

  if (keinWebGL) return null; // Aufrufer zeigt dann den flachen Baum.

  return React.createElement('div', {
    ref: halter,
    tabIndex: 0,
    role: 'img',
    'aria-label': ariaLabel,
    style: {
      width: '100%', height: hoehe + 'px', borderRadius: '12px', overflow: 'hidden',
      background: isDarkMode ? 'linear-gradient(#2a3338,#37423a)' : 'linear-gradient(#dfeaf0,#eef3e8)',
    },
  });
}
