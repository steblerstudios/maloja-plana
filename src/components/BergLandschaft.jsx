import React, { useEffect, useRef, useState } from 'react';
import Icons from '../IconKern.jsx';
import { PageTitle } from './Heading.jsx';
import { text, weight, radius, ease, duration, fontFamilyDisplay } from '../config/tokens.js';
import { LIGHT_PALETTE, applyColorBlind } from '../config/constants.js';
import { astFarben } from '../utils/lebensbereichFruechte.js';
// Als eigene Datei, nicht im JS-Bündel: Vite legt sie mit Hash unter /assets/ ab, der
// Service Worker liefert sie danach cache-first. Herkunft und Nachbau: assets/berge/_QUELLE.md
// (eigene Malojapass-Fotos → Codex-Illustration → WebP in voller Auflösung, alle Details).
import landschaft from '../assets/berge/landschaft.webp?url';

// Koordinaten im Bild (1100 × 788; die Datei selbst ist 1482 × 1062, gleiches Seitenverhältnis).
// Die Passstrasse steigt in Kehren von unten rechts nach oben links; die Kapitel sitzen der
// Reihe nach auf ihr — Basis unten, Notfall oben.
const BILD = { w: 1100, h: 788 };
// Breit: das ganze Bild — seit dem Hero (25.09.2026) mit dem ganzen Himmel, in dem der Titel
// steht. Schmal: das Strassennetz, damit die Stationen am Handy weit genug auseinanderliegen,
// nach oben erweitert bis in die blassen Gipfel (Platz für den Titel) und nach unten bis zum
// Bildrand (ein Streifen Vordergrund-Wald für die Fortschritts-Kreise, unter den Stationen).
// Die Breite und damit der Massstab bleiben gleich — Stationen und Etiketten liegen zueinander
// wie zuvor.
export const AUSSCHNITT = {
  breit: { x: 0, y: 0, w: 1100, h: 788 },
  schmal: { x: 110, y: 130, w: 490, h: 658 },
};
export const SCHMAL_AB = 520; // px Breite des Rahmens
// Hero randlos (seit 25.09.2026): die Landschaft füllt die ganze Seitenbreite, scharf. Damit sie auf
// breiten Fenstern nicht höher als ~80 % des Fensters wird, zeigt der breite Ausschnitt dann weniger
// Höhe: oben fällt Himmel weg, unten etwas Vordergrund — die Stationen bleiben immer ganz drin.
// (Eine Fassung mit verschwommener Fortsetzung links/rechts wurde am selben Tag verworfen.)
export const MAX_HOEHE_ANTEIL = 1;
// Dunst hinter dem Titel: Himmelsfarbe aus dem Bild (#F6F2E8, gemessen), Deckung als Hex-Alpha
// oben / in der Mitte, auslaufend nach unten. Nur Grund, nie Deckkraft auf Text (K41).
export const DUNST = { farbe: '#F6F2E8', oben: 'EB', mitte: 'D9', mitteBei: 55 };
// Der Dunst steht nur, wo der Titel ohne ihn auf Berg läge: am Handy hochkant (Ausschnitt beginnt
// in den Gipfeln) und bei Bildern unter DUNST_UNTER_BREITE px (kleinstes Handy quer, 568×320: der
// Titelanfang liegt dort auf dem dunklen Hang, 2,26:1). Am Computer stört er (Entscheid
// 25.09.2026); seit der Himmel nie weggeschnitten wird, trägt der Titel dort ohne ihn — gemessen
// 640×360 … 2560×1300: erste Zeile 13,5:1, zweite ≥ 5,1:1.
export const DUNST_UNTER_BREITE = 600;
// Zweite Titelzeile: Salbeigrün in der Tiefe, die auf dem Bild trägt. Das Marken-Salbeigrün
// (#4A6657) ist fast die Farbe der Berge — ohne Dunst gemessen bis 2,45:1 (1920×700). Dieses
// Tannengrün hält ohne Dunst überall am Computer ≥ 3,77:1 (768×1024 … 1920×700 gemessen).
export const TITEL_GRUEN = '#2F4A3C';
const UNTERKANTE = 740;  // Bild-Einheiten: Platz unter Finanzen für die Kreise
// Flache, breite Fenster (Laptops): das Bild wäre in voller Breite höher als das Fenster. Früher
// fiel dann oben der Himmel weg — und mit ihm der Platz für den Titel. Jetzt zeigt der Ausschnitt
// immer Himmel bis Unterkante (0 … UNTERKANTE); dafür ist das Bild dort höher als das Fenster und
// man scrollt kurz zu den Kreisen (Entscheid 25.09.2026 — Dunst, Unschärfe und gespiegelte
// Fortsetzung an den Seiten wurden alle verworfen).
// Der ganze Berg im Fenster, randlos (Entscheid Stebler Studios, 25.09.2026 abends — dreht den
// Mittags-Entscheid «Himmel nie wegschneiden, am Laptop kurz scrollen»): unten (Stationen,
// Kreise) hat Vorrang. Passt das Bild nicht, fällt OBEN Himmel weg, bis die Unterkante genau am
// Fensterrand liegt — höchstens bis OBERKANTE_MAX, damit Titel und oberste Station (Ausbildung,
// y 479) Platz behalten; bei noch flacheren Fenstern scrollt man den Rest. Fehlt Himmel, trägt
// der Titel den Dunst (mitDunst).
export const OBERKANTE_MAX = 300; // Bild-Einheiten
// Die neun Berg-Bilder, die mit dem Ausfüllstand erscheinen (Tannen ab 20 % … Fahne bei 100 %),
// sind bis zum Gamification-Entscheid im Oktober ausgeschaltet (Stebler Studios, 25.09.2026;
// docs/IDEEN.md «Oktober — entscheiden», §15 «Berg-Bilder bei 20–100 %»). Der goldene Weg zu
// begonnenen Kapiteln bleibt — er ist Orientierung, keine Belohnung. Wieder einschalten: true.
export const BERG_BILDER = false;
export const ausschnittBreit = (rahmenBreite, fensterHoehe) => {
  const voll = AUSSCHNITT.breit;
  if (!rahmenBreite || !fensterHoehe) return voll;
  const hMax = fensterHoehe * MAX_HOEHE_ANTEIL; // px
  const h = (BILD.w * hMax) / rahmenBreite;     // Bild-Einheiten bei voller Breite
  if (h >= BILD.h) return voll;
  if (h >= UNTERKANTE) return { x: 0, y: 0, w: BILD.w, h };
  const y = Math.min(UNTERKANTE - h, OBERKANTE_MAX);
  return { x: 0, y, w: BILD.w, h: UNTERKANTE - y };
};

