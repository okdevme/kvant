'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Sets `data-framework` on `<html>` based on the docs section,
 * which drives the accent color via CSS variables.
 */
export function FrameworkAccent() {
  const pathname = usePathname()

  useEffect(() => {
    const match = pathname.match(/^\/docs\/(next|react-router|react|nuxt|vue-router|vue)/)
    const root = document.documentElement

    if (match) {
      root.dataset.framework = match[1]
    }
    else {
      delete root.dataset.framework
    }

    return () => {
      delete root.dataset.framework
    }
  }, [pathname])

  return null
}
