import React, { useState, useRef, useEffect } from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';
import { ExternerLink } from './components/ExternerLink.jsx';
import { Icon } from './IconSystem.jsx';
import { preisFuer } from './utils/medikamentPreis.js';
import { betrag } from './utils/geld.js';
import { kalenderdatum } from './utils/datumAnzeige.js';

let _searchMedications = null;
const getSearch = async () => {
  if (!_searchMedications) {
    const mod = await import('./config/medicationData.js');
    _searchMedications = mod.searchMedications;
  }
  return _searchMedications;
};

// SL-Preise (F7-K6-2) erst laden, wenn ein Medikament einen Namen hat — nicht im Startbündel.
let _slPreise = null;
const getPreise = () => (_slPreise ||= import('./data/medikamentPreise.js'));

const FREQ_OPTIONS = ['morgens', 'mittags', 'abends', 'nachts', 'beiB'];

// Kurzfassung für die Lese-Ansicht des Kapitels («Regelmässige Medikamente  Euthyrox 50 µg»): eine leise Zeile
// je Medikament mit Preis. Erklärung, Selbstbehalt und Quelle stehen in der Bearbeitung (MedCard).
export const MedikamentPreisKurz = ({ palette, t, lang, medications }) => {
  const [sl, setSl] = useState(null);
  useEffect(() => {
    let aktiv = true;
    getPreise().then((m) => { if (aktiv) setSl(m); }).catch(() => {});
    return () => { aktiv = false; };
  }, []);
  if (!sl) return null;
  const zeilen = (Array.isArray(medications) ? medications : [])
    .map((m) => ({ m, p: preisFuer(m, sl.SL_PREISE) }))
    .filter((x) => x.p);
  if (!zeilen.length) return null;
  const datum = kalenderdatum(sl.SL_STAND.datum, lang);
  return React.createElement('div', { 'data-sl-preis-kurz': '', style: { fontSize: text.xs, color: palette.mid, fontWeight: weight.normal, marginTop: '2px' } },
    zeilen.map(({ m, p }) => React.createElement('div', { key: m.name },
      p.min === p.max
        ? t('medications.preis.kurz', { name: m.name, chf: betrag(p.min, { stellen: 2 }), datum })
        : t('medications.preis.kurzSpanne', { name: m.name, von: betrag(p.min, { stellen: 2 }), bis: betrag(p.max, { stellen: 2 }), datum }))));
};

export const MedicationManager = ({ palette, t, lang, medications, onChange }) => {
  const meds = Array.isArray(medications) ? medications : [];

  const addMed = () => {
    onChange([...meds, { name: '', substance: '', dose: '', unit: 'mg', frequency: [], notes: '' }]);
  };

  const updateMed = (idx, patch) => {
    onChange(meds.map((m, i) => i === idx ? { ...m, ...patch } : m));
  };

  const removeMed = (idx) => {
    onChange(meds.filter((_, i) => i !== idx));
  };

  const inputStyle = {
    width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text'
  };

  const labelStyle = {
    display: 'block', fontSize: text.xs, fontWeight: weight.medium,
    color: palette.mid, marginBottom: space.xs
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md } },

    meds.length > 0 && meds.map((med, idx) =>
      React.createElement(MedCard, {
        key: idx, palette, t, lang, med, idx,
        inputStyle, labelStyle,
        onUpdate: (patch) => updateMed(idx, patch),
        onRemove: () => removeMed(idx),
      })
    ),

    React.createElement('button', {
      onClick: addMed,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('medications.add'))
  );
};

