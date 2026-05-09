/**
 * Digi Design System — Typography Tokens
 * 
 * Font families loaded via expo-font in _layout.tsx.
 * Using Playfair Display as Canela substitute (commercial font).
 */

export const fonts = {
  display: 'PlayfairDisplay-Italic',         // Hero headlines, emotional moments
  displayRegular: 'PlayfairDisplay-Regular',  // Display headings
  displayBold: 'PlayfairDisplay-Bold',        // Bold display
  heading: 'Syne-Bold',                       // UI headings, navigation
  headingSemiBold: 'Syne-SemiBold',           // Section titles
  headingMedium: 'Syne-Medium',               // Subheadings
  headingRegular: 'Syne-Regular',             // Regular heading weight
  body: 'DMSans-Regular',                     // Body text, captions
  bodyMedium: 'DMSans-Medium',                // Medium body
  bodySemiBold: 'DMSans-SemiBold',            // Emphasized body
  bodyBold: 'DMSans-Bold',                    // Bold body
  mono: 'JetBrainsMono-Bold',                 // Shot counter, timestamps, numerics
  monoRegular: 'JetBrainsMono-Regular',       // Regular mono
  handwriting: 'Caveat-Medium',               // Memory notes, "from [name]" tags
  handwritingBold: 'Caveat-Bold',             // Bold handwriting
} as const;

export const textStyles = {
  hero: {
    fontSize: 52,
    lineHeight: 55,
    letterSpacing: -1.04,
    fontFamily: fonts.display,
  },
  display: {
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.76,
    fontFamily: fonts.display,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
    fontFamily: fonts.heading,
  },
  h2: {
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: -0.22,
    fontFamily: fonts.headingSemiBold,
  },
  h3: {
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: 0,
    fontFamily: fonts.headingMedium,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: fonts.body,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0,
    fontFamily: fonts.bodyMedium,
  },
  small: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.13,
    fontFamily: fonts.body,
  },
  micro: {
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.33,
    fontFamily: fonts.bodySemiBold,
  },
  counter: {
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.96,
    fontFamily: fonts.mono,
  },
  note: {
    fontSize: 15,
    lineHeight: 25,
    letterSpacing: 0,
    fontFamily: fonts.handwriting,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    fontFamily: fonts.headingSemiBold,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.52,
    fontFamily: fonts.bodySemiBold,
  },
} as const;

export type FontFamily = keyof typeof fonts;
export type TextStyle = keyof typeof textStyles;
