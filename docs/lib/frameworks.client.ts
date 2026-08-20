'use client'
import type { Framework } from './frameworks'
import { useCookies } from 'kvant/react'
import { useParams } from 'next/navigation'
import { defaultFramework, frameworkCookieName, frameworkCookieSchema, getFramework } from './frameworks'

export function useFrameworkCookie() {
  return useCookies(frameworkCookieName, frameworkCookieSchema, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: true,
  })
}

export function useFramework(): Framework {
  const [preferredFrameworkId] = useFrameworkCookie()
  const { slug = [] } = useParams()
  const id: string | undefined = Array.isArray(slug) ? slug[0] : slug

  return getFramework(id) ?? getFramework(preferredFrameworkId) ?? defaultFramework
}
