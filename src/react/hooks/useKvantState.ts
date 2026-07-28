import type { SetStateAction } from 'react'
import type { KvantAdapter } from '../../defs/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../defs/schema'
import type { KvantReactAdapter, KvantReactAdapterOptions, KvantReactAdapterValue } from '../defs/adapter'
import type { KvantSetStates } from './useKvantStates'
import { useCallback } from 'react'
import { useKvantStates } from './useKvantStates'

export type KvantSetState<
  A extends KvantReactAdapter | KvantAdapter,
  S extends KvantGenericSchema<KvantReactAdapterValue<A>>,
> = (
  state: SetStateAction<KvantSchemaOutput<S>>,
  options?: Partial<KvantReactAdapterOptions<A>>,
) => void

function noopSchema<T>(): KvantSchema<T, T, T> {
  return {
    parse: value => value,
    encode: value => value,
  }
}

export function useKvantState<
  A extends KvantReactAdapter | KvantAdapter,
  S extends KvantGenericSchema<KvantReactAdapterValue<A>> = KvantSchema<
    KvantReactAdapterValue<A>,
    KvantReactAdapterValue<A>,
    KvantReactAdapterValue<A>
  >,
>(
  adapter: A,
  key: string,
  schema?: S,
  options?: Partial<KvantReactAdapterOptions<A>>,
): [
  KvantSchemaOutput<S>,
  KvantSetState<A, S>,
]
export function useKvantState<
  A extends KvantReactAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantReactAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options?: Partial<KvantReactAdapterOptions<A>>,
): [
  KvantKeyMapOutput<M>,
  KvantSetStates<A, M>,
]
export function useKvantState<
  A extends KvantReactAdapter | KvantAdapter,
  S extends KvantGenericSchema<KvantReactAdapterValue<A>>,
  M extends KvantKeyMap<KvantReactAdapterValue<A>>,
>(
  adapter: KvantReactAdapter | KvantAdapter,
  keyOrMap: string | M,
  schemaOrOptions?: S | Partial<KvantReactAdapterOptions<A>>,
  options?: Partial<KvantReactAdapterOptions<A>>,
): [
  KvantSchemaOutput<S>,
  KvantSetState<A, S>,
] | [
  KvantKeyMapOutput<M>,
  KvantSetStates<A, M>,
] {
  if (typeof keyOrMap === 'object') {
    return useKvantStates(
      adapter,
      keyOrMap,
      schemaOrOptions as Partial<KvantReactAdapterOptions<A>> | undefined,
    )
  }

  const [states, setStates] = useKvantStates(
    adapter,
    {
      [keyOrMap]: (schemaOrOptions as S)
        ?? noopSchema<KvantReactAdapterValue<A>>(),
    },
    options,
  )
  const setState: KvantSetState<A, S> = useCallback((newState, callOptions) => {
    return setStates(state => ({
      [keyOrMap]: typeof newState === 'function'
        ? (newState as (value: KvantSchemaOutput<S>) => KvantSchemaOutput<S>)(state[keyOrMap]!)
        : newState,
    }), callOptions)
  }, [keyOrMap, setStates])

  return [
    states[keyOrMap]!,
    setState,
  ]
}
