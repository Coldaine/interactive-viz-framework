import { useState, useCallback } from 'react'
import { Node, NodeChange } from '@xyflow/react'

export type HelperLine = {
  x?: number
  y?: number
  type: 'vertical' | 'horizontal'
}

const SNAP_DISTANCE = 10 // pixels

/**
 * Custom hook for helper lines and snapping during node drag
 * Shows visual guides when nodes align and optionally snaps them to alignment
 */
export const useHelperLines = (
  nodes: Node[],
  snapToGrid = false,
  snapDistance = SNAP_DISTANCE
) => {
  const [helperLines, setHelperLines] = useState<HelperLine[]>([])

  /**
   * Calculate alignment points for all other nodes
   */
  const getAlignmentPoints = useCallback(
    (draggedNodeId: string) => {
      const otherNodes = nodes.filter((node) => node.id !== draggedNodeId)

      const verticalLines: number[] = []
      const horizontalLines: number[] = []

      otherNodes.forEach((node) => {
        const nodeWidth = (node.style?.width as number) || node.width || 150
        const nodeHeight = (node.style?.height as number) || node.height || 100

        // Vertical alignment points (x-axis)
        verticalLines.push(
          node.position.x, // Left edge
          node.position.x + nodeWidth / 2, // Center
          node.position.x + nodeWidth // Right edge
        )

        // Horizontal alignment points (y-axis)
        horizontalLines.push(
          node.position.y, // Top edge
          node.position.y + nodeHeight / 2, // Center
          node.position.y + nodeHeight // Bottom edge
        )
      })

      return { verticalLines, horizontalLines }
    },
    [nodes]
  )

  /**
   * Find nearby alignment lines and snap position if close enough
   */
  const getSnappedPosition = useCallback(
    (
      nodeId: string,
      position: { x: number; y: number },
      nodeWidth: number,
      nodeHeight: number
    ) => {
      if (!snapToGrid) {
        setHelperLines([])
        return position
      }

      const { verticalLines, horizontalLines } = getAlignmentPoints(nodeId)

      const newHelperLines: HelperLine[] = []
      let snappedX = position.x
      let snappedY = position.y

      // Check vertical alignment (x-axis)
      const nodeXPoints = [
        position.x, // Left edge
        position.x + nodeWidth / 2, // Center
        position.x + nodeWidth, // Right edge
      ]

      for (const nodeX of nodeXPoints) {
        for (const alignX of verticalLines) {
          const distance = Math.abs(nodeX - alignX)
          if (distance < snapDistance) {
            newHelperLines.push({ x: alignX, type: 'vertical' })
            // Snap the node position
            if (nodeX === position.x) {
              snappedX = alignX
            } else if (nodeX === position.x + nodeWidth / 2) {
              snappedX = alignX - nodeWidth / 2
            } else if (nodeX === position.x + nodeWidth) {
              snappedX = alignX - nodeWidth
            }
            break // Only snap to the closest line
          }
        }
      }

      // Check horizontal alignment (y-axis)
      const nodeYPoints = [
        position.y, // Top edge
        position.y + nodeHeight / 2, // Center
        position.y + nodeHeight, // Bottom edge
      ]

      for (const nodeY of nodeYPoints) {
        for (const alignY of horizontalLines) {
          const distance = Math.abs(nodeY - alignY)
          if (distance < snapDistance) {
            newHelperLines.push({ y: alignY, type: 'horizontal' })
            // Snap the node position
            if (nodeY === position.y) {
              snappedY = alignY
            } else if (nodeY === position.y + nodeHeight / 2) {
              snappedY = alignY - nodeHeight / 2
            } else if (nodeY === position.y + nodeHeight) {
              snappedY = alignY - nodeHeight
            }
            break // Only snap to the closest line
          }
        }
      }

      setHelperLines(newHelperLines)

      return { x: snappedX, y: snappedY }
    },
    [snapToGrid, snapDistance, getAlignmentPoints]
  )

  /**
   * Handle node changes with snapping
   */
  const onNodesChangeWithSnap = useCallback(
    (changes: NodeChange<Node>[], originalOnNodesChange: (changes: NodeChange<Node>[]) => void) => {
      const updatedChanges = changes.map((change) => {
        if (change.type === 'position' && change.dragging && change.position) {
          const node = nodes.find((n) => n.id === change.id)
          if (!node) return change

          const nodeWidth = (node.style?.width as number) || node.width || 150
          const nodeHeight = (node.style?.height as number) || node.height || 100

          const snappedPosition = getSnappedPosition(
            change.id,
            change.position,
            nodeWidth,
            nodeHeight
          )

          return {
            ...change,
            position: snappedPosition,
          }
        }

        // Clear helper lines when drag ends
        if (change.type === 'position' && !change.dragging) {
          setHelperLines([])
        }

        return change
      })

      originalOnNodesChange(updatedChanges)
    },
    [nodes, getSnappedPosition]
  )

  /**
   * Clear helper lines
   */
  const clearHelperLines = useCallback(() => {
    setHelperLines([])
  }, [])

  return {
    helperLines,
    onNodesChangeWithSnap,
    clearHelperLines,
  }
}
