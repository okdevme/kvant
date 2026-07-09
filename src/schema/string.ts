import type { KvantType } from './core'
import { generics } from './core'

export interface KvantString extends KvantType<string> {
  readonly type: 'string'

  readonly trim: () => KvantString
  readonly toLowerCase: () => KvantString
  readonly toUpperCase: () => KvantString
}

export function string(): KvantString {
  return {
    ...generics,
    type: 'string',
    parse(value) {
      return String(value)
    },
    encode(value) {
      return value
    },

    trim() {
      return this.overwrite(value => value.trim())
    },
    toLowerCase() {
      return this.overwrite(value => value.toLowerCase())
    },
    toUpperCase() {
      return this.overwrite(value => value.toUpperCase())
    },
  }
}
