import React, { useState } from 'react';
import { PageTitle } from './Heading.jsx';
import { Icon } from '../IconSystem.jsx';
import { text, weight, radius, space, leading } from '../config/tokens.js';

// Fragen-Ablauf: eine Frage pro Seite, am Schluss eine Vorschau (Skizze Stebler Studios 27.09.2026).
// A Fortschritt · B Frage · C «Warum wird das gefragt?» · D Zurück/Weiter · E Hinweis.
// Gemeinsam für Patientenverfügung, Vorsorgeauftrag-Vorlage und Bestattungswünsche — die Regeln
// (kein Standardwert, «Weiss ich noch nicht») stehen in den Daten-Modulen, nicht hier.
//
// Texte je Namensraum `ns`: ns.frage.<key> · ns.opt.<key>_<wert> · ns.hilfe.<key> · ns.warum.<key>
// · ns.ui.{offen, fortschritt, zurueck, weiter, zurVorschau, warum, <zusatz.key>, <feld>}
// · Rollen bei «personen»: ns.doc.rolle_<rolle>.
//
// Fragearten: 'eine' · 'mehrere' · 'text' (einzeilig: true für kurze) · 'gruppe' (teile) ·
// 'personen' (rollen, felder). Zusatzfeld: zusatz = { bei: <wert>, key, typ: 'text' | 'date' }.

const OFFEN = 'offen'; // gleicher Wert wie OFFEN in den Daten-Modulen

