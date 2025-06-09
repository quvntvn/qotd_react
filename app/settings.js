import { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../lib/theme';
import NotifService from '../lib/notifService';

export default function Settings() {
  const { colors, mode, setScheme } = useTheme();
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

      <Text style={[styles.h1, { color: colors.text }]}>Paramètres</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Notifications quotidiennes</Text>
        <Switch value={enabled} onValueChange={toggleNotif} />
      </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Thème</Text>
          <Picker
            selectedValue={mode}
            style={[styles.picker, { color: colors.text }]}
            onValueChange={setScheme}
            dropdownIconColor={colors.text}
          >
            <Picker.Item label="Clair" value="light" />
            <Picker.Item label="Sombre" value="dark" />
          </Picker>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 72 },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 16 },
  picker: { height: 32, width: 120 },
});
