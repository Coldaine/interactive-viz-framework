import { useViewport } from '@xyflow/react'
import { HelperLine } from '../hooks/useHelperLines'

interface HelperLinesProps {
  lines: HelperLine[]
}

/**
 * Component to render alignment helper lines
 * Shows visual guides when nodes are aligned during drag
 */
const HelperLines = ({ lines }: HelperLinesProps) => {
  const { x: viewX, y: viewY, zoom } = useViewport()

  if (lines.length === 0) return null

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {lines.map((line, index) => {
        if (line.type === 'vertical' && line.x !== undefined) {
          const x = line.x * zoom + viewX
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="5,5"
              opacity={0.7}
            />
          )
        }

        if (line.type === 'horizontal' && line.y !== undefined) {
          const y = line.y * zoom + viewY
          return (
            <line
              key={`h-${index}`}
              x1={0}
              y1={y}
              x2="100%"
              y2={y}
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="5,5"
              opacity={0.7}
            />
          )
        }

        return null
      })}
    </svg>
  )
}

export default HelperLines
