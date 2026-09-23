import React, { useState, useRef, useEffect } from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { getNotfallDossierPreview } from './dossierGenerator.js';
import { notfallpassFelder, inZwischenablage } from './utils/notfallpass.js';
import { ExternerLink } from './components/ExternerLink.jsx';
import { hinweisZeichen, zurueckZeichen } from './IconSystem.jsx';

// Notfallpass vorbereiten — der zweite Ausgang der Notfall-Pflege (Entscheid 22.09.2026).
// Der QR im Notfall-Dossier geht aufs Papier; dieses Blatt legt dieselben Angaben so bereit,
// dass sie Feld für Feld in den Notfallpass des Telefons übertragen werden können. Das
// Telefon zeigt ihn auf dem Sperrbildschirm — ohne Entsperren.
//
// Nichts verlässt das Gerät: kein QR, kein Server, keine Schnittstelle. Kopiert wird nur auf
// Knopfdruck in die Zwischenablage. Die Werte kommen aus getNotfallDossierPreview(), wie beim
// QR; die Zuordnung zu den Feldern des Notfallpasses steht in utils/notfallpass.js.

export const NotfallpassBlatt = ({ palette, t, data, chapters, onNavigate }) => {
  const preview = getNotfallDossierPreview(data || {}, chapters || [], t);
  const gruppen = notfallpassFelder(preview.sections);
  const etwasErfasst = gruppen.some(g => g.felder.some(f => f.wert));
  const notfallIdx = chapters ? chapters.findIndex(ch => ch.key === 'notfall') : -1;

  // Ansage für Screenreader und ruhige Bestätigung am Knopf. `kopiert` = key des Felds.
  const [meldung, setMeldung] = useState('');
  const [kopiert, setKopiert] = useState(null);
  const zeitRef = useRef(null);
  useEffect(() => () => clearTimeout(zeitRef.current), []);

  const kopieren = async (feld, label) => {
    const ok = await inZwischenablage(feld.wert);
    clearTimeout(zeitRef.current);
    setKopiert(ok ? feld.key : null);
    setMeldung(ok ? t('notfallpass.kopiert', { feld: label }) : t('notfallpass.kopierenFehler'));
    zeitRef.current = setTimeout(() => setKopiert(null), 2500);
  };

  const s = {
    ...ablaufStyles(palette),
    hinweis: {
      padding: '10px 14px', marginBottom: space.md + 'px', background: palette.up,
      borderRadius: radius.sm, fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed,
    },
    gruppe: { marginTop: space.md + 'px' },
    gruppeTitel: { fontSize: text.xs, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 ' + space.xs + 'px 0', fontWeight: weight.medium },
    liste: { listStyle: 'none', margin: 0, padding: 0, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface },
    zeile: { display: 'flex', alignItems: 'flex-start', gap: space.sm + 'px', padding: '10px 14px' },
    zeileLinie: { borderTop: '1px solid ' + palette.border },
    feldText: { flex: 1, minWidth: 0 },
    label: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' },
    wert: { fontSize: text.body, color: palette.text, fontWeight: weight.medium, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', userSelect: 'text' },
    offen: { fontSize: text.sm, color: palette.mid, fontStyle: 'italic' },
    knopf: {
      flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', background: 'none',
      border: '1px solid ' + palette.border, borderRadius: radius.sm, minHeight: '36px',
      padding: '6px 12px', fontSize: text.sm, color: palette.text,
    },
    knopfOk: { color: palette.sageDeep || palette.text },
    schritte: { margin: space.sm + 'px 0 0 0', paddingLeft: '20px' },
    schritt: { marginBottom: space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed },
    link: { display: 'inline-block', marginTop: space.sm + 'px', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit' },
    zurueck: {
      background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm,
      padding: 0, marginBottom: space.md + 'px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs + 'px',
    },
  };

  const feldZeile = (feld, i) => {
    const label = t('notfallpass.feld_' + feld.key);
    return React.createElement('li', { key: feld.key, style: i > 0 ? { ...s.zeile, ...s.zeileLinie } : s.zeile },
      React.createElement('div', { style: s.feldText },
        React.createElement('div', { style: s.label }, label),
        feld.wert
          ? React.createElement('div', { style: s.wert }, feld.wert)
          : React.createElement('div', { style: s.offen }, t('notfallpass.nichtErfasst'))
      ),
      feld.wert && React.createElement('button', {
        type: 'button',
        onClick: () => kopieren(feld, label),
        'aria-label': t('notfallpass.kopierenAria', { feld: label }),
        style: kopiert === feld.key ? { ...s.knopf, ...s.knopfOk } : s.knopf,
      }, kopiert === feld.key ? t('notfallpass.kopiertKurz') : t('notfallpass.kopieren'))
    );
  };

  const schritte = (keys) => React.createElement('ol', { style: s.schritte },
    keys.map(k => React.createElement('li', { key: k, style: s.schritt }, t(k)))
  );

  return React.createElement(AblaufContainer, {
    palette, icon: 'notfall',
    title: t('notfallpass.title'),
    intro: t('notfallpass.intro'),
  },
    onNavigate && React.createElement('button', { type: 'button', onClick: () => onNavigate('notfalleinstieg'), style: s.zurueck },
      zurueckZeichen(), t('notfallpass.zurueck')),

    // Datenschutz zuerst: wer hier einträgt, soll wissen, wer es lesen kann.
    React.createElement('div', { style: s.hinweis }, hinweisZeichen('lock'), t('notfallpass.datenschutz')),

    // Die Angaben, Feld für Feld
    React.createElement(AblaufStep, { palette, title: t('notfallpass.angabenTitel') },
      React.createElement('p', { style: s.stepText }, etwasErfasst ? t('notfallpass.angabenText') : t('notfallpass.leer')),
      !etwasErfasst && onNavigate && notfallIdx >= 0 && React.createElement(AblaufLink, {
        palette, label: t('notfallpass.leerLink'), onClick: () => onNavigate('chapter', notfallIdx),
      }),
      gruppen.map(g => React.createElement('div', { key: g.key, style: s.gruppe },
        React.createElement('h3', { style: s.gruppeTitel }, t('notfallpass.gruppe_' + g.key)),
        g.key === 'profil' && React.createElement('p', { style: { ...s.stepText, margin: '0 0 ' + space.xs + 'px 0' } }, t('notfallpass.profilHinweis')),
        React.createElement('ul', { style: s.liste }, g.felder.map(feldZeile))
      )),
      // Live-Region: die Bestätigung entsteht erst nach dem Klick.
      React.createElement('p', { role: 'status', 'aria-live': 'polite', style: { ...s.note, minHeight: '1.4em' } }, meldung)
    ),

    // iPhone — belegt an Apples Hilfe (de-ch, gelesen 23.09.2026)
    React.createElement(AblaufStep, { palette, title: t('notfallpass.iphoneTitel') },
      schritte(['notfallpass.iphone1', 'notfallpass.iphone2', 'notfallpass.iphone3', 'notfallpass.iphone4']),
      React.createElement('p', { style: s.note }, t('notfallpass.iphoneSperr')),
      React.createElement('p', { style: s.note }, t('notfallpass.iphoneNotruf')),
      React.createElement(ExternerLink, { t, href: t('notfallpass.iphoneUrl'), style: s.link }, t('notfallpass.iphoneLink'))
    ),

    // Android — belegt an Googles Android-Hilfe (gelesen 23.09.2026)
    React.createElement(AblaufStep, { palette, title: t('notfallpass.androidTitel') },
      React.createElement('p', { style: s.stepText }, t('notfallpass.androidText')),
      schritte(['notfallpass.android1', 'notfallpass.android2', 'notfallpass.android3', 'notfallpass.android4']),
      React.createElement(ExternerLink, { t, href: t('notfallpass.androidUrl'), style: s.link }, t('notfallpass.androidLink'))
    ),

    onNavigate && React.createElement(AblaufLink, { palette, label: t('notfallpass.dossierLink'), onClick: () => onNavigate('notfalldossier') }),

    React.createElement(AblaufFooter, { palette, notes: [t('notfallpass.fussNichtsUebertragen'), t('trust.localOnly')] })
  );
};

export default NotfallpassBlatt;
