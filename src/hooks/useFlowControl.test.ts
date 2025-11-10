import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useFlowControl } from './useFlowControl'
import { ReactFlowProvider } from '@xyflow/react'

// Mock useReactFlow
vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({
      fitView: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      getNode: vi.fn((id: string) => ({
        id,
        position: { x: 100, y: 100 },
        data: {},
        width: 200,
        height: 100,
      })),
      setCenter: vi.fn(),
      getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
      setViewport: vi.fn(),
      getNodes: vi.fn(() => []),
      getEdges: vi.fn(() => []),
      getEdge: vi.fn(),
      screenToFlowPosition: vi.fn((pos) => pos),
      flowToScreenPosition: vi.fn((pos) => pos),
    }),
  }
})

describe('useFlowControl', () => {
  it('provides flow control utilities', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    expect(result.current).toHaveProperty('fitView')
    expect(result.current).toHaveProperty('zoomIn')
    expect(result.current).toHaveProperty('zoomOut')
    expect(result.current).toHaveProperty('centerNode')
    expect(result.current).toHaveProperty('getViewport')
    expect(result.current).toHaveProperty('setViewport')
    expect(result.current).toHaveProperty('getNodes')
    expect(result.current).toHaveProperty('getEdges')
    expect(result.current).toHaveProperty('getNode')
    expect(result.current).toHaveProperty('getEdge')
    expect(result.current).toHaveProperty('screenToFlowPosition')
    expect(result.current).toHaveProperty('flowToScreenPosition')
  })

  it('fitView is a function', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    expect(typeof result.current.fitView).toBe('function')
  })

  it('zoomIn is a function', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    expect(typeof result.current.zoomIn).toBe('function')
  })

  it('zoomOut is a function', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    expect(typeof result.current.zoomOut).toBe('function')
  })

  it('getViewport returns viewport information', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    const viewport = result.current.getViewport()
    expect(viewport).toEqual({ x: 0, y: 0, zoom: 1 })
  })

  it('getNodes returns array', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    const nodes = result.current.getNodes()
    expect(Array.isArray(nodes)).toBe(true)
  })

  it('getEdges returns array', () => {
    const { result } = renderHook(() => useFlowControl(), {
      wrapper: ReactFlowProvider,
    })

    const edges = result.current.getEdges()
    expect(Array.isArray(edges)).toBe(true)
  })
})
