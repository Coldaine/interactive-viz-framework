import { Node, Edge, Viewport } from '@xyflow/react'

const STORAGE_KEY = 'react-flow-state'
const STORAGE_VERSION = '1.0'

export interface FlowState {
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  version: string
  timestamp: number
}

/**
 * Save flow state to localStorage
 */
export const saveFlowToLocalStorage = (nodes: Node[], edges: Edge[], viewport: Viewport): void => {
  try {
    const flowState: FlowState = {
      nodes,
      edges,
      viewport,
      version: STORAGE_VERSION,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState))
  } catch (error) {
    console.error('Failed to save flow to localStorage:', error)
  }
}

/**
 * Load flow state from localStorage
 */
export const loadFlowFromLocalStorage = (): FlowState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const flowState = JSON.parse(stored) as FlowState

    // Validate version
    if (flowState.version !== STORAGE_VERSION) {
      console.warn('Flow state version mismatch, ignoring stored state')
      return null
    }

    return flowState
  } catch (error) {
    console.error('Failed to load flow from localStorage:', error)
    return null
  }
}

/**
 * Clear flow state from localStorage
 */
export const clearFlowFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear flow from localStorage:', error)
  }
}

/**
 * Export flow state as JSON file
 */
export const exportFlowToJSON = (nodes: Node[], edges: Edge[], viewport: Viewport): void => {
  try {
    const flowState: FlowState = {
      nodes,
      edges,
      viewport,
      version: STORAGE_VERSION,
      timestamp: Date.now(),
    }

    const dataStr = JSON.stringify(flowState, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `flow-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export flow to JSON:', error)
  }
}

/**
 * Validate imported flow state
 */
export const validateFlowState = (data: unknown): data is FlowState => {
  if (typeof data !== 'object' || data === null) return false

  const flowState = data as Partial<FlowState>

  return (
    Array.isArray(flowState.nodes) &&
    Array.isArray(flowState.edges) &&
    typeof flowState.viewport === 'object' &&
    flowState.viewport !== null &&
    typeof flowState.viewport.x === 'number' &&
    typeof flowState.viewport.y === 'number' &&
    typeof flowState.viewport.zoom === 'number'
  )
}

/**
 * Import flow state from JSON file
 */
export const importFlowFromJSON = (file: File): Promise<FlowState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        if (!validateFlowState(data)) {
          reject(new Error('Invalid flow state format'))
          return
        }

        resolve(data)
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
