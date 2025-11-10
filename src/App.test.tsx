import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })

  it('renders React Flow canvas', () => {
    const { container } = render(<App />)
    const reactFlowElement = container.querySelector('.react-flow')
    expect(reactFlowElement).toBeInTheDocument()
  })

  it('includes save/restore controls', () => {
    render(<App />)
    expect(screen.getByText(/💾 Save/)).toBeInTheDocument()
    expect(screen.getByText(/📂 Load/)).toBeInTheDocument()
    expect(screen.getByText(/⬇️ Export/)).toBeInTheDocument()
    expect(screen.getByText(/⬆️ Import/)).toBeInTheDocument()
  })
})
