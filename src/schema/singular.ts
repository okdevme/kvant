import type { KvantGenericSchema } from '../types/schema'
import type { MaybeMultiple } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantSingular<S extends KvantGenericSchema> extends KvantType<
  output<S>,
  input<S>,
  MaybeMultiple<rawInput<S>>
> {
  readonly type: 'singular'
  readonly unwrap: () => S
}

/**
 * Picks one element when the raw value is an array
 * (e.g. a repeated search param). Defaults to the first element.
 */
export function singular<S extends KvantGenericSchema>(
  schema: S,
  index: number | ((value: Extract<MaybeMultiple<rawInput<S>>, any[]>) => number) = 0,
): KvantSingular<S> {
  return {
    ...generics,
    type: 'singular',
    parse(value) {
      return schema.parse(
        Array.isArray(value)
          ? value.at(
              typeof index === 'function'
                ? index(value as Extract<MaybeMultiple<rawInput<S>>, any[]>)
                : index,
            )
          : value,
      )
    },
    encode(value) {
      return schema.encode(value)
    },
    unwrap() {
      return schema
    },
  }
}
