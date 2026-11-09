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
import { HINTERGRUND } from './seiten/hintergrund.mjs';
import { zahlen, einsetzen, BLOECKE as BLOECKE_FIGUREN, BEWEGT, bewegtSkripte, bewegtGemeinsam, praemieBuehneSvg } from './seiten-figuren.mjs';
import { vergleichZahlen, BLOECKE_VERGLEICH } from './seiten-vergleich.mjs';

// Tabellen und Bilder aller Hintergrundseiten, an <!--FIG:…--> / <!--TAB:…-->.
const BLOECKE = { ...BLOECKE_FIGUREN, ...BLOECKE_VERGLEICH };

// Alle erzeugten Seiten. SEITEN sind die Erklärseiten (mit FAQ, Werbekarte,
// Quellen, Querverweisen), SONDERSEITEN die Rechtliches-Seite — sie hat nichts
// davon und soll auch nichts davon haben.
const ALLE = [...SEITEN, ...SONDERSEITEN];

// ─── Sprachen (seit 21.09.2026) ─────────────────────────────────────────────
// Deutsch liegt weiter unter /<pfad>/, die übrigen unter /<sprache>/<pfad>/.
// Welche Sprache öffentlich zählt, steht in seiten-sprachen.mjs und NUR dort.
const url = (pfad, sprache) => `${BASIS}/${sprache.praefix}${pfad}/`;

// Wohin «Beispiel ansehen» auf einer Seite führt: direkt zum passenden Werkzeug der App statt auf «/».
// Das Beta-Tor lässt die Adresse durch — nach «Ohne Code ausprobieren» steht man dort, mit Code ebenso.
// Seitenlandkarte E1, 05.11.2026 (Wächter: src/__tests__/erklaerseiteZumWerkzeug.test.js).
// Ohne Eintrag bleibt der Knopf auf «/». Ziele sind App-Ansichten aus VALID_VIEWS, keine Umleitungen.
const WERKZEUG_IN_DER_APP = {
  'was-steht-mir-zu': 'situationen',
  praemienverbilligung: 'premium',
  sozialhilfe: 'sozialhilfe',
  steuern: 'tax',
  krankenkasse: 'praemien',
  'kantone-im-vergleich': 'praemien',
  // E-A (Wege durch Maloja, 07.11.2026): dieselben Daten wie Kantone im Vergleich, erste Karte ist die Prämie.
  // Politsystem bleibt bei der Startseite: kein Werkzeug rechnet Politik.
  kantonsatlas: 'praemien',
};
const beispielZiel = (pfad) => (WERKZEUG_IN_DER_APP[pfad] ? `/#/${WERKZEUG_IN_DER_APP[pfad]}` : '/');
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
           --rand:#E0DDD8; --gold:#C4A870 }
    @media (prefers-color-scheme: dark){
      :root{ --bg:#22211F; --flaeche:#2A2927; --text:#E8E6E1; --leise:#A8A5A0;
             --rand:#3A3936; --gold:#C4A870 }
      html{ color-scheme:dark }
    }
    body{ background:var(--bg); color:var(--text); line-height:1.65;
      font-family:'Lexend',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; font-kerning:normal }
    .rahmen{ max-width:680px; margin:0 auto; padding:0 24px }
    a{ color:inherit; text-decoration:underline; text-underline-offset:2px }
    /* Hover ohne Farbwechsel: Salbei #7E9F8C hatte auf #F2F2F0 nur 2.6:1 (WCAG 1.4.3 verlangt 4.5:1).
       Die Rückmeldung kommt jetzt über die dickere Unterstreichung, die Schrift bleibt in --text. */
    a:hover{ text-decoration-thickness:2px }
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
    /* Nach der Freigabe: nur noch die Angabe, welche Fassung gilt. Leise. */
    .verbindlich{ margin-bottom:20px; font-size:14px; color:var(--leise) }
    @media (max-width:600px){ h1{ font-size:26px } .vorspann{ font-size:17px } }`;

// Der Hinweis über dem Titel hängt an der FREIGABE, nicht daran, ob ein Text
// in RAHMEN steht (Befund Rechtsprüfung 05.11.2026):
//   · nicht freigegeben → Entwurfs-Hinweis («noch nicht gelesen, Deutsch gilt»)
//   · freigegeben, Übersetzung → nur noch «bei Abweichungen gilt Deutsch».
// Ohne die zweite Zeile verschwände mit dem Entwurfs-Hinweis auch die einzige
// Stelle, die sagt, welche Fassung verbindlich ist.
function hinweisOben(sprache) {
  const R = RAHMEN[sprache.code];
  if (!sprache.freigegeben && R.entwurfBanner) {
    return `      <p class="entwurf" role="note">${esc(R.entwurfBanner)}</p>\n`;
  }
  if (sprache.freigegeben && R.verbindlich) {
    return `      <p class="verbindlich" role="note">${esc(R.verbindlich)}</p>\n`;
  }
  return '';
}

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

  // Hintergrundseiten gibt es nur auf Deutsch — darum verweist nur die deutsche
  // Fassung darauf, nie eine Übersetzung auf eine Seite in einer anderen Sprache.
  const hintergrundVerweise = (sprache.code === 'de' ? seite.hintergrund || [] : []).map((p) => {
    const z = HINTERGRUND.find((h) => h.pfad === p);
    if (!z) throw new Error(`${seite.pfad}: unbekannte Hintergrundseite ${p}`);
    return `\n          <li><a href="${pfadIntern(z.pfad, sprache)}">${esc(z.titel)}</a></li>`;
  }).join('');

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

  return `${kopf({
    seite, sprache, seitenUrl, ld,
    quelle: sprache.code === 'de' ? 'scripts/seiten-inhalt.mjs' : `scripts/seiten/${sprache.code}.mjs`,
    hreflang: hreflangRing(seite.pfad),
  })}

    <main>
${hinweisOben(sprache)}      <h1>${esc(seite.titel)}</h1>
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
        <p><a class="knopf" href="${beispielZiel(seite.pfad)}">${esc(R.karteKnopf)}</a></p>
      </div>

      <h2>${esc(R.quellenTitel)}</h2>
      <ul>
${quellen}
      </ul>
      <p class="leise">${esc(R.quellenLeise)}</p>` : ''}

${istErklaerseite ? `      <p class="vorbehalt">${R.vorbehalt}${sprache.geprueft
        ? `<br>\n      <strong>${esc(R.geprueftLabel)}: ${esc(sprache.geprueft)}.</strong>${R.originalGeprueft ? ` ${esc(R.originalGeprueft)}` : ''}` : ''}</p>` : ''}

      <h2>${esc(R.weiterlesenTitel)}</h2>
      <ul>
${weiterlesen}${hintergrundVerweise}
${istErklaerseite ? `          <li><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a></li>` : ''}
      </ul>
    </main>

${fuss(sprache, `${esc(R.spracheLabel)}: ${sprachWaehler(seite.pfad, sprache)}`)}`;
}

