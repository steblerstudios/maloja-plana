import React from 'react';
import * as THREE from 'three';

// MESSPROTOTYP — nur im Arbeitsbaum mess/baum-3d, nicht für main gedacht.
// Portiert die Wuchs-Logik der 3D-Vorlage (wachsender-baum-3d.html) auf unsere
// Regeln: kein fremder Server (three liegt als eigene Abhängigkeit bei), kein
// Dauerlauf der Zeichenschleife, Farben aus der Palette, eine Frucht je
// Lebensbereich. Wächst mit dem Ausfüllstand, nicht mit der Uhr.

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // 137.5° — Phyllotaxis

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
      punkte.push(new THREE.Vector2(Math.sin(t * Math.PI) * (0.055 + t * 0.075), t * 0.34 - 0.17));
    }
    return new THREE.LatheGeometry(punkte, 9);
  }
  if (form === 'beere') return new THREE.SphereGeometry(0.07, 8, 6);
  if (form === 'rundlich') {
    const g = new THREE.SphereGeometry(0.12, 10, 8);
    g.scale(1, 0.92, 1);
    return g;
  }
  return new THREE.SphereGeometry(0.1, 8, 6); // Büschel-Einzelbeere (Traube)
}

// Ein Ast: Rohr entlang einer leicht gebogenen Linie, unten dicker als oben.
//
// WICHTIG — der Nullpunkt liegt am ANSATZ des Astes, nicht im Ursprung der Szene.
// Sonst schrumpft ein wachsender Ast zur Bildmitte und schwebt unterwegs in der
// Luft (erster Messlauf 20.09., im Bild gesehen). Der Ast wächst aus seinem
// eigenen Ansatz heraus — nichts schwebt, in keiner Wuchsstufe.
function astGeometrie(richtung, laenge, r0, r1, biegung) {
  const p0 = new THREE.Vector3(0, 0, 0);
  const mitte = richtung.clone().multiplyScalar(laenge * 0.5).add(biegung);
  const ende = richtung.clone().multiplyScalar(laenge).add(biegung.clone().multiplyScalar(2));
  const kurve = new THREE.CatmullRomCurve3([p0, mitte, ende]);
  const ringe = 6;
  const g = new THREE.TubeGeometry(kurve, 5, r0, ringe, false);
  // Verjüngung: obere Ringe enger um die Mittellinie ziehen.
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = Math.floor(i / (ringe + 1)) / 5;
    const p = kurve.getPoint(t);
    const f = THREE.MathUtils.lerp(1, r1 / r0, t);
    pos.setXYZ(i, p.x + (pos.getX(i) - p.x) * f, p.y + (pos.getY(i) - p.y) * f, p.z + (pos.getZ(i) - p.z) * f);
  }
  g.computeVertexNormals();
  return { geometrie: g, ende };
}

