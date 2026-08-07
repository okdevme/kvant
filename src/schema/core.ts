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

export interface KvantType<Output, Input = Output, RawInput = unknown>
  extends KvantSchema<Output, Input, RawInput> {
  readonly decode: (
    value: rawInput<this>,
  ) => output<this>

  readonly optional: () => KvantOptional<this>
  readonly nullable: () => KvantNullable<this>
  readonly nullish: () => KvantOptional<KvantNullable<this>>

  readonly array: () => KvantArray<this>

  readonly default: <
    T extends NoUndefined<output<this>>,
    Options extends KvantDefaultOptions<this, T> = KvantDefaultOptions<this, T>,
  >(
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantDefault<this, T, Options>
  readonly prefault: <
    T extends input<this>,
    Options extends KvantPrefaultOptions<this, T> = KvantPrefaultOptions<this, T>,
  >(
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantPrefault<this, T, Options>

  readonly singular: (
    index?: number | ((value: unknown[]) => number),
  ) => KvantSingular<this>

  readonly overwrite: (
    def: KvantOverwriteFn<this> | KvantOverwriteDef<this>,
  ) => this

  readonly refine: (
    check: (value: NoUndefined<output<this>>) => boolean,
    ...[fallback]: undefined extends output<this>
      ? [fallback?: output<this> | (() => output<this>)]
      : [fallback: output<this> | (() => output<this>)]
  ) => this

  readonly pipe: <
    B extends KvantSchema<any, output<this>, output<this>>,
  >(
    schema: B,
  ) => KvantPipe<this, B>

  // eslint-disable-next-line ts/method-signature-style
  transform<
    T extends output<this>,
  >(
    def: ((value: output<this>) => T)
  ): KvantPipe<this, KvantTransform<output<this>, T>>
  // eslint-disable-next-line ts/method-signature-style
  transform<
    T,
  >(
    def: KvantTransformDef<output<this>, T>
  ): KvantPipe<this, KvantTransform<output<this>, T>>

  readonly apply: <T>(
    fn: (schema: this) => T,
  ) => T
}

export const generics = {
  decode<S extends KvantGenericSchema>(this: S, value: any) {
    return this.parse(value)
  },

  optional<S extends KvantGenericSchema>(this: S) {
    return optional(this)
  },
  nullable<S extends KvantGenericSchema>(this: S) {
    return nullable(this)
  },
  nullish<S extends KvantGenericSchema>(this: S) {
    return optional(nullable(this))
  },

  array<S extends KvantGenericSchema>(this: S) {
    return array(this)
  },

  default<S extends KvantGenericSchema>(
    this: S,
    defaultValue: any,
    options: any,
  ) {
    return _default(this, defaultValue, options)
  },
  prefault<S extends KvantGenericSchema>(
    this: S,
    defaultValue: any,
    options: any,
  ) {
    return prefault(this, defaultValue, options)
  },

  singular<S extends KvantGenericSchema>(this: S, index: any) {
    return singular(this, index)
  },

  overwrite<S extends KvantGenericSchema>(this: S, def: any) {
    return overwrite(this, def)
  },

  refine<S extends KvantGenericSchema>(this: S, check: any, fallback?: any) {
    return refine(this, check, fallback)
  },

  pipe<S extends KvantGenericSchema>(this: S, schema: any) {
    return pipe(this, schema)
  },

  transform<S extends KvantGenericSchema>(this: S, def: any) {
    return pipe(this, transform<any, any>(def))
  },

  apply<S extends KvantGenericSchema>(this: S, fn: any) {
    return fn(this)
  },
} satisfies Omit<KvantType<any, any, any>, keyof KvantGenericSchema>
