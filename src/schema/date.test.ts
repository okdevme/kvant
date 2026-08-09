import { describe, expect, it } from 'vitest'
import {
  epochMillisToDate,
  epochSecondsToDate,
  isoDatetimeToDate,
  isoDateToDate,
  isoYearMonthToDate,
  isoYearToDate,
} from './date'

describe('isoDatetimeToDate', () => {
  it('parses full ISO datetimes', () => {
    const date = isoDatetimeToDate().parse('2026-08-09T12:30:00.000Z')
    expect(date?.toISOString()).toBe('2026-08-09T12:30:00.000Z')
  })

  it('parses invalid strings to undefined', () => {
    expect(isoDatetimeToDate().parse('not a date')).toBeUndefined()
  })

  it('roundtrips', () => {
    const schema = isoDatetimeToDate()
    expect(schema.parse(schema.encode(new Date('2026-08-09T12:30:00.000Z')))).toEqual(
      new Date('2026-08-09T12:30:00.000Z'),
    )
  })

  it('encodes invalid dates to undefined', () => {
    expect(isoDatetimeToDate().encode(new Date(Number.NaN))).toBeUndefined()
    expect(isoDatetimeToDate().encode(undefined)).toBeUndefined()
  })
})

describe('iso date slices', () => {
  it('isoDateToDate keeps only YYYY-MM-DD', () => {
    const schema = isoDateToDate()
    expect(schema.encode(new Date('2026-08-09T12:30:00.000Z'))).toBe('2026-08-09')
    expect(schema.parse('2026-08-09')?.toISOString().slice(0, 10)).toBe('2026-08-09')
  })

  it('isoYearMonthToDate keeps only YYYY-MM', () => {
    expect(isoYearMonthToDate().encode(new Date('2026-08-09T12:30:00.000Z'))).toBe('2026-08')
  })

  it('isoYearToDate keeps only YYYY', () => {
    expect(isoYearToDate().encode(new Date('2026-08-09T12:30:00.000Z'))).toBe('2026')
  })
})

describe('epoch dates', () => {
  it('epochMillisToDate parses millisecond epochs', () => {
    const date = epochMillisToDate().parse('1722517200000')
    expect(date?.getTime()).toBe(1722517200000)
    expect(epochMillisToDate().encode(date!)).toBe(1722517200000)
  })

  it('epochSecondsToDate parses second epochs', () => {
    const date = epochSecondsToDate().parse('1722517200')
    expect(date?.getTime()).toBe(1722517200000)
    expect(epochSecondsToDate().encode(date!)).toBe(1722517200)
  })

  it('parses non-numeric strings to undefined', () => {
    expect(epochMillisToDate().parse('nope')).toBeUndefined()
  })

  it('truncates sub-factor precision when encoding', () => {
    expect(epochSecondsToDate().encode(new Date(1722517200999))).toBe(1722517200)
  })
})

describe('date constraints', () => {
  it('min/max reject out-of-range dates', () => {
    const min = new Date('2026-01-01')
    const max = new Date('2026-12-31')
    const schema = isoDatetimeToDate().min(min).max(max)
    expect(schema.parse('2026-06-01T00:00:00.000Z')).toBeInstanceOf(Date)
    expect(schema.parse('2025-06-01T00:00:00.000Z')).toBeUndefined()
    expect(schema.parse('2027-06-01T00:00:00.000Z')).toBeUndefined()
  })

  it('clamp bounds dates', () => {
    const min = new Date('2026-01-01')
    const max = new Date('2026-12-31')
    const schema = isoDatetimeToDate().clamp(min, max)
    expect(schema.parse('2025-06-01T00:00:00.000Z')).toEqual(min)
    expect(schema.parse('2027-06-01T00:00:00.000Z')).toEqual(max)
    expect(schema.parse('2026-06-01T00:00:00.000Z')).toEqual(new Date('2026-06-01T00:00:00.000Z'))
  })

  it('clamp with one argument acts as max', () => {
    const max = new Date('2026-12-31')
    const schema = isoDatetimeToDate().clamp(max)
    expect(schema.parse('2027-06-01T00:00:00.000Z')).toEqual(max)
    expect(schema.parse('2026-06-01T00:00:00.000Z')).toEqual(new Date('2026-06-01T00:00:00.000Z'))
  })

  it('exposes the schema type tag', () => {
    expect(isoDatetimeToDate().type).toBe('isoToDate')
    expect(epochMillisToDate().type).toBe('epochToDate')
  })
})
