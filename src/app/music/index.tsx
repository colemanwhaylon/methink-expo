/**
 * Music screen — collection header, tappable track list, and a pinned
 * now-playing bar.
 *
 * Playback uses expo-audio (SDK 56). A single auto-released player is created
 * with useAudioPlayer() (no initial source); selecting a track calls
 * player.replace(track.asset) then player.play(). useAudioPlayerStatus drives
 * the progress UI and auto-advance. Works on web and native.
 *
 * Screen owns its own ScrollView, so the now-playing bar is rendered as a
 * sibling overlay (absolute, pinned to the bottom) of the full-bleed Screen.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Screen } from '@/components/Screen';
import { ListRow } from '@/components/ListRow';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { getPage, theme, type MusicPage } from '@/config/appConfig';

export default function MusicScreen() {
  const page = getPage('music') as MusicPage;
  const collection = page.collections[0];
  const tracks = collection.tracks;

  // null = nothing selected yet (bar shows "Select a track").
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Single player for the whole screen; swap sources via player.replace().
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  // Enable playback even when the device is in silent mode.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {
      /* non-fatal: playback still works with the default audio mode */
    });
  }, []);

  const playIndex = useCallback(
    (index: number) => {
      const track = tracks[index];
      if (!track) return;
      setCurrentIndex(index);
      player.replace(track.asset);
      player.play();
    },
    [player, tracks]
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (index === currentIndex) {
        // Tapping the active row toggles play/pause.
        if (status.playing) player.pause();
        else player.play();
        return;
      }
      playIndex(index);
    },
    [currentIndex, status.playing, player, playIndex]
  );

  const togglePlay = useCallback(() => {
    if (currentIndex === null) return;
    if (status.playing) player.pause();
    else player.play();
  }, [currentIndex, status.playing, player]);

  const goPrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) playIndex(currentIndex - 1);
  }, [currentIndex, playIndex]);

  const goNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < tracks.length - 1) playIndex(currentIndex + 1);
  }, [currentIndex, tracks.length, playIndex]);

  // Auto-advance when a track finishes. didJustFinish can remain true across a
  // few status frames, so a ref guards against firing the advance more than once.
  const advancedFor = useRef<number | null>(null);
  useEffect(() => {
    if (!status.didJustFinish || currentIndex === null) return;
    if (advancedFor.current === currentIndex) return;
    advancedFor.current = currentIndex;
    if (currentIndex < tracks.length - 1) playIndex(currentIndex + 1);
  }, [status.didJustFinish, currentIndex, tracks.length, playIndex]);

  // Reset the auto-advance guard whenever a fresh track starts playing.
  useEffect(() => {
    if (status.playing) advancedFor.current = null;
  }, [status.playing, currentIndex]);

  const currentTitle = currentIndex !== null ? tracks[currentIndex].title : null;

  return (
    <View style={styles.root}>
      <Screen title="Music" scroll contentStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.collectionName}>{collection.name}</Text>
          <Text style={styles.artist}>{collection.artist}</Text>
          <Text style={styles.description}>{collection.description}</Text>
        </View>

        {tracks.map((track, index) => {
          const isCurrent = index === currentIndex;
          return (
            <ListRow
              key={`${track.title}-${index}`}
              title={track.title}
              onPress={() => handleSelect(index)}
              showChevron={false}
              right={
                isCurrent ? (
                  <Text style={styles.indicator}>{status.playing ? '⏸' : '▶'}</Text>
                ) : undefined
              }
            />
          );
        })}
      </Screen>

      {/* Pinned now-playing bar, overlaying the bottom of the Screen. */}
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.barOverlay}>
        <AudioPlayerBar
          title={currentTitle}
          playing={status.playing}
          position={status.currentTime ?? 0}
          duration={status.duration ?? 0}
          canPrev={currentIndex !== null && currentIndex > 0}
          canNext={currentIndex !== null && currentIndex < tracks.length - 1}
          onTogglePlay={togglePlay}
          onPrev={goPrev}
          onNext={goNext}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Leave room at the bottom of the scroll so the last row clears the bar.
  scrollContent: { paddingBottom: 120 },
  barOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  collectionName: { color: theme.colors.text, fontSize: 20, fontWeight: '700' },
  artist: { color: theme.colors.muted, fontSize: 14, marginTop: 4 },
  description: { color: theme.colors.muted, fontSize: 13, marginTop: 8, lineHeight: 18 },
  indicator: { color: theme.colors.accent, fontSize: 18, marginLeft: 8 },
});
