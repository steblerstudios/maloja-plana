// ─── Hintergrundseite: Wie die Schweiz entscheidet ───────────────────────────
//
// Entscheid Stebler Studios, 04.11.2026 («Weg A»): Erklärfiguren zu Schweizer
// Systemen werden eigene, leichte Maloja-Seiten vor dem Gate. Nach
// /krankenkasse/ ist das Politsystem die zweite. Vorschlag und Entscheid:
// stebler-studios/VORSCHLAG-erklaerseiten-in-maloja-2026-11-04.md (ausserhalb
// dieses Repos). Muster und Rahmen: scripts/seiten/krankenkasse.mjs.
//
// Herkunft: die Erklärfigur «Schweizer Politsystem als Kugelbahn» von Stebler
// Studios (Fassung 02.11.2026, damals in Recht, Barrierefreiheit und Sprache
// gegengelesen). Text hier neu gefasst, mit Belegen je Aussage; die Figuren
// sind Standbilder daraus (scripts/seiten/figuren/_HERKUNFT.md).
//
// ─── ZAHLEN ─────────────────────────────────────────────────────────────────
// Die Zahlen dieser Seite (Sitze, Stimmen, Fristen) führt Maloja sonst nicht.
// Sie stehen darum HIER einmal, mit Quelle, und speisen Text UND Tabelle über
// {{platzhalter}}. Die Prüfungen unten brechen den Bau ab, wenn sie sich
// widersprechen (200 Sitze, 46 Sitze, 23 Standesstimmen). Kantonsnamen kommen
// aus src/i18n/de.js, wie auf /krankenkasse/.
//
// `pruefenBis`: die neue Legislatur beginnt am 6.12.2027 (Sitze «seit 2023»
// werden Vergangenheit), die Bundesratswahl im Dezember 2027 ändert vielleicht
// die Parteien. Die Gemeindezahl hat ein eigenes, früheres Datum (GEMEINDEN). Danach wird src/__tests__/politsystemSeite.test.js rot, bis jemand
// den Text gegen den neuen Stand gelesen hat. Dabei auch USG Art. 31b Abs. 4 bis 6
// ansehen: am 05.11.2026 noch nicht in Kraft («zu einem späteren Zeitpunkt»).
//
// Nur Deutsch, bis eine Übersetzung gegengelesen ist — wie /krankenkasse/.
//
// Bewegte Fassung: Die Kugelbahn selbst (Quelle: in Arbeit/schweizer-politsystem/
// bei Stebler Studios) ist NICHT übernommen. Sie ist 732 KB gross, bettet ihre
// Skripte ein (live durch script-src 'self' blockiert) und ist auf keinem
// echten Handy getestet. Entscheid Stebler Studios 05.11.2026: «Erst Handy-Test».
// Bis dahin zeigt die Seite nur Standbilder, ohne Link und ohne Rahmen
// (Schalter `bewegtVerlinken` unten). Danach: Kugelbahn in eigene Skripte zerlegen.
// ─────────────────────────────────────────────────────────────────────────────

import de from '../../src/i18n/de.js';
import { abbildung, fr } from '../seiten-figuren.mjs';

// ─── Sitze im Nationalrat ────────────────────────────────────────────────────
// Reihenfolge der Kantone wie in der Bundesverfassung (Art. 1).
// ab2027: Verordnung über die Sitzverteilung bei der Gesamterneuerung des
//         Nationalrates vom 27.08.2025 (SR 161.12), Wahlen vom Herbst 2027.
// seit2023: Verordnung vom 01.09.2021 (Wahlen 2023), Sitze der laufenden Legislatur.
const KANTONE = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];
export const SITZE_AB_2027 = { ZH: 36, BE: 23, LU: 10, UR: 1, SZ: 4, OW: 1, NW: 1, GL: 1, ZG: 3, FR: 8, SO: 6, BS: 4, BL: 7, SH: 2, AR: 1, AI: 1, SG: 12, GR: 4, AG: 16, TG: 6, TI: 8, VD: 19, VS: 8, NE: 4, GE: 12, JU: 2 };
export const SITZE_SEIT_2023 = { ...SITZE_AB_2027, BE: 24, LU: 9, FR: 7, GR: 5 };
// BV Art. 150 Abs. 2 und Art. 142 Abs. 4: dieselben sechs Kantone.
export const HALBE = ['OW', 'NW', 'BS', 'BL', 'AR', 'AI'];
export const STAENDERAT = Object.fromEntries(KANTONE.map((k) => [k, HALBE.includes(k) ? 1 : 2]));

