import React, { useState, useRef } from 'react';
import { Eyebrow } from './Heading.jsx';
import { text, weight, radius, space, shadow } from '../config/tokens.js';
import { alleDatenLoeschen } from '../utils/datenLoeschen.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';

// ─── E18 · Löschweg «Alle Daten auf diesem Gerät löschen» ─────────────────────
// Ruhig und auffindbar unter Einstellungen → Daten & Sicherung. Ablauf:
//   1. Erklärung, was gelöscht wird + Angebot «zuerst sichern» (führt zur bestehenden
//      Sicherung, nichts Neues).
//   2. Bestätigung: «Ich habe verstanden» ankreuzen, dann ein zweiter Knopf.
//   3. Löschen (utils/datenLoeschen.js), danach sauberer Neustart ohne Ansicht im Pfad.
//      Andere offene Maloja-Tabs werden benachrichtigt (R4); der Dialog bittet trotzdem,
//      sie vorher zu schliessen.
// Im Beispiel ist der Knopf ausgeschaltet — dort ist nichts Eigenes zu löschen (B-3).
// Kein Wort-Eintippen: Umlaute und Tastaturen machen das zur Hürde; zwei bewusste
// Handlungen tragen die Absicherung.

export const DatenLoeschen = ({ palette, t, demoMode, onExport }) => {
  const [offen, setOffen] = useState(false);
  const [schritt, setSchritt] = useState(1);
  const [verstanden, setVerstanden] = useState(false);
  const [status, setStatus] = useState(null); // null | 'laeuft' | 'fehler'
  const karte = useRef(null);

  const schliessen = () => {
    if (status === 'laeuft') return;
    setOffen(false); setSchritt(1); setVerstanden(false); setStatus(null);
  };

  // Fokus, Tab-Kreis, Escape und die Rückkehr auf den Auslöser: der gemeinsame
  // Baustein (O17). `schritt`/`status` richten neu aus, weil der Dialog bei jedem
  // Schritt seine Überschrift austauscht — der alte Fokus-Knoten ist dann weg.
  // Während des Löschens fängt `schliessen()` das Escape selbst ab.
  useFocusTrap(offen, { ref: karte, onEscape: schliessen, neuAusrichten: [schritt, status] });

  const loeschen = async () => {
    setStatus('laeuft');
    const r = await alleDatenLoeschen({ demo: demoMode });
    if (!r.geloescht) { setStatus(null); return; }
    if (r.fehler.length) { setStatus('fehler'); return; }
    neuStarten();
  };
  const neuStarten = () => { try { location.replace(location.pathname + location.search); } catch { location.reload(); } };

  let letzteSicherung = null;
  try {
    const roh = localStorage.getItem('or5_lastBackup');
    if (roh) letzteSicherung = new Date(roh).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { /* Speicher gesperrt — dann eben ohne Datum */ }

  const knopf = (extra) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '9px 14px', borderRadius: radius.sm, cursor: 'pointer',
    fontSize: text.sm, fontFamily: 'inherit', background: 'transparent',
    color: palette.text, border: '1px solid ' + palette.border, ...extra,
  });
  const ernst = palette.roseDeep || palette.rose;
  const p = (inhalt, extra) => React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px 0', fontSize: text.sm, color: palette.mid, lineHeight: 1.55, ...extra } }, inhalt);
  const zeile = { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: space.lg + 'px' };

  const inhalt = () => {
    if (status === 'laeuft') {
      return p(t('datenLoeschen.laeuft'), { color: palette.text });
    }
    if (status === 'fehler') {
      return React.createElement(React.Fragment, null,
        p(t('datenLoeschen.fehler'), { color: palette.text }),
        React.createElement('div', { style: zeile },
          React.createElement('button', { type: 'button', onClick: neuStarten, style: knopf() }, t('datenLoeschen.neuStarten'))
        )
      );
    }
    if (schritt === 1) {
      return React.createElement(React.Fragment, null,
        p(t('datenLoeschen.intro')),
        React.createElement('ul', { style: { margin: '0 0 ' + space.sm + 'px 0', paddingInlineStart: '20px', fontSize: text.sm, color: palette.text, lineHeight: 1.6 } },
          React.createElement('li', null, t('datenLoeschen.wasAngaben')),
          React.createElement('li', null, t('datenLoeschen.wasDokumente')),
          React.createElement('li', null, t('datenLoeschen.wasEinstellungen'))
        ),
        p(t('datenLoeschen.bleibt')),
        React.createElement('div', { style: { marginTop: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px', background: palette.up, borderRadius: radius.sm } },
          p(letzteSicherung ? t('datenLoeschen.letzteSicherung', { datum: letzteSicherung }) : t('datenLoeschen.keineSicherung'), { color: palette.text }),
          onExport && React.createElement('button', {
            type: 'button', onClick: () => { setOffen(false); onExport(); },
            style: knopf({ borderColor: palette.sage, color: palette.text }),
          }, t('datenLoeschen.zuerstSichern'))
        ),
        React.createElement('div', { style: zeile },
          React.createElement('button', { type: 'button', onClick: schliessen, style: knopf() }, t('datenLoeschen.abbrechen')),
          React.createElement('button', { type: 'button', onClick: () => setSchritt(2), style: knopf({ color: ernst, borderColor: ernst }) }, t('datenLoeschen.weiter'))
        )
      );
    }
    return React.createElement(React.Fragment, null,
      p(t('datenLoeschen.endgueltig'), { color: palette.text }),
      p(t('datenLoeschen.andereFenster')),
      // Die ganze Zeile ist Tippfläche, mind. 44 px hoch — vor dem unumkehrbaren Schritt (Predeploy 16.09.).
      React.createElement('label', { style: { display: 'flex', gap: space.sm + 'px', alignItems: 'flex-start', fontSize: text.sm, color: palette.text, cursor: 'pointer', marginTop: space.sm + 'px', minHeight: '44px', padding: '8px 0', boxSizing: 'border-box' } },
        React.createElement('input', { type: 'checkbox', checked: verstanden, onChange: (e) => setVerstanden(e.target.checked), style: { marginTop: '3px', width: '18px', height: '18px', flexShrink: 0 } }),
        t('datenLoeschen.verstanden')
      ),
      React.createElement('div', { style: zeile },
        React.createElement('button', { type: 'button', onClick: () => { setSchritt(1); setVerstanden(false); }, style: knopf() }, t('datenLoeschen.zurueck')),
        React.createElement('button', {
          type: 'button', onClick: loeschen, disabled: !verstanden,
          // Weiss auf roseBtn: 6.65:1 (AA), modus-invariant (config/constants.js).
          style: knopf({ background: verstanden ? (palette.roseBtn || ernst) : 'transparent', color: verstanden ? '#FFFFFF' : palette.soft, borderColor: verstanden ? (palette.roseBtn || ernst) : palette.border, fontWeight: weight.semi, cursor: verstanden ? 'pointer' : 'not-allowed' }),
        }, t('datenLoeschen.jetztLoeschen'))
      )
    );
  };

  return React.createElement('section', {
    style: { background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md, padding: space.lg + 'px', marginTop: space.md + 'px' },
  },
    React.createElement(Eyebrow, { palette, style: { color: palette.mid, margin: '0 0 ' + space.xs + 'px 0' } }, t('datenLoeschen.bereich')),
    p(t(demoMode ? 'datenLoeschen.beispielAus' : 'datenLoeschen.kurz')),
    React.createElement('button', {
      type: 'button', disabled: demoMode, onClick: () => setOffen(true),
      'aria-haspopup': 'dialog',
      style: knopf({ color: demoMode ? palette.soft : ernst, cursor: demoMode ? 'not-allowed' : 'pointer' }),
    }, t('datenLoeschen.titel')),

    offen && React.createElement('div', {
      style: { position: 'fixed', inset: 0, background: 'rgba(20,24,28,0.55)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: space.md + 'px' },
      onClick: schliessen,
    },
      React.createElement('div', {
        ref: karte, role: 'dialog', 'aria-modal': 'true',
        'aria-labelledby': 'daten-loeschen-titel',
        onClick: (e) => e.stopPropagation(),
        style: { background: palette.surface, color: palette.text, borderRadius: radius.md, boxShadow: shadow.lg, padding: space.lg + 'px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' },
      },
        React.createElement('h2', {
          id: 'daten-loeschen-titel', tabIndex: -1, 'data-dialog-titel': '',
          style: { margin: '0 0 ' + space.md + 'px 0', fontSize: text.lg, fontWeight: weight.semi, color: palette.text, outline: 'none' },
        }, t(schritt === 2 && !status ? 'datenLoeschen.titelBestaetigen' : 'datenLoeschen.titel')),
        React.createElement('div', { 'aria-live': 'polite' }, inhalt())
      )
    )
  );
};

export default DatenLoeschen;
