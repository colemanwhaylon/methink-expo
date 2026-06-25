/**
 * Responsive design system for MeTHiNK.
 *
 * The original app was phone-only; this layer makes every screen adapt from
 * small phones up to wide desktop. Components call `useResponsive(variant)` to
 * get a breakpoint, a centered max content width, a scaled type ramp, spacing,
 * and the content width available for grid math.
 */
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
export type ScreenVariant = 'default' | 'read' | 'full';

/** Width at/above which we show the desktop sidebar layout. */
export const DESKTOP_MIN = 1024;
/** Fixed desktop sidebar width. */
export const SIDEBAR_WIDTH = 248;

/** Max centered content width per screen variant. */
const MAX_WIDTH: Record<ScreenVariant, number> = {
  default: 1040, // home grid + lists
  read: 720, // long-form reading (scripture, about)
  full: Number.POSITIVE_INFINITY, // embeds fill available space
};

function breakpointFor(width: number): Breakpoint {
  if (width < 600) return 'sm';
  if (width < DESKTOP_MIN) return 'md';
  if (width < 1440) return 'lg';
  return 'xl';
}

/** Multiplier applied to the base type ramp per breakpoint. */
const TYPE_SCALE: Record<Breakpoint, number> = { sm: 1, md: 1.06, lg: 1.12, xl: 1.18 };

/** Base type ramp (sm). Scaled up at larger breakpoints. */
const BASE_TYPE = {
  hero: 30,
  h1: 24,
  h2: 20,
  title: 18,
  body: 16,
  verse: 17,
  small: 13,
} as const;

export type TypeRamp = Record<keyof typeof BASE_TYPE, number>;

export type Responsive = {
  width: number;
  bp: Breakpoint;
  isDesktop: boolean;
  /** Horizontal padding inside the content container. */
  padding: number;
  /** Vertical rhythm unit. */
  gap: number;
  /** Max centered content width for the active variant. */
  maxWidth: number;
  /** Width actually available to content (accounts for sidebar + padding + maxWidth). */
  contentWidth: number;
  type: TypeRamp;
  /** Comfortable line-height for body/verse text. */
  lineHeight: number;
  /** Columns that fit, given a target tile width and min/max clamp. */
  columns: (targetTileWidth?: number, min?: number, max?: number) => number;
};

export function useResponsive(variant: ScreenVariant = 'default'): Responsive {
  const { width: rawWidth } = useWindowDimensions();
  // Static export renders HTML on the server with no window. Use a deterministic
  // mobile width until mounted so the server HTML and the first client render
  // match (no hydration mismatch / React #418); then adopt the real width.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const width = mounted ? rawWidth : 390;

  const bp = breakpointFor(width);
  const isDesktop = width >= DESKTOP_MIN;

  const padding = bp === 'sm' ? 16 : bp === 'md' ? 20 : 24;
  const gap = bp === 'sm' ? 10 : 12;

  const maxWidth = MAX_WIDTH[variant];
  const outer = width - (isDesktop ? SIDEBAR_WIDTH : 0);
  const contentWidth = Math.min(maxWidth, outer) - padding * 2;

  const scale = TYPE_SCALE[bp];
  const type = Object.fromEntries(
    Object.entries(BASE_TYPE).map(([k, v]) => [k, Math.round(v * scale)])
  ) as TypeRamp;

  const lineHeight = Math.round(type.verse * 1.6);

  const columns = (targetTileWidth = 168, min = 2, max = 6) => {
    const n = Math.floor((contentWidth + gap) / (targetTileWidth + gap));
    return Math.max(min, Math.min(max, n || min));
  };

  return {
    width,
    bp,
    isDesktop,
    padding,
    gap,
    maxWidth: Number.isFinite(maxWidth) ? maxWidth : outer,
    contentWidth,
    type,
    lineHeight,
    columns,
  };
}

/** Web-only interaction style helper: returns hover/focus visual deltas. */
export function interactionStyle(state: { hovered?: boolean; focused?: boolean; pressed?: boolean }) {
  const { hovered, focused, pressed } = state;
  return {
    opacity: pressed ? 0.6 : 1,
    transform: [{ scale: pressed ? 0.98 : hovered ? 1.02 : 1 }],
    // focus ring (web); harmless on native
    ...(focused ? { outlineWidth: 2, outlineColor: '#97c0ee', outlineStyle: 'solid' as const } : null),
  };
}
