import type { KvantType } from './core'
import type { KvantNumber } from './number'
import type { KvantOptional } from './optional'
import type { KvantPipe } from './pipe'
import type { KvantString } from './string'
import type { KvantTransform } from './transform'
import { generics } from './core'
import { number } from './number'
import { pipe } from './pipe'
import { string } from './string'

export interface KvantDate extends KvantType<
  Date | undefined,
  string | undefined
> {
  readonly type: 'date'

  readonly isoYear: () => KvantISOYear
  readonly isoYearMonth: () => KvantISOYearMonth
  readonly isoDate: () => KvantISODate

  readonly timestamp: (factor?: number) => KvantTimestamp
}

export interface KvantISO extends KvantPipe<
  KvantOptional<KvantString>,
  KvantDate
> {}
export interface KvantISOYear extends KvantISO {}
export interface KvantISOYearMonth extends KvantISO {}
export interface KvantISODate extends KvantISO {}

export interface KvantTimestamp extends KvantPipe<
  KvantPipe<
    KvantNumber,
    KvantTransform<number | undefined, string | undefined>
  >,
  KvantDate
> {}

export function date(): KvantDate {
  return {
    ...generics,
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
      if (!(value instanceof Date) || Number.isNaN(value.getTime()))
        return undefined

      return value.toISOString()
    },

    isoYear() {
      return pipe(
        string().overwrite(value => value.slice(0, 4)).optional(),
        this,
      )
    },
    isoYearMonth() {
      return pipe(
        string().overwrite(value => value.slice(0, 7)).optional(),
        this,
      )
    },
    isoDate() {
      return pipe(
        string().overwrite(value => value.slice(0, 10)).optional(),
        this,
      )
    },

    timestamp(factor = 1) {
      return pipe(
        number().floor().transform({
          parse: (value) => {
            if (value === undefined)
              return undefined

            const date = new Date(value * factor)
            if (Number.isNaN(date.getTime()))
              return undefined

            return date.toISOString()
          },
          encode: value => value !== undefined
            ? new Date(value).getTime() / factor
            : undefined,
        }),
        this,
      )
    },
  }
}
