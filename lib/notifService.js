import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuoteService from './quoteService';

const CHANNEL_ID = 'daily-quotes';

async function ensurePermissions() {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return true;
}

async function createChannel() {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Citations',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export default {
  async schedule(h = 10, m = 0) {
    // Notifications are not available on web
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('prefs', JSON.stringify({ enabled: false }));
      return;
    }

    if (!(await ensurePermissions())) return;

    await createChannel();
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Citation du jour',
        body: (await QuoteService.daily()).citation,
        sound: 'default',
      },
      trigger: { hour: h, minute: m, repeats: true, channelId: CHANNEL_ID },
    });

    await AsyncStorage.setItem('prefs', JSON.stringify({ enabled: true, h, m }));
  },

  async disable() {
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    await AsyncStorage.setItem('prefs', JSON.stringify({ enabled: false }));
  },
};
