/**
 * Call screen: click-to-call cards for each configured contact.
 *
 * Tapping the "Call" button (or the number itself) opens the platform's tel:
 * handler. On web this hands off to the default phone/VoIP app.
 */
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { getPage, theme, type CallPage } from '@/config/appConfig';

export default function CallScreen() {
  const page = getPage('call') as CallPage;

  const dial = (phone: string) => {
    // Strip formatting so the tel: URI is a bare dialable string.
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, '')}`);
  };

  return (
    <Screen title="Call" scroll>
      {page.contacts.map((contact) => (
        <View key={contact.phone} style={styles.card}>
          <Text style={styles.name}>{contact.name}</Text>

          <Pressable onPress={() => dial(contact.phone)} hitSlop={6}>
            <Text style={styles.phone}>{contact.phone}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${contact.name}`}
            onPress={() => dial(contact.phone)}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Call</Text>
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 8,
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  phone: {
    color: theme.colors.muted,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: theme.colors.onAccent,
    fontSize: 16,
    fontWeight: '700',
  },
});
