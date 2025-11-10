import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFlowStore } from './flowStore'
import type { Node, Edge, Viewport } from '@xyflow/react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('FlowStore', () => {
  beforeEach(() => {
    // Clear store before each test
    const { result } = renderHook(() => useFlowStore())
    act(() => {
      result.current.clearFlow()
    })
    localStorageMock.clear()
  })

  describe('Initial State', () => {
    it('should have empty nodes and edges', () => {
      const { result } = renderHook(() => useFlowStore())

      expect(result.current.nodes).toEqual([])
      expect(result.current.edges).toEqual([])
    })

    it('should have default viewport', () => {
      const { result } = renderHook(() => useFlowStore())

      expect(result.current.viewport).toEqual({ x: 0, y: 0, zoom: 1 })
    })
  })

  describe('Node Management', () => {
    it('should set nodes', () => {
      const { result } = renderHook(() => useFlowStore())
      const nodes: Node[] = [
        {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1' },
          type: 'default',
        },
      ]

      act(() => {
        result.current.setNodes(nodes)
      })

      expect(result.current.nodes).toEqual(nodes)
    })

    it('should add a node', () => {
      const { result } = renderHook(() => useFlowStore())
      const node: Node = {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'New Node' },
        type: 'default',
      }

      act(() => {
        result.current.addNode(node)
      })

      expect(result.current.nodes).toHaveLength(1)
      expect(result.current.nodes[0]).toEqual(node)
    })

    it('should add multiple nodes', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.addNode({
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1' },
          type: 'default',
        })
        result.current.addNode({
          id: '2',
          position: { x: 100, y: 100 },
          data: { label: 'Node 2' },
          type: 'default',
        })
      })

      expect(result.current.nodes).toHaveLength(2)
    })

    it('should remove a node', () => {
      const { result } = renderHook(() => useFlowStore())
      const nodes: Node[] = [
        {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1' },
          type: 'default',
        },
        {
          id: '2',
          position: { x: 100, y: 100 },
          data: { label: 'Node 2' },
          type: 'default',
        },
      ]

      act(() => {
        result.current.setNodes(nodes)
        result.current.removeNode('1')
      })

      expect(result.current.nodes).toHaveLength(1)
      expect(result.current.nodes[0].id).toBe('2')
    })

    it('should remove connected edges when removing a node', () => {
      const { result } = renderHook(() => useFlowStore())
      const nodes: Node[] = [
        {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node 1' },
          type: 'default',
        },
        {
          id: '2',
          position: { x: 100, y: 100 },
          data: { label: 'Node 2' },
          type: 'default',
        },
      ]
      const edges: Edge[] = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
      ]

      act(() => {
        result.current.setNodes(nodes)
        result.current.setEdges(edges)
        result.current.removeNode('1')
      })

      expect(result.current.edges).toHaveLength(0)
    })

    it('should update a node', () => {
      const { result } = renderHook(() => useFlowStore())
      const node: Node = {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'Old Label' },
        type: 'default',
      }

      act(() => {
        result.current.addNode(node)
        result.current.updateNode('1', {
          data: { label: 'New Label' },
        })
      })

      expect(result.current.nodes[0].data).toEqual({ label: 'New Label' })
    })

    it('should update node position', () => {
      const { result } = renderHook(() => useFlowStore())
      const node: Node = {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'Node' },
        type: 'default',
      }

      act(() => {
        result.current.addNode(node)
        result.current.updateNode('1', {
          position: { x: 100, y: 200 },
        })
      })

      expect(result.current.nodes[0].position).toEqual({ x: 100, y: 200 })
    })

    it('should not update non-existent node', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.updateNode('non-existent', {
          data: { label: 'New' },
        })
      })

      expect(result.current.nodes).toHaveLength(0)
    })
  })

  describe('Edge Management', () => {
    it('should set edges', () => {
      const { result } = renderHook(() => useFlowStore())
      const edges: Edge[] = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
      ]

      act(() => {
        result.current.setEdges(edges)
      })

      expect(result.current.edges).toEqual(edges)
    })

    it('should add an edge', () => {
      const { result } = renderHook(() => useFlowStore())
      const edge: Edge = {
        id: 'e1-2',
        source: '1',
        target: '2',
      }

      act(() => {
        result.current.addEdge(edge)
      })

      expect(result.current.edges).toHaveLength(1)
      expect(result.current.edges[0]).toEqual(edge)
    })

    it('should add multiple edges', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.addEdge({
          id: 'e1-2',
          source: '1',
          target: '2',
        })
        result.current.addEdge({
          id: 'e2-3',
          source: '2',
          target: '3',
        })
      })

      expect(result.current.edges).toHaveLength(2)
    })

    it('should remove an edge', () => {
      const { result } = renderHook(() => useFlowStore())
      const edges: Edge[] = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
        {
          id: 'e2-3',
          source: '2',
          target: '3',
        },
      ]

      act(() => {
        result.current.setEdges(edges)
        result.current.removeEdge('e1-2')
      })

      expect(result.current.edges).toHaveLength(1)
      expect(result.current.edges[0].id).toBe('e2-3')
    })

    it('should remove non-existent edge gracefully', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.removeEdge('non-existent')
      })

      expect(result.current.edges).toHaveLength(0)
    })
  })

  describe('Viewport Management', () => {
    it('should set viewport', () => {
      const { result } = renderHook(() => useFlowStore())
      const viewport: Viewport = { x: 100, y: 200, zoom: 1.5 }

      act(() => {
        result.current.setViewport(viewport)
      })

      expect(result.current.viewport).toEqual(viewport)
    })

    it('should update viewport zoom', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.setViewport({ x: 0, y: 0, zoom: 2 })
      })

      expect(result.current.viewport.zoom).toBe(2)
    })

    it('should update viewport position', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.setViewport({ x: 500, y: 300, zoom: 1 })
      })

      expect(result.current.viewport.x).toBe(500)
      expect(result.current.viewport.y).toBe(300)
    })
  })

  describe('Clear Flow', () => {
    it('should clear all nodes and edges', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.addNode({
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Node' },
          type: 'default',
        })
        result.current.addEdge({
          id: 'e1-2',
          source: '1',
          target: '2',
        })
        result.current.setViewport({ x: 100, y: 100, zoom: 2 })
        result.current.clearFlow()
      })

      expect(result.current.nodes).toEqual([])
      expect(result.current.edges).toEqual([])
      expect(result.current.viewport).toEqual({ x: 0, y: 0, zoom: 1 })
    })
  })

  describe('Persistence', () => {
    it('should persist state to localStorage', async () => {
      const { result } = renderHook(() => useFlowStore())
      const node: Node = {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'Persisted Node' },
        type: 'default',
      }

      act(() => {
        result.current.addNode(node)
      })

      // Wait for persistence to complete (Zustand persist is async)
      await waitFor(
        () => {
          const stored = localStorageMock.getItem('flow-storage')
          expect(stored).toBeTruthy()
        },
        { timeout: 1000 }
      )

      // Verify the stored data contains our node
      const stored = localStorageMock.getItem('flow-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.nodes).toHaveLength(1)
        expect(parsed.state.nodes[0].data.label).toBe('Persisted Node')
      }
    })

    it('should restore state from localStorage', () => {
      // First session: add a node
      const { result: result1 } = renderHook(() => useFlowStore())

      act(() => {
        result1.current.addNode({
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Persisted Node' },
          type: 'default',
        })
      })

      // Simulate new session: create new hook instance
      const { result: result2 } = renderHook(() => useFlowStore())

      // Should have the persisted node
      expect(result2.current.nodes).toHaveLength(1)
      expect(result2.current.nodes[0].data).toEqual({ label: 'Persisted Node' })
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle batch operations', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        // Add multiple nodes and edges
        result.current.setNodes([
          {
            id: '1',
            position: { x: 0, y: 0 },
            data: { label: 'Node 1' },
            type: 'default',
          },
          {
            id: '2',
            position: { x: 100, y: 100 },
            data: { label: 'Node 2' },
            type: 'default',
          },
          {
            id: '3',
            position: { x: 200, y: 200 },
            data: { label: 'Node 3' },
            type: 'default',
          },
        ])

        result.current.setEdges([
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
        ])
      })

      expect(result.current.nodes).toHaveLength(3)
      expect(result.current.edges).toHaveLength(2)
    })

    it('should handle removing middle node in chain', () => {
      const { result } = renderHook(() => useFlowStore())

      act(() => {
        result.current.setNodes([
          {
            id: '1',
            position: { x: 0, y: 0 },
            data: { label: 'Node 1' },
            type: 'default',
          },
          {
            id: '2',
            position: { x: 100, y: 100 },
            data: { label: 'Node 2' },
            type: 'default',
          },
          {
            id: '3',
            position: { x: 200, y: 200 },
            data: { label: 'Node 3' },
            type: 'default',
          },
        ])

        result.current.setEdges([
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' },
        ])

        // Remove middle node
        result.current.removeNode('2')
      })

      expect(result.current.nodes).toHaveLength(2)
      expect(result.current.edges).toHaveLength(0) // Both edges should be removed
    })
  })
})
