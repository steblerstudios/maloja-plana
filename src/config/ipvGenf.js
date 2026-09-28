// Prämienverbilligung (IPV) Kanton Genf — «subsides d'assurance-maladie», Jahr 2026 (K31).
// Sechster Kanton auf dem gemeinsamen Rahmen (config/kantonsModell.js), Bauart wie BE: eine
// amtliche Gruppentabelle mit festen Monatsbeträgen, nicht eine Formel.
//
// Belege (an der Quelle gelesen 28.09.2026, jeder Abruf mit Gegenprobe — erfundene Nummer liefert
// 404 bzw. eine andere Datei), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt GE:
//   [1] «BAREME SUBSIDES 2026», République et canton de Genève, Département de la cohésion sociale,
//       Dokumentseite «Barèmes et catégories 2026 pour les subsides d'assurance-maladie»
//       (Date de publication 21 avril 2026; PDF-Metadaten: erstellt 11.02.2026). Eine Seite, Textlayer
//       vorhanden — die Zahlen sind maschinell gelesen, nicht vom Bild. Enthält je Haushaltsform
//       ALLE Gruppengrenzen und die Haushaltssummen: das ist der Prüfstein der Tests.
//   [2] Loi d'application de la loi fédérale sur l'assurance-maladie (LaLAMal), rsGE J 3 05,
//       «Dernières modifications au 2 novembre 2024». Art. 20 (ayants droit, Vermutungen),
//       Art. 21 (Gruppengrenzen, +6'000 je Unterhaltspflicht, Gruppe 9), Art. 22 (Beträge — die
//       Gesetzesbeträge Stand Dezember 2024, seither indexiert; Abs. 4 Deckel auf die effektive
//       Prämie), Art. 23 (Verfahren: Liste der Steuerverwaltung, «dernière taxation», Anspruch für das
//       kommende Kalenderjahr), Art. 33 (Rückerstattung zu Unrecht bezogener Subsidien).
//   [3] Règlement d'exécution (RaLAMal), rsGE J 3 05.01, «Dernières modifications au 1er janvier
//       2025». Art. 9 (RDU der Ehegatten, eingetragenen Partner und Konkubinatspaare mit
//       gemeinsamem Kind werden addiert), Art. 9A (negativer RDU = 0), Art. 9B (jährliche
//       Indexierung durch Arrêté, aufgerundet auf den Franken), Art. 10 (Vermutung «nicht bescheiden»:
//       Bruttovermögen > 250'000, Bruttoeinkommen > 200'000, RDU unter 15'000/20'000 +3'000 je
//       Unterhaltspflicht; Abs. 8 Stichtag 1. Januar für das Alter), Art. 10A (Antragsfälle: vor dem
//       30. November des Anspruchsjahres, danach kein Eintreten), Art. 11D (letzte Veranlagung).
//   [4] Loi sur le revenu déterminant unifié (LRDU), rsGE J 4 06, «Dernières modifications au
//       1er janvier 2025». Art. 4 (Einkünfte), Art. 5 (Abzüge), Art. 6/7 (Vermögen, Schulden),
//       Art. 8 Abs. 2 (Sockel = Einkommen + 1/15 des Vermögens), Art. 9 Abs. 1 (aus der letzten
//       definitiven Veranlagung), Art. 10 (Aktualisierung bei veränderter Lage).
//   [5] Loi sur l'imposition des personnes physiques (LIPP), rsGE D 3 08, Stand 01.01.2026,
//       Art. 31 — nur für die Frage, ob die Säule 3a im RDU abziehbar ist (siehe unten).
//   [6] ge.ch, «Demander un subside d'assurance-maladie 2026» (SAM), Stand 9. Juli 2026: «en principe
//       accordé automatiquement sur la base du revenu d'il y a deux ans»; Liste der Antragsfälle.
//
// DAS MODELL IN EINEM SATZ
// Der Kanton ordnet den Haushalt nach seinem RDU (revenu déterminant unifié: Einkommen plus ein
// Fünfzehntel des Vermögens, aus der Veranlagung von vor zwei Jahren) einer von acht Gruppen zu
// und zahlt je erwachsene Person den festen Monatsbetrag dieser Gruppe, je Kind 132 Franken;
// über Gruppe 8 gibt es bis zu einer neunten Grenze nur noch den Kinderbeitrag (67 Franken).
//
// VIER DINGE, DIE GENF VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. KEINE PRÄMIENREGION, KEINE RICHTPRÄMIE. Die Beträge sind kantonsweit gleich [1]; die Prämie
//    geht nur als Deckel ein (Art. 22 Abs. 4 [2]). Darum `brauchtPLZ: false` im Register und ein
//    eigener Satz statt «Prämienregion» in der Anzeige (`ipv.jahrGE`).
//
// 2. DIE GRENZEN HÄNGEN AN DER HAUSHALTSFORM, NICHT NUR AN DER ZAHL DER PERSONEN. Art. 21 Abs. 1 [2]
//    kennt zwei Spalten («assuré seul» und «couple»), Abs. 2 hebt jede Grenze um 6'000 je
//    Unterhaltspflicht, und Abs. 4 stellt eine Person MIT Unterhaltspflicht einem Paar gleich. Eine
//    alleinerziehende Person mit einem Kind rechnet also mit den Paar-Grenzen plus 6'000 — das
//    Barème [1] bestätigt es Zelle für Zelle (Gruppe 1: 45'000 + 6'000 = 51'000).
//
// 3. GRUPPE 9 IST EINE GRUPPE NUR FÜR KINDER. Wer über der Grenze von Gruppe 8 liegt, erhält für
//    sich nichts mehr, für jedes minderjährige Kind aber noch 67 Franken im Monat, bis zu 151'000
//    (Paar oder Person mit EINER Unterhaltspflicht) plus 6'000 je weitere (Art. 21 Abs. 5, 7, 8 [2]).
//    Die Anzeige sagt das dazu (`ipv.geNurKinder`), sonst stünde da «CHF 67» ohne Grund.
//
// 4. DIE GESETZESBETRÄGE STEHEN NICHT IM GESETZ. Art. 22 [2] nennt 320 … 50 Franken (Stand Dezember
//    2024); Art. 9B [3] lässt sie jährlich per Arrêté indexieren und auf den Franken aufrunden. Die
//    Beträge 2026 (348 … 55) stehen im Barème [1]. Den Arrêté selbst haben wir nicht gefunden
//    (docs/sources/FRAGEN-AN-DIE-AEMTER.md, Frage 8). Gegenprobe, die wir haben: alle acht
//    Erwachsenenbeträge ergeben sich aus den Gesetzesbeträgen mit EINEM Faktor 1,0875, aufgerundet
//    (320 × 1,0875 = 348.00 · 270 × 1,0875 = 293.63 → 294 · … · 50 × 1,0875 = 54.38 → 55); der
//    Test hält das fest. Kinder und junge Erwachsene sind eigene Kategorien mit eigener
//    Durchschnittsprämie (Art. 22 Abs. 2/3 [2]) und folgen darum nicht diesem Faktor.
//
// SÄULE 3A — WARUM HIER DIE REGEL `voll` GILT, AUS EINEM ANDEREN GRUND ALS IN ZH/SG/LU
// Dort rechnet der Kanton die 3a dem Steuereinkommen wieder ZU. In Genf wird sie im RDU gar nicht
// erst ABGEZOGEN: LRDU Art. 5 Abs. 1 [4] nennt die Vorsorgeabzüge nach «article 31, lettre a, LIPP»
// (lit. a: AHV/IV/EO/ALV/UVG-Beiträge) und «article 31, lettre b, LIPP» (lit. c: berufliche
// Vorsorge) — nicht Art. 31 lit. c LIPP [5], die gebundene Selbstvorsorge. Das Nettoeinkommen der
// App trägt die 3a bereits (Block bei `einkommenJahr` in kantonsModell.js); für Genf ist das genau
// richtig, Abzug 0. Was der Netto-Näherung dagegen fehlt: Berufskosten (lit. d), Kinderbetreuung
// (lit. e), Unterhaltsbeiträge (lit. f), Krankheitskosten über 5 % (lit. h) — jede dieser
// Auslassungen HEBT den RDU und drückt die Gruppe. Und das Vermögen ist hier nur die Summe der
// erfassten Posten ohne Schulden (Art. 7 lit. b [4]) — dieselbe Richtung.
//
// BEWUSST NICHT GEBAUT (die Angabe fehlt der App, oder der Weg ist ein anderer):
//   · Paare, eingetragene Partnerschaften und Konkubinat mit gemeinsamem Kind — Art. 9 [3] addiert
//     die RDU; das zweite Einkommen kennt die App nicht. Konkubinat OHNE gemeinsames Kind rechnet
//     amtlich jede Person für sich, doch das Kind kann die App nicht zuordnen — darum dasselbe Nein.
//   · junge Erwachsene (Jahrgänge 2001–2007 [1]; Art. 20 Abs. 3 lit. b [2]): eigener Betrag 231
//     bzw. 106 Franken, gerechnet mit dem RDU der Eltern PLUS dem eigenen, als zusätzliche
//     Unterhaltspflicht der Eltern (Art. 10 Abs. 7 [3]) — nur auf Antrag. Als eigene Person: `alter`;
//     als Kind im Haushalt über 18: `haushalt`.
//   · Quellenbesteuerte (Art. 24 [2], Art. 12 [3]: Antrag, RDU nach Art. 9 Abs. 2 LRDU), Zuzug 2025/26
//     (Art. 25 [2]), EL- und Sozialhilfe-Beziehende (Art. 22 Abs. 7–9 [2]: Durchschnittsprämie),
//     Grenzgängerinnen und im Ausland Wohnende (Art. 24A [2]), Ermessensveranlagte (Art. 27 lit. b).
//   · das Bruttoeinkommen über 200'000 (Art. 10 Abs. 2 [3]): die App kennt das Brutto nicht sicher.
//     Wer so viel verdient, liegt mit dem Netto ohnehin über jeder Grenze (höchste: 169'000 mit
//     vier Kindern) — die Vermutung ändert für die Anzeige nichts.
//   · die Aktualisierung des RDU bei veränderter Lage (Art. 10 Abs. 2 [4]) — steht im Vorbehalt.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich aus [1], [2] und [3]. Grenzen sind Jahresbeträge des RDU, Beträge Monatsbeträge.
export const IPV_GE = {
  jahr: 2026,
  // Art. 21 Abs. 1 lit. a–h [2], in der Reihenfolge der Gruppen 1–8. Barème [1]: «0 à 30'000»,
  // «30'001 à 35'000» … — die Grenze gehört also noch zur unteren Gruppe.
  grenzen: {
    allein: [30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000],
    paar: [45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000],
  },
  // Art. 21 Abs. 2 [2]: «Ces limites sont majorées de 6 000 francs par charge légale.»
  // Art. 21 Abs. 4 [2]: «Une personne assumant une charge légale est assimilée à un couple.»
  jeUnterhaltspflicht: 6000,
  // Art. 21 Abs. 7 [2]: «151 000 francs (Groupe 9)» für «un assuré seul ou un couple avec une
  // charge légale»; Abs. 8: «majorée de 6 000 francs par charge légale supplémentaire».
  gruppe9: { grenze: 151000, jeWeitere: 6000 },
  // Barème [1], Zeile «Subside mensuel adulte», Gruppen 1–8. (Gesetz Art. 22 Abs. 1 [2], Stand
  // Dezember 2024: 320 / 270 / 220 / 180 / 150 / 110 / 80 / 50 — indexiert nach Art. 9B [3].)
  erwachsene: [348, 294, 240, 196, 164, 120, 87, 55],
  gesetzErwachsene: [320, 270, 220, 180, 150, 110, 80, 50],
  // Barème [1], Zeile «Subside mensuel enfant»: 132 in den Gruppen 1–8 (Art. 22 Abs. 2 lit. a [2]:
  // 80 % der BAG-Durchschnittsprämie, aufgerundet, plus 10 Franken), 67 in Gruppe 9 (lit. b: 60
  // Franken, indexiert).
  kind: { gruppe1bis8: 132, gruppe9: 67 },
  // Barème [1], Zeile «Subside mensuel jeune adulte»: 231 / 106 — NICHT gebaut, hier nur belegt,
  // damit die Zahl nicht beim nächsten Mal neu gesucht wird.
  jungeErwachsene: { gruppe1bis8: 231, gruppe9: 106, jahrgaenge: [2001, 2007] },
  // LRDU Art. 8 Abs. 2 [4]: «augmenté d'un quinzième de la fortune».
  vermoegenAnteil: 1 / 15,
  // RaLAMal Art. 10 Abs. 1 [3]: Bruttovermögen «qui excède 250 000 francs» ⇒ Vermutung «nicht
  // bescheiden», Subsid nur auf begründeten Antrag (Art. 20 Abs. 2, Art. 23 Abs. 5 [2]).
  vermoegenBruttoGrenze: 250000,
  // RaLAMal Art. 10 Abs. 4/5 [3]: unter diesen RDU-Beträgen ebenfalls Vermutung «nicht bescheiden»
  // (ausser bei Sozialhilfe) ⇒ Antrag mit Nachweis der Lebenshaltung.
  antragUnter: { allein: 15000, paar: 20000, jeUnterhaltspflicht: 3000 },
  // RaLAMal Art. 10A [3]: Antragsfälle «avant le 30 novembre de l'année d'ouverture du droit».
  antragsfrist: { monat: 11, tag: 30 },
  // RaLAMal Art. 10 Abs. 3/6 [3] und ge.ch [6]: die Lage «2 ans avant l'année d'ouverture du droit».
  basisjahrAbstand: 2,
};

