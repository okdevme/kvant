import type { KvantType } from './core'
import { generics } from './core'

export interface KvantAny extends KvantType<any> {
  readonly type: 'any'
}

export interface KvantUnknown extends KvantType<unknown> {
  readonly type: 'unknown'
}

export function any(): KvantAny {
  return {
    ...generics,
    type: 'any',
    parse(value) {
      return value
    },
    encode(value) {
      return value
    },
  }
}

export function unknown(): KvantUnknown {
  return {
    ...generics,
    type: 'unknown',
    parse(value) {
      return value
    },
    encode(value) {
      return value
    },
  }
}
