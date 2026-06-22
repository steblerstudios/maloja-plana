// ─── Local Notification Utilities ───────────────────────────
// Prepares push notification support without any external services.
// All notification logic is local-first and privacy-respecting.
//
// Phase 1 (current): Service worker registration + permission scaffold
// Phase 2 (future):  Browser Notification API for overdue reminders
// Phase 3 (future):  Background sync for periodic reminder checks

const SW_PATH = '/sw.js';

// ─── Service Worker Registration ───────────────────────────
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('[Notifications] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: '/',
    });
    console.log('[Notifications] SW registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('[Notifications] SW registration failed:', error);
    return null;
  }
};

// ─── Permission Management ─────────────────────────────────
export const getNotificationPermission = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default', 'granted', 'denied'
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'error';
  }
};

// ─── Local Notification (browser API) ──────────────────────
// Shows a browser notification for overdue reminders.
// Only fires if user has explicitly granted permission.
export const showLocalNotification = (title, body, tag) => {
  if (getNotificationPermission() !== 'granted') return false;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/icon-192.png',
      tag: tag || 'maloja-plana-reminder',
      silent: true, // respectful: no sound
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch {
    return false;
  }
};

// ─── Reminder Check (runs on app load) ─────────────────────
// Checks localStorage for overdue reminders and shows notification
// if the user has opted in. No background polling, no server calls.
export const checkOverdueReminders = (t) => {
  if (getNotificationPermission() !== 'granted') return;

  try {
    const reminders = JSON.parse(localStorage.getItem('or5_reminders') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const overdue = reminders.filter(r => !r.done && r.dueDate < today);

    if (overdue.length > 0) {
      const title = t
        ? t('overdue.notificationTitle', { count: overdue.length })
        : overdue.length + ' overdue reminder(s)';
      const body = t
        ? t('overdue.notificationBody')
        : 'Open Maloja Plana to review your reminders.';

      showLocalNotification(title, body, 'overdue-check');
    }
  } catch {
    // Silently fail — never break the app for notifications
  }
};

// ─── Notification preferences (stored locally) ─────────────
const PREF_KEY = 'or5_notification_prefs';

export const getNotificationPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveNotificationPrefs = (prefs) => {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
};
