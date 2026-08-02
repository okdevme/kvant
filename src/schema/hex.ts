import type { KvantType } from './core'
import { generics } from './core'

export interface KvantHex extends KvantType<number | undefined, string | undefined> {
  readonly type: 'hex'
}

export function hex(): KvantHex {
  return {
    ...generics,
    type: 'hex',
    parse(value) {
      value = typeof value === 'string'
        ? Number.parseInt(value, 16)
        : Number(value)
      return Number.isFinite(value)
        ? value as number
        : undefined
    },
    encode(value) {
      if (value === undefined || !Number.isFinite(value))
        return undefined

      const hex = Math.round(value).toString(16)
      return (hex.length & 1 ? '0' : '') + hex
    },
  }
}
