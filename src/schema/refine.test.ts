import { describe, expect, it } from 'vitest'
import { number } from './number'
import { refine } from './refine'

describe('refine', () => {
  it('keeps values passing the check', () => {
    const schema = refine(number(), v => v > 0)
    expect(schema.parse('3')).toBe(3)
  })

  it('falls back to undefined by default', () => {
    const schema = refine(number(), v => v > 0)
    expect(schema.parse('-3')).toBeUndefined()
  })

  it('supports an explicit fallback value', () => {
    const schema = refine(number(), v => v > 0, 0)
    expect(schema.parse('-3')).toBe(0)
  })

  it('supports a fallback factory', () => {
    let i = 0
    const schema = refine(number(), v => v > 0, () => ++i)
    expect(schema.parse('-1')).toBe(1)
    expect(schema.parse('-2')).toBe(2)
  })

  it('applies the check after encoding too', () => {
    const schema = refine(number(), v => v > 0)
    expect(schema.encode(-3)).toBeUndefined()
  })
})
