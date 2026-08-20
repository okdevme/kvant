'use client'
import { useEffect } from 'react'
import { useFramework, useFrameworkCookie } from '@/lib/frameworks.client'

/** Keeps the framework cookie in sync with the framework navigation in the docs */
export function DocsNavigationSpy() {
  const [, setPreferredFrameworkId] = useFrameworkCookie()
  const framework = useFramework()

  useEffect(() => {
    setPreferredFrameworkId(framework.id)
  }, [framework.id, setPreferredFrameworkId])

  return null
}
