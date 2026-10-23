import React, { useState, useRef, useEffect } from 'react';
import { text, weight, space, radius } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, EreignisFrist, AblaufFooter, AblaufPass, PASS_SCHRITTE, ablaufStyles } from './AblaufSchale.jsx';
import { ablaufStandLaden, ablaufStandSichern } from './utils/ablaufStand.js';
import { PanelTitle } from './components/Heading.jsx';
import PrimaryButton from './components/PrimaryButton.jsx';
import { plusTage } from './utils/fristen.js';
import { MietzinsHinweis } from './components/MietzinsHinweis.jsx';
import { lookupPLZ } from './data/plzGemeinde.js';
import { merkpunktSichern } from './utils/merkliste.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { Icon, hinweisZeichen, erledigtZeichen } from './IconSystem.jsx';

// Umzug — der 3. geführte Ablauf, gebaut auf der Ablauf-Schale. Bewusst ruhige
// Orientierung statt Rechner: An-/Abmeldung bei der Gemeinde (CH: innert 14 Tagen),
// Adresse überall nachführen, alte Wohnung fristgerecht kündigen.

// Die Stellen, die die neue Adresse brauchen — stabile Schlüssel für Label + Merkliste.
const CHECKLIST = ['Post', 'Kk', 'Employer', 'Ahv', 'Tax', 'Insurance', 'Bank', 'Subs'];

// Die Schritt-Titel tragen ihre Nummer («2 · …»); im Schritt-für-Schritt steht die Nummer
// schon in «Schritt 2 von 4» darüber — darum hier ohne.
export const ohneNummer = (titel) => String(titel).replace(/^\s*\d+\s*·\s*/, '');

// Frist: innert 14 Tagen nach dem Umzug bei der neuen Gemeinde anmelden (RHG Art. 11).
// Gerechnet ab dem Umzugsdatum, das die Person eingibt (vorbelegt aus dem Kapitel
// Wohnen, falls erfasst) — nicht mehr ab heute (Befund 24.09.2026, utils/fristen.js).

