import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import ImportMenu from './ImportMenu'
import * as flowStorage from '../utils/flowStorage'

// Mock validateFlowJSON
vi.mock('../utils/flowStorage', async () => {
  const actual = await vi.importActual('../utils/flowStorage')
  return {
    ...actual,
    validateFlowJSON: vi.fn(),
  }
})

// Mock useReactFlow hook
const mockSetNodes = vi.fn()
const mockSetEdges = vi.fn()
const mockSetViewport = vi.fn()
const mockGetNodes = vi.fn()
const mockGetEdges = vi.fn()

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react')
  return {
    ...actual,
    useReactFlow: () => ({
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      setViewport: mockSetViewport,
      getNodes: mockGetNodes,
      getEdges: mockGetEdges,
    }),
  }
})

// Mock FileReader
class MockFileReader {
  result: string | null = null
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null
  onerror: (() => void) | null = null

  readAsText(file: File) {
    setTimeout(() => {
      if (this.onload) {
        const mockFlowData = {
          nodes: [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Test' } }],
          edges: [{ id: 'e1-2', source: '1', target: '2' }],
          viewport: { x: 0, y: 0, zoom: 1 },
          version: '1.0',
          timestamp: Date.now(),
        }
        this.result = JSON.stringify(mockFlowData)
        this.onload({ target: this } as ProgressEvent<FileReader>)
      }
    }, 0)
  }
}

global.FileReader = MockFileReader as any

describe('ImportMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetNodes.mockReturnValue([])
    mockGetEdges.mockReturnValue([])
    vi.mocked(flowStorage.validateFlowJSON).mockReturnValue({
      valid: true,
      errors: [],
    })
  })

  it('should render import button', () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    expect(screen.getByText(/Import/)).toBeInTheDocument()
  })

  it('should open menu when button is clicked', () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    expect(screen.getByText('Drop JSON file here')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
  })

  it('should close menu when clicking outside', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    expect(screen.getByText('Drop JSON file here')).toBeInTheDocument()

    // Click outside
    fireEvent.mouseDown(document.body)

    await waitFor(() => {
      expect(screen.queryByText('Drop JSON file here')).not.toBeInTheDocument()
    })
  })

  it('should validate file on selection', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()

    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(flowStorage.validateFlowJSON).toHaveBeenCalled()
    })
  })

  it('should show preview after successful validation', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })
  })

  it('should show validation errors for invalid file', async () => {
    vi.mocked(flowStorage.validateFlowJSON).mockReturnValueOnce({
      valid: false,
      errors: [
        { field: 'nodes', message: 'Nodes must be an array' },
        { field: 'edges', message: 'Edges must be an array' },
      ],
    })

    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Validation Errors/)).toBeInTheDocument()
      expect(screen.getByText(/Nodes must be an array/)).toBeInTheDocument()
    })
  })

  it('should have replace and merge import modes', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Replace current flow')).toBeInTheDocument()
      expect(screen.getByText('Merge with current flow')).toBeInTheDocument()
    })
  })

  it('should replace flow when import is clicked in replace mode', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    const importButton = screen.getByRole('button', { name: /^Import$/ })
    fireEvent.click(importButton)

    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled()
      expect(mockSetEdges).toHaveBeenCalled()
      expect(mockSetViewport).toHaveBeenCalled()
    })
  })

  it('should merge flow when import is clicked in merge mode', async () => {
    mockGetNodes.mockReturnValue([
      { id: 'existing', position: { x: 0, y: 0 }, data: { label: 'Existing' } },
    ])
    mockGetEdges.mockReturnValue([
      { id: 'e-existing', source: 'existing', target: '1' },
    ])

    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    // Switch to merge mode
    const mergeRadio = screen.getByLabelText('Merge with current flow')
    fireEvent.click(mergeRadio)

    const importButton = screen.getByRole('button', { name: /^Import$/ })
    fireEvent.click(importButton)

    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled()
      const nodesCall = mockSetNodes.mock.calls[0][0]
      expect(nodesCall.length).toBeGreaterThan(1) // Should have existing + new nodes
    })
  })

  it('should call onImport callback when provided', async () => {
    const onImport = vi.fn()

    render(
      <ReactFlowProvider>
        <ImportMenu onImport={onImport} />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    const importButton = screen.getByRole('button', { name: /^Import$/ })
    fireEvent.click(importButton)

    await waitFor(() => {
      expect(onImport).toHaveBeenCalled()
    })
  })

  it('should show success notification after import', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    const importButton = screen.getByRole('button', { name: /^Import$/ })
    fireEvent.click(importButton)

    await waitFor(() => {
      expect(screen.getByText(/Imported/)).toBeInTheDocument()
    })
  })

  it('should cancel import when cancel button is clicked', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const fileInput = screen.getByRole('button', { name: 'Choose File' }).parentElement?.querySelector('input[type="file"]')
    const file = new File(['{}'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Preview')).not.toBeInTheDocument()
    })
  })

  it('should handle drag and drop', async () => {
    render(
      <ReactFlowProvider>
        <ImportMenu />
      </ReactFlowProvider>
    )

    const button = screen.getByRole('button', { name: /Import/ })
    fireEvent.click(button)

    const dropZone = screen.getByText('Drop JSON file here').parentElement!

    // Simulate drag enter
    fireEvent.dragEnter(dropZone)

    // Simulate drop
    const file = new File([JSON.stringify({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })], 'test.json', { type: 'application/json' })
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })

    await waitFor(() => {
      expect(flowStorage.validateFlowJSON).toHaveBeenCalled()
    })
  })
})
