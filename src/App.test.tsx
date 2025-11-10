import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('includes save/restore controls', () => {
    render(<App />)
    expect(screen.getByText(/💾 Save/)).toBeInTheDocument()
    expect(screen.getByText(/📂 Load/)).toBeInTheDocument()
    expect(screen.getByText(/⬇️ Export/)).toBeInTheDocument()
    expect(screen.getByText(/⬆️ Import/)).toBeInTheDocument()
  })
})
