import type { MultiWatchSources, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from 'vue'
import { watch } from 'vue'

export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}

export type IgnoredUpdater = (updater: () => void) => void

export interface WatchIgnorableReturn {
  ignoreUpdates: IgnoredUpdater
  stop: WatchStopHandle
}

export function watchSyncIgnorable<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchIgnorableReturn

export function watchSyncIgnorable<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchIgnorableReturn

export function watchSyncIgnorable<
  T extends object,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchIgnorableReturn

/**
 * Extended watch that exposes an `ignoreUpdates(updater)` function that allows to update the source without triggering effects
 *
 * Ported from [VueUse](https://github.com/vueuse/vueuse/blob/e6c1d8ed08c14726af9b17020e96f5a3bdcf8d74/packages/shared/watchIgnorable/index.ts)
 * and stripped to support only `flush: 'sync'`
 *
 * @param source
 * @param cb
 * @param options
 */
export function watchSyncIgnorable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchOptions<Immediate> = {},
): WatchIgnorableReturn {
  const watchOptions: WatchOptions<Immediate> = { ...options, flush: 'sync' }

  let ignore = false

  const ignoreUpdates: IgnoredUpdater = (updater: () => void) => {
    ignore = true
    updater()
    ignore = false
  }
  const stop: WatchStopHandle = watch(
    source,
    (...args) => {
      if (!ignore)
        cb(...args)
    },
    watchOptions,
  )

  return { stop, ignoreUpdates }
}
