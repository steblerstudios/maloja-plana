// Prämienverbilligung (IPV) Kanton Appenzell Ausserrhoden — Richtprämie minus Selbstbehalt über dem
// allgemeinen Lebensbedarf, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026; Erlasse über die API-Route von ar.clex.ch, Gegenprobe
// `texts_of_law/833.199` und `versions/9999999` → HTTP 404), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt AR:
//   [1] Gesetz über die Einführung des Bundesgesetzes über die Krankenversicherung (EG zum KVG,
//       bGS 833.14), «Aktuelle Version in Kraft seit: 01.01.2017 (Beschlussdatum: 13.06.2016)».
//       Art. 2 Abs. 1 lit. c–f: steuerbares, massgebendes und anrechenbares Einkommen,
//       allgemeiner Lebensbedarf · Art. 4: der Regierungsrat legt Richtprämien, Selbstbehalt,
//       Kinderabzug und Kinder-Prozentsatz jährlich fest · Art. 11 Abs. 2: Kinder bis zur
//       Obergrenze verbilligt · Art. 12: Obergrenzen · Art. 13 Abs. 1: Richtprämie minus
//       Selbstbehalt · Art. 16: Anspruch, Stichtag 1. Januar · Art. 19: massgebendes Einkommen ·
//       Art. 20/21: Änderung, Rückerstattung · Art. 22: Verwirkung.
//       Die Medienmitteilung vom 31.10.2025 bestätigt: «Das derzeit gültige Gesetz stammt aus dem
//       Jahre 2017.» Eine Teilrevision liegt beim Kantonsrat, in Kraft ist sie nicht.
//   [2] Verordnung zum EG zum KVG (V zum KVG, bGS 833.141), «Aktuelle Version in Kraft seit:
//       01.01.2017 (Beschlussdatum: 27.09.2016)». Art. 5 Abs. 1: 3a über 10'000 bei Personen ohne
//       Vorsorgeeinrichtung, 15 % des steuerbaren Vermögens · Art. 6: Neugeborene ab dem Folgemonat ·
//       Art. 7: höchstens die Prämie «mit der ordentlichen Franchise und mit Unfalldeckung» ·
//       Art. 10: Antrag bis 31. März, in Härtefällen bis 30. April · Art. 13 Abs. 1: «Beträge unter
//       20 Franken werden nicht ausbezahlt.»
//   [3] Sozialversicherungen Appenzell Ausserrhoden (SOVAR), «Merkblatt über die Verbilligung der
//       Prämien … im Jahr 2026» (Merkblatt-IPV-2026.pdf, erstellt 18.12.2025): alle Zahlen 2026 —
//       Richtprämien, Obergrenzen, Selbstbehalt 46 %, Lebensbedarf, Kinderabzug 2'000.
//   [4] Medienmitteilung «Regierungsrat legt individuelle Prämienverbilligung 2026 fest»
//       (12.12.2025): Kinder 80 %, junge Erwachsene in Ausbildung 50 %, «Der Kinderabzug wird bei
//       2'000 Franken belassen», «Der Selbstbehalt wird auf 46 % festgelegt».
//   [5] SOVAR, «Prämienverbilligung bei Zuzug aus dem Ausland — Antrag für das Jahr 2026»: die
//       Jahrgänge («Für Personen mit Jahrgang 2001 oder jünger: Befinden Sie sich am 1.1.2026 in
//       Ausbildung?», «Kinder der Jahrgänge 2008 - 2026»).
//   [6] Steuergesetz (bGS 621.11), Versionen 01.03.2024 und 01.01.2025: Art. 38 Abs. 1 lit. a
//       (Kinderabzug) mit Anhang 1 «Betrag per 1. Januar 2024» (5'300 / 7'400 / 11'600) ·
//       Art. 51 Abs. 1 (steuerfreie Beträge vom Vermögen 75'000, +25'000 je minderjähriges Kind).
//   Die RRB mit den Werten 2026 selbst sind nicht publiziert; die Zahlen stehen im Merkblatt der
//   vollziehenden Kasse [3] und decken sich mit [4]. Ein Berechnungsbeispiel gibt es nicht.
//
// DAS MODELL IN EINEM SATZ
// Die erwachsene Person erhält die Richtprämie 6'025.20 minus 46 % ihres Einkommens über dem
// allgemeinen Lebensbedarf (20'670 allein, 31'005 + 2'000 je Kind mit Kindern); jedes Kind erhält
// fest 80 % seiner Richtprämie (1'114.80) — alles nur bis zu harten Obergrenzen bei Einkommen und
// Vermögen, darüber nichts.
//
// VIER DINGE, DIE APPENZELL AUSSERRHODEN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. DER SELBSTBEHALT BEGINNT ERST ÜBER DEM EXISTENZMINIMUM. 46 % nicht des ganzen Einkommens, sondern
//    der «Differenz zwischen dem massgebendem Einkommen und dem allgemeinen Lebensbedarf» [3]. Der
//    Abbau ist darum steil: für Alleinstehende von der vollen Richtprämie bei 20'670 auf null bei
//    rund 33'768 massgebendem Einkommen.
//
// 2. HARTE OBERGRENZEN (Art. 12 [1], Beträge 2026 [3]). Darüber besteht KEIN Anspruch, auch nicht
//    für die Kinder — ein Abbruch, kein Auslaufen. Die Grenze für Alleinstehende (35'000) liegt über
//    dem Nullpunkt der Formel und wirkt nicht; mit Kindern schneidet sie den festen Kinderanteil ab.
//
// 3. DAS MASSGEBENDE EINKOMMEN IST DAS STEUERBARE, also NACH den Sozialabzügen (Art. 2 lit. c/d [1]).
//    Für Alleinstehende ohne Kinder kennt das Steuergesetz keinen Sozialabzug, dort ist es das
//    Reineinkommen; mit Kindern geht der steuerliche Kinderabzug nach Alter ab ([6], Werte 2024).
//
// 4. DER DECKEL IST NICHT DIE EIGENE PRÄMIE, sondern die Prämie «mit der ordentlichen Franchise und
//    mit Unfalldeckung» (Art. 7 [2]; [3]: «ordentliche Franchise (CHF 300.00)»). Die ist mindestens so
//    hoch wie die erfasste Prämie, aber nicht erfasst. Liegt der gerechnete Betrag über der erfassten
//    Prämie, zeigt die App darum keine Zahl (`praemieFranchise`) — sonst wäre sie zu tief.
//
// GEWÄHLT, NICHT BELEGT (Fragen an die SOVAR: FRAGEN-AN-DIE-AEMTER.md):
//   · Steuerjahr der «letzten rechtskräftigen Steuerveranlagung» (Art. 19 [1]): 2024. Es zählt nur
//     für den steuerlichen Kinderabzug nach Alter; wo 2024 und die Angaben der App nicht eindeutig
//     dieselbe Altersstufe ergeben, keine Zahl.
//   · Kinder: der feste Anteil von 80 % wird NICHT um den Selbstbehalt gekürzt (Art. 11 Abs. 2 [1]:
//     «Bis zur Obergrenze der Bezugsberechtigung werden die Richtprämien für Kinder … im Umfang des …
//     Prozentsatzes verbilligt»). Übersteigt der Selbstbehalt die Richtprämie der erwachsenen Person,
//     widerspricht dem Art. 16 Abs. 1 lit. c [1] («einen Selbstbehalt aufweist, der die Richtprämie
//     nicht übersteigt») — in diesem Band keine Zahl.
//   · Säule 3a: wer einen BVG-Beitrag über 0 erfasst hat, gehört einer Vorsorgeeinrichtung an (volle
//     Aufrechnung, Art. 19 Abs. 1 lit. a [1]); wer ausdrücklich 0 erfasst hat, gehört keiner an (nur
//     über 10'000, Art. 5 Abs. 1 lit. a [2]) — so liest es auch GR. Leer heisst «nicht erfasst»: dann
//     wird mit und ohne gerechnet, und ergibt das verschiedene Beträge, keine Zahl.
//     ⟨Fachprüfung #480 W4: vorher gab es für Personen ohne Pensionskasse keinen Ausweg.⟩
//   · Rundung auf ganze Franken.
//
// BEWUSST NICHT GEBAUT:
//   · Paare und mehrere Erwachsene (Art. 17 Abs. 1 [1]: gemeinsamer Anspruch der gemeinsam
//     Besteuerten) — das zweite Einkommen fehlt der App.
//   · junge Erwachsene (Jahrgänge 2001–2007 [5]) und Kinder über 18 — Ausbildung ist nicht erfasst.
//   · Kinder, die nach dem 1. Januar des Anspruchsjahres geboren sind (Art. 6 [2]: Anspruch ab dem
//     Folgemonat; Art. 16 Abs. 2 [1]: Verhältnisse am 1. Januar) — keine Zahl.
//   · Quellenbesteuerte, EU/EFTA-Versicherte (Art. 18 [1]), EL-Beziehende (über die EL) und
//     Sozialhilfebeziehende (Art. 15 [1]: volle Grundversicherung, höchstens die Richtprämie).
//   · vom massgebenden Einkommen (Art. 19 Abs. 1 [1]): Einkaufsbeiträge (lit. c), Liegenschafts-
//     aufwand (lit. d), Schwarzarbeit-Einkünfte (lit. e), Vorjahresverluste (lit. f), Parteispenden
//     und freiwillige Leistungen (lit. h/i) — die App erfasst sie nicht; jede würde das Einkommen
//     ERHÖHEN. Die amtlichen Abzüge vor dem Reineinkommen (Berufsauslagen, Versicherungsabzug)
//     fehlen umgekehrt — dann ist das Einkommen hier zu hoch.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_AR = {
  jahr: 2026,
  // [3]: «Richtprämie für Erwachsene CHF 6'025.20», «Richtprämie für junge Erwachsene CHF 4'233.60».
  richtpraemie: { e: 6025.20, j: 4233.60 },
  // [3]: «Prämie für minderjährige Kinder (80%) CHF 1'114.80» — der verbilligte Betrag selbst.
  kinderBetrag: 1114.80,
  // [3]/[4]: «Der Selbstbehalt entspricht 46% aus der Differenz zwischen dem massgebendem Einkommen
  // und dem allgemeinen Lebensbedarf».
  selbstbehalt: 0.46,
  // [3]: «Alleinstehende ohne Kinder CHF 20'670.00», «Verheiratete und Alleinerziehende mit Kindern
  // CHF 31'005.00», «Pro Kind CHF 2'000.00» (Art. 2 Abs. 1 lit. e/f [1]).
  lebensbedarf: { alleinstehend: 20670, mitKindern: 31005 },
  abzugJeKind: 2000,
  // [3] «Obergrenzen Massgebendes Einkommen»: Alleinstehende ohne Kinder, Alleinerziehende mit 1, 2,
  // 3, 4, «5 und mehr» Kindern. Index = Kinderzahl, ab 5 der letzte Wert.
  obergrenzeEinkommen: [35000, 46200, 47000, 50400, 56700, 63000],
  // [3]: «Alleinstehende und Alleinerziehende CHF 120'000.00» (steuerbares Vermögen).
  obergrenzeVermoegen: 120000,
  // Art. 5 Abs. 1 lit. d [2]: «15 Prozent des steuerbaren Vermögens».
  vermoegenAnteil: 0.15,
  // [6] Art. 51 Abs. 1 lit. b/c: «Fr. 75 000.–» und «zusätzlich für jedes minderjährige Kind …
  // Fr. 25 000.–».
  vermoegenFreibetrag: { alleinstehend: 75000, jeKind: 25000 },
  // [6] Art. 38 Abs. 1 lit. a Ziff. 1–3 mit Anhang 1 («Betrag per 1. Januar 2024»): bis zur
  // Vollendung des 4. Altersjahres 5'300, bis zur Vollendung des 15. 7'400, danach 11'600.
  kinderabzugSteuer: { bis4: 5300, bis15: 7400, ab15: 11600 },
  // GEWÄHLT: das Steuerjahr der «letzten rechtskräftigen Steuerveranlagung» (siehe Kopf).
  steuerjahr: 2024,
  // Art. 13 Abs. 1 [2]: «Beträge unter 20 Franken werden nicht ausbezahlt.»
  mindestbetrag: 20,
  // Art. 10 [2]; [3]: «vom 1. Januar 2026 bis 31. März 2026».
  frist: { ordentlich: '2026-03-31', haertefall: '2026-04-30' },
};

