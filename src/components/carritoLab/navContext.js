import { createContext, useContext } from 'react';

// Permite que cualquier término resaltado salte al glosario
export const GlosarioNav = createContext({ verTermino: () => {} });
export const useGlosarioNav = () => useContext(GlosarioNav);
