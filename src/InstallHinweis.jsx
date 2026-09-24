import React, { useState } from 'react';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { text, weight, space, radius } from './config/tokens.js';
import { laeuftAlsApp } from './utils/geraetErkennung.js';

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

export const InstallHinweis = ({ palette, t, onNavigate, installPrompt, onPromptWeg }) => {
  const [laeuftSchonAlsApp] = useState(() => laeuftAlsApp());
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
    padding: space.xs + 'px ' + space.sm + 'px', background: 'transparent',
    border: 'none', cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit',
  };

  return React.createElement('div', {
    style: {
      margin: space.md + 'px ' + space.md + 'px 0', padding: space.md + 'px',
      background: palette.up, border: '1px solid ' + palette.border,
      borderRadius: radius.md + 'px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: space.sm,
    },
  },
    React.createElement('span', { style: { fontSize: text.sm, color: palette.text } },
      t(installPrompt ? 'pwa.installHint' : 'pwa.anleitungHint')),
    React.createElement('div', { style: { display: 'flex', gap: space.xs, alignItems: 'center' } },
      installPrompt && React.createElement(PrimaryButton, {
        palette,
        onClick: () => installAusloesen(installPrompt, onPromptWeg),
        style: { padding: space.xs + 'px ' + space.sm + 'px' },
      }, t('pwa.install')),
      React.createElement('button', {
        onClick: () => onNavigate('installApp'),
        style: { ...knopfStil, color: palette.sandDeep, fontWeight: weight.medium },
      }, t('pwa.anleitung')),
      React.createElement('button', {
        type: 'button',
        onClick: verwerfen,
        'aria-label': t('common.close'),
        // Tippfläche 44 × 44 (WCAG 2.2, 2.5.8 verlangt mind. 24; App-Massstab wie der Melde-Link).
        style: { ...knopfStil, color: palette.mid, minWidth: '44px', minHeight: '44px' },
      }, '×')
    )
  );
};

export default InstallHinweis;
