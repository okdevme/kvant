import type { KvantGenericSchema } from '../types/schema'
import type { NoUndefined } from '../utils/types'
import type { input, KvantType, output, rawInput } from './core'
import { shallowClone } from '../utils/object'
import { generics } from './core'

export interface KvantDefaultOptions<
  S extends KvantGenericSchema,
  T extends NoUndefined<output<S>>,
> {
  /**
   * Omits the stored value when it equals the default.
   *
   * @default true
   */
  clearOnDefault?: boolean
  /** Custom equality check against the default value. */
  isDefault?: (value: NoUndefined<output<S>> | input<S>, defaultValue: T) => boolean
}

export interface KvantDefault<
  S extends KvantGenericSchema,
  T extends NoUndefined<output<S>>,
  Options extends KvantDefaultOptions<S, T> = KvantDefaultOptions<S, T>,
> extends KvantType<
    NoUndefined<output<S>>,
    Options['clearOnDefault'] extends false
      ? NoUndefined<input<S>>
      : input<S> | undefined,
    rawInput<S> | undefined
  > {
  readonly type: 'default'
  readonly unwrap: () => S
}

/**
 * Falls back to the default when parsing yields `undefined`,
 * and clears the stored value when it equals the default.
 */
export function _default<
  S extends KvantGenericSchema,
  T extends NoUndefined<output<S>>,
  Options extends KvantDefaultOptions<S, T> = KvantDefaultOptions<S, T>,
>(
  schema: S,
  defaultValue: T | (() => T),
  options?: Options,
): KvantDefault<S, T, Options> {
  const {
    clearOnDefault = true,
    isDefault = Object.is,
  } = options ?? {}

  const getDefaultValue = (): T => typeof defaultValue === 'function'
    ? (defaultValue as () => T)()
    : shallowClone(defaultValue)

  return {
    ...generics,
    type: 'default',
    parse(value) {
      if (value === undefined)
        return getDefaultValue()

      const output = schema.parse(value)

      if (output === undefined)
        return getDefaultValue()

      return output
    },
    encode(value) {
      if (!clearOnDefault)
        return schema.encode(value)

      const defaultValue = getDefaultValue()
      if (isDefault(value, defaultValue))
        return undefined

      return schema.encode(value)
    },
    unwrap() {
      return schema
    },
  }
}

export interface KvantPrefaultOptions<
  S extends KvantGenericSchema,
  T extends input<S>,
> {
  /**
   * Omits the stored value when it equals the default.
   *
   * @default true
   */
  clearOnDefault?: boolean
  /** Custom equality check against the default value. */
  isDefault?: (value: input<S>, defaultValue: T) => boolean
}

export interface KvantPrefault<
  S extends KvantGenericSchema,
  T extends input<S>,
  Options extends KvantPrefaultOptions<S, T> = KvantPrefaultOptions<S, T>,
> extends KvantType<
    NoUndefined<output<S>>,
    Options['clearOnDefault'] extends false
      ? input<S>
      : input<S> | undefined,
    rawInput<S> | undefined
  > {
  readonly type: 'prefault'
  readonly unwrap: () => S
}

/**
 * Like {@link _default | default}, but the fallback is given as
 * stored input and parsed first, before reaching the wrapped schema.
 */
export function prefault<
  S extends KvantGenericSchema,
  T extends input<S>,
  Options extends KvantPrefaultOptions<S, T> = KvantPrefaultOptions<S, T>,
>(
  schema: S,
  defaultValue: T | (() => T),
  options?: Options,
): KvantPrefault<S, T, Options> {
  const {
    clearOnDefault = true,
    isDefault = Object.is,
  } = options ?? {}

  const getDefaultValue = (): T => typeof defaultValue === 'function'
    ? (defaultValue as () => T)()
    : shallowClone(defaultValue)

  return {
    ...generics,
    type: 'prefault',
    parse(value) {
      if (value === undefined)
        value = getDefaultValue()

      return schema.parse(value)
    },
    encode(value) {
      if (!clearOnDefault)
        return schema.encode(value)

      const input = schema.encode(value)

      if (isDefault(input, getDefaultValue()))
        return undefined

      return input
    },
    unwrap() {
      return schema
    },
  }
}
