// SKOS-Grundbedarf für den Lebensunterhalt (GBL, SKOS-RL C.3.1) — EINE Jahrestabelle für beide
// Sozialhilfe-Rechnungen: den ausführlichen Rechner (data/sozialhilfeRechner.js) und die
// Schnellrechnung (config/cantonalData.js: Dashboard, Pegel, Schnellcheck, Dossiers).
//
// Warum (Seitenrundgang 26.10.2026, Werte 2027): Der GBL stand zweimal als feste Konstante im Code,
// ohne Jahr. Laut SODK/SKOS ist die nächste Anpassung auf den 1.1.2027 vorgesehen (an die
// EL-Teuerung gekoppelt). Ohne Tabelle rechnete die App ab Januar still mit dem Stand 2026 weiter und
// nannte ihn «Stand 1.1.2026». Mit der Tabelle schaltet sie am 1.1. selbst um, sobald ein Jahr
// eingetragen ist; fehlt es, liefert `gblStand()` das letzte belegte Jahr mit `belegt: false`, und die
// Ansicht sagt das (sh.gblNichtBelegt).
//
// Werte 2026: SODK/SKOS empfahlen 1061 «spätestens ab 1.1.2026» (gegengeprüft 2026-07-19, siehe
// data/sozialhilfeRechner.js); bestätigt via Sozialhilfehandbuch Kanton ZH + AG.
// Neues Jahr erst nach Prüfung an der Quelle (SODK-Beschluss / SKOS-Richtlinien), nie hochgerechnet.
//
// Bewusst ein kleines Blatt: config/cantonalData.js und Dashboard-Teile liegen im Startbündel.

import { werteFuerStichtag } from './jahrestabelle.js';

export const SKOS_GBL_JE_JAHR = Object.freeze({
  2026: Object.freeze({
    // Index = Personen in der Unterstützungseinheit (0 = Platzhalter), ab 8 Personen + proWeitere.
    tabelle: Object.freeze([0, 1061, 1624, 1974, 2271, 2568, 2784, 3000]),
    proWeitere: 216,
    quelle: 'SKOS-RL C.3.1, Stand 1.1.2026',
  }),
});

// { tabelle, proWeitere, quelle, jahr, belegt } für den Stichtag (Standard: heute).
export const gblStand = (stichtag) => werteFuerStichtag(SKOS_GBL_JE_JAHR, stichtag);

export function grundbedarf(personen, stichtag) {
  const { tabelle, proWeitere } = gblStand(stichtag);
  if (personen < 1) return 0;
  if (personen <= 7) return tabelle[personen];
  return tabelle[7] + (personen - 7) * proWeitere;
}
