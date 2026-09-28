// Prämienverbilligung (IPV) Kanton Schwyz — Richtprämie minus Selbstbehalt, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt SZ:
//   [1] Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EGzKVG), SRSZ 361.100,
//       Stand SRSZ 1.2.2026 (letzte Änderung vom 21. Mai 2025, in Kraft 1. Januar 2026).
//       § 5 Abs. 1 lit. c/d: Anspruchsgrenze und Vermögensgrenze · § 6 Abs. 1: Selbstbehalt ·
//       § 7: anrechenbares Einkommen · § 9: Richtprämien 90 % · § 10: Höhe, Deckel, Mindestanspruch
//       · § 11 Abs. 1: Gesamtanspruch · § 14 Abs. 1: Kantonsrat legt den Selbstbehalt fest ·
//       § 17: Gesuch bis Ende des Anspruchsjahres, sonst verwirkt · § 18 Abs. 2: unter Fr. 50
//       keine Auszahlung · § 19 Abs. 1: Rückforderung beim Krankenversicherer.
//   [2] Kantonsratsbeschluss zum EGzKVG (KRBzEGzKVG), SRSZ 361.110, Stand SRSZ 1.2.2019,
//       § 1 in der Fassung vom 6. September 2017, in Kraft seit 1. Januar 2019:
//       «Der Selbstbehalt des anrechenbaren Einkommens gemäss § 6 Abs. 1 des Gesetzes beträgt 11%.»
//       ⟨Am 16.09.2026 nicht gefunden; heute über die Systematische Gesetzsammlung sz.ch geöffnet.⟩
//   [3] Vollzugsverordnung zum EGzKVG (VVzEGzKVG), SRSZ 361.111, Stand SRSZ 1.2.2026.
//       § 7a: Kinder mind. 80 %, junge Erwachsene in Ausbildung mind. 50 % · § 9 Abs. 1:
//       Steuerveranlagung höchstens drei Jahre zurück · § 10: Änderungen auf Antrag bis 31. März.
//   [4] SVA Schwyz, «Prämienverbilligung 2026 — Durchschnittsprämien, Richtprämien, Kriterien
//       Grenzwerte» (PDF, erstellt 05.11.2025): Richtprämien 2026 nach Jahrgang, Freibeträge,
//       Vermögensobergrenzen, «minimale Höchsteinkommen» (Mietzinsregion 3, Kinder unter 11).
//   [5] SVA Schwyz, Merkblatt «Prämienverbilligung 2027 im Kanton Schwyz» (PDF, 23.03.2026).
//       Die drei Beispiele rechnen mit den Richtprämien 2026 (5'583.60 / 1'285.20 / 3'931.20)
//       und 11 % — das ist der Prüfstein der Tests (src/config/__tests__/ipvSchwyz.test.js).
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie 11 % des anrechenbaren Einkommens
// übersteigt — aber nur, wenn das anrechenbare Einkommen unter einer Grenze liegt, die aus
// Durchschnittsprämie, EL-Lebensbedarf und EL-Mietzins besteht. An dieser Grenze bricht der
// Betrag ab (Klippe), er läuft nicht auf null aus.
//
// 🛑 DIE GRENZE KANN DIE APP NICHT FÜR JEDE GEMEINDE BESTIMMEN
// § 5 Abs. 1 lit. c [1] knüpft sie an die «anerkannten Ausgaben gemäss dem Bundesgesetz über
// Ergänzungsleistungen … für den allgemeinen Lebensbedarf und für den Mietzins». Der EL-Mietzins
// hängt an der Mietzinsregion der Gemeinde (1, 2 oder 3), der Lebensbedarf der Kinder an ihrem
// Alter (unter/über 11). Keine dieser Grössen ist in der App belegt hinterlegt (gesucht am
// 28.09.2026: `grep -rn "Mietzinsregion\|elMietzins\|EL_" src/data src/config` → nichts).
// Die SVA veröffentlicht die Grenze nur als «minimale Höchsteinkommen … (für Kinder unter
// 11 Jahren, Mietzinsregion 3)» [4] — die tiefste im Kanton. Darunter ist der Anspruch in jeder
// Gemeinde gegeben; darüber hängt er an der Region. Darum:
//   · unter dem minimalen Höchsteinkommen → die App rechnet;
//   · darüber, solange die Formel noch einen Betrag ergäbe → keine Zahl, Grund
//     `szGrenzeMietzinsregion` (sie wäre in Region 3 null, in Region 1 womöglich nicht);
//   · ohne Kinder und über dem Nullpunkt der Formel (5'583.60 / 11 % = 50'760) → sicher kein
//     Anspruch, gleich in welcher Region.
// Die tabellierten Werte gehen bis 4 Kinder; «ab dem 5. Kind erhöht sich der Höchstwert
// weiter» [4] ohne Zahl — ab 5 Kindern darum keine Zahl.
//
// 🛑 DER MINDESTANSPRUCH DER KINDER IST NICHT EINDEUTIG VERTEILT
// § 10 Abs. 2 [1]: «Deckt der Betrag … bei Kindern … den Mindestanspruch … nicht, so wird die
// Prämienverbilligung bis zum Mindestanspruch erhöht.» Wie der Gesamtanspruch auf die Personen
// verteilt wird, bevor man das prüft, sagt keine Quelle. Das Beispiel 3 in [5] (alleinstehend,
// zwei Kinder) zeigt die Differenz 3'836.50 und darunter nur: «Die SVA Schwyz prüft in jedem
// Einzelfall, dass die Prämien für Kinder um mindestens 80 Prozent … verbilligt werden.»
// Anteilig nach Richtprämie verteilt, läge das Kind dort bei 47 % — dann kämen rund 850 Franken
// dazu; am Gesamtbetrag gemessen nichts. Die App rechnet darum mit Kindern nur, solange der
// anteilige Betrag jedes Kindes ohnehin 80 % erreicht (dann sind beide Lesarten gleich), sonst
// `mindestanspruch`. Frage an die SVA: FRAGEN-AN-DIE-AEMTER.md.
//
// BEWUSST NICHT GEBAUT:
//   · Paare, Konkubinat und mehrere Erwachsene — das zweite Einkommen fehlt der App (§ 11 [1]).
//   · junge Erwachsene (Jahrgang 2001–2007): in Ausbildung rechnen sie mit den Eltern (§ 11 Abs. 2
//     [1]), der Ausbildungsstatus fehlt der App; allein erhalten sie eine eigene Richtprämie —
//     beides `alter` wie in LU.
//   · Quellenbesteuerte (§ 5 [3]: 80 % des Bruttolohns), EL-Beziehende (§ 6 Abs. 1 [3], von
//     Amtes wegen) und Sozialhilfebeziehende (§ 6 Abs. 3 [3]: tatsächliche Prämie, höchstens die
//     Richtprämie).
//   · vom anrechenbaren Einkommen: ausserordentlicher Liegenschaftsunterhalt (§ 7 Abs. 2 lit. b
//     [1]) — die App erfasst ihn nicht; das SENKT das Einkommen und erhöht den Betrag. Die Einkäufe
//     in die 2. Säule (lit. c) wirken dagegen NEUTRAL: das Reineinkommen hat sie abgezogen, lit. c
//     rechnet sie wieder auf, und im Nettoeinkommen der App stecken sie ohnehin.
//     ⟨korrigiert 28.09.2026, Fachprüfung #470 💡 4: hier stand, auch die Einkäufe SENKTEN das
//     Einkommen.⟩ Umgekehrt fehlen die übrigen Abzüge der direkten Bundessteuer (Berufsauslagen,
//     Versicherungsabzüge …): das HEBT das Einkommen der App über das amtliche — darum sagt
//     `ipv.szKeinAnspruch`, dass knapp über dem Nullpunkt trotzdem ein Anspruch bestehen kann.
//   · die Anpassung bei wesentlich geänderten Verhältnissen (§ 10 [3], auf Antrag) — der
//     Vorbehalt nennt sie.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich aus [1]–[4]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_SZ = {
  jahr: 2026,
  // [4] «Richtprämien … Für das Jahr 2026»: Erwachsene (ab Jahrgang 2000) · Junge Erwachsene
  // (Jahrgang 2001 - 2007) · Kinder (Jahrgang 2008 und jünger). § 9 [1]: 90 % der
  // Durchschnittsprämien 6'204.00 / 4'368.00 / 1'428.00.
  richtpraemie: { e: 5583.60, j: 3931.20, k: 1285.20 },
  // [2] § 1: «beträgt 11%».
  selbstbehalt: 0.11,
  // § 7 Abs. 2 lit. a [1]: «10% des Reinvermögens, von welchem Freibeträge von Fr. 25 000.-- pro
  // erwachsene Person und Fr. 15 000.-- je Kind abgezogen werden».
  vermoegenAnteil: 0.10,
  freibetrag: { erwachsen: 25000, kind: 15000 },
  // § 5 Abs. 1 lit. d [1]: Reinvermögen nach Abzug der Freibeträge bei Alleinstehenden und
  // Alleinerziehenden höchstens Fr. 250 000.--.
  vermoegensgrenze: 250000,
  // [4] «Höchsteinkommen», Spalte Alleinstehende, ohne Kind bis 4 Kinder — «die minimalen
  // Höchsteinkommen im Kanton Schwyz (für Kinder unter 11 Jahren, Mietzinsregion 3)».
  hoechsteinkommenMinimal: [43554, 56052, 65845, 74343, 80161],
  // [4] zweite Tabelle: «Darüber hinaus haben Kinder bis zum 18. Altersjahr Anspruch auf eine
  // Verbilligung von mindestens 80% der Richtprämie … Dafür gelten folgende Höchstgrenzen»,
  // Alleinstehende 0–4 Kinder — ebenfalls die minimalen Werte (Mietzinsregion 3, Kinder unter 11).
  // Darunter ist der Anspruch DER KINDER in jeder Gemeinde sicher; den Gesamtbetrag gibt sie nicht.
  // Für beide Tabellen gilt: «ab dem 5. Kind erhöht sich der Höchstwert weiter» — der Wert für
  // 4 Kinder ist darum eine belegte Untergrenze für 5 und mehr.
  // (Fachprüfung #470 ⚠️ 1, 28.09.2026: die zweite Tabelle fehlte, der Grund-Text klang für
  // Familien wie «vielleicht gar kein Anspruch».)
  hoechsteinkommenKinderMinimal: [43554, 63117, 74491.25, 84306.75, 91222.25],
  // § 7a Abs. 1 [3]: Kinder «um mindestens 80 Prozent».
  mindestanteilKind: 0.8,
  // § 18 Abs. 2 [1]: «Beiträge von gesamthaft weniger als 50 Franken im Jahr werden nicht
  // ausbezahlt und verfallen.»
  mindestbetrag: 50,
};

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen die Beispiele [5] prüfen
// können. `personen`: 'e' Erwachsene, 'j' junge Erwachsene, 'k' Kinder (j und e nur für die
// Beispiele; die App ruft sie mit einer erwachsenen Person und Kindern auf). `me` = anrechenbares
// Einkommen im Jahr. Die Grenze nach § 5 Abs. 1 lit. c prüft der Einstieg, nicht diese Funktion.
export function ipvSchwyzRechnen({ personen, me }) {
  const p = IPV_SZ;
  const refs = personen.map((c) => p.richtpraemie[c]);
  const summe = refs.reduce((a, b) => a + b, 0);
  // me nie negativ: sonst wüchse der Betrag über die Summe der Richtprämien hinaus, was § 10
  // Abs. 1 [1] («Differenz zwischen der Richtprämie und dem Selbstbehalt») nicht zulässt.
  const selbstbehalt = p.selbstbehalt * Math.max(0, me);
  // Auf Rappen gerundet, wie die Beispiele [5] rechnen: sonst bliebe am Nullpunkt (50'760) ein
  // Gleitkomma-Rest von 1e-12 übrig und zählte als «Anspruch unter dem Mindestbetrag».
  const differenz = Math.max(0, Math.round((summe - selbstbehalt) * 100) / 100);
  const anteil = summe > 0 ? differenz / summe : 0;
  // Unklar, sobald ein Kind anteilig unter 80 % fiele (siehe Kopf). Junge Erwachsene sind hier
  // nicht gebaut; für die Beispiele genügt die Differenz.
  const kinder = personen.filter((c) => c === 'k').length;
  const mindestUnklar = kinder > 0 && anteil < p.mindestanteilKind;
  const erwachseneAnteil = personen.reduce((s, c, i) => (c === 'e' ? s + anteil * refs[i] : s), 0);
  return {
    summe, selbstbehalt, differenz, anteil, mindestUnklar, erwachseneAnteil,
    erwachseneSumme: personen.reduce((s, c, i) => (c === 'e' ? s + refs[i] : s), 0),
    // Rechnerischer Nullpunkt: 5'583.60 / 11 % = 50'760 für eine erwachsene Person.
    nullpunkt: summe / p.selbstbehalt,
    grund: differenz >= p.mindestbetrag ? null : (differenz > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für SZ mit Beleg. Keine Prämienregionen
// (BAG: eine Region im Kanton; die Richtprämie gilt kantonsweit, § 9 [1]) — darum kein
// `lookupPLZ`, und im Register `brauchtPLZ: false`.
export function ipvSchwyz(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const p = IPV_SZ;
  const jahr = p.jahr;
  // Die Richtprämien und Höchsteinkommen 2027 veröffentlicht die SVA «ab Anfang November 2026»
  // [5]; am 28.09.2026 lagen sie nicht vor. Ab dem 01.01.2027 lieber keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Alter nach Jahrgang: [4] führt 2026 «Erwachsene (ab Jahrgang 2000)» — erwachsen ist, wer im
  // Anspruchsjahr 26 wird. Dieselbe Regel wie LU und AG, hier mit der amtlichen Tabelle für
  // genau dieses Anspruchsjahr belegt.
  // ⚠️ Der Stichtag der «persönlichen Verhältnisse» ist in den Quellen nicht einheitlich:
  // § 12 Abs. 1 [1] sagt «am 1. April des dem Anspruchsjahr vorangehenden Jahres», das
  // Merkblatt [5] «am 1. Januar». Für das Alter entscheidet die Jahrgangstabelle [4]; der
  // Widerspruch steht als Frage in FRAGEN-AN-DIE-AEMTER.md.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: Jahrgang 2008 und jünger [4], also höchstens 18 im Anspruchsjahr — beim eingetippten
  // Alter ein Jahr dazu (wie LU, vorsichtig an der 18).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;
  // Ab dem 5. Kind ist kein eigener Wert veröffentlicht, nur «erhöht sich … weiter» [4]: der Wert
  // für 4 Kinder ist eine belegte Untergrenze. ⟨Bis zur Fachprüfung #470 hier: ab 5 Kindern immer
  // `szGrenzeMietzinsregion` — auch bei 6'000 Einkommen, mit dem falschen Satz «liegt über».⟩
  const tabelle = Math.min(kinderZahl, p.hoechsteinkommenMinimal.length - 1);

  const vermoegen = vermoegenSumme(f);
  const vermoegenNachFreibetrag = Math.max(0, vermoegen - p.freibetrag.erwachsen - p.freibetrag.kind * kinderZahl);
  // § 5 Abs. 1 lit. d [1]: über der Grenze kein Anspruch. Die App kennt nur die erfassten Posten,
  // nicht das Reinvermögen — darum Orientierung statt «kein Anspruch».
  if (vermoegenNachFreibetrag > p.vermoegensgrenze) return orientierung('vermoegen');

  // 🛑 Ein negatives Einkommen ist ein Vertipper und endete sonst über `Math.max(0, …)` beim
  // Höchstbetrag (Befund BE, Fachprüfung 23.09.2026).
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');
  // § 7 Abs. 1 [1]: Reineinkommen der direkten Bundessteuer — die Säule 3a ist darin abgezogen
  // und wird NICHT aufgerechnet (Regel `imReineinkommenAbgezogen` im Rahmen). Die Bemessung
  // stützt sich auf die jüngste rechtskräftige Veranlagung, höchstens drei Jahre zurück (§ 9
  // Abs. 1 [3]), die «am 1. April des dem Anspruchsjahr vorangehenden Jahres im Kanton vorliegt»
  // (§ 8 Abs. 1 [1]) — für 2026 also 2023 oder 2024, nicht 2025. Sicher abgezogen ist darum
  // min(7'056, 20 % des Netto-Erwerbseinkommens); darüber keine Zahl.
  // ⟨28.09.2026, Fachprüfung #470 💡 5: vorher 2023–2025; ohne Wirkung, das Minimum war dasselbe.⟩
  const jahre = { bemessungsjahre: [jahr - 3, jahr - 2], anspruchsjahr: jahr };
  const regel = SAEULE_3A.imReineinkommenAbgezogen;
  if (regel.widerlegt(f, rohesEinkommenJahr(f), jahre)) return orientierung('saeule3aAbzugUnklar');
  const me = Math.max(0, einkommenJahr(f, regel, jahre) + p.vermoegenAnteil * vermoegenNachFreibetrag);

  const r = ipvSchwyzRechnen({ personen: ['e', ...kinderJahre.map(() => 'k')], me });
  const cantonData = { ...ipvData, maxIncome: null };
  const gemeinsam = {
    canton: 'SZ', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltSZ',
    extra: { jahrKey: 'ipv.jahrEineRegion' },
  };

  // Ohne Kinder und über dem Nullpunkt: kein Anspruch, gleich in welcher Mietzinsregion.
  if (kinderZahl === 0 && r.differenz <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.szKeinAnspruch' });
  }
  // § 5 Abs. 1 lit. c [1]: «kleiner ist als» — am minimalen Höchsteinkommen selbst also nicht
  // mehr sicher. Darüber hängt der Anspruch an Mietzinsregion und Kinderalter.
  if (kinderZahl === 0) {
    if (me >= p.hoechsteinkommenMinimal[0]) return orientierung('szGrenzeMietzinsregion');
  } else {
    // Mit Kindern: über der Kinder-Tabelle ist gar nichts sicher; darunter sicher der Anspruch der
    // Kinder auf mindestens 80 % (§ 5 Abs. 2 [1], § 7a [3], zweite Tabelle [4]) — aber nicht der
    // Gesamtbetrag (Mietzinsregion über der ersten Tabelle, Verteilung des Mindestanspruchs
    // darunter). Dann ein eigener Grund, der das Sichere sagt, statt «vielleicht kein Anspruch».
    if (me >= p.hoechsteinkommenKinderMinimal[tabelle]) return orientierung('szGrenzeMietzinsregion');
    // ⚠️ Die erste Tabelle ändert hier heute nichts: mit Kindern ist `mindestUnklar` schon ab rund
    // 12'500 (1 Kind) bis 21'800 (5 Kinder) wahr, weit unter 56'052. Sie steht da, damit die Regel
    // stimmt, sobald die SVA die Verteilung beantwortet (Frage 2) und `mindestUnklar` wegfällt.
    // (Mutationsprobe 28.09.2026: `[tabelle]` → `[0]` bleibt grün — aus diesem Grund.)
    if (me >= p.hoechsteinkommenMinimal[tabelle] || r.mindestUnklar) return orientierung('szKinderMindestanspruch');
  }

  // § 10 Abs. 1 [1]: höchstens die «tatsächlich geschuldeten Prämien». Die App kennt nur die
  // Prämie der erwachsenen Person — nur deren Anteil wird gedeckelt (`deckelnProPerson`).
  // ⚠️ Ob die SVA den Deckel je Person oder auf den Haushalt anwendet, sagt die Quelle nicht
  // («wird der Anspruch plafoniert», [5]); je Person ist die engere Lesart.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.differenz, r.erwachseneAnteil, praemie);
  const maxAnnual = deckelnProPerson(r.summe, r.erwachseneSumme, praemie);
  // § 18 Abs. 2 [1]: gesamthaft unter 50 Franken wird nichts ausbezahlt — nach dem Deckel
  // geprüft, weil es um den ausbezahlten Betrag geht.
  if (annual < p.mindestbetrag) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: annual > 0 ? 'ipv.szUnterMindestbetrag' : 'ipv.szKeinAnspruch' });
  }
  // § 17 Abs. 1/2 [1]: Gesuch bis Ende des Anspruchsjahres, danach verwirkt. Im Anspruchsjahr
  // läuft die Frist also immer noch — nach dem 31.12. greift ohnehin `jahrVorbei`. Darum kein
  // `anmeldefristVorbei`.
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: 'ipv.szFristLaeuft',
    noteParams: { jahr, vorjahr: jahr - 1 },
  });
}
