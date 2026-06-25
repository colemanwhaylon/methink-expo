/**
 * Branded, responsive screen shell used by every MeTHiNK screen.
 *
 * - Renders the app background with the configured overlay/opacity.
 * - On desktop (>= DESKTOP_MIN) shows a persistent NavSidebar + content area;
 *   on mobile shows a top header with a back button.
 * - Centers content at a max width that depends on `variant`:
 *     'default' -> grids/lists, 'read' -> long-form reading, 'full' -> fill (embeds).
 */
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavSidebar } from '@/components/NavSidebar';
import { theme } from '@/config/appConfig';
import { interactionStyle, useResponsive, type ScreenVariant } from '@/theme/responsive';

type Props = {
  title?: string;
  brandTitle?: boolean;
  showBack?: boolean;
  scroll?: boolean;
  /** Layout width profile. 'full' makes children fill (for embeds). */
  variant?: ScreenVariant;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

export function Screen({
  title,
  brandTitle,
  showBack,
  scroll,
  variant = 'default',
  contentStyle,
  children,
}: Props) {
  const r = useResponsive(variant);
  const canGoBack = showBack ?? !brandTitle;
  const isFull = variant === 'full';
  // r.isDesktop is mount-stable (see useResponsive), so this is hydration-safe.
  const isDesktop = r.isDesktop;

  // The centered content column.
  const column: ViewStyle = {
    width: '100%',
    maxWidth: Number.isFinite(r.maxWidth) ? r.maxWidth : undefined,
    alignSelf: 'center',
    paddingHorizontal: isFull ? 0 : r.padding,
    flex: scroll ? undefined : 1,
  };

  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      <View style={column}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.flex, isFull ? styles.fullBody : null]}>
      <View style={[column, contentStyle]}>{children}</View>
    </View>
  );

  return (
    <ImageBackground source={theme.homeBackground} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.shell}>
          {isDesktop ? <NavSidebar /> : null}

          <View style={styles.flex}>
            {/* Header: hidden on desktop home (sidebar carries the brand); a slim
                title bar elsewhere. On mobile, always a header with back/brand. */}
            {isDesktop && brandTitle ? null : (
              <View style={[styles.header, { paddingHorizontal: isDesktop ? 24 : 12 }]}>
                {canGoBack && !isDesktop ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                    style={({ hovered, focused, pressed }: any) => [
                      styles.backBtn,
                      hovered && styles.backHover,
                      interactionStyle({ focused, pressed }),
                    ]}
                    hitSlop={10}
                  >
                    <Text style={styles.backChevron}>‹</Text>
                  </Pressable>
                ) : (
                  <View style={styles.backBtn} />
                )}

                {brandTitle && !isDesktop ? (
                  <Image
                    source={theme.titleImage}
                    style={styles.titleImage}
                    contentFit="contain"
                    accessibilityLabel={theme.headerText}
                  />
                ) : (
                  <Text style={[styles.titleText, { fontSize: r.type.h2 }]} numberOfLines={1}>
                    {title ?? theme.headerText}
                  </Text>
                )}

                <View style={styles.backBtn} />
              </View>
            )}

            {inner}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1, backgroundColor: theme.colors.background },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    opacity: 1 - theme.backgroundOpacity,
  },
  shell: { flex: 1, flexDirection: 'row' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    minHeight: 56,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  backHover: { backgroundColor: 'rgba(151,192,238,0.15)' },
  backChevron: { color: theme.colors.text, fontSize: 34, lineHeight: 36, marginTop: -4 },
  titleImage: { flex: 1, height: 40, marginHorizontal: 8, maxWidth: 220, alignSelf: 'center' },
  titleText: { flex: 1, textAlign: 'center', color: theme.colors.text, fontWeight: '700' },
  fullBody: { paddingHorizontal: 0 },
  scrollContent: { paddingBottom: 40 },
});
