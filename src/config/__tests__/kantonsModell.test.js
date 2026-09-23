import { describe, it, expect } from 'vitest';
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from '../kantonsModell.js';
import { SAEULE3A_MAX } from '../../data/saeule3a.js';

// Der gemeinsame Rahmen der Kantonsmodelle (K31). Er ist am 20.09.2026 entstanden, weil
// derselbe Fehler in vier Modulen lag. Diese Tests halten fest, was der Rahmen leistet —
// und ausdrücklich auch, wo die Kantone sich UNTERSCHEIDEN dürfen.

describe('Riegel, die in allen Kantonen gleich sind', () => {
  it('praemieFehlt: ohne erfasste Prämie keine Zahl — der Fehler, der viermal dieselbe Ursache hatte', () => {
    // Genau diese Fälle lieferten vor dem 20.09. die Obergrenze statt des Anspruchs.
    expect(praemieFehlt(praemieJahr({}))).toBe(true);                               // kein Feld
    expect(praemieFehlt(praemieJahr({ versicherungen: {} }))).toBe(true);           // leer
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 0 } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: '' } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 'abc' } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 400 } }))).toBe(false);
  });

  it('praemieJahr rechnet den Monatsbetrag aufs Jahr', () => {
    expect(praemieJahr({ versicherungen: { kkPremium: 400 } })).toBe(4800);
    expect(praemieJahr({ versicherungen: { kkPremium: '450' } })).toBe(5400);
  });

  it('mehrereErwachsene: Konkubinat zählt wie verheiratet — das zweite Einkommen fehlt', () => {
    const hh1 = { adults: 1 };
    expect(mehrereErwachsene(hh1, { maritalStatus: 'single' })).toBe(false);
    expect(mehrereErwachsene(hh1, { maritalStatus: 'married' })).toBe(true);
    expect(mehrereErwachsene(hh1, { maritalStatus: 'cohabiting' })).toBe(true);
    expect(mehrereErwachsene({ adults: 2 }, { maritalStatus: 'single' })).toBe(true);
  });

  it('jahrVorbei: ab dem Folgejahr keine Zahl aus veralteten Sätzen', () => {
    const heute = new Date().getFullYear();
    expect(jahrVorbei(heute)).toBe(false);
    expect(jahrVorbei(heute + 1)).toBe(false);
    expect(jahrVorbei(heute - 1)).toBe(true);
  });
});

