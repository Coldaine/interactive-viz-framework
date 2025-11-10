import { NodeToolbar, Position } from '@xyflow/react'

interface CustomNodeToolbarProps {
  nodeId: string
  onDelete?: () => void
  onDuplicate?: () => void
  onChangeColor?: () => void
  onLock?: () => void
  position?: Position
}

/**
 * Custom floating toolbar for nodes
 * Appears above selected nodes and provides quick actions
 * Doesn't scale with zoom for better readability
 */
const CustomNodeToolbar = ({
  nodeId,
  onDelete,
  onDuplicate,
  onChangeColor,
  onLock,
  position = Position.Top,
}: CustomNodeToolbarProps) => {
  return (
    <NodeToolbar
      nodeId={nodeId}
      position={position}
      offset={10}
      className="nodrag"
    >
      <div className="flex gap-1 bg-white rounded-lg shadow-lg p-1 border border-gray-200">
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate node"
          >
            📋 Copy
          </button>
        )}
        {onChangeColor && (
          <button
            onClick={onChangeColor}
            className="px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Change color"
          >
            🎨 Color
          </button>
        )}
        {onLock && (
          <button
            onClick={onLock}
            className="px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Lock/unlock node"
          >
            🔒 Lock
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete node"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </NodeToolbar>
  )
}

export default CustomNodeToolbar
