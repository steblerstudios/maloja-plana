import React from 'react';
import { RechnerForm, Einzelwahl } from './components/RechnerForm.jsx';
import { hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { CANTON_CODES, getCantonName } from './config/kantonPLZ.js';
import { lohnStelleSatz } from './data/lohnRechtsstellen.js';
import { betrag } from './utils/geld.js';
import { stundenlohnRechnen, stundenlohnErgebnis, lies, ARTEN, FERIEN_FORMEN, ANTWORTEN, TI_MINDESTLOHN_OBERGRENZE } from './utils/stundenlohn.js';

// «Was steht mir im Stundenlohn zu?» — Wunsch Stebler Studios 25.09.2026.
// Flächen: A Anstellung · B Lohn · C Ferien und Zuschläge · D die Rechnung · E Einordnung
// (Mindestlohn, Pensionskasse, Unfall) · F offene Fragen.
// Gespeichert unter finanzen.stundenlohnRechner. Rechnung: utils/stundenlohn.js.
// Kanton und Wochenstunden kommen aus dem Profil, solange hier nichts eingetragen ist.
// Kein Brief an den Arbeitgeber (WAGECLAIM_BEREIT = false) — nur Einordnung und Fragen.

const zahlText = (x) => betrag(x, { stellen: 2 });

// Rechner-Form X (F7-A2, 27.10.2026): Rechnung und Einordnung zuerst (D, E), darunter die Angaben A–C als
// «Ihre Angaben», die offenen Fragen (F) als «was zu tun ist», Quellen an fester Stelle. Logik unverändert.
export const Stundenlohn = ({ palette, t, data, onUpdateData, onNavigate }) => {
  const gespeichert = data?.finanzen?.stundenlohnRechner || {};
  const profilKanton = data?.basis?.canton || '';
  const profilStunden = data?.ausbildung?.workHoursPerWeek || '';
  const e = {
    ...gespeichert,
    kanton: gespeichert.kanton ?? profilKanton,
    wochenstunden: gespeichert.wochenstunden ?? profilStunden,
  };
  // Stunden aus dem Profil können alle Stellen zusammen meinen — die Schwellen gelten je Betrieb (Fachprüfung 19.10.2026).
  const stundenAusProfil = gespeichert.wochenstunden == null && !!profilStunden;
  const aendern = (patch) => onUpdateData && onUpdateData('finanzen', 'stundenlohnRechner', { ...gespeichert, ...patch });
  const r = stundenlohnRechnen(e);

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
  // Ja / Nein / Weiss nicht als Einzelwahl (radiogroup, a11y M2) statt Auswahlliste.
  const antwort = (key, label, hinweis) => React.createElement(Einzelwahl, {
    key, palette, id: 'sl-' + key, label, hinweis, wert: e[key] || '',
    optionen: ANTWORTEN.map((a) => ({ wert: a, label: t('stundenlohnView.antwort_' + a) })),
    onWahl: (wert) => aendern({ [key]: wert }),
  });

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
      r.ferienForm === 'unklar' && React.createElement('div', { style: { ...titelStil, fontSize: text.sm } }, t('stundenlohnView.lesart_' + key, { betrag: zahlText(lies(e.betrag)) })),
      zeilen.map((z) => zeile(z.text || t('stundenlohnView.zeile_' + z.k), z.wert)),
      zeile(t('stundenlohnView.zeile_total'), l.total, true),
      r.monat && React.createElement('p', { style: hinweisStil }, t('stundenlohnView.proMonat', { betrag: betrag(r.monat[key]), stunden: r.wochenstunden }))
    );
  };

  // E — Mindestlohn je Lesart
  const kantonName = e.kanton ? getCantonName(e.kanton, t) : '';
  const befundSatz = (key) => {
    const b = r.befunde[key];
    const grund = zahlText(r.lesarten[key].grund);
    const vorsatz = r.ferienForm === 'unklar' ? t('stundenlohnView.lesartKurz_' + key) + ' ' : '';
    switch (b.status) {
      // Tessin: gestufter Mindestlohn — «ok» heisst nur: über dem tiefsten Satz.
      case 'ok': return vorsatz + (e.kanton === 'TI'
        ? t('stundenlohnView.ml_okTI', { grund, mindest: zahlText(b.mindestStunde), jahr: b.jahr, obergrenze: zahlText(TI_MINDESTLOHN_OBERGRENZE) })
        : t('stundenlohnView.ml_ok', { grund, mindest: zahlText(b.mindestStunde), kanton: kantonName, jahr: b.jahr }));
      case 'konformMit13': return vorsatz + t('stundenlohnView.ml_konformMit13', { grund, mindest: zahlText(b.mindestStunde), reduziert: zahlText(b.reduzierterBoden), kanton: kantonName })
        // Die Basler Besonderheit (13. nur bei anteiliger Auszahlung) gehört nur zu Basel-Stadt.
        + (e.kanton === 'BS' ? ' ' + t('stundenlohnView.ml_konformMit13Bs') : '');
      // Im Spalt zwischen reduziertem und vollem Boden entscheidet die Frage zum 13. — nicht anklagen.
      case 'dreizehnterUnklar': return vorsatz + t('stundenlohnView.ml_dreizehnterUnklar', { grund, mindest: zahlText(b.mindestStunde), reduziert: zahlText(b.reduzierterBoden), kanton: kantonName });
      case 'unterMindestlohn': return vorsatz + t('stundenlohnView.ml_unter', { grund, mindest: zahlText(b.mindestStunde), kanton: kantonName, jahr: b.jahr })
        + (b.differenzMonat ? ' ' + t('stundenlohnView.ml_differenz', { betrag: betrag(b.differenzMonat) }) : '')
        + ' ' + t('lohnCheck.ausnahmen') + ' '
        + lohnStelleSatz(e.kanton, t, 'stundenlohnView.ml_stelle', 'stundenlohnView.ml_stelleNeutral');
      // Städte Zürich und Winterthur: städtischer Mindestlohn abgestimmt; Gerichtsstand und Inkrafttreten
      // sind im Repo nicht belegt (Fachprüfung 18.10.2026). `ml_zhHinweis` nennt darum weder Urteil
      // noch Datum noch Beträge und verweist an die Stadt.
      // Jahres-Riegel (data/lohnCheck.js): für das laufende Jahr kein belegter Satz — kein Urteil.
      case 'jahrNichtBelegt': return t('lohnCheck.jahrNichtBelegt', { jahr: b.jahr, laufend: b.laufendesJahr, kanton: kantonName });
      case 'keinGesetz': return t('stundenlohnView.ml_keinGesetz', { kanton: kantonName }) + (e.kanton === 'ZH' ? ' ' + t('stundenlohnView.ml_zhHinweis') : '');
      default: return t('stundenlohnView.ml_keinKanton');
    }
  };
  // Nur ein Satz, wenn beide Lesarten dasselbe sagen und kein Kanton-Befund abhängt.
  const befundKeys = r.status === 'gerechnet'
    ? (['keinGesetz', 'keinKanton', 'jahrNichtBelegt'].includes(Object.values(r.befunde)[0].status) ? [Object.keys(r.befunde)[0]] : Object.keys(r.befunde))
    : [];

  const unterTitel = (id, inhalt) => React.createElement('h4', { id, style: { ...titelStil, fontSize: text.sm, margin: space.md + 'px 0 ' + space.sm + 'px' } }, inhalt);
  // «x von n»: die Angaben, die für jede Anstellung gelten (bedingte Rückfragen zählen nicht mit).
  const kernAngaben = ['art', 'kanton', 'betrag', 'wochenstunden', 'ferienForm', 'ferienWochen', 'feiertag', 'dreizehnter'];
  const erfasst = kernAngaben.filter((k) => String(e[k] ?? '').trim() !== '').length;

  // D + E — nur mit Betrag. Im Ergebnis-Teil der Form (role="status" trägt die Hülle).
  const ergebnis = r.status !== 'brauchtBetrag' && React.createElement(React.Fragment, null,
    React.createElement('section', { 'aria-labelledby': 'sl-d' },
      React.createElement('h3', { id: 'sl-d', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.rechnungTitel')),
      Object.entries(r.lesarten).map(([key, l]) => rechnung(key, l)),
      r.ferienForm === 'unklar' && React.createElement('p', { style: hinweisStil }, t('stundenlohnView.lesartenHinweis'))
    ),
    React.createElement('section', { 'aria-labelledby': 'sl-e', style: { marginTop: space.md + 'px', fontSize: text.sm, color: palette.text } },
      React.createElement('h3', { id: 'sl-e', style: { ...titelStil, fontSize: text.body } }, t('stundenlohnView.einordnungTitel')),
      befundKeys.map((key) => React.createElement('p', { key, style: absatz }, befundSatz(key))),
      // GE/NE/TI/JU: Mindestlohn ohne Feiertagszuschlag — der wird nie herausgerechnet, also die Annahme offen sagen.
      ['GE', 'NE', 'TI', 'JU'].includes(e.kanton) && e.feiertag !== 'nein' && React.createElement('p', { style: absatz }, t('stundenlohnView.ml_feiertagAnnahme')),
      React.createElement('p', { style: absatz }, r.bvg === 'unbekannt'
        ? t('stundenlohnView.bvg_unbekannt')
        : t('stundenlohnView.bvg_' + r.bvg, { jahr: betrag(r.jahreslohn), tief: betrag(r.jahrTief), hoch: betrag(r.jahrHoch), schwelle: betrag(r.bvgSchwelle) })),
      React.createElement('p', { style: absatz }, t('stundenlohnView.nbu_' + r.nbu)),
      stundenAusProfil && r.nbu !== 'unbekannt' && React.createElement('p', { style: absatz }, t('stundenlohnView.stundenAusProfil')),
      e.art && ['abrufEcht', 'abrufUnecht', 'befristet', 'temporaer', 'hausdienst'].includes(e.art) && React.createElement('p', { style: absatz }, t('stundenlohnView.art_einordnung_' + e.art))
    )
  );

  return React.createElement(RechnerForm, {
    palette, t, view: 'stundenlohn', onNavigate,
    titel: t('stundenlohnView.title'), satz: t('stundenlohnView.intro'),
    ergebnis, ohneErgebnis: React.createElement(React.Fragment, null, hinweisZeichen('info'), t('stundenlohnView.brauchtBetrag')),
    art: stundenlohnErgebnis(e),
    vorbehalt: React.createElement('p', { style: { ...hinweisStil, marginTop: space.sm + 'px' } }, hinweisZeichen(), t('stundenlohnView.vorlaeufig')),
    angaben: {
      erfasst, gesamt: kernAngaben.length,
      inhalt: React.createElement('div', { style: { fontSize: text.sm, color: palette.text } },
        // A — Anstellung
        React.createElement('section', { 'aria-labelledby': 'sl-a' },
          unterTitel('sl-a', t('stundenlohnView.anstellungTitel')),
          auswahl('art', t('stundenlohnView.art'), ARTEN, (a) => t('stundenlohnView.art_' + a), e.art ? t('stundenlohnView.artHinweis_' + e.art) : null),
          React.createElement('div', { style: raster },
            auswahl('kanton', t('stundenlohnView.kanton'), CANTON_CODES, (k) => getCantonName(k, t), t('stundenlohnView.kantonHinweis')),
            e.art === 'befristet' && antwort('ueber3Monate', t('stundenlohnView.ueber3Monate'))
          ),
          React.createElement('label', { htmlFor: 'sl-unter20', style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: text.sm, color: palette.text, cursor: 'pointer', minHeight: '44px' } },
            React.createElement('input', { id: 'sl-unter20', type: 'checkbox', checked: !!e.unter20, onChange: (ev) => aendern({ unter20: ev.target.checked }) }),
            t('stundenlohnView.unter20'))
        ),
        // B — Lohn
        React.createElement('section', { 'aria-labelledby': 'sl-b' },
          unterTitel('sl-b', t('stundenlohnView.lohnTitel')),
          React.createElement('div', { style: raster },
            feld('betrag', t('stundenlohnView.betrag'), t('stundenlohnView.betragHinweis')),
            feld('wochenstunden', t('stundenlohnView.wochenstunden'), t('stundenlohnView.wochenstundenHinweis'))
          ),
          r.stundenUnplausibel && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.stundenUnplausibel', { stunden: e.wochenstunden })),
          stundenAusProfil && React.createElement('p', { style: absatz }, hinweisZeichen(), t('stundenlohnView.stundenAusProfil'))
        ),
        // C — Ferien und Zuschläge
        React.createElement('section', { 'aria-labelledby': 'sl-c' },
          unterTitel('sl-c', t('stundenlohnView.zuschlaegeTitel')),
          auswahl('ferienForm', t('stundenlohnView.ferienForm'), FERIEN_FORMEN, (f) => t('stundenlohnView.ferienForm_' + f)),
          React.createElement('div', { style: raster },
            feld('ferienWochen', t('stundenlohnView.ferienWochen'), t('stundenlohnView.ferienWochenHinweis')),
            e.ferienForm !== 'bezahlt' && antwort('ausgewiesen', t('stundenlohnView.ausgewiesen'), t('stundenlohnView.ausgewiesenHinweis'))
          ),
          r.vertragZuWenig && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.vertragZuWenig', { wochen: r.ferienWochen })),
          e.ausgewiesen === 'nein' && e.ferienForm !== 'bezahlt' && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.nichtAusgewiesen')),
          // OR 329d Abs. 2: bei regelmässiger Arbeit keine Abgeltung in Geld (Rechtsprüfung 18.10.2026).
          e.art === 'fest' && (e.ferienForm === 'inklusive' || e.ferienForm === 'dazu') && React.createElement('p', { role: 'status', style: absatz }, hinweisZeichen(), t('stundenlohnView.ferienAbgeltungFest')),
          React.createElement('div', { style: raster },
            antwort('feiertag', t('stundenlohnView.feiertag'), t('stundenlohnView.feiertagHinweis')),
            e.feiertag === 'ja' && feld('feiertagProzent', t('stundenlohnView.feiertagProzent'))
          ),
          antwort('dreizehnter', t('stundenlohnView.dreizehnter'))
        )
      ),
    },
    // F — offene Fragen: was man beim Arbeitgeber klären kann.
    tun: r.status === 'gerechnet' && r.fragen.length > 0 ? {
      titel: t('stundenlohnView.fragenTitel'),
      inhalt: React.createElement(React.Fragment, null,
        React.createElement('p', { style: { ...hinweisStil, marginTop: 0 } }, t('stundenlohnView.fragenIntro')),
        React.createElement('ul', { style: { margin: space.sm + 'px 0 0', paddingLeft: '20px', fontSize: text.sm, color: palette.text, lineHeight: leading.normal } },
          r.fragen.map((f) => React.createElement('li', { key: f, style: { marginBottom: space.xs + 'px' } }, t('stundenlohnView.frage_' + f))))
      ),
    } : null,
    quelle: t('stundenlohnView.quellen'),
  });
};

export default Stundenlohn;
