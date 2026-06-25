/**
 * Docs index: grid of bundled PDF documents.
 *
 * Reads the `docs` page from appConfig and renders a responsive card grid
 * (1 column on phones, 2–3 on desktop). Tapping a card opens the PDF viewer,
 * addressed by array index so the route stays stable regardless of titles.
 */
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { getPage, theme, type DocsPage } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function DocsScreen() {
  const docs = getPage('docs') as DocsPage;
  const r = useResponsive('default');
  const cols = r.columns(260, 1, 3);

  // Chunk documents into rows so the last row can be padded with flex spacers,
  // keeping every card the same width regardless of how many land on a row.
  const rows: { doc: DocsPage['documents'][number]; i: number }[][] = [];
  docs.documents.forEach((doc, i) => {
    const row = Math.floor(i / cols);
    (rows[row] ??= []).push({ doc, i });
  });

  return (
    <Screen title="Docs" variant="default" scroll>
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.row, { gap: r.gap, marginBottom: r.gap }]}>
          {row.map(({ doc, i }) => (
            <Pressable
              key={doc.title}
              accessibilityRole="button"
              onPress={() => router.push(`/docs/${i}` as any)}
              style={({ hovered, focused, pressed }: any) => [
                styles.card,
                styles.cell,
                hovered ? styles.cardHover : null,
                interactionStyle({ focused, pressed }),
              ]}
            >
              <Text style={[styles.title, { fontSize: r.type.title }]} numberOfLines={2}>
                {doc.title}
              </Text>
              <Text style={[styles.description, { fontSize: r.type.small }]} numberOfLines={3}>
                {doc.description}
              </Text>
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
    padding: 16,
    cursor: 'pointer',
  },
  cardHover: { borderColor: theme.colors.accent, backgroundColor: 'rgba(0,0,0,0.55)' },
  title: { color: theme.colors.text, fontWeight: '700' },
  description: { color: theme.colors.muted, marginTop: 6 },
});
