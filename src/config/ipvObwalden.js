// Prämienverbilligung (IPV) Kanton Obwalden — amtliches linear-progressives Selbstbehalt-Modell,
// Jahr 2026 (K31). Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026, jede Adresse mit Gegenprobe), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt OW. Gelesen über die API der Gesetzessammlung
// (https://gdb.ow.ch/api/de/texts_of_law/<nr>/show_as_json; erfundene 851.99 → 404) — die
// `/app/…`-Seite ist eine Hülle:
//   [1] GDB 851.12 Kantonsratsbeschluss über den Selbstbehalt … für das Jahr 2026, «Aktuelle
//       Version in Kraft seit: 01.01.2026 (Beschlussdatum: 26.03.2026)», Erstfassung. Ziff. 1:
//       9,50 % bis Fr. 35 000, danach +0,01 % je Fr. 100.
//   [2] GDB 851.1 Einführungsgesetz zum KVG (EG KVG). Art. 2 Abs. 1: Anspruch, soweit die
//       Richtprämien den Selbstbehalt übersteigen · Art. 2 Abs. 5: höchstens die geschuldeten
//       Prämien. Fassung bis 31.03.2026 (unter der der Beschluss [1] gefasst wurde) und seit
//       01.04.2026 gelesen.
//   [3] GDB 851.11 Verordnung zum EG KVG (EV KVG), Fassung in Kraft 18.12.2025–31.05.2026 (für
//       die Frist 2026) und seit 01.06.2026; Art. 7, 7a und 14 in beiden gleich.
//       Art. 5: Richtprämien · Art. 6 Abs. 2/3: Verhältnisse am 1. Januar, Gesamtanspruch ·
//       Art. 7 Abs. 1/2/4/5/6: Einkommensgrenzen, Mindestanspruch Kinder, Bemessung ·
//       Art. 7a: anrechenbares Einkommen · Art. 8 Abs. 5: Gesuch bei 25 % weniger Einkommen ·
//       Art. 10: Antrag und Frist · Art. 14 Abs. 2–4, 6: Aufteilung, Rundung, Mindestbetrag ·
//       Art. 16 Abs. 1: Rückerstattung.
//   [4] Ausgleichskasse / IV-Stelle Obwalden, Merkblatt «Prämienverbilligung 2026», Stand Januar
//       2026 — Richtprämien in Franken, Jahrgänge, Einsendeschluss 31. Mai 2026, Kontrollwert
//       «Bei einem anrechenbaren Einkommen von 45'000 Franken beträgt er beispielsweise 10.5%».
//   [5] Ausgleichskasse Obwalden, IPV-Rechner (www.akow.ch/ipv-rechner) — die Parameter stehen
//       im Seitenquelltext (`window.ipv_settings`: Richtprämien 5'018.40 / 3'570 / 1'380,
//       35 000, 9.5, 0.01 je 100, Abzug 7'000) und die Rechnung als Skript. Gelesen, nicht
//       ausgefüllt. Kein durchgerechnetes Beispiel mit Franken-Ergebnis gefunden.
//   [6] GDB 641.4 Steuergesetz, Art. 54 (steuerfreier Betrag), Fassung 2024 (in Kraft
//       01.01.–31.12.2024) über …/641.4/versions/1836/show_as_json.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie den Selbstbehalt übersteigt; der
// Selbstbehalt ist 9,5 % des anrechenbaren Einkommens und steigt ab 35 000 um 0,01
// Prozentpunkte je 100 Franken — und über einer harten Grenze (50 000, mit Kindern 75 000)
// gibt es gar nichts.
//
// WAS OBWALDEN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
//
// 1. HARTE EINKOMMENSGRENZE, publiziert als Zahl (Art. 7 Abs. 1/2 [3], [4]). Für Alleinstehende
//    ohne Kinder wirkt sie nie (die Formel ist schon bei ≈ 46 931 bei null); mit Kindern schon —
//    ab fünf Kindern bricht der Anspruch an der Grenze ab. Darum `maxIncome` im Ergebnis:
//    50 000 bzw. 75 000 anrechenbares Einkommen.
//
// 2. KINDER: MINDESTANSPRUCH ALS BODEN, der die übrigen kürzt. Unter 50 000 erhält jedes Kind
//    mindestens 80 % seiner Richtprämie, ab dem vierten Kind 100 % (Art. 7 Abs. 4/5 [3]); greift
//    das, «sind die übrigen Prämienverbilligungen … anteilsmässig zu kürzen» (Art. 14 Abs. 3).
//    Die Summe ist also max(allgemeiner Anspruch, Summe der Mindestansprüche). Anders als UR/LU
//    zählt das Kind in der Summe der Richtprämien voll ([5] `childrenReward`).
//
// 3. EINE PRÄMIENREGION — kantonale Richtprämien je Altersgruppe (Art. 5 [3]); die BAG-Daten
//    führen OW mit Region 0. `brauchtPLZ: false`, Anzeige `ipv.jahrOW`.
//
// 4. ANTRAG MIT VERWIRKUNG. Für 2026 bis 31. Mai 2026 (Art. 10 Abs. 3 [3] in der damals gültigen
//    Fassung, [4]); seit 01.06.2026 steht dort «30. April». Verpasst ⇒ verwirkt (Art. 10 Abs. 7).
//    Darum `anmeldefristVorbei`.
//
// 5. 🛑 ÜBER 60 000 GIBT ES ZWEI GELTENDE TEXTE — dort keine Zahl, wo es darauf ankommt.
//    Der Beschluss [1] (26.03.2026) steigert den Satz ohne Obergrenze; ab 60 000 liegt er über
//    12 %. Seit 01.04.2026 sagt das EG KVG [2] Art. 2 Abs. 2 aber «zwischen 9,0 und 12,0 Prozent»,
//    ohne Übergangsbestimmung — und die Verfügungen 2026 ergehen erst danach. Welche Regel die
//    Ausgleichskasse anwendet, sagt keine Quelle (der Rechner [5] deckelt nicht, ist aber ein
//    Rechner). ⟨Fachprüfung #476, B2, 28.09.2026: hier stand vorher als Tatsache «Der Selbstbehalt
//    2026 hat keine Obergrenze», weil der Beschluss unter der alten Fassung fiel. Daraus folgt
//    nicht, welches Recht auf Verfügungen nach dem 01.04. angewendet wird.⟩ Darum: liegt der Satz
//    über 12 % UND hängt der Betrag davon ab, zeigt die App keine Zahl (`owSelbstbehaltRahmen`).
//    Betroffen sind nur Haushalte mit Kindern (ohne Kinder endet der Anspruch bei 50 000);
//    die Differenz wäre bis rund 1 125 Franken im Jahr. Frage 17/6 an die AK Obwalden.
//
// GEWÄHLT, NICHT BELEGT (je im Test benannt):
//   · Steigerung stetig (je Franken 0,0001 Punkte), nicht in 100er-Stufen — wie der Rechner [5];
//     Unterschied höchstens rund 5 Franken im Jahr.
//   · Rundung «aufzurunden … auf fünf Rappen» (Art. 14 Abs. 4) je Person, wie die Aufteilung.
//   · Mindestbetrag 100 (Art. 14 Abs. 6, «Beiträge») auf der Summe, nicht je Person — wirkt nur,
//     wenn ein einzelner Anteil unter 100 liegt, die Summe darüber; Unterschied < 100 im Jahr.
//   · Kinder mit Jahrgang 2008 (18 im Anspruchsjahr) rechnet die App nicht. Über den STATUS sind
//     sich EV Art. 5 Abs. 2 [3] und Merkblatt [4] einig (Kind, Richtprämie 1'380); offen ist, ob
//     es im Antrag der Eltern mitzählt — das Merkblatt lässt «Jugendliche (ab Jahrgang 2008)»
//     einen eigenen Antrag stellen. Grund `kind18`. ⟨Fachprüfung #476, K1: vorher stand hier
//     «Widerspruch». Der echte Textwiderspruch liegt bei Jahrgang 2007 — am 1.1.2026 18 Jahre,
//     nach EV Kind, nach Merkblatt junge erwachsene Person; die App rechnet beides nicht.⟩
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Paare und mehrere Erwachsene — Gesamtanspruch (Art. 6 Abs. 3 [3]), zweites Einkommen fehlt.
//   · junge Erwachsene (Jahrgang 2001–2007, eigene Richtprämie 3'570; in Ausbildung 50 % bei
//     eigenem Einkommen unter 25 000, Art. 7 Abs. 3) — Ausbildungsstatus fehlt der App.
//   · Quellenbesteuerte (Art. 8 Abs. 2: 75 % des Bruttoerwerbseinkommens, pro rata), EL- und
//     Sozialhilfebeziehende (Art. 8 Abs. 1: volle Richtprämie), Härtefälle (Art. 8 Abs. 4),
//     Neuzuzüger (Art. 7 Abs. 6 Satz 2).
//   · die amtlichen Abzüge vom anrechenbaren Einkommen (Art. 7a lit. b, d–f, k: Berufsauslagen,
//     Versicherungsabzug, Krankheits- und Betreuungskosten, Schuldzinsen; lit. c Unterhalt zieht sie ab) — die App
//     kennt sie nicht; das Einkommen liegt darum eher zu HOCH, der Betrag eher zu TIEF. Der
//     Vorbehalt sagt es. Liegenschaftsverluste (lit. j) ebenso.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_OW = {
  jahr: 2026,
  // Art. 7 Abs. 6 [3]: «die vorletzte Steuerperiode» — [4]: «definitive Steuerveranlagung 2024».
  basisjahrAbstand: 2,
  // [4] «Erwachsene ab Jahrgang 2000 5'018.40 · Junge Erwachsene mit Jahrgang 2001 bis 2007 3'570.00 ·
  // Kinder und Jugendliche bis Jahrgang 2008 1'380.00»; gleich in [5] `benchmark`.
  // Rechtsgrundlage Art. 5 [3]: 85 % (Kinder 100 %) der EDI-Durchschnittsprämien — die
  // EDI-Verordnung selbst ist nicht gelesen.
  richtpraemie: { e: 5018.40, j: 3570, k: 1380 },
  // [1] Ziff. 1: «bis Fr. 35 000.– anrechenbares Einkommen 9,50 Prozent, danach steigt der
  // Selbstbehalt pro Fr. 100.– anrechenbares Einkommen um je 0,01 Prozent.»
  selbstbehalt: { satz: 9.5, bis: 35000, jeHundert: 0.01 },
  // Art. 7 Abs. 1/2 [3]: «weniger als Fr. 50 000.–», mit Kindern «erhöht sich … um Fr. 25 000.–»
  // — [4] und [5] lesen das als Grenze 75 000.
  grenze: { ohneKinder: 50000, mitKindern: 75000 },
  // Art. 7 Abs. 4/5 [3]: unter 50 000 mindestens 80 % je Kind, ab dem vierten Kind 100 %.
  mindestanspruch: { grenze: 50000, kind: 0.8, abViertemKind: 1.0 },
  // Art. 7a lit. h [3]: «Fr. 7 000.– pro Kind» (lit. g 7 000 für Ehepaare — nicht gebaut).
  kinderabzug: 7000,
  // Art. 7a lit. d [3] i. V. m. StG Art. 35 Abs. 1 lit. g [6] (Fassung 2024): Versicherungsprämien
  // «bis zum Gesamtbetrag von … Fr. 1 700.– für die übrigen Steuerpflichtigen», erhöht «um Fr. 700.-
  // für jedes Kind». Genommen ist der tiefere Satz (die Erhöhung «um die Hälfte» ohne Beiträge nach
  // lit. d/e setzt voraus, dass keine AHV-/BVG-Beiträge bezahlt werden — das weiss die App nicht).
  // ⟨Fachprüfung #476, W4⟩
  versicherungsabzug: { alleinstehend: 1700, jeKind: 700 },
  // Art. 7a lit. i [3]: «10 Prozent des steuerbaren Vermögens (Art. 43 bis 54 StG)».
  vermoegenAnteil: 0.10,
  // Art. 54 Abs. 1 StG [6], Fassung 2024: «c. für alle andern Steuerpflichtigen Fr. 25 000.–»,
  // «b. … Fr. 10 000.– für jedes Kind». Seit 2016 unverändert (Änderungstabelle).
  steuerfreierBetrag: { alleinstehend: 25000, jeKind: 10000 },
  // Art. 14 Abs. 6 [3]: «Beiträge unter Fr. 100.– werden nicht ausbezahlt.»
  mindestbetrag: 100,
};

