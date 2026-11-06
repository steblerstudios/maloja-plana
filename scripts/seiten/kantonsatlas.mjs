// ─── Hintergrundseite: Kantonsatlas ──────────────────────────────────────────
//
// Der Maloja-Kantonsatlas als Erklärseite vor dem Gate (Weg A). Entscheid von
// Stebler Studios am 06.11.2026: Der Atlas ist kein eigenes Produkt, er gehört
// mit den Erklärseiten zu Maloja. Das private Artefakt bleibt nur Vorschau.
// Vorlage und Entscheide E1–E6: stebler-studios/ENTSCHEID-VORLAGE-kantonsatlas-
// befunde-petitionen-2026-11.md (ausserhalb dieses Repos).
//
// Arbeitsteilung mit /kantone-im-vergleich/: Dort stehen die Zahlen im Text,
// in Tabellen und als Zusammenhänge. Hier stehen sie als Karten. Ebenen,
// Formate und Tabellen kommen aus scripts/seiten-vergleich.mjs, damit beide
// Seiten nie Verschiedenes sagen.
//
// Anders als die Atlas-Vorschau:
//   • kein Skript (Riegel in hintergrundSeiten.test.js): Jede Karte ist beim
//     Bauen gezeichnet, die Werte stehen in einer Tabelle darunter;
//   • Ebenen nach Thema statt nach «Brille» (Person, Firma, Kanton, Stiftung):
//     Maloja spricht zu Menschen, die Themen folgen den Kapiteln;
//   • keine Ebenen und Texte zu Datenspenden: Die gibt es in Maloja nicht,
//     also verspricht die Seite sie auch nicht;
//   • Befunde (E3) als eigener Abschnitt, nur belegte (siehe BEFUNDE_ABSCHNITT).
//
// Regeln aus dem Atlas-Entscheid vom 24.10.2026: keine Rangliste, keine
// Wertungsfarben. Alle Karten haben eine einzige Farbe in vier Stufen; dunkler
// heisst «höhere Zahl», nicht «besser» oder «schlechter».
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import de from '../../src/i18n/de.js';
import { EBENEN, KANTONE, BLOECKE_VERGLEICH, KITA_NICHT_VERGLICHEN } from '../seiten-vergleich.mjs';
import { KANTONE_IM_VERGLEICH } from './kantone-im-vergleich.mjs';
import { zahlen as zahlenKrankenkasse } from '../seiten-figuren.mjs';
import { vergleichZahlen } from '../seiten-vergleich.mjs';

const GEO = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'daten', 'kantonsatlas', 'paths.json'), 'utf8'));
for (const k of KANTONE) if (!GEO.cantons[k]) throw new Error(`Kantonsatlas-Karte: ${k} fehlt in paths.json`);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ─── Stufen: vier gleich grosse Gruppen von Kantonen ────────────────────────
// Nach dem Wert sortiert, in Viertel geteilt. Gleiche Werte bleiben in
// derselben Stufe, darum sind die Stufen nicht immer gleich gross und eine
// kann auch leer bleiben. Keine Platzziffer, nur die Spanne.
export function stufen(key) {
  const reihe = KANTONE.map((k) => ({ k, v: EBENEN[key].wert(k) })).sort((a, b) => a.v - b.v);
  const stufe = {};
  reihe.forEach(({ k, v }, i) => {
    const erster = reihe.findIndex((r) => r.v === v);
    stufe[k] = Math.floor((erster * 4) / reihe.length) + 1;
  });
  const spannen = [1, 2, 3, 4].map((s) => {
    const vs = reihe.filter(({ k }) => stufe[k] === s).map((r) => r.v);
    return vs.length ? { s, min: Math.min(...vs), max: Math.max(...vs), n: vs.length } : null;
  }).filter(Boolean);
  return { stufe, spannen };
}

