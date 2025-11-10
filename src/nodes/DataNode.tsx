import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import CustomNodeToolbar from '../components/CustomNodeToolbar'

export type DataNodeData = {
  label: string
  value?: number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  chartData?: number[]
  [key: string]: unknown
}

export type DataNodeType = Node<DataNodeData, 'dataNode'>

const DataNode = ({ id, data, selected }: NodeProps<DataNodeType>) => {
  const [expanded, setExpanded] = useState(false)

  const handleDelete = () => {
    console.log(`Delete node: ${id}`)
    // Will be implemented with proper node deletion
  }

  const handleDuplicate = () => {
    console.log(`Duplicate node: ${id}`)
    // Will be implemented with proper node duplication
  }

  const handleChangeColor = () => {
    console.log(`Change color for node: ${id}`)
    // Will be implemented with color picker
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  return (
    <>
      {selected && (
        <CustomNodeToolbar
          nodeId={id}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onChangeColor={handleChangeColor}
        />
      )}
      <div
        className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all ${
          selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        }`}
        style={{ minWidth: 200 }}
      >
        <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            {data.label}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-500 hover:text-blue-700"
            type="button"
          >
            {expanded ? '▼' : '▶'}
          </button>
        </div>

        {data.value !== undefined && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {data.value.toLocaleString()}
            </span>
            {data.unit && (
              <span className="text-sm text-gray-500">{data.unit}</span>
            )}
            {data.trend && (
              <span className={`text-lg font-bold ${getTrendColor(data.trend)}`}>
                {getTrendIcon(data.trend)}
              </span>
            )}
          </div>
        )}

        {expanded && data.chartData && (
          <div className="mt-2 flex items-end gap-1 h-16">
            {data.chartData.map((value, index) => {
              const maxValue = Math.max(...data.chartData!)
              const height = (value / maxValue) * 100
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-400 hover:bg-blue-600 transition-colors rounded-t"
                  style={{ height: `${height}%` }}
                  title={`Value: ${value}`}
                />
              )
            })}
          </div>
        )}
      </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500"
        />
      </div>
    </>
  )
}

export default memo(DataNode)
