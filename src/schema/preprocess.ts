import type { KvantGenericSchema, KvantSchema } from '../types/schema'
import type { input, output, rawInput } from './core'
import { generics } from './core'

export interface KvantPreprocessDef<A, B, C, D> {
  decode: (value: A) => B
  encode: (value: C) => D
}

export interface KvantPreprocess<
  S extends KvantGenericSchema,
  RawInput = unknown,
  Input = RawInput,
> extends KvantSchema<
    output<S>,
    Input,
    RawInput
  > {
  readonly type: 'preprocess'
}

/** Transforms the raw input before the schema parses it. */
export function preprocess<
  S extends KvantGenericSchema,
  RawInput = unknown,
  Input = RawInput,
>(
  def: KvantPreprocessDef<RawInput, rawInput<S>, input<S>, Input>,
  schema: S,
): KvantPreprocess<S, RawInput, Input> {
  return {
    ...generics,
    type: 'preprocess',
    parse(value) {
      return schema.parse(
        def.decode(value),
      )
    },
    encode(value) {
      return def.encode(
        schema.encode(value),
      )
    },
  }
}
