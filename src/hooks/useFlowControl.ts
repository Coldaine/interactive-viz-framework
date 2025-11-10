import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'

/**
 * Custom hook for common React Flow control operations
 * Provides utilities for viewport manipulation and node/edge queries
 */
export const useFlowControl = () => {
  const reactFlowInstance = useReactFlow()

  /**
   * Fit view to show all nodes
   * @param padding - Optional padding around nodes (default: 0.2)
   */
  const fitView = useCallback(
    (padding = 0.2) => {
      reactFlowInstance.fitView({ padding, duration: 400 })
    },
    [reactFlowInstance]
  )

  /**
   * Zoom in by 20%
   */
  const zoomIn = useCallback(() => {
    reactFlowInstance.zoomIn({ duration: 200 })
  }, [reactFlowInstance])

  /**
   * Zoom out by 20%
   */
  const zoomOut = useCallback(() => {
    reactFlowInstance.zoomOut({ duration: 200 })
  }, [reactFlowInstance])

  /**
   * Center viewport on a specific node
   * @param nodeId - ID of the node to center on
   */
  const centerNode = useCallback(
    (nodeId: string) => {
      const node = reactFlowInstance.getNode(nodeId)
      if (node) {
        const x = node.position.x + (node.width ?? 0) / 2
        const y = node.position.y + (node.height ?? 0) / 2
        const zoom = 1.5

        reactFlowInstance.setCenter(x, y, { zoom, duration: 400 })
      }
    },
    [reactFlowInstance]
  )

  /**
   * Get current viewport information
   */
  const getViewport = useCallback(() => {
    return reactFlowInstance.getViewport()
  }, [reactFlowInstance])

  /**
   * Set viewport to specific coordinates and zoom
   */
  const setViewport = useCallback(
    (x: number, y: number, zoom: number) => {
      reactFlowInstance.setViewport({ x, y, zoom }, { duration: 400 })
    },
    [reactFlowInstance]
  )

  /**
   * Get all nodes
   */
  const getNodes = useCallback(() => {
    return reactFlowInstance.getNodes()
  }, [reactFlowInstance])

  /**
   * Get all edges
   */
  const getEdges = useCallback(() => {
    return reactFlowInstance.getEdges()
  }, [reactFlowInstance])

  /**
   * Get a specific node by ID
   */
  const getNode = useCallback(
    (nodeId: string) => {
      return reactFlowInstance.getNode(nodeId)
    },
    [reactFlowInstance]
  )

  /**
   * Get a specific edge by ID
   */
  const getEdge = useCallback(
    (edgeId: string) => {
      return reactFlowInstance.getEdge(edgeId)
    },
    [reactFlowInstance]
  )

  /**
   * Screen to flow coordinate conversion
   */
  const screenToFlowPosition = useCallback(
    (position: { x: number; y: number }) => {
      return reactFlowInstance.screenToFlowPosition(position)
    },
    [reactFlowInstance]
  )

  /**
   * Flow to screen coordinate conversion
   */
  const flowToScreenPosition = useCallback(
    (position: { x: number; y: number }) => {
      return reactFlowInstance.flowToScreenPosition(position)
    },
    [reactFlowInstance]
  )

  return {
    // Instance
    instance: reactFlowInstance,

    // Viewport controls
    fitView,
    zoomIn,
    zoomOut,
    centerNode,
    getViewport,
    setViewport,

    // Node/Edge queries
    getNodes,
    getEdges,
    getNode,
    getEdge,

    // Coordinate conversion
    screenToFlowPosition,
    flowToScreenPosition,
  }
}
