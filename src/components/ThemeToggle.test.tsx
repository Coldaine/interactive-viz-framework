import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'
import * as useThemeModule from '../hooks/useTheme'

describe('ThemeToggle', () => {
  // Mock useTheme hook
  const mockToggleTheme = vi.fn()
  const mockSetTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
      isSystemTheme: false,
    })
  })

  describe('Rendering', () => {
    it('should render toggle button', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should display light mode icon and label', () => {
      render(<ThemeToggle />)

      expect(screen.getByText('☀️')).toBeInTheDocument()
      expect(screen.getByText('Light mode')).toBeInTheDocument()
    })

    it('should display dark mode icon and label', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'dark',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: false,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('🌙')).toBeInTheDocument()
      expect(screen.getByText('Dark mode')).toBeInTheDocument()
    })

    it('should display system mode icon and label', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('🖥️')).toBeInTheDocument()
      expect(screen.getByText('System mode')).toBeInTheDocument()
    })

    it('should show resolved theme in system mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('(dark)')).toBeInTheDocument()
    })
  })

  describe('Interaction', () => {
    it('should call toggleTheme when clicked', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('should call toggleTheme on multiple clicks', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(mockToggleTheme).toHaveBeenCalledTimes(3)
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label for light mode', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
    })

    it('should have proper aria-label for dark mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'dark',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: false,
      })

      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Switch to system mode')
    })

    it('should have proper aria-label for system mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    })

    it('should have proper title attribute', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Switch to dark mode')
    })

    it('should have button type attribute', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should have aria-hidden on icon', () => {
      render(<ThemeToggle />)

      const icon = screen.getByText('☀️')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Styling', () => {
    it('should apply custom className', () => {
      render(<ThemeToggle className="custom-class" />)

      const button = screen.getByRole('button')
      expect(button.className).toContain('custom-class')
    })

    it('should have default styling classes', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button.className).toContain('flex')
      expect(button.className).toContain('items-center')
      expect(button.className).toContain('rounded-lg')
    })
  })

  describe('Responsive behavior', () => {
    it('should render on small screens', () => {
      render(<ThemeToggle />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      // Icon should always be visible
      expect(screen.getByText('☀️')).toBeInTheDocument()
    })

    it('should show label on larger screens', () => {
      render(<ThemeToggle />)

      const label = screen.getByText('Light mode')
      expect(label.className).toContain('sm:inline')
    })
  })

  describe('Theme state transitions', () => {
    it('should update display when theme changes from light to dark', () => {
      const { unmount } = render(<ThemeToggle />)

      expect(screen.getByText('☀️')).toBeInTheDocument()
      expect(screen.getByText('Light mode')).toBeInTheDocument()

      unmount()

      // Update mock to dark theme
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'dark',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: false,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('🌙')).toBeInTheDocument()
      expect(screen.getByText('Dark mode')).toBeInTheDocument()
    })

    it('should update display when theme changes to system', () => {
      const { unmount } = render(<ThemeToggle />)

      unmount()

      // Update mock to system theme
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('🖥️')).toBeInTheDocument()
      expect(screen.getByText('System mode')).toBeInTheDocument()
    })
  })

  describe('System mode resolved theme display', () => {
    it('should show light as resolved theme in system mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('(light)')).toBeInTheDocument()
    })

    it('should show dark as resolved theme in system mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'system',
        resolvedTheme: 'dark',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: true,
      })

      render(<ThemeToggle />)

      expect(screen.getByText('(dark)')).toBeInTheDocument()
    })

    it('should not show resolved theme when not in system mode', () => {
      vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
        theme: 'light',
        resolvedTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
        isSystemTheme: false,
      })

      render(<ThemeToggle />)

      expect(screen.queryByText('(light)')).not.toBeInTheDocument()
    })
  })
})
