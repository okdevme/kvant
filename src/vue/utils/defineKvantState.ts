import type { InjectionKey, Ref } from 'vue'
import type { KvantAdapter } from '../../types/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../types/schema'
import type { KvantVueAdapter, KvantVueAdapterOptions, KvantVueAdapterValue } from '../types/adapter'
import { inject, provide } from 'vue'
import { useKvantState } from '../composables/useKvantState'

/** Adapter-bound {@link useKvantState}. */
export interface UseKvantState<A extends KvantVueAdapter | KvantAdapter> {
  <
    S extends KvantGenericSchema<KvantVueAdapterValue<A>> = KvantSchema<
      KvantVueAdapterValue<A>,
      KvantVueAdapterValue<A>,
      KvantVueAdapterValue<A>
    >,
  >(
    key: string,
    schema?: S,
    options?: Partial<KvantVueAdapterOptions<A>>,
  ): Ref<KvantSchemaOutput<S>>
  <
    M extends KvantKeyMap<KvantVueAdapterValue<A>>,
  >(
    keyMap: M,
    options?: Partial<KvantVueAdapterOptions<A>>,
  ): Ref<KvantKeyMapOutput<M>>
}

export interface KvantOptionsProviderOptions {
  /**
   * Merges with parent-provided options instead of replacing them.
   *
   * @default true
   */
  extend?: boolean
}

/** Provides default adapter options to composables in the component subtree. */
export type KvantOptionsProvider<A extends KvantVueAdapter | KvantAdapter>
  = (defaultOptions: Partial<KvantVueAdapterOptions<A>>, options?: KvantOptionsProviderOptions) => void

/**
 * Creates composables bound to an adapter.
 */
/* @__NO_SIDE_EFFECTS__ */
export function defineKvantState<
  A extends KvantVueAdapter | KvantAdapter,
>(
  adapter: A,
  defaultOptions?: Partial<KvantVueAdapterOptions<A>>,
): {
  useState: UseKvantState<A>
  provideOptions: KvantOptionsProvider<A>
} {
  const optionsContextSymbol = Symbol('defineKvantState.optionsContext') as InjectionKey<Partial<KvantVueAdapterOptions<A>>>

  const useState = ((
    keyOrMap: string | KvantKeyMap<KvantVueAdapterValue<A>>,
    schemaOrOptions?: KvantGenericSchema<KvantVueAdapterValue<A>> | Partial<KvantVueAdapterOptions<A>>,
    options?: Partial<KvantVueAdapterOptions<A>>,
  ) => {
    const contextOptions = inject(optionsContextSymbol, {})
    const resolvedOptions: Partial<KvantVueAdapterOptions<A>> = { ...defaultOptions, ...contextOptions }

    if (typeof keyOrMap === 'object') {
      return useKvantState(
        adapter,
        keyOrMap,
        { ...resolvedOptions, ...schemaOrOptions } as Partial<KvantVueAdapterOptions<A>>,
      )
    }

    return useKvantState(
      adapter,
      keyOrMap,
      schemaOrOptions as KvantGenericSchema<KvantVueAdapterValue<A>>,
      { ...resolvedOptions, ...options } as Partial<KvantVueAdapterOptions<A>>,
    )
  }) as UseKvantState<A>

  const provideOptions: KvantOptionsProvider<A> = (defaultOptions, options = {}) => {
    const { extend = true } = options
    provide(
      optionsContextSymbol,
      extend
        ? { ...inject(optionsContextSymbol, {}), ...defaultOptions }
        : defaultOptions,
    )
  }

  return { useState, provideOptions }
}
