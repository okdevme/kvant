import { describe, expect, it, vi } from 'vitest'
import { noopSchema, safeEncode, safeParse } from './schema'

describe('noopSchema', () => {
  it('passes values through in both directions', () => {
    const schema = noopSchema<string | undefined>()
    expect(schema.parse('x')).toBe('x')
    expect(schema.encode('x')).toBe('x')
    expect(schema.parse(undefined)).toBeUndefined()
  })
})

describe('safeParse / safeEncode', () => {
  it('returns the schema result for well-behaved schemas', () => {
    const schema = { parse: (v: unknown) => Number(v), encode: (v: number) => String(v) }
    expect(safeParse(schema, '42')).toBe(42)
    expect(safeEncode(schema, 42)).toBe('42')
  })

  it('catches parse throws, logs and returns undefined', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const schema = {
      parse: () => { throw new Error('boom') },
      encode: (v: unknown) => v,
    }
    expect(safeParse(schema, 'x')).toBeUndefined()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('catches encode throws, logs and returns undefined', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const schema = {
      parse: (v: unknown) => v,
      encode: () => { throw new Error('boom') },
    }
    expect(safeEncode(schema, 'x')).toBeUndefined()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('warns about the no-throw contract in development', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const schema = {
      parse: () => { throw new Error('boom') },
      encode: (v: unknown) => v,
    }
    safeParse(schema, 'x')
    const messages = error.mock.calls.flat().join(' ')
    expect(messages).toContain('must not throw')
    error.mockRestore()
  })
})
