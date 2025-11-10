import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UndoRedoControls from './UndoRedoControls'

describe('UndoRedoControls', () => {
  it('renders undo and redo buttons', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={true}
      />
    )

    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
  })

  it('calls onUndo when undo button is clicked', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    fireEvent.click(undoButton!)

    expect(mockUndo).toHaveBeenCalledTimes(1)
  })

  it('calls onRedo when redo button is clicked', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    fireEvent.click(redoButton!)

    expect(mockRedo).toHaveBeenCalledTimes(1)
  })

  it('disables undo button when canUndo is false', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).toBeDisabled()
  })

  it('disables redo button when canRedo is false', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).toBeDisabled()
  })

  it('enables undo button when canUndo is true', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).not.toBeDisabled()
  })

  it('enables redo button when canRedo is true', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).not.toBeDisabled()
  })

  it('applies disabled styling when canUndo is false', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).toHaveClass('cursor-not-allowed')
  })

  it('applies disabled styling when canRedo is false', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).toHaveClass('cursor-not-allowed')
  })

  it('applies enabled styling when canUndo is true', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).toHaveClass('bg-blue-500')
  })

  it('applies enabled styling when canRedo is true', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).toHaveClass('bg-blue-500')
  })

  it('does not call onUndo when disabled', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    fireEvent.click(undoButton!)

    expect(mockUndo).not.toHaveBeenCalled()
  })

  it('does not call onRedo when disabled', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')
    fireEvent.click(redoButton!)

    expect(mockRedo).not.toHaveBeenCalled()
  })

  it('has proper aria-labels for accessibility', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={true}
      />
    )

    const undoButton = screen.getByLabelText('Undo last action')
    const redoButton = screen.getByLabelText('Redo last undone action')

    expect(undoButton).toBeInTheDocument()
    expect(redoButton).toBeInTheDocument()
  })

  it('has tooltips with keyboard shortcuts', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={true}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')
    const redoButton = screen.getByText('Redo').closest('button')

    // Check for title attributes
    expect(undoButton).toHaveAttribute('title')
    expect(redoButton).toHaveAttribute('title')

    // Title should contain keyboard shortcut info
    const undoTitle = undoButton?.getAttribute('title')
    const redoTitle = redoButton?.getAttribute('title')

    expect(undoTitle).toMatch(/Undo/)
    expect(redoTitle).toMatch(/Redo/)
  })

  it('renders SVG icons for undo and redo', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    const { container } = render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={true}
      />
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(2) // One for undo, one for redo
  })

  it('updates when canUndo changes', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    const { rerender } = render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={false}
      />
    )

    let undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).toBeDisabled()

    rerender(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    undoButton = screen.getByText('Undo').closest('button')
    expect(undoButton).not.toBeDisabled()
  })

  it('updates when canRedo changes', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    const { rerender } = render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={false}
      />
    )

    let redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).toBeDisabled()

    rerender(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    redoButton = screen.getByText('Redo').closest('button')
    expect(redoButton).not.toBeDisabled()
  })

  it('handles multiple rapid clicks on undo', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={true}
        canRedo={false}
      />
    )

    const undoButton = screen.getByText('Undo').closest('button')

    fireEvent.click(undoButton!)
    fireEvent.click(undoButton!)
    fireEvent.click(undoButton!)

    expect(mockUndo).toHaveBeenCalledTimes(3)
  })

  it('handles multiple rapid clicks on redo', () => {
    const mockUndo = vi.fn()
    const mockRedo = vi.fn()

    render(
      <UndoRedoControls
        onUndo={mockUndo}
        onRedo={mockRedo}
        canUndo={false}
        canRedo={true}
      />
    )

    const redoButton = screen.getByText('Redo').closest('button')

    fireEvent.click(redoButton!)
    fireEvent.click(redoButton!)
    fireEvent.click(redoButton!)

    expect(mockRedo).toHaveBeenCalledTimes(3)
  })
})
