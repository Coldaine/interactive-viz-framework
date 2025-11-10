import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'

export type ActionNodeData = {
  label: string
  primaryAction?: string
  secondaryAction?: string
  options?: string[]
  toggleLabel?: string
  toggleDefault?: boolean
  [key: string]: unknown
}

export type ActionNodeType = Node<ActionNodeData, 'actionNode'>

const ActionNode = ({ data, selected }: NodeProps<ActionNodeType>) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toggleState, setToggleState] = useState(data.toggleDefault ?? false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handlePrimaryAction = () => {
    setLoading(true)
    setStatus('idle')
    setTimeout(() => {
      setLoading(false)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    }, 1000)
  }

  const handleSecondaryAction = () => {
    setStatus('idle')
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setDropdownOpen(false)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-500'
      case 'error':
        return 'border-red-500'
      default:
        return selected ? 'border-blue-500' : 'border-gray-200'
    }
  }

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all ${getStatusColor()} ${
        selected && status === 'idle' ? 'ring-2 ring-blue-200' : ''
      }`}
      style={{ minWidth: 200 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />

      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">{data.label}</div>

        {/* Primary Action Button */}
        {data.primaryAction && (
          <button
            onClick={handlePrimaryAction}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            type="button"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span>
                Loading...
              </span>
            ) : (
              data.primaryAction
            )}
          </button>
        )}

        {/* Secondary Action Button */}
        {data.secondaryAction && (
          <button
            onClick={handleSecondaryAction}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            type="button"
          >
            {data.secondaryAction}
          </button>
        )}

        {/* Dropdown Menu */}
        {data.options && data.options.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-between"
              type="button"
            >
              <span>{selectedOption || 'Select option'}</span>
              <span>{dropdownOpen ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg">
                {data.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 transition-colors first:rounded-t-md last:rounded-b-md"
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Switch */}
        {data.toggleLabel && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{data.toggleLabel}</span>
            <button
              onClick={() => setToggleState(!toggleState)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                toggleState ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              type="button"
              role="switch"
              aria-checked={toggleState}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  toggleState ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}

        {/* Status Indicator */}
        {status !== 'idle' && (
          <div
            className={`text-xs font-medium px-2 py-1 rounded ${
              status === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {status === 'success' ? '✓ Success' : '✗ Error'}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  )
}

export default memo(ActionNode)
