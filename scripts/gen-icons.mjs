#!/usr/bin/env node
/**
 * Generates the app icon set from the original MeTHiNK wordmark art, since the
 * original launcher icon (103601342-icon.png) was not present in the source app.
 *
 *  - assets/images/icon.png                    1024x1024, wordmark on brand brown
 *  - assets/images/favicon.png                 48x48 web favicon
 *  - assets/images/android-icon-foreground.png 1024x1024 transparent, wordmark in safe zone
 *
 * Run: npm run gen:icons
 */
import { Jimp } from 'jimp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TITLE = join(ROOT, 'assets', 'branding', '103601342-title.png');
const OUT = join(ROOT, 'assets', 'images');

const BRAND = 0x7e4209ff; // col_back
const SIZE = 1024;

const title = await Jimp.read(TITLE);

/** Returns a copy of the wordmark scaled to a target width (keeps aspect). */
function wordmark(targetW) {
  const t = title.clone();
  t.resize({ w: targetW });
  return t;
}

// --- 1024 icon: wordmark centered on brand background -----------------------
{
  const icon = new Jimp({ width: SIZE, height: SIZE, color: BRAND });
  const t = wordmark(Math.round(SIZE * 0.74));
  icon.composite(t, Math.round((SIZE - t.bitmap.width) / 2), Math.round((SIZE - t.bitmap.height) / 2));
  await icon.write(join(OUT, 'icon.png'));
}

// --- favicon ----------------------------------------------------------------
{
  const fav = new Jimp({ width: SIZE, height: SIZE, color: BRAND });
  const t = wordmark(Math.round(SIZE * 0.82));
  fav.composite(t, Math.round((SIZE - t.bitmap.width) / 2), Math.round((SIZE - t.bitmap.height) / 2));
  fav.resize({ w: 48, h: 48 });
  await fav.write(join(OUT, 'favicon.png'));
}

// --- Android adaptive foreground (transparent, wordmark in ~60% safe zone) ---
{
  const fg = new Jimp({ width: SIZE, height: SIZE, color: 0x00000000 });
  const t = wordmark(Math.round(SIZE * 0.58));
  fg.composite(t, Math.round((SIZE - t.bitmap.width) / 2), Math.round((SIZE - t.bitmap.height) / 2));
  await fg.write(join(OUT, 'android-icon-foreground.png'));
}

console.log('[gen-icons] wrote icon.png, favicon.png, android-icon-foreground.png');
