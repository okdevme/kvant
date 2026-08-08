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

/** Infers the state output type of a schema. */
export type output<S extends KvantGenericSchema>
  = KvantSchemaOutput<S>

/** Infers the stored input type of a schema. */
export type input<S extends KvantGenericSchema>
  = KvantSchemaInput<S>

/** Infers the raw storage type a schema parses from. */
export type rawInput<S extends KvantGenericSchema>
  = KvantSchemaRawInput<S>

/**
 * Fluent schema interface. All kvant schemas extend it,
 * exposing chainable wrappers and combinators.
 */
export interface KvantType<Output, Input = Output, RawInput = unknown>
  extends KvantSchema<Output, Input, RawInput> {
  /** Parses a raw storage value into typed state. Alias of `parse`. */
  readonly decode: (
    value: rawInput<this>,
  ) => output<this>

  /** Wraps the schema, allowing `undefined` to pass through. */
  readonly optional: () => KvantOptional<this>
  /** Wraps the schema, allowing `null` to pass through. */
  readonly nullable: () => KvantNullable<this>
  /** Wraps the schema, allowing both `null` and `undefined` to pass through. */
  readonly nullish: () => KvantOptional<KvantNullable<this>>

  /** Wraps the schema into an array of itself. */
  readonly array: () => KvantArray<this>

  /**
   * Falls back to the default when parsing yields `undefined`,
   * and clears the stored value when it equals the default.
   */
  readonly default: <
    T extends NoUndefined<output<this>>,
    Options extends KvantDefaultOptions<this, T> = KvantDefaultOptions<this, T>,
  >(
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantDefault<this, T, Options>
  /**
   * Like {@link KvantType.default | default}, but the fallback is given as
   * stored input and parsed first, before reaching the wrapped schema.
   */
  readonly prefault: <
    T extends input<this>,
    Options extends KvantPrefaultOptions<this, T> = KvantPrefaultOptions<this, T>,
  >(
    defaultValue: T | (() => T),
    options?: Options,
  ) => KvantPrefault<this, T, Options>

  /**
   * Picks one element when the raw value is an array
   * (e.g. a repeated search param). Defaults to the first element.
   */
  readonly singular: (
    index?: number | ((value: unknown[]) => number),
  ) => KvantSingular<this>

  /** Transforms the parsed/encoded value, keeping the schema's types. */
  readonly overwrite: (
    def: KvantOverwriteFn<this> | KvantOverwriteDef<this>,
  ) => this

  /**
   * Keeps values passing the check; rejected values fall back.
   * The fallback is required when the output cannot be `undefined`.
   */
  readonly refine: (
    check: (value: NoUndefined<output<this>>) => boolean,
    ...[fallback]: undefined extends output<this>
      ? [fallback?: output<this> | (() => output<this>)]
      : [fallback: output<this> | (() => output<this>)]
  ) => this

  /** Chains another schema after this one: its parse consumes this schema's output. */
  readonly pipe: <
    B extends KvantSchema<any, output<this>, output<this>>,
  >(
    schema: B,
  ) => KvantPipe<this, B>

  /**
   * Pipes into a transformation of the output value.
   * A bare function applies to both parse and encode.
   */
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

  /** Passes the schema to a function and returns its result. Useful for custom combinators. */
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
