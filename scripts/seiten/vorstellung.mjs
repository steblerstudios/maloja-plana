// ─── Vorstellungsseite malojaplana.ch/ ──────────────────────────────────────
// Website vorne, App dahinter (Entscheid 26.10.2026, Plan «App nach /app/», PR 3).
// Gebaut von scripts/build-seiten.mjs nach website/index.html; scripts/build-web.mjs legt
// sie als dist/index.html auf die Wurzel.
//
// Herkunft: Entwurf Fassung 3 vom 26.10.2026 (maloja plana/_werkbank/vorstellungsseite/,
// KONZEPT.md mit Copy-, Rechts- und a11y-Prüfung). Geändert beim Einbau 09.11.2026:
//   · Kapitel wie in der App seit 06.11.: «Gesundheit» statt «Notfall», «Ausbildung & Arbeit»;
//     Farben aus src/data/lebensbereiche.js (Finanzen stand im Entwurf in der Farbe von Arbeit).
//   · Bilder neu aus dem Beispiel aufgenommen (public/vorstellung/, WebP).
//   · OHNE den Teil Sozialberatung: Rechtstexte, Name, Qualifikation, Telefon und Anschrift
//     sind offen (KONZEPT.md «Vor dem Live-Gang»). Er liegt im Entwurf und kommt mit eigenem PR.
//   · Ein Skript: /weiterleitung.js schickt alte App-Links (/#/…, ?lang=, ?beispiel) und die
//     installierte App nach /app/. Darum hier script-src 'self' (die Erklärseiten haben keins).
// Nur Deutsch. Weitere Sprachen erst als eigene Seiten (Rechtsprüfung 26.10., UWG Art. 3 Abs. 1 lit. b).

import { BASIS } from '../seiten-inhalt.mjs';
import { BRILLEN, KARTE_MASS } from './kantonsatlas.mjs';

// Kantonsatlas als Brückenstück (Stebler Studios 09.11.2026, «Ja, A bis C bauen», Teil B): Die Website zeigt
// den Atlas als eigenen Abschnitt; jede Brille führt gefiltert hinein (/kantonsatlas/#fuer-<id>, Teil A).
// Brillen aus kantonsatlas.mjs, damit Name und Frage hier und dort dieselben sind.
const ATLAS_KARTEN = new Set(BRILLEN.flatMap((b) => b.karten)).size;
// Zahlen im Fliesstext ausgeschrieben wie «sieben Kapitel» (Copy-Prüfung 09.11.2026). Ändert sich die Zahl, hier ergänzen.
const ATLAS_KARTEN_WORT = { 10: 'zehn' }[ATLAS_KARTEN];
if (!ATLAS_KARTEN_WORT) throw new Error(`vorstellung.mjs: ${ATLAS_KARTEN} Atlas-Karten, Wort fehlt`);

// Warteliste (Entscheid Stebler Studios 09.11.2026, Plan «Sichtbarkeit», Weg 1): nur ein Mail-Entwurf.
// Kein Formular, kein Dienst, nichts wird automatisch gesendet — die Person schickt die Mail selbst.
// Höchstens zwei Nachrichten (Beta endet · App Store), dann wird die Adresse gelöscht (Datenschutz,
// Abschnitt «Kontakt per E-Mail»). Kein Newsletter über diese Liste.
const WARTELISTE_BETREFF = 'Maloja Plana: Warteliste';
const WARTELISTE_TEXT = 'Bitte nehmen Sie mich auf die Warteliste.\n\n'
  + 'Sie schreiben mir höchstens zweimal: wenn die Beta endet und, falls es dazu kommt, wenn es Maloja Plana im App Store gibt. '
  + 'Danach, spätestens Ende 2027, wird meine Adresse gelöscht. Abmelden geht jederzeit mit einer Antwort «abmelden».';
export const WARTELISTE = 'mailto:info@malojaplana.ch?subject=' + encodeURIComponent(WARTELISTE_BETREFF)
  + '&amp;body=' + encodeURIComponent(WARTELISTE_TEXT);

import { KAPITEL_ZEICHEN } from './kapitel-zeichen.mjs';

