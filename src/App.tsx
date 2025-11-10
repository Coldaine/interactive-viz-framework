import { ReactFlow, Background, Controls, MiniMap, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useState, useCallback, useMemo } from 'react'
import DataNode from './nodes/DataNode'

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
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
    position: { x: 400, y: 100 },
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
    position: { x: 250, y: 300 },
    data: { label: 'Default Node' },
    type: 'default',
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
]

function App() {
  const [nodes] = useState<Node[]>(initialNodes)
  const [edges] = useState<Edge[]>(initialEdges)

  const nodeTypes = useMemo(
    () => ({
      dataNode: DataNode,
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
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export default App
