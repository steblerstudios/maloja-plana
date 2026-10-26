// Misst jede Seite der App bei der aktuellen Fenstergrösse (im Demo-Modus, ohne Neuladen).
// Gesucht: seitliches Scrollen, Elemente über den Rand, abgeschnittener Text,
// zu kleine Tippflächen, Fehlerschirm. Ergebnis liegt in window.__mess[groesse].
(async () => {
  const VIEWS = ['dashboard','chapter/0','chapter/1','chapter/2','chapter/3','chapter/4','chapter/5','chapter/6',
    'adoption','alv','anspruchcheck','ansprueche','asyl','aussteuerung','ausweis','behoerdendossier','bestattung','betreibung','betreibungsauszug','bewilligung','briefe','budget','calendar','charts','cv','dienst','direktlinks','einbuergerung','eo','ergaenzungsleistungen','export','finanzuebersicht','flyer','fuehrerausweis','gepaeck','gesundheit','heirat','installApp','iv','kind','kk','kkerst','kreditkarte','kvg','kvgwechsel','lebensmappe','legal','lehre','mahnung','merkliste','mietzins','neuerjob','notfalldossier','notfalleinstieg','notfallkarte','notfallpass','notifications','obstgarten','organ','patientenverfuegung','pensionierung','pflege','praemien','premium','quellensteuer','schnellcheck','schulden','search','selbstaendigkeit','settings','situationen','sozialhilfe','stelleverloren','stipendien','stundenlohn','sync','tax','taxImport','todesfall','trennung','tresor','umzug','unfallkrankheit','unterlagen','volljaehrig','vorsorge','vorsorgeauftrag','wegzug','wohnunggekuendigt','zusammenziehen','zusatzwechsel','zuzug'];
  const W = innerWidth, H = innerHeight, key = W + 'x' + H;
  const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
  const name = (e) => {
    const t = (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return e.tagName.toLowerCase() + (t ? ' «' + t + '»' : '');
  };
  // Liegt e in einem Behälter, der selbst seitlich scrollt oder abschneidet? Dann ist das Absicht.
  const imScroller = (e) => {
    for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return true;
    }
    return false;
  };
  const erg = {};
  for (const v of VIEWS) {
    location.hash = '#/' + v;
    await schlaf(700);
    scrollTo(0, 0);
    const D = document.documentElement;
    const alle = [...document.querySelectorAll('body *')].filter((e) => {
      const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden';
    });
    const ueberRand = alle.filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && (b.right > W + 1 || b.left < -1) && !imScroller(e)
        && getComputedStyle(e).position !== 'fixed';
    });
    // nur die äussersten melden (Kinder eines Übeltäters sind derselbe Fund)
    const aeussere = ueberRand.filter((e) => !ueberRand.some((o) => o !== e && o.contains(e)));
    const abgeschnitten = alle.filter((e) => {
      const s = getComputedStyle(e);
      return /(hidden|clip)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.innerText && e.innerText.trim()
        && s.textOverflow !== 'ellipsis';
    });
    const klein = alle.filter((e) => e.matches('button, a[href], input, select, [role=button]')).filter((e) => {
      const b = e.getBoundingClientRect(); return b.width > 0 && (b.height < 24 || b.width < 24);
    });
    const fehler = /Etwas ist schiefgelaufen|Fehler beim Laden/i.test(document.body.innerText);
    erg[v] = {
      hScroll: D.scrollWidth > W + 1, breite: D.scrollWidth,
      ueberRand: aeussere.slice(0, 3).map((e) => name(e) + ' →' + Math.round(e.getBoundingClientRect().right)),
      abgeschnitten: abgeschnitten.slice(0, 3).map(name), abgeschnittenN: abgeschnitten.length,
      klein: klein.length, kleinBsp: klein.slice(0, 2).map(name), fehler,
      gelandet: location.hash,
    };
  }
  window.__mess = window.__mess || {};
  window.__mess[key] = erg;
  const auff = Object.entries(erg).filter(([, r]) => r.hScroll || r.ueberRand.length || r.abgeschnittenN || r.fehler);
  return key + ': ' + VIEWS.length + ' Seiten, auffällig ' + auff.length;
})();
