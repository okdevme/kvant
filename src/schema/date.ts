import type { KvantType } from './core'
import { generics } from './core'
import { overwrite } from './overwrite'
import { refine } from './refine'

type KvantDateGenericSchema = KvantType<Date | undefined, any, any>

interface KvantDateGenerics {
  readonly min: <S extends KvantDateGenericSchema>(this: S, minDate: number | Date) => S
  readonly max: <S extends KvantDateGenericSchema>(this: S, maxDate: number | Date) => S
  readonly clamp: {
    <S extends KvantDateGenericSchema>(this: S, maxDate: number | Date): S
    <S extends KvantDateGenericSchema>(this: S, minDate: number | Date, maxDate: number | Date): S
  }
}

const dateGenerics = {
  min(this: KvantDateGenericSchema, minDate) {
    return refine(this, v => v >= minDate)
  },
  max(this: KvantDateGenericSchema, maxDate) {
    return refine(this, v => v <= maxDate)
  },
  clamp(this: KvantDateGenericSchema, a: number | Date, b?: number | Date) {
    return overwrite(
      this,
      v => new Date(
        b == null
          ? Math.min(
              new Date(a).getTime(),
              v.getTime(),
            )
          : Math.max(
              new Date(a).getTime(),
              Math.min(
                new Date(b).getTime(),
                v.getTime(),
              ),
            ),
      ),
    )
  },
} as KvantDateGenerics

export interface KvantIsoToDate extends KvantType<Date | undefined, string | undefined>, KvantDateGenerics {
  readonly type: 'isoToDate'
}

function isoToDate(
  sliceStart?: number,
  sliceEnd?: number,
): KvantIsoToDate {
  return {
    ...generics,
    ...dateGenerics,
    type: 'isoToDate',
    parse(value) {
      let iso = String(value)
      if (sliceStart != null)
        iso = iso.slice(sliceStart, sliceEnd)

      let date: Date | undefined
      try {
        date = new Date(iso)
      }
      catch {}

      if (date == null || Number.isNaN(date.getTime()))
        return undefined

      return date
    },
    encode(value) {
      if (value === undefined || Number.isNaN(value.getTime()))
        return undefined

      const iso = value.toISOString()
      return sliceStart != null
        ? iso.slice(sliceStart, sliceEnd)
        : iso
    },
  }
}
export function isoDatetimeToDate(): KvantIsoToDate {
  return isoToDate()
}
export function isoDateToDate(): KvantIsoToDate {
  return isoToDate(0, 10)
}
export function isoYearMonthToDate(): KvantIsoToDate {
  return isoToDate(0, 7)
}
export function isoYearToDate(): KvantIsoToDate {
  return isoToDate(0, 4)
}

export interface KvantEpochToDate extends KvantType<Date | undefined, number | undefined>, KvantDateGenerics {
  readonly type: 'epochToDate'
}

function epochToDate(factor: number = 1): KvantEpochToDate {
  return {
    ...generics,
    ...dateGenerics,
    type: 'epochToDate',
    parse(value) {
      const epoch = (
        typeof value !== 'number'
          ? Number.parseInt(String(value))
          : value
      ) * factor

      let date: Date | undefined
      try {
        date = new Date(epoch)
      }
      catch {}

      if (date == null || Number.isNaN(date.getTime()))
        return undefined

      return date
    },
    encode(value) {
      if (value === undefined || Number.isNaN(value.getTime()))
        return undefined

      return Math.trunc(value.getTime() / factor)
    },
  }
}
export function epochMillisToDate(): KvantEpochToDate {
  return epochToDate()
}
export function epochSecondsToDate(): KvantEpochToDate {
  return epochToDate(1000)
}
