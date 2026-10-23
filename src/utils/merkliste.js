// Gemeinsame Schreib-API für die Merkliste (or5_merkliste).
// Hier landen offene Punkte eines Ablaufs. MerklisteView.jsx und CalendarReminders.jsx lesen
// denselben Key.
//
// Form eines Merkpunkts: {id, text, link, done} — dazu seit Fassung 5 (23.10.2026), alle
// OPTIONAL, damit alte Einträge ohne Migration gültig bleiben:
//   tag          'YYYY-MM-DD' — der Tag, an dem der Punkt in «Was ansteht» als Aufgabe steht.
//                Fehlt er, wartet der Punkt dort im Fach «Noch ohne Tag».
//   erledigtAm   'YYYY-MM-DD' — wann abgehakt. Nur für Punkte, die seit Fassung 5 abgehakt
//                wurden; ältere erledigte Punkte haben keinen und erscheinen nicht im Kalender.
//   wiederholung 'jaehrlich' — beim Abhaken entsteht derselbe Punkt ein Jahr später neu.
//   folgeId      id des Punkts, den das Abhaken einer jährlichen Aufgabe angelegt hat
//                (damit «nicht erledigt» ihn wieder wegnimmt, solange er offen ist).
// Neue Punkte stehen oben (Entscheid Merkliste, 23.10.2026).

import { inDays } from './helpers.js';

const STORAGE_KEY = 'or5_merkliste';

export const WIEDERHOLUNG_JAEHRLICH = 'jaehrlich';

export const loadTodos = () => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch { return []; }
};

export const saveTodos = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; }
  catch { return false; /* Speicher voll — still scheitern */ }
};

const neueId = () => 'm' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
const istTag = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

// Ein Jahr später, als ISO-Datum. Aus dem 29. Februar wird der 28. — kein Sprung in den März.
export const einJahrSpaeter = (iso) => {
  if (!istTag(iso)) return null;
  const [j, m, d] = iso.split('-');
  const tag = m === '02' && d === '29' ? '28' : d;
  return `${Number(j) + 1}-${m}-${tag}`;
};

// Baut einen Merkpunkt; Tag und Wiederholung nur, wenn gültig gesetzt.
export const merkpunktBauen = ({ text, link = null, tag = null, wiederholung = null }) => {
  const item = { id: neueId(), text, link: link || null, done: false };
  if (istTag(tag)) item.tag = tag;
  if (wiederholung === WIEDERHOLUNG_JAEHRLICH) item.wiederholung = WIEDERHOLUNG_JAEHRLICH;
  return item;
};

// Legt einen Merkpunkt an (oben). Idempotent: gleicher Text + Link wird nicht doppelt
// angelegt, solange der bestehende offen ist. link ist optional (eine View wie 'briefe').
// tag und wiederholung sind optional (siehe aufgabeAnlegen).
export const addTodo = ({ text, link = null, tag = null, wiederholung = null }) => {
  if (!text) return null;
  const items = loadTodos();
  const existing = items.find(i => !i.done && i.text === text && (i.link || null) === (link || null));
  if (existing) return existing;
  const item = merkpunktBauen({ text, link, tag, wiederholung });
  saveTodos([item, ...items]);
  return item;
};

// Für andere Zweige (z. B. IPV «Jährlich erinnern»): einen Merkpunkt mit Tag und Wiederholung
// anlegen. Er steht dann in der Merkliste UND in «Was ansteht» als Aufgabe an diesem Tag.
//   aufgabeAnlegen({ text, link?, tag: 'YYYY-MM-DD', wiederholung?: 'jaehrlich' }, vorlaeufig)
//   → 'gespeichert' | 'vorlaeufig' | null
// Wie merkpunktSichern: im Beispiel und beim Ausprobieren bleibt nichts.
export const aufgabeAnlegen = ({ text, link = null, tag = null, wiederholung = null }, vorlaeufig) => {
  if (vorlaeufig) return 'vorlaeufig';
  return addTodo({ text, link, tag, wiederholung }) ? 'gespeichert' : null;
};

// Für jeden «merken»-Knopf: im Beispiel und beim Ausprobieren (`vorlaeufig`, main.jsx) bleibt
// nichts — addTodo ginge sonst in die ECHTE Merkliste (wie erinnerungSichern, 18.10.2026).
// Rückgabe: 'gespeichert' | 'vorlaeufig' | null.
export const merkpunktSichern = (todo, vorlaeufig) => {
  if (vorlaeufig) return 'vorlaeufig';
  return addTodo(todo) ? 'gespeichert' : null;
};

// ── Reine Umformungen (Merkliste und Kalender teilen sie, damit beide gleich abhaken) ──

// Abhaken / wieder öffnen. Abhaken speichert erledigtAm; bei einer jährlichen Aufgabe
// entsteht oben derselbe Punkt ein Jahr später (vom Tag aus, sonst von heute).
// Wieder öffnen nimmt diesen Folgepunkt weg, solange er selbst noch offen ist.
export const merkpunktUmschalten = (items, id, heute = inDays(0)) => {
  const alt = items.find(i => i.id === id);
  if (!alt) return items;
  if (!alt.done) {
    let folge = null;
    if (alt.wiederholung === WIEDERHOLUNG_JAEHRLICH) {
      folge = merkpunktBauen({ text: alt.text, link: alt.link, tag: einJahrSpaeter(alt.tag || heute), wiederholung: WIEDERHOLUNG_JAEHRLICH });
    }
    const neu = items.map(i => (i.id === id ? { ...i, done: true, erledigtAm: heute, ...(folge ? { folgeId: folge.id } : {}) } : i));
    return folge ? [folge, ...neu] : neu;
  }
  const folgeOffen = alt.folgeId && items.some(i => i.id === alt.folgeId && !i.done);
  return items
    .filter(i => !(folgeOffen && i.id === alt.folgeId))
    .map(i => {
      if (i.id !== id) return i;
      const { erledigtAm: _e, folgeId: _f, ...rest } = i;
      return { ...rest, done: false };
    });
};

// Tag setzen (ISO) oder entfernen (null).
export const merkpunktTagSetzen = (items, id, tag) => items.map(i => {
  if (i.id !== id) return i;
  if (istTag(tag)) return { ...i, tag };
  const { tag: _t, ...rest } = i;
  return rest;
});
