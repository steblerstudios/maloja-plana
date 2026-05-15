// ─── Data Validation Layer ──────────────────────────────────
// Lightweight shape-checks for localStorage data.
// Never overwrites existing data on failure — returns
// { valid, errors, sanitized } so callers decide.

const CHAPTER_KEYS = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'];

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isString(v) {
  return typeof v === 'string';
}

function isISODate(v) {
  if (!isString(v)) return false;
  const d = new Date(v);
  return !isNaN(d.getTime());
}

/**
 * Validate or5_data shape.
 * Expected: { _version: number, _migratedAt: string, basis: {}, wohnen: {}, ... }
 * Legacy (v0): { basis: {}, wohnen: {}, ... } without _version
 */
export function validateData(data) {
  const errors = [];

  if (!isPlainObject(data)) {
    return { valid: false, errors: ['or5_data is not an object'], sanitized: {} };
  }

  if (data._version !== undefined && typeof data._version !== 'number') {
    errors.push('_version is not a number');
  }

  if (data._migratedAt !== undefined && !isISODate(data._migratedAt)) {
    errors.push('_migratedAt is not a valid ISO date');
  }

  for (const key of CHAPTER_KEYS) {
    if (data[key] !== undefined && !isPlainObject(data[key])) {
      errors.push('chapter "' + key + '" is not an object');
    }
  }

  // Sanitize: strip unexpected top-level keys that aren't chapters or metadata
  const allowedKeys = [...CHAPTER_KEYS, '_version', '_migratedAt', 'schulden', 'betreibung', 'verlustscheine', 'organStatus', 'organDonation', 'finanzen'];
  const sanitized = {};
  for (const key of Object.keys(data)) {
    if (allowedKeys.includes(key) || key.startsWith('_')) {
      sanitized[key] = data[key];
    } else {
      sanitized[key] = data[key];
      // Don't strip unknown keys — they may be from future versions
    }
  }

  return { valid: errors.length === 0, errors, sanitized: data };
}

/**
 * Validate or5_docs shape.
 * Expected: array of document metadata objects.
 */
export function validateDocs(docs) {
  const errors = [];

  if (!Array.isArray(docs)) {
    return { valid: false, errors: ['or5_docs is not an array'], sanitized: [] };
  }

  const sanitized = docs.filter((doc, idx) => {
    if (!isPlainObject(doc)) {
      errors.push('doc[' + idx + '] is not an object');
      return false;
    }
    if (!doc.id) {
      errors.push('doc[' + idx + '] missing id');
      return false;
    }
    return true;
  });

  return { valid: errors.length === 0, errors, sanitized };
}

/**
 * Validate or5_reminders shape.
 * Expected: array of reminder objects.
 */
export function validateReminders(reminders) {
  const errors = [];

  if (!Array.isArray(reminders)) {
    return { valid: false, errors: ['or5_reminders is not an array'], sanitized: [] };
  }

  const sanitized = reminders.filter((r, idx) => {
    if (!isPlainObject(r)) {
      errors.push('reminder[' + idx + '] is not an object');
      return false;
    }
    if (!r.id) {
      errors.push('reminder[' + idx + '] missing id');
      return false;
    }
    return true;
  });

  return { valid: errors.length === 0, errors, sanitized };
}

/**
 * Validate or5_contacts shape (future-safe).
 * Expected: array of contact objects.
 */
export function validateContacts(contacts) {
  const errors = [];

  if (!Array.isArray(contacts)) {
    return { valid: false, errors: ['or5_contacts is not an array'], sanitized: [] };
  }

  const sanitized = contacts.filter((c, idx) => {
    if (!isPlainObject(c)) {
      errors.push('contact[' + idx + '] is not an object');
      return false;
    }
    if (!c.id) {
      errors.push('contact[' + idx + '] missing id');
      return false;
    }
    if (c.name !== undefined && !isString(c.name)) {
      errors.push('contact[' + idx + '] name is not a string');
    }
    return true;
  });

  return { valid: errors.length === 0, errors, sanitized };
}

/**
 * Validate a complete backup payload (as produced by export).
 * Returns { valid, errors } without modifying the payload.
 */
export function validateBackupPayload(payload) {
  const errors = [];

  if (!isPlainObject(payload)) {
    return { valid: false, errors: ['Backup payload is not an object'] };
  }

  if (!payload.created || !isISODate(payload.created)) {
    errors.push('Missing or invalid "created" timestamp');
  }

  if (!payload.version || !isString(payload.version)) {
    errors.push('Missing or invalid "version" field');
  }

  if (payload.data !== undefined) {
    const dataResult = validateData(payload.data);
    errors.push(...dataResult.errors.map(e => 'data: ' + e));
  }

  if (payload.docs !== undefined) {
    const docsResult = validateDocs(payload.docs);
    errors.push(...docsResult.errors.map(e => 'docs: ' + e));
  }

  if (payload.reminders !== undefined) {
    const remResult = validateReminders(payload.reminders);
    errors.push(...remResult.errors.map(e => 'reminders: ' + e));
  }

  if (payload.contacts !== undefined) {
    const conResult = validateContacts(payload.contacts);
    errors.push(...conResult.errors.map(e => 'contacts: ' + e));
  }

  return { valid: errors.length === 0, errors };
}
