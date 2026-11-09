import React, { useState, useEffect, useRef, Suspense } from 'react';
import { LIGHT_PALETTE } from './config/constants.js';
import { useT } from './i18n/index.js';
import { TrustLockIcon } from './components/TrustLockIcon.jsx';
import { text, weight, radius , leading , space } from './config/tokens.js';
import { PrimaryButton, knopfStil, linkStil } from './components/PrimaryButton.jsx';
import { MarkenLogo } from './components/MarkenLogo.jsx';
// Dieselbe Landschaft wie auf der Übersicht (BergLandschaft) — kein zweites Bild.
import landschaft from './assets/berge/landschaft.webp?url';

const LegalView = React.lazy(() => import('./LegalView.jsx'));

// Der Beta-Code liegt nur als SHA-256-Hash vor — der Klartext steht so weder im
// Quellcode noch im gebauten Bundle (Public-Repo). Ehrlich: das bleibt ein WEICHES
// Gate (client-seitig, per localStorage or5_beta_access umgehbar) — ein echtes
// Zugangs-Gate braucht den Server (Login-/Backend-Grundsatzentscheid).
const BETA_CODE_HASH = 'bc0d786f0beb06f7442b099a677ee08642acec8050aa56abd7a19711095f15b9';
const STORAGE_KEY = 'or5_beta_access';
const ERKLAERSEITEN = [
  ['/was-steht-mir-zu/', 'Was steht mir zu?'],
  ['/praemienverbilligung/', 'Prämienverbilligung'],
  // Seit 06.11.2026 (Verbesserungen D2): indexiert, stand aber hier nicht.
  ['/krankenkasse/', 'Krankenkasse'],
  ['/sozialhilfe/', 'Sozialhilfe'],
  ['/steuern/', 'Steuern'],
];
// Seiten über alle Themen, im Organigramm oben «Die Schweiz verstehen» (Entscheid 07.11.2026,
// docs/design/seiten-architektur-2026-11.md). Kantonsatlas seit 07.11.2026 auf main (#741), Nachtrag zu #743.
const SCHWEIZ_VERSTEHEN = [
  ['/politsystem/', 'Wie die Schweiz entscheidet'],
  ['/kantone-im-vergleich/', 'Kantone im Vergleich'],
  ['/kantonsatlas/', 'Kantonsatlas'],
];
// Gemeinsame Form der zwei ruhigen Knöpfe unter «Öffnen» (Demo · Einfache Ansicht).
const ruhigerKnopf = {
  marginTop: space.md, width: '100%', padding: '12px', borderRadius: radius.md,
  cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium,
};

async function matchesBetaCode(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    return hex === BETA_CODE_HASH;
  } catch {
    return false; // kein Web-Crypto (unsicherer Kontext) → Gate bleibt zu
  }
}

