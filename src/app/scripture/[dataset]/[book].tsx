/**
 * Scripture reader: shows one book's chapters and verses.
 *
 * Loads chapters for the decoded book name, lets the user pick a chapter, and
 * renders the selected chapter's verses with selectable text (so web users can
 * copy and Ctrl+F search).
 *
 * Chapter navigation has two responsive modes:
 *  - Phone: a horizontal pill selector above the verses + Prev/Next buttons.
 *  - Desktop (multi-chapter): a persistent vertical chapter rail to the left of
 *    the reading column.
 * Single-chapter books show neither — just the verses.
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
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function ReaderScreen() {
  const { dataset, book } = useLocalSearchParams<{
    dataset: DatasetId;
    book: string;
  }>();
  const r = useResponsive('read');
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
        <Text style={styles.message}>
          We couldn&apos;t load this book. Please try again.
        </Text>
      </Screen>
    );
  }

  const chapter = chapters[currentChapter];
  const multiChapter = chapters.length > 1;
  const useRail = r.isDesktop && multiChapter;

  // Verse list, shared by both layouts. Slightly looser spacing on larger
  // screens for comfortable long-form reading.
  const verses = (
    <View style={styles.verses}>
      {chapter.verses.map((verse, index) => (
        <View
          key={index}
          style={[styles.verseRow, { marginBottom: r.isDesktop ? 16 : 12 }]}
        >
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
  );

  return (
    <Screen title={bookName} variant="read" scroll>
      {/* Desktop multi-chapter: two-pane (rail + verses). */}
      {useRail ? (
        <View style={styles.twoPane}>
          <ScrollView
            style={styles.rail}
            contentContainerStyle={styles.railContent}
            showsVerticalScrollIndicator={false}
          >
            {chapters.map((c, index) => {
              const selected = index === currentChapter;
              return (
                <Pressable
                  key={c.number}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setCurrentChapter(index)}
                  style={({ hovered, focused, pressed }: any) => [
                    styles.railItem,
                    selected ? styles.railItemSelected : null,
                    interactionStyle({ hovered, focused, pressed }),
                  ]}
                >
                  <Text
                    style={[
                      styles.railText,
                      { fontSize: r.type.body },
                      selected ? styles.selectedText : null,
                    ]}
                  >
                    {c.number}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.pane}>{verses}</View>
        </View>
      ) : (
        <>
          {/* Phone multi-chapter: horizontal pills above the verses. */}
          {multiChapter ? (
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
                    style={({ hovered, focused, pressed }: any) => [
                      styles.pill,
                      selected ? styles.pillSelected : null,
                      interactionStyle({ hovered, focused, pressed }),
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { fontSize: r.type.small },
                        selected ? styles.selectedText : null,
                      ]}
                    >
                      {c.number}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}

          {verses}

          {multiChapter ? (
            <View style={styles.nav}>
              <NavButton
                label="‹ Previous"
                size={r.type.body}
                disabled={currentChapter === 0}
                onPress={() => setCurrentChapter((c) => Math.max(0, c - 1))}
              />
              <NavButton
                label="Next ›"
                size={r.type.body}
                disabled={currentChapter === chapters.length - 1}
                onPress={() =>
                  setCurrentChapter((c) => Math.min(chapters.length - 1, c + 1))
                }
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

function NavButton({
  label,
  size,
  disabled,
  onPress,
}: {
  label: string;
  size: number;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ hovered, focused, pressed }: any) => [
        styles.navBtn,
        disabled ? styles.navBtnDisabled : null,
        !disabled ? interactionStyle({ hovered, focused, pressed }) : null,
        !disabled ? styles.clickable : null,
      ]}
    >
      <Text style={[styles.navBtnText, { fontSize: size }]}>{label}</Text>
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

  // Desktop two-pane layout.
  twoPane: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  rail: { width: 120, maxHeight: 560 },
  railContent: { gap: 6, paddingVertical: 2, paddingRight: 4 },
  railItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    cursor: 'pointer',
  },
  railItemSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  railText: { color: theme.colors.text, fontWeight: '600' },
  pane: { flex: 1, minWidth: 0 },

  // Phone horizontal pills.
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
    cursor: 'pointer',
  },
  pillSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  pillText: { color: theme.colors.text, fontWeight: '600' },

  // Shared selected-label color for pills + rail items.
  selectedText: { color: theme.colors.onAccent },

  verses: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  verseRow: { flexDirection: 'row' },
  verseNumber: {
    color: theme.colors.muted,
    fontWeight: '700',
    marginRight: 8,
    minWidth: 22,
    textAlign: 'right',
  },
  verseText: {
    flex: 1,
    color: theme.colors.text,
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
  clickable: { cursor: 'pointer' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { color: theme.colors.text, fontWeight: '600' },
});
