import React, { useState } from 'react';
import { text, weight, space, radius } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, ablaufStyles, ablaufTextFarbe, ohneNummer } from './AblaufSchale.jsx';
import { plusTage, heuteIso, istVorbei } from './utils/fristen.js';
import { MietzinsHinweis } from './components/MietzinsHinweis.jsx';
import { lookupPLZ } from './data/plzGemeinde.js';
import { merkpunktSichern } from './utils/merkliste.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { hinweisZeichen, erledigtZeichen } from './IconSystem.jsx';

// Umzug — der 3. geführte Ablauf, gebaut auf der Ablauf-Schale. Bewusst ruhige
// Orientierung statt Rechner: An-/Abmeldung bei der Gemeinde (CH: innert 14 Tagen),
// Adresse überall nachführen, alte Wohnung fristgerecht kündigen.

// Die Stellen, die die neue Adresse brauchen — stabile Schlüssel für Label + Merkliste.
const CHECKLIST = ['Post', 'Kk', 'Employer', 'Ahv', 'Tax', 'Insurance', 'Bank', 'Subs'];

// Seit Entwurf W (F7-A1, 27.10.2026) in der Ablauf-Schale; hier weiter exportiert für bestehende Aufrufe.
export { ohneNummer };

// Frist: innert 14 Tagen nach dem Umzug bei der neuen Gemeinde anmelden (RHG Art. 11).
// Gerechnet ab dem Umzugsdatum, das die Person eingibt (vorbelegt aus dem Kapitel
// Wohnen, falls erfasst) — nicht mehr ab heute (Befund 24.09.2026, utils/fristen.js).

// Vorbelegung des Umzugsdatums. `wohnen.moveInDate` heisst «wohnt hier seit» — meist der LETZTE
// Umzug. Nur wenn seine 14 Tage noch laufen, ist es dieser Umzug. Sonst bleibt das Feld leer;
// im Beispiel (Maria wohnt seit 2021 an der Langstrasse) steht ein Umzug in einer Woche, damit
// die Frist-Karte zu sehen ist statt «Die 14 Tage waren am 15.08.2021 vorbei».
export const umzugsDatumVorschlag = (moveInDate, datenModus) => {
  if (moveInDate && !istVorbei(plusTage(moveInDate, 14))) return moveInDate;
  return datenModus === 'beispiel' ? plusTage(heuteIso(), 7) : '';
};