// Die Route ist aus dem Bild gelesen (Maske der hellen Fahrbahn, Mittellinie), die Stationen
// nach Vorgabe von Stebler Studios gesetzt (25.09.2026). Im Bild sind es zwei Strassen: die breite
// mit dem Mittelstreifen, die links ins Bild kommt und zum Betrachter hin abbiegt, und darüber die
// obere Strasse, die nach rechts in die U-Kurve läuft und in die links die schmale Strasse mündet.
//   Basis (links, breite Strasse) → Wohnen (auf dem Mittelstreifen) → unten hinter den Tannen
//   durch → Finanzen (U-Kurve) → Versicherungen (auf der oberen Strasse zwischen den zwei
//   Tannen) → die obere Strasse zurück nach links → die schmale Strasse hinauf zur Ausbildung →
//   oben über den Bogen und die Kehre ins S: Behörden → das S hinunter und die rechte Strasse
//   nach hinten: Notfall.
// Basis und Ausbildung sind NICHT direkt verbunden — dort geht keine Strasse durch. Und wo die
// obere Strasse an der Basis vorbeiläuft, ist der Weg ausgeblendet (Umkreis 48 Einheiten), damit
// es nicht aussieht, als schneide die Basis ihn.
// Weitere Vorgaben (Stebler Studios, 25.09.2026):
//   · der Weg von Versicherungen nach links läuft hinter der Tanne weiter und endet unter der
//     Behörden-Beschriftung (x 330), dann taucht er erst an der schmalen Strasse unterhalb der
//     Ausbildung wieder auf; das kurze Stück unten in der U-Kurve zwischen den Tannen bleibt;
//   · von Wohnen läuft der Weg in einem weichen Bogen als EINE Linie hinter die erste Tanne
//     (kein abgesetztes Stückchen zwischen den Ästen);
//   · der Weg zum Notfall beginnt, wo die rechte Strasse an der oberen Strasse anfängt (unterhalb
//     der Kurve) — nicht am Behörden-Knopf; die Schlaufe unten im S bleibt verdeckt;
//   · in der U-Kurve vor Finanzen läuft der Weg etwas mittiger, parallel zum Kurvenbogen;
//   · der Weg läuft möglichst mittig auf der Fahrbahn: auf den schmalen Strassen quer zur
//     Fahrrichtung vermessen und auf die Mitte gerückt, auf der breiten U-Kurve und der oberen
//     Strasse (Fahrbahn ~38 Einheiten) von Hand auf die Mitte gelegt.
// Wo eine Tanne die Strasse verdeckt, fehlt der Weg — er geht dahinter durch.
// Etikett-Seiten sind errechnet (Suche über alle Kombinationen): ohne Überschneidung bei
// 656/736 px (breit) und 296–496 px (schmal).
export const STATIONEN = [
  { key: 'basis', x: 185, y: 549, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'wohnen', x: 272, y: 616, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'finanzen', x: 551, y: 680, seite: { breit: 'rechts', schmal: 'links' } },
  { key: 'versicherungen', x: 440, y: 626, seite: { breit: 'rechts', schmal: 'oben' } },
  { key: 'ausbildung', x: 195, y: 479, seite: { breit: 'links', schmal: 'oben' } },
  // Behörden: seit 25.09.2026 läuft von hier der Weg senkrecht das S hinunter — «unten» läge darauf,
  // «oben» auf dem Zulauf von Ausbildung. «links» lässt beide frei; wo das Bild klein ist (Massstab
  // unter ENG_UNTER px je Bild-Einheit), stösst es an Ausbildung. Dort (gemessen): am Handy
  // «obenlinks» (verdeckt ~4 Punkte am Anfang des Zulaufs), breit «obenrechts» (obenlinks stiesse
  // an das Ausbildung-Etikett; verdeckt das Ende des Zulaufs) — das neue senkrechte Stück bleibt frei.
  { key: 'behoerden', x: 290, y: 513, seite: { breit: 'links', schmal: 'links', eng: { breit: 'obenrechts', schmal: 'obenlinks' } } },
  { key: 'notfall', x: 424, y: 526.5, seite: { breit: 'rechts', schmal: 'rechts' } },
];

