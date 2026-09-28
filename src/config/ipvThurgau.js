// Prämienverbilligung (IPV) Kanton Thurgau — feste Ansätze nach dem Steuerbetrag, Jahr 2026 (K31).
//
// 🛑 DIESER KANTON ZEIGT BEWUSST KEINE ZAHL. Nicht weil das Modell unklar wäre — es ist das
// einfachste aller Kantone —, sondern weil es an einer Grösse hängt, die die App nicht kennt:
// der «einfachen satzbestimmenden Steuer zu 100 %» aus den Steuerdaten des Vorjahres. Die App
// hat dafür kein Feld, und ihr Steuerrechner liefert sie nicht belegt (siehe unten). Aus dem
// Einkommen eine Steuer zu schätzen und daraus eine feste Stufe von bis zu Fr. 3'408 zu wählen,
// hiesse, an einer Stufengrenze um den ganzen Betrag danebenzuliegen. Darum:
// `orientierung('tgSteuerbetrag')` in jeder Lage, mit den amtlichen Ansätzen im Grund-Text.
// Das ist ein Produktentscheid von Stebler Studios (neues Feld ja/nein), kein Code-Problem —
// die Rechnung steht unten bereit und ist gegen die amtliche Tabelle getestet.
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt TG:
//   [1] Krankenversicherungsverordnung (TG KVV, RB 832.10), «Aktuelle Version in Kraft seit:
//       01.01.2026 (Beschlussdatum: 31.03.2026)», keine künftige Version (Rechtsbuch-API,
//       Version 3027). § 14 Abs. 1 Ziff. 1–3, 5 zuletzt geändert 25.11.2025 (48/2025), in Kraft
//       01.01.2026. § 14: Ansätze · § 15 Abs. 1: Bemessung per 1. Januar nach den Steuerdaten
//       des Vorjahres · § 15 Abs. 2bis: Differenzen unter Fr. 30 bei der Neubemessung.
//   [2] Amt für Gesundheit TG, «Information zur Prämienverbilligung 2026», PDF vom 16.12.2025:
//       dieselben Ansätze als Tabelle (Kat. A–D), Jahrgänge, Antragsverfahren, Frist 31.12.2026.
//   [3] Steuergesetz TG (StG, RB 640.1), Rechtsbuch-Version 2929, «in Kraft seit 01.01.2025 bis
//       31.12.2028», gelesen 28.09.2026: § 6 Abs. 1 «Die nach den gesetzlichen Steuersätzen
//       berechnete Steuer … gilt als einfache Steuer zu 100 Prozent» · § 53 Abs. 1 steuerfreie
//       Beträge vom Reinvermögen: 200'000 (ungetrennte Ehe) / 100'000 (übrige) / +100'000 je Kind.
//       «Ohne steuerbares Vermögen» heisst also: Reinvermögen nach diesen Beträgen ≤ 0 — nicht
//       «kein Erspartes». Der Grund-Text sagt es (Fachprüfung #474, ⚠️ 1).
//
// DAS MODELL IN EINEM SATZ
// Wer per 1. Januar nach den provisorischen Steuerdaten des Vorjahres eine einfache Steuer zu
// 100 % bis Fr. 400 / 600 / 800 hat und KEIN steuerbares Vermögen, erhält einen festen Betrag
// von Fr. 3'408 / 2'556 / 1'704; Kinder erhalten Fr. 1'236, wenn die einfache Steuer der Eltern
// Fr. 1'600 nicht übersteigt und diese kein steuerbares Vermögen haben.
//
// WARUM DER STEUERRECHNER DER APP NICHT REICHT (geprüft 28.09.2026)
// `data/kantonaleSteuerdaten.js` schätzt die Kantons- UND Gemeindesteuer am Hauptort
// (Frauenfeld) aus einer Stütztabelle des ESTV-Rechners, linear interpoliert — nach eigenem Kopf
// eine «grobe Schätzung». Die einfache Steuer zu 100 % ist eine andere Grösse (vor den
// Steuerfüssen, auf dem SATZBESTIMMENDEN Einkommen), und die App kennt weder das steuerbare
// Einkommen noch das steuerbare Vermögen des Vorjahres. Eine Rückrechnung über Steuerfüsse wäre
// eine zweite Schätzung auf der ersten. Keine der beiden ist belegt.
//
// BEWUSST NICHT GEBAUT (auch wenn die einfache Steuer einmal erfasst würde):
//   · junge Erwachsene in Ausbildung ([2]: 50 % der effektiven Prämie, höchstens Fr. 2'376 —
//     Ausbildungsstatus fehlt der App) · Sozialhilfe (§ 14 Ziff. 6/7 [1]) · EL (Prämienpauschale,
//     [2]) · Grenzgänger und Kurzaufenthalter (§ 16 [1]) · Konkubinat mit Kindern (§ 18 [1]:
//     steuerliche Verhältnisse der Mutter).
import { jahrVorbei } from './kantonsModell.js';

