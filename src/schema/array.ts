import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

export interface KvantArray<S extends KvantGenericSchema> extends KvantType<
  Array<output<S>> | undefined,
  Array<input<S>> | undefined,
  MaybeMultiple<rawInput<S>>
> {
  readonly type: 'array'
  readonly unwrap: () => S

  readonly min: (minLength: number) => this
  readonly max: (maxLength: number) => this
  readonly length: (length: number) => this
  readonly slice: (start: number, end?: number) => this
}

export function array<S extends KvantGenericSchema>(schema: S): KvantArray<S> {
  return {
    ...generics,
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
    min(minLength) {
      return refine(this, v => v.length >= minLength)
    },
    max(maxLength) {
      return refine(this, v => v.length <= maxLength)
    },
    length(length) {
      return refine(this, v => v.length === length)
    },
    slice(start, end) {
      return overwrite(this, v => v.slice(start, end))
    },
  }
}
