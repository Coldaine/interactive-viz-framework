import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import FlowControls from './FlowControls'

// Mock useFlowControl
vi.mock('../hooks/useFlowControl', () => ({
  useFlowControl: () => ({
    fitView: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
    getNodes: vi.fn(() => []),
    getEdges: vi.fn(() => []),
  }),
}))

describe('FlowControls', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('renders fit view button', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Fit View')).toBeInTheDocument()
  })

  it('renders zoom in button', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('renders zoom out button', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    expect(screen.getByText('−')).toBeInTheDocument()
  })

  it('renders debug buttons', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Log Viewport')).toBeInTheDocument()
    expect(screen.getByText('Log Stats')).toBeInTheDocument()
  })

  it('fit view button is clickable', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    const button = screen.getByText('Fit View')
    fireEvent.click(button)
    // Should not throw error
  })

  it('zoom in button is clickable', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    const button = screen.getByText('+')
    fireEvent.click(button)
    // Should not throw error
  })

  it('zoom out button is clickable', () => {
    render(
      <ReactFlowProvider>
        <FlowControls />
      </ReactFlowProvider>
    )
    const button = screen.getByText('−')
    fireEvent.click(button)
    // Should not throw error
  })
})
