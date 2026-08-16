'use client'
import type { Framework } from './frameworks'
import { useParams } from 'next/navigation'
import { defaultFramework, frameworks } from './frameworks'

export function useFramework(): Framework {
  const { slug = [] } = useParams()
  const id: string | undefined = Array.isArray(slug) ? slug[0] : slug

  return frameworks.find(f => f.id === id) ?? defaultFramework
}
