import type { KvantType } from './core'
import { generics } from './core'

export interface KvantLaxUriComponent extends KvantType<unknown, string> {
  readonly type: 'uriComponent'
}

export function laxUriComponent(): KvantLaxUriComponent {
  return {
    ...generics,
    type: 'uriComponent',
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

export interface KvantUriComponent extends KvantType<string, string> {
  readonly type: 'uriComponent'
}

export const uriComponent = laxUriComponent as () => KvantUriComponent
