/** Native implementation: render a react-native-webview. */
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = { uri?: string; html?: string; title?: string; style?: any };

export function EmbeddedWeb({ uri, html, style }: Props) {
  return (
    <View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <WebView
        source={html ? { html } : { uri: uri ?? 'about:blank' }}
        originWhitelist={['*']}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction
        style={{ flex: 1, backgroundColor: 'transparent' }}
      />
    </View>
  );
}
