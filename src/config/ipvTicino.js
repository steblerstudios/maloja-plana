// Prämienverbilligung (IPV / RIPAM) Kanton Tessin — quadratische Formel auf dem verfügbaren
// Einkommen, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt TI. Die Raccolta delle leggi (m3.ti.ch) liefert für unbekannte Nummern eine
// Fehlerseite («L'atto normativo cercato non è presente!») — die Gegenprobe misst also.
//   [1] Legge di applicazione della LAMal (LCAMal, RL 853.100), «stato 1° gennaio 2026», Raccolta
//       zuletzt nachgeführt 18.09.2026 (BU 32/2026).
//       Art. 25: Antrag; bis Ende des Vorjahres ⇒ ab 1. Januar, sonst ab dem Folgemonat ·
//       Art. 26/27: Unità di riferimento (UR), wirtschaftlich abhängige junge Personen ·
//       Art. 31: verfügbares Einkommen RD · Art. 32a: RDM · Art. 34/35: Formel · Art. 37:
//       Koeffizient 76,5 %, Deckel auf die Prämie · Art. 39: Mindestbetrag · Art. 42/43: EL und
//       Laps-Beziehende · Art. 43a: Besitzstand 2014.
//   [2] Decreto esecutivo concernente le basi di calcolo … per l'anno 2026 (RL 853.310), vom
//       19.11.2025, «stato 1° gennaio 2026», gültig bis 31.12.2026: Art. 1 Steuerperiode 2023 ·
//       Art. 2 PMR 8'016 / 6'143 / 1'827. Die Konstanten nach Art. 40 lit. c [1] ändert es NICHT
//       (voller Text: nur Art. 1–3) — es gelten die Gesetzeswerte.
//   [3] Regolamento della LCAMal (RLCAMal, RL 853.110), «stato 1° gennaio 2025»: Art. 11
//       (wirtschaftlich abhängig) · Art. 17 (Aufteilung, Minderjährige zuerst) · Art. 18: «Il
//       limite di fabbisogno minimo ai sensi della Laps corrisponde a quello valido per l'anno
//       precedente all'anno di competenza» (unter dem Titel «art. 32a LCAMal») · Art. 21: 120 Fr.
//   [4] Decreto esecutivo sull'armonizzazione e il coordinamento delle prestazioni sociali (RL
//       870.130), vom 25.09.2024, «stato 1° gennaio 2025»: Art. 1 «Per gli anni 2025 e 2026 la
//       soglia d'intervento corrisponde alla somma di: a) per il titolare del diritto 18'709
//       franchi; b) … 9'215 …».
//   [5] IAS, «Istruzioni per la richiesta di riduzione di premio … per l'anno 2026» (PDF vom
//       17.12.2025) und «Informazioni periodiche RIPAM 2026» (inhaltsgleich): RD-Schema nach
//       Ziffern der Veranlagung 2023, Berufsauslagen-Pauschale, Altersgrenzen, 120 Fr.
//
// 🛑 DIE EINE ZUORDNUNG, DIE NICHT IN EINEM EINZIGEN SATZ STEHT — und warum sie trotzdem trägt:
// Art. 32a [1] spricht vom «limite di fabbisogno, senza computo della pigione, ai sensi della
// Laps». Die Laps (RL 870.100, gelesen) kennt als Bedarfsgrenze nur die «soglia d'intervento»
// (Art. 10); die Wohnkosten zählt sie getrennt als Ausgabe (Art. 9) — die Schwelle ist also
// «ohne Miete». Das Jahr regelt [3] Art. 18 (Vorjahr ⇒ 2025), den Betrag [4] (2025 und 2026:
// 18'709 für die berechtigte Person). Und das IAS selbst nennt den «limite di fabbisogno
// esistenziale definito ai sensi della Laps (per il 2026 corrisponde a CHF 18'709 annui)» [5].
// Drei amtliche Texte, die dieselbe Zahl tragen; der Satz «limite di fabbisogno = soglia
// d'intervento» steht aber nirgends wörtlich. Die stärkste Brücke (Fachprüfung #484): [3] setzt
// Art. 18 «Limite di fabbisogno minimo (art. 32a LCAMal)» unter den Titel «Capitolo sesto — Anno
// di riferimento delle SOGLIE Laps». Frage ans IAS: FRAGEN-AN-DIE-AEMTER.md, 14 (Entwurf, nicht
// gesendet — der Vorbehalt sagt «bestätigt ist sie noch nicht», nicht «ist nachgefragt»).
// Der IAS-Rechner (Gegenprobe) wurde bewusst NICHT mit Daten gefüttert.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Referenzprämie PMR, abzüglich PMR × (RD / RDM)² — der Abbau ist
// QUADRATISCH, bei kleinen Einkommen flach, gegen die Grenze steil —, und davon 76,5 %.
//
// WAS TESSIN VON ALLEN ANDEREN KANTONEN UNTERSCHEIDET
// 1. Das Einkommen ist ein VERFÜGBARES Einkommen: vom Bruttoeinkommen gehen die Sozialabzüge,
//    die Referenzprämie selbst, Alimente, Berufsauslagen (max. 4'000) und Schuldzinsen
//    (max. 3'000) ab (Art. 31 [1]). Das Nettoeinkommen der App steht für «Bruttoeinkommen minus
//    Sozialabzüge» (AHV, IV, EO, ALV, NBU, BVG sind im Nettolohn schon abgezogen).
// 2. Keine Prämienregionen: der PMR ist ein kantonsweiter gewichteter Durchschnitt über die
//    Regionen (Art. 28 Abs. 2 [1], ein Wert je Kategorie in [2]).
// 3. Die Grundlage ist die Veranlagung 2023 — DREI Jahre vor dem Anspruchsjahr ([2] Art. 1).
//
// BEWUSST NICHT GEBAUT:
//   · Paare, Konkubinat (Art. 26 Abs. 4 [1]: stabile Partner sind eine UR) und Haushalte mit
//     Kindern: die Verbilligung gilt für die ganze UR und ist auf die Summe ALLER tatsächlichen
//     Prämien begrenzt (Art. 37 Abs. 3 [1]); die Prämien der Kinder kennt die App nicht, und die
//     Aufteilung nach [3] Art. 17 entscheidet über den Mindestbetrag je Person. → `tiKinder`.
//   · junge Personen bis 30 mit kleinem Einkommen, die in Erstausbildung stehen: sie gehören
//     zur UR der Eltern (Art. 27 [1], [3] Art. 11). Die App kennt die Ausbildung nicht. → `tiEltern`.
//   · EL- und Laps-Beziehende (Art. 42/43 [1]: ohne Antrag, Laps sogar mit dem vollen Betrag nach
//     Art. 34) und Sozialhilfe. ⟨korrigiert nach Fachprüfung #484: hier stand auch
//     «Quellenbesteuerte … von Amtes wegen». Sie stellen den Antrag wie alle (IAS Ziff. 2), ihr RD
//     kommt aus der aktuellen Lage ([3] Art. 14) — die App rechnet sie wie Veranlagte.⟩
//   · Schuldzinsen (Art. 31 lit. g [1]) — die App erfasst sie nicht; das HEBT das Einkommen und
//     SENKT den Betrag. Ebenso: Bruttoeinkommen aus Liegenschaften, Vermögen = erfasste Posten.
//   · die monatliche Auszahlung ab dem Folgemonat nach einem späten Antrag (Art. 25 Abs. 3 [1]);
//     der Betrag hier ist der Jahresanspruch, der Hinweis daneben nennt die Frist.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_TI = {
  jahr: 2026,
  // [2] Art. 1: «le classificazioni dell'imposta cantonale per l'anno 2023».
  basisjahr: 2023,
  // [2] Art. 2: «fr. 8'016 per gli adulti; fr. 6'143 per i giovani adulti; fr. 1'827 per i minorenni».
  pmr: { e: 8016, j: 6143, k: 1827 },
  // Art. 32a Abs. 2 [1]: «RDM = costante del 3.8 x 50% del limite di fabbisogno».
  konstanteOhneKinder: 3.8,
  // Art. 32a Abs. 3 [1]: «[costante del 4.7 + (1 - (n. figli) / 10)]» — hier nur zur
  // Vollständigkeit; Haushalte mit Kindern rechnet die App nicht (siehe Kopf).
  konstanteMitKindern: 4.7,
  anteilFabbisogno: 0.5,
  // [4] Art. 1 lit. a–e («per gli anni 2025 e 2026»), [3] Art. 18: der Wert des Vorjahres.
  limiteFabbisogno: [18709, 9215, 6869, 5253, 5233],
  // Art. 37 Abs. 2 [1]: «Il coefficiente cantonale di finanziamento è pari al 76.5%.»
  koeffizient: 0.765,
  // Art. 31 Abs. 1 lit. b [1]: «Quota parte sostanza (=1/15 sostanza netta secondo LT)».
  sostanzaAnteil: 1 / 15,
  // Art. 31 Abs. 1 lit. f [1]: «[massimo 4'000 CHF/anno per UR]»; [5]: «importo annuo
  // forfettario massimo di CHF 4'000 alle UR nelle quali almeno un membro esercita un'attività
  // salariata a titolo principale … unicamente fino all'ammontare di tale reddito».
  berufsauslagenMax: 4000,
  // [3] Art. 21: «120.– franchi all'anno per ogni singolo membro dell'unità di riferimento».
  mindestbetrag: 120,
  // Art. 43a Abs. 2 [1]: Besitzstand mit den PMR 2014 und 73,5 % / 70 %.
  besitzstand: { pmr2014: { e: 4965, j: 4594, k: 1156 }, bisHalbe: 0.735, bisGanze: 0.70 },
  // Art. 27 Abs. 1 [1]: «di età non superiore a 30 anni».
  abhaengigBisAlter: 30,
};

