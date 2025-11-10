import { useCallback, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useHistoryStore, FlowSnapshot } from '../store/historyStore'

interface UseUndoOptions {
  debounceMs?: number
  skipViewportOnly?: boolean
}

/**
 * Hook for undo/redo functionality
 * Integrates historyStore with React Flow state
 *
 * Features:
 * - Automatic snapshot saving on flow changes (debounced)
 * - Skip viewport-only changes
 * - Undo/redo with keyboard shortcuts
 * - State restoration from snapshots
 */
export const useUndo = (options: UseUndoOptions = {}) => {
  const { debounceMs = 500, skipViewportOnly = true } = options

  const { getNodes, getEdges, getViewport, setNodes, setEdges, setViewport } = useReactFlow()

  const {
    addToHistory,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
    getCurrentSnapshot,
  } = useHistoryStore()

  // Track last saved snapshot to avoid duplicates and detect viewport-only changes
  const lastSnapshotRef = useRef<FlowSnapshot | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRestoringRef = useRef(false)

  /**
   * Create a snapshot of current flow state
   */
  const createSnapshot = useCallback((): FlowSnapshot => {
    return {
      nodes: getNodes(),
      edges: getEdges(),
      viewport: getViewport(),
      timestamp: Date.now(),
    }
  }, [getNodes, getEdges, getViewport])

  /**
   * Check if two snapshots are significantly different
   * Used to skip insignificant changes like viewport-only changes
   */
  const isSignificantChange = useCallback(
    (oldSnapshot: FlowSnapshot | null, newSnapshot: FlowSnapshot): boolean => {
      if (!oldSnapshot) return true

      const nodesChanged = JSON.stringify(oldSnapshot.nodes) !== JSON.stringify(newSnapshot.nodes)
      const edgesChanged = JSON.stringify(oldSnapshot.edges) !== JSON.stringify(newSnapshot.edges)

      // If nodes or edges changed, it's significant
      if (nodesChanged || edgesChanged) {
        return true
      }

      // If only viewport changed and skipViewportOnly is enabled, it's not significant
      if (skipViewportOnly) {
        const viewportChanged =
          oldSnapshot.viewport.x !== newSnapshot.viewport.x ||
          oldSnapshot.viewport.y !== newSnapshot.viewport.y ||
          oldSnapshot.viewport.zoom !== newSnapshot.viewport.zoom

        return viewportChanged ? false : true
      }

      return true
    },
    [skipViewportOnly]
  )

  /**
   * Save current state as a snapshot (debounced)
   */
  const saveSnapshot = useCallback(() => {
    // Skip if we're in the middle of restoring
    if (isRestoringRef.current) {
      return
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      const snapshot = createSnapshot()

      // Check if this is a significant change
      if (!isSignificantChange(lastSnapshotRef.current, snapshot)) {
        return
      }

      // Add to history
      addToHistory(snapshot)
      lastSnapshotRef.current = snapshot
    }, debounceMs)
  }, [createSnapshot, addToHistory, debounceMs, isSignificantChange])

  /**
   * Restore flow state from a snapshot
   */
  const restoreSnapshot = useCallback(
    (snapshot: FlowSnapshot | null) => {
      if (!snapshot) return

      isRestoringRef.current = true

      // Restore nodes, edges, and viewport
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
      setViewport(snapshot.viewport, { duration: 0 })

      lastSnapshotRef.current = snapshot

      // Reset restoring flag after a short delay
      setTimeout(() => {
        isRestoringRef.current = false
      }, 100)
    },
    [setNodes, setEdges, setViewport]
  )

  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (!canUndo()) {
      console.log('Cannot undo: no history available')
      return false
    }

    const previousSnapshot = undoHistory()
    if (previousSnapshot) {
      restoreSnapshot(previousSnapshot)
      console.log('Undo successful')
      return true
    }

    return false
  }, [canUndo, undoHistory, restoreSnapshot])

  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (!canRedo()) {
      console.log('Cannot redo: no future history available')
      return false
    }

    const nextSnapshot = redoHistory()
    if (nextSnapshot) {
      restoreSnapshot(nextSnapshot)
      console.log('Redo successful')
      return true
    }

    return false
  }, [canRedo, redoHistory, restoreSnapshot])

  /**
   * Initialize with current state on mount
   */
  useEffect(() => {
    const initialSnapshot = createSnapshot()
    addToHistory(initialSnapshot)
    lastSnapshotRef.current = initialSnapshot
  }, []) // Only run on mount

  /**
   * Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    undo,
    redo,
    canUndo: canUndo(),
    canRedo: canRedo(),
    saveSnapshot,
    getCurrentSnapshot,
  }
}