export function baumAufbauen(bereiche, farben, seed = 7412) {
  const zufall = rng(seed);
  const wurzel = new THREE.Group();
  const teile = []; // { mesh, ab, bis } — ab/bis in Prozent des Ausfüllstands
  const rinde = new THREE.MeshStandardMaterial({ color: farben.rinde, roughness: 0.95 });
  const blatt = new THREE.MeshStandardMaterial({ color: farben.blatt, roughness: 0.8, side: THREE.DoubleSide });
  const bluete = new THREE.MeshStandardMaterial({ color: farben.bluete, roughness: 0.7, side: THREE.DoubleSide });

  // Stamm: eine durchgehende, leicht gebogene Linie statt gestapelter Zylinder.
  const stammPunkte = [];
  const stammRadien = [];
  let p = new THREE.Vector3(0, 0, 0);
  let richtung = new THREE.Vector3(0.02, 1, 0.01).normalize();
  for (let i = 0; i <= 6; i++) {
    stammPunkte.push(p.clone());
    stammRadien.push(0.3 - i * 0.03);
    p = p.clone().addScaledVector(richtung, 0.62);
    richtung.add(new THREE.Vector3((zufall() - 0.5) * 0.06, 0, (zufall() - 0.5) * 0.06)).normalize();
  }
  const stammKurve = new THREE.CatmullRomCurve3(stammPunkte);
  const stamm = new THREE.Mesh(new THREE.TubeGeometry(stammKurve, 24, 0.22, 10, false), rinde);
  stamm.castShadow = true;
  stamm.receiveShadow = true;
  wurzel.add(stamm);
  teile.push({ mesh: stamm, ab: 0, bis: 12, achse: 'y' });

  // Wurzeln — sie machen den Übergang zum Boden glaubwürdig.
  for (let i = 0; i < 9; i++) {
    const w = (i / 9) * Math.PI * 2 + zufall() * 0.3;
    const start = new THREE.Vector3(Math.cos(w) * 0.06, 0.08, Math.sin(w) * 0.06);
    const dir = new THREE.Vector3(Math.cos(w), -0.22, Math.sin(w)).normalize();
    const { geometrie } = astGeometrie(dir, 0.75 + zufall() * 0.4, 0.075, 0.015, new THREE.Vector3(0, -0.05, 0));
    const mesh = new THREE.Mesh(geometrie, rinde);
    mesh.position.copy(start);
    mesh.receiveShadow = true;
    wurzel.add(mesh);
    teile.push({ mesh, ab: 0, bis: 8 });
  }

  // Ein Hauptast je Lebensbereich — er wächst mit SEINEM Ausfüllstand.
  bereiche.forEach((b, i) => {
    const hoehe = 0.42 + (i / bereiche.length) * 0.5; // von unten nach oben verteilt
    const ansatz = stammKurve.getPoint(hoehe);
    const azimut = i * GOLDEN; // Goldener Winkel: natürliche Verteilung rundum
    const dir = new THREE.Vector3(Math.cos(azimut), 0.85 - hoehe * 0.35, Math.sin(azimut)).normalize();
    const astGruppe = new THREE.Group();
    wurzel.add(astGruppe);

    const stufe = (pct, von, bis) => ({ ab: von, bis: bis });
    const zweigen = (start, dir, laenge, radius, tiefe, verzug) => {
      const biegung = new THREE.Vector3((zufall() - 0.5) * 0.1, 0.06, (zufall() - 0.5) * 0.1);
      const { geometrie, ende } = astGeometrie(dir, laenge, radius, radius * 0.6, biegung);
      const mesh = new THREE.Mesh(geometrie, rinde);
      mesh.position.copy(start); // Ansatz = Nullpunkt: der Ast wächst aus dem Elternast.
      mesh.castShadow = true;
      astGruppe.add(mesh);
      teile.push({ mesh, ab: verzug, bis: verzug + 14, bereich: b.key });
      const weltEnde = start.clone().add(ende);
      if (tiefe === 0) {
        // Erst wenn der Ast fertig ist, kommt etwas daran — sonst hinge es im Leeren.
        spitzeBestuecken(weltEnde, dir, verzug + 14, b);
        return;
      }
      for (let k = 0; k < 2; k++) {
        const a = azimut + k * Math.PI + (zufall() - 0.5) * 0.9;
        const neu = new THREE.Vector3(Math.cos(a) * 0.55, 0.8, Math.sin(a) * 0.55).normalize().lerp(dir, 0.45).normalize();
        zweigen(weltEnde, neu, laenge * 0.68, radius * 0.6, tiefe - 1, verzug + 12);
      }
    };

    // Alles, was an einer Astspitze hängt — nie frei schwebend.
    const spitzeBestuecken = (punkt, dir, verzug, bereich) => {
      for (let l = 0; l < 7; l++) {
        const m = new THREE.Mesh(blattGeo, blatt);
        m.position.copy(punkt).add(new THREE.Vector3((zufall() - 0.5) * 0.42, (zufall() - 0.3) * 0.32, (zufall() - 0.5) * 0.42));
        m.rotation.set(zufall() * 3, zufall() * 3, zufall() * 3);
        m.castShadow = true;
        astGruppe.add(m);
        teile.push({ mesh: m, ab: verzug + 4, bis: verzug + 20, bereich: bereich.key });
      }
      const bl = new THREE.Mesh(blueteGeo, bluete);
      bl.position.copy(punkt).addScaledVector(dir, 0.1);
      astGruppe.add(bl);
      // Blüte erst, wenn der Ast steht; sie verblüht, wenn die Frucht kommt.
      teile.push({ mesh: bl, ab: Math.max(verzug, 18), bis: Math.max(verzug, 18) + 16, weg: 58, bereich: bereich.key });

      const f = new THREE.Mesh(fruchtGeometrie(bereich.form), new THREE.MeshStandardMaterial({ color: bereich.farbe, roughness: 0.5 }));
      f.position.copy(punkt).add(new THREE.Vector3((zufall() - 0.5) * 0.22, -0.16, (zufall() - 0.5) * 0.22));
      f.castShadow = true;
      astGruppe.add(f);
      teile.push({ mesh: f, ab: Math.max(verzug + 20, 48), bis: 92, bereich: bereich.key });
    };

    const blattGeo = new THREE.SphereGeometry(0.12, 6, 4);
    blattGeo.scale(1, 0.32, 0.6);
    const blueteGeo = new THREE.SphereGeometry(0.06, 6, 4);

    zweigen(ansatz, dir, 0.9, 0.075, 2, 12 + i * 0.6);
  });

  return { wurzel, teile };
}