// Die Grenzen des Haushalts. Ohne Kinder die Spalte «assuré seul»; mit Kindern die Spalte
// «couple» (Art. 21 Abs. 4 [2]) plus 6'000 je Kind (Abs. 2). Gruppe 9 gibt es nur mit Kindern.
export function geGrenzen(kinderZahl) {
  const p = IPV_GE;
  if (kinderZahl <= 0) return { gruppen: p.grenzen.allein, gruppe9: null };
  const zuschlag = p.jeUnterhaltspflicht * kinderZahl;
  return {
    gruppen: p.grenzen.paar.map((g) => g + zuschlag),
    gruppe9: p.gruppe9.grenze + p.gruppe9.jeWeitere * (kinderZahl - 1),
  };
}

// Reine Rechnung, ohne App-Daten — testbar gegen jede Zelle des Barème [1]. `rdu` in CHF/Jahr,
// `kinderZahl` = minderjährige Kinder. Liefert Monats- und Jahresbeträge, den Anteil der
// erwachsenen Person getrennt (nur er wird auf ihre Prämie gedeckelt) und die letzte Grenze, bis
// zu der überhaupt etwas gezahlt wird (die Anzeige nennt sie als Einkommensgrenze).
export function ipvGenfRechnen({ rdu, kinderZahl = 0 }) {
  const p = IPV_GE;
  // RaLAMal Art. 9A [3]: ein negativer RDU «est considéré comme équivalent à zéro».
  const rdu0 = Math.max(0, rdu);
  const { gruppen, gruppe9 } = geGrenzen(kinderZahl);
  const grenze = gruppe9 ?? gruppen[gruppen.length - 1];
  const idx = gruppen.findIndex((g) => rdu0 <= g);
  const gruppe = idx >= 0 ? idx + 1 : (gruppe9 !== null && rdu0 <= gruppe9 ? 9 : null);
  const erwachseneMonat = gruppe === null || gruppe === 9 ? 0 : p.erwachsene[gruppe - 1];
  const kindMonat = gruppe === null ? 0 : (gruppe === 9 ? p.kind.gruppe9 : p.kind.gruppe1bis8);
  const monat = erwachseneMonat + kinderZahl * kindMonat;
  return {
    gruppe, monat, annual: monat * 12, grenze,
    erwachseneMonat, kindMonat,
    erwachseneAnnual: erwachseneMonat * 12,
    // Vergleichsgrösse «höchstens möglich»: Gruppe 1 mit denselben Personen.
    maximal: (p.erwachsene[0] + kinderZahl * p.kind.gruppe1bis8) * 12,
    erwachseneMaximal: p.erwachsene[0] * 12,
    nurKinder: gruppe === 9,
  };
}

