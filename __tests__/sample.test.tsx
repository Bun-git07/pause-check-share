import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Sample Test Suite', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2)
  })

  it('renders a simple element', () => {
    render(<div data-testid="test-element">Hello Chascheck</div>)
    expect(screen.getByTestId('test-element')).toHaveTextContent('Hello Chascheck')
  })
})
