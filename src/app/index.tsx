import { StyleSheet, View } from 'react-native';

import { GridTile } from '@/components/GridTile';
import { Screen } from '@/components/Screen';
import { pages, type Page } from '@/config/appConfig';

/** Route for a home tile, derived from the page kind. */
function hrefFor(page: Page): string {
  if (page.kind === 'scripture') return `/scripture/${page.dataset}`;
  return `/${page.slug}`;
}

export default function Home() {
  // Lay tiles out in a 3-column grid, padding the last row for even sizing.
  const columns = 3;
  const rows: Page[][] = [];
  for (let i = 0; i < pages.length; i += columns) {
    rows.push(pages.slice(i, i + columns));
  }

  return (
    <Screen brandTitle scroll>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((page) => (
            <GridTile key={page.slug} href={hrefFor(page)} title={page.title} icon={page.icon} />
          ))}
          {row.length < columns
            ? Array.from({ length: columns - row.length }).map((_, i) => (
                <View key={`spacer-${i}`} style={styles.spacer} />
              ))
            : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  spacer: { flex: 1, margin: 6 },
});
