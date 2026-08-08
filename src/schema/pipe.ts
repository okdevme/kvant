import type { KvantGenericSchema, KvantSchema } from '../types/schema'
import type { input, KvantType, output, rawInput } from './core'
import { generics } from './core'

export interface KvantPipe<
  A extends KvantGenericSchema,
  B extends KvantSchema<any, output<A>, output<A>>,
> extends KvantType<
    output<B>,
    input<A>,
    rawInput<A>
  > {
  readonly type: 'pipe'
}

/** Chains two schemas: `b` parses `a`'s output, encoding runs in reverse order. */
export function pipe<
  A extends KvantGenericSchema,
  B extends KvantSchema<any, output<A>, output<A>>,
>(a: A, b: B): KvantPipe<A, B> {
  return {
    ...generics,
    type: 'pipe',
    parse(value) {
      return b.parse(
        a.parse(value),
      )
    },
    encode(value) {
      return a.encode(
        b.encode(value),
      )
    },
  }
}
