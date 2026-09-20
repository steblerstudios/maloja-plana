#!/usr/bin/env node
// ─── Erzeugt die öffentlichen Erklärseiten als statisches HTML ───────────────
//
//   node scripts/build-seiten.mjs            # schreibt nach public/<pfad>/index.html
//   node scripts/build-seiten.mjs --pruefen  # schreibt nichts, meldet Abweichungen
//
// Warum statisch und nicht als React-Route:
//   • Die App rendert clientseitig und liegt hinter BetaGate — eine Route dahinter
//     wäre für Suchmaschinen genauso unsichtbar wie alles andere.
//   • Die App nutzt Hash-Routing (#/…), es gibt kein Pfad-Routing. Echte Pfade
//     kollidieren also mit nichts.
//   • Auf dem Server (Infomaniak/Apache) liegt keine Rewrite-Regel, und die
//     .htaccess wird bewusst nicht mitdeployt. Ein Verzeichnis mit index.html
//     funktioniert ohne jede Server-Änderung.
//   • Kein JavaScript, keine Abhängigkeit, kein Bundle-Zuwachs.
//
// Das Ergebnis wird COMMITTET (wie src/data/plzGemeinde.js aus
// build-plz-data.mjs): im Diff ist dann zu sehen, was tatsächlich live geht.
// --pruefen hält Quelle und Ergebnis zusammen; der Test ruft es auf.
//
// Inhalt und Wahrheits-Regeln: scripts/seiten-inhalt.mjs
// Befund: docs/audits/seo-audit-2026-09-20.md

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASIS, SEITEN, QUELLEN } from './seiten-inhalt.mjs';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NUR_PRUEFEN = process.argv.includes('--pruefen');

// HTML-Maskierung für Attribute und Textknoten. Nicht für die Absätze im
// Inhalt — die dürfen bewusst <strong> und <em> tragen und sind redaktionell
// gepflegt, nicht aus Nutzereingaben.
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Für JSON-LD: Tags raus, damit im strukturierten Datum reiner Text steht und
// er zum sichtbaren Text passt (Google verlangt Übereinstimmung).
const nurText = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const stil = `
    *{ margin:0; padding:0; box-sizing:border-box }
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-400-normal.woff2') format('woff2');
      font-weight:400; font-display:swap }
    @font-face{ font-family:'Lexend'; src:url('/fonts/lexend-latin-600-normal.woff2') format('woff2');
      font-weight:600; font-display:swap }
    :root{ --bg:#F2F2F0; --flaeche:#FBFBFA; --text:#24262A; --leise:#6A6E74;
           --rand:#E0DDD8; --gold:#C4A870; --salbei:#7E9F8C }
    @media (prefers-color-scheme: dark){
      :root{ --bg:#22211F; --flaeche:#2A2927; --text:#E8E6E1; --leise:#A8A5A0;
             --rand:#3A3936; --gold:#C4A870; --salbei:#8FB09C }
      html{ color-scheme:dark }
    }
    body{ background:var(--bg); color:var(--text); line-height:1.65;
      font-family:'Lexend',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; font-kerning:normal }
    .rahmen{ max-width:680px; margin:0 auto; padding:0 24px }
    a{ color:inherit; text-decoration:underline; text-underline-offset:2px }
    a:hover{ color:var(--salbei) }
    header{ padding:28px 0 0 }
    .marke{ display:inline-block; font-weight:600; text-decoration:none; font-size:15px }
    nav.krume{ font-size:13px; color:var(--leise); margin-top:20px }
    main{ padding:8px 0 16px }
    h1{ font-size:32px; line-height:1.25; font-weight:600; margin:16px 0 12px; letter-spacing:-0.01em }
    .vorspann{ font-size:18px; color:var(--text); margin-bottom:8px }
    h2{ font-size:20px; font-weight:600; margin:40px 0 12px; letter-spacing:-0.005em }
    h3{ font-size:16px; font-weight:600; margin:24px 0 6px }
    p{ margin-bottom:14px }
    ul{ margin:0 0 14px 22px } li{ margin-bottom:8px }
    .karte{ background:var(--flaeche); border:1px solid var(--rand); border-radius:10px;
      padding:20px 22px; margin:28px 0 }
    .karte p:last-child{ margin-bottom:0 }
    .weiter{ list-style:none; margin:16px 0 0; padding:0 }
    .weiter li{ margin-bottom:10px }
    .weiter a{ font-weight:600; text-decoration:none }
    .weiter a:hover{ text-decoration:underline }
    .weiter span{ display:block; font-size:14px; color:var(--leise); font-weight:400 }
    .knopf{ display:inline-block; background:var(--gold); color:#24262A; text-decoration:none;
      padding:11px 20px; border-radius:6px; font-weight:600; font-size:15px; margin-top:4px }
    .vorbehalt{ font-size:14px; color:var(--leise); border-left:2px solid var(--rand);
      padding-left:14px; margin:32px 0 }
    footer{ border-top:1px solid var(--rand); margin-top:48px; padding:22px 0 56px;
      font-size:13px; color:var(--leise) }
    footer a{ color:var(--leise) }
    footer p{ margin-bottom:6px }
    @media (max-width:600px){ h1{ font-size:26px } .vorspann{ font-size:17px } }`;

