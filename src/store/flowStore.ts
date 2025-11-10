import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Node, Edge, Viewport } from '@xyflow/react'

export interface FlowState {
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setViewport: (viewport: Viewport) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  clearFlow: () => void
}

const initialState = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      ...initialState,

      setNodes: (nodes) => set({ nodes }),

      setEdges: (edges) => set({ edges }),

      setViewport: (viewport) => set({ viewport }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      removeNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
        })),

      updateNode: (nodeId, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node
          ),
        })),

      addEdge: (edge) =>
        set((state) => ({
          edges: [...state.edges, edge],
        })),

      removeEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      clearFlow: () => set(initialState),
    }),
    {
      name: 'flow-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        viewport: state.viewport,
      }),
    }
  )
)
