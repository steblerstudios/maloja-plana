// K31 — der gemeinsame Rahmen der kantonalen Prämienverbilligungs-Modelle.
//
// WARUM ES DIESE DATEI GIBT
// Am 20.09.2026 lag derselbe Fehler in vier Kantonsmodulen: ohne erfasste Prämie fiel der
// gesetzliche Deckel still weg, und die App zeigte die Obergrenze statt des Anspruchs. Er
// musste viermal einzeln behoben werden — und wurde in Waadt zuerst übersehen, weil dessen
// Zweig gerade in keinem Pull Request lag. Was in allen Kantonen gleich ist, gehört an EINE
// Stelle: dann behebt man es einmal und es wirkt überall.
//
// WAS HIER NICHT HINGEHÖRT
// Alles, was kantonal verschieden ist — Formel, Zahlen, Bezugsjahr, Vorbehalte, die
// Reihenfolge der Riegel. Ein Rahmen, der Unterschiede einebnet, ist schlimmer als
// Wiederholung: er macht aus einem sichtbaren Unterschied einen unsichtbaren.
// Darum sind die Regeln unten **benannt und belegt**, nicht vereinheitlicht.

// Der Frankenwert des bundesrechtlichen 3a-Maximums steht an EINER Stelle (src/data/saeule3a.js)
// und wird hier nicht wiederholt. Das Blatt hat bewusst keine eigenen Importe, kostet also
// nichts ausser sich selbst.
import { saeule3aMaximum, groessteJahresEinzahlung } from '../data/saeule3a.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';
import { hauptlohnMonate } from '../utils/dreizehnter.js';

// ─── Eingaben lesen ────────────────────────────────────────────────────────────

// Vermögen ist in allen vier Kantonen dieselbe Summe der drei erfassten Posten.
// 🛑 Nicht dasselbe wie «steuerbares Gesamtvermögen» — die Kantone meinen das, die App
// kennt nur die erfassten Posten. Der Unterschied steht je Kanton in der Anzeige.
export function vermoegenSumme(f) {
  return Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
}

// Die drei Zurechnungsregeln — benannt und belegt, NICHT vereinheitlicht.
//
// Nachdem die Doppelzählung weg ist (siehe unten), trägt das rohe Nettoeinkommen die volle
// Säule 3a bereits. Die kantonale Regel wirkt darum als ABZUG: sie sagt, welcher Teil der 3a
// im massgebenden Einkommen NICHT stehen bleiben darf.
//
//   voll                 ZH, SG, LU — unbedingte Zurechnung, keine Schwelle, kein Deckel.
//                        ZH: § 5 Abs. 1 lit. b EG KVG (LS 832.01)
//                        SG: Art. 12 Abs. 2 Ziff. 2 (sGS 331.111)
//                        LU: § 7 Abs. 2 lit. b Prämienverbilligungsgesetz (SRL 866)
//                        ⇒ Abzug 0. Der App-Wert ist hier genau richtig.
//   bisBundesMaximum     BE — nur bis zum bundesrechtlichen Maximum für Unselbständige.
//                        KKVV Art. 6 Abs. 4 lit. i
//   schwelleOhneSaeule2  AG — nur der Teil ÜBER 10 % des Nettoerwerbseinkommens, und nur
//                        bei Personen OHNE Säule 2.
//                        § 6 Abs. 5 KVGG (SAR 837.200) i. V. m. § 5 Abs. 1 V KVGG (837.211)
//
// 🛑 EINE DIESER DREI WIRKT HEUTE NOCH NICHT — und das steht hier, statt still zu fehlen.
// Gleiche Bauart wie `KEIN_PRAEMIENDECKEL`: ein Weglassen, das als Entscheid lesbar ist,
// wird beim nächsten Kanton nicht kopiert. `schwelleOhneSaeule2` gibt `0` zurück wie `voll`,
// aber aus einem benannten Grund — wer die Zahl später einsetzt, sieht sofort, was ihm fehlte.
// ⟨23.09.2026: vorher waren es ZWEI. `bisBundesMaximum` rechnet seit heute; der alte Satz
// steht hier als Beleg, damit der Weg von «fehlt» nach «rechnet» lesbar bleibt.⟩

