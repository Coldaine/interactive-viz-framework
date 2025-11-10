import { useFlowControl } from '../hooks/useFlowControl'

/**
 * UI controls for React Flow viewport manipulation
 */
const FlowControls = () => {
  const { fitView, zoomIn, zoomOut, getViewport, getNodes, getEdges } = useFlowControl()

  const handleFitView = () => {
    fitView(0.2)
  }

  const handleLogViewport = () => {
    const viewport = getViewport()
    console.log('Current viewport:', viewport)
  }

  const handleLogStats = () => {
    const nodes = getNodes()
    const edges = getEdges()
    console.log(`Flow stats: ${nodes.length} nodes, ${edges.length} edges`)
  }

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
      <button
        onClick={handleFitView}
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
        title="Fit view to all nodes"
      >
        Fit View
      </button>

      <div className="flex gap-1">
        <button
          onClick={zoomIn}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
          title="Zoom out"
        >
          −
        </button>
      </div>

      <div className="border-t border-gray-200 my-1" />

      <button
        onClick={handleLogViewport}
        className="px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors text-xs"
        title="Log viewport info to console"
      >
        Log Viewport
      </button>

      <button
        onClick={handleLogStats}
        className="px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors text-xs"
        title="Log flow statistics to console"
      >
        Log Stats
      </button>
    </div>
  )
}

export default FlowControls