// ─── Eine Karte ──────────────────────────────────────────────────────────────
// Die Kantonsformen stehen einmal in der ersten Karte (<defs>), alle weiteren
// Karten verweisen mit <use> darauf. So bleibt die Seite leicht.
function karte(ctx, key, { legende, nachher = '' }) {
  ctx.abb += 1;
  const E = EBENEN[key];
  const { stufe, spannen } = stufen(key);
  const id = `karte-${key.toLowerCase()}`;
  const erste = !ctx.kartenDefs;
  ctx.kartenDefs = true;
  const defs = erste
    ? `<defs>${KANTONE.map((k) => `<path id="ka-${k}" d="${GEO.cantons[k].d}"/>`).join('')}${GEO.lakes.map((d, i) => `<path id="ka-see-${i}" d="${d}"/>`).join('')}</defs>`
    : '';
  const flaechen = KANTONE.map((k) => `<use href="#ka-${k}" class="k${stufe[k]}"/>`).join('');
  const seen = GEO.lakes.map((_, i) => `<use href="#ka-see-${i}" class="see"/>`).join('');
  const spanne = (s) => s.min === s.max ? E.fmt(s.min) : `${E.fmt(s.min)} bis ${E.fmt(s.max)}`;
  const titel = `Karte: ${E.titel}`;
  const tiefK = KANTONE.find((k) => E.wert(k) === spannen[0].min);
  const hochK = KANTONE.find((k) => E.wert(k) === spannen[spannen.length - 1].max);
  const beschreibung = `Die 26 Kantone, eingefärbt in ${spannen.length} Stufen nach ${E.titel} (${E.einheit}), von hell (tiefere Zahl) bis dunkel (höhere Zahl). Am tiefsten im Kanton ${de.cantons[tiefK]} mit ${E.fmt(spannen[0].min)}, am höchsten im Kanton ${de.cantons[hochK]} mit ${E.fmt(spannen[spannen.length - 1].max)}. Die Werte jedes Kantons stehen in der Tabelle bei der Karte.`;
  const svg = `<svg viewBox="0 0 ${GEO.w} ${GEO.h}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">` +
    `<title id="${id}-t">${esc(titel)}</title><desc id="${id}-d">${esc(beschreibung)}</desc>${defs}${flaechen}${seen}</svg>`;
  // Einheit über der Legende, damit die Spannen nicht ohne Mass dastehen.
  const schweiz = E.ch != null ? `Ganze Schweiz: ${E.fmt(E.ch)}` : '';
  return `
        <figure class="abb atlas" id="${id}">
          <div class="abb-karte">
            <p class="abb-kopf" aria-hidden="true"><span>Abb. ${ctx.abb}</span><span>${esc(E.titel)}</span></p>
            <div class="abb-bild">${svg}</div>
            <p class="atlas-einheit">${esc(E.einheit)}</p>
            <ul class="atlas-legende" role="list">${spannen.map((s, i) => `<li><i class="k${s.s}" aria-hidden="true"></i><span class="sr-only">Stufe ${i + 1} von ${spannen.length}${i === 0 ? ', hell' : i === spannen.length - 1 ? ', dunkel' : ''}: </span>${spanne(s)}</li>`).join('')}</ul>
            ${schweiz ? `<p class="abb-fuss"><span class="abb-wert">${schweiz}</span></p>` : ''}
          </div>
          <figcaption><strong>Abb. ${ctx.abb}.</strong> ${legende}</figcaption>${nachher}
        </figure>`;
}

// Die Werte zu einer Karte: dieselbe Tabelle wie auf /kantone-im-vergleich/,
// zugeklappt, damit die Karten auf dem Handy nahe beieinander stehen.
const werteTabelle = (tab, text) => `
        <details class="atlas-werte">
          <summary>${text}</summary>${BLOECKE_VERGLEICH[`TAB:${tab}`]()}
        </details>`;

