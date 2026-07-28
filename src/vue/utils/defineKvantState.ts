import type { Ref } from 'vue'
import type { KvantAdapter } from '../../defs/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../defs/schema'
import type { KvantVueAdapter, KvantVueAdapterOptions, KvantVueAdapterValue } from '../defs/adapter'
import { useKvantState } from '../composables/useKvantState'

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

export function defineKvantState<
  A extends KvantVueAdapter | KvantAdapter,
>(
  adapter: A,
  defaultOptions?: Partial<KvantVueAdapterOptions<A>>,
): UseKvantState<A> {
  return ((
    keyOrMap: string | KvantKeyMap<KvantVueAdapterValue<A>>,
    schemaOrOptions?: KvantGenericSchema<KvantVueAdapterValue<A>> | Partial<KvantVueAdapterOptions<A>>,
    options?: Partial<KvantVueAdapterOptions<A>>,
  ) => {
    if (typeof keyOrMap === 'object') {
      return useKvantState(
        adapter,
        keyOrMap,
        { ...defaultOptions, ...schemaOrOptions } as Partial<KvantVueAdapterOptions<A>>,
      )
    }

    return useKvantState(
      adapter,
      keyOrMap,
      schemaOrOptions as KvantGenericSchema<KvantVueAdapterValue<A>>,
      { ...defaultOptions, ...options } as Partial<KvantVueAdapterOptions<A>>,
    )
  }) as UseKvantState<A>
}
