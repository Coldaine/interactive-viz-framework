import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'

export type LoopNodeData = {
  label: string
  loopType?: 'for' | 'while' | 'forEach'
  maxIterations?: number
  currentIteration?: number
  [key: string]: unknown
}

export type LoopNodeType = Node<LoopNodeData, 'loopNode'>

const LoopNode = ({ data, selected }: NodeProps<LoopNodeType>) => {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [iteration, setIteration] = useState(data.currentIteration || 0)
  const [selectedLoopType, setSelectedLoopType] = useState(data.loopType || 'for')
  const maxIter = data.maxIterations || 10

  const handleStart = () => {
    if (iteration >= maxIter) {
      setIteration(0)
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setIteration(0)
  }

  const progress = maxIter > 0 ? (iteration / maxIter) * 100 : 0

  return (
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

      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-700">{data.label}</div>

        {/* Loop Type Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Type:</span>
          <select
            value={selectedLoopType}
            onChange={(e) => setSelectedLoopType(e.target.value as LoopNodeData['loopType'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white flex-1"
          >
            <option value="for">for</option>
            <option value="while">while</option>
            <option value="forEach">forEach</option>
          </select>
        </div>

        {/* Iteration Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Iterations:</span>
          <span className="text-sm font-bold text-gray-800">
            {iteration} / {maxIter}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isRunning && !isPaused ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isRunning || iteration >= maxIter ? (
            <button
              onClick={handleStart}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
              type="button"
            >
              {iteration >= maxIter ? '↻ Restart' : '▶ Start'}
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                type="button"
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button
                onClick={handleStop}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                type="button"
              >
                ⏹ Stop
              </button>
            </>
          )}
        </div>

        {/* Status Indicator */}
        {isRunning && (
          <div className="flex items-center gap-2 text-xs">
            {isPaused ? (
              <>
                <span className="text-yellow-500">⏸</span>
                <span className="text-yellow-600">Paused</span>
              </>
            ) : (
              <>
                <span className="animate-pulse text-green-500">●</span>
                <span className="text-green-600">Running</span>
              </>
            )}
          </div>
        )}

        {iteration >= maxIter && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-500">✓</span>
            <span className="text-blue-600">Completed</span>
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

export default memo(LoopNode)