const BLOECKE_ATLAS = {
  'FIG:praemie': (ctx) => karte(ctx, 'praemie', {
    legende: 'Mittlere Monatsprämie für Erwachsene 2027, mit allen Franchisen und Modellen. [[q:praemienKantone]]',
    nachher: werteTabelle('vpraemie', 'Prämie je Kanton als Tabelle') }),
  'FIG:lastnachipv': (ctx) => karte(ctx, 'lastNachIpv', {
    legende: 'Prämienlast einer unverheirateten Person mit Medianeinkommen nach der durchschnittlichen Verbilligung im Kanton, gerechnet mit der Prämie 2026, dem Einkommen 2022 und der Verbilligung 2025. Ein Rechenwert über alle Versicherten, nicht die Last einer bestimmten Person. [[q:estvStatistik]] [[q:bagOkp]]',
    nachher: werteTabelle('vlast', 'Prämienlast vor und nach Verbilligung als Tabelle') }),
  'FIG:steuer': (ctx) => karte(ctx, 'steuer', {
    legende: 'Steuern an Bund, Kanton und Gemeinde im Kantonshauptort bei 80\'000 Franken Bruttolohn, ledig, ohne Kinder und ohne Konfession, Steuerjahr 2026. [[q:estvSteuerrechner]]',
    nachher: werteTabelle('vsteuer', 'Steuern je Kanton als Tabelle, mit der Spanne der Gemeinden') }),
  'FIG:miete': (ctx) => karte(ctx, 'miete', {
    legende: 'Durchschnittliche Nettomiete einer 3-Zimmer-Wohnung 2024, über alle vermieteten Wohnungen, auch langjährige Verträge. [[q:bfsMiete]]',
    nachher: werteTabelle('vmiete', 'Miete je Kanton als Tabelle') }),
  'FIG:leer': (ctx) => karte(ctx, 'leer', {
    legende: 'Leerwohnungsziffer am 1. Juni 2026: Anteil der Wohnungen und Einfamilienhäuser, die leer stehen und zur Miete oder zum Kauf angeboten sind. [[q:bfsLeer]]',
    nachher: werteTabelle('vleer', 'Leerwohnungsziffer je Kanton als Tabelle') }),
  'FIG:kinderzulage': (ctx) => karte(ctx, 'kinderzulage', {
    legende: 'Kinderzulage 2026 je Kind und Monat, erster Ansatz für Arbeitnehmende. Viele Kantone zahlen ab einem bestimmten Alter oder ab dem dritten Kind mehr; das zeigt die Karte nicht. Kantone mit gleichem Betrag stehen in derselben Stufe, darum sind die Stufen nicht gleich gross. [[q:bsvFamz]]',
    nachher: werteTabelle('vfamilie', 'Kinderzulage je Kanton als Tabelle') }),
  'FIG:kita': (ctx) => karte(ctx, 'kita', {
    legende: `Höchster Steuerabzug für die Betreuung von Kindern durch Dritte, Steuerjahr 2026, je Kind. Für ${KITA_NICHT_VERGLICHEN.map((k) => de.cantons[k]).join(' und ')} ist nur der Wert 2025 ausgewiesen; dort ist der Abzug auf die Elternbeiträge an die Betreuung begrenzt, die Zahl ist also kein fester Höchstbetrag. [[q:estvKantonsblaetter]] [[q:estvDrittbetreuung]]`,
    nachher: werteTabelle('vkita', 'Kita-Abzug je Kanton als Tabelle') }),
  'FIG:alq': (ctx) => karte(ctx, 'alq', {
    legende: 'Anteil der Erwerbspersonen, die im September 2026 beim RAV als arbeitslos gemeldet waren. [[q:seco]]',
    nachher: werteTabelle('valq', 'Arbeitslosenquote je Kanton als Tabelle') }),
  'FIG:sozialhilfe': (ctx) => karte(ctx, 'sozialhilfe', {
    legende: 'Anteil der Bevölkerung, der 2024 wirtschaftliche Sozialhilfe bezog. [[q:bfsSozialhilfe]]' }),
  'FIG:el': (ctx) => karte(ctx, 'el', {
    legende: 'Anteil der Menschen mit Altersrente, die im Dezember 2025 Ergänzungsleistungen (EL) bezogen. [[q:bsvEl]]',
    nachher: werteTabelle('vunterstuetzung', 'Sozialhilfe und Ergänzungsleistungen je Kanton als Tabelle') }),
};

const QUELLEN_AUS_VERGLEICH = ['praemienKantone', 'estvStatistik', 'bagOkp', 'estvSteuerrechner', 'bfsMiete', 'bfsLeer', 'bsvFamz', 'estvKantonsblaetter', 'seco', 'bfsSozialhilfe', 'bsvEl', 'estvDrittbetreuung', 'dbg'];

