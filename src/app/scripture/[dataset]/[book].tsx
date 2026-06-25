/**
 * Scripture reader: shows one book's chapters and verses.
 *
 * Loads chapters for the decoded book name, lets the user pick a chapter via a
 * horizontal pill selector (hidden for single-chapter books), renders the
 * selected chapter's verses with selectable text (so web users can copy and
 * Ctrl+F search), and offers prev/next chapter navigation.
 */
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';
import {
  loadBook,
  type Chapter,
  type DatasetId,
} from '@/data/scripture.generated';

export default function ReaderScreen() {
  const { dataset, book } = useLocalSearchParams<{
    dataset: DatasetId;
    book: string;
  }>();
  // The exact (untrimmed) book string must be passed to loadBook; some book
  // names carry trailing spaces / special characters, so only decode here.
  const bookName = decodeURIComponent(book);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setCurrentChapter(0);

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
      <Screen title={bookName}>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </Screen>
    );
  }

  if (error || chapters.length === 0) {
    return (
      <Screen title={bookName}>
        <Text style={styles.message}>
          We couldn&apos;t load this book. Please try again.
        </Text>
      </Screen>
    );
  }

  const chapter = chapters[currentChapter];
  const showSelector = chapters.length > 1;

  return (
    <Screen title={bookName} scroll>
      {showSelector ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
          style={styles.pillScroll}
        >
          {chapters.map((c, index) => {
            const selected = index === currentChapter;
            return (
              <Pressable
                key={c.number}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCurrentChapter(index)}
                style={[styles.pill, selected ? styles.pillSelected : null]}
              >
                <Text
                  style={[
                    styles.pillText,
                    selected ? styles.pillTextSelected : null,
                  ]}
                >
                  {c.number}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <View style={styles.verses}>
        {chapter.verses.map((verse, index) => (
          <View key={index} style={styles.verseRow}>
            <Text style={styles.verseNumber}>{index + 1}</Text>
            <Text selectable style={styles.verseText}>
              {verse}
            </Text>
          </View>
        ))}
      </View>

      {showSelector ? (
        <View style={styles.nav}>
          <NavButton
            label="‹ Previous"
            disabled={currentChapter === 0}
            onPress={() => setCurrentChapter((c) => Math.max(0, c - 1))}
          />
          <NavButton
            label="Next ›"
            disabled={currentChapter === chapters.length - 1}
            onPress={() =>
              setCurrentChapter((c) => Math.min(chapters.length - 1, c + 1))
            }
          />
        </View>
      ) : null}
    </Screen>
  );
}

function NavButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.navBtn,
        disabled ? styles.navBtnDisabled : null,
        pressed && !disabled ? styles.navBtnPressed : null,
      ]}
    >
      <Text style={styles.navBtnText}>{label}</Text>
    </Pressable>
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
  pillScroll: { marginBottom: 16 },
  pillRow: { gap: 8, paddingVertical: 4 },
  pill: {
    minWidth: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: { backgroundColor: theme.colors.accent },
  pillText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  pillTextSelected: { color: theme.colors.onAccent },
  verses: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  verseRow: { flexDirection: 'row', marginBottom: 12 },
  verseNumber: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 24,
    marginRight: 8,
    minWidth: 22,
    textAlign: 'right',
  },
  verseText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnPressed: { opacity: 0.6 },
  navBtnText: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
});
