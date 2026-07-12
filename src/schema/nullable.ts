import type { KvantGenericSchema } from '../defs/schema'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantNullable<S extends KvantGenericSchema> extends KvantType<
  output<S> | null,
  input<S> | null,
  rawInput<S> | null
> {
  readonly type: 'nullable'
  readonly unwrap: () => S
}

export function nullable<S extends KvantGenericSchema>(schema: S): KvantNullable<S> {
  return {
    ...generics,
    type: 'nullable',
    parse(value) {
      return value === null
        ? null
        : schema.parse(value)
    },
    encode(value) {
      return value === null
        ? null
        : schema.encode(value)
    },
    unwrap() {
      return schema
    },
  }
}
