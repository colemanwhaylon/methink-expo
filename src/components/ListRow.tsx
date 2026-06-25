/** Reusable translucent list row with a title, optional subtitle and chevron. */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/config/appConfig';

type Props = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showChevron?: boolean;
};

export function ListRow({ title, subtitle, onPress, right, showChevron = true }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
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
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  pressed: { opacity: 0.6 },
  texts: { flex: 1 },
  title: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 3 },
  chevron: { color: theme.colors.text, fontSize: 24, marginLeft: 8 },
});
