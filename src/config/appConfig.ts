/**
 * Single source of truth for the MeTHiNK app.
 *
 * This is a typed port of the original Titanium app's remote config
 * (MeTHiNK-2/assets/Resources/custom/var2.json, app_id 103601342). Every screen
 * reads its theme + content from here so nothing is hard-coded in components and
 * the app stays config-driven (new content = edit this file, not the screens).
 *
 * All bundled assets are require()'d here (Metro needs literal paths) and exposed
 * as ready-to-use module refs.
 */
import type { ImageSourcePropType } from 'react-native';
import type { DatasetId } from '@/data/scripture.generated';

/* ----------------------------------------------------------------- theme --- */

export const theme = {
  headerText: 'MeTHiNK',
  titleImage: require('../../assets/branding/103601342-title.png') as ImageSourcePropType,
  splashImage: require('../../assets/branding/103601342-splash.jpg') as ImageSourcePropType,
  homeBackground: require('../../assets/branding/103601342-background.jpg') as ImageSourcePropType,
  colors: {
    background: '#7e4209', // col_back
    text: '#97c0ee', // col_text
    title: '#000055', // col_title
    accent: '#97c0ee',
    surface: 'rgba(0,0,0,0.45)',
    surfaceAlt: 'rgba(0,0,0,0.30)',
    border: 'rgba(151,192,238,0.35)',
    muted: '#c9b59a',
    onAccent: '#000055',
  },
  backgroundOpacity: 0.25, // bg_opacity
  menuStyle: 'grid' as const,
} as const;

/* ------------------------------------------------------------ page model --- */

export type PageBase = {
  /** stable route slug */
  slug: string;
  /** original module name in var2.json */
  name: string;
  title: string;
  icon: ImageSourcePropType;
  order: number;
};

export type CatalogItem = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  youtubeId: string;
};
export type CatalogPage = PageBase & { kind: 'catalog'; items: CatalogItem[] };

export type DocItem = { title: string; description: string; asset: number };
export type DocsPage = PageBase & { kind: 'documents'; documents: DocItem[] };

export type CallContact = { name: string; phone: string };
export type CallPage = PageBase & { kind: 'click_to_call'; contacts: CallContact[] };

export type ScripturePage = PageBase & { kind: 'scripture'; dataset: DatasetId };

export type MenuPage = PageBase & { kind: 'menu'; url: string };

export type TwitterPage = PageBase & { kind: 'twitter'; handles: string[] };

export type Track = { title: string; asset: number };
export type MusicCollection = {
  name: string;
  artist: string;
  description: string;
  tracks: Track[];
};
export type MusicPage = PageBase & { kind: 'music'; collections: MusicCollection[] };

export type Page =
  | CatalogPage
  | DocsPage
  | CallPage
  | ScripturePage
  | MenuPage
  | TwitterPage
  | MusicPage;

/* --------------------------------------------------------------- content --- */

const catalog: CatalogPage = {
  slug: 'catalog',
  name: 'catalog',
  title: 'Catalog',
  order: 2,
  icon: require('../../assets/branding/catalog0.png'),
  kind: 'catalog',
  items: [
    {
      title: 'Mind',
      description:
        'the element of a person that enables them to be aware of the world and their experiences, to think, and to feel; the faculty of consciousness and thought',
      image: require('../../assets/branding/103601342-12242281-111111111.jpg'),
      youtubeId: 'gO7RQi55asY',
    },
    {
      title: 'Body',
      description:
        'the physical structure of a person or an animal, including the bones, flesh, and organs',
      image: require('../../assets/branding/103601342-12242328-222222222.jpg'),
      youtubeId: 'C9FkTb-3uaM',
    },
    {
      title: 'Soul',
      description:
        'the spiritual or immaterial part of a human being or animal, regarded as immortal',
      image: require('../../assets/branding/103601342-12242912-1111111111111.jpg'),
      youtubeId: 'HrnN7HIVMdo',
    },
  ],
};

