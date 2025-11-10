import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import ExportMenu from './ExportMenu'
import * as exportUtils from '../utils/export'

// Mock the export utilities
vi.mock('../utils/export', () => ({
  exportToPNG: vi.fn(),
  exportToSVG: vi.fn(),
  exportToJSON: vi.fn(),
  copyToClipboard: vi.fn(),
  copySelectedToClipboard: vi.fn(),
  exportSelectedNodes: vi.fn(),
}))

// Mock useReactFlow hook
const mockGetNodes = vi.fn()
const mockGetEdges = vi.fn()
const mockGetViewport = vi.fn()

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({
      getNodes: mockGetNodes,
      getEdges: mockGetEdges,
      getViewport: mockGetViewport,
    }),
  }
})

describe('ExportMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetNodes.mockReturnValue([
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    ])
    mockGetEdges.mockReturnValue([
      { id: 'e1-2', source: '1', target: '2' },
    ])
    mockGetViewport.mockReturnValue({ x: 0, y: 0, zoom: 1 })
  })

  it('should render export button', () => {
    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    expect(screen.getByText(/Export/)).toBeInTheDocument()
  })

  it('should open menu when button is clicked', () => {
    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    expect(screen.getByText('Export as PNG')).toBeInTheDocument()
    expect(screen.getByText('Export as SVG')).toBeInTheDocument()
    expect(screen.getByText('Export as JSON')).toBeInTheDocument()
    expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument()
  })

  it('should close menu when clicking outside', async () => {
    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    expect(screen.getByText('Export as PNG')).toBeInTheDocument()

    // Click outside
    fireEvent.mouseDown(document.body)

    await waitFor(() => {
      expect(screen.queryByText('Export as PNG')).not.toBeInTheDocument()
    })
  })

  it('should export as PNG when PNG option is clicked', async () => {
    vi.mocked(exportUtils.exportToPNG).mockResolvedValueOnce()

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const pngButton = screen.getByText('Export as PNG')
    fireEvent.click(pngButton)

    await waitFor(() => {
      expect(exportUtils.exportToPNG).toHaveBeenCalled()
    })
  })

  it('should export as SVG when SVG option is clicked', async () => {
    vi.mocked(exportUtils.exportToSVG).mockResolvedValueOnce()

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const svgButton = screen.getByText('Export as SVG')
    fireEvent.click(svgButton)

    await waitFor(() => {
      expect(exportUtils.exportToSVG).toHaveBeenCalled()
    })
  })

  it('should export as JSON when JSON option is clicked', async () => {
    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const jsonButton = screen.getByText('Export as JSON')
    fireEvent.click(jsonButton)

    await waitFor(() => {
      expect(exportUtils.exportToJSON).toHaveBeenCalled()
    })
  })

  it('should copy to clipboard when clipboard option is clicked', async () => {
    vi.mocked(exportUtils.copyToClipboard).mockResolvedValueOnce()

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const clipboardButton = screen.getByText('Copy to Clipboard')
    fireEvent.click(clipboardButton)

    await waitFor(() => {
      expect(exportUtils.copyToClipboard).toHaveBeenCalled()
    })
  })

  it('should show success notification after export', async () => {
    vi.mocked(exportUtils.exportToJSON).mockReturnValueOnce()

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const jsonButton = screen.getByText('Export as JSON')
    fireEvent.click(jsonButton)

    await waitFor(() => {
      expect(screen.getByText(/successfully/i)).toBeInTheDocument()
    })
  })

  it('should show error notification on export failure', async () => {
    vi.mocked(exportUtils.exportToPNG).mockRejectedValueOnce(new Error('Export failed'))

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const pngButton = screen.getByText('Export as PNG')
    fireEvent.click(pngButton)

    await waitFor(() => {
      expect(screen.getByText(/Export failed/)).toBeInTheDocument()
    })
  })

  it('should disable button during export', async () => {
    vi.mocked(exportUtils.exportToPNG).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const pngButton = screen.getByText('Export as PNG')
    fireEvent.click(pngButton)

    await waitFor(() => {
      expect(screen.getByText(/Exporting/)).toBeInTheDocument()
    })
  })

  it('should render export selected toggle', () => {
    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    expect(screen.getByText('Export selected nodes only')).toBeInTheDocument()
  })

  it('should export selected nodes when toggle is enabled', async () => {
    mockGetNodes.mockReturnValue([
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, selected: true },
    ])

    vi.mocked(exportUtils.exportSelectedNodes).mockResolvedValueOnce()

    render(
      <ReactFlowProvider>
        <ExportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Export/ })
    fireEvent.click(button)

    const toggle = screen.getByRole('checkbox')
    fireEvent.click(toggle)

    const pngButton = screen.getByText('Export as PNG')
    fireEvent.click(pngButton)

    await waitFor(() => {
      expect(exportUtils.exportSelectedNodes).toHaveBeenCalled()
    })
  })
})
