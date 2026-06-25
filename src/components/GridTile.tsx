/** A single home-grid tile: module icon over a translucent card with a label. */
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { theme } from '@/config/appConfig';

type Props = { href: string; title: string; icon: ImageSourcePropType };

export function GridTile({ href, title, icon }: Props) {
  return (
    <Link href={href as any} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      >
        <View style={styles.iconWrap}>
          <Image source={icon} style={styles.icon} contentFit="contain" />
        </View>
        <Text style={styles.label} numberOfLines={1}>
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
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pressed: { opacity: 0.6, transform: [{ scale: 0.97 }] },
  iconWrap: { flex: 1, width: '70%', alignItems: 'center', justifyContent: 'center' },
  icon: { width: '100%', height: '100%' },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
