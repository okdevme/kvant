import { describe, expect, it } from 'vitest'
import { boolean, stringbool } from './boolean'

describe('boolean', () => {
  it('parses undefined to undefined', () => {
    expect(boolean().parse(undefined)).toBeUndefined()
  })

  it('parses via Boolean coercion', () => {
    const schema = boolean()
    expect(schema.parse('false')).toBe(true)
    expect(schema.parse('')).toBe(false)
    expect(schema.parse(1)).toBe(true)
    expect(schema.parse(0)).toBe(false)
  })

  it('encodes unchanged', () => {
    expect(boolean().encode(true)).toBe(true)
    expect(boolean().encode(false)).toBe(false)
  })

  it('exposes the schema type tag', () => {
    expect(boolean().type).toBe('boolean')
  })
})

describe('stringbool', () => {
  it('parses default truthy/falsy values', () => {
    const schema = stringbool()
    expect(schema.parse('true')).toBe(true)
    expect(schema.parse('1')).toBe(true)
    expect(schema.parse('yes')).toBe(true)
    expect(schema.parse('on')).toBe(true)
    expect(schema.parse('enabled')).toBe(true)
    expect(schema.parse('false')).toBe(false)
    expect(schema.parse('0')).toBe(false)
    expect(schema.parse('no')).toBe(false)
    expect(schema.parse('off')).toBe(false)
    expect(schema.parse('disabled')).toBe(false)
  })

  it('is case-insensitive by default', () => {
    expect(stringbool().parse('TRUE')).toBe(true)
    expect(stringbool().parse('False')).toBe(false)
  })

  it('respects case sensitivity', () => {
    const schema = stringbool({ case: 'sensitive' })
    expect(schema.parse('TRUE')).toBeUndefined()
    expect(schema.parse('true')).toBe(true)
  })

  it('parses unknown strings to undefined', () => {
    expect(stringbool().parse('maybe')).toBeUndefined()
  })

  it('encodes to the first truthy/falsy entry', () => {
    expect(stringbool().encode(true)).toBe('true')
    expect(stringbool().encode(false)).toBe('false')
    expect(stringbool().encode(undefined)).toBeUndefined()
  })

  it('encodes using custom entry sets', () => {
    const schema = stringbool({ truthy: ['y'], falsy: ['n'] })
    expect(schema.encode(true)).toBe('y')
    expect(schema.encode(false)).toBe('n')
    expect(schema.parse('y')).toBe(true)
    expect(schema.parse('true')).toBeUndefined()
  })

  it('roundtrips', () => {
    const schema = stringbool()
    expect(schema.parse(schema.encode(true))).toBe(true)
    expect(schema.parse(schema.encode(false))).toBe(false)
  })

  it('exposes the schema type tag', () => {
    expect(stringbool().type).toBe('stringbool')
  })
})
