import { create } from 'zustand'

export interface TooltipState {
  visible: boolean
  content: string
  x: number
  y: number
}

export interface ModalState {
  isOpen: boolean
  type: string | null
  data: unknown
}

export interface UIState {
  // Modal management
  modal: ModalState
  openModal: (type: string, data?: unknown) => void
  closeModal: () => void

  // Tooltip management
  tooltip: TooltipState
  showTooltip: (content: string, x: number, y: number) => void
  hideTooltip: () => void

  // Loading states
  isLoading: boolean
  loadingMessage: string
  setLoading: (isLoading: boolean, message?: string) => void

  // Error management
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void

  // Selection state
  selectedNodeIds: string[]
  selectedEdgeIds: string[]
  setSelectedNodes: (nodeIds: string[]) => void
  setSelectedEdges: (edgeIds: string[]) => void
  clearSelection: () => void

  // Panel visibility
  isPanelOpen: boolean
  panelContent: string | null
  openPanel: (content: string) => void
  closePanel: () => void
  togglePanel: () => void

  // Notification system
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  addNotification: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  // Modal state
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },

  openModal: (type, data = null) =>
    set({
      modal: {
        isOpen: true,
        type,
        data,
      },
    }),

  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        type: null,
        data: null,
      },
    }),

  // Tooltip state
  tooltip: {
    visible: false,
    content: '',
    x: 0,
    y: 0,
  },

  showTooltip: (content, x, y) =>
    set({
      tooltip: {
        visible: true,
        content,
        x,
        y,
      },
    }),

  hideTooltip: () =>
    set({
      tooltip: {
        visible: false,
        content: '',
        x: 0,
        y: 0,
      },
    }),

  // Loading state
  isLoading: false,
  loadingMessage: '',

  setLoading: (isLoading, message = '') =>
    set({
      isLoading,
      loadingMessage: message,
    }),

  // Error state
  error: null,

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Selection state
  selectedNodeIds: [],
  selectedEdgeIds: [],

  setSelectedNodes: (nodeIds) => set({ selectedNodeIds: nodeIds }),

  setSelectedEdges: (edgeIds) => set({ selectedEdgeIds: edgeIds }),

  clearSelection: () =>
    set({
      selectedNodeIds: [],
      selectedEdgeIds: [],
    }),

  // Panel state
  isPanelOpen: false,
  panelContent: null,

  openPanel: (content) =>
    set({
      isPanelOpen: true,
      panelContent: content,
    }),

  closePanel: () =>
    set({
      isPanelOpen: false,
      panelContent: null,
    }),

  togglePanel: () => {
    const { isPanelOpen } = get()
    set({ isPanelOpen: !isPanelOpen })
  },

  // Notifications state
  notifications: [],

  addNotification: (type, message) => {
    const notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
    }

    set((state) => ({
      notifications: [...state.notifications, notification],
    }))

    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(notification.id)
    }, 5000)
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))
