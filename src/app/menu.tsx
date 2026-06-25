/**
 * Menu screen: a full-bleed external web view of the configured menu URL.
 */
import { Screen } from '@/components/Screen';
import { EmbeddedWeb } from '@/components/EmbeddedWeb';
import { getPage, type MenuPage } from '@/config/appConfig';

export default function MenuScreen() {
  const page = getPage('menu') as MenuPage;

  return (
    <Screen title="Menu" variant="full">
      <EmbeddedWeb uri={page.url} title="Menu" style={{ flex: 1 }} />
    </Screen>
  );
}
