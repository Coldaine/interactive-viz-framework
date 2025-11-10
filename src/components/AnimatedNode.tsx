import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { nodeVariants } from '../utils/animations'

type AnimatedNodeProps = {
  children: ReactNode
  selected?: boolean
}

/**
 * Higher-order component that wraps nodes with motion animations
 */
const AnimatedNode = ({ children, selected }: AnimatedNodeProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={nodeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'inline-block',
          ...(selected && {
            filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
          }),
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedNode
