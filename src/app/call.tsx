/**
 * Call screen: click-to-call cards for each configured contact.
 *
 * Tapping the "Call" button (or the number itself) opens the platform's tel:
 * handler. On web this hands off to the default phone/VoIP app.
 */
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { getPage, theme, type CallPage } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function CallScreen() {
  const page = getPage('call') as CallPage;
  const r = useResponsive('read');

  const dial = (phone: string) => {
    // Strip formatting so the tel: URI is a bare dialable string.
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, '')}`);
  };

  return (
    <Screen title="Call" variant="read" scroll>
      {page.contacts.map((contact) => (
        <View key={contact.phone} style={styles.card}>
          <Text style={[styles.name, { fontSize: r.type.h2 }]}>{contact.name}</Text>

          <Pressable
            onPress={() => dial(contact.phone)}
            hitSlop={6}
            style={({ hovered, focused, pressed }: any) => [
              styles.phoneWrap,
              interactionStyle({ hovered, focused, pressed }),
            ]}
          >
            <Text style={[styles.phone, { fontSize: r.type.body }]}>{contact.phone}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${contact.name}`}
            onPress={() => dial(contact.phone)}
            style={({ hovered, focused, pressed }: any) => [
              styles.button,
              interactionStyle({ hovered, focused, pressed }),
            ]}
          >
            <Text style={[styles.buttonText, { fontSize: r.type.title }]}>Call</Text>
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
    borderRadius: 14,
    padding: 24,
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  name: {
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  phoneWrap: { cursor: 'pointer' },
  phone: {
    color: theme.colors.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    cursor: 'pointer',
  },
  buttonText: {
    color: theme.colors.onAccent,
    fontWeight: '700',
  },
});
