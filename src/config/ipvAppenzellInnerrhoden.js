// Prämienverbilligung (IPV) Kanton Appenzell Innerrhoden — Richtprämie minus gestufter Selbstbehalt,
// Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026; Erlasse über die API-Route von ai.clex.ch, Gegenprobe
// `texts_of_law/832.599` → 404, `versions/99999999` → 404), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt AI:
//   [1] Standeskommissionsbeschluss über die individuelle Prämienverbilligung in der
//       Krankenversicherung (StKB IPV, GS 832.501), «Aktuelle Version in Kraft seit: 01.01.2026
//       (Beschlussdatum: 02.12.2025)», keine künftige Version.
//       Art. 3 Abs. 2–5: Gesamtanspruch, Stichtag 1. Januar, Aufteilung nach Richtprämien ·
//       Art. 5 Abs. 1/1bis: Prozentsatz, höchstens die effektive Prämienlast · Art. 5 Abs. 2:
//       Veranlagung des Vorvorjahres · Art. 5 Abs. 3: massgebendes Gesamteinkommen · Art. 5 Abs. 5:
//       Kinder 80 %, junge Erwachsene in Ausbildung 50 % bis 75'000 · Art. 5 Abs. 6: ab Fr. 100 ·
//       Art. 6 Abs. 5: unter 12'000 oder Zivilstandsänderung → Veranlagung des Vorjahres ·
//       Art. 10: Verfügung von Amtes wegen · Art. 11a: provisorische Verfügung · Art. 13:
//       Rückerstattung · Anhang A1-1: Richtprämien und Selbstbehalt 2026.
//   [2] Gesundheitsamt AI, «Merkblatt zur individuellen Prämienverbilligung (IPV) 2026»
//       (AI 511.2-34.5-1358131, PDF 09.12.2025) — vier Berechnungsbeispiele, der Prüfstein.
//   [3] Steuergesetz (GS 640.000), «Aktuelle Version in Kraft seit: 01.01.2024»: Art. 37 Abs. 1
//       lit. a (Kinderabzug 6'000 für das erste und zweite, 8'000 für jedes weitere Kind) ·
//       Art. 38 Abs. 5 (auf 100 abgerundet) · Art. 45 Abs. 1/3 (steuerfreie Vermögensbeträge
//       50'000, +20'000 je Kind; auf 1'000 abgerundet).
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie den Selbstbehalt übersteigt — und der
// Selbstbehalt ist ein Prozentsatz des massgebenden Gesamteinkommens, der in Stufen von 0,125 % je
// Fr. 1'000 von 7 % (unter 45'000) auf 12 % (ab 85'000) steigt. Kinder erhalten bis 75'000 mindestens
// 80 % ihrer Richtprämie.
//
// DAS AMTLICHE BEISPIEL [2] geht Zahl für Zahl auf (Test): 20'000 allein → 3'240; Eltern mit zwei
// Kindern, 60'000 → 6'023 + 556 = 6'579; mit einem jungen Erwachsenen in Ausbildung, 75'000 →
// 6'732 + 867 = 7'599; junger Erwachsener allein, 25'000 → 1'696 + 27 = 1'723.
// Daraus abgeleitet (nicht zitiert): der Selbstbehalt wird auf ganze Franken ABGERUNDET
// (10,75 % × 75'000 = 8'062.50 → 8'062), die Anteile nach Art. 3 Abs. 5 auf ganze Franken gerundet
// und die Anhebung auf den ganzen Franken unter 80 % aufgefüllt (827.20 → 827).
//
// GEWÄHLT, NICHT BELEGT (Fragen an das Gesundheitsamt: FRAGEN-AN-DIE-AEMTER.md):
//   · «schrittweise um 0.125% pro Fr. 1'000»: je VOLLE Fr. 1'000 über 45'000. Die Beispiele liegen
//     alle auf ganzen Tausendern und entscheiden das nicht; der Unterschied zu «je angefangene» ist
//     höchstens eine Stufe (0,125 % des Einkommens, bei 60'500 rund 76 Franken im Jahr).
//   · «steuerpflichtiges Gesamteinkommen» = steuerbares Einkommen nach [3] (Reineinkommen minus
//     Kinderabzug). Alleinstehende ohne Kinder haben keinen Sozialabzug.
//   · Die Anhebung der Kinder gilt bis 75'000 auch dann, wenn die Richtprämien den Selbstbehalt
//     nicht übersteigen (Art. 5 Abs. 5 [1] knüpft nur an das Einkommen).
//
// BEWUSST NICHT GEBAUT:
//   · Paare, Ehegatten, Konkubinat mit Kind (Art. 3 Abs. 2 [1]: Gesamtanspruch) — das zweite
//     Einkommen fehlt der App.
//   · junge Erwachsene (Jahrgänge 2001–2007) und Kinder über 18 — Ausbildung und Gesamtanspruch nach
//     Art. 3 Abs. 3 [1] (eigenes Einkommen unter 12'000, Veranlagung des Vorjahres) fehlen der App.
//   · Quellenbesteuerte (Art. 6 Abs. 1 [1]: Einkommen minus 20 %), Personen nach Art. 65a KVG,
//     EL-Beziehende (Art. 6 Abs. 2) und Sozialhilfebeziehende (Art. 6 Abs. 2bis: volle Richtprämie).
//   · erhaltene Alimente und Familienzulagen: steuerbar (StG AI Art. 26 Abs. 1 lit. f, Art. 20 Abs. 1),
//     von der App erfasst (`alimenteReceived`, `familienzulagen`), fliessen aber nicht ins Einkommen —
//     der gemeinsame Rahmen (`rohesEinkommenJahr`) kennt sie in keinem Kanton. Betrag dann ZU HOCH
//     (Fachprüfung #485: 800 Alimente + 200 Zulage im Monat → 1'184 Fr./Jahr zu viel). Rahmen-PR folgt;
//     der Vorbehalt `ipv.vorbehaltAI` sagt es der Person.
//   · StKB Art. 6 Abs. 4 [1]: kein Anspruch u. a., wenn «Familienmitglieder oder Dritte vollständig für
//     den Lebensunterhalt aufkommen» (lit. c) — die App erfasst das nicht; bei Einkommen 0 zeigt sie
//     die volle Richtprämie, die nur bei Sozialhilfe sicher gilt.
//   · Richtung der drei gewählten Lesarten (siehe oben): alle drei zugunsten der Person — der
//     Vorbehalt sagt «eher tiefer».
//   · vom massgebenden Gesamteinkommen (Art. 5 Abs. 3 lit. c, e–g [1]): Liegenschaftskosten über dem
//     Pauschalabzug, Einkaufsbeiträge, Schwarzarbeit-Einkünfte, Einkünfte nach Art. 22ter/23 StG — die
//     App erfasst sie nicht; jede würde das Einkommen ERHÖHEN. Die amtlichen Abzüge vor dem
//     Reineinkommen (Berufsauslagen, Versicherungsabzug) fehlen umgekehrt.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_AI = {
  jahr: 2026,
  // Art. 5 Abs. 2 [1]: «die rechtskräftige definitive Steuerveranlagung … des Vorvorjahres zum
  // Anspruchsjahr»; Art. 6 Abs. 5: unter 12'000 die des Vorjahres.
  basisjahrAbstand: 2,
  grenzeVorjahr: 12000,
  // Anhang A1-1 Ziff. 1 [1]: «a) für Kinder (Jahrgang 2008 und jünger) Fr. 1'034.--; b) für junge
  // Erwachsene (Jahrgang 2001 bis 2007) Fr. 3'446.--; c) für Erwachsene (Jahrgang 2000 und älter)
  // Fr. 4'640.--».
  richtpraemie: { e: 4640, j: 3446, k: 1034 },
  // Anhang A1-1 Ziff. 2 [1]: «a) 7% bei einem massgebenden Gesamteinkommen unter Fr. 45'000.--;
  // b) 12% … von Fr. 85'000.-- und darüber; c) dazwischen steigt der Selbstbehalt schrittweise um
  // 0.125% pro Fr. 1'000.-- von 7% auf 12%.» — in Prozent.
  selbstbehalt: { satz: 7, max: 12, ab: 45000, bis: 85000, schritt: 1000, jeSchritt: 0.125 },
  // Art. 5 Abs. 5 [1]: «für Kinder auf 80% und für junge Erwachsene in Ausbildung auf 50% der
  // Richtprämien angehoben, sofern das massgebende Gesamteinkommen Fr. 75'000.-- nicht übersteigt».
  anhebung: { k: 0.8, ja: 0.5, bis: 75000 },
  // Art. 5 Abs. 6 [1]: «ab einem Anspruch oder Gesamtanspruch von Fr. 100.-- pro Jahr».
  mindestbetrag: 100,
  // Art. 5 Abs. 3 lit. b [1]: «10% des steuerpflichtigen Gesamtvermögens».
  vermoegenAnteil: 0.10,
  // [3] Art. 45 Abs. 1: «a) für jeden Steuerpflichtigen Fr. 50'000.--; b) für jedes minderjährige …
  // Kind, für das er einen Kinderabzug … beanspruchen kann, zusätzlich Fr. 20'000.--».
  vermoegenFreibetrag: { person: 50000, jeKind: 20000 },
  // [3] Art. 37 Abs. 1 lit. a: «Fr. 6'000.-- für das erste und zweite und Fr. 8'000.-- für jedes
  // weitere … Kind».
  kinderabzug: { erstesZweites: 6000, weitere: 8000 },
};

