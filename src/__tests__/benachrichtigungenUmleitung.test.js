import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { SCHLUSS_ZIELE } from '../config/ansichtenRegister.js';
import { SettingsView } from '../SettingsView.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';

// Seitenlandkarte Z2 (docs/entscheide/seitenlandkarte-2026-11.md, 05.11.2026): «Benachrichtigungen»
// war eine eigene Seite für vier Schalter, ohne einen einzigen Verweis aus der App ausser dem Knopf
// in den Einstellungen. Jetzt ist sie ein Abschnitt der Einstellungen. Alte Links, Suche und das
// Einstellungs-Fach landen über die Umleitung dort.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const ANKER = 'mp-benachrichtigungen';

describe('Benachrichtigungen sind ein Teil der Einstellungen', () => {
  it('#/notifications führt in die Einstellungen, zum Abschnitt Benachrichtigungen', () => {
    expect(parseHash('#/notifications')).toEqual({ view: 'settings', chapterIndex: null, anker: ANKER });
  });

  it('die alte Adresse bleibt gültig, sonst liefen Lesezeichen ins Leere', () => {
    expect(VALID_VIEWS.has('notifications')).toBe(true);
    expect(UMLEITUNGEN.notifications.view).toBe('settings');
  });

  it('die Einstellungen zeigen den Abschnitt mit Sprungmarke, Titel und Schaltern', () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { palette: LIGHT_PALETTE, t, controls: [], onEditBasis: () => {}, onExport: () => {} }));
    expect(html).toContain(`id="${ANKER}"`);
    expect(html).toContain(t('notifications.title'));
    expect(html).toContain(t('notifications.overdueReminders'));
    expect(html).toContain(t('notifications.privacyNote'));
  });

  it('kein Knopf mehr, der auf eine eigene Seite führt', () => {
    expect(quelle('SettingsView.jsx')).not.toContain('onNotifications');
    expect(quelle('main.jsx')).not.toContain('onNotifications');
    expect(quelle('main.jsx')).not.toMatch(/view === 'notifications'/);
  });

  it('eine Umleitung hat keinen eigenen Seitenschluss', () => {
    expect(SCHLUSS_ZIELE.notifications).toBeUndefined();
  });
});
