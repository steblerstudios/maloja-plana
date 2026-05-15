// ─── localStorage Usage Monitor ─────────────────────────────
// Tracks storage consumption and warns before limits are hit.
// localStorage has a ~5MB limit in most browsers.
// This module provides calm, non-intrusive monitoring.
//
// No external dependencies. No tracking. No network calls.

const WARN_THRESHOLD = 0.8;  // 80% — show gentle warning
const CRITICAL_THRESHOLD = 0.95; // 95% — show urgent warning
const ESTIMATED_LIMIT = 5 * 1024 * 1024; // 5MB conservative estimate

/**
 * Calculate total bytes used by all or5_ keys in localStorage.
 * Returns { used, limit, ratio, keys }
 */
export function getStorageUsage() {
  let totalBytes = 0;
  const keys = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) || '';
      const bytes = (key.length + value.length) * 2; // UTF-16 = 2 bytes per char
      totalBytes += bytes;

      if (key.startsWith('or5_')) {
        keys[key] = bytes;
      }
    }
  } catch (e) {
    console.error('[storage-monitor] Error reading storage:', e.message);
  }

  return {
    used: totalBytes,
    limit: ESTIMATED_LIMIT,
    ratio: totalBytes / ESTIMATED_LIMIT,
    keys,
  };
}

/**
 * Get human-readable storage status.
 * Returns { level, usedKB, limitKB, percent, largestKey }
 * level: 'ok' | 'warning' | 'critical'
 */
export function getStorageStatus() {
  const usage = getStorageUsage();
  const usedKB = Math.round(usage.used / 1024);
  const limitKB = Math.round(usage.limit / 1024);
  const percent = Math.round(usage.ratio * 100);

  let level = 'ok';
  if (usage.ratio >= CRITICAL_THRESHOLD) level = 'critical';
  else if (usage.ratio >= WARN_THRESHOLD) level = 'warning';

  // Find largest or5_ key
  let largestKey = null;
  let largestSize = 0;
  for (const [key, size] of Object.entries(usage.keys)) {
    if (size > largestSize) {
      largestKey = key;
      largestSize = size;
    }
  }

  return {
    level,
    usedKB,
    limitKB,
    percent,
    largestKey,
    largestKeyKB: Math.round(largestSize / 1024),
    keys: usage.keys,
  };
}

/**
 * Test if localStorage can accept a write of approximately `bytes` size.
 * Tries a test write and catches QuotaExceededError.
 */
export function canWrite(bytes) {
  const testKey = '__or5_storage_test__';
  try {
    // Create a string of approximate target size (2 bytes per char)
    const testValue = 'x'.repeat(Math.ceil(bytes / 2));
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    localStorage.removeItem(testKey);
    return false;
  }
}
