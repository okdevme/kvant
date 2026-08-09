import { describe, expect, it } from 'vitest'
import { isoDateToDate } from './date'
import { pipe } from './pipe'
import { string } from './string'

describe('pipe', () => {
  it('chains parse forward and encode backward', () => {
    const schema = pipe(string(), isoDateToDate())
    expect(schema.parse('2026-08-09')).toEqual(new Date('2026-08-09T00:00:00.000Z'))
    expect(schema.encode(new Date('2026-08-09T00:00:00.000Z'))).toBe('2026-08-09')
  })

  it('exposes the schema type tag', () => {
    expect(pipe(string(), isoDateToDate()).type).toBe('pipe')
  })
})
