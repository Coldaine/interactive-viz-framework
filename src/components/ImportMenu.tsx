import { useState, useRef, useCallback, useEffect } from 'react'
import { useReactFlow } from '@xyflow/react'
import { validateFlowJSON, FlowState, ValidationError } from '../utils/flowStorage'

type ImportMode = 'replace' | 'merge'

export interface ImportMenuProps {
  className?: string
  onImport?: (flowState: FlowState) => void
}

const ImportMenu = ({ className = '', onImport }: ImportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMode, setImportMode] = useState<ImportMode>('replace')
  const [previewData, setPreviewData] = useState<FlowState | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setPreviewData(null)
        setValidationErrors([])
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
  }

  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)

        // Validate the flow data
        const validation = validateFlowJSON(data)

        if (validation.valid) {
          setPreviewData(data as FlowState)
          setValidationErrors([])
        } else {
          setValidationErrors(validation.errors)
          setPreviewData(null)
          showNotification('error', `Invalid flow data: ${validation.errors.length} errors found`)
        }
      } catch (error) {
        setValidationErrors([
          {
            field: 'file',
            message: error instanceof Error ? error.message : 'Failed to parse JSON file',
          },
        ])
        setPreviewData(null)
        showNotification('error', 'Failed to parse JSON file')
      }
    }

    reader.onerror = () => {
      setValidationErrors([
        {
          field: 'file',
          message: 'Failed to read file',
        },
      ])
      setPreviewData(null)
      showNotification('error', 'Failed to read file')
    }

    reader.readAsText(file)
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file && file.type === 'application/json') {
      handleFileRead(file)
    } else {
      showNotification('error', 'Please drop a valid JSON file')
    }
  }

  const handleImport = async () => {
    if (!previewData) return

    setIsImporting(true)

    try {
      if (importMode === 'replace') {
        // Replace entire flow
        reactFlowInstance.setNodes(previewData.nodes)
        reactFlowInstance.setEdges(previewData.edges)
        reactFlowInstance.setViewport(previewData.viewport)
        showNotification('success', `Imported ${previewData.nodes.length} nodes and ${previewData.edges.length} edges`)
      } else {
        // Merge with existing flow
        const currentNodes = reactFlowInstance.getNodes()
        const currentEdges = reactFlowInstance.getEdges()

        // Offset imported nodes to avoid overlap
        const offsetX = 50
        const offsetY = 50
        const offsetNodes = previewData.nodes.map((node) => ({
          ...node,
          position: {
            x: node.position.x + offsetX,
            y: node.position.y + offsetY,
          },
        }))

        reactFlowInstance.setNodes([...currentNodes, ...offsetNodes])
        reactFlowInstance.setEdges([...currentEdges, ...previewData.edges])
        showNotification('success', `Merged ${previewData.nodes.length} nodes and ${previewData.edges.length} edges`)
      }

      // Call optional callback
      if (onImport) {
        onImport(previewData)
      }

      // Reset state
      setIsOpen(false)
      setPreviewData(null)
      setValidationErrors([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Import failed:', error)
      showNotification('error', error instanceof Error ? error.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancel = () => {
    setPreviewData(null)
    setValidationErrors([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Import Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isImporting}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Import flow from JSON"
      >
        {isImporting ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Importing...
          </>
        ) : (
          <>
            ⬆️ Import
          </>
        )}
      </button>

      {/* Import Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`p-6 border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Drop JSON file here
              </p>
              <p className="text-xs text-gray-500 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border-t border-red-200">
              <div className="text-sm font-medium text-red-800 mb-2">
                Validation Errors ({validationErrors.length})
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {validationErrors.slice(0, 5).map((error, index) => (
                  <div key={index} className="text-xs text-red-700">
                    <span className="font-medium">{error.field}:</span> {error.message}
                  </div>
                ))}
                {validationErrors.length > 5 && (
                  <div className="text-xs text-red-600 italic">
                    +{validationErrors.length - 5} more errors...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          {previewData && (
            <div className="p-4 bg-blue-50 border-t border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">Preview</div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Nodes: {previewData.nodes.length}</div>
                <div>Edges: {previewData.edges.length}</div>
                <div>Version: {previewData.version || 'N/A'}</div>
                {previewData.timestamp && (
                  <div>
                    Date: {new Date(previewData.timestamp).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Import Mode Selection */}
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="w-4 h-4 text-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Replace current flow</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="w-4 h-4 text-orange-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Merge with current flow</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isImporting}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`absolute top-full left-0 mt-2 w-96 px-4 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{notification.type === 'success' ? '✅' : '❌'}</span>
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImportMenu
