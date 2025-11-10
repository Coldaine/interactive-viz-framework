import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import { useUndo } from './useUndo'
import { useHistoryStore } from '../store/historyStore'
import type { Node, Edge, Viewport } from '@xyflow/react'

// Mock useReactFlow
const mockGetNodes = vi.fn()
const mockGetEdges = vi.fn()
const mockGetViewport = vi.fn()
const mockSetNodes = vi.fn()
const mockSetEdges = vi.fn()
const mockSetViewport = vi.fn()

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({
      getNodes: mockGetNodes,
      getEdges: mockGetEdges,
      getViewport: mockGetViewport,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      setViewport: mockSetViewport,
    }),
  }
})

describe('useUndo', () => {
  const initialNodes: Node[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  ]

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
  ]

  const initialViewport: Viewport = { x: 0, y: 0, zoom: 1 }

  beforeEach(() => {
    // Clear history before each test
    useHistoryStore.getState().clearHistory()

    // Reset mocks
    vi.clearAllMocks()

    // Set up default mock implementations
    mockGetNodes.mockReturnValue(initialNodes)
    mockGetEdges.mockReturnValue(initialEdges)
    mockGetViewport.mockReturnValue(initialViewport)
  })

  it('initializes with initial snapshot', () => {
    const { result } = renderHook(() => useUndo(), {
      wrapper: ReactFlowProvider,
    })

    // Should not be able to undo initially (only one snapshot)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('saves snapshot on saveSnapshot call', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    // Wait for debounce
    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })
  })

  it('performs undo operation', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Create second snapshot
    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })

    // Perform undo
    act(() => {
      result.current.undo()
    })

    // Verify setNodes, setEdges, setViewport were called
    expect(mockSetNodes).toHaveBeenCalled()
    expect(mockSetEdges).toHaveBeenCalled()
    expect(mockSetViewport).toHaveBeenCalled()
  })

  it('performs redo operation', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Create second snapshot
    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })

    // Perform undo
    act(() => {
      result.current.undo()
    })

    // Now should be able to redo
    await waitFor(() => {
      expect(result.current.canRedo).toBe(true)
    }, { timeout: 100 })

    // Perform redo
    act(() => {
      result.current.redo()
    })

    expect(mockSetNodes).toHaveBeenCalled()
    expect(mockSetEdges).toHaveBeenCalled()
    expect(mockSetViewport).toHaveBeenCalled()
  })

  it('returns false when cannot undo', () => {
    const { result } = renderHook(() => useUndo(), {
      wrapper: ReactFlowProvider,
    })

    // Cannot undo initially
    const success = result.current.undo()
    expect(success).toBe(false)
  })

  it('returns false when cannot redo', () => {
    const { result } = renderHook(() => useUndo(), {
      wrapper: ReactFlowProvider,
    })

    // Cannot redo initially
    const success = result.current.redo()
    expect(success).toBe(false)
  })

  it('skips viewport-only changes when skipViewportOnly is true', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50, skipViewportOnly: true }), {
      wrapper: ReactFlowProvider,
    })

    // Change only viewport
    const updatedViewport: Viewport = { x: 100, y: 100, zoom: 2 }
    mockGetViewport.mockReturnValue(updatedViewport)

    act(() => {
      result.current.saveSnapshot()
    })

    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should not have added a new snapshot (still cannot undo)
    expect(result.current.canUndo).toBe(false)
  })

  it('saves viewport changes when skipViewportOnly is false', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50, skipViewportOnly: false }), {
      wrapper: ReactFlowProvider,
    })

    // Change only viewport
    const updatedViewport: Viewport = { x: 100, y: 100, zoom: 2 }
    mockGetViewport.mockReturnValue(updatedViewport)

    act(() => {
      result.current.saveSnapshot()
    })

    // Wait for debounce
    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })
  })

  it('debounces snapshot saving', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 100 }), {
      wrapper: ReactFlowProvider,
    })

    // Call saveSnapshot multiple times quickly
    act(() => {
      result.current.saveSnapshot()
      result.current.saveSnapshot()
      result.current.saveSnapshot()
    })

    // Should not have saved yet (debouncing)
    expect(result.current.canUndo).toBe(false)

    // Wait for debounce
    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 150 })
  })

  it('skips snapshot when restoring', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Create second snapshot
    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })

    // Clear mock calls
    mockSetNodes.mockClear()

    // Perform undo (which triggers restoring)
    act(() => {
      result.current.undo()
    })

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify we didn't save a new snapshot during restore
    // (canRedo should still be true, not reset)
    await waitFor(() => {
      expect(result.current.canRedo).toBe(true)
    }, { timeout: 100 })
  })

  it('updates canUndo and canRedo states correctly', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Initial state
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)

    // Add snapshot
    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
      expect(result.current.canRedo).toBe(false)
    }, { timeout: 100 })

    // Undo
    act(() => {
      result.current.undo()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(false)
      expect(result.current.canRedo).toBe(true)
    }, { timeout: 100 })

    // Redo
    act(() => {
      result.current.redo()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
      expect(result.current.canRedo).toBe(false)
    }, { timeout: 100 })
  })

  it('saves node changes', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Update nodes
    const updatedNodes: Node[] = [
      { id: '1', position: { x: 100, y: 100 }, data: { label: 'Updated' } },
      { id: '2', position: { x: 200, y: 200 }, data: { label: 'New Node' } },
    ]
    mockGetNodes.mockReturnValue(updatedNodes)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })
  })

  it('saves edge changes', async () => {
    const { result } = renderHook(() => useUndo({ debounceMs: 50 }), {
      wrapper: ReactFlowProvider,
    })

    // Update edges
    const updatedEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ]
    mockGetEdges.mockReturnValue(updatedEdges)

    act(() => {
      result.current.saveSnapshot()
    })

    await waitFor(() => {
      expect(result.current.canUndo).toBe(true)
    }, { timeout: 100 })
  })

  it('provides getCurrentSnapshot function', () => {
    const { result } = renderHook(() => useUndo(), {
      wrapper: ReactFlowProvider,
    })

    expect(result.current.getCurrentSnapshot).toBeDefined()
    const snapshot = result.current.getCurrentSnapshot()
    expect(snapshot).toBeDefined()
    expect(snapshot?.nodes).toBeDefined()
    expect(snapshot?.edges).toBeDefined()
    expect(snapshot?.viewport).toBeDefined()
  })
})