// Die Jahreseinzahlung in die Säule 3a — das Feld heisst «3. Säule A eingezahlt CHF/Jahr»
// (src/i18n/de.js), ist also ein Jahresbetrag und wird NICHT mit 12 multipliziert.
//
// 🛑 EHRLICH GESAGT: dieser Betrag ist der des LAUFENDEN Jahres, der Deckel (BE) der des
// Bemessungsjahres. Das ist kein Versehen, sondern dieselbe Näherung wie beim Einkommen: die
// App kennt die Veranlagung von vor zwei Jahren nicht und nimmt die heutigen Angaben als
// deren Stellvertreter. Innerhalb dieser Näherung ist das Maximum des Bemessungsjahres das
// stimmige — die Aufrechnung macht einen Abzug JENER Veranlagung rückgängig. Wer beides
// mischt (heutiger Betrag, heutiger Deckel), rechnet gegen KKVV Art. 7 Abs. 1.
// (Fachprüfung 23.09.2026, zweite Runde: der Kommentar behauptete hier vorher, der Betrag
// sei schon deshalb sauber, weil das Feld «CHF/Jahr» heisst. Das trägt der Datenweg nicht.)
//
// Bewusst nicht `Number(f.pension3a || 0)` wie in `einkommenJahr`: eine unlesbare Eingabe
// ('abc') ergäbe dort NaN, und ein NaN im Abzug macht aus einem gültigen Einkommen ein
// ungültiges — die App zeigte dann gar keine Zahl, obwohl sie eine hat. Unlesbar und negativ
// zählen darum als 0, der Deckel ist dann aus.
// ⚠️ Das liegt auf der ZU TIEFEN Seite, und die ist nach dem Block bei `einkommenJahr` auch
// nicht harmlos. Hier trotzdem so: eine unlesbare Zahl zu deuten wäre Raten, und der Fall
// entsteht nicht über die Oberfläche (`type: 'number'`), sondern nur aus Altdaten.
const betrag3a = (f) => Math.max(0, Number(f.pension3a) || 0);

// Kann der gespeicherte `pension3a`-Wert überhaupt EIN Jahr sein?
//
// ⟨umgebaut 23.09.2026, nachdem die Ursache behoben war — der alte Weg steht als Beleg⟩
// Vorher wurde gefragt: «tragen die Einzahlungszeilen mehr als ein Kalenderjahr?». Das war
// richtig, solange der Tracker datumsblind über alle Zeilen summierte. Seit er nur noch das
// laufende Jahr nach `pension3a` schreibt, ist es FALSCH und hätte die Falschen getroffen:
// Wer seine Einzahlungen über Jahre sauber weiterführt — wofür der Tracker gebaut ist —,
// hat selbstverständlich mehrere Jahre in der Liste und trotzdem einen korrekten
// Jahresbetrag. Der Riegel hätte genau diesen Menschen die Zahl weggenommen.
//
// Gefragt wird jetzt am Wert selbst: `pension3a` ist höchstens dann ein Jahresbetrag, wenn
// er die grösste Summe eines EINZELNEN Jahres nicht übersteigt. Damit bleibt der Riegel
// dort scharf, wo er gebraucht wird — bei Altdaten aus der Zeit vor dem Fix und bei von
// Hand bearbeiteten Profilen, die die Oberfläche nie durchlaufen haben. Beide gibt es: die
// Migration greift erst, wenn jemand das Kapitel öffnet, und bis dahin liegt der alte
// Mehrjahres-Wert unverändert im Speicher.
//
// Ohne erfasste Zeilen lässt sich nichts sagen (`null`) — dann greift der Riegel nicht,
// wie schon vorher.
function ueberEinJahrHinaus(f, laufendesJahr) {
  const groesstesJahr = groessteJahresEinzahlung(f.pension3aDeposits, laufendesJahr);
  return groesstesJahr !== null && betrag3a(f) > groesstesJahr;
}

// Ab welchem Betrag überhaupt abgezogen wird: das HÖHERE der beiden Jahresmaxima.
// Warum nicht einfach das des Bemessungsjahres, steht ausführlich bei `nichtAufgerechnet`.
// `null`, wenn das Bemessungsjahr nicht belegt ist — dann gilt kein Deckel.
// `jahre` ist `{ bemessungsjahr, anspruchsjahr }`; fehlt das Anspruchsjahr oder ist es nicht
// belegt, zählt allein das Bemessungsjahr (dann gibt es kein Band, das zu schonen wäre).
function abzugsSchwelle(jahre) {
  const bemessung = saeule3aMaximum(jahre?.bemessungsjahr);
  if (bemessung === null) return null;
  return Math.max(bemessung, saeule3aMaximum(jahre?.anspruchsjahr) ?? bemessung);
}

