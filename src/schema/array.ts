import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple, NoUndefined } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

type KvantArrayGenericSchema = KvantType<any[] | undefined, any, any>

interface KvantArrayGenerics {
  readonly min: <S extends KvantArrayGenericSchema>(this: S, minLength: number) => S
  readonly max: <S extends KvantArrayGenericSchema>(this: S, maxLength: number) => S
  readonly length: <S extends KvantArrayGenericSchema>(this: S, length: number) => S
  readonly nonempty: <S extends KvantArrayGenericSchema>(this: S) => S
  readonly slice: <S extends KvantArrayGenericSchema>(this: S, start: number, end?: number) => S
}

const arrayGenerics = {
  min(this: KvantArrayGenericSchema, minLength) {
    return refine(this, v => v.length >= minLength)
  },
  max(this: KvantArrayGenericSchema, maxLength) {
    return refine(this, v => v.length <= maxLength)
  },
  length(this: KvantArrayGenericSchema, length) {
    return refine(this, v => v.length === length)
  },
  nonempty(this: KvantArrayGenericSchema) {
    return refine(this, v => v.length > 0)
  },
  slice(this: KvantArrayGenericSchema, start, end) {
    return overwrite(this, v => v.slice(start, end))
  },
} as KvantArrayGenerics

export interface KvantLooseArray<S extends KvantGenericSchema> extends KvantType<
  Array<output<S>> | undefined,
  Array<input<S>> | undefined,
  MaybeMultiple<rawInput<S>>
>, KvantArrayGenerics {
  readonly type: 'array'
  readonly unwrap: () => S
}

/**
 * Wraps a schema into an array of itself.
 * A single raw value is wrapped into a one-item array.
 */
export function looseArray<S extends KvantGenericSchema>(schema: S): KvantLooseArray<S> {
  return {
    ...generics,
    ...arrayGenerics,
    type: 'array',
    parse(value) {
      if (value === undefined)
        return undefined

      const arr: unknown[] = Array.isArray(value) ? value : [value]
      return arr.map(item => schema.parse(item))
    },
    encode(value) {
      if (value === undefined)
        return undefined

      return value.map(item => schema.encode(item))
    },
    unwrap() {
      return schema
    },
  }
}

export interface KvantArray<S extends KvantGenericSchema> extends KvantType<
  Array<NoUndefined<output<S>>> | undefined,
  Array<NoUndefined<input<S>>> | undefined,
  MaybeMultiple<rawInput<S>>
>, KvantArrayGenerics {
  readonly type: 'array'
  readonly unwrap: () => S
}

function isDefined<T>(value: T): value is NoUndefined<T> {
  return value !== undefined
}

/**
 * Wraps a schema into an array of itself.
 * A single raw value is wrapped into a one-item array.
 *
 * Automatically filters out any failed/undefined entries from the parsed array,
 * use {@link looseArray} if you want to preserve undefined entries.
 */
export function array<S extends KvantGenericSchema>(schema: S): KvantArray<S> {
  const array = looseArray(schema)
  return {
    ...generics,
    ...arrayGenerics,
    type: 'array',
    parse(value) {
      return array.parse(value)?.filter(isDefined)
    },
    encode(value) {
      return array.encode(value)?.filter(isDefined)
    },
    unwrap() {
      return schema
    },
  }
}
