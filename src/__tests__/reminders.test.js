import { describe, it, expect, beforeEach } from 'vitest';

// Minimaler localStorage-Stub (Tests laufen im node-Env ohne DOM).
beforeEach(() => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
  };
});

const reminders = () => import('../utils/reminders.js');
const merkliste = () => import('../utils/merkliste.js');

describe('addReminder (Kalender-Schreib-API)', () => {
  it('legt eine Erinnerung mit voller Form an und persistiert sie', async () => {
    const { addReminder, loadReminders } = await reminders();
    const r = addReminder({ title: 'KVG kündigen', dueDate: '2026-11-30', category: 'insurance' });
    expect(r).toMatchObject({ title: 'KVG kündigen', dueDate: '2026-11-30', category: 'insurance', done: false });
    expect(r.id).toBeTruthy();
    expect(r.recurrence).toBe('once');
    const stored = loadReminders();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(r.id);
  });

  it('ist idempotent: gleicher Titel + Datum legt nicht doppelt an', async () => {
    const { addReminder, loadReminders } = await reminders();
    const a = addReminder({ title: 'KVG kündigen', dueDate: '2026-11-30' });
    const b = addReminder({ title: 'KVG kündigen', dueDate: '2026-11-30' });
    expect(b.id).toBe(a.id);
    expect(loadReminders()).toHaveLength(1);
  });

  it('legt bei abweichendem Datum eine zweite Erinnerung an', async () => {
    const { addReminder, loadReminders } = await reminders();
    addReminder({ title: 'KVG kündigen', dueDate: '2026-11-30' });
    addReminder({ title: 'KVG kündigen', dueDate: '2027-11-30' });
    expect(loadReminders()).toHaveLength(2);
  });

  it('gibt null zurück bei fehlendem Titel oder Datum', async () => {
    const { addReminder, loadReminders } = await reminders();
    expect(addReminder({ title: '', dueDate: '2026-11-30' })).toBeNull();
    expect(addReminder({ title: 'X', dueDate: '' })).toBeNull();
    expect(loadReminders()).toHaveLength(0);
  });

  it('gibt null zurück, wenn das Speichern scheitert (Speicher voll) — kein falsches ✓', async () => {
    const { addReminder } = await reminders();
    const orig = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = () => { throw new Error('QuotaExceeded'); };
    expect(addReminder({ title: 'KVG kündigen', dueDate: '2026-11-30' })).toBeNull();
    globalThis.localStorage.setItem = orig;
  });
});

describe('addTodo (Merkliste-Schreib-API)', () => {
  it('legt einen Merkpunkt in der erwarteten Form an', async () => {
    const { addTodo, loadTodos } = await merkliste();
    const item = addTodo({ text: 'Police ablegen', link: 'tresor' });
    expect(item).toMatchObject({ text: 'Police ablegen', link: 'tresor', done: false });
    expect(item.id.startsWith('m')).toBe(true);
    expect(loadTodos()).toHaveLength(1);
  });

  it('link ist optional (null)', async () => {
    const { addTodo } = await merkliste();
    expect(addTodo({ text: 'Etwas merken' }).link).toBeNull();
  });

  it('ist idempotent über Text + Link', async () => {
    const { addTodo, loadTodos } = await merkliste();
    addTodo({ text: 'Police ablegen', link: 'tresor' });
    addTodo({ text: 'Police ablegen', link: 'tresor' });
    expect(loadTodos()).toHaveLength(1);
    addTodo({ text: 'Police ablegen', link: 'unterlagen' });
    expect(loadTodos()).toHaveLength(2);
  });
});
