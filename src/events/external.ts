import { useEventBus as _useEventBus } from './bus'

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
