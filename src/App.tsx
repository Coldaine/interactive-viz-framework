import { ReactFlow, Background, Controls, MiniMap, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './styles/effects.css'
import { useState, useCallback, useMemo } from 'react'
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
  const [nodes] = useState<Node[]>(initialNodes)
  const [edges] = useState<Edge[]>(initialEdges)

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

  const onNodesChange = useCallback(() => {
    // Will be implemented with state management
  }, [])

  const onEdgesChange = useCallback(() => {
    // Will be implemented with state management
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ParticleBackground />
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
