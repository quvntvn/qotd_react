import { createContext, useContext, useMemo } from 'react';

const Dark = {
  // Updated primary color for action buttons
  primary: '#ff6347',
  bg: '#1c1c1e',
  text: '#f2f2f7',
};

const ThemeCtx = createContext();

export function ThemeProvider({ children }) {
  const mode = 'dark';
  const colors = Dark;

  const value = useMemo(
    () => ({
      colors,
      mode,
    }),
    []
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
