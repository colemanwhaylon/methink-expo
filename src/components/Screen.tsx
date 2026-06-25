/**
 * Branded screen shell used by every MeTHiNK screen.
 *
 * Renders the app background image with the configured dark overlay/opacity, a
 * header (MeTHiNK title art on the home screen; back button + title elsewhere),
 * and the screen body. Keeps all chrome consistent so feature screens only
 * provide their content.
 */
import { router } from 'expo-router';
import { Image } from 'expo-image';
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

import { theme } from '@/config/appConfig';

type Props = {
  title?: string;
  /** Show the home title artwork instead of a text title (home screen only). */
  brandTitle?: boolean;
  /** Show a back chevron. Defaults to true unless brandTitle is set. */
  showBack?: boolean;
  /** Wrap children in a ScrollView. */
  scroll?: boolean;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

export function Screen({ title, brandTitle, showBack, scroll, contentStyle, children }: Props) {
  const canGoBack = showBack ?? !brandTitle;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.body, contentStyle]}>{children}</View>
  );

  return (
    <ImageBackground source={theme.homeBackground} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              style={styles.backBtn}
              hitSlop={10}
            >
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>
          ) : (
            <View style={styles.backBtn} />
          )}

          {brandTitle ? (
            <Image
              source={theme.titleImage}
              style={styles.titleImage}
              contentFit="contain"
              accessibilityLabel={theme.headerText}
            />
          ) : (
            <Text style={styles.titleText} numberOfLines={1}>
              {title ?? theme.headerText}
            </Text>
          )}

          <View style={styles.backBtn} />
        </View>

        {body}
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
    opacity: 1 - theme.backgroundOpacity, // bg shows through at configured opacity
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backChevron: { color: theme.colors.text, fontSize: 34, lineHeight: 36, marginTop: -4 },
  titleImage: { flex: 1, height: 40, marginHorizontal: 8 },
  titleText: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  body: { paddingHorizontal: 16 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
});
