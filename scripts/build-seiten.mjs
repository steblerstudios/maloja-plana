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
import { BASIS, SEITEN, SONDERSEITEN, GEPRUEFT, inhaltFuer, quelleFuer } from './seiten-inhalt.mjs';
import { SPRACHEN, RAHMEN, SPRACHNAME } from './seiten-sprachen.mjs';

// Alle erzeugten Seiten. SEITEN sind die Erklärseiten (mit FAQ, Werbekarte,
// Quellen, Querverweisen), SONDERSEITEN die Rechtliches-Seite — sie hat nichts
// davon und soll auch nichts davon haben.
const ALLE = [...SEITEN, ...SONDERSEITEN];

// ─── Sprachen (seit 21.09.2026) ─────────────────────────────────────────────
// Deutsch liegt weiter unter /<pfad>/, die übrigen unter /<sprache>/<pfad>/.
// Welche Sprache öffentlich zählt, steht in seiten-sprachen.mjs und NUR dort.
const url = (pfad, sprache) => `${BASIS}/${sprache.praefix}${pfad}/`;
const pfadIntern = (pfad, sprache) => `/${sprache.praefix}${pfad}/`;

// Der hreflang-Ring. Er nennt ausschliesslich freigegebene Sprachen: auf eine
// Seite zu verweisen, die noch niemand gelesen hat, wäre eine Empfehlung, die
// wir nicht geben wollen. Steht nur eine Sprache frei, ist ein Ring aus einem
// Glied sinnlos — dann bleibt er weg.
function hreflangRing(pfad) {
  const frei = SPRACHEN.filter((s) => s.freigegeben);
  if (frei.length < 2) return '';
  const zeilen = frei.map((s) =>
    `  <link rel="alternate" hreflang="${s.htmlLang}" href="${url(pfad, s)}">`);
  const standard = frei.find((s) => s.code === 'de') || frei[0];
  zeilen.push(`  <link rel="alternate" hreflang="x-default" href="${url(pfad, standard)}">`);
  return '\n' + zeilen.join('\n');
}

