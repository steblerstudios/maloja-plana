import React, { useState } from 'react';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { laeuftAlsApp, aktuellesGeraet } from './utils/geraetErkennung.js';

// ─── Der Hinweis auf den Weg zum Startbildschirm ──────────────────────────────
//
// EIN Kasten, zwei Fassungen — nicht zwei Kästen:
//
//   • Chromium (Chrome/Edge, Desktop + Android) meldet sich per
//     `beforeinstallprompt`. Nur dort kann die Seite selbst installieren, also
//     steht dort zusätzlich der Knopf.
//   • Safari (iOS UND macOS) und Firefox melden sich nie. Bis 24.09.2026 stand
//     dort GAR NICHTS — auf jedem iPhone also, und das ist das Gerät, auf dem
//     dieser Ordner am ehesten gebraucht wird. Dort führt derselbe Kasten zur
//     Anleitung.
//
// 🛑 WARUM DAS EINE EIGENE, NACHGELADENE DATEI IST
// Der Kasten stand zuerst in main.jsx. Die CI wurde davon rot: `npm run size`
// deckelt das Hauptbundle bei 65 kB, und `main` allein lag am 24.09.2026 bei
// 64,94 kB — SECHZIG Byte Luft. Der Kasten kostete 290 B und riss die Grenze.
// Hier liegt er in einem eigenen Stück, das erst beim Zeichnen des Dashboards
// geladen wird; im Startbundle bleibt nur die eine Lazy-Zeile.
// Das Gleiche gilt für `laeuftAlsApp`: der Import ist hier frei, in main.jsx
// hätte er das ganze Modul ins Startbundle gezogen.
//
// Der Kasten verschwindet, sobald die Seite als App läuft. Die Fassung ohne
// Knopf bleibt nach dem Wegklicken dauerhaft weg (or5_install_hinweis) — ein
// Hinweis, der nach jedem Laden zurückkommt, ist eine Aufforderung und keine
// Hilfe.

// Ein Aufruf, zwei Orte: dieser Kasten und die Anleitungs-Seite drücken
// denselben Knopf. Zwei Kopien derselben drei Zeilen wären zwei Orte, an denen
// sie auseinanderlaufen können. Steht hier und nicht in main.jsx, weil beide
// Nutzer nachgeladen sind — im Startbundle hätte es Platz gekostet, den es
// nicht gibt (60 B Luft, siehe oben).
export const installAusloesen = (installPrompt, fertig) => {
  if (!installPrompt) return;
  installPrompt.prompt();
  installPrompt.userChoice.then(fertig);
};

export const InstallHinweis = ({ palette, t, onNavigate, installPrompt, onPromptWeg, klein }) => {
  const [laeuftSchonAlsApp] = useState(() => laeuftAlsApp());
  // Zeichen nach Gerät (Entscheid 25.09.2026): Handy auf iOS/Android, sonst ein Bildschirm.
  const [mobil] = useState(() => ['ios', 'android'].includes(aktuellesGeraet()));
  const [weg, setWeg] = useState(() => {
    try { return localStorage.getItem('or5_install_hinweis') === 'weg'; } catch (e) { return false; }
  });

  if (laeuftSchonAlsApp || (!installPrompt && weg)) return null;

  const verwerfen = () => {
    if (installPrompt) { onPromptWeg(); return; }
    setWeg(true);
    // Gesperrter Speicher (Privatmodus) ist kein Fehlerfall — dann gilt das
    // Wegklicken eben nur für diese Sitzung.
    try { localStorage.setItem('or5_install_hinweis', 'weg'); } catch (e) { /* */ }
  };

  const knopfStil = {
    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit',
  };

  // Seit 25.09.2026 eine kleine Karte rechts oben im Bergpanorama (BergLandschaft, `ecke`) statt
  // eines Kastens über den Bergen: Zeichen und «×» oben, darunter der Satz, unten der Knopf. Die
  // Breite gibt die Ecke vor; hier füllt die Karte sie.
  return React.createElement('div', {
    'data-testid': 'install-karte',
    style: {
      padding: space.sm + 'px', background: palette.surface, borderRadius: radius.md + 'px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column', gap: space.xs,
    },
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
      // Das Zeichen sagt «Startbildschirm», bevor man liest: am Handy ein Handy, am Computer ein Bildschirm.
      React.createElement('svg', {
        width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: palette.sageDeep, strokeWidth: 1.6,
        strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', 'data-zeichen': mobil ? 'handy' : 'computer',
        style: { marginTop: space.xs, flex: 'none' },
      },
        mobil
          ? [React.createElement('rect', { key: 'a', x: 6.5, y: 2.5, width: 11, height: 19, rx: 2 }),
             React.createElement('path', { key: 'b', d: 'M11 18.5h2' })]
          : [React.createElement('rect', { key: 'a', x: 2.5, y: 4, width: 19, height: 12.5, rx: 1.5 }),
             React.createElement('path', { key: 'b', d: 'M9 20.5h6M12 16.5v4' })]),
      React.createElement('button', {
        type: 'button',
        onClick: verwerfen,
        'aria-label': t('common.close'),
        // Tippfläche 44 × 44 (WCAG 2.2, 2.5.8 verlangt mind. 24; App-Massstab wie der Melde-Link);
        // der negative Rand holt sie in die Kartenecke, ohne die Karte aufzublähen.
        style: { ...knopfStil, color: palette.mid, minWidth: '44px', minHeight: '44px', margin: -space.sm + 'px ' + -space.sm + 'px 0 0', lineHeight: 1 },
      }, '×')),
    // Der Satz steht immer sichtbar da — am Handy (klein) eine Stufe kleiner, damit die Karte im
    // Bild nicht zu gross wird. Bis 25.09.2026 abends fehlte er am Handy ganz und stand nur im
    // Namen des Knopfs; man sah allein «So geht es» (Rückmeldung Stebler Studios).
    React.createElement('span', { style: { fontSize: klein ? text.xs : text.sm, lineHeight: 1.3, color: palette.text, marginTop: -space.sm } },
      t('install.navSub')),
    // «So geht es»: wo der Browser nicht selbst installieren kann (Safari, Firefox), ist die
    // Anleitung DER Weg — also der Hauptknopf (Entscheid 25.09.2026). Wo «Installieren» steht,
    // bleibt sie der ruhige Zweitweg darunter: nie zwei Hauptknöpfe in einer Karte.
    installPrompt
      ? React.createElement(React.Fragment, null,
        React.createElement(PrimaryButton, {
          palette,
          onClick: () => installAusloesen(installPrompt, onPromptWeg),
          style: { padding: space.xs + 'px ' + space.sm + 'px', minHeight: '44px', whiteSpace: 'nowrap', width: '100%' },
        }, t('pwa.install')),
        !klein && React.createElement('button', {
          type: 'button',
          onClick: () => onNavigate('installApp'),
          style: { ...knopfStil, color: palette.sandDeep, fontWeight: weight.medium, whiteSpace: 'nowrap', minHeight: '44px', padding: 0 },
        }, t('pwa.anleitung')))
      : React.createElement(PrimaryButton, {
        palette,
        'data-testid': 'install-anleitung-cta',
        onClick: () => onNavigate('installApp'),
        style: { padding: space.xs + 'px ' + space.sm + 'px', minHeight: '44px', whiteSpace: 'nowrap', width: '100%' },
      }, t('pwa.anleitung'))
  );
};

export default InstallHinweis;
