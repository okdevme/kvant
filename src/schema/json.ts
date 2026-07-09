import type { KvantType } from './core'
import { generics } from './core'

export interface KvantJSONOptions {
  reviver?: (key: string, value: unknown) => unknown
  replacer?: (key: string, value: unknown) => unknown
  space?: string | number
}

export interface KvantJSON extends KvantType<unknown, string | undefined> {
  readonly type: 'json'
}

export function json(
  options?: KvantJSONOptions,
): KvantJSON {
  return {
    ...generics,
    type: 'json',
    parse(value) {
      if (typeof value !== 'string')
        return value

      try {
        return JSON.parse(value, options?.reviver)
      }
      catch {
        return value
      }
    },
    encode(value) {
      try {
        return JSON.stringify(value, options?.replacer, options?.space)
      }
      catch (error) {
        console.error('[kvant] Failed to stringify value', value, 'to JSON:', error)
        return undefined
      }
    },
  }
}
