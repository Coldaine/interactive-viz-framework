import { Connection, Edge, Node } from '@xyflow/react'

/**
 * Node type compatibility rules
 * Defines which node types can connect to which other node types
 */
const NODE_TYPE_COMPATIBILITY: Record<string, string[]> = {
  // DataNodes can connect to any node
  dataNode: ['dataNode', 'actionNode', 'mediaNode', 'codeNode', 'decisionNode', 'loopNode', 'integrationNode'],

  // ActionNodes can connect to any node
  actionNode: ['dataNode', 'actionNode', 'mediaNode', 'codeNode', 'decisionNode', 'loopNode', 'integrationNode'],

  // MediaNodes can connect to any node
  mediaNode: ['dataNode', 'actionNode', 'mediaNode', 'codeNode', 'decisionNode', 'loopNode', 'integrationNode'],

  // CodeNodes can connect to any node
  codeNode: ['dataNode', 'actionNode', 'mediaNode', 'codeNode', 'decisionNode', 'loopNode', 'integrationNode'],

  // DecisionNodes can only output to action/integration nodes (execution flow)
  decisionNode: ['actionNode', 'integrationNode', 'loopNode', 'codeNode'],

  // LoopNodes can only output to nodes that can be repeated
  loopNode: ['actionNode', 'integrationNode', 'codeNode', 'loopNode'],

  // IntegrationNodes can connect to any node
  integrationNode: ['dataNode', 'actionNode', 'mediaNode', 'codeNode', 'decisionNode', 'loopNode', 'integrationNode'],
}

/**
 * Validates whether a connection is allowed based on various rules
 *
 * Rules checked:
 * 1. No self-connections (node cannot connect to itself)
 * 2. No duplicate connections (same source and target)
 * 3. Type compatibility (based on NODE_TYPE_COMPATIBILITY)
 * 4. Maximum connections per handle
 *
 * @param connection - The connection to validate
 * @param edges - Current edges in the flow
 * @param nodes - Current nodes in the flow
 * @returns true if connection is valid, false otherwise
 */
export const isValidConnection = (
  connection: Connection,
  edges: Edge[],
  nodes: Node[]
): boolean => {
  const { source, target, sourceHandle, targetHandle } = connection

  // Rule 1: Prevent self-connections
  if (source === target) {
    console.warn('Connection validation failed: Cannot connect a node to itself')
    return false
  }

  // Rule 2: Prevent duplicate connections
  // Check both with and without handles to catch all duplicates
  const isDuplicate = edges.some(
    (edge) =>
      edge.source === source &&
      edge.target === target &&
      (edge.sourceHandle ?? null) === (sourceHandle ?? null) &&
      (edge.targetHandle ?? null) === (targetHandle ?? null)
  )

  if (isDuplicate) {
    console.warn('Connection validation failed: Duplicate connection')
    return false
  }

  // Rule 3: Type-based validation
  const sourceNode = nodes.find((node) => node.id === source)
  const targetNode = nodes.find((node) => node.id === target)

  if (!sourceNode || !targetNode) {
    console.warn('Connection validation failed: Source or target node not found')
    return false
  }

  const sourceType = sourceNode.type || 'default'
  const targetType = targetNode.type || 'default'

  // Check if source type is allowed to connect to target type
  const allowedTargetTypes = NODE_TYPE_COMPATIBILITY[sourceType]

  if (allowedTargetTypes && !allowedTargetTypes.includes(targetType)) {
    console.warn(
      `Connection validation failed: ${sourceType} cannot connect to ${targetType}`
    )
    return false
  }

  // Rule 4: Maximum connections per handle (optional)
  // Limit to 5 outgoing connections per source node
  const existingOutgoingConnections = edges.filter(
    (edge) => edge.source === source
  )

  if (existingOutgoingConnections.length >= 5) {
    console.warn('Connection validation failed: Maximum outgoing connections (5) reached')
    return false
  }

  // All validation rules passed
  return true
}

/**
 * Get a human-readable message explaining why a connection is invalid
 */
export const getConnectionValidationMessage = (
  connection: Connection,
  edges: Edge[],
  nodes: Node[]
): string => {
  const { source, target, sourceHandle, targetHandle } = connection

  if (source === target) {
    return 'Cannot connect a node to itself'
  }

  const isDuplicate = edges.some(
    (edge) =>
      edge.source === source &&
      edge.target === target &&
      (edge.sourceHandle ?? null) === (sourceHandle ?? null) &&
      (edge.targetHandle ?? null) === (targetHandle ?? null)
  )

  if (isDuplicate) {
    return 'This connection already exists'
  }

  const sourceNode = nodes.find((node) => node.id === source)
  const targetNode = nodes.find((node) => node.id === target)

  if (!sourceNode || !targetNode) {
    return 'Source or target node not found'
  }

  const sourceType = sourceNode.type || 'default'
  const targetType = targetNode.type || 'default'

  const allowedTargetTypes = NODE_TYPE_COMPATIBILITY[sourceType]

  if (allowedTargetTypes && !allowedTargetTypes.includes(targetType)) {
    return `${sourceType} cannot connect to ${targetType}`
  }

  const existingOutgoingConnections = edges.filter(
    (edge) => edge.source === source
  )

  if (existingOutgoingConnections.length >= 5) {
    return 'Maximum outgoing connections (5) reached'
  }

  return 'Connection is valid'
}
