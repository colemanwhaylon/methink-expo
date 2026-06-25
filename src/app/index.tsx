import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GridTile } from '@/components/GridTile';
import { Screen } from '@/components/Screen';
import { pages, theme, type Page } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

/** Route for a home tile, derived from the page kind. */
function hrefFor(page: Page): string {
  if (page.kind === 'scripture') return `/scripture/${page.dataset}`;
  return `/${page.slug}`;
}

export default function Home() {
  const r = useResponsive();
  // Columns adapt to available width (target ~168px tiles, clamped 2..6).
  const columns = r.columns(168, 2, 6);

  const rows: Page[][] = [];
  for (let i = 0; i < pages.length; i += columns) {
    rows.push(pages.slice(i, i + columns));
  }

  return (
    <Screen brandTitle scroll>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((page) => (
            <GridTile
              key={page.slug}
              href={hrefFor(page)}
              title={page.title}
              icon={page.icon}
              labelSize={r.type.body}
            />
          ))}
          {row.length < columns
            ? Array.from({ length: columns - row.length }).map((_, i) => (
                <View key={`spacer-${i}`} style={styles.spacer} />
              ))
            : null}
        </View>
      ))}

      <Link href="/about" asChild>
        <Pressable
          accessibilityRole="link"
          style={({ focused, pressed }: any) => [styles.aboutLink, interactionStyle({ focused, pressed })]}
          hitSlop={8}
        >
          <Text style={[styles.aboutText, { fontSize: r.type.small }]}>About MeTHiNK</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  spacer: { flex: 1, margin: 6 },
  aboutLink: { alignSelf: 'center', marginTop: 18, paddingVertical: 8, paddingHorizontal: 16 },
  aboutText: { color: theme.colors.text, textDecorationLine: 'underline', opacity: 0.9 },
});
