import { memo, useState } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'

export type MediaNodeData = {
  label: string
  mediaType?: 'image' | 'video' | 'none'
  mediaUrl?: string
  thumbnailUrl?: string
  uploadState?: 'idle' | 'uploading' | 'uploaded' | 'error'
  [key: string]: unknown
}

export type MediaNodeType = Node<MediaNodeData, 'mediaNode'>

const MediaNode = ({ data, selected }: NodeProps<MediaNodeType>) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const getFileTypeIcon = (type?: string) => {
    switch (type) {
      case 'image':
        return '🖼️'
      case 'video':
        return '🎬'
      default:
        return '📄'
    }
  }

  const getUploadStateColor = (state?: string) => {
    switch (state) {
      case 'uploading':
        return 'border-yellow-400'
      case 'uploaded':
        return 'border-green-500'
      case 'error':
        return 'border-red-500'
      default:
        return 'border-gray-200'
    }
  }

  return (
    <>
      <div
        className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all ${
          selected ? 'border-blue-500 ring-2 ring-blue-200' : getUploadStateColor(data.uploadState)
        }`}
        style={{ minWidth: 200 }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500"
        />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{data.label}</span>
            <span className="text-xl">{getFileTypeIcon(data.mediaType)}</span>
          </div>

          {/* Media Preview */}
          {data.mediaUrl && data.mediaType === 'image' && (
            <div className="relative">
              <img
                src={data.mediaUrl}
                alt={data.label}
                className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setLightboxOpen(true)}
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Click to zoom
              </div>
            </div>
          )}

          {data.mediaUrl && data.mediaType === 'video' && (
            <div className="relative">
              <video
                src={data.mediaUrl}
                className="w-full h-32 object-cover rounded-md"
                controls={false}
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                type="button"
              >
                <span className="text-4xl text-white">{isPlaying ? '⏸' : '▶'}</span>
              </button>
            </div>
          )}

          {/* Thumbnail Preview */}
          {!data.mediaUrl && data.thumbnailUrl && (
            <div className="relative">
              <img
                src={data.thumbnailUrl}
                alt={`${data.label} thumbnail`}
                className="w-full h-32 object-cover rounded-md opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                <span className="text-gray-500 font-medium">Thumbnail</span>
              </div>
            </div>
          )}

          {/* Placeholder */}
          {!data.mediaUrl && !data.thumbnailUrl && (
            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-3xl mb-2">{getFileTypeIcon(data.mediaType)}</div>
                <div className="text-xs">No media</div>
              </div>
            </div>
          )}

          {/* Upload State Indicator */}
          {data.uploadState && data.uploadState !== 'idle' && (
            <div className="flex items-center gap-2">
              {data.uploadState === 'uploading' && (
                <>
                  <span className="animate-spin">⟳</span>
                  <span className="text-xs text-gray-600">Uploading...</span>
                </>
              )}
              {data.uploadState === 'uploaded' && (
                <>
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-green-600">Uploaded</span>
                </>
              )}
              {data.uploadState === 'error' && (
                <>
                  <span className="text-red-500">✗</span>
                  <span className="text-xs text-red-600">Upload failed</span>
                </>
              )}
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500"
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && data.mediaUrl && data.mediaType === 'image' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={data.mediaUrl}
            alt={data.label}
            className="max-w-[90%] max-h-[90%] object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}

export default memo(MediaNode)
