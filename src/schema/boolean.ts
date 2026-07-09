import type { KvantType } from './core'
import { generics } from './core'

export interface KvantBoolean extends KvantType<boolean> {
  readonly type: 'boolean'
}

export function boolean(): KvantBoolean {
  return {
    ...generics,
    type: 'boolean',
    parse(value) {
      return Boolean(value)
    },
    encode(value) {
      return value
    },
  }
}
