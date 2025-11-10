import { memo, useState, useEffect, useRef } from 'react'
import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

export type CodeNodeData = {
  label: string
  code?: string
  language?: 'javascript' | 'typescript' | 'python' | 'jsx' | 'tsx' | 'markup'
  theme?: 'light' | 'dark'
  showLineNumbers?: boolean
  [key: string]: unknown
}

export type CodeNodeType = Node<CodeNodeData, 'codeNode'>

const CodeNode = ({ data, selected }: NodeProps<CodeNodeType>) => {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(data.language || 'javascript')
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current && data.code) {
      Prism.highlightElement(codeRef.current)
    }
  }, [data.code, selectedLanguage, expanded])

  const handleCopy = async () => {
    if (data.code) {
      await navigator.clipboard.writeText(data.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const languages = ['javascript', 'typescript', 'python', 'jsx', 'tsx', 'markup']

  const getLanguageClass = () => {
    return `language-${selectedLanguage}`
  }

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      style={{ minWidth: 200, maxWidth: expanded ? 500 : 200 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{data.label}</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-500 hover:text-blue-700"
            type="button"
          >
            {expanded ? '▼' : '▶'}
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as CodeNodeData['language'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-600 hover:text-gray-900 ml-auto"
            type="button"
            disabled={!data.code}
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {/* Code Block */}
        {data.code && (
          <div
            className={`relative rounded ${data.theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}
            style={{
              maxHeight: expanded ? '400px' : '100px',
              overflow: 'auto',
            }}
          >
            <pre
              className={`!m-0 !p-3 text-xs ${data.showLineNumbers ? 'line-numbers' : ''}`}
              style={{ background: 'transparent' }}
            >
              <code ref={codeRef} className={getLanguageClass()}>
                {data.code}
              </code>
            </pre>
          </div>
        )}

        {/* No Code Placeholder */}
        {!data.code && (
          <div className="bg-gray-100 rounded p-4 text-center text-gray-400 text-xs">
            No code to display
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  )
}

export default memo(CodeNode)
