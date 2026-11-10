// ─── Die Reise · /reise/ ─────────────────────────────────────────────────────
// Maloja als Weg zum Pass: Tal (die eigene Frage) → sechs Stationen (die Lebens-
// Kapitel der App, ohne Notfall) → Pass = Eingang ins Beispiel der App.
// Richtung: «Fuji-Stationen» (Entscheid Stebler Studios 10.11.2026), übernommen
// sind nur Prinzipien — Station für Station, ein Stempel je Station, grosse
// Etappen-Zahl, Etappen-Leiste —, keine Bilder, Texturen oder Code. Regeln im
// Brand Book, Abschnitt «Die Reise».
//
// Notfall ist bewusst KEINE Station, sondern ein festes Schild, das während der
// ganzen Reise sichtbar bleibt: im Ernstfall scrollt niemand an sechs Stationen
// vorbei, und eine Reise, die mit «Notfall» beginnt, beginnt mit Angst.
//
// Die Seite funktioniert ohne JavaScript (alle Texte, alle Links, Weg gestrichelt).
// Das Skript liegt als eigene Datei daneben (CSP script-src 'self'); es zeichnet
// nur den Weg beim Scrollen und setzt die Stempel. Bei «weniger Bewegung» bleibt
// alles stehen, der Inhalt ist derselbe.
//
// Vorerst nur Deutsch und noindex: Entwurf, bis Stebler Studios freigibt.

import { appBeispiel } from '../seiten-ziele.mjs';

// Reihenfolge und Index wie CHAPTER_KEYS in src/config/constants.js
// (basis 0 … behoerden 5, notfall 6). Ein Test hält beides zusammen.
export const REISE_STATIONEN = [
  { key: 'basis', titel: 'Grundlagen', kurz: 'Name, Kontakt, wer zum Haushalt gehört. Die Angaben, auf denen die anderen Kapitel aufbauen.' },
  { key: 'wohnen', titel: 'Wohnen', kurz: 'Adresse, Mietkosten, Vermieterschaft. Und beim Umzug die Schritte, einer nach dem anderen.' },
  { key: 'finanzen', titel: 'Finanzen', kurz: 'Einkommen, Monatsausgaben, Sparen. Ein Budget, das zu Ihrem Alltag passt.' },
  { key: 'versicherungen', titel: 'Versicherungen', kurz: 'Grundversicherung, Vorsorge, weitere Versicherungen. Übersichtlich an einem Ort.' },
  { key: 'ausbildung', titel: 'Ausbildung', kurz: 'Abschlüsse, Lebenslauf, Weiterbildung. Ihre Ausbildung an einem Ort.' },
  { key: 'behoerden', titel: 'Behörden', kurz: 'Steuern, Bewilligungen, Briefe an Ämter. Fristen lassen sich als Erinnerung festhalten.' },
];
export const REISE_NOTFALL_INDEX = 6;

// Passhöhe 1815 m ü. M.: Historisches Lexikon der Schweiz, Artikel «Maloja (Pass)»,
// https://hls-dhs-dss.ch/de/articles/008813/ (abgerufen 10.11.2026). Bleibende Höhe, kein Betrag.

// Der Weg im Bild: Start im Tal, eine Ecke je Station, zuletzt der Pass.
const PUNKTE = [[200, 660], [310, 590], [90, 500], [300, 410], [120, 320], [290, 240], [150, 190], [210, 150]];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const zwei = (n) => String(n).padStart(2, '0');

