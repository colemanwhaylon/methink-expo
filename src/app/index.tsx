import { router } from 'expo-router';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { pages, type Page } from '@/config/appConfig';
import { useResponsive } from '@/theme/responsive';

/** Route for a menu item, derived from the page kind. */
function hrefFor(page: Page): string {
  if (page.kind === 'scripture') return `/scripture/${page.dataset}`;
  return `/${page.slug}`;
}

export default function Home() {
  const r = useResponsive();

  return (
    <Screen brandTitle scroll>
      {pages.map((page) => (
        <ListRow
          key={page.slug}
          title={page.title}
          titleSize={r.type.body}
          onPress={() => router.push(hrefFor(page) as any)}
        />
      ))}
      <ListRow
        title="About MeTHiNK"
        titleSize={r.type.body}
        onPress={() => router.push('/about')}
      />
    </Screen>
  );
}