describe('Eingaben lesen', () => {
  it('vermoegenSumme zählt die drei erfassten Posten', () => {
    expect(vermoegenSumme({ securitiesValue: 1000, otherAssets: 200, savingsAccount: 50 })).toBe(1250);
    expect(vermoegenSumme({})).toBe(0);
    expect(vermoegenSumme({ savingsAccount: '3000' })).toBe(3000);
  });

  it('einkommenJahr: Monatsfelder × 12', () => {
    expect(einkommenJahr({ monthlyIncome: 1000 })).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 500, sideIncome: 200, ahvRente: 300 })).toBe(12000);
    expect(einkommenJahr({})).toBe(0);
  });

  // 🛑 DER RÜCKFALL-WÄCHTER (Befund Fachprüfung 20.09.2026).
  // Bis zum 20.09. stand hier `pension3a: 7056` → 19056, mit dem Beleg, die Erlasse rechneten
  // die 3a hinzu. Sie tun das — aber auf eine Steuergrösse, in der sie abgezogen IST. Das
  // Nettoeinkommen der App («was auf Ihrem Konto ankommt») trägt sie bereits, also war es
  // eine Doppelzählung: Einkommen zu hoch ⇒ Verbilligung zu tief, in allen vier Kantonen.
  // Dieser Test hält genau das fest. Fällt er um, ist der Fehler zurück.
  // Die 7'056 im Text oben ist Historie und bleibt. Die EINGABEN unten stehen seit dem
  // 23.09.2026 auf dem geltenden Maximum (7'258, src/data/saeule3a.js) — der Betrag ist hier
  // beliebig, aber ein überholter Gesetzeswert als Testeingabe sieht beim Suchen aus wie ein
  // gepflegter Wert. Genau so blieb die Doku zwei Jahre auf 7'056 stehen.
  it('einkommenJahr: Säule 3a wird NICHT ein zweites Mal aufgerechnet', () => {
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7258 })).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 0 })).toBe(12000);
    // Und keine der drei Regeln ändert daran etwas, solange die Einzahlung das bundesrechtliche
    // Maximum nicht ÜBERSTEIGT — 7'258 ist genau der Grenzfall, bei dem BE noch nichts abzieht.
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7258 }, SAEULE_3A.voll)).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7258 }, SAEULE_3A.bisBundesMaximum)).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7258 }, SAEULE_3A.schwelleOhneSaeule2)).toBe(12000);
  });

  // ⟨neu 23.09.2026⟩ KKVV Art. 6 Abs. 4 lit. i, Wortlaut an der Quelle (BELEX, BSG 842.111.1):
  // «Beiträge an die gebundene Selbstvorsorge (Säule 3a) bis zum nach Bundesrecht zulässigen
  // Maximalbetrag für unselbständig Erwerbstätige werden dazugerechnet.»
  // Das rohe Nettoeinkommen trägt die 3a voll ⇒ abzuziehen ist der Überschuss über 7'258.
  describe('bisBundesMaximum (BE): der Deckel rechnet — und zwar in die richtige Richtung', () => {
    // 🛑 Das Bemessungsjahr, nicht das Anspruchsjahr: KKVV Art. 7 Abs. 1 stellt auf die
    // definitive Veranlagung des VORLETZTEN Steuerjahres ab, und Art. 6 Abs. 4 korrigiert
    // jenes Reineinkommen. Für das Anspruchsjahr 2026 ist das 2024 → Maximum 7'056.
    // (Befund Fachprüfung 23.09.2026; vorher rechnete der Deckel mit 7'258, dem Wert des
    // Anspruchsjahres, und lag damit zwei Anpassungen daneben.)
    const JAHR_2024 = 7056;
    const be = (pension3a, bemessungsjahr = 2024) =>
      einkommenJahr({ monthlyIncome: 5000, pension3a }, SAEULE_3A.bisBundesMaximum, { bemessungsjahr, anspruchsjahr: bemessungsjahr });

    it('das Maximum kommt aus dem Bemessungsjahr, nicht aus dem laufenden Jahr', () => {
      expect(SAEULE_3A.bisBundesMaximum.maximumFuer(2024)).toBe(JAHR_2024);
      expect(SAEULE_3A.bisBundesMaximum.maximumFuer(2026)).toBe(SAEULE3A_MAX);
      expect(JAHR_2024).not.toBe(SAEULE3A_MAX);   // sonst prüft der Test nichts
      // Derselbe Fall, zwei Bemessungsjahre, zwei verschiedene Einkommen.
      expect(be(20000, 2024)).toBe(60000 - (20000 - 7056));
      expect(be(20000, 2026)).toBe(60000 - (20000 - 7258));
    });

    // 🛑 Abgezogen wird erst über BEIDEN Jahresmaxima. Für 2026 sind das 7'056 (Bemessung)
    // und 7'258 (Anspruch) — dort fällt `Math.max` zufällig mit dem Anspruchsjahr zusammen,
    // und ein Test nur mit diesem Paar könnte die Absicht nicht von «nimm das Anspruchsjahr»
    // unterscheiden. (Genau das überlebte die Mutationsprobe am 23.09.2026.) Darum hier
    // ausdrücklich ein Paar, bei dem das Anspruchsjahr das TIEFERE Maximum trägt: die
    // Schwelle muss trotzdem die höhere sein, sonst würde zu viel abgezogen, sobald ein
    // Maximum einmal sinkt.
    it('die Schwelle ist das HÖHERE der beiden Maxima, nicht das des Anspruchsjahres', () => {
      const j = (bemessungsjahr, anspruchsjahr) =>
        einkommenJahr({ monthlyIncome: 5000, pension3a: 10000 }, SAEULE_3A.bisBundesMaximum,
          { bemessungsjahr, anspruchsjahr });
      // Bemessung 2026 (7'258) · Anspruch 2024 (7'056) ⇒ Schwelle 7'258, Abzug 2'742
      expect(j(2026, 2024)).toBe(60000 - (10000 - 7258));
      // umgekehrt dasselbe Ergebnis — die Reihenfolge darf nichts ändern
      expect(j(2024, 2026)).toBe(60000 - (10000 - 7258));
      // und ein unbelegtes Anspruchsjahr fällt auf das Bemessungsjahr zurück, statt alles
      // abzuschalten: 2019 ist nicht in der Tabelle, 2024 schon.
      expect(j(2024, 2019)).toBe(60000 - (10000 - 7056));
    });

    it('ohne belegtes Bemessungsjahr kein Deckel — nie ein geratener Wert', () => {
      expect(SAEULE_3A.bisBundesMaximum.maximumFuer(2019)).toBe(null);
      expect(be(36288, 2019)).toBe(60000);      // unverändert, wie vor dem 23.09.2026
      expect(be(36288, null)).toBe(60000);
    });

    it('unter und genau auf dem Maximum wird nichts abgezogen', () => {
      expect(be(0)).toBe(60000);
      expect(be(JAHR_2024 - 1)).toBe(60000);
      expect(be(JAHR_2024)).toBe(60000);         // 7'056 — der Grenzfall selbst
    });

    // 🛑 Der eine Franken. In einer Stufentabelle wie BE kippt er eine ganze Stufe.
    it('ein Franken über dem Maximum ⇒ ein Franken Abzug', () => {
      expect(be(JAHR_2024 + 1)).toBe(59999);
    });

    it('Selbständige ohne 2. Säule: der Erlass deckelt trotzdem auf das Unselbständigen-Maximum', () => {
      // BVV 3 Art. 7 Abs. 1 lit. b erlaubte ihnen 2024 35'280 — KKVV Art. 6 Abs. 4 lit. i
      // rechnet aber nur «für unselbständig Erwerbstätige» auf. Abzug 35'280 − 7'056 = 28'224.
      // Genau hier trennen sich die Lesarten: nach Lesart (a) wäre der Abzug 0.
      expect(be(35280)).toBe(60000 - 28224);
      expect(60000 - be(35280)).toBe(28224);
    });

    // Gegenprobe über den Erlassweg statt über die Formel: amtlich ist das Reineinkommen
    // (ohne 3a) PLUS min(3a, Maximum). Beide Wege müssen dieselbe Zahl ergeben.
    it('stimmt mit dem amtlichen Rechenweg überein', () => {
      for (const p3a of [0, 3000, 7056, 7057, 12000, 35280, 50000]) {
        const amtlich = (60000 - p3a) + Math.min(p3a, JAHR_2024);
        expect(be(p3a)).toBe(amtlich);
      }
    });

    // 🛑 Kein NaN aus einer unlesbaren Eingabe: `Number('abc')` ist NaN, und ein NaN im Abzug
    // hätte aus einem gültigen Einkommen ein ungültiges gemacht — die App zeigte dann GAR
    // KEINE Zahl, obwohl sie eine hat. Unlesbar und negativ zählen als 0.
    it('unlesbare oder negative Eingaben schalten den Deckel ab, statt das Einkommen zu zerstören', () => {
      for (const kaputt of ['abc', '', null, undefined, NaN, -5000]) {
        expect(be(kaputt)).toBe(60000);
      }
      expect(be('12056')).toBe(55000);
    });

    it('der Deckel senkt das Einkommen, hebt also die Verbilligung — nie umgekehrt', () => {
      for (const p3a of [0, 7056, 7057, 20000, 35280]) {
        expect(be(p3a)).toBeLessThanOrEqual(einkommenJahr({ monthlyIncome: 5000 }));
      }
    });

    // 🛑 Die Herleitung ist widerlegt, sobald die Einzahlung grösser ist als das ganze
    // Jahreseinkommen — dann stammt sie nicht daraus, oder im Feld steht der Kontostand.
    // Ungebremst wurde das Einkommen negativ, `beMassgebendesEinkommen` klemmte auf 0, und
    // die App zeigte die HÖCHSTE Stufe (Befund Fachprüfung 23.09.2026).
    it('erkennt, wenn die Einzahlung gar nicht aus dem Einkommen stammen kann', () => {
      const w = (f) => SAEULE_3A.bisBundesMaximum.widerlegt(f, rohesEinkommenJahr(f), { bemessungsjahr: 2024, anspruchsjahr: 2024 });
      expect(w({ monthlyIncome: 5000, pension3a: 60001 })).toBe(true);
      expect(w({ monthlyIncome: 5000, pension3a: 60000 })).toBe(false);
      expect(w({ ahvRente: 2000, pension3a: 35280 })).toBe(true);      // 24'000 Rente
      expect(w({ monthlyIncome: 5000, pension3a: 80000 })).toBe(true); // Kontostand statt Einzahlung
      expect(w({ monthlyIncome: 0, pension3a: 0 })).toBe(false);       // beides leer ist kein Widerspruch
      expect(w({ monthlyIncome: 5000, pension3a: 'abc' })).toBe(false);
    });

    // 🛑 NUR WO DER DECKEL BEISST. Bleibt die Einzahlung unter dem Maximum, ist der Abzug 0
    // und nichts ist widerlegt — der Riegel darf dann keine Zahl wegnehmen. Zuerst tat er
    // genau das und traf ausgerechnet die Gruppe mit kleinem Einkommen, die nach KKVV
    // Art. 13 Abs. 2 lit. i selbst einen Antrag stellen muss (Fachprüfung 23.09.2026).
    it('unter dem Maximum greift der Riegel NICHT, auch bei winzigem Einkommen', () => {
      const w = (f) => SAEULE_3A.bisBundesMaximum.widerlegt(f, rohesEinkommenJahr(f), { bemessungsjahr: 2024, anspruchsjahr: 2024 });
      expect(w({ monthlyIncome: 500, pension3a: 6500 })).toBe(false);   // 6'000 Einkommen, 3a darunter
      expect(w({ monthlyIncome: 0, pension3a: 7056 })).toBe(false);     // genau auf dem Maximum
      expect(w({ monthlyIncome: 0, pension3a: 7057 })).toBe(true);      // ein Franken darüber: jetzt schon
    });

    // 🛑 Der Tracker summiert datumsblind über alle Zeilen (Saeule3aTracker.jsx) — er ist zum
    // Weiterführen über Jahre gebaut. Drei Jahreszeilen à 7'000 ergäben eine
    // «Jahreseinzahlung» von 21'000 und einen Abzug, den es nicht gibt: gemessen CHF 804
    // Anspruch, wo keiner besteht. Richtung: zu hoch, also Rückforderung.
    it('Einzahlungen aus mehreren Jahren sind keine Jahreseinzahlung', () => {
      const w = (deposits, pension3a = 21000) =>
        SAEULE_3A.bisBundesMaximum.widerlegt({ monthlyIncome: 4000, pension3a, pension3aDeposits: deposits },
          48000, { bemessungsjahr: 2024, anspruchsjahr: 2024 });
      expect(w([{ date: '2024-03-01', amount: 7000 }, { date: '2025-03-01', amount: 7000 },
                { date: '2026-03-01', amount: 7000 }])).toBe(true);
      // Ein Jahr, mehrere Zeilen: völlig in Ordnung.
      expect(w([{ date: '2026-01-01', amount: 10000 }, { date: '2026-07-01', amount: 11000 }])).toBe(false);
      // Undatierte Zeilen sagen nichts — sie lösen den Riegel nicht aus.
      expect(w([{ date: '', amount: 21000 }])).toBe(false);
      expect(w(undefined)).toBe(false);
      // Und auch hier: unter dem Maximum ist die Jahresfrage gegenstandslos.
      expect(w([{ date: '2024-03-01', amount: 3000 }, { date: '2025-03-01', amount: 3000 }], 6000)).toBe(false);
    });

    // 🛑 DER FALL, DEN DER RIEGEL BEINAHE BESTRAFT HÄTTE (Umbau 23.09.2026).
    // Bis der Tracker die Jahresgrenze selbst zog, fragte dieser Riegel: «tragen die Zeilen
    // mehr als ein Kalenderjahr?». Seit der Tracker nur noch das laufende Jahr nach
    // `pension3a` schreibt, ist das die FALSCHE Frage — wer seine Einzahlungen über Jahre
    // sauber weiterführt, wofür der Tracker gebaut ist, hat selbstverständlich mehrere Jahre
    // in der Liste und trotzdem einen korrekten Jahresbetrag. Der alte Riegel hätte genau
    // diesen Menschen die Zahl weggenommen.
    it('gepflegte Historie über Jahre ist kein Widerspruch — nur der WERT zählt', () => {
      const historie = [
        { date: '2024-03-01', amount: 7056 },
        { date: '2025-03-01', amount: 7258 },
        { date: '2026-03-01', amount: 12000 },   // laufendes Jahr, über dem Maximum
      ];
      const w = (pension3a) => SAEULE_3A.bisBundesMaximum.widerlegt(
        { monthlyIncome: 4000, pension3a, pension3aDeposits: historie },
        48000, { bemessungsjahr: 2024, anspruchsjahr: 2026 });
      // 12'000 ist die Summe EINES Jahres — es wird gerechnet, der Deckel greift normal.
      expect(w(12000)).toBe(false);
      expect(SAEULE_3A.bisBundesMaximum.nichtAufgerechnet(
        { pension3a: 12000 }, { bemessungsjahr: 2024, anspruchsjahr: 2026 })).toBe(12000 - 7258);
      // Der Altbestand aus der Zeit vor dem Fix bleibt erkannt: 26'314 über alle Jahre.
      expect(w(7056 + 7258 + 12000)).toBe(true);
      // Und ein Wert, der knapp über der grössten Jahressumme liegt, ebenfalls.
      expect(w(12001)).toBe(true);
    });
  });

  // Die drei Regeln sind absichtlich EINZELN benannt, auch wo sie heute dasselbe rechnen —
  // sonst schreibt der nächste Kanton «belegt», wo «Zahl fehlt noch» gemeint war.
  describe('SAEULE_3A: die drei Zurechnungsregeln', () => {
    it('jede Regel nennt ihre Kantone und ihren Beleg', () => {
      expect(SAEULE_3A.voll.kantone).toBe('ZH, SG');
      expect(SAEULE_3A.bisBundesMaximum.kantone).toBe('BE');
      expect(SAEULE_3A.schwelleOhneSaeule2.kantone).toBe('AG');
      for (const r of Object.values(SAEULE_3A)) expect(r.beleg).toMatch(/Art\.|§/);
    });

    // ⟨23.09.2026, zweite Änderung am selben Tag — beide Schritte bleiben lesbar⟩
    // Zuerst stand hier für BE `toMatch(/nicht belegt/)`: das pinnte den GRUND der Lücke,
    // nicht die Lücke. Dann `toMatch(/Deckel/)`: das pinnte die Lücke, solange es eine gab.
    // Jetzt hat BE keine mehr — der Deckel rechnet. Geprüft wird darum, dass eine FERTIGE
    // Regel kein `offen` mehr trägt: sonst bliebe ein «noch nicht» stehen, das nicht mehr
    // stimmt, und läse sich beim nächsten Kanton wie ein Auftrag.
    it('zwei von dreien sind fertig — die dritte sagt, was ihr fehlt', () => {
      expect(SAEULE_3A.voll.offen).toBeUndefined();
      expect(SAEULE_3A.bisBundesMaximum.offen).toBeUndefined();
      expect(SAEULE_3A.schwelleOhneSaeule2.offen).toMatch(/nicht SICHER/);
    });

    // 🛑 Eine fertige Regel MUSS rechnen. Ohne diesen Test könnte `offen` verschwinden,
    // während `nichtAufgerechnet` still bei `() => 0` bliebe — dann sähe eine Lücke wie eine
    // erledigte Aufgabe aus. Genau die Verwechslung, gegen die der `offen`-Text gebaut war.
    it('was kein `offen` trägt, rechnet auch — und was eines trägt, rechnet bewusst nicht', () => {
      const ueberMaximum = { monthlyIncome: 5000, pension3a: 8056 };   // 1'000 über dem Maximum 2024
      expect(SAEULE_3A.bisBundesMaximum.nichtAufgerechnet(ueberMaximum, { bemessungsjahr: 2024, anspruchsjahr: 2024 })).toBe(1000);
      // `voll` ist fertig mit Abzug 0 — das ist die Regel selbst (ZH/SG rechnen unbedingt zu),
      // kein Platzhalter. Deshalb steht sie hier neben und nicht bei der offenen Regel.
      expect(SAEULE_3A.voll.nichtAufgerechnet(ueberMaximum, { bemessungsjahr: 2024 })).toBe(0);
      expect(SAEULE_3A.schwelleOhneSaeule2.nichtAufgerechnet(ueberMaximum, { bemessungsjahr: 2024 })).toBe(0);
    });

    // 🛑 `offen` und `vorbehalt` sind NICHT dasselbe, und die Verwechslung war genau der
    // Fehler: Mit dem Entfernen von `offen` wäre die offene Frage ans ASV unsichtbar
    // geworden, obwohl sie in FRAGEN-AN-DIE-AEMTER.md weiter steht.
    //   `offen`     = rechnet nicht, es fehlt etwas.
    //   `vorbehalt` = rechnet, aber auf einer vertretbaren statt bestätigten Lesart.
    // (Eingeführt 23.09.2026 nach der Fachprüfung.)
    it('eine rechnende Regel mit offener Rechtsfrage trägt `vorbehalt`, nicht `offen`', () => {
      const be = SAEULE_3A.bisBundesMaximum;
      expect(be.offen).toBeUndefined();
      expect(be.vorbehalt).toMatch(/nicht bestätigt|angefragt/);
      // Und die Gegenrichtung: was `offen` trägt, trägt keinen Vorbehalt — sonst läse sich
      // eine Lücke wie eine bloss unbestätigte Lesart.
      expect(SAEULE_3A.schwelleOhneSaeule2.vorbehalt).toBeUndefined();
      expect(SAEULE_3A.voll.vorbehalt).toBeUndefined();
    });

    // Die AG-Rechnung liegt bereit, damit sie beim Entscheid nicht neu erfunden wird —
    // 10 % des Nettoerwerbseinkommens, § 5 Abs. 1 V KVGG.
    it('die AG-Schwelle rechnet, auch wenn sie noch nicht angewendet wird', () => {
      expect(SAEULE_3A.schwelleOhneSaeule2.schwelle({ monthlyIncome: 2500 })).toBe(3000);
      expect(SAEULE_3A.schwelleOhneSaeule2.schwelle({})).toBe(0);
    });
  });

  it('geburtsjahr nimmt nur ein datiertes Feld', () => {
    expect(geburtsjahr({ dateOfBirth: '1980-05-01' })).toBe(1980);
    expect(geburtsjahr({ dateOfBirth: '' })).toBe(null);
    expect(geburtsjahr({})).toBe(null);
    expect(geburtsjahr({ dateOfBirth: 'irgendwas' })).toBe(null);
  });
});

