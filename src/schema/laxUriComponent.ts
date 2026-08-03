import type { KvantType } from './core'
import { generics } from './core'

export interface KvantLaxUriComponent extends KvantType<unknown, string> {
  readonly type: 'laxUriComponent'
}

export function laxUriComponent(): KvantLaxUriComponent {
  return {
    ...generics,
    type: 'laxUriComponent',
    parse(value): string {
      const str = String(value)

      try {
        return decodeURIComponent(str)
      }
      catch {
        return str
      }
    },
    encode(value) {
      return encodeURIComponent(String(value))
    },
  }
}
