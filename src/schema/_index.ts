import type { KvantType } from './core'
import { generics } from './core'

export interface KvantIndex extends KvantType<number | undefined> {
  readonly type: 'index'
}

export function index(): KvantIndex {
  return {
    ...generics,
    type: 'index',
    parse(value) {
      value = typeof value === 'string'
        ? Number.parseInt(value)
        : Number(value)
      return Number.isFinite(value)
        ? Math.max(0, Math.trunc(value as number) - 1)
        : undefined
    },
    encode(value) {
      if (value === undefined || !Number.isFinite(value))
        return undefined

      return Math.max(0, Math.trunc(value)) + 1
    },
  }
}
