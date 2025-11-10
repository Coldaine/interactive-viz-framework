import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import CodeNode from './CodeNode'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('CodeNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{ label: 'Test Code' }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Code')).toBeInTheDocument()
  })

  it('renders code snippet', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
            language: 'javascript',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    const codeElement = container.querySelector('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement?.textContent).toBe('const hello = "world";')
  })

  it('shows placeholder when no code', () => {
    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('No code to display')).toBeInTheDocument()
  })

  it('expands and collapses code block', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const expandButton = screen.getByText('▶')
    expect(expandButton).toBeInTheDocument()

    const nodeDiv = container.querySelector('[style*="min-width"]')
    expect(nodeDiv?.getAttribute('style')).toContain('max-width: 200px')

    fireEvent.click(expandButton)
    expect(screen.getByText('▼')).toBeInTheDocument()
    expect(nodeDiv?.getAttribute('style')).toContain('max-width: 500px')
  })

  it('changes language on select', () => {
    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'print("hello")',
            language: 'javascript',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('javascript')

    fireEvent.change(select, { target: { value: 'python' } })
    expect(select).toHaveValue('python')
  })

  it('copies code to clipboard', async () => {
    const writeTextMock = vi.fn()
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const copyButton = screen.getByText('📋 Copy')
    fireEvent.click(copyButton)

    expect(writeTextMock).toHaveBeenCalledWith('const hello = "world";')
    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument()
    })
  })

  it('shows copied state temporarily', async () => {
    const writeTextMock = vi.fn()
    Object.assign(navigator.clipboard, { writeText: writeTextMock })

    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const copyButton = screen.getByText('📋 Copy')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText('✓ Copied')).toBeInTheDocument()
    })
  })

  it('disables copy button when no code', () => {
    render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const copyButton = screen.getByText('📋 Copy')
    expect(copyButton).toBeDisabled()
  })

  it('applies dark theme styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
            theme: 'dark',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const codeBlock = container.querySelector('.bg-gray-900')
    expect(codeBlock).toBeInTheDocument()
  })

  it('applies light theme styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{
            label: 'Test',
            code: 'const hello = "world";',
            theme: 'light',
          }}
          selected={false}
          type="codeNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const codeBlock = container.querySelector('.bg-gray-50')
    expect(codeBlock).toBeInTheDocument()
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CodeNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="codeNode"
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
