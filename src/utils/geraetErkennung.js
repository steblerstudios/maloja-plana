// ─── Welches Gerät, welcher Weg zur Installation ──────────────────────────────
//
// Maloja Plana ist eine Web-App (PWA). Sie lässt sich auf den Startbildschirm
// legen und verhält sich danach wie eine App — es gibt aber keinen App Store und
// keinen einheitlichen Knopf dafür. Der Weg unterscheidet sich je Browser:
//
//   • Chromium (Chrome/Edge, Desktop + Android) feuert `beforeinstallprompt`.
//     Nur dort kann die Seite selbst einen Installieren-Knopf anbieten.
//   • Safari (iOS UND macOS) feuert es nie. Firefox am Computer auch nicht.
//     Dort führt der Weg über ein Browser-Menü — die App kann nur erklären, wo.
//
// Genau deshalb gibt es diese Datei: ohne sie sieht die Hälfte der Besuchenden
// (jedes iPhone) nirgends einen Hinweis, wie man die App aufs Gerät bekommt.
//
// Reine Funktion mit ausdrücklichen Argumenten statt Zugriff auf `navigator`,
// damit sie ohne Browser prüfbar ist (src/__tests__/geraetErkennung.test.js).

// Die Kennungen, für die es in der Anleitung einen eigenen Abschnitt gibt.
// Reihenfolge = Reihenfolge auf der Seite.
export const GERAETE = ['ios', 'android', 'macSafari', 'chromium', 'firefox'];

/**
 * Ordnet eine Browser-Umgebung einem Installationsweg zu.
 *
 * @param {object} umgebung
 * @param {string} umgebung.ua            navigator.userAgent
 * @param {string} umgebung.plattform     navigator.platform (für iPadOS nötig, s. u.)
 * @param {number} umgebung.beruehrpunkte navigator.maxTouchPoints
 * @returns {'ios'|'android'|'macSafari'|'chromium'|'firefox'|'unbekannt'}
 */
export function erkenneGeraet({ ua = '', plattform = '', beruehrpunkte = 0 } = {}) {
  // iPadOS ab 13 meldet sich als Mac ("MacIntel") mit Desktop-User-Agent. Ohne
  // die Berührpunkte bekäme jedes iPad die Mac-Anleitung — und die führt über
  // «Ablage → Zum Dock hinzufügen», ein Menü, das es auf dem iPad nicht gibt.
  //
  // 🛑 Die dritte Bedingung ist nicht Zierde. Eine erste Fassung prüfte nur
  // Plattform und Berührpunkte — und ordnete am 23.09.2026 im Browser ein Gerät
  // mit Android-User-Agent als iPhone ein, weil `navigator.platform` daneben
  // «MacIntel» sagte und fünf Berührpunkte gemeldet waren. `platform` ist
  // veraltet und wird von Emulatoren und Datenschutz-Einstellungen mitgeschleppt;
  // der User-Agent ist die genauere Angabe und muss zustimmen. Ein echtes iPad
  // trägt «Macintosh» im User-Agent, ein Mac hat keinen Berührbildschirm.
  const istIpadOS = plattform === 'MacIntel' && beruehrpunkte > 1 && /Macintosh/.test(ua);
  if (istIpadOS || /iPad|iPhone|iPod/.test(ua)) return 'ios';

  if (/Android/.test(ua)) {
    // Firefox für Android kann installieren, aber über ein anderes Menü als Chrome.
    return /Firefox|FxiOS/.test(ua) ? 'firefox' : 'android';
  }

  // Firefox am Computer kann Web-Apps nicht installieren (siehe Anleitungstext).
  if (/Firefox/.test(ua)) return 'firefox';

  // Reihenfolge zählt: Chrome und Edge tragen beide "Safari" im User-Agent.
  // Erst die Chromium-Kennungen ausschliessen, dann bleibt echtes Safari übrig.
  const istChromium = /Chrome|Chromium|CriOS|Edg|OPR/.test(ua);
  if (istChromium) return 'chromium';
  if (/Safari/.test(ua)) return 'macSafari';

  return 'unbekannt';
}

/**
 * Läuft die Seite bereits als installierte App?
 *
 * Zwei Quellen, weil keine allein reicht: `display-mode: standalone` gilt für
 * Chromium und für vom Home-Bildschirm gestartete iOS-Web-Apps ab iOS 13,
 * `navigator.standalone` ist die ältere iOS-eigene Angabe. Bei installierten
 * Desktop-Apps im Fenstermodus greift zusätzlich `window-controls-overlay`.
 *
 * Fällt beides aus (kein matchMedia, Zugriff wirft), lautet die Antwort `false`
 * — dann zeigen wir die Anleitung. Eine überflüssige Anleitung ist harmlos, ein
 * verschwiegener Weg nicht.
 */
export function laeuftAlsApp(fenster = typeof window !== 'undefined' ? window : null) {
  if (!fenster) return false;
  try {
    if (fenster.navigator && fenster.navigator.standalone === true) return true;
    if (typeof fenster.matchMedia !== 'function') return false;
    return ['standalone', 'window-controls-overlay', 'minimal-ui']
      .some((modus) => fenster.matchMedia('(display-mode: ' + modus + ')').matches);
  } catch (e) {
    return false;
  }
}

/**
 * Kennung des laufenden Browsers — der bequeme Aufruf für Komponenten.
 */
export function aktuellesGeraet(nav = typeof navigator !== 'undefined' ? navigator : null) {
  if (!nav) return 'unbekannt';
  return erkenneGeraet({
    ua: nav.userAgent || '',
    plattform: nav.platform || '',
    beruehrpunkte: nav.maxTouchPoints || 0,
  });
}
