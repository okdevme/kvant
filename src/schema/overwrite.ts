import type { KvantGenericSchema } from '../types/schema'
import type { output } from './core'

export type KvantOverwriteFn<S extends KvantGenericSchema> = (value: output<S>) => output<S>

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
      return decode(
        schema.parse(value),
      )
    },
    encode(value) {
      return schema.encode(
        encode(value),
      )
    },
  }
}