// Werte 2026, wörtlich aus § 14 Abs. 1 [1]; dieselben Zahlen in [2]. Jahresbeträge in CHF.
export const IPV_TG = {
  jahr: 2026,
  // § 15 Abs. 1 [1]: «per 1. Januar aufgrund der Steuerdaten des Vorjahres».
  basisjahrAbstand: 1,
  // § 14 Abs. 1 Ziff. 1–3 [1]: «bis zum Steuerbetrag von Fr. … einfache satzbestimmende Steuer
  // zu 100 % und ohne steuerbares Vermögen». Kat. A–C nach [2].
  erwachsene: [
    { kat: 'A', bisSteuer: 400, betrag: 3408 },
    { kat: 'B', bisSteuer: 600, betrag: 2556 },
    { kat: 'C', bisSteuer: 800, betrag: 1704 },
  ],
  // § 14 Abs. 1 Ziff. 5 [1]: «Fr. 1'236 für Kinder bis zum Steuerbetrag von Fr. 1'600 einfache
  // satzbestimmende Steuer zu 100 % und ohne steuerbares Vermögen der Eltern». Kat. D [2],
  // Jahrgang 2008–2025.
  kinder: { kat: 'D', bisSteuer: 1600, betrag: 1236 },
  // [1] und [2]: «ohne steuerbares Vermögen» / «darf zudem Fr. 0 nicht übersteigen».
  vermoegenGrenze: 0,
};

// Die Rechnung nach § 14 [1] — ohne App-Daten. `einfacheSteuer` ist die einfache satzbestimmende
// Steuer zu 100 % (bei Kindern die der Eltern), `steuerbaresVermoegen` das provisorisch
// veranlagte steuerbare Vermögen. Die App ruft sie heute nicht auf (siehe Kopf); sie steht hier,
// damit sie bei einem Entscheid für ein Feld nicht neu erfunden wird.
export function ipvThurgauRechnen({ einfacheSteuer, steuerbaresVermoegen, kinderZahl = 0 }) {
  const ohneVermoegen = steuerbaresVermoegen <= IPV_TG.vermoegenGrenze;
  const stufe = ohneVermoegen ? IPV_TG.erwachsene.find((s) => einfacheSteuer <= s.bisSteuer) : undefined;
  const erwachsen = stufe ? stufe.betrag : 0;
  const kindGilt = ohneVermoegen && einfacheSteuer <= IPV_TG.kinder.bisSteuer;
  const kinder = kindGilt ? kinderZahl * IPV_TG.kinder.betrag : 0;
  return { total: erwachsen + kinder, erwachsen, kinder, kategorie: stufe ? stufe.kat : null, kindGilt };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für TG mit Beleg.
export function ipvThurgau(data, hh, ipvData, youngAdultsCount, orientierung) {
  // Die Ansätze beschliesst der Regierungsrat jährlich (§ 14 [1] wurde für jedes Jahr seit 2015
  // geändert). Ab dem 01.01. des Folgejahres: der Grund «jahr», weil der Grund-Text unten die
  // Beträge 2026 nennt. ⚠️ Dessen Satz «rechnet die App wieder» stimmt für TG auch mit neuen
  // Werten nicht (Fachprüfung #474, 💡 1) — bewusst so gelassen: der gemeinsame Text gilt für
  // alle Kantone, und ab 2027 sind die TG-Ansätze im Grund-Text ohnehin zu erneuern.
  if (jahrVorbei(IPV_TG.jahr)) return orientierung('jahr');
  return orientierung('tgSteuerbetrag');
}
