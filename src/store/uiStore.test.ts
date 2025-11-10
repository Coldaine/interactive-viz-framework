import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUIStore } from './uiStore'

describe('UIStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useUIStore())
    act(() => {
      result.current.closeModal()
      result.current.hideTooltip()
      result.current.setLoading(false)
      result.current.clearError()
      result.current.clearSelection()
      result.current.closePanel()
      result.current.clearNotifications()
    })
    vi.clearAllTimers()
  })

  describe('Modal Management', () => {
    it('should have closed modal initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.modal.isOpen).toBe(false)
      expect(result.current.modal.type).toBeNull()
      expect(result.current.modal.data).toBeNull()
    })

    it('should open modal with type', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('delete-node')
      })

      expect(result.current.modal.isOpen).toBe(true)
      expect(result.current.modal.type).toBe('delete-node')
      expect(result.current.modal.data).toBeNull()
    })

    it('should open modal with data', () => {
      const { result } = renderHook(() => useUIStore())
      const data = { nodeId: '123' }

      act(() => {
        result.current.openModal('edit-node', data)
      })

      expect(result.current.modal.isOpen).toBe(true)
      expect(result.current.modal.type).toBe('edit-node')
      expect(result.current.modal.data).toEqual(data)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('test-modal', { test: true })
        result.current.closeModal()
      })

      expect(result.current.modal.isOpen).toBe(false)
      expect(result.current.modal.type).toBeNull()
      expect(result.current.modal.data).toBeNull()
    })

    it('should replace modal when opening new one', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('modal-1', { id: 1 })
        result.current.openModal('modal-2', { id: 2 })
      })

      expect(result.current.modal.type).toBe('modal-2')
      expect(result.current.modal.data).toEqual({ id: 2 })
    })
  })

  describe('Tooltip Management', () => {
    it('should have hidden tooltip initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.tooltip.visible).toBe(false)
      expect(result.current.tooltip.content).toBe('')
    })

    it('should show tooltip with content and position', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.showTooltip('Test tooltip', 100, 200)
      })

      expect(result.current.tooltip.visible).toBe(true)
      expect(result.current.tooltip.content).toBe('Test tooltip')
      expect(result.current.tooltip.x).toBe(100)
      expect(result.current.tooltip.y).toBe(200)
    })

    it('should hide tooltip', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.showTooltip('Test', 10, 20)
        result.current.hideTooltip()
      })

      expect(result.current.tooltip.visible).toBe(false)
      expect(result.current.tooltip.content).toBe('')
      expect(result.current.tooltip.x).toBe(0)
      expect(result.current.tooltip.y).toBe(0)
    })

    it('should update tooltip position', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.showTooltip('Test', 10, 20)
        result.current.showTooltip('Test', 50, 100)
      })

      expect(result.current.tooltip.x).toBe(50)
      expect(result.current.tooltip.y).toBe(100)
    })
  })

  describe('Loading State', () => {
    it('should not be loading initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingMessage).toBe('')
    })

    it('should set loading state', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should set loading state with message', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading(true, 'Processing...')
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.loadingMessage).toBe('Processing...')
    })

    it('should clear loading state', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading(true, 'Loading...')
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.loadingMessage).toBe('')
    })
  })

  describe('Error Management', () => {
    it('should have no error initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.error).toBeNull()
    })

    it('should set error', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setError('Something went wrong')
      })

      expect(result.current.error).toBe('Something went wrong')
    })

    it('should clear error', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setError('Error occurred')
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should replace existing error', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setError('Error 1')
        result.current.setError('Error 2')
      })

      expect(result.current.error).toBe('Error 2')
    })
  })

  describe('Selection Management', () => {
    it('should have no selection initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.selectedNodeIds).toEqual([])
      expect(result.current.selectedEdgeIds).toEqual([])
    })

    it('should set selected nodes', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSelectedNodes(['1', '2', '3'])
      })

      expect(result.current.selectedNodeIds).toEqual(['1', '2', '3'])
    })

    it('should set selected edges', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSelectedEdges(['e1', 'e2'])
      })

      expect(result.current.selectedEdgeIds).toEqual(['e1', 'e2'])
    })

    it('should clear selection', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSelectedNodes(['1', '2'])
        result.current.setSelectedEdges(['e1'])
        result.current.clearSelection()
      })

      expect(result.current.selectedNodeIds).toEqual([])
      expect(result.current.selectedEdgeIds).toEqual([])
    })

    it('should replace selected nodes', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSelectedNodes(['1', '2'])
        result.current.setSelectedNodes(['3', '4'])
      })

      expect(result.current.selectedNodeIds).toEqual(['3', '4'])
    })
  })

  describe('Panel Management', () => {
    it('should have closed panel initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.isPanelOpen).toBe(false)
      expect(result.current.panelContent).toBeNull()
    })

    it('should open panel with content', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openPanel('settings')
      })

      expect(result.current.isPanelOpen).toBe(true)
      expect(result.current.panelContent).toBe('settings')
    })

    it('should close panel', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openPanel('settings')
        result.current.closePanel()
      })

      expect(result.current.isPanelOpen).toBe(false)
      expect(result.current.panelContent).toBeNull()
    })

    it('should toggle panel', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.togglePanel()
      })

      expect(result.current.isPanelOpen).toBe(true)

      act(() => {
        result.current.togglePanel()
      })

      expect(result.current.isPanelOpen).toBe(false)
    })

    it('should replace panel content when opening new content', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openPanel('settings')
        result.current.openPanel('help')
      })

      expect(result.current.panelContent).toBe('help')
    })
  })

  describe('Notification System', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should have no notifications initially', () => {
      const { result } = renderHook(() => useUIStore())

      expect(result.current.notifications).toEqual([])
    })

    it('should add success notification', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('success', 'Operation successful')
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].type).toBe('success')
      expect(result.current.notifications[0].message).toBe('Operation successful')
    })

    it('should add error notification', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('error', 'Operation failed')
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].type).toBe('error')
    })

    it('should add warning notification', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('warning', 'Be careful')
      })

      expect(result.current.notifications[0].type).toBe('warning')
    })

    it('should add info notification', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'FYI')
      })

      expect(result.current.notifications[0].type).toBe('info')
    })

    it('should add multiple notifications', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('success', 'First')
        result.current.addNotification('error', 'Second')
        result.current.addNotification('info', 'Third')
      })

      expect(result.current.notifications).toHaveLength(3)
    })

    it('should generate unique IDs for notifications', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'Test 1')
        result.current.addNotification('info', 'Test 2')
      })

      const ids = result.current.notifications.map((n) => n.id)
      expect(new Set(ids).size).toBe(2) // All IDs should be unique
    })

    it('should include timestamp in notifications', () => {
      const { result } = renderHook(() => useUIStore())
      const before = Date.now()

      act(() => {
        result.current.addNotification('info', 'Test')
      })

      const after = Date.now()
      const timestamp = result.current.notifications[0].timestamp

      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('should remove notification by ID', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'Test 1')
        result.current.addNotification('info', 'Test 2')
      })

      const idToRemove = result.current.notifications[0].id

      act(() => {
        result.current.removeNotification(idToRemove)
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].message).toBe('Test 2')
    })

    it('should clear all notifications', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'Test 1')
        result.current.addNotification('info', 'Test 2')
        result.current.addNotification('info', 'Test 3')
        result.current.clearNotifications()
      })

      expect(result.current.notifications).toEqual([])
    })

    it('should auto-remove notification after 5 seconds', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'Auto-remove test')
      })

      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should auto-remove only expired notifications', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.addNotification('info', 'First')
      })

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      act(() => {
        result.current.addNotification('info', 'Second')
      })

      act(() => {
        vi.advanceTimersByTime(2500)
      })

      // First notification should be removed (5s total)
      // Second notification should still be there (only 2.5s)
      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].message).toBe('Second')
    })
  })

  describe('Complex Scenarios', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should handle multiple UI states simultaneously', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.openModal('test', { id: 1 })
        result.current.showTooltip('Hover text', 50, 50)
        result.current.setLoading(true, 'Processing...')
        result.current.setSelectedNodes(['1', '2'])
        result.current.addNotification('info', 'Started')
      })

      expect(result.current.modal.isOpen).toBe(true)
      expect(result.current.tooltip.visible).toBe(true)
      expect(result.current.isLoading).toBe(true)
      expect(result.current.selectedNodeIds).toHaveLength(2)
      expect(result.current.notifications).toHaveLength(1)
    })

    it('should handle workflow: loading -> success -> clear', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading(true, 'Saving...')
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
        result.current.addNotification('success', 'Saved successfully')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.notifications[0].type).toBe('success')

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should handle error workflow', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setLoading(true, 'Fetching data...')
      })

      act(() => {
        result.current.setLoading(false)
        result.current.setError('Failed to fetch data')
        result.current.addNotification('error', 'Network error')
      })

      expect(result.current.error).toBe('Failed to fetch data')
      expect(result.current.notifications[0].type).toBe('error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should preserve state when closing/opening different UI elements', () => {
      const { result } = renderHook(() => useUIStore())

      act(() => {
        result.current.setSelectedNodes(['1', '2'])
        result.current.openPanel('settings')
        result.current.openModal('confirm', { action: 'delete' })
      })

      act(() => {
        result.current.closeModal()
      })

      expect(result.current.selectedNodeIds).toEqual(['1', '2'])
      expect(result.current.isPanelOpen).toBe(true)
    })
  })
})