// Sichtbarer Sprachumschalter. Zeigt auch nicht freigegebene Sprachen — wer
// die Seite auf Italienisch sucht, soll sie finden können, auch solange sie
// `noindex` trägt. Die aktive Sprache steht ohne Link da.
function sprachWaehler(pfad, aktiv) {
  const glieder = SPRACHEN.map((s) => (s.code === aktiv.code
    ? `<span aria-current="true">${SPRACHNAME[s.code]}</span>`
    : `<a href="${pfadIntern(pfad, s)}" hreflang="${s.htmlLang}">${SPRACHNAME[s.code]}</a>`));
  return glieder.join(' · ');
}

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
    .hinweis{ font-size:14px; color:var(--leise); margin:0 0 4px }
    .leise{ font-size:14px; color:var(--leise) }
    .vorbehalt{ font-size:14px; color:var(--leise); border-left:2px solid var(--rand);
      padding-left:14px; margin:32px 0 }
    footer{ border-top:1px solid var(--rand); margin-top:48px; padding:22px 0 56px;
      font-size:13px; color:var(--leise) }
    footer a{ color:var(--leise) }
    footer p{ margin-bottom:6px }
    /* Sprachumschalter — leise, am Ende, nie als Hauptnavigation. */
    footer .sprachen{ margin-top:14px }
    footer .sprachen a{ text-decoration:underline }
    footer .sprachen span[aria-current]{ color:var(--text); font-weight:600 }
    /* Nur sichtbar, solange eine Sprache nicht gegengelesen ist. Ruhig, aber
       nicht übersehbar: wer hier liest, soll wissen, woran er ist. */
    .entwurf{ border:1px solid var(--gold); border-radius:6px; padding:12px 14px;
      margin-bottom:24px; font-size:14px; color:var(--leise); background:var(--flaeche) }
    @media (max-width:600px){ h1{ font-size:26px } .vorspann{ font-size:17px } }`;

function seiteBauen(seite, sprache) {
  const R = RAHMEN[sprache.code];
  const inhalt = inhaltFuer(sprache.code);
  const seitenUrl = url(seite.pfad, sprache);
  const istErklaerseite = inhalt.seiten.includes(seite);
  const andere = inhalt.seiten.filter((s) => s.pfad !== seite.pfad);

  const abschnitte = seite.abschnitte.map((a) => {
    const absaetze = a.absaetze.map((p) => `        <p>${p}</p>`).join('\n');
    let verweise = '';
    if (a.verweise) {
      const punkte = a.verweise.map((p) => {
        const z = inhalt.seiten.find((s) => s.pfad === p);
        return `          <li><a href="${pfadIntern(z.pfad, sprache)}">${esc(z.brotkrume)}</a>` +
               `<span>${esc(z.beschreibung)}</span></li>`;
      }).join('\n');
      verweise = `\n        <ul class="weiter">\n${punkte}\n        </ul>`;
    }
    return `        <h2>${esc(a.titel)}</h2>\n${absaetze}${verweise}`;
  }).join('\n\n');

  const faq = seite.faq.map((f) =>
    `        <h3>${esc(f.frage)}</h3>\n        <p>${f.antwort}</p>`).join('\n\n');

  // Quellen in der Sprache der Seite, soweit es sie dort gibt. Wo nicht, steht
  // die deutsche Adresse da — mit sichtbarem Vermerk statt stillschweigend.
  const quellen = (seite.quellen || []).map((k) => {
    const s = quelleFuer(k, sprache.code);
    const vermerk = s.nurDeutsch ? ` <span class="leise">(${esc(R.nurDeutsch)})</span>` : '';
    return `          <li><a href="${esc(s.url)}" rel="noopener">${esc(s.text)}</a>${vermerk}</li>`;
  }).join('\n');

  const weiterlesen = (istErklaerseite ? andere : inhalt.seiten).map((s) =>
    `          <li><a href="${pfadIntern(s.pfad, sprache)}">${esc(s.brotkrume)}</a></li>`).join('\n');

  // JSON-LD. FAQPage ist hier zulässig, WEIL die Fragen und Antworten auf der
  // Seite sichtbar stehen — Google verlangt genau das. Der Text im strukturierten
  // Datum ist derselbe wie im sichtbaren, nur ohne Tags.
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${seitenUrl}#webpage`,
        url: seitenUrl,
        name: seite.titel,
        description: seite.beschreibung,
        inLanguage: sprache.ldLang,
        isPartOf: { '@id': `${BASIS}/#website` },
        publisher: { '@id': `${BASIS}/#org` },
        about: { '@id': `${BASIS}/#app` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${seitenUrl}#krume`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Maloja Plana', item: `${BASIS}/` },
          { '@type': 'ListItem', position: 2, name: seite.brotkrume, item: seitenUrl },
        ],
      },
      ...(seite.faq.length ? [{
        '@type': 'FAQPage',
        '@id': `${seitenUrl}#faq`,
        isPartOf: { '@id': `${seitenUrl}#webpage` },
        mainEntity: seite.faq.map((f) => ({
          '@type': 'Question',
          name: nurText(f.frage),
          acceptedAnswer: { '@type': 'Answer', text: nurText(f.antwort) },
        })),
      }] : []),
    ],
  };

  return `<!DOCTYPE html>
<html lang="${sprache.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Strenger als die App-CSP: hier läuft gar kein Skript, und es gibt keine
       Fremdressourcen. JSON-LD ist kein ausführbares Skript und braucht kein
       script-src. -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'none'; form-action 'none'">
  <!-- ERZEUGT — nicht von Hand bearbeiten.
       Quelle: ${sprache.code === 'de' ? 'scripts/seiten-inhalt.mjs' : `scripts/seiten/${sprache.code}.mjs`}
       Sprachen + Freigabe: scripts/seiten-sprachen.mjs
       Generator: scripts/build-seiten.mjs
       Neu bauen:  node scripts/build-seiten.mjs
       Prüfen:     node scripts/build-seiten.mjs --pruefen -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <!-- ${sprache.freigegeben
    ? 'Freigegeben: diese Sprache ist gegengelesen und darf indexiert werden.'
    : 'NICHT freigegeben: Übersetzung ohne menschliche Gegenlesung. noindex, bis ein Mensch sie gelesen und scripts/seiten-sprachen.mjs umgestellt hat.'} -->
  <meta name="robots" content="${sprache.freigegeben ? 'index, follow' : 'noindex, follow'}">
  <meta name="author" content="Stebler Studios">
  <meta name="theme-color" content="#F2F2F0">
  <title>${esc(seite.titel)} — Maloja Plana</title>
  <meta name="description" content="${esc(seite.beschreibung)}">
  <link rel="canonical" href="${seitenUrl}">${hreflangRing(seite.pfad)}

  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(seite.titel)}">
  <meta property="og:description" content="${esc(seite.beschreibung)}">
  <meta property="og:url" content="${seitenUrl}">
  <meta property="og:image" content="${BASIS}/og-image.png">
  <meta property="og:locale" content="${sprache.ogLocale}">
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
      <nav class="krume" aria-label="${esc(R.krumeLabel)}">
        <a href="/">${esc(R.start)}</a> › ${esc(seite.brotkrume)}
      </nav>
    </header>

    <main>
${R.entwurfBanner ? `      <p class="entwurf" role="note">${esc(R.entwurfBanner)}</p>\n` : ''}      <h1>${esc(seite.titel)}</h1>
      <p class="vorspann">${seite.vorspann}</p>
${istErklaerseite ? `      <p class="hinweis">${esc(R.kurzhinweis)}</p>` : ''}

${abschnitte}

${seite.faq.length ? `      <h2>${esc(R.faqTitel)}</h2>
${faq}
` : ''}

${istErklaerseite ? `      <div class="karte">
        <p><strong>${esc(R.karteTitel)}</strong></p>
        <p>${esc(R.karteText)}</p>
        <p>${R.karteBeta}</p>
        <p><a class="knopf" href="/">${esc(R.karteKnopf)}</a></p>
      </div>

      <h2>${esc(R.quellenTitel)}</h2>
      <ul>