// Ausfüllstand → Sichtbarkeit. Jeder Ast folgt seinem eigenen Bereich.
export function wachstumAnwenden(teile, gesamtPct, proBereich) {
  teile.forEach((tl) => {
    const pct = tl.bereich != null && proBereich[tl.bereich] != null ? proBereich[tl.bereich] : gesamtPct;
    let g = ramp(pct, tl.ab, tl.bis);
    if (tl.weg != null) g *= 1 - ramp(pct, tl.weg, tl.weg + 12);
    tl.mesh.visible = g > 0.004;
    const s = Math.max(0.001, g);
    // Der Stamm wächst nach oben, nicht aus dem Nichts in die Breite.
    if (tl.achse === 'y') tl.mesh.scale.set(0.55 + 0.45 * g, s, 0.55 + 0.45 * g);
    else tl.mesh.scale.setScalar(s);
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
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'none';

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
      bluete: isDarkMode ? 0xc9a8b0 : 0xe6cbd3,
    };
    const { wurzel, teile } = baumAufbauen(bereiche, farben);
    szene.add(wurzel);

    const proBereich = {};
    bereiche.forEach((b) => { proBereich[b.key] = b.pct; });

    let gier = 0.4, neigung = 0.14, abstand = 11;
    const ziel = new THREE.Vector3(0, 2.6, 0);
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
      wachstumAnwenden(teile, gesamtPct, proBereich);
      anfordern();
    } else {
      const start = performance.now();
      const dauer = 1600;
      const schritt = (jetzt) => {
        if (stop) return;
        const t = Math.min(1, (jetzt - start) / dauer);
        const eased = 1 - Math.pow(1 - t, 3);
        const proT = {};
        Object.keys(proBereich).forEach((k) => { proT[k] = proBereich[k] * eased; });
        wachstumAnwenden(teile, gesamtPct * eased, proT);
        zeichnen();
        if (t < 1) requestAnimationFrame(schritt);
      };
      requestAnimationFrame(schritt);
    }

    // NUR MESSUNG (Arbeitsbaum): Dreiecke, Zeichenaufrufe, Bilder pro Sekunde.
    // Direkt gezeichnet statt über die Bildschleife: im Hintergrund-Tab bremst
    // der Browser requestAnimationFrame aus — die Bildrate misst dann den Tab,
    // nicht den Baum. Die Zeichendauer je Bild misst wirklich die Last.
    window.__baum3dMessung = (n = 40) => {
      zeichnen(); // einmal warmlaufen (Shader übersetzen)
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

    // Gegenprobe: was kostet ein ganzer Obstgarten in EINER Zeichenfläche?
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
