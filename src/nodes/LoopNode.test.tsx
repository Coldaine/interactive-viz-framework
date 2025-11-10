import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import LoopNode from './LoopNode'

describe('LoopNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test Loop' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Loop')).toBeInTheDocument()
  })

  it('displays iteration counter', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test', maxIterations: 10, currentIteration: 0 }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
  })

  it('shows start button initially', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('▶ Start')).toBeInTheDocument()
  })

  it('shows pause and stop buttons when running', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const startButton = screen.getByText('▶ Start')
    fireEvent.click(startButton)

    expect(screen.getByText('⏸ Pause')).toBeInTheDocument()
    expect(screen.getByText('⏹ Stop')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('toggles pause state', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const startButton = screen.getByText('▶ Start')
    fireEvent.click(startButton)

    const pauseButton = screen.getByText('⏸ Pause')
    fireEvent.click(pauseButton)

    expect(screen.getByText('▶ Resume')).toBeInTheDocument()
    expect(screen.getByText('Paused')).toBeInTheDocument()

    const resumeButton = screen.getByText('▶ Resume')
    fireEvent.click(resumeButton)

    expect(screen.getByText('⏸ Pause')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('stops loop and resets', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test', currentIteration: 5 }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const startButton = screen.getByText('▶ Start')
    fireEvent.click(startButton)

    const stopButton = screen.getByText('⏹ Stop')
    fireEvent.click(stopButton)

    expect(screen.getByText('▶ Start')).toBeInTheDocument()
    expect(screen.queryByText('Running')).not.toBeInTheDocument()
  })

  it('changes loop type', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test', loopType: 'for' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('for')

    fireEvent.change(select, { target: { value: 'while' } })
    expect(select).toHaveValue('while')

    fireEvent.change(select, { target: { value: 'forEach' } })
    expect(select).toHaveValue('forEach')
  })

  it('shows restart button when completed', () => {
    render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test', maxIterations: 5, currentIteration: 5 }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    expect(screen.getByText('↻ Restart')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('displays progress bar', () => {
    const { container } = render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const progressBar = container.querySelector('.bg-gray-200')
    expect(progressBar).toBeInTheDocument()
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <LoopNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="loopNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const node = container.querySelector('.border-blue-500')
    expect(node).toBeInTheDocument()
  })
})