// ─── Sprach-Startseiten /fr/ /it/ /en/ /rm/ (seit 09.11.2026) ───────────────
// Bis dahin antworteten die Sprachwurzeln mit «403 Access forbidden» (kein index.html,
// Gesamtbefund S6). Die Server-.htaccess geht nicht mit dem Deploy, darum hier eine Seite,
// die mit den Erklärseiten ausgeliefert wird. Sie bringt KEINEN neuen Text: Titel, Liste und
// Karte kommen aus RAHMEN und den Seiten der Sprache, die schon übersetzt sind. Der Knopf
// führt in die App in derselben Sprache (/?lang=xx). Freigabe wie jede Seite der Sprache:
// gesperrt → noindex und nicht in der Sitemap.
function sprachStartBauen(sprache) {
  const R = RAHMEN[sprache.code];
  const inhalt = inhaltFuer(sprache.code);
  const seitenUrl = `${BASIS}/${sprache.praefix}`;
  // Titel «Accueil — Maloja Plana», Brotkrume «Accueil › Français»: beides aus vorhandenen Wörtern.
  const seite = { titel: R.start, brotkrume: SPRACHNAME[sprache.code], beschreibung: R.karteText };
  const liste = inhalt.seiten.map((s) =>
    `          <li><a href="${pfadIntern(s.pfad, sprache)}">${esc(s.brotkrume)}</a>` +
    `<span>${esc(s.beschreibung)}</span></li>`).join('\n');
  const waehler = SPRACHEN.map((s) => (s.code === sprache.code
    ? `<span aria-current="true">${SPRACHNAME[s.code]}</span>`
    : `<a href="/${s.praefix}" hreflang="${s.htmlLang}">${SPRACHNAME[s.code]}</a>`)).join(' · ');
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'WebPage', '@id': `${seitenUrl}#webpage`, url: seitenUrl, name: seite.titel,
      description: seite.beschreibung, inLanguage: sprache.ldLang,
      isPartOf: { '@id': `${BASIS}/#website` }, publisher: { '@id': `${BASIS}/#org` }, about: { '@id': `${BASIS}/#app` },
    }],
  };
  return `${kopf({ seite, sprache, seitenUrl, ld, quelle: `scripts/seiten/${sprache.code}.mjs (Rahmen + Seitenliste)`, hreflang: '' })}

    <main>
${hinweisOben(sprache)}      <h1>Maloja Plana</h1>
      <p class="vorspann">${esc(R.karteText)}</p>

      <ul class="weiter">
${liste}
      </ul>

      <div class="karte">
        <p><strong>${esc(R.karteTitel)}</strong></p>
        <p>${R.karteBeta}</p>
        <p><a class="knopf" href="/?lang=${sprache.code}">${esc(R.karteKnopf)}</a></p>
      </div>

      <ul>
          <li><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a></li>
      </ul>
    </main>

${fuss(sprache, `${esc(R.spracheLabel)}: ${waehler}`)}`;
}

// ─── Kopf und Fuss — gemeinsam für Erklär- und Hintergrundseiten ─────────────
const CSP = "default-src 'none'; img-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'none'; form-action 'none'";

function kopf({ seite, sprache, seitenUrl, ld, quelle, hreflang, robots, robotsNotiz, extraStil = '', csp = CSP }) {
  const R = RAHMEN[sprache.code];
  const index = robots ?? (sprache.freigegeben ? 'index, follow' : 'noindex, follow');
  const notiz = robotsNotiz ?? (sprache.freigegeben
    ? 'Freigegeben: diese Sprache ist gegengelesen und darf indexiert werden.'
    : 'NICHT freigegeben: Übersetzung ohne menschliche Gegenlesung. noindex, bis ein Mensch sie gelesen und scripts/seiten-sprachen.mjs umgestellt hat.');
  return `<!DOCTYPE html>
<html lang="${sprache.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Strenger als die App-CSP: hier läuft gar kein Skript, und es gibt keine
       Fremdressourcen. JSON-LD ist kein ausführbares Skript und braucht kein
       script-src. -->
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <!-- ERZEUGT — nicht von Hand bearbeiten.
       Quelle: ${quelle}
       Sprachen + Freigabe: scripts/seiten-sprachen.mjs
       Generator: scripts/build-seiten.mjs
       Neu bauen:  node scripts/build-seiten.mjs
       Prüfen:     node scripts/build-seiten.mjs --pruefen -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <!-- ${notiz} -->
  <meta name="robots" content="${index}">
  <meta name="author" content="Stebler Studios">
  <meta name="theme-color" content="#F2F2F0">
  <title>${esc(seite.titel)} — Maloja Plana</title>
  <meta name="description" content="${esc(seite.beschreibung)}">
  <link rel="canonical" href="${seitenUrl}">${hreflang}

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
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/lexend-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2).split('\n').map((l) => '  ' + l).join('\n')}
  </script>
  <style>${stil}${extraStil}
  </style>
</head>
<body>
  <div class="rahmen">
    <header>
      <a class="marke" href="/">Maloja&nbsp;Plana</a>
      <nav class="krume" aria-label="${esc(R.krumeLabel)}">
        <a href="/">${esc(R.start)}</a> › ${esc(seite.brotkrume)}
      </nav>
    </header>`;
}

function fuss(sprache, sprachZeile) {
  const R = RAHMEN[sprache.code];
  return `    <footer>
      <p>${esc(R.fussProjekt)} ·
      <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a></p>
      <p>${esc(R.fussQuelloffen)}
      <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a> ·
      <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">${esc(R.fussQuellcode)}</a></p>
      <p><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a> —
      ${esc(R.fussOhneCode)}</p>
      <!-- Melde-Weg VOR dem Beta-Gate. Die Adresse steht schon oben als Kontakt; hier
           mit Betreff, damit eine Meldung im Postfach als solche erkennbar ist und nicht
           zwischen allgemeinen Anfragen untergeht. Kein Formular: das waere ein
           Datenabfluss und widerspricht local-first / CSP self-only. -->
      <p><a href="mailto:info@malojaplana.ch?subject=${encodeURIComponent('Maloja Plana: ' + R.meldenLink)}">${esc(R.meldenLink)}</a></p>
      <p class="sprachen">${sprachZeile}</p>
    </footer>
  </div>
</body>
</html>
`;
}

