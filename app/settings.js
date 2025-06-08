import { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../lib/theme';
import NotifService from '../lib/notifService';

export default function Settings() {
  const { colors, nextScheme, label } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [hour, setHour] = useState({ h: 10, m: 0 });

  // charge prefs
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem('prefs');
      if (json) {
        const p = JSON.parse(json);
        setEnabled(p.enabled);
        setHour({ h: p.h, m: p.m });
      }
    })();
  }, []);

  async function toggleNotif(value) {
    setEnabled(value);
    if (value) await NotifService.schedule(hour.h, hour.m);
    else await NotifService.disable();
  }

  async function pickTime() {
    if (Platform.OS === 'android') {
      const { action, hour: h, minute } = await Notifications.getExpoPushTokenAsync();
      // simplifié : utilisez TimePicker Android natif si besoin
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={router.back} style={styles.back}>
        <Text style={[styles.icon, { color: colors.primary }]}>←</Text>
      </Pressable>

      <Text style={[styles.h1, { color: colors.text }]}>Paramètres</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Notifications quotidiennes</Text>
        <Switch value={enabled} onValueChange={toggleNotif} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Thème&nbsp;: {label}</Text>
        <Pressable onPress={nextScheme}>
          <Text style={{ color: colors.primary }}>Changer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 72 },
  back: { position: 'absolute', top: 40, left: 24 },
  icon: { fontSize: 24 },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 16 },
});