export const UmzugAblauf = ({ palette, t, data, chapters, onNavigate }) => {
  const s = ablaufStyles(palette);
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
  const typeCard = (id, label) => {
    const isChosen = umzugType === id;
    const isDimmed = umzugType && !isChosen;
    return React.createElement('button', {
      type: 'button', key: id, onClick: () => setUmzugType(id), 'aria-pressed': isChosen,
      style: {
        flex: '1 1 160px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
        padding: space.sm + 'px ' + space.md + 'px', fontSize: text.sm, color: palette.text,
        background: isChosen ? palette.surface : palette.up, borderRadius: radius.sm,
        border: '1.5px solid ' + (isChosen ? palette.sand : palette.border),
        opacity: isDimmed ? 0.55 : 1, transition: 'opacity 120ms, border-color 120ms',
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

  // Ein Schritt nach dem anderen (Fassung 5, Entscheid Sophie 23.10.2026). Der Stand bleibt
  // gespeichert (utils/ablaufStand.js), im Beispiel/Ausprobieren nur für jetzt.
  const [stand, setStandRoh] = useState(() => ablaufStandLaden('umzug', PASS_SCHRITTE, vorlaeufig));
  const setStand = (next) => { setStandRoh(next); ablaufStandSichern('umzug', next, vorlaeufig); };
  // Das Umzugsdatum lebt hier (nicht in EreignisFrist), damit es beim Blättern bleibt.
  const [umzugsDatum, setUmzugsDatum] = useState(data?.wohnen?.moveInDate || '');
  // Nach einem Schrittwechsel den Fokus auf den neuen Schritt legen (nicht beim ersten Laden).
  const schrittRef = useRef(null);
  const gewechselt = useRef(false);
  useEffect(() => {
    if (gewechselt.current && schrittRef.current) schrittRef.current.focus();
  }, [stand.schritt, stand.fertig]);
  const geheZu = (next) => { gewechselt.current = true; setStand(next); };

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
      React.createElement('div', { key: 'wahl', style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginBottom: space.sm + 'px' } },
        typeCard('gemeinde', t('umzug.typeGemeinde')),
        typeCard('kanton', t('umzug.typeKanton')),
        typeCard('extra', t('umzug.typeExtra'))
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
        buttonKey: 'umzug.step2Button', doneKey: 'umzug.step2Done', calendarKey: 'umzug.step2CalendarLink',
        karte: { titelKey: 'umzug.fristKarteTitel', bisKey: 'umzug.fristKarteBis', knopfKey: 'kvg.addToCalendar' },
        reminderTitle: t('umzug.reminderTitle'), category: 'admin',
        reminderNotes: t('umzug.reminderNotes'),
      }),
      // Krankenkassen-Verweis ohne Unterzeile (Entscheid 23.10.2026), nur «Krankenkassen-Prämie prüfen ›».
      umzugType !== 'gemeinde' && onNavigate && React.createElement(AblaufLink, { key: 'praemie', palette, label: t('umzug.changesLinkPraemien'), onClick: () => onNavigate('praemien') }),
      umzugType === 'extra' && onNavigate && React.createElement(AblaufLink, { key: 'tax', palette, label: t('umzug.changesLinkTax'), onClick: () => onNavigate('tax') }),
      // Neue Gemeinde/Kanton kann einen Mietzinsbeitrags-Anspruch bedeuten — Hinweis genau hier,
      // wo das Lebensereignis ihn auslöst (bestehende Komponente, kanton-bewusst).
      umzugType !== 'gemeinde' && React.createElement(MietzinsHinweis, { key: 'mietzins', palette, t, canton: userCanton }),
      // Voller Mietzinsbeiträge-Schnellcheck (mit echten Beträgen), nicht nur der Hinweis.
      umzugType !== 'gemeinde' && onNavigate && React.createElement(AblaufLink, { key: 'mietzinsLink', palette, label: t('umzug.linkMietzins'), onClick: () => onNavigate('mietzins') }),
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
                borderRadius: radius.sm, padding: '2px 10px', fontSize: text.xs,
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
        style: { cursor: 'pointer', fontFamily: 'inherit', background: 'none', border: 'none', padding: '2px 0', fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.semi },
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

  const total = schritte.length;
  const nr = stand.schritt;
  const letzter = nr === total - 1;
  const ruhigerKnopf = { minHeight: '44px', background: 'none', border: 'none', padding: '0 ' + space.sm + 'px', cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.mid };

  const schrittInhalt = stand.fertig
    // Abschluss: «Der Umzug ist geordnet» mit Satz; der Ablauf lässt sich jederzeit wieder ansehen.
    ? React.createElement('div', { 'data-umzug-schritt': 'fertig' },
      React.createElement('span', { style: { display: 'inline-flex', color: palette.sageDeep || palette.sage } }, React.createElement(Icon, { name: 'check', size: 28 })),
      React.createElement(PanelTitle, { palette, style: { margin: space.sm + 'px 0 ' + space.xs + 'px' } }, t('umzug.fertigTitel')),
      React.createElement('p', { style: s.stepText }, t('umzug.fertigText')),
      React.createElement('button', { type: 'button', style: { ...ruhigerKnopf, padding: 0, marginTop: space.sm + 'px' }, onClick: () => geheZu({ schritt: 0, fertig: false }) }, t('umzug.nochmals'))
    )
    : React.createElement('div', { 'data-umzug-schritt': String(nr + 1) },
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, fontWeight: weight.semi } }, t('onboarding.stepOf', { current: nr + 1, total })),
      React.createElement(AblaufStep, { palette, title: ohneNummer(t(schritte[nr].titel)) }, ...schritte[nr].inhalt()),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginTop: space.lg + 'px' } },
        React.createElement(PrimaryButton, {
          palette, style: { minHeight: '44px' },
          onClick: () => geheZu(letzter ? { schritt: nr, fertig: true } : { schritt: nr + 1, fertig: false }),
        }, letzter ? t('umzug.abschliessen') : t('umzug.weiter')),
        nr > 0 && React.createElement('button', { type: 'button', style: ruhigerKnopf, onClick: () => geheZu({ schritt: nr - 1, fertig: false }) },
          React.createElement('span', { 'aria-hidden': 'true', style: { marginInlineEnd: '4px' } }, '‹'), t('common.back'))
      )
    );

  return React.createElement(AblaufContainer, {
    palette, icon: 'home',
    title: t('umzug.title'),
    intro: t('umzug.intro'),
  },
    React.createElement(AblaufPass, { palette, aktuell: nr, fertig: stand.fertig }),
    React.createElement('div', { ref: schrittRef, tabIndex: -1, 'aria-live': 'polite', style: { outline: 'none' } }, schrittInhalt),
    React.createElement(AblaufFooter, { palette, t, quelle: t('umzug.quelle'), notes: [t('umzug.footerFrist'), t('trust.localOnly')] })
  );
};

export default UmzugAblauf;