// ─── Regeln, je mit Stelle ───────────────────────────────────────────────────
export const REGELN = {
  bundesrat: 7, // BV Art. 175 Abs. 1
  nationalrat: 200, // BV Art. 149 Abs. 1
  staenderat: 46, // BV Art. 150 Abs. 1
  standesstimmen: 23, // BV Art. 142 Abs. 4: 20 ganze, 6 halbe
  referendum: 50000, // BV Art. 141 Abs. 1
  referendumKantone: 8, // BV Art. 141 Abs. 1
  referendumTage: 100, // BV Art. 141 Abs. 1
  initiative: 100000, // BV Art. 139 Abs. 1
  initiativeMonate: 18, // BV Art. 139 Abs. 1
  einigung: 13, // ParlG Art. 91 Abs. 2
  stimmalter: 18, // BV Art. 136 Abs. 1
};
// Bundesrat, Stand November 2026 (admin.ch). Übung, keine Verfassungsregel.
export const BUNDESRAT_PARTEIEN = [
  ['SVP', 2],
  ['SP', 2],
  ['FDP', 2],
  ['Mitte', 1],
];
// Politische Gemeinden am 1.1.2026, BFS, Amtliches Gemeindeverzeichnis.
// Eigenes Prüfdatum: Fusionen gelten meist zum Jahreswechsel, die Zahl veraltet am 1.1.2027.
export const GEMEINDEN = { zahl: 2110, stand: '1. Januar 2026', pruefenBis: '2027-01-15' };

const summe = (o) => Object.values(o).reduce((a, b) => a + b, 0);
if (KANTONE.length !== 26 || Object.keys(SITZE_AB_2027).join() !== KANTONE.join()) throw new Error('politsystem: Kantonsliste stimmt nicht');
if (summe(SITZE_AB_2027) !== REGELN.nationalrat || summe(SITZE_SEIT_2023) !== REGELN.nationalrat) throw new Error('politsystem: Nationalrat ergibt nicht 200 Sitze');
if (Object.values(SITZE_AB_2027).some((s) => s < 1)) throw new Error('politsystem: jeder Kanton hat mindestens einen Sitz (BV 149 Abs. 4)');
if (summe(STAENDERAT) !== REGELN.staenderat) throw new Error('politsystem: Ständerat ergibt nicht 46 Sitze');
if (KANTONE.length - HALBE.length + HALBE.length / 2 !== REGELN.standesstimmen) throw new Error('politsystem: Standesstimmen ergeben nicht 23');
if (BUNDESRAT_PARTEIEN.reduce((a, [, n]) => a + n, 0) !== REGELN.bundesrat) throw new Error('politsystem: Bundesrat hat nicht 7 Sitze');

// ─── Platzhalter im Text ─────────────────────────────────────────────────────
const tausender = (n) => fr(n);
const name = (k) => de.cantons[k];
const veraendert = KANTONE.filter((k) => SITZE_AB_2027[k] !== SITZE_SEIT_2023[k]);
const liste = (ks) => ks.length < 2 ? ks.join('') : `${ks.slice(0, -1).join(', ')} und ${ks[ks.length - 1]}`;

