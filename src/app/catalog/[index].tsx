/**
 * Catalog item detail: embedded YouTube video plus title and description.
 *
 * Resolves the item by array index. The video is embedded 16:9 at the top via
 * the YouTube /embed URL (rendered as an iframe on web, a WebView on native).
 */
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { EmbeddedWeb } from '@/components/EmbeddedWeb';
import { Screen } from '@/components/Screen';
import { getPage, theme, type CatalogPage } from '@/config/appConfig';

export default function CatalogItemScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const item = (getPage('catalog') as CatalogPage).items[Number(index)];

  if (!item) {
    return (
      <Screen title="Not found">
        <Text style={styles.message}>That item is not available.</Text>
      </Screen>
    );
  }

  return (
    <Screen title={item.title} scroll>
      <View style={styles.video}>
        <EmbeddedWeb
          uri={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          style={styles.flex}
        />
      </View>
      <Text style={styles.heading}>{item.title}</Text>
      <Text style={styles.body} selectable>
        {item.description}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  video: {
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceAlt,
    marginBottom: 16,
  },
  heading: { color: theme.colors.text, fontSize: 22, fontWeight: '700' },
  body: { color: theme.colors.text, fontSize: 15, lineHeight: 22, marginTop: 10 },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