const stil = `
    @font-face{ font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-700-normal.woff2') format('woff2'); font-weight:700; font-display:swap }
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-400-normal.woff2') format('woff2'); font-weight:400; font-display:swap }
    :root{ --bg:#F2F2F0; --flaeche:#FAFAF8; --text:#24262A; --leise:#5D5F63;
           --sand:#C4A06A; --sandTief:#7A5C2E; --aufSand:#24262A; --salbei:#5A7868; --rose:#B87070; --roseTief:#8F4A4A;
           --berg:#E4E1D8; --bergRand:#CFCABD; --wegOffen:#7C796F;
           --anzeige:'Hanken Grotesk',system-ui,sans-serif; --lese:'Lexend',system-ui,sans-serif }
    @media (prefers-color-scheme: dark){
      :root{ --bg:#22211F; --flaeche:#2B2A26; --text:#E6E3DC; --leise:#B7B3AA; --sandTief:#D9BB8A; --salbei:#7E9F8C;
             --roseTief:#E0A3A3; --berg:#33312C; --bergRand:#4A473F; --wegOffen:#77746C }
    }
    *{ box-sizing:border-box }
    html{ scroll-behavior:smooth; scroll-padding-top:110px }
    @media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto } }
    body{ margin:0; background:var(--bg); color:var(--text); font-family:var(--lese); font-size:16px; line-height:1.5 }
    a{ color:var(--sandTief) }
    a:focus-visible, summary:focus-visible{ outline:3px solid var(--sandTief); outline-offset:3px; border-radius:6px }
    .kopf{ position:sticky; top:0; z-index:5; background:var(--bg); border-bottom:1px solid var(--bergRand) }
    .entwurf{ font-size:14px; color:var(--leise); text-align:center; padding:6px 16px; border-bottom:1px solid var(--bergRand) }
    .etappen{ display:flex; gap:4px; justify-content:center; list-style:none; margin:0; padding:8px 16px; overflow-x:auto }
    .etappen a{ display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; color:var(--leise); font-size:14px; padding:6px 8px; min-height:44px; min-width:44px; border-radius:8px }
    .etappen .punkt{ width:14px; height:14px; border-radius:50%; border:1.5px dashed var(--wegOffen); flex:none }
    .etappen a.erreicht{ color:var(--text) }
    .etappen a.erreicht .punkt{ background:var(--sand); border:1.5px solid var(--sandTief) }
    .etappen a[aria-current]{ background:var(--flaeche) }
    .notfall{ position:fixed; right:16px; bottom:16px; z-index:6; display:inline-flex; align-items:center; gap:8px;
      background:var(--flaeche); color:var(--roseTief); border:1.5px solid var(--rose); border-radius:999px;
      padding:10px 16px; font-size:15px; text-decoration:none; min-height:44px }
    .tal{ min-height:calc(100vh - 100px); display:flex; flex-direction:column; justify-content:center; max-width:1100px; margin:0 auto; padding:48px 16px }
    .marke{ font-size:13px; letter-spacing:.08em; color:var(--leise); margin:0 0 16px }
    h1{ font-family:var(--anzeige); font-weight:700; font-size:clamp(40px,8vw,88px); line-height:1; margin:0 0 24px; max-width:12ch }
    .tal p{ max-width:34rem; margin:0 0 16px }
    .los{ font-size:14px; color:var(--leise) }
    .sprung{ position:absolute; left:16px; top:-60px; z-index:7; background:var(--flaeche); color:var(--text); padding:10px 14px; border-radius:8px }
    .sprung:focus{ top:8px }
    .reise{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:24px; max-width:1100px; margin:0 auto; padding:0 16px }
    .bild{ position:sticky; top:110px; height:calc(100vh - 126px); display:flex; align-items:center; justify-content:center }
    .bild svg{ width:100%; max-height:100% }
    .texte{ padding-bottom:16vh }
    .station{ min-height:88vh; display:flex; flex-direction:column; justify-content:center; max-width:34rem; scroll-margin-top:110px }
    .zahl{ font-family:var(--anzeige); font-weight:700; font-size:clamp(72px,11vw,128px); line-height:.9; color:var(--bergRand); margin:0 }
    .station.erreicht .zahl{ color:var(--sand) }
    h2{ font-family:var(--anzeige); font-weight:700; font-size:32px; line-height:1.15; margin:8px 0 12px }
    .station p{ margin:0 0 12px; max-width:65ch }
    .stempel-zeile{ font-size:14px; color:var(--leise) }
    .hoehe{ font-family:var(--anzeige); font-weight:700; font-size:clamp(56px,9vw,104px); line-height:.95; margin:0 }
    .hoehe small{ font-size:.35em; letter-spacing:.04em; color:var(--leise) }
    .knopf{ display:inline-block; background:var(--sand); color:var(--aufSand); border-radius:12px; padding:14px 22px; text-decoration:none; min-height:44px; margin-top:8px }
    .fuss{ max-width:1100px; margin:0 auto; padding:32px 16px 96px; border-top:1px solid var(--bergRand); font-size:14px; color:var(--leise) }
    .js #weg{ stroke-dasharray:1; stroke-dashoffset:1 }
    .st circle{ fill:var(--flaeche); stroke:var(--wegOffen); stroke-width:1.5; stroke-dasharray:3 3 }
    .st path{ stroke:var(--aufSand); stroke-width:2.2; fill:none; opacity:0 }
    .st.erreicht circle{ fill:var(--sand); stroke:var(--sandTief); stroke-dasharray:none; stroke-width:2.5 }
    .st.erreicht path{ opacity:1 }
    @media (prefers-reduced-motion: no-preference){
      .stempel{ transform-box:fill-box; transform-origin:center }
      .st.erreicht .stempel{ animation:einbrennen .5s cubic-bezier(.2,.8,.2,1) }
      @keyframes einbrennen{ 0%{ transform:scale(1.7); opacity:.15 } 60%{ transform:scale(.94); opacity:1 } 100%{ transform:scale(1) } }
    }
    @media (max-width:767px){
      html{ scroll-padding-top:calc(96px + 30vh); scroll-padding-bottom:72px }
      .etappen{ gap:0 }
      .etappen .name{ position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap }
      .reise{ grid-template-columns:1fr; gap:0 }
      .bild{ top:96px; height:30vh; background:var(--bg); z-index:2; border-bottom:1px solid var(--bergRand); margin:0 -16px; padding:6px 0 }
      .station{ min-height:58vh; justify-content:flex-start; padding-top:24px; scroll-margin-top:calc(96px + 30vh) }
      h2{ font-size:26px }
      .zahl{ font-size:64px }
    }
    @media (max-height:520px){
      html{ scroll-padding-top:0; scroll-padding-bottom:0 }
      .kopf, .bild{ position:static }
      .bild{ height:auto; max-height:40vh }
      .notfall{ position:static; margin:8px 16px }
    }`;

