/**
 * Now-playing bar for the Music screen.
 *
 * Pure presentational component: it renders the current track, transport
 * controls (prev / play-pause / next) and a thin progress track. All playback
 * state is owned by the parent (music/index.tsx) which drives this from
 * expo-audio's useAudioPlayerStatus.
 *
 * The bar itself is full-bleed (it spans the pinned bottom of the window), but
 * its inner content is centered and capped at the same max width as the rest of
 * the screen content so controls line up with the track list on desktop.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

/** Max content width — matches the 'default' Screen variant (1040). */
const MAX_CONTENT_WIDTH = 1040;

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
  const r = useResponsive('default');
  const hasTrack = title !== null;
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <View style={styles.bar}>
      {/* progress track (full-bleed) */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Inner content centered + capped to match screen content width. */}
      <View style={[styles.inner, { paddingHorizontal: r.padding }]}>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text
              style={[hasTrack ? styles.title : styles.placeholder, { fontSize: r.type.body }]}
              numberOfLines={1}
            >
              {hasTrack ? title : 'Select a track'}
            </Text>
            {hasTrack ? (
              <Text style={[styles.time, { fontSize: r.type.small }]}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>
            ) : null}
          </View>

          <View style={styles.controls}>
            <ControlButton label="Previous" glyph="⏮" glyphSize={r.type.title} onPress={onPrev} disabled={!canPrev} />
            <ControlButton
              label={playing ? 'Pause' : 'Play'}
              glyph={playing ? '⏸' : '▶'}
              glyphSize={r.type.title}
              onPress={onTogglePlay}
              disabled={!hasTrack}
              primary
            />
            <ControlButton label="Next" glyph="⏭" glyphSize={r.type.title} onPress={onNext} disabled={!canNext} />
          </View>
        </View>
      </View>
    </View>
  );
}

type ControlProps = {
  label: string;
  glyph: string;
  glyphSize: number;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
};

function ControlButton({ label, glyph, glyphSize, onPress, disabled, primary }: ControlProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ hovered, focused, pressed }: any) => [
        styles.ctrl,
        primary && styles.ctrlPrimary,
        disabled ? styles.ctrlDisabled : styles.clickable,
        !disabled ? interactionStyle({ hovered, focused, pressed }) : null,
      ]}
    >
      <Text style={[styles.ctrlGlyph, { fontSize: glyphSize }, primary && styles.ctrlGlyphPrimary]}>
        {glyph}
      </Text>
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
  inner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
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
    paddingVertical: 12,
  },
  info: { flex: 1, marginRight: 12 },
  title: { color: theme.colors.text, fontWeight: '600' },
  placeholder: { color: theme.colors.muted, fontStyle: 'italic' },
  time: { color: theme.colors.muted, marginTop: 3 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  ctrl: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  clickable: { cursor: 'pointer' },
  ctrlPrimary: {
    backgroundColor: theme.colors.accent,
  },
  ctrlDisabled: { opacity: 0.35 },
  ctrlGlyph: { color: theme.colors.text, lineHeight: 24 },
  ctrlGlyphPrimary: { color: theme.colors.onAccent },
});
