import type { KvantType } from './core'
import { optionally } from '../utils/transform'
import { generics } from './core'
import { overwrite } from './overwrite'

type KvantNumberGenericSchema = KvantType<number | undefined, any, any>

interface KvantNumberGenerics {
  readonly floor: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly ceil: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly round: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly trunc: <S extends KvantNumberGenericSchema>(this: S) => S
}

const numberGenerics = {
  floor(this: KvantNumberGenericSchema) {
    return overwrite(this, optionally(Math.ceil))
  },
  ceil(this: KvantNumberGenericSchema) {
    return overwrite(this, optionally(Math.ceil))
  },
  round(this: KvantNumberGenericSchema) {
    return overwrite(this, optionally(Math.round))
  },
  trunc(this: KvantNumberGenericSchema) {
    return overwrite(this, optionally(Math.trunc))
  },
} as KvantNumberGenerics

export interface KvantNumber extends KvantType<number | undefined>, KvantNumberGenerics {
  readonly type: 'number'
}

export function number(): KvantNumber {
  return {
    ...generics,
    ...numberGenerics,
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
  }
}

export interface KvantInt extends KvantNumber {}

export function int(): KvantInt {
  return overwrite(number(), optionally(
    v => Math.max(
      Number.MIN_SAFE_INTEGER,
      Math.min(
        Number.MAX_SAFE_INTEGER,
        Math.trunc(v),
      ),
    ),
  ))
}

export interface KvantIndex extends KvantInt {}

export function index(): KvantIndex {
  return overwrite(int(), {
    decode: optionally(v => Math.max(0, v - 1)),
    encode: optionally(v => Math.max(0, v) + 1),
  })
}

export interface KvantHex extends KvantType<number | undefined, string | undefined>, KvantNumberGenerics {
  readonly type: 'hex'
}

export function hex(): KvantHex {
  const schema = int()
  return {
    ...schema,
    type: 'hex',
    parse(value) {
      return schema.parse(
        typeof value === 'string'
          ? Number.parseInt(value, 16)
          : value,
      )
    },
    encode(value) {
      const int = schema.encode(value)
      if (int === undefined)
        return undefined

      const hex = Math.abs(int).toString(16)
      return (int < 0 ? '-' : '') + (hex.length & 1 ? '0' : '') + hex
    },
  }
}
