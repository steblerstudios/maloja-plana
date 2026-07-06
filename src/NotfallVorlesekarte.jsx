import React from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { getNotfallDossierPreview } from './dossierGenerator.js';
import { getFullName } from './config/constants.js';

// Notruf-Vorlesekarte — für den Ernstfall: du musst dir nichts merken.
// Die Karte nennt die Nummer, sagt Satz für Satz, was du am Telefon sagst,
// und liest deine hinterlegten Kernangaben ab. Rein aus vorhandenen Notfall-Daten,
// local-only, kein neues Browser-API (opt-in Standort folgt als eigener Schritt).

// Schweizer Notrufnummern — medizinisch/allgemein relevante zuerst.
const EMERGENCY = [
  { num: '144',  key: 'sani' },
  { num: '117',  key: 'police' },
  { num: '118',  key: 'fire' },
  { num: '145',  key: 'tox' },
  { num: '1414', key: 'rega' },
  { num: '112',  key: 'euro' },
];

// Nur die Abschnitte, die man einer Leitstelle vorliest — Name/Adresse stehen schon im Sag-Satz.
const READ_ALOUD_KEYS = ['contact', 'medical', 'care'];

export const NotfallVorlesekarte = ({ palette, t, data, chapters, onNavigate }) => {
  const d = (c, f) => (data?.[c] || {})[f] || '';
  const chapterIdx = (key) => (chapters ? chapters.findIndex(ch => ch.key === key) : -1);

  // Kernangaben für den Sag-Satz — robust direkt aus den Daten (wie der Dossier-Generator).
  const fullName = getFullName(data?.basis || {});
  const address = [
    d('wohnen', 'address'),
    [d('wohnen', 'postalCode'), d('wohnen', 'city')].filter(Boolean).join(' '),
  ].filter(Boolean).join(', ');
  const phone = d('basis', 'phone');
  const whoValue = [fullName, phone].filter(Boolean).join(' · ');

  // Vorhandene, kuratierte Notfall-Abschnitte wiederverwenden (kein zweites Datenmodell).
  const preview = getNotfallDossierPreview(data, chapters, t);
  const readSections = preview.sections.filter(sec => READ_ALOUD_KEYS.includes(sec.key));

  // Opt-in Standort — nur auf Knopfdruck, live, NIE gespeichert (bleibt in Komponenten-State).
  // Antwortet auf „Wo bist du?", wenn jemand die Adresse gerade nicht weiss.
  const [locState, setLocState] = React.useState('idle'); // idle | loading | ok | denied | error | unsupported
  const [loc, setLoc] = React.useState(null);
  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { setLocState('unsupported'); return; }
    setLocState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) });
        setLocState('ok');
      },
      (err) => { setLocState(err && err.code === 1 ? 'denied' : 'error'); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const s = {
    ...ablaufStyles(palette),
    telList: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    tel: {
      fontSize: text.body, fontWeight: weight.semi, color: palette.sand,
      textDecoration: 'none', fontFamily: 'inherit',
      padding: space.xs + 'px ' + space.sm + 'px', borderRadius: radius.sm,
      border: '1px solid ' + palette.border, background: palette.up,
    },
    sayList: { margin: space.sm + 'px 0 0 0', paddingLeft: '20px' },
    sayItem: { marginBottom: space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed },
    sayValue: { fontWeight: weight.semi, color: palette.text },
    sayEmpty: { color: palette.mid },
    readWrap: { display: 'flex', flexDirection: 'column', gap: space.sm + 'px', marginTop: space.sm + 'px' },
    readCard: { padding: '10px 14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border },
    readTitle: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' },
    readRow: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', padding: '3px 0', fontSize: text.sm },
    readLabel: { color: palette.mid },
    readValue: { color: palette.text, fontWeight: weight.medium, textAlign: 'right' },
    locBtn: {
      marginTop: space.sm + 'px', cursor: 'pointer', fontFamily: 'inherit',
      background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm,
      padding: '6px 12px', fontSize: text.sm, color: palette.text,
    },
    locResult: { marginTop: space.sm + 'px', padding: '10px 14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border },
    locCoords: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, letterSpacing: '0.3px' },
    locAcc: { fontSize: text.xs, color: palette.mid, marginTop: '2px' },
    locMap: { display: 'inline-block', marginTop: space.sm + 'px', fontSize: text.sm, color: palette.sand, textDecoration: 'none', fontFamily: 'inherit' },
    locNote: { fontSize: text.xs, color: palette.mid, marginTop: space.sm + 'px' },
  };

  // Standort-Block: idle → Knopf; loading; ok → Koordinaten zum Vorlesen + Karten-Link; sonst ruhiger Fallback.
  const locationBlock = () => {
    if (locState === 'ok' && loc) {
      return React.createElement('div', { style: s.locResult },
        React.createElement('div', { style: s.locCoords }, loc.lat.toFixed(5) + ', ' + loc.lng.toFixed(5)),
        React.createElement('div', { style: s.locAcc }, t('notfallkarte.locAccuracy', { m: loc.acc })),
        React.createElement('a', { href: 'geo:' + loc.lat + ',' + loc.lng, style: s.locMap }, t('notfallkarte.locMapLink') + ' →'),
        React.createElement('div', { style: s.locNote }, t('notfallkarte.locNotStored'))
      );
    }
    if (locState === 'denied' || locState === 'error' || locState === 'unsupported') {
      return React.createElement('div', { style: s.note }, t('notfallkarte.loc_' + locState));
    }
    return React.createElement('button', {
      onClick: requestLocation, disabled: locState === 'loading', style: s.locBtn,
    }, locState === 'loading' ? t('notfallkarte.locLoading') : t('notfallkarte.locBtn'));
  };

  // Ein Sag-Punkt: Frage + (falls vorhanden) die eigene Angabe, sonst ruhiger Platzhalter.
  const sayItem = (labelKey, value, emptyKey) =>
    React.createElement('li', { style: s.sayItem },
      React.createElement('span', null, t(labelKey)),
      value
        ? React.createElement('span', { style: s.sayValue }, ' — ' + value)
        : React.createElement('span', { style: s.sayEmpty }, ' — ' + t(emptyKey))
    );

  return React.createElement(AblaufContainer, {
    palette, icon: 'notfall',
    title: t('notfallkarte.title'),
    intro: t('notfallkarte.intro'),
  },
    // Schritt 1 — Nummer wählen (tel:-Links, auf dem Handy direkt anrufbar)
    React.createElement(AblaufStep, { palette, title: t('notfallkarte.step1Title') },
      React.createElement('p', { style: s.stepText }, t('notfallkarte.step1Text')),
      React.createElement('div', { style: s.telList },
        EMERGENCY.map(e => React.createElement('a', {
          key: e.key, href: 'tel:' + e.num, style: s.tel,
        }, e.num + ' · ' + t('notfallkarte.num_' + e.key)))
      ),
      React.createElement('div', { style: s.note }, 'ⓘ ' + t('notfallkarte.step1Note'))
    ),

    // Schritt 2 — Was du sagst (der Reihe nach, mit deinen Angaben schon eingesetzt)
    React.createElement(AblaufStep, { palette, title: t('notfallkarte.step2Title') },
      React.createElement('p', { style: s.stepText }, t('notfallkarte.step2Text')),
      React.createElement('ol', { style: s.sayList },
        sayItem('notfallkarte.sayWhere', address, 'notfallkarte.sayWhereEmpty'),
        React.createElement('li', { style: s.sayItem }, t('notfallkarte.sayWhat')),
        React.createElement('li', { style: s.sayItem }, t('notfallkarte.sayHowMany')),
        sayItem('notfallkarte.sayWho', whoValue, 'notfallkarte.sayWhoEmpty')
      ),
      // Opt-in Standort — beantwortet „Wo bist du?", falls die Adresse gerade nicht reicht.
      locationBlock(),
      React.createElement('div', { style: s.note }, '✓ ' + t('notfallkarte.step2Stay'))
    ),

    // Schritt 3 — Deine Angaben zum Ablesen (wiederverwendete Notfall-Abschnitte)
    React.createElement(AblaufStep, { palette, title: t('notfallkarte.step3Title') },
      readSections.length > 0
        ? React.createElement('div', { style: s.readWrap },
            React.createElement('p', { style: s.stepText }, t('notfallkarte.step3Text')),
            ...readSections.map(sec =>
              React.createElement('div', { key: sec.key, style: s.readCard },
                React.createElement('div', { style: s.readTitle }, sec.title),
                ...sec.rows.map((row, i) =>
                  React.createElement('div', { key: i, style: s.readRow },
                    React.createElement('span', { style: s.readLabel }, row.label),
                    React.createElement('span', { style: s.readValue }, row.value)
                  )
                )
              )
            )
          )
        : React.createElement('div', null,
            React.createElement('p', { style: s.stepText }, t('notfallkarte.step3Empty')),
            onNavigate && React.createElement(AblaufLink, { palette, label: t('notfallkarte.step3EmptyLink'), onClick: () => onNavigate('chapter', chapterIdx('notfall')) })
          ),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('notfallkarte.dossierLink'), onClick: () => onNavigate('notfalldossier') })
    ),

    React.createElement(AblaufFooter, { palette, notes: [t('notfallkarte.footerCalm'), t('trust.localOnly')] })
  );
};

export default NotfallVorlesekarte;
