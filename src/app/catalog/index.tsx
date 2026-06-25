/**
 * Catalog index: Mind / Body / Soul video items.
 *
 * Reads the `catalog` page from appConfig and renders one pressable card per
 * item with a 16:9 thumbnail, title and description. Tapping a card opens the
 * item detail (with the embedded video), addressed by array index.
 */
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { getPage, theme, type CatalogPage } from '@/config/appConfig';

export default function CatalogScreen() {
  const catalog = getPage('catalog') as CatalogPage;

  return (
    <Screen title="Catalog" scroll>
      {catalog.items.map((item, i) => (
        <Pressable
          key={item.title}
          accessibilityRole="button"
          onPress={() => router.push(`/catalog/${i}` as any)}
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
        >
          <Image source={item.image} style={styles.thumb} contentFit="cover" />
          <View style={styles.texts}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  pressed: { opacity: 0.7 },
  thumb: { width: '100%', aspectRatio: 16 / 9 },
  texts: { padding: 14 },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: '700' },
  description: { color: theme.colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
});