const MedCard = ({ palette, t, lang, med, idx, inputStyle, labelStyle, onUpdate, onRemove }) => {
  const [sl, setSl] = useState(null);
  useEffect(() => {
    if (!med.name || sl) return undefined;
    let aktiv = true;
    getPreise().then((m) => { if (aktiv) setSl(m); }).catch(() => {});
    return () => { aktiv = false; };
  }, [med.name, sl]);
  const preis = sl ? preisFuer(med, sl.SL_PREISE) : null;
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const nameRef = useRef(null);
  const sugRef = useRef(null);
  const listboxId = 'med-listbox-' + idx;
  const optionId = (i) => 'med-opt-' + idx + '-' + i;

  useEffect(() => {
    const handleClick = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target) && nameRef.current !== e.target) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNameChange = async (val) => {
    onUpdate({ name: val });
    setHighlightIndex(-1);
    if (val.length >= 2) {
      const search = await getSearch();
      const results = search(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s) => {
    onUpdate({ name: s.name, substance: s.substance, dose: s.dose, unit: s.unit });
    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && highlightIndex >= 0) { e.preventDefault(); selectSuggestion(suggestions[highlightIndex]); }
    else if (e.key === 'Escape') { setShowSuggestions(false); setHighlightIndex(-1); }
  };

  const toggleFreq = (freq) => {
    const current = med.frequency || [];
    const next = current.includes(freq) ? current.filter(f => f !== freq) : [...current, freq];
    onUpdate({ frequency: next });
  };

  const compendiumUrl = med.name
    ? 'https://compendium.ch/search?q=' + encodeURIComponent(med.name)
    : null;

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up,
      borderRadius: radius.sm, border: '1px solid ' + palette.border,
    }
  },
    // Header
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm }
    },
      React.createElement('span', {
        style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      }, t('medications.label', { nr: idx + 1 })),
      React.createElement('button', {
        onClick: onRemove,
        'aria-label': t('common.delete'),
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.sm, fontFamily, padding: '6px 8px', minHeight: '24px',
        }
      }, React.createElement(Icon, { name: 'kreuz', size: 12 }))
    ),

    // Name with autocomplete
    React.createElement('div', { style: { marginBottom: space.sm, position: 'relative' } },
      React.createElement('label', { htmlFor: 'medi-name-' + idx, style: labelStyle }, t('medications.name')),
      React.createElement('input', {
        id: 'medi-name-' + idx,
        ref: nameRef, type: 'text', value: med.name || '',
        onChange: (e) => handleNameChange(e.target.value),
        onFocus: () => { if (suggestions.length > 0) setShowSuggestions(true); },
        onKeyDown: handleKeyDown,
        placeholder: t('medications.namePlaceholder'),
        style: inputStyle,
        autoComplete: 'off',
        role: 'combobox',
        'aria-expanded': showSuggestions,
        'aria-controls': listboxId,
        'aria-autocomplete': 'list',
        'aria-activedescendant': highlightIndex >= 0 ? optionId(highlightIndex) : undefined,
      }),
      showSuggestions && React.createElement('div', {
        ref: sugRef,
        id: listboxId,
        role: 'listbox',
        style: {
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          background: palette.surface, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, maxHeight: '200px', overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
      },
        suggestions.map((s, i) =>
          React.createElement('div', {
            key: i,
            id: optionId(i),
            role: 'option',
            'aria-selected': i === highlightIndex,
            onClick: () => selectSuggestion(s),
            onMouseMove: () => setHighlightIndex(i),
            style: {
              padding: space.sm + 'px ' + space.md + 'px', cursor: 'pointer',
              borderBottom: i < suggestions.length - 1 ? '1px solid ' + palette.border : 'none',
              fontSize: text.sm,
              background: i === highlightIndex ? palette.up : 'transparent',
            },
          },
            React.createElement('div', { style: { fontWeight: weight.semi } }, s.name),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } },
              s.substance + (s.dose ? ' · ' + s.dose + ' ' + s.unit : '')
            )
          )
        )
      )
    ),

    // Substance (auto-filled or manual)
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { htmlFor: 'medi-wirkstoff-' + idx, style: labelStyle }, t('medications.substance')),
      React.createElement('input', {
        id: 'medi-wirkstoff-' + idx,
        type: 'text', value: med.substance || '',
        onChange: (e) => onUpdate({ substance: e.target.value }),
        placeholder: t('medications.substancePlaceholder'),
        style: inputStyle,
      })
    ),

    // Dose + Unit (inline)
    React.createElement('div', {
      style: { display: 'grid', gridTemplateColumns: '1fr auto', gap: space.sm, marginBottom: space.sm }
    },
      React.createElement('div', null,
        React.createElement('label', { htmlFor: 'medi-dosis-' + idx, style: labelStyle }, t('medications.dose')),
        React.createElement('input', {
        id: 'medi-dosis-' + idx,
          type: 'text', value: med.dose || '',
          onChange: (e) => onUpdate({ dose: e.target.value }),
          placeholder: '500',
          style: inputStyle,
        })
      ),
      React.createElement('div', { style: { minWidth: '80px' } },
        React.createElement('label', { htmlFor: 'medi-einheit-' + idx, style: labelStyle }, t('medications.unit')),
        React.createElement('select', {
        id: 'medi-einheit-' + idx,
          value: med.unit || 'mg',
          onChange: (e) => onUpdate({ unit: e.target.value }),
          style: { ...inputStyle, cursor: 'pointer' },
        },
          ['mg', 'µg', 'g', 'ml', 'IE', 'Tropfen', 'Hübe'].map(u =>
            React.createElement('option', { key: u, value: u }, u)
          )
        )
      )
    ),

    // Frequency pills
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('div', { style: labelStyle }, t('medications.frequency')),
      React.createElement('div', { role: 'group', 'aria-label': t('medications.frequency'), style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
        FREQ_OPTIONS.map(freq => {
          const active = (med.frequency || []).includes(freq);
          return React.createElement('button', {
            key: freq,
            onClick: () => toggleFreq(freq),
            style: {
              padding: '4px 12px', fontSize: text.xs, fontFamily,
              borderRadius: radius.full, cursor: 'pointer', fontWeight: weight.medium,
              border: active ? '1px solid ' + palette.sand : '1px solid ' + palette.border,
              background: active ? palette.sand + '22' : 'transparent',
              color: active ? palette.text : palette.mid,
            }
          }, t('medications.freq.' + freq));
        })
      )
    ),

    // Notes
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { htmlFor: 'medi-notiz-' + idx, style: labelStyle }, t('medications.notes')),
      React.createElement('input', {
        id: 'medi-notiz-' + idx,
        type: 'text', value: med.notes || '',
        onChange: (e) => onUpdate({ notes: e.target.value }),
        placeholder: t('medications.notesPlaceholder'),
        style: inputStyle,
      })
    ),

    // Publikumspreis aus der Spezialitätenliste — nur wenn der Name dort vorkommt (F7-K6-2)
    preis && React.createElement('div', {
      'data-sl-preis': '',
      style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginBottom: space.sm, display: 'grid', gap: '2px' }
    },
      React.createElement('div', { style: { color: palette.text } },
        preis.packungen.length === 1
          ? t('medications.preis.eins', { chf: betrag(preis.min, { stellen: 2 }), packung: preis.packungen[0][0] + ', ' + preis.packungen[0][1] })
          : preis.min === preis.max
            ? t('medications.preis.gleich', { chf: betrag(preis.min, { stellen: 2 }) })
            : t('medications.preis.spanne', { von: betrag(preis.min, { stellen: 2 }), bis: betrag(preis.max, { stellen: 2 }) })),
      preis.selbstbehalt40 !== 'keine' && React.createElement('div', null,
        t(preis.selbstbehalt40 === 'alle' ? 'medications.preis.sb40Alle' : 'medications.preis.sb40Einige')),
      React.createElement('div', null, t('medications.preis.hinweis')),
      React.createElement('div', null,
        React.createElement(ExternerLink, {
          t, href: sl.SL_STAND.url,
          style: { color: palette.mid, textDecoration: 'underline', textUnderlineOffset: '2px' }
        }, t('medications.preis.quelle')),
        ' · ' + t('medications.preis.stand', { datum: kalenderdatum(sl.SL_STAND.datum, lang) }))
    ),

    // Compendium link
    compendiumUrl && React.createElement(ExternerLink, {
      t, href: compendiumUrl,
      style: {
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: text.xs, color: palette.mid, textDecoration: 'underline',
        textUnderlineOffset: '2px',
      }
    }, t('medications.compendiumLink'))
  );
};

export default MedicationManager;
