// Prämienverbilligung (IPV) Kanton Aargau — amtliches Richtprämien-Modell, Jahr 2026 (K31).
// Nur AG rechnet hiermit; alle anderen Kantone bleiben in calculateIPV unverändert.
// Belege (alle am 20.09.2026 neu abgerufen), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt AG:
//   KVGG (SAR 837.200, Version in Kraft seit 01.12.2025) § 6 Abs. 1: «Anspruch auf Prämien-
//     verbilligung besteht, wenn die Richtprämie einen prozentualen Anteil des massgebenden
//     Einkommens übersteigt. Bei Mehrpersonenhaushalten werden die Richtprämien der
//     einzelnen Haushaltsmitglieder zusammengezählt.»
//   § 6 Abs. 2: «Das massgebende Einkommen besteht aus dem bereinigten steuerbaren
//     Einkommen, zuzüglich einem Fünftel des steuerbaren Vermögens des massgebenden
//     Steuerjahres, abzüglich eines Einkommensabzugs.»
//   § 7 Abs. 1: «Das massgebende Steuerjahr ist dasjenige Jahr, das drei Jahre vor dem
//     Anspruchsjahr begonnen hat.» — für 2026 also das Steuerjahr 2023 (DREI Jahre, anders
//     als in BE; darum ein eigener Vorbehalts-Satz `ipv.vorbehaltAG`).
//   § 7 Abs. 2: «Besteht ein Anspruch gemäss § 6 Abs. 1, beträgt die Prämienverbilligung von
//     Kindern und jungen Erwachsenen in Ausbildung mindestens 50 % der effektiven Prämie.»
//   § 7 Abs. 3: «Die Prämienverbilligung wird höchstens im Umfang der effektiven Prämie des
//     Anspruchsjahres ausgerichtet.»
//   § 9 Abs. 2: «Paare mit eingetragener Partnerschaft und im Konkubinat lebende Paare sind
//     Ehepaaren gleichgestellt. Das Konkubinat wird bei einem gemeinsamen Haushalt angenommen.»
//   § 10 Abs. 4: «Anträge auf Ausrichtung der Prämienverbilligung sind in jedem Fall bis
//     spätestens 31. Dezember im Vorjahr des Anspruchsjahres zu stellen, andernfalls der
//     Anspruch auf Prämienverbilligung für das betreffende Anspruchsjahr verwirkt ist.»
//   § 37 Abs. 1: zu Unrecht ausgerichtete Leistungen werden zurückgefordert, mit Verzugszins.
//   V KVGG (SAR 837.211, Anhang 1 «Berechnungselemente für die Verteilung der Prämien-
//     verbilligung 2026», Stand 1. September 2025): die Richtprämien, die Einkommensabzüge
//     und der Einkommenssatz 17,5 % — die Zahlen unten, wörtlich.
//   V KVGG § 4 Abs. 3: «Die effektive Prämie gemäss § 7 Abs. 2 KVGG entspricht der effektiven
//     KVG-Prämie am 1. Januar des Anspruchsjahres.»
//   V KVGG § 4 Abs. 4: «Die Verteilung des Haushaltsanspruchs auf die Haushaltsmitglieder
//     erfolgt anteilmässig im Verhältnis der Richtprämien.»
//   V KVGG § 4 Abs. 5: Erhöhung, wenn der Mindestanspruch nach Art. 65 Abs. 1bis KVG nicht
//     eingehalten ist.
//
// 🛑 Zahlen-Widerspruch vom 16.09.2026 — am 20.09.2026 an beiden Quellen nachgemessen und
// aufgelöst: Die SVA-Aargau-Seite «Allgemeine Informationen» schreibt heute durchgehend
// «Sie betragen für das Bezugsjahr 2027: für Erwachsene: 6'070 Franken jährlich …» und
// «Berechnungsbasis für die Prämienverbilligung 2027 ist das steuerbare Einkommen der
// rechtskräftigen Steuerveranlagung 2024.» Die am 16.09. notierte Jahresangabe «2026» bei
// denselben Zahlen steht dort nicht mehr. 6'070 / 4'440 / 1'450 und 19,25 % sind also die
// Werte 2027. Für 2026 gilt unverändert Anhang 1 V KVGG (5'830 / 4'260 / 1'380, 17,5 %) —
// und dieser Anhang ist am 20.09.2026 weiterhin die aktuelle Fassung: die Gesetzessammlung
// führt zu SAR 837.211 keine künftige Version und kein Änderungsdokument aus 2026.
// Darum bleibt 2026 gebaut und 2027 ungebaut; offener Punkt in docs/sources/FRAGEN-AN-DIE-AEMTER.md.