export const UmzugAblauf = ({ palette, t, data, chapters, onNavigate, datenModus }) => {
  const s = ablaufStyles(palette);
  const textFarbe = ablaufTextFarbe(palette, 'umzug') || palette.sageDeep || palette.mid;
  const currentAddress = [data?.wohnen?.address, [data?.wohnen?.postalCode, data?.wohnen?.city].filter(Boolean).join(' ')]
    .filter(Boolean).join(', ');
  // Kapitel-Index über den Schlüssel auflösen (nicht hartkodieren) — robust gegen Umsortierung.
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);

  // Umzugs-Typ: bestimmt, was sich ändert (Gemeinde/Kanton/Steuern/KK-Prämienregion).
  // gemeinde = gleiche Gemeinde · kanton = andere Gemeinde, gleicher Kanton · extra = anderer Kanton.
  const [umzugType, setUmzugType] = useState(null);
  // Kanton aus der (neuen) PLZ ableiten — für den Mietzinsbeitrags-Hinweis beim Gemeinde-/Kantonswechsel.
  const userCanton = (() => {
    const plz = (data?.wohnen?.postalCode || '').trim();
    if (plz.length < 4) return null;
    const gem = lookupPLZ(plz);
    return gem && gem.length ? gem[0].kanton : null;
  })();
  // Fassung 5: zwei Spalten, die dritte Wahl über die ganze Breite; die gewählte in der
  // Bereichsfarbe umrandet und leicht getönt, die anderen bleiben gleich hell.
  const typeCard = (id, label, voll) => {
    const isChosen = umzugType === id;
    return React.createElement('button', {
      type: 'button', key: id, onClick: () => setUmzugType(id), 'aria-pressed': isChosen,
      style: {
        gridColumn: voll ? '1 / -1' : undefined, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: '12px', minHeight: '48px', fontSize: text.sm, color: palette.text,
        background: isChosen ? textFarbe + '24' : palette.surface, borderRadius: radius.lg + 'px',
        border: '1px solid ' + (isChosen ? textFarbe : palette.border),
        transition: 'border-color 120ms, background 120ms',
      },
    }, erledigtZeichen(isChosen, label));
  };

  // Adress-Checkliste: jede Stelle lässt sich als offener Punkt in die Merkliste legen
  // (idempotent, kein Doppel). Der Link führt jeweils zum Adressänderungs-Brief.
  // Wert je Stelle: 'gespeichert' | 'vorlaeufig'. Im Beispiel/beim Ausprobieren nichts in die
  // echte Merkliste; die Zeilen sagen «gemerkt», darunter steht einmal «nur für jetzt».
  const vorlaeufig = useVorlaeufig();
  const [added, setAdded] = useState({});
  const merke = (k) => merkpunktSichern({ text: t('umzug.step3TodoPrefix') + ' ' + t('umzug.step3' + k), link: 'briefe' }, vorlaeufig);
  const addOne = (k) => {
    const ergebnis = merke(k);
    if (ergebnis) setAdded(a => ({ ...a, [k]: ergebnis }));
  };
  const addAll = () => {
    const next = {};
    CHECKLIST.forEach(k => { const ergebnis = merke(k); if (ergebnis) next[k] = ergebnis; });
    setAdded(next);
  };
  const nurFuerJetzt = Object.values(added).includes('vorlaeufig');

  // Ein Schritt nach dem anderen (Fassung 5, Entscheid Stebler Studios 23.10.2026) — seit Entwurf W
  // (F7-A1, 27.10.2026) aus der Ablauf-Schale wie alle Abläufe; Stand, Passstrasse, Weiter/Zurück und
  // Abschluss stehen dort. Das Umzugsdatum lebt hier, damit es beim Blättern bleibt.
  const [umzugsDatum, setUmzugsDatum] = useState(() => umzugsDatumVorschlag(data?.wohnen?.moveInDate, datenModus));

  const schritte = [
    // Schritt 1 — Neue Adresse (anzeigen was erfasst ist, sonst zum Erfassen führen)
    { titel: 'umzug.step1Title', inhalt: () => [
      React.createElement('p', { key: 'a', style: s.stepText },
        currentAddress
          ? t('umzug.step1Known', { address: currentAddress })
          : t('umzug.step1Note')),
      onNavigate && React.createElement(AblaufLink, { key: 'b', palette, label: t('umzug.step1Link'), onClick: () => onNavigate('chapter', chapterIdx('wohnen')) }),
    ] },

    // Schritt 2 — An-/Abmelden bei der Gemeinde (14-Tage-Frist), je nach Umzugs-Typ
    { titel: 'umzug.step2Title', inhalt: () => [
      // Typ-Wähler: was sich ändert, hängt davon ab, wie weit der Umzug geht.
      React.createElement('p', { key: 'typ', style: { ...s.stepText, marginBottom: '6px' } }, t('umzug.typeLabel')),
      React.createElement('div', { key: 'wahl', role: 'group', 'aria-label': t('umzug.typeLabel'), style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm + 'px', margin: space.sm + 'px 0' } },
        typeCard('gemeinde', t('umzug.typeGemeinde')),
        typeCard('kanton', t('umzug.typeKanton')),
        typeCard('extra', t('umzug.typeExtra'), true)
      ),
      React.createElement('p', { key: 'text', style: s.stepText }, t(umzugType ? 'umzug.step2Text_' + umzugType : 'umzug.step2Text')),
      // „Das ändert sich" — ruhiger Hinweis je Typ, mit Crosslinks zu Prämie/Steuern wo relevant.
      umzugType && React.createElement('div', { key: 'aendert', style: { ...s.note, marginTop: space.sm + 'px' } },
        hinweisZeichen(), t('umzug.changes_' + umzugType)),
      // Frist als Karte mit Datum (Fassung 5): «Anmeldung Gemeinde · bis …» + «In den Kalender».
      React.createElement(EreignisFrist, {
        key: 'frist',
        palette, t, onNavigate, id: 'umzug-frist', frist: (d) => plusTage(d, 14),
        wert: umzugsDatum, onWert: setUmzugsDatum,
        labelKey: 'umzug.fristLabel', hinweisKey: 'umzug.fristHinweis', vorbeiKey: 'umzug.fristVorbei',
        art: 'frist', buttonKey: 'umzug.step2Button', doneKey: 'umzug.step2Done', calendarKey: 'umzug.step2CalendarLink',
        karte: { titelKey: 'umzug.fristKarteTitel', bisKey: 'umzug.fristKarteBis', knopfKey: 'kvg.addToCalendar' },
        reminderTitle: t('umzug.reminderTitle'), category: 'admin', ablauf: 'umzug',
        reminderNotes: t('umzug.reminderNotes'),
      }),
      // Krankenkassen-Verweis ohne Unterzeile (Entscheid 23.10.2026), nur «Krankenkassen-Prämie prüfen ›».
      umzugType !== 'gemeinde' && onNavigate && React.createElement(AblaufLink, { key: 'praemie', palette, label: t('umzug.changesLinkPraemien'), onClick: () => onNavigate('praemien') }),
      umzugType === 'extra' && onNavigate && React.createElement(AblaufLink, { key: 'tax', palette, label: t('umzug.changesLinkTax'), onClick: () => onNavigate('tax') }),
      // Neue Gemeinde/Kanton kann einen Mietzinsbeitrags-Anspruch bedeuten — Hinweis genau hier,
      // wo das Lebensereignis ihn auslöst (bestehende Komponente, kanton-bewusst).
      // Fassung 5: als Aufklapp-Zeile «Mietzinsbeiträge +», darin Hinweis und Schnellcheck.
      umzugType !== 'gemeinde' && React.createElement('details', { key: 'mietzins', style: { borderTop: '1px solid ' + palette.border, borderBottom: '1px solid ' + palette.border, marginTop: space.sm + 'px' } },
        React.createElement('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, listStyle: 'none' } },
          // mietzins.title trägt den Doppelpunkt für den Fliesstext («Mietzinsbeiträge: …»); als Zeile ohne.
          t('mietzins.title').replace(/\s*:\s*$/, ''),
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.soft } }, '+')),
        React.createElement('div', { style: { paddingBottom: space.sm + 'px' } },
          React.createElement(MietzinsHinweis, { palette, t, canton: userCanton, ohneTitel: true }),
          // Voller Mietzinsbeiträge-Schnellcheck (mit echten Beträgen), nicht nur der Hinweis.
          onNavigate && React.createElement(AblaufLink, { palette, label: t('umzug.linkMietzins'), onClick: () => onNavigate('mietzins') }))
      ),
      // Beim Wechsel in einen anderen Kanton (`extra`) — einen Umzugstyp «aus dem Ausland»
      // gibt es nicht. Wer tatsächlich neu in der Schweiz ist, erkennt sich an der
      // Beschriftung («Neu in der Schweiz?») und findet dort die erste KK-Anmeldung.
      umzugType === 'extra' && onNavigate && React.createElement(AblaufLink, { key: 'kkerst', palette, label: t('umzug.linkKkErst'), onClick: () => onNavigate('kkerst') }),
    ] },

    // Schritt 3 — Adresse überall nachführen (ruhige Checkliste)
    { titel: 'umzug.step3Title', inhalt: () => [
      React.createElement('p', { key: 'text', style: s.stepText }, t('umzug.step3Text')),
      // Jede Stelle als Zeile mit „merken"-Knopf → landet als offener Punkt in der Merkliste.
      React.createElement('div', { key: 'liste', style: { display: 'flex', flexDirection: 'column', gap: '6px', margin: space.sm + 'px 0' } },
        CHECKLIST.map((k) => {
          const isAdded = !!added[k];
          return React.createElement('div', {
            key: k,
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, color: palette.text },
          },
            React.createElement('span', null, t('umzug.step3' + k)),
            React.createElement('button', {
              onClick: () => addOne(k),
              disabled: isAdded,
              'aria-pressed': isAdded,
              style: {
                flexShrink: 0, cursor: isAdded ? 'default' : 'pointer', fontFamily: 'inherit',
                background: 'none', border: '1px solid ' + (isAdded ? palette.sage : palette.border),
                borderRadius: radius.sm, padding: '2px 12px', minHeight: '44px', fontSize: text.xs,
                color: isAdded ? (palette.sageDeep || palette.sage) : palette.mid,
              },
            }, erledigtZeichen(isAdded, isAdded ? t('umzug.step3Added') : t('umzug.step3Add')))
          );
        })
      ),
      nurFuerJetzt && React.createElement('p', { key: 'jetzt', role: 'status', style: { fontSize: text.sm, color: palette.sageDeep || palette.sage, fontWeight: weight.semi, margin: '0 0 ' + space.xs + 'px' } },
        hinweisZeichen('check', 12, 'z'), t('common.savedTemporary')),
      React.createElement('button', {
        key: 'alle',
        onClick: addAll,
        style: { cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none', padding: '2px 0', minHeight: '44px', fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.semi },
      }, '+ ' + t('umzug.step3AddAll')),
      // Für jede Stelle der Liste den gleichen Adressänderungs-Brief (ein Dokument, wiederverwendbar).
      onNavigate && React.createElement(AblaufLink, { key: 'brief', palette, label: t('umzug.linkAddressChange'), onClick: () => onNavigate('briefe') }),
    ] },

    // Schritt 4 — Alte Wohnung kündigen (→ Briefvorlage)
    { titel: 'umzug.step4Title', inhalt: () => [
      React.createElement('p', { key: 'text', style: s.stepText }, t('umzug.step4Text')),
      onNavigate && React.createElement(AblaufLink, { key: 'link', palette, label: t('umzug.step4Link'), onClick: () => onNavigate('briefe') }),
    ] },
  ];

  return React.createElement(AblaufContainer, {
    palette, t, onNavigate, ablauf: 'umzug', icon: 'home',
    title: t('umzug.title'),
    intro: t('umzug.intro'),
    // Stationsnamen auf der Strasse wie im Mockup Fassung 5.
    passNamen: [t('umzug.passAdresse'), t('umzug.passGemeinde'), t('umzug.passNachfuehren'), t('umzug.passKuendigen')],
  },
    ...schritte.map((x, i) => React.createElement(AblaufStep, { key: 'u' + i, palette, title: t(x.titel) }, ...x.inhalt())),
    React.createElement(AblaufFooter, { palette, t, quelle: t('umzug.quelle'), notes: [t('umzug.footerFrist'), t('trust.localOnly')] })
  );
};

export default UmzugAblauf;
