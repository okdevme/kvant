import type { KvantGenericSchema } from '../types/schema'
import type { input, KvantType, output } from './core'
import { generics } from './core'

type TupleOutputTypeNoOptionals<T extends readonly KvantGenericSchema[]> = {
  [k in keyof T]: output<T[k]>
}
type TupleOutputTypeWithOptionals<T extends readonly KvantGenericSchema[]> = T extends readonly [
  ...infer Prefix extends KvantGenericSchema[],
  infer Tail extends KvantGenericSchema,
]
  ? undefined extends output<Tail>
    ? [...TupleOutputTypeWithOptionals<Prefix>, output<Tail>?]
    : TupleOutputTypeNoOptionals<T>
  : []
type InferTupleOutputType<
  T extends readonly KvantGenericSchema[],
  Rest extends KvantGenericSchema | undefined,
> = [
  ...TupleOutputTypeWithOptionals<T>,
  ...(Rest extends KvantGenericSchema ? output<Rest>[] : []),
]

type TupleInputTypeNoOptionals<T extends readonly KvantGenericSchema[]> = {
  [k in keyof T]: input<T[k]>
}
type TupleInputTypeWithOptionals<T extends readonly KvantGenericSchema[]> = T extends readonly [
  ...infer Prefix extends KvantGenericSchema[],
  infer Tail extends KvantGenericSchema,
]
  ? undefined extends input<Tail>
    ? [...TupleInputTypeWithOptionals<Prefix>, input<Tail>?]
    : TupleInputTypeNoOptionals<T>
  : []
type InferTupleInputType<
  T extends readonly KvantGenericSchema[],
  Rest extends KvantGenericSchema | undefined,
> = [
  ...TupleInputTypeWithOptionals<T>,
  ...(Rest extends KvantGenericSchema ? input<Rest>[] : []),
]

export interface KvantTuple<
  S extends readonly KvantGenericSchema[],
  Rest extends KvantGenericSchema | undefined = undefined,
> extends KvantType<
    InferTupleOutputType<S, Rest>,
    InferTupleInputType<S, Rest>
  > {
  readonly type: 'tuple'
}

export function tuple<
  S extends readonly [KvantGenericSchema, ...KvantGenericSchema[]],
  Rest extends KvantGenericSchema | undefined = undefined,
>(
  items: S,
  rest?: Rest,
): KvantTuple<S, Rest> {
  function produce(mode: 'parse' | 'encode', value: any[]): any[] {
    const output = items.map((item, index) => item[mode](value[index]))

    // Parse rest items
    if (rest && value.length > items.length) {
      output.push(...value.slice(items.length).map(item => rest[mode](item)))
    }

    // Remove trailing undefined values
    for (let i = output.length - 1; i >= 0; i--) {
      if (output[i] === undefined)
        output.pop()
      else
        break
    }
    return output
  }

  return {
    ...generics,
    type: 'tuple',
    parse(value) {
      if (value === undefined)
        value = []

      return produce(
        'parse',
        Array.isArray(value) ? value : [value],
      ) as InferTupleOutputType<S, Rest>
    },
    encode(value) {
      return produce(
        'encode',
        value,
      ) as InferTupleInputType<S, Rest>
    },
  }
}
