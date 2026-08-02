import type { KvantType } from './core'
import { optionally } from '../utils/transform'
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
      return overwrite(this, optionally(Math.floor))
    },
    ceil() {
      return overwrite(this, optionally(Math.ceil))
    },
    round() {
      return overwrite(this, optionally(Math.round))
    },
    trunc() {
      return overwrite(this, optionally(Math.trunc))
    },
  }
}

export interface KvantInt extends KvantNumber {}

export function int(): KvantInt {
  return overwrite(
    number(),
    optionally(
      v => Math.max(
        Number.MIN_SAFE_INTEGER,
        Math.min(
          Number.MAX_SAFE_INTEGER,
          Math.trunc(v),
        ),
      ),
    ),
  )
}

export interface KvantIndex extends KvantInt {}

export function index(): KvantIndex {
  return overwrite(
    int(),
    {
      decode: optionally(v => Math.max(0, v - 1)),
      encode: optionally(v => Math.max(0, v) + 1),
    },
  )
}
