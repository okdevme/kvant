import type { KvantSchemaOutput } from '../types/schema'
import type { output, rawInput } from './core'
import { describe, expectTypeOf, it } from 'vitest'
import {
  _default,
  _enum,
  array,
  boolean,
  hex,
  index,
  int,
  isoDateToDate,
  json,
  looseArray,
  looseSet,
  map,
  nullable,
  number,
  object,
  optional,
  partialRecord,
  prefault,
  record,
  set,
  singular,
  string,
  stringbool,
  tuple,
  unknown as unknownSchema,
} from './index'

describe('schema type inference', () => {
  it('infers primitive outputs', () => {
    expectTypeOf(string().parse).returns.toEqualTypeOf<string | undefined>()
    expectTypeOf(number().parse).returns.toEqualTypeOf<number | undefined>()
    expectTypeOf(boolean().parse).returns.toEqualTypeOf<boolean | undefined>()
    expectTypeOf(int().parse).returns.toEqualTypeOf<number | undefined>()
    expectTypeOf(index().parse).returns.toEqualTypeOf<number | undefined>()
    expectTypeOf(unknownSchema().parse).returns.toEqualTypeOf<unknown>()
  })

  it('infers input types distinct from output', () => {
    // isoDateToDate: Date output, string input
    expectTypeOf(isoDateToDate().parse).returns.toEqualTypeOf<Date | undefined>()
    expectTypeOf(isoDateToDate().encode).parameter(0).toEqualTypeOf<Date | undefined>()
    expectTypeOf(isoDateToDate().parse).parameter(0).toEqualTypeOf<unknown>()
  })

  it('infers hex as number output, string input', () => {
    expectTypeOf(hex().parse).returns.toEqualTypeOf<number | undefined>()
    expectTypeOf(hex().encode).parameter(0).toEqualTypeOf<number | undefined>()
  })

  it('infers stringbool as boolean output, string input', () => {
    expectTypeOf(stringbool().parse).returns.toEqualTypeOf<boolean | undefined>()
  })

  it('infers wrapper types', () => {
    expectTypeOf(optional(string()).parse).returns.toEqualTypeOf<string | undefined>()
    expectTypeOf(nullable(string()).parse).returns.toEqualTypeOf<string | null | undefined>()
    expectTypeOf(looseArray(string()).parse).returns.toEqualTypeOf<(string | undefined)[] | undefined>()
    expectTypeOf(array(string()).parse).returns.toEqualTypeOf<string[] | undefined>()
    expectTypeOf(looseSet(string()).parse).returns.toEqualTypeOf<Set<string | undefined> | undefined>()
    expectTypeOf(set(string()).parse).returns.toEqualTypeOf<Set<string> | undefined>()
    expectTypeOf(singular(string()).parse).returns.toEqualTypeOf<string | undefined>()
  })

  it('default removes undefined from the output', () => {
    expectTypeOf(_default(number(), 0).parse).returns.toEqualTypeOf<number>()
  })

  it('prefault removes undefined from the output', () => {
    expectTypeOf(prefault(number(), 0).parse).returns.toEqualTypeOf<number>()
  })

  it('enum infers a union of values', () => {
    expectTypeOf(_enum(['asc', 'desc']).parse).returns.toEqualTypeOf<'asc' | 'desc' | undefined>()
  })

  it('object infers the shape with optionality', () => {
    expectTypeOf(object({
      q: string(),
      page: _default(number(), 1),
    }).parse).returns.toEqualTypeOf<{
      q?: string | undefined
      page: number
    } | undefined>()
  })

  it('object pick/omit narrow the shape', () => {
    const base = object({ a: string(), b: number() })
    expectTypeOf(base.pick({ a: true }).parse).returns.toEqualTypeOf<{ a?: string | undefined } | undefined>()
    expectTypeOf(base.omit({ a: true }).parse).returns.toEqualTypeOf<{ b?: number | undefined } | undefined>()
  })

  it('record infers key/value types', () => {
    expectTypeOf(record(string(), number()).parse).returns.toEqualTypeOf<Record<string, number | undefined> | undefined>()
  })

  it('partialRecord makes values optional', () => {
    expectTypeOf(partialRecord(_enum(['a', 'b']), number()).parse).returns.toEqualTypeOf<Partial<Record<'a' | 'b', number | undefined>> | undefined>()
  })

  it('map infers Map output', () => {
    expectTypeOf(map(string(), number()).parse).returns.toEqualTypeOf<Map<string, number> | undefined>()
  })

  it('json infers the inner output with string input', () => {
    expectTypeOf(json(object({ count: number() })).parse).returns.toEqualTypeOf<{ count?: number | undefined } | undefined>()
  })

  it('tuple infers per-position types', () => {
    // trailing schemas with undefined output become optional tuple elements,
    // cascading to earlier positions
    expectTypeOf(tuple([string(), number()]).parse).returns.toEqualTypeOf<[(string | undefined)?, (number | undefined)?] | undefined>()
  })

  it('fluent combinators preserve types', () => {
    expectTypeOf(number().default(0).nullable().parse).returns.toEqualTypeOf<number | null>()
  })

  it('rawInput reflects the raw storage type', () => {
    expectTypeOf<rawInput<ReturnType<typeof array<ReturnType<typeof string>>>>>().toEqualTypeOf<unknown>()
  })

  it('KvantSchemaOutput aliases output', () => {
    expectTypeOf<KvantSchemaOutput<ReturnType<typeof number>>>().toEqualTypeOf<number | undefined>()
    expectTypeOf<output<ReturnType<typeof number>>>().toEqualTypeOf<number | undefined>()
  })
})
