/**
 * Catalog index: Mind / Body / Soul video items.
 *
 * Reads the `catalog` page from appConfig and renders a responsive grid of
 * pressable cards (1 column on phones, 2–3 on desktop), each with a 16:9
 * thumbnail, title and description. Tapping a card opens the item detail
 * (with the embedded video), addressed by array index.
 */
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { getPage, theme, type CatalogPage } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function CatalogScreen() {
  const catalog = getPage('catalog') as CatalogPage;
  const r = useResponsive('default');
  const cols = r.columns(300, 1, 3);

  // Chunk items into rows so the last row can be padded with flex spacers.
  const rows: { item: CatalogPage['items'][number]; i: number }[][] = [];
  catalog.items.forEach((item, i) => {
    const row = Math.floor(i / cols);
    (rows[row] ??= []).push({ item, i });
  });

  return (
    <Screen title="Catalog" variant="default" scroll>
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.row, { gap: r.gap, marginBottom: r.gap }]}>
          {row.map(({ item, i }) => (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              onPress={() => router.push(`/catalog/${i}` as any)}
              style={({ hovered, focused, pressed }: any) => [
                styles.card,
                styles.cell,
                hovered ? styles.cardHover : null,
                interactionStyle({ focused, pressed }),
              ]}
            >
              <Image source={item.image} style={styles.thumb} contentFit="cover" />
              <View style={styles.texts}>
                <Text style={[styles.title, { fontSize: r.type.title }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text
                  style={[styles.description, { fontSize: r.type.small, lineHeight: r.type.small + 6 }]}
                >
                  {item.description}
                </Text>
              </View>
            </Pressable>
          ))}
          {/* Pad the final row so cards keep a consistent width. */}
          {Array.from({ length: cols - row.length }).map((_, k) => (
            <View key={`spacer-${k}`} style={styles.cell} />
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  cell: { flex: 1 },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 14,
    overflow: 'hidden',
    cursor: 'pointer',
  },
  cardHover: { borderColor: theme.colors.accent },
  thumb: { width: '100%', aspectRatio: 16 / 9 },
  texts: { padding: 14 },
  title: { color: theme.colors.text, fontWeight: '700' },
  description: { color: theme.colors.muted, marginTop: 6 },
});
