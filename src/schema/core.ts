import type { KvantSchema } from '../types'
import type { KvantArray } from './array'
import type { KvantDefault, KvantDefaultOptions, KvantPrefault, KvantPrefaultOptions } from './default'
import type { KvantJSON, KvantJSONOptions } from './json'
import type { KvantNullable } from './nullable'
import type { KvantOptional } from './optional'
import type { KvantPipe } from './pipe'
import type { KvantSingular } from './singular'
import type { KvantTransform, KvantTransformDef } from './transform'
import type { NoUndefined } from './utils'
import { array } from './array'
import { _default, prefault } from './default'
import { json } from './json'
import { nullable } from './nullable'
import { optional } from './optional'
import { overwrite } from './overwrite'
import { pipe } from './pipe'
import { singular } from './singular'
import { transform } from './transform'

export type KvantGenericSchema<RawInput = any> = KvantSchema<any, any, RawInput>

export type output<S extends KvantGenericSchema>
  = S extends KvantSchema<infer Output, any, any>
    ? Output
    : never

export type input<S extends KvantGenericSchema>
  = S extends KvantSchema<any, infer Input, any>
    ? Input
    : never

export type rawInput<S extends KvantGenericSchema>
  = S extends KvantSchema<any, any, infer RawInput>
    ? RawInput
    : never

export interface KvantTypeGenerics {
  readonly optional: <S extends KvantGenericSchema>(this: S) => KvantOptional<S>
  readonly nullable: <S extends KvantGenericSchema>(this: S) => KvantNullable<S>
  readonly array: <S extends KvantGenericSchema>(this: S) => KvantArray<S>

  readonly default: <
    S extends KvantGenericSchema,
    T extends NoUndefined<output<S>>,
    Options extends KvantDefaultOptions<S, T> = KvantDefaultOptions<S, T>,
  >(
    this: S,
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantDefault<S, T, Options>
  readonly prefault: <
    S extends KvantGenericSchema,
    T extends input<S>,
    Options extends KvantPrefaultOptions<S, T> = KvantPrefaultOptions<S, T>,
  >(
    this: S,
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantPrefault<S, T, Options>

  readonly singular: <S extends KvantGenericSchema>(
    this: S,
    index?: number | ((value: unknown[]) => number),
  ) => KvantSingular<S>

  readonly overwrite: <S extends KvantGenericSchema>(
    this: S,
    fn: (value: output<S>) => output<S>,
  ) => S

  readonly pipe: <
    A extends KvantGenericSchema,
    B extends KvantSchema<any, output<A>, output<A>>,
  >(
    this: A,
    schema: B,
  ) => KvantPipe<A, B>

  readonly transform: <
    S extends KvantGenericSchema,
    Output,
  >(
    this: S,
    def: KvantTransformDef<output<S>, Output>,
  ) => KvantPipe<S, KvantTransform<output<S>, Output>>

  readonly json: <S extends KvantGenericSchema>(
    this: S,
    options?: KvantJSONOptions,
  ) => KvantPipe<KvantJSON, S>
}

export interface KvantType<Output, Input = Output, RawInput = unknown>
  extends KvantSchema<Output, Input, RawInput>, KvantTypeGenerics {
  readonly type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'any'
    | 'unknown'
    | 'optional'
    | 'nullable'
    | 'default'
    | 'prefault'
    | 'singular'
    | 'pipe'
    | 'transform'
    | 'json'
    | 'custom'
    | 'date'
    | 'object'
    | 'array'
}

export const generics: KvantTypeGenerics = {
  optional() {
    return optional(this)
  },
  nullable() {
    return nullable(this)
  },
  array() {
    return array(this)
  },

  default(defaultValue, options) {
    return _default(this, defaultValue, options)
  },
  prefault(defaultValue, options) {
    return prefault(this, defaultValue, options)
  },

  singular(index) {
    return singular(this, index)
  },

  overwrite(fn) {
    return overwrite(this, fn)
  },

  pipe(schema) {
    return pipe(this, schema)
  },

  transform(def) {
    return pipe(this, transform(def))
  },

  json(options) {
    return pipe(json(options), this)
  },
}
