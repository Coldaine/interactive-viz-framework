import { useState, useRef, useEffect } from 'react'
import { useReactFlow } from '@xyflow/react'
import { exportToPNG, exportToSVG, exportToJSON, copyToClipboard, copySelectedToClipboard, exportSelectedNodes } from '../utils/export'

type ExportFormat = 'png' | 'svg' | 'json' | 'clipboard'

export interface ExportMenuProps {
  className?: string
}

const ExportMenu = ({ className = '' }: ExportMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [exportSelected, setExportSelected] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
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

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      const nodes = reactFlowInstance.getNodes()
      const edges = reactFlowInstance.getEdges()
      const viewport = reactFlowInstance.getViewport()

      // Check if we should export only selected nodes
      const selectedNodes = nodes.filter((node) => node.selected)
      const shouldExportSelected = exportSelected && selectedNodes.length > 0

      if (shouldExportSelected && selectedNodes.length === 0) {
        showNotification('error', 'No nodes selected')
        setIsExporting(false)
        setExportFormat(null)
        return
      }

      switch (format) {
        case 'png':
          if (shouldExportSelected) {
            await exportSelectedNodes(reactFlowInstance, 'png', {
              filename: `flow-selected-${Date.now()}.png`,
            })
          } else {
            await exportToPNG(reactFlowInstance, {
              filename: `flow-${Date.now()}.png`,
            })
          }
          showNotification('success', 'Exported as PNG successfully!')
          break

        case 'svg':
          if (shouldExportSelected) {
            await exportSelectedNodes(reactFlowInstance, 'svg', {
              filename: `flow-selected-${Date.now()}.svg`,
            })
          } else {
            await exportToSVG(reactFlowInstance, {
              filename: `flow-${Date.now()}.svg`,
            })
          }
          showNotification('success', 'Exported as SVG successfully!')
          break

        case 'json':
          if (shouldExportSelected) {
            exportSelectedNodes(reactFlowInstance, 'json', {
              filename: `flow-selected-${Date.now()}.json`,
            })
          } else {
            exportToJSON(nodes, edges, viewport, `flow-${Date.now()}.json`)
          }
          showNotification('success', 'Exported as JSON successfully!')
          break

        case 'clipboard':
          if (shouldExportSelected) {
            await copySelectedToClipboard(reactFlowInstance)
            showNotification('success', `Copied ${selectedNodes.length} selected nodes to clipboard!`)
          } else {
            await copyToClipboard(nodes, edges, viewport)
            showNotification('success', 'Copied flow to clipboard!')
          }
          break

        default:
          throw new Error('Invalid export format')
      }

      setIsOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      showNotification('error', error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  const exportOptions = [
    {
      format: 'png' as ExportFormat,
      label: 'Export as PNG',
      icon: '🖼️',
      description: 'Export flow as PNG image',
    },
    {
      format: 'svg' as ExportFormat,
      label: 'Export as SVG',
      icon: '🎨',
      description: 'Export flow as SVG vector',
    },
    {
      format: 'json' as ExportFormat,
      label: 'Export as JSON',
      icon: '📄',
      description: 'Export flow data as JSON',
    },
    {
      format: 'clipboard' as ExportFormat,
      label: 'Copy to Clipboard',
      icon: '📋',
      description: 'Copy flow data to clipboard',
    },
  ]

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Export flow"
      >
        {isExporting ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Exporting...
          </>
        ) : (
          <>
            ⬇️ Export
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Export Options */}
          <div className="py-1">
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                disabled={isExporting}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-start gap-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>
                {isExporting && exportFormat === option.format && (
                  <span className="inline-block animate-spin">⏳</span>
                )}
              </button>
            ))}
          </div>

          {/* Export Selected Toggle */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSelected}
                onChange={(e) => setExportSelected(e.target.checked)}
                className="w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Export selected nodes only</span>
            </label>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`absolute top-full left-0 mt-2 w-72 px-4 py-3 rounded-lg shadow-lg z-50 ${
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

export default ExportMenu
