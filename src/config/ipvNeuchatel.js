// Prämienverbilligung (IPV) Kanton Neuenburg — Klassen S1–S15, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js); Bauart einer Stufentabelle wie BE.
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt NE:
//   [1] Arrêté fixant les normes de classification et le montant des subsides en matière
//       d'assurance-maladie obligatoire des soins pour l'année 2026 (RSN 821.102), du 12 novembre
//       2025, «État au 1er janvier 2026», FO 2025 No 47 (PDF rsn.ne.ch, erzeugt 06.01.2026).
//       Art. 1 (Steuerveranlagung 2025) · Art. 3 (Grenzen nach Kinderzahl, «égal ou inférieur») ·
//       Art. 5 (Kind «0 à 18 ans (fin de l'année civile des 18 ans)») · Art. 5 al. 2 (Kind in der
//       Klasse der Eltern) · Art. 6/7 (Altersgrenzen nach Kalenderjahr) · Art. 9 (Person allein) ·
//       Art. 10 (Paar, Konkubinat) · Art. 11 al. 1 (Monatsbeträge je Klasse) · Art. 11 al. 2
//       (Kürzung bei Wahlfranchise) · Art. 12 (revenu déterminant) · Art. 16 (vermutete
//       Nichtberechtigung unter 15'000) · Art. 21 (Rückforderung ab 20 %) · Annexe (Grenzen).
//   [2] Décret instituant des subsides extraordinaires en matière d'assurance-maladie
//       obligatoire des soins pour l'année 2026 (RSN 821.104), du 2 décembre 2025 (Grand Conseil),
//       «État au 15 janvier 2026», FO 2025 No 50, in Kraft 15.01.2026, «caduc … le 31 décembre
//       2027». Art. 3 (erhöht die Beträge von Art. 11 [1], höchstens die Prämie) · Art. 4 al. 1
//       (Zuschläge je Klasse — Tabelle im PDF am Seitenbild gelesen) · Art. 4 al. 2 (Kürzung bei
//       Wahlfranchise) · Art. 6 (ohne eigenes Gesuch, einfach dazugezählt).
//   [3] OCAB, «Normes de classification valables en 2026», publiziert 11.12.2025, Réf. OCAB25-006:
//       Tabelle «Arrêté du 12.11.2025 (CE) + Décret du 02.12.2025 (GC)» (= [1] + [2], Zeile für
//       Zeile nachgerechnet), Grenzen (= Annexe [1]), Rechenbeispiel Wahlfranchise, Verfahren.
//   [4] LILAMal (RSN 821.10), «Etat au 1er janvier 2026» — Art. 14 al. 3 (Kürzung wie beim
//       Versicherer), Art. 14 al. 4 («Le montant du subside ne peut être supérieur à la prime
//       exigée par l'assureur»).
//   [5] RALILAMal (RSN 821.101), «État au 1er janvier 2026» — Art. 31 (automatisch bzw.
//       Antwortschein innert 30 Tagen), Art. 36 (vermutete Nichtberechtigung, Revision beim GSR).
//   [6] LAMal (SR 832.10), Fassung 01.07.2026 (Fedlex) — Art. 62 al. 2 lit. a: Wahlfranchise.
//   [7] ne.ch, «Subsides assurance-maladie (LAMal) 2026 : Classifications et montants»
//       (geändert 08.09.2026) — dieselben Beträge wie [3].
//
// 🛑 DER WIDERSPRUCH VOM 16.09.2026 IST AUFGELÖST — nicht durch eine Antwort, sondern durch eine
// zweite Rechtsgrundlage (in der Fachprüfung vom 28.09.2026 bestätigt). Die Kantonsseite [7] nannte ab S3 höhere Beträge als [1] (Erwachsene S3
// 515 statt 514, S15 41 statt 26). Der Unterschied ist genau der ausserordentliche Subside des
// Grossen Rates [2]; das OCAB-Blatt [3] überschreibt seine Tabelle ausdrücklich mit «Arrêté …
// + Décret …». Die App rechnet darum [1] + [2]. Wer nur [1] rechnete, läge ab S3 bis CHF 15 im
// Monat ZU TIEF — und das ist nicht die vorsichtige Seite (Block bei `einkommenJahr`).
//
// PRÜFSTEIN
// Ein amtliches Rechenbeispiel einer Einstufung gibt es nicht (das einzige Beispiel in [3] zeigt
// die Kürzung bei Wahlfranchise, die hier bewusst nicht gerechnet wird). Geprüft wird darum jede
// Zahl über ZWEI unabhängige amtliche Wege: Beträge [1] + [2] = Tabelle [3] = Seite [7], für alle
// 15 Klassen; Grenzen Annexe [1] = [3] für alle elf Zeilen (0–10 Kinder) maschinell verglichen.
//
// DAS MODELL IN EINEM SATZ
// Das revenu déterminant (revenu effectif der Veranlagung 2025 plus 30 % des Vermögens über einem
// Freibetrag) bestimmt je nach Kinderzahl eine von 15 Klassen, und jede Klasse hat einen festen
// Monats-Höchstbetrag je Alterskategorie — höchstens die Prämie.
//
// WAS NEUENBURG VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. KLASSEN SIND SCHMAL: 1'140 Franken für eine Person allein (S1–S9). Ein Abzug, den die App nicht
//    kennt, verschiebt die Klasse schnell um mehrere Stufen (siehe «Bewusst nicht gebaut»).
// 2. KEINE PRÄMIENREGION: ein kantonsweiter Betrag je Klasse ([1] Art. 11, eine Referenzprämie).
// 3. ZWEI TÖPFE, EINE ZAHL: ordentlicher Betrag [1] + ausserordentlicher [2], ohne eigenes Gesuch.
// 4. DIE WAHLFRANCHISE KÜRZT DEN BETRAG «du même taux que le rabais accordé par l'assureur» ([3],
//    [1] Art. 11 al. 2, [2] Art. 4 al. 2). Den Rabatt kennt die App nicht — darum rechnet sie nur
//    bei der ordentlichen Franchise von 300 Franken (auf die die Beträge lauten).
// 5. UNTER 15'000 KEIN AUTOMATISMUS: wer ein revenu effectif unter 15'000 (+3'000 je Kind) hat,
//    gilt als nicht berechtigt, ausser auf Gesuch beim Guichet social régional ([1] Art. 16).
//
// BEWUSST NICHT GEBAUT
//   · Paare, Konkubinat (eigene Tabelle, [1] Art. 10) — das zweite Einkommen fehlt der App.
//   · junge Erwachsene 19–25 und Personen in Ausbildung ([1] Art. 6–8, 15): Ausbildungsstatus fehlt.
//   · PC-AVS/AI- und Sozialhilfe-Beziehende (eigene Beträge 687/590), Quellenbesteuerte, amtlich
//     Veranlagte.
//   · Selbständige und Freiberufliche: «perçoivent un subside chaque année sur demande», Gesuch
//     beim GSR innert 12 Monaten ([5] Art. 30 al. 1/3) — Orientierung `neIndependant`, keine Zahl
//     mit dem Weg «automatisch». ⟨Fachprüfung 28.09.2026, Blocker 2: stand hier als «nicht gebaut»,
//     der Riegel fehlte aber — Selbständige bekamen eine Zahl.⟩
//   · Personen unter 26 (junge Erwachsene, eigene Tabelle; Ledige 19–25 ohne Kind nur auf Gesuch,
//     [1] Art. 16 al. 1, [3] Fall B) — Orientierung `neJeuneAdulte`.
//   · die Kürzung bei Wahlfranchise (Satz des Versicherers unbekannt) — dann keine Zahl.
//   · vom revenu déterminant [1] Art. 12: Berufsauslagen (6.4, bis 10'000), Nebenerwerbs-
//     auslagen (6.5, bis 2'400), AHV-Beiträge Nichterwerbstätiger (6.7) — die App kennt sie
//     nicht; das Einkommen liegt damit zu hoch, der Betrag eher zu tief. Mietertrag ebenso nicht.
//   · 🛑 DREI ERFASSTE FELDER FLIESSEN NOCH NICHT EIN (Fachprüfung 28.09.2026, Blocker 1):
//     `familienzulagen` und `alimenteReceived` gehören zum revenu effectif (Betrag hier dann ZU
//     HOCH), `alimentePaid` ist nach Ziff. 6.10 abziehbar (Betrag hier dann ZU TIEF). Der Fehler
//     sitzt im gemeinsamen `rohesEinkommenJahr` (kantonsModell.js) und betrifft alle Module; er
//     wird in einem eigenen Rahmen-PR für alle Kantone behoben. Bis dahin sagt es `vorbehaltNE`.
//   · Vermögen: `vermoegenSumme` = erfasste Posten OHNE Schulden. Ob Ziff. 6.16 der Steuererklärung
//     die Schulden schon abzieht, ist nicht gelesen — ANNAHME, dass die erfassten Posten der
//     fortune effective nahekommen.
//   · der Anspruchsbeginn (je nach Abgabe der Steuererklärung, [1] Art. 17) und die Rückforderung,
//     wenn die Abweichung 20 % «dépasse» ([1] Art. 21 al. 2) — beides steht im Vorbehalt.
//   · der Kinderanteil wird weder auf die Kinderprämie gedeckelt ([4] Art. 14 al. 4) noch bei
//     Wahlfranchise des Kindes gekürzt — die App kennt die Kinderprämien nicht; gerechnet wird
//     160 je Kind, der Vorbehalt sagt es.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

