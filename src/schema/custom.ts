import type { KvantType } from './core'
import { generics } from './core'

export interface KvantCustom<Output, Input = Output, RawInput = unknown> extends KvantType<Output, Input, RawInput> {
  readonly type: 'custom'
}

export interface KvantCustomDef<Output, Input = Output, RawInput = unknown> {
  parse: (value: RawInput) => Output
  encode: (value: Output) => Input
}

export function custom<Output, Input = Output, RawInput = unknown>(
  def: KvantCustomDef<Output, Input, RawInput>,
): KvantCustom<Output, Input, RawInput> {
  return {
    ...generics,
    type: 'custom',
    parse: def.parse,
    encode: def.encode,
  }
}
