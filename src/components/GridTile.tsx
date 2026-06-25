/** A single home-grid tile: module icon over a translucent card with a label. */
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { theme } from '@/config/appConfig';
import { interactionStyle } from '@/theme/responsive';

type Props = { href: string; title: string; icon: ImageSourcePropType; labelSize?: number };

export function GridTile({ href, title, icon, labelSize = 14 }: Props) {
  return (
    <Link href={href as any} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ hovered, focused, pressed }: any) => [
          styles.tile,
          hovered && styles.tileHover,
          interactionStyle({ hovered, focused, pressed }),
        ]}
      >
        <View style={styles.iconWrap}>
          <Image source={icon} style={styles.icon} contentFit="contain" />
        </View>
        <Text style={[styles.label, { fontSize: labelSize }]} numberOfLines={1}>
          {title}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    cursor: 'pointer',
  },
  tileHover: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  iconWrap: { flex: 1, width: '72%', alignItems: 'center', justifyContent: 'center' },
  icon: { width: '100%', height: '100%' },
  label: {
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});
