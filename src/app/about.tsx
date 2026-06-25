/**
 * About screen: static app description + contact info. No backend.
 */
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { theme } from '@/config/appConfig';

export default function AboutScreen() {
  return (
    <Screen title="About" scroll>
      <Text selectable style={styles.appName}>
        MeTHiNK
      </Text>

      <Text selectable style={styles.body}>
        MeTHiNK is the app for thinkers and those wanting to take their thoughts to the next
        level. We go throughout our days thinking and this app will allow you to turn your
        thoughts into the products you have always imagined.
      </Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Contact</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text selectable style={styles.body}>
            C. Reuben Watkins IV
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL('mailto:reubenremone@hotmail.com')}
            hitSlop={6}
          >
            <Text selectable style={styles.link}>
              reubenremone@hotmail.com
            </Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Region</Text>
          <Text selectable style={styles.body}>
            North America — Kentucky, US
          </Text>
        </View>
      </View>

      <Text selectable style={styles.footer}>
        © MeTHiNK. Recreated as a universal Expo app.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 16,
  },
  body: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  section: {
    marginTop: 28,
    gap: 10,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    gap: 2,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  link: {
    color: theme.colors.accent,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 32,
  },
});
