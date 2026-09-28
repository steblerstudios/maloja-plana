import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space, leading } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';
import { FRAGEN, OFFEN, dokument, dokumentHtml } from './data/patientenverfuegung.js';

// Patientenverfügung in Fragen — eine Frage pro Seite, am Schluss Vorschau und Druck.
// Skizze Stebler Studios 27.09.2026: A Fortschritt · B Frage · C «Warum?» · D Zurück/Weiter ·
// E Hinweis. Dokument und Regeln: data/patientenverfuegung.js; Grundlage und Prüfung:
// docs/design/patientenverfuegung-fragen-2026-09-27.md.
// Antworten unter notfall.pvAntworten — getrennt vom Feld notfall.patientenverfuegung («vorhanden?»).
// Kein trust.localOnly im Fussteil (Rechtsprüfung 27.09.: kein neues «nur auf dem Gerät»-Versprechen).

export const Patientenverfuegung = ({ palette, t, data, onUpdateData, lang }) => {
  const [antworten, setAntworten] = useState(() => data?.notfall?.pvAntworten || {});
  const [schritt, setSchritt] = useState(0);
  const total = FRAGEN.length;
  const vorschau = schritt >= total;

  const setzen = (patch) => {
    const next = { ...antworten, ...patch };
    setAntworten(next);
    if (onUpdateData) onUpdateData('notfall', 'pvAntworten', next);
  };

  const labelStil = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };
  const hilfeStil = { margin: space.xs + 'px 0 ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const eingabeStil = { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const knopf = (hervor) => ({ padding: '10px 18px', minHeight: '44px', fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.medium, borderRadius: radius.sm, cursor: 'pointer',
    border: '1px solid ' + (hervor ? palette.sandDeep : palette.border), background: hervor ? palette.sand : palette.surface, color: hervor ? (palette.onSand || palette.text) : palette.text });

  // Eine Auswahlgruppe als echte Radio-Gruppe (fieldset/legend).
  const auswahl = (name, frageText, optionen, wert, onWahl, optKey) =>
    React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: '0 0 ' + space.md + 'px' } },
      React.createElement('legend', { style: { ...labelStil, fontSize: text.body, marginBottom: space.sm + 'px' } }, frageText),
      optionen.map((o) => React.createElement('label', { key: o, style: { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '40px', fontSize: text.sm, color: palette.text, cursor: 'pointer' } },
        React.createElement('input', { type: 'radio', name, value: o, checked: wert === o, onChange: () => onWahl(o) }),
        o === OFFEN ? t('pv.ui.offen') : t('pv.opt.' + optKey + '_' + o)
      ))
    );

  const textfeld = (id, label, wert, onText, mehrzeilig) => React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
    React.createElement('label', { htmlFor: id, style: labelStil }, label),
    React.createElement(mehrzeilig ? 'textarea' : 'input', {
      id, value: wert || '', rows: mehrzeilig ? 5 : undefined, type: mehrzeilig ? undefined : 'text',
      onChange: (e) => onText(e.target.value), style: { ...eingabeStil, resize: mehrzeilig ? 'vertical' : undefined },
    })
  );

  const frageSeite = (f) => {
    const hilfe = t('pv.hilfe.' + f.key);
    const hatHilfe = hilfe && hilfe !== 'pv.hilfe.' + f.key;
    const hilfeEl = hatHilfe && React.createElement('p', { style: hilfeStil }, hilfe);
    if (f.art === 'eine') {
      return React.createElement(React.Fragment, null,
        auswahl('pv-' + f.key, t('pv.frage.' + f.key), f.optionen, antworten[f.key], (o) => setzen({ [f.key]: o }), f.key),
        hilfeEl,
        f.key === 'bestehend' && antworten.bestehend === 'ergaenzt' && React.createElement('div', { style: { marginBottom: space.sm + 'px' } },
          React.createElement('label', { htmlFor: 'pv-bestehend-datum', style: labelStil }, t('pv.ui.bestehendDatum')),
          React.createElement('input', { id: 'pv-bestehend-datum', type: 'date', value: antworten.bestehendDatum || '', onChange: (e) => setzen({ bestehendDatum: e.target.value }), style: { ...eingabeStil, maxWidth: '220px' } }))
      );
    }
    if (f.art === 'mehrere') {
      const gewaehlt = Array.isArray(antworten[f.key]) ? antworten[f.key] : [];
      return React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: 0 } },
        React.createElement('legend', { style: { ...labelStil, fontSize: text.body, marginBottom: space.sm + 'px' } }, t('pv.frage.' + f.key)),
        hilfeEl,
        f.optionen.map((o) => React.createElement('label', { key: o, style: { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '40px', fontSize: text.sm, color: palette.text, cursor: 'pointer' } },
          React.createElement('input', { type: 'checkbox', checked: gewaehlt.includes(o), onChange: (e) => setzen({ [f.key]: e.target.checked ? [...gewaehlt, o] : gewaehlt.filter((x) => x !== o) }) }),
          t('pv.opt.' + f.key + '_' + o)))
      );
    }
    if (f.art === 'text') {
      return React.createElement(React.Fragment, null,
        textfeld('pv-' + f.key, t('pv.frage.' + f.key), antworten[f.key], (v) => setzen({ [f.key]: v }), f.key !== 'original'),
        hilfeEl);
    }
    if (f.art === 'gruppe') {
      const g = antworten[f.key] || {};
      const teilSetzen = (patch) => setzen({ [f.key]: { ...g, ...patch } });
      return React.createElement(React.Fragment, null,
        React.createElement('div', { style: { ...labelStil, fontSize: text.body, marginBottom: space.xs + 'px' } }, t('pv.frage.' + f.key)),
        hilfeEl,
        f.teile.map((teil) => React.createElement('div', { key: teil.key },
          auswahl('pv-' + teil.key, t('pv.frage.' + teil.key), teil.optionen, g[teil.key], (o) => teilSetzen({ [teil.key]: o }), teil.key),
          teil.key === 'organspende' && g.organspende === 'bestimmte' && textfeld('pv-organe-liste', t('pv.ui.organeListe'), g.organeListe, (v) => teilSetzen({ organeListe: v }))
        ))
      );
    }
    // personen
    return React.createElement(React.Fragment, null,
      React.createElement('div', { style: { ...labelStil, fontSize: text.body, marginBottom: space.xs + 'px' } }, t('pv.frage.' + f.key)),
      hilfeEl,
      f.rollen.map((rolle) => {
        const p = antworten[rolle] || {};
        const set = (k) => (v) => setzen({ [rolle]: { ...p, [k]: v } });
        return React.createElement('div', { key: rolle, style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.sm + 'px' } },
          React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, fontSize: text.sm, margin: space.xs + 'px 0 ' + space.sm + 'px' } }, t('pv.doc.rolle_' + rolle)),
          textfeld('pv-' + rolle + '-name', t('pv.ui.name'), p.name, set('name')),
          textfeld('pv-' + rolle + '-beziehung', t('pv.ui.beziehung'), p.beziehung, set('beziehung')),
          textfeld('pv-' + rolle + '-telefon', t('pv.ui.telefon'), p.telefon, set('telefon')));
      })
    );
  };

  const doc = vorschau ? dokument(antworten, data, t) : null;
  const vorschauSeite = () => React.createElement('div', null,
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('pv.ui.vorschauTitel')),
    doc.leer
      ? React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, hinweisZeichen(), t('pv.ui.leer'))
      : React.createElement('div', { style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm, fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
          React.createElement('div', { style: { fontSize: text.lg, marginBottom: space.sm + 'px', color: palette.text } }, t('pv.doc.titel')),
          React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px' } }, t('pv.doc.gilt'), doc.situationen.length ? ' ' + t('pv.doc.giltInsbesondere') + ' ' + doc.situationen.join(' · ') : ''),
          doc.abschnitte.map((s) => React.createElement('div', { key: s.key, style: { marginBottom: space.sm + 'px' } },
            React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text } }, s.titel),
            s.zeilen.map((z, i) => React.createElement('p', { key: i, style: { margin: '2px 0', whiteSpace: 'pre-wrap' } }, z)),
            (s.personen || []).map((p) => React.createElement('p', { key: p.rolle, style: { margin: '2px 0' } }, t('pv.doc.rolle_' + p.rolle) + ': ' + [p.name, p.beziehung, p.telefon].filter(Boolean).join(' · ')))
          )),
          doc.bestehendSatz && React.createElement('p', { style: { margin: space.sm + 'px 0 0' } }, doc.bestehendSatz)
        ),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium, margin: space.md + 'px 0 ' + space.sm + 'px' } }, hinweisZeichen(), t('pv.ui.ungueltigOhne')),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px' } },
      !doc.leer && React.createElement('button', { type: 'button', style: knopf(true), onClick: () => openPrintWindow(dokumentHtml(antworten, data, t, lang)) },
        React.createElement(Icon, { name: 'document', size: 16, style: { verticalAlign: '-3px', marginRight: '6px' } }), t('pv.ui.drucken')),
      React.createElement('button', { type: 'button', style: knopf(false), onClick: () => setSchritt(0) }, t('pv.ui.aendern'))
    )
  );

  const f = FRAGEN[schritt];
  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'document', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('pv.ui.title')),
    // E — Hinweis oben
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px', lineHeight: leading.normal } }, t('pv.ui.hinweis')),
    schritt === 0 && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.md + 'px' } },
      React.createElement('p', { style: { margin: '0 0 ' + space.xs + 'px' } }, t('pv.ui.intro')),
      React.createElement('p', { style: { margin: '0 0 ' + space.xs + 'px' } }, t('pv.ui.speicher')),
      React.createElement('p', { style: { margin: 0 } }, t('pv.ui.einstiegPsych'))
    ),
    React.createElement('div', { style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm } },
      // A — Fortschritt
      !vorschau && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('pv.ui.fortschritt', { n: schritt + 1, total })),
        React.createElement('div', { role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': total, 'aria-valuenow': schritt + 1, 'aria-label': t('pv.ui.fortschritt', { n: schritt + 1, total }), style: { height: '4px', background: palette.border, borderRadius: radius.hair + 'px', marginTop: '6px' } },
          React.createElement('div', { style: { height: '100%', width: Math.round(((schritt + 1) / total) * 100) + '%', background: palette.sage, borderRadius: radius.hair + 'px' } }))
      ),
      // B — Frage · C — Warum
      vorschau ? vorschauSeite() : React.createElement('div', { key: f.key },
        frageSeite(f),
        React.createElement('details', { style: { marginTop: space.sm + 'px', fontSize: text.sm, color: palette.mid } },
          React.createElement('summary', { style: { cursor: 'pointer', color: palette.sandDeep, fontWeight: weight.medium, minHeight: '32px' } }, t('pv.ui.warum')),
          React.createElement('p', { style: { margin: space.xs + 'px 0 0', lineHeight: leading.normal, color: palette.mid } }, t('pv.warum.' + f.key)))
      ),
      // D — Zurück / Weiter
      !vorschau && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', marginTop: space.md + 'px' } },
        React.createElement('button', { type: 'button', style: { ...knopf(false), visibility: schritt === 0 ? 'hidden' : 'visible' }, onClick: () => setSchritt(schritt - 1) }, t('pv.ui.zurueck')),
        React.createElement('button', { type: 'button', style: knopf(true), onClick: () => setSchritt(schritt + 1) }, schritt === total - 1 ? t('pv.ui.zurVorschau') : t('pv.ui.weiter'))
      )
    ),
    vorschau && React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px', lineHeight: leading.normal } }, t('pv.ui.hinweis'))
  );
};

export default Patientenverfuegung;