describe('🛑 Alters-Lesarten: der Unterschied ist gewollt und belegt', () => {
  // Am 20.09.2026 standen im Code VIER Schreibweisen. Gemessen am Verhalten waren es
  // ZWEI Regeln: ZH, BE und VD gleich — AG allein anders. Dieser Test hält den Unterschied
  // fest, damit er nicht versehentlich verschwindet UND nicht versehentlich entsteht.
  const JAHR = 2026;

  it('abEndeVorjahr (ZH, BE, VD): Jahrgang 2000 gilt 2026 noch nicht als erwachsen', () => {
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 1980)).toBe(true);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 1999)).toBe(true);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 2000)).toBe(false);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 2001)).toBe(false);
  });

  it('imAnspruchsjahr (AG): Jahrgang 2000 gilt 2026 als erwachsen', () => {
    expect(ERWACHSEN.imAnspruchsjahr(JAHR, 2000)).toBe(true);
    expect(ERWACHSEN.imAnspruchsjahr(JAHR, 2001)).toBe(false);
  });

  it('die zwei Lesarten liegen genau einen Jahrgang auseinander — nicht mehr, nicht weniger', () => {
    const grenze = (regel) => {
      for (let g = 2010; g >= 1960; g--) if (regel(JAHR, g)) return g;
      return null;
    };
    expect(grenze(ERWACHSEN.imAnspruchsjahr) - grenze(ERWACHSEN.abEndeVorjahr)).toBe(1);
  });
});

