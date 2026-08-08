import type { KvantType } from './core'
import { generics } from './core'

export interface KvantBoolean extends KvantType<boolean | undefined> {
  readonly type: 'boolean'
}

/**
 * Parses truthiness via `Boolean(value)`.
 *
 * For string representations like `'true'`/`'false'`, use {@link stringbool}.
 */
export function boolean(): KvantBoolean {
  return {
    ...generics,
    type: 'boolean',
    parse(value) {
      if (value === undefined)
        return undefined

      return Boolean(value)
    },
    encode(value) {
      return value
    },
  }
}

export interface KvantStringboolOptions {
  /** Raw strings parsed as `true`. The first entry is used when encoding. */
  truthy?: string[]
  /** Raw strings parsed as `false`. The first entry is used when encoding. */
  falsy?: string[]
  /**
   * Case sensitivity when matching `truthy`/`falsy` entries.
   *
   * @default 'insensitive'
   */
  case?: 'sensitive' | 'insensitive'
}

export interface KvantStringbool extends KvantType<boolean | undefined, string | undefined> {
  readonly type: 'stringbool'
}

/** Parses string representations of booleans (`'true'`, `'1'`, `'yes'`, ...). */
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
