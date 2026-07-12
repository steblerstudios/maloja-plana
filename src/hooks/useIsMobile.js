import React from 'react';

const { useState, useEffect } = React;

// Schmale-Geräte-Erkennung, gleiche Schwelle wie in main.jsx (vw < 560).
// Für Komponenten, die isMobile nicht als Prop erhalten, aber z. B. Tipphöhen
// oder Layouts nur auf dem Handy anpassen wollen. SSR-sicher (Default false).
export const MOBILE_MAX = 560;

export const useIsMobile = () => {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_MAX : false
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < MOBILE_MAX);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
};

export default useIsMobile;
