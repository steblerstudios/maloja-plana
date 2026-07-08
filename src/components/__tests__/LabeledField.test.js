import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LabeledField } from '../LabeledField.jsx';

// Der A11y-Kern des Bausteins: das sichtbare Label ist programmatisch mit dem
// Feld gekoppelt (label[for] === feld[id]). Ohne das bekommt ein Screenreader
// keinen Feldnamen. Deckt beide Nutzungsformen ab.
const palette = { mid: '#666', text: '#111' };

describe('LabeledField koppelt Label und Feld', () => {
  it('direktes Feld: label[for] === input[id]', () => {
    const html = renderToStaticMarkup(
      React.createElement(LabeledField, { palette, label: 'Betrag' },
        React.createElement('input', { type: 'number' }))
    );
    const forId = html.match(/for="([^"]+)"/)?.[1];
    const inputId = html.match(/<input[^>]*\sid="([^"]+)"/)?.[1];
    expect(forId).toBeTruthy();
    expect(forId).toBe(inputId);
  });

  it('render-prop: id landet auf dem verschachtelten Feld (Chevron-Wrapper)', () => {
    const html = renderToStaticMarkup(
      React.createElement(LabeledField, { palette, label: 'Kanton' },
        (id) => React.createElement('div', { style: { position: 'relative' } },
          React.createElement('select', { id },
            React.createElement('option', { value: 'ZH' }, 'ZH'))))
    );
    const forId = html.match(/for="([^"]+)"/)?.[1];
    const selectId = html.match(/<select[^>]*\sid="([^"]+)"/)?.[1];
    expect(forId).toBeTruthy();
    expect(forId).toBe(selectId);
  });

  it('respektiert eine bereits gesetzte id des Feldes', () => {
    const html = renderToStaticMarkup(
      React.createElement(LabeledField, { palette, label: 'X', htmlFor: 'my-id' },
        React.createElement('input', { id: 'my-id' }))
    );
    expect(html.match(/for="([^"]+)"/)?.[1]).toBe('my-id');
  });
});
