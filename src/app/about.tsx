/**
 * About screen: static app description + contact info. No backend.
 */
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function AboutScreen() {
  const r = useResponsive('read');

  return (
    <Screen title="About" variant="read" scroll>
      <Text selectable style={[styles.appName, { fontSize: r.type.hero }]}>
        MeTHiNK
      </Text>

      <Text selectable style={[styles.body, { fontSize: r.type.body, lineHeight: r.lineHeight }]}>
        MeTHiNK is the app for thinkers and those wanting to take their thoughts to the next
        level. We go throughout our days thinking and this app will allow you to turn your
        thoughts into the products you have always imagined.
      </Text>

      <View style={styles.section}>
        <Text style={[styles.heading, { fontSize: r.type.h2 }]}>Contact</Text>

        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: r.type.small }]}>Name</Text>
          <Text selectable style={[styles.body, { fontSize: r.type.body, lineHeight: r.lineHeight }]}>
            C. Reuben Watkins IV
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: r.type.small }]}>Email</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL('mailto:reubenremone@hotmail.com')}
            hitSlop={6}
            style={({ hovered, focused, pressed }: any) => [
              styles.linkWrap,
              interactionStyle({ hovered, focused, pressed }),
            ]}
          >
            <Text selectable style={[styles.link, { fontSize: r.type.body }]}>
              reubenremone@hotmail.com
            </Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: r.type.small }]}>Region</Text>
          <Text selectable style={[styles.body, { fontSize: r.type.body, lineHeight: r.lineHeight }]}>
            North America — Kentucky, US
          </Text>
        </View>
      </View>

      <Text selectable style={[styles.footer, { fontSize: r.type.small }]}>
        © MeTHiNK. Recreated as a universal Expo app.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: theme.colors.text,
    fontWeight: '800',
    marginTop: 16,
  },
  body: {
    color: theme.colors.text,
    marginTop: 12,
  },
  section: {
    marginTop: 28,
    gap: 10,
  },
  heading: {
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    gap: 2,
  },
  label: {
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linkWrap: { alignSelf: 'flex-start', cursor: 'pointer' },
  link: {
    color: theme.colors.accent,
    textDecorationLine: 'underline',
  },
  footer: {
    color: theme.colors.muted,
    marginTop: 32,
  },
});
