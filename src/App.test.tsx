import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })

  it('renders React Flow canvas', () => {
    const { container } = render(<App />)
    const reactFlowWrapper = container.querySelector('.react-flow')
    expect(reactFlowWrapper).toBeInTheDocument()
  })

  it('includes initial nodes', () => {
    const { container } = render(<App />)
    const nodes = container.querySelectorAll('.react-flow__node')
    expect(nodes.length).toBeGreaterThan(0)
  })
})