// Wegstück i gehört zum Kapitel i+1 und führt von Station WEG_VON[i] zu dessen Station — eine
// durchgehende Route, also immer von der vorigen Station. Nur sichtbare Fahrbahn, je Lauf ein
// eigener Unterpfad (M … C …).
export const WEG_VON = [0, 1, 2, 3, 4, 5];
// Unter diesem Massstab (px je Bild-Einheit) gilt die Ausweich-Seite `seite.eng`, wo es eine gibt.
// Gemessen 25.09.2026: breit ist «links» bei Behörden ab ~900 px Bildbreite frei (0,82), am Handy
// ab 375 px (0,72).
export const ENG_UNTER = { breit: 0.82, schmal: 0.72 };
export const WEGSTUECKE = [
  'M185 549C189 550.9 197.5 552.5 208.7 560.3C220 568.1 241.9 586.4 252.6 595.6C263.2 604.7 269.4 611.8 272.6 615.2C275.9 618.6 272.1 615.9 272 616',
  'M272 616C275.8 619.5 289.2 631.5 295.1 637.2C301 642.8 303.5 645.6 307.4 649.9C311.3 654.3 313.5 656.6 318.5 663.1C323.5 669.7 334.3 684.7 337.5 689M432.1 727.2C435.3 727.5 448.4 728.9 451.6 729.2M540.5 724.4C541.2 723.6 542.9 722.4 544.5 719.5C546 716.5 548.5 710.6 549.6 706.6C550.7 702.6 551 699.9 551.2 695.4C551.4 691 551 682.6 551 680',
  'M551 680C550.6 677 549.6 666.3 548.7 662.1C547.8 657.9 546.9 657.3 545.5 655C544.2 652.8 542.6 650.6 540.8 648.6C539 646.7 537.1 644.9 534.9 643.3C532.7 641.6 532.3 640.7 527.6 638.7C522.9 636.7 510.3 632.4 506.8 631.1M484.3 627.4C476.9 627.2 447.4 626.2 440 626',
  'M440 626C433.6 625 408.2 621.1 401.8 620.2M364.4 611.1C358.7 609.8 335.7 604.4 330 603M172.9 504.9C173.6 503.7 173.2 501.9 177.2 497.8C181.2 493.7 194 483.3 196.9 480.2C199.9 477.1 195.3 479.2 195 479',
  'M195.7 474.2C197.2 472.3 202.5 464.9 204.7 462.7C206.9 460.5 203.6 462.5 208.9 461.1C214.1 459.7 227.2 456.1 236.4 454.4C245.6 452.6 254.2 452.5 264.2 450.8C274.1 449.1 288.8 446.9 296 444.4C303.1 441.8 303.4 437.8 307.2 435.6C310.9 433.3 314.7 431.1 318.5 430.9C322.4 430.6 326.9 432.9 330.3 434.3C333.7 435.8 336.3 437.4 338.9 439.5C341.4 441.7 344.1 444.6 345.6 447.2C347.1 449.8 347.7 452.5 347.7 455.2C347.8 457.9 348 460.3 346 463.4C344.1 466.4 340.6 469.7 336.1 473.5C331.5 477.3 324.6 482.2 318.8 486.1C313 489.9 305.3 493.9 301.3 496.8C297.4 499.6 297.2 500.5 295.3 503.2C293.4 505.9 290.9 511.4 290 513',
  'M290 513C291.6 514.6 293.6 519.1 294 523.2C294.4 527.3 293.3 525.6 296.2 531.9C299.1 538.3 308.7 556.4 311.2 561.3M348 584C348.4 581.9 349.4 575.3 350.4 571.2C351.5 567.1 352.7 562.5 354.2 559.3C355.6 556 357.1 554.3 359.1 551.9C361.2 549.6 363.5 547.3 366.4 545.2C369.2 543 372.6 540.8 376.4 538.8C380.2 536.9 384.8 535 389.1 533.5C393.5 532.1 396.8 531.2 402.6 530C408.4 528.8 420.4 527.1 424 526.5',
];

