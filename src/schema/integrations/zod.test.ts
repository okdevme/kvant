import { describe, expect, it, vi } from 'vitest'
// @vitest-environment happy-dom
// Covers docs/content/docs/_shared/_zod.mdx examples.
import * as z from 'zod'
import { safeEncode, safeParse } from '../../utils/schema'
import { uriComponent } from '../string'

describe('zod: the golden rule (never throw)', () => {
  it('zod parse throws on invalid input', () => {
    const schema = z.coerce.number()
    expect(() => schema.parse('abc')).toThrow()
  })

  it('kvant recovers a throwing zod schema via safeParse (console.error + undefined)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const schema = z.coerce.number()
    expect(safeParse(schema, 'abc')).toBeUndefined()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('.catch() makes zod total: valid parses, invalid falls back', () => {
    const schema = z.coerce.number().min(1).catch(1)
    expect(safeParse(schema, '5')).toBe(5)
    expect(safeParse(schema, 'abc')).toBe(1)
    expect(safeParse(schema, '0')).toBe(1)
  })
})

describe('zod: codecs', () => {
  // Doc example: ISO string in storage, Date in state.
  const dateCodec = z.codec(
    z.iso.datetime().optional().catch(undefined),
    z.date().optional(),
    {
      decode: iso => (iso != null ? new Date(iso) : undefined),
      encode: date => date?.toISOString(),
    },
  )

  it('decodes stored ISO strings to Date', () => {
    expect(safeParse(dateCodec, '2026-08-16T10:00:00.000Z'))
      .toEqual(new Date('2026-08-16T10:00:00.000Z'))
  })

  it('decodes undefined/invalid to undefined without throwing', () => {
    expect(safeParse(dateCodec, undefined)).toBeUndefined()
    expect(safeParse(dateCodec, 'not-a-date')).toBeUndefined()
  })

  it('encodes Date back to ISO string (roundtrip)', () => {
    const date = new Date('2026-08-16T10:00:00.000Z')
    expect(safeEncode(dateCodec, date)).toBe('2026-08-16T10:00:00.000Z')
    expect(safeParse(dateCodec, safeEncode(dateCodec, date))).toEqual(date)
  })
})

describe('zod: mixing kvant/schema and zod via .pipe()', () => {
  // Doc example: kv.uriComponent().pipe(z.email().optional().catch(undefined))
  const uriToEmail = uriComponent().pipe(
    z.email().optional().catch(undefined),
  )

  it('parses URI-encoded valid emails', () => {
    expect(uriToEmail.parse('user%40example.com')).toBe('user@example.com')
  })

  it('falls back to undefined for invalid emails', () => {
    expect(uriToEmail.parse('not-an-email')).toBeUndefined()
  })

  it('encodes in reverse through the chain', () => {
    expect(uriToEmail.encode('user@example.com')).toBe('user%40example.com')
  })
})
