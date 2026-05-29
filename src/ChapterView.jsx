import React, { useState, useEffect } from 'react';
import {
  validatePhone, validateAHV, validateEmail, validatePostalCode, validateCurrency, validateDate, getFileExpiryHint, getExpiryStatus, formatPhoneForDisplay, formatDateForDisplay, formatAHVOnInput, normalizeEmail, formatPhoneOnBlur
} from './validationUtils.js';
import { Icon } from './IconSystem.jsx';
import { runtimeEventBus } from './runtime/singleton.ts';
import { text, weight, leading, space, radius, shadow } from './config/tokens.js';

export const ChapterViewComplete = ({ palette, t, chapter, data, allData, onUpdate, onAddDocument }) => {
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
        setUploadSuccess('Dokument hinzugefügt');
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
      fontSize: text.body, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
    };

    const updateHousehold = (patch) => {
      const next = { ...household, ...patch };
      onUpdate('household', next);
    };

    return React.createElement('div', { key: 'household-fields', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 16px' } },

      // Adults
      React.createElement('div', { style: { marginBottom: '16px' } },
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
      React.createElement('div', { style: { marginBottom: '16px' } },
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
      React.createElement('div', { style: { gridColumn: '1 / -1', marginBottom: '16px' } },
        React.createElement('label', { style: hhLabel }, tr('chapters.basis.fields.household.children')),

        children.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' } },
          children.map((child, idx) =>
            React.createElement('div', { key: idx, style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              React.createElement('span', { style: { fontSize: text.sm, color: palette.mid, minWidth: '36px' } }, tr('chapters.basis.fields.household.childAge')),
              React.createElement('input', {
                type: 'number',
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
            fontFamily: 'DM Sans, sans-serif',
          }
        }, '+ ' + tr('chapters.basis.fields.household.addChild'))
      )
    );
  };

  const renderField = (field) => {
    if (field.type === 'household') return renderHouseholdFields();
    const value = data[field.k] || '';
    const error = errors[field.k];

    const baseStyle = { marginBottom: '20px' };

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
      fontFamily: 'DM Sans, sans-serif'
    };

    const errorStyle = {
      fontSize: text.xs,
      color: palette.rose,
      marginTop: space.xs
    };

    // Text Input
    if (field.type === 'text') {
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label + (field.required ? ' *' : '')),
        React.createElement('input', {
          type: 'text',
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          onBlur: (e) => handleFieldBlur(field.k, e.target.value),
          placeholder: field.placeholder || '',
          style: inputStyle
        }),
        field.hint && React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, '○ ' + field.hint),
        field.orientation && React.createElement('div', { style: { fontSize: '11px', color: palette.sage, marginTop: '4px', lineHeight: '1.5' } }, '○ ' + field.orientation),
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

      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
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
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
        React.createElement('input', {
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
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('input', {
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
              color: palette.mid, fontSize: '14px', padding: '4px', lineHeight: 1,
            }
          }, '✕')
        )
      );
    }

    // Currency
    if (field.type === 'currency') {
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
        React.createElement('div', { style: { display: 'flex', gap: '6px' } },
          React.createElement('span', { style: { padding: '10px 12px', background: palette.up, borderRadius: '6px', borderLeft: '1px solid ' + palette.border } }, 'CHF'),
          React.createElement('input', {
            type: 'number',
            value: value,
            onChange: (e) => handleFieldChange(field.k, e.target.value),
            placeholder: '0.00',
            step: '0.01',
            style: { ...inputStyle, flex: 1 }
          })
        ),
        field.hint && React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, '○ ' + field.hint),
        field.orientation && React.createElement('div', { style: { fontSize: '11px', color: palette.sage, marginTop: '4px', lineHeight: '1.5' } }, '○ ' + field.orientation)
      );
    }

    // Select — supports both {value, label} objects and plain strings
    if (field.type === 'select') {
      const options = (field.options || []).map(opt => {
        if (typeof opt === 'object' && opt.value !== undefined) return opt;
        return { value: opt, label: opt };
      });

      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
        React.createElement('select', {
          value: value,
          onChange: (e) => handleFieldChange(field.k, e.target.value),
          style: { ...inputStyle, cursor: 'pointer' }
        },
          React.createElement('option', { value: '' }, tr('chapterView.selectOption')),
          options.map((opt, idx) => React.createElement('option', { key: idx, value: opt.value }, opt.label))
        ),
        field.hint && React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, '○ ' + field.hint),
        field.orientation && React.createElement('div', { style: { fontSize: '11px', color: palette.sage, marginTop: '4px', lineHeight: '1.5' } }, '○ ' + field.orientation)
      );
    }

    // Textarea
    if (field.type === 'textarea') {
      return React.createElement('div', { key: field.k, style: baseStyle },
        React.createElement('label', { style: labelStyle }, field.label),
        React.createElement('textarea', {
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
    const lines = [
      '══════════════════════════════════',
      '  ' + tr('notfallSummary.cardTitle').toUpperCase(),
      '══════════════════════════════════',
      '',
    ];
    if (data.emergencyContact) {
      lines.push('◎ ' + tr('notfallSummary.contact') + ':');
      lines.push('  ' + data.emergencyContact);
      if (data.emergencyPhone) lines.push('  ' + data.emergencyPhone);
      lines.push('');
    }
    if (data.bloodType && data.bloodType !== 'unknown') {
      lines.push('◉ ' + tr('notfallSummary.bloodType') + ': ' + data.bloodType);
      lines.push('');
    }
    if (data.allergies) {
      lines.push('!! ' + tr('chapters.notfall.fields.allergies') + ':');
      lines.push('  ' + data.allergies);
      lines.push('');
    }
    if (data.medications) {
      lines.push('Rx ' + tr('chapters.notfall.fields.medications') + ':');
      lines.push('  ' + data.medications);
      lines.push('');
    }
    if (data.doctor) {
      lines.push('○ ' + tr('chapters.notfall.fields.doctor') + ': ' + data.doctor);
      if (data.doctorPhone) lines.push('  ' + data.doctorPhone);
      lines.push('');
    }
    if (data.hospital) {
      lines.push('⌂ ' + tr('chapters.notfall.fields.hospital') + ': ' + data.hospital);
      lines.push('');
    }
    lines.push('══════════════════════════════════');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tr('notfallSummary.cardTitle').replace(/\s/g, '_') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const bloodTypeColors = {
    '0+': palette.rose, '0-': palette.rose,
    'A+': palette.gold, 'A-': palette.gold,
    'B+': palette.sky, 'B-': palette.sky,
    'AB+': palette.sage, 'AB-': palette.sage,
  };

  return React.createElement('div', { style: { background: palette.surface, padding: space.md + 4 + 'px ' + space.md + 'px', borderRadius: radius.md, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
    // Header
    React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.xs, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: chapter.key, size: 20 }), chapter.title),
      React.createElement('p', { style: { fontSize: text.body, color: palette.mid, margin: 0, lineHeight: leading.normal } }, chapter.description),
      hasIntro && React.createElement('p', { style: { fontSize: text.body, color: palette.mid, marginTop: space.sm, fontStyle: 'italic', lineHeight: leading.normal } }, introText)
    ),

    // Quiet emergency summary — only when data exists
    showSummary && React.createElement('div', {
      style: { marginBottom: '20px', padding: '16px', background: palette.up, borderRadius: '8px', border: '1px solid ' + palette.border }
    },
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' } },

        // Contact card
        hasContact && React.createElement('div', {
          style: { flex: '1 1 180px', padding: '12px', background: palette.surface, borderRadius: '6px', border: '1px solid ' + palette.border }
        },
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: space.sm - 2, letterSpacing: '0.3px' } }, tr('notfallSummary.contact')),
          React.createElement('div', { style: { fontSize: text.body, fontWeight: weight.medium } }, data.emergencyContact),
          data.emergencyPhone && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '2px' } }, data.emergencyPhone)
        ),

        // Blood type
        hasBlood && React.createElement('div', {
          style: {
            flex: '0 0 auto', padding: '12px 20px', background: (bloodTypeColors[data.bloodType] || palette.mid) + '15',
            borderRadius: '6px', border: '1px solid ' + (bloodTypeColors[data.bloodType] || palette.border), textAlign: 'center'
          }
        },
          React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px', letterSpacing: '0.3px' } }, tr('notfallSummary.bloodType')),
          React.createElement('div', { style: { fontSize: '24px', fontWeight: '600', color: bloodTypeColors[data.bloodType] || palette.text } }, data.bloodType)
        )
      ),

      // Vorsorge overview
      hasVorsorge && React.createElement('div', {
        style: { marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }
      },
        vorsorgeKeys.filter(k => data[k]).map(k =>
          React.createElement('div', {
            key: k,
            style: {
              fontSize: '11px', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.2px',
              background: data[k] === 'yes' ? palette.sage + '20' : palette.up,
              color: data[k] === 'yes' ? palette.sage : palette.mid,
              border: '1px solid ' + (data[k] === 'yes' ? palette.sage + '40' : palette.border),
            }
          },
            tr('notfallSummary.' + k) + ' — ' + (data[k] === 'yes' ? tr('notfallSummary.done') : tr('notfallSummary.open'))
          )
        )
      ),

      // Save card — quiet text link
      hasMedical && React.createElement('div', {
        style: { marginTop: '14px', paddingTop: '12px', borderTop: '1px solid ' + palette.border }
      },
        React.createElement('span', {
          onClick: handleSaveCard,
          role: 'button',
          tabIndex: 0,
          onKeyDown: (e) => { if (e.key === 'Enter') handleSaveCard(); },
          style: {
            fontSize: '11px', color: palette.mid, cursor: 'pointer', letterSpacing: '0.2px',
            borderBottom: '1px solid ' + palette.border,
            paddingBottom: '1px',
          }
        }, '□ ' + tr('notfallSummary.saveCard'))
      )
    ),

    // ─── Contextual orientation hints (Helvetia layer) ──────
    // IPV: shown in finanzen when income + canton exist
    chapter.key === 'finanzen' && allData && allData.finanzen?.monthlyIncome && allData.basis?.canton &&
      React.createElement('div', {
        style: {
          marginBottom: '16px', padding: '12px 14px',
          background: palette.sage + '10', borderRadius: '8px',
          border: '1px solid ' + palette.sage + '30',
          fontSize: text.sm, color: palette.sage, lineHeight: leading.relaxed,
        }
      }, '○ ' + tr('orientation.contextIpv')),

    // Familienzulagen: shown in basis when children exist
    chapter.key === 'basis' && allData && allData.basis?.household?.children?.length > 0 &&
      React.createElement('div', {
        style: {
          marginBottom: '16px', padding: '12px 14px',
          background: palette.sage + '10', borderRadius: '8px',
          border: '1px solid ' + palette.sage + '30',
          fontSize: text.sm, color: palette.sage, lineHeight: leading.relaxed,
        }
      }, '○ ' + tr('orientation.contextFamilienzulagen')),

    // Tabs
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid ' + palette.border, paddingBottom: '12px' } },
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
      filledCount === 0 && React.createElement('div', { style: { padding: '24px', background: palette.up, borderRadius: '8px', border: '1px solid ' + palette.border, textAlign: 'center', marginBottom: '20px' } },
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, tr('chapterView.emptyState')),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, tr('chapterView.emptyStateHint'))
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
                  marginTop: isFirst ? 0 : '36px',
                  paddingTop: isFirst ? 0 : '20px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.border,
                  fontSize: '13px',
                  fontWeight: '500',
                  color: palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: '8px',
                }
              }, field.section)
            );
          }
          elements.push(renderField(field));
          return elements;
        })
      ),

      // Progressive disclosure toggle
      hasSecondaryFields && React.createElement('div', {
        style: {
          marginTop: '24px',
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
            fontFamily: 'DM Sans, sans-serif',
          }
        },
          showSecondary
            ? '○ ' + tr('chapterView.disclosure.' + chapter.key + '.less')
            : '○ ' + tr('chapterView.disclosure.' + chapter.key + '.more')
        ),
        !showSecondary && secondaryHasData && React.createElement('div', {
          style: { fontSize: '10px', color: palette.sage, marginTop: '4px' }
        }, tr('chapterView.disclosure.' + chapter.key + '.hint'))
      ),

      // Secondary fields
      hasSecondaryFields && showSecondary && React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 16px', marginTop: '8px' }
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
                  marginTop: isFirst ? '8px' : '36px',
                  paddingTop: isFirst ? 0 : '20px',
                  borderTop: isFirst ? 'none' : '1px solid ' + palette.border,
                  fontSize: '13px',
                  fontWeight: '500',
                  color: palette.mid,
                  letterSpacing: '0.4px',
                  marginBottom: '8px',
                }
              }, field.section)
            );
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
      React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', marginBottom: '16px', border: '2px dashed ' + palette.border } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' } },
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: text.sm, fontWeight: weight.medium, color: palette.mid, display: 'block', marginBottom: space.sm - 2 } }, tr('chapterView.docType') + ' *'),
            React.createElement('select', {
              value: uploadType,
              onChange: (e) => setUploadType(e.target.value),
              style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
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
              style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, boxSizing: 'border-box' }
            }),
            uploadType && React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginTop: '4px' } }, '○ ' + getFileExpiryHint(uploadType, tr))
          )
        ),

        React.createElement('label', { style: { display: 'block', padding: '20px', background: palette.surface, border: '2px dashed ' + palette.border, borderRadius: '6px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px' } },
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
            borderRadius: '6px',
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
          chapter.docs.map((doc, idx) => React.createElement('li', { key: idx, style: { marginBottom: '4px' } }, doc.label))
        )
      ),
      React.createElement('div', { style: { fontSize: '10px', color: palette.mid, marginTop: '12px', letterSpacing: '0.2px' } },
        tr('chapterView.trustDocuments')
      )
    )
  );
};

export default ChapterViewComplete;
