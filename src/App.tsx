import { ReactFlow, Background, Controls, MiniMap, Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './styles/effects.css'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useSaveRestore } from './hooks/useSaveRestore'
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

const initialNodes: Node[] = [
  // DataNode examples
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
  // ActionNode example
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
  // MediaNode example
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
  // CodeNode example
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
  // DecisionNode example
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
  // LoopNode example
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
  // IntegrationNode example
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
]

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // Save/Restore functionality with auto-save
  const { saveFlow, loadFlow, exportFlow, importFlow } = useSaveRestore(
    nodes,
    edges,
    setNodes,
    setEdges,
    true, // auto-save enabled
    3000 // auto-save delay: 3 seconds
  )

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
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
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

      {/* Save/Restore Controls */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
        <button
          onClick={saveFlow}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
          title="Save flow to localStorage"
        >
          💾 Save
        </button>
        <button
          onClick={loadFlow}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          title="Load flow from localStorage"
        >
          📂 Load
        </button>
        <button
          onClick={exportFlow}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm font-medium"
          title="Export flow as JSON file"
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

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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

export default App
