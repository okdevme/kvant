import type { Ref } from 'vue'
import type { KvantAdapter } from '../../types/adapter'
import type {
  KvantGenericSchema,
  KvantKeyMap,
  KvantKeyMapOutput,
  KvantSchema,
  KvantSchemaOutput,
} from '../../types/schema'
import type { KvantVueAdapter, KvantVueAdapterOptions, KvantVueAdapterValue } from '../types/adapter'
import { computed } from 'vue'
import { noopSchema } from '../../core'
import { useKvantStates } from './useKvantStates'

export function useKvantState<
  A extends KvantVueAdapter | KvantAdapter,
  S extends KvantGenericSchema<KvantVueAdapterValue<A>> = KvantSchema<
    KvantVueAdapterValue<A>,
    KvantVueAdapterValue<A>,
    KvantVueAdapterValue<A>
  >,
>(
  adapter: A,
  key: string,
  schema?: S,
  options?: Partial<KvantVueAdapterOptions<A>>,
): Ref<KvantSchemaOutput<S>>
export function useKvantState<
  A extends KvantVueAdapter | KvantAdapter,
  M extends KvantKeyMap<KvantVueAdapterValue<A>>,
>(
  adapter: A,
  keyMap: M,
  options?: Partial<KvantVueAdapterOptions<A>>,
): Ref<KvantKeyMapOutput<M>>
export function useKvantState<
  A extends KvantVueAdapter | KvantAdapter,
  S extends KvantGenericSchema<KvantVueAdapterValue<A>>,
  M extends KvantKeyMap<KvantVueAdapterValue<A>>,
>(
  adapter: KvantVueAdapter | KvantAdapter,
  keyOrMap: string | M,
  schemaOrOptions?: S | Partial<KvantVueAdapterOptions<A>>,
  options?: Partial<KvantVueAdapterOptions<A>>,
): Ref<KvantSchemaOutput<S>> | Ref<KvantKeyMapOutput<M>> {
  if (typeof keyOrMap === 'object') {
    return useKvantStates(
      adapter,
      keyOrMap,
      schemaOrOptions as Partial<KvantVueAdapterOptions<A>> | undefined,
    )
  }

  const states = useKvantStates(
    adapter,
    {
      [keyOrMap]: (schemaOrOptions as S)
        ?? noopSchema<KvantVueAdapterValue<A>>(),
    },
    options,
  )

  return computed<KvantSchemaOutput<S>>({
    get: () => states.value[keyOrMap]!,
    set: value => states.value[keyOrMap] = value,
  })
}