// Werte 2026 aus Anhang 1 V KVGG, wörtlich. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_AG = {
  jahr: 2026,
  // § 7 Abs. 1 KVGG: das massgebende Steuerjahr beginnt drei Jahre vor dem Anspruchsjahr.
  basisjahrAbstand: 3,
  // e = Erwachsene, j = junge Erwachsene (19.–25. Altersjahr), k = Kinder.
  // Der Kanton Aargau kennt dabei KEINE Prämienregionen: die Richtprämie ist ein einziger
  // kantonsweiter Wert je Alterskategorie (V KVGG § 4 Abs. 1: «Durchschnittswert der jeweils
  // zehn günstigsten Prämien im Kanton Aargau»). Darum gibt es hier — anders als in ZH und
  // BE — bewusst keine Gemeinde- und Regionenlogik.
  richtpraemie: { e: 5830, j: 4260, k: 1380 },
  einkommenssatz: 0.175,
  // Einkommensabzug je Haushaltstyp (V KVGG § 3: Alleinstehende · Alleinstehende mit
  // Kind(ern) · Ehepaare · Ehepaare mit Kind(ern)).
  abzug: { alleinstehend: 8500, alleinstehendMitKind: 12200, ehepaar: 0, ehepaarMitKind: 8000 },
  // «pro Kind/gemeinsam eingestuften jungen Erwachsenen in Ausbildung: Fr. 2'500.–»
  kinderabzug: 2500,
  // § 6 Abs. 2 KVGG: ein Fünftel des steuerbaren Vermögens.
  vermoegensanteil: 1 / 5,
  // § 7 Abs. 2 KVGG: Kinder und junge Erwachsene in Ausbildung mindestens 50 % ihrer
  // EFFEKTIVEN Prämie (nicht der Richtprämie — das ist der Unterschied zu ZH).
  mindestanteilKind: 0.5,
};

// Massgebendes Einkommen nach § 6 Abs. 2 KVGG. `bereinigtesEinkommen` ist das (genäherte)
// bereinigte steuerbare Einkommen im Jahr, `vermoegen` das steuerbare Vermögen, `kinderZahl`
// die Zahl der Kinder und der gemeinsam eingestuften jungen Erwachsenen in Ausbildung.
// Der Boden bei 0 ist kein kosmetischer Clamp: ohne ihn stiege der Anspruch über die Summe
// der Richtprämien hinaus, was § 6 Abs. 1 nicht zulässt («soweit die Richtprämie … übersteigt»).
export function agMassgebendesEinkommen({ bereinigtesEinkommen, vermoegen = 0, verheiratet = false, kinderZahl = 0 }) {
  const p = IPV_AG;
  const typ = verheiratet
    ? (kinderZahl > 0 ? 'ehepaarMitKind' : 'ehepaar')
    : (kinderZahl > 0 ? 'alleinstehendMitKind' : 'alleinstehend');
  const abzug = p.abzug[typ] + kinderZahl * p.kinderabzug;
  return Math.max(0, Math.max(0, bereinigtesEinkommen) + p.vermoegensanteil * Math.max(0, vermoegen) - abzug);
}

