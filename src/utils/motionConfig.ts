/**
 * Framer Motion configuration for consistent animations
 */

/**
 * Spring physics configuration
 */
export const springConfig = {
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 24,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 30,
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
  },
}

/**
 * Transition duration presets
 */
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
}

/**
 * Easing presets
 */
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
}
