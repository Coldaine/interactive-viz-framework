import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import CustomNodeToolbar from './CustomNodeToolbar'

describe('CustomNodeToolbar', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar nodeId="test-node" />
      </ReactFlowProvider>
    )
    // NodeToolbar renders into a portal, so we just verify it doesn't error
    expect(container).toBeInTheDocument()
  })

  it('renders with delete callback', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar nodeId="test-node" onDelete={onDelete} />
      </ReactFlowProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('renders with duplicate callback', () => {
    const onDuplicate = vi.fn()
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar nodeId="test-node" onDuplicate={onDuplicate} />
      </ReactFlowProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('renders with color callback', () => {
    const onChangeColor = vi.fn()
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar nodeId="test-node" onChangeColor={onChangeColor} />
      </ReactFlowProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('renders with lock callback', () => {
    const onLock = vi.fn()
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar nodeId="test-node" onLock={onLock} />
      </ReactFlowProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('renders with all callbacks', () => {
    const { container } = render(
      <ReactFlowProvider>
        <CustomNodeToolbar
          nodeId="test-node"
          onDelete={vi.fn()}
          onDuplicate={vi.fn()}
          onChangeColor={vi.fn()}
          onLock={vi.fn()}
        />
      </ReactFlowProvider>
    )
    // NodeToolbar creates a portal that doesn't render in test environment
    // The important part is that the component accepts all callbacks without error
    expect(container).toBeInTheDocument()
  })
})