// Reine Rechnung. `personen` sind die Kategorien ('e' | 'j' | 'k'), `me` das massgebende
// Einkommen im Jahr, `praemien` (optional) die effektive Jahresprämie je Person in derselben
// Reihenfolge — `null`/0 heisst «nicht erfasst», dann greifen für diese Person weder der
// Mindestanspruch (§ 7 Abs. 2 KVGG) noch der Deckel (§ 7 Abs. 3 KVGG).
// Liefert Jahresbeträge in CHF (ungerundet).
export function ipvAargauRechnen({ personen, me, praemien = null }) {
  const p = IPV_AG;
  const refs = personen.map((c) => p.richtpraemie[c]);
  const summe = refs.reduce((a, b) => a + b, 0);
  const me0 = Math.max(0, me);
  // § 6 Abs. 1 KVGG: Summe der Richtprämien minus Einkommenssatz × massgebendes Einkommen.
  const haushalt = Math.max(0, summe - p.einkommenssatz * me0);
  const praemie = (i) => {
    const v = praemien ? Number(praemien[i]) : 0;
    return v > 0 ? v : null;
  };
  const anteile = personen.map((c, i) => {
    // V KVGG § 4 Abs. 4: anteilmässig im Verhältnis der Richtprämien.
    let anteil = summe > 0 ? (haushalt * refs[i]) / summe : 0;
    const pr = praemie(i);
    // § 7 Abs. 2 KVGG: nur «besteht ein Anspruch gemäss § 6 Abs. 1» — ohne Anspruch kein
    // Mindestbetrag. Der Mindestanspruch gilt für Kinder und junge Erwachsene in Ausbildung.
    if (haushalt > 0 && c !== 'e' && pr != null) anteil = Math.max(anteil, p.mindestanteilKind * pr);
    // § 7 Abs. 3 KVGG: höchstens die effektive Prämie — pro Person, weil V KVGG § 4 Abs. 3/4
    // die effektive Prämie und den Anteil je Haushaltsmitglied bestimmen.
    if (pr != null) anteil = Math.min(anteil, pr);
    return anteil;
  });
  return {
    total: anteile.reduce((a, b) => a + b, 0),
    anteile,
    haushalt,
    summe,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für AG mit Beleg. Die App rechnet nur,
// wo ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit
// Grund in `offen`. Bewusst NICHT gerechnet:
//   Paare/mehrere Erwachsene — § 9 Abs. 2 KVGG stellt eingetragene Partnerschaft UND
//     Konkubinat den Ehepaaren gleich und nimmt das Konkubinat schon «bei einem gemeinsamen
//     Haushalt» an; Einkommen und Vermögen der zweiten Person kennt die App nicht.
//   Haushalte mit Kindern oder jungen Erwachsenen — der Mindestanspruch nach § 7 Abs. 2 KVGG
//     ist ein Anteil der EFFEKTIVEN Prämie jedes Kindes, und die App erfasst nur eine einzige
//     Krankenkassenprämie. Ohne die Kinderprämien liegt der Betrag in einem Bereich, den wir
//     nicht eingrenzen können (der Mindestanspruch bindet ab rund Fr. 20'000 massgebendem
//     Einkommen), und eine zu tiefe Zahl ist hier so schädlich wie eine zu hohe.
//   Eigenes Alter unbekannt oder nicht sicher über 25 — junge Erwachsene werden nach
//     § 9 Abs. 3 KVGG unter Umständen mit den Eltern eingestuft.
//   Anspruchsjahr vorbei (Jahres-Riegel).
//   Näherung: bereinigtes steuerbares Einkommen = Erwerbs-, Neben- und Renteneinkommen × 12
//   plus die Säule-3a-Einzahlung (§ 6 Abs. 3 lit. b KVGG rechnet den Säule-3a-Abzug auf).
//   Amtlich zählen die Steuerfaktoren des Steuerjahres 2023; es fehlen also die amtlichen
//   Abzüge (Berufsauslagen, Versicherungs- und Sozialabzüge), und das Vermögen ist hier nur
//   die Summe der erfassten Werte, nicht das steuerbare Gesamtvermögen inkl. Liegenschaft
//   und abzüglich Schulden. Die Säule 3a wird voll aufgerechnet, obwohl § 6 Abs. 5 KVGG
//   i. V. m. § 5 Abs. 1 V KVGG sie bei Personen ohne Säule 2 nur über 10 % des
//   Nettoerwerbseinkommens aufrechnet — die App weiss nichts über eine Säule 2, und die
//   volle Aufrechnung ist die vorsichtigere Seite (sie senkt den Betrag).
export function ipvAargau(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_AG.jahr;
  // Die App rechnet nur für das Jahr, dessen Werte belegt sind. Ab dem 01.01. des Folgejahres
  // lieber keine Zahl als eine aus veralteten Sätzen: Die SVA weist für 2027 bereits 6'070 /
  // 4'440 / 1'450 und 19,25 % aus, die Rechtssammlung trägt aber noch den Anhang 2026.
  if (new Date().getFullYear() > jahr) return orientierung('jahr');
  // § 9 Abs. 2 KVGG: Konkubinat wird «bei einem gemeinsamen Haushalt angenommen» — strenger
  // als in BE, wo es ein gemeinsames Kind braucht. `hh.adults !== 1` fängt das mit ab.
  if (hh.adults !== 1 || b.maritalStatus === 'married' || b.maritalStatus === 'cohabiting') return orientierung('haushalt');
  // Kinder und junge Erwachsene: siehe der Block oben — ohne deren effektive Prämien lässt
  // sich der Mindestanspruch nach § 7 Abs. 2 KVGG nicht rechnen. Eigener Grund, damit in der
  // Anzeige nicht «Paare» steht, wo es um Kinder geht.
  if (hh.children.length > 0) return orientierung('agKinder');
  // Alterskategorie nach Jahrgang: Die SVA führt für das Anspruchsjahr 2027 die Jahrgänge
  // 2002–2008 als junge Erwachsene, also alle, die im Anspruchsjahr zwischen 19 und 25 alt
  // werden. Erwachsen ist danach, wer im Anspruchsjahr 26 oder älter wird.
  const geburt = /^\d{4}-/.test(b.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
  if (!geburt || jahr - geburt < 26) return orientierung('alter');

  const vermoegen = Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
  const bereinigtesEinkommen = ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente']
    .reduce((s, k) => s + Number(f[k] || 0), 0) * 12 + Number(f.pension3a || 0);
  const me = agMassgebendesEinkommen({ bereinigtesEinkommen, vermoegen, verheiratet: false, kinderZahl: 0 });

  // Nur eine Person im Haushalt, darum ist die erfasste Prämie ihre eigene (§ 7 Abs. 3 KVGG).
  const praemieJahr = Number(data.versicherungen?.kkPremium) * 12;
  const praemien = praemieJahr > 0 ? [praemieJahr] : null;
  const annual = Math.round(ipvAargauRechnen({ personen: ['e'], me, praemien }).total);
  // Vergleichsgrösse «höchstens möglich»: dieselbe Rechnung bei massgebendem Einkommen 0.
  const maxAnnual = Math.round(ipvAargauRechnen({ personen: ['e'], me: 0, praemien }).total);

  // § 5 Abs. 5 KVGG definiert eine Einkommensgrenze, der Kanton publiziert sie aber nicht als
  // Zahl. Eine aus der Formel abgeleitete Grenze wäre eine eigene Rechnung, keine amtliche
  // Angabe — darum trägt AG hier bewusst keine Grenze (maxIncome bleibt null, die Anzeige
  // lässt die Zeile weg).
  const cantonData = { ...ipvData };
  // § 10 Abs. 4 KVGG: Der Antrag muss bis 31.12. des Vorjahres gestellt sein, sonst ist der
  // Anspruch verwirkt. Für 2026 war das der 31.12.2025 — ein Betrag ohne diesen Satz wäre
  // irreführend. Die Frist des laufenden Kalenderjahres läuft für das FOLGEJAHR.
  const fristAbgelaufen = new Date().getFullYear() >= jahr;
  const basisjahr = jahr - IPV_AG.basisjahrAbstand;
  if (annual <= 0) {
    return {
      belegt: true, eligible: false, amount: 0,
      noteKey: 'ipv.agKeinAnspruch', noteParams: {},
      canton: 'AG', cantonData, jahr, basisjahr, vorbehaltKey: 'ipv.vorbehaltAG',
    };
  }
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey: fristAbgelaufen ? 'ipv.agFristAbgelaufen' : 'ipv.agFristLaeuft',
    noteParams: { jahr, vorjahr: jahr - 1, folgejahr: jahr + 1 },
    youngAdultsCount, canton: 'AG', cantonData, jahr, basisjahr, vorbehaltKey: 'ipv.vorbehaltAG',
  };
}
