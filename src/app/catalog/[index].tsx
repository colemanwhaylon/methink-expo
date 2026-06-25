/**
 * Catalog item detail: embedded YouTube video plus title and description.
 *
 * Resolves the item by array index. The video is embedded 16:9 at the top via
 * the YouTube /embed URL (rendered as an iframe on web, a WebView on native).
 * The 'read' screen variant caps the column at 720px, so the 16:9 video stays
 * centered with a sensible max width on desktop.
 */
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { EmbeddedWeb } from '@/components/EmbeddedWeb';
import { Screen } from '@/components/Screen';
import { getPage, theme, type CatalogPage } from '@/config/appConfig';
import { useResponsive } from '@/theme/responsive';

/** Prerender one page per catalog item. */
export async function generateStaticParams(): Promise<{ index: string }[]> {
  return (getPage('catalog') as CatalogPage).items.map((_, i) => ({ index: String(i) }));
}

export default function CatalogItemScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const item = (getPage('catalog') as CatalogPage).items[Number(index)];
  const r = useResponsive('read');

  if (!item) {
    return (
      <Screen title="Not found">
        <Text style={[styles.message, { fontSize: r.type.body }]}>
          That item is not available.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen title={item.title} variant="read" scroll>
      <View style={styles.video}>
        <EmbeddedWeb
          uri={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          style={styles.flex}
        />
      </View>
      <Text style={[styles.heading, { fontSize: r.type.h2 }]}>{item.title}</Text>
      <Text
        style={[styles.body, { fontSize: r.type.body, lineHeight: r.lineHeight }]}
        selectable
      >
        {item.description}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceAlt,
    marginBottom: 16,
  },
  heading: { color: theme.colors.text, fontWeight: '700' },
  body: { color: theme.colors.text, marginTop: 10 },
  message: {
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 24,
  },
});
