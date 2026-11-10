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

const MARKE = '<svg viewBox="0 0 500 540" aria-hidden="true"><path d="M 0 190 C 0 169 7 152 22 138 L 89 78 C 102 66 119 65 131 78 C 177 122 206 136 270 153 C 299 163 321 172 302 193 C 284 208 228 224 182 242 C 128 264 92 294 92 330 L 92 467 C 92 529 0 529 0 468 Z" fill="#7E9F8C"/><path d="M 176 92 L 265 7 C 278 -4 294 -3 307 10 L 392 110 C 405 101 421 96 434 110 L 479 154 C 493 168 500 186 500 205 L 500 280 C 455 234 433 196 379 175 C 335 157 282 143 240 127 C 216 118 194 105 176 92 Z" fill="#C4A870"/><path d="M 200 331 C 200 286 269 248 322 242 C 410 230 500 278 500 349 C 500 414 431 467 328 467 L 328 375 C 328 345 275 312 275 351 L 275 529 C 275 562 200 563 200 517 Z" fill="#7E9F8C"/></svg>';


const STIL = `
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-400-normal.woff2') format('woff2'); font-weight:400; font-display:swap }
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-600-normal.woff2') format('woff2'); font-weight:600; font-display:swap }
    *{ margin:0; padding:0; box-sizing:border-box }
    :root{
      --bg:#F2F2F0; --flaeche:#FBFBFA; --text:#24262A; --leise:#6A6E74;
      --rand:#E0DDD8; --gold:#C4A870; --salbei:#7E9F8C; --salbei-tief:#4A6657;
      --auf-gold:#24262A;
      --himmel:#F4F0E6;                 /* Himmel der Landschaft — der Einstieg bleibt immer hell */
      --strasse:#E6E0D2; --strasse-saum:#D6CBB2;
      --gehaeuse:#1B1A18; --gehaeuse-rand:#3A3936; --insel:#0E0E0D; --schirm:#22211F;
      --radius-s:6px; --radius-m:12px;
      --abstand-s:16px; --abstand-m:32px; --abstand-l:112px;
${KAPITEL.map((k, i) => `      --k${i}:${k.farbe};`).join('\n')}
    }
    @media (prefers-color-scheme: dark){
      :root{ --bg:#22211F; --flaeche:#2A2927; --text:#E8E6E1; --leise:#A8A5A0;
             --rand:#3A3936; --salbei:#8FB09C; --salbei-tief:#8FB09C;
             --strasse:#34332F; --strasse-saum:#4A463D;
             --gehaeuse:#33322F; --gehaeuse-rand:#4A4945;
${KAPITEL.map((k, i) => `             --k${i}:${k.dunkel};`).join('\n')} }
      html{ color-scheme:dark }
    }
    html{ scroll-behavior:smooth }
    @media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto } }
    body{ background:var(--bg); color:var(--text); line-height:1.65;
      font-family:'Lexend',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; font-kerning:normal }
    .rahmen{ max-width:1040px; margin:0 auto; padding:0 24px }
    a{ color:inherit; text-decoration:underline; text-underline-offset:2px }
    a:hover{ color:var(--salbei-tief) }
    :focus-visible{ outline:2px solid var(--salbei-tief); outline-offset:3px }
    .unsichtbar{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap }
    .augenbraue{ font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--salbei-tief); margin-bottom:12px }
    h2{ font-size:34px; line-height:1.2; font-weight:600; letter-spacing:-0.015em; margin-bottom:14px }
    h3{ font-size:18px; font-weight:600; margin-bottom:4px; line-height:1.35 }
    p{ margin-bottom:12px } p:last-child{ margin-bottom:0 }
    .unterzeile{ color:var(--leise); font-size:18px; max-width:34em }
    section{ padding:var(--abstand-l) 0 0 }

    .knopf{ display:inline-flex; align-items:center; gap:8px; padding:13px 24px; border-radius:var(--radius-s); font-weight:600;
      font-size:15px; text-decoration:none; border:1px solid transparent; line-height:1.3 }
    .knopf.haupt{ background:var(--gold); color:var(--auf-gold) }
    .knopf.haupt:hover{ color:var(--auf-gold); filter:brightness(1.05) }
    .knopf.zweit{ border-color:currentColor; color:var(--text) }
    .knopf.zweit:hover{ color:var(--salbei-tief) }
    .wege{ display:flex; flex-wrap:wrap; gap:12px; margin-top:var(--abstand-m) }

    /* ─── Einstieg: die Pass-Landschaft ───────────────────────────── */
    .pass{ position:relative; min-height:min(100vh, 900px); background:var(--himmel); color:#24262A; overflow:hidden;
      --text:#24262A; --leise:#5C6066; --salbei-tief:#4A6657 }
    .pass .landschaft{ position:absolute; inset:auto 0 0 0; height:72%; }
    .pass .landschaft img{ width:100%; height:100%; object-fit:cover; object-position:50% 70%; display:block }
    .pass .landschaft::before{ content:""; position:absolute; inset:0; pointer-events:none;
      background:
        linear-gradient(var(--himmel) 0%, var(--himmel) 6%, rgba(244,240,230,0) 38%),
        linear-gradient(90deg, rgba(244,240,230,.94) 0%, rgba(244,240,230,.88) 45%, rgba(244,240,230,0) 72%) }  /* Vorspann reicht bei 1920 px bis 51 % */
    .pass .landschaft::after{ content:""; position:absolute; inset:auto 0 0 0; height:22%;
      background:linear-gradient(transparent, var(--bg)) }
    .pass header{ position:relative; z-index:2; padding:24px 0; display:flex; align-items:center; justify-content:space-between; gap:16px }
    .marke{ display:flex; align-items:center; gap:10px; padding-block:9px; font-weight:600; font-size:16px; text-decoration:none }
    .marke svg{ height:28px; width:auto }
    .pass nav.oben{ display:flex; gap:22px; font-size:14px }
    .pass nav.oben a{ text-decoration:none; padding-block:10px; color:#3E4247 }
    .pass nav.oben a:hover{ text-decoration:underline }
    .pass .inhalt{ position:relative; z-index:2; display:grid; grid-template-columns:1.7fr 1fr; gap:32px; align-items:start; padding-top:40px }
    .pass h1{ font-size:48px; line-height:1.1; font-weight:600; letter-spacing:-0.025em }
    .pass h1 span{ display:block }
    @media (min-width:961px){ .pass h1 span{ white-space:nowrap } }
    .pass h1 .zweite{ font-weight:400 }
    .pass .vorspann{ font-size:19px; max-width:28em; margin-top:22px; color:#3E4247 }
    .pass .fakten{ display:flex; flex-wrap:wrap; gap:6px 18px; margin-top:20px; font-size:14px; color:#24262A;
      background:rgba(244,240,230,.85); padding:4px 14px; border-radius:20px; width:fit-content }
    .pass .fakten span::before{ content:"·"; margin-right:18px; color:var(--gold) }
    .pass .fakten span:first-child::before{ content:none }
    .pass .beta{ font-size:14px; color:#3E4247; margin-top:10px }
    .pass .knopf.zweit{ background:rgba(255,255,255,.55); border-color:#24262A; color:#24262A }

    /* Telefon mit Bildfolge — steht auf der Landschaft */
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
    #anhalten:checked ~ .telefon .folge img, .buehne:hover .folge img{ animation-play-state:paused }
    .unter-telefon{ display:flex; flex-wrap:wrap; justify-content:center; gap:4px 14px; margin-top:14px;
      font-size:13px; color:#3E4247; text-align:center; background:rgba(244,240,230,.82); padding:4px 12px; border-radius:20px }
    .schalter{ cursor:pointer; text-decoration:underline; text-underline-offset:2px; padding:10px 2px; margin:-10px 0 }
    #anhalten:checked ~ .unter-telefon .schalter::before{ content:"✓ " / "" }
    #anhalten:focus-visible ~ .unter-telefon .schalter{ outline:2px solid #4A6657; outline-offset:3px }

    /* ─── Lebenssituationen (Radio-Reiter, ohne Skript) ───────────── */
    .lagen .chips{ display:flex; flex-wrap:wrap; gap:10px; margin-top:var(--abstand-m) }
    .lagen fieldset{ border:0; min-width:0; padding:0; margin:0 }
    .lagen .chips label{ cursor:pointer; padding:11px 18px; border:1px solid var(--leise); border-radius:999px;
      background:var(--flaeche); font-size:15px; color:var(--text); transition:background .2s, border-color .2s }
    .lagen .chips label:hover{ border-color:var(--salbei) }
    .tafel{ display:none; margin-top:28px; padding:36px 40px; background:var(--flaeche); border:1px solid var(--rand);
      border-radius:var(--radius-m); max-width:760px }
    .tafel p.gross{ font-size:22px; line-height:1.45; margin-bottom:18px; color:var(--text) }
    .tafel a{ font-weight:600 }
${SITUATIONEN.map((_, i) => `    #l${i + 1}:checked ~ .tafeln .t${i + 1}{ display:block }
    #l${i + 1}:checked ~ .chips [for=l${i + 1}]{ background:var(--text); color:var(--bg); border-color:var(--text) }
    #l${i + 1}:checked ~ .chips [for=l${i + 1}]::before{ content:"✓ " / "" }
    #l${i + 1}:focus-visible ~ .chips [for=l${i + 1}]{ outline:2px solid var(--salbei-tief); outline-offset:3px }`).join('\n')}

    /* ─── Die Reise: Kehre für Kehre auf den Malojapass (Brand Book §7d, Entwurf 10.11.2026) ───
       Richtung «Stationen sammeln»: ein gemaltes Passbild als Bühne, links Weglinie, rechts der
       Wanderstock, an den je Kehre ein Stocknagel kommt. Die Bühne klebt (sticky), die Stationen
       ziehen darüber. Ohne Skript: alles da, alle Nägel am Stock, nur ohne Mitwandern. */
    .reise-bruecke{ position:relative; width:100vw; margin-left:calc(50% - 50vw); margin-top:var(--abstand-m) }
    .reise-buehne{ position:sticky; top:0; height:100vh; height:100svh; overflow:hidden; background:var(--himmel) }
    .reise-bild{ position:absolute; inset:0 }
    /* Je Kehre ein eigenes Bild (KI-gemalt, Bergell → Silsersee); das aktuelle hat .an. Innerhalb einer
       Kehre wandert es leicht mit (--k von 0 bis 1). */
    .reise-bild img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:45% 60%; display:block;
      opacity:0; transform:scale(1.12) translateY(calc((var(--k, 0.5) - 0.5) * 5%)) }
    .reise-bild img.an{ opacity:1 }
    .reise-bild::after{ content:""; position:absolute; inset:0; pointer-events:none;
      background:linear-gradient(90deg, rgba(20,20,18,.30) 0%, rgba(20,20,18,0) 40%) }
    .reise-linie{ position:absolute; left:clamp(16px, 4vw, 56px); top:14vh; height:62vh; width:40px; overflow:visible }
    .reise-linie path{ fill:none; stroke:#FBFBFA; stroke-width:1.6; stroke-linecap:round; opacity:.9 }
    .reise-linie circle{ fill:#FBFBFA }
    .reise-linie circle.hier{ fill:var(--gold); stroke:#FBFBFA; stroke-width:2 }
    .reise-stock{ position:absolute; right:clamp(16px, 9vw, 140px); top:6vh; height:94vh; width:auto; aspect-ratio:60/700; overflow:visible }
    .reise-stock .holz{ fill:#C9A57A } .reise-stock .maser{ fill:none; stroke:#9C7A4E; stroke-width:1; opacity:.6 }
    .reise-stock .riemen{ fill:#7A4A3A }
    .nagel{ transform-box:fill-box; transform-origin:50% 50% }
    .nagel .schild{ stroke:#FBFBFA; stroke-width:2 } .nagel .kopf{ fill:#E8E6E1; stroke:#5A5650; stroke-width:.8 }
    .js .nagel{ opacity:0 } .js .nagel.dran{ opacity:1 }
    .reise-quelle{ position:absolute; right:12px; bottom:8px; font-size:12px; color:#FBFBFA; text-shadow:0 1px 3px rgba(0,0,0,.7) }
    .reise-stationen{ list-style:none; position:relative; margin-top:-100vh; margin-top:-100svh }
    .reise-station{ min-height:100vh; min-height:100svh; display:flex; flex-direction:column; justify-content:flex-end;
      padding:0 clamp(16px, 4vw, 56px) 12vh calc(clamp(16px, 4vw, 56px) + 64px) }
    .reise-zahl{ font-size:clamp(64px, 9vw, 112px); line-height:.85; font-weight:600; letter-spacing:-0.03em; color:#FBFBFA;
      text-shadow:0 2px 14px rgba(0,0,0,.45); margin:0 0 14px 2px }
    .reise-karte{ max-width:30rem; background:color-mix(in srgb, var(--flaeche) 92%, transparent); color:var(--text);
      border-radius:var(--radius-m); padding:22px 24px; box-shadow:0 8px 30px rgba(0,0,0,.12) }
    .reise-karte .name{ display:inline-block; font-size:13px; font-weight:600; letter-spacing:.06em; text-transform:uppercase;
      color:color-mix(in srgb, var(--farbe) 50%, var(--text)); margin-bottom:4px }
    .reise-karte h3{ font-size:22px }
    .reise-karte p{ color:var(--leise); font-size:16px }
    .reise-karte a{ display:inline-block; margin-top:10px; padding:10px 0; font-weight:600; color:var(--text) }
    @media (prefers-reduced-motion: no-preference){
      .js .reise-bild img{ transition:opacity .9s ease, transform .6s cubic-bezier(.2,.7,.2,1) }
      .js .nagel.dran{ animation:anschlagen .55s cubic-bezier(.2,.8,.2,1) }
      @keyframes anschlagen{ 0%{ transform:translateX(26px) rotate(-14deg) scale(1.3); opacity:0 } 70%{ transform:translateX(-2px) rotate(2deg) scale(.96); opacity:1 } 100%{ transform:none } }
    }
    @media (prefers-reduced-motion: reduce){ .reise-bild img{ transform:none } }
    @media (max-height:520px){
      .reise-buehne{ position:relative; height:70vh }
      .reise-stationen{ margin-top:0 }
      .reise-station{ min-height:auto; padding:16px; background:var(--bg) }
      .reise-zahl{ color:var(--text); text-shadow:none }
    }

    /* ─── Blick in die App (Editorial) ────────────────────────────── */
    .blick{ display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; margin-top:72px }
    .blick.umgekehrt .blick-bild{ order:2 }
    .blick .telefon{ width:250px; margin:0 auto }
    .blick-text .zahl{ font-size:13px; font-weight:600; color:var(--salbei-tief); letter-spacing:.08em; text-transform:uppercase; margin-bottom:10px }
    .blick-text h3{ font-size:28px; line-height:1.25; margin-bottom:12px; letter-spacing:-0.01em }
    .blick-text p{ color:var(--leise); font-size:17px; max-width:28em }

    /* ─── Holen: auf den Startbildschirm ──────────────────────────── */
    .holen{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:var(--abstand-m) }
    .geraet{ background:var(--flaeche); border:1px solid var(--rand); border-radius:var(--radius-m); padding:26px 26px 22px }
    .geraet h3{ margin-bottom:14px }
    .geraet ol{ padding-left:20px; color:var(--leise); font-size:15px }
    .geraet li{ margin-bottom:8px; padding-left:4px }
    .geraet .klein{ font-size:13px; color:var(--leise); margin-top:12px; border-top:1px solid var(--rand); padding-top:12px }
    .bald{ margin-top:20px; font-size:15px; color:var(--leise) }
    .bald strong{ color:var(--text) }

    /* ─── Vertrauen, Nachlesen, Fragen ────────────────────────────── */
    .liste{ list-style:none; display:grid; grid-template-columns:repeat(4,1fr); gap:28px 32px; margin-top:var(--abstand-m) }
    .liste.eins{ grid-template-columns:1fr }
    .liste li{ border-top:1px solid var(--rand); padding-top:14px }
    .liste p, .liste span{ font-size:15px; color:var(--leise) }
    .liste a{ font-weight:600 }
    .liste span{ display:block }
    .zweispaltig{ display:grid; grid-template-columns:1fr 1fr; gap:72px }
    .fragen h3{ margin-top:24px } .fragen h3:first-of-type{ margin-top:0 }
    .fragen p{ color:var(--leise) }
    .vorbehalt{ font-size:14px; color:var(--leise); border-left:2px solid var(--rand); padding-left:14px; margin-top:var(--abstand-m) }

    .schluss{ text-align:center; padding:var(--abstand-l) 0 }
    .schluss h2{ font-size:40px }
    .schluss .unterzeile{ margin:0 auto }
    .schluss .wege{ justify-content:center }

    footer{ border-top:1px solid var(--rand); padding:28px 0 56px; font-size:13px; color:var(--leise) }
    footer a{ color:var(--leise) }
    footer p{ margin-bottom:6px }

    @media (prefers-reduced-motion: reduce){
      .folge img{ animation:none } .folge img:first-child{ opacity:1 } .schalter{ display:none }
    }
    @media (max-width:960px){
      .pass h1{ font-size:38px }
      .holen{ grid-template-columns:1fr 1fr }
      .liste{ grid-template-columns:1fr 1fr }
    }
    @media (max-width:760px){
      :root{ --abstand-l:80px }
      h2{ font-size:26px }
      .unterzeile{ font-size:16px }
      .pass{ min-height:auto }
      .pass nav.oben{ display:none }
      .pass .inhalt{ grid-template-columns:1fr; padding-top:8px; gap:0 }
      .pass h1{ font-size:32px }
      .pass .vorspann{ font-size:17px }
      .pass .landschaft{ position:relative; height:300px; margin-top:24px }
      .pass .buehne{ display:none }
      .tafel{ padding:24px }
      .tafel p.gross{ font-size:19px }
      .reise-stock{ right:8px; top:18vh; height:64vh }
      .reise-linie{ display:none }
      .reise-station{ padding:0 16px 9vh }
      .reise-karte{ padding:18px; max-width:calc(100% - 52px) }
      .reise-karte h3{ font-size:19px }
      .blick, .blick.umgekehrt{ grid-template-columns:1fr; gap:28px; margin-top:56px }
      .blick.umgekehrt .blick-bild{ order:0 }
      .blick .telefon{ width:220px; border-radius:40px; padding:9px }
      .blick .bildschirm{ border-radius:31px; --statusleiste:32px }
      .blick .insel{ top:17px; width:72px; height:20px }
      .holen, .liste, .zweispaltig{ grid-template-columns:1fr; gap:20px }
      .schluss h2{ font-size:28px }
      footer a{ display:inline-block; padding:10px 2px }
    }`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Die Reise: eine Station je Kapitel. Das Beispiel öffnet direkt im Kapitel (Index wie CHAPTER_KEYS).
function reiseStationen() {
  return KAPITEL.map((k, i) => `        <li class="reise-station" id="kehre-${i + 1}" style="--farbe:var(--k${i})">
          <p class="reise-zahl" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
          <div class="reise-karte"><span class="name">Kehre ${i + 1} von ${KAPITEL.length} · ${esc(k.name)}</span><h3>${esc(k.titel)}</h3><p>${esc(k.text)}</p>
            <a href="${BEISPIEL}#/chapter/${i}">${esc(k.name)} im Beispiel ansehen</a></div></li>`).join('\n');
}

// Weglinie links: eine handgezogene Schlangenlinie, ein Punkt je Kehre (unten = Kehre 1).
function reiseLinie() {
  const n = KAPITEL.length;
  const punkte = KAPITEL.map((_, i) => `<circle cx="${i % 2 ? 26 : 14}" cy="${(100 - (i + 0.5) * (100 / n)).toFixed(2)}" r="4"/>`).join('');
  return `<svg class="reise-linie" viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M20 100 C8 92 32 86 14 78 C2 72 34 64 26 57 C18 50 4 47 14 36 C22 28 36 24 26 15 C18 8 22 4 20 0" vector-effect="non-scaling-stroke"/>
            ${punkte}
          </svg>`;
}

// Der Wanderstock: Holz, Maserung, Riemen oben; je Kehre ein Stocknagel (Schild in der Kapitelfarbe).
function reiseStock() {
  const naegel = KAPITEL.map((_, i) => {
    const y = 600 - i * 74;
    return `<g class="nagel" data-kehre="${i + 1}"><path class="schild" style="fill:var(--k${i})" d="M8 ${y} h44 v22 c0 12 -10 20 -22 26 c-12 -6 -22 -14 -22 -26 z"/><circle class="kopf" cx="30" cy="${y + 6}" r="2.6"/><circle class="kopf" cx="30" cy="${y + 30}" r="2.6"/></g>`;
  }).join('');
  return `<svg class="reise-stock" viewBox="0 0 60 700" aria-hidden="true" focusable="false">
            <rect class="holz" x="22" y="0" width="16" height="700" rx="7"/>
            <path class="maser" d="M27 10 C29 140 25 260 28 400 C30 520 26 610 28 690 M33 20 C31 170 35 300 32 450 C30 560 34 640 32 690"/>
            <rect class="riemen" x="19" y="24" width="22" height="34" rx="4"/>
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
  <meta name="theme-color" content="#F4F0E6">
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

  <!-- ═══ Einstieg ═══ -->
  <div class="pass">
    <div class="rahmen">
      <header>
        <a class="marke" href="/" aria-label="Maloja Plana, Start">
          ${MARKE}
          Maloja&nbsp;Plana
        </a>
        <nav class="oben" aria-label="Seite">
          <a href="#situationen">Situationen</a>
          <a href="#weg">Kapitel</a>
          <a href="#holen">App holen</a>
          <a href="/app/">Öffnen</a>
        </nav>
      </header>

      <div class="inhalt">
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

        <figure class="buehne">
          <input type="checkbox" id="anhalten" class="unsichtbar">
          <div class="telefon" role="img" aria-label="Maloja Plana auf einem Telefon, im Beispiel mit erfundenen Daten.">
            <div class="insel" aria-hidden="true"></div>
            <div class="bildschirm folge" aria-hidden="true">
${[1, 2, 3, 4, 5].map((n) => `              <img src="${BILD(n)}" alt="" width="480" height="1040"${n > 1 ? ' loading="lazy"' : ''}>`).join('\n')}
            </div>
          </div>
          <figcaption class="unter-telefon">
            <span>Beispiel mit erfundenen Daten</span>
            <label class="schalter" for="anhalten">Bildfolge anhalten</label>
          </figcaption>
        </figure>
      </div>
    </div>
    <div class="landschaft" aria-hidden="true">
      <img src="/vorstellung/landschaft.webp" alt="" width="1482" height="1062">
    </div>
  </div>

  <main class="rahmen">

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

    <!-- ═══ Die Reise: Kehre für Kehre auf den Malojapass ═══ -->
    <section id="weg" class="reise" aria-labelledby="t-weg">
      <p class="augenbraue">Sieben Kapitel</p>
      <h2 id="t-weg">Ein Weg, Kehre für Kehre.</h2>
      <p class="unterzeile">In der App liegen Ihre sieben Kapitel als Stationen auf der Malojapass-Strasse. Sie beginnen, wo Sie wollen, und gehen in Ihrem Tempo weiter. An jeder Kehre kommt ein Stocknagel an den Wanderstock.</p>

      <div class="reise-bruecke">
        <div class="reise-buehne" aria-hidden="true">
          <div class="reise-bild">
${KAPITEL.map((_, i) => `            <img class="kehre-bild${i === 0 ? ' an' : ''}" src="/vorstellung/kehre-${i + 1}.webp" alt="" width="1280" height="853" loading="lazy" decoding="async">`).join('\n')}
          </div>
          ${reiseLinie()}
          ${reiseStock()}
          <span class="reise-quelle">Bild: KI-gemalt, freie Darstellung</span>
        </div>
        <ol class="reise-stationen">
${reiseStationen()}
        </ol>
      </div>
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

    <!-- ═══ Holen ═══ -->
    <section id="holen" aria-labelledby="t-holen">
      <p class="augenbraue">Telefon, Tablet, Laptop</p>
      <h2 id="t-holen">Maloja Plana holen — in einer Minute.</h2>
      <p class="unterzeile">Maloja Plana lässt sich auf den Startbildschirm oder ins Dock legen. Danach öffnet es sich mit eigenem Symbol und in einem eigenen Fenster, wie eine App.</p>
      <div class="holen">
        <div class="geraet">
          <h3>iPhone und iPad</h3>
          <ol>
            <li>Maloja Plana in Safari öffnen.</li>
            <li>Unten auf das Teilen-Zeichen tippen — das Quadrat mit dem Pfeil nach oben.</li>
            <li>«Zum Home-Bildschirm» wählen.</li>
            <li>Oben rechts auf «Hinzufügen» tippen.</li>
          </ol>
          <p class="klein">Auf dem iPhone sind die Angaben in Safari und auf dem Startbildschirm getrennt gespeichert. Öffnen Sie Maloja Plana darum von Anfang an über das Symbol.</p>
        </div>
        <div class="geraet">
          <h3>Android</h3>
          <ol>
            <li>Maloja Plana in Chrome öffnen.</li>
            <li>Oben rechts auf die drei Punkte tippen.</li>
            <li>«App installieren» wählen — je nach Version «Zum Startbildschirm hinzufügen».</li>
            <li>Bestätigen.</li>
          </ol>
        </div>
        <div class="geraet">
          <h3>Laptop und Computer</h3>
          <ol>
            <li>Maloja Plana in Chrome oder Edge öffnen.</li>
            <li>Rechts in der Adresszeile auf das Installieren-Zeichen klicken — ein kleiner Bildschirm mit einem Pfeil.</li>
            <li>Bestätigen. Maloja Plana liegt danach bei Ihren Programmen.</li>
          </ol>
          <p class="klein"><strong>Mac mit Safari:</strong> im Menü «Ablage» auf «Zum Dock hinzufügen» (ab Safari 17). Firefox am Computer kann das nicht — dort bleibt ein Lesezeichen.</p>
        </div>
      </div>
      <div class="wege"><a class="knopf haupt" href="/app/">Maloja Plana öffnen</a></div>
      <p class="bald"><strong>Eine Fassung für den App Store ist geplant.</strong> Bis dahin funktioniert der Weg über den Startbildschirm auf Telefon, Tablet und Laptop.</p>
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

    <div class="schluss">
      <h2>Beginnen Sie mit einem kleinen Schritt.</h2>
      <p class="unterzeile">Schauen Sie sich das Beispiel an, ohne etwas einzugeben.</p>
      <div class="wege">
        <a class="knopf haupt" href="${BEISPIEL}">Beispiel ansehen</a>
        <a class="knopf zweit" href="#holen">App holen</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="rahmen">
      <p>Maloja Plana ist ein Projekt von Stebler Studios, Basel ·
      <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a></p>
      <p>Quelloffen unter <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a> ·
      <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">Quellcode auf GitHub</a></p>
      <p>Orientierungshilfe auf Basis öffentlicher Informationen — keine Rechts- oder Finanzberatung. Massgebend ist die zuständige Stelle.</p>
      <p><a href="/rechtliches/">Impressum, Datenschutz und Haftungsausschluss</a> ·
      <a href="mailto:info@malojaplana.ch?subject=Maloja%20Plana%3A%20Problem%20melden">Problem melden</a></p>
    </div>
  </footer>
  <script src="/reise.js" defer></script>
</body>
</html>
`;
}
