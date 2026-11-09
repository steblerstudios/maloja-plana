import React, { useState, useRef, useEffect } from 'react';
import { PageTitle } from './Heading.jsx';
import { Icon } from '../IconSystem.jsx';
import { knopfStil } from './PrimaryButton.jsx';
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
  // Querschnitt 2 (09.11.2026): nach Weiter/Zurück springt der Fokus auf die neue Frage. Die Fläche
  // trägt Rolle und Namen («Frage 3 von 9: …»), so sagt der Screenreader den Wechsel an — gleiches
  // Muster wie AblaufSchale (Fokus statt aria-live, sonst doppelte Ansage).
  const flaeche = useRef(null);
  const gewechselt = useRef(false);
  useEffect(() => {
    if (gewechselt.current && flaeche.current) flaeche.current.focus();
  }, [schritt]);
  const geheZu = (n) => { gewechselt.current = true; setSchritt(n); };

  const labelStil = { display: 'block', fontSize: text.sm, color: palette.text, fontWeight: weight.medium, marginBottom: '4px' };
  const frageStil = { ...labelStil, fontSize: text.body, marginBottom: space.sm + 'px' };
  const hilfeStil = { margin: space.xs + 'px 0 ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const eingabeStil = { padding: '8px 12px', fontSize: text.sm, border: '1px solid ' + palette.feldrand, borderRadius: radius.md, background: palette.surface, color: palette.text, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const zeileStil = { display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', fontSize: text.sm, color: palette.text, cursor: 'pointer' };
  // Fassung 9: Haupt- und Nebenknopf aus dem Baustein (auch für die Vorschau der Fragen-Abläufe).
  const knopf = (hervor) => knopfStil(palette, hervor ? 'haupt' : 'neben');

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
      return React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: 0 } },
        React.createElement('legend', { style: { ...frageStil, marginBottom: space.xs + 'px' } }, t(ns + '.frage.' + f.key)),
        hilfe,
        f.teile.map((teil) => React.createElement('div', { key: teil.key },
          auswahl(ns + '-' + teil.key, t(ns + '.frage.' + teil.key), teil.optionen, teil.key, g[teil.key], (o) => teilSetzen({ [teil.key]: o })),
          zusatzFeld(teil.zusatz, g[teil.key], g, (v) => teilSetzen({ [teil.zusatz.key]: v })))));
    }
    // personen: je Rolle ein Kasten mit Feldern
    const felder = f.felder || ['name', 'beziehung', 'telefon'];
    // Jede Rolle ist eine eigene Gruppe: bei zwei Rollen sagt der Screenreader «Ersatzperson, Name» statt
    // zweimal nur «Name» (Querschnitt 2).
    return React.createElement('fieldset', { style: { border: 'none', padding: 0, margin: 0 } },
      React.createElement('legend', { style: { ...frageStil, marginBottom: space.xs + 'px' } }, t(ns + '.frage.' + f.key)),
      hilfe,
      f.rollen.map((rolle) => {
        const p = antworten[rolle] || {};
        return React.createElement('fieldset', { key: rolle, style: { padding: space.sm + 'px ' + space.md + 'px', background: palette.surface, borderRadius: radius.md, border: '1px solid ' + palette.border, margin: '0 0 ' + space.sm + 'px', minWidth: 0 } },
          f.rollen.length > 1 && React.createElement('legend', { style: { fontWeight: weight.semi, color: palette.text, fontSize: text.sm, padding: 0, margin: space.xs + 'px 0 ' + space.sm + 'px', float: 'left', width: '100%' } }, t(ns + '.doc.rolle_' + rolle)),
          felder.map((k) => feld(ns + '-' + rolle + '-' + k, t(ns + '.ui.' + k), p[k], (v) => setzen({ [rolle]: { ...p, [k]: v } }), { typ: k === 'geburt' ? 'date' : 'text', schmal: k === 'geburt' })));
      }));
  };

  const f = fragen[schritt];
  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '24px', borderRadius: radius.lg, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: icon, size: 22 }), style: { marginBottom: space.sm + 'px' } }, titel),
    // E — Hinweis oben
    hinweis && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px', lineHeight: leading.normal } }, hinweis),
    schritt === 0 && kopf,
    React.createElement('div', { style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.lg } },
      // A — Fortschritt
      !imVorschau && React.createElement('div', { style: { marginBottom: space.md + 'px' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t(ns + '.ui.fortschritt', { n: schritt + 1, total })),
        React.createElement('div', { role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': total, 'aria-valuenow': schritt + 1, 'aria-label': t(ns + '.ui.fortschritt', { n: schritt + 1, total }), style: { height: '4px', background: palette.border, borderRadius: radius.hair + 'px', marginTop: '8px' } },
          React.createElement('div', { style: { height: '100%', width: Math.round(((schritt + 1) / total) * 100) + '%', background: palette.sage, borderRadius: radius.hair + 'px' } }))
      ),
      // B — Frage · C — Warum
      React.createElement('div', {
        ref: flaeche, tabIndex: -1, role: 'group', 'data-fragen-flaeche': '', style: { outline: 'none' },
        'aria-label': imVorschau ? titel : t(ns + '.ui.fortschritt', { n: schritt + 1, total }) + ': ' + t(ns + '.frage.' + f.key),
      },
      imVorschau ? vorschau({ zumAnfang: () => geheZu(0), knopf }) : React.createElement('div', { key: f.key },
        frageSeite(f),
        React.createElement('details', { style: { marginTop: space.sm + 'px', fontSize: text.sm, color: palette.mid } },
          // 12 px oben und unten ergeben mit der Zeile 44 px Tippfläche; display:flex würde in WebKit das Dreieck nehmen.
          React.createElement('summary', { style: { cursor: 'pointer', color: palette.sandDeep, fontWeight: weight.medium, padding: '12px 0' } }, t(ns + '.ui.warum')),
          React.createElement('p', { style: { margin: space.xs + 'px 0 0', lineHeight: leading.normal, color: palette.mid } }, t(ns + '.warum.' + f.key)))
      )),
      // D — Zurück / Weiter
      !imVorschau && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', marginTop: space.md + 'px' } },
        React.createElement('button', { type: 'button', style: { ...knopf(false), visibility: schritt === 0 ? 'hidden' : 'visible' }, onClick: () => geheZu(schritt - 1) }, t(ns + '.ui.zurueck')),
        React.createElement('button', { type: 'button', style: knopf(true), onClick: () => geheZu(schritt + 1) }, schritt === total - 1 ? t(ns + '.ui.zurVorschau') : t(ns + '.ui.weiter'))
      )
    ),
    imVorschau && hinweis && React.createElement('p', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.md + 'px', lineHeight: leading.normal } }, hinweis)
  );
};

export default FragenAblauf;
