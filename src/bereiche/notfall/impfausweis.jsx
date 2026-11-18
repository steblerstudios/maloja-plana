import React, { useState } from 'react';
import { text, weight, space, radius, leading } from '../../config/tokens.js';
import { knopfStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { PageTitle } from '../../components/Heading.jsx';
import { ExternerLink } from '../../components/ExternerLink.jsx';
import { RueckgaengigMeldung } from '../../components/RueckgaengigMeldung.jsx';
import { useRueckgaengig, wiederEinsetzen, nochEntfernt } from '../../hooks/useRueckgaengig.js';
import { Icon } from '../../IconSystem.jsx';
import { IMPF_ARTEN, IMPF_QUELLE_URL, impfungenListe, naechsteImpfung, impfungOhneAlter } from './rechnung.js';
import { monatJahr } from './zuhause.jsx';
import { gesundheitFarbe } from './bilder.jsx';

// Fach Impfausweis im Arztkoffer (Sophie 19.11.2026, Auswahl «A · Liste + fällig»: eintragen, nächste Auffrischung
// auf einem Kalenderblatt, kein Foto). Eine Frage: «Welche Impfung ist fällig?» → Kalenderblatt → Monat und Jahr →
// Satz. Das Kalenderblatt steht einmal auf dieser Seite. Gerechnet wird nur Starrkrampf/Diphtherie und FSME
// (rechnung.js, Schweizerischer Impfplan 2026); für alles andere sagt das Fach ehrlich «bei der Ärztin prüfen».
// Daten: data.notfall.impfungen, lokal wie alles andere.

const datumText = (iso) => String(iso).slice(0, 10).split('-').reverse().join('.');
const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const Impfausweis = ({ palette, t, data, onUpdateData, heute = new Date() }) => {
  const h = React.createElement;
  const lokal = (() => { const l = t('calendar.locale'); return typeof l === 'string' ? l : 'de-CH'; })();
  const roh = Array.isArray(data?.notfall?.impfungen) ? data.notfall.impfungen : [];
  const liste = [...impfungenListe(data)].sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  const faellig = naechsteImpfung(data, heute);
  const [art, setArt] = useState('dt');
  const [name, setName] = useState('');
  const [datum, setDatum] = useState('');
  const { entfernt, merke, rueckgaengig } = useRueckgaengig();
  const titel = (e) => (e.art === 'andere' && e.name ? e.name : t('impfausweis.arten.' + e.art));
  const bereit = !!onUpdateData && /^\d{4}-\d{2}-\d{2}$/.test(datum) && (art !== 'andere' || name.trim());

  const eintragen = () => {
    if (!bereit) return;
    const eintrag = { id: neueId(), art, datum, ...(art === 'andere' ? { name: name.trim() } : {}) };
    onUpdateData('notfall', 'impfungen', [...roh, eintrag]);
    setDatum(''); setName('');
  };
  const entferne = (id) => {
    if (!onUpdateData) return;
    const index = roh.findIndex((e) => e.id === id);
    if (index < 0) return;
    merke({ item: roh[index], index, text: titel(roh[index]) + ', ' + datumText(roh[index].datum) });
    onUpdateData('notfall', 'impfungen', roh.filter((e) => e.id !== id));
  };
  const zurueck = () => rueckgaengig(({ item, index }) => onUpdateData && onUpdateData('notfall', 'impfungen', wiederEinsetzen(roh, item, index)));

  const karte = { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.md + 'px' };
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px', lineHeight: leading.normal } }, inhalt);
  const feld = { width: '100%', padding: space.sm + 'px', borderRadius: radius.md, border: '1px solid ' + palette.feldrand, background: palette.surface,
    color: palette.text, fontSize: text.sm, fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '44px' };
  const beschriftung = (id, key) => h('label', { htmlFor: id, style: { display: 'block', fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 2px' } }, t(key));

  // Die Frage: Bild → Zahl → Satz.
  const frage = h('section', { 'data-teil': 'impf-faellig', style: { ...karte, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.md + 'px' } },
    faellig && h('div', { style: { flex: '0 0 auto', width: '80px', display: 'flex', justifyContent: 'center' } },
      h(Kalenderblatt, { iso: faellig.iso, palette, vorbei: faellig.vorbei, locale: lokal })),
    h('div', { style: { minWidth: 0, flex: '1 1 200px' } },
      h('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' } }, t('impfausweis.frage')),
      faellig
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'impfung', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text } }, monatJahr(faellig.iso, lokal)),
            satz(t('impfausweis.arten.' + faellig.key) + ' · ' + t('impfausweis.faelligSatz', { jahre: faellig.abstand }), 'impf-satz'),
            faellig.vorbei && satz(t('impfausweis.vorbei'), 'impf-vorbei'))
        : satz(t(liste.length ? 'impfausweis.keineRegel' : 'impfausweis.leer'), 'impf-leer'),
      impfungOhneAlter(data) && satz(t('impfausweis.ohneGeburtsdatum'), 'impf-ohne-alter')));

  const hinweis = h('p', { 'data-teil': 'impf-quelle', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: '0 0 ' + space.md + 'px' } },
    t('impfausweis.hinweis') + ' ',
    h(ExternerLink, { t, href: IMPF_QUELLE_URL, style: { color: palette.skyDeep || palette.text } }, t('impfausweis.quelle')));

  const eintraege = h('section', { 'data-teil': 'impf-liste', 'aria-labelledby': 'mp-impf-liste', style: karte },
    h('h3', { id: 'mp-impf-liste', style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('impfausweis.eingetragen')),
    liste.length
      ? h('ul', { style: { listStyle: 'none', margin: space.sm + 'px 0 0', padding: 0 } },
          liste.map((e) => h('li', { key: e.id || e.art + e.datum, 'data-impfung': e.art,
            style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', padding: '6px 0', borderTop: '1px solid ' + palette.border } },
            h('span', { style: { flex: '1 1 auto', minWidth: 0, fontSize: text.sm, color: palette.text, overflowWrap: 'anywhere' } }, titel(e)),
            h('span', { style: { fontSize: text.sm, color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, datumText(e.datum)),
            onUpdateData && e.id && h('button', { type: 'button', onClick: () => entferne(e.id), 'aria-label': t('impfausweis.entfernen') + ': ' + titel(e) + ', ' + datumText(e.datum),
              style: { ...knopfStil(palette, 'leise'), color: palette.mid, minHeight: '44px', minWidth: '44px', fontSize: text.xs } }, t('impfausweis.entfernen')))))
      : satz(t('impfausweis.listeLeer'), 'impf-liste-leer'),
    h(RueckgaengigMeldung, { palette, t, entfernt: nochEntfernt(entfernt, roh), onRueckgaengig: zurueck }));

  const formular = onUpdateData && h('section', { 'data-teil': 'impf-eintragen', 'aria-labelledby': 'mp-impf-neu', style: karte },
    h('h3', { id: 'mp-impf-neu', style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('impfausweis.neu')),
    beschriftung('mp-impf-art', 'impfausweis.welche'),
    h('select', { id: 'mp-impf-art', value: art, onChange: (e) => setArt(e.target.value), style: feld },
      IMPF_ARTEN.map((a) => h('option', { key: a, value: a }, t('impfausweis.arten.' + a)))),
    art === 'andere' && beschriftung('mp-impf-name', 'impfausweis.name'),
    art === 'andere' && h('input', { id: 'mp-impf-name', type: 'text', value: name, maxLength: 80, onChange: (e) => setName(e.target.value), style: feld }),
    beschriftung('mp-impf-datum', 'impfausweis.datum'),
    h('input', { id: 'mp-impf-datum', type: 'date', value: datum, max: '9999-12-31', onChange: (e) => setDatum(e.target.value), style: feld }),
    h('button', { type: 'button', onClick: eintragen, disabled: !bereit, 'data-teil': 'impf-speichern',
      style: { ...knopfStil(palette, 'haupt', { disabled: !bereit }), marginTop: space.md + 'px' } }, t('impfausweis.speichern')));

  return h('div', { 'data-teil': 'impfausweis', style: { maxWidth: '640px', margin: '0 auto' } },
    h(PageTitle, { palette, icon: h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: gesundheitFarbe(palette) } }, h(Icon, { name: 'health', size: 22 })), style: { marginBottom: space.md } },
      t('arztkoffer.faecher.impfausweis.title')),
    frage, hinweis, eintraege, formular);
};
