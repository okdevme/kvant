import type { KvantGenericSchema } from '../types/schema'
import type { NoUndefined } from '../utils/types'
import type { output } from './core'

export type KvantOverwriteFn<S extends KvantGenericSchema> = (value: NoUndefined<output<S>>) => output<S>

export interface KvantOverwriteDef<S extends KvantGenericSchema> {
  /** Applied after parsing. */
  decode?: KvantOverwriteFn<S>
  /** Applied after encoding. */
  encode?: KvantOverwriteFn<S>
}

/**
 * Wraps a schema, transforming its output after parse and before encode,
 * without changing its types. A bare function applies to both directions.
 */
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
      return schema.encode(
        value !== undefined
          ? encode(value)
          : value,
      )
    },
  }
}
