/**
 * Book list for a scripture dataset (Bible / Quran / Torah).
 *
 * Reads the `dataset` route param, looks up the dataset in SCRIPTURES, and
 * renders its books grouped by testament. Testament section headers are only
 * shown when a dataset has more than one testament (Bible). Tapping a book
 * navigates to the reader; book names are URL-encoded since they contain
 * spaces and special characters.
 *
 * Responsive: on phones books render as a single-column list; on wider screens
 * they flow into a 2–3 column grid of tappable cards.
 */
import { Fragment } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';
import { SCRIPTURES, type DatasetId } from '@/data/scripture.generated';
import { useResponsive } from '@/theme/responsive';

/** Split a list into rows of `size`, padding the last row with nulls. */
function chunk<T>(items: T[], size: number): (T | null)[][] {
  const rows: (T | null)[][] = [];
  for (let i = 0; i < items.length; i += size) {
    const row: (T | null)[] = items.slice(i, i + size);
    while (row.length < size) row.push(null);
    rows.push(row);
  }
  return rows;
}

/** Prerender one book-list page per dataset (real content + SEO + no hydration mismatch). */
export async function generateStaticParams(): Promise<{ dataset: string }[]> {
  return (Object.keys(SCRIPTURES) as DatasetId[]).map((dataset) => ({ dataset }));
}

export default function BookListScreen() {
  const { dataset } = useLocalSearchParams<{ dataset: DatasetId }>();
  const r = useResponsive('read');
  const ds = SCRIPTURES[dataset];

  if (!ds) {
    return (
      <Screen title="Not found" variant="read">
        <Text style={styles.message}>That scripture is not available.</Text>
      </Screen>
    );
  }

  const showSectionHeaders = ds.testaments.length > 1;
  // 1 column on phones, up to 3 on desktop given a ~220px target card width.
  const cols = r.columns(220, 1, 3);

  return (
    <Screen title={ds.title} variant="read" scroll>
      {ds.testaments.map((testament) => (
        <Fragment key={testament.name}>
          {showSectionHeaders ? (
            <Text style={[styles.sectionHeader, { fontSize: r.type.h2 }]}>
              {testament.name}
            </Text>
          ) : null}

          {chunk(testament.books, cols).map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.row, { gap: r.gap }]}>
              {row.map((book, colIndex) =>
                book === null ? (
                  // Spacer keeps the last row aligned with full rows above it.
                  <View key={`spacer-${colIndex}`} style={styles.cell} />
                ) : (
                  <View key={book} style={styles.cell}>
                    <ListRow
                      title={book}
                      titleSize={r.type.body}
                      onPress={() =>
                        router.push(
                          `/scripture/${dataset}/${encodeURIComponent(book)}` as any,
                        )
                      }
                    />
                  </View>
                ),
              )}
            </View>
          ))}
        </Fragment>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    color: theme.colors.text,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  // Each cell takes an equal share of the row; ListRow already adds its own
  // bottom margin so we don't double up vertical spacing here.
  cell: { flex: 1, minWidth: 0 },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
