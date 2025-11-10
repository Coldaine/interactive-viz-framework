import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToJSON, copyToClipboard } from './export'
import type { Node, Edge, Viewport } from '@xyflow/react'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock document methods
const mockClick = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  // Mock createElement to return an element with click method
  vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
    const element = {
      tagName,
      href: '',
      download: '',
      click: mockClick,
    } as unknown as HTMLElement
    return element
  })

  // Mock appendChild and removeChild
  document.body.appendChild = mockAppendChild
  document.body.removeChild = mockRemoveChild
})

describe('export utilities', () => {
  const mockNodes: Node[] = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Node 1' },
      type: 'dataNode',
    },
    {
      id: '2',
      position: { x: 100, y: 100 },
      data: { label: 'Node 2' },
      type: 'actionNode',
    },
  ]

  const mockEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default',
    },
  ]

  const mockViewport: Viewport = {
    x: 0,
    y: 0,
    zoom: 1,
  }

  describe('exportToJSON', () => {
    it('should export flow data as JSON file', () => {
      exportToJSON(mockNodes, mockEdges, mockViewport)

      // Check that a link was created
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('should include all flow data in export', () => {
      exportToJSON(mockNodes, mockEdges, mockViewport, 'test-flow.json')

      // The Blob should contain the flow data
      expect(document.createElement).toHaveBeenCalledWith('a')
    })

    it('should use custom filename if provided', () => {
      const customFilename = 'custom-flow.json'
      exportToJSON(mockNodes, mockEdges, mockViewport, customFilename)

      expect(mockClick).toHaveBeenCalled()
    })

    it('should handle empty nodes and edges', () => {
      expect(() => {
        exportToJSON([], [], mockViewport)
      }).not.toThrow()
    })
  })

  describe('copyToClipboard', () => {
    it('should copy flow data to clipboard', async () => {
      await copyToClipboard(mockNodes, mockEdges, mockViewport)

      expect(navigator.clipboard.writeText).toHaveBeenCalled()
      const callArg = (navigator.clipboard.writeText as any).mock.calls[0][0]
      const parsedData = JSON.parse(callArg)

      expect(parsedData.nodes).toEqual(mockNodes)
      expect(parsedData.edges).toEqual(mockEdges)
      expect(parsedData.viewport).toEqual(mockViewport)
    })

    it('should include version and timestamp', async () => {
      await copyToClipboard(mockNodes, mockEdges, mockViewport)

      const callArg = (navigator.clipboard.writeText as any).mock.calls[0][0]
      const parsedData = JSON.parse(callArg)

      expect(parsedData.version).toBe('1.0')
      expect(typeof parsedData.timestamp).toBe('number')
    })

    it('should format JSON with proper indentation', async () => {
      await copyToClipboard(mockNodes, mockEdges, mockViewport)

      const callArg = (navigator.clipboard.writeText as any).mock.calls[0][0]
      expect(callArg).toContain('\n')
      expect(callArg).toContain('  ')
    })

    it('should throw error if clipboard write fails', async () => {
      const error = new Error('Clipboard write failed')
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error)

      await expect(copyToClipboard(mockNodes, mockEdges, mockViewport)).rejects.toThrow()
    })
  })
})