describe('Kinderalter', () => {
  it('Kind ohne erfasstes Alter ergibt null — eine 0 heisst «nicht erfasst», nicht «Säugling»', () => {
    expect(kinderAlter([{ age: 0 }], 2026)).toEqual([null]);
    expect(kinderAlter([{}], 2026)).toEqual([null]);
    expect(ALTER_UNERFASST(kinderAlter([{ age: 0 }], 2026))).toBe(true);
  });

  it('Geburtsdatum schlägt das eingetippte Alter, Bezugsjahr entscheidet', () => {
    expect(kinderAlter([{ birthDate: '2014-03-01' }], 2026)).toEqual([12]);
    expect(kinderAlter([{ birthDate: '2014-03-01' }], 2025)).toEqual([11]);
  });

  it('eingetipptPlus hält die Grenze 18 auf der vorsichtigen Seite (BE-Lesart)', () => {
    expect(kinderAlter([{ age: 18 }], 2026, 0)).toEqual([18]);   // ZH: bleibt Kind
    expect(kinderAlter([{ age: 18 }], 2026, 1)).toEqual([19]);   // BE: fällt heraus
    expect(UEBER_18(kinderAlter([{ age: 18 }], 2026, 1))).toBe(true);
    expect(UEBER_18(kinderAlter([{ age: 18 }], 2026, 0))).toBe(false);
  });
});

