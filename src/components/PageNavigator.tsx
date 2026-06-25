/**
 * Compact paging control: «  ‹  [ n ] / total  ›  »
 *
 * The number is an editable text box for direct jumps. Replaces tall prev/next
 * buttons and long pill rows — used by the scripture reader (chapters) and the
 * PDF viewer (pages). `index` is 0-based; the box shows/accepts 1-based numbers.
 */
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

type Props = {
  index: number;
  total: number;
  onChange: (next: number) => void;
  /** Optional unit label shown before the box, e.g. "Chapter" / "Page". */
  label?: string;
  fontSize?: number;
};

function Step({
  glyph,
  disabled,
  onPress,
  a11y,
}: {
  glyph: string;
  disabled: boolean;
  onPress: () => void;
  a11y: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ hovered, focused, pressed }: any) => [
        styles.step,
        disabled ? styles.stepDisabled : styles.clickable,
        !disabled ? interactionStyle({ hovered, focused, pressed }) : null,
      ]}
    >
      <Text style={styles.stepText}>{glyph}</Text>
    </Pressable>
  );
}

export function PageNavigator({ index, total, onChange, label, fontSize = 16 }: Props) {
  const r = useResponsive();
  const [draft, setDraft] = useState(String(index + 1));

  // Keep the box in sync when the index changes from elsewhere (prev/next).
  useEffect(() => setDraft(String(index + 1)), [index]);

  const commit = () => {
    const n = parseInt(draft, 10);
    if (Number.isFinite(n)) {
      const clamped = Math.max(1, Math.min(total, n));
      onChange(clamped - 1);
      setDraft(String(clamped));
    } else {
      setDraft(String(index + 1));
    }
  };

  const go = (next: number) => onChange(Math.max(0, Math.min(total - 1, next)));

  const pageBox = (style?: StyleProp<ViewStyle>) => (
    <View style={[styles.box, style]}>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commit}
        onBlur={commit}
        keyboardType="number-pad"
        returnKeyType="go"
        selectTextOnFocus
        accessibilityLabel="Go to number"
        style={[styles.input, { fontSize }]}
        underlineColorAndroid="transparent"
      />
      <Text numberOfLines={1} style={[styles.total, { fontSize }]}>
        / {total}
      </Text>
    </View>
  );

  if (r.bp === 'sm') {
    return (
      <View style={styles.mobileBar}>
        {label ? <Text style={[styles.label, styles.mobileLabel, { fontSize }]}>{label}</Text> : null}
        <View style={styles.mobileRow}>
          <Step glyph="‹" a11y="Previous" disabled={index <= 0} onPress={() => go(index - 1)} />
          {pageBox(styles.mobileBox)}
          <Step glyph="›" a11y="Next" disabled={index >= total - 1} onPress={() => go(index + 1)} />
        </View>
        <View style={styles.mobileRow}>
          <Step glyph="«" a11y="First" disabled={index <= 0} onPress={() => go(0)} />
          <View style={styles.mobileBoxSpacer} />
          <Step glyph="»" a11y="Last" disabled={index >= total - 1} onPress={() => go(total - 1)} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bar}>
      {label ? <Text style={[styles.label, { fontSize }]}>{label}</Text> : null}
      <Step glyph="«" a11y="First" disabled={index <= 0} onPress={() => go(0)} />
      <Step glyph="‹" a11y="Previous" disabled={index <= 0} onPress={() => go(index - 1)} />
      {pageBox()}
      <Step glyph="›" a11y="Next" disabled={index >= total - 1} onPress={() => go(index + 1)} />
      <Step glyph="»" a11y="Last" disabled={index >= total - 1} onPress={() => go(total - 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  label: { color: theme.colors.muted, marginRight: 2 },
  mobileBar: {
    alignItems: 'stretch',
    gap: 8,
    paddingVertical: 8,
  },
  mobileLabel: {
    marginRight: 0,
    textAlign: 'center',
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  step: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickable: { cursor: 'pointer' },
  stepDisabled: { opacity: 0.35 },
  stepText: { color: theme.colors.text, fontSize: 20, fontWeight: '700', lineHeight: 22 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },
  mobileBox: {
    flex: 1,
    justifyContent: 'center',
  },
  mobileBoxSpacer: {
    flex: 1,
  },
  input: {
    minWidth: 48,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  total: { color: theme.colors.muted, flexShrink: 0, minWidth: 34 },
});