export const IPV_NE = {
  jahr: 2026,
  // [1] Art. 1: «sur la base des données disponibles résultant de leur taxation fiscale 2025».
  basisjahr: 2025,
  // [1] Art. 11 al. 1, Spalte «Adultes (dès 26 ans)», Klassen S1 … S15, CHF im Monat.
  erwachsene: [611, 579, 514, 450, 386, 322, 264, 206, 154, 96, 77, 64, 51, 39, 26],
  // [2] Art. 4 al. 1, Spalte «Adultes (dès 26 ans)», S1 … S15 (S1 und S2 leer = 0).
  erwachseneZuschlag: [0, 0, 1, 3, 4, 6, 8, 10, 12, 14, 14, 14, 15, 14, 15],
  // [1] Art. 11 al. 1, Spalte «Enfants (0 - 18 ans)»: 160 in allen Klassen S1–S15. [2] hat keine
  // Kinderspalte.
  kind: 160,
  // Annexe [1], «Limites de revenus déterminants pour un adulte seul avec et sans enfants»:
  // obere Grenze je Klasse, Index = Zahl der minderjährigen Kinder (0–10). Ohne Kind endet die
  // Skala bei S10.
  grenzen: [
    [22800, 23940, 25080, 26220, 27360, 28500, 29640, 30780, 31920, 50600],
    [33000, 34140, 35280, 36420, 37560, 38700, 39840, 40980, 42120, 44400, 45540, 56148, 57156, 58164, 65089],
    [40800, 41940, 43080, 44220, 45360, 46500, 47640, 48780, 49920, 52200, 53340, 60156, 62172, 64188, 72824],
    [46800, 47940, 49080, 50220, 51360, 52500, 53640, 54780, 55920, 58200, 59340, 64164, 67188, 70212, 80560],
    [51600, 52740, 53880, 55020, 56160, 57300, 58440, 59580, 60720, 63000, 64140, 68172, 72204, 76236, 88295],
    [54600, 55740, 56880, 58020, 59160, 60300, 61440, 62580, 63720, 66000, 67140, 72180, 77220, 82260, 96030],
    [57600, 58740, 59880, 61020, 62160, 63300, 64440, 65580, 66720, 69000, 70140, 76188, 82236, 88284, 103765],
    [60600, 61740, 62880, 64020, 65160, 66300, 67440, 68580, 69720, 72000, 73140, 80196, 87252, 94308, 111500],
    [63600, 64740, 65880, 67020, 68160, 69300, 70440, 71580, 72720, 75000, 76140, 84204, 92268, 100332, 119236],
    [66600, 67740, 68880, 70020, 71160, 72300, 73440, 74580, 75720, 78000, 79140, 88212, 97284, 106356, 126971],
    [69600, 70740, 71880, 73020, 74160, 75300, 76440, 77580, 78720, 81000, 82140, 92220, 102300, 112380, 134706],
  ],
  // [1] Art. 12 al. 1 lit. b: «du trente pourcent de la fortune effective … après déduction de
  // 4'000 francs pour une personne seule … et 2'000 francs par enfant mineur à charge, mais, par
  // UER, au maximum 10'000 francs».
  vermoegen: { anteil: 0.3, abzugAllein: 4000, abzugKind: 2000, abzugHoechstens: 10000 },
  // [1] Art. 16 al. 1/3: revenu effectif «inférieur à 15'000 francs pour une personne seule»,
  // «augmentée de 3'000 francs par enfant mineur à charge».
  revenuMinimum: { allein: 15000, jeKind: 3000 },
  // 🛑 GEWÄHLT, nicht belegt (Fachprüfung 28.09.2026, Wichtig 3): Art. 16 misst am revenu
  // effectif NACH den Abzügen 6.4/6.5/6.7/6.10, die App vor ihnen. Wer knapp über der Schwelle
  // liegt, kann nach Berufsauslagen darunter fallen — dann stuft der Kanton nicht automatisch ein.
  // In einem Band von 2'000 Franken über der Schwelle steht darum ein Hinweis auf das Gesuch beim
  // GSR neben der Zahl. Die Breite ist geschätzt (typische Berufsauslagen bei diesen Einkommen),
  // nicht amtlich.
  revenuMinimumBand: 2000,
  // [1] Art. 11 al. 1: Beträge «pour la franchise annuelle au sens de l'article 103, alinéa 1 de
  // l'ordonnance sur l'assurance-maladie» — die ordentliche Franchise.
  franchiseOrdentlich: 300,
};