export const SAEULE_3A = Object.freeze({
  voll: Object.freeze({
    name: 'voll',
    kantone: 'ZH, SG, LU',
    beleg: 'ZH § 5 Abs. 1 lit. b EG KVG (LS 832.01) · SG Art. 12 Abs. 2 Ziff. 2 (sGS 331.111) · LU § 7 Abs. 2 lit. b (SRL 866)',
    nichtAufgerechnet: () => 0,
  }),

  bisBundesMaximum: Object.freeze({
    name: 'bisBundesMaximum',
    kantone: 'BE',
    beleg: 'KKVV Art. 6 Abs. 4 lit. i (BSG 842.111.1, Stand 01.12.2025)',
    // Wortlaut an der Quelle, abgerufen 23.09.2026 aus der bernischen Erlass-Sammlung
    // (https://www.belex.sites.be.ch/app/de/texts_of_law/842.111.1):
    //   «Beiträge an die gebundene Selbstvorsorge (Säule 3a) bis zum nach Bundesrecht
    //    zulässigen Maximalbetrag für unselbständig Erwerbstätige werden dazugerechnet.»
    //
    // 🛑 GEGENPROBE — und die erste Fassung dieses Satzes war selbst ein blindes Messgerät.
    // ⟨Hier stand am 23.09.2026: «Gegenprobe bestanden: eine ERFUNDENE BSG-Nummer (842.111.9)
    // liefert dort eine LEERE Seite, nicht denselben Text.» Das galt nur im Browser, der die
    // Seite ausführt. Roh abgerufen ist `/app/de/texts_of_law/…` eine SPA-Hülle und für jede
    // Nummer, echt oder erfunden, BYTE-IDENTISCH (2303 Bytes, gleicher SHA-256) — exakt der
    // Fehlermodus, an dem Fedlex am 20.09. gescheitert ist. Der Satz stehengelassen, weil
    // genau dieser Kommentar sonst zum nächsten Kanton kopiert wird.⟩
    // Das Messgerät, das WIRKLICH misst, ist die API:
    //   https://www.belex.sites.be.ch/api/texts_of_law/842.111.1  → HTTP 200, 2'160'333 Bytes
    //   https://www.belex.sites.be.ch/api/texts_of_law/842.111.9  → HTTP 404, 0 Bytes
    // Erst dieser Unterschied ist ein bestandener Test. Der Wortlaut oben ist über beide Wege
    // gelesen und stimmt zeichengleich überein.
    //
    // 🛑 WELCHER BETRAG — drei Lesarten, und die App folgt der mittleren:
    //   (a) der je Person geltende Höchstabzug. Dann hätte der Halbsatz «für unselbständig
    //       Erwerbstätige» keinen Inhalt; wer ohne 2. Säule 36'288 einzahlt, bekäme sie voll
    //       aufgerechnet. Wir halten das für falsch — der Erlass grenzt gerade dagegen ab.
    //   (b) EIN fester Betrag, das Maximum «mit 2. Säule» (BVV 3 Art. 7 Abs. 1 lit. a).
    //       Danach rechnet die App. Bei 36'288 Einzahlung ⇒ Abzug 29'030 statt 0.
    //   (c) wörtlich «für unselbständig Erwerbstätige»: BVV 3 knüpft nicht an selbständig
    //       oder nicht an, sondern an die ZUGEHÖRIGKEIT zu einer Vorsorgeeinrichtung. Für
    //       Angestellte OHNE Pensionskasse (Lohn unter der BVG-Eintrittsschwelle) wäre der
    //       «für Unselbständige zulässige» Betrag demnach lit. b, also 20 % / 35'280.
    //       Diese Gruppe behandelt die App wie alle anderen.
    // (b) ist eine vertretbare Lesart, kein Befund. Die Frage liegt beim ASV Bern
    // (docs/sources/FRAGEN-AN-DIE-AEMTER.md, Frage 2) und ist nicht beantwortet.
    //
    // 🛑 WELCHES JAHR — das war der zweite Fehler, gefunden in der Fachprüfung 23.09.2026.
    // Zuerst stand hier `SAEULE3A_MAX`, also der Höchstabzug des ANSPRUCHSJAHRES (7'258).
    // Massgebend ist aber die definitive Veranlagung des vorletzten Steuerjahres (KKVV
    // Art. 7 Abs. 1) — Art. 6 Abs. 4 korrigiert JENES Reineinkommen. Aufgerechnet werden
    // kann nur, was dort abgezogen werden durfte: für das Anspruchsjahr 2026 das Maximum
    // von 2024, also 7'056. Die App sagt es dem Menschen längst selbst («Im Kanton Bern ist
    // die definitive Veranlagung {basisjahr} die Grundlage», i18n `ipv.vorbehaltBE`) — nur
    // der Deckel rechnete zwei Jahre daneben. Gemessener Unterschied an einer Stufengrenze:
    // CHF 480 im Jahr, auf der zu tiefen Seite.
    // 🛑 `vorbehalt` ist NICHT `offen`, und der Unterschied ist der Punkt:
    //   `offen`      = die Regel rechnet nicht. Es fehlt etwas, ohne das keine Zahl entsteht.
    //   `vorbehalt`  = die Regel rechnet, aber auf einer vertretbaren Lesart statt auf einer
    //                  bestätigten. Die Zahl ist da und begründet — sie kann sich ändern,
    //                  wenn das Amt antwortet.
    // Ohne diese Trennung müsste man zwischen «gar keine Zahl» und «keine offene Frage»
    // wählen, und beides wäre gelogen. (Eingeführt 23.09.2026 nach der Fachprüfung, die
    // zu Recht bemängelte, dass mit dem Entfernen von `offen` die Frage ans ASV unsichtbar
    // wurde — obwohl sie in FRAGEN-AN-DIE-AEMTER.md weiter offen steht.)
    vorbehalt: 'Gerechnet nach der Lesart «ein fester Betrag, das Maximum mit 2. Säule, aus '
      + 'dem Bemessungsjahr». Wortlaut und Frankenwerte sind belegt, die Lesart ist beim ASV '
      + 'Bern angefragt und nicht bestätigt (FRAGEN-AN-DIE-AEMTER.md, Frage 2). Betroffen '
      + 'sind nur Einzahlungen ÜBER dem Maximum.',
    maximumFuer: (bemessungsjahr) => saeule3aMaximum(bemessungsjahr),
    // Das rohe Nettoeinkommen trägt die 3a voll, der Kanton rechnet sie nur bis zum Maximum
    // auf ⇒ abzuziehen ist der Überschuss. Gegengerechnet am Erlassweg, Nettoeinkommen
    // 60'000, Einzahlung 20'000, Anspruchsjahr 2026 (Bemessung 2024, Maximum 7'056):
    // amtlich Reineinkommen 40'000 + min(20'000, 7'056) = 47'056. Die App zieht erst über
    // BEIDEN Jahresmaxima ab (`abzugsSchwelle`, 2026: max(7'056, 7'258) = 7'258, Begründung
    // unten): 60'000 − max(0, 20'000 − 7'258) = 47'258 — 202 Franken über dem amtlichen Weg.
    // (Bis 24.09.2026 stand hier «= 47'056» für die App; das galt vor der Schwelle über
    // beiden Maxima.)
    //
    // 🛑 DIESER RECHENWEG UNTERSTELLT, die Veranlagung habe die volle Einzahlung abgezogen —
    // also 40'000 statt 60'000 − 7'056. Das trifft zu für Personen OHNE 2. Säule (BVV 3
    // Art. 7 Abs. 1 lit. b, bis 35'280). Für eine Person MIT Pensionskasse hätte die
    // Veranlagung höchstens 7'056 abgezogen, die Aufrechnung von 7'056 hübe das genau auf,
    // und der richtige Abzug wäre NULL. Ob eine 2. Säule besteht, weiss die App nicht — es
    // ist dieselbe fehlende Angabe, die `schwelleOhneSaeule2` (AG) blockiert.
    // Wir rechnen hier trotzdem, weil der Fall ohne 2. Säule derjenige ist, für den der
    // Deckel überhaupt geschrieben wurde: nur dort werden Beträge weit über dem
    // Unselbständigen-Maximum einbezahlt. Bei einer Person mit PK über 7'258 wäre die
    // Einzahlung ohnehin gesetzwidrig. Die Annahme steht hier, statt still zu wirken, und
    // sie ist Teil der Frage ans ASV (FRAGEN-AN-DIE-AEMTER.md, Frage 2).
    // (Befund Fachprüfung 23.09.2026, dritte Runde: die Annahme trug die ganze Rechnung und
    // war nirgends benannt.)
    // Der Abzug senkt das massgebende Einkommen, hebt also die Verbilligung — das ist die
    // richtige Richtung: eine zu tiefe Verbilligung hält Berechtigte vom Antrag ab und ist
    // NICHT die vorsichtige Seite (siehe den Block bei `einkommenJahr`).
    //
    // 🛑 ABGEZOGEN WIRD ERST ÜBER BEIDEN JAHRESMAXIMA — der Fehler, den die dritte
    // Fachprüfungsrunde am 23.09.2026 gefunden hat, und er war messbar:
    // Eine angestellte Person mit Pensionskasse zahlt 2026 exakt ihr gesetzliches Maximum
    // von 7'258 ein. Gegen das Maximum des Bemessungsjahres (7'056) gehalten, entstand
    // daraus ein Abzug von 202 Franken — und an einer Stufengrenze gemessen CHF 480 im Jahr
    // ZU VIEL, also auf der Rückforderungsseite. Diese Person hat nichts falsch gemacht;
    // der Abzug war reines Artefakt daraus, dass der Betrag aus dem laufenden Jahr stammt
    // und der Deckel aus dem Bemessungsjahr (siehe `betrag3a`).
    //
    // Im Band zwischen den beiden Maxima (2026: 7'056–7'258) kann die App NICHT
    // unterscheiden, ob jemand über das Maximum hinaus eingezahlt hat oder ob das Maximum
    // seither bloss gestiegen ist. Ein Abzug braucht aber eine positive Begründung — «dieser
    // Teil wurde nicht aufgerechnet». Wo die fehlt, wird nicht abgezogen. Das ist dieselbe
    // Haltung wie beim `() => 0` von vorher, nur eng begrenzt statt pauschal.
    //
    // ⚠️ Der Preis, offen gesagt: für jemanden, der WIRKLICH über dem Maximum des
    // Bemessungsjahres lag, fällt der Abzug um bis zu 202 Franken zu klein aus — im
    // ungünstigsten Fall eine Stufe zu tief. Das ist die andere Fehlerrichtung, und sie ist
    // nach dem Block bei `einkommenJahr` nicht harmlos. Sie bleibt, weil die Gegenrichtung
    // (Rückforderung) einen Fall trifft, der völlig gewöhnlich ist — den Maximalzahler —,
    // und diese Richtung nur einen, der ohnehin ausserhalb der Norm liegt.
    //
    // Ohne belegtes Bemessungsjahr KEIN Deckel, und der Aufrufer muss das vorher abfangen
    // (ipvBern.js tut es mit `orientierung('jahr')`). Hier `0` statt eines geratenen Werts.
    nichtAufgerechnet: (f, jahre) => {
      const schwelle = abzugsSchwelle(jahre);
      return schwelle === null ? 0 : Math.max(0, betrag3a(f) - schwelle);
    },
    // 🛑 Wann die Herleitung NICHT trägt (Befund Fachprüfung 23.09.2026, in der zweiten
    // Runde geschärft). Zwei getrennte Widerlegungen, beide nur dort, wo der Deckel
    // überhaupt beisst:
    //
    // (1) Die Einzahlung ist grösser als das ganze erfasste Jahreseinkommen. «Das
    //     Nettoeinkommen trägt die 3a bereits» gilt nur, wenn sie AUS diesem Einkommen kam;
    //     hier kam sie es nicht — aus Vermögen, oder es steht der KONTOSTAND im Feld für die
    //     Jahreseinzahlung (`pension3aBalance` liegt direkt daneben, die Verwechslung ist
    //     nah). Ungebremst zog der Abzug das Einkommen ins Negative,
    //     `beMassgebendesEinkommen` klemmte auf 0 — und die App zeigte die HÖCHSTE Stufe.
    //     Ein Vertipper im Formular hätte still den Höchstbetrag ergeben.
    //
    // (2) Der gespeicherte `pension3a` reicht ÜBER EIN JAHR HINAUS. Bis zum 23.09.2026
    //     summierte der Tracker datumsblind über alle Zeilen; drei Jahreszeilen à 7'000
    //     ergaben eine «Jahreseinzahlung» von 21'000 und einen Abzug, den es nicht gibt —
    //     gemessen: CHF 804 Anspruch, wo keiner besteht. Richtung: zu hoch, also
    //     Rückforderung.
    //     Die Ursache ist seither behoben (der Tracker schreibt nur noch das laufende Jahr),
    //     der Riegel bleibt aber: Die Migration greift erst, wenn jemand das Kapitel öffnet,
    //     und bis dahin liegt der alte Mehrjahres-Wert unverändert im Speicher. Was er prüft,
    //     hat sich dabei geändert — siehe `ueberEinJahrHinaus`; «mehrere Jahre in der Liste»
    //     ist seit dem Fix normal und kein Fehler mehr.
    //
    // 🛑 BEIDE erst ab dem Maximum. Bleibt die Einzahlung darunter, ist der Abzug ohnehin 0
    // und nichts ist widerlegt — dann darf der Riegel nicht greifen. Sonst nähme er gerade
    // der Gruppe mit kleinem Einkommen die Zahl weg, die nach KKVV Art. 13 Abs. 2 lit. i
    // selbst einen Antrag stellen muss und ohne diesen Hinweis den ganzen Anspruch verliert.
    // (So stand es zuerst: 6'000 Einkommen, 3a 6'500 ⇒ keine Zahl, obwohl der Deckel bei
    // 7'056 gar nicht beisst.)
    // ⚠️ Ein Betrag, der zu EINEM einzelnen vergangenen Jahr gehört, läuft hier durch:
    // geprüft wird, ob der Wert über ein Jahr hinausreicht, nicht welches Jahr es ist.
    // Bewusst so — die App nimmt die heutigen Angaben ohnehin als Stellvertreter der
    // Veranlagung (siehe `betrag3a`), ein einzelnes abweichendes Jahr ist darin kein
    // Widerspruch. Mehrere Jahre in EINER Zahl sind einer.
    widerlegt: (f, jahresEinkommen, jahre) => {
      const schwelle = abzugsSchwelle(jahre);
      // Unter der Schwelle entsteht gar kein Abzug — dann ist auch nichts zu widerlegen.
      if (schwelle === null || betrag3a(f) <= schwelle) return false;
      // `Number.isFinite` ausdrücklich: bei unlesbarem Einkommen ist `jahresEinkommen` NaN,
      // und jeder Vergleich damit wäre `false` — der Riegel griffe stillschweigend nie.
      // Heute folgenlos (das NaN endet ohnehin in `amount: null`), aber die Absicht gehört
      // hingeschrieben, damit sie eine spätere Korrektur dort überlebt.
      const ueberEinkommen = Number.isFinite(jahresEinkommen) && betrag3a(f) > Math.max(0, jahresEinkommen);
      // Undatierte Zeilen zählen zum Anspruchsjahr — dasselbe Jahr, das der Tracker als das
      // laufende führt. Für 2026 fallen beide zusammen; die Zuordnung liegt in saeule3a.js,
      // damit Anzeige, Formular und Rechenkern sie gleich lesen.
      return ueberEinkommen || ueberEinJahrHinaus(f, jahre?.anspruchsjahr);
    },
  }),

  schwelleOhneSaeule2: Object.freeze({
    name: 'schwelleOhneSaeule2',
    kantone: 'AG',
    beleg: '§ 6 Abs. 5 KVGG (SAR 837.200) i. V. m. § 5 Abs. 1 V KVGG (SAR 837.211)',
    // 🛑 Die Regel ist belegt und rechenbar — was fehlt, ist die ANGABE, ob eine Säule 2
    // besteht. Die App führt `bvgInsurer`, `bvgContribution` und `bvgBalance`, aber leere
    // Felder heissen «nicht erfasst», nicht «keine Säule 2». Aus einem Nichtwissen in die
    // eine oder andere Richtung zu rechnen, wäre beides geraten.
    //
    // ⟨23.09.2026⟩ WARUM DIESE REGEL NICHT MIT BE ZUSAMMEN GEBAUT WURDE, obwohl beide gleich
    // aussehen: BE fehlte eine ZAHL, und eine Zahl kann man an der Quelle holen — das ist
    // heute geschehen. AG fehlt eine ANGABE ÜBER DIE PERSON, die in der App nicht steht.
    // Die holt kein Erlass nach; sie braucht entweder ein neues Feld oder den Entscheid,
    // in AG eine Orientierung statt einer Zahl zu zeigen. Beides ist ein Produktentscheid
    // von Stebler Studios, keine Fachrecherche. Darum bleibt hier `() => 0` — nicht weil es
    // vergessen wurde, sondern weil der nächste Schritt nicht am Code hängt.
    // Bis das entschieden ist, bleibt es beim bisherigen Verhalten (volle Zurechnung) —
    // ausdrücklich, nicht aus Versehen. Wirkung: bei Personen ohne Säule 2 fällt der
    // Anspruch bis zu 34 % zu tief aus (nachgerechnet 20.09.2026: Nettoerwerb 30'000,
    // 3a 6'000 → 1'017.50 statt 1'542.50).
    offen: 'Ob eine Säule 2 besteht, weiss die App nicht SICHER — leere BVG-Felder heissen '
      + '«nicht erfasst». Entscheid nötig: fragen, oder in AG eine Orientierung statt einer '
      + 'Zahl zeigen. Bis dahin volle Zurechnung wie bisher.',
    // Die Rechnung steht bereit, damit sie beim Entscheid nicht neu erfunden wird.
    schwelle: (f) => 0.1 * Number(f.monthlyIncome || 0) * hauptlohnMonate(f.dreizehnter),
    nichtAufgerechnet: () => 0,
  }),
});

