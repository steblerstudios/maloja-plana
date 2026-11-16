// ─── Inhalt der öffentlichen Erklärseiten ────────────────────────────────────
//
// Entscheid Stebler Studios, 20.09.2026: öffentliche Erklärseiten VOR dem Gate,
// die App dahinter. Erst dadurch gibt es überhaupt indexierbaren Inhalt —
// solange alles hinter BetaGate liegt, sieht auch Googlebot nur die Code-Wand.
// Befund: docs/audits/seo-audit-2026-09-20.md (Massnahme A + B + E + G).
//
// Daten, nicht HTML: scripts/build-seiten.mjs macht daraus statische Seiten,
// src/__tests__/oeffentlicheSeiten.test.js prüft dieselbe Quelle. Build-Zeit —
// liegt bewusst NICHT unter src/, damit nichts davon ins Bundle rutscht.
//
// ─── WAHRHEITS-DISZIPLIN (CLAUDE.md) ────────────────────────────────────────
// Diese Seiten sind öffentlich und behandeln Schweizer Sozial- und Steuerrecht.
// Darum die harte Regel für alles hier drin:
//
//   KEINE BETRÄGE. KEINE FRISTEN. KEINE EINKOMMENSGRENZEN. KEINE PROZENTSÄTZE.
//
// Nicht aus Vorsicht, sondern weil sie kantonal verschieden sind und jährlich
// ändern — eine Zahl auf einer statischen Seite ist in zwölf Monaten falsch und
// niemand merkt es. Die Zahlen leben in der App, wo sie versioniert, belegt und
// getestet sind. Diese Seiten erklären die STRUKTUR und verweisen für die Zahlen
// an die amtliche Stelle.
//
// Rechtsnormen nur, wo sie sitzen: KVG (ohne Artikel — der Rahmen, nicht die
// Einzelregel), Bundesverfassung Art. 12 (Hilfe in Notlagen), DBG (direkte
// Bundessteuer). Nichts davon geraten.
//
// Alle externen Links am 20.09.2026 mit Gegenprobe geprüft: echter Titel gegen
// «404 / Seite nicht gefunden» bei einem erfundenen Pfad auf demselben Host.
// ch.ch ist bewusst NICHT verlinkt — es rendert clientseitig und liefert auch
// für erfundene Pfade HTTP 200, die Prüfung wäre dort wertlos gewesen.
// ─────────────────────────────────────────────────────────────────────────────

// Die vier übersetzten Fassungen. Diese Datei bleibt das deutsche Original und
// zugleich die Sammelstelle — ein Ort, an dem alle fünf Sprachen zu sehen sind.
// Die Übersetzungen liegen daneben, damit ein Sprach-Durchgang nicht durch
// 1600 Zeilen scrollen muss: scripts/seiten/<sprache>.mjs
import { SEITEN as SEITEN_FR, SONDERSEITEN as SONDERSEITEN_FR } from './seiten/fr.mjs';
import { SEITEN as SEITEN_IT, SONDERSEITEN as SONDERSEITEN_IT } from './seiten/it.mjs';
import { SEITEN as SEITEN_EN, SONDERSEITEN as SONDERSEITEN_EN } from './seiten/en.mjs';
import { SEITEN as SEITEN_RM, SONDERSEITEN as SONDERSEITEN_RM } from './seiten/rm.mjs';

export const BASIS = 'https://malojaplana.ch';

// Sichtbares Stand-Datum. <lastmod> in der Sitemap ist für Leser:innen unsichtbar
// und wird beim Deploy ohnehin neu gesetzt — auch wenn inhaltlich nichts geprüft
// wurde. Dieses Datum ändert nur von Hand, wenn jemand den Inhalt wirklich
// gegengelesen hat. Zuletzt: Fachprüfung + Rechtsprüfung am 20.09.2026; Gruppe D am 11.11.2026.
export const GEPRUEFT = 'November 2026';

// Geprüfte amtliche Quellen. Beim Ergänzen: erst Gegenprobe, dann eintragen.
//
// ─── SPRACHEN DER QUELLEN, gemessen 21.09.2026 ──────────────────────────────
// `url` und `text` sind die deutsche Fassung und zugleich der Rückfall.
// `sprachen` enthält AUSSCHLIESSLICH Adressen, die einzeln mit `curl` geprüft
// wurden — HTTP 200 auf die echte, 404 auf eine erfundene Adresse desselben
// Hosts. Was dort fehlt, fehlt nicht aus Nachlässigkeit: es gibt die Quelle in
// jener Sprache nicht, und die Seite sagt das dann sichtbar an.
//
// 🛑 Geraten wird hier nichts. Beim ersten Versuch hatte ich die Slugs aus dem
// deutschen Pfad abgeleitet (`/fr/primes`, `/fr/steuerrechner-…`): alle 404.
// Das misst die eigene Vermutung, nicht den Bestand. Die Adressen unten
// stammen aus dem Sprachumschalter der Quellseiten selbst.
//
//   priminfo      de ✓ fr ✓ it ✓         — gleicher Slug; `/en/praemien` liefert
//                                          seit spätestens 24.09.2026 die deutsche
//                                          Seite (lang="de", deutscher Titel), genau
//                                          wie das erfundene `/xx/praemien` → en
//                                          entfernt, die Seite sagt «German only».
//   ahvMerkblatt  de ✓ fr ✓ it ✓ en ✓   — Endung .d/.f/.i/.e
//   skosRechner   de ✓ fr ✓             — der Umschalter bietet NUR DE und FR
//   estvRechner   de ✓                  — kein Sprachumschalter auffindbar
//   bwoKantone    de ✓ fr ✓ it ✓         — nachgemessen 05.11.2026, s. Eintrag
//   bsvEL         de ✓                  — dito
//   rm            keine einzige          — der Bund publiziert das nicht auf
//                                          Rumantsch. Tatsache, kein Mangel.
//
// Wer hier eine Sprache ergänzt, prüft sie vorher einzeln mit Gegenprobe.
// `src/__tests__/oeffentlicheSeiten.test.js` prüft die Form, nicht die
// Erreichbarkeit — ein Test, der ins Netz greift, ist kein Test.
export const QUELLEN = {
  // Systematische Sammlung des Bundesrechts (SR). Steht hier, weil das Impressum den Artikel
  // nennt, auf den es sich stützt — und wer einen Artikel nennt, soll ihn
  // belegen können. Dieselbe Adresse verwendet das Studio-Impressum
  // (stebler-studios/website/impressum.html, 22.09.2026), bewusst wörtlich
  // übernommen statt neu gebaut.
  //
  // 🛑 KEIN `rm`-EINTRAG, und das ist gemessen, nicht vergessen. Bundesrecht
  // erscheint durchgehend auf Deutsch, Französisch und Italienisch; auf
  // Rumantsch nur teilweise. Ob das UWG dazugehört, liess sich am 23.09.2026
  // NICHT feststellen: `curl` bekommt von Fedlex für /de, /fr, /it, /rm — und
  // für eine frei erfundene Sprache `xx` — dieselbe 77 151 Byte grosse
  // SPA-Hülle zurück, alle vier md5-identisch. Der Statuscode 200 misst dort
  // das Werkzeug, nicht den Bestand. Was nicht belegbar ist, wird nicht
  // behauptet: die rätoromanische Seite verlinkt die deutsche Fassung, wie es
  // die englische auch tut.
  //
  // Nachtrag 02.11.2026, über die Fedlex-Metadaten gemessen: rm hat für UWG und KVG
  // keine Datei. Englisch gibt es beim UWG (Stand 1.1.2025, ohne Rechtskraft), es
  // ist bewusst nicht verlinkt. Beim KVG gibt es keine englische Datei, /en leitete
  // am 01.11.2026 im Browser auf /de um.
  fedlexUwgArt3: {
    url: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3',
    text: 'UWG Art. 3 Abs. 1 Bst. s Ziff. 1 (SR 241, Systematische Sammlung)',
    sprachen: {
      fr: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/fr#art_3',
      it: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/it#art_3',
    },
    texte: {
      fr: 'LCD art. 3 al. 1 let. s ch. 1 (RS 241, recueil systématique)',
      it: 'LCSl art. 3 cpv. 1 lett. s n. 1 (RS 241, raccolta sistematica)',
      en: 'Swiss Unfair Competition Act, Art. 3 para. 1 lit. s no. 1 (SR 241)',
      rm: 'LCSL art. 3 al. 1 lit. s cifra 1 (CS 241)',
    },
  },
  // Art. 65 KVG am 01.11.2026 im Browser gelesen, de/fr/it, Stand 1. Juli 2026
  // (`curl` bekommt von Fedlex nur die SPA-Hülle, s. o.). 🛑 In Abs. 3 decken sich
  // die Fassungen nicht: de «insbesondere auf Antrag», fr «notamment à la demande», it «su
  // richiesta particolare». Die italienische Seite folgt deshalb dem italienischen
  // Wortlaut. Art. 66 steht in der Angabe wegen des Bundesbeitrags.
  fedlexKvgArt65: {
    url: 'https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de#art_65',
    text: 'KVG Art. 65 und 66 (SR 832.10, Systematische Sammlung)',
    sprachen: {
      fr: 'https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/fr#art_65',
      it: 'https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/it#art_65',
    },
    texte: {
      fr: 'LAMal art. 65 et 66 (RS 832.10, recueil systématique)',
      it: 'LAMal art. 65 e 66 (RS 832.10, raccolta sistematica)',
      en: 'Swiss Health Insurance Act (KVG), Art. 65 and 66 (SR 832.10)',
      rm: 'LAMal art. 65 e 66 (CS 832.10)',
    },
  },
  estvRechner: {
    url: 'https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen',
    text: 'Steuerrechner der Eidgenössischen Steuerverwaltung',
    sprachen: {},
    texte: {
      fr: 'Calculateur d’impôts de l’Administration fédérale des contributions',
      it: 'Calcolatore d’imposta dell’Amministrazione federale delle contribuzioni',
      en: 'Tax calculator of the Federal Tax Administration',
      rm: 'Calculatur da taglia da l’Administraziun federala da taglias',
    },
  },
  priminfo: {
    url: 'https://www.priminfo.admin.ch/de/praemien',
    text: 'Prämienrechner des Bundesamts für Gesundheit (Priminfo)',
    sprachen: {
      fr: 'https://www.priminfo.admin.ch/fr/praemien',
      it: 'https://www.priminfo.admin.ch/it/praemien',
    },
    texte: {
      fr: 'Calculateur de primes de l’Office fédéral de la santé publique (Priminfo)',
      it: 'Calcolatore dei premi dell’Ufficio federale della sanità pubblica (Priminfo)',
      en: 'Premium calculator of the Federal Office of Public Health (Priminfo)',
      rm: 'Calculatur da premis da l’Uffizi federal da sanadad publica (Priminfo)',
    },
  },
  skosRechner: {
    url: 'https://skos.ch/dienstleistungen/hilfsmittel/sozialhilferechner',
    text: 'Sozialhilferechner der SKOS',
    sprachen: {
      fr: 'https://skos.ch/fr/services/outils/calculateur-daide-sociale',
    },
    texte: {
      fr: 'Calculateur d’aide sociale de la CSIAS',
      it: 'Calcolatore di aiuto sociale della COSAS',
      en: 'Social assistance calculator of SKOS',
      rm: 'Calculatur d’agid social da la SKOS',
    },
  },
  bwoKantone: {
    url: 'https://www.bwo.admin.ch/de/kantonale-hilfen',
    text: 'Kantonale Hilfen, Übersicht des Bundesamts für Wohnungswesen',
    // 05.11.2026 per curl gemessen: fr/it 200 mit passendem Titel, Gegenprobe
    // `/fr/xxyyzz-erfunden` 404. Eine en-Adresse ist nicht belegt.
    sprachen: {
      fr: 'https://www.bwo.admin.ch/fr/aides-cantonales',
      it: 'https://www.bwo.admin.ch/it/aiuti-cantonali',
    },
    texte: {
      fr: 'Aides cantonales, aperçu de l’Office fédéral du logement',
      it: 'Aiuti cantonali, panoramica dell’Ufficio federale delle abitazioni',
      en: 'Cantonal assistance, overview of the Federal Housing Office',
      rm: 'Agids chantunals, survista da l’Uffizi federal d’abitaziun',
    },
  },
  bsvEL: {
    url: 'https://www.bsv.admin.ch/de/el', // Gruppe D (11.11.2026): alte Adresse leitete hierher um
    text: 'Ergänzungsleistungen, Bundesamt für Sozialversicherungen',
    sprachen: {},
    texte: {
      fr: 'Prestations complémentaires, Office fédéral des assurances sociales',
      it: 'Prestazioni complementari, Ufficio federale delle assicurazioni sociali',
      en: 'Supplementary benefits, Federal Social Insurance Office',
      rm: 'Prestaziuns cumplementaras, Uffizi federal d’assicuranzas socialas',
    },
  },
  // Merkblatt 5.01, Stand 1. Januar 2025. Am 14.11.2026 per curl gemessen: .d/.f/.i liefern
  // je ein PDF (200, Titel «Ergänzungsleistungen zur AHV und IV» / «Prestations complémentaires
  // à l’AVS et à l’AI» / «Prestazioni complementari all’AVS e all’AI»), .e liefert 404 — eine
  // englische Fassung gibt es nicht. Gegenprobe /p/99.99.d: 404. Die Seite /ergaenzungsleistungen/
  // ist an diesem Merkblatt gegengelesen (Karenzfrist, EU/EFTA, Frist für Krankheitskosten,
  // Meldepflicht, Rückerstattung aus dem Nachlass, Haushaltabgabe).
  ahvMerkblattEL: {
    url: 'https://www.ahv-iv.ch/p/5.01.d',
    text: 'Merkblatt 5.01 «Ergänzungsleistungen zur AHV und IV»',
    sprachen: {
      fr: 'https://www.ahv-iv.ch/p/5.01.f',
      it: 'https://www.ahv-iv.ch/p/5.01.i',
    },
    texte: {
      fr: 'Mémento 5.01 « Prestations complémentaires à l’AVS et à l’AI »',
      it: 'Promemoria 5.01 «Prestazioni complementari all’AVS e all’AI»',
      en: 'Leaflet 5.01 “Supplementary benefits to the AHV and IV”',
      rm: 'Fegl d’infurmaziun 5.01 «Prestaziuns cumplementaras a l’AVS ed a l’AI»',
    },
  },
  // arbeit.swiss, das Portal von Arbeitslosenversicherung und öffentlicher Arbeitsvermittlung (SECO).
  // Am 16.11.2026 per curl gemessen: /de, /fr, /it, /en je 200 mit lang="de|fr|it|en" und passendem
  // Titel («Arbeitslosenversicherung und öffentliche Arbeitsvermittlung in der Schweiz» usw.);
  // Gegenprobe /de/xxyyzz-erfunden 404, /rm 404. Die alten Adressen /secoalv/<sprache>/home.html
  // leiten um oder laufen ins Leere — nicht mehr verwenden.
  arbeitSwiss: {
    url: 'https://www.arbeit.swiss/de',
    text: 'arbeit.swiss, Arbeitslosenversicherung und öffentliche Arbeitsvermittlung',
    sprachen: {
      fr: 'https://www.arbeit.swiss/fr',
      it: 'https://www.arbeit.swiss/it',
      en: 'https://www.arbeit.swiss/en',
    },
    texte: {
      fr: 'arbeit.swiss, assurance-chômage et service public de l’emploi',
      it: 'arbeit.swiss, assicurazione contro la disoccupazione e servizio pubblico di collocamento',
      en: 'arbeit.swiss, unemployment insurance and public employment service',
      rm: 'arbeit.swiss, assicuranza cunter la dischoccupaziun e intermediaziun publica da lavur',
    },
  },
  ahvMerkblatt: {
    url: 'https://www.ahv-iv.ch/p/3.01.d',
    text: 'Merkblatt 3.01 «Altersrenten und Hilflosenentschädigungen der AHV»',
    sprachen: {
      fr: 'https://www.ahv-iv.ch/p/3.01.f',
      it: 'https://www.ahv-iv.ch/p/3.01.i',
      en: 'https://www.ahv-iv.ch/p/3.01.e',
    },
    texte: {
      fr: 'Mémento 3.01 « Rentes de vieillesse et allocations pour impotent de l’AVS »',
      it: 'Promemoria 3.01 «Rendite di vecchiaia e assegni per grandi invalidi dell’AVS»',
      en: 'Leaflet 3.01 “Old-age pensions and helplessness allowances of the AHV”',
      rm: 'Fegl d’infurmaziun 3.01 «Rentas da vegliadetgna ed indemnisaziuns d’impotenza da l’AVS»',
    },
  },
};

