// ─── Eingang geteilter Dateien (Dokumentablage) ──────────────
// Zeigt Dateien, die über «Teilen …» an die installierte App kamen (public/sw.js legt sie
// in einen Cache auf diesem Gerät, src/utils/teilenEmpfang.js liest sie). Jede Datei wartet,
// bis die Person Bereich, Art und Ablaufdatum wählt und «Ablegen» drückt — oder «Verwerfen».
// Kein automatisches Einordnen (PLATFORM_CONTEXT: keine versteckte Automatik).
// Drei Zustände: lädt (nichts zu sehen), leer (nichts zu sehen), Fehler (ruhige Meldung).
import React, { useEffect, useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { hinweisZeichen } from '../IconSystem.jsx';
import { knopfStil } from './PrimaryButton.jsx';
import {
  geteilteDateienLesen, geteilteDateiEntfernen, blobAlsDataUrl, alsDokument, groesseText, MAX_GETEILT_BYTES,
} from '../utils/teilenEmpfang.js';

const Eintrag = ({ palette, t, datei, chapters, onAblegen, onFertig }) => {
  const [bereich, setBereich] = useState('');
  const [art, setArt] = useState('');
  const [ablauf, setAblauf] = useState('');
  const [fehler, setFehler] = useState('');
  const [arbeitet, setArbeitet] = useState(false);
  const kapitel = chapters.find((c) => c.key === bereich);
  const idTeil = datei.schluessel.replace(/[^a-z0-9]/gi, '').slice(-16);
  const bereit = bereich && art && ablauf && !arbeitet;

  const feld = {
    width: '100%', padding: '0 ' + space.sm + 'px', minHeight: '44px', borderRadius: radius.md,
    border: '1px solid ' + palette.feldrand, background: palette.surface,
    color: palette.text, boxSizing: 'border-box', fontSize: text.sm, font: 'inherit',
  };
  const beschriftung = { display: 'block', fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px' };

  const ablegen = async () => {
    if (!bereit) return;
    if (datei.groesse > MAX_GETEILT_BYTES) { setFehler(t('chapterView.fileTooLarge', { max: '20 MB' })); return; }
    setArbeitet(true); setFehler('');
    try {
      const data = await blobAlsDataUrl(datei.blob);
      await onAblegen(alsDokument({ datei, bereich, art, ablauf, data }));
      await geteilteDateiEntfernen(datei.schluessel);
      onFertig(datei.schluessel, 'abgelegt');
    } catch (e) {
      setFehler(t('chapterView.uploadError') + ': ' + (e?.message || datei.name));
      setArbeitet(false);
    }
  };

  const verwerfen = async () => {
    setArbeitet(true); setFehler('');
    try {
      await geteilteDateiEntfernen(datei.schluessel);
      onFertig(datei.schluessel, 'verworfen');
    } catch (e) {
      setFehler(t('tresor.geteilt.fehler'));
      setArbeitet(false);
    }
  };

  return React.createElement('li', {
    'data-geteilt': datei.name,
    style: { listStyle: 'none', padding: space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.md, background: palette.surface, marginBottom: space.sm + 'px' },
  },
    React.createElement('p', { style: { margin: '0 0 ' + space.sm + 'px', color: palette.text, fontSize: text.sm, fontWeight: weight.medium, wordBreak: 'break-word' } },
      hinweisZeichen('document'), datei.name,
      React.createElement('span', { style: { color: palette.mid, fontWeight: weight.normal } }, ' · ' + groesseText(datei.groesse))),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: space.sm + 'px', marginBottom: space.sm + 'px' } },
      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'geteilt-bereich-' + idTeil, style: beschriftung }, t('tresor.geteilt.bereich')),
        React.createElement('select', {
          id: 'geteilt-bereich-' + idTeil, value: bereich, style: feld,
          onChange: (e) => { setBereich(e.target.value); setArt(''); },
        },
          React.createElement('option', { value: '' }, t('chapterView.selectOption')),
          chapters.map((c) => React.createElement('option', { key: c.key, value: c.key }, c.title)))),
      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'geteilt-art-' + idTeil, style: beschriftung }, t('chapterView.docType')),
        React.createElement('select', {
          id: 'geteilt-art-' + idTeil, value: art, disabled: !kapitel, style: feld,
          onChange: (e) => setArt(e.target.value),
        },
          React.createElement('option', { value: '' }, t('chapterView.selectOption')),
          (kapitel?.docs || []).map((d) => React.createElement('option', { key: d.k, value: d.k }, d.label)))),
      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'geteilt-ablauf-' + idTeil, style: beschriftung }, t('chapterView.expiryDate')),
        React.createElement('input', {
          id: 'geteilt-ablauf-' + idTeil, type: 'date', value: ablauf, style: feld,
          onChange: (e) => setAblauf(e.target.value),
        })),
    ),
    fehler && React.createElement('p', { role: 'alert', style: { margin: '0 0 ' + space.sm + 'px', color: palette.roseDeep, fontSize: text.sm } }, fehler),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm + 'px' } },
      React.createElement('button', { type: 'button', onClick: ablegen, disabled: !bereit, style: knopfStil(palette, 'haupt', { disabled: !bereit }) },
        t('tresor.geteilt.ablegen')),
      React.createElement('button', { type: 'button', onClick: verwerfen, disabled: arbeitet, style: knopfStil(palette, 'neben', { disabled: arbeitet }) },
        t('tresor.geteilt.verwerfen'))),
  );
};

