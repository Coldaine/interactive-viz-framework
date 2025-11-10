import { useCallback, useEffect } from 'react'

export interface ContextMenuItem {
  label: string
  onClick: () => void
  icon?: string
  disabled?: boolean
  divider?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

/**
 * Context menu component for right-click actions
 * Displays a menu at the specified position with custom actions
 */
const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClick = () => onClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleItemClick = useCallback(
    (item: ContextMenuItem) => {
      if (!item.disabled) {
        item.onClick()
        onClose()
      }
    },
    [onClose]
  )

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-1 z-50 min-w-[180px]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div key={`divider-${index}`} className="border-t border-gray-200 my-1" />
          )
        }

        return (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={`
              w-full px-4 py-2 text-left text-sm
              flex items-center gap-2
              ${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
              }
              transition-colors
            `}
          >
            {item.icon && <span className="text-base">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ContextMenu
