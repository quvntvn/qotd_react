// gère la navigation + thème
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '../../lib/theme';

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';

  return (
    <ThemeProvider scheme={scheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </ThemeProvider>
  );
}