// RDM einer UR ohne Kinder nach Art. 32a Abs. 2 [1]. `personen` = Zahl der Personen der UR.
export function tiRdmOhneKinder(personen = 1) {
  const limite = IPV_TI.limiteFabbisogno.slice(0, personen).reduce((a, b) => a + b, 0)
    + Math.max(0, personen - IPV_TI.limiteFabbisogno.length) * IPV_TI.limiteFabbisogno[4];
  return { rdm: IPV_TI.konstanteOhneKinder * IPV_TI.anteilFabbisogno * limite, limite };
}

// Verfügbares Einkommen RD nach Art. 31 Abs. 2 [1]:
//   RD = [RL + qSOST] − [PMR + CS + ALIM + SPPROF + SPINT], nie unter 0 (Abs. 4).
// `einkommenNachSozialabzuegen` steht für RL − CS.
export function tiVerfuegbaresEinkommen({ einkommenNachSozialabzuegen, sostanza = 0, pmr, alimente = 0, berufsauslagen = 0, schuldzinsen = 0 }) {
  const rd = einkommenNachSozialabzuegen + IPV_TI.sostanzaAnteil * Math.max(0, sostanza)
    - pmr - Math.max(0, alimente) - berufsauslagen - Math.min(Math.max(0, schuldzinsen), 3000);
  return Math.max(0, rd);
}