// `laden` und `start` sind Nahtstellen für Tests (ohne DOM läuft kein useEffect).
export const GeteiltEingang = ({ palette, t, chapters, onAblegen, laden = geteilteDateienLesen, start = [] }) => {
  const [dateien, setDateien] = useState(start);
  const [ladeFehler, setLadeFehler] = useState(false);
  const [meldung, setMeldung] = useState('');

  useEffect(() => {
    let aktiv = true;
    laden()
      .then((liste) => { if (aktiv) setDateien(liste); })
      .catch(() => { if (aktiv) setLadeFehler(true); });
    return () => { aktiv = false; };
  }, [laden]);

  const fertig = (schluessel, wie) => {
    const datei = dateien.find((d) => d.schluessel === schluessel);
    setDateien((alt) => alt.filter((d) => d.schluessel !== schluessel));
    setMeldung(t(wie === 'abgelegt' ? 'tresor.geteilt.abgelegt' : 'tresor.geteilt.verworfenMeldung', { name: datei?.name || '' }));
  };

  // Die Status-Region steht immer da (Screenreader sagen sonst nichts an), füllt sich erst danach.
  const status = React.createElement('div', { role: 'status', style: { color: palette.sageDeep, fontSize: text.sm } },
    meldung && React.createElement('p', { style: { margin: '0 0 ' + space.md + 'px' } }, hinweisZeichen('check'), meldung));

  if (ladeFehler) {
    return React.createElement('p', { role: 'alert', 'data-geteilt-eingang': 'fehler', style: { color: palette.roseDeep, fontSize: text.sm, margin: '0 0 ' + space.md + 'px' } }, t('tresor.geteilt.fehler'));
  }
  if (!dateien.length) return status;

  return React.createElement('section', {
    'data-geteilt-eingang': 'offen', 'aria-labelledby': 'geteilt-titel',
    style: { margin: '0 0 ' + space.lg + 'px', padding: space.md + 'px', borderRadius: radius.lg, background: palette.up, border: '1px solid ' + palette.border },
  },
    status,
    React.createElement('h2', { id: 'geteilt-titel', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.body, fontWeight: weight.semi, color: palette.text } },
      t('tresor.geteilt.titel', { count: dateien.length })),
    React.createElement('p', { style: { margin: '0 0 ' + space.md + 'px', color: palette.mid, fontSize: text.sm } }, t('tresor.geteilt.satz')),
    React.createElement('ul', { style: { margin: 0, padding: 0 } },
      dateien.map((datei) => React.createElement(Eintrag, { key: datei.schluessel, palette, t, datei, chapters, onAblegen, onFertig: fertig }))),
  );
};

export default GeteiltEingang;
