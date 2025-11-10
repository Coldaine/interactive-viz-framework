import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReactFlowProvider } from '@xyflow/react'
import MediaNode from './MediaNode'

describe('MediaNode', () => {
  it('renders with label', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test Media' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Test Media')).toBeInTheDocument()
  })

  it('displays image icon for image type', () => {
    const { container } = render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test', mediaType: 'image' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(container.textContent).toContain('🖼️')
  })

  it('displays video icon for video type', () => {
    const { container } = render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test', mediaType: 'video' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(container.textContent).toContain('🎬')
  })

  it('renders image preview', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            mediaType: 'image',
            mediaUrl: 'https://example.com/image.jpg',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    const img = screen.getByAltText('Test')
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('opens lightbox on image click', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            mediaType: 'image',
            mediaUrl: 'https://example.com/image.jpg',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const img = screen.getByAltText('Test')
    fireEvent.click(img)

    const lightboxImages = screen.getAllByAltText('Test')
    expect(lightboxImages).toHaveLength(2)
  })

  it('closes lightbox on background click', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            mediaType: 'image',
            mediaUrl: 'https://example.com/image.jpg',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const img = screen.getByAltText('Test')
    fireEvent.click(img)

    let lightboxImages = screen.getAllByAltText('Test')
    expect(lightboxImages).toHaveLength(2)

    const lightbox = lightboxImages[1].closest('.fixed')
    if (lightbox) {
      fireEvent.click(lightbox)
    }

    lightboxImages = screen.getAllByAltText('Test')
    expect(lightboxImages).toHaveLength(1)
  })

  it('renders video with play button', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            mediaType: 'video',
            mediaUrl: 'https://example.com/video.mp4',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const video = screen.getByRole('button')
    expect(video).toBeInTheDocument()
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('toggles play/pause state', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            mediaType: 'video',
            mediaUrl: 'https://example.com/video.mp4',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const playButton = screen.getByRole('button')
    expect(screen.getByText('▶')).toBeInTheDocument()

    fireEvent.click(playButton)
    expect(screen.getByText('⏸')).toBeInTheDocument()

    fireEvent.click(playButton)
    expect(screen.getByText('▶')).toBeInTheDocument()
  })

  it('renders thumbnail when no media URL', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{
            label: 'Test',
            thumbnailUrl: 'https://example.com/thumb.jpg',
          }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )

    const thumbnail = screen.getByAltText('Test thumbnail')
    expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    expect(screen.getByText('Thumbnail')).toBeInTheDocument()
  })

  it('renders placeholder when no media', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('No media')).toBeInTheDocument()
  })

  it('shows uploading state', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test', uploadState: 'uploading' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Uploading...')).toBeInTheDocument()
  })

  it('shows uploaded state', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test', uploadState: 'uploaded' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Uploaded')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test', uploadState: 'error' }}
          selected={false}
          type="mediaNode"
          isConnectable={true}
          zIndex={0}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          dragging={false}
        />
      </ReactFlowProvider>
    )
    expect(screen.getByText('Upload failed')).toBeInTheDocument()
  })

  it('applies selection styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <MediaNode
          id="1"
          data={{ label: 'Test' }}
          selected={true}
          type="mediaNode"
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