function seiteBauen(seite) {
  const url = `${BASIS}/${seite.pfad}/`;
  const andere = SEITEN.filter((s) => s.pfad !== seite.pfad);

  const abschnitte = seite.abschnitte.map((a) => {
    const absaetze = a.absaetze.map((p) => `        <p>${p}</p>`).join('\n');
    let verweise = '';
    if (a.verweise) {
      const punkte = a.verweise.map((p) => {
        const z = SEITEN.find((s) => s.pfad === p);
        return `          <li><a href="/${z.pfad}/">${esc(z.brotkrume)}</a>` +
               `<span>${esc(z.beschreibung)}</span></li>`;
      }).join('\n');
      verweise = `\n        <ul class="weiter">\n${punkte}\n        </ul>`;
    }
    return `        <h2>${esc(a.titel)}</h2>\n${absaetze}${verweise}`;
  }).join('\n\n');

  const faq = seite.faq.map((f) =>
    `        <h3>${esc(f.frage)}</h3>\n        <p>${f.antwort}</p>`).join('\n\n');

  const quellen = (seite.quellen || []).map((k) => {
    const s = QUELLEN[k];
    return `          <li><a href="${esc(s.url)}" rel="noopener">${esc(s.text)}</a></li>`;
  }).join('\n');

  const weiterlesen = andere.map((s) =>
    `          <li><a href="/${s.pfad}/">${esc(s.brotkrume)}</a></li>`).join('\n');

  // JSON-LD. FAQPage ist hier zulässig, WEIL die Fragen und Antworten auf der
  // Seite sichtbar stehen — Google verlangt genau das. Der Text im strukturierten
  // Datum ist derselbe wie im sichtbaren, nur ohne Tags.
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: seite.titel,
        description: seite.beschreibung,
        inLanguage: 'de-CH',
        isPartOf: { '@id': `${BASIS}/#website` },
        publisher: { '@id': `${BASIS}/#org` },
        about: { '@id': `${BASIS}/#app` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#krume`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Maloja Plana', item: `${BASIS}/` },
          { '@type': 'ListItem', position: 2, name: seite.brotkrume, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: seite.faq.map((f) => ({
          '@type': 'Question',
          name: nurText(f.frage),
          acceptedAnswer: { '@type': 'Answer', text: nurText(f.antwort) },
        })),
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- ERZEUGT — nicht von Hand bearbeiten.
       Quelle: scripts/seiten-inhalt.mjs · Generator: scripts/build-seiten.mjs
       Neu bauen:  node scripts/build-seiten.mjs
       Prüfen:     node scripts/build-seiten.mjs --pruefen -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Stebler Studios">
  <meta name="theme-color" content="#F2F2F0">
  <title>${esc(seite.titel)} — Maloja Plana</title>
  <meta name="description" content="${esc(seite.beschreibung)}">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(seite.titel)}">
  <meta property="og:description" content="${esc(seite.beschreibung)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASIS}/og-image.png">
  <meta property="og:locale" content="de_CH">
  <meta property="og:site_name" content="Maloja Plana">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(seite.titel)}">
  <meta name="twitter:description" content="${esc(seite.beschreibung)}">
  <meta name="twitter:image" content="${BASIS}/og-image.png">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/icon-192.png">
  <link rel="preload" href="/fonts/lexend-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2).split('\n').map((l) => '  ' + l).join('\n')}
  </script>
  <style>${stil}
  </style>
</head>
<body>
  <div class="rahmen">
    <header>
      <a class="marke" href="/">Maloja&nbsp;Plana</a>
      <nav class="krume" aria-label="Sie sind hier">
        <a href="/">Start</a> › ${esc(seite.brotkrume)}
      </nav>
    </header>

    <main>
      <h1>${esc(seite.titel)}</h1>
      <p class="vorspann">${seite.vorspann}</p>

${abschnitte}

      <h2>Häufige Fragen</h2>
${faq}

      <div class="karte">
        <p><strong>Maloja Plana rechnet das für Ihre Situation durch.</strong></p>
        <p>Ein Schweizer Lebensordner — Steuern, Prämienverbilligung, Sozialhilfe,
        Mindestlohn, Vorsorge und Notfallkarte an einem Ort. Alle Angaben bleiben
        auf Ihrem Gerät: kein Konto, kein Server, kein Tracking. Kostenlos und
        quelloffen. Die App ist zurzeit in einer geschlossenen Beta.</p>
        <p><a class="knopf" href="/">Maloja Plana öffnen</a></p>
      </div>

      <h2>Amtliche Quellen</h2>
      <ul>
${quellen}
      </ul>

      <p class="vorbehalt">Diese Seite ist eine <strong>Orientierungshilfe auf Basis
      öffentlicher Informationen — keine Rechts- oder Finanzberatung</strong>. Sie nennt
      bewusst keine Beträge, Fristen oder Einkommensgrenzen: die sind kantonal
      verschieden und ändern regelmässig. Massgebend ist immer die Auskunft
      beziehungsweise die Verfügung der zuständigen Stelle.</p>

      <h2>Weiterlesen</h2>
      <ul>
${weiterlesen}
      </ul>
    </main>

    <footer>
      <p>Maloja Plana ist ein Projekt von Stebler Studios, Basel ·
      <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a></p>
      <p>Quelloffen unter
      <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a> ·
      <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">Quellcode auf GitHub</a></p>
      <p>Datenschutz und Rechtliches stehen in der App — sie sind auch ohne
      Zugangscode lesbar.</p>
    </footer>
  </div>
</body>
</html>
`;
}

// Die Sitemap kommt aus derselben Quelle wie die Seiten. Von Hand gepflegt ist
// sie dreimal abgedriftet (Audit-Befund); so kann die Liste gar nicht mehr
// auseinanderlaufen. Nur kanonische URLs — die ?lang=-Adressen liefern
// byte-identisches HTML und zeigen canonical auf «/», siehe Audit.
// <lastmod> setzt deploy.sh beim Deploy auf den Tag des Uploads; der Wert hier
// ist nur der Stand im Repo.
function sitemapBauen() {
  const heute = new Date().toISOString().slice(0, 10);
  const eintrag = (loc, prioritaet) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${heute}</lastmod>\n` +
    `    <changefreq>weekly</changefreq>\n    <priority>${prioritaet}</priority>\n  </url>`;
  const zeilen = [
    eintrag(`${BASIS}/`, '1.0'),
    ...SEITEN.map((s) => eintrag(`${BASIS}/${s.pfad}/`, '0.8')),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  ERZEUGT — nicht von Hand bearbeiten.
  Quelle: scripts/seiten-inhalt.mjs · Generator: scripts/build-seiten.mjs
  Neu bauen: node scripts/build-seiten.mjs

  Nur kanonische URLs. Die ?lang=-Adressen standen bis zum 20.09.2026 hier und
  sind raus: sie liefern gemessen byte-identisches deutsches HTML und zeigen
  canonical auf «/», Google hätte alle als «Alternative Seite mit richtigem
  kanonischem Tag» verworfen. Sie kommen zurück, sobald die Sprachvarianten
  eigenen Inhalt ausliefern.
  Befund: docs/audits/seo-audit-2026-09-20.md
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${zeilen.join('\n')}
</urlset>
`;
}

let abweichungen = 0;
const ausgaben = [
  ...SEITEN.map((s) => ({ ziel: resolve(WURZEL, 'public', s.pfad, 'index.html'), inhalt: seiteBauen(s), name: `${s.pfad}/index.html` })),
  { ziel: resolve(WURZEL, 'public', 'sitemap.xml'), inhalt: sitemapBauen(), name: 'sitemap.xml' },
];

for (const { ziel, inhalt, name } of ausgaben) {
  const alt = existsSync(ziel) ? readFileSync(ziel, 'utf8') : null;

  if (NUR_PRUEFEN) {
    // Das Datum in der Sitemap ändert täglich und ist kein Abweichungsgrund —
    // sonst wäre die Prüfung ab morgen dauerhaft rot und damit wertlos.
    const norm = (s) => (s || '').replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod/>');
    if (norm(alt) !== norm(inhalt)) {
      console.error(`✗ ${name} weicht von der Quelle ab`);
      abweichungen++;
    } else {
      console.log(`  ✓ ${name} aktuell`);
    }
    continue;
  }

  mkdirSync(dirname(ziel), { recursive: true });
  writeFileSync(ziel, inhalt, 'utf8');
  console.log(`  ✓ public/${name}  (${(inhalt.length / 1024).toFixed(1)} kB)`);
}

if (NUR_PRUEFEN) {
  if (abweichungen) {
    console.error(`\n✗ ${abweichungen} Seite(n) veraltet — neu bauen:  node scripts/build-seiten.mjs`);
    process.exit(1);
  }
  console.log(`\n✓ Alle ${SEITEN.length} Seiten und die Sitemap stimmen mit der Quelle überein.`);
} else {
  console.log(`\n✓ ${SEITEN.length} Seiten + sitemap.xml erzeugt.`);
}
