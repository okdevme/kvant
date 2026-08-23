import { describe, expect, it } from 'vitest'
import * as kvant from './index'
import { kv } from './index'

const exports = [
  '_default',
  '_enum',
  'any',
  'array',
  'looseArray',
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
  'looseSet',
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
].sort()

describe('schema API surface', () => {
  it('exposes the expected schema factories', () => {
    expect(Object.keys(kvant).sort()).toEqual([...exports, 'kv'].sort())
  })

  it('named export `kv` exposes the expected schema factories', () => {
    expect(Object.keys(kv).sort()).toEqual(exports)
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