export function zahlenPolitsystem() {
  const gewinnt = veraendert.filter((k) => SITZE_AB_2027[k] > SITZE_SEIT_2023[k]).map(name);
  const verliert = veraendert.filter((k) => SITZE_AB_2027[k] < SITZE_SEIT_2023[k]).map(name);
  const einSitz = KANTONE.filter((k) => SITZE_SEIT_2023[k] === 1).map(name);
  return {
    'r.bundesrat': String(REGELN.bundesrat),
    'r.nationalrat': String(REGELN.nationalrat),
    'r.staenderat': String(REGELN.staenderat),
    'r.standesstimmen': String(REGELN.standesstimmen),
    'r.standesHalb': String(REGELN.standesstimmen / 2).replace('.', ','),
    'r.referendum': tausender(REGELN.referendum),
    'r.referendumKantone': ['null', 'einen', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht'][REGELN.referendumKantone],
    'r.referendumTage': String(REGELN.referendumTage),
    'r.initiative': tausender(REGELN.initiative),
    'r.initiativeMonate': String(REGELN.initiativeMonate),
    'r.einigung': String(REGELN.einigung),
    'r.stimmalter': String(REGELN.stimmalter),
    'gemeinden.zahl': tausender(GEMEINDEN.zahl),
    'gemeinden.stand': GEMEINDEN.stand,
    'sitze.zh': String(SITZE_SEIT_2023.ZH),
    'sitze.ur': String(SITZE_SEIT_2023.UR),
    'sitze.einSitzAnzahl': String(einSitz.length),
    'sitze.einSitz': liste(einSitz),
    'sitze.gewinnt': liste(gewinnt),
    'sitze.verliert': liste(verliert),
    'halbe.anzahl': String(HALBE.length),
    'halbe.namen': liste(HALBE.map(name)),
    'ganze.anzahl': String(KANTONE.length - HALBE.length),
    'bundesrat.parteien': liste(BUNDESRAT_PARTEIEN.map(([p, n]) => `${n === 1 ? 'ein Mitglied' : `${['', '', 'zwei', 'drei'][n]} Mitglieder`} der ${p}`)),
  };
}

// ─── Bilder und Tabellen ─────────────────────────────────────────────────────
// Standbilder der Kugelbahn (isometrisch, Anatomy). Im Bild steht kein Text,
// die Zahlen stehen in Legende und Tabelle.
const fig = (id, datei, kurz, titel, beschreibung, wert, legende) => (ctx) =>
  abbildung(ctx, { id, datei, stil: 'iso', kurz, titel, beschreibung, wert, legende });

const figEbenen = fig('abb-ebenen', 'politsystem-ebenen.svg', 'Drei Ebenen',
  'Eine Sortierbahn mit drei Terrassen: Bund, Kantone, Gemeinden',
  `Drei Terrassen übereinander. Oben eine einzige Platte für den Bund, in der Mitte 26 Felder für die Kantone, unten viele kleine Punkte für die Gemeinden. Eine Rinne führt an allen vorbei.`,
  `1 Bund · 26 Kantone · ${fr(GEMEINDEN.zahl)} Gemeinden`,
  `Die Rinne steht für den Weg einer Aufgabe: Sie biegt dort ab, wo die Aufgabe hingehört. Was die Verfassung dem Bund nicht zuweist, bleibt bei den Kantonen. Gemeinden: Stand ${GEMEINDEN.stand}. [[q:bv]] [[q:gemeinden]]`);

const figBahn = fig('abb-bahn', 'politsystem-bahn.svg', 'Der Weg einer Vorlage',
  'Eine Kugelbahn: der Weg einer Vorlage durch Bundesrat, Parlament und Volk',
  `Eine Kugelbahn auf einer Grundplatte. Eine goldene Kugel, die Vorlage, rollt über fünf Türme bergab: Bundesrat mit ${REGELN.bundesrat} Knöpfen, Nationalrat mit ${REGELN.nationalrat} Stiften, Ständerat mit ${REGELN.staenderat} Stiften, eine Weiche mit Unterschriften-Uhr und ${REGELN.referendumTage}-Tage-Lineal, und die Urne mit 26 Fähnchen für die Stände. Unten liegen drei Schalen für die möglichen Ausgänge.`,
  'Bundesrat · Nationalrat · Ständerat · Referendum · Urne',
  'Von links oben nach rechts unten: Bundesrat, Nationalrat, Ständerat, die Weiche für das Referendum und die Urne. Die Kugel kann an jeder Station hängen bleiben. Die Türme stehen für die Stellen, nicht für ihre Grösse. [[q:bv]]');

const figUhr = fig('abb-uhrwerk', 'politsystem-uhrwerk.svg', 'Sieben gleiche Räder',
  'Der Bundesrat als Uhrwerk aus sieben gleich grossen Zahnrädern',
  `${['', '', '', '', '', '', '', 'Sieben'][REGELN.bundesrat]} gleich grosse Zahnräder greifen in einer Kette ineinander. Dreht eines, drehen alle. Ein heller Ring auf dem ersten Rad steht für den Vorsitz.`,
  `${REGELN.bundesrat} Mitglieder · 1 Jahr Vorsitz`,
  'Kein Rad ist grösser als die anderen: Der Bundesrat entscheidet als Kollegium. Der Vorsitz wechselt jedes Jahr. [[q:bv]]');

const figMehr = fig('abb-mehr', 'politsystem-mehr.svg', 'Das doppelte Mehr',
  'Ein Prüfstand für das doppelte Mehr: Volk und Stände',
  'Ein Prüfstand. Eine lange Reihe von 26 Schienen, eine je Kanton, nach Grösse geordnet; am Ende jeder Schiene ein Fähnchen. Nur bei wenigen Kantonen ist das Fähnchen oben. Vorne zwei runde Uhren für Volk und Stände und ein Schloss mit zwei Riegeln, das zu bleibt.',
  'Beispiel: Volk Ja, Stände Nein',
  `Ein gedachtes Beispiel: Beim Volk gibt es knapp mehr Ja als Nein. Die Fähnchen oben sind die Kantone, die Ja sagen, und das sind nur wenige. Das Schloss öffnet nur, wenn beide Uhren eine Mehrheit zeigen: die Mehrheit der Stimmenden und die Mehrheit der Stände. Hier bleibt es zu: Die Vorlage scheitert am Ständemehr. Wie die Kantone stimmen, ist erfunden, die Regel ist echt. [[q:bv]]`);

const figWahl = fig('abb-wahlbank', 'politsystem-wahlbank.svg', 'Sitze nach Kanton',
  `Eine Wahlbank: 26 Säulen mit zusammen ${REGELN.nationalrat} Scheiben, die Sitze im Nationalrat`,
  `Eine Bank mit 26 Säulen aus aufgestapelten Scheiben, eine Säule je Kanton, eine Scheibe je Sitz. Die erste Säule, Zürich, ist sehr hoch und hervorgehoben, die letzten bestehen aus einer einzigen Scheibe. Davor vier Schalen mit 13, 12, 8 und 3 Scheiben, zusammen die ${SITZE_SEIT_2023.ZH} Zürcher Sitze.`,
  `${REGELN.nationalrat} Sitze · 26 Wahlkreise`,
  `Jede Säule ist ein Kanton, jede Scheibe ein Sitz im Nationalrat, seit den Wahlen 2023; die Zahlen stehen in der Tabelle darunter. [[q:sitze2023]] Vorne ein Beispiel mit vier erfundenen Parteien und erfundenen Stimmen: So verteilt die Rechnung des Gesetzes die ${SITZE_SEIT_2023.ZH} Zürcher Sitze, vereinfacht ohne Listenverbindungen. [[q:bpr]]`);

const figWaage = fig('abb-waage', 'politsystem-waage.svg', 'Zwei gleich schwere Räte',
  'Eine Balkenwaage: Nationalrat und Ständerat im Gleichgewicht',
  `Eine Balkenwaage. Auf der linken Schale stehen ${REGELN.nationalrat} Stifte für den Nationalrat, auf der rechten ${REGELN.staenderat} für den Ständerat. Der Balken steht waagrecht.`,
  `${REGELN.nationalrat} : ${REGELN.staenderat} · gleiches Gewicht`,
  'Links mehr Sitze, rechts weniger, und doch steht der Balken waagrecht: Die Verfassung stellt beide Räte einander gleich. [[q:bv]]');

function tabelleSitze() {
  const zeilen = KANTONE.map((k) => {
    const alt = SITZE_SEIT_2023[k], neu = SITZE_AB_2027[k];
    const d = neu - alt;
    const neuText = d === 0 ? String(neu) : `${neu} <span class="leise">(${d > 0 ? '+' : '−'}${Math.abs(d)})</span>`;
    return `            <tr><th scope="row">${name(k)}</th><td class="n">${alt}</td><td class="n">${neuText}</td><td class="n">${STAENDERAT[k]}</td></tr>`;
  }).join('\n');
  return `
        <details class="abb-tabelle">
          <summary>Alle Kantone: Sitze im Nationalrat und im Ständerat</summary>
          <div class="tabelle" role="region" aria-label="Sitze je Kanton" tabindex="0"><table>
            <caption>Sitze je Kanton</caption>
            <tr><th scope="col">Kanton</th><th scope="col" class="n">Nationalrat seit 2023</th><th scope="col" class="n">Nationalrat ab Wahl 2027</th><th scope="col" class="n">Ständerat</th></tr>
${zeilen}
            <tr><th scope="row"><strong>Zusammen</strong></th><td class="n"><strong>${summe(SITZE_SEIT_2023)}</strong></td><td class="n"><strong>${summe(SITZE_AB_2027)}</strong></td><td class="n"><strong>${summe(STAENDERAT)}</strong></td></tr>
          </table></div>
        </details>`;
}

export const BLOECKE_POLITSYSTEM = {
  'FIG:ebenen': figEbenen,
  'FIG:bahn': figBahn,
  'FIG:uhrwerk': figUhr,
  'FIG:mehr': figMehr,
  'FIG:wahlbank': figWahl,
  'FIG:waage': figWaage,
  'TAB:sitze': tabelleSitze,
};

// ─── Die Seite ───────────────────────────────────────────────────────────────
export const POLITSYSTEM = {
  pfad: 'politsystem',
  titel: 'Wie die Schweiz entscheidet',
  kicker: 'Politik erklärt',
  brotkrume: 'Politik erklärt',
  beschreibung:
    'Bund, Kantone und Gemeinden, Bundesrat und Parlament, Referendum und Volksinitiative: wie in der Schweiz ein Gesetz entsteht und wo Sie mitreden. In sieben Fragen.',
  stand: 'Bundesverfassung, Gesetze und Verordnungen in der geltenden Fassung, geprüft im November 2026; Sitze im Nationalrat seit den Wahlen 2023 und ab den Wahlen 2027; Bundesrat und Gemeinden wie im Text vermerkt.',
  pruefenBis: '2027-12-20',
  bewegtEinbetten: false,
  // Die bewegte Kugelbahn verlinken? Entscheid Stebler Studios 05.11.2026:
  // «Erst Handy-Test» — erst nach einem Test auf einem echten Handy. Solange false: kein
  // Link, keine Dateien unter /politsystem/bewegt/. Auf true setzen erst, wenn
  // die Kugelbahn als Skriptdateien (script-src 'self') im Repo liegt — bis
  // dahin bricht der Bau ab (build-seiten.mjs).
  bewegtVerlinken: false,
  zahlen: zahlenPolitsystem,
  bloecke: BLOECKE_POLITSYSTEM,
  bilderQuelle: 'scripts/seiten/politsystem.mjs',
  inhaltsTitel: 'Sieben Fragen',
  // Das Gold der Kugel aus der Vorlage, im Hellmodus abgedunkelt: #8F7232 hat
  // auf der Platte 4.4:1, auf den hellsten Schattenflächen 3.2:1 (a11y 05.11.2026).
  stilZusatz: `
    .iso{ --kb-gold:#8F7232 } @media (prefers-color-scheme: dark){ .iso{ --kb-gold:#C4A870 } }
    details.abb-tabelle{ margin:4px 0 22px; font-size:15px } details.abb-tabelle summary{ cursor:pointer; color:var(--heidel-text); padding:10px 0 }
    .tabelle[tabindex]:focus-visible{ outline:2px solid var(--text); outline-offset:2px }`,
  hinweis:
    'Orientierung, keine Rechtsberatung. Die Seite vereinfacht; massgebend sind die Bundesverfassung und die Gesetze.',
  vorbehalt:
    'Diese Seite ist eine <strong>Orientierungshilfe auf Basis öffentlicher Informationen — keine Rechtsberatung</strong>. Sie vereinfacht und lässt Ausnahmen weg. Massgebend sind die Bundesverfassung, die Gesetze in ihrer geltenden Fassung und die Auskunft der zuständigen Stelle. Für Wahlen und Abstimmungen in Kanton und Gemeinde gilt deren eigenes Recht.',
  vorspann:
    'In der Schweiz reden viele mit, und das braucht Zeit. Diese Seite zeigt in sieben Fragen, wer wofür zuständig ist, welchen Weg ein Vorschlag nimmt, bis er gilt, und wo Sie selbst mitentscheiden.',
  inhaltsverzeichnis: true,
  abschnitte: [
    {
      id: 'ebenen',
      titel: '1. Wer ist wofür zuständig?',
      html: `
        <p>Vieles wird nicht in Bern entschieden. Die Schweiz hat drei Ebenen: den Bund, die 26 Kantone und die Gemeinden. Der Bund erfüllt die Aufgaben, die ihm die Bundesverfassung zuweist. Alle übrigen Rechte üben die Kantone aus. [[q:bv]] Wie viel die Gemeinden selbst regeln dürfen, bestimmt das Recht des Kantons. [[q:bv]]</p>
<!--FIG:ebenen-->
        <div class="tabelle"><table>
          <caption>Einige Aufgaben und wo sie liegen</caption>
          <tr><th scope="col">Aufgabe</th><th scope="col">Zuständig</th><th scope="col">Stelle</th></tr>
          <tr><td>Armee</td><td>Bund</td><td>BV Art. 60</td></tr>
          <tr><td>Münzen und Banknoten</td><td>Bund</td><td>BV Art. 99</td></tr>
          <tr><td>AHV</td><td>Bund</td><td>BV Art. 112</td></tr>
          <tr><td>Schule</td><td>Kantone</td><td>BV Art. 62</td></tr>
          <tr><td>Kultur</td><td>Kantone; der Bund kann unterstützen, was für das ganze Land wichtig ist</td><td>BV Art. 69</td></tr>
          <tr><td>Siedlungsabfälle, also Abfall aus Haushalten und Vergleichbares</td><td>Kantone; wie weit sie das den Gemeinden übertragen, regelt der Kanton</td><td>USG Art. 31b, VVEA Art. 3, BV Art. 50</td></tr>
        </table></div>
        <p class="leise">Auswahl. Die Stellen stehen in der Bundesverfassung (BV), im Umweltschutzgesetz (USG) und in der Abfallverordnung (VVEA). [[q:bv]] [[q:usg]] [[q:vvea]]</p>
        <p>Beim Bund teilen sich drei Behörden die Arbeit: Die Bundesversammlung, also das Parlament, beschliesst die Gesetze. Der Bundesrat regiert und führt sie aus. Das Bundesgericht urteilt in Streitfällen. Ein Bundesgesetz aufheben kann es nicht: Bundesgesetze und Völkerrecht muss es anwenden. [[q:bv]]</p>
        <p class="merke"><strong>Kurz gesagt:</strong> Ob etwas in Ihrem Kanton anders ist als im Nachbarkanton, liegt oft genau daran: Die Aufgabe gehört dem Kanton.</p>`,
    },
    {
      id: 'weg',
      titel: '2. Welchen Weg nimmt ein Gesetz?',
      html: `
        <p>Vorlagen bereitet in der Regel der Bundesrat vor; er unterbreitet dem Parlament die Entwürfe. Ein neues Gesetz kann aber auch aus dem Parlament selbst kommen oder von einem Kanton angestossen werden. [[q:bv]] Bei wichtigen Vorhaben fragt der Bund zuerst die Kantone, die Parteien und interessierte Kreise nach ihrer Meinung. Das heisst Vernehmlassung. [[q:bv]]</p>
<!--FIG:bahn-->
        <h3>Zwei Räte, ein Text</h3>
        <p>Dann beraten Nationalrat und Ständerat die Vorlage, jeder für sich. Ein Gesetz kommt nur zustande, wenn beide dasselbe beschliessen. [[q:bv]] Sind sie sich nicht einig, geht die Vorlage zwischen den Räten hin und her. Das heisst Differenzbereinigung. Bleibt nach drei Detailberatungen in jedem Rat ein Unterschied, sucht eine Einigungskonferenz einen Ausweg. Sie besteht aus je {{r.einigung}} Mitgliedern der beiden Kommissionen, die die Vorlage in ihrem Rat vorberaten haben. Lehnt ein Rat ihren Vorschlag ab, wird die Vorlage abgeschrieben: Sie ist gescheitert. [[q:parlg]]</p>
        <h3>Das Referendum</h3>
        <p>Ein neues Bundesgesetz gilt in der Regel nicht sofort. Nach seiner Veröffentlichung können {{r.referendum}} Stimmberechtigte oder {{r.referendumKantone}} Kantone innert {{r.referendumTage}} Tagen verlangen, dass das Volk darüber abstimmt. Kommt das nicht zustande, kann das Gesetz ohne Abstimmung in Kraft treten, zu dem Zeitpunkt, den das Gesetz oder der Bundesrat bestimmt. Kommt es zustande, entscheidet die Mehrheit der Stimmenden. [[q:bv]]</p>
        <h3>Wenn die Verfassung ändert</h3>
        <p>Jede Änderung der Bundesverfassung kommt zwingend vors Volk, auch ohne Unterschriften. Dann braucht es zwei Mehrheiten: die der Stimmenden und die der Kantone. Das ist das doppelte Mehr (Frage 4). [[q:bv]]</p>
        <h3>Die Volksinitiative</h3>
        <p>Der Anstoss kann auch von aussen kommen: {{r.initiative}} Stimmberechtigte können innert {{r.initiativeMonate}} Monaten eine Änderung der Verfassung verlangen. Die Bundesversammlung prüft, ob die Initiative gültig ist, und gibt eine Empfehlung ab; sie kann einen Gegenentwurf daneben stellen. Aufhalten kann sie eine gültige Initiative nicht. Ist sie als fertiger Text formuliert, entscheiden am Ende Volk und Kantone. [[q:bv]]</p>
        <p class="merke"><strong>Kurz gesagt:</strong> Ein Gesetz braucht beide Räte. Danach hat das Volk ein letztes Wort, wenn genug Menschen es verlangen. Bei der Verfassung hat es dieses Wort immer.</p>`,
    },
    {
      id: 'bundesrat',
      titel: '3. Wer regiert?',
      html: `
        <p>Die Schweiz hat niemanden an der Spitze, der allein bestimmt. Die Regierung ist der Bundesrat mit {{r.bundesrat}} Mitgliedern, keines steht über den anderen. [[q:bundesrat]] Er entscheidet als Kollegium. [[q:bv]] Was beschlossen ist, vertreten alle Mitglieder. [[q:rvog]]</p>
<!--FIG:uhrwerk-->
        <p>Die Bundesversammlung wählt die Mitglieder nach jeder Wahl des Nationalrats für vier Jahre, die beiden Räte gemeinsam. [[q:bv]] Den Vorsitz führt die Bundespräsidentin oder der Bundespräsident, für ein Jahr. Für das folgende Jahr ist eine Wiederwahl nicht möglich. [[q:bv]]</p>
        <p>Die grossen Parteien teilen sich die Sitze, statt sich als Regierung und Opposition gegenüberzustehen. Das heisst Konkordanz. Es ist eine freiwillige Übung, keine Regel der Verfassung. [[q:hls]] Von 1959 bis 2003 galt die «Zauberformel»: Die FDP, die Konservativen (später CVP) und die SP hatten je zwei Sitze, die Bauern-, Gewerbe- und Bürgerpartei (BGB) einen. [[q:hls]] Die BGB heisst seit 1971 SVP. [[q:hlsSvp]] 2003 gewann die SVP auf Kosten der CVP einen zweiten Sitz. [[q:hls]] Im November 2026 sitzen im Bundesrat {{bundesrat.parteien}}. [[q:bundesrat]]</p>`,
    },
    {
      id: 'mehr',
      titel: '4. Was ist das doppelte Mehr?',
      html: `
        <p>Für eine Änderung der Bundesverfassung reicht die Mehrheit der Stimmenden nicht. Es braucht auch die Mehrheit der Stände, also der Kantone. Das Ergebnis im Kanton gilt als dessen Standesstimme. [[q:bv]]</p>
<!--FIG:mehr-->
        <p>{{ganze.anzahl}} Kantone haben eine ganze Standesstimme, sechs eine halbe: {{halbe.namen}}. [[q:bv]] Zusammen sind das gerechnet {{r.standesstimmen}} Stimmen. Eine Mehrheit braucht mehr als die Hälfte; ein Unentschieden von {{r.standesHalb}} zu {{r.standesHalb}} reicht also nicht.</p>
        <p>Das schützt die kleinen Kantone. Zürich wählt {{sitze.zh}} Mitglieder des Nationalrats, Uri {{sitze.ur}}. Bei den Ständen zählen beide gleich viel. [[q:sitze2023]] [[q:bv]] So kann eine Vorlage beim Volk knapp angenommen und bei den Ständen abgelehnt werden. Dann gilt sie nicht.</p>`,
    },
    {
      id: 'nationalrat',
      titel: '5. Wie wird der Nationalrat gewählt?',
      html: `
        <p>Der Nationalrat hat {{r.nationalrat}} Sitze und wird alle vier Jahre neu gewählt. Jeder Kanton ist ein Wahlkreis. Die Sitze werden nach der Bevölkerungszahl auf die Kantone verteilt; jeder Kanton hat mindestens einen. [[q:bv]]</p>
<!--FIG:wahlbank-->
<!--TAB:sitze-->
        <p>Wo es mehrere Sitze gibt, gilt der Proporz: Die Sitze werden nach dem Stimmenanteil der Listen verteilt. Weil das selten genau aufgeht, legt das Gesetz eine feste Rechnung für die Reste fest. [[q:bpr]] In den {{sitze.einSitzAnzahl}} Kantonen mit nur einem Sitz ({{sitze.einSitz}}) ist gewählt, wer am meisten Stimmen hat. [[q:bpr]]</p>
        <p>Daraus folgt: Eine Stimme wirkt je nach Kanton anders. Eine kleine Partei kann in Zürich mit wenigen Prozent einen Sitz holen, in Uri mit demselben Anteil keinen.</p>
        <p>Weil sich die Bevölkerung verschiebt, legt der Bundesrat die Verteilung vor jeder Wahl neu fest, nach den Zahlen der Wohnbevölkerung und einer festen Rechnung. [[q:bpr]] Für die Wahlen 2027 gewinnen {{sitze.gewinnt}} je einen Sitz, {{sitze.verliert}} geben je einen ab. [[q:sitze2023]] [[q:sitze]]</p>`,
    },
    {
      id: 'staenderat',
      titel: '6. Warum ist der Ständerat gleich wichtig?',
      html: `
        <p>Im Ständerat zählt die Grösse des Kantons nicht. {{ganze.anzahl}} Kantone haben je zwei Sitze, die sechs Kantone mit halber Standesstimme je einen. Das ergibt {{r.staenderat}} Sitze. Wie gewählt wird, bestimmt jeder Kanton selbst. [[q:bv]]</p>
<!--FIG:waage-->
        <p>Trotz {{r.nationalrat}} zu {{r.staenderat}} Sitzen sind die beiden Räte einander gleichgestellt. Ein Gesetz gilt nur, wenn beide zustimmen. So zählen die Menschen und die Kantone zugleich. [[q:bv]] Bei Wahlen wie der des Bundesrats tagen beide Räte gemeinsam als Vereinigte Bundesversammlung. Dort zählt jede Stimme einzeln, und der grössere Nationalrat hat mehr Gewicht. [[q:bv]]</p>`,
    },
    {
      id: 'selbst',
      titel: '7. Was können Sie selbst tun?',
      html: `
        <p>Wer das Schweizer Bürgerrecht hat und {{r.stimmalter}} Jahre alt ist, darf in Bundessachen in der Regel wählen, abstimmen und unterschreiben. Ausgeschlossen sind nur Menschen, die dauernd urteilsunfähig sind, also nicht selbst entscheiden können, und deshalb unter umfassender Beistandschaft stehen oder durch eine vorsorgebeauftragte Person vertreten werden. [[q:bv]] [[q:bpr]] Wer im Ausland lebt, im Auslandschweizerregister eingetragen ist und mitreden will, meldet das der Gemeinde, in der man stimmberechtigt ist, über die zuständige Schweizer Vertretung. [[q:asg]]</p>
        <div class="tabelle"><table>
          <caption>Ihre Rechte auf Bundesebene</caption>
          <tr><th scope="row">Wählen</th><td>Alle vier Jahre den Nationalrat. Wie der Ständerat gewählt wird, regelt der Kanton.</td></tr>
          <tr><th scope="row">Abstimmen</th><td>Unter anderem über jede Änderung der Bundesverfassung, über Volksinitiativen und über Gesetze, gegen die ein Referendum zustande kam.</td></tr>
          <tr><th scope="row">Unterschreiben</th><td>Für ein Referendum oder eine Volksinitiative.</td></tr>
        </table></div>
        <p>In Kantonen und Gemeinden gelten eigene Regeln, die von denen des Bundes abweichen können. Was bei Ihnen gilt, sagt Ihre Gemeinde.</p>`,
    },
  ],
  quellen: [
    { key: 'bv', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 101', titel: 'Bundesverfassung der Schweizerischen Eidgenossenschaft (BV)', url: 'https://www.fedlex.admin.ch/eli/cc/1999/404/de', belegt: 'Art. 3, 42 (Aufgaben), 50 (Gemeinden), 60, 62, 69, 99, 112 (Beispiele), 136 (politische Rechte), 139 (Volksinitiative), 140 bis 142 (Referendum, Mehrheiten, Standesstimmen), 147 (Vernehmlassung), 148 bis 150, 156, 157, 159 (Bundesversammlung), 160 (Initiativrecht), 163 (Gesetze), 165 (dringliche Gesetze), 168, 181 (Entwürfe des Bundesrats), 174 bis 177 (Bundesrat), 188 und 190 (Bundesgericht)', amtlich: true },
    { key: 'gemeinden', herausgeber: 'Bundesamt für Statistik', titel: 'Amtliches Gemeindeverzeichnis der Schweiz', url: 'https://www.agvchapp.bfs.admin.ch/de', belegt: 'Zahl der politischen Gemeinden am 1. Januar 2026: im Verzeichnis Stichtag 01.01.2026 wählen, Ebene Gemeinden (eigene Zählung, 2110)', amtlich: true },
    { key: 'usg', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 814.01', titel: 'Umweltschutzgesetz (USG)', url: 'https://www.fedlex.admin.ch/eli/cc/1984/1122_1122_1122/de', belegt: 'Art. 31b Abs. 1, Entsorgung der Siedlungsabfälle durch die Kantone', amtlich: true },
    { key: 'vvea', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 814.600', titel: 'Abfallverordnung (VVEA)', url: 'https://www.fedlex.admin.ch/eli/cc/2015/891/de', belegt: 'Art. 3 Bst. a, was als Siedlungsabfall gilt', amtlich: true },
    { key: 'parlg', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 171.10', titel: 'Parlamentsgesetz (ParlG)', url: 'https://www.fedlex.admin.ch/eli/cc/2003/510/de', belegt: 'Art. 89 (Differenzbereinigung), 91 (Einigungskonferenz, je 13 Mitglieder), 93 (Abschreibung)', amtlich: true },
    { key: 'rvog', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 172.010', titel: 'Regierungs- und Verwaltungsorganisationsgesetz (RVOG)', url: 'https://www.fedlex.admin.ch/eli/cc/1997/2022_2022_2022/de', belegt: 'Art. 12 Abs. 2, die Mitglieder vertreten die Entscheide des Kollegiums', amtlich: true },
    { key: 'hls', herausgeber: 'Historisches Lexikon der Schweiz', titel: 'Parteien', datum: 'Version vom 24.03.2016', url: 'https://hls-dhs-dss.ch/de/articles/017363/2016-03-24/', belegt: 'Allparteienregierung auf freiwilligem Proporz; Zauberformel 1959 (2 FDP, 2 CVP, 2 SP, 1 BGB) und ihr Ende 2003', amtlich: false },
    { key: 'hlsSvp', herausgeber: 'Historisches Lexikon der Schweiz', titel: 'Schweizerische Volkspartei (SVP)', datum: 'Version vom 20.03.2017', url: 'https://hls-dhs-dss.ch/de/articles/017389/2017-03-20/', belegt: 'Umbenennung der BGB in SVP 1971', amtlich: false },
    { key: 'bundesrat', herausgeber: 'Schweizerische Bundeskanzlei', titel: 'Mitglieder des Bundesrates', url: 'https://www.admin.ch/de/bundesrat-mitglieder', belegt: 'Parteien der Mitglieder, Stand November 2026; der Bundespräsident als «Erster unter Gleichgestellten»', amtlich: true },
    { key: 'sitze', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 161.12', titel: 'Verordnung über die Sitzverteilung bei der Gesamterneuerung des Nationalrates', datum: '27.08.2025', url: 'https://www.fedlex.admin.ch/eli/cc/2025/541/de', belegt: 'Sitze je Kanton für die Wahlen 2027', amtlich: true },
    { key: 'sitze2023', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 161.13', titel: 'Verordnung über die Sitzverteilung bei der Gesamterneuerung des Nationalrates (Wahlen 2023)', datum: '01.09.2021', url: 'https://www.fedlex.admin.ch/eli/cc/2021/533/de', belegt: 'Sitze je Kanton in der laufenden Legislatur', amtlich: true },
    { key: 'bpr', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 161.1', titel: 'Bundesgesetz über die politischen Rechte (BPR)', url: 'https://www.fedlex.admin.ch/eli/cc/1978/688_688_688/de', belegt: 'Art. 2 (Ausschluss vom Stimmrecht), 16 und 17 (Verteilung der Sitze auf die Kantone), 40 und 41 (Verteilung auf die Listen), 47 (Kantone mit einem Sitz)', amtlich: true },
    { key: 'asg', herausgeber: 'Systematische Sammlung des Bundesrechts, SR 195.1', titel: 'Auslandschweizergesetz (ASG)', url: 'https://www.fedlex.admin.ch/eli/cc/2015/653/de', belegt: 'Art. 3 Bst. a und 11 Abs. 2 (Register), Art. 19 Abs. 1 (Meldung an die Stimmgemeinde)', amtlich: true },
  ],
  quellenHinweis:
    'Maloja Plana steht mit diesen Stellen in keiner Verbindung; die Verlinkung bedeutet keine Zusammenarbeit und keine Billigung. Das Historische Lexikon der Schweiz ist keine Behörde, sondern ein wissenschaftliches Nachschlagewerk.',
  // Am Volltext geprüft am 05.11.2026 (Fedlex-Filestore, geltende Fassung über den SPARQL-Endpunkt): BV Stand 3.3.2024, BPR 23.10.2022, ParlG 2.3.2026, ASG 1.1.2018, USG und VVEA 1.8.2026, RVOG 1.5.2025; Sitzverordnungen vom 1.9.2021 und 27.8.2025.
  gesetze: 'BV Art. 3, 42, 50, 60, 62, 69, 99, 112, 136, 139 bis 142, 147 bis 150, 156, 157, 159, 160, 163, 165, 168, 174 bis 177, 181, 188, 190; BPR Art. 2, 16, 17, 40, 41, 47; ParlG Art. 89, 91, 93; RVOG Art. 12; USG Art. 31b; VVEA Art. 3; ASG Art. 3, 11, 19.',
  eigeneRechnungen: [
    'Sitze: beide Verordnungen, je Summe 200 im Bau geprüft. Die 23 Standesstimmen sind gerechnet (20 ganze und 6 halbe); dass 11,5 zu 11,5 nicht reicht, folgt aus dem Wort «Mehrheit» in BV Art. 142 und ist nicht ausdrücklich geregelt.',
    'Die Bilder sind Standbilder aus der Erklärfigur «Kugelbahn» von Stebler Studios. Die Kugel und ihre Fälle sind dort Beispiele, keine echten Abstimmungen.',
  ],
};
