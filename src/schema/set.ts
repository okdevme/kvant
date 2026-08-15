import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

export interface KvantSet<S extends KvantGenericSchema> extends KvantType<
  Set<output<S>> | undefined,
  Array<input<S>> | undefined,
  MaybeMultiple<rawInput<S>>
> {
  readonly type: 'set'

  readonly min: (minSize: number) => this
  readonly max: (maxSize: number) => this
  readonly size: (size: number) => this
  readonly nonempty: () => this
  readonly slice: (start: number, end?: number) => this
}

export function set<S extends KvantGenericSchema>(schema: S): KvantSet<S> {
  return {
    ...generics,
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
    min(minSize) {
      return refine(this, v => v.size >= minSize)
    },
    max(maxSize) {
      return refine(this, v => v.size <= maxSize)
    },
    size(size) {
      return refine(this, v => v.size === size)
    },
    nonempty() {
      return refine(this, v => v.size > 0)
    },
    slice(start, end) {
      return overwrite(
        this,
        v => new Set([...v].slice(start, end)),
      )
    },
  }
}
