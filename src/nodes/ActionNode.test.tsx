import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import ActionNode from './ActionNode'

describe('ActionNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test Action' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Action')).toBeInTheDocument()
  })

  it('renders primary action button', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', primaryAction: 'Execute' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Execute')).toBeInTheDocument()
  })

  it('shows loading state when primary button is clicked', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', primaryAction: 'Execute' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const button = screen.getByText('Execute')
    fireEvent.click(button)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows success state after action completes', async () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', primaryAction: 'Execute' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const button = screen.getByText('Execute')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('✓ Success')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('renders secondary action button', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', secondaryAction: 'Cancel' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('opens and closes dropdown menu', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', options: ['Option 1', 'Option 2', 'Option 3'] }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const dropdownButton = screen.getByText('Select option')
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()

    fireEvent.click(dropdownButton)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()

    fireEvent.click(dropdownButton)
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('selects option from dropdown', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', options: ['Option 1', 'Option 2'] }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const dropdownButton = screen.getByText('Select option')
    fireEvent.click(dropdownButton)

    const option1 = screen.getByText('Option 1')
    fireEvent.click(option1)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
  })

  it('renders toggle switch', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', toggleLabel: 'Enable feature' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles switch state on click', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', toggleLabel: 'Enable feature' }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('uses default toggle state from data', () => {
    render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test', toggleLabel: 'Enable feature', toggleDefault: true }}
          selected={false}
          type="actionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <ActionNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="actionNode"
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
