import type {
  KvantAdapterOptions,
  KvantAdapterValue,
  KvantGenericAdapter,

} from './defs/adapter'
import type { KvantGenericSchema, KvantSchemaOutput } from './defs/schema'
import type { Prettify } from './utils'

function isSchema<S extends KvantGenericSchema>(value: S | unknown): value is S {
  return typeof value === 'object'
    && value !== null
    && 'parse' in value
    && 'encode' in value
    && typeof value.parse === 'function'
    && typeof value.encode === 'function'
}

export type KvantKeyMap<RawInput = any> = Record<string, KvantGenericSchema<RawInput>>
export type KvantKeyMapOutput<M extends KvantKeyMap> = Prettify<{ [K in keyof M]: KvantSchemaOutput<M[K]> }>

export function getKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
>(adapter: A, key: string, schema: S): KvantSchemaOutput<S>
export function getKvantState<
  A extends KvantGenericAdapter,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(adapter: A, keyMap: M): KvantKeyMapOutput<M>
export function getKvantState<
  A extends KvantGenericAdapter,
>(adapter: A, key: string): KvantAdapterValue<A>
export function getKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(adapter: A, key: string | M, schema?: S): unknown {
  if (typeof key === 'object') {
    return Object.fromEntries(
      Object.entries(key)
        .map(([key, schema]) => [key, getKvantState(adapter, key, schema)]),
    )
  }

  const value = adapter.get(key)
  return schema ? schema.parse(value) : structuredClone(value)
}

export function setKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
>(
  adapter: A,
  key: string,
  schema: S,
  value: KvantSchemaOutput<S> | ((value: KvantSchemaOutput<S>) => KvantSchemaOutput<S>),
  options?: KvantAdapterOptions<A>,
): void
export function setKvantState<
  A extends KvantGenericAdapter,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  values: KvantKeyMapOutput<M> | ((values: KvantKeyMapOutput<M>) => KvantKeyMapOutput<M>),
  options?: KvantAdapterOptions<A>,
): void
export function setKvantState<
  A extends KvantGenericAdapter,
>(
  adapter: A,
  key: string,
  value: KvantAdapterValue<A> | ((value: KvantAdapterValue<A>) => KvantAdapterValue<A>),
  options?: KvantAdapterOptions<A>,
): void
export function setKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(
  adapter: A,
  key: string | M,
  valueOrSchema:
    | KvantAdapterValue<A>
    | ((value: KvantAdapterValue<A>) => KvantAdapterValue<A>)
    | S
    | KvantKeyMapOutput<M>
    | ((values: KvantKeyMapOutput<M>) => KvantKeyMapOutput<M>),
  valueOrOptions?:
    | KvantAdapterOptions<A>
    | KvantSchemaOutput<S>
    | ((value: KvantSchemaOutput<S>) => KvantSchemaOutput<S>),
  options?: KvantAdapterOptions<A>,
): void {
  if (typeof key === 'object') {
    const values = typeof valueOrSchema === 'function'
      ? (valueOrSchema as (values: KvantKeyMapOutput<M>) => KvantKeyMapOutput<M>)(getKvantState(adapter, key))
      : valueOrSchema as KvantKeyMapOutput<M>

    Object.entries(key)
      .forEach(([key, keySchema]) => setKvantState(
        adapter,
        key,
        keySchema,
        values[key],
        valueOrOptions as KvantAdapterOptions<A>,
      ))
    return
  }

  const schema = isSchema<S>(valueOrSchema) ? valueOrSchema : undefined
  const valueOrGetter = schema ? valueOrOptions : valueOrSchema
  const rawValue: unknown = typeof valueOrGetter === 'function'
    ? (valueOrGetter as (value: unknown) => unknown)(
        schema ? getKvantState(adapter, key, schema) : getKvantState(adapter, key),
      )
    : valueOrGetter
  const value: unknown = schema ? schema.encode(rawValue) : rawValue
  adapter.set(
    key,
    value,
    schema ? options : valueOrOptions as KvantAdapterOptions<A>,
  )
}

export type KvantStateWatchCallback<T> = (value: Readonly<T>) => void

export function watchKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
>(
  adapter: A,
  key: string,
  schema: S,
  callback: KvantStateWatchCallback<KvantSchemaOutput<S>>,
): () => void
export function watchKvantState<
  A extends KvantGenericAdapter,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  callback: KvantStateWatchCallback<KvantKeyMapOutput<M>>,
): () => void
export function watchKvantState<
  A extends KvantGenericAdapter,
>(
  adapter: A,
  key: string,
  callback: KvantStateWatchCallback<KvantAdapterValue<A>>,
): () => void
export function watchKvantState<
  A extends KvantGenericAdapter,
  S extends KvantGenericSchema<KvantAdapterValue<A>>,
  M extends KvantKeyMap<KvantAdapterValue<A>>,
>(
  adapter: A,
  key: string | M,
  callbackOrSchema:
    | KvantStateWatchCallback<KvantAdapterValue<A>>
    | S
    | KvantStateWatchCallback<KvantKeyMapOutput<M>>,
  callback?: KvantStateWatchCallback<KvantSchemaOutput<S>>,
): () => void {
  if (typeof key === 'object') {
    const queue = new Map<keyof M, unknown>()
    let cache: KvantKeyMapOutput<M> | null = null
    let timeoutId: number | null = null

    const flush = (): void => {
      timeoutId = null

      cache = Object.fromEntries(
        Object.keys(key).map(k => [
          k,
          queue.has(k)
            ? key[k]!.parse(queue.get(k) as KvantAdapterValue<A>)
            : cache
              ? cache[k]
              : getKvantState(adapter, k, key[k]!),
        ]),
      ) as KvantKeyMapOutput<M>
      queue.clear()

      ;(callbackOrSchema as KvantStateWatchCallback<KvantKeyMapOutput<M>>)(cache)
    }

    const unwatch = adapter.watch((updatedKey, value) => {
      if (updatedKey === undefined) {
        Object.keys(key).forEach(k => queue.set(k, undefined))
      }
      else if (updatedKey in key) {
        queue.set(updatedKey, value)
      }
      else {
        return
      }

      if (timeoutId === null)
        timeoutId = setTimeout(flush)
    })

    return () => {
      unwatch()
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }

  const schema = isSchema<S>(callbackOrSchema) ? callbackOrSchema : undefined

  return adapter.watch((updatedKey, value) => {
    if (updatedKey !== undefined && updatedKey !== key)
      return

    if (schema)
      callback!(schema.parse(value))
    else
      (callbackOrSchema as KvantStateWatchCallback<KvantAdapterValue<A>>)(value)
  })
}
