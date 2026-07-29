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
import { useKvantState } from '../hooks/useKvantState'

export interface UseKvantState<A extends KvantReactAdapter | KvantAdapter> {
  <
    S extends KvantGenericSchema<KvantReactAdapterValue<A>> = KvantSchema<
      KvantReactAdapterValue<A>,
      KvantReactAdapterValue<A>,
      KvantReactAdapterValue<A>
    >,
  >(
    key: string,
    schema?: S,
    options?: Partial<KvantReactAdapterOptions<A>>,
  ): [
    KvantSchemaOutput<S>,
    Dispatch<SetStateAction<KvantSchemaOutput<S>>>,
  ]
  <
    M extends KvantKeyMap<KvantReactAdapterValue<A>>,
  >(
    keyMap: M,
    options?: Partial<KvantReactAdapterOptions<A>>,
  ): [
    KvantKeyMapOutput<M>,
    Dispatch<SetStateAction<KvantKeyMapOutput<M>>>,
  ]
}

export function defineKvantState<
  A extends KvantReactAdapter | KvantAdapter,
>(
  adapter: A,
  defaultOptions?: Partial<KvantReactAdapterOptions<A>>,
): UseKvantState<A> {
  return ((
    keyOrMap: string | KvantKeyMap<KvantReactAdapterValue<A>>,
    schemaOrOptions?: KvantGenericSchema<KvantReactAdapterValue<A>> | Partial<KvantReactAdapterOptions<A>>,
    options?: Partial<KvantReactAdapterOptions<A>>,
  ) => {
    if (typeof keyOrMap === 'object') {
      return useKvantState(
        adapter,
        keyOrMap,
        { ...defaultOptions, ...schemaOrOptions } as Partial<KvantReactAdapterOptions<A>>,
      )
    }

    return useKvantState(
      adapter,
      keyOrMap,
      schemaOrOptions as KvantGenericSchema<KvantReactAdapterValue<A>>,
      { ...defaultOptions, ...options } as Partial<KvantReactAdapterOptions<A>>,
    )
  }) as UseKvantState<A>
}
