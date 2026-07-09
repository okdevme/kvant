import type { KvantType } from './core'
import { generics } from './core'

export interface KvantNumber extends KvantType<number | undefined> {
  readonly type: 'number'

  readonly floor: () => KvantNumber
  readonly ceil: () => KvantNumber
  readonly round: () => KvantNumber
}

export function number(): KvantNumber {
  return {
    ...generics,
    type: 'number',
    parse(value) {
      value = typeof value === 'string'
        ? Number.parseFloat(value)
        : Number(value)
      return Number.isFinite(value)
        ? value as number
        : undefined
    },
    encode(value) {
      if (value === undefined)
        return undefined

      return Number.isFinite(value)
        ? value
        : undefined
    },
    floor() {
      return this.overwrite(value => value !== undefined ? Math.floor(value) : undefined)
    },
    ceil() {
      return this.overwrite(value => value !== undefined ? Math.ceil(value) : undefined)
    },
    round() {
      return this.overwrite(value => value !== undefined ? Math.round(value) : undefined)
    },
  }
}
