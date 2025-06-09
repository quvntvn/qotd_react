import { createContext, useContext, useMemo } from 'react';

const Dark = {
  primary: '#0a84ff',
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
