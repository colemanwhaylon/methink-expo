/**
 * PDF viewer for a single bundled document, addressed by array index.
 *
 * The PDF ships as a bundled asset (a require()'d module id), so we resolve it
 * to a usable URL with expo-asset before display. On web, browsers render PDFs
 * natively inside an iframe, so we embed it directly. On native, a PDF inside a
 * bare WebView is unreliable (especially Android), so we offer an "Open
 * document" action that hands the URL to the system browser instead.
 */
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Asset } from 'expo-asset';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmbeddedWeb } from '@/components/EmbeddedWeb';
import { Screen } from '@/components/Screen';
import { getPage, theme, type DocsPage } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function DocViewerScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const doc = (getPage('docs') as DocsPage).documents[Number(index)];
  const r = useResponsive('default');

  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) return;
    let active = true;
    (async () => {
      const asset = Asset.fromModule(doc.asset);
      await asset.downloadAsync();
      if (active) setUri(asset.localUri ?? asset.uri);
    })();
    return () => {
      active = false;
    };
  }, [doc]);

  if (!doc) {
    return (
      <Screen title="Not found">
        <Text style={[styles.message, { fontSize: r.type.body }]}>
          That document is not available.
        </Text>
      </Screen>
    );
  }

  // Asset still resolving.
  if (!uri) {
    return (
      <Screen title={doc.title} variant="default">
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.text} />
        </View>
      </Screen>
    );
  }

  // Web: browsers render PDFs inline; embed via iframe filling the column height.
  if (Platform.OS === 'web') {
    return (
      <Screen title={doc.title} variant="default">
        <View style={styles.flex}>
          <EmbeddedWeb uri={uri} title={doc.title} style={styles.flex} />
        </View>
      </Screen>
    );
  }

  // Native: hand off to the system browser for a reliable PDF experience.
  return (
    <Screen title={doc.title} variant="default">
      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { fontSize: r.type.h2 }]}>{doc.title}</Text>
          <Text style={[styles.cardDescription, { fontSize: r.type.body }]}>
            {doc.description}
          </Text>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  message: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 24,
  },
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
  cardTitle: {
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardDescription: {
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
    cursor: 'pointer',
  },
  buttonHover: { opacity: 0.9 },
  buttonLabel: { color: theme.colors.onAccent, fontWeight: '700' },
});
