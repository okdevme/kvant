import type { KvantType } from './core'
import { generics } from './core'

interface KvantDateGenerics {}

const dateGenerics = {} as KvantDateGenerics

export interface KvantDate extends KvantType<Date | undefined, string | undefined>, KvantDateGenerics {
  readonly type: 'date'
}

export function datetime(): KvantDate {
  return {
    ...generics,
    ...dateGenerics,
    type: 'date',
    parse(value) {
      try {
        value = new Date(value as string | number)
      }
      catch {}

      if (!(value instanceof Date) || Number.isNaN(value.getTime()))
        return undefined

      return value
    },
    encode(value) {
      if (value === undefined || Number.isNaN(value.getTime()))
        return undefined

      return value.toISOString()
    },
  }
}

function slicedDatetime(start: number, end: number): KvantDate {
  const schema = datetime()
  return {
    ...schema,
    parse(value) {
      return schema.parse(
        String(value).slice(start, end),
      )
    },
    encode(value) {
      return schema.encode(value)?.slice(start, end)
    },
  }
}
export function year(): KvantDate {
  return slicedDatetime(0, 4)
}
export function yearMonth(): KvantDate {
  return slicedDatetime(0, 7)
}
export function date(): KvantDate {
  return slicedDatetime(0, 10)
}

export interface KvantTimestamp extends KvantType<Date | undefined, number | undefined>, KvantDateGenerics {
  readonly type: 'timestamp'
}

export function timestamp(factor: number = 1): KvantTimestamp {
  const schema = datetime()
  return {
    ...schema,
    type: 'timestamp',
    parse(value) {
      return schema.parse(
        (
          typeof value !== 'number'
            ? Number.parseInt(String(value))
            : value
        ) * factor,
      )
    },
    encode(value) {
      if (value === undefined || Number.isNaN(value.getTime()))
        return undefined

      return Math.trunc(value.getTime() / factor)
    },
  }
}
