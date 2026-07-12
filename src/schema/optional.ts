import type { KvantGenericSchema } from '../defs/schema'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantOptional<S extends KvantGenericSchema> extends KvantType<
  output<S> | undefined,
  input<S> | undefined,
  rawInput<S> | undefined
> {
  readonly type: 'optional'
  readonly unwrap: () => S
}

export function optional<S extends KvantGenericSchema>(schema: S): KvantOptional<S> {
  return {
    ...generics,
    type: 'optional',
    parse(value) {
      return value === undefined
        ? undefined
        : schema.parse(value)
    },
    encode(value) {
      return value === undefined
        ? undefined
        : schema.encode(value)
    },
    unwrap() {
      return schema
    },
  }
}