const documents: DocsPage = {
  slug: 'docs',
  name: 'documents',
  title: 'Docs',
  order: 9,
  icon: require('../../assets/branding/documents0.png'),
  kind: 'documents',
  documents: [
    { title: 'Herbal Manual', description: 'all things herbs', asset: require('../../assets/docs/103601342-13250354-herbalmanual.pdf') },
    { title: 'TAI CHI', description: 'all things Tai Chi', asset: require('../../assets/docs/103601342-13250373-200hour_manual_091509_tai_chi.pdf') },
    { title: 'The Diamond Sutra', description: 'all things Buddha', asset: require('../../assets/docs/103601342-13250399-the_diamond_sutra_english.pdf') },
    { title: 'The Book of Tea', description: 'all things Tea', asset: require('../../assets/docs/103601342-13250417-partofthebookoftea.pdf') },
    { title: 'Wicca', description: 'almost all things Wicca', asset: require('../../assets/docs/103601342-13928572-all_about_wicca_and_witchcraft.pdf') },
    { title: 'Hindu', description: 'almost all things Hindu', asset: require('../../assets/docs/103601342-19635361-hinduismbk.pdf') },
    { title: 'Mormonism', description: 'almost all things Mormon', asset: require('../../assets/docs/103601342-19635363-original_book_of_mormon_text.pdf') },
  ],
};

const call: CallPage = {
  slug: 'call',
  name: 'click_to_call',
  title: 'Call',
  order: 15,
  icon: require('../../assets/branding/click_to_call_sketched_transparent.png'),
  kind: 'click_to_call',
  contacts: [{ name: 'Reuben Remone Enterprises', phone: '1.502.210.8579' }],
};

const torah: ScripturePage = {
  slug: 'torah',
  name: 'torah',
  title: 'Torah',
  order: 66,
  icon: require('../../assets/branding/torah0.png'),
  kind: 'scripture',
  dataset: 'torah',
};

const menu: MenuPage = {
  slug: 'menu',
  name: 'menu',
  title: 'Menu',
  order: 73,
  icon: require('../../assets/branding/menu0.png'),
  kind: 'menu',
  url: 'https://www.bhg.com/gardening/plant-dictionary/herb/',
};

const twitter: TwitterPage = {
  slug: 'twitter',
  name: 'twitter',
  title: 'Twitter',
  order: 79,
  icon: require('../../assets/branding/twitter_sketched_transparent.png'),
  kind: 'twitter',
  handles: ['reubenremone'],
};

const bible: ScripturePage = {
  slug: 'bible',
  name: 'bible',
  title: 'Bible',
  order: 146,
  icon: require('../../assets/branding/bible0.png'),
  kind: 'scripture',
  dataset: 'bible',
};

const quran: ScripturePage = {
  slug: 'quran',
  name: 'quran',
  title: 'Quran',
  order: 226,
  icon: require('../../assets/branding/quran0.png'),
  kind: 'scripture',
  dataset: 'quran',
};

const music: MusicPage = {
  slug: 'music',
  name: 'music',
  title: 'Music',
  order: 239,
  icon: require('../../assets/branding/music0.png'),
  kind: 'music',
  collections: [
    {
      name: 'Tupac The Greatest',
      artist: 'Tupac Shakur',
      description: 'A few songs by the greatest hip hop artist of all time.',
      tracks: [
        { title: 'How long will they mourn me?', asset: require('../../assets/audio/103601342-13685502-01_how_long_will_they_mourn_me_.mp3') },
        { title: 'Ambitionz Az a Ridah', asset: require('../../assets/audio/103601342-13685515-1_01_ambitionz_az_a_ridah.mp3') },
        { title: 'Whatz ya Phone #', asset: require('../../assets/audio/103601342-13685525-1_14_whatz_ya_phone__.mp3') },
        { title: 'So Many Tears', asset: require('../../assets/audio/103601342-13685533-03_so_many_tears.mp3') },
        { title: "This Ain't Livin'", asset: require('../../assets/audio/103601342-13928403-this_aint_livin.mp3') },
        { title: 'So Many Tears (alt)', asset: require('../../assets/audio/103601342-13928409-so_many_tears.mp3') },
        { title: "Brenda's Got a Baby", asset: require('../../assets/audio/103601342-13928414-brenda_s_got_a_baby.mp3') },
        { title: 'Smile (ft. Scarface)', asset: require('../../assets/audio/103601342-13928417-071._2pac___smile_ft._scarface__1996_.mp3') },
      ],
    },
  ],
};

/** All enabled pages, in the original home-grid order. (Videos is omitted: on:false) */
export const pages: Page[] = [catalog, documents, call, torah, menu, twitter, bible, quran, music].sort(
  (a, b) => a.order - b.order
);

export const pagesBySlug: Record<string, Page> = Object.fromEntries(
  pages.map((p) => [p.slug, p])
);

export function getPage(slug: string): Page | undefined {
  return pagesBySlug[slug];
}
