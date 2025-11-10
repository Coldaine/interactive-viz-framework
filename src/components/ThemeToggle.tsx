import { memo } from 'react'
import { useTheme, ThemeMode } from '../hooks/useTheme'

interface ThemeToggleProps {
  /** Optional className for styling */
  className?: string
}

/**
 * Theme toggle button that cycles between light, dark, and system modes
 *
 * Features:
 * - Three-state toggle: Light → Dark → System
 * - Visual indicators for each mode
 * - Accessible with ARIA labels
 * - Displays current theme with icons
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  const getIcon = (mode: ThemeMode, resolved: string) => {
    if (mode === 'system') {
      return '🖥️'
    }
    return resolved === 'dark' ? '🌙' : '☀️'
  }

  const getLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return 'System mode'
    }
  }

  const getNextLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      case 'system':
        return 'Switch to light mode'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-3 py-2
        bg-white dark:bg-slate-800
        border-2 border-gray-200 dark:border-slate-600
        rounded-lg shadow-md
        hover:shadow-lg hover:scale-105
        active:scale-95
        transition-all duration-200
        text-sm font-medium
        text-gray-700 dark:text-slate-200
        ${className}
      `}
      title={getNextLabel(theme)}
      aria-label={getNextLabel(theme)}
      type="button"
    >
      <span className="text-xl" role="img" aria-hidden="true">
        {getIcon(theme, resolvedTheme)}
      </span>
      <span className="hidden sm:inline">{getLabel(theme)}</span>
      {theme === 'system' && (
        <span className="text-xs text-gray-500 dark:text-slate-400 hidden md:inline">
          ({resolvedTheme})
        </span>
      )}
    </button>
  )
}

export default memo(ThemeToggle)