// Die Rechnung selbst — ohne App-Daten. `pmrSumme` = Summe der PMR der UR (Art. 34 [1]),
// `pmr2014Summe` für den Besitzstand. Liefert Jahresbeträge in CHF, ungerundet.
export function ipvTicinoRechnen({ rd, rdm, limite, pmrSumme, pmr2014Summe }) {
  const rd0 = Math.max(0, rd);
  // Art. 32a Abs. 1 [1]: «accordata fino al raggiungimento di un reddito disponibile massimo».
  // Art. 35 [1]: «[ PMR - ( PMR x RD2 ) / RDM2 ]».
  const normativ = rd0 < rdm ? pmrSumme - (pmrSumme * rd0 * rd0) / (rdm * rdm) : 0;
  // Art. 37 Abs. 1 [1]: Normbetrag × Koeffizient.
  const effektiv = normativ * IPV_TI.koeffizient;
  // Art. 43a [1]: für RD bis zur Bedarfsgrenze nie unter dem Besitzstand 2014.
  const b = IPV_TI.besitzstand;
  const besitzstand = rd0 <= limite / 2 ? pmr2014Summe * b.bisHalbe : rd0 <= limite ? pmr2014Summe * b.bisGanze : 0;
  const total = Math.max(effektiv, besitzstand);
  return {
    total, normativ, effektiv, besitzstand,
    maximal: pmrSumme * IPV_TI.koeffizient,
    // Zwei Gründe für «kein Betrag»: über RDM rechnet die Formel null; darunter besteht ein
    // Anspruch, er wird nach [3] Art. 21 unter 120 Fr. nur nicht ausbezahlt.
    grund: total >= IPV_TI.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für TI mit Beleg.
export function ipvTicino(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_TI.jahr;
  // [2] gilt «fino al 31 dicembre 2026»; den Beschluss 2027 fasst der Staatsrat jährlich
  // (Art. 40 [1]). Am 28.09.2026 lag er nicht vor.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [5] Ziff. 1.2: «adulto: dall'anno seguente al compimento dei 25 anni» — erwachsen ist, wer
  // im Anspruchsjahr 26 wird (wie AG, LU, GR). Belegt, nicht gewählt.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: die UR-Rechnung mit Kinder-Konstante, Aufteilung und Deckel auf alle Prämien ist
  // nicht gebaut (siehe Kopf).
  if ((hh.children || []).length > 0) return orientierung('tiKinder');

  // Säule 3a: bleibt im Einkommen (Regel `voll`, Beleg LCAMal Art. 31 Abs. 1 lit. d — die Sozial-
  // abzüge sind abschliessend aufgezählt, die 3a ist nicht darunter). ⚠️ Das IAS nennt für die
  // Sozialabzüge die Ziffern 10.1–10.3 der Veranlagung; ob 10.3 im Tessiner Formular die 3a ist,
  // ist nicht geprüft (Frage 14) — dann läge die Zahl für 3a-Sparende zu tief.
  const einkommen = einkommenJahr(f, SAEULE_3A.voll) + Math.max(0, Number(f.alimenteReceived) || 0) * 12;
  if (einkommen < 0) return orientierung('einkommenNegativ');
  // Art. 27 [1] / [3] Art. 11: bis 30, Einkommen unter der Bedarfsgrenze und in Erstausbildung
  // ⇒ UR der Eltern. Die Ausbildung kennt die App nicht; darum keine Zahl, wo es zutreffen
  // KANN. Das Alter «non supera i 30 anni» gilt beim Antrag, der ab Juli des Vorjahres möglich
  // ist ([5] Ziff. 2) — vorsichtig: Jahrgang bis zwei Jahre vor «30 im Anspruchsjahr».
  // Das Nettoeinkommen liegt unter dem Brutto der Veranlagung; ist schon es über der Grenze,
  // ist die Bedingung sicher nicht erfüllt.
  const { rdm, limite } = tiRdmOhneKinder(1);
  if (jahr - geburt <= IPV_TI.abhaengigBisAlter + 2 && einkommen < IPV_TI.limiteFabbisogno[0]) {
    return orientierung('tiEltern');
  }

  // Art. 31 lit. f [1] mit [5]: Pauschale bis 4'000, wenn eine Person der UR hauptberuflich
  // angestellt ist, höchstens bis zum Lohn. Nur wenn der Anstellungstyp «Angestellt» erfasst ist.
  // ⟨korrigiert nach Fachprüfung #484, ⚠️ 3: zuerst galt auch ein LEERER Typ als angestellt — für
  // Selbständige ohne Angabe +1'009 Fr./Jahr zu hoch (3'000 netto). Jetzt ohne Abzug, und die
  // Anzeige sagt, dass der Betrag bei einer Anstellung HÖHER wäre (`vorbehaltTIangestellt`).⟩
  const lohn = Number(f.monthlyIncome) > 0 ? rohesEinkommenJahr({ monthlyIncome: f.monthlyIncome, dreizehnter: f.dreizehnter }) : 0;
  const angestellt = lohn > 0 && f.employmentType === 'employed';
  const typOffen = lohn > 0 && !f.employmentType;
  const berufsauslagen = angestellt ? Math.min(IPV_TI.berufsauslagenMax, lohn) : 0;
  const rd = tiVerfuegbaresEinkommen({
    einkommenNachSozialabzuegen: einkommen,
    sostanza: vermoegenSumme(f),
    pmr: IPV_TI.pmr.e,
    alimente: Number(f.alimentePaid || 0) * 12,
    berufsauslagen,
  });

  const r = ipvTicinoRechnen({ rd, rdm, limite, pmrSumme: IPV_TI.pmr.e, pmr2014Summe: IPV_TI.besitzstand.pmr2014.e });

  // Art. 37 Abs. 3 [1]: «non può oltrepassare l'ammontare del premio effettivo a carico dei
  // membri dell'unità di riferimento» — bei einer Person ihre eigene Prämie.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const gedeckelt = Math.min(r.total, praemie);
  // [3] Art. 21: unter 120 Fr. je Person entfällt die Auszahlung — auf den auszuzahlenden Betrag.
  const grund = gedeckelt >= IPV_TI.mindestbetrag ? null : (gedeckelt > 0 ? 'mindestbetrag' : 'ueberGrenze');
  // Wie ausbezahlt gerundet wird, sagen die Quellen nicht; auf den Franken im Jahr.
  const annual = grund ? 0 : Math.round(gedeckelt);
  const maxAnnual = Math.round(Math.min(r.maximal, praemie));

  // Keine publizierte Einkommensgrenze: das IAS verweist auf seinen Rechner ([5] Ziff. 1.3).
  const cantonData = { ...ipvData, maxIncome: null };
  const gemeinsam = {
    canton: 'TI', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltTI',
    extra: {
      basisjahr: IPV_TI.basisjahr, jahrKey: 'ipv.jahrTessin',
      ...(typOffen ? { zusatzVorbehaltKey: 'ipv.vorbehaltTIangestellt' } : {}),
    },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({
      ...gemeinsam, noteKey: grund === 'mindestbetrag' ? 'ipv.tiUnterMindestbetrag' : 'ipv.tiKeinAnspruch',
    });
  }
  // Art. 25 Abs. 2/3 [1]: Antrag bis Ende des Vorjahres ⇒ ab Januar; später im Jahr ⇒ erst ab dem
  // Folgemonat ([5] Ziff. 2: «Solo se la domanda … entro il 31 dicembre 2025, il diritto … da
  // gennaio 2026»). Nach der Frist zieht darum nirgends etwas von der Prämie ab (data/ipvAbzug.js,
  // wie LU und FR), und die Leser zeigen den Tessiner Satz (`fristNichtAbgezogenKey`).
  // ⟨korrigiert nach Fachprüfung #484, Blocker 1: zuerst bewusst nicht gesetzt, weil die Leser nur
  // den Luzerner Text kannten — das Budget zog 3'341 statt höchstens ~835 ab.⟩
  const fristVorbei = new Date() > new Date(`${jahr - 1}-12-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, anmeldefristVorbei: fristVorbei, fristNichtAbgezogenKey: 'ipv.tiFristNichtAbgezogen' },
    noteKey: fristVorbei ? 'ipv.tiFristVorbei' : 'ipv.tiFristLaeuft',
    noteParams: { jahr, vorjahr: jahr - 1, folgejahr: jahr + 1 },
  });
}
