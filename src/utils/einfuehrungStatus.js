// Einführungs-Status (Onboarding + Tour) — bewusst eine winzige, eigene Datei.
//
// Warum hier und nicht in Onboarding.jsx / Tour.jsx? main.jsx braucht beim Start
// nur die Frage «schon erledigt?». Ein statischer Import aus Onboarding.jsx oder
// Tour.jsx zieht die ganze Komponente ins Hauptbundle, obwohl beide per
// React.lazy nachgeladen werden (Entscheid E36, Bundle-Platz). Onboarding.jsx und
// Tour.jsx exportieren die Funktionen weiter — bestehende Importe bleiben gültig.

const ONBOARDING_KEY = 'or5_onboarding_done';
const TOUR_KEY = 'or5_tour_done';

export const isOnboardingDone = () => {
  try { return localStorage.getItem(ONBOARDING_KEY) === 'true'; }
  catch { return false; }
};

export const isTourDone = () => {
  try { return localStorage.getItem(TOUR_KEY) === 'true'; }
  catch { return false; }
};

export const markTourDone = () => {
  try { localStorage.setItem(TOUR_KEY, 'true'); } catch { /* localStorage n/a */ }
};
