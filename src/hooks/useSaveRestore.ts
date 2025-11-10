import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow, Node, Edge } from '@xyflow/react'
import {
  saveFlowToLocalStorage,
  loadFlowFromLocalStorage,
  exportFlowToJSON,
  importFlowFromJSON,
  FlowState,
} from '../utils/flowStorage'

/**
 * Custom hook for saving and restoring flow state
 * Provides auto-save, manual save/load, and export/import functionality
 */
export const useSaveRestore = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  autoSaveEnabled = true,
  autoSaveDelay = 3000 // 3 seconds
) => {
  const reactFlowInstance = useReactFlow()
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  /**
   * Save current flow state to localStorage
   */
  const saveFlow = useCallback(() => {
    const viewport = reactFlowInstance.getViewport()
    saveFlowToLocalStorage(nodes, edges, viewport)
  }, [nodes, edges, reactFlowInstance])

  /**
   * Load flow state from localStorage
   */
  const loadFlow = useCallback(() => {
    const flowState = loadFlowFromLocalStorage()
    if (flowState) {
      setNodes(flowState.nodes)
      setEdges(flowState.edges)
      reactFlowInstance.setViewport(flowState.viewport)
      return true
    }
    return false
  }, [setNodes, setEdges, reactFlowInstance])

  /**
   * Export flow to JSON file
   */
  const exportFlow = useCallback(() => {
    const viewport = reactFlowInstance.getViewport()
    exportFlowToJSON(nodes, edges, viewport)
  }, [nodes, edges, reactFlowInstance])

  /**
   * Import flow from JSON file
   */
  const importFlow = useCallback(
    async (file: File) => {
      try {
        const flowState: FlowState = await importFlowFromJSON(file)
        setNodes(flowState.nodes)
        setEdges(flowState.edges)
        reactFlowInstance.setViewport(flowState.viewport)
        return true
      } catch (error) {
        console.error('Failed to import flow:', error)
        return false
      }
    },
    [setNodes, setEdges, reactFlowInstance]
  )

  /**
   * Auto-save functionality with debouncing
   */
  useEffect(() => {
    if (!autoSaveEnabled) return

    // Clear previous timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }

    // Set new timer
    autoSaveTimer.current = setTimeout(() => {
      saveFlow()
    }, autoSaveDelay)

    // Cleanup
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [nodes, edges, autoSaveEnabled, autoSaveDelay, saveFlow])

  return {
    saveFlow,
    loadFlow,
    exportFlow,
    importFlow,
  }
}
