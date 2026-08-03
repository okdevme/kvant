import type { KvantType } from './core'
import { generics } from './core'

export interface KvantBoolean extends KvantType<boolean> {
  readonly type: 'boolean'
}

export function boolean(): KvantBoolean {
  return {
    ...generics,
    type: 'boolean',
    parse(value) {
      return Boolean(value)
    },
    encode(value) {
      return value
    },
  }
}

export interface KvantStringboolOptions {
  truthy?: string[]
  falsy?: string[]
  case?: 'sensitive' | 'insensitive'
}

export interface KvantStringbool extends KvantType<boolean | undefined, string | undefined> {
  readonly type: 'stringbool'
}

export function stringbool(options: KvantStringboolOptions = {}): KvantStringbool {
  const {
    truthy: _truthy = ['true', '1', 'yes', 'on', 'y', 'enabled'],
    falsy: _falsy = ['false', '0', 'no', 'off', 'n', 'disabled'],
    case: _case = 'insensitive',
  } = options

  const truthy = _case === 'insensitive'
    ? _truthy.map(v => v.toLowerCase())
    : _truthy
  const falsy = _case === 'insensitive'
    ? _falsy.map(v => v.toLowerCase())
    : _falsy

  return {
    ...generics,
    type: 'stringbool',
    parse(value) {
      let str = String(value)
      if (_case === 'insensitive')
        str = str.toLowerCase()

      if (truthy.includes(str))
        return true
      if (falsy.includes(str))
        return false

      return undefined
    },
    encode(value) {
      switch (value) {
        case true:
          return truthy[0] || 'true'
        case false:
          return falsy[0] || 'false'
        default:
          return undefined
      }
    },
  }
}
