/**
 * PDF viewer for a single bundled document, addressed by array index.
 *
 * The PDF ships as a bundled asset (a require()'d module id), so we resolve it to
 * a usable URL with expo-asset, then hand it to PdfViewer. PdfViewer is platform
 * split: on web it renders pages with pdf.js (scrollable, paginated); on native
 * it opens the system browser.
 */
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Asset } from 'expo-asset';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PdfViewer } from '@/components/PdfViewer';
import { Screen } from '@/components/Screen';
import { getPage, theme, type DocsPage } from '@/config/appConfig';
import { useResponsive } from '@/theme/responsive';

/** Prerender one page per bundled document. */
export async function generateStaticParams(): Promise<{ index: string }[]> {
  return (getPage('docs') as DocsPage).documents.map((_, i) => ({ index: String(i) }));
}

export default function DocViewerScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const doc = (getPage('docs') as DocsPage).documents[Number(index)];
  const r = useResponsive('default');

  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) return;
    let active = true;
    (async () => {
      const asset = Asset.fromModule(doc.asset);
      await asset.downloadAsync();
      if (active) setUri(asset.localUri ?? asset.uri);
    })();
    return () => {
      active = false;
    };
  }, [doc]);

  if (!doc) {
    return (
      <Screen title="Not found">
        <Text style={[styles.message, { fontSize: r.type.body }]}>
          That document is not available.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen title={doc.title} variant="default">
      {uri ? (
        <PdfViewer uri={uri} title={doc.title} description={doc.description} />
      ) : (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.text} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  message: { color: theme.colors.text, textAlign: 'center', marginTop: 24 },
});