function bildSvg() {
  const d = 'M' + PUNKTE.map((p) => p.join(' ')).join(' L');
  const stationen = PUNKTE.slice(1).map(([x, y], i) => {
    const r = i === PUNKTE.length - 2 ? 16 : 14;
    return `<g class="st"><g class="stempel"><circle cx="${x}" cy="${y}" r="${r}"/><path d="M${x - 7} ${y}l5 5 9-10"/></g></g>`;
  }).join('');
  return `<svg viewBox="0 0 400 700" focusable="false">
        <polygon points="20,690 140,50 210,150 310,30 390,690" fill="var(--berg)" stroke="var(--bergRand)" stroke-width="1"/>
        <path d="${d}" fill="none" stroke="var(--wegOffen)" stroke-width="2" stroke-dasharray="6 6"/>
        <path id="weg" d="${d}" pathLength="1" fill="none" stroke="var(--sand)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${PUNKTE[0][0]}" cy="${PUNKTE[0][1]}" r="6" fill="var(--salbei)"/>
        ${stationen}
      </svg>`;
}

function seite(csp) {
  const n = REISE_STATIONEN.length;
  const leiste = REISE_STATIONEN.map((s, i) =>
    `<li><a href="#${s.key}"><span class="punkt"></span><span class="name">${esc(s.titel)}</span></a></li>`).join('\n        ')
    + `\n        <li><a href="#pass"><span class="punkt"></span><span class="name">Pass</span></a></li>`;
  const stationen = REISE_STATIONEN.map((s, i) => `
      <section class="station" id="${s.key}">
        <p class="zahl" aria-hidden="true">${zwei(i + 1)}</p>
        <h2 id="t-${s.key}">${esc(s.titel)}</h2>
        <p>${esc(s.kurz)}</p>
        <p><a href="${appBeispiel(`chapter/${i}`)}">${esc(s.titel)} im Beispiel ansehen</a></p>
        <p class="stempel-zeile">Station ${i + 1} von ${n}</p>
      </section>`).join('');
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Skript nur als Datei von der eigenen Adresse (script-src 'self'). -->
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <!-- ERZEUGT — nicht von Hand bearbeiten. Quelle: scripts/seiten/reise.mjs · Generator: scripts/build-seiten.mjs -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex, follow">
  <meta name="author" content="Stebler Studios">
  <title>Die Reise: sechs Kapitel bis zum Beispiel — Maloja Plana</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${stil}
  </style>
</head>
<body>
  <a class="sprung" href="#inhalt">Zum Inhalt</a>
  <header class="kopf">
    <p class="entwurf">Entwurf · noch nicht verlinkt</p>
    <nav aria-label="Etappen der Reise">
      <ol class="etappen">
        ${leiste}
      </ol>
    </nav>
  </header>
  <a class="notfall" aria-label="Notfall-Kapitel im Beispiel ansehen" href="${appBeispiel(`chapter/${REISE_NOTFALL_INDEX}`)}">
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v9M7.5 12h9"/></svg>
    Notfall
  </a>
  <main id="inhalt">
  <section class="tal">
    <p class="marke">MALOJA PLANA</p>
    <h1 id="titel">Ein Weg durch Ihr Leben in der Schweiz.</h1>
    <p>Maloja Plana ordnet Ihre Angaben und Unterlagen nach Lebensbereichen.</p>
    <p>${n} Stationen bis zum Pass. An jeder sehen Sie, was Maloja dort festhält.</p>
    <p class="los">Nach unten scrollen, um loszugehen.</p>
  </section>
  <div class="reise">
    <div class="bild" aria-hidden="true">
      ${bildSvg()}
    </div>
    <div class="texte">${stationen}
      <section class="station" id="pass">
        <p class="hoehe">1815 m <small>ü. M.</small></p>
        <h2 id="t-pass">Auf dem Malojapass.</h2>
        <p>Schauen Sie sich Maloja mit Beispieldaten an. Sie müssen dafür nichts eingeben.</p>
        <p><a class="knopf" href="${appBeispiel('dashboard')}">Beispiel ansehen</a></p>
      </section>
    </div>
  </div>
  </main>
  <footer class="fuss">
    <p>Im Ernstfall zählt der Notruf: 144 Sanität · 117 Polizei · 118 Feuerwehr. Das Notfall-Schild führt ins Beispiel, nicht zu einer Hilfe.</p>
    <p>Maloja Plana dient der Orientierung und ersetzt keine Beratung. <a href="/rechtliches/">Impressum und Datenschutz</a></p>
  </footer>
  <script src="/reise/reise.js"></script>
</body>
</html>
`;
}

// Läuft im Browser. Reines ES5 ohne Abhängigkeiten, damit es überall läuft.
const skript = `// ERZEUGT — Quelle: scripts/seiten/reise.mjs
(function () {
  document.documentElement.classList.add('js');
  var punkte = ${JSON.stringify(PUNKTE)};
  var l = [0];
  for (var i = 1; i < punkte.length; i++) {
    var dx = punkte[i][0] - punkte[i - 1][0], dy = punkte[i][1] - punkte[i - 1][1];
    l.push(l[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  var anteile = l.map(function (x) { return x / l[l.length - 1]; });
  var weg = document.getElementById('weg');
  var st = [].slice.call(document.querySelectorAll('.st'));
  var abschnitte = [].slice.call(document.querySelectorAll('.station'));
  var leiste = [].slice.call(document.querySelectorAll('.etappen a'));
  function neu() {
    var schmal = window.matchMedia('(max-width:767px)').matches;
    var mitte = window.innerHeight * (schmal ? 0.66 : 0.55), f = 0, hier = -1;
    abschnitte.forEach(function (a, k) {
      var r = a.getBoundingClientRect();
      var t = Math.min(1, Math.max(0, (mitte - r.top) / r.height));
      if (r.top <= mitte) {
        hier = k;
        f = k === abschnitte.length - 1 ? 1 : anteile[k + 1] + (anteile[Math.min(k + 2, anteile.length - 1)] - anteile[k + 1]) * t;
      }
      a.classList.toggle('erreicht', r.top <= mitte);
    });
    if (weg) weg.style.strokeDashoffset = String(1 - f);
    st.forEach(function (g, i) { g.classList.toggle('erreicht', f >= anteile[i + 1] - 0.001); });
    leiste.forEach(function (a, i) {
      a.classList.toggle('erreicht', i <= hier);
      if (i === hier) {
        if (a.getAttribute('aria-current') !== 'step') {
          var ol = a.parentNode.parentNode;
          if (a.offsetLeft < ol.scrollLeft || a.offsetLeft + a.offsetWidth > ol.scrollLeft + ol.clientWidth) ol.scrollLeft = a.offsetLeft - 16;
        }
        a.setAttribute('aria-current', 'step');
      } else a.removeAttribute('aria-current');
    });
  }
  var geplant = false;
  window.addEventListener('scroll', function () {
    if (!geplant) { geplant = true; window.requestAnimationFrame(function () { geplant = false; neu(); }); }
  }, { passive: true });
  window.addEventListener('resize', neu);
  neu();
})();
`;

// Alle Dateien der Reise, relativ zu public/.
export function reiseAusgaben({ csp }) {
  return [
    { pfad: 'reise/index.html', inhalt: seite(csp) },
    { pfad: 'reise/reise.js', inhalt: skript },
  ];
}
