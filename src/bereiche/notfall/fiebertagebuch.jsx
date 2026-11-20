import React, { useState, useEffect } from 'react';
import { text, weight, space, radius, leading } from '../../config/tokens.js';
import { knopfStil } from '../../components/PrimaryButton.jsx';
import { PageTitle } from '../../components/Heading.jsx';
import { RueckgaengigMeldung } from '../../components/RueckgaengigMeldung.jsx';
import { useRueckgaengig, wiederEinsetzen, nochEntfernt } from '../../hooks/useRueckgaengig.js';
import { Icon } from '../../IconSystem.jsx';
import { fiebertagebuch, fieberBehalten, fieberTemp, FIEBER_SYMPTOME, FIEBER_AUFBEWAHREN_TAGE, wochenblister } from './rechnung.js';
import { Fieberkurve, gesundheitFarbe } from './bilder.jsx';

// Fach Fiebertagebuch im Arztkoffer (Sophie 20.11.2026: «A · Kurve auf Kalender», Eintrag mit Temperatur, Symptomen,
// Medikament und Notiz, «Für wen» frei, «30 Tage, dann weg»). Eine Frage (rechnung.js 9):
//   Wie ging es mir die letzten Tage?   fiebertagebuch → Fieberkurve (einmal je Seite) → «Tag 3» → «zuletzt 38,2 °C · Husten»
// Daten lokal in data.notfall.fiebertagebuch. Ältere Einträge als FIEBER_AUFBEWAHREN_TAGE werden beim Öffnen still
// entfernt (der Satz unten sagt es). Das Medikament schlägt die Medikamentenliste des Wochenblisters vor (eine Liste,
// keine zweite). Keine Grenze «ab wann Fieber», keine Beurteilung, keine Dosierung. Gesundheitsangabe, lokal.

const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const zweistellig = (n) => String(n).padStart(2, '0');
const jetztWert = (d) => d.getFullYear() + '-' + zweistellig(d.getMonth() + 1) + '-' + zweistellig(d.getDate()) + 'T' + zweistellig(d.getHours()) + ':' + zweistellig(d.getMinutes());
const zeitText = (z) => z.slice(8, 10) + '.' + z.slice(5, 7) + '. ' + z.slice(11, 16);
const ZEIT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const TEMP_EINGABE = /^\d{0,2}([.,]\d?)?$/;

