// Misst den Eingang bei der aktuellen Fenstergrösse: seitliches Scrollen, sichtbares Logo,
// erreichbares Formularende, Titel nicht abgeschnitten, Tippflächen.
(() => {
  const W = innerWidth, H = innerHeight;
  const r = (q) => { const e = document.querySelector(q); return e ? e.getBoundingClientRect() : null; };
  const logo = r('.mp-tor-kopf h1'), titel = r('.mp-tor-titel'), form = r('.mp-tor-inhalt');
  const zuBreit = [...document.querySelectorAll('.mp-tor *')].filter((e) => {
    const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > W + 0.5 || b.left < -0.5);
  }).filter((e) => !e.closest('.mp-tor-bild')).map((e) => e.tagName + '.' + (e.className || ''));
  const knoepfe = [...document.querySelectorAll('.mp-tor button, .mp-tor a, .mp-tor input')]
    .map((e) => e.getBoundingClientRect()).filter((b) => b.height < 24 || b.width < 24).length;
  const ueberlappt = logo && titel ? logo.bottom > titel.top : null;
  const layout = getComputedStyle(document.querySelector('.mp-tor')).flexDirection === 'row' ? 'breit' : 'schmal';
  return {
    groesse: W + '×' + H, layout,
    seitlichScroll: document.documentElement.scrollWidth > W,
    logoSichtbar: !!logo && logo.top >= 0 && logo.bottom <= H,
    logoUeberlapptTitel: ueberlappt,
    formUnten: Math.round(form.bottom + scrollY), seiteHoehe: document.documentElement.scrollHeight,
    formAbgeschnitten: form.bottom + scrollY > document.documentElement.scrollHeight + 1,
    titelZeilen: Math.round(titel.height / parseFloat(getComputedStyle(document.querySelector('.mp-tor-titel')).lineHeight)),
    zuBreit, zuKleineTippflaechen: knoepfe,
  };
})();
