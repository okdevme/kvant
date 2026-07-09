import type { input, KvantGenericSchema, KvantType, output, rawInput } from './core'
import type { NoUndefined } from './utils'
import { generics } from './core'
import { shallowClone } from './utils'

const basicIsDefault = (value: unknown, defaultValue: unknown): boolean => value === defaultValue

export interface KvantDefaultOptions<
  S extends KvantGenericSchema,
  T extends NoUndefined<output<S>>,
> {
  clearOnDefault?: boolean
  isDefault?: (value: NoUndefined<output<S>> | input<S>, defaultValue: T) => boolean
}

export interface KvantDefault<
  S extends KvantGenericSchema,
  T extends NoUndefined<output<S>>,
  Options extends KvantDefaultOptions<S, T> = KvantDefaultOptions<S, T>,
> extends KvantType<
    NoUndefined<output<S>>,
    Options['clearOnDefault'] extends false
      ? input<S>
      : input<S> | undefined,
    rawInput<S> | undefined
  > {
  readonly type: 'default'
  readonly unwrap: () => S
}

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
    isDefault = basicIsDefault,
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

      const input = schema.encode(value)

      if (isDefault(input, defaultValue))
        return undefined

      return input
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
  clearOnDefault?: boolean
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
    isDefault = basicIsDefault,
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