export const FragenAblauf = ({ palette, t, ns, fragen, antworten, setzen, titel, icon = 'document', hinweis, kopf, vorschau }) => {
  const [schritt, setSchritt] = useState(0);
  const total = fragen.length;
  const imVorschau = schritt >= total;

  const labelStil = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };
  const frageStil = { ...labelStil, fontSize: text.body, marginBottom: space.sm + 'px' };
  const hilfeStil = { margin: space.xs + 'px 0 ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const eingabeStil = { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const zeileStil = { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '40px', fontSize: text.sm, color: palette.text, cursor: 'pointer' };
  const knopf = (hervor) => ({ padding: '10px 18px', minHeight: '44px', fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.medium, borderRadius: radius.sm, cursor: 'pointer',
    border: '1px solid ' + (hervor ? palette.sandDeep : palette.border), background: hervor ? palette.sand : palette.surface, color: hervor ? (palette.onSand || palette.text) : palette.text });

  const feld = (id, label, wert, onWert, { mehrzeilig = false, typ = 'text', schmal = false } = {}) => React.createElement('div', { key: id, style: { marginBottom: space.sm + 'px' } },
    React.createElement('label', { htmlFor: id, style: labelStil }, label),
    React.createElement(mehrzeilig ? 'textarea' : 'input', {
      id, value: wert || '', rows: mehrzeilig ? 5 : undefined, type: mehrzeilig ? undefined : typ,
      onChange: (e) => onWert(e.target.value),
      style: { ...eingabeStil, resize: mehrzeilig ? 'vertical' : undefined, maxWidth: schmal ? '220px' : undefined },
    })
  );

  // Zusatzfeld unter einer Auswahl (z. B. Datum der früheren Verfügung, «Welche Organe?»).
  const zusatzFeld = (z, gewaehlt, werte, onWert) => z && gewaehlt === z.bei &&
    feld(ns + '-' + z.key, t(ns + '.ui.' + z.key), werte[z.key], onWert, { typ: z.typ === 'date' ? 'date' : 'text', schmal: z.typ === 'date' });

  const auswahl = (name, frageText, optionen, optKey, wert, onWahl) =>
    React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: '0 0 ' + space.sm + 'px' } },
      React.createElement('legend', { style: frageStil }, frageText),
      optionen.map((o) => React.createElement('label', { key: o, style: zeileStil },
        React.createElement('input', { type: 'radio', name, value: o, checked: wert === o, onChange: () => onWahl(o) }),
        o === OFFEN ? t(ns + '.ui.offen') : t(ns + '.opt.' + optKey + '_' + o)))
    );

  const frageSeite = (f) => {
    const hilfe = React.createElement('p', { style: hilfeStil }, t(ns + '.hilfe.' + f.key));
    if (f.art === 'eine') {
      return React.createElement(React.Fragment, null,
        auswahl(ns + '-' + f.key, t(ns + '.frage.' + f.key), f.optionen, f.key, antworten[f.key], (o) => setzen({ [f.key]: o })),
        hilfe,
        zusatzFeld(f.zusatz, antworten[f.key], antworten, (v) => setzen({ [f.zusatz.key]: v })));
    }
    if (f.art === 'mehrere') {
      const gewaehlt = Array.isArray(antworten[f.key]) ? antworten[f.key] : [];
      return React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: 0 } },
        React.createElement('legend', { style: frageStil }, t(ns + '.frage.' + f.key)),
        hilfe,
        f.optionen.map((o) => React.createElement('label', { key: o, style: zeileStil },
          React.createElement('input', { type: 'checkbox', checked: gewaehlt.includes(o), onChange: (e) => setzen({ [f.key]: e.target.checked ? [...gewaehlt, o] : gewaehlt.filter((x) => x !== o) }) }),
          t(ns + '.opt.' + f.key + '_' + o))));
    }
    if (f.art === 'text') {
      return React.createElement(React.Fragment, null,
        feld(ns + '-' + f.key, t(ns + '.frage.' + f.key), antworten[f.key], (v) => setzen({ [f.key]: v }), { mehrzeilig: !f.einzeilig }),
        hilfe);
    }
    if (f.art === 'gruppe') {
      const g = antworten[f.key] || {};
      const teilSetzen = (patch) => setzen({ [f.key]: { ...g, ...patch } });
      return React.createElement(React.Fragment, null,
        React.createElement('div', { style: { ...frageStil, marginBottom: space.xs + 'px' } }, t(ns + '.frage.' + f.key)),
        hilfe,
        f.teile.map((teil) => React.createElement('div', { key: teil.key },
          auswahl(ns + '-' + teil.key, t(ns + '.frage.' + teil.key), teil.optionen, teil.key, g[teil.key], (o) => teilSetzen({ [teil.key]: o })),
          zusatzFeld(teil.zusatz, g[teil.key], g, (v) => teilSetzen({ [teil.zusatz.key]: v })))));
    }
    // personen: je Rolle ein Kasten mit Feldern
    const felder = f.felder || ['name', 'beziehung', 'telefon'];
    return React.createElement(React.Fragment, null,
      React.createElement('div', { style: { ...frageStil, marginBottom: space.xs + 'px' } }, t(ns + '.frage.' + f.key)),
      hilfe,
      f.rollen.map((rolle) => {
        const p = antworten[rolle] || {};
        return React.createElement('div', { key: rolle, style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.sm + 'px' } },
          f.rollen.length > 1 && React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, fontSize: text.sm, margin: space.xs + 'px 0 ' + space.sm + 'px' } }, t(ns + '.doc.rolle_' + rolle)),
          felder.map((k) => feld(ns + '-' + rolle + '-' + k, t(ns + '.ui.' + k), p[k], (v) => setzen({ [rolle]: { ...p, [k]: v } }), { typ: k === 'geburt' ? 'date' : 'text', schmal: k === 'geburt' })));
      }));
  };

  const f = fragen[schritt];
  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: icon, size: 22 }), style: { marginBottom: space.sm + 'px' } }, titel),
    // E — Hinweis oben
    hinweis && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px', lineHeight: leading.normal } }, hinweis),
    schritt === 0 && kopf,
    React.createElement('div', { style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm } },
      // A — Fortschritt
      !imVorschau && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t(ns + '.ui.fortschritt', { n: schritt + 1, total })),
        React.createElement('div', { role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': total, 'aria-valuenow': schritt + 1, 'aria-label': t(ns + '.ui.fortschritt', { n: schritt + 1, total }), style: { height: '4px', background: palette.border, borderRadius: radius.hair + 'px', marginTop: '6px' } },
          React.createElement('div', { style: { height: '100%', width: Math.round(((schritt + 1) / total) * 100) + '%', background: palette.sage, borderRadius: radius.hair + 'px' } }))
      ),
      // B — Frage · C — Warum
      imVorschau ? vorschau({ zumAnfang: () => setSchritt(0), knopf }) : React.createElement('div', { key: f.key },
        frageSeite(f),
        React.createElement('details', { style: { marginTop: space.sm + 'px', fontSize: text.sm, color: palette.mid } },
          React.createElement('summary', { style: { cursor: 'pointer', color: palette.sandDeep, fontWeight: weight.medium, minHeight: '32px' } }, t(ns + '.ui.warum')),
          React.createElement('p', { style: { margin: space.xs + 'px 0 0', lineHeight: leading.normal, color: palette.mid } }, t(ns + '.warum.' + f.key)))
      ),
      // D — Zurück / Weiter
      !imVorschau && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', marginTop: space.md + 'px' } },
        React.createElement('button', { type: 'button', style: { ...knopf(false), visibility: schritt === 0 ? 'hidden' : 'visible' }, onClick: () => setSchritt(schritt - 1) }, t(ns + '.ui.zurueck')),
        React.createElement('button', { type: 'button', style: knopf(true), onClick: () => setSchritt(schritt + 1) }, schritt === total - 1 ? t(ns + '.ui.zurVorschau') : t(ns + '.ui.weiter'))
      )
    ),
    imVorschau && hinweis && React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px', lineHeight: leading.normal } }, hinweis)
  );
};

export default FragenAblauf;