// Revenu déterminant [1] Art. 12 al. 1 aus einem revenu effectif und dem Vermögen.
export function neRevenuDeterminant({ revenuEffectif, vermoegen, kinderZahl }) {
  const v = IPV_NE.vermoegen;
  const abzug = Math.min(v.abzugHoechstens, v.abzugAllein + v.abzugKind * kinderZahl);
  return Math.max(0, revenuEffectif) + v.anteil * Math.max(0, Math.max(0, vermoegen) - abzug);
}

// Klasse 1–15 zu einem revenu déterminant, oder `null` über der letzten Grenze. Die Grenzen sind
// EINSCHLIESSLICH: [1] Art. 3 al. 1 «égal ou inférieur aux revenus figurant dans l'annexe». Die
// Seite [7] schreibt «jusqu'à 22'800» und dann «22'800 à 23'940» — die Nahtstelle selbst regelt
// sie nicht anders; die App folgt dem Wortlaut des Erlasses.
export function neKlasse(rd, kinderZahl) {
  const g = IPV_NE.grenzen[kinderZahl];
  if (!g) return null;
  const i = g.findIndex((bis) => Math.max(0, rd) <= bis);
  return i === -1 ? null : i + 1;
}

// Reine Rechnung. `kinderZahl` minderjährige Kinder, `rd` das revenu déterminant. Liefert
// Monats- und Jahresbeträge, getrennt nach erwachsener Person und Kindern (der Deckel wirkt
// nur auf die Prämie, die die App kennt), und die höchste Grenze des Haushalts.
export function ipvNeuchatelRechnen({ kinderZahl, rd }) {
  const p = IPV_NE;
  const grenze = p.grenzen[kinderZahl][p.grenzen[kinderZahl].length - 1];
  const klasse = neKlasse(rd, kinderZahl);
  const betragErwachsen = (k) => p.erwachsene[k - 1] + p.erwachseneZuschlag[k - 1];
  const maximalMonat = betragErwachsen(1) + kinderZahl * p.kind;
  if (klasse === null) {
    return { klasse, monat: 0, annual: 0, erwachseneAnnual: 0, maximal: maximalMonat * 12, erwachseneMaximal: betragErwachsen(1) * 12, grenze };
  }
  const erwachsenMonat = betragErwachsen(klasse);
  const monat = erwachsenMonat + kinderZahl * p.kind;
  return {
    klasse, monat, annual: monat * 12, erwachseneAnnual: erwachsenMonat * 12,
    maximal: maximalMonat * 12, erwachseneMaximal: betragErwachsen(1) * 12, grenze,
  };
}

