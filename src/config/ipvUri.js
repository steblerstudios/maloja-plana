// Prämienverbilligung (IPV) Kanton Uri — amtliches Selbstbehalt-Modell, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026, jede Adresse mit Gegenprobe), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt UR:
//   [1] Reglement über die Prämienverbilligung für die Krankenpflege-Grundversicherung
//       (Prämienverbilligungsreglement), RB 20.2213, «Aktuelle Version in Kraft seit: 01.11.2024
//       (Beschlussdatum: 24.09.2024)», keine künftige Version erfasst. Gelesen über
//       https://rechtsbuch.ur.ch/api/de/texts_of_law/20.2213/show_as_json (200) — erfundene
//       Nummer 20.2299 → 404.
//       Art. 3 Abs. 1/3: Gesamtanspruch, Verhältnisse am 1. Januar · Art. 4 Abs. 2/3: Selbstbehalt,
//       Kinder mind. 80 % · Art. 5: Altersgruppen · Art. 6 Abs. 3: Kinder höchstens 20 % anrechenbar ·
//       Art. 7 Abs. 1–3: PV-Einkommen, Steuerjahr zwei Jahre vor dem Anspruchsjahr ·
//       Art. 10: von Amtes wegen · Art. 11: Antrag · Art. 14 Abs. 2/3: Aufteilung, Rundung auf
//       fünf Rappen · Art. 18: Rückforderung bei den Versicherern.
//   [2] Medienmitteilung «22,4 Millionen Franken für die Verbilligung der Krankenkassenprämien
//       2026», Gesundheits-, Sozial- und Umweltdirektion Uri, 18.12.2025, Abschnitt «Urner
//       Steuerungsgrössen für die Prämienverbilligung 2026» — Richtprämien, Selbstbehalt 8,5 %,
//       Vermögensanteil 15 %, Obergrenze des mittleren PV-Einkommens 90'000.
//   [3] Sozialversicherungsstelle Uri, «Berechnung Prämienverbilligung 2026»
//       (SVS.Uri.IPV.Berechnungsformular_2026.xlsx). Ein LEERES Rechenblatt mit den Formeln der
//       SVS — kein durchgerechnetes Beispiel. Es ist der Prüfstein der Tests: jede Formelzelle
//       ist in ipvUri.test.js als eigene Rechnung nachgebaut (Zellen M41/M42, R41/R42, O43,
//       O46, R47, R49).
//   [4] Gesetz über die direkten Steuern im Kanton Uri (StG, RB 3.2211), Art. 55 Abs. 1 und
//       Art. 56 Abs. 1: «steuerbares Vermögen» = Reinvermögen minus Sozialabzüge. Fassung
//       2025 (in Kraft 01.01.–31.12.2025) über
//       https://rechtsbuch.ur.ch/api/de/texts_of_law/3.2211/versions/1087/show_as_json.
//   [5] SVS Uri, Antragsformular «Prämienverbilligung 2026» (Jahrgänge der Kinder) und
//       Webseite «Prämienverbilligung (IPV)» (wer sich anmelden muss).
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der anrechenbaren Richtprämien, soweit sie 8,5 % des
// PV-Einkommens übersteigt — ein fester Prozentsatz, der Abbau ist also LINEAR (8,5 Rappen je
// Franken). Kinder zählen darin bis 90'000 PV-Einkommen nur mit 20 % und erhalten die übrigen
// 80 % fest.
//
// WAS URI VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
//
// 1. EINE EINZIGE PRÄMIENREGION. Das Reglement kennt nur Altersgruppen (Art. 5 [1]), die
//    BAG-Daten führen Uri als Kanton mit einer Region. Darum `brauchtPLZ: false` und kein
//    `region` im Ergebnis; die Anzeige nennt das mit `ipv.jahrUR` (sonst stünde dort der
//    Aargauer Satz aus `ipv.jahrOhneRegion`).
//
// 2. KEINE VERMÖGENSGRENZE und KEIN MINDESTBETRAG. Weder Reglement [1] noch Rechenblatt [3]
//    kennen einen Ausschluss über dem Vermögen oder eine Mindestauszahlung. Vermögen wirkt nur
//    über 15 % des STEUERBAREN Vermögens — und das ist in Uri das Reinvermögen nach Abzug der
//    Sozialabzüge (Art. 55/56 StG [4]): 105'800 für Alleinstehende, 31'700 je Kind. Ohne diesen
//    Abzug rechnete die App bei 50'000 Erspartem 7'500 Franken PV-Einkommen dazu, wo amtlich
//    null steht — 637.50 Franken im Jahr zu wenig.
//
// 3. KEIN DECKEL AUF DIE EIGENE PRÄMIE im Reglement — ausser für EL-Beziehende (Art. 4 Abs. 4
//    [1]: «höchstens jedoch der tatsächlichen Prämie»). Für alle anderen steht er nirgends,
//    auch nicht im Rechenblatt [3]. Darum `KEIN_PRAEMIENDECKEL.UR` statt `praemieFehlt`.
//    ⟨Fachprüfung 28.09.2026 (K1): das ist BELEGT, nicht nur gewählt — KVV Art. 106c Abs. 5bis
//    (SR 832.102, in Kraft seit 01.01.2024, gelesen im Fedlex-Filestore, Stand 01.01.2026): der
//    Versicherer «bezahlt der versicherten Person den Differenzbetrag innerhalb von 60 Tagen …
//    aus. Kantonale Regelungen, wonach die Prämie höchstens bis zu ihrem vollen Umfang verbilligt
//    werden kann …, bleiben vorbehalten.» Uri hat keine solche Regelung.⟩
//
// 4. VON AMTES WEGEN, NICHT AUF ANTRAG (Art. 10 [1]). Ordentlich Besteuerte mit Wohnsitz Uri am
//    1. Januar erhalten den Entscheid ohne Anmeldung; darum KEIN `anmeldefristVorbei` (es gibt
//    keine Frist, die der Person den Anspruch nimmt).
//
// 5. DAS PV-EINKOMMEN ZIEHT FAST NICHTS AB. Art. 7 Abs. 2 [1] zählt die Abzüge abschliessend auf:
//    Liegenschaftsaufwand bis zum Ertrag, Berufskosten, Weiterbildung, Unterhaltsbeiträge,
//    Krankheits-, Unfall- und behinderungsbedingte Kosten. Die Säule 3a steht NICHT darin — sie
//    bleibt im Einkommen, Regel `SAEULE_3A.voll`. Von diesen Abzügen kennt die App nur die
//    bezahlten Unterhaltsbeiträge (`finanzen.alimentePaid`, monatlich) — die zieht sie ab
//    ⟨seit Fachprüfung 28.09.2026, W1: vorher nicht, 1'000/Monat kosteten 1'020 Fr. im Jahr⟩.
//    Die übrigen fehlen: das Nettoeinkommen der App liegt darum über dem amtlichen
//    PV-Einkommen, der Betrag hier UNTER dem amtlichen (am deutlichsten wegen der
//    Berufskosten). Der Vorbehalt sagt es.
//    Näherung, nicht an einer Urner Wegleitung geprüft: «Einkünfte» (Steuerziffern 1000–1700
//    in [3]) sind bei Angestellten die Nettolöhne laut Lohnausweis — dem entspricht der
//    Monatslohn «was auf dem Konto ankommt» der App.
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Paare und mehrere Erwachsene — Gesamtanspruch der gemeinsam Besteuerten (Art. 3 Abs. 1
//     [1]), das zweite Einkommen fehlt der App. Konkubinat mit Kindern (Art. 3 Abs. 2) ebenso.
//   · junge Erwachsene 19–25: eigene Richtprämie 2'844, in Ausbildung 50 % fest (Art. 4 Abs. 3,
//     Art. 6 Abs. 3 [1]) — der Ausbildungsstatus fehlt der App.
//   · Quellenbesteuerte (Art. 7 Abs. 4 [1]: 75 % des Quellensteuer-Einkommens, Antrag bis
//     30. April), EL-Beziehende (Art. 4 Abs. 4: volle Durchschnittsprämie) und
//     Sozialhilfe-Beziehende (Art. 4 Abs. 5, Art. 8: volle Richtprämie).
//   · Neuzuziehende (Art. 7 Abs. 3 Satz 4: Steuerperiode des Zuzugsjahrs) und Härtefälle
//     (Art. 9) — die App kennt das Zuzugsjahr nicht; der Vorbehalt nennt das Basisjahr.
//   · Einkünfte aus Liegenschaften (Mietwert, Mietzinse, Art. 7 Abs. 2 lit. b) — nicht erfasst.
//   · Abrundung des steuerbaren Vermögens auf 1'000 (Art. 55 Abs. 3 StG) — «für die
//     Steuerberechnung»; ob das Rechenblatt den abgerundeten Wert nimmt, ist offen. Wirkung
//     höchstens 150 Franken PV-Einkommen, also unter 13 Franken im Jahr.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN, KEIN_PRAEMIENDECKEL, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_UR = {
  jahr: 2026,
  // Art. 7 Abs. 3 [1]: «die rechtskräftige Steuerveranlagung des Steuerjahrs, das dem
  // Anspruchsjahr zwei Jahre vorausgeht» — für 2026 also 2024.
  basisjahrAbstand: 2,
  // [2] «Erwachsene (26 Jahre und älter) Fr. 4'368 · Junge Erwachsene (19-25 Jahre) Fr. 2'844 ·
  // Kinder/Jugendliche (bis 18 Jahre) Fr. 1'104»; dieselben Zahlen in [3], Zellen I39–I42.
  richtpraemie: { e: 4368, j: 2844, k: 1104 },
  // [2] «Selbstbehalt des PV-Einkommens 8,5 Prozent»; [3] Zelle I46 = 0.085.
  selbstbehalt: 0.085,
  // [2] «Anrechnung des steuerbaren Vermögens 15 Prozent (unverändert)»; [3] Zelle O30 = 0.15.
  vermoegenAnteil: 0.15,
  // [2] «Obergrenze des mittleren PV-Einkommens Fr. 90'000»; [3] Zelle M6 = 90000.
  // «Bis und mit» (Fussnote in [2]) — [3] vergleicht mit `M45<=M6`.
  obergrenzeMittleresPV: 90000,
  // Art. 6 Abs. 3 [1]: «für Kinder höchstens 20 Prozent der Richtprämie» anrechenbar;
  // Art. 4 Abs. 3 [1]: «um mindestens 80 Prozent … verbilligt». [3] M42: `*0.2`, R42: `*0.8`.
  kind: { anrechenbar: 0.2, fest: 0.8 },
  // Art. 56 Abs. 1 StG [4], Fassung 2025: «b) 105'800 Franken für alle übrigen steuerpflichtigen
  // Personen · c) 31'700 Franken für jedes nicht selbstständig besteuerte Kind».
  // 🛑 Welches Jahr: das PV-Einkommen stützt sich auf die Veranlagung 2024. Die Fassung 2024
  // ist in der Sammlung nicht mehr abrufbar (ältester Stand 01.01.2025). Die Änderungstabelle
  // des StG führt für Art. 56 Abs. 1 lit. b KEINE Änderung und für lit. c nur eine auf den
  // 01.01.2026 (31'700 → 31'800) — die Werte 2025 galten also auch 2024. Genommen ist der
  // tiefere Kinderwert 31'700; der Unterschied zu 31'800 sind 15 Franken PV-Einkommen je Kind.
  vermoegenSozialabzug: { alleinstehend: 105800, jeKind: 31700 },
};

