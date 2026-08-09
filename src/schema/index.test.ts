import { describe, expect, it } from 'vitest'
import * as kvant from './index'

describe('schema API surface', () => {
  it('exposes the expected schema factories', () => {
    expect(Object.keys(kvant).sort()).toEqual([
      '_default',
      '_enum',
      'any',
      'array',
      'base64',
      'base64url',
      'boolean',
      'custom',
      'enum',
      'epochMillisToDate',
      'epochSecondsToDate',
      'hex',
      'index',
      'int',
      'isoDateToDate',
      'isoDatetimeToDate',
      'isoYearMonthToDate',
      'isoYearToDate',
      'json',
      'looseObject',
      'map',
      'nullable',
      'number',
      'object',
      'optional',
      'overwrite',
      'partialRecord',
      'pipe',
      'prefault',
      'preprocess',
      'record',
      'refine',
      'set',
      'singular',
      'string',
      'stringbool',
      'transform',
      'tuple',
      'unknown',
      'uriComponent',
    ].sort())
  })

  it('every schema carries the fluent KvantType combinators', () => {
    const combinators = [
      'decode',
      'optional',
      'nullable',
      'nullish',
      'array',
      'default',
      'prefault',
      'singular',
      'overwrite',
      'refine',
      'pipe',
      'transform',
      'apply',
    ]
    for (const key of combinators) {
      expect(typeof (kvant.string() as any)[key], key).toBe('function')
    }
  })
})