// 🛑 SÄULE 3A — WARUM HIER NICHTS MEHR AUFGERECHNET WIRD (Befund Fachprüfung 20.09.2026)
//
// Bis zum 20.09.2026 stand hier `+ Number(f.pension3a || 0)`, mit dem Beleg, alle vier
// Erlasse rechneten die Säule 3a dem massgebenden Einkommen hinzu. Das stimmt — aber die
// Erlasse rechnen sie auf eine STEUERGRÖSSE auf, in der sie bereits abgezogen ist
// (ZH: Einkünfte − Abzüge · BE/SG: Reineinkommen · AG: steuerbares Einkommen). Die
// Aufrechnung macht dort nur den 3a-Abzug rückgängig.
//
// Die App hat diesen Abzug NIE gemacht. `monthlyIncome` ist laut eigener Feldhilfe
// «Netto ist was auf Ihrem Konto ankommt» (src/i18n/de.js) — das Geld, AUS dem die 3a
// überwiesen wird. Sie steckt also schon drin. Die App hatte damit bereits das Ergebnis
// der Aufrechnung und addierte sie ein ZWEITES Mal.
//
// Wirkung in allen vier Kantonen gleich: Einkommen zu hoch ⇒ Verbilligung ZU TIEF.
// Nachgerechnet am 20.09.2026 gegen die Rechenkerne, Alleinstehende ohne Kinder:
//   ZH Region 1, Basis 48'000:  3a  3'000 → 252.–/Jahr zu wenig · 12'000 → 1'008.–
//   AG,           Basis 30'000:  3a  3'000 → 525.–/Jahr zu wenig · 12'000 → Anspruch auf 0
//   SG Region 1,  Basis 30'000:  3a  3'000 → 630.60/Jahr zu wenig · 12'000 → Anspruch auf 0
//   BE ist eine Stufentabelle: ein Franken Differenz kostet dort eine ganze Stufe, bis 888.–
//
// 🛑 Eine zu tiefe Zahl ist NICHT die vorsichtige Seite. Sie hält Berechtigte vom Antrag ab —
// dieselbe Klasse Schaden wie eine zu hohe.
// Das rohe Jahres-Nettoeinkommen aus den erfassten Monatsfeldern — ohne jede kantonale Regel.
// Eigene Funktion, weil BE es zweimal braucht: einmal für die Rechnung und einmal, um zu
// prüfen, ob die 3a-Einzahlung überhaupt daraus stammen kann.
// 🛑 13. Monatslohn (Befund Fachprüfung 25.09.2026, PR #380): bis dahin ×12 für alles — wer
// einen 13. erhält, hat 8,3 % mehr Jahreseinkommen (13/12), die Verbilligung fiel ZU HOCH aus. Der
// Hauptlohn zählt jetzt nach derselben Regel wie im Steuerrechner (utils/dreizehnter.js);
// Nebenerwerb und Renten bleiben ×12. Bei «offen» ×12 — das Ergebnis sagt es dazu
// (annahmen.ohneDreizehnten, gesetzt in calculateIPV).
export function rohesEinkommenJahr(f) {
  return Number(f.monthlyIncome || 0) * hauptlohnMonate(f.dreizehnter)
    + ['sideIncome', 'ahvRente', 'ivRente', 'bvgRente'].reduce((s, k) => s + Number(f[k] || 0), 0) * 12;
}

