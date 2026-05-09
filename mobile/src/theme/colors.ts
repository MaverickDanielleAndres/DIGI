/**
 * Digi Design System — Color Tokens
 * "Warm Cinematic Noir" palette
 * 
 * NEVER use hardcoded hex values outside this file.
 * Always import from @/theme/colors.
 */

export const colors = {
  // Backgrounds (dark cinematic)
  void: '#0A0806',        // Near-black with warm undertone (base background)
  charcoal: '#141210',    // Card backgrounds
  graphite: '#1E1A17',    // Elevated surfaces
  smoke: '#2C2520',       // Borders, dividers
  ash: '#4A3F38',         // Muted text, disabled states

  // Text (warm light tones)
  cream: '#F5EDD8',       // Primary light text, headings
  ivory: '#EDE0C4',       // Secondary text
  parchment: '#D4C4A8',   // Tertiary text, captions

  // Primary accent
  amber: '#F4A535',       // PRIMARY — CTAs, shot counter, highlights
  amberSoft: '#F7BC6A',   // Hover/active states
  amberGlow: 'rgba(244, 165, 53, 0.15)', // Glow effects, tinted backgrounds

  // Secondary accents
  coral: '#E8603A',       // Notifications, badges, destructive secondary
  blush: '#E8A090',       // Memory notes, soft interactions
  sage: '#8BAF8A',        // Success states, confirmed actions
  sky: '#7BB3D4',         // Informational, viewer-only indicators

  // Overlays & textures
  filmGrain: 'rgba(255, 220, 150, 0.03)',
  vignette: 'rgba(0, 0, 0, 0.6)',

  // Light theme (selective use: photobook preview, onboarding step 1)
  lightBg: '#FAF6EE',
  lightSurface: '#F0E9D8',
  lightBorder: '#DDD0B8',
  lightText: '#1A1510',
  lightAccent: '#C8751A',

  // Transparency helpers
  overlay: 'rgba(10, 8, 6, 0.85)',
  overlayLight: 'rgba(10, 8, 6, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
