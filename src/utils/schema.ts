import type { KvantSchema } from '../types/schema'

export function noopSchema<T>(): KvantSchema<T, T, T> {
  return {
    parse: value => value,
    encode: value => value,
  }
}
