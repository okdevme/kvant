import type { KvantType } from './core'
import { generics } from './core'

export interface KvantTransform<Input, Output> extends KvantType<Output, Input, Input> {
  readonly type: 'transform'
}

export interface KvantTransformDef<Input, Output> {
  decode: (value: Input) => Output
  encode: (value: Output) => Input
}

export function transform<Input, Output extends Input>(
  def: (value: Input) => Output,
): KvantTransform<Input, Output>
export function transform<Input, Output>(
  def: KvantTransformDef<Input, Output>,
): KvantTransform<Input, Output>
export function transform(
  def: ((value: any) => any) | KvantTransformDef<any, any>,
): KvantTransform<any, any> {
  const { decode: parse, encode } = typeof def === 'function'
    ? {
        decode: def,
        encode: def,
      }
    : {
        decode: def.decode,
        encode: def.encode,
      }

  return {
    ...generics,
    type: 'transform',
    parse,
    encode,
  }
}
