import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { KvantAdapter } from '../../types/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../types/schema'
import type { KvantReactAdapter, KvantReactAdapterOptions, KvantReactAdapterValue } from '../types/adapter'
import {
  createContext,
  createElement,
  useContext,
  useMemo,
} from 'react'
import { useKvantState } from '../hooks/useKvantState'

/** Adapter-bound {@link useKvantState}. */
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

export interface KvantOptionsProviderProps<A extends KvantReactAdapter | KvantAdapter> {
  /** Adapter options applied to hooks in the subtree. */
  defaultOptions: Partial<KvantReactAdapterOptions<A>>
  /**
   * Merges with parent provider options instead of replacing them.
   *
   * @default true
   */
  extend?: boolean
  children?: ReactNode
}

/** Component overriding the adapter options for its subtree. */
export type KvantOptionsProvider<A extends KvantReactAdapter | KvantAdapter> = (props: KvantOptionsProviderProps<A>) => ReactNode

/**
 * Creates state hooks bound to an adapter.
 */
/* @__NO_SIDE_EFFECTS__ */
export function defineKvantState<
  A extends KvantReactAdapter | KvantAdapter,
>(
  adapter: A,
  defaultOptions?: Partial<KvantReactAdapterOptions<A>>,
): {
  useState: UseKvantState<A>
  OptionsProvider: KvantOptionsProvider<A>
} {
  const OptionsContext = createContext<Partial<KvantReactAdapterOptions<A>>>({})

  const useState = ((
    keyOrMap: string | KvantKeyMap<KvantReactAdapterValue<A>>,
    schemaOrOptions?: KvantGenericSchema<KvantReactAdapterValue<A>> | Partial<KvantReactAdapterOptions<A>>,
    options?: Partial<KvantReactAdapterOptions<A>>,
  ) => {
    const contextOptions = useContext(OptionsContext)
    const resolvedOptions: Partial<KvantReactAdapterOptions<A>> = { ...defaultOptions, ...contextOptions }

    if (typeof keyOrMap === 'object') {
      return useKvantState(
        adapter,
        keyOrMap,
        { ...resolvedOptions, ...schemaOrOptions } as Partial<KvantReactAdapterOptions<A>>,
      )
    }

    return useKvantState(
      adapter,
      keyOrMap,
      schemaOrOptions as KvantGenericSchema<KvantReactAdapterValue<A>>,
      { ...resolvedOptions, ...options } as Partial<KvantReactAdapterOptions<A>>,
    )
  }) as UseKvantState<A>

  const OptionsProvider: KvantOptionsProvider<A> = ({ defaultOptions, extend = true, children }) => {
    const contextOptions = useContext(OptionsContext)
    const value = useMemo(
      () => extend
        ? { ...contextOptions, ...defaultOptions }
        : defaultOptions,
      [extend, contextOptions, defaultOptions],
    )
    return createElement(OptionsContext.Provider, { value }, children)
  }

  return { useState, OptionsProvider }
}
