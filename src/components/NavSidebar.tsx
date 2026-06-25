/**
 * Persistent left navigation shown on desktop widths (>= DESKTOP_MIN).
 * Lists the MeTHiNK title, all module pages (config-driven), and About,
 * highlighting the active route.
 */
import { Image } from 'expo-image';
import { Link, usePathname } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { pages, theme, type Page } from '@/config/appConfig';
import { SIDEBAR_WIDTH, interactionStyle } from '@/theme/responsive';

function hrefFor(page: Page): string {
  if (page.kind === 'scripture') return `/scripture/${page.dataset}`;
  return `/${page.slug}`;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href as any} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ hovered, focused, pressed }: any) => [
          styles.item,
          active && styles.itemActive,
          hovered && !active && styles.itemHover,
          interactionStyle({ focused, pressed }),
        ]}
      >
        <Text style={[styles.itemText, active && styles.itemTextActive]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <View style={styles.sidebar}>
      <Link href="/" asChild>
        <Pressable accessibilityRole="link" style={styles.brand}>
          <Image
            source={theme.titleImage}
            style={styles.brandImg}
            contentFit="contain"
            accessibilityLabel={theme.headerText}
          />
        </Pressable>
      </Link>

      <ScrollView style={styles.flex} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <NavItem href="/" label="Home" active={isActive(pathname, '/')} />
        {pages.map((p) => {
          const href = hrefFor(p);
          return <NavItem key={p.slug} href={href} label={p.title} active={isActive(pathname, href)} />;
        })}
        <View style={styles.divider} />
        <NavItem href="/about" label="About" active={isActive(pathname, '/about')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.border,
    paddingTop: 8,
  },
  brand: { paddingHorizontal: 20, paddingVertical: 18 },
  brandImg: { width: '100%', height: 36 },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  item: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, marginBottom: 4 },
  itemActive: { backgroundColor: theme.colors.accent },
  itemHover: { backgroundColor: 'rgba(151,192,238,0.15)' },
  itemText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  itemTextActive: { color: theme.colors.onAccent },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border, marginVertical: 10, marginHorizontal: 8 },
});