// Ein Kapitel-Zeichen der App, mehrfach auf derselben Seite: Masken-Ids je Ort eindeutig machen,
// dazu Lage und Grösse für das Einsetzen in ein anderes SVG (Stocknagel).
const zeichen = (i, ort, attr = '') => KAPITEL_ZEICHEN[i]
  .replace(/(id="|url\(#)([a-zA-Z]+\d+)/g, `$1${ort}-$2`)
  .replace('<svg ', `<svg ${attr}`);

export const VORSTELLUNG = {
  titel: 'Maloja Plana — Schweizer Lebensordner',
  beschreibung: 'Steuern, Prämienverbilligung, Vorsorge und Notfallkarte an einem Ort. Kostenlos, ohne Konto — was Sie eingeben, bleibt auf Ihrem Gerät.',
};

// Die sieben Kapitel der App, in ihrer Reihenfolge (CHAPTER_KEYS in src/config/constants.js;
// Namen aus src/i18n/de.js chapters.*.short bzw. .title).
// farbe/dunkel aus src/data/lebensbereiche.js (light bzw. lightDeep, dark).
export const KAPITEL = [
  { name: 'Basis', farbe: '#5A7868', dunkel: '#7E9F8C', titel: 'Was überall gebraucht wird', text: 'Ihre Angaben einmal erfasst — und dort zur Hand, wo sie wieder gefragt sind.' },
  { name: 'Wohnen', farbe: '#6C8343', dunkel: '#9DBA6A', titel: 'Miete, Umzug, Adresse', text: 'Was zum Wohnen gehört, an einem Ort — auch wenn sich etwas ändert.' },
  { name: 'Finanzen', farbe: '#C4A870', dunkel: '#D2B77E', titel: 'Einkommen und Steuern', text: 'Eine grobe Steuer-Einschätzung und Richtwerte fürs Budget — als Orientierung, nicht als Kontrolle.' },
  { name: 'Versicherungen', farbe: '#6787A5', dunkel: '#86A6C2', titel: 'Krankenkasse und Vorsorge', text: 'Franchise, Prämienverbilligung, AHV und Pensionskasse — ohne Fachsprache erklärt.' },
  { name: 'Ausbildung', farbe: '#8A6D4B', dunkel: '#A98A64', titel: 'Ausbildung und Arbeit', text: 'Abschlüsse, Lebenslauf und Arbeitsstelle geordnet — für die nächste Bewerbung.' },
  { name: 'Behörden', farbe: '#5A6472', dunkel: '#7C8798', titel: 'Briefe und Fristen', text: 'Schreiben an Ämter vorbereiten und Fristen im Blick behalten.' },
  { name: 'Gesundheit', farbe: '#C67A4A', dunkel: '#D98F5C', titel: 'Gesundheit und Ernstfall', text: 'Notfallkarte, Kontaktperson und Verfügungen — und eine Karte mit dem, was Sie bei einem Notruf sagen, zum Vorlesen.' },
];

const SITUATIONEN = [
  ['Wenn das Geld knapp ist', 'Unterstützung wird oft nicht bezogen, weil man nicht weiss, dass es sie gibt. Maloja zeigt, was in Ihrem Kanton infrage kommen kann — von der Prämienverbilligung bis zur Sozialhilfe — und bei welcher Stelle Sie fragen können.'],
  ['Kinder allein grossziehen', 'Neben dem Alltag bleibt wenig Zeit für Formulare. Maloja ordnet, was für Sie und Ihre Kinder infrage kommen kann, und hält Fristen an einem Ort.'],
  ['Mit Beeinträchtigung oder chronischer Krankheit', 'Versicherungen, Leistungen und Unterlagen werden schnell viel. Maloja hält sie zusammen und erklärt die Zusammenhänge in verständlicher Sprache.'],
  ['Angehörige pflegen', 'Wer Angehörige pflegt, organisiert vieles für zwei. Maloja hilft, Angaben, Kontakte und Vorsorge für den Ernstfall bereitzuhalten.'],
  ['Neu in der Schweiz', 'Krankenkasse, AHV, Aufenthaltsbewilligung — vieles ist hier anders geregelt. Maloja erklärt die Schweizer Begriffe und zeigt die nächsten Schritte.'],
  ['In Ausbildung', 'Krankenkasse, Prämienverbilligung, die erste Steuererklärung: Maloja zeigt, was in der Ausbildung wichtig wird.'],
];

// Alle Knöpfe «Beispiel» führen direkt ins Beispiel (BetaGate liest ?beispiel, PR 1).
export const BEISPIEL = '/app/?beispiel';
const BILD = (n) => `/vorstellung/app-${n}.webp`;

const CSP = "default-src 'none'; script-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'none'; form-action 'none'";

// Bildmarke einfarbig: auf heller Fläche Anthrazit (Brand Book §4, «Farbe nach Fläche»); Farbe über .marke.
const MARKE = '<svg viewBox="0 0 500 540" aria-hidden="true"><path d="M 0 190 C 0 169 7 152 22 138 L 89 78 C 102 66 119 65 131 78 C 177 122 206 136 270 153 C 299 163 321 172 302 193 C 284 208 228 224 182 242 C 128 264 92 294 92 330 L 92 467 C 92 529 0 529 0 468 Z" fill="currentColor"/><path d="M 176 92 L 265 7 C 278 -4 294 -3 307 10 L 392 110 C 405 101 421 96 434 110 L 479 154 C 493 168 500 186 500 205 L 500 280 C 455 234 433 196 379 175 C 335 157 282 143 240 127 C 216 118 194 105 176 92 Z" fill="currentColor"/><path d="M 200 331 C 200 286 269 248 322 242 C 410 230 500 278 500 349 C 500 414 431 467 328 467 L 328 375 C 328 345 275 312 275 351 L 275 529 C 275 562 200 563 200 517 Z" fill="currentColor"/></svg>';

// Die Reise · E: Bildwechsel wie ein Pinselstrich, der quer übers Bild wischt (Maske mit ausgefranster Kante, eigene
// Form, nicht von Fuji). Die Maske ist dreimal so breit wie das Bild und wandert von rechts nach links; als data:-SVG,
// das erlaubt die CSP (img-src data:).
const PINSEL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0 0H150C146 6 157 11 149 19C142 27 156 33 150 43C145 52 158 58 151 68C145 78 156 86 150 100H0Z"/><circle cx="159" cy="15" r="2.4"/><circle cx="166" cy="38" r="1.6"/><circle cx="161" cy="61" r="2.8"/><circle cx="170" cy="80" r="1.4"/><circle cx="157" cy="92" r="1.8"/></svg>';
// Bilder 2–7 lädt das Skript erst kurz vor ihrer Kehre (die Bühne klebt, darum griffe loading="lazy" für alle zugleich).
// Ohne Skript ist nur Bild 1 zu sehen, die übrigen werden dann gar nicht geladen.
const LEER = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const PINSEL = `url("data:image/svg+xml,${encodeURIComponent(PINSEL_SVG)}")`;

// O · Die drei Geräte auf dem Blick (Papier): Punkte auf der Passstrasse in pass-blick-papier.svg
// (viewBox 0 -240 1600 1000), umgerechnet in Prozent der Bildfläche. Von links nach rechts gelesen.
const GERAETE = [
  { name: 'iPhone und iPad', zeichen: 'telefon', x: '37.4%', y: '69.5%' },   // Strassenpunkt (599 | 455)
  { name: 'Android', zeichen: 'telefon', x: '54.4%', y: '81.6%' },           // (870 | 576)
  { name: 'Computer', zeichen: 'laptop', x: '79.9%', y: '57.2%' },           // (1278 | 332)
];
const GERAET_ZEICHEN = {
  telefon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M10.5 18.5h3"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4.5" y="5" width="15" height="10.5" rx="1.4"/><path d="M2.5 18.5h19"/></svg>',
};

const STIL = `
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-400-normal.woff2') format('woff2'); font-weight:400; font-display:swap }
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-600-normal.woff2') format('woff2'); font-weight:600; font-display:swap }
    @font-face{ font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-600-normal.woff2') format('woff2'); font-weight:600; font-display:swap }
    @font-face{ font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-700-normal.woff2') format('woff2'); font-weight:700; font-display:swap }
    *{ margin:0; padding:0; box-sizing:border-box }
    :root{
      /* A · Eine Seitenfarbe (Design-Durchgang 10.11.2026): die Creme des Passbilds, «unser Stil». Vorher vier Töne
         (#F2F2F0 Seite, #FCF0E4 Ausklang, #F4F0E6 Hero-Schleier, #FBFBFA Leiste) — man sah die Naht nach der Reise.
         Flächen darauf (Karten, Leiste, Knöpfe) ein warmes Papier #FFF8F0. Kontraste gemessen: Text 13,5:1, leise 6,1:1,
         Gold 5,3:1. Die App bleibt Granit. */
      --bg:#FCF0E4; --flaeche:#FFF8F0; --text:#24262A; --leise:#575B61;
      --rand:#E6DACB;
      --himmel:#FCF0E4;                 /* Himmel der Landschaft = Seitenfarbe — der Einstieg bleibt immer hell */
      --schleier:252,240,228;           /* dieselbe Creme als RGB für die hellen Schichten über dem Bild */
      --gehaeuse:#1B1A18; --gehaeuse-rand:#3A3936; --insel:#0E0E0D; --schirm:#22211F;
      --radius-m:12px;
      --abstand-m:32px; --abstand-l:96px;  /* 96 = 64 × 1.5, Kapitelstufe der Startseite (§7a B) */
${KAPITEL.map((k, i) => `      --k${i}:${k.farbe};`).join('\n')}
      --pinsel:${PINSEL};
      --sand:#C4A06A; --auf-sand:#2A2620; --sand-tief:#7A5F30; --radius-knopf:10px;
    }
    @media (prefers-color-scheme: dark){
      :root{ --bg:#22211F; --flaeche:#2A2927; --text:#E8E6E1; --leise:#A8A5A0;
             --rand:#3A3936;
             --gehaeuse:#33322F; --gehaeuse-rand:#4A4945; --sand-tief:#C4A06A;
${KAPITEL.map((k, i) => `             --k${i}:${k.dunkel};`).join('\n')} }
      html{ color-scheme:dark }
    }
    html{ scroll-behavior:smooth }
    @media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto } }
    body{ background:var(--bg); color:var(--text); line-height:1.65;
      font-family:'Lexend',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; font-kerning:normal }
    .rahmen{ max-width:1040px; margin:0 auto; padding:0 24px }
    /* Links: Gold (sandDeep), immer unterstrichen, beim Überfahren dicker, die Farbe bleibt (Brand Book §2). */
    a{ color:var(--sand-tief); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:2px }
    a:hover{ text-decoration-thickness:2px }
    :focus-visible{ outline:2px solid var(--sand-tief); outline-offset:3px }
    .unsichtbar{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap }
    /* Schrift nach Brand Book §3: Titel in Hanken Grotesk (600/700), alles andere Lexend; Grössen aus der Skala
       13 · 15 · 16 · 19 · 23 · 28 · 36 (tokens.js). Einzige grössere Stufe: der h1 im Hero mit 48. */
    h1, h2, h3{ font-family:'Hanken Grotesk','Lexend',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif }
    .augenbraue{ font-size:15px; font-weight:600; color:var(--leise); margin-bottom:8px }
    h2{ font-size:36px; line-height:1.2; font-weight:700; letter-spacing:-0.015em; margin-bottom:14px }
    h3{ font-size:19px; font-weight:600; margin-bottom:4px; line-height:1.35 }
    p{ margin-bottom:12px } p:last-child{ margin-bottom:0 }
    .unterzeile{ color:var(--leise); font-size:19px; max-width:34em }
    section{ padding:var(--abstand-l) 0 0 }

    /* Knöpfe (Brand Book «Knöpfe», Fassung 9): Hauptknopf gefüllt Sand, nur EINER je Seite (im Hero);
       Nebenknopf leer mit Rand und Schrift sandDeep; Ecke 10 px, keine Pillen; mind. 44 px hoch. */
    .knopf{ display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:44px; padding:12px 24px;
      border-radius:var(--radius-knopf); font-weight:600; font-size:15px; text-decoration:none; border:1px solid transparent; line-height:1.3 }
    .knopf.haupt{ background:var(--sand); color:var(--auf-sand) }
    .knopf.haupt:hover{ color:var(--auf-sand); filter:brightness(1.05) }
    .knopf.zweit{ border-color:var(--sand-tief); color:var(--sand-tief); background:transparent }
    .knopf.zweit:hover{ background:color-mix(in srgb, var(--sand) 14%, transparent) }
    .wege{ display:flex; flex-wrap:wrap; gap:12px; margin-top:var(--abstand-m) }

    /* ─── Kopf und Hero: liegen auf dem Passbild, das zugleich die erste Bühne der Reise ist (A/B, 10.11.2026) ─── */
    .kopf-leiste{ position:absolute; z-index:7; top:0; left:0; right:0 }
    .kopf{ padding-top:20px; padding-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:16px }
    .marke{ display:flex; align-items:center; gap:10px; padding-block:9px; font-weight:600; font-size:16px; text-decoration:none; color:#22211F }
    .marke:hover{ color:#22211F }
    .marke svg{ height:28px; width:auto }
    .kopf nav{ display:flex; gap:22px; font-size:15px }
    .kopf nav a{ text-decoration:none; padding-block:10px; color:#24262A; display:inline-flex; align-items:center; min-height:44px }
    .kopf nav a:hover{ text-decoration:underline }
    .reise-anfang{ position:relative; z-index:5 }
    .pass{ min-height:100vh; min-height:100svh; display:grid; grid-template-columns:1fr 1.05fr; gap:40px; align-items:center;
      padding-top:96px; padding-bottom:6vh; color:#24262A; --text:#24262A; --leise:#4E5258; --sand-tief:#7A5F30 }
    .pass h1{ font-size:48px; line-height:1.1; font-weight:700; letter-spacing:-0.025em }
    .pass h1 span{ display:block }
    @media (min-width:961px){ .pass h1 span{ white-space:nowrap } }
    .pass h1 .zweite{ font-weight:600; color:#4E5258 }
    .pass .vorspann{ font-size:19px; max-width:28em; margin-top:22px; color:#3E4247 }
    .pass .fakten{ display:flex; flex-wrap:wrap; gap:6px 18px; margin-top:20px; font-size:15px; color:#24262A }
    /* J · Der Trennpunkt hängt am vorderen Wort: bricht die Zeile um, beginnt die neue nie mit «·». */
    .pass .fakten span{ white-space:nowrap }
    .pass .fakten span:not(:last-child)::after{ content:"·" / ""; margin-left:18px; color:var(--sand-tief) }
    .pass .beta{ font-size:15px; color:#3E4247; margin-top:10px }
    .pass .knopf.zweit{ background:#FFF8F0 }   /* der Hero bleibt immer hell, auch im dunklen Modus */
    /* Übergang zur Reise: Nebenknopf (leer, Rand sandDeep) auf heller Fläche, damit er auch über dem Bild lesbar bleibt. */
    .pass-weiter{ grid-column:1 / -1; justify-self:start }
    .pass-weiter::after{ content:"↓" / "" }

    /* C · Laptop und Telefon (10.11.2026): das Telefon steht vorn rechts vor dem Laptop. Bild am Computer aus dem
       Beispiel (public/vorstellung/app-computer.webp), das Telefon zeigt weiter die Bildfolge. */
    .geraete{ position:relative; width:100%; max-width:560px; justify-self:end; align-items:flex-start; padding:0 }
    .geraete-bild{ position:relative; width:100%; padding-bottom:4% }
    .laptop{ position:relative; width:88%; margin-bottom:6px }
    .laptop .deckel{ background:#1B1A18; border-radius:14px 14px 4px 4px; padding:10px 10px 12px;
      box-shadow:0 0 0 1px #3A3936, 0 28px 44px -26px rgba(30,28,24,.55) }
    .laptop .schirm{ aspect-ratio:16/10; overflow:hidden; border-radius:4px; background:#22211F }
    .laptop .schirm img{ width:100%; height:100%; object-fit:cover; object-position:top; display:block }
    .laptop .sockel{ position:relative; height:14px; margin:0 -6%; border-radius:2px 2px 14px 14px;
      background:linear-gradient(#DCD8D0, #B6B1A7); box-shadow:0 10px 18px -12px rgba(30,28,24,.6) }
    .laptop .sockel::before{ content:""; position:absolute; left:50%; top:0; width:18%; height:5px; margin-left:-9%; border-radius:0 0 6px 6px; background:#A8A39A }
    .geraete .telefon{ position:absolute; right:0; bottom:0; width:clamp(110px, 13vw, 150px); padding:6px; border-radius:24px }
    .geraete .bildschirm{ border-radius:19px; --statusleiste:16px }
    .geraete .insel{ top:10px; width:40px; height:11px; border-radius:8px }
    .geraete .unter-telefon{ margin-top:14px }
    /* Telefon mit Bildfolge */
    .buehne{ display:flex; flex-direction:column; align-items:center; margin:0; padding-top:8px }
    .telefon{ position:relative; width:280px; aspect-ratio:480/1040; padding:11px;
      background:var(--gehaeuse); border-radius:46px;
      box-shadow:0 0 0 1px var(--gehaeuse-rand), 0 24px 40px -24px rgba(30,28,24,.5) }
    .pass .telefon{ --gehaeuse:#1B1A18; --gehaeuse-rand:#3A3936 }
    .insel{ position:absolute; z-index:3; top:20px; left:50%; transform:translateX(-50%);
      width:84px; height:24px; border-radius:14px; background:var(--insel) }
    .bildschirm{ position:relative; width:100%; height:100%; border-radius:36px; overflow:hidden;
      background:var(--schirm); --statusleiste:38px }
    .bildschirm img{ position:absolute; top:var(--statusleiste); left:0; width:100%;
      height:calc(100% - var(--statusleiste)); object-fit:cover; object-position:top; display:block }
    .folge img{ opacity:0; animation:wechsel 30s infinite }
    .folge img:nth-child(1){ animation-delay:-1.5s }
    .folge img:nth-child(2){ animation-delay:4.5s }
    .folge img:nth-child(3){ animation-delay:10.5s }
    .folge img:nth-child(4){ animation-delay:16.5s }
    .folge img:nth-child(5){ animation-delay:22.5s }
    @keyframes wechsel{ 0%{opacity:0} 6%{opacity:1} 20%{opacity:1} 26%{opacity:0} 100%{opacity:0} }
    #anhalten:checked ~ .geraete-bild .folge img, .buehne:hover .folge img{ animation-play-state:paused }
    .unter-telefon{ display:flex; flex-wrap:wrap; justify-content:center; gap:4px 14px; margin-top:14px;
      font-size:13px; color:#3E4247; text-align:center; background:rgba(var(--schleier),.82); padding:4px 12px; border-radius:20px }
    .schalter{ cursor:pointer; text-decoration:underline; text-underline-offset:2px; padding:10px 2px; margin:-10px 0 }
    #anhalten:checked ~ .unter-telefon .schalter::before{ content:"✓ " / "" }
    #anhalten:focus-visible ~ .unter-telefon .schalter{ outline:2px solid var(--sand-tief); outline-offset:3px }

    /* ─── Lebenssituationen (Radio-Reiter, ohne Skript) ───────────── */
    .lagen .chips{ display:flex; flex-wrap:wrap; gap:10px; margin-top:var(--abstand-m) }
    .lagen fieldset{ border:0; min-width:0; padding:0; margin:0 }
    .lagen .chips label{ cursor:pointer; padding:11px 18px; border:1px solid var(--leise); border-radius:var(--radius-knopf);
      background:var(--flaeche); font-size:15px; color:var(--text); transition:background .2s, border-color .2s }
    .lagen .chips label:hover{ border-color:var(--sand-tief) }
    .tafel{ display:none; margin-top:28px; padding:36px 40px; background:var(--flaeche); border:1px solid var(--rand);
      border-radius:var(--radius-m); max-width:760px }
    .tafel p.gross{ font-size:23px; line-height:1.45; margin-bottom:18px; color:var(--text) }
    .tafel a{ font-weight:600 }
${SITUATIONEN.map((_, i) => `    #l${i + 1}:checked ~ .tafeln .t${i + 1}{ display:block }
    #l${i + 1}:checked ~ .chips [for=l${i + 1}]{ background:var(--sand); color:var(--auf-sand); border-color:var(--sand) }
    #l${i + 1}:checked ~ .chips [for=l${i + 1}]::before{ content:"✓ " / "" }
    #l${i + 1}:focus-visible ~ .chips [for=l${i + 1}]{ outline:2px solid var(--sand-tief); outline-offset:3px }`).join('\n')}

    /* ─── Die Reise: Kehre für Kehre auf den Malojapass (Brand Book §7e, Entwurf 10.11.2026) ───
       Richtung «Stationen sammeln» (Fuji-Prinzipien). Seit Entscheid A–F (10.11.): die Bühne beginnt schon im
       Hero — Bild 0 ist das Passbild unter Kopf und Hero, darüber eine helle Schicht; ab Kehre 1 wechselt das
       Bild per Pinselstrich, die helle Schicht weicht der dunklen, und Stock und Weg erscheinen.
       B Wanderstock in der Mitte mit Aufklebern, die Kamera kreist um ihn · C Text weiss auf dem Bild, Knöpfe
       «Beispiel» und «Weiter» · D grosses Kapitel-Zeichen, gepunkteter Weg mit Zeichen · E Pinselstrich quer übers Bild, Wolken.
       Ohne Skript: helle Hero-Fläche, dunkle Schicht für die Kehren, alle Nägel, Bild 0 bleibt stehen.
       Bei «weniger Bewegung»: dieselben Wechsel, aber ohne Bewegung. */
    .reise-bruecke{ position:relative; overflow-x:clip }
    .reise-buehne{ position:sticky; top:0; height:100vh; height:100svh; overflow:hidden; background:var(--himmel) }
    .reise-bild, .reise-bild > *{ position:absolute; inset:0 }
    /* Bild 0 = Passbild (Hero), dann je Kehre ein eigenes Bild (KI-gemalt, Bergell → Silsersee); .an = aktuell, .vorher = voriges. */
    .reise-bild img{ width:100%; height:100%; object-fit:cover; object-position:45% 60%; display:block;
      opacity:0; transform:scale(1.12) translateX(calc(var(--kamera, 0) * -6%)) translateY(calc((var(--k, 0.5) - 0.5) * 3%)) }
    .reise-bild .pass-bild{ object-position:50% 78%; transform:none }
    .reise-bild .an{ opacity:1 }
    .js .reise-bild .vorher{ opacity:1; z-index:1 }
    .js .reise-bild > *{ -webkit-mask-image:var(--pinsel); mask-image:var(--pinsel); -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
      -webkit-mask-size:300% 100%; mask-size:300% 100%; -webkit-mask-position:100% 0; mask-position:100% 0 }
    .js .reise-bild .an{ z-index:2; -webkit-mask-position:0 0; mask-position:0 0 }
    .js .reise-bild .vorher{ -webkit-mask-image:none; mask-image:none }
    .reise-wolken{ position:absolute; inset:0 -40% 45% -40%; pointer-events:none; opacity:.35;
      background:radial-gradient(38% 30% at 20% 40%, rgba(255,255,255,.55), transparent 70%),
                 radial-gradient(30% 24% at 62% 28%, rgba(255,255,255,.45), transparent 70%),
                 radial-gradient(26% 20% at 88% 55%, rgba(255,255,255,.4), transparent 70%) }
    /* Zwei Schichten für die Lesbarkeit: hell links/oben unter dem Hero (dunkle Schrift), dunkel rechts unter
       den Kehren (weisse Schrift, mind. 62 % unter dem Text). Das Skript schaltet über data-hier um. */
    .reise-buehne::before, .reise-buehne::after{ content:""; position:absolute; inset:0; z-index:3; pointer-events:none }
    .reise-buehne::before{ opacity:0;
      background:linear-gradient(180deg, rgba(var(--schleier),.92) 0%, rgba(var(--schleier),.4) 24%, rgba(var(--schleier),0) 42%),
                 linear-gradient(90deg, rgba(var(--schleier),.94) 0%, rgba(var(--schleier),.86) 44%, rgba(var(--schleier),0) 70%) }
    .reise-buehne::after{
      background:linear-gradient(270deg, rgba(18,18,16,.68) 0%, rgba(18,18,16,.62) 44%, rgba(18,18,16,0) 66%),
                 linear-gradient(90deg, rgba(18,18,16,.32) 0%, rgba(18,18,16,0) 22%);
      background:linear-gradient(270deg, color-mix(in srgb, var(--ton) 74%, transparent) 0%, color-mix(in srgb, var(--ton) 74%, transparent) 46%, color-mix(in srgb, var(--ton) 0%, transparent) 66%),
                 linear-gradient(90deg, rgba(18,18,16,.32) 0%, rgba(18,18,16,0) 22%) }
    /* P · Die dunkle Schicht trägt die Farbe der Kehre (Stebler Studios 10.11.2026): 30 % Kapitelfarbe im Dunkeln.
       Unter dem Text 74 % statt 62 %, damit der weisse Text auch über einem weissen Bildteil mindestens 4,5:1 hat
       (gerechnet für alle sieben Kapitel: mindestens 4,69:1, am knappsten Finanzen). Ohne color-mix gilt die Zeile davor.
       --ton ist registriert, darum gleitet die Farbe beim Wechsel mit (nur ohne «weniger Bewegung»). */
    @property --ton{ syntax:'<color>'; inherits:true; initial-value:#121210 }
${KAPITEL.map((_, i) => `    .reise-buehne[data-hier="${i}"]{ --ton:color-mix(in srgb, var(--k${i}) 30%, #121210) }`).join('\n')}
    .js .reise-buehne[data-hier="-1"]::before{ opacity:1 } .js .reise-buehne[data-hier="-1"]::after{ opacity:0 }
    html:not(.js) .reise-anfang{ background:rgba(var(--schleier),.93) }
    .reise-wolken{ z-index:3 } .reise-linie, .reise-stock, .reise-quelle{ z-index:4 }
    .reise-linie{ position:absolute; left:clamp(24px, 5vw, 64px); top:14vh; height:70vh; width:auto; aspect-ratio:60/600; overflow:visible }
    .reise-linie .weg{ fill:none; stroke:#FBFBFA; stroke-width:2.4; stroke-linecap:round; stroke-dasharray:.1 9; opacity:.85 }
    .reise-linie .gegangen{ fill:none; stroke:#FBFBFA; stroke-width:2.4; stroke-linecap:round; stroke-dasharray:100 100; stroke-dashoffset:100 }
    .reise-linie .halt circle{ fill:#FBFBFA; stroke:currentColor; stroke-width:2 }
    .reise-linie .halt.gegangen circle{ stroke-width:3 }
    .reise-linie .halt{ transform-box:fill-box; transform-origin:center }
    .reise-linie .ort{ display:none } .js .reise-linie .ort{ display:block }
    .reise-linie .ort circle{ fill:none; stroke:var(--sand); stroke-width:3 }
    .reise-linie .ort text{ fill:#FBFBFA; font-size:15px; font-weight:600; letter-spacing:.04em; paint-order:stroke; stroke:rgba(20,20,18,.7); stroke-width:4px; stroke-linejoin:round }
    /* D · Der Stock dreht sich um die eigene Achse: das Skript verschiebt Nägel und Maserung je nach Drehwinkel
       (vorne breit, an der Seite schmal, hinten weg). Kein Heranfahren, kein Zoom. */
    /* C · 86 % der Bildhöhe, mittig — wie am Handy (vorher bildhoch, die Kappe stiess oben an und er wirkte wie ein Balken). */
    .reise-stock{ position:absolute; left:50%; top:7%; height:86%; width:auto; aspect-ratio:120/700; overflow:visible;
      margin-left:calc(86vh * -120 / 700 / 2); margin-left:calc(86svh * -120 / 700 / 2) }
    /* M · Passbild-Stil (Stebler Studios 10.11.2026): zwei flache Töne wie die Hänge im Passbild, keine Maserung, kein Glanz */
    .reise-stock .holz{ fill:#C9B48E } .reise-stock .schatten{ fill:#A8936E }
    .reise-stock .riemen{ fill:#486054 } .reise-stock .spitze{ fill:#546C60 }
    .nagel{ transform-box:fill-box; transform-origin:50% 50% }
    .nagel .schild > *{ fill:#FCF0E4; stroke:inherit; stroke-width:3 }
    /* Auf jedem Stocknagel das Kapitel-Zeichen der App in der Kapitelfarbe, auf heller Plakette mit farbigem Rand
       (wie ein emailliertes Stockschild). Weiss auf Farbe ginge nicht: der Fünfliber hat weisse Details. */
    .js .nagel{ opacity:0 } .js .nagel.dran{ opacity:1 }
    .js .reise-buehne[data-hier="-1"] .reise-stock, .js .reise-buehne[data-hier="-1"] .reise-linie,
    .js .reise-buehne[data-hier="-1"] .reise-wolken, .js .reise-buehne[data-hier="-1"] .reise-quelle{ opacity:0 }
    /* B · Nach der letzten Kehre gehen Stock, Weglinie und Bildhinweis mit dem Bild weg, statt über dem Ausklang zu schweben. */
    .js .reise-buehne[data-ende] .reise-stock, .js .reise-buehne[data-ende] .reise-linie,
    .js .reise-buehne[data-ende] .reise-wolken, .js .reise-buehne[data-ende] .reise-quelle,
    .js .reise-buehne[data-ende]::after{ opacity:0 }
    /* E · links unten: rechts lag das Schild am Handy unter der Stockspitze */
    .reise-quelle{ position:absolute; left:12px; bottom:10px; font-size:13px; color:#FBFBFA; background:rgba(20,20,18,.72); padding:2px 8px; border-radius:6px }
    .reise-ablauf{ position:relative; z-index:5; margin-top:-100vh; margin-top:-100svh }
    .reise{ padding-top:0; color:#FBFBFA }
    /* Ausklang: nach der letzten Kehre verläuft das Bild ruhig ins Papier der Seite, statt hart abzubrechen. */
    /* Seit 10.11.2026 (Probe A1 «Salbei»): der Ausklang verläuft in das Salbei der Hänge, darunter liegt derselbe
       Pass von oben — echte Höhenlinien (swissALTI3D) und die echte Passstrasse mit ihren Kehren (OpenStreetMap).
       Die gemalten Kehren und die wirklichen finden so zusammen. Erst danach geht es ins Papier der Seite. */
    /* Seit 10.11. abends vier Höhenlinien-Bilder: C (Blick, Salbei) + A (Karte, Salbei) nach Kehre 7, D (Blick, Papier)
       vor «App holen», B (Karte, Papier) vor dem Fuss. Der Ausklang verläuft darum ins Creme des Himmels von C. */
    .reise-ausklang{ height:45vh; background:linear-gradient(rgba(252,240,228,0), #FCF0E4 85%) }
    .pass-blick{ background:#FCF0E4 }
    .pass-blick img, .pass-band img{ display:block; width:100%; height:auto }
    .pass-band{ position:relative; margin:64px 0 }
    .pass-band .quelle{ font-size:13px; color:var(--leise); padding-top:8px }
    /* Im dunklen Modus: die Papier-Linien (Tinte) hell umkehren, sonst verschwinden sie im dunklen Grund. */
    @media (prefers-color-scheme: dark){ .pass-band img, .papier-linien{ filter:invert(1) hue-rotate(180deg) brightness(.9) } }
    /* G · Vor der Karte steht schon die Luft des Schlussabschnitts (96 px) — nicht noch einmal 96. */
    .pass-band-karte{ margin:0 }
    .pass-band-karte img{ aspect-ratio:280/130; object-fit:cover }
    .pass-karte{ position:relative; background:#7E8F7B; color:#F6F2E8 }
    /* F · Die Karte auf Inhaltsbreite (vorher randlos 1280 px und mehr); das Salbei bleibt randlos, die Linien laufen
       an den Seiten weich aus statt mit harter Kante. */
    .pass-karte-bild{ position:relative; aspect-ratio:280/130; max-width:1040px; margin:0 auto;
      -webkit-mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); mask-image:linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent) }
    .pass-karte-bild img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 50%; display:block }
    .pass-karte .hoehe{ position:absolute; left:57.7%; top:27%; margin:-10px 0 0 14px; font-size:16px; font-weight:600; letter-spacing:.02em;
      text-shadow:0 0 6px rgba(85,104,90,.9) }
    .pass-karte figcaption{ display:flex; flex-wrap:wrap; justify-content:space-between; gap:4px 16px; padding-top:12px; font-size:15px }
    .pass-karte .quelle{ font-size:13px; opacity:.85 }
    .pass-karte-ende{ height:16vh; background:linear-gradient(#7E8F7B, var(--bg)) }
    @media (max-width:760px){
      .pass-karte-bild{ aspect-ratio:4/3 }
      .pass-karte-bild{ -webkit-mask-image:none; mask-image:none }
      .pass-karte .hoehe{ left:62.5% }   /* gleicher Punkt bei 4:3, object-fit:cover um die Mitte (Rechnung im Brand Book §7e) */
    }
    /* B–D · Kehre: Zahl und Text rechts neben dem Stock */
    .reise-stationen{ list-style:none }
    .reise-station{ min-height:100vh; min-height:100svh; display:flex; align-items:center;
      padding:12vh clamp(16px, 5vw, 72px) 12vh calc(50% + clamp(56px, 7vw, 120px)) }
    .reise-text{ max-width:28rem; text-shadow:0 1px 14px rgba(0,0,0,.45) }
    /* Statt einer grossen Zahl steht gross das Kapitel-Zeichen der App (wie Fujis grosse Höhenzahl): in der Kapitelfarbe
       auf heller Plakette, Ecke 16 px (Karte, Brand Book §7a C). */
    .reise-gross{ width:clamp(84px, 9vw, 120px); aspect-ratio:1; color:#FBFBFA; margin:0 0 16px }   /* M · ohne Kachel, weiss wie der Text (Rand verworfen, Stebler Studios 10.11.) */
    /* Zeichen mit weiss gezeichneten Details (Fünfliber, Haus): Details umkehren, sonst bleibt eine leere weisse Fläche */
    .reise-gross [fill="white"]{ fill:#2E3A33 } .reise-gross [stroke="white"]{ stroke:#2E3A33 }
    .reise-gross svg{ width:100%; height:auto; aspect-ratio:1; display:block }
    .reise-text .name{ display:block; font-size:15px; font-weight:600; color:#FBFBFA; margin-bottom:6px }
    .reise-text h3{ font-size:clamp(23px, 2.4vw, 28px); line-height:1.2; font-weight:700; letter-spacing:-0.01em; margin-bottom:10px }
    .reise-text p{ font-size:19px; line-height:1.55; color:#FBFBFA }
    /* Knöpfe auf dem Bild: Nebenknopf auf Papier (deckend #FFF8F0, Schrift und Rand sandDeep, 10 px). Kein Milchglas (§7e). */
    .reise-knoepfe{ display:flex; flex-wrap:wrap; gap:10px; margin-top:22px }
    .reise-knoepfe a{ display:inline-flex; align-items:center; min-height:44px; padding:10px 20px; border-radius:var(--radius-knopf); text-decoration:none;
      font-size:15px; font-weight:600; color:#7A5F30; border:1px solid #7A5F30; background:#FFF8F0; text-shadow:none }
    .reise-knoepfe a:hover{ color:#7A5F30; background:#F2EDE3 }
    .reise-knoepfe a:focus-visible{ outline:2px solid #FBFBFA; outline-offset:3px; box-shadow:0 0 0 5px #24262A }
    .reise-knoepfe .weiter::after{ content:"↓" / ""; margin-left:8px }
    @media (prefers-reduced-motion: no-preference){
      .js .reise-buehne::before, .js .reise-buehne::after{ transition:opacity .6s cubic-bezier(.4,0,.2,1) }
      .js .reise-buehne{ transition:--ton 1.1s cubic-bezier(.4,0,.2,1) }
      .js .reise-bild img{ transition:transform .6s cubic-bezier(.4,0,.2,1) }
      .js .reise-bild .an{ transition:-webkit-mask-position 1.1s cubic-bezier(.4,0,.2,1), mask-position 1.1s cubic-bezier(.4,0,.2,1), transform .6s cubic-bezier(.4,0,.2,1) }
      .js .reise-stock, .js .reise-linie, .js .reise-wolken, .js .reise-quelle{ transition:opacity .6s cubic-bezier(.4,0,.2,1) }
      .js .reise-linie .gegangen{ transition:stroke-dashoffset .6s cubic-bezier(.4,0,.2,1) }
      .js .reise-linie .ort{ transition:transform .6s cubic-bezier(.4,0,.2,1) }
      .js .nagel.dran{ animation:anschlagen .6s cubic-bezier(.2,.8,.2,1) }
      @keyframes anschlagen{ 0%{ transform:translateY(-14px) scale(1.15); opacity:0 } 65%{ transform:translateY(2px) scale(.97); opacity:1 } 100%{ transform:none } }
      .reise-wolken{ animation:ziehen 80s linear infinite alternate }
      @keyframes ziehen{ from{ transform:translateX(-12%) } to{ transform:translateX(12%) } }
    }
    @media (prefers-reduced-motion: reduce){
      .reise-bild img{ transform:none }
      .reise-wolken{ display:none }
    }
    @media (max-width:760px){
      .reise-buehne::before{ background:linear-gradient(180deg, rgba(var(--schleier),.95) 0%, rgba(var(--schleier),.9) 52%, rgba(var(--schleier),.35) 78%, rgba(var(--schleier),0) 92%) }
      .reise-buehne::after{ background:linear-gradient(0deg, rgba(18,18,16,.74) 0%, rgba(18,18,16,.6) 40%, rgba(18,18,16,0) 70%);
        background:linear-gradient(0deg, color-mix(in srgb, var(--ton) 74%, transparent) 0%, color-mix(in srgb, var(--ton) 60%, transparent) 40%, color-mix(in srgb, var(--ton) 0%, transparent) 70%) }
      /* D · Stock ein Stück über den rechten Rand, damit die Textfläche ihn nicht mehr überdeckt (vorher etwa 12 px) */
      .reise-stock{ left:auto; right:-30px; margin-left:0; height:86%; top:7% }
      .reise-linie{ display:none }
      .reise-station{ align-items:center; padding:10vh 84px 10vh 16px }
      .reise-gross{ width:64px; margin-bottom:12px }
      /* Am Handy wandert der Text durchs ganze Bild, auch über hellen Himmel: darum eine eigene dunkle Fläche (78 %, ohne Milchglas). */
      .reise-text{ background:rgba(20,20,18,.82); padding:18px 18px 20px; border-radius:16px;
        background:color-mix(in srgb, color-mix(in srgb, var(--farbe) 30%, #121210) 82%, transparent) }   /* P · in der Kapitelfarbe getönt, 82 %: mind. 5,88:1 */
      .reise-text p{ font-size:16px }
    }
    @media (max-height:520px){
      .reise-buehne{ position:relative; height:70vh }
      .reise-ablauf{ margin-top:0 }
      .reise-anfang{ background:var(--bg) }
      .reise{ color:var(--text) }
      .reise-station{ min-height:auto; padding:24px 16px; background:var(--bg) }
      .reise-text .name, .reise-text p{ color:var(--text) }
      .reise-text{ text-shadow:none; background:none; padding:0 }
      .reise-knoepfe a{ color:var(--text); border-color:var(--text); background:none }
      .reise-knoepfe a:focus-visible{ outline-color:var(--sand-tief) }
      .leiste{ display:none }
    }

    /* ─── Blick in die App (Editorial) ────────────────────────────── */
    .blick{ display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; margin-top:64px }
    .blick.umgekehrt .blick-bild{ order:2 }
    .blick .telefon{ width:250px; margin:0 auto }
    .blick-text .zahl{ font-size:15px; font-weight:600; color:var(--leise); margin-bottom:8px }
    .blick-text h3{ font-size:28px; line-height:1.25; font-weight:700; margin-bottom:12px; letter-spacing:-0.01em }
    .blick-text p{ color:var(--leise); font-size:16px; max-width:28em }

    /* ─── Holen: auf den Startbildschirm ──────────────────────────── */
    .holen{ margin-top:16px; max-width:640px }
    /* O · Gerät wählen auf dem Blick: Punkt auf der Strasse, darüber die Wahl (Auswahl-Knopf: gewählt Sand gefüllt, 10 px,
       44 px hoch). Nur die gewählte Anleitung steht da. */
    .holen-wahl{ border:0; min-width:0; padding:0; margin:var(--abstand-m) 0 0 }
    .holen-blick{ position:relative; margin:0 }
    .holen-flaeche{ position:relative }
    /* Die Wahl liegt als Ebene im Seitenverhältnis des Bildes darüber, damit --x/--y dieselben Prozente meinen. */
    .geraet-wahl{ position:absolute; top:0; left:0; right:0; aspect-ratio:1600/1000; pointer-events:none }
    .geraet-wahl label{ pointer-events:auto }
    .holen-blick img{ display:block; width:100%; height:auto }
    .holen-blick .quelle{ font-size:13px; color:var(--leise); padding-top:8px }
    .geraet-punkt{ position:absolute; left:var(--x); top:var(--y); width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%;
      background:#55685A; box-shadow:0 0 0 2px var(--bg) }
    .geraet-wahl label{ position:absolute; left:var(--x); top:var(--y); transform:translate(-50%, calc(-100% - 14px)); display:inline-flex;
      align-items:center; gap:8px; min-height:44px; padding:8px 16px; border:1px solid var(--sand-tief); border-radius:var(--radius-knopf);
      background:var(--flaeche); color:var(--sand-tief); font-size:15px; font-weight:600; cursor:pointer; white-space:nowrap }
    .geraet-wahl label::after{ content:""; position:absolute; left:50%; top:100%; height:8px; border-left:1.5px solid var(--sand-tief) }
    .geraet-wahl svg{ width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round }
    .holen .geraet{ display:none }
${GERAETE.map((_, i) => `    #g${i + 1}:checked ~ .holen .t${i + 1}{ display:block }
    #g${i + 1}:checked ~ .holen-blick [for=g${i + 1}]{ background:var(--sand); border-color:var(--sand); color:var(--auf-sand) }
    #g${i + 1}:checked ~ .holen-blick .p${i + 1}{ box-shadow:0 0 0 2px var(--bg), 0 0 0 5px var(--sand) }
    #g${i + 1}:focus-visible ~ .holen-blick [for=g${i + 1}]{ outline:2px solid var(--sand-tief); outline-offset:3px }`).join('\n')}
    .geraet{ background:var(--flaeche); border:1px solid var(--rand); border-radius:var(--radius-m); padding:26px 26px 22px }
    .geraet h3{ margin-bottom:14px }
    .geraet ol{ padding-left:20px; color:var(--leise); font-size:16px }
    .geraet li{ margin-bottom:8px; padding-left:4px }
    .geraet .klein{ font-size:13px; color:var(--leise); margin-top:12px; border-top:1px solid var(--rand); padding-top:12px }
    .bald{ margin-top:24px; font-size:16px; color:var(--leise) }
    .atlas-hinweis{ margin-top:20px; font-size:15px; color:var(--leise) }
    .bald strong{ color:var(--text) }
    /* Atlas-Abschnitt: eine Karte als eigenes Bild (Entscheid 10.11.2026, C). Lädt erst beim Hinscrollen,
       die Seite bleibt leicht; Breite und Höhe stehen am Bild, damit nichts springt. */
    .atlas-bild{ margin-top:var(--abstand-m); max-width:640px }
    .atlas-bild a{ display:block; border-radius:var(--radius-m) }
    .atlas-bild img{ display:block; width:100%; height:auto }
    .atlas-bild figcaption{ margin-top:8px; font-size:15px; color:var(--leise) }

    /* ─── Vertrauen, Nachlesen, Fragen ────────────────────────────── */
    .liste{ list-style:none; display:grid; grid-template-columns:repeat(4,1fr); gap:28px 32px; margin-top:var(--abstand-m) }
    .liste.eins{ grid-template-columns:1fr }
    .liste li{ border-top:1px solid var(--rand); padding-top:14px }
    .liste p, .liste span{ font-size:16px; color:var(--leise) }
    .liste a{ font-weight:600 }
    /* Ein Link, der allein im Listenpunkt steht («Karten für diese Frage», «Zum Nachlesen»), ist ein eigener Weg,
       kein Link im Satz — 44 px wie jedes Bedienelement (Brand Book §7a, Regel I; gemessen bei 375 px: vorher 19 px).
       Links im Fliesstext (z. B. «Datenschutz» unter «Kein Tracking») bleiben unberührt. */
    .liste > li > a{ display:inline-block; padding:13px 0 }
    .liste span{ display:block }
    .zweispaltig{ display:grid; grid-template-columns:1fr 1fr; gap:64px }
    .fragen h3{ margin-top:24px } .fragen h3:first-of-type{ margin-top:0 }
    .fragen p{ color:var(--leise) }
    .vorbehalt{ font-size:15px; color:var(--leise); border-left:2px solid var(--rand); padding-left:14px; margin-top:var(--abstand-m) }

    /* N · Schluss auf dem Pass von oben (Stebler Studios 10.11.2026). Die Karte bekommt oben links eine ruhige Fläche:
       die Linien laufen dort aus, damit der Text liest. Die Knöpfe stehen rechts neben ihrem Punkt, ein kurzer Strich
       verbindet sie. --x/--y: Punkt in der Karte (280:130), --xh: derselbe Punkt am Handy (4:3, mittig beschnitten). */
    .schluss-karte{ padding-top:var(--abstand-l) }
    .schluss-bild{ display:grid }
    .schluss-bild > *{ grid-area:1 / 1 }   /* Text liegt auf der Karte; am Handy darüber */
    .schluss-flaeche{ position:relative }
    .schluss-bild img{ display:block; width:100%; height:auto; aspect-ratio:280/130; object-fit:cover;
      -webkit-mask-image:radial-gradient(ellipse 46% 52% at 22% 14%, transparent 45%, #000 100%); mask-image:radial-gradient(ellipse 46% 52% at 22% 14%, transparent 45%, #000 100%) }
    .schluss-text{ position:relative; z-index:1; align-self:start; width:100%; padding-top:clamp(16px, 4vw, 56px); pointer-events:none }
    .schluss-text *{ pointer-events:auto }
    .schluss-text h2{ font-size:36px; max-width:12em }
    .schluss-text .unterzeile{ max-width:22em }
    .schluss-punkt{ position:absolute; left:var(--x); top:var(--y); width:12px; height:12px; margin:-6px 0 0 -6px; border-radius:50%;
      background:#55685A; box-shadow:0 0 0 2px var(--bg) }
    .knopf.am-punkt{ position:absolute; left:var(--x); top:var(--y); transform:translate(22px, -50%); background:var(--flaeche); white-space:nowrap }
    .knopf.am-punkt:hover{ background:color-mix(in srgb, var(--sand) 14%, var(--flaeche)) }   /* deckend: darunter liegen Linien */
    .am-punkt::before{ content:""; position:absolute; right:100%; top:50%; width:16px; border-top:1.5px solid var(--sand-tief) }
    .schluss-karte .quelle{ font-size:13px; color:var(--leise); padding-top:8px }

    /* D/E · Fuss: heller Grund mit Haarlinie (kein dunkles Band), Bildmarke Anthrazit führt nach oben. */
    .fuss{ border-top:1px solid var(--rand); padding:48px 0 56px; font-size:15px; color:var(--leise) }
    .fuss a{ color:var(--sand-tief) }
    .fuss p{ margin-bottom:8px }
    .fuss-spalten{ display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:32px }
    .fuss .marke{ color:var(--text); margin-bottom:8px } .fuss .marke:hover{ color:var(--text) }
    .fuss-titel{ font-size:15px; font-weight:600; color:var(--text) }
    .fuss ul{ list-style:none } .fuss li a{ display:inline-block; padding:6px 0 }
    .fuss-zeile{ margin-top:32px; padding-top:16px; border-top:1px solid var(--rand); font-size:13px }
    .fuss .vertrauen{ display:flex; flex-wrap:wrap; gap:4px 16px; color:var(--text) }
    .fuss .vertrauen span{ white-space:nowrap }
    .fuss .vertrauen span:not(:last-child)::after{ content:"·" / ""; margin-left:16px; color:var(--sand-tief) }

    /* Zum Inhalt springen (wie in der App, .mp-skip-link): erst beim Fokus sichtbar. */
    .sprung{ position:absolute; z-index:20; left:16px; top:-80px; padding:10px 16px; border-radius:var(--radius-knopf);
      background:#FFF8F0; color:#24262A; font-weight:600 }
    .sprung:focus{ top:12px }
    main:focus{ outline:none }
    html{ scroll-padding-top:64px }  /* Sprungziele landen unter der Leiste */

    /* B/C · Leiste: Papier mit Haarlinie (kein Milchglas), 56 px. Erscheinen 250 ms, Verschwinden ⅔ davon (§7a E). */
    .leiste{ position:fixed; z-index:8; top:0; left:0; right:0; background:#FFF8F0; color:#24262A; border-bottom:1px solid #E6DACB;
      transform:translateY(-100%); visibility:hidden }
    .leiste[data-zustand="seite"]{ transform:none; visibility:visible }
    .leiste-innen{ display:flex; align-items:center; gap:20px; min-height:56px }
    .leiste .marke{ color:#22211F } .leiste .marke svg{ height:26px }
    .leiste-links{ display:flex; gap:20px; margin-left:auto; font-size:15px }
    .leiste-links a{ color:#24262A; text-decoration:none; padding-block:10px; display:inline-flex; align-items:center; min-height:44px }
    .leiste-links a:hover{ text-decoration:underline }
    .leiste-links a[aria-current="location"]{ text-decoration:underline; text-decoration-thickness:2px; text-underline-offset:6px }
    @media (prefers-reduced-motion: no-preference){
      .leiste{ transition:transform .15s cubic-bezier(.4,0,.2,1), visibility 0s linear .15s }
      .leiste[data-zustand="seite"]{ transition:transform .25s cubic-bezier(.4,0,.2,1) }
    }

    @media (prefers-reduced-motion: reduce){
      .folge img{ animation:none } .folge img:first-child{ opacity:1 } .schalter, #anhalten{ display:none }
    }
    @media (max-width:960px){
      .pass h1{ font-size:38px }
      /* K · Unter 960 px eine Spalte: daneben brach der Titel in vier Zeilen. Die Geräte stehen unter dem Text. */
      .pass{ grid-template-columns:1fr; gap:32px; padding-top:112px; align-items:start }
      .geraete{ justify-self:start }
      /* N unter 960 px: Text über der Karte (daneben stiess er am Tablet an «App holen»), die Karte 4:3 mittig
         beschnitten, die Knöpfe bleiben an ihren Punkten (--xh). */
      .schluss-bild > *{ grid-area:auto }
      .schluss-text{ padding-top:0; padding-bottom:16px }
      .schluss-bild img{ aspect-ratio:4/3; -webkit-mask-image:none; mask-image:none }
      .schluss-punkt, .am-punkt{ left:var(--xh) }
      .liste{ grid-template-columns:1fr 1fr }
    }
    @media (max-width:760px){
      :root{ --abstand-l:64px }
      h2{ font-size:28px }
      .unterzeile{ font-size:16px }
      /* A · am Handy eine wischbare Reiter-Zeile statt nichts; am Rand ein leiser Verlauf «da geht es weiter». */
      .kopf{ flex-wrap:wrap; row-gap:4px }
      html{ scroll-padding-top:120px }
      .kopf nav, .leiste-links{ width:100%; gap:8px; overflow-x:auto; scrollbar-width:none; padding:4px 18% 4px 4px;
        -webkit-mask-image:linear-gradient(90deg, #000 82%, transparent); mask-image:linear-gradient(90deg, #000 82%, transparent) }
      .kopf nav a, .leiste-links a{ flex:none; display:inline-flex; align-items:center; min-height:44px; padding:0 14px;
        border:1px solid rgba(36,38,42,.28); border-radius:var(--radius-knopf); background:rgba(255,248,240,.75); text-decoration:none }
      .kopf nav a:focus-visible, .leiste-links a:focus-visible{ outline-offset:-3px }
      .leiste-links a[aria-current="location"]{ background:#C4A06A; border-color:#C4A06A; color:#2A2620; text-decoration:none }
      .leiste-innen{ flex-wrap:wrap; gap:6px 12px; padding-block:6px }
      .fuss-spalten{ grid-template-columns:1fr; gap:24px }
      .pass{ grid-template-columns:1fr; padding-top:136px; gap:28px; align-items:start }
      .pass h1{ font-size:32px }
      .pass .vorspann{ font-size:16px }
      .geraete{ justify-self:stretch; max-width:none }
      .geraete .telefon{ width:96px; padding:5px; border-radius:18px }
      .geraete .bildschirm{ border-radius:14px; --statusleiste:12px }
      .geraete .insel{ top:8px; width:30px; height:8px }
      .tafel{ padding:24px }
      .tafel p.gross{ font-size:19px }
      .blick, .blick.umgekehrt{ grid-template-columns:1fr; gap:28px; margin-top:56px }
      .blick.umgekehrt .blick-bild{ order:0 }
      .blick .telefon{ width:220px; border-radius:40px; padding:9px }
      .blick .bildschirm{ border-radius:31px; --statusleiste:32px }
      .blick .insel{ top:17px; width:72px; height:20px }
      .liste, .zweispaltig{ grid-template-columns:1fr; gap:20px }
      /* O am Handy: Punkte bleiben im Bild, die Wahl steht als Zeile darunter (das Bild ist zu niedrig für Schilder). */
      .geraet-wahl{ position:static; aspect-ratio:auto; display:flex; flex-wrap:wrap; gap:8px; margin-top:12px }
      .geraet-wahl label{ position:static; transform:none }
      .geraet-wahl label::after{ content:none }
      .schluss-text h2{ font-size:28px }
      footer a{ display:inline-block; padding:10px 2px }
    }`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Die Reise: eine Station je Kapitel. Das Beispiel öffnet direkt im Kapitel (Index wie CHAPTER_KEYS).
// «Weiter» springt zur nächsten Kehre, von der letzten zu «App holen».
function reiseStationen() {
  const n = KAPITEL.length;
  return KAPITEL.map((k, i) => {
    const weiter = i + 1 < n ? `<a class="weiter" href="#kehre-${i + 2}" aria-label="Weiter zu Kehre ${i + 2}">Weiter</a>` : '<a class="weiter" href="#holen">Weiter: App holen</a>';
    return `          <li class="reise-station" id="kehre-${i + 1}" style="--farbe:var(--k${i})">
            <div class="reise-text">
              <div class="reise-gross" aria-hidden="true">${zeichen(i, `gross${i + 1}`)}</div>
              <span class="name">Kehre ${i + 1} von ${n} · ${esc(k.name)}</span><h3>${esc(k.titel)}</h3><p>${esc(k.text)}</p>
              <p class="reise-knoepfe"><a href="${BEISPIEL}#/chapter/${i}">${esc(k.name)} im Beispiel ansehen</a>${weiter}</p>
            </div></li>`;
  }).join('\n');
}

// D · Weglinie links: gepunktet, der gegangene Teil durchgezogen, ein Punkt je Kehre (unten = Kehre 1)
// und ein Ort-Zeichen mit Namen, das das Skript an die aktuelle Kehre setzt.
const WEG = [[30, 600], [10, 560, 50, 520, 22, 470], [4, 430, 54, 390, 40, 345], [28, 305, 6, 280, 22, 220], [34, 175, 56, 150, 40, 95], [28, 55, 34, 25, 30, 0]];
function wegPunkt(t) {
  const seg = Math.min(WEG.length - 2, Math.floor(t)), u = t - seg;
  const p0 = WEG[seg].slice(-2), [x1, y1, x2, y2, x3, y3] = WEG[seg + 1];
  const b = (a, c, d, e) => (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * c + 3 * (1 - u) * u ** 2 * d + u ** 3 * e;
  return [b(p0[0], x1, x2, x3), b(p0[1], y1, y2, y3)].map((v) => Math.round(v * 10) / 10);
}
function reiseWegPunkte() {
  const n = KAPITEL.length;
  return KAPITEL.map((_, i) => wegPunkt(((i + 0.5) / n) * (WEG.length - 1)));
}
function reiseLinie() {
  const d = `M${WEG[0].join(' ')} ` + WEG.slice(1).map((c) => `C${c.join(' ')}`).join(' ');
  // An jedem Halt das Kapitel-Zeichen auf heller Scheibe (Stebler Studios 10.11.: «die Icons kommen in die weisse Linie»).
  const punkte = reiseWegPunkte().map(([x, y], i) => `<g class="halt" data-kehre="${i + 1}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})" style="color:var(--k${i})"><circle r="12"/>${zeichen(i, `weg${i + 1}`, 'x="-8.5" y="-8.5" width="17" height="17" ')}</g>`).join('');
  return `<svg class="reise-linie" viewBox="0 0 60 600" aria-hidden="true" focusable="false">
            <path class="weg" d="${d}"/>
            <path class="gegangen" d="${d}" pathLength="100"/>
            ${punkte}
            <g class="ort"><circle r="17"/><text x="26" y="5"></text></g>
          </svg>`;
}

// B/D · Der Wanderstock in der Mitte: Holz mit Licht- und Schattenkante, Riemen oben, Spitze unten; je Kehre ein
// Stocknagel (Schild in der Kapitelfarbe, darauf das Kapitel-Zeichen der App). Die Nägel sitzen rundum verteilt (je 1/7 Drehung);
// das Skript dreht den Stock so, dass der neue Nagel von hinten nach vorn kommt. Ohne Skript stehen alle vorne.
const NAGEL_Y = KAPITEL.map((_, i) => 590 - i * 82);
// D · Die Plaketten als Aufkleber, wie man sie an einen Wanderstock klebt: verschiedene Formen, leicht schräg,
// weisser Rand, darunter ein Schatten, darüber eine Wölbung (das Holz ist rund). Darauf das Kapitel-Zeichen der App.
// M · Passbild-Stil (Stebler Studios 10.11.2026): alle gleich, rund, gerade — flach wie das Passbild, ohne Schatten und Wölbung.
const STICKER = KAPITEL.map(() => ['kreis', 0]);
function stickerForm(form, y) {
  const m = y + 30;
  if (form === 'kreis') return `<circle cx="60" cy="${m}" r="27"/>`;
  if (form === 'oval') return `<ellipse cx="60" cy="${m}" rx="31" ry="25"/>`;
  if (form === 'rund') return `<rect x="31" y="${y + 5}" width="58" height="50" rx="11"/>`;
  return `<path d="M31 ${y + 2} h58 v25 c0 15 -13 25 -29 31 c-16 -6 -29 -16 -29 -31 z"/>`;
}
function reiseStock() {
  const naegel = KAPITEL.map((_, i) => {
    const y = NAGEL_Y[i];
    const [form, neigung] = STICKER[i];
    const f = stickerForm(form, y);
    return `<g class="nagel-dreh" data-kehre="${i + 1}"><g class="nagel"><g transform="rotate(${neigung} 60 ${y + 30})">`
      + `<g class="schild" style="stroke:var(--k${i})">${f}</g>`
      + `<g class="bild" style="color:var(--k${i})">${zeichen(i, `nagel${i + 1}`, `x="42" y="${y + 12}" width="36" height="36" `)}</g>`
      + `</g></g></g>`;
  }).join('');
  return `<svg class="reise-stock" viewBox="0 0 120 700" aria-hidden="true" focusable="false">
            <rect class="schatten" x="36" y="0" width="48" height="680" rx="24"/>
            <rect class="holz" x="36" y="0" width="40" height="680" rx="20"/>
            <path class="spitze" d="M46 678 h28 l-14 22 z"/>
            <rect class="riemen" x="30" y="24" width="60" height="42" rx="8"/>
            ${naegel}
          </svg>`;
}

function ld() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${BASIS}/#org`, name: 'Stebler Studios', url: `${BASIS}/`, email: 'info@malojaplana.ch', sameAs: ['https://github.com/steblerstudios'] },
      { '@type': 'WebSite', '@id': `${BASIS}/#website`, name: 'Maloja Plana', alternateName: ['Maloja Plana Lebensordner', 'Schweizer Lebensordner'], url: `${BASIS}/`, inLanguage: 'de', publisher: { '@id': `${BASIS}/#org` } },
      {
        '@type': 'WebApplication', '@id': `${BASIS}/#app`, name: 'Maloja Plana', url: `${BASIS}/app/`,
        description: VORSTELLUNG.beschreibung, applicationCategory: 'LifestyleApplication', operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CHF' }, isAccessibleForFree: true,
        license: 'https://www.gnu.org/licenses/agpl-3.0.html', sameAs: ['https://github.com/steblerstudios/maloja-plana'],
        publisher: { '@id': `${BASIS}/#org` }, isPartOf: { '@id': `${BASIS}/#website` },
      },
    ],
  };
}

export function vorstellungBauen() {
  const json = JSON.stringify(ld(), null, 2).split('\n').map((z) => '  ' + z).join('\n');
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Wie die Erklärseiten, dazu genau ein eigenes Skript: /weiterleitung.js. -->
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <!-- ERZEUGT — nicht von Hand bearbeiten.
       Quelle: scripts/seiten/vorstellung.mjs
       Generator: scripts/build-seiten.mjs
       Neu bauen:  node scripts/build-seiten.mjs
       Prüfen:     node scripts/build-seiten.mjs --pruefen -->
  <!-- Alte App-Links (/#/…, ?lang=, ?beispiel) und die installierte App gehen nach /app/. Synchron, vor dem ersten Bild. -->
  <script src="/weiterleitung.js"></script>
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Stebler Studios">
  <!-- Browserleiste je Farbschema (hell: Creme des Passbilds, §7e A; dunkel: Granit) -->
  <meta name="theme-color" content="#FCF0E4" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#22211F" media="(prefers-color-scheme: dark)">
  <title>${esc(VORSTELLUNG.titel)}</title>
  <meta name="description" content="${esc(VORSTELLUNG.beschreibung)}">
  <link rel="canonical" href="${BASIS}/">

  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(VORSTELLUNG.titel)}">
  <meta property="og:description" content="${esc(VORSTELLUNG.beschreibung)}">
  <meta property="og:url" content="${BASIS}/">
  <meta property="og:image" content="${BASIS}/og-image.png">
  <meta property="og:image:alt" content="${esc(VORSTELLUNG.titel)}">
  <meta property="og:locale" content="de_CH">
  <meta property="og:site_name" content="Maloja Plana">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(VORSTELLUNG.titel)}">
  <meta name="twitter:description" content="${esc(VORSTELLUNG.beschreibung)}">
  <meta name="twitter:image" content="${BASIS}/og-image.png">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/lexend-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <script type="application/ld+json">
${json}
  </script>
  <style>${STIL}
  </style>
</head>
<body>
  <a class="sprung" href="#inhalt">Zum Inhalt springen</a>

  <!-- ═══ Kopf: liegt auf dem Passbild ═══ -->
  <header class="kopf-leiste">
    <div class="rahmen kopf">
      <a class="marke" href="/" aria-label="Maloja Plana, Start">
        ${MARKE}
        Maloja&nbsp;Plana
      </a>
      <nav aria-label="Hauptmenü">
        <a href="#weg">Kapitel</a>
        <a href="#situationen">Situationen</a>
        <a href="#atlas">Kantone</a>
        <a href="#holen">App holen</a>
        <a href="/app/">Öffnen</a>
      </nav>
    </div>
  </header>

  <!-- ═══ C · Leiste: fährt nach der Reise herein, mit den Seiten-Links und dem aktuellen Abschnitt.
       Während der Reise zeigt die Weglinie im Bild den Ort. Ohne Skript erscheint sie nie. ═══ -->
  <nav class="leiste" aria-label="Abschnitte dieser Seite" data-zustand="aus">
    <div class="rahmen leiste-innen">
      <a class="marke" href="#inhalt" aria-label="Maloja Plana, nach oben">${MARKE}</a>
      <div class="leiste-links">
        <a href="#weg">Kapitel</a>
        <a href="#situationen">Situationen</a>
        <a href="#atlas">Kantone</a>
        <a href="#holen">App holen</a>
        <a href="/app/">Öffnen</a>
      </div>
    </div>
  </nav>

  <main id="inhalt" tabindex="-1">
    <!-- ═══ Hero und Reise: eine Bühne. Das Passbild unter dem Hero ist Bild 0, darauf folgen die Kehren. ═══ -->
    <div class="reise-bruecke">
      <div class="reise-buehne" aria-hidden="true" data-hier="-1">
        <div class="reise-bild">
          <img class="kehre-bild pass-bild an" src="/vorstellung/landschaft.webp" alt="" width="1482" height="1062" decoding="async">
${KAPITEL.map((_, i) => `          <img class="kehre-bild" src="${LEER}" data-src="/vorstellung/kehre-${i + 1}.webp" alt="" width="1280" height="853" decoding="async">`).join('\n')}
        </div>
        <div class="reise-wolken"></div>
        ${reiseLinie()}
        ${reiseStock()}
        <span class="reise-quelle">KI-gemalt</span>
      </div>

      <div class="reise-ablauf">
        <div class="reise-anfang">
          <div class="rahmen pass">
            <div>
              <h1><span>Verstehen, was zusteht.</span><span class="zweite">Ordnen, was ansteht.</span></h1>
              <p class="vorspann">Ein Schweizer Lebensordner für Steuern, Prämienverbilligung, Vorsorge und Notfall — auf Ihrem Telefon oder Laptop, in mehreren Sprachen, ohne dass Ihre Angaben das Gerät verlassen.</p>
              <div class="wege">
                <a class="knopf haupt" href="${BEISPIEL}">Beispiel ansehen</a>
                <a class="knopf zweit" href="#holen">App holen</a>
              </div>
              <p class="fakten"><span>Kostenlos</span><span>Ohne Konto</span><span>Ohne Werbung</span><span>Quelloffen</span></p>
              <p class="beta">Zurzeit in geschlossener Beta — das Beispiel steht ohne Code offen. Einen Code gibt es per <a href="mailto:info@malojaplana.ch?subject=Maloja%20Plana%3A%20Zugangscode">E-Mail</a>.</p>
            </div>

            <figure class="buehne geraete">
              <input type="checkbox" id="anhalten" class="unsichtbar">
              <div class="geraete-bild">
              <div class="laptop" role="img" aria-label="Maloja Plana auf einem Laptop, im Beispiel mit erfundenen Daten.">
                <div class="deckel"><div class="schirm"><img src="/vorstellung/app-computer.webp" alt="" width="800" height="500"></div></div>
                <div class="sockel" aria-hidden="true"></div>
              </div>
              <div class="telefon" role="img" aria-label="Maloja Plana auf einem Telefon, im Beispiel mit erfundenen Daten.">
                <div class="insel" aria-hidden="true"></div>
                <div class="bildschirm folge" aria-hidden="true">
${[1, 2, 3, 4, 5].map((n) => `                  <img src="${BILD(n)}" alt="" width="480" height="1040"${n > 1 ? ' loading="lazy"' : ''}>`).join('\n')}
                </div>
              </div>
              </div>
              <figcaption class="unter-telefon">
                <span>Beispiel mit erfundenen Daten</span>
                <label class="schalter" for="anhalten">Bildfolge anhalten</label>
              </figcaption>
            </figure>

            <a class="knopf zweit pass-weiter" href="#kehre-1">Sieben Kapitel, Kehre für Kehre</a>
          </div>
        </div>

        <!-- ═══ Die Reise: Kehre für Kehre auf den Malojapass ═══ -->
        <section id="weg" class="reise" aria-labelledby="t-weg">
          <h2 id="t-weg" class="unsichtbar">Sieben Kapitel: ein Weg, Kehre für Kehre</h2>
          <p class="unsichtbar">Die App hat sieben Kapitel. Diese Seite zeigt sie als Weg auf den Malojapass, eine Kehre je Kapitel. Sie beginnen, wo Sie wollen, und gehen in Ihrem Tempo weiter. Die Bilder in diesem Abschnitt sind KI-gemalt, eine freie Darstellung.</p>
          <ol class="reise-stationen" role="list">
${reiseStationen()}
          </ol>
        </section>
        <div class="reise-ausklang" aria-hidden="true"></div>
        <figure class="pass-blick">
          <img src="/vorstellung/pass-blick.svg" alt="Der Blick von der Passhöhe über die Kehren ins Bergell hinunter, in Höhenlinien, mit der Passstrasse." width="1600" height="1000" loading="lazy" decoding="async">
        </figure>
        <figure class="pass-karte">
          <div class="pass-karte-bild">
            <img src="/vorstellung/pass-karte.svg" alt="Karte des Malojapasses von oben: Höhenlinien und die Passstrasse, die in engen Kehren aus dem Bergell zur Passhöhe hinaufführt." width="1400" height="650" loading="lazy" decoding="async">
            <span class="hoehe" aria-hidden="true">Passhöhe 1815&nbsp;m</span>
          </div>
          <figcaption class="rahmen">
            <span>Oben angekommen: der Blick über die Kehren ins Bergell, und derselbe Weg von oben.</span>
            <span class="quelle">Höhen © swisstopo · Strasse © OpenStreetMap</span>
          </figcaption>
        </figure>
        <div class="pass-karte-ende" aria-hidden="true"></div>
      </div>
    </div>

    <div class="rahmen">

    <!-- ═══ Lebenssituationen ═══ -->
    <section id="situationen" class="lagen" aria-labelledby="t-lagen">
      <p class="augenbraue">Wo Sie gerade stehen</p>
      <h2 id="t-lagen">Was ist bei Ihnen gerade los?</h2>
      <p class="unterzeile">Manches steht einem nicht wegen eines einzelnen Ereignisses zu, sondern wegen einer Situation. Wählen Sie, was passt.</p>

      <fieldset>
      <legend class="unsichtbar">Ihre Situation</legend>
${SITUATIONEN.map((_, i) => `      <input type="radio" name="lage" id="l${i + 1}" class="unsichtbar"${i === 0 ? ' checked' : ''}>`).join('\n')}
      <div class="chips">
${SITUATIONEN.map(([titel], i) => `        <label for="l${i + 1}">${esc(titel)}</label>`).join('\n')}
      </div>
      <div class="tafeln">
${SITUATIONEN.map(([, text], i) => `        <div class="tafel t${i + 1}"><p class="gross">${esc(text)}</p><a href="${BEISPIEL}#/situationen">Im Beispiel ansehen →</a></div>`).join('\n')}
      </div>
      </fieldset>
    </section>

    <!-- ═══ Blick in die App ═══ -->
    <section aria-labelledby="t-blick">
      <p class="augenbraue">Ein Blick hinein</p>
      <h2 id="t-blick">So fühlt sich Ordnung an.</h2>

      <div class="blick">
        <div class="blick-bild"><div class="telefon" role="img" aria-label="Ansicht «Was steht mir zu?» im Beispiel"><div class="insel"></div><div class="bildschirm"><img src="${BILD(3)}" alt="" width="480" height="1040" loading="lazy"></div></div></div>
        <div class="blick-text">
          <p class="zahl">Was steht mir zu?</p>
          <h3>Ihre Situation, nicht ein Formular.</h3>
          <p>Sie wählen, was auf Sie zutrifft. Das bleibt auf Ihrem Gerät und dient nur dazu, Ihnen Passendes zu zeigen — kein Profil, keine Bewertung.</p>
        </div>
      </div>
      <div class="blick umgekehrt">
        <div class="blick-bild"><div class="telefon" role="img" aria-label="Gesundheit und Notfall im Beispiel"><div class="insel"></div><div class="bildschirm"><img src="${BILD(5)}" alt="" width="480" height="1040" loading="lazy"></div></div></div>
        <div class="blick-text">
          <p class="zahl">Gesundheit</p>
          <h3>Wenn es darauf ankommt, liegt alles bereit.</h3>
          <p>Kontaktperson, Hausarzt, wichtige Hinweise — und eine Karte mit dem, was Sie bei einem Notruf sagen, zum Vorlesen.</p>
        </div>
      </div>
    </section>

    <!-- ═══ Kantonsatlas: das Brückenstück zwischen Website und App ═══ -->
    <section id="atlas" aria-labelledby="t-atlas">
      <p class="augenbraue">Kantonsatlas</p>
      <h2 id="t-atlas">Die Kantone auf der Karte.</h2>
      <p class="unterzeile">Prämie, Steuern, Miete, Familie, Arbeit und Unterstützung: ${ATLAS_KARTEN_WORT} Karten der 26 Kantone aus öffentlichen Statistiken, frei zugänglich und ohne Rangliste. Welche Karten wichtig sind, hängt von der Frage ab. Vier Beispiele:</p>
      <figure class="atlas-bild">
        <a href="/kantonsatlas/#karte-praemie"><img src="/kantonsatlas/karte-praemie.svg" width="${KARTE_MASS.w}" height="${KARTE_MASS.h}" loading="lazy" decoding="async" alt="Karte der 26 Kantone: mittlere Monatsprämie für Erwachsene 2027, in vier Stufen von tief bis hoch. Zur Karte im Kantonsatlas, mit den Werten jedes Kantons."></a>
        <figcaption>Ein Beispiel: die mittlere Monatsprämie 2027. Werte und Quelle stehen im Kantonsatlas.</figcaption>
      </figure>
      <ul class="liste">
${BRILLEN.map((b) => `        <li><h3>${esc(b.name)}</h3><p>${esc(b.frage)}</p><a href="/kantonsatlas/#fuer-${b.id}">Karten für diese Frage<span class="unsichtbar">: ${esc(b.name)}</span></a></li>`).join('\n')}
      </ul>
      <div class="wege"><a class="knopf zweit" href="/kantonsatlas/">Alle ${ATLAS_KARTEN_WORT} Karten ansehen</a></div>
      <p class="atlas-hinweis">Die Karten zeigen Durchschnitte je Kanton, nicht Ihre eigene Lage. Was davon für Sie gilt, zeigt die App Schritt für Schritt, mit Ihren Angaben, auf Ihrem Gerät.</p>
    </section>

    <!-- ═══ Holen ═══ -->
    <section id="holen" aria-labelledby="t-holen">
      <p class="augenbraue">Telefon, Tablet, Laptop</p>
      <h2 id="t-holen">Maloja Plana holen — in einer Minute.</h2>
      <p class="unterzeile">Maloja Plana lässt sich auf den Startbildschirm oder ins Dock legen. Danach öffnet es sich mit eigenem Symbol und in einem eigenen Fenster, wie eine App.</p>
      <!-- O · Drei Punkte auf der Passstrasse im Blick (Papier): Gerät wählen, darunter stehen nur dessen Schritte.
           Ohne Skript, wie die Situationen; Pfeiltasten wechseln. Zeichen selbst gezeichnet, keine fremden Marken. -->
      <fieldset class="holen-wahl">
        <legend class="unsichtbar">Ihr Gerät</legend>
${GERAETE.map((g, i) => `        <input type="radio" name="geraet" id="g${i + 1}" class="unsichtbar"${i === 0 ? ' checked' : ''}>`).join('\n')}
        <figure class="holen-blick">
          <div class="holen-flaeche">
            <img class="papier-linien" src="/vorstellung/pass-blick-papier.svg" alt="" width="1600" height="1000" loading="lazy" decoding="async">
${GERAETE.map((g, i) => `            <span class="geraet-punkt p${i + 1}" style="--x:${g.x}; --y:${g.y}" aria-hidden="true"></span>`).join('\n')}
          </div>
          <div class="geraet-wahl">
${GERAETE.map((g, i) => `            <label for="g${i + 1}" style="--x:${g.x}; --y:${g.y}">${GERAET_ZEICHEN[g.zeichen]}${esc(g.name)}</label>`).join('\n')}
          </div>
          <figcaption class="quelle">Höhen © swisstopo · Strasse © OpenStreetMap</figcaption>
        </figure>
        <div class="holen">
        <div class="geraet t1">
          <h3>iPhone und iPad</h3>
          <ol>
            <li>Maloja Plana in Safari öffnen.</li>
            <li>Unten auf das Teilen-Zeichen tippen — das Quadrat mit dem Pfeil nach oben.</li>
            <li>«Zum Home-Bildschirm» wählen.</li>
            <li>Oben rechts auf «Hinzufügen» tippen.</li>
          </ol>
          <p class="klein">Auf dem iPhone sind die Angaben in Safari und auf dem Startbildschirm getrennt gespeichert. Öffnen Sie Maloja Plana darum von Anfang an über das Symbol.</p>
        </div>
        <div class="geraet t2">
          <h3>Android</h3>
          <ol>
            <li>Maloja Plana in Chrome öffnen.</li>
            <li>Oben rechts auf die drei Punkte tippen.</li>
            <li>«App installieren» wählen — je nach Version «Zum Startbildschirm hinzufügen».</li>
            <li>Bestätigen.</li>
          </ol>
        </div>
        <div class="geraet t3">
          <h3>Laptop und Computer</h3>
          <ol>
            <li>Maloja Plana in Chrome oder Edge öffnen.</li>
            <li>Rechts in der Adresszeile auf das Installieren-Zeichen klicken — ein kleiner Bildschirm mit einem Pfeil.</li>
            <li>Bestätigen. Maloja Plana liegt danach bei Ihren Programmen.</li>
          </ol>
          <p class="klein"><strong>Mac mit Safari:</strong> im Menü «Ablage» auf «Zum Dock hinzufügen» (ab Safari 17). Firefox am Computer kann das nicht — dort bleibt ein Lesezeichen.</p>
        </div>
        </div>
      </fieldset>
      <div class="wege"><a class="knopf zweit" href="/app/">Maloja Plana öffnen</a></div>
      <p class="bald"><strong>Eine Fassung für den App Store ist geplant.</strong> Bis dahin funktioniert der Weg über den Startbildschirm auf Telefon, Tablet und Laptop.</p>
      <p class="bald" id="warteliste">Möchten Sie Bescheid bekommen? <a href="${WARTELISTE}">Per E-Mail auf die Warteliste</a>. Wir schreiben Ihnen höchstens zweimal: wenn die Beta endet und, falls es sie gibt, wenn die Fassung für den App Store erscheint. Spätestens Ende 2027 löschen wir Ihre Adresse (<a href="/rechtliches/">Datenschutz</a>).</p>
    </section>

    <!-- ═══ Vertrauen ═══ -->
    <section aria-labelledby="t-vertrauen">
      <p class="augenbraue">Ihre Angaben</p>
      <h2 id="t-vertrauen">Was Sie eingeben, bleibt bei Ihnen.</h2>
      <p class="unterzeile">Die Rechnungen laufen in Ihrem Browser. Was Sie eingeben, wird nicht an einen Server geschickt.</p>
      <ul class="liste">
        <li><h3>Kein Konto</h3><p>Keine Anmeldung. Der Zugangscode der Beta wird nur auf Ihrem Gerät geprüft.</p></li>
        <li><h3>Nur auf diesem Gerät</h3><p>Im Speicher Ihres Browsers — nicht bei uns und nicht bei Dritten.</p></li>
        <li><h3>Kein Tracking</h3><p>Keine Werbung, keine Analyse-Dienste. Der Hoster speichert beim Abruf kurz technische Zugriffsdaten (<a href="/rechtliches/">Datenschutz</a>).</p></li>
        <li><h3>Quelloffen</h3><p>Der Quellcode ist öffentlich einsehbar.</p></li>
      </ul>
    </section>

    <!-- ═══ Nachlesen + Fragen ═══ -->
    <section class="zweispaltig" aria-label="Nachlesen und häufige Fragen">
      <div>
        <h2>Zum Nachlesen</h2>
        <ul class="liste eins">
          <li><a href="/was-steht-mir-zu/">Was steht mir zu?</a><span>Warum Unterstützung auf Bund, Kantone und Gemeinden verteilt ist.</span></li>
          <li><a href="/praemienverbilligung/">Prämienverbilligung</a><span>Ein Beitrag an die Krankenkassenprämie — was das für Sie bedeutet.</span></li>
          <li><a href="/sozialhilfe/">Sozialhilfe</a><span>Wer entscheidet und woraus sie sich zusammensetzt.</span></li>
          <li><a href="/steuern/">Steuern</a><span>Warum derselbe Lohn je nach Wohnort anders besteuert wird.</span></li>
          <li><a href="/krankenkasse/">Warum die Krankenkasse so viel kostet</a><span>Gemeinsamer Topf, Franchise und Prämie — Schritt für Schritt.</span></li>
        </ul>
      </div>
      <div class="fragen">
        <h2>Häufige Fragen</h2>
        <h3>Warum brauche ich einen Zugangscode?</h3>
        <p>Maloja Plana ist noch in einer geschlossenen Beta. Das Beispiel geht ohne Code — mit erfundenen Daten, es wird nichts gespeichert.</p>
        <p>Einen Code bekommen Sie per E-Mail: schreiben Sie an <a href="mailto:info@malojaplana.ch?subject=Maloja%20Plana%3A%20Zugangscode">info@malojaplana.ch</a>.</p>
        <h3>Was passiert, wenn ich das Gerät wechsle?</h3>
        <p>Ihre Angaben liegen nur in dem Browser, in dem Sie sie eingegeben haben. Für einen Wechsel oder als Vorsorge können Sie eine Sicherung als Datei speichern und später wieder einlesen.</p>
        <h3>Ersetzt die App eine Beratung?</h3>
        <p>Nein. Die App gibt Orientierung. Massgebend ist immer die Auskunft oder Verfügung der zuständigen Stelle.</p>
        <p class="vorbehalt">Die App ist eine <strong>Orientierungshilfe auf Basis öffentlicher Informationen — keine Rechts- oder Finanzberatung</strong>.</p>
      </div>
    </section>

    </div>

    <!-- ═══ N · Schluss auf dem Pass von oben (Papier): «Beispiel ansehen» am Fuss der Kehren, wo der Weg beginnt,
         «App holen» an der Passhöhe, wo man ankommt. Beide Punkte sind echt (Karte aus swissALTI3D und OpenStreetMap). ═══ -->
    <section class="schluss-karte" aria-labelledby="t-schluss">
      <div class="schluss-bild">
        <div class="rahmen schluss-text">
          <h2 id="t-schluss">Beginnen Sie mit einem kleinen Schritt.</h2>
          <p class="unterzeile">Schauen Sie sich das Beispiel an, ohne etwas einzugeben.</p>
        </div>
        <div class="schluss-flaeche">
          <img class="papier-linien" src="/vorstellung/pass-karte-papier.svg" alt="" width="1400" height="650" loading="lazy" decoding="async">
          <span class="schluss-punkt" style="--x:43.6%; --y:76.5%; --xh:39.7%" aria-hidden="true"></span>
          <a class="knopf zweit am-punkt" style="--x:43.6%; --y:76.5%; --xh:39.7%" href="${BEISPIEL}">Beispiel ansehen<span class="unsichtbar"> — hier unten beginnt der Weg</span></a>
          <a class="knopf zweit am-punkt" style="--x:57.8%; --y:26.6%; --xh:62.6%" href="#holen">App holen<span class="unsichtbar"> — oben an der Passhöhe</span></a>
        </div>
      </div>
      <p class="rahmen quelle">Höhen © swisstopo · Strasse © OpenStreetMap</p>
    </section>
  </main>

  <!-- ═══ D/E · Fuss: Marke · Entdecken · Rechtliches, darunter die Vertrauenszeile ═══ -->
  <footer class="fuss">
    <div class="rahmen">
      <div class="fuss-spalten">
        <div class="fuss-marke">
          <a class="marke" href="#inhalt" aria-label="Maloja Plana, nach oben">${MARKE}Maloja&nbsp;Plana</a>
          <p>Ein Schweizer Lebensordner. Ein Projekt von Stebler Studios, Basel.</p>
          <p><a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a></p>
        </div>
        <nav aria-labelledby="f-entdecken">
          <p class="fuss-titel" id="f-entdecken">Entdecken</p>
          <ul>
            <li><a href="${BEISPIEL}">Beispiel ansehen</a></li>
            <li><a href="#weg">Die sieben Kapitel</a></li>
            <li><a href="#holen">App holen</a></li>
            <li><a href="/was-steht-mir-zu/">Was steht mir zu?</a></li>
            <li><a href="/praemienverbilligung/">Prämienverbilligung</a></li>
            <li><a href="/sozialhilfe/">Sozialhilfe</a></li>
            <li><a href="/steuern/">Steuern</a></li>
            <li><a href="/krankenkasse/">Warum die Krankenkasse so viel kostet</a></li>
          </ul>
        </nav>
        <nav aria-labelledby="f-recht">
          <p class="fuss-titel" id="f-recht">Rechtliches</p>
          <ul>
            <li><a href="/rechtliches/">Impressum, Datenschutz und Haftungsausschluss</a></li>
            <li><a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">Quelloffen unter AGPL-3.0</a></li>
            <li><a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">Quellcode auf GitHub</a></li>
            <li><a href="mailto:info@malojaplana.ch?subject=Maloja%20Plana%3A%20Problem%20melden">Problem melden</a></li>
          </ul>
        </nav>
      </div>
      <div class="fuss-zeile">
        <p class="vertrauen"><span>Ohne Konto</span><span>Ohne Werbung</span><span>Ihre Angaben bleiben auf dem Gerät</span></p>
        <p>Die Bilder der Reise sind KI-gemalt, eine freie Darstellung des Malojapasses.</p>
        <p>Diese Seite gibt es auf Deutsch. Die App lässt sich auch auf Englisch, Französisch, Italienisch und Rätoromanisch (noch provisorisch) einstellen.</p>
        <p>Orientierungshilfe auf Basis öffentlicher Informationen — keine Rechts- oder Finanzberatung. Massgebend ist die zuständige Stelle.</p>
      </div>
    </div>
  </footer>
  <script src="/reise.js" defer></script>
</body>
</html>
`;
}
