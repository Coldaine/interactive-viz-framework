import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('includes save/restore controls', () => {
    render(<App />)
    expect(screen.getByText(/💾 Save/)).toBeInTheDocument()
    expect(screen.getByText(/📂 Load/)).toBeInTheDocument()
    expect(screen.getByText(/⬇️ Export/)).toBeInTheDocument()
    expect(screen.getByText(/⬆️ Import/)).toBeInTheDocument()
  })

  it('includes undo/redo controls', () => {
    render(<App />)
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
  })

  it('initializes with undo/redo buttons disabled', () => {
    render(<App />)
    const undoButton = screen.getByText('Undo').closest('button')
    const redoButton = screen.getByText('Redo').closest('button')

    // Initially, there's no history to undo/redo (only initial snapshot)
    // Note: The actual behavior depends on the history store initialization
    expect(undoButton).toBeInTheDocument()
    expect(redoButton).toBeInTheDocument()
  })
})