export const Fiebertagebuch = ({ palette, t, data, onUpdateData, heute = new Date(), formularOffen = false }) => {
  const h = React.createElement;
  const nf = data?.notfall || {};
  const roh = Array.isArray(nf.fiebertagebuch) ? nf.fiebertagebuch : [];
  const [fuer, setFuer] = useState('');
  const stand = fiebertagebuch(data, heute, fuer);
  const vorschlaege = wochenblister(data).medikamente.map((m) => m.name);
  const farbe = gesundheitFarbe(palette);
  const schreibe = (v) => onUpdateData && onUpdateData('notfall', 'fiebertagebuch', v);

  // «30 Tage, dann weg»: beim Öffnen aufräumen, nur wenn es etwas zu entfernen gibt.
  const behalten = fieberBehalten(roh, heute);
  useEffect(() => { if (onUpdateData && behalten.length !== roh.length) schreibe(behalten); }, [behalten.length, roh.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const [offen, setOffen] = useState(formularOffen);
  const [zeit, setZeit] = useState(() => jetztWert(heute));
  const [temp, setTemp] = useState('');
  const [symptome, setSymptome] = useState([]);
  const [anderes, setAnderes] = useState('');
  const [medikament, setMedikament] = useState('');
  const [notiz, setNotiz] = useState('');
  const [wer, setWer] = useState('');
  const [alleWeg, setAlleWeg] = useState(false);
  const { entfernt, merke, rueckgaengig } = useRueckgaengig();

  const tempFalsch = temp.trim() !== '' && fieberTemp(temp) == null;
  const etwas = fieberTemp(temp) != null || symptome.length || anderes.trim() || medikament.trim() || notiz.trim();
  const bereit = !!onUpdateData && ZEIT.test(zeit) && !tempFalsch && !!etwas;
  const leeren = () => { setTemp(''); setSymptome([]); setAnderes(''); setMedikament(''); setNotiz(''); };
  const festhalten = () => {
    if (!bereit) return;
    const name = wer.trim();
    schreibe([...behalten, { id: neueId(), zeit, ...(fieberTemp(temp) != null ? { temp: fieberTemp(temp) } : {}),
      ...(symptome.length ? { symptome } : {}), ...(anderes.trim() ? { anderes: anderes.trim() } : {}),
      ...(medikament.trim() ? { medikament: medikament.trim() } : {}), ...(notiz.trim() ? { notiz: notiz.trim() } : {}),
      ...(name ? { fuer: name } : {}) }]);
    setFuer(name); leeren(); setOffen(false);
  };
  const entferne = (id) => {
    const index = roh.findIndex((e) => e.id === id);
    if (index < 0 || !onUpdateData) return;
    merke({ item: roh[index], index, text: zeitText(roh[index].zeit) });
    schreibe(roh.filter((e) => e.id !== id));
  };
  const zurueck = () => rueckgaengig(({ item, index }) => schreibe(wiederEinsetzen(roh, item, index)));

  const karte = { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.md + 'px' };
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px', lineHeight: leading.normal } }, inhalt);
  const leise = (inhalt, teil) => h('p', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' } }, inhalt);
  const feld = { width: '100%', padding: space.sm + 'px', borderRadius: radius.md, border: '1px solid ' + palette.feldrand, background: palette.surface,
    color: palette.text, fontSize: text.sm, fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '44px' };
  const beschriftung = (id, key) => h('label', { htmlFor: id, style: { display: 'block', fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 2px' } }, t(key));
  const wahlKnopf = (key, label, an, onClick, extra = {}) => h('button', { key, type: 'button', 'aria-pressed': an ? 'true' : 'false', onClick, ...extra,
    style: { minHeight: '44px', padding: '0 ' + space.sm + 'px', borderRadius: radius.md, fontFamily: 'inherit', fontSize: text.sm, cursor: 'pointer',
      border: (an ? 2 : 1) + 'px solid ' + (an ? farbe : palette.border), background: palette.surface, color: palette.text, fontWeight: an ? weight.semi : weight.normal } }, label);
  const kleinKnopf = (label, onClick, extra = {}) => onUpdateData && h('button', { type: 'button', onClick, ...extra,
    style: { ...knopfStil(palette, 'leise'), color: palette.mid, minHeight: '44px', fontSize: text.xs, padding: '0 4px', whiteSpace: 'nowrap' } }, label);
  const personName = (p) => (p ? p : t('fieber.ich'));
  const symptomText = (e) => [...e.symptome.map((s) => t('fieber.symptome.' + s)), e.anderes].filter(Boolean).join(', ');
  const grad = (n) => t('fieber.grad', { n: String(n).replace('.', t('fieber.komma')) });

  // ── Wie ging es mir die letzten Tage? ──
  const z = stand.zuletzt;
  const zuletztSatz = z && [stand.zuletztTemp != null && t('fieber.zuletzt', { temp: grad(stand.zuletztTemp) }), symptomText(z)].filter(Boolean).join(' · ');
  const frage = h('section', { 'data-teil': 'fieber-verlauf', 'aria-labelledby': 'mp-fieber-verlauf', style: karte },
    h('h3', { id: 'mp-fieber-verlauf', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('fieber.frage')),
    stand.personen.length > 1 && h('div', { role: 'group', 'aria-label': t('fieber.werAnzeigen'), 'data-teil': 'fieber-personen',
      style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px', marginBottom: space.sm + 'px' } },
      stand.personen.map((p) => wahlKnopf(p || '-ich', personName(p), p === stand.fuer, () => setFuer(p)))),
    h(Fieberkurve, { palette, t, tage: stand.tage }),
    h('div', { style: { marginTop: space.sm + 'px' } },
      z
        ? h(React.Fragment, null,
            h('div', { 'data-instrument-zahl': 'fieber', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
              stand.aktuell ? t('fieber.tag', { n: stand.tagNr }) : t(stand.laufTage === 1 ? 'fieber.einTag' : 'fieber.tage', { n: stand.laufTage })),
            satz(stand.aktuell ? zuletztSatz : t('fieber.bis', { datum: zeitText(z.zeit).slice(0, 6) }) + (zuletztSatz ? ' · ' + zuletztSatz : ''), 'fieber-satz'))
        : satz(t('fieber.leer'), 'fieber-leer')));

  // ── Eintrag festhalten ──
  const formular = onUpdateData && h('section', { 'data-teil': 'fieber-eintragen', 'aria-labelledby': 'mp-fieber-neu', style: karte },
    h('button', { type: 'button', id: 'mp-fieber-neu', 'data-teil': 'fieber-umschalter', 'aria-expanded': offen ? 'true' : 'false',
      onClick: () => { if (!offen) { setZeit(jetztWert(new Date())); setWer(stand.fuer); } setOffen(!offen); }, style: { ...knopfStil(palette, offen ? 'neben' : 'haupt'), color: offen ? palette.text : undefined } },
      t(offen ? 'fieber.abbrechen' : 'fieber.festhalten')),
    offen && h('div', { 'data-teil': 'fieber-formular' },
      beschriftung('mp-fieber-zeit', 'fieber.wann'),
      h('input', { id: 'mp-fieber-zeit', type: 'datetime-local', value: zeit, max: '9999-12-31T23:59', onChange: (e) => setZeit(e.target.value), style: feld }),
      beschriftung('mp-fieber-temp', 'fieber.temperatur'),
      h('input', { id: 'mp-fieber-temp', type: 'text', inputMode: 'decimal', value: temp, autoComplete: 'off', placeholder: t('fieber.tempBeispiel'),
        'aria-invalid': tempFalsch ? 'true' : undefined, 'aria-describedby': tempFalsch ? 'mp-fieber-temp-hinweis' : undefined,
        onChange: (e) => { if (TEMP_EINGABE.test(e.target.value)) setTemp(e.target.value); }, style: feld }),
      tempFalsch && h('div', { id: 'mp-fieber-temp-hinweis', 'data-teil': 'fieber-temp-hinweis', style: { fontSize: text.xs, color: palette.text, marginTop: '2px' } }, t('fieber.tempHinweis')),
      h('fieldset', { style: { border: 'none', padding: 0, margin: space.sm + 'px 0 0' } },
        h('legend', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '2px', padding: 0 } }, t('fieber.symptomeTitel')),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px' } },
          FIEBER_SYMPTOME.map((s) => wahlKnopf(s, t('fieber.symptome.' + s), symptome.includes(s),
            () => setSymptome(symptome.includes(s) ? symptome.filter((x) => x !== s) : [...symptome, s]), { 'data-symptom': s })))),
      beschriftung('mp-fieber-anderes', 'fieber.anderes'),
      h('input', { id: 'mp-fieber-anderes', type: 'text', value: anderes, maxLength: 80, onChange: (e) => setAnderes(e.target.value), style: feld }),
      beschriftung('mp-fieber-medikament', 'fieber.medikament'),
      h('input', { id: 'mp-fieber-medikament', type: 'text', value: medikament, maxLength: 80, list: vorschlaege.length ? 'mp-fieber-medikamente' : undefined,
        onChange: (e) => setMedikament(e.target.value), style: feld }),
      vorschlaege.length > 0 && h('datalist', { id: 'mp-fieber-medikamente', 'data-teil': 'fieber-vorschlaege' }, vorschlaege.map((n) => h('option', { key: n, value: n }))),
      beschriftung('mp-fieber-notiz', 'fieber.notiz'),
      h('input', { id: 'mp-fieber-notiz', type: 'text', value: notiz, maxLength: 200, onChange: (e) => setNotiz(e.target.value), style: feld }),
      beschriftung('mp-fieber-wer', 'fieber.fuerWen'),
      h('input', { id: 'mp-fieber-wer', type: 'text', value: wer, maxLength: 40, placeholder: t('fieber.ich'), list: stand.personen.some(Boolean) ? 'mp-fieber-wer-liste' : undefined,
        'aria-describedby': 'mp-fieber-wer-hinweis', onChange: (e) => setWer(e.target.value), style: feld }),
      stand.personen.some(Boolean) && h('datalist', { id: 'mp-fieber-wer-liste' }, stand.personen.filter(Boolean).map((p) => h('option', { key: p, value: p }))),
      h('div', { id: 'mp-fieber-wer-hinweis', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, t('fieber.fuerWenHinweis')),
      h('button', { type: 'button', onClick: festhalten, disabled: !bereit, 'data-teil': 'fieber-speichern',
        style: { ...knopfStil(palette, 'haupt', { disabled: !bereit }), marginTop: space.md + 'px' } }, t('fieber.speichern'))));

  // ── Die Einträge ── (Lesefassung des Bilds, auch für Vorlesen: das Bild ist aria-hidden)
  const liste = stand.anzahl > 0 && h('section', { 'data-teil': 'fieber-liste', 'aria-labelledby': 'mp-fieber-liste', style: karte },
    h('h3', { id: 'mp-fieber-liste', style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
      stand.personen.length > 1 || stand.fuer ? t('fieber.eintraegeVon', { wer: personName(stand.fuer) }) : t('fieber.eintraege')),
    h('ul', { style: { listStyle: 'none', margin: space.sm + 'px 0 0', padding: 0 } },
      stand.eintraege.map((e) => h('li', { key: e.id, 'data-eintrag': e.id, style: { display: 'flex', alignItems: 'flex-start', gap: space.sm + 'px', padding: '6px 0', borderTop: '1px solid ' + palette.border } },
        h('span', { style: { fontSize: text.sm, color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', paddingTop: '2px' } }, zeitText(e.zeit)),
        h('span', { style: { flex: '1 1 auto', minWidth: 0, paddingTop: '2px' } },
          h('span', { style: { display: 'block', fontSize: text.sm, color: palette.text, overflowWrap: 'anywhere' } },
            [e.temp != null && grad(e.temp), symptomText(e)].filter(Boolean).join(' · ') || '–'),
          (e.medikament || e.notiz) && h('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid, overflowWrap: 'anywhere' } },
            [e.medikament && t('fieber.genommen', { name: e.medikament }), e.notiz].filter(Boolean).join(' · '))),
        kleinKnopf(t('fieber.entfernen'), () => entferne(e.id), { 'aria-label': t('fieber.entfernen') + ': ' + zeitText(e.zeit) })))),
    h(RueckgaengigMeldung, { palette, t, entfernt: nochEntfernt(entfernt, roh), onRueckgaengig: zurueck }));

  const schluss = h('div', { 'data-teil': 'fieber-schluss', style: { margin: '0 0 ' + space.md + 'px' } },
    leise(t('fieber.aufbewahren', { n: FIEBER_AUFBEWAHREN_TAGE }), 'fieber-aufbewahren'),
    leise(t('fieber.keineBeurteilung'), 'fieber-keine-beurteilung'),
    onUpdateData && roh.length > 0 && h('div', { 'data-teil': 'fieber-alle', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm + 'px', marginTop: space.sm + 'px' } },
      alleWeg
        ? h(React.Fragment, null,
            h('span', { style: { fontSize: text.sm, color: palette.text } }, t('fieber.alleFrage')),
            h('button', { type: 'button', 'data-teil': 'fieber-alle-ja', onClick: () => { schreibe([]); setAlleWeg(false); setFuer(''); },
              style: { ...knopfStil(palette, 'neben'), color: palette.text } }, t('fieber.alleJa')),
            h('button', { type: 'button', onClick: () => setAlleWeg(false), style: { ...knopfStil(palette, 'leise'), color: palette.mid } }, t('fieber.alleNein')))
        : kleinKnopf(t('fieber.alleLoeschen'), () => setAlleWeg(true), { 'data-teil': 'fieber-alle-loeschen' })));

  return h('div', { 'data-teil': 'fiebertagebuch', style: { maxWidth: '640px', margin: '0 auto' } },
    h(PageTitle, { palette, icon: h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: farbe } }, h(Icon, { name: 'fieberkurve', size: 22 })), style: { marginBottom: space.md } },
      t('arztkoffer.faecher.thermometer.title')),
    frage, formular, liste, schluss);
};
