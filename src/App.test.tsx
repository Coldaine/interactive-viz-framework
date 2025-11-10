import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('renders React Flow canvas', () => {
    const { container } = render(
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    )
    const reactFlowElement = container.querySelector('.react-flow')
    expect(reactFlowElement).toBeInTheDocument()
  })

  it('includes save/restore controls', () => {
    render(
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    )
    expect(screen.getByText(/💾 Save/)).toBeInTheDocument()
    expect(screen.getByText(/📂 Load/)).toBeInTheDocument()
    expect(screen.getByText(/⬇️ Export/)).toBeInTheDocument()
    expect(screen.getByText(/⬆️ Import/)).toBeInTheDocument()
  })
})
