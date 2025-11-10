import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistoryStore, type FlowSnapshot } from './historyStore'

describe('HistoryStore', () => {
  beforeEach(() => {
    // Clear history before each test
    const { result } = renderHook(() => useHistoryStore())
    act(() => {
      result.current.clearHistory()
    })
  })

  const createSnapshot = (label: string): FlowSnapshot => ({
    nodes: [
      {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label },
        type: 'default',
      },
    ],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    timestamp: Date.now(),
  })

  describe('Initial State', () => {
    it('should have empty history', () => {
      const { result } = renderHook(() => useHistoryStore())

      expect(result.current.history).toEqual([])
      expect(result.current.currentIndex).toBe(-1)
    })

    it('should have max history size of 50', () => {
      const { result } = renderHook(() => useHistoryStore())

      expect(result.current.maxHistorySize).toBe(50)
    })

    it('should not be able to undo or redo initially', () => {
      const { result } = renderHook(() => useHistoryStore())

      expect(result.current.canUndo()).toBe(false)
      expect(result.current.canRedo()).toBe(false)
    })
  })

  describe('Adding to History', () => {
    it('should add a snapshot to history', () => {
      const { result } = renderHook(() => useHistoryStore())
      const snapshot = createSnapshot('State 1')

      act(() => {
        result.current.addToHistory(snapshot)
      })

      expect(result.current.history).toHaveLength(1)
      expect(result.current.currentIndex).toBe(0)
    })

    it('should add multiple snapshots', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.addToHistory(createSnapshot('State 3'))
      })

      expect(result.current.history).toHaveLength(3)
      expect(result.current.currentIndex).toBe(2)
    })

    it('should remove future history when adding after undo', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.addToHistory(createSnapshot('State 3'))
        result.current.undo()
        result.current.undo()
        // Now at State 1, add new state
        result.current.addToHistory(createSnapshot('State 2 - New'))
      })

      expect(result.current.history).toHaveLength(2)
      expect(result.current.currentIndex).toBe(1)
      expect(result.current.history[1].nodes[0].data.label).toBe('State 2 - New')
    })

    it('should limit history to max size', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        // Add 55 snapshots (more than max of 50)
        for (let i = 0; i < 55; i++) {
          result.current.addToHistory(createSnapshot(`State ${i}`))
        }
      })

      expect(result.current.history).toHaveLength(50)
      expect(result.current.currentIndex).toBe(49)
      // First snapshot should be "State 5" (0-4 trimmed)
      expect(result.current.history[0].nodes[0].data.label).toBe('State 5')
    })
  })

  describe('Undo Operation', () => {
    it('should undo to previous state', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
      })

      let undoneSnapshot: FlowSnapshot | null = null
      act(() => {
        undoneSnapshot = result.current.undo()
      })

      expect(result.current.currentIndex).toBe(0)
      expect(undoneSnapshot).not.toBeNull()
      if (undoneSnapshot) {
        expect(undoneSnapshot.nodes[0].data.label).toBe('State 1')
      }
    })

    it('should return null when cannot undo', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
      })

      let undoneSnapshot: FlowSnapshot | null = null
      act(() => {
        undoneSnapshot = result.current.undo()
      })

      expect(undoneSnapshot).toBeNull()
      expect(result.current.currentIndex).toBe(0)
    })

    it('should undo multiple times', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.addToHistory(createSnapshot('State 3'))
        result.current.undo()
        result.current.undo()
      })

      expect(result.current.currentIndex).toBe(0)
    })

    it('should update canUndo correctly', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
      })

      expect(result.current.canUndo()).toBe(true)

      act(() => {
        result.current.undo()
      })

      expect(result.current.canUndo()).toBe(false)
    })
  })

  describe('Redo Operation', () => {
    it('should redo to next state', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.undo()
      })

      let redoneSnapshot: FlowSnapshot | null = null
      act(() => {
        redoneSnapshot = result.current.redo()
      })

      expect(result.current.currentIndex).toBe(1)
      expect(redoneSnapshot).not.toBeNull()
      if (redoneSnapshot) {
        expect(redoneSnapshot.nodes[0].data.label).toBe('State 2')
      }
    })

    it('should return null when cannot redo', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
      })

      let redoneSnapshot: FlowSnapshot | null = null
      act(() => {
        redoneSnapshot = result.current.redo()
      })

      expect(redoneSnapshot).toBeNull()
      expect(result.current.currentIndex).toBe(0)
    })

    it('should redo multiple times', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.addToHistory(createSnapshot('State 3'))
        result.current.undo()
        result.current.undo()
        result.current.redo()
        result.current.redo()
      })

      expect(result.current.currentIndex).toBe(2)
    })

    it('should update canRedo correctly', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
      })

      expect(result.current.canRedo()).toBe(false)

      act(() => {
        result.current.undo()
      })

      expect(result.current.canRedo()).toBe(true)

      act(() => {
        result.current.redo()
      })

      expect(result.current.canRedo()).toBe(false)
    })
  })

  describe('Current Snapshot', () => {
    it('should return current snapshot', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
      })

      const current = result.current.getCurrentSnapshot()
      expect(current).not.toBeNull()
      expect(current?.nodes[0].data.label).toBe('State 2')
    })

    it('should return null when no history', () => {
      const { result } = renderHook(() => useHistoryStore())

      const current = result.current.getCurrentSnapshot()
      expect(current).toBeNull()
    })

    it('should return correct snapshot after undo', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.undo()
      })

      const current = result.current.getCurrentSnapshot()
      expect(current?.nodes[0].data.label).toBe('State 1')
    })
  })

  describe('Clear History', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.clearHistory()
      })

      expect(result.current.history).toEqual([])
      expect(result.current.currentIndex).toBe(-1)
    })

    it('should reset canUndo and canRedo', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.clearHistory()
      })

      expect(result.current.canUndo()).toBe(false)
      expect(result.current.canRedo()).toBe(false)
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle undo/redo sequence', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.addToHistory(createSnapshot('State 3'))
        result.current.undo() // Back to State 2
        result.current.undo() // Back to State 1
        result.current.redo() // Forward to State 2
      })

      const current = result.current.getCurrentSnapshot()
      expect(current?.nodes[0].data.label).toBe('State 2')
      expect(result.current.canUndo()).toBe(true)
      expect(result.current.canRedo()).toBe(true)
    })

    it('should handle branching history', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        result.current.addToHistory(createSnapshot('State 1'))
        result.current.addToHistory(createSnapshot('State 2'))
        result.current.undo() // Back to State 1
        result.current.addToHistory(createSnapshot('State 2 - Branch')) // New branch
      })

      expect(result.current.history).toHaveLength(2)
      expect(result.current.history[1].nodes[0].data.label).toBe('State 2 - Branch')
      expect(result.current.canRedo()).toBe(false)
    })

    it('should preserve timestamps', () => {
      const { result } = renderHook(() => useHistoryStore())
      const now = Date.now()

      act(() => {
        result.current.addToHistory({
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          timestamp: now,
        })
      })

      expect(result.current.history[0].timestamp).toBe(now)
    })

    it('should handle rapid additions', () => {
      const { result } = renderHook(() => useHistoryStore())

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addToHistory(createSnapshot(`State ${i}`))
        }
      })

      expect(result.current.history).toHaveLength(10)
      expect(result.current.currentIndex).toBe(9)
    })
  })
})
