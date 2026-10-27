import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { Brotkrume } from './components/Brotkrume.jsx';
import { Lebensmappe } from './Lebensmappe.jsx';
import { BehoerdenDossier } from './BehoerdenDossier.jsx';
import { NotfallDossier } from './NotfallDossier.jsx';

// ─── Unterlagen drucken ───────────────────────────────────
// F7-S2 (Stebler Studios 27.10.2026, docs/entscheide/seiten-buendeln.md §2 H): die drei Dossiers aus
// dossierGenerator.js als EINE Seite mit drei Auswahlen. Vorher drei Seiten mit derselben Vorschau-Form
// (Kopf, Druck-Knopf mit Export-Vorschau, Abschnitte, Datenschutz-Satz) — jetzt eine, die Auswahl oben.
//   Alles            → Lebensmappe
//   Für ein Amt      → Behörden-Dossier
//   Für den Notfall  → Notfall-Dossier (Notfall-QR erst auf Klick, Sensibilitäts-Hinweise — unverändert)
// Die alten Adressen bleiben (#/lebensmappe, #/behoerdendossier, #/notfalldossier) und öffnen die passende
// Auswahl (UMLEITUNGEN `wahl`). `wahl`/`onWahl` aus main.jsx; ohne `onWahl` (Tests) bleibt die Auswahl fest.

export const DRUCK_WAHLEN = [
  { key: 'alles', label: 'unterlagen.drucken.alles', dossier: 'unterlagen.dossier.lebensmappe.title', icon: 'home' },
  { key: 'amt', label: 'unterlagen.drucken.amt', dossier: 'unterlagen.dossier.behoerden.title', icon: 'legal' },
  { key: 'notfall', label: 'unterlagen.drucken.notfall', dossier: 'unterlagen.dossier.notfall.title', icon: 'emergency' },
];

// Unbekannte oder fehlende Wahl → «Alles».
export const druckWahl = (wahl) => (DRUCK_WAHLEN.some((w) => w.key === wahl) ? wahl : 'alles');

export const UnterlagenDrucken = ({ palette, t, data, chapters, documents, onNavigate, wahl, onWahl }) => {
  const aktiv = druckWahl(wahl);
  const props = { palette, t, data, chapters, onNavigate };

  // Eine Zeile je Auswahl: echte Radioknöpfe (Pfeiltasten und Leertaste bringt der Browser mit),
  // die ganze Zeile ist die Tippfläche. Gewählt = Rand und Grund in Salbei UND der gefüllte Kreis.
  const zeile = (w) => {
    const an = aktiv === w.key;
    return React.createElement('label', {
      key: w.key,
      style: {
        display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', boxSizing: 'border-box',
        padding: '10px 14px', marginBottom: space.sm + 'px', cursor: 'pointer',
        background: an ? palette.sage + '22' : palette.up, color: palette.text,
        border: '1px solid ' + (an ? palette.sage : palette.border), borderRadius: radius.sm,
      },
    },
      React.createElement('input', {
        type: 'radio', name: 'mp-drucken-wahl', value: w.key, checked: an,
        onChange: () => onWahl && onWahl(w.key),
        style: { margin: 0, flexShrink: 0, accentColor: palette.sage },
      }),
      React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', flexShrink: 0, color: palette.sandDeep || palette.text } },
        React.createElement(Icon, { name: w.icon, size: 20 })),
      React.createElement('span', { style: { display: 'block', minWidth: 0 } },
        React.createElement('span', { style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, t(w.label)),
        React.createElement('span', { style: { display: 'block', fontSize: text.sm, color: palette.mid } }, t(w.dossier)))
    );
  };

  return React.createElement('div', { style: { maxWidth: '520px' } },
    React.createElement(Brotkrume, { palette, t, view: 'drucken', onNavigate }),
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'documents', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('unterlagen.drucken.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, margin: '0 0 ' + space.md + 'px' } }, t('unterlagen.drucken.beschreibung')),

    React.createElement('div', { role: 'radiogroup', 'aria-labelledby': 'mp-drucken-legende', style: { marginBottom: space.lg + 'px' } },
      React.createElement('div', { id: 'mp-drucken-legende', style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: space.sm + 'px' } }, t('unterlagen.drucken.legende')),
      DRUCK_WAHLEN.map(zeile)
    ),

    // Dieselbe Vorschau-Form für alle drei — die Dossiers selbst, ohne eigene Brotkrume, mit Abschnittstitel.
    React.createElement('div', { 'data-druck-wahl': aktiv },
      aktiv === 'amt' ? React.createElement(BehoerdenDossier, props)
        : aktiv === 'notfall' ? React.createElement(NotfallDossier, props)
        : React.createElement(Lebensmappe, { ...props, documents })
    )
  );
};

export default UnterlagenDrucken;