// ─── Hintergrundseiten (seit 04.11.2026) ─────────────────────────────────────
// Längere Stücke mit Zahlen und Bildern, z. B. /krankenkasse/. Anders als die
// Erklärseiten: nur Deutsch, mit Zahlen aus Malojas Daten, mit sichtbarem Stand.
// Warum: scripts/seiten/krankenkasse.mjs, Kopfkommentar.
const stilHintergrund = `
    /* ─── Hintergrundseite · Maloja-Stil ───────────────────────────────────
       Überschriften in Hanken Grotesk (Markenhandbuch §3), Lesetext Lexend.
       Bereichsfarbe Heidelbeere (Versicherungen, data/lebensbereiche.js):
       --heidel für Grafik, --heidel-text (= skyDeep) für Text, beide AA. */
    @font-face{ font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-600-normal.woff2') format('woff2');
      font-weight:600; font-display:swap }
    @font-face{ font-family:'Hanken Grotesk'; src:url('/fonts/hanken-grotesk-latin-700-normal.woff2') format('woff2');
      font-weight:700; font-display:swap }
    :root{ --heidel:#6787A5; --heidel-text:#4A6A88; --heidel-hauch:#E9EEF3;
           --hl-plate:#FBFBFA; --hl-hi:#4A6A88; --hl-edge:#8A877F; --hl-mid:#C6C2BA; --hl-lo:#E2DFD9 }
    @media (prefers-color-scheme: dark){
      :root{ --heidel:#86A6C2; --heidel-text:#8CAAC6; --heidel-hauch:#2A3038;
             --hl-plate:#2A2927; --hl-hi:#8CAAC6; --hl-edge:#7A766F; --hl-mid:#4D4A45; --hl-lo:#3A3936 }
    }
    h1,h2,h3{ font-family:'Hanken Grotesk','Lexend',-apple-system,sans-serif }
    h1{ font-weight:700; font-size:36px; line-height:1.15; letter-spacing:-0.015em }
    h2{ font-size:24px; font-weight:600; margin:56px 0 12px; line-height:1.25 }
    h2 .nr{ display:inline-block; min-width:1.6em; color:var(--heidel-text) }
    h3{ font-size:18px; font-weight:600; margin:28px 0 6px }
    /* Kicker in Normalschrift wie in der App (Fassung 9, F9-A4, Stebler Studios 05.11.2026). */
    .kicker{ font-size:13px; font-weight:600; color:var(--heidel-text); margin:18px 0 0 }
    .stand{ font-size:14px; color:var(--leise); margin:0 0 4px }
    h2[tabindex]:focus{ outline:none }
    a:focus-visible, .knopf:focus-visible, summary:focus-visible{ outline:2px solid var(--text); outline-offset:2px }

    /* Inhaltsverzeichnis: acht Fragen als ruhige, nummerierte Karte. */
    nav.inhalt{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:18px 20px; margin:24px 0 8px }
    nav.inhalt p{ margin:0 0 8px; font-size:13px; font-weight:600; color:var(--leise) }
    nav.inhalt ol{ list-style:none; margin:0; padding:0; counter-reset:frage; columns:2 260px; column-gap:24px }
    nav.inhalt li{ counter-increment:frage; margin:0 0 6px; break-inside:avoid; display:flex; gap:10px; font-size:15px }
    nav.inhalt li::before{ content:counter(frage); color:var(--heidel-text); font-weight:600; min-width:1em }
    nav.inhalt a{ text-decoration:none } nav.inhalt a:hover{ text-decoration:underline }

    .merke{ background:var(--heidel-hauch); border-radius:10px; padding:14px 18px; margin:22px 0 }

    /* Tabellen */
    /* position:relative hält auch absolut gesetzte Vorlese-Texte im Schiebebereich (sonst dehnen sie die Seite). */
    .tabelle{ overflow-x:auto; margin:12px 0 18px; position:relative }
    .tabelle[tabindex]:focus-visible{ outline:2px solid var(--text); outline-offset:2px }
    table{ border-collapse:collapse; width:100%; font-size:15px; font-variant-numeric:tabular-nums }
    caption{ text-align:left; font-size:14px; color:var(--leise); padding-bottom:6px }
    th,td{ text-align:left; vertical-align:top; padding:8px 10px 8px 0; border-bottom:1px solid var(--rand) }
    th{ font-weight:600 } th[scope="row"]{ font-weight:400 }
    td.n,th.n{ text-align:right; white-space:nowrap }
    .sr-only{ position:absolute; width:1px; height:1px; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap }
    /* Zahlenansicht: Balken in der Tabelle, Fläche in Heidelbeere, ab null. */
    .zahlen td.balken{ width:42%; padding-right:12px; vertical-align:middle }
    .zahlen td.balken span{ display:block; height:10px; border-radius:3px; background:var(--heidel) }
    /* Zweite Reihe (z. B. «nach Verbilligung»): gleiche Farbe, als Umriss — Form statt Farbe. */
    .zahlen td.balken span.b1{ margin-top:3px; background:transparent; border:1.5px solid var(--heidel-text); height:8px }
    .zahlen tr.ch th, .zahlen tr.ch td, .breit tr.ch th, .breit tr.ch td{ font-weight:600; border-top:1.5px solid var(--leise) }
    .legende span{ display:inline-block; width:18px; height:9px; border-radius:2px; vertical-align:middle; margin-right:4px }
    .legende span.b0{ background:var(--heidel) } .legende span.b1{ border:1.5px solid var(--heidel-text) }
    .tabelle.breit table{ min-width:760px; font-size:14px } .tabelle.breit th[scope="col"]{ vertical-align:bottom }
    .tabelle.zahlen:focus-visible, .tabelle.breit:focus-visible, .tabelle[role="region"]:focus-visible{ outline:2px solid var(--text); outline-offset:2px }
    /* Breite Tabelle: die Kantonsspalte bleibt beim Verschieben stehen. */
    .tabelle.breit th[scope="row"], .tabelle.breit tr > th:first-child{ position:sticky; left:0; background:var(--bg); z-index:1 }
    @media (max-width:600px){ .zahlen th[scope="row"]{ white-space:normal } }
    /* Kontrastmodus und Druck: Balken nicht nur als Hintergrund. */
    @media (forced-colors:active){ .zahlen td.balken span.b0, .legende span.b0{ background:CanvasText; forced-color-adjust:none } }
    .zahlen td.balken span, .legende span{ -webkit-print-color-adjust:exact; print-color-adjust:exact }
    .zahlen th[scope="row"]{ white-space:nowrap }
    @media (max-width:600px){ .zahlen td.balken{ width:30% } }

    /* Abbildungen: Karte wie in der App — «Abb. n» oben links, Kurztitel oben
       rechts, der Wert unten rechts; im Bild selbst steht kein Text. */
    .abb{ margin:22px 0 26px }
    .abb-karte{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:12px 16px 10px }
    .abb-kopf,.abb-fuss{ display:flex; justify-content:space-between; gap:12px; margin:0; font-size:13px; color:var(--leise) }
    .abb-fuss{ justify-content:flex-end }
    .abb-wert{ color:var(--text); font-variant-numeric:tabular-nums }
    .abb-bild svg{ display:block; width:100%; height:auto; max-height:460px; margin:4px auto }
    .abb figcaption{ font-size:14px; color:var(--leise); margin-top:8px }
    .abb figcaption strong{ color:var(--text); font-weight:600 }
    .abb details{ margin-top:10px; font-size:15px } .abb summary{ cursor:pointer; color:var(--heidel-text) }
    .abb{ container-type:inline-size }
    details.bewegt{ margin-top:6px }
    details.bewegt summary{ padding:12px 0; color:var(--heidel-text); font-weight:600; cursor:pointer }
    details.bewegt iframe{ display:block; width:100%; border:0; border-radius:16px; height:calc(100cqi * 0.8 + 96px) }
    details.bewegt.iso iframe{ height:calc(100cqi * 0.78 + 44px) }
    p.bewegt{ margin:10px 0 0; font-size:15px }
    p.bewegt a{ display:inline-block; padding:10px 0; color:var(--heidel-text); font-weight:600; text-underline-offset:3px }
    p.bewegt .leise{ margin-left:8px; font-size:13px }

    /* Strichfiguren (Hairline): eine Linie, Flächen in der Kartenfarbe, das
       hervorgehobene Teil in Heidelbeere. Regeln nach dem Hairline-Kernel (MIT). */
    .hl svg :where(path,polygon,ellipse,line){ fill:var(--hl-plate); stroke:var(--hl-mid); stroke-width:.9;
      vector-effect:non-scaling-stroke; stroke-linejoin:round; stroke-linecap:round }
    .hl svg .nf{ fill:none } .hl svg .fo{ stroke:none }
    .hl svg .sil{ stroke:var(--hl-edge) } .hl svg .hi{ stroke:var(--hl-hi); stroke-width:1.3 } .hl svg .lo{ stroke:var(--hl-lo) }
    .hl svg .dash{ stroke-dasharray:1 3 } .hl svg .dot{ stroke:none; fill:var(--hl-hi) }
    .hl svg .dot.m{ fill:var(--hl-edge) } .hl svg .dot.off{ fill:var(--hl-lo) } .hl svg .ghost path{ fill:none; stroke:var(--hl-mid) }

    /* Isometrische Figur (Anatomy): vier Töne, Granit statt Grau. Regeln nach iso.css (MIT). */
    .iso{ --anatomy-paper:#FBFBFA; --anatomy-face:#FFFFFF; --anatomy-top:#FFFFFF;
      --anatomy-shade-0:#DCD9D3; --anatomy-shade-1:#E5E2DC; --anatomy-shade-2:#EDEBE6; --anatomy-shade-3:#F4F3EF;
      --anatomy-lit-top:#FFFFFF; --anatomy-lit-shade:#E9EEF3;
      --anatomy-hi:#24262A; --anatomy-mid:#8A877F; --anatomy-lo:#B5B1A9; --anatomy-faint:#D6D3CC; --anatomy-lit:#4A6A88;
      --anatomy-halo:#8A877F; --anatomy-halo-opacity:.28; --anatomy-dot:#3A3936; --anatomy-weight:.6px }
    @media (prefers-color-scheme: dark){
      .iso{ --anatomy-paper:#2A2927; --anatomy-face:#33322F; --anatomy-top:#34332F;
        --anatomy-shade-0:#262523; --anatomy-shade-1:#292826; --anatomy-shade-2:#2D2C29; --anatomy-shade-3:#31302C;
        --anatomy-lit-top:#3A4048; --anatomy-lit-shade:#323840;
        --anatomy-hi:#E6E3DC; --anatomy-mid:#8E8A82; --anatomy-lo:#5E5B55; --anatomy-faint:#45433F; --anatomy-lit:#8CAAC6;
        --anatomy-halo:#000000; --anatomy-halo-opacity:.5; --anatomy-dot:#E6E3DC }
    }
    .iso svg .iso-fill{ fill:var(--anatomy-paper); stroke:none }
    .iso svg .iso-solid[data-lit]>.iso-fill{ fill:var(--anatomy-face) }
    .iso svg .iso-shade,.iso svg .iso-top{ stroke:none }
    .iso svg .iso-shade[data-shade="0"]{ fill:var(--anatomy-shade-0) } .iso svg .iso-shade[data-shade="1"]{ fill:var(--anatomy-shade-1) }
    .iso svg .iso-shade[data-shade="2"]{ fill:var(--anatomy-shade-2) } .iso svg .iso-shade[data-shade="3"]{ fill:var(--anatomy-shade-3) }
    .iso svg .iso-top{ fill:var(--anatomy-top) }
    .iso svg .iso-solid[data-lit]>.iso-top{ fill:var(--anatomy-lit-top) } .iso svg .iso-solid[data-lit]>.iso-shade{ fill:var(--anatomy-lit-shade) }
    .iso svg .iso-solid[data-lit]>.iso-edge{ stroke:var(--anatomy-lit) }
    .iso svg .iso-halo{ fill:var(--anatomy-halo); stroke:none; filter:blur(9px); opacity:var(--anatomy-halo-opacity); transform:translateY(3px) }
    .iso svg .iso-line{ fill:none; stroke:var(--anatomy-lo); stroke-width:var(--anatomy-weight); stroke-linecap:round; stroke-linejoin:round }
    .iso svg .iso-line[data-tone="hi"]{ stroke:var(--anatomy-hi) } .iso svg .iso-line[data-tone="mid"]{ stroke:var(--anatomy-mid) }
    .iso svg .iso-line[data-tone="lo"]{ stroke:var(--anatomy-lo) } .iso svg .iso-line[data-tone="faint"]{ stroke:var(--anatomy-faint) }
    .iso svg .iso-line[data-tone="lit"]{ stroke:var(--anatomy-lit) }
    .iso svg .iso-line[data-dotted]{ stroke-dasharray:.01 3.5; stroke-width:1 } .iso svg .iso-line[data-dashed]{ stroke-dasharray:3 3 }
    .iso svg .iso-dots circle{ fill:var(--anatomy-dot); stroke:none; opacity:.32 }
    .iso svg .iso-dots[data-tone="hi"] circle{ opacity:.85 } .iso svg .iso-dots[data-tone="mid"] circle{ opacity:.45 }
    .iso svg .iso-dots[data-tone="lo"] circle{ opacity:.22 } .iso svg .iso-dots[data-tone="faint"] circle{ opacity:.12 }

    /* Belege: hochgestellte Nummer, Sprung zur Quelle und zurück. */
    /* Trefferfläche grösser als die Ziffer (a11y-Prüfung 04.11.2026), ohne die Zeile zu sprengen. */
    sup.beleg{ font-size:.75em; line-height:0; vertical-align:super; margin-left:1px }
    /* Unterstrichen schon im Ruhezustand (WCAG 1.4.1): --heidel-text hat gegen den
       Fliesstext nur 2.68:1 (hell) bzw. 1.94:1 (dunkel), unter den 3:1, die eine reine
       Farbunterscheidung bräuchte. Dünn und mit Abstand, damit die Ziffer ruhig bleibt;
       beim Überfahren verdickt sie sich wie bei allen Links. */
    sup.beleg a{ display:inline-block; min-width:24px; padding:10px 4px; margin:-10px -6px; text-align:center;
      text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:2px;
      color:var(--heidel-text); font-weight:600 }
    sup.beleg a:hover{ text-decoration-thickness:2px }
    /* Komma nur zwischen direkt aufeinanderfolgenden Belegen (Klasse «folge», gesetzt in
       belegeSetzen). «sup + sup» griff auch über Text hinweg (Befund 05.11.2026). */
    sup.beleg.folge::before{ content:","; color:var(--leise) }
    :target{ scroll-margin-top:24px }
    ol.quellen{ list-style:none; margin:8px 0 18px; padding:0 }
    ol.quellen li{ display:grid; grid-template-columns:2.2em 1fr; gap:0 10px; padding:12px 0; border-bottom:1px solid var(--rand) }
    ol.quellen li:target{ background:var(--heidel-hauch); border-radius:10px }
    ol.quellen li:target .q-her, ol.quellen li:target .q-zurueck, ol.quellen li:target .q-art{ color:var(--text) }
    .q-nr{ font-family:'Hanken Grotesk','Lexend',sans-serif; font-weight:600; color:var(--heidel-text); text-align:right; padding-top:1px }
    .q-titel{ margin:0; font-weight:600 } .q-titel a{ text-underline-offset:3px }
    .q-her{ margin:2px 0 0; font-size:14px; color:var(--leise) }
    .q-belegt{ margin:4px 0 0; font-size:14px }
    .q-zurueck{ margin:4px 0 0; font-size:13px; color:var(--leise) }
    .q-zurueck a{ display:inline-block; min-width:24px; padding:8px 4px; margin:-8px 0; text-align:center;
      color:var(--heidel-text); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:2px }
    /* Gleicher Grund wie bei sup.beleg: gegen den leisen Text davor nur 1.10:1 / 1.01:1. */
    .q-zurueck a:hover{ text-decoration-thickness:2px }
    .q-art{ display:inline-block; font-size:12px; border:1px solid var(--rand); border-radius:6px; padding:0 6px; margin-left:6px; color:var(--leise) }
    .anhang{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:16px 20px; margin:20px 0 }
    .anhang h3{ margin-top:0 } .anhang p{ font-size:14px; color:var(--leise) }
    @media (max-width:600px){ h1{ font-size:28px } h2{ font-size:21px } .abb-karte{ padding:10px 10px 8px } }`;

