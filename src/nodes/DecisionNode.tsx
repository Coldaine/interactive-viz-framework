import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'

export type DecisionNodeData = {
  label: string
  condition?: string
  truePath?: string
  falsePath?: string
  [key: string]: unknown
}

export type DecisionNodeType = Node<DecisionNodeData, 'decisionNode'>

const DecisionNode = ({ data, selected }: NodeProps<DecisionNodeType>) => {
  const [editing, setEditing] = useState(false)
  const [condition, setCondition] = useState(data.condition || 'condition')

  const handleSave = () => {
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setCondition(data.condition || 'condition')
      setEditing(false)
    }
  }

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all relative ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      style={{
        minWidth: 200,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
        style={{ top: '15px' }}
      />

      <div className="flex flex-col gap-2 items-center">
        <div className="text-sm font-semibold text-gray-700 text-center">{data.label}</div>

        {/* Condition Display/Edit */}
        {editing ? (
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-sm text-center border-b-2 border-blue-400 bg-transparent focus:outline-none px-2 py-1"
            autoFocus
          />
        ) : (
          <div
            className="text-sm text-gray-600 text-center cursor-pointer hover:text-blue-500 px-2 py-1"
            onClick={() => setEditing(true)}
            title="Click to edit condition"
          >
            {condition}
          </div>
        )}

        {/* Path Labels */}
        <div className="flex items-center justify-between w-full px-2 mt-2">
          <span className="text-xs text-green-600 font-medium">
            {data.truePath || 'True'}
          </span>
          <span className="text-xs text-red-600 font-medium">
            {data.falsePath || 'False'}
          </span>
        </div>
      </div>

      {/* True Path Handle (Left) */}
      <Handle
        type="source"
        position={Position.Left}
        id="true"
        className="w-3 h-3 !bg-green-500"
        style={{ top: '50%' }}
      />

      {/* False Path Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 !bg-red-500"
        style={{ top: '50%' }}
      />
    </div>
  )
}

export default memo(DecisionNode)
