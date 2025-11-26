import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4 py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-4', false && 'hidden', 'py-2')).toBe('px-4 py-2')
  })

  it('should merge conflicting tailwind classes correctly', () => {
    // tailwind-merge should keep the last conflicting class
    expect(cn('px-2 px-4')).toBe('px-4')
  })

  it('should handle undefined and null values', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('should handle array of classes', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2')
  })
})