// Belege: [[q:schluessel]] → hochgestellte Nummer. Nummeriert nach dem ersten
// Auftreten; jede Stelle bekommt eine eigene id, damit die Quelle zurückführt.
// Unbekannte Schlüssel und Quellen ohne Verweis brechen den Bau ab.
function belegeSetzen(html, quellen) {
  const nummer = new Map(), stellen = new Map();
  const text = html.replace(/\s*\[\[q:([a-zA-Z0-9]+)\]\]/g, (_, k) => {
    if (!quellen.some((q) => q.key === k)) throw new Error(`Unbekannte Quelle [[q:${k}]]`);
    if (!nummer.has(k)) nummer.set(k, nummer.size + 1);
    const i = (stellen.get(k) || 0) + 1;
    stellen.set(k, i);
    return `<sup class="beleg"><a href="#quelle-${k}" id="beleg-${k}-${i}" aria-label="Quelle ${nummer.get(k)}">${nummer.get(k)}</a></sup>`;
  });
  const ohne = quellen.filter((q) => !nummer.has(q.key)).map((q) => q.key);
  if (ohne.length) throw new Error(`Quellen ohne Verweis im Text: ${ohne.join(', ')}`);
  // Direkt aufeinanderfolgende Belege («1,2») bekommen das Trennkomma, sonst keiner.
  return { text: text.replace(/<\/sup><sup class="beleg">/g, '</sup><sup class="beleg folge">'), nummer, stellen };
}

