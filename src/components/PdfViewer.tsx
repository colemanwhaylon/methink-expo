/**
 * Native PDF viewer: a bundled PDF in a bare WebView is unreliable (especially
 * on Android), so we present a card and hand the document to the system browser,
 * which has a full scrollable PDF experience. (Web uses PdfViewer.web.tsx.)
 */
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

type Props = { uri: string; title: string; description?: string };

export function PdfViewer({ uri, title, description }: Props) {
  const r = useResponsive('default');
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={[styles.title, { fontSize: r.type.h2 }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { fontSize: r.type.body }]}>{description}</Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => WebBrowser.openBrowserAsync(uri)}
          style={({ hovered, focused, pressed }: any) => [
            styles.button,
            hovered ? styles.buttonHover : null,
            interactionStyle({ focused, pressed }),
          ]}
        >
          <Text style={[styles.buttonLabel, { fontSize: r.type.title }]}>Open document</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: { color: theme.colors.text, fontWeight: '700', textAlign: 'center' },
  description: { color: theme.colors.muted, textAlign: 'center', marginTop: 8 },
  button: {
    marginTop: 24,
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonHover: { opacity: 0.9 },
  buttonLabel: { color: theme.colors.onAccent, fontWeight: '700' },
});
