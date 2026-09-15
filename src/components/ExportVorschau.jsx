import React, { useEffect, useId, useRef } from 'react';
import { PrimaryButton } from './PrimaryButton.jsx';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { leiteKategorienAb } from '../exportVorschau.js';

// ─── Export-Vorschau (Bau-Liste K3, IDEEN §13) ─────────────────────────────
// Ruhiger Zwischenschritt vor Export, Dossier und Brief: zeigt in Worten, welche
// Kategorien in der Datei stehen werden, und ob sie verschlüsselt ist. Zwei Wege:
// fortfahren oder zurück. Kein Warnrot, keine Ausrufezeichen, kein Countdown.
//
// Liegt NICHT im Hauptbundle: importiert wird die Vorschau nur aus Ansichten, die
// ihrerseits per React.lazy geladen werden (ZipExport, Lebensmappe, Notfall- und
// Behörden-Dossier, Briefvorlagen). Statisch statt eigenem lazy(): so kann das
// Nachladen nie scheitern, wenn die Ansicht selbst schon geladen ist (offline).

// Die Sicherung nimmt Termine, Kontakte und Merkliste mit — dieselben Schlüssel wie
// backupCrypto.collectBackupData. Nur Anzahlen, keine Inhalte. Speicher kann fehlen
// (privates Fenster) → dann 0, die Vorschau bleibt benutzbar.
function gespeicherteAnzahl(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v.length : 0;
  } catch {
    return 0;
  }
}

export const ExportVorschau = ({ palette, t, art, quelle, onWeiter, onZurueck }) => {
  const titelId = useId();
  const titelRef = useRef(null);
  const ausloeser = useRef(null);

  // Fokus auf die Überschrift: Screenreader lesen den neuen Schritt vor, Tastatur
  // landet dort, wo es weitergeht. Der Knopf, der die Vorschau geöffnet hat, wird
  // gemerkt — «Zurück» bringt den Fokus dorthin statt ins Leere.
  useEffect(() => {
    if (typeof document !== 'undefined') ausloeser.current = document.activeElement;
    titelRef.current?.focus();
  }, [art]);

  const zurueck = () => {
    const el = ausloeser.current;
    if (onZurueck) onZurueck();
    if (el && typeof el.focus === 'function' && el !== document.body) el.focus();
  };

  const istSicherung = art === 'sicherung' || art === 'sicherungVerschluesselt';
  const q = istSicherung
    ? {
        reminders: gespeicherteAnzahl('or5_reminders'),
        contacts: gespeicherteAnzahl('or5_contacts'),
        merkliste: gespeicherteAnzahl('or5_merkliste'),
        ...quelle,
      }
    : (quelle || {});
  const { form, verschluesselt, kategorien } = leiteKategorienAb(art, q);
  const druck = form === 'druck';

  const label = (k) => {
    if (k.id === 'kapitel') return t('chapters.' + k.chapter + '.title');
    if (k.id === 'abschnitt') return k.label;
    return t('zipExport.vorschau.kat.' + k.id, { count: k.count });
  };

  const hinweisVerschluesselung = verschluesselt
    ? t('zipExport.vorschau.verschluesselt')
    : t(druck ? 'zipExport.vorschau.offenDruck' : 'zipExport.vorschau.offen');

  return React.createElement('section', {
    'aria-labelledby': titelId,
    style: {
      marginTop: space.md, padding: '16px', background: palette.surface,
      border: '1px solid ' + palette.border, borderRadius: radius.sm, color: palette.text,
    },
  },
    React.createElement('h3', {
      id: titelId, ref: titelRef, tabIndex: -1,
      style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px', outline: 'none' },
    }, t(druck ? 'zipExport.vorschau.titelDruck' : 'zipExport.vorschau.titelDatei')),

    React.createElement('p', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, margin: '0 0 ' + space.sm + 'px' },
    }, t(druck ? 'zipExport.vorschau.introDruck' : 'zipExport.vorschau.introDatei')),

    kategorien.length > 0
      ? React.createElement('ul', {
          style: { margin: '0 0 ' + space.sm + 'px', paddingLeft: '1.15em', display: 'flex', flexDirection: 'column', gap: '6px' },
        },
          kategorien.map((k, i) => React.createElement('li', {
            key: k.id + (k.chapter || '') + i,
            style: { fontSize: text.sm, color: palette.text, lineHeight: leading.normal },
          },
            label(k),
            k.detail && React.createElement('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, k.detail)
          ))
        )
      : React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.sm + 'px' },
        }, t('zipExport.vorschau.leer')),

    React.createElement('p', {
      style: {
        fontSize: text.sm, color: palette.mid, lineHeight: leading.normal,
        margin: '0 0 ' + space.md + 'px', padding: '8px 12px', background: palette.up, borderRadius: radius.sm,
      },
    }, hinweisVerschluesselung),

    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm } },
      React.createElement('button', {
        type: 'button', onClick: zurueck,
        style: {
          padding: '10px 16px', background: palette.up, color: palette.text,
          border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
        },
      }, t('zipExport.vorschau.zurueck')),
      React.createElement(PrimaryButton, { palette, onClick: onWeiter },
        t(druck ? 'zipExport.vorschau.weiterDruck' : 'zipExport.vorschau.weiterDatei'))
    )
  );
};

export default ExportVorschau;