// Drei Schichten: Belege im zugeklappten Teil. Der «Zurück»-Link springt dann
// auf die Überschrift des Abschnitts, die immer sichtbar ist — ob ein Browser
// <details> beim Sprung aufklappt, ist nicht überall belegt (Safari ungeprüft).
// Wächter: src/__tests__/schichtenBelegSprung.test.js.
function zugeklappteBelege(text) {
  const ziel = new Map();
  for (const teil of text.split(/(?=<h2 id=")/)) {
    const h = teil.match(/^<h2 id="([^"]+)"/);
    if (!h) continue;
    for (const d of teil.matchAll(/<details class="schicht-mehr">([\s\S]*?)<\/details>/g))
      for (const m of d[1].matchAll(/id="(beleg-[^"]+)"/g)) ziel.set(m[1], h[1]);
  }
  return ziel;
}

function quellenListe(quellen, nummer, stellen, zugeklappt = new Map()) {
  return [...quellen].sort((a, b) => nummer.get(a.key) - nummer.get(b.key)).map((q) => {
    const n = nummer.get(q.key);
    const anzahl = stellen.get(q.key);
    const zurueck = 'Zurück zum Text: ' + Array.from({ length: anzahl }, (_, i) =>
      {
        const id = `beleg-${q.key}-${i + 1}`;
        const abschnitt = zugeklappt.get(id);
        return abschnitt
          ? `<a href="#${abschnitt}" aria-label="Zurück zum Abschnitt mit Stelle ${i + 1}; sie steht unter «Ausführlich lesen»">${anzahl > 1 ? i + 1 : '↩'}</a>`
          : `<a href="#${id}" aria-label="Zurück zur Stelle ${i + 1} im Text">${anzahl > 1 ? i + 1 : '↩'}</a>`;
      }).join(' · ');
    const auch = q.auch ? `\n            <p class="q-her">Dazu: <a href="${esc(q.auch.url)}" rel="noopener">${esc(q.auch.text)}</a></p>` : '';
    return `        <li id="quelle-${q.key}">
          <span class="q-nr">${n}</span>
          <div>
            <p class="q-titel"><a href="${esc(q.url)}" rel="noopener">${esc(q.titel)}</a></p>
            <p class="q-her">${esc(q.herausgeber)}${q.datum ? ` · ${esc(q.datum)}` : ''}${q.amtlich ? '' : '<span class="q-art">keine Behörde</span>'}</p>
            <p class="q-belegt">Belegt: ${esc(q.belegt)}</p>${auch}
            <p class="q-zurueck">${zurueck}</p>
          </div>
        </li>`;
  }).join('\n');
}

// Drei Schichten (Brand Book §8, seit 09.11.2026): A Bild, B Satz, C aufklappbar, D Wege.
// Farben über --heidel*, damit jede Seite ihre Bereichsfarbe behält.
const STIL_SCHICHTEN = `
    .schicht-bild{ margin:14px 0 0 } .schicht-bild .abb{ margin:0 }
    .schicht-kurz{ font-size:20px; line-height:1.45; margin:16px 0 10px; font-weight:500 }
    details.schicht-mehr{ border-top:1px solid var(--rand); border-bottom:1px solid var(--rand); margin:14px 0 }
    details.schicht-mehr > summary{ padding:12px 0; min-height:44px; box-sizing:border-box; color:var(--heidel-text); font-weight:600; cursor:pointer }
    details.schicht-mehr[open] > summary{ border-bottom:1px solid var(--rand); margin-bottom:6px }
    nav.wege{ display:flex; flex-wrap:wrap; gap:8px; margin:12px 0 0 }
    a.weg{ display:inline-flex; align-items:center; gap:6px; min-height:44px; padding:0 16px; border:1px solid var(--rand);
           border-radius:10px; background:var(--flaeche); text-decoration:none; font-size:15px; color:var(--text) }
    a.weg:hover{ border-color:var(--heidel) } a.weg span{ color:var(--heidel-text) }
    .kern{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:16px 18px }
    .kern .paar{ display:flex; flex-wrap:wrap; gap:8px 40px } .kern .paar p{ margin:0; font-size:15px }
    .kern .zahl{ display:block; font-family:'Hanken Grotesk','Lexend',sans-serif; font-size:44px; font-weight:700; line-height:1.1; color:var(--heidel-text); margin:0 }
    .kern .unter{ font-size:14px; color:var(--leise); margin:6px 0 0 }
    ul.stab{ list-style:none; margin:0; padding:0 }
    ul.stab li{ display:grid; grid-template-columns:minmax(0,9em) minmax(0,1fr) 4.5em; gap:10px; align-items:center; padding:5px 0; font-size:15px }
    ul.stab li i{ display:block; height:12px; border-radius:3px; background:var(--heidel); -webkit-print-color-adjust:exact; print-color-adjust:exact }
    ul.stab li b{ font-weight:400; text-align:right; font-variant-numeric:tabular-nums }
    .zeit{ list-style:none; margin:0; padding:16px 18px; display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px }
    .kern .zeit{ padding:10px 0 0 }
    .zeit li{ border-top:3px solid var(--heidel); padding:8px 0 0 }
    .zeit .jahr{ display:block; font-family:'Hanken Grotesk','Lexend',sans-serif; font-size:24px; font-weight:700; color:var(--heidel-text) }
    .zeit .was{ font-size:15px }
    @media (forced-colors:active){ ul.stab li i{ background:CanvasText; forced-color-adjust:none } .zeit li{ border-top-color:CanvasText } }`;

function hintergrundBauen(seite) {
  // Schalter für eine bewegte Fassung ohne Dateien dahinter: lieber abbrechen
  // als einen toten Link ausliefern (scripts/seiten/politsystem.mjs).
  if (seite.bewegtVerlinken) throw new Error(`${seite.pfad}: bewegtVerlinken ist gesetzt, aber es gibt keine bewegte Fassung im Repo`);
  const sprache = SPRACHEN.find((s) => s.code === 'de');
  const R = RAHMEN.de;
  // Eigene Zahlen und Bilder je Seite (z. B. scripts/seiten/politsystem.mjs);
  // ohne Angabe die der Krankenkasse und des Kantonsvergleichs.
  const werte = seite.zahlen ? seite.zahlen() : { ...zahlen(), ...vergleichZahlen() };
  const bloecke = seite.bloecke || BLOECKE;
  const z = (s) => einsetzen(s, werte);
  const seitenUrl = url(seite.pfad, sprache);
  const titel = z(seite.titel), beschreibung = z(seite.beschreibung);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${seitenUrl}#webpage`,
        url: seitenUrl,
        name: titel,
        description: beschreibung,
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
    ],
  };

  const inhaltsverzeichnis = seite.inhaltsverzeichnis ? `      <nav class="inhalt" aria-label="Inhalt dieser Seite">
        <p>${esc(seite.inhaltTitel || 'Inhalt')}</p>
        <ol role="list">
${seite.abschnitte.map((a) => `          <li><a href="#${a.id}">${esc(a.titel.replace(/^\d+\.\s*/, ''))}</a></li>`).join('\n')}
        </ol>
      </nav>` : '';

  // Abbildungen werden über die ganze Seite durchgezählt.
  const ctx = { abb: 0, einbetten: !!seite.bewegtEinbetten };
  const roh = seite.abschnitte.map((a) => {
    const m = a.titel.match(/^(\d+)\.\s*(.*)$/);
    const kopfzeile = m ? `<span class="nr">${m[1]}</span> ${esc(m[2])}` : esc(a.titel);
    // tabindex="-1": nach dem Sprung aus dem Inhaltsverzeichnis steht der
    // Tastatur-Fokus an der Überschrift, nicht mehr oben im Verzeichnis.
    const kopf = `      <h2 id="${a.id}" tabindex="-1">${kopfzeile}</h2>`;
    if (!seite.schichten) return `${kopf}${einsetzen(a.html, werte, bloecke, ctx)}`;
    // Drei Schichten (Probe 09.11.2026, Stebler Studios «Ja, Probe bauen»):
    // A Bild zuerst, B ein Satz, C der ganze Text aufklappbar, D Wege.
    // Der Text in C bleibt unverändert; nichts fällt weg, es ist nur zu.
    const wege = (a.wege || []).map((w) =>
      `<a class="weg" href="${w.href}"><span aria-hidden="true">→</span> ${esc(w.text)}</a>`).join('');
    return `${kopf}
      <div class="schicht-bild">${einsetzen(a.bild || '', werte, bloecke, ctx)}</div>
      <p class="schicht-kurz">${einsetzen(a.kurz, werte, bloecke, ctx)}</p>
      <details class="schicht-mehr">
        <summary>Ausführlich lesen, mit Ausnahmen und Quellen</summary>${einsetzen(a.html, werte, bloecke, ctx)}
      </details>${wege ? `
      <nav class="wege" aria-label="Weiter von hier">${wege}</nav>` : ''}`;
  }).join('\n\n');
  const { text: abschnitte, nummer, stellen } = belegeSetzen(roh, seite.quellen);

  const weiter = [...inhaltFuer('de').seiten, ...HINTERGRUND.filter((h) => h.pfad !== seite.pfad)].map((s) =>
    `          <li><a href="${pfadIntern(s.pfad, sprache)}">${esc(s.brotkrume)}</a></li>`).join('\n');

  return `${kopf({
    seite: { ...seite, titel, beschreibung }, sprache, seitenUrl, ld,
    quelle: `scripts/seiten/${seite.pfad}.mjs · Zahlen und Bilder: ${seite.bilderQuelle || 'scripts/seiten-figuren.mjs'}`,
    hreflang: '',
    robots: 'index, follow',
    robotsNotiz: 'Hintergrundseite, nur Deutsch. Gegengelesen und indexierbar; Übersetzungen gibt es noch keine.',
    extraStil: stilHintergrund + (seite.schichten ? STIL_SCHICHTEN : '') + (seite.stilZusatz || ''),
    // Kein Skript auf dieser Seite. frame-src 'self' nur, wenn die bewegten
    // Fassungen aufklappen (eigene Seiten, eigene CSP, Skripte als Dateien).
    ...(seite.bewegtEinbetten ? { csp: CSP.replace("default-src 'none';", "default-src 'none'; frame-src 'self';") } : {}),
  })}

    <main>
      <p class="kicker">${esc(seite.kicker || seite.brotkrume)}</p>
      <h1>${esc(titel)}</h1>
      <p class="vorspann">${z(seite.vorspann)}</p>
      <p class="stand"><strong>Stand der Zahlen:</strong> ${esc(z(seite.stand))}</p>
      <p class="hinweis">${esc(seite.hinweis)}</p>
${inhaltsverzeichnis}

${abschnitte}

      <div class="karte">
        <p><strong>${esc(R.karteTitel)}</strong></p>
        <p>${esc(R.karteText)}</p>
        <p>${R.karteBeta}</p>
        <p><a class="knopf" href="${beispielZiel(seite.pfad)}">${esc(R.karteKnopf)}</a></p>
      </div>

      <h2 id="quellen">Quellen</h2>
      <p class="leise">Die hochgestellten Nummern im Text führen hierher, «Zurück zum Text» wieder an die Stelle.</p>
      <ol class="quellen">
${quellenListe(seite.quellen, nummer, stellen, zugeklappteBelege(abschnitte))}
      </ol>
      <p class="leise">${esc(seite.quellenHinweis)}</p>

      <div class="anhang">${seite.gesetze ? `
        <h3>Gesetzesstellen</h3>
        <p>${esc(seite.gesetze)}</p>` : ''}
        <h3>Eigene Rechnungen</h3>
${seite.eigeneRechnungen.map((r) => `        <p>${z(r)}</p>`).join('\n')}
      </div>

      <p class="vorbehalt">${seite.vorbehalt}</p>

      <h2>${esc(R.weiterlesenTitel)}</h2>
      <ul>
${weiter}
          <li><a href="${pfadIntern('rechtliches', sprache)}">${esc(R.rechtlichesLink)}</a></li>
      </ul>
    </main>

${fuss(sprache, `${esc(R.spracheLabel)}: <span aria-current="true">${SPRACHNAME.de}</span> <span class="leise">(diese Seite gibt es bisher nur auf Deutsch)</span>`)}`;
}

