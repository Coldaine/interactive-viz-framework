import { ReactFlow, Background, Controls, MiniMap, Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection, addEdge, ReactFlowProvider, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './styles/effects.css'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSaveRestore } from './hooks/useSaveRestore'
import { isValidConnection } from './utils/connectionValidation'
import DataNode from './nodes/DataNode'
import ActionNode from './nodes/ActionNode'
import MediaNode from './nodes/MediaNode'
import CodeNode from './nodes/CodeNode'
import DecisionNode from './nodes/DecisionNode'
import LoopNode from './nodes/LoopNode'
import IntegrationNode from './nodes/IntegrationNode'
import ParticleEdge from './edges/ParticleEdge'
import SmartEdge from './edges/SmartEdge'
import LabeledEdge from './edges/LabeledEdge'
import GlowEdge from './edges/GlowEdge'
import ParticleBackground from './components/ParticleBackground'
import FlowControls from './components/FlowControls'
import HelperLines from './components/HelperLines'
import ContextMenu from './components/ContextMenu'
import { useHelperLines } from './hooks/useHelperLines'
import { useContextMenu } from './hooks/useContextMenu'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 50 },
    data: {
      label: 'Revenue',
      value: 45678,
      unit: 'USD',
      trend: 'up',
      chartData: [120, 150, 180, 200, 250, 300, 350],
    },
    type: 'dataNode',
  },
  {
    id: '2',
    position: { x: 400, y: 50 },
    data: {
      label: 'Active Users',
      value: 1234,
      unit: 'users',
      trend: 'down',
      chartData: [80, 90, 85, 70, 60, 55, 50],
    },
    type: 'dataNode',
  },
  {
    id: '3',
    position: { x: 100, y: 250 },
    data: {
      label: 'User Actions',
      primaryAction: 'Submit',
      secondaryAction: 'Cancel',
      options: ['Option 1', 'Option 2', 'Option 3'],
      toggleLabel: 'Enable notifications',
    },
    type: 'actionNode',
  },
  {
    id: '4',
    position: { x: 400, y: 250 },
    data: {
      label: 'Product Image',
      mediaType: 'image',
      thumbnailUrl: 'https://via.placeholder.com/150',
      uploadState: 'uploaded',
    },
    type: 'mediaNode',
  },
  {
    id: '5',
    position: { x: 700, y: 50 },
    data: {
      label: 'API Handler',
      code: 'const hello = "world";\nconsole.log(hello);',
      language: 'javascript',
      theme: 'dark',
    },
    type: 'codeNode',
  },
  {
    id: '6',
    position: { x: 700, y: 250 },
    data: {
      label: 'Check Status',
      condition: 'user.age >= 18',
      truePath: 'Allow',
      falsePath: 'Deny',
    },
    type: 'decisionNode',
  },
  {
    id: '7',
    position: { x: 100, y: 500 },
    data: {
      label: 'Process Items',
      loopType: 'for',
      maxIterations: 10,
      currentIteration: 0,
    },
    type: 'loopNode',
  },
  {
    id: '8',
    position: { x: 400, y: 500 },
    data: {
      label: 'API Request',
      endpoint: '/api/users',
      method: 'GET',
      status: 'idle',
      serviceType: 'REST',
      responsePreview: '{"users": [{"id": 1, "name": "John"}]}',
    },
    type: 'integrationNode',
  },
  // Parent node example (group container)
  {
    id: 'parent-1',
    position: { x: 1000, y: 50 },
    data: {
      label: 'User Workflow',
    },
    type: 'dataNode',
    style: {
      width: 400,
      height: 300,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '2px dashed rgba(59, 130, 246, 0.5)',
    },
  },
  // Child nodes constrained within parent
  {
    id: 'child-1',
    position: { x: 20, y: 60 },
    data: {
      label: 'Validate Input',
    },
    type: 'actionNode',
    parentId: 'parent-1',
    extent: 'parent' as const,
    expandParent: true,
  },
  {
    id: 'child-2',
    position: { x: 220, y: 60 },
    data: {
      label: 'Process Data',
    },
    type: 'codeNode',
    parentId: 'parent-1',
    extent: 'parent' as const,
    expandParent: true,
  },
  {
    id: 'child-3',
    position: { x: 120, y: 180 },
    data: {
      label: 'Store Result',
    },
    type: 'integrationNode',
    parentId: 'parent-1',
    extent: 'parent' as const,
    expandParent: true,
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'particle',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'glow',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'labeled',
    data: { label: 'Process' },
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smart',
  },
  // Edges between child nodes (inside parent)
  {
    id: 'e-child-1-2',
    source: 'child-1',
    target: 'child-2',
    type: 'labeled',
    data: { label: 'Valid' },
  },
  {
    id: 'e-child-2-3',
    source: 'child-2',
    target: 'child-3',
    type: 'glow',
  },
]

function FlowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const { screenToFlowPosition } = useReactFlow()

  // Helper lines for node alignment
  const { helperLines, onNodesChangeWithSnap } = useHelperLines(nodes, true, 10)

  // Context menu
  const { menu, showNodeContextMenu, showEdgeContextMenu, showCanvasContextMenu, hideMenu } = useContextMenu()

  // Save/Restore functionality with auto-save
  const { saveFlow, loadFlow, exportFlow, importFlow } = useSaveRestore(
    nodes,
    edges,
    setNodes,
    setEdges,
    true, // auto-save enabled
    3000 // auto-save delay: 3 seconds
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: saveFlow,
    onLoad: loadFlow,
    onExport: exportFlow,
  })

  // Load saved flow on mount
  useEffect(() => {
    const loaded = loadFlow()
    if (loaded) {
      console.log('Loaded saved flow from localStorage')
    }
  }, [loadFlow])

  const nodeTypes = useMemo(
    () => ({
      dataNode: DataNode,
      actionNode: ActionNode,
      mediaNode: MediaNode,
      codeNode: CodeNode,
      decisionNode: DecisionNode,
      loopNode: LoopNode,
      integrationNode: IntegrationNode,
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      particle: ParticleEdge,
      smart: SmartEdge,
      labeled: LabeledEdge,
      glow: GlowEdge,
    }),
    []
  )

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      onNodesChangeWithSnap(changes, (updatedChanges) => {
        setNodes((nds) => applyNodeChanges(updatedChanges, nds))
      })
    },
    [onNodesChangeWithSnap, setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  )

  // Handle file import
  const handleFileImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        importFlow(file).then((success) => {
          if (success) {
            console.log('Flow imported successfully')
          } else {
            alert('Failed to import flow. Please check the file format.')
          }
        })
      }
    },
    [importFlow]
  )

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ParticleBackground />
      <HelperLines lines={helperLines} />

      {/* Save/Restore Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={saveFlow}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
          title="Save flow to localStorage (Ctrl+S)"
        >
          💾 Save
        </button>
        <button
          onClick={loadFlow}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          title="Load flow from localStorage (Ctrl+L)"
        >
          📂 Load
        </button>
        <button
          onClick={exportFlow}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm font-medium"
          title="Export flow as JSON file (Ctrl+E)"
        >
          ⬇️ Export
        </button>
        <label className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium cursor-pointer text-center">
          ⬆️ Import
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </label>
      </div>

      {/* Context Menu */}
      {menu.visible && (
        <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={hideMenu} />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={(event, node) => showNodeContextMenu(event as React.MouseEvent, node)}
        onEdgeContextMenu={(event, edge) => {
          if ('type' in edge) {
            showEdgeContextMenu(event as React.MouseEvent, edge as Edge)
          }
        }}
        onPaneContextMenu={(event) => showCanvasContextMenu(event as React.MouseEvent, screenToFlowPosition)}
        isValidConnection={(connection) =>
          isValidConnection(connection, edges, nodes)
        }
        edgesReconnectable={true}
        reconnectRadius={20}
        autoPanOnConnect={true}
        autoPanOnNodeDrag={true}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        fitView
      >
        <Background />
        <Controls />
        <FlowControls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'dataNode':
                return '#3b82f6'
              case 'actionNode':
                return '#10b981'
              case 'mediaNode':
                return '#f59e0b'
              case 'codeNode':
                return '#8b5cf6'
              case 'decisionNode':
                return '#ef4444'
              case 'loopNode':
                return '#06b6d4'
              case 'integrationNode':
                return '#ec4899'
              default:
                return '#6b7280'
            }
          }}
        />
      </ReactFlow>
    </div>
  )
}

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}

export default App
