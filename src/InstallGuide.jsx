import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { text, weight, leading, space, radius } from './config/tokens.js';
import { Icon, zurueckZeichen, aufklappZeichen, hinweisZeichen } from './IconSystem.jsx';
import { GERAETE, aktuellesGeraet, laeuftAlsApp } from './utils/geraetErkennung.js';
// Eine Quelle für «jetzt installieren» — sie liegt beim Dashboard-Hinweis,
// weil beide Nutzer nachgeladen sind und nichts davon ins Startbundle darf.
import { installAusloesen } from './InstallHinweis.jsx';

// ─── Als App installieren ─────────────────────────────────────────────────────
//
// Warum es diese Seite gibt: Maloja Plana IST installierbar (manifest.json,
// Service Worker), aber der Installieren-Knopf im Dashboard hängt an
// `beforeinstallprompt` — einem Ereignis, das es nur in Chromium gibt. Auf jedem
// iPhone, in Safari am Mac und in Firefox erschien er nie. Wer dort wissen
// wollte, wie man die App aufs Gerät bekommt, fand im ganzen Produkt einen
// einzigen Halbsatz: «zum Homescreen hinzufügen» (FAQ, Antwort 6) — ohne zu
// sagen, wo dieser Weg beginnt.
//
// Aufbau bewusst editorial statt Kachel-Raster: eine Seite zum Lesen, oben der
// Weg für das Gerät in der Hand, darunter eingeklappt die anderen. Kein Gefühl
// von Produkt-Onboarding, sondern von Anleitung.

const Abschnitt = ({ title, children, palette }) =>
  React.createElement('div', { style: { marginBottom: space.xl + 'px' } },
    React.createElement(PanelTitle, {
      palette,
      style: {
        marginBottom: space.sm + 'px', letterSpacing: '0.2px',
        paddingBottom: space.sm + 'px', borderBottom: '1px solid ' + palette.border,
      },
    }, title),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed },
    }, children)
  );

// Nummerierte Schritte. Die Ziffern tragen die Orientierung, deshalb stehen sie
// ruhig in der Sand-Farbe und nicht in einem gefüllten Kreis (das wäre
// Produkt-Onboarding-Sprache).
const Schritte = ({ items, palette }) =>
  React.createElement('ol', {
    style: { margin: '0 0 ' + space.sm + 'px 0', paddingInlineStart: '22px' },
  }, (items || []).map((zeile, i) =>
    React.createElement('li', {
      key: i,
      style: { margin: '0 0 ' + space.sm + 'px 0', color: palette.text, lineHeight: leading.relaxed },
    }, zeile)
  ));

const Geraetblock = ({ kennung, t, palette, hervorgehoben }) => {
  const schritte = t('install.schritte.' + kennung);
  const hinweis = t('install.hinweis.' + kennung);
  return React.createElement('div', {
    style: {
      marginBottom: space.lg + 'px',
      // Der Block für das Gerät in der Hand bekommt eine ruhige Tönung statt
      // eines Rahmens — Raum statt Border (Gestalt-Regel).
      ...(hervorgehoben
        ? {
          background: palette.sageMist,
          borderRadius: radius.md + 'px',
          padding: space.md + 'px ' + space.md + 'px ' + space.sm + 'px',
        }
        : {}),
    },
  },
    React.createElement('div', {
      style: {
        fontSize: text.sm, fontWeight: weight.semi, color: palette.text,
        marginBottom: space.sm + 'px',
      },
    }, t('install.geraet.' + kennung)),
    Array.isArray(schritte) ? React.createElement(Schritte, { items: schritte, palette }) : null,
    // Nicht jedes Gerät hat einen Zusatzhinweis — fehlt der Schlüssel, gibt t()
    // ihn selbst zurück; dann zeigen wir nichts statt eines rohen Schlüssels.
    typeof hinweis === 'string' && !hinweis.startsWith('install.')
      ? React.createElement('div', {
        style: {
          fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed,
          display: 'flex', gap: space.xs + 'px', alignItems: 'start',
        },
      },
        React.createElement('span', { style: { flexShrink: 0, marginTop: '2px' } }, hinweisZeichen('info', 12)),
        React.createElement('span', null, hinweis))
      : null
  );
};

