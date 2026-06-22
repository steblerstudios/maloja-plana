import React, { useState, useEffect, useRef } from 'react';
import {
  validatePhone, validateAHV, validateEmail, validatePostalCode, validateCurrency, validateDate, getFileExpiryHint, getExpiryStatus, formatPhoneForDisplay, formatDateForDisplay, formatAHVOnInput, normalizeEmail, formatPhoneOnBlur
} from './validationUtils.js';
import { Icon } from './IconSystem.jsx';
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, leading, space, radius, shadow, fontFamily } from './config/tokens.js';
import MirrorCards from './MirrorCards.jsx';
import { pruefeLohn, kantonHatMindestlohn } from './data/lohnCheck.js';

export const ChapterViewComplete = ({ palette, t, chapter, data, allData, onUpdate, onAddDocument, onNavigate, demoMode }) => {
  const [expandedSection, setExpandedSection] = useState('fields');
  const [uploadError, setUploadError] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const hasSecondaryFields = chapter.fields.some(f => f.secondary);
  const secondaryHasData = chapter.fields.filter(f => f.secondary).some(f => data[f.k]);
  const storageKey = 'or5_disclosure_' + chapter.key;
  const [showSecondary, setShowSecondary] = useState(() => {
    if (secondaryHasData) return true;
    try { return localStorage.getItem(storageKey) === 'true'; } catch { return false; }
  });
  const toggleSecondary = () => {
    const next = !showSecondary;
    setShowSecondary(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
  };

  // t() with fallback if not provided (backward compat)
  const tr = t || ((k) => k);

  useEffect(() => {
    let timer;
    const listener = (event) => {
      if (event.eventType === 'DOCUMENT_UPLOADED') {
        setUploadSuccess(tr('chapterView.uploadSuccess'));
        timer = setTimeout(() => setUploadSuccess(''), 3000);
      }
    };
    runtimeEventBus.subscribe(listener);
    return () => {
      runtimeEventBus.unsubscribe(listener);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const validateField = (fieldKey, value) => {
    let error = '';
    if (fieldKey.includes('phone') || fieldKey.includes('Phone')) {
      error = validatePhone(value, tr).error;
    } else if (fieldKey === 'ahv') {
      error = validateAHV(value, tr).error;
    } else if (fieldKey.includes('email')) {
      error = validateEmail(value, tr).error;
    } else if (fieldKey === 'postalCode') {
      error = validatePostalCode(value, 'CH', tr).error;
    }
    return error;
  };

  const handleFieldChange = (fieldKey, value) => {
    let processedValue = value;

    if (fieldKey === 'ahv') {
      processedValue = formatAHVOnInput(value);
    }

    onUpdate(fieldKey, processedValue);

    const error = validateField(fieldKey, processedValue);
    if (!error) setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    else if (touched[fieldKey]) setErrors(prev => ({ ...prev, [fieldKey]: error }));
  };

  const handleFieldBlur = (fieldKey, value) => {
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
    const error = validateField(fieldKey, value);
    setErrors(prev => ({ ...prev, [fieldKey]: error }));
  };

  const handleEmailBlur = (fieldKey, value) => {
    const normalized = normalizeEmail(value);
    if (normalized !== value) {
      onUpdate(fieldKey, normalized);
    }
  };

  const handlePhoneBlur = (fieldKey, value) => {
    const formatted = formatPhoneOnBlur(value);
    if (formatted && formatted !== value) {
      onUpdate(fieldKey, formatted);
    }
  };

  const renderHouseholdFields = () => {
    const household = data.household || { adults: 1, children: [], isRetired: false };
    const adults = household.adults || 1;
    const children = Array.isArray(household.children) ? household.children : [];
    const isRetired = Boolean(household.isRetired);

    const hhLabel = {
      display: 'block', fontSize: text.sm, fontWeight: weight.medium,
      color: palette.mid, marginBottom: space.sm - 2
    };
    const hhSelect = {
      width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
      borderRadius: radius.sm, border: '1px solid ' + palette.border,
      background: palette.up, color: palette.text, boxSizing: 'border-box',
      fontSize: text.body, fontFamily: fontFamily, cursor: 'pointer'
    };

    const updateHousehold = (patch) => {
      const next = { ...household, ...patch };
      onUpdate('household', next);
    };

    return React.createElement('div', { key: 'household-fields', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 16px' } },

      // Adults
      React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('label', { style: hhLabel }, tr('chapters.basis.fields.household.adults')),
        React.createElement('select', {
          value: String(adults),
          onChange: (e) => updateHousehold({ adults: Number(e.target.value) }),
          style: hhSelect
        },
          [1, 2, 3, 4].map(n => React.createElement('option', { key: n, value: String(n) }, String(n)))
        )
      ),

      // Retired
      React.createElement('div', { style: { marginBottom: space.md } },
        React.createElement('label', { style: hhLabel }, tr('chapters.basis.fields.household.retired')),
        React.createElement('select', {
          value: isRetired ? 'yes' : 'no',
          onChange: (e) => updateHousehold({ isRetired: e.target.value === 'yes' }),
          style: hhSelect
        },
          React.createElement('option', { value: 'no' }, tr('chapters.basis.fields.household.retiredNo')),
          React.createElement('option', { value: 'yes' }, tr('chapters.basis.fields.household.retiredYes'))
        )
      ),

      // Children section — full width
      React.createElement('div', { style: { gridColumn: '1 / -1', marginBottom: space.md } },
        React.createElement('label', { style: hhLabel }, tr('chapters.basis.fields.household.children')),

        children.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm, marginBottom: '12px' } },
          children.map((child, idx) =>
            React.createElement('div', { key: idx, style: { display: 'flex', alignItems: 'center', gap: space.sm } },
              React.createElement('span', { style: { fontSize: text.sm, color: palette.mid, minWidth: '36px' } }, tr('chapters.basis.fields.household.childAge')),
              React.createElement('input', {
                type: 'number',
                inputMode: 'numeric',
                min: 0,
                max: 25,
                value: child.age === 0 ? '0' : (child.age || ''),
                onChange: (e) => {
                  const updated = children.map((c, i) => i === idx ? { ...c, age: Math.max(0, Math.min(25, Number(e.target.value) || 0)) } : c);
                  updateHousehold({ children: updated });
                },
                style: { ...hhSelect, width: '72px', cursor: 'text' }
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => {
                  const updated = children.filter((_, i) => i !== idx);
                  updateHousehold({ children: updated });
                },
                'aria-label': tr('chapters.basis.fields.household.removeChild'),
                style: {
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: palette.mid, fontSize: text.sm, padding: '4px 8px',
                  borderRadius: radius.sm,
                }
              }, tr('chapters.basis.fields.household.removeChild'))
            )
          )
        ),

        React.createElement('button', {
          type: 'button',
          onClick: () => updateHousehold({ children: [...children, { age: 0 }] }),
          style: {
            background: 'none', border: '1px dashed ' + palette.border, borderRadius: radius.sm,
            cursor: 'pointer', color: palette.mid, fontSize: text.sm,
            padding: (space.sm) + 'px ' + space.md + 'px',
            fontFamily: fontFamily,
          }
        }, '+ ' + tr('chapters.basis.fields.household.addChild'))
      )
    );
  };

  const renderOrientation = (field) => {
    const parts = [];
    if (field.orientation) {
      parts.push(React.createElement('div', { key: 'or', style: { fontSize: text.sm, color: palette.sage, marginTop: space.xs + 'px', lineHeight: leading.relaxed } }, '○ ' + field.orientation));
    }
    if (field.link) {
      parts.push(React.createElement('a', {
        key: 'lk', href: field.link.url, target: '_blank', rel: 'noopener noreferrer',
        style: { display: 'inline-block', fontSize: text.xs, color: palette.sky, marginTop: space.xs + 'px', textDecoration: 'none', borderBottom: '1px solid ' + palette.sky + '40' }
      }, '→ ' + field.link.label));
    }
    return parts.length > 0 ? parts : null;
  };

  const renderField = (field) => {
    if (field.type === 'household') return renderHouseholdFields();
    const value = data[field.k] || '';
    const error = errors[field.k];

    const baseStyle = { marginBottom: space.lg + 'px' };

    const labelStyle = {
      display: 'block',
      fontSize: text.sm,
      fontWeight: weight.medium,
      color: palette.mid,
      marginBottom: space.sm - 2
    };

    const inputStyle = {
      width: '100%',
      padding: (space.sm + 2) + 'px ' + space.sm + 'px ' + (space.sm + 2) + 'px ' + (space.sm + 4) + 'px',
      borderRadius: radius.sm,
      border: error ? '2px solid ' + palette.rose : '1px solid ' + palette.border,
      background: palette.up,
      color: palette.text,
      boxSizing: 'border-box',
      fontSize: text.body,
      fontFamily: fontFamily,
      ...(demoMode ? { pointerEvents: 'none', opacity: 0.7 } : {}),
    };

    const errorStyle = {
      fontSize: text.xs,
      color: palette.rose,
      marginTop: space.xs
    };

    // Text Input
    if (field.type === 'text') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label + (field.required ? ' *' : '')),
        React.createElement('input', {
          id: fieldId,
          type: 'text',
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          onBlur: (e) => handleFieldBlur(field.k, e.target.value),
          placeholder: field.placeholder || '',
          style: inputStyle
        }),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, '○ ' + field.hint),
        renderOrientation(field),
        error && React.createElement('div', { style: errorStyle }, error)
      );
    }

    // Phone with country code prefix
    if (field.type === 'tel') {
      const phoneCodes = [
        { code: '+41', label: '+41' },
        { code: '+49', label: '+49' },
        { code: '+43', label: '+43' },
        { code: '+33', label: '+33' },
        { code: '+39', label: '+39' },
      ];
      const detectedCode = phoneCodes.find(p => value.startsWith(p.code));
      const activeCode = detectedCode ? detectedCode.code : '+41';
      const localPart = detectedCode ? value.slice(detectedCode.code.length).replace(/^\s+/, '') : (value.startsWith('0') ? value.slice(1) : value);

      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('select', {
            value: activeCode,
            onChange: (e) => {
              const newCode = e.target.value;
              const joined = localPart ? newCode + ' ' + localPart : newCode;
              handleFieldChange(field.k, joined);
            },
            'aria-label': tr('validation.countryCode'),
            style: { ...inputStyle, width: '80px', flex: '0 0 80px', cursor: 'pointer' }
          },
            phoneCodes.map(p => React.createElement('option', { key: p.code, value: p.code }, p.label))
          ),
          React.createElement('input', {
            id: fieldId,
            type: 'tel',
            value: localPart,
            onChange: (e) => {
              const joined = activeCode + ' ' + e.target.value;
              handleFieldChange(field.k, joined);
            },
            onBlur: (e) => {
              const full = activeCode + ' ' + e.target.value;
              handlePhoneBlur(field.k, full);
              handleFieldBlur(field.k, full);
            },
            placeholder: field.placeholder || '79 123 45 67',
            style: { ...inputStyle, flex: 1 }
          })
        ),
        error && React.createElement('div', { style: errorStyle }, error)
      );
    }

    // Email
    if (field.type === 'email') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('input', {
          id: fieldId,
          type: 'email',
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          onBlur: (e) => { handleEmailBlur(field.k, e.target.value); handleFieldBlur(field.k, e.target.value); },
          placeholder: 'name@example.com',
          style: inputStyle
        }),
        error && React.createElement('div', { style: errorStyle }, error)
      );
    }

    // Date
    if (field.type === 'date') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('input', {
            id: fieldId,
            key: field.k + '_' + (value || 'empty'),
            type: 'date',
            value: value || '',
            onChange: (e) => handleFieldChange(field.k, e.target.value),
            onInput: (e) => { if (!e.target.value && value) handleFieldChange(field.k, ''); },
            style: inputStyle
          }),
          value && React.createElement('button', {
            type: 'button',
            onClick: () => handleFieldChange(field.k, ''),
            'aria-label': tr('common.delete'),
            style: {
              position: 'absolute', right: '36px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: palette.mid, fontSize: text.body, padding: space.xs, lineHeight: 1,
            }
          }, '✕')
        )
      );
    }

    // Currency
    if (field.type === 'currency') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('span', { style: { padding: '10px 12px', background: palette.up, borderRadius: radius.sm, borderLeft: '1px solid ' + palette.border } }, 'CHF'),
          React.createElement('input', {
            id: fieldId,
            type: 'number',
            inputMode: 'decimal',
            value: value,
            onChange: (e) => handleFieldChange(field.k, e.target.value),
            placeholder: '0.00',
            step: '0.01',
            style: { ...inputStyle, flex: 1 }
          })
        ),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, '○ ' + field.hint),
        renderOrientation(field)
      );
    }

    // Select — supports both {value, label} objects and plain strings
    if (field.type === 'select') {
      const options = (field.options || []).map(opt => {
        if (typeof opt === 'object' && opt.value !== undefined) return opt;
        return { value: opt, label: opt };
      });

      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('select', {
          id: fieldId,
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          style: { ...inputStyle, cursor: 'pointer' }
        },
          React.createElement('option', { value: '' }, tr('chapterView.selectOption')),
          options.map((opt, idx) => React.createElement('option', { key: idx, value: opt.value }, opt.label))
        ),
        field.hint && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, '○ ' + field.hint),
        renderOrientation(field)
      );
    }

    // Textarea
    if (field.type === 'textarea') {
      const fieldId = chapter.key + '-' + field.k;
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { htmlFor: fieldId, style: labelStyle }, field.label),
        React.createElement('textarea', {
          id: fieldId,
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          placeholder: field.placeholder || '',
          style: { ...inputStyle, minHeight: '100px', fontFamily: 'DM Sans, monospace', resize: 'vertical' }
        })
      );
    }

    return null;
  };

  const filledCount = chapter.fields.filter(f => data[f.k]).length;

  const ankunftKey = 'or5_ankunft_' + chapter.key;
  const [showAnkunft, setShowAnkunft] = useState(false);
  const prevFilledRef = useRef(filledCount);
  useEffect(() => {
    if (prevFilledRef.current === 0 && filledCount > 0) {
      try {
        if (!localStorage.getItem(ankunftKey)) {
          localStorage.setItem(ankunftKey, Date.now().toString());
          setShowAnkunft(true);
          const timer = setTimeout(() => setShowAnkunft(false), 6000);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
    prevFilledRef.current = filledCount;
  }, [filledCount, ankunftKey]);

  const introText = tr('chapters.' + chapter.key + '.intro');
  const hasIntro = introText && introText !== 'chapters.' + chapter.key + '.intro';

  const isNotfall = chapter.key === 'notfall';
  const hasContact = isNotfall && data.emergencyContact;
  const hasBlood = isNotfall && data.bloodType && data.bloodType !== 'unknown' && data.bloodType !== '';
  const vorsorgeKeys = ['patientenverfuegung', 'vorsorgeauftrag', 'bestattungswuensche'];
  const hasVorsorge = isNotfall && vorsorgeKeys.some(k => data[k]);
  const showSummary = hasContact || hasBlood || hasVorsorge;
  const hasMedical = isNotfall && (hasContact || hasBlood || data.allergies || data.doctor);

  const handleSaveCard = () => {
    const basis = allData && allData.basis || {};
    const name = [basis.firstName, basis.middleName, basis.lastName].filter(Boolean).join(' ');
    const dob = basis.dateOfBirth ? new Date(basis.dateOfBirth).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const sections = [];
    if (name || dob) {
      const rows = [];
      if (name) rows.push('<div style="font-size:18px;font-weight:500">' + name + '</div>');
      if (dob) rows.push('<div style="color:#666">' + tr('notfallSummary.cardDateOfBirth') + ': ' + dob + '</div>');
      sections.push({ title: tr('notfallSummary.cardPerson'), html: rows.join('') });
    }
    if (data.emergencyContact) {
      const rows = ['<div>' + data.emergencyContact + '</div>'];
      if (data.emergencyPhone) rows.push('<div>' + data.emergencyPhone + '</div>');
      sections.push({ title: tr('notfallSummary.handoverContact'), html: rows.join('') });
    }
    const medRows = [];
    if (hasBlood) medRows.push('<div>' + tr('notfallSummary.bloodType') + ': <strong>' + data.bloodType + '</strong></div>');
    if (data.allergies) medRows.push('<div>' + tr('chapters.notfall.fields.allergies') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    if (data.medications) medRows.push('<div>' + tr('chapters.notfall.fields.medications') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    if (data.chronicDiseases) medRows.push('<div>' + tr('chapters.notfall.fields.chronicDiseases') + ': ' + tr('notfallSummary.cardRecorded') + '</div>');
    if (medRows.length) sections.push({ title: tr('notfallSummary.handoverMedical'), html: medRows.join('') });
    if (data.doctor) {
      const rows = ['<div>' + data.doctor + (data.doctorPhone ? ' · ' + data.doctorPhone : '') + '</div>'];
      sections.push({ title: tr('notfallSummary.cardDoctor'), html: rows.join('') });
    }
    const provRows = [];
    if (data.patientenverfuegung && data.patientenverfuegung !== 'no') provRows.push('<div>' + tr('notfallSummary.cardAdvanceDirective') + '</div>');
    if (data.vorsorgeauftrag && data.vorsorgeauftrag !== 'no') provRows.push('<div>' + tr('notfallSummary.cardPowerOfAttorney') + '</div>');
    if (provRows.length) sections.push({ title: tr('notfallSummary.handoverProvision'), html: provRows.join('') });
    const sectionHtml = sections.map(s =>
      '<div style="margin-bottom:16px"><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:4px">' + s.title + '</div>' + s.html + '</div>'
    ).join('');
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + tr('notfallSummary.cardTitle') + '</title>' +
      '<style>@media print{body{margin:0;padding:20mm}@page{size:A4;margin:20mm}}body{font-family:-apple-system,system-ui,sans-serif;max-width:600px;margin:40px auto;padding:0 24px;color:#222;line-height:1.5}' +
      '.card{border:1px solid #ddd;border-radius:8px;padding:24px;background:#fff}h1{font-size:20px;font-weight:500;margin:0 0 4px;letter-spacing:0.3px}' +
      '.subtitle{font-size:13px;color:#888;margin:0 0 20px;font-style:italic}.footer{margin-top:20px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa}' +
      '.no-print{text-align:center;margin-bottom:24px}@media print{.no-print{display:none}}</style></head><body>' +
      '<div class="no-print"><button onclick="window.print()" style="padding:8px 20px;font-size:14px;border:1px solid #ccc;border-radius:6px;background:#f8f7f5;cursor:pointer">' + tr('notfallSummary.printCard') + '</button></div>' +
      '<div class="card"><h1>' + tr('notfallSummary.cardTitle') + '</h1>' +
      '<p class="subtitle">' + tr('notfallSummary.handoverIntro') + '</p>' +
      sectionHtml +
      '<div class="footer">' + tr('notfallSummary.cardFooter') + '</div></div></body></html>';
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  const bloodTypeColors = {
    '0+': palette.rose, '0-': palette.rose,
    'A+': palette.gold, 'A-': palette.gold,
    'B+': palette.sky, 'B-': palette.sky,
    'AB+': palette.sage, 'AB-': palette.sage,
  };

  const chapterAccent = {
    basis: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    wohnen: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    finanzen: { bg: palette.gold + '0A', border: palette.gold, icon: palette.gold },
    versicherungen: { bg: palette.sky + '0A', border: palette.sky, icon: palette.sky },
    ausbildung: { bg: palette.sageMist, border: palette.sage, icon: palette.sageDeep },
    behoerden: { bg: palette.sand + '0A', border: palette.sand, icon: palette.sand },
    notfall: { bg: palette.rose + '0A', border: palette.rose, icon: palette.rose },
  };
  const accent = chapterAccent[chapter.key] || chapterAccent.basis;

  return React.createElement('div', { style: { background: palette.surface, padding: space.md + 4 + 'px ' + space.md + 'px', borderRadius: radius.md, border: '1px solid ' + palette.border + '88', boxShadow: shadow.md } },
    // Header — expressive chapter entrance with landscape continuity
    React.createElement('div', { style: { textAlign: 'center', marginBottom: space.xl + 'px', paddingTop: space.lg + 'px', paddingBottom: space.lg + 'px', background: accent.bg, borderRadius: radius.md, marginLeft: '-' + space.md + 'px', marginRight: '-' + space.md + 'px', marginTop: '-' + (space.md + 4) + 'px', borderBottom: '1px solid ' + accent.border + '20' } },
      React.createElement('div', { style: { marginBottom: space.md + 'px', color: accent.icon } },
        React.createElement(Icon, { name: chapter.key, size: 48 })
      ),
      React.createElement('h2', { style: { fontSize: text['2xl'], fontWeight: weight.semi, marginBottom: space.xs + 'px', color: palette.text } }, chapter.title),
      React.createElement('p', { style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.relaxed, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' } }, chapter.description),
      hasIntro && React.createElement('p', { style: { fontSize: text.sm, color: accent.icon, marginTop: space.md + 'px', lineHeight: leading.relaxed, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', fontStyle: 'italic' } }, introText)
    ),

    demoMode && React.createElement('div', {
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        marginBottom: space.md + 'px',
        background: palette.sand + '15',
        borderRadius: radius.sm,
        border: '1px solid ' + palette.sand + '25',
        fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed,
      }
    }, tr('demo.readOnlyHint')),

    // Ankunftsmoment — calm acknowledgment on first data entry
    !demoMode && showAnkunft && React.createElement('div', {
      style: {
        textAlign: 'center', padding: space.md + 'px ' + space.lg + 'px',
        marginBottom: space.md + 'px',
        background: palette.sageDew || palette.sage + '08',
        borderRadius: radius.md,
        border: '1px solid ' + palette.sage + '25',
        animation: 'fadeIn 0.8s ease',
      }
    },
      React.createElement('div', {
        style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed, fontStyle: 'italic' }
      }, tr('ankunft.' + chapter.key))
    ),

    // Living mirror layer — life sentence + mirror cards
    React.createElement(MirrorCards, { chapterKey: chapter.key, data: data, allData: allData, palette: palette, t: tr }),

    // Notfallübergabe — calm structured summary when enough data is present
    isNotfall && showSummary && (() => {
      const sections = [];
      if (data.emergencyContact) {
        const rows = [data.emergencyContact];
        if (data.emergencyPhone) rows.push(data.emergencyPhone);
        sections.push({ title: tr('notfallSummary.handoverContact'), rows: rows });
      }
      const medRows = [];
      if (hasBlood) medRows.push(tr('notfallSummary.bloodType') + ': ' + data.bloodType);
      if (data.allergies) medRows.push(tr('notfallSummary.handoverAllergies'));
      if (data.medications) medRows.push(tr('notfallSummary.handoverMedications'));
      if (data.chronicDiseases) medRows.push(tr('notfallSummary.handoverChronic'));
      if (medRows.length) sections.push({ title: tr('notfallSummary.handoverMedical'), rows: medRows });
      const careRows = [];
      if (data.doctor) careRows.push(data.doctor + (data.doctorPhone ? ' · ' + data.doctorPhone : ''));
      if (data.hospital) careRows.push(data.hospital);
      if (careRows.length) sections.push({ title: tr('notfallSummary.handoverCare'), rows: careRows });
      const provRows = [];
      if (data.patientenverfuegung && data.patientenverfuegung !== 'no') provRows.push(tr('notfallSummary.patientenverfuegung'));
      if (data.vorsorgeauftrag && data.vorsorgeauftrag !== 'no') provRows.push(tr('notfallSummary.vorsorgeauftrag'));
      if (data.bestattungswuensche && data.bestattungswuensche !== 'no') provRows.push(tr('notfallSummary.bestattungswuensche'));
      if (provRows.length) sections.push({ title: tr('notfallSummary.handoverProvision'), rows: provRows });
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('notfallSummary.handoverIntro')),
        ...sections.map((sec, i) =>
          React.createElement('div', { key: i, style: { marginBottom: i < sections.length - 1 ? space.sm + 'px' : 0 } },
            React.createElement('div', {
              style: { fontSize: text.xs, color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: space.xs }
            }, sec.title),
            ...sec.rows.map((row, j) =>
              React.createElement('div', { key: j, style: { fontSize: text.body, color: palette.text, lineHeight: leading.relaxed } }, row)
            )
          )
        )
      );
    })(),

    // Notfallkarte export — quiet text link (below mirror cards)
    isNotfall && hasMedical && React.createElement('div', {
      style: { marginBottom: space.md }
    },
      React.createElement('span', {
        onClick: handleSaveCard,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter') handleSaveCard(); },
        style: {
          fontSize: text.sm, color: palette.mid, cursor: 'pointer', letterSpacing: '0.2px',
          borderBottom: '1px solid ' + palette.border,
          paddingBottom: '1px',
        }
      }, '□ ' + tr('notfallSummary.printCard'))
    ),

    // Versicherungsübersicht — coverage overview when at least one field is filled
    chapter.key === 'versicherungen' && (() => {
      const areas = [
        { key: 'kvg', fields: ['kkInsurer', 'kkModel', 'kkPremium', 'franchise', 'kkCardNumber'] },
        { key: 'bvg', fields: ['bvgInsurer', 'bvgContribution'] },
        { key: 'uvg', fields: ['uvg'] },
        { key: 'haftpflicht', fields: ['liabilityInsurance', 'liabilityAmount'] },
        { key: 'hausrat', fields: ['householdInsurance', 'householdInsuranceAmount'] },
        { key: 'reise', fields: ['travelInsurance'] },
        { key: 'cyber', fields: ['cyberInsurance'] },
        { key: 'fahrzeug', fields: ['autoInsurance', 'autoInsuranceAmount'] },
        { key: 'ahv', fields: ['ahvContribution'] },
      ];
      const hasAny = areas.some(a => a.fields.some(f => data[f]));
      if (!hasAny) return null;
      const erfasst = tr('versicherungsübersicht.erfasst');
      const nicht = tr('versicherungsübersicht.nichtErfasst');
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('versicherungsübersicht.intro')),
        ...areas.map((area, i) => {
          const filled = area.fields.some(f => data[f]);
          return React.createElement('div', {
            key: i,
            style: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < areas.length - 1 ? '1px solid ' + palette.border + '33' : 'none',
            }
          },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('versicherungsübersicht.' + area.key)),
            React.createElement('span', {
              style: { fontSize: text.sm, color: filled ? palette.sageDeep || palette.sage : palette.mid, fontStyle: filled ? 'normal' : 'italic' }
            }, filled ? erfasst : nicht)
          );
        })
      );
    })(),

    // Behörden-Zeitstatus — temporal overview of official matters
    chapter.key === 'behoerden' && (() => {
      const rows = [];
      if (data.taxFilingDeadline) {
        const deadline = new Date(data.taxFilingDeadline);
        const now = new Date();
        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        let relative;
        if (diffDays === 0) relative = tr('behördenStatus.today');
        else if (diffDays > 0 && diffDays < 60) relative = tr('behördenStatus.inDays').replace('{n}', diffDays);
        else if (diffDays >= 60) relative = tr('behördenStatus.inMonths').replace('{n}', Math.round(diffDays / 30));
        else if (diffDays > -60) relative = tr('behördenStatus.agoDays').replace('{n}', Math.abs(diffDays));
        else relative = tr('behördenStatus.ago').replace('{n}', Math.round(Math.abs(diffDays) / 30));
        const formatted = deadline.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
        rows.push({ label: tr('behördenStatus.taxDeadline'), value: formatted + ' (' + relative + ')' });
      }
      if (data.pendingTaxReturns) rows.push({ label: tr('behördenStatus.pendingReturns'), value: data.pendingTaxReturns });
      if (data.betreibungsStatus) {
        const opts = { none: tr('chapters.behoerden.fields.betreibungsStatus.options.none') || data.betreibungsStatus, entries: tr('chapters.behoerden.fields.betreibungsStatus.options.entries') || data.betreibungsStatus, unknown: tr('chapters.behoerden.fields.betreibungsStatus.options.unknown') || data.betreibungsStatus };
        rows.push({ label: tr('behördenStatus.betreibung'), value: opts[data.betreibungsStatus] || data.betreibungsStatus });
      }
      if (data.courtCases) {
        const val = data.courtCases === 'yes' ? (tr('chapters.behoerden.fields.courtCases.options.yes') || 'Ja') : (tr('chapters.behoerden.fields.courtCases.options.no') || 'Nein');
        rows.push({ label: tr('behördenStatus.courtCases'), value: val });
      }
      if (data.willMade) {
        const wOpts = { no: tr('chapters.behoerden.fields.willMade.options.no'), handwritten: tr('chapters.behoerden.fields.willMade.options.handwritten'), public: tr('chapters.behoerden.fields.willMade.options.public'), inProgress: tr('chapters.behoerden.fields.willMade.options.inProgress') };
        rows.push({ label: tr('behördenStatus.will'), value: wOpts[data.willMade] || data.willMade });
      }
      if (data.legalRepresentative) rows.push({ label: tr('behördenStatus.legalRep'), value: data.legalRepresentative });
      if (rows.length === 0) return null;
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('behördenStatus.intro')),
        ...rows.map((row, i) =>
          React.createElement('div', {
            key: i,
            style: {
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '6px 0',
              borderBottom: i < rows.length - 1 ? '1px solid ' + palette.border + '33' : 'none',
            }
          },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, row.label),
            React.createElement('span', { style: { fontSize: text.sm, color: palette.mid, textAlign: 'right', maxWidth: '55%' } }, row.value)
          )
        )
      );
    })(),

    // Wohnkostenanteil — housing cost share when both costs and income are recorded
    chapter.key === 'wohnen' && allData && (() => {
      const rent = parseFloat(data.rentAmount) || 0;
      const util = parseFloat(data.utilities) || 0;
      const wohnkosten = rent + util;
      if (wohnkosten <= 0) return null;
      const fin = allData.finanzen || {};
      const income = (parseFloat(fin.monthlyIncome) || 0) + (parseFloat(fin.familienzulagen) || 0) + (parseFloat(fin.alimenteReceived) || 0);
      if (income <= 0) return null;
      const pct = ((wohnkosten / income) * 100).toFixed(1).replace(/\.0$/, '');
      const fmt = (v) => Math.round(v).toLocaleString(undefined, { minimumFractionDigits: 0 });
      return React.createElement('div', {
        style: {
          marginBottom: space.lg + 'px',
          padding: space.md + 'px',
          background: palette.surface,
          border: '1px solid ' + palette.border + '66',
          borderRadius: radius.md,
        }
      },
        React.createElement('p', {
          style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed }
        }, tr('wohnkostenanteil.intro')),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border + '33' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('wohnkostenanteil.housing')),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + fmt(wohnkosten) + ' ' + tr('wohnkostenanteil.perMonth'))
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border + '33' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, tr('wohnkostenanteil.income')),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + fmt(income) + ' ' + tr('wohnkostenanteil.perMonth'))
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0' } },
          React.createElement('span', { style: { fontSize: text.body, color: palette.text, fontWeight: weight.medium } }, tr('wohnkostenanteil.share')),
          React.createElement('span', { style: { fontSize: text.body, color: palette.text, fontWeight: weight.medium } }, pct + ' %')
        )
      );
    })(),

    // ─── Contextual orientation hints (Helvetia layer) ──────
    // IPV: shown in finanzen when income + canton exist
    chapter.key === 'finanzen' && allData && allData.finanzen?.monthlyIncome && allData.basis?.canton &&
      React.createElement('div', {
        style: {
          marginBottom: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sageMist || (palette.sage + '10'), borderRadius: radius.sm,
          border: '1px solid ' + palette.sage + '25',
          borderLeft: '3px solid ' + palette.sage + '50',
          fontSize: text.sm, color: palette.sageDeep || palette.sage, lineHeight: leading.relaxed,
        }
      }, '○ ' + tr('orientation.contextIpv')),

    // Familienzulagen: shown in basis when children exist
    chapter.key === 'basis' && allData && allData.basis?.household?.children?.length > 0 &&
      React.createElement('div', {
        style: {
          marginBottom: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sageMist || (palette.sage + '10'), borderRadius: radius.sm,
          border: '1px solid ' + palette.sage + '25',
          borderLeft: '3px solid ' + palette.sage + '50',
          fontSize: text.sm, color: palette.sageDeep || palette.sage, lineHeight: leading.relaxed,
        }
      }, '○ ' + tr('orientation.contextFamilienzulagen')),

    // "Was Du davon hast" — shows which tools benefit from this chapter's data
    (() => {
      const benefitsKey = 'chapters.' + chapter.key + '.benefits';
      const benefits = tr(benefitsKey);
      if (benefits === benefitsKey || !Array.isArray(benefits)) return null;
      return React.createElement('div', {
        style: {
          marginBottom: space.md + 'px',
          padding: space.sm + 'px ' + space.md + 'px',
          background: palette.sand + '0C',
          borderRadius: radius.sm,
          border: '1px solid ' + palette.sand + '20',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
        }
      },
        React.createElement('span', {
          style: { fontSize: text.xs, color: palette.mid, marginRight: '2px' }
        }, tr('chapterView.benefitsLabel')),
        benefits.map((b, i) =>
          React.createElement('span', {
            key: i,
            style: {
              fontSize: text.xs, color: palette.sage,
              padding: '2px 8px',
              background: palette.sage + '0D',
              borderRadius: radius.sm,
              whiteSpace: 'nowrap',
            }
          }, '→ ' + b)
        )
      );
    })(),

    // Tabs
    React.createElement('div', { style: { display: 'flex', gap: space.sm + 'px', marginBottom: space.lg + 'px', borderBottom: '1px solid ' + palette.border, paddingBottom: space.md + 'px' } },
      React.createElement('button', {
        onClick: () => setExpandedSection('fields'),
        style: {
          padding: space.sm + 'px ' + space.md + 'px',
          background: expandedSection === 'fields' ? palette.sand : 'transparent',
          color: expandedSection === 'fields' ? '#000' : palette.text,
          border: 'none',
          borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
          cursor: 'pointer',
          fontWeight: weight.semi,
          fontSize: text.sm
        }
      }, tr('chapterView.fields')),
      React.createElement('button', {
        onClick: () => setExpandedSection('documents'),
        style: {
          padding: space.sm + 'px ' + space.md + 'px',
          background: expandedSection === 'documents' ? palette.sand : 'transparent',
          color: expandedSection === 'documents' ? '#000' : palette.text,
          border: 'none',
          borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
          cursor: 'pointer',
          fontWeight: weight.semi,
          fontSize: text.sm
        }
      }, tr('chapterView.documents'))
    ),

    // Fields Tab
    expandedSection === 'fields' && React.createElement('div', null,
      filledCount === 0 && React.createElement('div', { style: { padding: space.lg + 'px', background: palette.sageMist || palette.up, borderRadius: radius.md, border: '1px solid ' + palette.sage + '22', textAlign: 'center', marginBottom: space.lg + 'px' } },
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyState'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyState'); })()
        ),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 10px 0' } },
          (() => { const k = 'chapters.' + chapter.key + '.emptyStateHint'; const v = tr(k); return v !== k ? v : tr('chapterView.emptyStateHint'); })()
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: text.xs, color: palette.sage, opacity: 0.8 } },
          React.createElement('svg', { width: '11', height: '11', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' },
            React.createElement('rect', { x: '4', y: '7', width: '8', height: '7', rx: '1' }),
            React.createElement('path', { d: 'M 6 7 V 5 a 2 2 0 0 1 4 0 V 7' })
          ),
          tr('trust.chapterTrust')
        )
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 16px' } },
        chapter.fields.filter(f => !f.secondary).map((field, idx, primaryFields) => {
          const elements = [];
          if (field.section) {
            const isFirst = idx === 0 || !primaryFields.slice(0, idx).some(f => f.section);
            elements.push(
              React.createElement('div', {
                key: 'section-' + field.k,
                role: 'presentation',
                'aria-label': field.section,
                style: {
                  gridColumn: '1 / -1',
                  marginTop: isFirst ? 0 : space['2xl'] + 'px',
                  paddingTop: isFirst ? 0 : space.lg + 'px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.sage + '18',
                  fontSize: text.sm,
                  fontWeight: weight.medium,
                  color: palette.sageDeep || palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: space.sm + 'px',
                }
              }, field.section)
            );
            if (field.sectionIntro) {
              elements.push(
                React.createElement('p', {
                  key: 'sectionIntro-' + field.k,
                  style: {
                    gridColumn: '1 / -1',
                    fontSize: text.sm,
                    color: palette.sageDeep || palette.sage,
                    fontStyle: 'italic',
                    lineHeight: leading.relaxed,
                    margin: '0 0 12px 0',
                    maxWidth: '420px',
                    background: palette.sageMist || 'transparent',
                    padding: space.sm + 'px ' + space.md + 'px',
                    borderRadius: radius.sm,
                    borderLeft: '3px solid ' + palette.sage + '40',
                  }
                }, field.sectionIntro)
              );
            }
          }
          elements.push(renderField(field));
          const crosslinkBtn = (key, view, textKey) => onNavigate && elements.push(
            React.createElement('button', {
              key: 'crosslink-' + key,
              onClick: () => onNavigate(view),
              style: {
                gridColumn: '1 / -1',
                background: palette.sageMist || palette.up,
                border: 'none',
                borderRadius: radius.sm,
                padding: space.sm + 'px ' + space.md + 'px',
                fontSize: text.sm,
                color: palette.sageDeep || palette.mid,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                marginBottom: space.sm + 'px',
              }
            }, t(textKey))
          );
          if (field.k === 'kkPremium' && chapter.key === 'versicherungen') {
            crosslinkBtn('ipv', 'premium', 'nav.crosslink.ipvHint');
          }
          if (field.k === 'kkInsurer' && chapter.key === 'versicherungen') {
            crosslinkBtn('praemien', 'praemien', 'nav.crosslink.praemienHint');
          }
          if (field.k === 'bvgContribution' && chapter.key === 'versicherungen') {
            crosslinkBtn('vorsorge', 'vorsorge', 'nav.crosslink.vorsorgeHint');
          }
          if (field.k === 'rentAmount' && chapter.key === 'wohnen') {
            crosslinkBtn('budget', 'sync', 'nav.crosslink.budgetHint');
          }
          if (field.k === 'jobTitle' && chapter.key === 'ausbildung') {
            const kanton = allData && allData.basis && allData.basis.canton;
            if (kanton && kantonHatMindestlohn(kanton)) {
              crosslinkBtn('mindestlohn', 'finanzen', 'nav.crosslink.mindestlohnHint');
            }
          }
          if (field.k === 'monthlyIncome' && chapter.key === 'finanzen') {
            crosslinkBtn('tax', 'tax', 'nav.crosslink.taxHint');
            crosslinkBtn('ipvIncome', 'premium', 'nav.crosslink.ipvFromIncome');
            crosslinkBtn('sozialhilfe', 'sozialhilfe', 'nav.crosslink.sozialhilfeHint');
            const kanton = allData && allData.basis && allData.basis.canton;
            if (kanton && kantonHatMindestlohn(kanton)) {
              const lohn = parseFloat(data[field.k]) || 0;
              if (lohn > 0) {
                const result = pruefeLohn(lohn, kanton);
                if (result.status === 'unterMindestlohn') {
                  elements.push(
                    React.createElement('div', {
                      key: 'mindestlohn-warnung',
                      style: {
                        gridColumn: '1 / -1',
                        background: palette.rose + '15',
                        border: '1px solid ' + palette.rose + '40',
                        borderLeft: '3px solid ' + palette.rose,
                        borderRadius: radius.sm,
                        padding: space.sm + 'px ' + space.md + 'px',
                        fontSize: text.sm,
                        color: palette.rose,
                        lineHeight: leading.relaxed,
                        marginBottom: space.sm + 'px',
                      }
                    },
                      t('lohnCheck.unterMindestlohn')
                        .replace('{kanton}', kanton)
                        .replace('{mindestStunde}', result.mindestStunde.toFixed(2))
                        .replace('{lohnStunde}', result.lohnStunde.toFixed(2))
                    )
                  );
                }
              }
            }
          }
          return elements;
        })
      ),

      // Progressive disclosure toggle
      hasSecondaryFields && React.createElement('div', {
        style: {
          marginTop: space.lg,
          paddingTop: '16px',
          borderTop: '1px solid ' + palette.border,
          textAlign: 'center',
        }
      },
        React.createElement('button', {
          onClick: toggleSecondary,
          'aria-expanded': showSecondary,
          style: {
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: text.sm, color: palette.mid, letterSpacing: '0.3px',
            padding: '8px 16px',
            fontFamily: fontFamily,
          }
        },
          showSecondary
            ? '○ ' + tr('chapterView.disclosure.' + chapter.key + '.less')
            : '○ ' + tr('chapterView.disclosure.' + chapter.key + '.more')
        ),
        !showSecondary && secondaryHasData && React.createElement('div', {
          style: { fontSize: text.xs, color: palette.sage, marginTop: space.xs }
        }, tr('chapterView.disclosure.' + chapter.key + '.hint'))
      ),

      // Secondary fields
      hasSecondaryFields && showSecondary && React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 16px', marginTop: space.sm }
      },
        chapter.fields.filter(f => f.secondary).map((field, idx, secFields) => {
          const elements = [];
          if (field.section) {
            const isFirst = idx === 0 || !secFields.slice(0, idx).some(f => f.section);
            elements.push(
              React.createElement('div', {
                key: 'section-' + field.k,
                role: 'presentation',
                'aria-label': field.section,
                style: {
                  gridColumn: '1 / -1',
                  marginTop: isFirst ? '8px' : space['2xl'] + 'px',
                  paddingTop: isFirst ? 0 : space.lg + 'px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.sage + '18',
                  fontSize: text.sm,
                  fontWeight: weight.medium,
                  color: palette.sageDeep || palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: space.sm + 'px',
                }
              }, field.section)
            );
            if (field.sectionIntro) {
              elements.push(
                React.createElement('p', {
                  key: 'sectionIntro-' + field.k,
                  style: {
                    gridColumn: '1 / -1',
                    fontSize: text.sm,
                    color: palette.sageDeep || palette.sage,
                    fontStyle: 'italic',
                    lineHeight: leading.relaxed,
                    margin: '0 0 12px 0',
                    maxWidth: '420px',
                    background: palette.sageMist || 'transparent',
                    padding: space.sm + 'px ' + space.md + 'px',
                    borderRadius: radius.sm,
                    borderLeft: '3px solid ' + palette.sage + '40',
                  }
                }, field.sectionIntro)
              );
            }
          }
          elements.push(renderField(field));
          return elements;
        })
      )
    ),

    // Documents Tab
    expandedSection === 'documents' && chapter.docs && React.createElement('div', null,
      React.createElement('h3', { style: { fontSize: text.body, fontWeight: weight.semi, marginBottom: space.md } }, '↗ ' + tr('chapterView.upload')),

      // Upload Form
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, border: '2px dashed ' + palette.border } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' } },
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, display: 'block', marginBottom: space.sm - 2 } }, tr('chapterView.docType') + ' *'),
            React.createElement('select', {
              value: uploadType,
              onChange: (e) => setUploadType(e.target.value),
              style: { width: '100%', padding: '10px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
            },
              React.createElement('option', { value: '' }, tr('chapterView.selectOption')),
              chapter.docs.map((doc, idx) => React.createElement('option', { key: idx, value: doc.k }, doc.label))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, display: 'block', marginBottom: space.sm - 2 } }, tr('chapterView.expiryDate') + ' *'),
            React.createElement('input', {
              type: 'date',
              value: uploadExpiry,
              onChange: (e) => setUploadExpiry(e.target.value),
              style: { width: '100%', padding: '10px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
            }),
            uploadType && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs + 'px' } }, '○ ' + getFileExpiryHint(uploadType, tr))
          )
        ),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.surface, border: '2px dashed ' + palette.border, borderRadius: radius.sm, textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
          '□ ' + tr('chapterView.selectFile'),
          React.createElement('input', {
            type: 'file',
            onChange: (e) => setUploadFile(e.target.files?.[0]),
            style: { display: 'none' }
          })
        ),

        uploadError && React.createElement('div', { style: { padding: space.sm + 2, background: palette.rose + '22', border: '1px solid ' + palette.rose, borderRadius: radius.sm, color: palette.rose, fontSize: text.sm, marginBottom: space.sm + 4 } }, uploadError),

        uploadSuccess && React.createElement('div', { style: { padding: space.sm + 2, background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.sm, color: palette.sage, fontSize: text.sm, marginBottom: space.sm + 4 } }, '✓ ' + uploadSuccess),

        React.createElement('button', {
          onClick: () => {
            if (!uploadFile) { setUploadError(tr('chapterView.selectFile')); return; }
            if (!uploadType) { setUploadError(tr('chapterView.selectDocType')); return; }
            if (!uploadExpiry) { setUploadError(tr('chapterView.selectExpiry')); return; }
            setUploadError('');
            const reader = new FileReader();
            reader.onload = () => {
              try {
                onAddDocument({
                  type: uploadType,
                  fileName: uploadFile.name,
                  fileSize: (uploadFile.size / 1024).toFixed(1) + ' KB',
                  uploadDate: new Date().toLocaleDateString('de-CH'),
                  expiryDate: uploadExpiry,
                  status: 'active',
                  data: reader.result
                });
                runtimeEventBus.publish({
                  id: crypto.randomUUID(),
                  eventType: 'DOCUMENT_UPLOADED',
                  timestamp: new Date().toISOString(),
                  actor: 'user',
                  workflowId: 'document-tresor',
                });
                setUploadFile(null);
                setUploadType('');
                setUploadExpiry('');
              } catch (err) {
                setUploadError(tr('chapterView.uploadError') + ': ' + err.message);
              }
            };
            reader.readAsDataURL(uploadFile);
          },
          disabled: !uploadFile || !uploadType || !uploadExpiry,
          style: {
            width: '100%',
            padding: '10px',
            background: uploadFile && uploadType && uploadExpiry ? palette.sage : palette.mid,
            color: '#000',
            border: 'none',
            borderRadius: radius.sm,
            cursor: uploadFile && uploadType && uploadExpiry ? 'pointer' : 'not-allowed',
            fontWeight: weight.semi,
            fontSize: text.sm
          }
        }, '↗ ' + tr('chapterView.upload'))
      ),

      // Required documents list
      React.createElement('div', { style: { padding: space.sm + 4, background: palette.up, borderRadius: radius.sm } },
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm + 2 } }, '□ ' + tr('chapterView.requiredDocs')),
        React.createElement('ul', { style: { fontSize: text.sm, paddingLeft: '20px', margin: 0 } },
          chapter.docs.map((doc, idx) => React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc.label))
        )
      ),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: '12px', letterSpacing: '0.2px' } },
        tr('chapterView.trustDocuments')
      )
    ),

    // Chapter arrival — quiet rest moment when enough data is present
    (() => {
      const primaryFields = chapter.fields.filter(f => !f.secondary);
      const primaryFilled = primaryFields.filter(f => data[f.k]).length;
      const threshold = Math.ceil(primaryFields.length * 0.6);
      if (primaryFilled < threshold) return null;
      const allPrimaryFilled = primaryFilled === primaryFields.length;
      const ruheText = tr('ruhe.' + chapter.key);
      const stilleText = tr('stille.' + chapter.key);
      const hasRuhe = ruheText && ruheText !== 'ruhe.' + chapter.key;
      const hasStille = stilleText && stilleText !== 'stille.' + chapter.key;
      if (!hasRuhe && !hasStille) return null;
      return React.createElement('div', {
        style: {
          textAlign: 'center',
          paddingTop: space['2xl'] + 'px',
          paddingBottom: space.lg + 'px',
          marginTop: space.xl + 'px',
          borderTop: '1px solid ' + palette.border + '44',
        }
      },
        hasRuhe && !allPrimaryFilled && React.createElement('p', {
          style: {
            fontSize: text.sm,
            color: palette.mid,
            fontStyle: 'italic',
            letterSpacing: '0.3px',
            margin: 0,
          }
        }, ruheText),
        allPrimaryFilled && hasStille && React.createElement('div', {
          style: { animation: 'fadeIn 1s ease' }
        },
          React.createElement('p', {
            style: {
              fontSize: text.body,
              color: palette.text,
              fontStyle: 'italic',
              letterSpacing: '0.2px',
              margin: '0 0 ' + space.md + 'px 0',
              lineHeight: leading.relaxed,
            }
          }, stilleText),
          React.createElement('div', {
            style: { width: '32px', height: '1px', background: palette.border, margin: '0 auto' }
          })
        )
      );
    })()
  );
};

export default ChapterViewComplete;
