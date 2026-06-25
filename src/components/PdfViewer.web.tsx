/**
 * Web PDF viewer (pdf.js): renders one page at a time to a real <canvas>, sized
 * to the content width, inside a scrollable area, with a PageNavigator for
 * direct page jumps. Self-contained so it works on mobile browsers (which don't
 * reliably render PDFs in an <iframe>) and offline of any third-party viewer.
 */
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
// Type-only import (erased at runtime). The library itself is loaded lazily on
// the client inside an effect — importing it at module scope would execute
// browser-only code during the static (Node) prerender and crash the build.
import type * as Pdfjs from 'pdfjs-dist';

import { PageNavigator } from '@/components/PageNavigator';
import { theme } from '@/config/appConfig';
import { useResponsive } from '@/theme/responsive';

type Props = { uri: string; title: string; description?: string };

export function PdfViewer({ uri, title }: Props) {
  const r = useResponsive('default');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfRef = useRef<any>(null);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(0); // 0-based
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Target render width (cap so very wide desktops don't render huge canvases).
  const renderWidth = Math.min(Math.max(r.contentWidth, 280), 900);

  // Load the document once per uri (pdf.js imported lazily, client-only).
  useEffect(() => {
    let active = true;
    let task: ReturnType<typeof Pdfjs.getDocument> | null = null;
    setLoading(true);
    setError(false);
    setPage(0);
    (async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        task = pdfjsLib.getDocument({ url: uri });
        const pdf = await task.promise;
        if (!active) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch {
        if (!active) return;
        setError(true);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
      task?.destroy?.();
    };
  }, [uri]);

  // Render the current page whenever it (or the width) changes.
  useEffect(() => {
    const pdf = pdfRef.current;
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const pageObj = await pdf.getPage(page + 1);
      if (cancelled) return;
      const unscaled = pageObj.getViewport({ scale: 1 });
      const scale = renderWidth / unscaled.width;
      const viewport = pageObj.getViewport({ scale });
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      await pageObj.render({ canvasContext: ctx, viewport }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [page, numPages, renderWidth]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.msg, { fontSize: r.type.body }]}>
          We couldn&apos;t render this document.{' '}
          {/* Last-resort open in a new tab. */}
          <Text
            accessibilityRole="link"
            // @ts-expect-error web anchor props
            href={uri}
            target="_blank"
            style={styles.link}
          >
            Open it in a new tab
          </Text>
          .
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.navWrap}>
        <PageNavigator
          label="Page"
          index={page}
          total={numPages}
          onChange={setPage}
          fontSize={r.type.body}
        />
      </View>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        {/* Raw DOM canvas (this file only renders on web). */}
        <canvas ref={canvasRef} aria-label={title} style={{ borderRadius: 8 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  msg: { color: theme.colors.text, textAlign: 'center', paddingHorizontal: 16 },
  link: { color: theme.colors.accent, textDecorationLine: 'underline' },
  navWrap: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  scrollContent: { alignItems: 'center', paddingBottom: 24 },
});
