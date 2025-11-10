import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReactFlowProvider, Position } from '@xyflow/react'
import DataNode from './DataNode'

const mockData = {
  label: 'Test Data',
  value: 1234,
  unit: 'users',
  trend: 'up' as const,
  chartData: [10, 20, 30, 40, 50],
}

const defaultProps = {
  id: '1',
  data: mockData,
  selected: false,
  type: 'dataNode',
  zIndex: 0,
  dragging: false,
  position: { x: 0, y: 0 },
  width: 200,
  height: 100,
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  selectable: true,
  deletable: true,
  draggable: true,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
} as const

describe('DataNode', () => {
  it('renders the label and value', () => {
    render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} />
      </ReactFlowProvider>
    )

    expect(screen.getByText('Test Data')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('displays the unit when provided', () => {
    render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} />
      </ReactFlowProvider>
    )

    expect(screen.getByText('users')).toBeInTheDocument()
  })

  it('shows trend indicator', () => {
    render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} />
      </ReactFlowProvider>
    )

    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('expands and collapses chart on button click', () => {
    const { container } = render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} />
      </ReactFlowProvider>
    )

    const expandButton = screen.getByText('▶')
    expect(expandButton).toBeInTheDocument()

    // Check chart is not visible initially
    let chartBars = container.querySelectorAll('.bg-blue-400')
    expect(chartBars.length).toBe(0)

    // Click to expand
    fireEvent.click(expandButton)

    // Check chart is now visible
    chartBars = container.querySelectorAll('.bg-blue-400')
    expect(chartBars.length).toBe(5)

    // Click to collapse
    const collapseButton = screen.getByText('▼')
    fireEvent.click(collapseButton)

    // Check chart is hidden again
    chartBars = container.querySelectorAll('.bg-blue-400')
    expect(chartBars.length).toBe(0)
  })

  it('applies selected styles when selected', () => {
    const { container } = render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} selected={true} />
      </ReactFlowProvider>
    )

    const nodeDiv = container.querySelector('.border-blue-500')
    expect(nodeDiv).toBeInTheDocument()
  })

  it('renders without value and trend', () => {
    const minimalData = {
      label: 'Minimal Node',
    }

    render(
      <ReactFlowProvider>
        <DataNode {...defaultProps} data={minimalData} />
      </ReactFlowProvider>
    )

    expect(screen.getByText('Minimal Node')).toBeInTheDocument()
    expect(screen.queryByText('↑')).not.toBeInTheDocument()
  })
})
