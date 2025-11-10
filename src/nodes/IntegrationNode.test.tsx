import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import IntegrationNode from './IntegrationNode'

describe('IntegrationNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test Integration' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Integration')).toBeInTheDocument()
  })

  it('displays default GET method', () => {
    const { container } = render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    const methodSelect = container.querySelector('select[class*="text-xs font-bold"]')
    expect(methodSelect).toHaveValue('GET')
  })

  it('changes HTTP method', () => {
    const { container } = render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const methodSelect = container.querySelector('select[class*="text-xs font-bold"]')
    if (methodSelect) {
      fireEvent.change(methodSelect, { target: { value: 'POST' } })
      expect(methodSelect).toHaveValue('POST')

      fireEvent.change(methodSelect, { target: { value: 'DELETE' } })
      expect(methodSelect).toHaveValue('DELETE')
    }
  })

  it('displays endpoint input', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', endpoint: '/api/users' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const input = screen.getByPlaceholderText('/api/endpoint')
    expect(input).toHaveValue('/api/users')
  })

  it('updates endpoint on input change', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const input = screen.getByPlaceholderText('/api/endpoint')
    fireEvent.change(input, { target: { value: '/api/products' } })
    expect(input).toHaveValue('/api/products')
  })

  it('sends request on button click', async () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const button = screen.getByText('Send Request')
    fireEvent.click(button)

    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('disables button during pending request', () => {
    const { container } = render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', status: 'pending' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const button = container.querySelector('button[disabled]')
    expect(button).toBeInTheDocument()
    expect(button?.textContent).toContain('Sending')
  })

  it('displays success status', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', status: 'success' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('✓ 200 OK')).toBeInTheDocument()
  })

  it('displays error status', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', status: 'error' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('✗ 500 Error')).toBeInTheDocument()
  })

  it('toggles response preview', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{
            label: 'Test',
            status: 'success',
            responsePreview: '{"status": "ok"}',
          }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const responseButton = screen.getByText('Response')
    expect(screen.queryByText('{"status": "ok"}')).not.toBeInTheDocument()

    fireEvent.click(responseButton)
    expect(screen.getByText('{"status": "ok"}')).toBeInTheDocument()

    fireEvent.click(responseButton)
    expect(screen.queryByText('{"status": "ok"}')).not.toBeInTheDocument()
  })

  it('changes service type', () => {
    const { container } = render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', serviceType: 'REST' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const serviceSelect = container.querySelector('select[class*="text-xs border border-gray-300"]')
    if (serviceSelect) {
      expect(serviceSelect).toHaveValue('REST')

      fireEvent.change(serviceSelect, { target: { value: 'GraphQL' } })
      expect(serviceSelect).toHaveValue('GraphQL')

      fireEvent.change(serviceSelect, { target: { value: 'WebSocket' } })
      expect(serviceSelect).toHaveValue('WebSocket')
    }
  })

  it('displays REST service icon', () => {
    render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test', serviceType: 'REST' }}
          selected={false}
          type="integrationNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('🔌')).toBeInTheDocument()
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <IntegrationNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="integrationNode"
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
