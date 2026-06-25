/**
 * Book list for a scripture dataset (Bible / Quran / Torah).
 *
 * Reads the `dataset` route param, looks up the dataset in SCRIPTURES, and
 * renders its books grouped by testament. Testament section headers are only
 * shown when a dataset has more than one testament (Bible). Tapping a book
 * navigates to the reader; book names are URL-encoded since they contain
 * spaces and special characters.
 */
import { Fragment } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';
import { SCRIPTURES, type DatasetId } from '@/data/scripture.generated';

export default function BookListScreen() {
  const { dataset } = useLocalSearchParams<{ dataset: DatasetId }>();
  const ds = SCRIPTURES[dataset];

  if (!ds) {
    return (
      <Screen title="Not found">
        <Text style={styles.message}>That scripture is not available.</Text>
      </Screen>
    );
  }

  const showSectionHeaders = ds.testaments.length > 1;

  return (
    <Screen title={ds.title} scroll>
      {ds.testaments.map((testament) => (
        <Fragment key={testament.name}>
          {showSectionHeaders ? (
            <Text style={styles.sectionHeader}>{testament.name}</Text>
          ) : null}
          {testament.books.map((book) => (
            <ListRow
              key={book}
              title={book}
              onPress={() =>
                router.push(
                  `/scripture/${dataset}/${encodeURIComponent(book)}` as any,
                )
              }
            />
          ))}
        </Fragment>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
