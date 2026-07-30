import type { Dispatch, SetStateAction } from 'react'
import type { KvantAdapter } from '../../types/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../types/schema'
import type { KvantReactAdapter, KvantReactAdapterOptions, KvantReactAdapterValue } from '../types/adapter'
import { useCallback } from 'react'
import { noopSchema } from '../../utils/schema'
import { useKvantStates } from './useKvantStates'

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
  Dispatch<SetStateAction<KvantSchemaOutput<S>>>,
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
  Dispatch<SetStateAction<KvantKeyMapOutput<M>>>,
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
  Dispatch<SetStateAction<KvantSchemaOutput<S>>>,
] | [
  KvantKeyMapOutput<M>,
  Dispatch<SetStateAction<KvantKeyMapOutput<M>>>,
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
  const setState: Dispatch<SetStateAction<KvantSchemaOutput<S>>> = useCallback((newState) => {
    return setStates(state => ({
      [keyOrMap]: typeof newState === 'function'
        ? (newState as (value: KvantSchemaOutput<S>) => KvantSchemaOutput<S>)(state[keyOrMap]!)
        : newState,
    }))
  }, [keyOrMap, setStates])

  return [
    states[keyOrMap]!,
    setState,
  ]
}
