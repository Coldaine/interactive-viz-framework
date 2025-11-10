import { create } from 'zustand'
import type { Node, Edge, Viewport } from '@xyflow/react'

export interface FlowSnapshot {
  nodes: Node[]
  edges: Edge[]
  viewport: Viewport
  timestamp: number
}

export interface HistoryState {
  history: FlowSnapshot[]
  currentIndex: number
  maxHistorySize: number
  addToHistory: (snapshot: FlowSnapshot) => void
  undo: () => FlowSnapshot | null
  redo: () => FlowSnapshot | null
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  getCurrentSnapshot: () => FlowSnapshot | null
}

const MAX_HISTORY_SIZE = 50

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  currentIndex: -1,
  maxHistorySize: MAX_HISTORY_SIZE,

  addToHistory: (snapshot) => {
    const { history, currentIndex, maxHistorySize } = get()

    // Remove any history after current index (when user makes changes after undo)
    const newHistory = history.slice(0, currentIndex + 1)

    // Add new snapshot
    newHistory.push(snapshot)

    // Limit history size
    const trimmedHistory =
      newHistory.length > maxHistorySize
        ? newHistory.slice(newHistory.length - maxHistorySize)
        : newHistory

    set({
      history: trimmedHistory,
      currentIndex: trimmedHistory.length - 1,
    })
  },

  undo: () => {
    const { history, currentIndex } = get()

    if (currentIndex <= 0) {
      return null
    }

    const newIndex = currentIndex - 1
    set({ currentIndex: newIndex })
    return history[newIndex]
  },

  redo: () => {
    const { history, currentIndex } = get()

    if (currentIndex >= history.length - 1) {
      return null
    }

    const newIndex = currentIndex + 1
    set({ currentIndex: newIndex })
    return history[newIndex]
  },

  canUndo: () => {
    const { currentIndex } = get()
    return currentIndex > 0
  },

  canRedo: () => {
    const { history, currentIndex } = get()
    return currentIndex < history.length - 1
  },

  clearHistory: () => {
    set({
      history: [],
      currentIndex: -1,
    })
  },

  getCurrentSnapshot: () => {
    const { history, currentIndex } = get()
    return currentIndex >= 0 && currentIndex < history.length
      ? history[currentIndex]
      : null
  },
}))