// Selbstbehalt in PROZENT. Stufen je VOLLE Fr. 1'000 über 45'000 (gewählt, siehe Kopf).
export function aiSelbstbehaltProzent(me) {
  const s = IPV_AI.selbstbehalt;
  if (me < s.ab) return s.satz;
  if (me >= s.bis) return s.max;
  return s.satz + s.jeSchritt * Math.floor((me - s.ab) / s.schritt);
}

// Steuerlicher Kinderabzug für `anzahl` Kinder ([3] Art. 37 Abs. 1 lit. a).
export function aiKinderabzug(anzahl) {
  const k = IPV_AI.kinderabzug;
  return Math.min(anzahl, 2) * k.erstesZweites + Math.max(0, anzahl - 2) * k.weitere;
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen die Beispiele [2] prüfen können.
// `personen`: 'e' Erwachsene, 'j' junge Erwachsene, 'ja' junge Erwachsene in Ausbildung, 'k' Kinder.
// Die App ruft sie immer mit einer erwachsenen Person und Kindern auf.
export function ipvAppenzellInnerrhodenRechnen({ personen, me }) {
  const p = IPV_AI;
  const rp = (c) => (c === 'e' ? p.richtpraemie.e : c === 'k' ? p.richtpraemie.k : p.richtpraemie.j);
  const summe = personen.reduce((s, c) => s + rp(c), 0);
  const me0 = Math.max(0, me);
  const prozent = aiSelbstbehaltProzent(me0);
  // Auf ganze Franken abgerundet (Beispiel [2]: 10,75 % von 75'000 = 8'062.50 → «Fr. 8'062.00»).
  const selbstbehaltBetrag = Math.floor((prozent / 100) * me0 + 1e-9);
  const basis = Math.max(0, summe - selbstbehaltBetrag);
  // Art. 3 Abs. 5 [1]: Aufteilung im Verhältnis der Richtprämien, auf Franken gerundet.
  const anteile = personen.map((c) => (summe > 0 ? Math.round((basis * rp(c)) / summe) : 0));
  // Art. 5 Abs. 5 [1]: Anhebung bis 75'000, aufgefüllt auf den ganzen Franken unter dem Mindestanteil
  // ([2]: «Erhöhung … auf Fr. 827.20 pro Kind», gerechnet werden 278 bzw. 356 Franken).
  const anhebungGilt = me0 <= p.anhebung.bis;
  const anhebungen = personen.map((c, i) => {
    const satz = c === 'k' ? p.anhebung.k : c === 'ja' ? p.anhebung.ja : 0;
    if (!anhebungGilt || satz === 0) return 0;
    return Math.max(0, Math.floor(satz * rp(c) + 1e-9) - anteile[i]);
  });
  const erhoehung = anhebungen.reduce((s, x) => s + x, 0);
  const roh = basis + erhoehung;
  const grund = roh >= p.mindestbetrag ? null : (roh > 0 ? 'mindestbetrag' : 'ueberGrenze');
  return {
    summe, prozent, selbstbehaltBetrag, basis, anteile, anhebungen, erhoehung,
    total: grund ? 0 : roh, grund,
    // Anteil der ersten erwachsenen Person — nur ihre Prämie kennt die App.
    anteilErwachsen: personen.indexOf('e') >= 0 ? anteile[personen.indexOf('e')] : 0,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für AI mit Beleg. Eine Prämienregion (BAG: Region
// 0 für alle Bezirke), kantonsweite Richtprämie — darum ohne PLZ (`brauchtPLZ: false`).
export function ipvAppenzellInnerrhoden(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_AI.jahr;
  // Die Standeskommission legt Richtprämien und Selbstbehalt jährlich fest (für 2026 am 02.12.2025).
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Anhang A1-1 [1]: «Erwachsene (Jahrgang 2000 und älter)» — erwachsen ist, wer im Anspruchsjahr
  // 26 wird (wie LU, AG, SH, AR).
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Art. 3 Abs. 4 [1]: «Bezüglich der familiären … Verhältnisse … gilt als Stichtag der 1. Januar» —
  // ein später geborenes Kind gehört 2026 noch nicht zum Gesamtanspruch.
  const kinder = (hh.children || []).filter((c) => !(/^\d{4}-\d{2}-\d{2}/.test(c.birthDate || '')
    && c.birthDate.slice(0, 10) > `${jahr}-01-01`));
  // «Kinder (Jahrgang 2008 und jünger)» — höchstens 18 im Anspruchsjahr.
  const kinderJahre = kinderAlter(kinder, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const roh = rohesEinkommenJahr(f);
  if (!(roh >= 0)) return orientierung('einkommenNegativ');
  // Welche Kinder standen Ende des Steuerjahres schon im Haushalt? Aus dem Geburtsdatum eindeutig; aus
  // dem eingetippten Alter (heute) nur, wenn es mindestens so gross ist wie der Abstand zum Steuerjahr.
  const kinderImJahr = (steuerjahr) => {
    let n = 0;
    for (const c of kinder) {
      if (/^\d{4}-/.test(c.birthDate || '')) { if (Number(c.birthDate.slice(0, 4)) <= steuerjahr) n += 1; } else {
        const a = Number(c.age);
        if (a >= jahr - steuerjahr) n += 1;
        else if (a >= jahr - steuerjahr - 1) return null; // Geburt im Steuerjahr oder danach: offen
      }
    }
    return n;
  };
  const vermoegen = vermoegenSumme(f);
  // Art. 5 Abs. 3 [1]: steuerpflichtiges Gesamteinkommen + 10 % des steuerpflichtigen Vermögens + 3a
  // (lit. d, unbedingt — Regel `voll`, das Nettoeinkommen der App trägt sie schon).
  const massgebend = (steuerjahr) => {
    const n = kinderImJahr(steuerjahr);
    if (n === null) return null;
    // [3] Art. 38 Abs. 5 und Art. 45 Abs. 3: auf 100 bzw. 1'000 Franken abgerundet.
    const einkommen = Math.floor(Math.max(0, einkommenJahr(f, SAEULE_3A.voll) - aiKinderabzug(n)) / 100) * 100;
    const steuerbaresVermoegen = Math.floor(Math.max(0, vermoegen - IPV_AI.vermoegenFreibetrag.person
      - IPV_AI.vermoegenFreibetrag.jeKind * n) / 1000) * 1000;
    return einkommen + IPV_AI.vermoegenAnteil * steuerbaresVermoegen;
  };
  let basisjahr = jahr - IPV_AI.basisjahrAbstand;
  let me = massgebend(basisjahr);
  // Art. 6 Abs. 5 [1]: lag das Einkommen im Vorvorjahr unter 12'000, zählt die Veranlagung des Vorjahres.
  if (me !== null && me < IPV_AI.grenzeVorjahr) { basisjahr += 1; me = massgebend(basisjahr); }
  if (me === null) return orientierung('alter');

  const r = ipvAppenzellInnerrhodenRechnen({ personen: ['e', ...kinderJahre.map(() => 'k')], me });

  // Art. 5 Abs. 1bis [1]: «höchstens in der Höhe der effektiven Prämienlast». Die App kennt nur die
  // Prämie der erwachsenen Person — nur deren Anteil wird gedeckelt.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = r.total > 0 ? deckelnProPerson(r.total, r.anteilErwachsen, praemie) : 0;
  const r0 = ipvAppenzellInnerrhodenRechnen({ personen: ['e', ...kinderJahre.map(() => 'k')], me: 0 });
  const maxAnnual = deckelnProPerson(r0.total, r0.anteilErwachsen, praemie);

  // Keine publizierte Einkommensgrenze: sie ergibt sich nur aus der Formel (Merkblatt [2] nennt keine).
  const cantonData = { ...ipvData, maxIncome: null };
  const gemeinsam = {
    canton: 'AI', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltAI',
    extra: { basisjahr, jahrKey: 'ipv.jahrAI' },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.aiUnterMindestbetrag' : 'ipv.aiKeinAnspruch',
    });
  }
  // Kein Antrag, keine Frist: das Gesundheitsamt ermittelt von Amtes wegen ([2] Ziff. 1, Art. 10 [1]).
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: 'ipv.aiAutomatisch', noteParams: { jahr },
  });
}