// ─── Befunde (E3, Entscheid Stebler Studios 06.11.2026) ─────────────────────
// Ein Befund ist eine Beobachtung, keine Forderung. Nur belegte Befunde stehen
// hier: B2 (Kita-Abzug, aus den Daten gerechnet) und B3 (Genfer Elternzeit, an
// den Seiten von Kanton und Parlament gelesen am 06.11.2026). B1 (Alimente VD)
// erst nach der Antwort des BRAPA; K1 (Prämienlast) hielt der Nachrechnung vom
// 04.11.2026 nicht stand. Bewusst ohne «mögliches Instrument»: Die Seite sagt,
// was die Zahlen zeigen und wer die Regel festlegt, nicht, was man unternehmen soll.
// Keine selbst gewählte Schwelle (Rechtsprüfung 07.11.2026: wirkte wie eine Rangliste).
const BEFUNDE_ABSCHNITT = {
  id: 'befunde',
  titel: '8. Befunde',
  html: `
        <p>Manchmal zeigen die Zahlen selbst einen Unterschied: eine grosse Spanne oder eine beschlossene Regel, die noch nicht in Kraft ist. Hier stehen solche Befunde. Ein Befund ist eine Beobachtung, keine Forderung. Er nennt, was belegt ist, woher es kommt und wer die Regel festlegt. Was jemand daraus macht, steht nicht auf dieser Seite.</p>
        <article class="befund" aria-labelledby="befund-kita">
          <h3 id="befund-kita">Abzug für Kinderbetreuung: grosse Spanne zwischen den Kantonen</h3>
          <dl>
            <dt>Art</dt><dd>grosse Spanne</dd>
            <dt>Belegt</dt><dd>ja</dd>
            <dt>Was die Zahlen zeigen</dt><dd>Bei der direkten Bundessteuer lassen sich im Steuerjahr {{v.kita.bundJahr}} bis zu {{v.kita.bund}} Franken je Kind abziehen. [[q:dbg]] Bei den Kantons- und Gemeindesteuern reichen die Grenzen von {{v.kita.tief}} Franken {{v.kita.tiefName}} bis {{v.kita.hoch}} Franken {{v.kita.hochName}}. {{v.kita.unterBund}} Kantone liegen unter dem Betrag des Bundes, {{v.kita.abBund}} auf oder darüber. [[q:estvKantonsblaetter]] Alle Werte stehen in der Tabelle zur Karte im Abschnitt Familie.</dd>
            <dt>Wer die Regel festlegt</dt><dd>Den Abzug und seine Bedingungen schreibt das Bundesrecht vor, die Höhe bei den Kantons- und Gemeindesteuern legt jeder Kanton in seinem Steuergesetz fest. [[q:sthg]]</dd>
            <dt>Vorbehalt</dt><dd>Ein tiefer Abzug sagt noch nicht, was Betreuung kostet: Das hängt auch davon ab, wie stark Kanton und Gemeinde die Plätze verbilligen, und vom Steuertarif. {{v.kita.nichtVerglichenName}} ist nicht mitgezählt, weil für den Kanton nur der Wert für 2025 vorliegt.</dd>
          </dl>
        </article>
        <article class="befund" aria-labelledby="befund-ge">
          <h3 id="befund-ge">Genf: Elternurlaub in der Verfassung, Ausführungsgesetz in Arbeit</h3>
          <dl>
            <dt>Art</dt><dd>Stand der Umsetzung</dd>
            <dt>Belegt</dt><dd>ja</dd>
            <dt>Was belegt ist</dt><dd>Die Genfer Stimmberechtigten haben am 18. Juni 2023 einen Elternurlaub in die Kantonsverfassung geschrieben: zu den 16 Wochen Mutterschaftsurlaub 8 Wochen für den anderen Elternteil, die heutigen 2 Wochen nach Bundesrecht eingerechnet. Das Bundesparlament hat die Verfassungsänderung am 22. September 2026 bestätigt (gewährleistet); ausgenommen ist die Bestimmung zu Pflegefamilien. [[q:parlamentGe]] Möglich wird das durch eine Änderung des Erwerbsersatzgesetzes (EOG) vom 19. Dezember 2025: Sie erlaubt den Kantonen, den Urlaub des anderen Elternteils zu verlängern, und tritt am 1. Juli 2027 in Kraft. [[q:as2026433]] Das kantonale Ausführungsgesetz ist laut Kanton noch in Arbeit, ein Datum für den Start nennt er nicht. [[q:geElternurlaub]]</dd>
            <dt>Wer die Regel festlegt</dt><dd>Staatsrat und Grosser Rat des Kantons Genf. Laut Kanton wirken vorher auch das Bundesamt für Sozialversicherungen und allenfalls der Bundesrat mit.</dd>
            <dt>Vorbehalt</dt><dd>Bis das Genfer Ausführungsgesetz in Kraft ist, gibt es den längeren Urlaub für den anderen Elternteil nicht; es gelten die bisherigen Regeln. Ob und wie viel Sie erhalten, hängt von Ihrer Situation ab. Massgebend ist die Auskunft der Ausgleichskasse.</dd>
          </dl>
        </article>`,
};

