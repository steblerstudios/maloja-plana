import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { addReminder } from './utils/reminders.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { renderSource } from './utils/renderSource.js';

// Wiederverwendbare Ablauf-Schale: die ruhigen, gemeinsamen Bausteine eines geführten
// Ablaufs (Titel, Schritte, Crosslinks, Frist-in-Kalender, Fuss-Hinweise). Erster Nutzer
// war der Zusatzversicherungs-Wechsel; heute bauen 18 der 19 Abläufe darauf, auch der
// KVG-Wechsel (Stand 24.09.2026). Nur AsylView hat seine eigene Gliederung.
// Bewusst schlanke Primitiven statt einer config-getriebenen Engine (keine Über-Abstraktion).

const styles = (palette) => ({
  wrap: { maxWidth: '560px' },
  h2: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.sm + 'px', display: 'flex', alignItems: 'center', gap: space.sm + 'px' },
  intro: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, marginBottom: space.lg + 'px' },
  stepTitle: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: space.lg + 'px 0 ' + space.xs + 'px 0' },
  stepText: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
  link: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm + 'px' },
  primaryBtn: { background: palette.sand, color: palette.onSand, border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: text.sm, fontFamily: 'inherit', fontWeight: weight.semi, borderRadius: radius.sm, marginTop: space.sm + 'px' },
  done: { fontSize: text.sm, color: palette.sageDeep, fontWeight: weight.medium, marginTop: space.sm + 'px' },
  warn: { fontSize: text.sm, color: palette.goldDeep, marginTop: space.xs + 'px' },
  note: { fontSize: text.sm, color: palette.mid, marginTop: space.sm + 'px' },
  footer: { fontSize: text.xs, color: palette.soft, marginTop: space.xl + 'px', lineHeight: leading.normal },
});

// Container mit Kopf (Icon + Titel + Intro) und beliebigen Schritt-Kindern.
export const AblaufContainer = ({ palette, icon, title, intro, children }) => {
  const s = styles(palette);
  return React.createElement('div', { style: s.wrap },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: icon || 'insurance', size: 22 }), style: { marginBottom: space.sm + 'px' } }, title),
    intro ? React.createElement('p', { style: s.intro },
      React.createElement(GlossarText, { palette }, intro)) : null,
    children
  );
};

// Ein ruhiger Schritt: Titel + freier Inhalt.
export const AblaufStep = ({ palette, title, icon, children }) => {
  return React.createElement(React.Fragment, null,
    icon
      ? React.createElement(PanelTitle, { palette, icon: React.createElement(Icon, { name: icon, size: 20 }), style: { margin: space.lg + 'px 0 ' + space.xs + 'px 0' } }, title)
      : React.createElement(PanelTitle, { palette, style: { margin: space.lg + 'px 0 ' + space.xs + 'px 0' } }, title),
    children
  );
};

// Crosslink-Knopf „→ Label" → onNavigate-Ziel.
export const AblaufLink = ({ palette, label, onClick }) => {
  const s = styles(palette);
  return React.createElement('button', { style: s.link, onClick }, label);
};

// Frist-in-Kalender-Knopf: legt beim Klick eine Erinnerung an, zeigt danach Bestätigung.
// onSaved (optional): wird nach erfolgreichem Speichern aufgerufen — z.B. um zusätzlich
// ein Merkliste-Todo anzulegen (KVG-Faden).
export const FristButton = ({ palette, buttonLabel, doneLabel, calendarLabel, reminder, onNavigate, onSaved }) => {
  const s = styles(palette);
  const [done, setDone] = useState(false);
  const handle = () => { if (addReminder(reminder)) { if (onSaved) onSaved(); setDone(true); } }; // nur bestätigen, wenn gespeichert
  if (done) {
    return React.createElement('div', null,
      React.createElement('div', { style: s.done }, hinweisZeichen('check'), doneLabel),
      onNavigate && calendarLabel
        ? React.createElement('button', { style: s.link, onClick: () => onNavigate('calendar') }, calendarLabel)
        : null
    );
  }
  return React.createElement('button', { style: s.primaryBtn, onClick: handle }, buttonLabel);
};

// Fuss-Hinweise (Hinweis-Piktogramm je Zeile).
// `quelle`: die Zeile «Quellen: … · Stand …» (i18n-Text mit [[Wort|url]]-Markern,
// siehe utils/renderSource.js). Steht zuoberst im Fuss, weil sie für den ganzen
// Ablauf gilt. Seit 24.09.2026 trägt jeder der 19 Abläufe eine (AsylView ohne
// diese Schale setzt sie selbst); vorher hatten zwei eine. Wache:
// src/__tests__/ablaufQuellen.test.js.
export const AblaufFooter = ({ palette, notes, quelle, t }) => {
  const s = styles(palette);
  return React.createElement('div', { style: s.footer },
    quelle ? React.createElement('div', { key: 'quelle', style: { marginBottom: '6px' } }, renderSource(quelle, null, t)) : null,
    (notes || []).flatMap((n, i) => [
      i > 0 ? React.createElement('br', { key: 'br' + i }) : null,
      hinweisZeichen(undefined, undefined, 'z' + i), n,
    ])
  );
};

export { styles as ablaufStyles };
