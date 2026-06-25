/**
 * Scripture reader: shows one book's chapters and verses.
 *
 * Top half: a compact chapter navigator («  ‹  [n] / total  ›  »), with a
 * direct-jump box. Bottom half: the selected chapter's verses (selectable so web
 * users can copy and Ctrl+F search). Same layout on phone and desktop.
 * Single-chapter books show no navigator.
 */
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PageNavigator } from '@/components/PageNavigator';
import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';
import { SCRIPTURES, loadBook, type Chapter, type DatasetId } from '@/data/scripture.generated';
import { useResponsive } from '@/theme/responsive';

/** Prerender every book of every dataset (real titles + SEO + no hydration mismatch). */
export async function generateStaticParams(): Promise<{ dataset: string; book: string }[]> {
  const params: { dataset: string; book: string }[] = [];
  for (const ds of Object.values(SCRIPTURES)) {
    for (const t of ds.testaments) {
      for (const book of t.books) params.push({ dataset: ds.id, book });
    }
  }
  return params;
}

export default function ReaderScreen() {
  const { dataset, book } = useLocalSearchParams<{ dataset: DatasetId; book: string }>();
  const r = useResponsive('read');
  // The exact (untrimmed) book string must be passed to loadBook; some book
  // names carry trailing spaces / special characters, so only decode here.
  const bookName = decodeURIComponent(book);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setCurrent(0);

    loadBook(dataset, bookName)
      .then((result) => {
        if (!active) return;
        setChapters(result);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dataset, bookName]);

  if (loading) {
    return (
      <Screen title={bookName} variant="read">
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </Screen>
    );
  }

  if (error || chapters.length === 0) {
    return (
      <Screen title={bookName} variant="read">
        <Text style={styles.message}>We couldn&apos;t load this book. Please try again.</Text>
      </Screen>
    );
  }

  const chapter = chapters[Math.min(current, chapters.length - 1)];
  const multiChapter = chapters.length > 1;

  return (
    <Screen title={bookName} variant="read" scroll>
      {/* Top: chapter navigator (hidden for single-chapter books). */}
      {multiChapter ? (
        <View style={styles.navWrap}>
          <PageNavigator
            label="Chapter"
            index={current}
            total={chapters.length}
            onChange={setCurrent}
            fontSize={r.type.body}
          />
        </View>
      ) : null}

      {/* Bottom: verses for the current chapter. */}
      <View style={styles.verses}>
        {chapter.verses.map((verse, index) => (
          <View key={index} style={[styles.verseRow, { marginBottom: r.isDesktop ? 14 : 12 }]}>
            <Text style={[styles.verseNumber, { fontSize: r.type.small, lineHeight: r.lineHeight }]}>
              {index + 1}
            </Text>
            <Text
              selectable
              style={[styles.verseText, { fontSize: r.type.verse, lineHeight: r.lineHeight }]}
            >
              {verse}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  navWrap: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    marginBottom: 14,
  },
  verses: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  verseRow: { flexDirection: 'row' },
  verseNumber: {
    color: theme.colors.muted,
    fontWeight: '700',
    marginRight: 8,
    minWidth: 22,
    textAlign: 'right',
  },
  verseText: { flex: 1, color: theme.colors.text },
});
