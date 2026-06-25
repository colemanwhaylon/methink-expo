/**
 * Twitter screen: an embedded X/Twitter timeline with an open-in-browser fallback.
 *
 * The official X widget (platform.twitter.com/widgets.js) is injected via an
 * HTML string. On web the embed is hosted in an <iframe srcDoc>, and the X
 * widget can refuse to mount inside a srcDoc origin; the footer "Open on X"
 * button is the guaranteed escape hatch in that case.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { Screen } from '@/components/Screen';
import { EmbeddedWeb } from '@/components/EmbeddedWeb';
import { getPage, theme, type TwitterPage } from '@/config/appConfig';
import { interactionStyle, useResponsive } from '@/theme/responsive';

export default function TwitterScreen() {
  const page = getPage('twitter') as TwitterPage;
  const handle = page.handles[0];
  const r = useResponsive('default');

  // The X timeline reads best in a narrow column; cap it well under the
  // full content width so it stays readable on desktop.
  const timelineWidth = Math.min(r.contentWidth, 520);

  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;background:#000}</style></head><body><a class="twitter-timeline" data-theme="dark" data-height="100%" href="https://twitter.com/${handle}?ref_src=twsrc%5Etfw">Tweets by @${handle}</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></body></html>`;

  return (
    <Screen title="Twitter" variant="default">
      <View style={styles.center}>
        <View style={[styles.column, { maxWidth: timelineWidth }]}>
          <EmbeddedWeb html={html} title="Twitter" style={{ flex: 1 }} />

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open @${handle} on X`}
              onPress={() => WebBrowser.openBrowserAsync(`https://x.com/${handle}`)}
              style={({ hovered, focused, pressed }: any) => [
                styles.button,
                interactionStyle({ hovered, focused, pressed }),
              ]}
            >
              <Text style={[styles.buttonText, { fontSize: r.type.body }]}>Open @{handle} on X</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center' },
  column: { flex: 1, width: '100%' },
  footer: {
    paddingVertical: 12,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    cursor: 'pointer',
  },
  buttonText: {
    color: theme.colors.onAccent,
    fontWeight: '700',
  },
});
