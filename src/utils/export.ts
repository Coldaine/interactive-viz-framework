import { ReactFlowInstance, Node, Edge, Viewport, getNodesBounds, getViewportForBounds } from '@xyflow/react'
import { toPng, toSvg } from 'html-to-image'

export interface ExportOptions {
  filename?: string
  backgroundColor?: string
  width?: number
  height?: number
  imageWidth?: number
  imageHeight?: number
}

/**
 * Export flow as PNG image
 */
export const exportToPNG = async (
  reactFlowInstance: ReactFlowInstance,
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const {
      filename = `flow-${Date.now()}.png`,
      backgroundColor = '#ffffff',
      imageWidth = 1920,
      imageHeight = 1080,
    } = options

    // Get the viewport element
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) {
      throw new Error('React Flow viewport not found')
    }

    // Get all nodes to calculate bounds
    const nodes = reactFlowInstance.getNodes()
    if (nodes.length === 0) {
      throw new Error('No nodes to export')
    }

    // Calculate bounds for all nodes
    const nodesBounds = getNodesBounds(nodes)
    const viewportForBounds = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, // min zoom
      2, // max zoom
      0.1 // padding
    )

    // Store original transform
    const originalTransform = viewport.style.transform

    // Apply calculated viewport
    viewport.style.transform = `translate(${viewportForBounds.x}px, ${viewportForBounds.y}px) scale(${viewportForBounds.zoom})`

    // Generate PNG
    const dataUrl = await toPng(viewport, {
      backgroundColor,
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
      },
    })

    // Restore original transform
    viewport.style.transform = originalTransform

    // Download the image
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to export PNG:', error)
    throw new Error(`PNG export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Export flow as SVG image
 */
export const exportToSVG = async (
  reactFlowInstance: ReactFlowInstance,
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const {
      filename = `flow-${Date.now()}.svg`,
      backgroundColor = '#ffffff',
      imageWidth = 1920,
      imageHeight = 1080,
    } = options

    // Get the viewport element
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) {
      throw new Error('React Flow viewport not found')
    }

    // Get all nodes to calculate bounds
    const nodes = reactFlowInstance.getNodes()
    if (nodes.length === 0) {
      throw new Error('No nodes to export')
    }

    // Calculate bounds for all nodes
    const nodesBounds = getNodesBounds(nodes)
    const viewportForBounds = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, // min zoom
      2, // max zoom
      0.1 // padding
    )

    // Store original transform
    const originalTransform = viewport.style.transform

    // Apply calculated viewport
    viewport.style.transform = `translate(${viewportForBounds.x}px, ${viewportForBounds.y}px) scale(${viewportForBounds.zoom})`

    // Generate SVG
    const dataUrl = await toSvg(viewport, {
      backgroundColor,
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
      },
    })

    // Restore original transform
    viewport.style.transform = originalTransform

    // Download the SVG
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to export SVG:', error)
    throw new Error(`SVG export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Export flow data as JSON
 */
export const exportToJSON = (
  nodes: Node[],
  edges: Edge[],
  viewport: Viewport,
  filename = `flow-${Date.now()}.json`
): void => {
  try {
    const flowData = {
      nodes,
      edges,
      viewport,
      version: '1.0',
      timestamp: Date.now(),
    }

    const dataStr = JSON.stringify(flowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export JSON:', error)
    throw new Error(`JSON export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Export selected nodes only
 */
export const exportSelectedNodes = (
  reactFlowInstance: ReactFlowInstance,
  format: 'png' | 'svg' | 'json',
  options: ExportOptions = {}
): Promise<void> | void => {
  const nodes = reactFlowInstance.getNodes()
  const edges = reactFlowInstance.getEdges()
  const selectedNodes = nodes.filter((node) => node.selected)
  const selectedNodeIds = new Set(selectedNodes.map((node) => node.id))
  const selectedEdges = edges.filter(
    (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
  )

  if (selectedNodes.length === 0) {
    throw new Error('No nodes selected')
  }

  // Create a temporary instance with only selected nodes
  const tempInstance = {
    ...reactFlowInstance,
    getNodes: () => selectedNodes,
    getEdges: () => selectedEdges,
  }

  if (format === 'json') {
    const viewport = reactFlowInstance.getViewport()
    return exportToJSON(selectedNodes, selectedEdges, viewport, options.filename)
  } else if (format === 'png') {
    return exportToPNG(tempInstance as ReactFlowInstance, options)
  } else if (format === 'svg') {
    return exportToSVG(tempInstance as ReactFlowInstance, options)
  }
}

/**
 * Copy flow data to clipboard
 */
export const copyToClipboard = async (
  nodes: Node[],
  edges: Edge[],
  viewport: Viewport
): Promise<void> => {
  try {
    const flowData = {
      nodes,
      edges,
      viewport,
      version: '1.0',
      timestamp: Date.now(),
    }

    const dataStr = JSON.stringify(flowData, null, 2)
    await navigator.clipboard.writeText(dataStr)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    throw new Error(`Clipboard copy failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Copy selected nodes to clipboard
 */
export const copySelectedToClipboard = async (reactFlowInstance: ReactFlowInstance): Promise<void> => {
  const nodes = reactFlowInstance.getNodes()
  const edges = reactFlowInstance.getEdges()
  const selectedNodes = nodes.filter((node) => node.selected)
  const selectedNodeIds = new Set(selectedNodes.map((node) => node.id))
  const selectedEdges = edges.filter(
    (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
  )

  if (selectedNodes.length === 0) {
    throw new Error('No nodes selected')
  }

  const viewport = reactFlowInstance.getViewport()
  await copyToClipboard(selectedNodes, selectedEdges, viewport)
}
