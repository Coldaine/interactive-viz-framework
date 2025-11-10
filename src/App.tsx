import { ReactFlow, Background, Controls, MiniMap, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useState, useCallback } from 'react'

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Welcome Node' },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'Second Node' },
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
