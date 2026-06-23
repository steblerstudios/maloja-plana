import { createContext, useContext } from 'react';

export const VorlesenContext = createContext(null);
export const useVorlesenContext = () => useContext(VorlesenContext);
