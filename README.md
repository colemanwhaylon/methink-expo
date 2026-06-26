# MeTHiNK

A faithful recreation of the original **MeTHiNK** mobile app — rebuilt as a single
**universal Expo app** that runs on **web, iOS, and Android** from one codebase, with
**no backend**.

The original was a 2016–2019 Appcelerator Titanium app (a published instance of the
appmakr / InfiniteMonkeys white‑label builder, `app_id 103601342`). This project
reverse‑engineers that app's bundled content + config and reimplements its screens on
a modern, native‑feeling stack: **Expo SDK 56 + Expo Router + React Native Web**.

## Screens

Seven content pages, plus Home and About:

| Screen | Content (all bundled, static) |
| --- | --- |
| **Home** | Grid menu of the modules below |
| **Catalog** | "Mind / Body / Soul" — image + description + YouTube video per item |
| **Docs** | 7 bundled PDFs (Herbal, Tai Chi, Diamond Sutra, Book of Tea, Wicca, Hindu, Mormonism) |
| **Call** | Click‑to‑call contact (`tel:`) |
| **Bible / Quran / Torah** | Full offline readers — 66 + 114 + 5 books, chapter selector, selectable verses |
| **Music** | "Tupac The Greatest" album — 8 bundled MP3s with a full audio player |
| **About** | App info + contact |

## Architecture

- **Single source of truth:** [`src/config/appConfig.ts`](src/config/appConfig.ts) is a typed
  port of the original `var2.json` (theme colors, page list/order, and all content). Screens
  are config‑driven — adding/changing content means editing config, not components.
- **Scripture data:** the three datasets live under `assets/data/`. A generator
  ([`scripts/gen-data.mjs`](scripts/gen-data.mjs)) emits `src/data/scripture.generated.ts` with
  a lazy `import()` loader per book, so each of the 185 books is code‑split into its own chunk
  (loaded on demand) rather than eagerly bundled.
- **Shared shell:** `Screen`, `GridTile`, `ListRow`, and `EmbeddedWeb` (iframe on web /
  `react-native-webview` on native) keep every screen consistent.
- **No backend, no auth, no cart** — everything is bundled static assets.

## Develop

```bash
npm install
npm run gen:data   # regenerate scripture loaders (only needed if assets/data changes)
npm run web        # or: npm run ios / npm run android
npm run typecheck
```

## Deploy to Vercel (static, no server)

The web build is a pure static export, so no serverless functions are required.

```bash
npm run build:web   # expo export -p web  ->  ./dist
```

[`vercel.json`](vercel.json) is preconfigured (`buildCommand: expo export -p web`,
`outputDirectory: dist`, `framework: null`, SPA rewrites + clean URLs). Importing this repo
into Vercel deploys it as‑is.

## Tech

Expo SDK 56 · Expo Router · React 19 · React Native 0.85 · React Native Web 0.21 ·
expo-audio · react-native-webview · TypeScript (strict).

---

*Content and branding are reproduced from the original MeTHiNK app for the purpose of
recreating it. The original media assets remain the property of their respective owners.*
