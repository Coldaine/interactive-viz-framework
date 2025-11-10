import { memo } from 'react'

interface UndoRedoControlsProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

/**
 * UndoRedoControls component
 * Displays undo/redo buttons with keyboard shortcuts in tooltips
 *
 * Features:
 * - Visual feedback for enabled/disabled states
 * - Tooltips with keyboard shortcuts
 * - Platform-aware shortcuts (Ctrl on Windows, Cmd on Mac)
 */
const UndoRedoControls = memo(({ onUndo, onRedo, canUndo, canRedo }: UndoRedoControlsProps) => {
  // Detect platform for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modKey = isMac ? '⌘' : 'Ctrl'

  return (
    <div className="flex gap-2">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          px-3 py-2 rounded font-medium text-sm transition-all duration-200
          ${
            canUndo
              ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }
        `}
        title={`Undo (${modKey}+Z)`}
        aria-label="Undo last action"
      >
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span>Undo</span>
        </span>
      </button>

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`
          px-3 py-2 rounded font-medium text-sm transition-all duration-200
          ${
            canRedo
              ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }
        `}
        title={`Redo (${modKey}+Shift+Z or ${modKey}+Y)`}
        aria-label="Redo last undone action"
      >
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
          <span>Redo</span>
        </span>
      </button>
    </div>
  )
})

UndoRedoControls.displayName = 'UndoRedoControls'

export default UndoRedoControls
