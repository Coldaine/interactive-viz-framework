import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'

export type IntegrationNodeData = {
  label: string
  endpoint?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  status?: 'idle' | 'pending' | 'success' | 'error'
  responsePreview?: string
  serviceType?: 'REST' | 'GraphQL' | 'WebSocket'
  [key: string]: unknown
}

export type IntegrationNodeType = Node<IntegrationNodeData, 'integrationNode'>

const IntegrationNode = ({ data, selected }: NodeProps<IntegrationNodeType>) => {
  const [endpoint, setEndpoint] = useState(data.endpoint || '')
  const [selectedMethod, setSelectedMethod] = useState(data.method || 'GET')
  const [status, setStatus] = useState<IntegrationNodeData['status']>(data.status || 'idle')
  const [showResponse, setShowResponse] = useState(false)
  const [serviceType, setServiceType] = useState(data.serviceType || 'REST')

  const handleRequest = () => {
    setStatus('pending')
    setTimeout(() => {
      const success = Math.random() > 0.3
      setStatus(success ? 'success' : 'error')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1500)
  }

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-yellow-400'
      case 'success':
        return 'border-green-500'
      case 'error':
        return 'border-red-500'
      default:
        return selected ? 'border-blue-500' : 'border-gray-200'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-600 bg-green-100'
      case 'POST':
        return 'text-blue-600 bg-blue-100'
      case 'PUT':
        return 'text-yellow-600 bg-yellow-100'
      case 'DELETE':
        return 'text-red-600 bg-red-100'
      case 'PATCH':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getServiceIcon = () => {
    switch (serviceType) {
      case 'REST':
        return '🔌'
      case 'GraphQL':
        return '◈'
      case 'WebSocket':
        return '🔄'
      default:
        return '🔌'
    }
  }

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all ${getStatusColor()} ${
        selected && status === 'idle' ? 'ring-2 ring-blue-200' : ''
      }`}
      style={{ minWidth: 250 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{data.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getServiceIcon()}</span>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as IntegrationNodeData['serviceType'])}
              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            >
              <option value="REST">REST</option>
              <option value="GraphQL">GraphQL</option>
              <option value="WebSocket">WS</option>
            </select>
          </div>
        </div>

        {/* Method Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as IntegrationNodeData['method'])}
            className={`text-xs font-bold px-2 py-1 rounded ${getMethodColor(selectedMethod)}`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        {/* Endpoint Input */}
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/api/endpoint"
          className="text-xs border border-gray-300 rounded px-2 py-1.5 font-mono focus:outline-none focus:border-blue-400"
        />

        {/* Request Button */}
        <button
          onClick={handleRequest}
          disabled={status === 'pending'}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            status === 'pending'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          type="button"
        >
          {status === 'pending' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Sending...
            </span>
          ) : (
            'Send Request'
          )}
        </button>

        {/* Status Indicator */}
        {status !== 'idle' && (
          <div
            className={`text-xs font-medium px-2 py-1.5 rounded flex items-center gap-2 ${
              status === 'success'
                ? 'bg-green-100 text-green-700'
                : status === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {status === 'success' && '✓ 200 OK'}
            {status === 'error' && '✗ 500 Error'}
            {status === 'pending' && '⟳ Pending'}
          </div>
        )}

        {/* Response Preview */}
        {data.responsePreview && status === 'success' && (
          <div className="border border-gray-300 rounded">
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="w-full px-2 py-1 text-xs text-left text-gray-600 hover:bg-gray-50 flex items-center justify-between"
              type="button"
            >
              <span>Response</span>
              <span>{showResponse ? '▼' : '▶'}</span>
            </button>
            {showResponse && (
              <pre className="p-2 text-xs bg-gray-50 border-t border-gray-300 overflow-x-auto">
                {data.responsePreview}
              </pre>
            )}
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

export default memo(IntegrationNode)
