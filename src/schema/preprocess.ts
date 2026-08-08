import type { KvantGenericSchema } from '../types/schema'
import type { rawInput } from './core'
import type { KvantPipe } from './pipe'
import type { KvantTransform, KvantTransformDef } from './transform'
import { pipe } from './pipe'
import { transform } from './transform'

export interface KvantPreprocess<
  S extends KvantGenericSchema,
  Input = unknown,
> extends KvantPipe<
    KvantTransform<Input, rawInput<S>>,
    S
  > {}

/** Transforms the raw input before the schema parses it. */
export function preprocess<
  S extends KvantGenericSchema,
  Input = unknown,
>(
  def: KvantTransformDef<Input, rawInput<S>>,
  schema: S,
): KvantPreprocess<S, Input> {
  return pipe(
    transform(def),
    schema,
  )
}
