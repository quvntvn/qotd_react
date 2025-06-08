import { createContext, useContext, useState, useMemo } from 'react';
import { Appearance } from 'react-native';

const Light = {
  primary: '#007aff',
  bg: '#ffffff',
  text: '#1c1c1e',
};
const Dark = {
  primary: '#0a84ff',
  bg: '#1c1c1e',
  text: '#f2f2f7',
};

const ThemeCtx = createContext();

export function ThemeProvider({ children, scheme }) {
  const [mode, setMode] = useState(scheme); // 'light' | 'dark' | 'system'

  const colors = mode === 'dark' ? Dark : Light;

  const value = useMemo(
    () => ({
      colors,
      label: mode === 'system' ? 'Système' : mode === 'dark' ? 'Sombre' : 'Clair',
      nextScheme: () =>
        setMode((m) =>
          m === 'light' ? 'dark' : m === 'dark' ? 'system' : 'light'
        ),
    }),
    [mode]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
