import { useState, useEffect, useCallback } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Get the stored theme preference from localStorage
 */
function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
  }

  return null
}

/**
 * Store theme preference in localStorage
 */
function storeTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

/**
 * Apply theme to document by updating the root class
 */
function applyThemeToDocument(resolvedTheme: ResolvedTheme): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  if (resolvedTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Resolve the actual theme based on the mode
 */
function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme()
  }
  return mode
}

export interface UseThemeReturn {
  /** Current theme mode (light, dark, or system) */
  theme: ThemeMode
  /** Resolved theme (light or dark) - what's actually applied */
  resolvedTheme: ResolvedTheme
  /** Set a specific theme mode */
  setTheme: (theme: ThemeMode) => void
  /** Toggle between light and dark (if system, switches to light first) */
  toggleTheme: () => void
  /** Whether currently using system preference */
  isSystemTheme: boolean
}

/**
 * Hook for managing theme with system preference detection and localStorage persistence
 *
 * @example
 * ```tsx
 * function App() {
 *   const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
 *
 *   return (
 *     <div>
 *       <p>Current mode: {theme}</p>
 *       <p>Applied theme: {resolvedTheme}</p>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *       <button onClick={() => setTheme('system')}>Use System</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  // Initialize with stored preference or default to system
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return getStoredTheme() || 'system'
  })

  // Calculate resolved theme
  const resolvedTheme = resolveTheme(theme)

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
    storeTheme(newTheme)
  }, [])

  /**
   * Toggle between light, dark, and system
   * Cycle: light -> dark -> system -> light
   */
  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      let next: ThemeMode

      if (current === 'light') {
        next = 'dark'
      } else if (current === 'dark') {
        next = 'system'
      } else {
        next = 'light'
      }

      storeTheme(next)
      return next
    })
  }, [])

  // Apply theme to document when resolved theme changes
  useEffect(() => {
    applyThemeToDocument(resolvedTheme)
  }, [resolvedTheme])

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      // Force re-render by updating state
      setThemeState('system')
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isSystemTheme: theme === 'system',
  }
}