// Eine Quelle in einer Sprache. Gibt es die Adresse dort nicht, kommt die
// deutsche zurück — zusammen mit `nurDeutsch: true`, damit der Generator es
// sichtbar hinschreiben kann statt es zu verschweigen.
export const quelleFuer = (schluessel, sprache = 'de') => {
  const s = QUELLEN[schluessel];
  if (!s) throw new Error(`Unbekannte Quelle: ${schluessel}`);
  if (sprache === 'de') return { url: s.url, text: s.text, nurDeutsch: false };
  const url = (s.sprachen || {})[sprache];
  return {
    url: url || s.url,
    text: (s.texte || {})[sprache] || s.text,
    nurDeutsch: !url,
  };
};

const q = (schluessel) => QUELLEN[schluessel];

export const SEITEN = [
  // ─── Pillar ───────────────────────────────────────────────────────────────
  {
    pfad: 'was-steht-mir-zu',
    titel: 'Was steht mir zu? Überblick für die Schweiz',
    beschreibung:
      'Unterstützung in der Schweiz ist auf Bund, Kantone und Gemeinden verteilt — vieles bleibt ungenutzt, weil man es nicht kennt. Ein Überblick, Thema für Thema.',
    brotkrume: 'Was steht mir zu?',
    vorspann:
      'Es gibt in der Schweiz nicht einen Topf, aus dem Unterstützung kommt, sondern viele kleine — verteilt auf Bund, Kantone und Gemeinden. Wer worauf Anspruch hat, hängt deshalb stark vom Wohnort ab. Wird eine Leistung nicht bezogen, liegt das nicht immer am fehlenden Anspruch — manchmal weiss man schlicht nicht, dass es sie gibt.',
    // Drei Schichten (Brand Book §8, 09.11.2026), vorerst nur Deutsch.
    schichten: true,
    abschnitte: [
      {
        id: 'ebenen',
        bild: `<ol class="zeit kern" role="list" aria-label="Wer was tut">
          <li><span class="jahr">Bund</span><span class="was">setzt bei vielen Leistungen nur den Rahmen</span></li>
          <li><span class="jahr">Kantone</span><span class="was">füllen ihn aus, mit eigenen Grenzen, Formularen und Fristen</span></li>
          <li><span class="jahr">Gemeinden</span><span class="was">führen in mehreren Bereichen aus; in der Sozialhilfe oft die Stelle, mit der man zu tun hat</span></li>
        </ol>`,
        kurzAbsatz: 3,
        wege: ['kantone-im-vergleich', 'politsystem'],
        titel: 'Drei Ebenen, die sich nicht abstimmen',
        absaetze: [
          'Der <strong>Bund</strong> setzt bei vielen Leistungen nur den Rahmen: er schreibt vor, dass es etwas geben muss, und überlässt die Ausgestaltung weitgehend den Kantonen. Das gilt zum Beispiel für die Prämienverbilligung.',
          'Die <strong>Kantone</strong> füllen diesen Rahmen aus — mit eigenen Grenzen, eigenen Formularen, eigenen Fristen. Zwei Haushalte mit identischen Zahlen können in zwei Kantonen unterschiedlich behandelt werden. Der Föderalismus lässt diese Unterschiede bewusst zu.',
          'Die <strong>Gemeinden</strong> führen in mehreren Bereichen aus, was der Kanton beschliesst — in der Sozialhilfe sind sie oft die Stelle, mit der Sie tatsächlich zu tun haben.',
          'Praktisch heisst das: Eine allgemeine Antwort auf «steht mir das zu?» gibt es nicht. Es gibt nur die Antwort für Ihren Wohnort, Ihre Situation und Ihr Jahr.',
        ],
      },
      {
        id: 'themen',
        kurzAbsatz: 0,
        titel: 'Die Themen im Einzelnen',
        absaetze: [
          'Drei Bereiche betreffen die meisten Menschen. Bei allen dreien kann sich der Blick auch dann lohnen, wenn Sie meinen, es treffe Sie nicht:',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        id: 'liegen',
        bild: `<div class="kern">
          <p class="unter" id="huerden">Was Menschen von einem Antrag abhalten kann:</p>
          <ul class="chips" role="list" aria-labelledby="huerden">
            <li>nicht wissen, dass es die Leistung gibt</li>
            <li>Formulare in einer fremden Sprache</li>
            <li>Fristen, die nirgends zusammen stehen</li>
            <li>die Sorge, etwas falsch zu machen</li>
            <li>«Unterstützung ist etwas für andere»</li>
          </ul>
        </div>`,
        kurzAbsatz: 1,
        wege: ['praemienverbilligung'],
        titel: 'Warum so vieles liegen bleibt',
        absaetze: [
          'Ein Anspruch, von dem niemand weiss, wird nicht bezogen. Dazu kommen Hürden, die mit dem Anspruch selbst nichts zu tun haben: Formulare in einer Sprache, die man erst lernen muss. Fristen, die nirgends zusammen stehen. Die Sorge, etwas falsch zu machen. Und die verbreitete Annahme, Unterstützung sei etwas für andere.',
          'An den Voraussetzungen einer Leistung ändert nichts davon etwas. Aber jede dieser Hürden kann dazu führen, dass ein Antrag gar nicht erst gestellt wird.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Wie finde ich heraus, was mir zustehen könnte?',
        antwort:
          'Der zuverlässigste Weg führt über die Stelle, die tatsächlich entscheidet — also über Ihren Kanton beziehungsweise Ihre Gemeinde. Rechner und Übersichten wie die hier verlinkten geben eine erste Orientierung, ob ein Antrag infrage kommt. Verbindlich ist immer erst die Verfügung der zuständigen Stelle.',
      },
      {
        frage: 'Warum ist es je nach Kanton anders?',
        antwort:
          'Weil der Bund bei vielen Leistungen bewusst nur den Rahmen setzt und die Kantone ihn ausfüllen. Sie legen eigene Einkommensgrenzen, Verfahren und Fristen fest. Ein Umzug über die Kantonsgrenze kann den Anspruch deshalb verändern, auch wenn sich sonst nichts geändert hat.',
      },
      {
        frage: 'Muss ich überall selbst einen Antrag stellen?',
        antwort:
          'Das ist je nach Leistung und Kanton unterschiedlich. Bei manchen Leistungen melden sich die Stellen von sich aus, bei anderen passiert ohne Antrag nichts. Im Zweifel fragen Sie bei der Stelle nach — ein nicht gestellter Antrag wird nie bewilligt. Ohne Schweizer Pass gilt für die Sozialhilfe eine Ausnahme: Der Bezug kann Folgen für die Aufenthaltsbewilligung haben; lassen Sie sich vor dem Antrag beraten (mehr dazu auf der Seite Sozialhilfe).',
      },
      {
        frage: 'Was kostet Maloja Plana?',
        antwort:
          'Nichts. Maloja Plana ist kostenlos und quelloffen. Es gibt kein Konto, keine Werbung und kein Tracking; alle Angaben bleiben auf Ihrem Gerät.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
    // Hintergrundseiten (scripts/seiten/hintergrund.mjs), nur auf Deutsch verlinkt.
    // Kantonsatlas: Ergänzung B (Wege durch Maloja, 07.11.2026).
    hintergrund: ['krankenkasse', 'kantone-im-vergleich', 'kantonsatlas', 'politsystem'],
  },

  // ─── Prämienverbilligung ──────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Prämienverbilligung: wer sie bekommen kann',
    beschreibung:
      'Die Prämienverbilligung (IPV) ist ein Beitrag an die Krankenkassenprämie. Der Bund setzt den Rahmen, die Kantone entscheiden — was das für Sie bedeutet.',
    brotkrume: 'Prämienverbilligung',
    vorspann:
      'Die individuelle Prämienverbilligung — meist kurz IPV — ist ein Beitrag der öffentlichen Hand an die Krankenkassenprämie. Sie ist im Krankenversicherungsgesetz (KVG) angelegt, aber der Bund führt sie nicht aus: das tun die Kantone, jeder nach eigenen Regeln, im Rahmen des Bundesrechts.',
    // Drei Schichten (Brand Book §8, 09.11.2026), vorerst nur Deutsch.
    schichten: true,
    abschnitte: [
      {
        id: 'bund-kanton',
        bild: `<ol class="zeit kern" role="list" aria-label="Wer was tut">
          <li><span class="jahr">Bund</span><span class="was">schreibt vor, dass es sie gibt, setzt Mindestvorgaben und zahlt mit</span></li>
          <li><span class="jahr">Kanton</span><span class="was">entscheidet im Rahmen dieser Vorgaben, wer sie bekommt und wie viel, mit Grenzen, Antrag und Fristen</span></li>
          <li><span class="jahr">Krankenkasse</span><span class="was">bekommt den Beitrag direkt vom Kanton, nicht die versicherte Person</span></li>
        </ol>`,
        kurzAbsatz: 3,
        wege: ['kantone-im-vergleich', 'kantonsatlas'],
        titel: 'Was der Bund vorgibt und was der Kanton entscheidet',
        absaetze: [
          'Der Bund schreibt vor, <em>dass</em> es eine Prämienverbilligung geben muss, setzt dafür Mindestvorgaben und beteiligt sich an der Finanzierung. Im Rahmen dieser Vorgaben entscheidet der Kanton, wer sie bekommt und wie viel.',
          'Drei Vorgaben gelten überall. Bei unteren und mittleren Einkommen verbilligen die Kantone die Prämien der Kinder um mindestens 80 Prozent und die der jungen Erwachsenen in Ausbildung um mindestens 50 Prozent (Art. 65 Abs. 1bis KVG). Jeder Kanton legt fest, welchen Anteil die Prämie am verfügbaren Einkommen höchstens ausmachen darf (Art. 65 Abs. 1ter KVG). Und ist der Anspruch festgestellt, muss die Auszahlung so erfolgen, dass Sie die Prämie nicht vorschiessen müssen (Art. 65 Abs. 3 KVG).',
          'Konkret unterscheiden sich von Kanton zu Kanton: die Einkommens- und Vermögensgrenzen, wie das massgebende Einkommen überhaupt berechnet wird, ob Sie einen Antrag stellen müssen oder angeschrieben werden, und die Fristen.',
          'Gleich ist dagegen überall, <strong>wohin das Geld fliesst</strong>: der Kanton zahlt den Beitrag direkt an die Krankenkasse, nicht an die versicherte Person. Das steht im KVG und ist nicht kantonaler Spielraum.',
          'Deshalb führt der Satz «bei uns bekommt man das ab Einkommen X» selten weiter. Er stimmt höchstens für einen Kanton, und dort auch nur für ein Jahr.',
        ],
      },
      {
        id: 'zahlen',
        bild: `<div class="kern">
          <ol class="zeit" role="list" aria-label="Woher die Zahlen kommen">
            <li><span class="jahr">Steuererklärung</span><span class="was">oft nicht die des laufenden Jahres</span></li>
            <li><span class="jahr">Veranlagung</span><span class="was">oft eine frühere, bereits rechtskräftige</span></li>
            <li><span class="jahr">Verbilligung</span><span class="was">stützt sich in der Regel darauf</span></li>
          </ol>
          <p class="unter">Haben sich Einkommen oder Familie seither deutlich verändert, fragen Sie bei der zuständigen Stelle nach (Art. 65 Abs. 3 KVG).</p>
        </div>`,
        kurzAbsatz: 0,
        wege: ['steuern'],
        titel: 'Welche Zahlen zählen',
        absaetze: [
          'Die Kantone stützen sich in der Regel auf die Steuerdaten — und oft nicht auf die des laufenden Jahres, sondern auf eine frühere, bereits rechtskräftige Veranlagung. Das hat eine Folge, die überrascht: Verdienen Sie dieses Jahr deutlich weniger, wird das in vielen Kantonen nicht automatisch berücksichtigt. Andere rechnen es erst mit der späteren definitiven Abrechnung nach.',
          'Das KVG verlangt jedoch, dass die Kantone bei der Überprüfung des Anspruchs die aktuellsten Einkommens- und Familienverhältnisse berücksichtigen, insbesondere auf Antrag (Art. 65 Abs. 3 KVG). Das Nähere, etwa Bedingungen, Nachweise, Fristen und Beginn der Wirkung, regelt Ihr Kanton. Ein Anspruch auf Verbilligung folgt daraus nicht von selbst. Auskunft gibt die zuständige Stelle — meist die kantonale Sozialversicherungsanstalt (SVA) oder die Ausgleichskasse, in einzelnen Kantonen aber die Steuerverwaltung oder die Wohngemeinde.',
        ],
      },
      {
        id: 'irrtum',
        bild: `<ul class="irrtum" role="list">
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>Mit einem Erwerbseinkommen bekommt man grundsätzlich nichts.</span><span class="richtig"><span class="sr-only">Richtig: </span>Auch mit Lohn kann ein Anspruch bestehen.</span></li>
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>Ein abgelehnter Antrag gilt für immer.</span><span class="richtig"><span class="sr-only">Richtig: </span>Er betrifft in der Regel ein Jahr. Ändert sich Ihre Lage, ist eine neue Anfrage möglich.</span></li>
        </ul>`,
        kurzAbsatz: 0,
        wege: ['was-steht-mir-zu'],
        titel: 'Zwei häufige Irrtümer',
        absaetze: [
          'Viele gehen davon aus, dass es mit einem Erwerbseinkommen grundsätzlich nichts gibt. Das trifft nicht zu: Prämienverbilligung ist keine Leistung nur für Menschen ohne Arbeit. Familien mit Kindern, Personen in Ausbildung und Haushalte mit mittlerem Einkommen fallen in vielen Kantonen darunter.',
          'Der zweite Irrtum ist, dass ein einmal abgelehnter Antrag für immer gilt. Er gilt für sein Jahr. Ändern sich Einkommen, Haushalt oder Wohnkanton, ist es eine neue Frage.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Habe ich Anspruch auf Prämienverbilligung?',
        antwort:
          'Das hängt vom Wohnkanton, vom massgebenden Einkommen und Vermögen und von der Haushaltsgrösse ab — alle drei werden kantonal unterschiedlich gewichtet. Eine allgemein gültige Grenze gibt es nicht. Verbindlich entscheidet die zuständige Stelle: meist die kantonale Sozialversicherungsanstalt oder die Ausgleichskasse, in einzelnen Kantonen die Steuerverwaltung oder die Wohngemeinde. Eine Ausnahme gilt im Asylbereich: Mit Ausweis N oder S ist der Anspruch sistiert, solange ganz oder teilweise Sozialhilfe bezogen wird (AsylG Art. 82a Abs. 7). Mit Ausweis F gilt das ebenso, ausser die Einreise liegt mehr als sieben Jahre zurück (AIG Art. 86 Abs. 2, AsylV 2 Art. 5b). Für vorläufig aufgenommene Flüchtlinge kann anderes gelten; das klärt die kantonale Stelle.',
      },
      {
        frage: 'Muss ich einen Antrag stellen?',
        antwort:
          'In manchen Kantonen werden Berechtigte von sich aus angeschrieben, in anderen muss der Antrag selbst eingereicht werden. Weil das kantonal geregelt ist und sich ändern kann, ist eine Nachfrage bei Ihrer kantonalen Stelle sinnvoll — auch dann, wenn Sie in einem früheren Jahr schon einmal etwas erhalten haben.',
      },
      {
        frage: 'Welches Einkommen wird gerechnet?',
        antwort:
          'In der Regel ein aus der Steuerveranlagung abgeleitetes Einkommen, häufig aus einem früheren Jahr, und oft mit kantonalen Zu- und Abrechnungen. Das Bruttoeinkommen des laufenden Monats ist dafür fast nie die massgebende Zahl.',
      },
      {
        frage: 'Was, wenn mein Einkommen stark gesunken ist?',
        antwort:
          'Dann kann es sich lohnen, nachzufragen. Das KVG verlangt, dass die Kantone bei der Überprüfung des Anspruchs die aktuellsten Einkommens- und Familienverhältnisse berücksichtigen, insbesondere auf Antrag (Art. 65 Abs. 3 KVG). Das Nähere, etwa Bedingungen, Nachweise, Fristen und Beginn der Wirkung, regelt Ihr Kanton. Ein Anspruch auf Verbilligung folgt daraus nicht von selbst. Fragen Sie bei der zuständigen Stelle nach, auch wenn die massgebende Veranlagung noch ein höheres Einkommen ausweist.',
      },
    ],
    quellen: ['priminfo', 'fedlexKvgArt65'],
    hintergrund: ['krankenkasse', 'kantone-im-vergleich', 'kantonsatlas'],
  },

  // ─── Sozialhilfe ──────────────────────────────────────────────────────────
  {
    pfad: 'sozialhilfe',
    titel: 'Sozialhilfe in der Schweiz — eine Orientierung',
    beschreibung:
      'Wer über Sozialhilfe entscheidet, woraus sie sich zusammensetzt und warum die SKOS-Richtlinien nicht automatisch Gesetz sind. Eine Einordnung ohne Zahlen.',
    brotkrume: 'Sozialhilfe',
    vorspann:
      'Sozialhilfe ist die unterste Stufe im schweizerischen Netz — sie greift dort, wo alles andere nicht oder nicht mehr reicht. Zuständig sind nicht der Bund, sondern die Kantone und, in vielen von ihnen, die Gemeinden.',
    // Drei Schichten (Brand Book §8, 09.11.2026), vorerst nur Deutsch.
    schichten: true,
    abschnitte: [
      {
        id: 'subsidiaer',
        bild: `<div class="kern">
          <p class="unter" id="zuerst">Zuerst geprüft:</p>
          <ul class="chips" role="list" aria-labelledby="zuerst">
            <li>Lohn</li><li>Arbeitslosenentschädigung</li><li>Renten</li><li>Ergänzungsleistungen</li>
            <li>Prämienverbilligung</li><li>Unterhaltsbeiträge</li><li>Stipendien</li><li>eigenes Vermögen, mit Freibetrag</li>
          </ul>
          <p class="dann">Reicht das nicht, kommt Sozialhilfe in Frage.</p>
          <p class="unter">Ohne Schweizer Pass: vorher beraten lassen, der Bezug kann Folgen für die Bewilligung haben.</p>
        </div>`,
        kurzAbsatz: 1,
        wege: ['praemienverbilligung', 'was-steht-mir-zu'],
        titel: 'Subsidiär heisst: zuerst alles andere',
        absaetze: [
          'Sozialhilfe ist <strong>subsidiär</strong>. Bevor sie in Frage kommt, werden andere Ansprüche geprüft: Lohn, Arbeitslosenentschädigung, Renten, Ergänzungsleistungen, Prämienverbilligung, Unterhaltsbeiträge, Stipendien. Auch eigenes Vermögen wird berücksichtigt, wobei die Kantone einen Freibetrag kennen, dessen Höhe sich unterscheidet.',
          'Das ist der Grund, warum eine Anmeldung oft mit vielen Fragen zu ganz anderen Leistungen beginnt. Es geht nicht um Misstrauen, sondern um die gesetzliche Reihenfolge.',
          'Ohne Schweizer Pass kann der Bezug von Sozialhilfe Folgen für den Aufenthalt haben. Mit einer Aufenthalts- oder Kurzaufenthaltsbewilligung (B, L) kann er ein Grund sein, die Bewilligung zu widerrufen; mit einer Niederlassungsbewilligung (C), wenn der Bezug dauerhaft und in erheblichem Mass erfolgt (AIG Art. 62 Abs. 1 Bst. e, Art. 63 Abs. 1 Bst. c). Mit Ausweis F kann er ein späteres Gesuch um Familiennachzug oder um eine Aufenthaltsbewilligung erschweren (AIG Art. 85c Abs. 1 Bst. c, Art. 84 Abs. 5). Für Staatsangehörige von EU/EFTA-Staaten gelten zum Teil andere Regeln. Lassen Sie sich vorher bei einer Beratungsstelle oder beim Sozialdienst beraten. Unabhängig vom Aufenthaltsstatus haben Sie in einer Notlage Anspruch auf das Nötigste zum Leben (BV Art. 12, weiter unten).',
        ],
      },
      {
        id: 'skos',
        bild: `<ol class="zeit kern" role="list" aria-label="Was gilt">
          <li><span class="jahr">SKOS-Richtlinien</span><span class="was">Empfehlungen</span></li>
          <li><span class="jahr">Kantonales Recht</span><span class="was">macht sie verbindlich, soweit es sie übernimmt</span></li>
          <li><span class="jahr">Verfügung</span><span class="was">der schriftliche Entscheid: was in Ihrem Fall gilt</span></li>
        </ol>`,
        kurzAbsatz: 1,
        wege: ['kantone-im-vergleich'],
        titel: 'Die SKOS-Richtlinien sind Empfehlungen, nicht Gesetz',
        absaetze: [
          'Dieser Punkt wird oft verwechselt. Die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS) sind <strong>Empfehlungen</strong>. Verbindlich werden sie erst, soweit ein Kanton sie in sein eigenes Recht übernimmt — und das tun die Kantone in unterschiedlichem Umfang.',
          'Praktisch bedeutet das: Ein SKOS-Rechner gibt eine gute erste Orientierung, aber er ist keine Zusage. Was in Ihrem Fall gilt, steht im kantonalen Sozialhilfegesetz und in der Verfügung der zuständigen Stelle.',
        ],
      },
      {
        id: 'bausteine',
        bild: `<div class="kern">
          <ul class="zeit" role="list" aria-label="Drei Bausteine in den meisten Kantonen">
          <li><span class="jahr">Grundbedarf</span><span class="was">für den Lebensunterhalt</span></li>
          <li><span class="jahr">Wohnkosten</span><span class="was">im ortsüblichen Rahmen</span></li>
          <li><span class="jahr">Medizinische Grundversorgung</span></li>
          </ul>
          <p class="unter">In den meisten Kantonen; dazu können situationsbedingte Leistungen kommen.</p>
        </div>`,
        kurzAbsatz: 1,
        titel: 'Woraus sich die Unterstützung typischerweise zusammensetzt',
        absaetze: [
          'In den meisten Kantonen sind es drei Bausteine: ein <strong>Grundbedarf</strong> für den Lebensunterhalt, die <strong>Wohnkosten</strong> im ortsüblichen Rahmen, und die <strong>medizinische Grundversorgung</strong>. Dazu können situationsbedingte Leistungen kommen.',
          'Die Beträge nennen wir hier bewusst nicht: sie unterscheiden sich je nach Kanton und Haushaltsgrösse und werden regelmässig angepasst. Eine Zahl auf einer Seite wie dieser wäre nach kurzer Zeit falsch.',
        ],
      },
      {
        id: 'notlage',
        bild: `<figure class="kern">
          <p class="zahl">Die Untergrenze</p>
          <p class="unter">Bundesverfassung, Artikel 12: für alle, die in Not geraten und nicht für sich sorgen können.</p>
        </figure>`,
        kurzAbsatz: 0,
        titel: 'Recht auf Hilfe in Notlagen', // Randtitel BV Art. 12 (Fedlex, Fassung 3.3.2024); vorher absolut, vgl. BGE 130 I 71 E. 4.3 und 6
        absaetze: [
          'Unabhängig von allem oben steht in der <strong>Bundesverfassung, Artikel 12</strong>, das Recht auf Hilfe in Notlagen: Wer in Not gerät und nicht in der Lage ist, für sich zu sorgen, hat Anspruch auf Hilfe und Betreuung und auf die Mittel, die für ein menschenwürdiges Dasein unerlässlich sind.',
          'Dieses Recht steht allen Menschen in der Schweiz zu. Es ist nicht dasselbe wie Sozialhilfe und deckt weniger ab — aber es ist die Untergrenze, die nicht unterschritten werden darf.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Wie wird Sozialhilfe bemessen?',
        antwort:
          'Das bemisst sich nach Wohnort, Haushaltsgrösse, Einkommen, Vermögen und den tatsächlichen Wohn- und Gesundheitskosten — und es richtet sich nach kantonalem Recht. Eine allgemein gültige Zahl gibt es nicht. Eine provisorische Orientierung geben Sozialhilferechner; verbindlich ist die Verfügung der zuständigen Stelle.',
      },
      {
        frage: 'Sind die SKOS-Richtlinien Gesetz?',
        antwort:
          'Nein. Es sind Empfehlungen der Schweizerischen Konferenz für Sozialhilfe. Verbindlich sind sie nur, soweit ein Kanton sie in sein eigenes Recht übernommen hat. Deshalb kann dieselbe Situation kantonal unterschiedlich beurteilt werden.',
      },
      {
        frage: 'Muss ich zuerst mein Vermögen aufbrauchen?',
        antwort:
          'Vermögen wird angerechnet, aber nicht vollständig: die Kantone kennen einen Freibetrag, der nicht angetastet wird. Wie hoch er ist, unterscheidet sich je nach Kanton und Haushalt. Die zuständige Stelle rechnet das im Einzelfall.',
      },
      {
        frage: 'Was ist der Unterschied zu Ergänzungsleistungen?',
        antwort:
          'Ergänzungsleistungen (EL) gehören zur ersten Säule und kommen in der Regel dann in Frage, wenn eine Leistung der AHV oder IV den Existenzbedarf, also das Nötigste zum Leben, nicht deckt. Sie sind bundesrechtlich geregelt und keine Sozialhilfe. Ein Anspruch auf EL geht der Sozialhilfe vor.',
      },
      {
        frage: 'Hat Sozialhilfe Folgen für meine Aufenthaltsbewilligung?',
        antwort:
          'Ohne Schweizer Pass kann sie welche haben. Mit Ausweis B oder L kann der Bezug ein Grund sein, die Bewilligung zu widerrufen, mit Ausweis C bei dauerhaftem Bezug in erheblichem Mass (AIG Art. 62 Abs. 1 Bst. e, Art. 63 Abs. 1 Bst. c). Mit Ausweis F kann er ein späteres Gesuch um Familiennachzug oder um eine Aufenthaltsbewilligung erschweren (AIG Art. 85c Abs. 1 Bst. c, Art. 84 Abs. 5). Mit Ausweis N oder S und mit Ausweis F in den ersten sieben Jahren nach der Einreise ruht zudem die Prämienverbilligung, solange Sozialhilfe bezogen wird (AsylG Art. 82a Abs. 7, AsylV 2 Art. 5b). Lassen Sie sich vorher bei einer Beratungsstelle oder beim Sozialdienst beraten.',
      },
      {
        frage: 'Muss ich Sozialhilfe zurückzahlen?',
        antwort:
          'Ob und wann, regelt der Kanton — etwa wenn später eine Erbschaft oder ein grösseres Vermögen dazukommt. Ausserdem können Verwandte in gerader Linie, etwa Eltern, Kinder, Grosseltern und Enkel, zur Unterstützung verpflichtet werden, wenn sie in günstigen Verhältnissen leben (ZGB Art. 328 Abs. 1). Was in Ihrem Fall gilt, sagt die zuständige Stelle.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
    // Ergänzung B (07.11.2026): bisher ohne Weg zu den Kantonsseiten, obwohl der Atlas eine Karte Sozialhilfequote hat.
    hintergrund: ['kantone-im-vergleich', 'kantonsatlas'],
  },

  // ─── Steuern ──────────────────────────────────────────────────────────────
  {
    pfad: 'steuern',
    titel: 'Steuern in der Schweiz: Bund, Kanton, Gemeinde',
    beschreibung:
      'Warum dieselbe Lohnsumme je nach Wohnort sehr unterschiedlich besteuert wird — die drei Ebenen, der Steuerfuss und was das praktisch bedeutet.',
    brotkrume: 'Steuern',
    vorspann:
      'Wer in der Schweiz Einkommenssteuer zahlt, zahlt sie in der Regel an drei Stellen gleichzeitig: an den Bund, an den Kanton und an die Gemeinde. Nur die erste ist überall gleich. Die anderen beiden sind der Grund, warum derselbe Lohn an zwei Wohnorten zu spürbar verschiedenen Rechnungen führt.',
    // Drei Schichten (Brand Book §8, 09.11.2026), vorerst nur Deutsch.
    schichten: true,
    abschnitte: [
      {
        id: 'ebenen',
        bild: `<ol class="zeit kern" role="list" aria-label="Drei Stellen, an die Sie Steuern zahlen">
          <li><span class="jahr">Bund</span><span class="was">überall derselbe Tarif</span></li>
          <li><span class="jahr">Kanton</span><span class="was">eigener Tarif, meist mit Steuerfuss</span></li>
          <li><span class="jahr">Gemeinde</span><span class="was">meist eigener Steuerfuss</span></li>
        </ol>`,
        kurzAbsatz: 0,
        titel: 'Die direkte Bundessteuer ist überall dieselbe',
        absaetze: [
          'Die direkte Bundessteuer richtet sich nach dem Bundesgesetz über die direkte Bundessteuer (DBG) und kennt für die ganze Schweiz denselben Tarif. Sie unterscheidet nach Zivilstand und Haushalt, aber nicht nach Wohnort.',
          'Erhoben wird sie trotzdem vom Kanton — die Steuererklärung ist dieselbe.',
          'Anders bei der <strong>Quellensteuer</strong>: Wer ohne Niederlassungsbewilligung in der Schweiz arbeitet, etwa mit Ausweis B, dem zieht der Arbeitgeber die Steuer direkt vom Lohn ab (DBG Art. 83). Liegt der Bruttolohn unter einer gesetzlichen Grenze, gibt es in der Regel keine Steuererklärung. Weitere Abzüge, etwa für die Säule 3a, gibt es dann nur über eine nachträgliche ordentliche Veranlagung; sie muss bis zum 31. März des Folgejahres beantragt werden, beim Wegzug bis zur Abmeldung (DBG Art. 89a Abs. 3). Liegt er darüber, wird von Amtes wegen ordentlich veranlagt (DBG Art. 89, QStV Art. 9).',
        ],
      },
      {
        id: 'steuerfuss',
        bild: `<div class="kern">
          <p class="formel" role="img" aria-label="Der Tarif ergibt die einfache Steuer; mal den Steuerfuss von Kanton und Gemeinde, wo es einen gibt, ergibt das die kantonale und kommunale Steuer. So in den meisten Kantonen; Ausnahmen gibt es.">
            <span class="glied" aria-hidden="true"><strong>Tarif</strong>ergibt die einfache Steuer</span>
            <span class="op" aria-hidden="true">×</span>
            <span class="glied" aria-hidden="true"><strong>Steuerfuss</strong>je für Kanton und Gemeinde, wo es einen gibt</span>
            <span class="op" aria-hidden="true">=</span>
            <span class="glied" aria-hidden="true"><strong>Steuer</strong>von Kanton und Gemeinde</span>
          </p>
          <p class="unter">So in den meisten Kantonen; Ausnahmen gibt es.</p>
        </div>`,
        kurzAbsatz: 2,
        wege: ['kantone-im-vergleich', 'kantonsatlas'],
        titel: 'Kanton und Gemeinde: Tarif mal Steuerfuss',
        absaetze: [
          'Auf kantonaler und kommunaler Ebene kommen zwei Grössen zusammen. Der <strong>Tarif</strong> legt fest, wie viel Steuer ein bestimmtes steuerbares Einkommen auslöst — das ergibt die sogenannte einfache Steuer. Der <strong>Steuerfuss</strong> ist ein Faktor darauf, meist in Prozent angegeben, den Kanton und Gemeinde je für sich festlegen und jährlich anpassen können.',
          'Auf der Rechnung stehen je nach Kanton und Konfession noch weitere Posten, etwa die Kirchensteuer oder eine Personalsteuer. Sie sind meist klein, aber sie erklären, warum die Summe nicht genau dem entspricht, was ein reiner Einkommensrechner ausgibt.',
          'Zwei Gemeinden im selben Kanton haben deshalb denselben Tarif, aber je ihren eigenen Steuerfuss — der sich unterscheiden kann. Zwei Kantone haben beides verschieden. Das ist der eigentliche Hebel hinter den bekannten Kantonsvergleichen. In einzelnen Kantonen gibt es daneben Besonderheiten, etwa Gemeinden ohne eigene Gemeindesteuer.',
        ],
      },
      {
        id: 'abzuege',
        bild: `<div class="kern">
          <p class="unter" id="abzug">Vom Lohn zum steuerbaren Einkommen, je nach Situation abzüglich:</p>
          <ul class="chips" role="list" aria-labelledby="abzug">
            <li>Berufsauslagen</li><li>Beiträge an die Säule 3a</li><li>Krankheitskosten über einer Schwelle</li><li>Kinder- und Betreuungsabzüge</li><li>weitere</li>
          </ul>
        </div>`,
        kurzAbsatz: 1,
        wege: ['kantone-im-vergleich'],
        titel: 'Was vom Einkommen abgezogen wird',
        absaetze: [
          'Besteuert wird nicht der Lohn, sondern das <strong>steuerbare Einkommen</strong> — also das, was nach den zulässigen Abzügen bleibt. Dazu gehören je nach Situation Berufsauslagen, Beiträge an die Säule 3a, Krankheitskosten über einer Schwelle, Kinder- und Betreuungsabzüge und weitere.',
          'Welche Abzüge in welcher Höhe zulässig sind, unterscheidet sich zwischen Bund und Kanton und zwischen den Kantonen. Welche Abzüge möglich sind und welche Belege es braucht, steht in der Wegleitung Ihres Kantons.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Warum zahle ich anders als jemand im Nachbarkanton?',
        antwort:
          'Weil der Kanton den Tarif festlegt und Kanton und Gemeinde je ihren eigenen Steuerfuss beschliessen. Nur die direkte Bundessteuer ist überall gleich. Derselbe Lohn kann dadurch je nach Wohnort zu deutlich verschiedenen Rechnungen führen.',
      },
      {
        frage: 'Was ist der Steuerfuss?',
        antwort:
          'Ein Faktor auf die einfache Steuer, meist in Prozent angegeben, den Kanton und Gemeinde je für sich beschliessen. Der Tarif sagt, wie hoch die einfache Steuer ausfällt; der Steuerfuss sagt, mit welchem Faktor sie erhoben wird. Beide zusammen ergeben die kantonale und kommunale Steuer.',
      },
      {
        frage: 'Welche Abzüge kann ich machen?',
        antwort:
          'Das hängt von der Situation und vom Kanton ab — häufig sind Berufsauslagen, Beiträge an die Säule 3a, Krankheits- und Unfallkosten über einer Schwelle sowie Kinder- und Betreuungsabzüge. Höhe und Voraussetzungen unterscheiden sich zwischen Bund und Kanton; verbindlich ist die Wegleitung des eigenen Kantons.',
      },
      {
        frage: 'Wo rechne ich verbindlich?',
        antwort:
          'Verbindlich ist am Ende die Veranlagung der kantonalen Steuerverwaltung. Für eine belastbare Vorausberechnung stellt die Eidgenössische Steuerverwaltung einen Rechner bereit, der Bund, Kanton und Gemeinde berücksichtigt.',
      },
    ],
    quellen: ['estvRechner'],
    // Ergänzung B (07.11.2026): bisher ohne Weg zu den Kantonsseiten, obwohl der Atlas eine Karte Steuern hat.
    hintergrund: ['kantone-im-vergleich', 'kantonsatlas'],
  },

  // ─── Ergänzungsleistungen ─────────────────────────────────────────────────
  // Seitenlandkarte E3 / Organigramm C1 (06.11.2026): die erste der drei geplanten Seiten, im
  // Kapitel Versicherungen & Vorsorge unter «Zum Verstehen». Gebaut 14.11.2026.
  //
  // Belegt an: Merkblatt 5.01 (Stand 1.1.2025, s. QUELLEN.ahvMerkblattEL) und an den bereits
  // fachgeprüften App-Texten `ergaenzungsleistungen.*` in src/i18n/de.js (ELG Art. 4, 5, 9, 9a, 11a,
  // 12, 14, 16a, 21; ELV Art. 22). Neu gegenüber der App, darum besonders zu prüfen: ELG Art. 10
  // (Mietzins nach Region), Art. 11 (Liegenschaft), Art. 15 (Frist Krankheitskosten), ELV Art. 24
  // (Meldepflicht), AIG Art. 43/44 (Familiennachzug), RTVG Art. 69b (Haushaltabgabe).
  {
    pfad: 'ergaenzungsleistungen',
    bundesrecht: true,
    titel: 'Ergänzungsleistungen zur AHV und IV',
    beschreibung:
      'Wann Ergänzungsleistungen (EL) in Frage kommen, wie sie berechnet werden und warum sie keine Sozialhilfe sind. Eine Einordnung ohne Zahlen.',
    brotkrume: 'Ergänzungsleistungen',
    vorspann:
      'Ergänzungsleistungen, kurz EL, helfen dort, wo eine Rente der AHV oder IV und das übrige Einkommen nicht für das Nötigste zum Leben reichen. Sie sind im Bundesgesetz über Ergänzungsleistungen (ELG) geregelt und ein gesetzlicher Anspruch, kein Entgegenkommen. Ausgerichtet werden sie von den Kantonen.',
    schichten: true,
    abschnitte: [
      {
        id: 'voraussetzungen',
        bild: `<ol class="zeit kern" role="list" aria-label="Was vorausgesetzt ist">
          <li><span class="jahr">AHV oder IV</span><span class="was">eine Rente, eine Hilflosenentschädigung oder ein länger laufendes Taggeld der IV</span></li>
          <li><span class="jahr">Schweiz</span><span class="was">Wohnsitz und gewöhnlicher Aufenthalt hier</span></li>
          <li><span class="jahr">Vermögen</span><span class="was">unter einer gesetzlichen Schwelle</span></li>
        </ol>`,
        kurzAbsatz: 0,
        wege: ['sozialhilfe'],
        titel: 'Ohne Leistung der AHV oder IV gibt es keine EL',
        absaetze: [
          'EL setzen eine Leistung der AHV oder IV voraus: eine Alters- oder Hinterlassenenrente der AHV, auch eine vorbezogene, eine Rente der IV, eine Hilflosenentschädigung der IV oder ein Taggeld der IV, das seit mindestens sechs Monaten ununterbrochen läuft. Dazu kommen Wohnsitz und gewöhnlicher Aufenthalt in der Schweiz (ELG Art. 4).',
          'Für Ausländerinnen und Ausländer gilt zusätzlich eine Mindestaufenthaltsdauer: in der Regel zehn Jahre ununterbrochen in der Schweiz, für Flüchtlinge und Staatenlose fünf Jahre (ELG Art. 5). Für Staatsangehörige eines EU- oder EFTA-Staates gilt sie nicht.',
          'Wer keine Rente hat, nur weil zu wenige Beitragsjahre zusammenkamen, kann unter gewissen Voraussetzungen trotzdem EL erhalten (ELG Art. 4). Wer ganz ohne Leistung der AHV oder IV in Not gerät, wendet sich an die Sozialhilfe der Wohngemeinde.',
        ],
      },
      {
        id: 'berechnung',
        bild: `<div class="kern">
          <p class="formel" role="img" aria-label="Anerkannte Ausgaben minus anrechenbare Einnahmen ergibt die jährliche Ergänzungsleistung, wenn die Ausgaben höher sind.">
            <span class="glied" aria-hidden="true"><strong>Ausgaben</strong>vom Gesetz anerkannt</span>
            <span class="op" aria-hidden="true">−</span>
            <span class="glied" aria-hidden="true"><strong>Einnahmen</strong>soweit anrechenbar</span>
            <span class="op" aria-hidden="true">=</span>
            <span class="glied" aria-hidden="true"><strong>EL</strong>wenn die Ausgaben höher sind</span>
          </p>
          <p class="unter">Die Beträge setzt das Gesetz fest. Ihren Anspruch rechnet die EL-Stelle aus.</p>
        </div>`,
        kurzAbsatz: 0,
        wege: ['kantonsatlas'],
        titel: 'Die Lücke zwischen Ausgaben und Einnahmen',
        absaetze: [
          'Die jährliche EL entspricht dem Betrag, um den die <strong>anerkannten Ausgaben</strong> die <strong>anrechenbaren Einnahmen</strong> übersteigen (ELG Art. 9). Zu den Ausgaben gehören etwa ein Betrag für den allgemeinen Lebensbedarf, die Miete bis zu einer Höchstgrenze und ein Betrag für die Krankenkassenprämie (ELG Art. 10). Zu den Einnahmen gehören Renten, ein Teil des Erwerbseinkommens und ein Teil des Vermögens (ELG Art. 11).',
          'Anspruch hat nur, wessen Vermögen unter einer gesetzlichen Schwelle liegt; eine selbst bewohnte Liegenschaft zählt dabei nicht mit (ELG Art. 9a). Vermögen, auf das jemand ohne Gegenleistung verzichtet hat, etwa durch eine Schenkung, wird mitgezählt (ELG Art. 11a).',
          'Die Beträge für den Lebensbedarf legt der Bund fest, die Höchstgrenzen für die Miete abgestuft nach drei Regionen (ELG Art. 10). Wir nennen sie hier bewusst nicht: Sie werden regelmässig angepasst, und eine Zahl auf einer Seite wie dieser wäre bald falsch. Wer im Heim lebt, wird nach eigenen Regeln berechnet; die Kantone können die anerkannten Heimkosten begrenzen.',
        ],
      },
      {
        id: 'krankheitskosten',
        bild: `<div class="kern">
          <p class="unter" id="kosten">Zusätzlich zur jährlichen EL vergütet, soweit der Kanton es vorsieht:</p>
          <ul class="chips" role="list" aria-labelledby="kosten">
            <li>Zahnarzt</li><li>Hilfe, Pflege und Betreuung zu Hause</li><li>Transport zur Behandlung</li><li>Hilfsmittel</li><li>Franchise und Selbstbehalt</li><li>Diät, wenn sie lebensnotwendig ist</li>
          </ul>
        </div>`,
        kurzAbsatz: 0,
        wege: ['krankenkasse', 'praemienverbilligung'],
        titel: 'Krankheits- und Behinderungskosten kommen dazu',
        absaetze: [
          'Neben der jährlichen EL vergütet der Kanton ausgewiesene Krankheits- und Behinderungskosten, etwa für den Zahnarzt, für Hilfe, Pflege und Betreuung zu Hause, für den Transport zur Behandlung, für Hilfsmittel sowie Franchise und Selbstbehalt der Krankenkasse (ELG Art. 14). Welche Kosten genau und bis zu welchem Betrag, bestimmt der Kanton.',
          'Auch wer wegen etwas zu hoher Einnahmen keine jährliche EL erhält, kann solche Kosten vergütet bekommen, soweit sie den Einnahmenüberschuss übersteigen.',
          'Heben Sie Rechnungen und Belege auf: Vergütet wird nur, was ausgewiesen ist, und nur, wenn Sie es innert einer gesetzlichen Frist nach der Rechnungsstellung geltend machen (ELG Art. 15).',
        ],
      },
      {
        id: 'anmelden',
        bild: `<ol class="zeit kern" role="list" aria-label="Der Weg zur EL">
          <li><span class="jahr">Anmeldung</span><span class="was">bei der Stelle, die Ihr Wohnkanton bestimmt</span></li>
          <li><span class="jahr">Anspruch</span><span class="was">beginnt in der Regel mit dem Monat der Anmeldung</span></li>
          <li><span class="jahr">Verfügung</span><span class="was">der schriftliche Entscheid, mit Berechnung</span></li>
        </ol>`,
        kurzAbsatz: 1,
        wege: ['was-steht-mir-zu'],
        titel: 'Anmelden: beim Wohnkanton, und früh',
        absaetze: [
          'Zuständig ist der Kanton, in dem Sie Wohnsitz haben. Welche Stelle die Anmeldung entgegennimmt, bestimmt er; meist ist es die kantonale Ausgleichskasse oder Sozialversicherungsanstalt, oft über die AHV-Zweigstelle der Wohngemeinde (ELG Art. 21).',
          'Der Anspruch beginnt in der Regel mit dem Monat, in dem die Anmeldung eingereicht wird (ELG Art. 12). Früher beginnen kann er nur in bestimmten Fällen, etwa wenn die Anmeldung innert sechs Monaten nach einer Rentenverfügung oder nach einem Eintritt ins Heim oder Spital erfolgt (ELG Art. 12 Abs. 2, ELV Art. 22). Wer zuwartet, kann darum Monate verlieren.',
          'Sind Sie unsicher, ob sich eine Anmeldung lohnt, fragen Sie bei der EL-Stelle nach. Sie prüft den Anspruch und begründet ihren Entscheid in einer Verfügung.',
        ],
      },
      {
        id: 'keine-sozialhilfe',
        bild: `<ul class="irrtum" role="list">
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>EL sind eine Form von Sozialhilfe.</span><span class="richtig"><span class="sr-only">Richtig: </span>EL sind ein Anspruch nach Bundesrecht und gehen der Sozialhilfe vor.</span></li>
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>Wer EL bezieht, muss sie später zurückzahlen.</span><span class="richtig"><span class="sr-only">Richtig: </span>Rechtmässig bezogene EL werden erst aus dem Nachlass zurückerstattet, und nur über einem Freibetrag.</span></li>
        </ul>`,
        kurzAbsatz: 0,
        wege: ['sozialhilfe'],
        titel: 'EL sind keine Sozialhilfe',
        absaetze: [
          'EL werden oft mit Sozialhilfe verwechselt. Sie sind etwas anderes: ein Anspruch nach Bundesrecht, berechnet nach Regeln, die in der ganzen Schweiz gelten. Ein Anspruch auf EL geht der Sozialhilfe vor.',
          'Zu Lebzeiten müssen Sie rechtmässig bezogene EL nicht zurückzahlen. Nach dem Tod werden sie aus dem Nachlass zurückerstattet, aber nur aus dem Teil, der einen gesetzlichen Freibetrag übersteigt, bei Ehepaaren erst aus dem Nachlass der zweitverstorbenen Person (ELG Art. 16a).',
          'Ohne Schweizer Pass und ohne Staatsangehörigkeit eines EU- oder EFTA-Staates wird der Nachzug von Familienangehörigen in der Regel nicht bewilligt, wenn Sie jährliche EL beziehen oder wegen des Nachzugs beziehen würden (AIG Art. 43 Abs. 1 Bst. e, Art. 44 Abs. 1 Bst. e). Lassen Sie sich in diesem Fall vorher beraten.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Habe ich Anspruch auf Ergänzungsleistungen?',
        antwort:
          'Das hängt davon ab, ob Sie eine Leistung der AHV oder IV beziehen, wo Sie wohnen und wie Ihre Einnahmen, Ausgaben und Ihr Vermögen aussehen. Eine allgemein gültige Grenze gibt es nicht, weil die Miete, die Prämie und der Haushalt mitzählen. Eine erste Orientierung gibt der EL-Rechner der AHV/IV; verbindlich ist die Verfügung der EL-Stelle Ihres Kantons.',
      },
      {
        frage: 'Gibt es EL auch vor dem Rentenalter?',
        antwort:
          'Ja. Wer eine Rente der IV, eine Witwen-, Witwer- oder Waisenrente bezieht, kann auch vor dem Rentenalter EL erhalten. Auch wer die AHV-Rente vorbezieht, erfüllt die Voraussetzung einer Rente (ELG Art. 4); die gekürzte Rente zählt dann als Einnahme (ELG Art. 11). Wer ab sechzig von der Arbeitslosenversicherung ausgesteuert wird, kann unter Umständen Überbrückungsleistungen erhalten; auch diese meldet man bei der EL-Stelle an.',
      },
      {
        frage: 'Zählt mein Haus oder meine Wohnung?',
        antwort:
          'Bei der Vermögensschwelle zählt eine selbst bewohnte Liegenschaft nicht mit (ELG Art. 9a). In der Berechnung selbst wird ihr Wert berücksichtigt, aber mit einem Freibetrag (ELG Art. 11). Wie das in Ihrem Fall ausgeht, rechnet die EL-Stelle.',
      },
      {
        frage: 'Was gilt, wenn ich ins Heim muss?',
        antwort:
          'Dann wird die EL nach eigenen Regeln berechnet: Statt Lebensbedarf und Miete zählen die Tagestaxe des Heims, für die der Kanton einen Höchstbetrag festlegen kann, und ein Betrag für persönliche Auslagen, den der Kanton bestimmt (ELG Art. 10 Abs. 2). Melden Sie sich innert sechs Monaten nach dem Eintritt an; dann kann der Anspruch schon ab dem Monat des Eintritts beginnen, wenn die übrigen Voraussetzungen erfüllt sind (ELG Art. 12 Abs. 2).',
      },
      {
        frage: 'Muss ich Änderungen melden?',
        antwort:
          'Ja. Jede Änderung der persönlichen und jede grössere Änderung der wirtschaftlichen Verhältnisse muss der EL-Stelle sofort gemeldet werden, etwa ein Umzug, eine neue Miete, eine Erbschaft oder ein Heimeintritt (ELV Art. 24). Zu Unrecht bezogene Leistungen müssen zurückerstattet werden.',
      },
      {
        frage: 'Was bringt eine EL sonst noch?',
        antwort:
          'Wer jährliche EL zur AHV oder IV bezieht, ist von der Radio- und Fernsehabgabe befreit; die Befreiung beantragt man bei der Erhebungsstelle mit der Bestätigung der EL-Stelle. Der Betrag für die Krankenkassenprämie, der in der Berechnung mitzählt, geht direkt an die Krankenkasse. Fragen Sie im Zweifel bei der EL-Stelle nach.',
      },
    ],
    quellen: ['ahvMerkblattEL', 'bsvEL'],
    hintergrund: ['kantonsatlas', 'kantone-im-vergleich'],
  },

  // ─── Arbeitslosigkeit ─────────────────────────────────────────────────────
  // Seitenlandkarte E3 / Organigramm C1: die zweite der drei geplanten Seiten, im Kapitel Arbeit &
  // Ausbildung (CHAPTER_KEYS 'ausbildung') unter «Zum Verstehen». Gebaut 16.11.2026.
  //
  // Belegt an den fachgeprüften App-Texten `stelleVerloren.*`, `aussteuerung.*` und `alv.*` in
  // src/i18n/de.js (AVIG Art. 9, 10, 13, 14, 17, 22a, 23, 24, 27, 30; AVIV Art. 44, 45; ÜLG Art. 3,
  // 5, 19; UVG Art. 1a, 3; KVG Art. 8, 10; AHVG Art. 10; AVG Art. 26, 27). Neu gegenüber der App,
  // darum besonders zu prüfen: AVIG Art. 8 (Anspruchsvoraussetzungen), Art. 16 (Zumutbarkeit),
  // Art. 18 (Wartetage), Art. 22 (Satz höher mit Kindern, tiefem Lohn, IV-Rente), AVIV Art. 27
  // (kontrollfreie Tage), BVG Art. 2 Abs. 3 (Risikoversicherung Arbeitsloser), DBG Art. 23 Bst. a.
  {
    pfad: 'arbeitslosigkeit',
    titel: 'Arbeitslosigkeit: was die Versicherung leistet',
    beschreibung:
      'Wer Anspruch auf Arbeitslosenentschädigung hat, warum die Anmeldung beim RAV früh zählt und was nach der Aussteuerung kommt. Eine Einordnung ohne Zahlen.',
    brotkrume: 'Arbeitslosigkeit',
    vorspann:
      'Die Arbeitslosenversicherung (ALV) ist für Angestellte obligatorisch: Wer arbeitet, zahlt mit dem Lohn Beiträge, und wer die Stelle verliert, erhält unter bestimmten Voraussetzungen ein Taggeld, das einen Teil des Lohns ersetzt. Sie ist im Arbeitslosenversicherungsgesetz (AVIG) geregelt und gilt in der ganzen Schweiz gleich. Die Kantone führen die Regionalen Arbeitsvermittlungszentren (RAV).',
    schichten: true,
    abschnitte: [
      {
        id: 'anspruch',
        bild: `<div class="kern">
          <p class="unter" id="voraus">Vorausgesetzt ist unter anderem:</p>
          <ul class="chips" role="list" aria-labelledby="voraus">
            <li>ganz oder teilweise arbeitslos</li><li>Wohnsitz in der Schweiz</li><li>genug Beitragszeit oder davon befreit</li><li>vermittlungsfähig</li><li>die Kontrollvorschriften erfüllt</li>
          </ul>
        </div>`,
        kurzAbsatz: 0,
        wege: ['was-steht-mir-zu'],
        titel: 'Wer Anspruch auf Taggeld hat',
        absaetze: [
          'Anspruch auf Arbeitslosenentschädigung hat, wer ganz oder teilweise arbeitslos ist, einen anrechenbaren Arbeitsausfall erleidet, in der Schweiz wohnt, das Rentenalter noch nicht erreicht hat, genug Beitragszeit hat oder davon befreit ist, vermittlungsfähig ist und die Kontrollvorschriften erfüllt (AVIG Art. 8).',
          'Beitragszeit heisst: In einer bestimmten Zeit vor der Arbeitslosigkeit haben Sie lange genug als Angestellte oder Angestellter gearbeitet und Beiträge bezahlt (AVIG Art. 13). Wer in dieser Zeit wegen Ausbildung, Krankheit, Unfall oder Mutterschaft nicht angestellt war, oder wer nach einer Trennung, Scheidung oder dem Tod der Partnerin oder des Partners eine Stelle suchen muss, kann von der Beitragszeit befreit sein (AVIG Art. 14).',
          'Selbständigerwerbende sind über ihre selbständige Tätigkeit nicht gegen Arbeitslosigkeit versichert. Zählen kann nur Beitragszeit aus einer Anstellung.',
        ],
      },
      {
        id: 'anmelden',
        bild: `<ol class="zeit kern" role="list" aria-label="Der Weg zum Taggeld">
          <li><span class="jahr">Kündigung</span><span class="was">schon jetzt Stellen suchen und die Bemühungen festhalten</span></li>
          <li><span class="jahr">Anmeldung</span><span class="was">beim RAV, spätestens am ersten Tag, für den Sie Taggeld wollen</span></li>
          <li><span class="jahr">Taggeld</span><span class="was">ab der Anmeldung, nicht rückwirkend, nach einigen Wartetagen</span></li>
        </ol>`,
        kurzAbsatz: 0,
        titel: 'Beim RAV anmelden, und zwar früh',
        absaetze: [
          'Taggeld gibt es frühestens ab dem Tag der Anmeldung, nicht rückwirkend. Melden Sie sich darum spätestens am ersten Tag, für den Sie Taggeld beanspruchen, beim zuständigen Regionalen Arbeitsvermittlungszentrum (RAV) an, online über arbeit.swiss oder persönlich (AVIG Art. 10, 17).',
          'Schon während der Kündigungsfrist müssen Sie sich um eine neue Stelle bemühen und die Bemühungen festhalten. Fehlen sie oder reichen sie nicht, gibt es Einstelltage, also Tage ohne Taggeld (AVIG Art. 17, 30).',
          'Nach der Anmeldung beginnt das Taggeld in der Regel erst nach einigen Wartetagen; wie viele, hängt vom bisherigen Einkommen und von Unterhaltspflichten gegenüber Kindern ab (AVIG Art. 18).',
        ],
      },
      {
        id: 'taggeld',
        bild: `<ol class="zeit kern" role="list" aria-label="Wovon das Taggeld abhängt">
          <li><span class="jahr">Versicherter Verdienst</span><span class="was">der bisherige Lohn, bis zu einer Höchstgrenze</span></li>
          <li><span class="jahr">Taggeldsatz</span><span class="was">ein Teil davon, höher mit Kindern, tiefem Lohn oder einer IV-Rente</span></li>
          <li><span class="jahr">Höchstzahl</span><span class="was">der Taggelder, je nach Beitragszeit und Alter</span></li>
        </ol>`,
        kurzAbsatz: 0,
        wege: ['steuern', 'kantonsatlas'],
        titel: 'Das Taggeld ersetzt einen Teil des Lohns',
        absaetze: [
          'Das Taggeld richtet sich nach dem <strong>versicherten Verdienst</strong>, also dem bisherigen Lohn bis zu einer gesetzlichen Höchstgrenze (AVIG Art. 23). Ausbezahlt wird ein Teil davon; der Anteil ist höher, wenn Sie Kinder unterhalten müssen, einen tiefen Lohn hatten oder eine Invalidenrente beziehen (AVIG Art. 22).',
          'Wie viele Taggelder es höchstens gibt, hängt von der Beitragszeit und vom Alter ab; sie werden innerhalb einer Rahmenfrist ausgerichtet (AVIG Art. 9, 27). Sätze und Höchstzahlen nennen wir hier bewusst nicht. Ihre Arbeitslosenkasse rechnet sie verbindlich aus.',
          'Vom Taggeld werden wie vom Lohn Beiträge abgezogen, etwa für die AHV (AVIG Art. 22a). Es ist Ersatzeinkommen und wird wie Lohn versteuert (DBG Art. 23 Bst. a).',
        ],
      },
      {
        id: 'zumutbar',
        bild: `<ul class="irrtum" role="list">
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>Wer eine schlechter bezahlte Arbeit annimmt, verliert das Taggeld.</span><span class="richtig"><span class="sr-only">Richtig: </span>Ein Zwischenverdienst wird teilweise ausgeglichen; zusammen bleibt meist mehr.</span></li>
          <li><span class="falsch"><span class="sr-only">Irrtum: </span>Man muss jede Stelle annehmen.</span><span class="richtig"><span class="sr-only">Richtig: </span>Annehmen muss man zumutbare Arbeit; was unzumutbar ist, sagt das Gesetz.</span></li>
        </ul>`,
        kurzAbsatz: 0,
        titel: 'Zwischenverdienst und zumutbare Arbeit',
        absaetze: [
          'Verdienen Sie während der Arbeitslosigkeit etwas, gilt das als Zwischenverdienst. Liegt er unter Ihrem versicherten Verdienst, gleicht die Arbeitslosenkasse einen Teil der Differenz aus; zusammen erhalten Sie so meist mehr als das Taggeld allein (AVIG Art. 24).',
          'Grundsätzlich müssen Sie jede zumutbare Arbeit annehmen. Unzumutbar ist eine Stelle etwa, wenn sie nicht den orts- und berufsüblichen Bedingungen entspricht, Ihrem Alter, Ihren persönlichen Verhältnissen oder Ihrer Gesundheit nicht angemessen ist oder einen sehr langen Arbeitsweg verlangt (AVIG Art. 16).',
          'Wer eine zumutbare Stelle ablehnt oder die eigene Stelle ohne zwingenden Grund selbst kündigt, wird eingestellt: Je nach Verschulden gibt es eine Zeit lang kein Taggeld (AVIG Art. 30). Lassen Sie sich vor einer eigenen Kündigung beraten.',
        ],
      },
      {
        id: 'aussteuerung',
        bild: `<ol class="zeit kern" role="list" aria-label="Wenn die Taggelder aufgebraucht sind">
          <li><span class="jahr">Aussteuerung</span><span class="was">keine Taggelder mehr; die Arbeitsvermittlung bleibt offen</span></li>
          <li><span class="jahr">Danach</span><span class="was">Sozialhilfe und Prämienverbilligung können in Frage kommen</span></li>
          <li><span class="jahr">Ab sechzig</span><span class="was">Überbrückungsleistungen, wenn die Voraussetzungen erfüllt sind</span></li>
        </ol>`,
        kurzAbsatz: 0,
        wege: ['sozialhilfe', 'praemienverbilligung', 'ergaenzungsleistungen'],
        titel: 'Wenn die Taggelder aufgebraucht sind',
        absaetze: [
          'Ausgesteuert ist, wer alle Taggelder bezogen hat oder wessen Rahmenfrist abgelaufen ist, ohne dass eine neue eröffnet werden kann. Die öffentliche Arbeitsvermittlung steht weiter offen und ist unentgeltlich (AVG Art. 26, 27). Wer wieder genug Beitragszeit sammelt, kann einen neuen Anspruch erwerben (AVIG Art. 9, 13).',
          'Danach können Sozialhilfe und Prämienverbilligung in Frage kommen. Wer ab sechzig ausgesteuert wird, kann unter weiteren Voraussetzungen Überbrückungsleistungen erhalten; angemeldet werden sie bei der EL-Stelle des Wohnkantons (ÜLG Art. 3, 5, 19).',
          'Mit dem letzten Taggeld endet nach einer kurzen Nachdeckung auch die Unfallversicherung über die Arbeitslosenversicherung. Melden Sie der Krankenkasse rechtzeitig, dass sie Unfälle wieder decken muss (UVG Art. 3 Abs. 2, KVG Art. 8). Klären Sie bei der AHV-Ausgleichskasse, ob Sie als Nichterwerbstätige Beiträge zahlen müssen, damit keine Beitragslücke entsteht (AHVG Art. 10).',
        ],
      },
    ],
    faq: [
      {
        frage: 'Bekomme ich Taggeld, wenn ich selbst gekündigt habe?',
        antwort:
          'Grundsätzlich ja, wenn die übrigen Voraussetzungen erfüllt sind. Wer ohne Zusicherung einer neuen Stelle selbst kündigt, wird aber in der Regel eingestellt und erhält eine Zeit lang kein Taggeld. Ausgenommen ist, wem das Bleiben an der Stelle nicht zuzumuten war (AVIG Art. 30, AVIV Art. 44). Lassen Sie sich vorher beraten.',
      },
      {
        frage: 'Kann ich mich schon vor dem Ende der Stelle anmelden?',
        antwort:
          'Ja, und das ist sinnvoll. Spätestens müssen Sie sich am ersten Tag anmelden, für den Sie Taggeld beanspruchen (AVIG Art. 17). Arbeitsbemühungen werden schon für die Zeit der Kündigungsfrist verlangt.',
      },
      {
        frage: 'Bin ich während der Arbeitslosigkeit gegen Unfall versichert?',
        antwort:
          'Ja, solange Sie Taggeld beziehen, sind Sie über die Arbeitslosenversicherung gegen Unfall versichert (UVG Art. 1a). Danach endet diese Deckung nach einer kurzen Nachdeckung, und die Krankenkasse übernimmt Unfälle, wenn Sie es ihr melden.',
      },
      {
        frage: 'Was geschieht mit meiner Pensionskasse?',
        antwort:
          'Beim Austritt wird das Guthaben fällig und kommt auf ein Freizügigkeitskonto, bis Sie eine neue Stelle haben. Während Sie Taggeld beziehen, sind Sie für die Risiken Tod und Invalidität weiter beruflich versichert (BVG Art. 2 Abs. 3). Fürs Alter sparen Sie in dieser Zeit nicht.',
      },
      {
        frage: 'Darf ich während der Arbeitslosigkeit in die Ferien?',
        antwort:
          'Ja, in beschränktem Umfang: Sie haben Anspruch auf kontrollfreie Tage, die Sie vorher beim RAV melden müssen (AVIV Art. 27). Wie viele Ihnen zustehen, sagt Ihr RAV.',
      },
    ],
    quellen: ['arbeitSwiss'],
    hintergrund: ['kantonsatlas', 'kantone-im-vergleich'],
  },
];

export const seiteNachPfad = (pfad) => SEITEN.find((s) => s.pfad === pfad);
export const quelle = q;

// ─── Sonderseite: Rechtliches ────────────────────────────────────────────────
//
// Rechtsprüfung 20.09.2026, Blocker: Der Fussbereich sagte bis dahin nur
// «Datenschutz und Rechtliches stehen in der App». Das war wahr, aber nicht
// verlinkt — und der Weg dorthin nicht adressierbar, weil BetaGate vor dem
// Hash-Router läuft: /#/legal zeigt die Code-Wand, nicht die Rechtsansicht.
//
// Seit die vier Erklärseiten öffentlich sind, löst ihr Abruf beim Hoster eine
// Bearbeitung von Personendaten aus (IP in den Server-Logs). Art. 19 DSG
// verlangt, dass bei der Beschaffung angemessen informiert wird. Ein Satz ohne
// Link erfüllt das nicht. Also: eine eigene, statische, öffentliche Seite.
//
// Der Text ist KEINE Neuschöpfung. Er ist aus den bestehenden, bereits
// redigierten Dokumenten zusammengezogen:
//   docs/legal/impressum.md
//   docs/legal/datenschutzerklaerung-ndsg.md  (Abschnitte 1, 2, 5, 7, 11, 15)
// Bei Änderungen dort muss diese Seite mit — der Wächter prüft das nicht
// inhaltlich, das bleibt Handarbeit.
//
// ─── Die Postanschrift · Entscheid Stebler Studios 23.09.2026 ───────────────
//
// Genannt sind Name, Ort und E-Mail — KEINE Strasse. Das ist ein Entscheid,
// keine vergessene Zeile, und er ist hier bewusst dokumentiert.
//
// Was das Gesetz verlangt: UWG Art. 3 Abs. 1 Bst. s Ziff. 1 fordert Angaben
// über Identität und «Kontaktadresse einschliesslich derjenigen der
// elektronischen Post». Ob daraus eine Postanschrift folgt und ob ein
// kostenloses Angebot ohne Bestellvorgang überhaupt als «elektronischer
// Geschäftsverkehr» im Sinn der Bestimmung gilt, sind Auslegungsfragen. Sie
// werden hier NICHT beantwortet — sie liegen als Frage F0 in
// docs/legal/k48-fragen-juristin.md.
//
// Entscheid Stebler Studios 24.09.2026 (Deploy-Gate 0.1.40-beta): «nur
// Tatsachen». Der Satz «Eine Postanschrift schreibt die Bestimmung nicht in
// jedem Fall vor» war eine Auslegung und ist gestrichen. Die Seite sagt jetzt
// nur, was angegeben ist, und dass die Frage abgeklärt wird.
//
// Warum keine Adresse: Stebler Studios hat (Stand 23.09.2026) kein
// Geschäftsdomizil, und die Wohnadresse soll nicht ins öffentliche Repo. Das
// hängt am Handelsregister-Entscheid: ein Eintrag ist öffentlich (OR Art. 936
// Abs. 1: «Das Handelsregister ist öffentlich.»), deshalb wird beides zusammen
// entschieden. Die Eintragungspflicht für Einzelunternehmen regelt OR Art. 931
// Abs. 1 (Umsatzerlös ab 100 000 Franken). Beides gelesen an Fedlex, SR 220,
// Fassung 1.1.2026, am 24.09.2026. Dass die Domiziladresse zum Eintrag gehört,
// steht in HRegV Art. 38 Bst. b («der Sitz und das Rechtsdomizil»); nach
// Art. 117 Abs. 2 kann das Rechtsdomizil auch eine c/o-Adresse sein. Gelesen an
// Fedlex, SR 221.411, Fassung 1.1.2025, am 24.09.2026 (bis dahin stand hier
// «dort nicht gelesen»). Was das fürs Impressum heisst, ist Frage F0 in
// docs/legal/k48-fragen-juristin.md — hier wird es nicht beantwortet.
// (Bis 24.09. stand hier «OR Art. 931» für die Öffentlichkeit; das ist Art. 936.)
//
// 🛑 Dieselbe Stelle, dieselbe Begründung steht im Studio-Impressum
// (stebler-studios/website/impressum.html, Fassung vom 22.09.2026). Wer hier
// etwas ändert, ändert es dort mit — sonst laufen zwei Fassungen auseinander.
//
// Was sich am 23.09. geändert hat: vorher stand hier pauschal «Angaben gemäss
// Art. 3 Abs. 1 lit. s UWG» — eine Behauptung von Vollständigkeit ohne
// Begründung. Jetzt steht da, was der Artikel verlangt und was offen ist.
// Aufgeschlagen bei einer Durchsicht von aussen.
// ─────────────────────────────────────────────────────────────────────────────
export const SONDERSEITEN = [
  {
    pfad: 'rechtliches',
    titel: 'Impressum, Datenschutz und Haftungsausschluss',
    beschreibung:
      'Wer hinter Maloja Plana steht, welche Daten beim Aufruf dieser Seiten anfallen und wofür die Rechner ausdrücklich nicht einstehen.',
    brotkrume: 'Rechtliches',
    vorspann:
      'Diese Seite gilt für malojaplana.ch und die öffentlichen Erklärseiten. Für die Anwendung gilt zusätzlich die ausführliche Datenschutzerklärung in der App unter «Datenschutz & Rechtliches», auch sie ohne Zugangscode. Verbindlich sind diese beiden veröffentlichten Fassungen, für die Anwendung der Text in der App, nicht die Arbeitsfassungen im Quellcode (docs/legal).',
    abschnitte: [
      {
        titel: 'Anbieterin',
        absaetze: [
          'Sophie Stebler / Stebler Studios<br>Basel, Schweiz<br>E-Mail: <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>',
          'Maloja Plana — Schweizer Lebensordner. Ein Open-Source-Projekt unter AGPL-3.0. Die Nutzung der App ist kostenlos; für White-Label und andere kommerzielle Nutzung gibt es auf Anfrage eine separate Lizenz.',
          'Zur Kontaktadresse: <a href="https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3" rel="noopener">UWG Art. 3 Abs. 1 Bst. s Ziff. 1</a> verlangt Angaben über Identität und Kontaktadresse «einschliesslich derjenigen der elektronischen Post». Angegeben sind Name, Ort und E-Mail; ob zusätzlich eine Postanschrift geschuldet ist, wird abgeklärt. Über die E-Mail-Adresse sind wir für alle Anliegen erreichbar, auch für rechtliche.',
        ],
      },
      {
        titel: 'Haftungsausschluss',
        absaetze: [
          'Maloja Plana ist ein <strong>Orientierungswerkzeug</strong>. Die Rechner und Übersichten stützen sich auf öffentlich zugängliche Rechtsgrundlagen und dienen ausschliesslich der persönlichen Information.',
          '<strong>Maloja Plana ersetzt keine Rechts-, Steuer-, Versicherungs- oder Finanzberatung.</strong>',
          'Die Anbieterin übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Berechnungen, für die Eignung der Ergebnisse für individuelle Entscheidungen, und für Schäden, die aus deren Nutzung entstehen. Die Haftung für vorsätzlich oder grobfahrlässig verursachte Schäden bleibt vorbehalten. Massgebend sind ausschliesslich die geltenden Gesetze und die zuständigen Behörden.',
        ],
      },
      {
        titel: 'Datenschutz auf diesen Seiten',
        absaetze: [
          'Die Erklärseiten sind statisches HTML. Sie laden <strong>keine Cookies und keine Ressourcen von Dritten</strong>; die Schriften liegen auf demselben Server. Die Startseite lädt zusätzlich eigene kleine Skripte vom selben Server: eines leitet alte App-Adressen nach /app/ weiter, eines bewegt die Bilder der Reise. Wer die App früher unter der Hauptadresse benutzt hat, erhält beim nächsten Besuch einer dieser Seiten einmal ein drittes: Es leert den alten Zwischenspeicher der App im Browser, meldet sich danach selbst ab und lädt die Seite einmal neu; Ihre Angaben auf dem Gerät fasst es nicht an. Auch die bewegten Seiten zur Krankenkasse (unter /krankenkasse/bewegt/) laden Skripte vom selben Server; sie zeichnen die bewegten Figuren. Diese Skripte setzen keine Cookies und senden keine Daten. Es gibt kein Tracking, keine Analyse und keine Werbung.',
          'Beim Abruf fallen dennoch technische Daten bei der Hosting-Anbieterin an — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genf, mit Rechenzentren in der Schweiz: IP-Adresse in den Server-Logs, Browsertyp, Betriebssystem und Zeitpunkt des Zugriffs. Das ist für die Auslieferung und die Betriebssicherheit technisch notwendig. Infomaniak handelt dabei als Auftragsbearbeiterin (Art. 9 nDSG). Die Zugriffs- und Fehlerlogs bewahrt Infomaniak nach eigener Angabe mindestens 7 Tage auf (Infomaniak Support-FAQ 1926, abgerufen am 23.09.2026).',
          'Weitere Empfänger gibt es nicht: keine Analyse-Dienste, keine Social-Media-Einbindungen, keine Weitergabe und kein Verkauf von Daten.',
        ],
      },
      {
        titel: 'Kontakt per E-Mail',
        absaetze: [
          'Wenn Sie an <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a> schreiben, bearbeiten wir Ihre Adresse, den Inhalt der Nachricht und allfällige Anhänge, um zu antworten. Das Postfach liegt bei Infomaniak in der Schweiz. Die Korrespondenz bleibt so lange, wie die Anfrage und übliche Nachfragen es brauchen, danach wird sie gelöscht. Eine Weitergabe an Dritte findet nicht statt, ausser sie ist gesetzlich geschuldet.',
          '<strong>Warteliste:</strong> Wenn Sie sich für die Warteliste melden, bewahren wir Ihre Nachricht mit Ihrer E-Mail-Adresse nur zu diesem Zweck auf. Wir schreiben Ihnen höchstens zweimal: wenn die Beta endet und, falls es dazu kommt, wenn Maloja Plana im App Store erscheint. Danach löschen wir Nachricht und Adresse, spätestens am 31. Dezember 2027, auch wenn es bis dahin keine App-Store-Fassung gibt. Auf Wunsch löschen wir sie umgehend; eine Antwort mit «abmelden» genügt. Für etwas anderes verwenden wir die Adresse nicht, auch nicht für einen Newsletter.',
        ],
      },
      {
        titel: 'Daten in der Anwendung',
        absaetze: [
          'Was Sie in Maloja Plana erfassen, bleibt <strong>auf Ihrem Gerät</strong> (localStorage, IndexedDB und für geteilte Dateien der Cache im Browser). Es gibt kein Konto, keine Anmeldung und keine Übermittlung an die Anbieterin oder an Dritte. Wer die Daten löschen will, löscht sie im Gerät — es gibt keine zweite Kopie anderswo.',
          'Besonders schützenswerte Angaben (Gesundheit, Sozialhilfe, Weltanschauung) speichert die App ebenfalls nur lokal. Die automatischen Sicherungskopien im Browser sind nicht verschlüsselt.',
          'Weil nichts übermittelt wird, kann die Anbieterin zu Ihren Eingaben auch keine Auskunft erteilen: sie hat sie nie gesehen. Die ausführliche Fassung mit allen Rechten nach DSG steht in der App unter «Datenschutz & Rechtliches».',
        ],
      },
      {
        titel: 'Geistiges Eigentum',
        absaetze: [
          'Der Code steht unter <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, einsehbar auf <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. «Maloja Plana» ist eine Projektbezeichnung von Sophie Stebler. Für kommerzielle Nutzung gibt es eine Doppellizenz (Dual Licensing) — Anfragen an die oben genannte Adresse.',
        ],
      },
      {
        titel: 'Anwendbares Recht',
        absaetze: [
          // Gruppe E, L6: ein sichtbares Stand-Datum, im selben Absatz (die Sprachfassungen zählen die Absätze
          // gleich, erklaerseitenSprachen.test.js). Nur von Hand ändern, wenn der Text dieser Seite ändert.
          'Es gilt Schweizer Recht. Gerichtsstand ist Basel-Stadt, Schweiz. Stand dieser Seite: 11. November 2026.',
        ],
      },
    ],
    faq: [],
    quellen: [],
  },
];

// ─── Alle Sprachen an einem Ort ──────────────────────────────────────────────
//
// `SEITEN` und `SONDERSEITEN` oben bleiben unverändert das Deutsche — jeder
// bestehende Aufruf trifft weiter dasselbe. Neu ist nur der Zugriff je Sprache.
export const INHALT = {
  de: { seiten: SEITEN, sonderseiten: SONDERSEITEN },
  fr: { seiten: SEITEN_FR, sonderseiten: SONDERSEITEN_FR },
  it: { seiten: SEITEN_IT, sonderseiten: SONDERSEITEN_IT },
  en: { seiten: SEITEN_EN, sonderseiten: SONDERSEITEN_EN },
  rm: { seiten: SEITEN_RM, sonderseiten: SONDERSEITEN_RM },
};

export const inhaltFuer = (code) => {
  const i = INHALT[code];
  if (!i) throw new Error(`Keine Inhalte für Sprache: ${code}`);
  return i;
};

// Alle Seiten einer Sprache in Reihenfolge — Erklärseiten zuerst, dann die
// Sonderseite. Dieselbe Reihenfolge wie vor dem Sprachumbau.
export const alleSeiten = (code) => {
  const i = inhaltFuer(code);
  return [...i.seiten, ...i.sonderseiten];
};
