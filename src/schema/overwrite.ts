import type { KvantGenericSchema } from '../defs/schema'
import type { output } from './core'

export function overwrite<S extends KvantGenericSchema>(
  schema: S,
  fn: (value: output<S>) => output<S>,
): S {
  return {
    ...schema,
    parse(value) {
      return fn(schema.parse(value))
    },
    encode(value) {
      return schema.encode(fn(value))
    },
  }
}