// ─── Bewegte Fassungen der Figuren (seit 04.11.2026) ─────────────────────────
// Je Figur eine kleine Seite unter /krankenkasse/bewegt/<name>/, von der
// Hauptseite aus verlinkt. Die einzigen öffentlichen Seiten mit Skript. Die
// Skripte liegen als Dateien daneben (script-src 'self' — so verlangt es auch
// der Server-Header), kein eingebettetes Skript, nichts von aussen. noindex,
// nicht in der Sitemap.
const stilBewegt = `
    body{ background:var(--bg) } main{ padding:4px 2px 8px }
    .karte-b{ position:relative; background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:10px 12px 8px }
    .anzeige{ margin:0; min-height:1.6em; text-align:right; font-size:14px; color:var(--text); font-variant-numeric:tabular-nums }
    .regler{ display:flex; align-items:center; gap:12px; margin:10px 2px 0; font-size:14px; color:var(--leise) }
    .regler input{ flex:1; min-height:44px; accent-color:var(--heidel) }
    .anzeige .ruhe{ color:var(--leise) } .anzeige #anzeige:not(:empty) + .ruhe{ display:none }
    #stage:focus-visible{ outline:2px solid var(--text); outline-offset:4px; border-radius:10px }
    .hinweis-b{ font-size:13px; color:var(--leise); margin:8px 2px 0 }
    /* Orientierung für wer direkt hier landet (a11y-Prüfung Predeploy 05.11.2026): Rückweg oben, Titel als h1. */
    .zurueck-b{ margin:0 0 4px; font-size:15px } .zurueck-b a{ display:inline-flex; align-items:center; min-height:44px; color:var(--text) }
    .titel-b{ margin:0 0 12px; font-size:20px; line-height:1.3; color:var(--text) }
    [data-hairline]{ --hairline-plate:#FBFBFA; --hairline-hi:#4A6A88; --hairline-edge:#8A877F; --hairline-mid:#C6C2BA; --hairline-lo:#E2DFD9; --hairline-stroke:0.9 }
    @media (prefers-color-scheme: dark){
      [data-hairline]{ --hairline-plate:#2A2927; --hairline-hi:#8CAAC6; --hairline-edge:#7A766F; --hairline-mid:#4D4A45; --hairline-lo:#3A3936 }
    }
    .iso-stage{ outline-offset:4px } .iso-stage:focus-visible{ outline:2px solid var(--text); border-radius:10px }
    .iso-stage svg{ display:block; width:100%; height:auto }
    /* Im Rahmen der Hauptseite (rahmen.js): Hinweise stehen dort, hier nur Bild und Regler. */
    .im-rahmen main{ padding:0 } .im-rahmen .nur-allein{ display:none }`;

