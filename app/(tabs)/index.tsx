import { useState, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import QuoteService from '../../lib/quoteService';
import { useTheme } from '../../lib/theme';

type Quote = {
  id: string | number;
  citation: string;
  auteur: string;
};

export default function Home() {
  const { colors } = useTheme();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [daily, setDaily] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDaily = useCallback(async () => {
    setLoading(true);
    const q = await QuoteService.daily();
    setQuote(q);
    setDaily(q);
    setLoading(false);
  }, []);

  const loadRandom = useCallback(async () => {
    setLoading(true);
    setQuote(await QuoteService.random());
    setLoading(false);
  }, []);

  // Charge chaque fois qu’on revient sur l’écran
  useFocusEffect(
    useCallback(() => {
      loadDaily();
    }, [loadDaily])
  );

  if (loading || !quote) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable style={styles.settings} onPress={() => router.push('/settings')}>
        <Text style={[styles.icon, { color: colors.primary }]}>⚙️</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={[styles.quote, { color: colors.text }]}>
          “{quote.citation}”
        </Text>
        <Text style={[styles.author, { color: colors.text }]}>
          — {quote.auteur}
        </Text>
      </View>

      <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={loadRandom}>
        <Text style={styles.btnText}>Nouvelle citation</Text>
      </Pressable>

      {daily && quote.id !== daily.id && (
        <Pressable onPress={loadDaily} style={{ marginTop: 8 }}>
          <Text style={{ color: colors.primary }}>Revenir à la citation du jour</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  settings: { position: 'absolute', top: 48, right: 24 },
  icon: { fontSize: 22 },
  card: { marginBottom: 32 },
  quote: { fontSize: 22, fontStyle: 'italic', textAlign: 'center' },
  author: { fontSize: 16, textAlign: 'center', marginTop: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});