import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

type KvantNumberGenericSchema = KvantType<number | undefined, any, any>

interface KvantNumberGenerics {
  readonly gt: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly gte: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly min: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly lt: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly lte: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly max: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly positive: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly nonnegative: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly negative: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly nonpositive: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly multipleOf: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly step: <S extends KvantNumberGenericSchema>(this: S, value: number) => S
  readonly clamp: {
    <S extends KvantNumberGenericSchema>(this: S, max: number): S
    <S extends KvantNumberGenericSchema>(this: S, min: number, max: number): S
  }
  readonly floor: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly ceil: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly round: <S extends KvantNumberGenericSchema>(this: S) => S
  readonly trunc: <S extends KvantNumberGenericSchema>(this: S) => S
}

const numberGenerics = {
  gt(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v > value)
  },
  gte(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v >= value)
  },
  min(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v >= value)
  },
  lt(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v < value)
  },
  lte(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v <= value)
  },
  max(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v <= value)
  },
  positive(this: KvantNumberGenericSchema) {
    return refine(this, v => v > 0)
  },
  nonnegative(this: KvantNumberGenericSchema) {
    return refine(this, v => v >= 0)
  },
  negative(this: KvantNumberGenericSchema) {
    return refine(this, v => v < 0)
  },
  nonpositive(this: KvantNumberGenericSchema) {
    return refine(this, v => v <= 0)
  },
  multipleOf(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v % value === 0)
  },
  step(this: KvantNumberGenericSchema, value) {
    return refine(this, v => v % value === 0)
  },
  clamp(this: KvantNumberGenericSchema, a: number, b?: number) {
    return overwrite(
      this,
      v => b == null
        ? Math.min(a, v)
        : Math.max(a, Math.min(b, v)),
    )
  },
  floor(this: KvantNumberGenericSchema) {
    return overwrite(this, Math.floor)
  },
  ceil(this: KvantNumberGenericSchema) {
    return overwrite(this, Math.ceil)
  },
  round(this: KvantNumberGenericSchema) {
    return overwrite(this, Math.round)
  },
  trunc(this: KvantNumberGenericSchema) {
    return overwrite(this, Math.trunc)
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

/** Truncates to a safe integer. */
export function int(): KvantInt {
  return overwrite(
    number(),
    v => Math.max(
      Number.MIN_SAFE_INTEGER,
      Math.min(
        Number.MAX_SAFE_INTEGER,
        Math.trunc(v),
      ),
    ),
  )
}

export interface KvantIndex extends KvantInt {}

/** Zero-based state mapped to a one-based stored value (e.g. page numbers). */
export function index(): KvantIndex {
  return overwrite(int(), {
    decode: v => Math.max(0, v - 1),
    encode: v => Math.max(0, v) + 1,
  })
}

export interface KvantHex extends KvantType<number | undefined, string | undefined>, KvantNumberGenerics {
  readonly type: 'hex'
}

/** Hex string to integer. Encodes with an even digit count. */
export function hex(): KvantHex {
  const schema = int()
  return {
    ...generics,
    ...numberGenerics,
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
