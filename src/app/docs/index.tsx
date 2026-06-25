/**
 * Docs index: list of bundled PDF documents.
 *
 * Reads the `docs` page from appConfig and renders one ListRow per document.
 * Tapping a row opens the PDF viewer, addressed by array index so the route
 * stays stable regardless of document titles.
 */
import { router } from 'expo-router';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { getPage, type DocsPage } from '@/config/appConfig';

export default function DocsScreen() {
  const docs = getPage('docs') as DocsPage;

  return (
    <Screen title="Docs" scroll>
      {docs.documents.map((doc, i) => (
        <ListRow
          key={doc.title}
          title={doc.title}
          subtitle={doc.description}
          onPress={() => router.push(`/docs/${i}` as any)}
        />
      ))}
    </Screen>
  );
}