// RDU-Untergrenze, unter der der Kanton den Anspruch NICHT automatisch prüft (RaLAMal Art. 10
// Abs. 4/5 [3]). Mit Kindern rechnen wir mit der Paar-Zeile plus 3'000 je Kind — dieselbe
// Gleichstellung wie in Art. 21 Abs. 4 [2]. Ob Art. 10 [3] sie übernimmt, sagt der Text nicht
// (FRAGEN-AN-DIE-AEMTER.md, Frage 8); die Lesart ist GEWÄHLT, und zwar die, die häufiger warnt:
// ein unnötiger Antrag kostet nichts, ein fehlender den ganzen Jahresanspruch.
export function geAntragUnter(kinderZahl) {
  const p = IPV_GE.antragUnter;
  return (kinderZahl > 0 ? p.paar : p.allein) + p.jeUnterhaltspflicht * kinderZahl;
}

// Aufruf aus calculateIPV (config/cantonalData.js) für GE mit Beleg. Die App rechnet nur, wo ihre
// Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund in `offen`.
// `lookupPLZ` wird nicht gebraucht (keine Prämienregion) und darum nicht entgegengenommen.
export function ipvGenf(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_GE.jahr;
  // Das Barème gilt je Anspruchsjahr (Indexierung per Arrêté, Art. 9B [3]). Ab dem 01.01. des
  // Folgejahres lieber keine Zahl als eine aus den alten Beträgen; das Barème 2027 war am
  // 28.09.2026 nicht publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // Art. 9 [3]: die RDU von Ehegatten, eingetragenen Partnern und Konkubinatspaaren mit gemeinsamem
  // Kind werden addiert — das zweite Einkommen kennt die App nicht (siehe Kopf).
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');

  // Alter nach Jahrgang, Stichtag 1. Januar (Art. 10 Abs. 8 [3]; Art. 20 Abs. 3 lit. b [2]): [1]
  // führt «jeunes adultes, les personnes nées entre 2001 et 2007». Erwachsen ist also, wer im
  // Anspruchsjahr 26 wird (Jahrgang 2000) — dieselbe Regel wie AG und LU, hier mit dem amtlichen
  // Barème für GENAU dieses Anspruchsjahr belegt.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: «enfants mineurs à charge» (Art. 21 Abs. 5, Art. 22 Abs. 2 [2]), minderjährig am
  // 1. Januar — für 2026 die Jahrgänge ab 2008, also höchstens 18 im Anspruchsjahr. Beim eingetippten
  // Alter ein Jahr dazu (wie BE und LU): undatiert, die Person kann im Anspruchsjahr Geburtstag haben.
  // Kind ohne erfasstes Alter ⇒ keine Zahl (Rahmen, Befund 20.09.2026).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // Art. 10 Abs. 1 [3]: über 250'000 Bruttovermögen vermutet der Kanton «nicht bescheiden» — kein
  // Ausschluss, aber nur auf begründeten Antrag mit Nachweis (Art. 23 Abs. 5 [2]). Die App kennt
  // nur die erfassten Posten, nicht das steuerliche Bruttovermögen — darum ein eigener Grund.
  if (vermoegen > IPV_GE.vermoegenBruttoGrenze) return orientierung('vermoegenAntragGE');
  // Ein negatives Einkommen ist ein Vertipper, kein Einkommen (BE, Fachprüfung 23.09.2026). Art. 9A
  // [3] setzt einen negativen RDU zwar auf 0 — der meint aber Geschäftsverluste, die die App nicht
  // erfasst, nicht ein Minuszeichen im Lohnfeld. Ohne den Riegel ergäbe der Vertipper Gruppe 1.
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // LRDU Art. 8 Abs. 2 [4]: Sockel = Einkommen (Art. 4/5) + 1/15 des Vermögens (Art. 6/7). Die 3a
  // bleibt im Einkommen (Regel `voll`, Begründung im Kopf).
  const rdu = einkommenJahr(f, SAEULE_3A.voll) + IPV_GE.vermoegenAnteil * vermoegen;
  const r = ipvGenfRechnen({ rdu, kinderZahl });

  // Art. 22 Abs. 4 [2]: «Le montant des subsides accordés ne peut dépasser le montant de la prime
  // effective de l'assuré.» — je versicherte Person. Die App kennt nur die Prämie der erwachsenen
  // Person, also wird nur deren Anteil gedeckelt; der Kinderanteil bleibt ungedeckelt (wie ZH, BE,
  // LU: `deckelnProPerson`). ⚠️ Liegt die Prämie eines Kindes unter 132 Franken im Monat, fällt der
  // Betrag hier um die Differenz zu hoch aus.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);

  // Die Grenze ist amtlich als Zahl publiziert (Art. 21 [2]) — darum darf sie in die Anzeige.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const basisjahr = jahr - IPV_GE.basisjahrAbstand;
  const gemeinsam = {
    canton: 'GE', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltGE',
    // Keine Prämienregion: die Anzeige zeigt statt «Prämienregion undefined» den Genfer Satz.
    extra: { basisjahr, jahrOhneRegionKey: 'ipv.jahrGE' },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze } });
  }

  // Art. 10 Abs. 4–6 [3]: unter der RDU-Untergrenze prüft der Kanton nicht automatisch — Antrag
  // mit Nachweis, vor dem 30. November (Art. 10A [3]), sonst kein Eintreten. Genau die ärmste
  // Gruppe; wer sich hier auf «automatisch» verlässt, verliert den ganzen Jahresanspruch.
  const antragGrenze = geAntragUnter(kinderZahl);
  const antragNoetig = rdu < antragGrenze;
  const frist = new Date(`${jahr}-${String(IPV_GE.antragsfrist.monat).padStart(2, '0')}-${IPV_GE.antragsfrist.tag}T00:00:00`);
  // «avant le 30 novembre»: am 30. selbst ist es zu spät.
  const fristVorbei = new Date() >= frist;
  const noteKey = antragNoetig ? 'ipv.geAntragNoetig' : r.nurKinder ? 'ipv.geNurKinder' : ipvData.noteKey;
  const noteParams = antragNoetig ? { value: antragGrenze, jahr }
    : r.nurKinder ? { value: r.grenze } : (ipvData.noteParams || {});
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount, noteKey, noteParams,
    // anmeldefristVorbei nur dort, wo ein Antrag nötig war und die Frist verstrichen ist: dann
    // zieht die App nirgends etwas von der Prämie ab (data/ipvAbzug.js). Für die automatischen
    // Fälle gibt es keine Frist.
    extra: { ...gemeinsam.extra, ...(antragNoetig && fristVorbei ? { anmeldefristVorbei: true } : {}) },
  });
}
