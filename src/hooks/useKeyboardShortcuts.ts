import { useEffect, useCallback } from 'react'
import { Node, Edge, useReactFlow } from '@xyflow/react'

interface KeyboardShortcutsOptions {
  onSave?: () => void
  onLoad?: () => void
  onExport?: () => void
}

/**
 * Custom hook for keyboard shortcuts
 * Supports undo/redo (via browser history), copy/paste, delete, and select all
 */
export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const { setNodes, setEdges, getNodes, getEdges, deleteElements, fitView } = useReactFlow()

  // Clipboard for copy/paste operations
  let clipboard: { nodes: Node[]; edges: Edge[] } | null = null

  /**
   * Copy selected nodes and edges to clipboard
   */
  const copySelection = useCallback(() => {
    const nodes = getNodes()
    const edges = getEdges()

    const selectedNodes = nodes.filter((node) => node.selected)
    const selectedNodeIds = new Set(selectedNodes.map((node) => node.id))

    // Include edges that connect selected nodes
    const selectedEdges = edges.filter(
      (edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target)
    )

    clipboard = {
      nodes: selectedNodes,
      edges: selectedEdges,
    }

    console.log(`Copied ${selectedNodes.length} nodes and ${selectedEdges.length} edges`)
  }, [getNodes, getEdges])

  /**
   * Paste clipboard content
   */
  const pasteSelection = useCallback(() => {
    if (!clipboard || clipboard.nodes.length === 0) {
      console.log('Clipboard is empty')
      return
    }

    const timestamp = Date.now()

    // Create new nodes with updated IDs and positions
    const idMapping = new Map<string, string>()
    const newNodes = clipboard.nodes.map((node) => {
      const newId = `${node.id}-copy-${timestamp}`
      idMapping.set(node.id, newId)

      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + 20,
          y: node.position.y + 20,
        },
        selected: true,
      }
    })

    // Create new edges with updated IDs
    const newEdges = clipboard.edges.map((edge) => ({
      ...edge,
      id: `${edge.id}-copy-${timestamp}`,
      source: idMapping.get(edge.source) || edge.source,
      target: idMapping.get(edge.target) || edge.target,
      selected: true,
    }))

    // Deselect existing nodes/edges
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })))
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })))

    // Add new nodes and edges
    setNodes((nodes) => [...nodes, ...newNodes])
    setEdges((edges) => [...edges, ...newEdges])

    console.log(`Pasted ${newNodes.length} nodes and ${newEdges.length} edges`)
  }, [setNodes, setEdges, getNodes, getEdges])

  /**
   * Delete selected nodes and edges
   */
  const deleteSelection = useCallback(() => {
    const nodes = getNodes()
    const edges = getEdges()

    const selectedNodes = nodes.filter((node) => node.selected)
    const selectedEdges = edges.filter((edge) => edge.selected)

    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      return
    }

    deleteElements({ nodes: selectedNodes, edges: selectedEdges })

    console.log(
      `Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges`
    )
  }, [getNodes, getEdges, deleteElements])

  /**
   * Select all nodes and edges
   */
  const selectAll = useCallback(() => {
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: true })))
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: true })))
    console.log('Selected all nodes and edges')
  }, [setNodes, setEdges])

  /**
   * Deselect all nodes and edges
   */
  const deselectAll = useCallback(() => {
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: false })))
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: false })))
    console.log('Deselected all')
  }, [setNodes, setEdges])

  /**
   * Handle keyboard events
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrl = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey

      // Ignore if typing in an input field
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Ctrl/Cmd + C - Copy
      if (isCtrl && event.key === 'c') {
        event.preventDefault()
        copySelection()
      }

      // Ctrl/Cmd + V - Paste
      if (isCtrl && event.key === 'v') {
        event.preventDefault()
        pasteSelection()
      }

      // Ctrl/Cmd + A - Select All
      if (isCtrl && event.key === 'a') {
        event.preventDefault()
        selectAll()
      }

      // Escape - Deselect All
      if (event.key === 'Escape') {
        event.preventDefault()
        deselectAll()
      }

      // Delete or Backspace - Delete Selection
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelection()
      }

      // Ctrl/Cmd + S - Save
      if (isCtrl && event.key === 's') {
        event.preventDefault()
        if (options.onSave) {
          options.onSave()
          console.log('Save triggered by keyboard shortcut')
        }
      }

      // Ctrl/Cmd + L - Load
      if (isCtrl && event.key === 'l') {
        event.preventDefault()
        if (options.onLoad) {
          options.onLoad()
          console.log('Load triggered by keyboard shortcut')
        }
      }

      // Ctrl/Cmd + E - Export
      if (isCtrl && event.key === 'e') {
        event.preventDefault()
        if (options.onExport) {
          options.onExport()
          console.log('Export triggered by keyboard shortcut')
        }
      }

      // Ctrl/Cmd + F - Fit View
      if (isCtrl && event.key === 'f') {
        event.preventDefault()
        fitView({ padding: 0.2, duration: 400 })
        console.log('Fit view triggered by keyboard shortcut')
      }

      // Ctrl/Cmd + Shift + A - Add Data Node (example)
      if (isCtrl && isShift && event.key === 'A') {
        event.preventDefault()
        const newNode: Node = {
          id: `data-${Date.now()}`,
          type: 'dataNode',
          position: { x: 100, y: 100 },
          data: { label: 'New Data Node', value: 0 },
        }
        setNodes((nodes) => [...nodes, newNode])
        console.log('Added new data node via keyboard shortcut')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    copySelection,
    pasteSelection,
    selectAll,
    deselectAll,
    deleteSelection,
    options,
    fitView,
    setNodes,
  ])

  return {
    copySelection,
    pasteSelection,
    deleteSelection,
    selectAll,
    deselectAll,
  }
}
