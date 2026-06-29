// Gemeinsame Schreib-API für die Merkliste (or5_merkliste).
// Bewusst OHNE Frist — das ist der Kalender. Hier landen offene Punkte eines Ablaufs.
// MerklisteView.jsx liest denselben Key; die Form bleibt {id, text, link, done}.

const STORAGE_KEY = 'or5_merkliste';

export const loadTodos = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};

const saveTodos = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  catch { /* Speicher voll — still scheitern */ }
};

// Legt einen Merkpunkt an. Idempotent: gleicher Text + Link wird nicht doppelt
// angelegt. link ist optional (eine View wie 'briefe' für einen Crosslink).
export const addTodo = ({ text, link = null }) => {
  if (!text) return null;
  const items = loadTodos();
  const existing = items.find(i => !i.done && i.text === text && (i.link || null) === link);
  if (existing) return existing;
  const item = { id: 'm' + Date.now(), text, link, done: false };
  saveTodos([...items, item]);
  return item;
};
