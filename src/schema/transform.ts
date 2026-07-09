import type { KvantType } from './core'
import { generics } from './core'

export interface KvantTransform<Input, Output> extends KvantType<Output, Input, Input> {
  readonly type: 'transform'
}

export interface KvantTransformDef<Input, Output> {
  parse: (value: Input) => Output
  encode: (value: Output) => Input
}

export function transform<Input, Output>(
  def: KvantTransformDef<Input, Output>,
): KvantTransform<Input, Output> {
  return {
    ...generics,
    type: 'transform',
    parse: def.parse,
    encode: def.encode,
  }
}
