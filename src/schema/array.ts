import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantArray<S extends KvantGenericSchema> extends KvantType<
  Array<output<S>>,
  Array<input<S>>,
  MaybeMultiple<rawInput<S>>
> {
  readonly type: 'array'
  readonly unwrap: () => S
}

export function array<S extends KvantGenericSchema>(schema: S): KvantArray<S> {
  return {
    ...generics,
    type: 'array',
    parse(value) {
      const arr: unknown[] = value !== undefined
        ? (Array.isArray(value) ? value : [value])
        : []

      return arr.map(item => schema.parse(item))
    },
    encode(value) {
      return value.map(item => schema.encode(item))
    },
    unwrap() {
      return schema
    },
  }
}