// Art. 14 Abs. 3 [1]: «Die monatliche Prämienverbilligung ist je berechtigte Person auf fünf
// Rappen zu runden.» Ohne Richtung — also kaufmännisch, nicht auf (anders als LU, wo «Ungerade
// Beträge runden wir auf» steht). Der kleine Zuschlag fängt Gleitkomma-Reste bei x.x25 auf.
export function urMonatGerundet(jahresbetrag) {
  if (!(jahresbetrag > 0)) return 0;
  return Math.round((jahresbetrag / 12) * 20 + 1e-9) / 20;
}

// Die Rechnung selbst — ohne App-Daten, Zelle für Zelle nach dem Rechenblatt [3].
// `erwachsene` gibt es nur für die Tests (Formel für einen Gesamtanspruch); die App ruft die
// Rechnung immer mit einer erwachsenen Person auf. Liefert Jahresbeträge in CHF, ungerundet.
export function ipvUriRechnen({ kinderZahl = 0, pv, erwachsene = 1 }) {
  const p = IPV_UR;
  const r = p.richtpraemie;
  // [3] R28: `IF(AA28>=0, AA28, 0)` — die massgebenden Nettoeinkünfte nie unter null.
  const pv0 = Math.max(0, pv);
  // [3] M42/R42: bis und mit 90'000 zählt das Kind mit 20 % und erhält 80 % fest; darüber zählt
  // es mit 100 % und der feste Anteil entfällt.
  const mindestGilt = kinderZahl > 0 && pv0 <= p.obergrenzeMittleresPV;
  const anrechenbarKind = mindestGilt ? p.kind.anrechenbar * r.k : r.k;
  const festJeKind = mindestGilt ? p.kind.fest * r.k : 0;
  // [3] O43 = Summe der anrechenbaren Prämien; O46 = −8,5 % × PV; R47 = max(0, O43 + O46).
  const anrechenbar = erwachsene * r.e + kinderZahl * anrechenbarKind;
  const eigenanteil = p.selbstbehalt * pv0;
  const allgemein = Math.max(0, anrechenbar - eigenanteil);
  // [3] R49 = R41 + R42 + R47: fester Kinderanteil plus allgemeiner Anspruch.
  const total = allgemein + kinderZahl * festJeKind;

  // Aufteilung auf die Personen — nötig, weil Art. 14 Abs. 3 [1] JE PERSON rundet. Art. 14
  // Abs. 2 [1]: «im Verhältnis der für die Berechnung anrechenbaren Richtprämien»; der
  // «garantierte Mindestanspruch für Kinder» geht an deren Versicherer. Das Rechenblatt [3]
  // teilt nicht auf; die Regel ist also die des Reglements, nicht des Blatts.
  const anteilErwachsen = anrechenbar > 0 ? (allgemein * r.e) / anrechenbar : 0;
  const anteilKind = (anrechenbar > 0 ? (allgemein * anrechenbarKind) / anrechenbar : 0) + festJeKind;

  return {
    total, allgemein, anrechenbar, eigenanteil, mindestGilt,
    anteilErwachsen, anteilKind,
    // Vergleichsgrösse «höchstens möglich»: dieselbe Rechnung bei PV-Einkommen 0.
    maximal: erwachsene * r.e + kinderZahl * r.k,
    // Ein Grund genügt: Uri kennt keinen Mindestbetrag, es gibt also nur «über der Grenze».
    grund: total > 0 ? null : 'ueberGrenze',
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für UR mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`. `lookupPLZ` braucht Uri nicht (eine Region).
export function ipvUri(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_UR.jahr;
  // Der Regierungsrat legt die Steuerungsgrössen jährlich fest (Art. 4 Abs. 2, Art. 5 [1]);
  // für 2026 geschah das im Dezember 2025 [2]. Werte 2027 waren am 28.09.2026 weder auf der
  // SVS-Seite noch als Medienmitteilung publiziert. Ab dem 01.01. des Folgejahres keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Alter: Art. 5 [1] nennt «Erwachsene (26 Jahre und älter)», aber keinen Stichtag für das
  // Alter; Art. 3 Abs. 3 stellt allgemein auf die Verhältnisse «am 1. Januar des Anspruchsjahrs»
  // ab, das Antragsformular [5] rechnet bei Kindern nach Jahrgang. Nach beiden Lesarten ist
  // erwachsen, wer bis 1999 geboren ist; beim Jahrgang 2000 gehen sie auseinander. Darum
  // `mangelsStichtag` — GEWÄHLT, nicht belegt: wer im Anspruchsjahr 26 wird, erhält keine Zahl.
  // Drei Gründe, drei Sätze (Fachprüfung 28.09.2026, W3 — vorher sagte `alter` allen, das
  // Geburtsdatum fehle und junge Erwachsene würden mit den Eltern gerechnet; in Uri werden sie
  // aber «eigenständig» gerechnet, Art. 4 Abs. 6 [1]):
  //   · kein Geburtsdatum                    → `alter`
  //   · 19–25 im Anspruchsjahr               → `ausbildung` (Mindestanspruch 50 % hängt an einer
  //                                            Ausbildung am 1. Januar, Formular 2026 Frage 4)
  //   · 26 im Anspruchsjahr (Jahrgang 2000)  → `stichtagAlter`
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  if (!ERWACHSEN.mangelsStichtag(jahr, geburt)) {
    const alterImJahr = jahr - geburt;
    if (alterImJahr === 26) return orientierung('stichtagAlter');
    if (alterImJahr >= 19) return orientierung('ausbildung');
    return orientierung('alter');
  }
  // Kinder: das Antragsformular 2026 [5] fragt nach «Kinder bis zum 18. Altersjahr (Jahrgänge
  // 2008 – 2025)», Art. 4 Abs. 6 [1] rechnet junge Erwachsene «im Jahr nach dem erfüllten
  // 18. Altersjahr» eigenständig — also das Alter IM Anspruchsjahr, beim eingetippten Alter
  // ein Jahr dazu (wie BE, SG, LU; vorsichtig an der 18).
  // Ein Kind, das erst im Anspruchsjahr geboren wird, zählt nicht: massgebend sind die
  // Verhältnisse am 1. Januar, Änderungen im Jahr wirken erst im Folgejahr (Art. 3 Abs. 3 [1];
  // das Formular führt 2025 als jüngsten Jahrgang). Es mitzuzählen hiesse 883.20 zu viel.
  const kinder = (hh.children || []).filter((c) => !(/^\d{4}-/.test(c.birthDate || '')
    && Number(c.birthDate.slice(0, 4)) >= jahr));
  const kinderJahre = kinderAlter(kinder, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  // 🛑 Ein negatives Einkommen ist ein Vertipper, kein Einkommen. Das Rechenblatt setzt negative
  // Nettoeinkünfte auf 0 ([3] R28) — für die App hiesse das: volle Richtprämie aus einem
  // Minuszeichen. Derselbe Riegel wie BE.
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  const kinderZahl = kinderJahre.length;
  // Art. 7 Abs. 1 [1]: Nettoeinkünfte + 15 % des STEUERBAREN Vermögens. Steuerbar ist das
  // Reinvermögen nach den Sozialabzügen (Art. 55/56 StG [4]). Die App kennt nur die erfassten
  // Posten, keine Schulden — der Vorbehalt steht in `ipv.naeherung`.
  const steuerbaresVermoegen = Math.max(0, vermoegenSumme(f)
    - IPV_UR.vermoegenSozialabzug.alleinstehend - IPV_UR.vermoegenSozialabzug.jeKind * kinderZahl);
  // Art. 7 Abs. 2 [1] zieht die Säule 3a nicht ab: sie bleibt im Einkommen, und im
  // Nettoeinkommen der App steckt sie schon — Regel `voll`, kein weiterer Zuschlag.
  // Art. 7 Abs. 2 lit. c [1] zieht «Unterhaltsbeiträge» ab ([3] Zeile 25, Steuerziffern
  // 2540–2560). Das Profilfeld ist ein Monatsbetrag. Unlesbar oder negativ zählt als 0.
  // Der Boden 0 kommt NACH dem Abzug, wie im Rechenblatt ([3] R28 auf AA28).
  const unterhaltJahr = 12 * Math.max(0, Number(f.alimentePaid) || 0);
  const pv = Math.max(0, einkommenJahr(f, SAEULE_3A.voll) - unterhaltJahr)
    + IPV_UR.vermoegenAnteil * steuerbaresVermoegen;

  // 🛑 Hier ruft ein Kanton mit Deckel `praemieFehlt`. Uri nicht — begründet in
  // KEIN_PRAEMIENDECKEL.UR. Die Zeile steht da, damit das Auslassen sichtbar ist.
  void KEIN_PRAEMIENDECKEL.UR;

  const r = ipvUriRechnen({ kinderZahl, pv });
  // Rundung wie ausbezahlt: Monatsbetrag je Person auf fünf Rappen (Art. 14 Abs. 3 [1]), × 12,
  // dann auf ganze Franken wie in den anderen Kantonen (die Anzeige zeigt Franken).
  const annual = Math.round((urMonatGerundet(r.anteilErwachsen)
    + kinderZahl * urMonatGerundet(r.anteilKind)) * 12);
  const maxAnnual = r.maximal;
  // Keine publizierte Einkommensgrenze: die 90'000 betreffen nur den Mindestanspruch der Kinder,
  // der Nullpunkt für Erwachsene (≈ 51'388) ergäbe sich nur aus der Formel.
  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - IPV_UR.basisjahrAbstand;
  const gemeinsam = {
    canton: 'UR', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltUR',
    extra: { basisjahr, jahrKey: 'ipv.jahrUR' },
  };
  if (!(annual > 0)) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.urKeinAnspruch' });
  }
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: 'ipv.urAutomatisch',
    noteParams: { jahr, basisjahr, vorjahr: jahr - 1 },
  });
}
