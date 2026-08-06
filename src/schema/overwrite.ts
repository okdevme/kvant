import type { KvantGenericSchema } from '../types/schema'
import type { NoUndefined } from '../utils/types'
import type { output } from './core'

export type KvantOverwriteFn<S extends KvantGenericSchema> = (value: NoUndefined<output<S>>) => output<S>

export interface KvantOverwriteDef<S extends KvantGenericSchema> {
  decode?: KvantOverwriteFn<S>
  encode?: KvantOverwriteFn<S>
}

export function overwrite<S extends KvantGenericSchema>(
  schema: S,
  def: KvantOverwriteFn<S> | KvantOverwriteDef<S>,
): S {
  const { decode, encode }: Required<KvantOverwriteDef<S>> = typeof def === 'function'
    ? {
        decode: def,
        encode: def,
      }
    : {
        decode: def.decode ?? (v => v),
        encode: def.encode ?? (v => v),
      }

  return {
    ...schema,
    parse(value) {
      const output = schema.parse(value)
      return output !== undefined
        ? decode(output)
        : output
    },
    encode(value) {
      const output = schema.encode(value)
      return output !== undefined
        ? encode(output)
        : output
    },
  }
}
