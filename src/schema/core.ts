import type {
  KvantGenericSchema,
  KvantSchema,
  KvantSchemaInput,
  KvantSchemaOutput,
  KvantSchemaRawInput,
} from '../types/schema'
import type { NoUndefined } from '../utils/types'
import type { KvantArray } from './array'
import type { KvantDefault, KvantDefaultOptions, KvantPrefault, KvantPrefaultOptions } from './default'
import type { KvantNullable } from './nullable'
import type { KvantOptional } from './optional'
import type { KvantOverwriteDef, KvantOverwriteFn } from './overwrite'
import type { KvantPipe } from './pipe'
import type { KvantSingular } from './singular'
import type { KvantTransform, KvantTransformDef } from './transform'
import { array } from './array'
import { _default, prefault } from './default'
import { nullable } from './nullable'
import { optional } from './optional'
import { overwrite } from './overwrite'
import { pipe } from './pipe'
import { refine } from './refine'
import { singular } from './singular'
import { transform } from './transform'

export type output<S extends KvantGenericSchema>
  = KvantSchemaOutput<S>

export type input<S extends KvantGenericSchema>
  = KvantSchemaInput<S>

export type rawInput<S extends KvantGenericSchema>
  = KvantSchemaRawInput<S>

export interface KvantTypeGenerics {
  readonly decode: <S extends KvantGenericSchema>(
    this: S,
    value: rawInput<S>,
  ) => output<S>

  readonly optional: <S extends KvantGenericSchema>(this: S) => KvantOptional<S>
  readonly nullable: <S extends KvantGenericSchema>(this: S) => KvantNullable<S>
  readonly nullish: <S extends KvantGenericSchema>(this: S) => KvantOptional<KvantNullable<S>>

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
    def: KvantOverwriteFn<S> | KvantOverwriteDef<S>,
  ) => S

  readonly refine: <S extends KvantGenericSchema>(
    this: S,
    check: (value: NoUndefined<output<S>>) => boolean,
    ...[fallback]: undefined extends output<S>
      ? [fallback?: output<S> | (() => output<S>)]
      : [fallback: output<S> | (() => output<S>)]
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

  readonly apply: <S extends KvantGenericSchema, T>(
    this: S,
    fn: (schema: S) => T,
  ) => T
}

export interface KvantType<Output, Input = Output, RawInput = unknown>
  extends KvantSchema<Output, Input, RawInput>, KvantTypeGenerics {
  readonly type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'stringbool'
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
    | 'hexToInt'
    | 'custom'
    | 'isoToDate'
    | 'epochToDate'
    | 'object'
    | 'array'
    | 'enum'
    | 'tuple'
    | 'record'
    | 'map'
    | 'set'
}

export const generics: KvantTypeGenerics = {
  decode(value) {
    return this.parse(value)
  },

  optional() {
    return optional(this)
  },
  nullable() {
    return nullable(this)
  },
  nullish() {
    return optional(nullable(this))
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

  overwrite(def) {
    return overwrite(this, def)
  },

  // @ts-expect-error dynamic type unresolvable by TS
  refine(...args) {
    return refine(this, ...args)
  },

  pipe(schema) {
    return pipe(this, schema)
  },

  transform(def) {
    return pipe(this, transform(def))
  },

  apply(fn) {
    return fn(this)
  },
}

export type KvantGenericType = KvantType<any, any, any>
