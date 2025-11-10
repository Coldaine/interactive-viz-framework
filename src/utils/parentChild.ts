import { Node } from '@xyflow/react'

/**
 * Utilities for working with parent-child node relationships
 */

/**
 * Get all children of a parent node
 * @param nodes - All nodes in the flow
 * @param parentId - ID of the parent node
 * @returns Array of child nodes
 */
export const getChildNodes = (nodes: Node[], parentId: string): Node[] => {
  return nodes.filter((node) => node.parentId === parentId)
}

/**
 * Get the parent of a node
 * @param nodes - All nodes in the flow
 * @param childId - ID of the child node
 * @returns Parent node or undefined if not found
 */
export const getParentNode = (nodes: Node[], childId: string): Node | undefined => {
  const childNode = nodes.find((node) => node.id === childId)
  if (!childNode || !childNode.parentId) return undefined

  return nodes.find((node) => node.id === childNode.parentId)
}

/**
 * Check if a node is a parent (has children)
 * @param nodes - All nodes in the flow
 * @param nodeId - ID of the node to check
 * @returns True if node has children
 */
export const isParentNode = (nodes: Node[], nodeId: string): boolean => {
  return nodes.some((node) => node.parentId === nodeId)
}

/**
 * Get all descendants of a node (children, grandchildren, etc.)
 * @param nodes - All nodes in the flow
 * @param parentId - ID of the parent node
 * @returns Array of all descendant nodes
 */
export const getAllDescendants = (nodes: Node[], parentId: string): Node[] => {
  const children = getChildNodes(nodes, parentId)
  const descendants = [...children]

  children.forEach((child) => {
    descendants.push(...getAllDescendants(nodes, child.id))
  })

  return descendants
}

/**
 * Get the root parent of a node (topmost ancestor)
 * @param nodes - All nodes in the flow
 * @param nodeId - ID of the node
 * @returns Root parent node or the node itself if it has no parent
 */
export const getRootParent = (nodes: Node[], nodeId: string): Node | undefined => {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return undefined

  if (!node.parentId) return node

  return getRootParent(nodes, node.parentId)
}

/**
 * Create a new parent node with children
 * @param parentData - Data for the parent node
 * @param childNodes - Array of nodes to become children
 * @returns Object with parent node and updated child nodes
 */
export const createParentWithChildren = (
  parentData: {
    id: string
    position: { x: number; y: number }
    data: Record<string, unknown>
    type?: string
    style?: Record<string, unknown>
  },
  childNodes: Node[]
): { parent: Node; children: Node[] } => {
  const parent: Node = {
    id: parentData.id,
    position: parentData.position,
    data: parentData.data,
    type: parentData.type || 'default',
    style: {
      width: 400,
      height: 300,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '2px dashed rgba(59, 130, 246, 0.5)',
      ...parentData.style,
    },
  }

  // Convert child positions to relative coordinates
  const minX = Math.min(...childNodes.map((n) => n.position.x))
  const minY = Math.min(...childNodes.map((n) => n.position.y))

  const children = childNodes.map((child) => ({
    ...child,
    parentId: parent.id,
    position: {
      x: child.position.x - minX + 20,
      y: child.position.y - minY + 60,
    },
    extent: 'parent' as const,
    expandParent: true,
  }))

  return { parent, children }
}

/**
 * Remove a node from its parent
 * @param node - The node to remove from parent
 * @param parentPosition - Current position of the parent node
 * @returns Updated node with absolute positioning
 */
export const removeFromParent = (
  node: Node,
  parentPosition: { x: number; y: number }
): Node => {
  return {
    ...node,
    parentId: undefined,
    extent: undefined,
    expandParent: undefined,
    position: {
      x: node.position.x + parentPosition.x,
      y: node.position.y + parentPosition.y,
    },
  }
}

/**
 * Calculate the bounding box that contains all child nodes
 * @param children - Array of child nodes
 * @param padding - Padding around children (default: 20)
 * @returns Bounding box dimensions
 */
export const calculateParentBounds = (
  children: Node[],
  padding = 20
): { width: number; height: number } => {
  if (children.length === 0) {
    return { width: 200, height: 200 }
  }

  const positions = children.map((child) => ({
    x: child.position.x,
    y: child.position.y,
    width: (child.style?.width as number) || (child.width ?? 150),
    height: (child.style?.height as number) || (child.height ?? 100),
  }))

  const maxX = Math.max(...positions.map((p) => p.x + p.width))
  const maxY = Math.max(...positions.map((p) => p.y + p.height))

  return {
    width: maxX + padding,
    height: maxY + padding,
  }
}
