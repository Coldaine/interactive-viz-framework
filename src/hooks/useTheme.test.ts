import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  // Mock localStorage
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    localStorageMock = {}

    // Mock localStorage
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      }),
      key: vi.fn(),
      length: 0,
    }

    // Reset document classes
    document.documentElement.className = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with system theme by default', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('system')
      expect(result.current.isSystemTheme).toBe(true)
      expect(['light', 'dark']).toContain(result.current.resolvedTheme)
    })

    it('should restore theme from localStorage', () => {
      localStorageMock['theme-preference'] = 'dark'

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
      expect(result.current.isSystemTheme).toBe(false)
    })

    it('should handle invalid localStorage values', () => {
      localStorageMock['theme-preference'] = 'invalid'

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('system')
    })
  })

  describe('setTheme', () => {
    it('should set light theme', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.theme).toBe('light')
      expect(result.current.resolvedTheme).toBe('light')
      expect(localStorageMock['theme-preference']).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should set dark theme', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
      expect(localStorageMock['theme-preference']).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should set system theme', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('system')
      })

      expect(result.current.theme).toBe('system')
      expect(result.current.isSystemTheme).toBe(true)
      expect(localStorageMock['theme-preference']).toBe('system')
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('should toggle from dark to system', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('system')
      expect(result.current.isSystemTheme).toBe(true)
    })

    it('should toggle from system to light', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('system')
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('light')
      expect(result.current.resolvedTheme).toBe('light')
    })

    it('should complete full cycle: light -> dark -> system -> light', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })
      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('system')

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('light')
    })
  })

  describe('Document class updates', () => {
    it('should add dark class when theme is dark', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class when theme is light', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      act(() => {
        result.current.setTheme('light')
      })
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('System preference detection', () => {
    it('should resolve system theme based on prefers-color-scheme', () => {
      // Mock dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('system')
      })

      expect(result.current.theme).toBe('system')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('should listen for system theme changes', async () => {
      let listener: ((e: MediaQueryListEvent) => void) | null = null

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listener = callback
            }
          }),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('system')
      })

      expect(listener).toBeTruthy()
    })
  })

  describe('localStorage persistence', () => {
    it('should persist theme changes to localStorage', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(localStorage.setItem).toHaveBeenCalledWith('theme-preference', 'dark')
      expect(localStorageMock['theme-preference']).toBe('dark')
    })

    it('should persist toggle changes to localStorage', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })

      act(() => {
        result.current.toggleTheme()
      })

      expect(localStorageMock['theme-preference']).toBe('dark')
    })
  })

  describe('isSystemTheme flag', () => {
    it('should be true when theme is system', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('system')
      })

      expect(result.current.isSystemTheme).toBe(true)
    })

    it('should be false when theme is light', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('light')
      })

      expect(result.current.isSystemTheme).toBe(false)
    })

    it('should be false when theme is dark', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.setTheme('dark')
      })

      expect(result.current.isSystemTheme).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle localStorage errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      globalThis.localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage is full')
      })

      const { result } = renderHook(() => useTheme())

      // Should not throw
      expect(() => {
        act(() => {
          result.current.setTheme('dark')
        })
      }).not.toThrow()

      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should handle localStorage read errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      globalThis.localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage access denied')
      })

      // Should not throw and default to system
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('system')
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })
})