export const BetaGate = ({ children }) => {
  const { t, lang } = useT();
  const [granted, setGranted] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  // Rechtliches muss auch OHNE Code lesbar sein (Vertrauen/Transparenz vor der Hürde).
  const [legalSection, setLegalSection] = useState(null); // null | 'privacy' | 'imprint' | …
  // „Einfache Ansicht" schon hier anbieten, damit Betroffene direkt im Icon-Modus
  // starten. Schreibt nur localStorage; die App liest den Wert beim Start.
  const [simpleView, setSimpleView] = useState(() => {
    try { return localStorage.getItem('or5_simpleView') === '1'; } catch { return false; }
  });
  const toggleSimpleView = () => setSimpleView(v => {
    const next = !v;
    try { localStorage.setItem('or5_simpleView', next ? '1' : '0'); if (next) localStorage.setItem('or5_vorlesen', '1'); } catch {}
    return next;
  });
  // K7 · Demo am Einstieg: die App mit dem Beispiel-Datensatz, ohne Code. Schirm und
  // Daten kommen lazy; der Schirm steht, BEVOR die App rendert. Verlassen lädt die
  // Seite neu: Schirm, Überlagerung und Demo-Zustand verfallen mit dem Arbeitsspeicher,
  // zurück bleibt die Code-Wand. or5_beta_access bleibt unberührt.
  const [demo, setDemo] = useState(null); // null | 'laedt' | { data, onLeave }
  // Fokus ins Codefeld, ohne zu scrollen: `autoFocus` schob auf dem Handy Logo und
  // Landschaft aus dem Bild. Nur mit Maus/Trackpad — auf Touch-Geräten öffnete der
  // Sofort-Fokus die Tastatur, bevor man den Eingang überhaupt gesehen hatte.
  const codeFeld = useRef(null);
  useEffect(() => {
    try {
      if (codeFeld.current && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        codeFeld.current.focus({ preventScroll: true });
      }
    } catch { /* ohne matchMedia: kein Fokus, kein Schaden */ }
  }, [legalSection]);
  const startDemo = () => {
    setDemo('laedt');
    import('./demo/demoSpeicher.js')
      .then((s) => { s.speicherAbschirmen(); setDemo({ data: s.DEMO_DATA, onLeave: s.demoVerlassen }); })
      .catch(() => setDemo(null)); // Ladefehler (z. B. offline): Knopf wieder frei
  };

  if (granted) return children;
  if (demo?.data) return React.cloneElement(children, { demo });

  const palette = LIGHT_PALETTE;

  // Rechtliche Ansicht ohne Zugangscode — LegalView mit eigener Tab-Navigation.
  if (legalSection) {
    return React.createElement('div', {
      role: 'main', 'aria-label': 'Maloja Plana',
      style: { minHeight: '100vh', background: palette.bg, padding: space.lg + 'px ' + space.md + 'px' }
    },
      React.createElement(Suspense, { fallback: React.createElement('div', { style: { textAlign: 'center', color: palette.mid, padding: space.xl + 'px' } }, t('common.loading')) },
        React.createElement(LegalView, {
          palette, t, lang, section: legalSection,
          // 'dashboard' (Zurück) → zur Code-Wand; 'legal' + key → Tab wechseln.
          onNavigate: (view, _idx, key) => setLegalSection(view === 'legal' && key ? key : null),
        })
      )
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await matchesBetaCode(input)) {
      // Storage kann im Privat-Modus werfen — die Entsperrung darf nicht daran hängen.
      try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignoriert */ }
      setGranted(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  // Eingang als Ort (Vorbild Stardust, 23.10.2026): zuerst die Landschaft, darin das
  // Formular. Texte unverändert — nur Anordnung und Gewicht sind neu. Das Layout für
  // Handy, Tablet und Desktop steht in tokens.css (.mp-tor*), weil es Media-Queries braucht.
  // Der Leitsatz in zwei Zeilen wie auf der Übersicht; ohne Satzgrenze bleibt er eine Zeile.
  const leitsatz = String(t('dashboard.welcome'));
  const satzGrenze = leitsatz.search(/[.!?]\s/);
  const [zeile1, zeile2] = satzGrenze > 0
    ? [leitsatz.slice(0, satzGrenze + 1), leitsatz.slice(satzGrenze + 2)]
    : [leitsatz, ''];

  return React.createElement('div', {
    role: 'main',
    'aria-label': 'Maloja Plana',
    className: 'mp-tor',
    style: {
      '--mp-tor-bg': palette.bg, '--mp-tor-flaeche': palette.surface, '--mp-tor-rand': palette.border,
      '--mp-tor-text': palette.text, '--mp-tor-akzent': palette.sageDeep, fontFamily: 'inherit',
    }
  },
    React.createElement('div', { className: 'mp-tor-bild', 'aria-hidden': 'true', style: { backgroundImage: 'url(' + landschaft + ')' } }),
    React.createElement('div', { className: 'mp-tor-kopf' },
      React.createElement('h1', { 'aria-label': 'Maloja Plana' },
        // Der Name steckt als versteckter Text im Logo: Screenreader UND Text-Extraktion
        // (Suchmaschine, KI-Crawler) lesen «Maloja Plana» (Wächter: markennameImTitel.test.js).
        // Anthrazit, weil es auf dem hellen Himmel steht (Farbe nach Fläche, MarkenLogo.jsx).
        React.createElement(MarkenLogo, { palette, breite: 180 })
      )
    ),
    React.createElement('form', {
      onSubmit: handleSubmit,
      className: 'mp-tor-inhalt',
    },
      React.createElement('p', { className: 'mp-tor-titel' },
        zeile1, zeile2 && React.createElement('span', null, zeile2)
      ),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px', lineHeight: leading.normal }
      }, t('beta.intro')),
      // Das Versprechen als Hauptsache, nicht als graues Kästchen.
      React.createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: space.ms + 'px',
          padding: space.md + 'px 0', margin: '0 0 ' + space.md + 'px',
          borderTop: '1px solid ' + palette.border, borderBottom: '1px solid ' + palette.border,
        }
      },
        React.createElement('span', {
          'aria-hidden': 'true',
          style: { flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: palette.sage + '1A', display: 'grid', placeItems: 'center' }
        }, React.createElement(TrustLockIcon, { size: 16, color: palette.sageDeep })),
        React.createElement('span', {
          style: { fontSize: text.body, fontWeight: weight.medium, color: palette.text, lineHeight: 1.35 }
        }, t('trust.localBadge'))
      ),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.sm + 'px', lineHeight: leading.normal }
      }, t('beta.gateMessage')),
      React.createElement('input', {
        type: 'text',
        value: input,
        onChange: (e) => { setInput(e.target.value); setError(false); },
        placeholder: t('beta.codePlaceholder'), 'aria-label': t('beta.codePlaceholder'),
        ref: codeFeld,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? 'beta-error' : undefined,
        style: {
          width: '100%', padding: '12px 16px', fontSize: text.body,
          border: '1px solid ' + (error ? palette.rose : palette.feldrand),
          borderRadius: radius.md, background: palette.up, color: palette.text,
          outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        }
      }),
      error && React.createElement('p', {
        id: 'beta-error',
        role: 'alert',
        style: { fontSize: text.sm, color: palette.roseDeep, marginTop: space.sm }
      }, t('beta.codeWrong')),
      React.createElement(PrimaryButton, {
        palette, type: 'submit',
        style: { marginTop: space.md, width: '100%', padding: '12px', fontSize: text.body },
      }, t('beta.enter')),
      // K7 · der ruhige zweite Weg: Beispiel ansehen, ohne Code (nichts wird gespeichert).
      React.createElement('button', {
        type: 'button', onClick: startDemo, disabled: !!demo,
        // Der zweite Weg: Nebenknopf (Fassung 9).
        style: { ...knopfStil(palette, 'neben'), ...ruhigerKnopf },
      }, t('beta.demoEnter')),
      // „Einfache Ansicht"-Umschalter (Icon-Modus + Vorlesen) — direkt am Einstieg.
      React.createElement('button', {
        type: 'button',
        onClick: toggleSimpleView,
        'aria-pressed': simpleView,
        title: t('common.simpleView'),
        style: {
          ...ruhigerKnopf,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: simpleView ? palette.sand + '30' : 'transparent',
          color: simpleView ? palette.text : palette.mid,
          border: '1px solid ' + (simpleView ? palette.sand : palette.border),
        }
      },
        React.createElement('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round', 'aria-hidden': 'true' },
          React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
        ),
        t('common.simpleView')
      ),
      // Fusszeile zentriert wie bisher; Titel und Formular stehen linksbündig.
      React.createElement('div', { style: { textAlign: 'center' } },
      // Die öffentlichen Erklärseiten: echte Links, denn die Code-Wand ist das, was Google
      // nach dem Rendern von der Startseite sieht. Bis 01.11.2026 führte von hier kein Weg
      // dorthin (Search Console: «Gefunden – zurzeit nicht indexiert»). Deutsch in jeder
      // Sprache, weil fr/it/en/rm noch nicht freigegeben sind (ERKLAERSEITEN, Wächter: kernTextOhneJs.test.js).
      [['Erklärseiten', ERKLAERSEITEN, space.md], ['Die Schweiz verstehen', SCHWEIZ_VERSTEHEN, 0]].map(([titel, liste, oben], i) =>
        React.createElement('nav', { key: titel, 'aria-label': titel, lang: 'de', style: { marginTop: oben } },
          // Die zweite Zeile nennt ihren Namen sichtbar, damit sie nicht wie eine Fortsetzung der ersten wirkt.
          i > 0 && React.createElement('span', { style: { color: palette.mid, fontSize: text.xs, padding: '0 8px' } }, `${titel}:`),
          liste.map(([pfad, name]) => React.createElement('a', {
            key: pfad, href: pfad,
            style: {
              display: 'inline-block', minHeight: '44px', lineHeight: '44px', padding: '0 8px',
              color: palette.mid, fontSize: text.xs, fontFamily: 'inherit',
              textDecoration: 'underline', textUnderlineOffset: '2px',
            }
          }, name))
        )
      ),
      React.createElement('button', {
        type: 'button',
        onClick: () => setLegalSection('privacy'),
        style: { ...linkStil(palette), marginTop: space.md, fontSize: text.xs, padding: '4px' }
      }, t('beta.legalLink')),
      // Melde-Weg VOR dem Gate. Bis 23.09.2026 führte von hier aus nur der
      // Rechtliches-Link zur Adresse im Impressum — wer ohne Code kam und einen Fehler
      // sah, hatte keinen benannten Weg. Bewusst derselbe Schlüssel wie im Fehlerschirm
      // (`error.report`): eine Zusage, ein Wortlaut. Kein Formular (Datenabfluss,
      // widerspricht local-first / CSP self-only) — ein Entwurf im Mailprogramm.
      React.createElement('a', {
        href: 'mailto:info@malojaplana.ch?subject=' + encodeURIComponent('Maloja Plana: ' + t('error.report'))
          + '&body=' + encodeURIComponent('\n\n\n— — —\nAnsicht: Code-Wand'),
        style: {
          display: 'inline-block', minHeight: '44px', lineHeight: '44px',
          marginTop: space.xs, padding: '0 4px',
          color: palette.mid, fontSize: text.xs, fontFamily: 'inherit',
          textDecoration: 'underline', textUnderlineOffset: '2px',
        }
      }, t('error.report')),
      React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: space.sm }
      }, 'Stebler Studios · Basel')
      )
    )
  );
};

export default BetaGate;
