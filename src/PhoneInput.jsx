import React, { useState } from 'react';

export const PhoneInput = ({ palette, value, onChange, placeholder = '+41 XX XXX XX XX' }) => {
  const [focused, setFocused] = useState(false);

  const formatPhone = (val) => {
    if (!val) return '';
    const cleaned = val.replace(/\D/g, '');
    
    if (cleaned.startsWith('41')) {
      if (cleaned.length <= 2) return '+' + cleaned;
      if (cleaned.length <= 4) return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
      if (cleaned.length <= 7) return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
      if (cleaned.length <= 9) return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7);
      return '+' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7, 9) + ' ' + cleaned.slice(9);
    }
    
    if (cleaned.startsWith('0')) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 4) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
      if (cleaned.length <= 7) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
      if (cleaned.length <= 9) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7);
      return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7, 9) + ' ' + cleaned.slice(9);
    }
    
    return val;
  };

  const handleChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  return React.createElement('div', null,
    React.createElement('input', {
      type: 'tel',
      inputMode: 'numeric',
      value: value,
      onChange: handleChange,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      placeholder: placeholder,
      style: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '6px',
        border: focused ? '2px solid ' + palette.gold : '1px solid ' + palette.border,
        background: palette.up,
        color: palette.text,
        boxSizing: 'border-box',
        fontSize: '13px',
        fontFamily: 'DM Sans, monospace',
        transition: 'border 0.2s'
      }
    }),
    React.createElement('div', { style: { fontSize: '10px', color: palette.mid, marginTop: '4px' } },
      '○ Format: +41 XX XXX XX XX oder 0XX XXX XX XX'
    )
  );
};

export default PhoneInput;