${quellen}
      </ul>
      <p class="leise">${esc(R.quellenLeise)}</p>` : ''}

${istErklaerseite ? `      <p class="vorbehalt">${R.vorbehalt}${sprache.geprueft
        ? `<br>\n      <strong>${esc(R.geprueftLabel)}: ${esc(sprache.geprueft)}.</strong>` : ''}</p>` : ''}

      <h2>${esc(R.weiterlesenTitel)}</h2>
      <ul>
${weiterlesen}
${istErklaerseite ? `          <li><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a></li>` : ''}
      </ul>
    </main>

    <footer>
      <p>${esc(R.fussProjekt)} ·
      <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a></p>
      <p>${esc(R.fussQuelloffen)}
      <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a> ·
      <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">${esc(R.fussQuellcode)}</a></p>
      <p><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a> —
      ${esc(R.fussOhneCode)}</p>
      <p class="sprachen">${esc(R.spracheLabel)}: ${sprachWaehler(seite.pfad, sprache)}</p>
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
  const frei = SPRACHEN.filter((s) => s.freigegeben);

  // Alternativen je Seite — nur freigegebene Sprachen. Eine Sitemap, die auf
  // ungelesene Übersetzungen zeigt, lädt Google ausdrücklich dazu ein, sie
  // aufzunehmen. Genau das soll die Freigabe verhindern.
  const alternativen = (pfad) => (frei.length < 2 ? '' : frei.map((s) =>
    `\n    <xhtml:link rel="alternate" hreflang="${s.htmlLang}" href="${url(pfad, s)}"/>`).join(''));

  const eintrag = (loc, prioritaet, pfad) =>
    `  <url>\n    <loc>${loc}</loc>${pfad === null ? '' : alternativen(pfad)}\n` +
    `    <lastmod>${heute}</lastmod>\n` +
    `    <changefreq>weekly</changefreq>\n    <priority>${prioritaet}</priority>\n  </url>`;

  const zeilen = [eintrag(`${BASIS}/`, '1.0', null)];
  for (const s of frei) {
    const i = inhaltFuer(s.code);
    zeilen.push(...i.seiten.map((x) => eintrag(url(x.pfad, s), '0.8', x.pfad)));
    zeilen.push(...i.sonderseiten.map((x) => eintrag(url(x.pfad, s), '0.3', x.pfad)));
  }

  const nichtFrei = SPRACHEN.filter((s) => !s.freigegeben).map((s) => s.code);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  ERZEUGT — nicht von Hand bearbeiten.
  Quelle: scripts/seiten-inhalt.mjs · Generator: scripts/build-seiten.mjs
  Neu bauen: node scripts/build-seiten.mjs

  Nur kanonische URLs. Die ?lang=-Adressen standen bis zum 20.09.2026 hier und
  sind raus: sie liefern gemessen byte-identisches deutsches HTML und zeigen
  canonical auf «/», Google hätte alle als «Alternative Seite mit richtigem
  kanonischem Tag» verworfen.

  Seit 21.09.2026 gibt es echte Sprachpfade (/fr/…, /it/…, /en/…, /rm/…).
  Hier stehen nur FREIGEGEBENE Sprachen.${nichtFrei.length ? `
  Nicht in dieser Sitemap, weil noch nicht gegengelesen: ${nichtFrei.join(', ')}.
  Diese Seiten existieren und tragen «noindex, follow». Freigabe:
  scripts/seiten-sprachen.mjs, Feld \`freigegeben\`.` : ''}
  Befund: docs/audits/seo-audit-2026-09-20.md
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${zeilen.join('\n')}
</urlset>
`;
}

let abweichungen = 0;

// Jede Seite in jeder Sprache. Deutsch bleibt unter public/<pfad>/, die
// übrigen unter public/<sprache>/<pfad>/ — die Verzeichnisse legt der
// Generator selbst an.
const seitenAusgaben = [];
for (const sprache of SPRACHEN) {
  const i = inhaltFuer(sprache.code);
  for (const s of [...i.seiten, ...i.sonderseiten]) {
    const name = `${sprache.praefix}${s.pfad}/index.html`;
    seitenAusgaben.push({
      ziel: resolve(WURZEL, 'public', ...`${sprache.praefix}${s.pfad}`.split('/'), 'index.html'),
      inhalt: seiteBauen(s, sprache),
      name,
    });
  }
}

const ausgaben = [
  ...seitenAusgaben,
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

const frei = SPRACHEN.filter((s) => s.freigegeben).map((s) => s.code);
const offen = SPRACHEN.filter((s) => !s.freigegeben).map((s) => s.code);

if (NUR_PRUEFEN) {
  if (abweichungen) {
    console.error(`\n✗ ${abweichungen} Seite(n) veraltet — neu bauen:  node scripts/build-seiten.mjs`);
    process.exit(1);
  }
  console.log(`\n✓ Alle ${seitenAusgaben.length} Seiten und die Sitemap stimmen mit der Quelle überein.`);
} else {
  console.log(`\n✓ ${seitenAusgaben.length} Seiten (${ALLE.length} × ${SPRACHEN.length} Sprachen) + sitemap.xml erzeugt.`);
}
console.log(`  indexierbar: ${frei.join(', ')}` +
  (offen.length ? `  ·  noindex bis zur Gegenlesung: ${offen.join(', ')}` : ''));
