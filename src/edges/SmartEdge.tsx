import { memo } from 'react'
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react'

const SmartEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: '#6366f1',
        strokeWidth: 2,
      }}
    />
  )
}

export default memo(SmartEdge)
