import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveFlowToLocalStorage,
  loadFlowFromLocalStorage,
  clearFlowFromLocalStorage,
  validateFlowState,
  FlowState,
} from './flowStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
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

describe('flowStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('saveFlowToLocalStorage', () => {
    it('saves flow to localStorage', () => {
      const nodes = [{ id: '1', position: { x: 0, y: 0 }, data: {} }]
      const edges = [{ id: 'e1', source: '1', target: '2' }]
      const viewport = { x: 0, y: 0, zoom: 1 }

      saveFlowToLocalStorage(nodes, edges, viewport)

      const stored = localStorageMock.getItem('react-flow-state')
      expect(stored).toBeTruthy()

      const flowState = JSON.parse(stored!)
      expect(flowState.nodes).toEqual(nodes)
      expect(flowState.edges).toEqual(edges)
      expect(flowState.viewport).toEqual(viewport)
    })
  })

  describe('loadFlowFromLocalStorage', () => {
    it('loads flow from localStorage', () => {
      const flowState: FlowState = {
        nodes: [{ id: '1', position: { x: 0, y: 0 }, data: {} }],
        edges: [{ id: 'e1', source: '1', target: '2' }],
        viewport: { x: 0, y: 0, zoom: 1 },
        version: '1.0',
        timestamp: Date.now(),
      }

      localStorageMock.setItem('react-flow-state', JSON.stringify(flowState))

      const loaded = loadFlowFromLocalStorage()
      expect(loaded).toEqual(flowState)
    })

    it('returns null if no flow stored', () => {
      const loaded = loadFlowFromLocalStorage()
      expect(loaded).toBeNull()
    })

    it('returns null if version mismatch', () => {
      const flowState: FlowState = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        version: '0.9',
        timestamp: Date.now(),
      }

      localStorageMock.setItem('react-flow-state', JSON.stringify(flowState))

      const loaded = loadFlowFromLocalStorage()
      expect(loaded).toBeNull()
    })
  })

  describe('clearFlowFromLocalStorage', () => {
    it('clears flow from localStorage', () => {
      localStorageMock.setItem('react-flow-state', 'test')
      clearFlowFromLocalStorage()

      const stored = localStorageMock.getItem('react-flow-state')
      expect(stored).toBeNull()
    })
  })

  describe('validateFlowState', () => {
    it('validates valid flow state', () => {
      const flowState = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }

      expect(validateFlowState(flowState)).toBe(true)
    })

    it('rejects invalid flow state - not an object', () => {
      expect(validateFlowState('invalid')).toBe(false)
      expect(validateFlowState(null)).toBe(false)
      expect(validateFlowState(undefined)).toBe(false)
    })

    it('rejects invalid flow state - missing nodes', () => {
      const flowState = {
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }

      expect(validateFlowState(flowState)).toBe(false)
    })

    it('rejects invalid flow state - invalid viewport', () => {
      const flowState = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0 }, // missing zoom
      }

      expect(validateFlowState(flowState)).toBe(false)
    })
  })
})