describe('Prämienregion aus PLZ und Ort', () => {
  // Kleine Attrappe statt der echten PLZ-Daten: geprüft wird die Auswahl-Logik,
  // nicht der Datenbestand (der hat seine eigenen Tests).
  const lookup = (plz) => ({
    '3000': [{ kanton: 'BE', gemeinde: 'Bern', bfsNr: 351 }],
    '3600': [{ kanton: 'BE', gemeinde: 'Thun', bfsNr: 942 }, { kanton: 'BE', gemeinde: 'Steffisburg', bfsNr: 934 }],
    '3634': [{ kanton: 'BE', gemeinde: 'Thierachern', bfsNr: 941 }, { kanton: 'BE', gemeinde: 'Reutigen', bfsNr: 767 }],
    '9999': [{ kanton: 'ZH', gemeinde: 'Anderswo', bfsNr: 1 }],
  }[plz] || []);
  const regionFn = (bfs) => ({ 351: 1, 942: 2, 934: 2, 941: 3, 767: 2 }[bfs] || null);
  const daten = (postalCode, city = '') => ({ wohnen: { postalCode, city } });

  it('eindeutige Gemeinde → ihre Region', () => {
    expect(regionAusPLZ({ data: daten('3000'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(1);
  });

  it('mehrere Gemeinden, aber alle in derselben Region → diese Region', () => {
    expect(regionAusPLZ({ data: daten('3600'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(2);
  });

  it('mehrere Gemeinden in verschiedenen Regionen und kein Ortsname → keine Region', () => {
    expect(regionAusPLZ({ data: daten('3634'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(null);
  });

  it('der Ortsname entscheidet, wenn die PLZ mehrdeutig ist', () => {
    expect(regionAusPLZ({ data: daten('3634', 'Thierachern'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(3);
    expect(regionAusPLZ({ data: daten('3634', 'Reutigen'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(2);
  });

  it('Gemeinden anderer Kantone zählen nicht mit', () => {
    const r = regionAusPLZ({ data: daten('9999'), kanton: 'BE', lookupPLZ: lookup, regionFn });
    expect(r.region).toBe(null);
    expect(r.orte).toEqual([]);
  });

  it('ohne PLZ keine Region, ohne Absturz', () => {
    expect(regionAusPLZ({ data: {}, kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(null);
  });
});

describe('Deckel pro Person', () => {
  it('deckelt nur den Anteil der erwachsenen Person, der Kinderanteil bleibt', () => {
    // Gesamt 5000, davon 3000 für die erwachsene Person, Prämie 2400.
    expect(deckelnProPerson(5000, 3000, 2400)).toBe(4400);
  });

  it('liegt die Prämie über dem Anteil, ändert der Deckel nichts', () => {
    expect(deckelnProPerson(5000, 3000, 9000)).toBe(5000);
  });
});

describe('Ergebnis', () => {
  const basis = { canton: 'XX', cantonData: { a: 1 }, jahr: 2026, vorbehaltKey: 'ipv.vorbehalt' };

  it('ohne Anspruch: Betrag 0, belegt, nicht berechtigt', () => {
    const r = ergebnisOhneAnspruch({ ...basis, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 50000 } });
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', jahr: 2026 });
    expect(r.anspruchMoeglich).toBeUndefined();
  });

  it('mit Anspruch: Monatsbetrag und Prozentsatz aus Jahresbetrag und Höchstbetrag', () => {
    const r = ergebnisMitAnspruch({ ...basis, annual: 2400, maxAnnual: 4800, youngAdultsCount: 0, noteKey: 'x' });
    expect(r).toMatchObject({ eligible: true, belegt: true, anspruchMoeglich: true, amount: 200, annual: 2400, maxAnnual: 4800, reductionPercent: 50 });
  });

  it('`extra` trägt, was den Kanton ausmacht — Region hier, Basisjahr dort', () => {
    expect(ergebnisMitAnspruch({ ...basis, annual: 1200, maxAnnual: 1200, noteKey: 'x', extra: { region: 2 } }).region).toBe(2);
    expect(ergebnisMitAnspruch({ ...basis, annual: 1200, maxAnnual: 1200, noteKey: 'x', extra: { basisjahr: 2023 } }).basisjahr).toBe(2023);
  });
});
