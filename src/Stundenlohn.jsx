import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { ErgebnisArt } from './components/ErgebnisArt.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { CANTON_CODES, getCantonName } from './config/kantonPLZ.js';
import { getLohnKontrollstelle } from './data/lohnRechtsstellen.js';
import { betrag } from './utils/geld.js';
import { stundenlohnRechnen, stundenlohnErgebnis, ARTEN, FERIEN_FORMEN, ANTWORTEN } from './utils/stundenlohn.js';

// «Was steht mir im Stundenlohn zu?» — Wunsch Stebler Studios 25.09.2026.
// Flächen: A Anstellung · B Lohn · C Ferien und Zuschläge · D die Rechnung · E Einordnung
// (Mindestlohn, Pensionskasse, Unfall) · F offene Fragen.
// Gespeichert unter finanzen.stundenlohnRechner. Rechnung: utils/stundenlohn.js.
// Kanton und Wochenstunden kommen aus dem Profil, solange hier nichts eingetragen ist.
// Kein Brief an den Arbeitgeber (WAGECLAIM_BEREIT = false) — nur Einordnung und Fragen.

const zahlText = (x) => betrag(x, { stellen: 2 });

export const Stundenlohn = ({ palette, t, data, onUpdateData }) => {
  const gespeichert = data?.finanzen?.stundenlohnRechner || {};
  const profilKanton = data?.basis?.canton || '';
  const profilStunden = data?.ausbildung?.workHoursPerWeek || '';
  const e = {
    ...gespeichert,
    kanton: gespeichert.kanton ?? profilKanton,
    wochenstunden: gespeichert.wochenstunden ?? profilStunden,
  };
  const aendern = (patch) => onUpdateData && onUpdateData('finanzen', 'stundenlohnRechner', { ...gespeichert, ...patch });
  const r = stundenlohnRechnen(e);

  const flaeche = { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md + 'px', fontSize: text.sm, color: palette.text };
  const titelStil = { fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' };
  const labelStil = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };
  const hinweisStil = { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const eingabeStil = { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', width: '100%', maxWidth: '220px', boxSizing: 'border-box' };
  const absatz = { margin: space.sm + 'px 0 0', color: palette.text, lineHeight: leading.normal };
  const raster = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 ' + space.md + 'px' };

  const feld = (key, label, hinweis) => {
    const id = 'sl-' + key;
    return React.createElement('div', { key, style: { marginBottom: space.sm + 'px' } },
      React.createElement('label', { htmlFor: id, style: labelStil }, label),
      React.createElement('input', {
        id, type: 'text', inputMode: 'decimal', value: e[key] ?? '',
        onChange: (ev) => aendern({ [key]: ev.target.value }),
        'aria-describedby': hinweis ? id + '-hinweis' : undefined,
        style: eingabeStil,
      }),
      hinweis && React.createElement('p', { id: id + '-hinweis', style: hinweisStil }, hinweis)
    );
  };

  const auswahl = (key, label, optionen, beschriftung, hinweis) => {
    const id = 'sl-' + key;
    return React.createElement('div', { key, style: { marginBottom: space.sm + 'px' } },
      React.createElement('label', { htmlFor: id, style: labelStil }, label),
      React.createElement('select', {
        id, value: e[key] || '',
        onChange: (ev) => aendern({ [key]: ev.target.value }),
        'aria-describedby': hinweis ? id + '-hinweis' : undefined,
        style: { ...eingabeStil, maxWidth: '340px', appearance: 'auto' },
      },
        React.createElement('option', { value: '' }, t('common.select')),
        optionen.map((o) => React.createElement('option', { key: o, value: o }, beschriftung(o)))
      ),
      hinweis && React.createElement('p', { id: id + '-hinweis', style: hinweisStil }, hinweis)
    );
  };
  const antwort = (key, label, hinweis) => auswahl(key, label, ANTWORTEN, (a) => t('stundenlohnView.antwort_' + a), hinweis);

  // D — eine Lesart als Rechnung: Zeilen, dann die Summe.
  const rechnung = (key, l) => {
    const zeilen = [
      { k: 'grund', wert: l.grund },
      { k: 'ferien', wert: l.ferien, text: t('stundenlohnView.zeile_ferien', { prozent: (Math.round(r.satzFerien * 10000) / 100).toFixed(2), wochen: r.ferienWochen }) },
      { k: 'feiertag', wert: l.feiertag },
      { k: 'dreizehnter', wert: l.dreizehnter },
    ].filter((z) => z.k === 'grund' || z.wert > 0);
    const zeile = (label, wert, stark) => React.createElement('div', { key: label, style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', padding: '3px 0', borderTop: stark ? '1px solid ' + palette.border : 'none', fontWeight: stark ? weight.semi : weight.normal, color: palette.text } },
      React.createElement('span', null, label),
      React.createElement('span', { style: { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, zahlText(wert)));
    return React.createElement('div', { key, style: { marginBottom: space.md + 'px' } },
      r.ferienForm === 'unklar' && React.createElement('div', { style: { ...titelStil, fontSize: text.sm } }, t('stundenlohnView.lesart_' + key, { betrag: zahlText(Number(String(e.betrag).replace(',', '.'))) })),
      zeilen.map((z) => zeile(z.text || t('stundenlohnView.zeile_' + z.k), z.wert)),
      zeile(t('stundenlohnView.zeile_total'), l.total, true),
      r.monat && React.createElement('p', { style: hinweisStil }, t('stundenlohnView.proMonat', { betrag: betrag(r.monat[key]), stunden: r.wochenstunden }))
    );
  };

  // E — Mindestlohn je Lesart
  const kantonName = e.kanton ? getCantonName(e.kanton, t) : '';
  const stelle = e.kanton && getLohnKontrollstelle(e.kanton);
  const befundSatz = (key) => {
    const b = r.befunde[key];
    const grund = zahlText(r.lesarten[key].grund);
    const vorsatz = r.ferienForm === 'unklar' ? t('stundenlohnView.lesartKurz_' + key) + ' ' : '';
    switch (b.status) {
      case 'ok': return vorsatz + t('stundenlohnView.ml_ok', { grund, mindest: zahlText(b.mindestStunde), kanton: kantonName, jahr: b.jahr });
      case 'konformMit13': return vorsatz + t('stundenlohnView.ml_konformMit13', { grund, mindest: zahlText(b.mindestStunde), reduziert: zahlText(b.reduzierterBoden), kanton: kantonName });
      case 'dreizehnterUnklar': return vorsatz + t('stundenlohnView.ml_dreizehnterUnklar', { grund, mindest: zahlText(b.mindestStunde), reduziert: zahlText(b.reduzierterBoden), kanton: kantonName });
      case 'unterMindestlohn': return vorsatz + t('stundenlohnView.ml_unter', { grund, mindest: zahlText(b.mindestStunde), kanton: kantonName, jahr: b.jahr })
        + (b.differenzMonat ? ' ' + t('stundenlohnView.ml_differenz', { betrag: betrag(b.differenzMonat) }) : '')
        + ' ' + t('lohnCheck.ausnahmen') + ' '
        + t('stundenlohnView.ml_stelle', { stelle: stelle ? stelle.stelle : t('lohnCheck.stelleFallbackKurz') });
      case 'keinGesetz': return t('stundenlohnView.ml_keinGesetz', { kanton: kantonName });
      default: return t('stundenlohnView.ml_keinKanton');
    }
  };
  // Nur ein Satz, wenn beide Lesarten dasselbe sagen und kein Kanton-Befund abhängt.
  const befundKeys = r.status === 'gerechnet'
    ? (['keinGesetz', 'keinKanton'].includes(Object.values(r.befunde)[0].status) ? [Object.keys(r.befunde)[0]] : Object.keys(r.befunde))
    : [];

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'money', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('stundenlohnView.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md + 'px', lineHeight: leading.relaxed } }, t('stundenlohnView.intro')),

    // A — Anstellung
    React.createElement('section', { 'aria-labelledby': 'sl-a', style: flaeche },
      React.createElement('h3', { id: 'sl-a', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.anstellungTitel')),
      auswahl('art', t('stundenlohnView.art'), ARTEN, (a) => t('stundenlohnView.art_' + a), e.art ? t('stundenlohnView.artHinweis_' + e.art) : null),
      React.createElement('div', { style: raster },
        auswahl('kanton', t('stundenlohnView.kanton'), CANTON_CODES, (k) => getCantonName(k, t), t('stundenlohnView.kantonHinweis')),
        e.art === 'befristet' && antwort('ueber3Monate', t('stundenlohnView.ueber3Monate'))
      ),
      React.createElement('label', { htmlFor: 'sl-unter20', style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: text.sm, color: palette.text, cursor: 'pointer', minHeight: '32px' } },
        React.createElement('input', { id: 'sl-unter20', type: 'checkbox', checked: !!e.unter20, onChange: (ev) => aendern({ unter20: ev.target.checked }) }),
        t('stundenlohnView.unter20'))
    ),

    // B — Lohn
    React.createElement('section', { 'aria-labelledby': 'sl-b', style: flaeche },
      React.createElement('h3', { id: 'sl-b', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.lohnTitel')),
      React.createElement('div', { style: raster },
        feld('betrag', t('stundenlohnView.betrag'), t('stundenlohnView.betragHinweis')),
        feld('wochenstunden', t('stundenlohnView.wochenstunden'), t('stundenlohnView.wochenstundenHinweis'))
      ),
      r.stundenUnplausibel && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.stundenUnplausibel', { stunden: e.wochenstunden }))
    ),

    // C — Ferien und Zuschläge
    React.createElement('section', { 'aria-labelledby': 'sl-c', style: flaeche },
      React.createElement('h3', { id: 'sl-c', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.zuschlaegeTitel')),
      auswahl('ferienForm', t('stundenlohnView.ferienForm'), FERIEN_FORMEN, (f) => t('stundenlohnView.ferienForm_' + f)),
      React.createElement('div', { style: raster },
        feld('ferienWochen', t('stundenlohnView.ferienWochen'), t('stundenlohnView.ferienWochenHinweis')),
        e.ferienForm !== 'bezahlt' && antwort('ausgewiesen', t('stundenlohnView.ausgewiesen'), t('stundenlohnView.ausgewiesenHinweis'))
      ),
      r.vertragZuWenig && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.vertragZuWenig', { wochen: r.ferienWochen })),
      e.ausgewiesen === 'nein' && e.ferienForm !== 'bezahlt' && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.nichtAusgewiesen')),
      React.createElement('div', { style: raster },
        antwort('feiertag', t('stundenlohnView.feiertag'), t('stundenlohnView.feiertagHinweis')),
        e.feiertag === 'ja' && feld('feiertagProzent', t('stundenlohnView.feiertagProzent'))
      ),
      antwort('dreizehnter', t('stundenlohnView.dreizehnter'))
    ),

    // D + E — nur mit Betrag
    r.status === 'brauchtBetrag'
      ? React.createElement('p', { role: 'status', style: { ...flaeche, background: palette.surface, border: '1px solid ' + palette.border } }, hinweisZeichen('info'), t('stundenlohnView.brauchtBetrag'))
      : React.createElement(React.Fragment, null,
          React.createElement('section', { 'aria-labelledby': 'sl-d', style: flaeche },
            React.createElement('h3', { id: 'sl-d', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.rechnungTitel')),
            Object.entries(r.lesarten).map(([key, l]) => rechnung(key, l)),
            r.ferienForm === 'unklar' && React.createElement('p', { style: hinweisStil }, t('stundenlohnView.lesartenHinweis'))
          ),
          React.createElement('section', { 'aria-labelledby': 'sl-e', role: 'status', style: flaeche },
            React.createElement('h3', { id: 'sl-e', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.einordnungTitel')),
            befundKeys.map((key) => React.createElement('p', { key, style: absatz }, befundSatz(key))),
            React.createElement('p', { style: absatz }, r.bvg === 'unbekannt'
              ? t('stundenlohnView.bvg_unbekannt')
              : t('stundenlohnView.bvg_' + r.bvg, { jahr: betrag(r.jahreslohn), schwelle: betrag(r.bvgSchwelle) })),
            React.createElement('p', { style: absatz }, t('stundenlohnView.nbu_' + r.nbu)),
            e.art && ['abrufEcht', 'abrufUnecht', 'befristet', 'temporaer', 'hausdienst'].includes(e.art) && React.createElement('p', { style: absatz }, t('stundenlohnView.art_einordnung_' + e.art))
          )
        ),

    // F — offene Fragen
    r.status === 'gerechnet' && r.fragen.length > 0 && React.createElement('section', { 'aria-labelledby': 'sl-f', style: flaeche },
      React.createElement('h3', { id: 'sl-f', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.fragenTitel')),
      React.createElement('p', { style: { ...hinweisStil, marginTop: 0 } }, t('stundenlohnView.fragenIntro')),
      React.createElement('ul', { style: { margin: space.sm + 'px 0 0', paddingLeft: '20px', color: palette.text, lineHeight: leading.normal } },
        r.fragen.map((f) => React.createElement('li', { key: f, style: { marginBottom: space.xs + 'px' } }, t('stundenlohnView.frage_' + f))))
    ),

    React.createElement(ErgebnisArt, { palette, t, ergebnis: stundenlohnErgebnis(e), style: { marginTop: 0 } }),
    React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm + 'px', lineHeight: leading.normal } }, t('stundenlohnView.quellen')),
    React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', lineHeight: leading.normal } }, hinweisZeichen(), t('stundenlohnView.vorlaeufig'))
  );
};

export default Stundenlohn;
