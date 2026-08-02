import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'

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
      return overwrite(this, value => value.trim())
    },
    toLowerCase() {
      return overwrite(this, value => value.toLowerCase())
    },
    toUpperCase() {
      return overwrite(this, value => value.toUpperCase())
    },
  }
}
