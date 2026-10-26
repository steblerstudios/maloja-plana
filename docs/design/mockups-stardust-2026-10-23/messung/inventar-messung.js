// Zählt eine Seite der App vollständig durch (nicht nur den sichtbaren Anfang), im selben
// Zeilenformat wie vergleich-inventar.json: «Art | Text». Fusszeile und Demo-Leiste ausgenommen.
// Aufruf in der Browser-Konsole im Demo-Modus: await inventar('tax')  →  Array von Zeilen.
// Angelegt 23.10.2026 für Steuern, Finanz-Übersicht und Einstellungen.
window.inventar = async (view, warten = 1500) => {
  location.hash = '#/' + view;
  await new Promise((r) => setTimeout(r, warten));
  const wurzel = document.querySelector('main, [role=main]') || document.body;
  const sichtbar = (e) => {
    const s = getComputedStyle(e);
    return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length > 0;
  };
  const kurz = (t, n = 90) => (t || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const zeilen = [];
  const gesehen = new Set();
  const block = /^(P|LI|DT|DD|TD|TH|FIGCAPTION|BLOCKQUOTE|SMALL|LABEL|LEGEND|SUMMARY)$/;
  for (const e of wurzel.querySelectorAll('*')) {
    if (!sichtbar(e) || e.closest('footer, [data-demo-leiste]')) continue;
    if ([...gesehen].some((g) => g.contains(e))) continue;
    const tag = e.tagName;
    let z = null;
    if (/^H[1-6]$/.test(tag)) z = tag.toLowerCase() + ' | ' + kurz(e.innerText);
    else if (tag === 'BUTTON' || e.getAttribute('role') === 'button') z = 'button | ' + kurz(e.innerText || e.getAttribute('aria-label'));
    else if (tag === 'A') z = 'link | ' + kurz(e.innerText || e.getAttribute('aria-label'));
    else if (tag === 'INPUT') z = 'input | ' + e.type + ': ' + kurz(e.placeholder || e.getAttribute('aria-label') || e.value, 60);
    else if (tag === 'TEXTAREA') z = 'textarea | ' + kurz(e.placeholder || e.getAttribute('aria-label'), 60);
    else if (tag === 'SELECT') {
      const o = [...e.options].map((x) => x.text.trim());
      z = 'select | ' + kurz(e.getAttribute('aria-label') || '', 40) + ' (' + o.length + ' Optionen: ' + o.slice(0, 4).join(', ') + (o.length > 4 ? ' …' : '') + ')';
    } else if (block.test(tag) && kurz(e.innerText)) z = 'text | ' + kurz(e.innerText);
    else if ((tag === 'DIV' || tag === 'SPAN') && kurz(e.innerText) && ![...e.children].some((c) => sichtbar(c) && kurz(c.innerText))) z = 'text | ' + kurz(e.innerText);
    if (z) { zeilen.push(z); gesehen.add(e); }
  }
  return zeilen;
};
