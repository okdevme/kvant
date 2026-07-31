import type { CookieOptions } from 'nuxt/app'
import type { KvantAdapterUpdateFn } from '../../types/adapter'
import type { KvantVueAdapter } from '../../vue'
import { useCookie } from 'nuxt/app'
import { computed } from 'vue'
import { decodeCookieValue, encodeCookieValue } from '../../utils/cookie'
import { mapValues } from '../../utils/object'
import { defineKvantState } from '../../vue'

export interface CookiesKvantAdapterOptions extends Pick<
  CookieOptions,
  | 'maxAge'
  | 'expires'
  | 'httpOnly'
  | 'secure'
  | 'partitioned'
  | 'domain'
  | 'path'
  | 'sameSite'
  | 'priority'
> {}

export type CookiesKvantAdapter = KvantVueAdapter<
  string,
  CookiesKvantAdapterOptions
>

export const useCookiesKvantAdapter: CookiesKvantAdapter = (keys, options) => {
  const refs = Object.fromEntries(
    keys.map(key => [
      key,
      useCookie(key, {
        ...options,
        // Disable Nuxt's default JSON encoding
        decode: value => value ? decodeCookieValue(value) : value,
        encode: value => value ? encodeCookieValue(value) : '',
      }),
    ]),
  )

  const snapshot = computed(
    () => mapValues(
      refs,
      ref => ref.value ?? undefined,
    ),
  )

  const update: KvantAdapterUpdateFn = (values) => {
    for (const key in values) {
      const ref = refs[key]
      if (!ref)
        continue

      ref.value = values[key] !== undefined ? String(values[key]) : undefined
    }
  }

  return {
    key: 'nuxt:cookies',
    snapshot,
    update,
  }
}

export const {
  useState: useCookies,
  provideOptions: provideCookiesOptions,
} = defineKvantState(useCookiesKvantAdapter)
