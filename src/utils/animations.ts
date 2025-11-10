import { Variants } from 'framer-motion'

/**
 * Node entry/exit animation variants
 */
export const nodeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Fade animation variants
 */
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Slide in from bottom variants
 */
export const slideUpVariants: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Glow pulse animation
 */
export const glowVariants: Variants = {
  initial: {
    boxShadow: '0 0 0px rgba(59, 130, 246, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
    transition: {
      duration: 0.3,
    },
  },
  selected: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
  },
}

/**
 * Stagger children animation
 */
export const staggerContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
