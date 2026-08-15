import { describe, expect, it } from 'vitest'
import { base64, base64url, string, uriComponent } from './string'

describe('string', () => {
  it('parses primitives to strings', () => {
    expect(string().parse('abc')).toBe('abc')
    expect(string().parse(42)).toBe('42')
    expect(string().parse(true)).toBe('true')
  })

  it('parses nullish and arrays to undefined', () => {
    expect(string().parse(undefined)).toBeUndefined()
    expect(string().parse(null)).toBeUndefined()
    expect(string().parse(['a'])).toBeUndefined()
  })

  it('parses plain objects to undefined ([object Object])', () => {
    expect(string().parse({})).toBeUndefined()
  })

  it('encodes unchanged', () => {
    expect(string().encode('abc')).toBe('abc')
  })

  it('validates length constraints', () => {
    expect(string().min(2).parse('a')).toBeUndefined()
    expect(string().min(2).parse('ab')).toBe('ab')
    expect(string().nonempty().parse('')).toBeUndefined()
    expect(string().nonempty().parse('a')).toBe('a')
    expect(string().max(2).parse('abc')).toBeUndefined()
    expect(string().length(2).parse('ab')).toBe('ab')
    expect(string().length(2).parse('abc')).toBeUndefined()
  })

  it('validates content constraints', () => {
    expect(string().startsWith('a').parse('abc')).toBe('abc')
    expect(string().startsWith('a').parse('xbc')).toBeUndefined()
    expect(string().endsWith('c').parse('abc')).toBe('abc')
    expect(string().includes('b').parse('abc')).toBe('abc')
    expect(string().includes('z').parse('abc')).toBeUndefined()
  })

  it('regex constraint must not throw', () => {
    expect(string().regex(/^\d+$/).parse('123')).toBe('123')
  })

  it('validates case constraints', () => {
    expect(string().uppercase().parse('ABC')).toBe('ABC')
    expect(string().uppercase().parse('aBC')).toBeUndefined()
    expect(string().lowercase().parse('abc')).toBe('abc')
    expect(string().lowercase().parse('aBc')).toBeUndefined()
  })

  it('applies case/whitespace transforms', () => {
    expect(string().trim().parse('  a  ')).toBe('a')
    expect(string().toLowerCase().parse('AbC')).toBe('abc')
    expect(string().toUpperCase().parse('aBc')).toBe('ABC')
    expect(string().normalize().parse('café')).toBe('café')
  })

  it('slices', () => {
    expect(string().slice(0, 2).parse('abcd')).toBe('ab')
  })

  it('exposes the schema type tag', () => {
    expect(string().type).toBe('string')
  })
})

describe('uriComponent', () => {
  it('roundtrips URI-unsafe strings', () => {
    const schema = uriComponent()
    const value = 'a b&c=d?e'
    expect(schema.encode(value)).toBe(encodeURIComponent(value))
    expect(schema.parse(encodeURIComponent(value))).toBe(value)
  })

  it('parses malformed escapes to undefined', () => {
    expect(uriComponent().parse('%E0%A4%A')).toBeUndefined()
  })
})

describe('base64', () => {
  it('roundtrips', () => {
    const schema = base64()
    expect(schema.encode('hello')).toBe(btoa('hello'))
    expect(schema.parse(btoa('hello'))).toBe('hello')
  })

  it('parses invalid base64 to undefined', () => {
    expect(base64().parse('%%%')).toBeUndefined()
  })
})

describe('base64url', () => {
  it('roundtrips URL-safe base64', () => {
    const schema = base64url()
    const value = 'subjects?_d'
    expect(schema.parse(schema.encode(value))).toBe(value)
    expect(schema.encode(value)).not.toMatch(/[+/=]/)
  })

  it('parses unpadded base64url', () => {
    expect(base64url().parse('aGVsbG8')).toBe('hello')
  })

  it('parses invalid input to undefined', () => {
    expect(base64url().parse('%%%')).toBeUndefined()
  })
})