// ─── Kontrast: das Kapitel-Zeichen trägt die Kapitelfarbe, aber nie unter 3:1 (WCAG 1.4.11) ──
const kanal = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminanz = (hex) => {
  const [r, g, b] = kanal(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const kontrast = (a, b) => {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
// Dunkelt eine Farbe in kleinen Schritten ab, bis sie auf `grund` mindestens `ziel` erreicht.
// Farbton bleibt, nur die Helligkeit sinkt — Finanzen bleibt golden, nur tiefer.
export const mitKontrast = (hex, grund, ziel = 3) => {
  let [r, g, b] = kanal(hex);
  let farbe = hex;
  for (let i = 0; i < 30 && kontrast(farbe, grund) < ziel; i++) {
    [r, g, b] = [r, g, b].map((v) => Math.round(v * 0.93));
    farbe = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  return farbe;
};

// Stationsnamen: Grund in der Kapitelfarbe, Schrift weiss (seit 25.09.2026). Ist eine Farbe
// für weisse Schrift zu hell (Finanzen golden), wird sie im selben Farbton abgedunkelt, bis
// Weiss ≥ 4.5:1 trägt (WCAG 1.4.3, 11–13 px = normale Schrift).
export const ETIKETT_SCHRIFT = '#ffffff';
export const etikettGrund = (farbe) => mitKontrast(farbe, ETIKETT_SCHRIFT, 4.5);

// Ein Fortschritts-Kreis: Spur + Bogen im Verhältnis `anteil` (0–1), in der Mitte (wenn gegeben)
// der Wert. Farben aus der Palette des Modus (`ui`, seit 25.09.2026: hell/dunkel wie die App).
// Undurchsichtige Scheibe darunter, damit der Kontrast nicht am Bild hängt (K41).
const Kreis = ({ ui, anteil, mitte, d }) => {
  const sw = d >= 36 ? 4 : 3.5;
  const r = d / 2 - sw / 2 - 0.5, u = 2 * Math.PI * r;
  return React.createElement('svg', { width: d, height: d, viewBox: `0 0 ${d} ${d}`, 'aria-hidden': 'true', style: { display: 'block', flex: 'none' } },
    React.createElement('circle', { cx: d / 2, cy: d / 2, r, fill: ui.surface, stroke: ui.border, strokeWidth: sw }),
    anteil > 0 && React.createElement('circle', {
      cx: d / 2, cy: d / 2, r, fill: 'none', stroke: ui.sageDeep, strokeWidth: sw, strokeLinecap: 'round',
      strokeDasharray: `${u * Math.min(1, anteil)} ${u}`, transform: `rotate(-90 ${d / 2} ${d / 2})`,
      style: { transition: 'stroke-dasharray 900ms ease' },
    }),
    mitte != null && React.createElement('text', {
      x: '50%', y: '50%', textAnchor: 'middle', dominantBaseline: 'central',
      fontSize: d >= 44 ? 12 : 11, fontWeight: weight.semi, fill: ui.text, fontFamily: 'inherit',
    }, mitte),
  );
};

// Wie mitKontrast, aber in die richtige Richtung: auf dunklem Grund (Dunkelmodus) wird die Farbe
// aufgehellt — Richtung Weiss gemischt, Farbton bleibt —, auf hellem abgedunkelt. Für Stations-
// Zeichen und -Ring, die seit 25.09.2026 dem Modus der App folgen.
export const mitKontrastZu = (hex, grund, ziel = 3) => {
  if (luminanz(grund) >= 0.2) return mitKontrast(hex, grund, ziel);
  let farbe = hex;
  let [r, g, b] = kanal(hex);
  for (let i = 0; i < 40 && kontrast(farbe, grund) < ziel; i++) {
    [r, g, b] = [r, g, b].map((v) => Math.round(v + (255 - v) * 0.08));
    farbe = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  return farbe;
};

// Das Bild bleibt auch im Dunkelmodus hell (Entscheid 25.09.2026: «so dunkel ist unangenehm»).
// Darum tragen Stationen und Etiketten immer die helle Palette — ihr Kontrast hängt dann nicht
// am Modus. Der Farbenblind-Modus gilt trotzdem.
export const bildPalette = (palette) => applyColorBlind(LIGHT_PALETTE, !!palette.colorBlind);

const BergLandschaft = ({ palette, chapters, chapterCompletions, completion, onSelectChapter, lang, hyphenStyle, titel, fortschritt, fortschrittLabels, prozent, ecke }) => {
  const rahmen = useRef(null);
  const huelle = useRef(null);
  // Höhe des Titels (umbricht je nach Sprache und Breite) — der Dunst wächst mit.
  const [titelHoehe, setTitelHoehe] = useState(0);
  useEffect(() => {
    const el = huelle.current && huelle.current.querySelector('[data-testid="berg-titel"]');
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setTitelHoehe(Math.round(e.contentRect.height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Randlos: die Hülle greift aus der 720-px-Spalte bis an die Fensterränder. Gemessen statt 100vw,
  // weil 100vw eine klassische Scrollleiste mitzählt und die Seite dann seitlich scrollen liesse.
  const [ausgriff, setAusgriff] = useState(null);
  useEffect(() => {
    const el = huelle.current;
    if (!el || !el.parentElement || typeof window === 'undefined') return undefined;
    const messen = () => {
      const links = el.parentElement.getBoundingClientRect().left;
      const breite = document.documentElement.clientWidth;
      // Freie Höhe: Fenster minus ALLES, was beim Öffnen über dem Berg steht — Kopfzeile, die
      // Leiste «Lokal gespeichert», Hinweise. Gemessen am ersten nicht klebenden Vorfahren (die
      // Hülle um den Berg klebt; ihr eigener Abstand wechselt beim Scrollen). Bis 25.09.2026
      // abends zählte nur --mp-kopf-h: live fehlten unten die Kreise (Rückmeldung mit Bild).
      let vorfahr = el.parentElement;
      while (vorfahr && vorfahr.parentElement && getComputedStyle(vorfahr).position === 'sticky') vorfahr = vorfahr.parentElement;
      const oben = vorfahr ? vorfahr.getBoundingClientRect().top + window.scrollY : 0;
      const hoehe = window.innerHeight - oben;
      setAusgriff((alt) => (alt && alt.links === -links && alt.breite === breite && alt.hoehe === hoehe) ? alt : { links: -links, breite, hoehe });
    };
    messen();
    window.addEventListener('resize', messen);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(messen);
    if (ro) ro.observe(el.parentElement);
    return () => { window.removeEventListener('resize', messen); if (ro) ro.disconnect(); };
  }, []);
  // «abgeschlossen» springt auf, sobald das erste Kapitel fertig ist — nicht beim ersten Zeichnen.
  const abgeschlossenKachel = useRef(null);
  const warAbgeschlossen = useRef(null);
  const abgeschlossenJetzt = fortschritt ? fortschritt.abgeschlossen : 0;
  useEffect(() => {
    const vorher = warAbgeschlossen.current;
    warAbgeschlossen.current = abgeschlossenJetzt;
    const el = abgeschlossenKachel.current;
    if (vorher === null || vorher > 0 || abgeschlossenJetzt === 0 || !el || !el.animate) return;
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate([{ transform: 'scale(0.4)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }],
      { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1.2)' });
  }, [abgeschlossenJetzt]);
  const [breite, setBreite] = useState(0);
  const schmal = breite > 0 && breite < SCHMAL_AB;
  const [bildFehlt, setBildFehlt] = useState(false);

  useEffect(() => {
    const el = rahmen.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([eintrag]) => setBreite(eintrag.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const p = bildPalette(palette);
  // Die Fortschritts-Angaben folgen dem Modus der App (hell/dunkel), anders als Bild, Titel und
  // Stationen, die auf dem immer hellen Bild stehen (Entscheid 25.09.2026).
  const ui = palette;
  const kapitelFarbe = astFarben(chapters, p, false);
  const modus = schmal ? 'schmal' : 'breit';
  const a = schmal ? AUSSCHNITT.schmal : ausschnittBreit(breite, ausgriff && ausgriff.hoehe);
  // Linke Kante der Inhaltsspalte, gemessen in der Hülle: Titel und Kreise stehen am Desktop
  // bündig mit dem Inhalt darunter.
  const spalte = ausgriff ? -ausgriff.links : 0;
  const imRahmen = (x, y) => ({ left: ((x - a.x) / a.w) * 100 + '%', top: ((y - a.y) / a.h) * 100 + '%' });
  // Überraschungen: Marken-Töne, keine Deckkraft auf Text (K41).
  const s = (ab, max, spanne) => ({ opacity: Math.min(max, (completion - ab) / spanne), transition: 'opacity 1.5s ease' });

  return React.createElement('div', {
    ref: huelle,
    style: {
      position: 'relative', overflow: 'hidden', lineHeight: 0,
      margin: '0 0 24px', marginLeft: ausgriff ? ausgriff.links + 'px' : 0,
      width: ausgriff ? ausgriff.breite + 'px' : '100%',
      // Ladezustand und Fehlerfall: eine ruhige Fläche, nichts springt.
      background: p.up,
    },
  },
  React.createElement('div', {
    'data-tour': 'berge',
    ref: rahmen,
    style: {
      position: 'relative', lineHeight: 0, width: '100%',
      aspectRatio: `${a.w} / ${a.h}`,
      overflow: 'hidden',
    },
  },
    React.createElement('svg', {
      viewBox: `${a.x} ${a.y} ${a.w} ${a.h}`,
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': 'true',
      style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block',
      },
    },
      !bildFehlt && React.createElement('image', {
        href: landschaft,
        width: BILD.w, height: BILD.h,
        onError: () => setBildFehlt(true),
      }),
      // Der Weg: noch offene Stücke gepunktet (die Route ist von Anfang an lesbar), der Weg zu
      // einem begonnenen Kapitel golden. Unter dem Gold ein heller Saum, damit es sich von der hellen Fahrbahn abhebt.
      ...WEGSTUECKE.map((d, i) => {
        // Stück i führt zur Station des Kapitels i+1 — golden, sobald dieses Kapitel begonnen ist.
        const gegangen = chapterCompletions[i + 1] > 0;
        return React.createElement('g', { key: 'weg-' + i, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' },
          gegangen
            ? [React.createElement('path', { key: 's', d, stroke: p.surface, strokeWidth: 9 }),
               React.createElement('path', { key: 'w', d, stroke: p.sand, strokeWidth: 5 })]
            : React.createElement('path', { d, stroke: p.sageDeep, strokeWidth: 3, strokeDasharray: '0.1 9' }));
      }),
      // ─── Überraschungen mit dem Fortschritt (wie bisher, neu verortet) — bis Oktober aus, s. BERG_BILDER ───
      BERG_BILDER && completion >= 20 && React.createElement('g', { key: 'tannen', fill: p.sageDeep, style: s(20, 0.8, 30) },
        React.createElement('path', { d: 'M 842 548 L 852 520 L 862 548 Z' }),
        React.createElement('path', { d: 'M 862 552 L 870 530 L 878 552 Z' }),
      ),
      BERG_BILDER && completion >= 35 && React.createElement('g', { key: 'edelweiss', style: s(35, 0.9, 20) },
        React.createElement('circle', { cx: 452, cy: 548, r: 4.5, fill: '#fff' }),
        React.createElement('circle', { cx: 452, cy: 548, r: 1.8, fill: p.sand }),
        React.createElement('circle', { cx: 610, cy: 590, r: 4, fill: '#fff' }),
        React.createElement('circle', { cx: 610, cy: 590, r: 1.5, fill: p.sand }),
      ),
      BERG_BILDER && completion >= 45 && completion < 100 && React.createElement('g', { key: 'gipfelkreuz', stroke: p.mid, strokeWidth: 1.8, style: s(45, 0.8, 20) },
        React.createElement('line', { x1: 598, y1: 176, x2: 598, y2: 198 }),
        React.createElement('line', { x1: 591, y1: 182, x2: 605, y2: 182 }),
      ),
      BERG_BILDER && completion >= 55 && React.createElement('path', { key: 'matterhorn',
        d: 'M 912 170 L 926 134 L 932 146 L 942 170 Z', fill: p.sageDeep, style: s(55, 0.35, 60) }),
      BERG_BILDER && completion >= 65 && React.createElement('g', { key: 'kuh', fill: p.text, style: s(65, 0.55, 20) },
        React.createElement('ellipse', { cx: 700, cy: 560, rx: 8, ry: 4.6 }),
        React.createElement('ellipse', { cx: 692, cy: 556, rx: 3.2, ry: 2.6 }),
        React.createElement('rect', { x: 694, y: 563, width: 1.4, height: 6 }),
        React.createElement('rect', { x: 704, y: 563, width: 1.4, height: 6 }),
      ),
      BERG_BILDER && completion >= 75 && React.createElement('g', { key: 'uhr', fill: 'none', stroke: p.mid, style: s(75, 0.6, 15) },
        React.createElement('circle', { cx: 150, cy: 150, r: 7, strokeWidth: 1.2 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 150, y2: 145.5, strokeWidth: 1 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 153.5, y2: 151.5, strokeWidth: 0.8 }),
      ),
      BERG_BILDER && completion >= 85 && React.createElement('path', { key: 'schoggi',
        d: 'M 760 600 L 768 586 L 776 600 L 784 586 L 792 600 Z', fill: p.sand, style: s(85, 0.7, 10) }),
      BERG_BILDER && completion >= 95 && React.createElement('circle', { key: 'sonne',
        cx: 250, cy: 130, r: 22, fill: p.sand, style: { opacity: 0.35, transition: 'opacity 1.5s ease' } }),
      BERG_BILDER && completion >= 100 && React.createElement('g', { key: 'fahne' },
        React.createElement('line', { x1: 598, y1: 172, x2: 598, y2: 198, stroke: p.mid, strokeWidth: 1.6 }),
        React.createElement('rect', { x: 599, y: 172, width: 15, height: 10, rx: 0.8, fill: '#d42b2b' }),
        React.createElement('path', { d: 'M 606.5 174 L 606.5 180 M 603.5 177 L 609.5 177', fill: 'none', stroke: '#fff', strokeWidth: 1.8 }),
      ),
    ),
    // Der Anspruch als Titel im Himmel (Hero, seit 25.09.2026), links bündig (Entscheid Stebler
    // Studios), gesetzt in der Titelschrift (Hanken Grotesk), gross und eng; der zweite Satz — die
    // Antwort — in Salbeigrün (Variante «T1», Entscheid 25.09.2026). Er steht auf hellem Himmel,
    // darum in BEIDEN Modi dunkel (helle Palette). Links oben ragt der dunkle Hang ins Bild — der
    // Abstand ist so gewählt, dass der Text ihn nicht berührt (an den Bildpunkten gemessen). Kein
    // Schein dahinter, keine Deckkraft auf dem Text (K41).
    titel && (() => {
      const teile = String(titel).match(/^(.+?[.!?])\s+(.+)$/);
      const groesse = schmal ? 27 : Math.round(Math.min(50, Math.max(26, breite * 0.04)));
      const oben = schmal ? 10 : 16;
      // Dunst: der Himmel läuft in seiner eigenen Farbe sanft über die Gipfel hinunter — über die
      // ganze Breite, kein Schein um einzelne Buchstaben. Ohne ihn landet die zweite Zeile je nach
      // Fenster auf Berggrün (Salbeigrün darauf gemessen bis 1,07:1, dunkler Text bis 2,6:1).
      const dunstHoehe = oben + (titelHoehe || groesse * 2.1) + (schmal ? 46 : 70);
      // Dunst auch, sobald oben Himmel fehlt: dann stünde der Titel sonst auf den Bergen.
      const mitDunst = schmal || breite < DUNST_UNTER_BREITE || a.y > 0;
      return [mitDunst && React.createElement('div', {
        key: 'dunst', 'aria-hidden': 'true', 'data-dunst': dunstHoehe,
        style: {
          position: 'absolute', left: 0, right: 0, top: 0, height: dunstHoehe + 'px', pointerEvents: 'none',
          background: `linear-gradient(to bottom, ${DUNST.farbe}${DUNST.oben} 0%, ${DUNST.farbe}${DUNST.mitte} ${DUNST.mitteBei}%, ${DUNST.farbe}00 100%)`,
        },
      }), React.createElement(PageTitle, {
        key: 'titel',
        palette: p,
        'data-testid': 'berg-titel',
        style: {
          position: 'absolute', top: oben + 'px', left: schmal ? '26px' : Math.max(44, spalte) + 'px',
          // Mit Ecke (Startbildschirm-Karte) hält der Titel rechts Abstand, wo die Spalte schmal ist.
          right: schmal ? '26px' : Math.max(44, spalte, ecke ? 208 : 0), textAlign: 'left',
          fontFamily: fontFamilyDisplay, fontWeight: 700, fontSize: groesse + 'px', lineHeight: 1.03, letterSpacing: '-0.025em',
          color: p.text,
        },
      }, teile
        ? [React.createElement('span', { key: 'a', style: { display: 'block' } }, teile[1]),
           React.createElement('span', { key: 'b', 'data-testid': 'berg-titel-antwort', style: { display: 'block', color: TITEL_GRUEN } }, teile[2])]
        : titel)];
    })(),
    // Die Ecke rechts oben (seit 25.09.2026): der Weg auf den Startbildschirm als kleine Karte.
    // Am Computer neben dem Titel, am Handy — wo der Titel die ganze Breite nimmt — darunter.
    // Karte 168 px breit (Handy 140), der Titel hält daneben 208 px frei. `ecke(schmal)`: die Karte
    // zeigt sich im Handy-Ausschnitt kleiner.
    ecke && React.createElement('div', {
      key: 'ecke',
      style: { position: 'absolute', lineHeight: 'normal', top: schmal ? 20 + (titelHoehe || 90) : 16, right: schmal ? 12 : 24, width: schmal ? 140 : 168 },
    }, ecke(schmal)),
    // Fortschritt im Bild, unten (seit 25.09.2026): «begonnen» n/7, ab dem ersten fertigen Kapitel
    // springt «abgeschlossen» auf (100 %); sind alle fertig, geht «begonnen» weg; rechts die
    // Prozentzahl.
    // Gestaltung (Entscheid 25.09.2026): am Handy runde Scheiben mit Etikett darüber (Sprache der
    // Stationen, «R1»), am Computer runde Pillen, Kreis links, Zahl + Wort rechts («R3»). Farben
    // aus dem Modus (hell/dunkel wie die App) — Grund, Schrift und Ring passen sich an. Immer
    // undurchsichtig, damit der Kontrast nicht am Bild hängt (K41).
    fortschritt && (() => {
      const { begonnen, abgeschlossen, gesamt } = fortschritt;
      const L = fortschrittLabels || {};
      // Breit, aber flach (Handy quer): dann liegt Wohnen so nah am unteren Rand, dass «begonnen»
      // darauf läge — nur dann stehen alle Angaben zusammen unten rechts. Gemessen: Platz unter
      // Wohnen ≥ ~118 px (Tablet, Desktop) reicht links, ≤ ~93 px (568–844 px quer) nicht.
      const wohnen = STATIONEN.find((st) => st.key === 'wohnen');
      const platzUnterWohnen = breite > 0 ? (a.y + a.h - wohnen.y) * (breite / a.w) : Infinity;
      const alleRechts = !schmal && platzUnterWohnen < 105;
      const schatten = '0 1px 5px rgba(0,0,0,0.22)';
      const pilleStil = {
        display: 'flex', alignItems: 'center', gap: '8px', background: ui.surface, borderRadius: '999px',
        padding: '4px 14px 4px 4px', boxShadow: schatten, lineHeight: 1.1,
      };
      // Pille: die Zahl steht im Kreis (Rückmeldung 25.09.2026), das Wort daneben.
      const pille = (key, testid, anteil, wert, wort, ref) => React.createElement('div', { key, ref, 'data-testid': testid, style: pilleStil },
        React.createElement(Kreis, { ui, anteil, mitte: wert, d: 42 }),
        wort && React.createElement('span', { style: { fontSize: '12px', fontWeight: weight.medium, color: ui.mid } }, wort));
      const scheibe = (key, testid, anteil, wert, wort, ref) => React.createElement('div', {
        key, ref, 'data-testid': testid, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
      },
        wort && React.createElement('span', {
          style: { fontSize: '10px', lineHeight: 1.15, color: ETIKETT_SCHRIFT, background: etikettGrund(ui.sageDeep), padding: '2px 6px', borderRadius: radius.sm, whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' },
        }, wort),
        React.createElement('div', { style: { borderRadius: '50%', boxShadow: schatten } },
          React.createElement(Kreis, { ui, anteil, mitte: wert, d: 38 })));
      // Handy quer (alleRechts): die schmaleren Scheiben — Pillen stiessen dort an Finanzen (667×375 gemessen).
      const kompakt = schmal || alleRechts;
      const angabe = kompakt ? scheibe : pille;
      const zusammenfassung = [
        begonnen > 0 && abgeschlossen < gesamt && `${begonnen}/${gesamt} ${L.begonnen || ''}`,
        abgeschlossen > 0 && `${abgeschlossen}/${gesamt} ${L.abgeschlossen || ''}`,
        prozent != null && `${prozent}% ${L.ausgefuellt || ''}`,
      ].filter(Boolean).join(' · ');
      // Ab dem ersten begonnenen Kapitel immer da, auch bei 1 % (25.09.2026). Vorher, bei
      // «Ihr Weg beginnt hier», bleibt es beim ruhigen Satz — kein «0 %».
      const prozentAngabe = prozent != null && begonnen > 0 && angabe('prozent', 'berg-prozent', prozent / 100, `${prozent}%`, kompakt ? null : L.ausgefuellt);
      return React.createElement('div', {
        key: 'fortschritt', 'data-testid': 'berg-fortschritt',
        role: begonnen > 0 ? 'img' : undefined,
        'aria-label': begonnen > 0 ? zusammenfassung : undefined,
        style: {
          // An den Bildrändern, mit Luft nach unten (Rückmeldung Stebler Studios, 25.09.2026:
          // vorher bündig mit der Inhaltsspalte und nur 14 px über dem Bildrand).
          position: 'absolute', left: schmal ? '12px' : '24px', right: schmal ? '12px' : '24px', bottom: schmal ? '16px' : '28px',
          display: 'flex', justifyContent: alleRechts ? 'flex-end' : 'space-between', alignItems: 'flex-end',
          gap: '8px', pointerEvents: 'none', lineHeight: 1.2,
        },
      },
        React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'flex-end' } },
          begonnen === 0 && React.createElement('div', {
            style: { ...pilleStil, padding: schmal ? '4px 10px' : '6px 14px' },
          }, React.createElement('span', { style: { fontSize: schmal ? '11px' : text.xs, color: ui.mid } }, L.leer)),
          begonnen > 0 && abgeschlossen < gesamt && angabe('begonnen', 'berg-begonnen', begonnen / gesamt, `${begonnen}/${gesamt}`, L.begonnen),
          abgeschlossen > 0 && angabe('abgeschlossen', 'berg-abgeschlossen', abgeschlossen / gesamt, `${abgeschlossen}/${gesamt}`, L.abgeschlossen, abgeschlossenKachel),
          alleRechts && prozentAngabe,
        ),
        // Die Prozentzahl rechts, auch am Handy (Rückmeldung 25.09.2026; seit der Handy-Ausschnitt
        // bis zum Bildrand reicht, ist unten rechts unter Finanzen Platz — gemessen).
        !alleRechts && prozentAngabe,
      );
    })(),
    // Kapitel-Stationen auf der Strasse
    STATIONEN.map((station, i) => {
      const pct = chapterCompletions[i] || 0;
      const IconFn = Icons[station.key];
      const farbe = kapitelFarbe[station.key] || p.sage;
      // Zeichen und Ring folgen dem Modus (Scheibe ui.surface); Kapitelfarbe bis ≥ 3:1 darauf.
      const zeichen = mitKontrastZu(farbe, ui.surface, 3);
      // Reifestufen wie bisher: Skizze → im Werden → reift → vollständig, getragen von Grösse.
      // Seit 25.09.2026 zeigt der Rand den Stand genau: ein Ring, dessen Bogen in der
      // (abgedunkelten) Kapitelfarbe so weit läuft, wie das Kapitel ausgefüllt ist; die Spur
      // darunter grau — bei 0 % gestrichelt, damit «noch nicht begonnen» an der Form erkennbar
      // bleibt, nicht nur an der Farbe. Nie Deckkraft; die Fläche ist immer undurchsichtig (K41).
      const maturity = pct === 0 ? 'sketch' : pct < 50 ? 'emerging' : pct < 100 ? 'maturing' : 'complete';
      // Handy: 26 px (WCAG 2.5.8 verlangt 24) — mehr passt zwischen die Kehren nicht, ohne dass Etiketten kollidieren.
      const sz = schmal ? 26 : { sketch: 30, emerging: 32, maturing: 34, complete: 36 }[maturity];
      const iconSz = schmal ? 15 : { sketch: 17, emerging: 18, maturing: 20, complete: 21 }[maturity];
      const ringBreite = schmal ? 2.5 : 3;
      const ringR = sz / 2 - ringBreite / 2;
      const ringU = 2 * Math.PI * ringR;
      const chapterTitle = chapters[i] ? chapters[i].title : station.key;
      const shortLabel = (chapters[i] && chapters[i].short) || chapterTitle.split(/[\s–—]/)[0];
      const abstand = sz / 2 + 4 + 'px';
      const etikettOrt = {
        rechts: { left: abstand, top: '50%', transform: 'translateY(-50%)' },
        links: { right: abstand, top: '50%', transform: 'translateY(-50%)' },
        unten: { top: sz / 2 + 3 + 'px', left: '50%', transform: 'translateX(-50%)' },
        oben: { bottom: sz / 2 + 3 + 'px', left: '50%', transform: 'translateX(-50%)' },
        // über/unter der Station, nach rechts laufend: wo links der Bildrand oder eine
        // Nachbarstation keinen Platz lässt
        obenrechts: { bottom: sz / 2 + 3 + 'px', left: -(sz / 2 + 4) + 'px' },
        untenrechts: { top: sz / 2 + 3 + 'px', left: -(sz / 2 + 4) + 'px' },
        obenlinks: { bottom: sz / 2 + 3 + 'px', right: -(sz / 2 + 4) + 'px' },
      }[(station.seite.eng && breite > 0 && breite / a.w < ENG_UNTER[modus]) ? station.seite.eng[modus] : station.seite[modus]];
      return React.createElement('div', {
        key: station.key,
        style: { position: 'absolute', ...imRahmen(station.x, station.y), width: 0, height: 0 },
      },
        React.createElement('button', {
          type: 'button',
          onClick: () => onSelectChapter(i),
          'aria-label': `${chapterTitle}, ${Math.round(pct)} %`,
          style: {
            position: 'absolute', left: -sz / 2 + 'px', top: -sz / 2 + 'px',
            width: sz + 'px', height: sz + 'px', padding: 0,
            borderRadius: '50%', background: ui.surface, border: 'none', color: zeichen,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: maturity === 'complete' ? `0 0 0 3px ${ui.surface}, 0 1px 5px rgba(0,0,0,0.25)` : '0 1px 4px rgba(0,0,0,0.2)',
            transition: `transform ${duration.cinematic}ms ${ease}`,
          },
          onMouseEnter: (e) => { e.currentTarget.style.transform = 'scale(1.08)'; },
          onMouseLeave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
        },
          // Der Fortschrittsring: graue Spur, darauf der Bogen im Verhältnis des Kapitel-Stands.
          React.createElement('svg', {
            'data-ring': station.key, width: sz, height: sz, viewBox: `0 0 ${sz} ${sz}`, 'aria-hidden': 'true',
            style: { position: 'absolute', inset: 0, overflow: 'visible' },
          },
            React.createElement('circle', {
              cx: sz / 2, cy: sz / 2, r: ringR, fill: 'none', stroke: ui.border, strokeWidth: ringBreite,
              strokeDasharray: pct === 0 ? '3 3' : undefined,
            }),
            pct > 0 && React.createElement('circle', {
              cx: sz / 2, cy: sz / 2, r: ringR, fill: 'none', stroke: zeichen, strokeWidth: ringBreite,
              strokeLinecap: pct >= 100 ? 'butt' : 'round',
              strokeDasharray: `${(ringU * Math.min(100, pct)) / 100} ${ringU}`,
              transform: `rotate(-90 ${sz / 2} ${sz / 2})`,
              style: { transition: 'stroke-dasharray 900ms ease' },
            }),
          ),
          React.createElement('div', { style: { width: iconSz + 'px', height: iconSz + 'px', position: 'relative' } }, IconFn ? IconFn() : null)
        ),
        React.createElement('span', {
          className: 'mountain-label',
          lang,
          'aria-hidden': 'true',
          style: {
            position: 'absolute', ...etikettOrt, whiteSpace: 'nowrap', pointerEvents: 'none',
            display: 'flex', alignItems: 'center',
            fontSize: schmal ? '11px' : text.xs, lineHeight: 1.15, color: ETIKETT_SCHRIFT,
            background: etikettGrund(farbe), padding: schmal ? '1px 6px' : '2px 7px', borderRadius: radius.sm,
            fontStyle: maturity === 'sketch' ? 'italic' : 'normal',
            fontWeight: maturity === 'complete' ? weight.medium : weight.normal,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            ...hyphenStyle,
          },
        },
          // Seit 25.09.2026 trägt das Etikett selbst die Kapitelfarbe (weisse Schrift) — der
          // Farbpunkt davor ist damit überflüssig. Das Wort trägt, die Farbe ergänzt.
          shortLabel)
      );
    })
  ));
};

export default BergLandschaft;
