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
import { noopSchema } from '../../utils/schema'
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
export function useKvantState(
  adapter: KvantVueAdapter | KvantAdapter,
  keyOrMap: string | KvantKeyMap,
  schemaOrOptions?: KvantGenericSchema | Partial<Record<string, unknown>>,
  options?: Partial<Record<string, unknown>>,
): Ref<any> {
  if (typeof keyOrMap === 'object') {
    return useKvantStates(
      adapter,
      keyOrMap,
      schemaOrOptions as Partial<Record<string, unknown>> | undefined,
    )
  }

  const states = useKvantStates(
    adapter,
    {
      [keyOrMap]: (schemaOrOptions as KvantGenericSchema)
        ?? noopSchema(),
    },
    options,
  )

  return computed({
    get: () => states.value[keyOrMap],
    set: value => states.value[keyOrMap] = value,
  })
}
