/**
 * Now-playing bar for the Music screen.
 *
 * Pure presentational component: it renders the current track, transport
 * controls (prev / play-pause / next) and a thin progress track. All playback
 * state is owned by the parent (music/index.tsx) which drives this from
 * expo-audio's useAudioPlayerStatus.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/config/appConfig';

type Props = {
  /** Title of the selected track, or null when nothing is selected yet. */
  title: string | null;
  playing: boolean;
  /** Playback position in seconds. */
  position: number;
  /** Track duration in seconds (0 until loaded). */
  duration: number;
  canPrev: boolean;
  canNext: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/** Format a number of seconds as m:ss (e.g. 194 -> "3:14"). */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayerBar({
  title,
  playing,
  position,
  duration,
  canPrev,
  canNext,
  onTogglePlay,
  onPrev,
  onNext,
}: Props) {
  const hasTrack = title !== null;
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <View style={styles.bar}>
      {/* progress track */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={hasTrack ? styles.title : styles.placeholder} numberOfLines={1}>
            {hasTrack ? title : 'Select a track'}
          </Text>
          {hasTrack ? (
            <Text style={styles.time}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          ) : null}
        </View>

        <View style={styles.controls}>
          <ControlButton label="Previous" glyph="⏮" onPress={onPrev} disabled={!canPrev} />
          <ControlButton
            label={playing ? 'Pause' : 'Play'}
            glyph={playing ? '⏸' : '▶'}
            onPress={onTogglePlay}
            disabled={!hasTrack}
            primary
          />
          <ControlButton label="Next" glyph="⏭" onPress={onNext} disabled={!canNext} />
        </View>
      </View>
    </View>
  );
}

type ControlProps = {
  label: string;
  glyph: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
};

function ControlButton({ label, glyph, onPress, disabled, primary }: ControlProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.ctrl,
        primary && styles.ctrlPrimary,
        pressed && !disabled ? styles.ctrlPressed : null,
        disabled && styles.ctrlDisabled,
      ]}
    >
      <Text style={[styles.ctrlGlyph, primary && styles.ctrlGlyphPrimary]}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingTop: 0,
  },
  progressTrack: {
    height: 3,
    backgroundColor: theme.colors.surfaceAlt,
    width: '100%',
  },
  progressFill: {
    height: 3,
    backgroundColor: theme.colors.accent,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  info: { flex: 1, marginRight: 12 },
  title: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  placeholder: { color: theme.colors.muted, fontSize: 15, fontStyle: 'italic' },
  time: { color: theme.colors.muted, fontSize: 12, marginTop: 3 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  ctrl: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  ctrlPrimary: {
    backgroundColor: theme.colors.accent,
  },
  ctrlPressed: { opacity: 0.6 },
  ctrlDisabled: { opacity: 0.35 },
  ctrlGlyph: { color: theme.colors.text, fontSize: 20, lineHeight: 22 },
  ctrlGlyphPrimary: { color: theme.colors.onAccent },
});
