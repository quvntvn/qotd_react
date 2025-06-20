import { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../lib/theme';
import NotifService from '../lib/notifService';
import { ExternalLink } from '@/components/ExternalLink';

export default function Settings() {
  const { colors } = useTheme();
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

  async function changeHour(h) {
    setHour({ h, m: 0 });
    if (enabled) await NotifService.schedule(h, 0);
    else await AsyncStorage.setItem('prefs', JSON.stringify({ enabled: false, h, m: 0 }));
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Paramètres' }} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Notifications quotidiennes</Text>
        <Switch value={enabled} onValueChange={toggleNotif} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Heure de la notification</Text>
        <Picker
          selectedValue={hour.h}
          style={[styles.picker, { color: '#000' }]}
          onValueChange={changeHour}
          dropdownIconColor="#000"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={`${i}h`} value={i} color="#000" />
          ))}
        </Picker>
      </View>

      <Text style={[styles.credit, { color: colors.text }]}>Application créée par{' '}
        <ExternalLink href="https://quvntvn.netlify.app/">
          <Text style={[styles.link]}>Quvntvn</Text>
        </ExternalLink>
      </Text>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 72, paddingBottom: 24 },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 32 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 16 },
  picker: { height: 32, width: 120 },
  credit: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
  },
  link: { textDecorationLine: 'underline', color: '#fff' },
});