function bewegtSeiteBauen(name) {
  const b = BEWEGT[name];
  const { pfade } = bewegtSkripte(name);
  const csp = CSP.replace("default-src 'none';", "default-src 'none'; script-src 'self';");
  const zurueck = `<a href="/krankenkasse/#abb-${name}">Warum die Krankenkasse so viel kostet</a>`;
  const buehne = b.art === 'iso' ? `
    <div class="karte-b iso">
      <div class="iso-stage" tabindex="0" role="slider" aria-label="Prämienjahr; die Pfeiltasten wechseln das Jahr" aria-valuemin="2025" aria-valuemax="2027" aria-valuenow="2027">${praemieBuehneSvg()}</div>
      <p class="anzeige" data-readout aria-live="polite"></p>
    </div>
    <p class="hinweis-b nur-allein">Von links nach rechts über das Bild fahren wählt das Jahr 2025 bis 2027, auf einen Block zeigen nennt ihn. Mit der Tastatur: ins Bild springen, dann Pfeiltasten für das Jahr. Das Bild bewegt sich nur, wenn Sie es tun.</p>` : `
    <div class="karte-b">
      <div id="stage" aria-label="${esc(b.titel)}" aria-describedby="hinweis-${name}"></div>
      <p class="anzeige"><span id="anzeige" aria-live="polite"></span><span class="ruhe" aria-hidden="true">${esc(b.ruhe)}</span></p>
    </div>
    <div class="regler"><label for="regler">${esc(b.regler)}</label><input id="regler" type="range" min="0" max="1" step="0.01" value="0.5"></div>
    <p class="hinweis-b nur-allein" id="hinweis-${name}">Mit Maus oder Finger auf die Figur zeigen, oder mit der Tastatur ins Bild springen und die Pfeiltasten nutzen. Der Regler ${name === 'kostenteil' ? 'stellt die Franchise ein' : 'streckt nur die Höhen, die Verhältnisse bleiben'}.</p>`;
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Skript nur hier, als Dateien von der eigenen Adresse (script-src 'self'). -->
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <!-- ERZEUGT — nicht von Hand bearbeiten. Quelle: scripts/seiten/figuren/bewegt/ · Generator: scripts/build-seiten.mjs
       Engines: Hairline und Anatomy-Kit, beide MIT, Texte unter /licenses/. -->
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="robots" content="noindex, follow">
  <meta name="author" content="Stebler Studios">
  <title>Bewegte Fassung: ${esc(b.titel)} — Maloja Plana</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>${stil}${stilHintergrund}${stilBewegt}
  </style>
</head>
<body>
  <main>
    <p class="zurueck-b nur-allein"><a href="/krankenkasse/#abb-${name}">Zurück zu «Warum die Krankenkasse so viel kostet»</a></p>
    <h1 class="titel-b nur-allein">${esc(b.titel)}</h1>${buehne}
    <p class="hinweis-b nur-allein">Teil der Seite ${zurueck} · Maloja Plana</p>
  </main>
${pfade.map((pf) => `  <script src="/krankenkasse/bewegt/${pf}"></script>`).join('\n')}
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
    // Sprach-Startseite (nur freigegebene Sprachen ausser Deutsch, dessen Start «/» ist).
    if (s.praefix) zeilen.push(eintrag(`${BASIS}/${s.praefix}`, '0.9', null));
    zeilen.push(...i.seiten.map((x) => eintrag(url(x.pfad, s), '0.8', x.pfad)));
    zeilen.push(...i.sonderseiten.map((x) => eintrag(url(x.pfad, s), '0.3', x.pfad)));
    // Hintergrundseiten: nur Deutsch, darum ohne Sprach-Alternativen.
    if (s.code === 'de') zeilen.push(...HINTERGRUND.map((x) => eintrag(url(x.pfad, s), '0.8', null)));
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

// Sprach-Startseiten: alle Sprachen ausser Deutsch (Deutsch hat die App-Startseite «/»).
for (const sprache of SPRACHEN.filter((x) => x.praefix)) {
  seitenAusgaben.push({
    ziel: resolve(WURZEL, 'public', ...sprache.praefix.split('/').filter(Boolean), 'index.html'),
    inhalt: sprachStartBauen(sprache),
    name: `${sprache.praefix}index.html`,
  });
}

const bewegtDatei = (pfad, inhalt) => ({
  ziel: resolve(WURZEL, 'public', 'krankenkasse', 'bewegt', ...pfad.split('/')),
  inhalt,
  name: `krankenkasse/bewegt/${pfad}`,
});
for (const [pfad, inhalt] of Object.entries(bewegtGemeinsam())) seitenAusgaben.push(bewegtDatei(pfad, inhalt));
for (const name of Object.keys(BEWEGT)) {
  seitenAusgaben.push(bewegtDatei(`${name}/index.html`, bewegtSeiteBauen(name)));
  const { figur } = bewegtSkripte(name);
  if (figur) seitenAusgaben.push(bewegtDatei(`${name}/figur.js`, figur));
}

for (const h of HINTERGRUND) {
  seitenAusgaben.push({
    ziel: resolve(WURZEL, 'public', h.pfad, 'index.html'),
    inhalt: hintergrundBauen(h),
    name: `${h.pfad}/index.html`,
  });
}

// Scrollbare Tabellen per Tastatur erreichbar machen (WCAG 2.1.1): Jede
// `<div class="tabelle …"><table><caption>…` wird eine benannte Region mit
// tabindex="0", der Name kommt aus der caption. Zentral hier statt in jedem
// Tabellen-Baustein, damit keine neue Tabelle es vergessen kann. Blöcke, die es
// schon selbst tragen (role= gesetzt), bleiben unberührt. Der sichtbare Fokus
// steht im Stil bei `.tabelle`. Name = caption ist bewusst so (gleiches Muster wie
// die Sitztabelle in #693): Screenreader sagen ihn beim Betreten der Region und
// dann als Tabellentitel; das ist doppelt, aber der Name stimmt immer mit dem
// sichtbaren Titel überein.
const TABELLE_MIT_CAPTION = /<div class="(tabelle(?: [^"]*)?)"><table>(\s*)<caption>([\s\S]*?)<\/caption>/g;
function tabellenErreichbar(html) {
  return html.replace(TABELLE_MIT_CAPTION, (_, klasse, ws, caption) => {
    const name = caption.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      .replace(/&/g, '&amp;').replace(/&amp;(#?\w+;)/g, '&$1').replace(/"/g, '&quot;');
    if (!name) throw new Error(`Tabelle ohne lesbare caption: ${caption}`);
    return `<div class="${klasse}" role="region" aria-label="${name}" tabindex="0"><table>${ws}<caption>${caption}</caption>`;
  });
}
for (const a of seitenAusgaben) if (a.name.endsWith('.html')) a.inhalt = tabellenErreichbar(a.inhalt);

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
  console.log(`\n✓ ${seitenAusgaben.length} Dateien (${ALLE.length} × ${SPRACHEN.length} Sprachen` +
    ` + ${HINTERGRUND.length} Hintergrundseite(n) und ihre bewegten Fassungen, nur Deutsch) + sitemap.xml erzeugt.`);
}
console.log(`  indexierbar: ${frei.join(', ')}` +
  (offen.length ? `  ·  noindex bis zur Gegenlesung: ${offen.join(', ')}` : ''));