// `jahre` = `{ bemessungsjahr, anspruchsjahr }` und wird nur von `bisBundesMaximum` (BE)
// gebraucht: dort hängt der Deckel am Steuerjahr der zugrunde liegenden Veranlagung, nicht
// am Anspruchsjahr — und die Schwelle an beiden. Die anderen Regeln ignorieren das Argument.
export function einkommenJahr(f, regel = SAEULE_3A.voll, jahre = null) {
  // Die kantonale Regel wirkt jetzt als ABZUG, nicht als Zuschlag: im rohen Nettoeinkommen
  // ist die volle 3a enthalten, also muss weg, was der Kanton NICHT aufrechnen würde.
  return rohesEinkommenJahr(f) - regel.nichtAufgerechnet(f, jahre);
}

export function geburtsjahr(b) {
  return /^\d{4}-/.test(b?.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
}

// Prämie als Jahresbetrag. Bewusst ohne `|| 0`: ein fehlendes Feld ergibt NaN, und NaN
// fällt durch den Riegel `praemieFehlt` — anders als eine 0, die wie eine erfasste Null aussieht.
export function praemieJahr(data) {
  return Number(data?.versicherungen?.kkPremium) * 12;
}

// ─── Riegel, die in ALLEN Kantonen gleich sind ────────────────────────────────

// Die App rechnet nur für das Jahr, dessen Werte belegt sind. Ab dem 01.01. des Folgejahres
// lieber keine Zahl als eine aus veralteten Sätzen — die Kantone passen jährlich an.
export function jahrVorbei(jahr) {
  return new Date().getFullYear() > jahr;
}

// `cohabiting` gehört dazu: Konkubinat rechnet je nach Kanton wie ein Paar, und das
// Einkommen der zweiten Person kennt die App nicht. (Befund Fachprüfung 20.09.2026 —
// der Riegel prüfte nur `married`, `cohabiting` lief durch und rechnete.)
// Die eingetragene Partnerschaft zählt wie die Ehe (giltAlsVerheiratet, utils/zivilstand.js).
export function mehrereErwachsene(hh, b) {
  return hh.adults !== 1 || giltAlsVerheiratet(b.maritalStatus) || b.maritalStatus === 'cohabiting';
}

// 🛑 DER RIEGEL, DER VIERMAL GEFEHLT HAT.
// Ohne erfasste Prämie greift der gesetzliche Deckel nicht (die Verbilligung ist höchstens
// so hoch wie die tatsächliche Prämie). Eine Zahl ohne ihn wäre die Obergrenze, nicht der
// Anspruch — in AG gemessen bis 40 % zu viel. Jeder neue Kanton ruft diesen Riegel auf,
// bevor er eine Zahl zurückgibt. (Befund Fachprüfung 20.09.2026, ZH/BE/AG; VD nachgezogen.)
export function praemieFehlt(praemie) {
  return !(praemie > 0);
}

// 🛑 UND DER GEGENFALL, damit ein Fehlen nicht wie ein Vergessen aussieht.
// Nicht jeder Kanton kennt diesen Deckel: St.Gallen begrenzt die Verbilligung NICHT auf die
// fakturierte Prämie (weder sGS 331.538 noch sGS 331.111 enthalten eine solche Bestimmung;
// gemessen am vollen Verordnungstext mit Gegenprobe, 20.09.2026). Dort geht die Prämie in
// die Rechnung gar nicht ein, und `praemieFehlt` wäre falsch.
// Ein Kantonsmodul, das den Riegel weglässt, setzt stattdessen diese Konstante und nennt den
// Grund — so liest sich das Auslassen als Entscheid, nicht als Lücke, und der nächste Kanton
// kopiert kein stilles Fehlen. (Befund Fachprüfung 20.09.2026.)
export const KEIN_PRAEMIENDECKEL = Object.freeze({
  SG: 'sGS 331.538 und sGS 331.111 kennen keine Begrenzung auf die fakturierte Prämie — '
    + 'die Verbilligung bemisst sich allein an der kantonalen Referenzprämie. '
    + 'Offene Frage an die SVA St.Gallen: was gilt, wenn die eigene Prämie tiefer ist?',
});

// ─── Regeln, die kantonal VERSCHIEDEN sind — benannt statt vereinheitlicht ─────

// Ab wann gilt eine Person als erwachsen? Zwei Regeln, nicht vier Schreibweisen — aber
// DREI Wissensstände, und der Unterschied zwischen ihnen zählt:
//
//   abEndeVorjahr       ZH — ausdrücklich im Erlass: § 8 EG KVG, «für das ganze Jahr das
//                       Alter am Ende des Vorjahres massgebend». BELEGT.
//   mangelsStichtag     BE, VD, SG — rechnerisch dasselbe wie oben, aber aus einem anderen
//                       Grund: die Erlasse nennen für das Alter KEINEN Stichtag. Darum
//                       rechnet die App nur, wenn die Alterszeile das ganze Jahr dieselbe
//                       ist. GEWÄHLT, nicht belegt — und jederzeit zu überdenken, wenn eine
//                       Quelle auftaucht.
//   imAnspruchsjahr     AG — die SVA führt für 2027 die Jahrgänge 2002–2008 als junge
//                       Erwachsene; erwachsen ist, wer im Anspruchsjahr 26 wird.
//                       LU — die WAS führt für 2026 «Erwachsene (ab Jahrgang 2000)» in ihrer
//                       amtlichen Richtprämien-Tabelle, also dieselbe Regel. (23.09.2026)
//
// ⚠️ Der Unterschied zwischen den beiden Regeln ist echt und beträgt einen Jahrgang: für das
// Anspruchsjahr 2026 rechnet AG für den Jahrgang 2000, die anderen nicht. Gemessen am
// aufgezeichneten Verhalten, nicht aus dem Quelltext gelesen.
//
// 🛑 `abEndeVorjahr` und `mangelsStichtag` sind absichtlich zwei Namen für dieselbe Rechnung.
// Sonst schreibt der nächste Kanton «belegt», wo «vorsichtig gewählt» gemeint war — und ein
// gewählter Wert, den niemand mehr als Wahl erkennt, wird beim nächsten Zweifel verteidigt
// statt geprüft. (Befund Fachprüfung 20.09.2026.)
const ALTER_AM_ENDE_DES_VORJAHRES = (jahr, geburt) => (jahr - 1) - geburt >= 26;
export const ERWACHSEN = {
  abEndeVorjahr: ALTER_AM_ENDE_DES_VORJAHRES,
  mangelsStichtag: ALTER_AM_ENDE_DES_VORJAHRES,
  imAnspruchsjahr: (jahr, geburt) => (jahr - geburt) >= 26,
};

// Kinderalter aus Geburtsdatum oder eingetipptem Alter.
//
// Kind ohne Geburtsdatum: `age` ist in der App mit 0 vorbelegt (ChapterView legt neue Kinder
// so an, dataMigration setzt es bei Alt-Daten ebenso). Eine 0 heisst darum «nicht erfasst»,
// nicht «Säugling» — sonst erhöhen sich Referenzprämie und Mindestanspruch still
// (Befund Fachprüfung 20.09.2026). Ergebnis `null` ⇒ der Kanton gibt keine Zahl.
//
// `eingetipptPlus` ist die vorsichtige Seite an der Grenze 18 und je Kanton verschieden:
// ZH nimmt das eingetippte Alter unverändert (Bezugsjahr ist bereits das Vorjahr), BE zählt
// ein Jahr dazu (Bezugsjahr ist das Anspruchsjahr). Beide Wege wirken nie nach oben.
export function kinderAlter(children, bezugsjahr, eingetipptPlus = 0) {
  return (children || []).map((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? bezugsjahr - Number(c.birthDate.slice(0, 4))
    : (Number(c.age) > 0 ? Number(c.age) + eingetipptPlus : null)));
}

export const ALTER_UNERFASST = (alter) => alter.some((a) => a === null);
export const UEBER_18 = (alter) => alter.some((a) => a > 18);

// ─── Prämienregion aus PLZ und Ort ────────────────────────────────────────────

// Wortgleich in ZH und BE gewesen. Gibt die Region zurück, wenn die Gemeinde eindeutig ist
// ODER alle Gemeinden der PLZ in derselben Region liegen — sonst `null`, und der Kanton
// entscheidet, welchen Grund er dafür nennt (BE unterscheidet «Gemeinde unklar» von
// «Region der Gemeinde strittig», siehe Reutigen).
export function regionAusPLZ({ data, kanton, lookupPLZ, regionFn }) {
  const plz = String(data.wohnen?.postalCode || '').trim();
  const orte = plz ? lookupPLZ(plz).filter((g) => g.kanton === kanton) : [];
  const stadt = String(data.wohnen?.city || '').trim().toLowerCase();
  const ort = orte.length === 1 ? orte[0] : orte.find((g) => g.gemeinde.toLowerCase() === stadt);
  const regionen = new Set(orte.map((g) => regionFn(g.bfsNr)));
  const region = ort ? regionFn(ort.bfsNr) : regionen.size === 1 ? [...regionen][0] : null;
  return { region, orte, ort };
}

// ─── Deckel ───────────────────────────────────────────────────────────────────

// Der gesetzliche Deckel gilt PRO PERSON: die App kennt nur die Prämie der erwachsenen
// Person, also wird auch nur deren Anteil gedeckelt — der Kinderanteil bleibt ungedeckelt,
// statt den Deckel mit Kindern ganz entfallen zu lassen (Befund Fachprüfung 20.09.2026).
// Wortgleich in BE und VD gewesen.
export function deckelnProPerson(gesamt, erwachsenenTeil, praemie) {
  return Math.round(Math.min(erwachsenenTeil, praemie) + (gesamt - erwachsenenTeil));
}

// ─── Ergebnis ─────────────────────────────────────────────────────────────────

// Die Rückgabe war in allen Kantonen bis auf wenige Felder dieselbe. `extra` trägt, was
// den Kanton ausmacht (ZH/BE: `region` · AG: `basisjahr`).
export function ergebnisOhneAnspruch({ canton, cantonData, jahr, vorbehaltKey, noteKey, noteParams = {}, extra = {} }) {
  return {
    belegt: true, eligible: false, amount: 0,
    noteKey, noteParams,
    canton, cantonData, jahr, vorbehaltKey, ...extra,
  };
}

export function ergebnisMitAnspruch({ canton, cantonData, jahr, vorbehaltKey, noteKey, noteParams = {}, annual, maxAnnual, youngAdultsCount, extra = {} }) {
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey, noteParams,
    youngAdultsCount, canton, cantonData, jahr, vorbehaltKey, ...extra,
  };
}
