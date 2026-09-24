// Prämienverbilligung (IPV) Kanton Luzern — amtliches Richtprämien-Modell, Jahr 2026 (K31).
// Sechster Kanton mit eigenem Modell, zweiter auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 23.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt LU:
//   [1] Prämienverbilligungsverordnung (SRL 866a), Version in Kraft seit 01.01.2026
//       (Beschlussdatum 04.11.2025), keine künftige Version erfasst.
//       § 2 Abs. 1: Prozentsatz · § 2a: Kinder 80 % bis zur Einkommensgrenze · § 2b: § 2a wird
//       von § 2 abgezogen · § 3 Abs. 1: Richtprämien · § 3b: Pauschalbetrag 9000 je Kind ·
//       § 7: unter Fr. 100 keine Auszahlung.
//   [2] Prämienverbilligungsgesetz (SRL 866), Version in Kraft seit 01.07.2021.
//       § 5 Abs. 2/3: Gesamtanspruch, Stichtag 1. November · § 7 Abs. 2: massgebendes Einkommen ·
//       § 7 Abs. 2ter: Vermögensgrenze · § 7 Abs. 7: höchstens die geschuldeten Prämien ·
//       § 12 Abs. 2/3: Anmeldung bis Ende Oktober des Vorjahres.
//       § 8a Abs. 1/2: Anpassung bei wesentlich geänderten Verhältnissen seit 1. November;
//       Gesuch um Erhöhung spätestens am letzten Tag des Jahres · § 21 Abs. 1: Rückforderung beim
//       Krankenversicherer (Beleg für premium.vorbehaltLU, nachgetragen 24.09.2026, K120).
//   [3] WAS Ausgleichskasse Luzern, «Richtprämien 2026 … / Prämienregionen 2026» (November 2025):
//       Altersgrenzen nach Jahrgang und die Gemeindeliste der drei Regionen.
//   [4] WAS Ausgleichskasse Luzern, «Berechnungsbeispiel Prämienverbilligung / Anspruch
//       Prämienverbilligung 2026». 🛑 Die ZAHLEN dieses Beispiels stehen im PDF nur als Bild
//       (kein Textlayer), gelesen am Seitenbild. Sie sind hier nicht Grundlage der Formel —
//       die steht wörtlich in [1] und [2] —, sondern der Prüfstein der Tests.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie einen Prozentsatz des massgebenden
// Einkommens übersteigt — und dieser Prozentsatz STEIGT mit dem Einkommen (10 % plus
// 0,00006 Prozentpunkte je Franken). Wie in SG ist der Abbau darum quadratisch, nicht linear.
//
// DREI DINGE, DIE LUZERN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. DER KINDERANTEIL LÄUFT NEBEN DER RECHNUNG, NICHT DARIN. Bis zur Einkommensgrenze erhält
//    jedes Kind 80 % seiner Richtprämie fest (§ 2a [1]), und nach § 2b [1] wird das vom
//    allgemeinen Anspruch abgezogen. Im amtlichen Beispiel [4] zählt das Kind darum in den
//    «anrechenbaren Prämien» nur mit den restlichen 20 % (2 × 5100 + 2 × 0,2 × 1176 =
//    10'670.40), und der feste Anteil kommt obendrauf. Rechnerisch ist das dasselbe wie
//    max(Kinderanteil, Summe Richtprämien − Eigenanteil) — aber die AUFTEILUNG auf die
//    Personen folgt dem Beispiel, und an der Aufteilung hängt der Deckel der erwachsenen Person.
//
// 2. DIE EINKOMMENSGRENZE FÜR KINDER wird am massgebenden Einkommen NACH dem Pauschalbetrag
//    von 9000 je Kind gemessen (§ 2a Abs. 1 [1] verweist auf «§ 7 Absätze 2–6», und dort steht
//    der Abzug). Das Beispiel [4] tut genau das (53'500 nach Abzug, gegen 96'392). Anders als
//    in SG, wo Art. 6 den Kinderabzug ausdrücklich ausnimmt.
//
// 3. KEINE FESTE STEUERPERIODE. Massgebend ist «die letzte rechtskräftige Steuerveranlagung»
//    (§ 7 Abs. 4 [2]), nicht «das vorletzte Jahr». Das Beispiel [4] rechnet 2026 mit der
//    Veranlagung 2024, das ist aber ein Beispiel und keine Regel. Darum nennt der Vorbehalt
//    kein Jahr (anders als BE, SG und AG).
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Paare und mehrere Erwachsene — das zweite Einkommen fehlt der App (§ 5 Abs. 2 [2]:
//     gemeinsam Besteuerte haben einen Gesamtanspruch).
//   · junge Erwachsene 19–25: ihr Anteil von 50 % hängt an einer Ausbildung mit Anspruch auf
//     Ausbildungszulage (§ 2a Abs. 2 [1]), die die App nicht erfasst.
//   · Quellenbesteuerte (§ 8 Abs. 1 [2]: 75 % des Quellensteuer-Einkommens), EL- und
//     Sozialhilfebeziehende (§ 8 Abs. 2/3 [2], volle Richtprämie).
//   · vom massgebenden Einkommen (§ 7 Abs. 2 [2]): BVG-Einkäufe über 20'000 (lit. a mit § 3a
//     [1]), Geschäftsverluste (lit. c), vereinfachtes Verfahren (lit. d), Liegenschaftsunterhalt
//     über 20 % (lit. dbis) — die App erfasst diese Posten nicht; jede Auslassung SENKT das
//     massgebende Einkommen und erhöht den Betrag. Umgekehrt fehlt der Abzug der krankheits-,
//     unfall- und behinderungsbedingten Kosten; das HEBT das Einkommen und senkt den Betrag.
//   · die monatliche Auszahlung ab einem späteren Monat nach § 12 Abs. 3 [2] — der Betrag hier
//     ist der Jahresanspruch; die Frist steht im Hinweis daneben.
import {
  vermoegenSumme, einkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';

// Werte 2026, wörtlich aus [1] und [2]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_LU = {
  jahr: 2026,
  // § 3 Abs. 1 [1]. e = Erwachsene, j = junge Erwachsene, k = Kinder.
  richtpraemie: {
    1: { e: 5628, j: 4044, k: 1308 },
    2: { e: 5304, j: 3780, k: 1224 },
    3: { e: 5100, j: 3660, k: 1176 },
  },
  // § 2 Abs. 1 [1]: «mindestens 10 Prozent. Für jeden Franken des massgebenden Einkommens
  // steigt er um 0,00006 Prozentpunkte an.» — beide in PROZENTPUNKTEN.
  satz: { fix: 10, jeFranken: 0.00006 },
  // § 2a Abs. 1 [1]: «um 80 Prozent» bis zur Einkommensgrenze.
  kinderanteil: 0.8,
  // § 2a Abs. 1 lit. a/b [1].
  kinderGrenze: { eltern: 96392, elternteil: 77114 },
  // § 3b [1] i. V. m. § 7 Abs. 2 [2]: «Davon abzuziehen sind … ein Pauschalbetrag … pro Kind».
  pauschalbetragKind: 9000,
  // § 7 Abs. 2 lit. e [2]: «10 Prozent des Reinvermögens».
  vermoegenAnteil: 0.10,
  // § 7 Abs. 2ter [2]: «Übersteigt das Reinvermögen … bei Alleinstehenden 100 000 Franken,
  // besteht kein Anspruch … erhöht sich diese Vermögensgrenze um 50 000 Franken pro Kind».
  vermoegen: { alleinstehend: 100000, verheiratet: 200000, jeKind: 50000 },
  // § 7 [1]: «Liegt der gesamte Anspruch … unter 100 Franken, wird der Betrag nicht ausbezahlt.»
  mindestbetrag: 100,
};

// [3] listet die Gemeinden der Regionen 1 und 2 und «übrige Gemeinden» für Region 3. Die
// BAG-Daten der App wurden am 23.09.2026 gegen diese Liste VOLLSTÄNDIG abgeglichen: 79
// Luzerner Gemeinden, 0 Abweichungen, alle 24 namentlich genannten gefunden (Gegenprobe mit
// einem erfundenen Gemeindenamen: nicht gefunden). Der Test hält den Abgleich fest.
export function luRegion(bfsNr) {
  return getRegion(bfsNr);
}

// Der Prozentsatz in PROZENTPUNKTEN. § 2 Abs. 1 [1].
export function luProzentsatz(me) {
  return IPV_LU.satz.fix + IPV_LU.satz.jeFranken * Math.max(0, me);
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen das amtliche Beispiel prüfen
// können. `erwachsene` ist nur für diesen Test da (das Beispiel ist ein Ehepaar); die App ruft
// die Rechnung immer mit einer erwachsenen Person auf.
//
// Liefert Jahresbeträge in CHF, ungerundet. `unklar` heisst: das Ergebnis hängt an einer Stelle,
// die die Quellen nicht entscheiden (siehe unten) — dann rechnet die App bewusst nicht.
export function ipvLuzernRechnen({ region, kinderZahl = 0, me, erwachsene = 1 }) {
  const p = IPV_LU;
  const r = p.richtpraemie[region];
  // me nie negativ: sonst wüchse der Anspruch über die Summe der Richtprämien hinaus, was
  // § 2 Abs. 1 [1] («soweit die anrechenbaren Prämien … übersteigen») nicht zulässt.
  const me0 = Math.max(0, me);
  const prozent = luProzentsatz(me0);
  const eigenanteil = (prozent / 100) * me0;

  // § 2a Abs. 1 [1]: der feste Kinderanteil, nur bis zur Einkommensgrenze.
  const grenze = erwachsene >= 2 ? p.kinderGrenze.eltern : p.kinderGrenze.elternteil;
  const kinderanteilGilt = kinderZahl > 0 && me0 <= grenze;
  const festJeKind = kinderanteilGilt ? p.kinderanteil * r.k : 0;

  // § 2b [1]: der Kinderanteil wird vom allgemeinen Anspruch abgezogen — im Beispiel [4]
  // dadurch, dass das Kind in den anrechenbaren Prämien nur mit dem Rest zählt.
  const anrechenbarKind = r.k - festJeKind;
  const anrechenbar = erwachsene * r.e + kinderZahl * anrechenbarKind;
  const allgemein = Math.max(0, anrechenbar - eigenanteil);

  // Aufteilung nach [4], Seite 2: «anteilsmässig (im Verhältnis der Richtprämie) … Bei Kindern
  // wird zudem 80 % … der Richtprämie hinzugerechnet.» Gewichtet wird dabei mit den
  // ANRECHENBAREN Prämien (Kind 20 %), nicht mit der vollen Richtprämie — nur so ergeben sich
  // die Monatsbeträge des Beispiels (143.55 und 85.05); mit voller Gewichtung wären es 122.–.
  const anteilErwachsen = anrechenbar > 0 ? (allgemein * r.e) / anrechenbar : 0;
  const anteilKind = (anrechenbar > 0 ? (allgemein * anrechenbarKind) / anrechenbar : 0) + festJeKind;
  const total = erwachsene * anteilErwachsen + kinderZahl * anteilKind;

  // 🛑 Die eine offene Stelle: ÜBER der Kinder-Grenze sagt keine Quelle, ob das Kind in den
  // anrechenbaren Prämien mit 100 % oder weiter mit 20 % zählt ([4] zeigt nur einen Fall unter
  // der Grenze). Folgen hat das nur, wenn dort überhaupt ein allgemeiner Anspruch bleibt — bei
  // einer erwachsenen Person erst ab fünf Kindern. Dann lieber keine Zahl.
  const unklar = kinderZahl > 0 && !kinderanteilGilt && allgemein > 0;

  return {
    total, anteilErwachsen, anteilKind, prozent, eigenanteil, anrechenbar, allgemein,
    kinderanteilGilt, unklar,
    // Vergleichsgrösse «höchstens möglich»: dieselbe Rechnung bei massgebendem Einkommen 0.
    maximal: erwachsene * r.e + kinderZahl * r.k,
    // Zwei verschiedene Gründe für «kein Betrag», wie in SG: über der Grenze rechnet die
    // Formel null; knapp darunter besteht ein Anspruch, er wird nach § 7 [1] nur nicht
    // ausbezahlt («gesamte Anspruch» — anders als SG also auf der Summe, nicht je Person).
    grund: total >= p.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// «Ungerade Beträge runden wir auf» ([4], Fussnote 3). Auf welche Einheit, sagt der Satz nicht;
// die Zahlen des Beispiels ergeben sich, wenn der MONATSBETRAG je Person auf 5 Rappen
// aufgerundet wird (1'722.12 / 12 = 143.51 → 143.55; 1'020.22 / 12 = 85.02 → 85.05).
// Abgeleitet, nicht zitiert — darum als Frage an die WAS notiert.
export function monatlichAufgerundet(jahresbetrag) {
  if (!(jahresbetrag > 0)) return 0;
  return Math.ceil((jahresbetrag / 12) * 20 - 1e-9) / 20;
}

// Aufruf aus calculateIPV (config/cantonalData.js) für LU mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`.
export function ipvLuzern(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_LU.jahr;
  // Die Faktoren 2027 legt der Regierungsrat laut WAS erst Mitte November 2026 fest. Ab dem
  // 01.01. des Folgejahres lieber keine Zahl als eine aus veralteten Sätzen.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Alter nach Jahrgang: [3] führt 2026 «Erwachsene (ab Jahrgang 2000)», «junge Erwachsene
  // (Jahrgang 2001-2007)», «Kinder (Jahrgang 2008-2026)». Erwachsen ist also, wer im
  // Anspruchsjahr 26 wird — dieselbe Regel wie AG, hier aber mit einer amtlichen Tabelle
  // für GENAU dieses Anspruchsjahr belegt.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: Jahrgang 2008–2026, also höchstens 18 im Anspruchsjahr — darum das Alter im
  // Anspruchsjahr, beim eingetippten Alter ein Jahr dazu (wie BE und SG, vorsichtig an der 18).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const { region } = regionAusPLZ({ data, kanton: 'LU', lookupPLZ, regionFn: luRegion });
  if (!region) return orientierung('region');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // § 7 Abs. 2ter [2]: kein Anspruch über der Grenze. Die App kennt nur die erfassten Posten,
  // nicht das Reinvermögen — darum Orientierung statt «kein Anspruch».
  if (vermoegen > IPV_LU.vermoegen.alleinstehend + IPV_LU.vermoegen.jeKind * kinderZahl) {
    return orientierung('vermoegen');
  }

  // § 7 Abs. 2 [2]: Nettoeinkommen + Säule 3a (lit. b, unbedingt) + 10 % des Reinvermögens
  // (lit. e) − 9000 je Kind. Die 3a steckt im Nettoeinkommen der App schon (Regel `voll`).
  const me = Math.max(0,
    einkommenJahr(f, SAEULE_3A.voll)
    + IPV_LU.vermoegenAnteil * vermoegen
    - IPV_LU.pauschalbetragKind * kinderZahl);

  const r = ipvLuzernRechnen({ region, kinderZahl, me });
  if (r.unklar) return orientierung('mindestanspruch');

  // § 7 Abs. 7 [2]: «Die Prämienverbilligung darf die im Kalenderjahr geschuldeten Prämien
  // … nicht übersteigen.» Die App kennt nur die Prämie der erwachsenen Person — also wird nur
  // deren Anteil gedeckelt, der Kinderanteil bleibt ungedeckelt (wie ZH, BE, VD:
  // `deckelnProPerson`). ⚠️ Liegt die Prämie eines Kindes unter seinem Anteil (höchstens die
  // Richtprämie, 1'176–1'308 im Jahr), fällt der Betrag hier um die Differenz zu hoch aus.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  // Rundung wie ausbezahlt: Monatsbetrag je Person auf 5 Rappen aufgerundet, dann × 12.
  // Der Deckel greift NACH der Rundung, damit er nicht um Rappen überschritten wird.
  const erwachsenJahr = Math.min(monatlichAufgerundet(r.anteilErwachsen) * 12, praemie);
  const kinderJahr = kinderZahl * monatlichAufgerundet(r.anteilKind) * 12;
  const annual = r.grund ? 0 : Math.round(erwachsenJahr + kinderJahr);
  const maxAnnual = Math.round(Math.min(IPV_LU.richtpraemie[region].e, praemie)
    + kinderZahl * IPV_LU.richtpraemie[region].k);

  // Keine publizierte Einkommensgrenze für Erwachsene — sie ergäbe sich nur aus der Formel.
  // Die Kinder-Grenze (77'114) ist amtlich, betrifft aber nur den Kinderanteil; sie als
  // «Einkommensgrenze» anzuzeigen, wäre für Alleinstehende ohne Kinder falsch.
  const cantonData = { ...ipvData, maxIncome: null };
  const gemeinsam = {
    canton: 'LU', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltLU', extra: { region },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.luUnterMindestbetrag' : 'ipv.luKeinAnspruch',
    });
  }
  // § 12 Abs. 2/3 [2]: Anmeldung bis Ende Oktober des Vorjahres; wer später kommt, erhält nur
  // die Prämien verbilligt, die nach dem Gesuch fällig werden. Für 2026 war das der 31.10.2025.
  const fristVorbei = new Date() > new Date(`${jahr - 1}-10-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: fristVorbei ? 'ipv.luFristVorbei' : 'ipv.luFristLaeuft',
    noteParams: { jahr, vorjahr: jahr - 1, folgejahr: jahr + 1 },
  });
}
