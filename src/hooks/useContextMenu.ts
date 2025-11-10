import { useState, useCallback } from 'react'
import { Node, Edge, useReactFlow } from '@xyflow/react'
import { ContextMenuItem } from '../components/ContextMenu'

interface ContextMenuState {
  x: number
  y: number
  items: ContextMenuItem[]
  visible: boolean
}

/**
 * Custom hook for managing context menus on nodes and edges
 */
export const useContextMenu = () => {
  const [menu, setMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    items: [],
    visible: false,
  })

  const { setNodes, setEdges, deleteElements } = useReactFlow()

  /**
   * Show context menu for a node
   */
  const showNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault()

      const items: ContextMenuItem[] = [
        {
          label: 'Duplicate',
          icon: '📋',
          onClick: () => {
            const newNode: Node = {
              ...node,
              id: `${node.id}-copy-${Date.now()}`,
              position: {
                x: node.position.x + 20,
                y: node.position.y + 20,
              },
              selected: false,
            }
            setNodes((nodes) => [...nodes, newNode])
          },
        },
        {
          label: 'Edit Label',
          icon: '✏️',
          onClick: () => {
            const newLabel = prompt('Enter new label:', (node.data.label as string) || '')
            if (newLabel) {
              setNodes((nodes) =>
                nodes.map((n) =>
                  n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
                )
              )
            }
          },
        },
        { divider: true } as ContextMenuItem,
        {
          label: 'Bring to Front',
          icon: '⬆️',
          onClick: () => {
            setNodes((nodes) =>
              nodes.map((n) => (n.id === node.id ? { ...n, zIndex: 1000 } : n))
            )
          },
        },
        {
          label: 'Send to Back',
          icon: '⬇️',
          onClick: () => {
            setNodes((nodes) =>
              nodes.map((n) => (n.id === node.id ? { ...n, zIndex: 1 } : n))
            )
          },
        },
        { divider: true } as ContextMenuItem,
        {
          label: 'Delete',
          icon: '🗑️',
          onClick: () => {
            deleteElements({ nodes: [node] })
          },
        },
      ]

      setMenu({
        x: event.clientX,
        y: event.clientY,
        items,
        visible: true,
      })
    },
    [setNodes, deleteElements]
  )

  /**
   * Show context menu for an edge
   */
  const showEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge | { id: string; source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }) => {
      event.preventDefault()

      const items: ContextMenuItem[] = [
        {
          label: 'Change Type',
          icon: '🔄',
          onClick: () => {
            const types = ['default', 'particle', 'smart', 'labeled', 'glow']
            const currentIndex = types.indexOf(edge.type || 'default')
            const nextType = types[(currentIndex + 1) % types.length]

            setEdges((edges) =>
              edges.map((e) => (e.id === edge.id ? { ...e, type: nextType } : e))
            )
          },
        },
        {
          label: 'Toggle Animated',
          icon: '⚡',
          onClick: () => {
            setEdges((edges) =>
              edges.map((e) =>
                e.id === edge.id ? { ...e, animated: !e.animated } : e
              )
            )
          },
        },
        { divider: true } as ContextMenuItem,
        {
          label: 'Delete',
          icon: '🗑️',
          onClick: () => {
            deleteElements({ edges: [edge] })
          },
        },
      ]

      setMenu({
        x: event.clientX,
        y: event.clientY,
        items,
        visible: true,
      })
    },
    [setEdges, deleteElements]
  )

  /**
   * Show context menu for canvas (background)
   */
  const showCanvasContextMenu = useCallback(
    (event: React.MouseEvent, screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number }) => {
      event.preventDefault()

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })

      const items: ContextMenuItem[] = [
        {
          label: 'Add Data Node',
          icon: '📊',
          onClick: () => {
            const newNode: Node = {
              id: `data-${Date.now()}`,
              type: 'dataNode',
              position: flowPosition,
              data: { label: 'New Data Node', value: 0 },
            }
            setNodes((nodes) => [...nodes, newNode])
          },
        },
        {
          label: 'Add Action Node',
          icon: '⚡',
          onClick: () => {
            const newNode: Node = {
              id: `action-${Date.now()}`,
              type: 'actionNode',
              position: flowPosition,
              data: { label: 'New Action Node', primaryAction: 'Action' },
            }
            setNodes((nodes) => [...nodes, newNode])
          },
        },
        {
          label: 'Add Code Node',
          icon: '💻',
          onClick: () => {
            const newNode: Node = {
              id: `code-${Date.now()}`,
              type: 'codeNode',
              position: flowPosition,
              data: { label: 'New Code Node', code: '// Your code here', language: 'javascript' },
            }
            setNodes((nodes) => [...nodes, newNode])
          },
        },
      ]

      setMenu({
        x: event.clientX,
        y: event.clientY,
        items,
        visible: true,
      })
    },
    [setNodes]
  )

  /**
   * Hide context menu
   */
  const hideMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, visible: false }))
  }, [])

  return {
    menu,
    showNodeContextMenu,
    showEdgeContextMenu,
    showCanvasContextMenu,
    hideMenu,
  }
}
