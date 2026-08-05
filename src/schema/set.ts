import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantSet<S extends KvantGenericSchema> extends KvantType<
  Set<output<S>>,
  Array<input<S>>,
  MaybeMultiple<rawInput<S>>
> {
  readonly type: 'set'
}

export function set<S extends KvantGenericSchema>(schema: S): KvantSet<S> {
  return {
    ...generics,
    type: 'set',
    parse(value) {
      const arr: unknown[] = value !== undefined
        ? (Array.isArray(value) ? value : [value])
        : []

      return new Set(
        arr.map(item => schema.parse(item)),
      )
    },
    encode(value) {
      return [...value.values()]
        .map(item => schema.encode(item))
    },
  }
}
