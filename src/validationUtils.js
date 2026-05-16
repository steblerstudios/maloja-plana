// Swiss validation functions — i18n-aware

export const validatePhone = (phone, t) => {
  if (!phone) return { isValid: true, error: '' };
  const cleaned = phone.replace(/[\s\-\(\)\.\/]/g, '');
  const isValid = /^(\+41\d{9}|0041\d{9}|0\d{9})$/.test(cleaned);
  return {
    isValid,
    error: !isValid ? (t ? t('validation.invalidPhone') : 'Invalid phone number (Format: +41 XX XXX XX XX)') : ''
  };
};

export const formatPhoneOnBlur = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)\.\/]/g, '');
  let digits;
  if (cleaned.startsWith('+41')) digits = cleaned.slice(3);
  else if (cleaned.startsWith('0041')) digits = cleaned.slice(4);
  else if (cleaned.startsWith('0')) digits = cleaned.slice(1);
  else return phone;
  if (digits.length !== 9) return phone;
  return '+41 ' + digits.slice(0, 2) + ' ' + digits.slice(2, 5) + ' ' + digits.slice(5, 7) + ' ' + digits.slice(7, 9);
};

export const validateAHV = (ahv, t) => {
  if (!ahv) return { isValid: true, error: '' };
  const regex = /^756\.\d{4}\.\d{4}\.\d{2}$/;
  const isValid = regex.test(ahv);
  return {
    isValid,
    error: !isValid ? (t ? t('validation.invalidAhv') : 'Invalid AHV number (Format: 756.XXXX.XXXX.XX)') : ''
  };
};

export const formatAHVOnInput = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return digits.slice(0, 3) + '.' + digits.slice(3);
  if (digits.length <= 11) return digits.slice(0, 3) + '.' + digits.slice(3, 7) + '.' + digits.slice(7);
  return digits.slice(0, 3) + '.' + digits.slice(3, 7) + '.' + digits.slice(7, 11) + '.' + digits.slice(11);
};

export const validateEmail = (email, t) => {
  if (!email) return { isValid: true, error: '' };
  const normalized = email.trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(normalized);
  return {
    isValid,
    error: !isValid ? (t ? t('validation.invalidEmail') : 'Invalid email address') : ''
  };
};

export const normalizeEmail = (email) => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

export const validatePostalCode = (code, country = 'CH', t) => {
  let regex;
  if (country === 'CH') regex = /^[1-9]\d{3}$/;
  else if (country === 'DE') regex = /^\d{5}$/;
  else if (country === 'AT') regex = /^\d{4}$/;
  else regex = /^.{3,6}$/;

  const isValid = regex.test(code);
  return {
    isValid,
    error: !isValid ? (t ? t('validation.invalidPostalCode') : 'Invalid postal code') : ''
  };
};

export const validateCurrency = (value, t) => {
  const num = Number(value);
  const isValid = !isNaN(num) && num >= 0;
  return {
    isValid,
    value: isValid ? num : 0,
    error: !isValid ? (t ? t('validation.invalidAmount') : 'Invalid amount') : ''
  };
};

export const validateDate = (date, t) => {
  if (!date) return { isValid: false, error: t ? t('validation.dateRequired') : 'Date required' };
  const d = new Date(date);
  const isValid = d instanceof Date && !isNaN(d);
  return {
    isValid,
    error: !isValid ? (t ? t('validation.invalidDate') : 'Invalid date') : ''
  };
};

export const validatePercentage = (value, t) => {
  const num = Number(value);
  const isValid = !isNaN(num) && num >= 0 && num <= 100;
  return {
    isValid,
    value: isValid ? num : 0,
    error: !isValid ? (t ? t('validation.percentRange') : 'Percentage must be between 0 and 100') : ''
  };
};

// Expiry date logic
export const getExpiryStatus = (expiryDate, t) => {
  if (!expiryDate) return { status: 'unknown', days: null, label: t ? t('validation.unknown') : 'Unknown' };

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { status: 'expired', days: diffDays, label: t ? t('validation.expired') : 'EXPIRED' };
  if (diffDays < 30) return { status: 'warning', days: diffDays, label: t ? t('validation.days', { count: diffDays }) : diffDays + ' days' };
  if (diffDays < 365) return { status: 'ok', days: diffDays, label: t ? t('validation.days', { count: diffDays }) : diffDays + ' days' };

  return { status: 'valid', days: diffDays, label: t ? t('validation.valid') : 'Valid' };
};

export const getFileExpiryHint = (documentType, t) => {
  // Document type keys → translation keys
  const hintKeys = {
    'IK-Auszug': 'expiryHints.ikExtract',
    'Betreibungsauszug': 'expiryHints.betreibung',
    'Lohnzettel': 'expiryHints.paySlip',
    'Kontoauszug': 'expiryHints.bankStatement',
    'Mietvertrag': 'expiryHints.lease',
    'Ausweis': 'expiryHints.idCard',
    'Pass': 'expiryHints.passport',
    'Diplom': 'expiryHints.diploma',
    'KK-Karte': 'expiryHints.kkCard',
    'Versicherungspolice': 'expiryHints.insurance',
  };
  const key = hintKeys[documentType];
  if (t && key) return t(key);
  return t ? t('expiryHints.unknown') : 'Validity unknown';
};

// Conditional Fields (which fields to show based on input)
export const getConditionalFields = (chapter, fieldKey, value) => {
  const conditions = {
    'mortgageStatus': (val) => val === 'fixedRate' || val === 'variable' ? ['mortgagePayment', 'mortgageRate', 'lender'] : [],
    'employmentType': (val) => val === 'selfEmployed' || val === 'freelance' ? ['businessName', 'businessNumber'] : [],
    'investmentFunds': (val) => val !== 'no' ? ['investmentAmount', 'brokerName'] : [],
    'bvgInsurer': (val) => val ? ['bvgContribution', 'bvgBalance'] : [],
    'willMade': (val) => val !== 'no' ? ['willDate', 'lawyerName'] : [],
    'courtCases': (val) => val === 'yes' ? ['caseDescription', 'courtName'] : [],
  };

  return conditions[fieldKey]?.(value) || [];
};

// Formatting for display
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  return formatPhoneOnBlur(phone) || phone;
};

export const formatAHVForDisplay = (ahv) => {
  if (!ahv) return '';
  return ahv.replace(/(\d{3})(\d{4})(\d{4})(\d{2})/, '$1.$2.$3.$4');
};

export const formatCurrencyForDisplay = (value) => {
  const num = Number(value || 0);
  return 'CHF ' + num.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const formatDateForDisplay = (date, locale) => {
  if (!date) return '';
  const loc = locale || 'de-CH';
  return new Date(date).toLocaleDateString(loc);
};

// Build field with unit
export const buildFieldWithUnit = (value, unit) => {
  return value + ' ' + unit;
};
