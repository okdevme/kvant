import { useEventBus as _useEventBus } from './bus'

/**
 * Returns a shared event bus for the given key.
 * Listeners are shared across all callers using the same key.
 */
export const useEventBus: typeof _useEventBus
  = key => _useEventBus(`external:${key}`)

export type {
  EventBusEvents,
  EventBusIdentifier,
  EventBusKey,
  EventBusListener,
  UseEventBusReturn,
} from './bus'
export * from './hook'
