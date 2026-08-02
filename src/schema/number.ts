import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'

export interface KvantNumber extends KvantType<number | undefined> {
  readonly type: 'number'

  readonly floor: () => KvantNumber
  readonly ceil: () => KvantNumber
  readonly round: () => KvantNumber
  readonly trunc: () => KvantNumber
}

export function number(): KvantNumber {
  return {
    ...generics,
    type: 'number',
    parse(value) {
      value = typeof value !== 'number'
        ? Number.parseFloat(String(value))
        : value

      return Number.isFinite(value)
        ? value as number
        : undefined
    },
    encode(value) {
      if (value === undefined || !Number.isFinite(value))
        return undefined

      return value
    },
    floor() {
      return overwrite(this, value => value !== undefined ? Math.floor(value) : undefined)
    },
    ceil() {
      return overwrite(this, value => value !== undefined ? Math.ceil(value) : undefined)
    },
    round() {
      return overwrite(this, value => value !== undefined ? Math.round(value) : undefined)
    },
    trunc() {
      return overwrite(this, value => value !== undefined ? Math.trunc(value) : undefined)
    },
  }
}

export interface KvantInt extends KvantNumber {}

export function int(): KvantInt {
  return overwrite(
    number(),
    value => value !== undefined
      ? Math.max(
          Number.MIN_SAFE_INTEGER,
          Math.min(
            Number.MAX_SAFE_INTEGER,
            Math.trunc(value),
          ),
        )
      : undefined,
  )
}

export interface KvantIndex extends KvantInt {}

export function index(): KvantIndex {
  return overwrite(
    int(),
    {
      decode: value => value !== undefined
        ? Math.max(0, value - 1)
        : undefined,
      encode: value => value !== undefined
        ? Math.max(0, value) + 1
        : undefined,
    },
  )
}