// «300», «f300» oder 300 — die Franchise-Optionen der App (i18n chapters.versicherungen).
function franchiseBetrag(v) {
  const n = Number(String(v ?? '').replace(/^f/, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Aufruf aus calculateIPV (config/cantonalData.js, Register IPV_MODULE, brauchtPLZ: false).
export function ipvNeuchatel(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_NE.jahr;
  // Die Klassen und Beträge setzt der Staatsrat jedes Jahr neu fest ([5] Art. 27), der Décret
  // [2] gilt nur für 2026. Werte 2027 am 28.09.2026 nicht publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // Paare und Konkubinat ([1] Art. 10 mit LHaCoPS art. 3 al. 1 lit. d) haben eigene Grenzen.
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [5] Art. 30 al. 1/3: Selbständige «perçoivent un subside chaque année sur demande» — jedes Jahr
  // ein Gesuch beim GSR innert 12 Monaten, kein Automatismus (OCAB [3], S. 4). Eine Zahl mit dem
  // Weg «automatisch» wäre hier falsch. `employmentType` wie im Kapitel Finanzen.
  if (f.employmentType === 'selfEmployed' || f.employmentType === 'freelance') return orientierung('neIndependant');
  // Erwachsen «dès le début de l'année civile des 26 ans» ([1] Art. 7 al. 1; Art. 6 al. 1:
  // jeune adulte bis «fin de l'année civile des 25 ans»). BELEGT — dieselbe Regel wie AG/LU.
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  // Unter 26 mit erfasstem Geburtsdatum fehlt keine Angabe — es gilt eine andere Tabelle (junge
  // Erwachsene), und Ledige 19–25 ohne Kind erhalten nur auf Gesuch ([1] Art. 16 al. 1, [3] Fall B).
  // Eigener Grund statt «Geburtsdatum fehlt» (Fachprüfung 28.09.2026, Kann 4).
  if (!ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung(jahr - geburt >= 19 ? 'neJeuneAdulte' : 'alter');
  // Kind «0 à 18 ans (fin de l'année civile des 18 ans)» ([1] Art. 5 al. 1) — also das Alter im
  // Anspruchsjahr; beim eingetippten Alter ein Jahr dazu (vorsichtig an der 18, wie BE/LU/VD).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;
  // Die Annexe führt 0–10 Kinder.
  if (!IPV_NE.grenzen[kinderZahl]) return orientierung('haushalt');

  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');
  // revenu effectif [1] Art. 12 al. 1 lit. a: «sous seules déductions» von 6.4, 6.5, 6.7, 6.10 —
  // die Säule 3a gehört NICHT dazu, bleibt also im Einkommen. Das Nettoeinkommen der App hat sie
  // nie abgezogen ⇒ Regel `voll` (im Rahmen benannt), nichts ein zweites Mal addieren.
  const revenuEffectif = einkommenJahr(f, SAEULE_3A.voll);
  // [1] Art. 16: unter 15'000 (+3'000 je Kind) gilt man als nicht berechtigt — ausser auf Gesuch
  // beim GSR, das auch zu einer Einstufung führen kann. Keine Zahl, sondern der Weg.
  if (revenuEffectif < IPV_NE.revenuMinimum.allein + IPV_NE.revenuMinimum.jeKind * kinderZahl) {
    return orientierung('neRevenuMinimum');
  }
  // [1] Art. 11 al. 2 / [2] Art. 4 al. 2: Kürzung «dans la même mesure que les réductions
  // accordées par les assureurs» bei Wahlfranchise (LAMal Art. 62 al. 2 lit. a). Den Rabatt des
  // Versicherers kennt die App nicht; ohne erfasste Franchise weiss sie nicht einmal, ob er gilt.
  if (franchiseBetrag(data.versicherungen?.franchise) !== IPV_NE.franchiseOrdentlich) return orientierung('neFranchise');
  // [4] Art. 14 al. 4 und [2] Art. 3 al. 2 / Art. 6 al. 1: höchstens die Prämie.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  // Keine Vermögensgrenze — das Vermögen geht nur zu 30 % ins revenu déterminant ein.
  const schwelle = IPV_NE.revenuMinimum.allein + IPV_NE.revenuMinimum.jeKind * kinderZahl;
  const nahSchwelle = revenuEffectif < schwelle + IPV_NE.revenuMinimumBand;
  const rd = neRevenuDeterminant({ revenuEffectif, vermoegen: vermoegenSumme(f), kinderZahl });
  const r = ipvNeuchatelRechnen({ kinderZahl, rd });
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);
  // Die oberste Grenze steht als Zahl in der Annexe [1] — sie darf angezeigt werden.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'NE', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltNE',
    // Keine Prämienregion: eigener Satz statt des Aargauer `jahrOhneRegion`.
    extra: {
      basisjahr: IPV_NE.basisjahr, jahrKey: 'ipv.jahrNE', klasse: r.klasse,
      // Im Band kommt die Einstufung womöglich nicht automatisch ([1] Art. 16). Dann zieht
      // data/ipvAbzug.js nichts ab (Budget, KK-Last-Karte, Prämienbeleg), und die Leser nennen den
      // Grund — Muster wie die Anmeldefrist in LU/FR (Re-Review 28.09.2026).
      ...(nahSchwelle ? {
        zusatzVorbehaltKey: 'ipv.neRevenuMinimumNahe',
        gesuchNoetig: true, gesuchNichtAbgezogenKey: 'ipv.neGesuchNichtAbgezogen',
      } : {}),
    },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.neKeinAnspruch', noteParams: { value: r.grenze } });
  }
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
  });
}