export const InstallGuide = ({ palette, t, onNavigate, installPrompt, onPromptWeg }) => {
  const [andereOffen, setAndereOffen] = useState(false);
  // Einmal beim ersten Rendern bestimmt: der Browser wechselt während einer
  // Sitzung nicht, und ein Zustand hier hält die Seite ruhig.
  const [geraet] = useState(() => aktuellesGeraet());
  const [istInstalliert] = useState(() => laeuftAlsApp());

  // «unbekannt» bekommt keinen eigenen Block — dann sind alle Wege gleich weit
  // weg, also zeigen wir sie alle offen statt einen zu raten.
  const kennt = GERAETE.includes(geraet);
  const andere = GERAETE.filter((g) => g !== geraet);

  return React.createElement('div', { style: { maxWidth: '600px', margin: '0 auto' } },
    React.createElement('button', {
      onClick: () => onNavigate('dashboard'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 ' + space.md + 'px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs + 'px',
      },
    }, zurueckZeichen(), t('common.back')),

    React.createElement(PageTitle, {
      palette,
      style: { marginBottom: space.sm + 'px', letterSpacing: '0.2px' },
    }, t('install.title')),

    React.createElement('p', {
      style: {
        fontSize: text.body, color: palette.mid, lineHeight: leading.relaxed,
        margin: '0 0 ' + space.lg + 'px 0',
      },
    }, t('install.lead')),

    // ── Läuft schon als App ────────────────────────────────────────────────
    istInstalliert && React.createElement('div', {
      style: {
        display: 'flex', gap: space.sm + 'px', alignItems: 'start',
        background: palette.sageMist, borderRadius: radius.md + 'px',
        padding: space.md + 'px', marginBottom: space.lg + 'px',
        fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed,
      },
    },
      React.createElement('span', { style: { flexShrink: 0, marginTop: '2px' } },
        React.createElement(Icon, { name: 'check', size: 14, color: palette.sageDeep })),
      React.createElement('span', null, t('install.schonInstalliert'))
    ),

    // ── Der direkte Knopf, wo der Browser ihn hergibt ──────────────────────
    !istInstalliert && installPrompt && React.createElement('div', {
      style: { marginBottom: space.lg + 'px' },
    },
      React.createElement(PrimaryButton, {
        palette,
        onClick: () => installAusloesen(installPrompt, onPromptWeg),
        icon: React.createElement(Icon, { name: 'download', size: 14, color: palette.onSand }),
      }, t('install.jetztInstallieren')),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, marginTop: space.sm + 'px', lineHeight: leading.relaxed },
      }, t('install.jetztInstallierenHinweis'))
    ),

    // ── Der Weg für das Gerät in der Hand ──────────────────────────────────
    !istInstalliert && React.createElement(Abschnitt, {
      title: kennt ? t('install.diesesGeraet') : t('install.alleGeraete'),
      palette,
    },
      kennt
        ? React.createElement(Geraetblock, { kennung: geraet, t, palette, hervorgehoben: true })
        : React.createElement(React.Fragment, null,
          React.createElement('p', { style: { margin: '0 0 ' + space.md + 'px 0' } }, t('install.geraetUnbekannt')),
          GERAETE.map((g) => React.createElement(Geraetblock, { key: g, kennung: g, t, palette }))
        )
    ),

    // ── Die anderen Geräte, eingeklappt ────────────────────────────────────
    kennt && React.createElement('div', { style: { marginBottom: space.xl + 'px' } },
      React.createElement('button', {
        type: 'button',
        onClick: () => setAndereOffen(!andereOffen),
        'aria-expanded': andereOffen,
        // aria-controls nur, solange das Ziel im DOM steht (eingeklappt wird es nicht gerendert).
        'aria-controls': andereOffen ? 'install-andere-geraete' : undefined,
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.sandDeep, fontSize: text.sm, fontFamily: 'inherit',
          fontWeight: weight.medium, padding: '0 0 ' + space.sm + 'px 0', textAlign: 'left',
        },
      },
        React.createElement('span', { 'aria-hidden': 'true' }, aufklappZeichen(andereOffen)),
        andereOffen ? t('install.andereVerbergen') : t('install.andereZeigen')),
      andereOffen && React.createElement('div', { id: 'install-andere-geraete', style: { marginTop: space.sm + 'px' } },
        andere.map((g) => React.createElement(Geraetblock, { key: g, kennung: g, t, palette })))
    ),

    // ── Die Daten. Der wichtigste Abschnitt der Seite. ─────────────────────
    React.createElement(Abschnitt, { title: t('install.daten.title'), palette },
      React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0' } }, t('install.daten.p1')),
      React.createElement('p', { style: { margin: '0 0 ' + space.md + 'px 0' } }, t('install.daten.p2')),
      React.createElement('button', {
        type: 'button',
        onClick: () => onNavigate('export'),
        style: {
          background: 'none', border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px',
          padding: space.xs + 'px ' + space.md + 'px', fontSize: text.sm,
          color: palette.sageDeep, cursor: 'pointer', fontFamily: 'inherit',
        },
      }, t('install.daten.cta'))
    ),

    // ── Was sich danach ändert — und was nicht ─────────────────────────────
    React.createElement(Abschnitt, { title: t('install.danach.title'), palette },
      React.createElement('ul', { style: { margin: 0, paddingInlineStart: '18px' } },
        (t('install.danach.items') || []).map((zeile, i) =>
          React.createElement('li', { key: i, style: { margin: '0 0 ' + space.sm + 'px 0' } }, zeile))
      )
    )
  );
};

export default InstallGuide;
