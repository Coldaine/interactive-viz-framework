import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import DecisionNode from './DecisionNode'

describe('DecisionNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test Decision' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Decision')).toBeInTheDocument()
  })

  it('displays default condition', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('condition')).toBeInTheDocument()
  })

  it('displays custom condition', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', condition: 'x > 10' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('x > 10')).toBeInTheDocument()
  })

  it('enters edit mode on condition click', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', condition: 'x > 10' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const conditionText = screen.getByText('x > 10')
    fireEvent.click(conditionText)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('x > 10')
  })

  it('saves condition on blur', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', condition: 'x > 10' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const conditionText = screen.getByText('x > 10')
    fireEvent.click(conditionText)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'y < 5' } })
    fireEvent.blur(input)

    expect(screen.getByText('y < 5')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('saves condition on Enter key', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', condition: 'x > 10' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const conditionText = screen.getByText('x > 10')
    fireEvent.click(conditionText)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'y < 5' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('y < 5')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('cancels edit on Escape key', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', condition: 'x > 10' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const conditionText = screen.getByText('x > 10')
    fireEvent.click(conditionText)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'y < 5' } })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.getByText('x > 10')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('displays default true path label', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('True')).toBeInTheDocument()
  })

  it('displays default false path label', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('False')).toBeInTheDocument()
  })

  it('displays custom path labels', () => {
    render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test', truePath: 'Yes', falsePath: 'No' }}
          selected={false}
          type="decisionNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <DecisionNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="decisionNode"
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
