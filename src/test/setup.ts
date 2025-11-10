import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Mock ResizeObserver for React Flow
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock DOMMatrixReadOnly for React Flow
// @ts-expect-error - DOMMatrixReadOnly is not available in jsdom
globalThis.DOMMatrixReadOnly = class DOMMatrixReadOnly {
  m22: number
  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1]
    this.m22 = scale !== undefined ? +scale : 1
  }
}

// Cleanup after each test
afterEach(() => {
  cleanup()
})