export const KANTONSATLAS = {
  pfad: 'kantonsatlas',
  titel: 'Kantonsatlas: die 26 Kantone auf der Karte',
  beschreibung:
    'Prämie, Steuern, Miete, Familie, Arbeit und Unterstützung: zehn Karten der Schweizer Kantone, mit Quelle und Stand, ohne Rangliste.',
  brotkrume: 'Kantonsatlas',
  kicker: 'Kantonsatlas',
  inhaltTitel: 'Inhalt',
  stand: KANTONE_IM_VERGLEICH.stand,
  // Gleiche Zahlen wie /kantone-im-vergleich/, also dasselbe Prüfdatum.
  pruefenBis: KANTONE_IM_VERGLEICH.pruefenBis,
  hinweis:
    'Orientierung, keine Rechts- oder Finanzberatung. Eine Karte zeigt einen Wert je Kanton; für einen einzelnen Haushalt kann es ganz anders aussehen.',
  vorbehalt:
    'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Statistiken und Geodaten — keine Rechts-, Versicherungs- oder Finanzberatung</strong>. Die Karten zeigen Durchschnitte, die verschieden erhoben werden und verschieden alt sind. Sie bewerten die Kantone nicht: Eine dunkle Fläche heisst nur, dass die Zahl höher ist. Massgebend sind die zuständigen Stellen.',
  vorspann:
    'Wie hoch ist die Prämie, wie viel kostet eine Wohnung, wie viele Menschen beziehen Unterstützung? Das hängt in der Schweiz oft vom Kanton ab. Dieser Atlas zeigt die Zahlen als Karten, damit sichtbar wird, wo sich etwas ähnelt und wo nicht. Die genauen Werte stehen zu jeder Karte in einer aufklappbaren Tabelle.',
  inhaltsverzeichnis: true,
  abschnitte: [
    {
      id: 'lesen',
      titel: '1. Wie die Karten zu lesen sind',
      html: `
        <p>Jede Karte teilt die 26 Kantone nach ihrer Zahl in vier etwa gleich grosse Gruppen. Hell sind die Kantone mit den tieferen Zahlen, dunkel die mit den höheren. Unter der Karte steht, welche Spanne jede Stufe umfasst; die Werte jedes Kantons stehen in einer aufklappbaren Tabelle bei der Karte. Nahe an einer Stufengrenze können fast gleiche Werte verschieden gefärbt sein.</p>
        <p class="merke"><strong>Kurz gesagt:</strong> Dunkel heisst «höhere Zahl», nicht «besser» oder «schlechter». Eine hohe Miete kann mit hohen Löhnen zusammengehen, eine tiefe Quote damit, dass eine Leistung wenig bekannt ist. Was hinter den Unterschieden steckt, zeigen die Karten nicht.</p>
        <p>Dieselben Zahlen stehen auf der Seite <a href="/kantone-im-vergleich/">Kantone im Vergleich</a> im Text und nebeneinander, dort auch mit ihren Zusammenhängen.</p>`,
    },
    {
      id: 'krankenkasse',
      titel: '2. Krankenkasse',
      html: `
        <p>Die mittlere Prämie für Erwachsene liegt {{jahr}} zwischen {{v.praemie.tief}} Franken {{v.praemie.tiefName}} und {{v.praemie.hoch}} Franken {{v.praemie.hochName}}. Wie die Prämie zustande kommt, erklärt die Seite <a href="/krankenkasse/">Krankenkasse erklärt</a>.</p>
<!--FIG:praemie-->
        <p>Wie schwer die Prämie wiegt, hängt auch vom Einkommen und von der Prämienverbilligung ab. Ob Sie Anspruch auf Verbilligung haben, steht auf der Seite <a href="/praemienverbilligung/">Prämienverbilligung</a>.</p>
<!--FIG:lastnachipv-->`,
    },
    {
      id: 'steuern',
      titel: '3. Steuern',
      html: `
        <p>Bei 80'000 Franken Bruttolohn zahlt eine ledige Person ohne Kinder im Kantonshauptort an Bund, Kanton und Gemeinde zwischen {{v.steuer.tief}} des Lohns {{v.steuer.tiefName}} und {{v.steuer.hoch}} {{v.steuer.hochName}}. Auch innerhalb eines Kantons zählt die Gemeinde; die Tabelle unter der Karte zeigt die Spanne innerhalb jedes Kantons.</p>
<!--FIG:steuer-->`,
    },
    {
      id: 'wohnen',
      titel: '4. Wohnen',
      html: `
        <p>Eine 3-Zimmer-Wohnung kostete 2024 im Durchschnitt zwischen {{v.miete.tief}} Franken im Monat {{v.miete.tiefName}} und {{v.miete.hoch}} Franken {{v.miete.hochName}}. Wie leicht man eine Wohnung findet, zeigt die Karte zur Leerwohnungsziffer.</p>
<!--FIG:miete-->
<!--FIG:leer-->`,
    },
    {
      id: 'familie',
      titel: '5. Familie',
      html: `
        <p>Die Kinderzulage beträgt 2026 in allen Kantonen mindestens {{v.kinderzulage.tief}} Franken im Monat. Bei den Steuern lassen sich die Kosten für Kita, Tagesfamilie oder Hort bis zu einer Grenze abziehen, die fast jeder Kanton selbst festlegt.</p>
<!--FIG:kinderzulage-->
<!--FIG:kita-->
        <p class="leise">Ein tiefer Abzug sagt noch nicht, was Betreuung kostet: Das hängt auch davon ab, wie stark Kanton und Gemeinde die Plätze verbilligen.</p>`,
    },
    {
      id: 'arbeit',
      titel: '6. Arbeit',
      html: `
        <p>Im September 2026 waren zwischen {{v.alq.tief}} der Erwerbspersonen {{v.alq.tiefName}} und {{v.alq.hoch}} {{v.alq.hochName}} als arbeitslos gemeldet.</p>
<!--FIG:alq-->
        <p class="leise">Wer keine Stelle hat, aber nicht beim RAV gemeldet ist, fehlt in dieser Zahl. Es ist ein Monatswert, der saisonal schwankt.</p>`,
    },
    {
      id: 'unterstuetzung',
      titel: '7. Unterstützung',
      html: `
        <p>Sozialhilfe und Ergänzungsleistungen helfen, wenn das eigene Geld nicht reicht. Die Karten zeigen, wie viele Menschen sie beziehen.</p>
<!--FIG:sozialhilfe-->
<!--FIG:el-->
        <p class="leise"><strong>Vorbehalt:</strong> Die Quoten zeigen, wer bezieht, nicht, wer Anspruch hätte. Wer eine Leistung nicht beantragt, fehlt. Eine hohe Quote kann auf mehr Bedarf hindeuten, aber auch darauf, dass die Leistung bekannter ist oder leichter beantragt wird. Was Ihnen zustehen könnte, zeigt die Seite <a href="/was-steht-mir-zu/">Was steht mir zu?</a></p>`,
    },
    BEFUNDE_ABSCHNITT,
  ],
  zahlen: () => ({ ...zahlenKrankenkasse(), ...vergleichZahlen(), }),
  bloecke: BLOECKE_ATLAS,
  quellen: [
    ...QUELLEN_AUS_VERGLEICH.map((key) => {
      const q = KANTONE_IM_VERGLEICH.quellen.find((x) => x.key === key);
      if (!q) throw new Error(`Kantonsatlas: Quelle ${key} fehlt auf /kantone-im-vergleich/`);
      return q;
    }),
    { key: 'parlamentGe', herausgeber: 'Keystone-ATS, veröffentlicht auf parlament.ch', titel: 'Le Parlement donne son feu vert au congé parental genevois', datum: '22.09.2026', url: 'https://www.parlament.ch/fr/services/news/Pages/2026/20260922084151244194158159026_bsf021.aspx', belegt: 'Gewährleistung durch das Parlament am 22.09.2026, ohne die Bestimmung zu Pflegefamilien; Inhalt: 8 Wochen für den anderen Elternteil zu 16 Wochen Mutterschaft', amtlich: false },
    { key: 'as2026433', herausgeber: 'Bundeskanzlei (Fedlex), AS 2026 433', titel: 'Bundesgesetz über den Erwerbsersatz (Erwerbsersatzgesetz, EOG) (Angleichung der EO-Leistungen), Änderung vom 19. Dezember 2025', datum: 'in Kraft ab 1.7.2027', url: 'https://www.fedlex.admin.ch/eli/oc/2026/433/de', belegt: 'Art. 16m^bis EOG: Kantone dürfen die Entschädigung des anderen Elternteils verlängern; Inkrafttreten 1.7.2027', amtlich: true },
    { key: 'sthg', herausgeber: 'Bundeskanzlei (Fedlex), SR 642.14', titel: 'Bundesgesetz über die Harmonisierung der direkten Steuern der Kantone und Gemeinden (StHG), Art. 9 Abs. 2 Bst. m', datum: 'Fassung vom 1.1.2025', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1256_1256_1256/de', belegt: 'Abzug für die Drittbetreuung von Kindern, Höhe nach kantonalem Recht', amtlich: true },
    { key: 'geElternurlaub', herausgeber: 'République et canton de Genève', titel: 'Congé parental : les étapes de la mise en œuvre', datum: 'ohne Datum, gelesen 06.11.2026', url: 'https://www.ge.ch/dossier/cohesion-sociale-geneve/domaines-developpement/conge-parental-etapes-mise-oeuvre', belegt: 'Abstimmung 18.06.2023, Änderung der Erwerbsersatzordnung vom 19.12.2025 mit Inkrafttreten 1.7.2027, fehlendes Ausführungsgesetz, kein Startdatum', amtlich: true },
    // Rechtsprüfung 06.11.2026: Die BFS-Geodaten stehen unter «OPEN-BY» (freie Nutzung,
    // Quellenangabe mit Autor, Titel und Link Pflicht). swiss-maps (BSD-3-Clause) hat sie
    // aufbereitet. swisstopo nicht nennen: als Rechteinhaber nicht belegt.
    { key: 'karte', herausgeber: 'Bundesamt für Statistik (BFS), GEOSTAT', titel: 'Generalisierte Gemeindegrenzen: Geodaten', datum: 'Stand 2021; freie Nutzung, Quellenangabe Pflicht (OPEN-BY)', url: 'https://statistik.admin.ch/de/asset/15724821', belegt: 'Grenzen der Kantone und der grossen Seen, Grundlage der Karten', amtlich: true },
    { key: 'swissmaps', herausgeber: 'Interactive Things, swiss-maps 4.5.0', titel: 'swiss-maps: Geodaten der Schweiz als TopoJSON', datum: 'Version 4.5.0, BSD-3-Clause', url: 'https://github.com/interactivethings/swiss-maps', belegt: 'Aufbereitung der BFS-Grenzen, für diese Karten zusätzlich vereinfacht', amtlich: false },
  ],
  quellenHinweis:
    'Maloja Plana steht mit diesen Stellen in keiner Verbindung; die Verlinkung bedeutet keine Zusammenarbeit und keine Billigung. Die Zahlen sind dieselben wie auf der Seite «Kantone im Vergleich» und stammen aus diesen Quellen.',
  eigeneRechnungen: [
    'Stufen: Die 26 Kantone sind nach ihrer Zahl sortiert und in vier etwa gleich grosse Gruppen geteilt. Kantone mit gleichem Wert stehen in derselben Stufe. Die Stufen sind für jede Karte neu gerechnet und lassen sich zwischen den Karten nicht vergleichen.',
    ...KANTONE_IM_VERGLEICH.eigeneRechnungen.slice(0, 1),
  ],
  // Belegstellen der Karte stehen in der Legende jeder Abbildung, ausser der
  // Kartengrundlage: die gehört zu allen Karten und steht im ersten Abschnitt.
  stilZusatz: `
    /* ─── Kantonsatlas: eine Farbe (Heidelbeere) in vier Stufen ─────────── */
    :root{ --k1:#D3DEE9; --k2:#B3C4D6; --k3:#6787A5; --k4:#3D5A76; --k-see:#F2F2F0 }
    @media (prefers-color-scheme: dark){
      :root{ --k1:#2E3742; --k2:#4A6380; --k3:#86A6C2; --k4:#C6D6E5; --k-see:#22211F }
    }
    .atlas .abb-bild svg{ max-height:420px }
    .atlas svg use{ stroke:var(--leise); stroke-width:.6 }
    .atlas svg .k1, .atlas-legende i.k1{ fill:var(--k1); background:var(--k1) }
    .atlas svg .k2, .atlas-legende i.k2{ fill:var(--k2); background:var(--k2) }
    .atlas svg .k3, .atlas-legende i.k3{ fill:var(--k3); background:var(--k3) }
    .atlas svg .k4, .atlas-legende i.k4{ fill:var(--k4); background:var(--k4) }
    .atlas svg .see{ fill:var(--k-see); stroke:none }
    .atlas-einheit{ margin:6px 0 0; font-size:13px; color:var(--leise) }
    .atlas-legende{ list-style:none; padding:0; display:flex; flex-wrap:wrap; gap:6px 16px; margin:6px 0 4px; font-size:13px; color:var(--leise); font-variant-numeric:tabular-nums }
    .atlas-legende li{ display:inline-flex; align-items:center; gap:6px }
    .atlas-legende i{ display:inline-block; width:14px; height:14px; border-radius:3px; border:1px solid var(--rand);
      -webkit-print-color-adjust:exact; print-color-adjust:exact }
    /* Karte und Legende behalten zusammen ihre Stufen, sonst zeigte die Legende vier Farben und die Karte eine. */
    @media (forced-colors:active){ .atlas-legende i, .atlas svg{ forced-color-adjust:none } }
    .atlas-werte{ margin:10px 0 0 }
    .atlas-werte summary{ cursor:pointer; color:var(--heidel-text); font-size:15px; padding:10px 0 }
    .befund{ background:var(--flaeche); border:1px solid var(--rand); border-radius:16px; padding:16px 18px; margin:18px 0 }
    .befund h3{ margin:0 0 10px }
    .befund dl{ display:grid; grid-template-columns:max-content 1fr; gap:6px 14px; font-size:15px }
    .befund dt{ color:var(--leise) } .befund dd{ margin:0 }
    @media (max-width:600px){ .befund dl{ grid-template-columns:1fr } .befund dt{ margin-top:6px } }
    .atlas-werte summary:focus-visible{ outline:2px solid var(--text); outline-offset:2px }`,
};

// Die Kartengrundlage wird im ersten Abschnitt belegt, damit sie in der
// Quellenliste eine Rückverweis-Stelle hat.
KANTONSATLAS.abschnitte[0].html += `
        <p class="leise">Kartengrundlage: Kantonsgrenzen und Seen des BFS, Stand 2021, aufbereitet mit swiss-maps und vereinfacht. Spätere Gebietswechsel zwischen Kantonen sind nicht eingezeichnet. [[q:karte]] [[q:swissmaps]]</p>`;
