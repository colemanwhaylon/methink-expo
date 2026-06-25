/** Reusable translucent list row with a title, optional subtitle and chevron. */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/config/appConfig';
import { interactionStyle } from '@/theme/responsive';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showChevron?: boolean;
  titleSize?: number;
  subtitleSize?: number;
};

export function ListRow({
  title,
  subtitle,
  onPress,
  right,
  showChevron = true,
  titleSize = 16,
  subtitleSize = 13,
}: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ hovered, focused, pressed }: any) => [
        styles.row,
        onPress && hovered ? styles.rowHover : null,
        onPress ? interactionStyle({ focused, pressed }) : null,
        onPress ? styles.clickable : null,
      ]}
    >
      <View style={styles.texts}>
        <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { fontSize: subtitleSize }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      {showChevron && onPress ? <Text style={styles.chevron}>›</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  clickable: {
    cursor: 'pointer',
  },
  rowHover: { borderColor: theme.colors.accent, backgroundColor: 'rgba(0,0,0,0.55)' },
  texts: { flex: 1 },
  title: { color: theme.colors.text, fontWeight: '600' },
  subtitle: { color: theme.colors.muted, marginTop: 3 },
  chevron: { color: theme.colors.text, fontSize: 24, marginLeft: 8 },
});