// Steuerlicher Kinderabzug für ein Kind im Alter `alter` am Ende der Steuerperiode ([6] Art. 38
// Abs. 2). Noch nicht geboren (`alter < 0`) → kein Abzug.
export function arKinderabzugSteuer(alter) {
  const k = IPV_AR.kinderabzugSteuer;
  if (alter < 0) return 0;
  if (alter < 4) return k.bis4;
  if (alter < 15) return k.bis15;
  return k.ab15;
}

// Die Rechnung selbst — ohne App-Daten. `me` = massgebendes Einkommen, `kinderZahl` = minderjährige
// Kinder. Jahresbeträge in CHF, ungerundet.
export function ipvAppenzellAusserrhodenRechnen({ me, kinderZahl = 0 }) {
  const p = IPV_AR;
  const me0 = Math.max(0, me);
  const obergrenze = p.obergrenzeEinkommen[Math.min(kinderZahl, p.obergrenzeEinkommen.length - 1)];
  const lebensbedarf = kinderZahl > 0 ? p.lebensbedarf.mitKindern : p.lebensbedarf.alleinstehend;
  const anrechenbar = Math.max(0, me0 - lebensbedarf - p.abzugJeKind * kinderZahl);
  const selbstbehaltBetrag = p.selbstbehalt * anrechenbar;
  const erwachsen = Math.max(0, p.richtpraemie.e - selbstbehaltBetrag);
  const kinder = kinderZahl * p.kinderBetrag;
  const basis = { obergrenze, lebensbedarf, anrechenbar, selbstbehaltBetrag, unklar: false };
  // Art. 12 [1]: über der Obergrenze kein Anspruch, auch nicht für die Kinder.
  if (me0 > obergrenze) return { ...basis, erwachsen: 0, kinder: 0, total: 0, grund: 'ueberGrenze' };
  // Art. 16 Abs. 1 lit. c [1] gegen Art. 11 Abs. 2 [1] (siehe Kopf): mit Kindern und einem
  // Selbstbehalt über der Richtprämie ist offen, ob die Kinder ihren Anteil behalten.
  if (kinderZahl > 0 && selbstbehaltBetrag > p.richtpraemie.e) {
    return { ...basis, erwachsen: 0, kinder, total: kinder, grund: null, unklar: true };
  }
  const total = erwachsen + kinder;
  let grund = null;
  if (!(total > 0)) grund = 'ueberGrenze';
  else if (total < p.mindestbetrag) grund = 'mindestbetrag';
  return { ...basis, erwachsen, kinder, total: grund ? 0 : total, grund };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für AR mit Beleg. Der Kanton kennt eine einzige
// Prämienregion (BAG: Region 0 für alle 20 Gemeinden) und rechnet mit einer kantonsweiten
// Richtprämie — darum ohne PLZ (`brauchtPLZ: false`).
export function ipvAppenzellAusserrhoden(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const v = data.versicherungen || {};
  const jahr = IPV_AR.jahr;
  // Der Regierungsrat legt die Werte jährlich im Dezember fest (für 2026 am 12.12.2025 [4]). Ab dem
  // 01.01. des Folgejahres lieber keine Zahl als eine aus veralteten Sätzen.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [5]: «Für Personen mit Jahrgang 2001 oder jünger: Befinden Sie sich am 1.1.2026 in Ausbildung?»
  // — Jahrgang 2000 und älter ist 2026 erwachsen, wer im Anspruchsjahr 26 wird. Dieselbe Regel wie
  // LU, AG und SH, hier aus dem amtlichen Antragsformular für genau dieses Jahr.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Art. 16 Abs. 2 [1]: Verhältnisse am 1. Januar; Art. 6 [2]: Neugeborene erst ab dem Folgemonat.
  const kinder = hh.children || [];
  if (kinder.some((c) => /^\d{4}-\d{2}-\d{2}/.test(c.birthDate || '') && c.birthDate.slice(0, 10) > `${jahr}-01-01`)) {
    return orientierung('kindNachStichtag');
  }
  // [5]: «Kinder der Jahrgänge 2008 - 2026» — höchstens 18 im Anspruchsjahr.
  const kinderJahre = kinderAlter(kinder, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;

  // Steuerlicher Kinderabzug im Steuerjahr (gewählt 2024). Aus dem Geburtsdatum eindeutig; aus dem
  // eingetippten Alter (heute, ohne Datum) liegt das Alter Ende 2024 bei «Alter − 2» oder «Alter − 1»
  // — geben die beiden verschiedene Stufen, keine Zahl.
  const abstand = jahr - IPV_AR.steuerjahr;
  let kinderabzug = 0;
  for (const c of kinder) {
    if (/^\d{4}-/.test(c.birthDate || '')) {
      kinderabzug += arKinderabzugSteuer(IPV_AR.steuerjahr - Number(c.birthDate.slice(0, 4)));
    } else {
      const a = Number(c.age);
      const tief = arKinderabzugSteuer(a - abstand);
      if (tief !== arKinderabzugSteuer(a - abstand + 1)) return orientierung('alter');
      kinderabzug += tief;
    }
  }
  // Minderjährige Kinder mit Kinderabzug im Steuerjahr zählen für den Vermögens-Freibetrag.
  const kinderImSteuerjahr = kinder.filter((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? Number(c.birthDate.slice(0, 4)) <= IPV_AR.steuerjahr
    : Number(c.age) - abstand >= 0)).length;

  const vermoegen = vermoegenSumme(f);
  const steuerbaresVermoegen = Math.max(0, vermoegen - IPV_AR.vermoegenFreibetrag.alleinstehend
    - IPV_AR.vermoegenFreibetrag.jeKind * kinderImSteuerjahr);
  // Art. 12 Abs. 1 lit. b [1], Betrag 2026 [3]: harte Grenze. Die App kennt nur die erfassten Posten.
  if (steuerbaresVermoegen > IPV_AR.obergrenzeVermoegen) return orientierung('vermoegen');

  const roh = rohesEinkommenJahr(f);
  if (!(roh >= 0)) return orientierung('einkommenNegativ');
  // Säule 3a (Art. 19 Abs. 1 lit. a/b [1], Art. 5 Abs. 1 lit. a [2]). Das Nettoeinkommen der App
  // trägt die Einzahlung schon; mit Vorsorgeeinrichtung bleibt sie ganz drin (`voll`), ohne wird
  // der Teil bis 10'000 wieder abgezogen (`freibetragOhneSaeule2`, config/kantonsModell.js).
  const saeule3a = Math.max(0, Number(f.pension3a) || 0);
  // Erfasster BVG-Beitrag über 0 → Vorsorgeeinrichtung; ausdrücklich 0 → keine; leer → unbekannt.
  const bvgRoh = v.bvgContribution;
  const bvgLeer = bvgRoh === undefined || bvgRoh === null || String(bvgRoh).trim() === '';
  const bvgWert = Number(bvgRoh);
  const bvBekannt = !bvgLeer && Number.isFinite(bvgWert);
  const mitBV = bvBekannt && bvgWert > 0;
  const massgebend = (mitVorsorge) => einkommenJahr(f, mitVorsorge ? SAEULE_3A.voll : SAEULE_3A.freibetragOhneSaeule2)
    - kinderabzug + IPV_AR.vermoegenAnteil * steuerbaresVermoegen;
  const r = ipvAppenzellAusserrhodenRechnen({ me: massgebend(bvBekannt ? mitBV : true), kinderZahl });
  if (!bvBekannt && saeule3a > 0) {
    const ohneBV = ipvAppenzellAusserrhodenRechnen({ me: massgebend(false), kinderZahl });
    if (Math.round(ohneBV.total) !== Math.round(r.total) || ohneBV.unklar !== r.unklar) {
      return orientierung('saeule2Unbekannt');
    }
  }
  if (r.unklar) return orientierung('mindestanspruch');

  // Art. 7 [2]: höchstens die Prämie mit der ordentlichen Franchise und mit Unfalldeckung — sie ist
  // mindestens so hoch wie die erfasste Prämie. Liegt der Anteil der erwachsenen Person darunter,
  // greift der Deckel sicher nicht; sonst ist er offen (siehe Kopf). Die Kinderprämien kennt die App
  // nicht; der Kinderanteil bleibt ungedeckelt.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  if (r.erwachsen > praemie) return orientierung('praemieFranchise');

  const annual = Math.round(r.total);
  // «höchstens möglich»: bei Einkommen 0 wäre es die ganze Richtprämie — aber höchstens bis zum
  // unbekannten Deckel; die erfasste Prämie ist die untere Schranke dafür.
  // ⟨Fachprüfung #480 K3: vorher an der erfassten Prämie gedeckelt — die ist aber nur die untere
  // Schranke des Deckels, «höchstens möglich» fiel dadurch zu tief aus.⟩
  const maxAnnual = Math.round(IPV_AR.richtpraemie.e + kinderZahl * IPV_AR.kinderBetrag);

  // Die Obergrenze des massgebenden Einkommens ist amtlich als Zahl publiziert [3] — je Haushalt.
  const cantonData = { ...ipvData, maxIncome: r.obergrenze };
  // Keine Prämienregion: eigener Satz statt `ipv.jahrOhneRegion`, der den Aargau nennt.
  const gemeinsam = { canton: 'AR', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltAR', extra: { jahrKey: 'ipv.jahrAR' } };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.arUnterMindestbetrag' : 'ipv.arKeinAnspruch',
    });
  }
  // Art. 22 Abs. 2 lit. a [1]: nach der Frist verwirkt. Dann zieht die App im Budget, in der
  // KK-Last-Karte und im Prämienbeleg nichts ab (data/ipvAbzug.js) und sagt warum — mit dem eigenen
  // Text `ipv.arFristNichtAbgezogen` (Leser wie in FR: `fristNichtAbgezogenKey`).
  // ⟨Fachprüfung #480 W2: vorher bewusst nicht gesetzt, weil die Leser nur den Luzerner Text kannten;
  // das Budget zog dadurch seit dem 31.03. einen verwirkten Betrag ab.⟩
  const fristVorbei = new Date() > new Date(`${IPV_AR.frist.ordentlich}T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, anmeldefristVorbei: fristVorbei, fristNichtAbgezogenKey: 'ipv.arFristNichtAbgezogen' },
    noteKey: fristVorbei ? 'ipv.arFristVorbei' : 'ipv.arFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
