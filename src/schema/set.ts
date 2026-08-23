import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple, NoUndefined } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

type KvantSetGenericSchema = KvantType<Set<any> | undefined, any, any>

interface KvantSetGenerics {
  readonly min: <S extends KvantSetGenericSchema>(this: S, minSize: number) => S
  readonly max: <S extends KvantSetGenericSchema>(this: S, maxSize: number) => S
  readonly size: <S extends KvantSetGenericSchema>(this: S, size: number) => S
  readonly nonempty: <S extends KvantSetGenericSchema>(this: S) => S
  readonly slice: <S extends KvantSetGenericSchema>(this: S, start: number, end?: number) => S
}

const setGenerics = {
  min(this: KvantSetGenericSchema, minSize) {
    return refine(this, v => v.size >= minSize)
  },
  max(this: KvantSetGenericSchema, maxSize) {
    return refine(this, v => v.size <= maxSize)
  },
  size(this: KvantSetGenericSchema, size) {
    return refine(this, v => v.size === size)
  },
  nonempty(this: KvantSetGenericSchema) {
    return refine(this, v => v.size > 0)
  },
  slice(this: KvantSetGenericSchema, start, end) {
    return overwrite(
      this,
      v => new Set([...v].slice(start, end)),
    )
  },
} as KvantSetGenerics

export interface KvantLooseSet<S extends KvantGenericSchema> extends KvantType<
  Set<output<S>> | undefined,
  Array<input<S>> | undefined,
  MaybeMultiple<rawInput<S>>
>, KvantSetGenerics {
  readonly type: 'set'
  readonly unwrap: () => S
}

/**
 * Wraps a schema into a Set of itself.
 * A single raw value is wrapped into a one-item Set.
 */
export function looseSet<S extends KvantGenericSchema>(schema: S): KvantLooseSet<S> {
  return {
    ...generics,
    ...setGenerics,
    type: 'set',
    parse(value) {
      if (value === undefined)
        return undefined

      const arr: unknown[] = Array.isArray(value) ? value : [value]
      return new Set(
        arr.map(item => schema.parse(item)),
      )
    },
    encode(value) {
      if (value === undefined)
        return undefined

      return [...value.values()]
        .map(item => schema.encode(item))
    },
    unwrap() {
      return schema
    },
  }
}

export interface KvantSet<S extends KvantGenericSchema> extends KvantType<
  Set<NoUndefined<output<S>>> | undefined,
  Array<NoUndefined<input<S>>> | undefined,
  MaybeMultiple<rawInput<S>>
>, KvantSetGenerics {
  readonly type: 'set'
  readonly unwrap: () => S
}

function isDefined<T>(value: T): value is NoUndefined<T> {
  return value !== undefined
}

/**
 * Wraps a schema into a Set of itself.
 * A single raw value is wrapped into a one-item Set.
 *
 * Automatically filters out any failed/undefined entries from the parsed set,
 * use {@link looseSet} if you want to preserve undefined entries.
 */
export function set<S extends KvantGenericSchema>(schema: S): KvantSet<S> {
  const loose = looseSet(schema)
  return {
    ...generics,
    ...setGenerics,
    type: 'set',
    parse(value) {
      const parsed = loose.parse(value)
      if (parsed === undefined)
        return undefined

      return new Set([...parsed].filter(isDefined))
    },
    encode(value) {
      return loose.encode(value)?.filter(isDefined)
    },
    unwrap() {
      return schema
    },
  }
}
