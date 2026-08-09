import { describe, expect, it } from 'vitest'
import { isObject, isPlainObject, mapValues, pick, shallowClone } from './object'

describe('isObject', () => {
  it('accepts objects and rejects primitives and arrays', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject('x')).toBe(false)
  })
})

describe('isPlainObject', () => {
  it('accepts plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  it('rejects class instances, arrays and primitives', () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(new Map())).toBe(false)
  })
})

describe('shallowClone', () => {
  it('clones plain objects, arrays, Maps and Sets', () => {
    const obj = { a: 1 }
    expect(shallowClone(obj)).not.toBe(obj)
    expect(shallowClone(obj)).toEqual(obj)

    const arr = [1]
    expect(shallowClone(arr)).not.toBe(arr)

    const map = new Map([['a', 1]])
    expect(shallowClone(map)).not.toBe(map)

    const set = new Set([1])
    expect(shallowClone(set)).not.toBe(set)
  })

  it('returns other values as-is', () => {
    expect(shallowClone(42)).toBe(42)
    expect(shallowClone('x')).toBe('x')
    const date = new Date()
    expect(shallowClone(date)).toBe(date)
  })
})

describe('pick', () => {
  it('picks the given keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('skips keys not present on the object', () => {
    expect(pick({ a: 1 }, ['a', 'b' as any])).toEqual({ a: 1 })
  })
})

describe('mapValues', () => {
  it('maps each value', () => {
    expect(mapValues({ a: 1, b: 2 }, v => v * 2)).toEqual({ a: 2, b: 4 })
  })
})
