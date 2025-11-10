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

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate node structure
 */
const validateNode = (node: unknown, index: number): ValidationError[] => {
  const errors: ValidationError[] = []

  if (typeof node !== 'object' || node === null) {
    errors.push({
      field: `nodes[${index}]`,
      message: 'Node must be an object',
    })
    return errors
  }

  const n = node as Record<string, unknown>

  if (typeof n.id !== 'string' || !n.id) {
    errors.push({
      field: `nodes[${index}].id`,
      message: 'Node must have a valid string id',
    })
  }

  if (typeof n.position !== 'object' || n.position === null) {
    errors.push({
      field: `nodes[${index}].position`,
      message: 'Node must have a position object',
    })
  } else {
    const pos = n.position as Record<string, unknown>
    if (typeof pos.x !== 'number') {
      errors.push({
        field: `nodes[${index}].position.x`,
        message: 'Position x must be a number',
      })
    }
    if (typeof pos.y !== 'number') {
      errors.push({
        field: `nodes[${index}].position.y`,
        message: 'Position y must be a number',
      })
    }
  }

  if (typeof n.data !== 'object' || n.data === null) {
    errors.push({
      field: `nodes[${index}].data`,
      message: 'Node must have a data object',
    })
  }

  return errors
}

/**
 * Validate edge structure
 */
const validateEdge = (edge: unknown, index: number): ValidationError[] => {
  const errors: ValidationError[] = []

  if (typeof edge !== 'object' || edge === null) {
    errors.push({
      field: `edges[${index}]`,
      message: 'Edge must be an object',
    })
    return errors
  }

  const e = edge as Record<string, unknown>

  if (typeof e.id !== 'string' || !e.id) {
    errors.push({
      field: `edges[${index}].id`,
      message: 'Edge must have a valid string id',
    })
  }

  if (typeof e.source !== 'string' || !e.source) {
    errors.push({
      field: `edges[${index}].source`,
      message: 'Edge must have a valid source node id',
    })
  }

  if (typeof e.target !== 'string' || !e.target) {
    errors.push({
      field: `edges[${index}].target`,
      message: 'Edge must have a valid target node id',
    })
  }

  return errors
}

/**
 * Validate imported flow state with detailed error messages
 */
export const validateFlowJSON = (data: unknown): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = []

  if (typeof data !== 'object' || data === null) {
    errors.push({
      field: 'root',
      message: 'Flow data must be an object',
    })
    return { valid: false, errors }
  }

  const flowState = data as Partial<FlowState>

  // Validate nodes
  if (!Array.isArray(flowState.nodes)) {
    errors.push({
      field: 'nodes',
      message: 'Nodes must be an array',
    })
  } else {
    flowState.nodes.forEach((node, index) => {
      errors.push(...validateNode(node, index))
    })
  }

  // Validate edges
  if (!Array.isArray(flowState.edges)) {
    errors.push({
      field: 'edges',
      message: 'Edges must be an array',
    })
  } else {
    flowState.edges.forEach((edge, index) => {
      errors.push(...validateEdge(edge, index))
    })
  }

  // Validate viewport
  if (typeof flowState.viewport !== 'object' || flowState.viewport === null) {
    errors.push({
      field: 'viewport',
      message: 'Viewport must be an object',
    })
  } else {
    const viewport = flowState.viewport as Record<string, unknown>
    if (typeof viewport.x !== 'number') {
      errors.push({
        field: 'viewport.x',
        message: 'Viewport x must be a number',
      })
    }
    if (typeof viewport.y !== 'number') {
      errors.push({
        field: 'viewport.y',
        message: 'Viewport y must be a number',
      })
    }
    if (typeof viewport.zoom !== 'number') {
      errors.push({
        field: 'viewport.zoom',
        message: 'Viewport zoom must be a number',
      })
    }
  }

  // Validate version (optional, warning only)
  if (flowState.version && typeof flowState.version !== 'string') {
    errors.push({
      field: 'version',
      message: 'Version must be a string',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate imported flow state (legacy compatibility)
 */
export const validateFlowState = (data: unknown): data is FlowState => {
  return validateFlowJSON(data).valid
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
