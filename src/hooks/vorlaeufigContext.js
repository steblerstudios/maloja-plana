import { createContext, useContext } from 'react';

// Beispiel oder Ausprobieren (main.jsx `vorlaeufig`): nichts bleibt dauerhaft. Als Kontext,
// weil die Abläufe keine Modus-Props bekommen — der Frist-Knopf (AblaufSchale) liest es hier.
export const VorlaeufigContext = createContext(false);
export const useVorlaeufig = () => useContext(VorlaeufigContext);
