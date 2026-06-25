/** Web implementation: render an <iframe>. */
import { View } from 'react-native';

type Props = { uri?: string; html?: string; title?: string; style?: any };

export function EmbeddedWeb({ uri, html, title, style }: Props) {
  return (
    <View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <iframe
        title={title ?? 'embedded content'}
        src={uri}
        srcDoc={html}
        style={{ border: 0, width: '100%', height: '100%' }}
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </View>
  );
}
