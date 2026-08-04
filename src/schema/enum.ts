import type { EnumLike, EnumValue, Flatten, ToEnum } from '../utils/types'
import type { KvantType } from './core'
import { generics } from './core'

type InferEnum<T extends EnumLike> = T[keyof T] & {}

function getEnumValues(entries: EnumLike): EnumValue[] {
  const numericValues = Object.values(entries).filter(v => typeof v === 'number')
  return Object.entries(entries)
    .filter(([k, _]) => !numericValues.includes(+k))
    .map(([_, v]) => v)
}

export interface KvantEnum<T extends EnumLike = EnumLike> extends KvantType<InferEnum<T> | undefined> {
  readonly type: 'enum'
  readonly enum: T
  readonly values: Set<EnumValue>

  readonly extract: <const U extends readonly (keyof T)[]>(
    values: U,
  ) => KvantEnum<Flatten<Pick<T, U[number]>>>
  readonly exclude: <const U extends readonly (keyof T)[]>(
    values: U,
  ) => KvantEnum<Flatten<Omit<T, U[number]>>>
}

export function _enum<const T extends readonly string[]>(values: T): KvantEnum<ToEnum<T[number]>>
export function _enum<const T extends EnumLike>(entries: T): KvantEnum<T>
export function _enum(def: string[] | EnumLike): KvantEnum<EnumLike> {
  const entries = Array.isArray(def)
    ? Object.fromEntries(def.map(v => [v, v]))
    : def

  const keys = new Set(Object.keys(entries))
  const values = new Set(getEnumValues(entries))

  return {
    ...generics,
    type: 'enum',
    enum: entries,
    values,
    parse(value: any) {
      return values.has(value)
        ? value
        : undefined
    },
    encode(value) {
      return value
    },
    // @ts-expect-error complex dynamic type
    extract(values) {
      const newEntries: Record<string, any> = {}
      for (const value of values) {
        if (keys.has(value))
          newEntries[value] = entries[value]
      }
      return _enum(newEntries)
    },
    // @ts-expect-error complex dynamic type
    exclude(values) {
      const newEntries: Record<string, any> = { ...entries }
      for (const value of values) {
        if (keys.has(value))
          delete newEntries[value]
      }
      return _enum(newEntries)
    },
  }
}

export { _enum as enum }
