/**
 * Digi Design System — Animation Tokens
 * 
 * Spring configs for React Native Reanimated 3.
 * Use ONLY these presets — do not invent new spring configs.
 */

export const springs = {
  /** Fast snappy — button presses, tap feedback */
  snappy: { damping: 18, stiffness: 300, mass: 0.8 },
  /** Standard UI — cards, modals, sheet appearance */
  standard: { damping: 20, stiffness: 200, mass: 1.0 },
  /** Gentle float — photo reveals, album entrance */
  gentle: { damping: 22, stiffness: 120, mass: 1.2 },
  /** Bouncy — shot counter, confetti, badges */
  bouncy: { damping: 12, stiffness: 250, mass: 0.6 },
  /** Slow dramatic — reveal animations, emotional moments */
  dramatic: { damping: 28, stiffness: 80, mass: 1.5 },
} as const;

export const durations = {
  /** Screen flash on capture */
  flash: 80,
  /** Fast snap-in */
  snapIn: 150,
  /** Standard entry */
  enter: 200,
  /** Standard exit */
  exit: 250,
  /** Slower exit, gentle */
  exitSlow: 350,
  /** Emotional moments — reveal, memory note open */
  emotional: 400,
  /** Full reveal experience per photo */
  revealPerPhoto: 800,
  /** Stagger between reveal photos */
  revealStagger: 120,
  /** QR code reveal */
  qrReveal: 500,
  /** Page transition */
  pageTransition: 250,
} as const;

export const easings = {
  /** Standard easing for entries */
  enter: { duration: durations.enter },
  /** Gentle exit easing */
  exit: { duration: durations.exit },
  /** Fast exit */
  exitFast: { duration: durations.snapIn },
} as const;

export type SpringConfig = keyof typeof springs;