// Selbstbehalt in PROZENTPUNKTEN. [1] Ziff. 1 — stetig gerechnet wie der Rechner [5]
// (`brackets = incomeDifference / 100`, ohne Abrundung).
export function owSelbstbehaltProzent(ae) {
  const p = IPV_OW.selbstbehalt;
  return p.satz + p.jeHundert * Math.max(0, ae - p.bis) / 100;
}

// Art. 14 Abs. 4 [3]: «so auf den Betrag aufzurunden, dass er einer monatlichen
// Prämienverbilligung entspricht, welche auf fünf Rappen gerundet ist.» Liefert den Jahresbetrag.
export function owJahrAufgerundet(jahresbetrag) {
  if (!(jahresbetrag > 0)) return 0;
  return (Math.ceil((jahresbetrag / 12) * 20 - 1e-9) / 20) * 12;
}

// Die Rechnung selbst — ohne App-Daten. `ae` = anrechenbares Einkommen (nach Kinderabzug).
// `satzDeckel` (Prozentpunkte, optional): die Lesart «Rahmen 9–12 %» des EG KVG seit 01.04.2026 —
// nur für den Vergleich, siehe Kopf Punkt 5. Liefert Jahresbeträge in CHF, ungerundet.
export function ipvObwaldenRechnen({ kinderZahl = 0, ae, satzDeckel = Infinity }) {
  const p = IPV_OW;
  const r = p.richtpraemie;
  const ae0 = Math.max(0, ae);
  const maximal = r.e + kinderZahl * r.k;
  const grenze = kinderZahl > 0 ? p.grenze.mitKindern : p.grenze.ohneKinder;
  const leer = { total: 0, anteilErwachsen: 0, anteileKinder: [], maximal, grenze, mindestGilt: false };
  // Art. 7 Abs. 1 [3]: «weniger als» — an der Grenze selbst schon kein Anspruch.
  if (ae0 >= grenze) return { ...leer, grund: 'ueberGrenze' };

  const prozent = Math.min(owSelbstbehaltProzent(ae0), satzDeckel);
  const allgemein = Math.max(0, maximal - (prozent / 100) * ae0);
  // Art. 14 Abs. 2 [3]: Aufteilung «wie sich die kantonalen Richtprämien zusammensetzen».
  const anteilKindRoh = maximal > 0 ? (allgemein * r.k) / maximal : 0;
  // Art. 7 Abs. 4/5 [3]: der Mindestanspruch ist ein Boden je Kind.
  const mindestGilt = kinderZahl > 0 && ae0 < p.mindestanspruch.grenze;
  const anteileKinder = Array.from({ length: kinderZahl }, (_, i) => {
    const boden = mindestGilt ? (i < 3 ? p.mindestanspruch.kind : p.mindestanspruch.abViertemKind) * r.k : 0;
    return Math.max(anteilKindRoh, boden);
  });
  const summeKinder = anteileKinder.reduce((s, x) => s + x, 0);
  // Art. 14 Abs. 3 [3]: greift der Mindestanspruch, werden die übrigen anteilsmässig gekürzt —
  // bei einer erwachsenen Person heisst das: sie erhält, was vom allgemeinen Anspruch bleibt.
  const anteilErwachsen = Math.max(0, allgemein - summeKinder);
  const total = anteilErwachsen + summeKinder;
  return {
    total, anteilErwachsen, anteileKinder, maximal, grenze, prozent, allgemein, mindestGilt,
    // Zwei Gründe für «kein Betrag» wie SG/LU: über der Grenze (Formel 0 oder harte Grenze) und
    // unter dem Mindestbetrag.
    grund: total >= p.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für OW mit Beleg. `lookupPLZ` braucht
// Obwalden nicht (eine Region).
export function ipvObwalden(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_OW.jahr;
  // Werte 2027 legt nach EG KVG Art. 2 Abs. 2 [2] (seit 01.04.2026) der Regierungsrat im Vorjahr
  // fest; am 28.09.2026 nicht publiziert gefunden. Ab 01.01.2027 keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Erwachsen: [4] «Erwachsene ab Jahrgang 2000» — eine amtliche Jahrgangstabelle für genau
  // dieses Anspruchsjahr, also `imAnspruchsjahr` wie LU. (Der Rechner [5] zählt schon 25-Jährige
  // als erwachsen; das Merkblatt nicht — die App folgt der engeren Lesart.)
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  // Junge Erwachsene (Jahrgang 2001–2007 [4]) stellen einen eigenen Antrag; ihr Mindestanspruch
  // hängt an der Ausbildung (Art. 7 Abs. 3 [3]), die die App nicht kennt. Eigener Grund statt
  // «alter» («Geburtsdatum fehlt / mit den Eltern») — Befund W3 der Fachprüfung zu Uri (#464).
  if (!ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung(jahr - geburt >= 19 ? 'ausbildung' : 'alter');
  // Ein im Anspruchsjahr geborenes Kind zählt erst im Folgejahr (Art. 6 Abs. 2 [3]: Verhältnisse
  // am 1. Januar, Änderungen «im Folgejahr berücksichtigt»).
  const kinder = (hh.children || []).filter((c) => !(/^\d{4}-/.test(c.birthDate || '')
    && Number(c.birthDate.slice(0, 4)) >= jahr));
  // Alter im Anspruchsjahr, eingetippt ein Jahr dazu (vorsichtig an der Grenze).
  const kinderJahre = kinderAlter(kinder, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // 🛑 Jahrgang 2008 (18 im Anspruchsjahr) und älter: keine Zahl — siehe Kopf, «gewählt». Eigener
  // Grund: die Person ist allein, «haushalt» (Paare) wäre der falsche Satz (Fachprüfung #476, W3).
  if (kinderJahre.some((a) => a > 17)) return orientierung('kind18');

  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  const kinderZahl = kinderJahre.length;
  // Art. 7a [3]: Total der Einkünfte − Abzüge (die die App nicht kennt) − 7 000 je Kind
  // + 10 % des steuerbaren Vermögens. Die Säule 3a steht nicht unter den Abzügen (Art. 35 Abs. 1
  // lit. e StG fehlt in der Liste) — sie bleibt im Einkommen: Regel `voll`.
  const steuerbaresVermoegen = Math.max(0, vermoegenSumme(f)
    - IPV_OW.steuerfreierBetrag.alleinstehend - IPV_OW.steuerfreierBetrag.jeKind * kinderZahl);
  // Art. 7a lit. c [3]: «unter Abzug der Unterhaltsbeiträge und dauernden Lasten». Die bezahlten
  // Alimente kennt die App (`finanzen.alimentePaid`, monatlich) — abgezogen seit 28.09.2026, nach
  // dem Befund W1 der Fachprüfung am gleichen Punkt in Uri (#464). Unlesbar/negativ = 0.
  const unterhaltJahr = 12 * Math.max(0, Number(f.alimentePaid) || 0);
  // EG KVG Art. 2 Abs. 5 [2]: höchstens die geschuldeten Prämien — und die Prämie braucht auch der
  // Versicherungsabzug, darum schon hier.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  // Versicherungsabzug: bezahlt ist mindestens die eigene Prämie; abgezogen höchstens der Rahmen.
  const versicherung = Math.min(praemie,
    IPV_OW.versicherungsabzug.alleinstehend + IPV_OW.versicherungsabzug.jeKind * kinderZahl);
  const ae = Math.max(0, einkommenJahr(f, SAEULE_3A.voll)
    - unterhaltJahr
    - versicherung
    + IPV_OW.vermoegenAnteil * steuerbaresVermoegen
    - IPV_OW.kinderabzug * kinderZahl);

  const r = ipvObwaldenRechnen({ kinderZahl, ae });
  // 🛑 Kopf Punkt 5: über 12 % zwei geltende Texte. Keine Zahl, wenn der Betrag davon abhängt.
  if (owSelbstbehaltProzent(ae) > 12) {
    const gedeckelt = ipvObwaldenRechnen({ kinderZahl, ae, satzDeckel: 12 });
    if (Math.abs(gedeckelt.total - r.total) > 0.005) return orientierung('owSelbstbehaltRahmen');
  }

  // Rundung wie ausbezahlt (Art. 14 Abs. 4), je Person; der Deckel NACH der Rundung, nur auf den
  // Anteil der erwachsenen Person (die Kinderprämien kennt die App nicht).
  const erwachsen = owJahrAufgerundet(r.anteilErwachsen);
  const kinderSumme = r.anteileKinder.reduce((s, x) => s + owJahrAufgerundet(x), 0);
  const annual = r.grund ? 0 : deckelnProPerson(erwachsen + kinderSumme, erwachsen, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, IPV_OW.richtpraemie.e, praemie);

  // Die Grenze ist als Zahl publiziert (Art. 7 Abs. 1/2 [3], [4]) — sie gilt für das
  // ANRECHENBARE Einkommen, nicht den Lohn.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const basisjahr = jahr - IPV_OW.basisjahrAbstand;
  const gemeinsam = {
    canton: 'OW', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltOW',
    extra: { basisjahr, jahrKey: 'ipv.jahrOW' },
  };
  if (!(annual > 0)) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.owUnterMindestbetrag' : 'ipv.owKeinAnspruch',
    });
  }
  // Art. 10 Abs. 3/7 [3]: für 2026 Antrag bis 31. Mai 2026, danach verwirkt.
  const fristVorbei = new Date() > new Date(`${jahr}-05-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: {
      ...gemeinsam.extra, anmeldefristVorbei: fristVorbei,
      // Wo nichts abgezogen wird, sagen KK-Karte, Prämien-Beleg und Budget den Obwaldner Grund
      // (verwirkt, nicht anteilig) — Weg wie FR: `fristHinweisKey` in data/ipvAbzug.js.
      fristNichtAbgezogenKey: 'ipv.owFristNichtAbgezogen',
    },
    noteKey: fristVorbei ? 'ipv.owFristVorbei' : 'ipv.owFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
