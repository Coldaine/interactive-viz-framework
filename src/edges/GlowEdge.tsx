import { memo } from 'react'
import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react'

const GlowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? '#3b82f6' : '#6366f1'}
        strokeWidth={selected ? 8 : 6}
        opacity={0.3}
        style={{
          filter: 'blur(4px)',
        }}
      />
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? '#3b82f6' : '#6366f1',
          strokeWidth: 2,
        }}
      />
    </>
  )
}

export default memo(GlowEdge)
