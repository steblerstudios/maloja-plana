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
// gegengelesen hat. Zuletzt: Fachprüfung + Rechtsprüfung am 20.09.2026.
export const GEPRUEFT = 'September 2026';

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
//   priminfo      de ✓ fr ✓ it ✓ en ✓   — gleicher Slug in allen Sprachen
//   ahvMerkblatt  de ✓ fr ✓ it ✓ en ✓   — Endung .d/.f/.i/.e
//   skosRechner   de ✓ fr ✓             — der Umschalter bietet NUR DE und FR
//   estvRechner   de ✓                  — kein Sprachumschalter auffindbar
//   bwoKantone    de ✓                  — dito
//   bsvEL         de ✓                  — dito
//   rm            keine einzige          — der Bund publiziert das nicht auf
//                                          Rumantsch. Tatsache, kein Mangel.
//
// Wer hier eine Sprache ergänzt, prüft sie vorher einzeln mit Gegenprobe.
// `src/__tests__/oeffentlicheSeiten.test.js` prüft die Form, nicht die
// Erreichbarkeit — ein Test, der ins Netz greift, ist kein Test.
export const QUELLEN = {
  // Amtliche Sammlung des Bundes. Steht hier, weil das Impressum den Artikel
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
  // die englische auch tut. Englisch fehlt aus demselben Grund — Fedlex führt
  // Bundesrecht nicht auf Englisch.
  fedlexUwgArt3: {
    url: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de#art_3',
    text: 'UWG Art. 3 Abs. 1 Bst. s Ziff. 1 (SR 241, amtliche Sammlung)',
    sprachen: {
      fr: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/fr#art_3',
      it: 'https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/it#art_3',
    },
    texte: {
      fr: 'LCD art. 3 al. 1 let. s ch. 1 (RS 241, recueil officiel)',
      it: 'LCSl art. 3 cpv. 1 lett. s n. 1 (RS 241, raccolta ufficiale)',
      en: 'Swiss Unfair Competition Act, Art. 3 para. 1 lit. s no. 1 (SR 241)',
      rm: 'LCSL art. 3 al. 1 lit. s cifra 1 (DS 241, collecziun uffiziala)',
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
      en: 'https://www.priminfo.admin.ch/en/praemien',
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
    sprachen: {},
    texte: {
      fr: 'Aides cantonales, aperçu de l’Office fédéral du logement',
      it: 'Aiuti cantonali, panoramica dell’Ufficio federale delle abitazioni',
      en: 'Cantonal assistance, overview of the Federal Housing Office',
      rm: 'Agids chantunals, survista da l’Uffizi federal d’abitaziun',
    },
  },
  bsvEL: {
    url: 'https://www.bsv.admin.ch/bsv/de/home/sozialversicherungen/ergaenzungsleistungen.html',
    text: 'Ergänzungsleistungen, Bundesamt für Sozialversicherungen',
    sprachen: {},
    texte: {
      fr: 'Prestations complémentaires, Office fédéral des assurances sociales',
      it: 'Prestazioni complementari, Ufficio federale delle assicurazioni sociali',
      en: 'Supplementary benefits, Federal Social Insurance Office',
      rm: 'Prestaziuns cumplementaras, Uffizi federal d’assicuranzas socialas',
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
      'Es gibt in der Schweiz nicht einen Topf, aus dem Unterstützung kommt, sondern viele kleine — verteilt auf Bund, Kantone und Gemeinden. Wer worauf Anspruch hat, hängt deshalb stark vom Wohnort ab. Der häufigste Grund, warum Leistungen nicht bezogen werden, ist nicht ein fehlender Anspruch. Es ist fehlendes Wissen, dass es sie gibt.',
    abschnitte: [
      {
        titel: 'Drei Ebenen, die sich nicht abstimmen',
        absaetze: [
          'Der <strong>Bund</strong> setzt bei vielen Leistungen nur den Rahmen: er schreibt vor, dass es etwas geben muss, und überlässt die Ausgestaltung den Kantonen. Das gilt zum Beispiel für die Prämienverbilligung.',
          'Die <strong>Kantone</strong> füllen diesen Rahmen aus — mit eigenen Grenzen, eigenen Formularen, eigenen Fristen. Zwei Haushalte mit identischen Zahlen können in zwei Kantonen unterschiedlich behandelt werden. Das ist kein Fehler im System, das ist das System.',
          'Die <strong>Gemeinden</strong> führen in mehreren Bereichen aus, was der Kanton beschliesst — in der Sozialhilfe sind sie oft die Stelle, mit der man tatsächlich zu tun hat.',
          'Praktisch heisst das: Eine allgemeine Antwort auf «steht mir das zu?» gibt es nicht. Es gibt nur die Antwort für Ihren Wohnort, Ihre Situation und Ihr Jahr.',
        ],
      },
      {
        titel: 'Die Themen im Einzelnen',
        absaetze: [
          'Drei Bereiche betreffen die meisten Menschen, und bei allen dreien lohnt sich der Blick auch dann, wenn man meint, es treffe einen nicht zu:',
        ],
        verweise: ['praemienverbilligung', 'sozialhilfe', 'steuern'],
      },
      {
        titel: 'Warum so vieles liegen bleibt',
        absaetze: [
          'Ein Anspruch, von dem niemand weiss, wird nicht bezogen. Dazu kommen Hürden, die mit dem Anspruch selbst nichts zu tun haben: Formulare in einer Sprache, die man erst lernen muss. Fristen, die nirgends zusammen stehen. Die Sorge, etwas falsch zu machen. Und die verbreitete Annahme, Unterstützung sei etwas für andere.',
          'Nichts davon ändert etwas am Anspruch. Aber alles davon führt dazu, dass er nicht geltend gemacht wird.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Wie finde ich heraus, was mir zusteht?',
        antwort:
          'Der zuverlässigste Weg führt über die Stelle, die tatsächlich entscheidet — also über den eigenen Kanton beziehungsweise die eigene Gemeinde. Rechner und Übersichten wie die hier verlinkten geben eine erste Orientierung, ob sich ein Antrag lohnt. Verbindlich ist immer erst die Verfügung der zuständigen Stelle.',
      },
      {
        frage: 'Warum ist es je nach Kanton anders?',
        antwort:
          'Weil der Bund bei vielen Leistungen bewusst nur den Rahmen setzt und die Kantone ihn ausfüllen. Sie legen eigene Einkommensgrenzen, Verfahren und Fristen fest. Ein Umzug über die Kantonsgrenze kann den Anspruch deshalb verändern, auch wenn sich sonst nichts geändert hat.',
      },
      {
        frage: 'Muss ich überall selbst einen Antrag stellen?',
        antwort:
          'Das ist je nach Leistung und Kanton unterschiedlich. Bei manchen Leistungen melden sich die Stellen von sich aus, bei anderen passiert ohne Antrag nichts. Im Zweifel gilt: nachfragen kostet nichts, und ein nicht gestellter Antrag wird nie bewilligt.',
      },
      {
        frage: 'Was kostet Maloja Plana?',
        antwort:
          'Nichts. Maloja Plana ist kostenlos und quelloffen. Es gibt kein Konto, keine Werbung und kein Tracking; alle Angaben bleiben auf dem eigenen Gerät.',
      },
    ],
    quellen: ['bwoKantone', 'bsvEL', 'ahvMerkblatt'],
  },

  // ─── Prämienverbilligung ──────────────────────────────────────────────────
  {
    pfad: 'praemienverbilligung',
    titel: 'Prämienverbilligung: wer Anspruch hat',
    beschreibung:
      'Die Prämienverbilligung (IPV) ist ein Beitrag an die Krankenkassenprämie. Der Bund setzt den Rahmen, die Kantone entscheiden — was das für Sie bedeutet.',
    brotkrume: 'Prämienverbilligung',
    vorspann:
      'Die individuelle Prämienverbilligung — meist kurz IPV — ist ein Beitrag der öffentlichen Hand an die Krankenkassenprämie. Sie ist im Krankenversicherungsgesetz (KVG) angelegt, aber der Bund führt sie nicht aus: das tun die Kantone, jeder nach eigenen Regeln.',
    abschnitte: [
      {
        titel: 'Was der Bund vorgibt und was der Kanton entscheidet',
        absaetze: [
          'Der Bund schreibt vor, <em>dass</em> es eine Prämienverbilligung geben muss, und beteiligt sich an der Finanzierung. Wer sie bekommt und wie viel, entscheidet der Kanton.',
          'Konkret unterscheiden sich von Kanton zu Kanton: die Einkommens- und Vermögensgrenzen, wie das massgebende Einkommen überhaupt berechnet wird, ob man einen Antrag stellen muss oder angeschrieben wird, und die Fristen.',
          'Gleich ist dagegen überall, <strong>wohin das Geld fliesst</strong>: der Kanton zahlt den Beitrag direkt an die Krankenkasse, nicht an die versicherte Person. Das steht im KVG und ist nicht kantonaler Spielraum.',
          'Deshalb führt der Satz «bei uns bekommt man das ab Einkommen X» selten weiter. Er stimmt höchstens für einen Kanton, und dort auch nur für ein Jahr.',
        ],
      },
      {
        titel: 'Welche Zahlen zählen',
        absaetze: [
          'Die Kantone stützen sich in der Regel auf die Steuerdaten — und oft nicht auf die des laufenden Jahres, sondern auf eine frühere, bereits rechtskräftige Veranlagung. Das hat eine Folge, die überrascht: Wer dieses Jahr deutlich weniger verdient, sieht das in vielen Kantonen nicht von selbst — andere rechnen es erst mit der späteren definitiven Abrechnung nach.',
          'Mehrere Kantone kennen für solche Fälle ein eigenes Verfahren, bei dem eine wesentliche Änderung der Verhältnisse nachträglich berücksichtigt wird. Ob und wie, steht bei der zuständigen Stelle — meist die kantonale Sozialversicherungsanstalt (SVA) oder die Ausgleichskasse, in einzelnen Kantonen aber die Steuerverwaltung oder die Wohngemeinde.',
        ],
      },
      {
        titel: 'Der häufigste Irrtum',
        absaetze: [
          'Viele gehen davon aus, dass man mit einem Erwerbseinkommen grundsätzlich nichts bekommt. Das trifft nicht zu: Prämienverbilligung ist keine Leistung nur für Menschen ohne Arbeit. Familien mit Kindern, Personen in Ausbildung und Haushalte mit mittlerem Einkommen fallen in vielen Kantonen darunter.',
          'Der zweite häufige Irrtum ist, dass ein einmal abgelehnter Antrag für immer gilt. Er gilt für sein Jahr. Ändern sich Einkommen, Haushalt oder Wohnkanton, ist es eine neue Frage.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Habe ich Anspruch auf Prämienverbilligung?',
        antwort:
          'Das hängt vom Wohnkanton, vom massgebenden Einkommen und Vermögen und von der Haushaltsgrösse ab — alle drei werden kantonal unterschiedlich gewichtet. Eine allgemein gültige Grenze gibt es nicht. Verbindlich entscheidet die zuständige Stelle: meist die kantonale Sozialversicherungsanstalt oder die Ausgleichskasse, in einzelnen Kantonen die Steuerverwaltung oder die Wohngemeinde.',
      },
      {
        frage: 'Muss ich einen Antrag stellen?',
        antwort:
          'In manchen Kantonen werden Berechtigte von sich aus angeschrieben, in anderen muss der Antrag selbst eingereicht werden. Weil das kantonal geregelt ist und sich ändern kann, lohnt sich die Nachfrage bei der eigenen kantonalen Stelle — auch dann, wenn man in einem früheren Jahr schon einmal etwas erhalten hat.',
      },
      {
        frage: 'Welches Einkommen wird gerechnet?',
        antwort:
          'In der Regel ein aus der Steuerveranlagung abgeleitetes Einkommen, häufig aus einem früheren Jahr, und oft mit kantonalen Zu- und Abrechnungen. Das Bruttoeinkommen des laufenden Monats ist dafür fast nie die massgebende Zahl.',
      },
      {
        frage: 'Was, wenn mein Einkommen stark gesunken ist?',
        antwort:
          'Dann lohnt sich die Nachfrage besonders. Mehrere Kantone berücksichtigen eine wesentliche Änderung der wirtschaftlichen Verhältnisse auf Gesuch hin, auch wenn die zugrunde liegende Veranlagung noch ein höheres Einkommen ausweist.',
      },
    ],
    quellen: ['priminfo'],
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
    abschnitte: [
      {
        titel: 'Subsidiär heisst: zuerst alles andere',
        absaetze: [
          'Sozialhilfe ist <strong>subsidiär</strong>. Bevor sie in Frage kommt, werden andere Ansprüche geprüft: Lohn, Arbeitslosenentschädigung, Renten, Ergänzungsleistungen, Prämienverbilligung, Unterhaltsbeiträge, Stipendien. Auch eigenes Vermögen wird berücksichtigt, wobei die Kantone einen Freibetrag kennen, dessen Höhe sich unterscheidet.',
          'Das ist der Grund, warum eine Anmeldung oft mit vielen Fragen zu ganz anderen Leistungen beginnt. Es geht nicht um Misstrauen, sondern um die gesetzliche Reihenfolge.',
        ],
      },
      {
        titel: 'Die SKOS-Richtlinien sind Empfehlungen, nicht Gesetz',
        absaetze: [
          'Das ist der meistübersehene Punkt. Die Richtlinien der Schweizerischen Konferenz für Sozialhilfe (SKOS) sind <strong>Empfehlungen</strong>. Verbindlich werden sie erst, soweit ein Kanton sie in sein eigenes Recht übernimmt — und das tun die Kantone in unterschiedlichem Umfang.',
          'Praktisch bedeutet das: Ein SKOS-Rechner gibt eine gute erste Orientierung, aber er ist keine Zusage. Was in Ihrem Fall gilt, steht im kantonalen Sozialhilfegesetz und in der Verfügung der zuständigen Stelle.',
        ],
      },
      {
        titel: 'Woraus sich die Unterstützung typischerweise zusammensetzt',
        absaetze: [
          'In den meisten Kantonen sind es drei Bausteine: ein <strong>Grundbedarf</strong> für den Lebensunterhalt, die <strong>Wohnkosten</strong> im ortsüblichen Rahmen, und die <strong>medizinische Grundversorgung</strong>. Dazu können situationsbedingte Leistungen kommen.',
          'Die Beträge nennen wir hier bewusst nicht: sie unterscheiden sich je nach Kanton und Haushaltsgrösse und werden regelmässig angepasst. Eine Zahl auf einer Seite wie dieser wäre nach kurzer Zeit falsch.',
        ],
      },
      {
        titel: 'Das Recht, das niemand verlieren kann',
        absaetze: [
          'Unabhängig von allem oben steht in der <strong>Bundesverfassung, Artikel 12</strong>, das Recht auf Hilfe in Notlagen: Wer in Not gerät und nicht in der Lage ist, für sich zu sorgen, hat Anspruch auf Hilfe und Betreuung und auf die Mittel, die für ein menschenwürdiges Dasein unerlässlich sind.',
          'Dieses Recht steht allen Menschen in der Schweiz zu. Es ist nicht dasselbe wie Sozialhilfe und deckt weniger ab — aber es ist die Untergrenze, die nicht unterschritten werden darf.',
        ],
      },
    ],
    faq: [
      {
        frage: 'Wie viel Sozialhilfe steht mir zu?',
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
          'Ergänzungsleistungen (EL) gehören zur ersten Säule und kommen in der Regel dann in Frage, wenn eine Leistung der AHV oder IV den Existenzbedarf nicht deckt. Sie sind bundesrechtlich geregelt und keine Sozialhilfe. Ein Anspruch auf EL geht der Sozialhilfe vor.',
      },
    ],
    quellen: ['skosRechner', 'bsvEL', 'bwoKantone'],
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
    abschnitte: [
      {
        titel: 'Die direkte Bundessteuer ist überall dieselbe',
        absaetze: [
          'Die direkte Bundessteuer richtet sich nach dem Bundesgesetz über die direkte Bundessteuer (DBG) und kennt für die ganze Schweiz denselben Tarif. Sie unterscheidet nach Zivilstand und Haushalt, aber nicht nach Wohnort.',
          'Erhoben wird sie trotzdem vom Kanton — die Steuererklärung ist dieselbe.',
        ],
      },
      {
        titel: 'Kanton und Gemeinde: Tarif mal Steuerfuss',
        absaetze: [
          'Auf kantonaler und kommunaler Ebene kommen zwei Grössen zusammen. Der <strong>Tarif</strong> legt fest, wie viel Steuer ein bestimmtes steuerbares Einkommen auslöst — das ergibt die sogenannte einfache Steuer. Der <strong>Steuerfuss</strong> ist ein Faktor darauf, meist in Prozent angegeben, den Kanton und Gemeinde je für sich festlegen und jährlich anpassen können.',
          'Auf der Rechnung stehen je nach Kanton und Konfession noch weitere Posten, etwa die Kirchensteuer oder eine Personalsteuer. Sie sind meist klein, aber sie erklären, warum die Summe nicht genau dem entspricht, was ein reiner Einkommensrechner ausgibt.',
          'Zwei Gemeinden im selben Kanton haben deshalb denselben Tarif, aber je ihren eigenen Steuerfuss — der sich unterscheiden kann. Zwei Kantone haben beides verschieden. Das ist der eigentliche Hebel hinter den bekannten Kantonsvergleichen. In einzelnen Kantonen gibt es daneben Besonderheiten, etwa Gemeinden ohne eigene Gemeindesteuer.',
        ],
      },
      {
        titel: 'Was vom Einkommen abgezogen wird',
        absaetze: [
          'Besteuert wird nicht der Lohn, sondern das <strong>steuerbare Einkommen</strong> — also das, was nach den zulässigen Abzügen bleibt. Dazu gehören je nach Situation Berufsauslagen, Beiträge an die Säule 3a, Krankheitskosten über einer Schwelle, Kinder- und Betreuungsabzüge und weitere.',
          'Welche Abzüge in welcher Höhe zulässig sind, unterscheidet sich zwischen Bund und Kanton und zwischen den Kantonen. Genau hier geht am meisten verloren — nicht durch falsche Angaben, sondern durch Abzüge, die niemand eingetragen hat.',
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
// hängt am Handelsregister-Entscheid: ein Eintrag macht die Domiziladresse
// ohnehin öffentlich (OR Art. 931), deshalb wird beides zusammen entschieden.
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
      'Diese Seite gilt für malojaplana.ch und die öffentlichen Erklärseiten. Für die Anwendung selbst gilt zusätzlich die ausführliche Datenschutzerklärung, die in der App unter «Datenschutz & Rechtliches» steht — auch sie ohne Zugangscode.',
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
          'Die Anbieterin übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Berechnungen, für die Eignung der Ergebnisse für individuelle Entscheidungen, und für Schäden, die aus deren Nutzung entstehen. Massgebend sind ausschliesslich die geltenden Gesetze und die zuständigen Behörden.',
        ],
      },
      {
        titel: 'Datenschutz auf diesen Seiten',
        absaetze: [
          'Die Erklärseiten sind statisches HTML. Sie laden <strong>keine Skripte, keine Cookies und keine Ressourcen von Dritten</strong>; die Schriften liegen auf demselben Server. Es gibt kein Tracking, keine Analyse und keine Werbung.',
          'Beim Abruf fallen dennoch technische Daten beim Hoster an — <strong>Infomaniak Network SA</strong>, Rue Eugène-Marziano 25, 1227 Les Acacias / Genf, mit Rechenzentren in der Schweiz: IP-Adresse in den Server-Logs, Browsertyp, Betriebssystem und Zeitpunkt des Zugriffs. Das ist für die Auslieferung und die Betriebssicherheit technisch notwendig. Infomaniak handelt dabei als Auftragsbearbeiterin (Art. 9 nDSG). Die Zugriffs- und Fehlerlogs bewahrt Infomaniak nach eigener Angabe mindestens 7 Tage auf (Infomaniak Support-FAQ 1926, abgerufen am 23.09.2026).',
          'Weitere Empfänger gibt es nicht: keine Analyse-Dienste, keine Social-Media-Einbindungen, keine Weitergabe und kein Verkauf von Daten.',
        ],
      },
      {
        titel: 'Kontakt per E-Mail',
        absaetze: [
          'Schreiben Sie an <a href="mailto:info@malojaplana.ch">info@malojaplana.ch</a>, bearbeiten wir Ihre Adresse, den Inhalt der Nachricht und allfällige Anhänge, um zu antworten. Das Postfach liegt bei Infomaniak in der Schweiz. Die Korrespondenz bleibt so lange, wie die Anfrage und übliche Nachfragen es brauchen, danach wird sie gelöscht. Eine Weitergabe an Dritte findet nicht statt, ausser sie ist gesetzlich geschuldet.',
        ],
      },
      {
        titel: 'Daten in der Anwendung',
        absaetze: [
          'Was Sie in Maloja Plana erfassen, bleibt <strong>auf Ihrem Gerät</strong> (localStorage und IndexedDB im Browser). Es gibt kein Konto, keine Anmeldung und keine Übermittlung an die Anbieterin oder an Dritte. Wer die Daten löschen will, löscht sie im Gerät — es gibt keine zweite Kopie anderswo.',
          'Besonders schützenswerte Angaben (Gesundheit, Sozialhilfe, Weltanschauung) speichert die App ebenfalls nur lokal. Die automatischen Sicherungskopien im Browser sind nicht verschlüsselt.',
          'Weil nichts übermittelt wird, kann die Anbieterin zu Ihren Eingaben auch keine Auskunft erteilen: sie hat sie nie gesehen. Die ausführliche Fassung mit allen Rechten nach DSG steht in der App unter «Datenschutz & Rechtliches».',
        ],
      },
      {
        titel: 'Geistiges Eigentum',
        absaetze: [
          'Der Code steht unter <a href="https://www.gnu.org/licenses/agpl-3.0.html" rel="noopener">AGPL-3.0</a>, einsehbar auf <a href="https://github.com/steblerstudios/maloja-plana" rel="noopener">GitHub</a>. «Maloja Plana» ist eine Projektbezeichnung von Sophie Stebler. Für kommerzielle Nutzung gibt es Dual Licensing — Anfragen an die oben genannte Adresse.',
        ],
      },
      {
        titel: 'Anwendbares Recht',
        absaetze: [
          'Es gilt Schweizer Recht. Gerichtsstand ist Basel-Stadt, Schweiz.',
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
